import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { prisma } from "@repo/db";

const trustedOrigins = (process.env.TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Our rule: a person belongs to exactly one company.
// Delete this helper and its two call sites to allow several.
async function assertNoMembership(userId: string) {
  const existing = await prisma.member.count({ where: { userId } });
  if (existing > 0) {
    throw new APIError("BAD_REQUEST", {
      message: "User already belongs to a company",
    });
  }
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  advanced: {
    crossSubDomainCookies: process.env.COOKIE_DOMAIN
      ? { enabled: true, domain: process.env.COOKIE_DOMAIN }
      : { enabled: false },
  },
  emailAndPassword: { enabled: true },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const membership = await prisma.member.findFirst({
            where: { userId: session.userId },
            select: { organizationId: true },
          });
          return {
            data: {
              ...session,
              activeOrganizationId: membership?.organizationId ?? null,
            },
          };
        },
      },
    },
  },
  plugins: [
    organization({
      invitationExpiresIn: 60 * 60 * 24 * 7,
      cancelPendingInvitationsOnReInvite: true,
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.PORTAL_URL}/accept-invitation/${data.id}`;
        // Placeholder until the notifications module exists.
        if (process.env.NODE_ENV !== "production") {
          console.log(`Invitation for ${data.email}: ${inviteLink}`);
        }
      },
      organizationHooks: {
        beforeCreateOrganization: async ({ user }) => {
          await assertNoMembership(user.id);
        },
        beforeAcceptInvitation: async ({ user }) => {
          await assertNoMembership(user.id);
        },
      },
    }),
  ],
});
