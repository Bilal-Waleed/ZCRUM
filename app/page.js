import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="container mx-auto py-25 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title flex flex-col pb-6">
          Streamline your workflow <br />
          <span className="flex mx-auto gap-3 mt-4 sm:gap-4 items-center">
            with{" "}
            <Image
              src="/logo2.png"
              width={400}
              height={80}
              alt="zcrum-logo"
              className="h-14 sm:h-24 object-contain w-auto"
            />
          </span>
        </h1>
        <p className="text-xl font-gray-300 mb-10 max-w-3xl mx-auto">
          Empower your team with a unified platform for project management, collaboration, and task management Solution.</p>
        <Link href="/onboarding">
          <Button size={"lg"} className={"mr-2"}>Get Started <ChevronRight size={18} className="ml-1"/></Button>
        </Link>
        <Link href="#features">
          <Button size={"lg"} className={"mr-4"} variant={"outline"}>Learn More
            <ChevronRight size={18} className="ml-1"/></Button>
        </Link>

      </section>

    </div>
  );
}

