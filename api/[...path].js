// Catch-all serverless function — handles ALL /api/* requests
// Vercel automatically routes /api/anything here without a rewrite rule
import app from "../Backend/server.js";

export default app;
