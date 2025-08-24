"use client";
import { OrganizationList } from '@clerk/nextjs';

const Onboarding = () => {
  return (
    <div className="flex justify-center items-center pt-14">
      <OrganizationList
        hidePersonal
        afterSelectOrganizationUrl="/organization/:slug"
        afterCreateOrganizationUrl="/organization/:slug"
      />
    </div>
  );
};

export default Onboarding;
