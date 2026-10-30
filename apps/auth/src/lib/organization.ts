import { authClient } from "./auth-client";

export async function activateFirstOrganization() {
  const { data: organizations } = await authClient.organization.list();
  if (!organizations?.length) return false;
  await authClient.organization.setActive({
    organizationId: organizations[0].id,
  });
  return true;
}
