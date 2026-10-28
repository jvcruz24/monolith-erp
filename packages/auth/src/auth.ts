import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@repo/db';

const trustedOrigins = (process.env.TRUSTED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  advanced: {
    crossSubDomainCookies: process.env.COOKIE_DOMAIN
      ? { enabled: true, domain: process.env.COOKIE_DOMAIN }
      : { enabled: false },
  },
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      companyId: { type: 'string', required: false, input: false },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'member',
        input: false,
      },
    },
  },
});
