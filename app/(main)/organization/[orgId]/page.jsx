
import { getOrganization } from '@/actions/organization';
import OrgSwitcher from '@/components/org-switcher';
import React from 'react'
import ProjectList from './_components/project-list';
import UserIssues from './_components/user-issues';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

const Organization = async ({ params }) => {
  const { orgId } = await params; 
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // console.log(orgId);
  const organization = await getOrganization(orgId);

  if (!organization) {
    return <div className="container p-10">Organization not found</div>;
  }

  return (
    <div className="container mx-auto p-10">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title pb-2">
          {organization.name}&rsquo;s Projects
        </h1>
        <OrgSwitcher />
      </div>

      <div className="mb-4">
        <ProjectList orgId = {organization.id} />
      </div>
      <div className="mt-8">
        <UserIssues userId={userId} />
      </div>
    </div>
  );
};

export default Organization;
