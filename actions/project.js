"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(formData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const name = formData.get("name");
  const key = formData.get("key");
  const description = formData.get("description");
  const orgId = formData.get("orgId");

  if (!orgId) {
    throw new Error("Organization not found");
  }

  const { data: membership } = await clerkClient.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  const userMembership = membership.find(
    (member) => member.publicUserData.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("User does not have permission to create a project");
  }

  try {
    const project = await db.project.create({
      data: { name, key, description, organizationId: orgId },
    });

    return project;
  } catch (error) {
    throw new Error("Error creating project: " + error.message);
  }
}
