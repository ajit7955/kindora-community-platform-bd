
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "Authentication configuration is missing."
    });
  }

  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please sign in to continue."
    });
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded !== "object" ||
      !decoded.id ||
      !decoded.email
    ) {
      return res.status(401).json({
        message: "Invalid authentication token."
      });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Your session is invalid or expired."
    });
  }
}
