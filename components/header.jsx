import { SignedOut, SignedIn, SignInButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { PenBox } from 'lucide-react'
import UserMenu from './user-menu'
import { checkUser } from '@/lib/check-user'
import UserLoading from './user-loading'

export const Header = async () => {
  await checkUser();
  return (
    <header className="container mx-auto px-3">
      <nav className="flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo2.png"
            width={160}
            height={40}
            alt="zcrum-logo"
            className="h-7 sm:h-10 object-contain w-auto"
          />
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/project/create">
            <Button
              variant="destructive"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
            >
            <PenBox className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              <span>Create Project</span>
            </Button>
          </Link>

          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button
                variant="outline"
                className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
              >
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="scale-90 sm:scale-100">
              <UserMenu />
            </div>
          </SignedIn>
        </div>
      </nav>

      <UserLoading />
    </header>
  );
};
