"use client";
import { useSession } from "next-auth/react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { MultiFileDropzone } from "@/components/MultiFileDropzone";
import { FaTrophy, FaRegHandshake } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import database from "../database/page";

export default function Page() {
  const { data: session } = useSession();
  console.log(session?.user?.name);

  // async function getServerSideProps() {
  //   const teamStats = await getTeamStats(db); // Fetch team stats from Firebase
  //   return {
  //     props: {
  //       teamStats, // Pass teamStats as a prop to the component
  //     },
  //   };
  // }

  const [teamStats, setTeamStats] = useState<any>();

  useEffect(() => {
    const fetchTeamStats = async () => {
      const stats = await database();
      setTeamStats(stats);
    };
    fetchTeamStats();
  }, []);

  console.log(teamStats);

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <ModeToggle />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Club Summary</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50">
              <h1 className="mb-4 mt-4 text-center">Analyzer AI</h1>
              <MultiFileDropzone />
            </div>

            <div className="aspect-video rounded-xl bg-muted/50 flex justify-between">
              <div className="ml-3 flex flex-col items-center">
                <h1 className="mt-6 flex">
                  <FaTrophy className="mt-1 mr-2" />
                  Wins
                </h1>
                <h1 className="text-center">{teamStats.Wins} </h1>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="mt-6 flex">
                  <FaRegHandshake className="mt-1 mr-1" />
                  Draws
                </h1>
                <h1 className="text-center">{teamStats.Draws} </h1>
              </div>
              <div className="flex flex-col items-center mr-3">
                <h1 className="mt-6 flex">
                  <IoMdCloseCircleOutline className="mt-1 mr-1" />
                  Losses
                </h1>
                <h1 className="text-center">{teamStats.Losses} </h1>
              </div>
            </div>

            <div className="aspect-[3/5] rounded-xl bg-muted/50"></div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
