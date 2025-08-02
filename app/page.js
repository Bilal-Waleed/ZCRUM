import CampanyCarousel from "@/components/campanyCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {  BarChart, Calendar, ChevronRight, Layout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Intuitive Kanban Boards",
    description:
      "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
    icon: Layout,
  },
  {
    title: "Powerful Sprint Planning",
    description:
      "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
    icon: Calendar,
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Gain insights into your team's performance with detailed, customizable reports and analytics.",
    icon: BarChart,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="container mx-auto py-25 lg:mt-5 lg:mb-12 text-center">
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
          <Button size={"lg"} className={"mr-4"}>Get Started <ChevronRight size={18}/></Button>
        </Link>
        <Link href="#features">
          <Button size={"lg"} className={"mr-4"} variant={"outline"}>Learn More
            <ChevronRight size={18} className="ml-1"/></Button>
        </Link>

      </section>

      <section className="py-20 bg-gray-900 px-5" id="features">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              return (
                <Card key={index} className={"bg-gray-800"}>
                  <CardContent className={"pt-6"}>
                    <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                    <h4 className="text-2xl font-bold mb-2">{feature.title}</h4>
                    <p className=" text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Trusted by Industry Leaders
          </h3>
          <CampanyCarousel/>
        </div>
      </section>

    </div>
  );
}

