"use client";

import OrgSwitcher from "@/components/org-switcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { createProject } from "@/actions/project";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateProjectPage = () => {
  const { isLoaded: isOrgLoaded, membership, organization } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (isOrgLoaded && membership && isUserLoaded) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, membership, isUserLoaded]);

  const { data: project, loading, error, fn: createProjectFn } = useFetch(createProject);

  useEffect(() => {
    if (project) {
      toast.success("Project created successfully!");
      router.push(`/project/${project.id}`);
    }
  }, [project]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  const onSubmit = async (values) => {
    console.log("Form Values ✅", values);
  const fd = new FormData();
  fd.append("name", values.name);
  fd.append("key", values.key);
  fd.append("description", values.description);
  fd.append("orgId", organization?.id);

  createProjectFn(fd); 
};

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center ">
        <span className="text-2xl gradient-title">
          You do not have permission to create a project.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container max-auto p-8">
      <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
        Create new Project
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit, (data) => console.log("Form Errors", data))}>
        <div>
          <Input
            id="name"
            className="bg-slate-950"
            placeholder="Project Name"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Input
            id="key"
            className="bg-slate-950"
            placeholder="Project key (EX: RCBT-1234)"
            {...register("key")}
          />
          {errors.key && <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>}
        </div>
        <div>
          <Textarea
            id="description"
            className="bg-slate-950 h-24"
            placeholder="Project Description"
            {...register("description")}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <Button disabled={loading} type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
          {loading ? "Creating..." : "Create Project"}
        </Button>

        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </form>
    </div>
  );
};

export default CreateProjectPage;
