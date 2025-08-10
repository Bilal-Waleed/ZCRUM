"use client";

import OrgSwitcher from "@/components/org-switcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const createProjectPage = () => {
    const { isLoaded: isOrgLoaded, membership } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    const [ isAdmin , setIsAdmin ] = useState(false);

    useEffect(() => {
        if (isOrgLoaded && membership && isUserLoaded) {
            setIsAdmin(membership.role === "org:admin");
        }
    }, [isOrgLoaded, membership, isUserLoaded]);

    if (!isOrgLoaded || !isUserLoaded) {
        return null;
    }

    if (!isAdmin) {
        return( 
        <div >
            <span>You do not have permission to create a project.</span>
            <OrgSwitcher/>
        </div>
        );
    }

  return (
    <div>project</div>
  )
}

export default createProjectPage;