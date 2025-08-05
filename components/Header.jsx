import { SignedOut, SignedIn, SignInButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { PenBox } from 'lucide-react'
import UserMenu from './user-menu'
import { checkUser } from '@/lib/check-user'

const Header = async () => {
    await checkUser();
  return (
    <header className='container max-auto'>
        <nav className='flex items-center justify-between py-6 px-8'>
            <Link href="/">
                <Image src="/logo2.png" width={200} height={56} alt="zcrum-logo" className='h-10 object-contain w-auto' />
            </Link> 
        <div className='flex items-center gap-4'>
            <Link href= '/project/create'>
                <Button variant="destructive" className='flex items-center gap-2'>
                    <PenBox size={20} />
                    <span>Create project</span>
                </Button>
            </Link>

            <SignedOut>
                <SignInButton forceRedirectUrl='/onboarding'>
                    <Button variant={"outline"}>Login</Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserMenu/>
            </SignedIn>
        </div>
        </nav>
    </header>
   

  )
}

export default Header