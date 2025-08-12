"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";


export async function createProject(){
    const {userId , orgId} =  auth();

    if(!userId){
        throw new Error("User not authenticated");
    }

    if(!orgId){
        throw new Error("Organization not found");
    }

    const { data: membership } = await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: orgId,
    });

    const userMembership = membership.find(
        (member) => member.publicUserData.userId === userId
    );

    if(!userMembership || userMembership.role !== "org:admin"){
        throw new Error("User does not have permission to create a project");
    }

    try {
        const project = await db.project.create({
            data:{
                name: data.name,
                key: data.key,
                description: data.description,
                organizationId: orgId, 
            },
        });

        return project;
    } catch (error) {
        throw new Error("Error creating project: " + error.message);
    }
}