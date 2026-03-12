// Environment Variable Validation
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}\n` +
      `Please check your .env file and ensure all required variables are set.`
  );
}

// Validate JWT_SECRET length
if (process.env.JWT_SECRET.length < 32) {
  console.warn(
    "⚠️  WARNING: JWT_SECRET is less than 32 characters. This is not secure for production. Update it now."
  );
}

// Validate NODE_ENV
const validEnvs = ["development", "production", "staging"];
if (process.env.NODE_ENV && !validEnvs.includes(process.env.NODE_ENV)) {
  throw new Error(
    `Invalid NODE_ENV: ${process.env.NODE_ENV}. Must be one of: ${validEnvs.join(", ")}`
  );
}

console.log(`✅ Environment validation passed (NODE_ENV: ${process.env.NODE_ENV || "development"})`);
