import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const createClient = (baseURL: string) =>
  createAuthClient({
    baseURL,
    fetchOptions: { credentials: "include" },
    plugins: [organizationClient()],
  });
