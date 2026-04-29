import dotenv from 'dotenv';
dotenv.config();

const requiredEnv = [
  'MONGO_URI',
  'JWT_SECRET',
  'NODE_ENV',
  'ACCESS_TOKEN_SECRET',
  'ACCESS_TOKEN_EXPIRY',
  'REFRESH_TOKEN_SECRET',
  'REFRESH_TOKEN_EXPIRY',
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is not set.`);
  }
});

export const config = Object.fromEntries(
  requiredEnv.map((key) => [key, process.env[key]])
);
