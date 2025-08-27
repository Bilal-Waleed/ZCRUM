"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createSprint(projectId, data) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const orgId = project.organizationId;

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

export async function updateSprintStatus(sprintId, newStatus) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const sprint = await db.sprint.findUnique({
    where: { id: sprintId },
    include: { project: true },
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }

  const orgId = sprint.project.organizationId;

  const { data: memberships } =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userMembership = memberships.find(
    (m) => m.publicUserData.userId === userId
  );

  if (!userMembership) {
    throw new Error("User does not have permission to update this sprint");
  }

  const role = userMembership.role;
  if (role !== "org:admin") {
    throw new Error("Only admins can update sprint status");
  }

  const now = new Date();
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);

  if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
    throw new Error("Sprint can only be started within its start and end dates");
  }

  if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
    throw new Error("Only active sprints can be completed");
  }

  const updatedSprint = await db.sprint.update({
    where: { id: sprintId },
    data: { status: newStatus },
  });

  return { success: true, sprint: updatedSprint };
}