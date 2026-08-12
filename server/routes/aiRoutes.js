import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Ticket from '../models/Ticket.js';

const router = express.Router();

/*
 * Local fallback.
 *
 * This makes Smart Triage work even when:
 * - Gemini API key is missing
 * - Gemini API is unavailable
 * - Free-tier limit is reached
 */
const keywordTriage = (text) => {
  const t = text.toLowerCase();

  const rules = [
    {
      category: 'Billing',
      words: [
        'refund',
        'charged',
        'payment',
        'invoice',
        'billing',
        'price',
        'money'
      ]
    },
    {
      category: 'Technical',
      words: [
        'error',
        'bug',
        'crash',
        'broken',
        'not working',
        'server',
        'api'
      ]
    },
    {
      category: 'Account',
      words: [
        'login',
        'password',
        'account',
        'sign in',
        'verification'
      ]
    },
    {
      category: 'Order',
      words: [
        'order',
        'delivery',
        'shipment',
        'tracking',
        'package'
      ]
    }
  ];

  const category =
    rules.find((rule) =>
      rule.words.some((word) => t.includes(word))
    )?.category || 'General';

  let priority = 'Medium';

  if (
    /urgent|critical|fraud|security|lost|down/i.test(t)
  ) {
    priority = 'Urgent';
  } else if (
    /error|refund|blocked|broken|failed|late/i.test(t)
  ) {
    priority = 'High';
  } else if (
    /question|how|information/i.test(t)
  ) {
    priority = 'Low';
  }

  let suggested_reply;

  if (category === 'Billing') {
    suggested_reply =
      'Thanks for reaching out. We are reviewing the billing details and will verify the transaction before confirming the next step.';
  } else if (category === 'Technical') {
    suggested_reply =
      'Thanks for reporting this. We are checking the issue and the affected workflow. If possible, please share the exact error message or screenshot.';
  } else if (category === 'Account') {
    suggested_reply =
      'Thanks for contacting support. We will review your account issue and help you restore access as quickly as possible.';
  } else if (category === 'Order') {
    suggested_reply =
      'Thanks for contacting us. We are checking your order details and will provide an update shortly.';
  } else {
    suggested_reply =
      'Thanks for contacting support. We have received your request and will review the details shortly.';
  }

  return {
    category,
    priority,
    suggested_reply,
    reasoning: 'Classification generated using local support rules.',
    source: 'fallback'
  };
};


/*
 * POST /api/ai/triage
 *
 * Uses Gemini when available.
 * Falls back to local rules if Gemini isn't available.
 */
router.post('/triage', async (req, res, next) => {
  try {
    const { ticket_id } = req.body;

    // Find ticket
    const ticket = await Ticket.findOne({ ticket_id });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const text = `
Subject: ${ticket.subject}

Description:
${ticket.description}
`.trim();


    /*
     * If Gemini key isn't configured,
     * use local fallback.
     */
    if (!process.env.GEMINI_API_KEY) {
      return res.json(keywordTriage(text));
    }


    /*
     * Initialize Gemini.
     */
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash'
    });


    /*
     * Ask Gemini for structured JSON.
     */
    const prompt = `
You are a customer support triage assistant.

Analyze the support ticket below.

Return ONLY valid JSON.

The JSON must contain:

{
  "category": "General | Billing | Technical | Account | Order | Bug",
  "priority": "Low | Medium | High | Urgent",
  "suggested_reply": "A short professional response to the customer",
  "reasoning": "One short sentence explaining the classification"
}

Ticket:

${text}
`;


    const result = await model.generateContent(prompt);

    const response = result.response;
    const rawText = response.text().trim();


    /*
     * Remove markdown code fences if Gemini
     * happens to return them.
     */
    const cleanedText = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();


    let parsed;

    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(
        'Gemini returned invalid JSON:',
        rawText
      );

      return res.json(keywordTriage(text));
    }


    /*
     * Send Gemini result to frontend.
     */
    return res.json({
      ...parsed,
      source: 'gemini'
    });

  } catch (err) {

    console.error(
      'Gemini API error:',
      err.message
    );

    /*
     * If Gemini fails because of:
     * - quota
     * - invalid key
     * - temporary API failure
     *
     * keep CRM functional using fallback.
     */
    try {
      const { ticket_id } = req.body;

      const ticket = await Ticket.findOne({
        ticket_id
      });

      if (ticket) {
        const text =
          `${ticket.subject}\n${ticket.description}`;

        return res.json(
          keywordTriage(text)
        );
      }

    } catch (fallbackError) {
      console.error(
        'Fallback failed:',
        fallbackError.message
      );
    }

    next(err);
  }
});

export default router;