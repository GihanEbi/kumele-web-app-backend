import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), `.env`) });

export const systemConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION || "100d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  emailConfig: {
    domain: process.env.EMAIL_DOMAIN || "",
    apiKey: process.env.EMAIL_API_KEY,
    email_sender_domain_email:
      process.env.EMAIL_SENDER_DOMAIN_EMAIL || "gihanpiumal7@gmail.com",
  },
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
};
