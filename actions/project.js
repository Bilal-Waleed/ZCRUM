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

  const { data: membership } = await clerkClient().organizations.getOrganizationMembershipList({
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

export async function getProjects(orgId) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  })

  if(!user){
    throw new Error("User not found");
  }

  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt : "desc" },
  });

  return projects;
}

export async function deleteProject(projectId) {
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

  const { data: membership } = await clerkClient().organizations.getOrganizationMembershipList({
    organizationId: project.organizationId,
  });

  const userMembership = membership.find(
    (member) => member.publicUserData.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("User does not have permission to delete this project");
  }

  await db.project.delete({
    where: { id: projectId },
  });

  return { success: true };
}

export async function getProject(projectId) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const { data: membership } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: project.organizationId,
    });

  const userMembership = membership.find(
    (m) => m.publicUserData.userId === userId
  );

  if (!userMembership) {
    throw new Error("User does not have access to this project");
  }

  return project;
}
