import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  ticket_id: { type: String, required: true, index: true },
  note_text: { type: String, required: true, trim: true },
  author: { type: String, default: "Support Agent" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Note", noteSchema);
