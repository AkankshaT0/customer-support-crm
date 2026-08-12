export function notFound(req, res) {
  res
    .status(404)
    .json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === 11000)
    return res
      .status(409)
      .json({ success: false, message: "Duplicate ticket ID. Please retry." });
  if (err.name === "ValidationError")
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors)
        .map((e) => e.message)
        .join(", "),
    });
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Internal server error" });
}
