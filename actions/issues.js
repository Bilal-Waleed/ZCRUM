"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { verifyOrgMembership } from "@/lib/org-helpers";

export async function getIssuesForSprint(sprintId) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const sprint = await db.sprint.findUnique({
    where: { id: sprintId },
    include: { project: true },
  });

  if (!sprint) throw new Error("Sprint not found");

  await verifyOrgMembership(userId, sprint.project.organizationId);

  return db.issue.findMany({
    where: { sprintId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: { assignee: true, reporter: true },
  });
}

export async function createIssue(projectId, data) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Project not found");

  await verifyOrgMembership(userId, project.organizationId);

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });

  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  return db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      projectId,
      sprintId: data.sprintId,
      reporterId: user.id,
      assigneeId: data.assigneeId || null,
      order: newOrder,
    },
    include: { assignee: true, reporter: true },
  });
}

export async function updateIssueOrder(updatedIssues) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  if (!updatedIssues.length) return { success: true };

  const firstIssue = await db.issue.findUnique({
    where: { id: updatedIssues[0].id },
    include: { project: true },
  });

  if (!firstIssue) throw new Error("Invalid issues");

  await verifyOrgMembership(userId, firstIssue.project.organizationId);

  await db.$transaction(async (prisma) => {
    for (const issue of updatedIssues) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: { status: issue.status, order: issue.order },
      });
    }
  });

  return { success: true };
}

export async function deleteIssue(issueId) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });
  if (!issue) throw new Error("Issue not found");

  await verifyOrgMembership(userId, issue.project.organizationId);

  if (issue.reporterId !== user.id && !issue.project.adminIds.includes(user.id)) {
    throw new Error("You don't have permission to delete this issue");
  }

  await db.issue.delete({ where: { id: issueId } });
  return { success: true };
}

export async function updateIssue(issueId, data) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) throw new Error("Issue not found");

  await verifyOrgMembership(userId, issue.project.organizationId);

  return db.issue.update({
    where: { id: issueId },
    data: {
      status: data.status,
      priority: data.priority,
    },
    include: { assignee: true, reporter: true },
  });
}

export async function getUserIssues(userId) {
  const { userId: authUserId } = auth();
  if (!authUserId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const issues = await db.issue.findMany({
    where: {
      OR: [{ assigneeId: user.id }, { reporterId: user.id }],
    },
    include: {
      project: true,
      assignee: true,
      reporter: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const authorizedIssues = [];
  for (const issue of issues) {
    try {
      await verifyOrgMembership(authUserId, issue.project.organizationId);
      authorizedIssues.push(issue);
    } catch (err) {
        console.warn(`Skipping issue ${issue.id}: not authorized`);
    }
  }

  return authorizedIssues;
}