"use client"
import { UserButton } from "@clerk/nextjs";
import { ChartNoAxesGantt } from "lucide-react";

const UserMenu = () => {
  return (
    <UserButton 
    appearance={{
        elements: {
            avatarBox: "h-20 w-20",
        },
    }}>
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Organization"
          labelIcon={<ChartNoAxesGantt size={15}/>}
          href="/onboarding"
        />
        <UserButton.Action label="manageAccount"/>
      </UserButton.MenuItems>
    </UserButton>
  )
}

export default UserMenu;