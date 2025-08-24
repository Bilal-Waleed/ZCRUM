"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createSprint(projectId, data) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // project find karo pehle
  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const orgId = project.organizationId;

  // user ka membership check karo
  const { data: memberships } = await clerkClient.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  const userMembership = memberships.find(
    (member) => member.publicUserData.userId === userId
  );

  if (!userMembership) {
    throw new Error("User does not have permission to create a sprint in this project");
  }

  return await db.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED",
      projectId,
    },
  });
}
