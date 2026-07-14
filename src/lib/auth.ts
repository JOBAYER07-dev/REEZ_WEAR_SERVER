import dotenv from 'dotenv';
dotenv.config();

import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';
import { admin } from 'better-auth/plugins';

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();

export { db };

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [admin()],
  trustedOrigins: [process.env.CLIENT_URL as string],
});
