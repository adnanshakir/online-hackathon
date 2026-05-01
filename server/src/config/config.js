import dotenv from 'dotenv';
dotenv.config();

const requiredEnv = [
  'MONGO_URI',
  'NODE_ENV',
  'ACCESS_TOKEN_SECRET',
  'ACCESS_TOKEN_EXPIRY',
  'REFRESH_TOKEN_SECRET',
  'REFRESH_TOKEN_EXPIRY',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'FRONTEND_URL',
  'MAIL_CLIENT_ID',
  'MAIL_CLIENT_SECRET',
  'MAIL_REFRESH_TOKEN',
  'MAIL_USER',
  'GEMINI_API_KEY',
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is not set.`);
  }
});

export const config = Object.fromEntries(
  requiredEnv.map((key) => [key, process.env[key]])
);
