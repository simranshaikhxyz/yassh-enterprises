import jwt from "jsonwebtoken";

/**
 * Generates a signed JSON Web Token for authenticated users.
 * @param {string|Object} id - The MongoDB user ID (_id)
 * @returns {string} - Signed JWT token string
 */
const generateToken = (id) => {
  // 🛡️ Guard 1: Verify environment secret key exists
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from environment variables.");
  }

  // 🛡️ Guard 2: Ensure ID is converted to a plain string representation
  const userId = typeof id === "object" ? id.toString() : id;

  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_EXPIRE || "7d", // Default to 7 days for better security
    }
  );
};

export default generateToken;