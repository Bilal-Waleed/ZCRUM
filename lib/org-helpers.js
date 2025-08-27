// lib/org-helpers.ts
import { clerkClient } from "@clerk/nextjs/server";

export async function verifyOrgMembership(userId, orgId) {
  const { data: memberships } =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const membership = memberships.find(
    (m) => m.publicUserData.userId === userId
  );

  if (!membership) {
    throw new Error("User not part of this organization");
  }

  return {
    orgId: membership.organization.id,
    role: membership.role, 
  };
}
