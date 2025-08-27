"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { BarLoader } from "react-spinners";

const UserLoading = () => {
    const {isLoaded} = useOrganization();
    const { isLoaded: isUserLoaded} = useUser();

    if(!isLoaded || !isUserLoaded) {
        return <BarLoader className="mb-4" color="#36d7b7" height={10} width={"100%"} />
    } else <></>
}

export default UserLoading;