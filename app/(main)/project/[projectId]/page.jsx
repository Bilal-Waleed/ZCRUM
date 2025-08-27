import { getProject } from '@/actions/project';
import { notFound } from 'next/navigation';
import React from 'react'
import SprintCreationForm from '../_components/create-sprint';
import SprintBoard from '../_components/sprint-board';

const projectPage = async ({params}) => {
    const {projectId} = params;
    let project;
    try {
        project = await getProject(projectId);
    } catch (error) {
        notFound();
    }

    if (!project) {
        notFound();
    }
  return (
    <div className='container mx-auto '>
        <SprintCreationForm
        projectTitle = {project.name}
        projectId = {projectId}
        projectKey = {project.key}
        sprintKey= {project.sprints?.length +1}
        />
        {project.sprints.length>0?(
            <SprintBoard
            sprints={project.sprints}
            projectId = {projectId}
            orgId= {project.organizationId}
            />
        ):(
            <div>Create a sprint from button above.</div>
        )}
    </div>
  )
}

export default projectPage