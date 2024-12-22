"use client";
import { useSession, signIn } from "next-auth/react";
import { auth } from "@/auth";
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
import Dropdown from "@/components/dropdown";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Court from "../court/page";
import NewsCarousel from "../carousel/page";
import { Card, CardContent } from "@/components/ui/card";
import VideoUpload from "../upload/page";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth"; // Import session type

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEdgeStore } from "@/lib/edgestore";
import { useRouter } from "next/navigation"; // Import useRouter for client-side routing

export default function Page() {
  // const { data: session } = useSession();
  const { data: session, status } = useSession();

  console.log("Session: " + session?.user?.name);

  if (status === "loading") {
    return <div>Loading...</div>; // Show a loading spinner until session is ready
  }

  if (status === "unauthenticated") {
    return <RedirectToLogin />;
  }

  return <MainPageContent session={session} />;
}

function RedirectToLogin() {
  const router = useRouter();
  useEffect(() => {
    router.push("/login");
  }, [router]);

  return <div>Redirecting to login...</div>;
}

function MainPageContent({ session }: { session: any }) {
  // const { data: session } = useSession();
  const router = useRouter(); // Initialize useRouter hook
  const [message, setMessage] = useState("");
  // console.log("Session:" + session);

  const [teamStats, setTeamStats] = useState<{
    Wins: number;
    Draws: number;
    Losses: number;
  }>({
    Wins: 0,
    Draws: 0,
    Losses: 0,
  });

  const [output, setOutput] = useState(0);

  useEffect(() => {
    const fetchTeamStats = async () => {
      const stats = await database();
      // setTeamStats(stats || { Wins: 0, Draws: 0, Losses: 0 });
      setTeamStats(stats as { Wins: number; Draws: number; Losses: number });
    };
    fetchTeamStats();
  }, []);

  console.log(teamStats);

  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();
  const [progress, setProgress] = useState(0);

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
                  <BreadcrumbPage>Season 24/25</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50">
              {/* <h1 className="mb-4 mt-4 text-center">Analyzer AI</h1> */}
              <VideoUpload />
              {/* <MultiFileDropzone /> */}
              {/* <input
                type="file"
                onChange={(e) => {
                  setFile(e.target.files?.[0]);
                }}
              />
              <div className="h-[6px] w-44 border rounded overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-150"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>
              <button
                className="bg-white text-black rounded px-2 hover:opacity-80"
                onClick={async () => {
                  if (file) {
                    const res = await edgestore.publicImages.upload({
                      file,
                      onProgressChange: (progress) => {
                        setProgress(progress);
                      },
                    });
                  }
                }}
              ></button> */}
            </div>
            {/* <div className="aspect-video rounded-xl bg-muted/50 flex justify-between">
              <div className="ml-5 flex flex-col items-center">
                <h1 className="mt-6 flex">
                  <FaTrophy className="mt-1 mr-2" />
                  Wins
                </h1>
                <h1 className="text-center text-5xl mt-10">
                  {teamStats.Wins}{" "}
                </h1>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="mt-6 flex">
                  <FaRegHandshake className="mt-1 mr-1" />
                  Draws
                </h1>
                <h1 className="text-center text-5xl mt-10">
                  {teamStats.Draws}{" "}
                </h1>
              </div>
              <div className="flex flex-col items-center mr-5">
                <h1 className="mt-6 flex">
                  <IoMdCloseCircleOutline className="mt-1 mr-1" />
                  Losses
                </h1>
                <h1 className="text-center text-5xl mt-10">
                  {teamStats.Losses}{" "}
                </h1>
              </div>
            </div> */}
            <div className="aspect-video rounded-xl bg-muted/50 flex flex-wrap justify-center items-center">
              <Card>
                <CardContent>
                  <div className="flex flex-col items-center mx-3">
                    <h1 className="mt-6 flex text-lg md:text-base">
                      <FaTrophy className="mt-1 mr-2" />
                      Wins
                    </h1>
                    <h1 className="text-center text-4xl sm:text-3xl mt-6">
                      {teamStats.Wins}
                    </h1>
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-col items-center mx-3">
                <h1 className="mt-6 flex text-lg md:text-base">
                  <FaRegHandshake className="mt-1 mr-1" />
                  Draws
                </h1>
                <h1 className="text-center text-4xl sm:text-3xl mt-6">
                  {teamStats.Draws}
                </h1>
              </div>
              <div className="flex flex-col items-center mx-3">
                <h1 className="mt-6 flex text-lg md:text-base">
                  <IoMdCloseCircleOutline className="mt-1 mr-1" />
                  Losses
                </h1>
                <h1 className="text-center text-4xl sm:text-3xl mt-6">
                  {teamStats.Losses}
                </h1>
              </div>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 row-span-3 h-full max-w-full items-center justify-center flex">
              <Court />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 w-full row-span-2">
              <NewsCarousel />
            </div>
            {/* --------------------------------- */}
            <div className="aspect-video flex-wrap rounded-xl bg-muted/50 row-span-2 h-full max-w-full justify-center items-center flex relative">
              {/* <Dropdown onOutputChange={setOutput} />
              <div className="text-center">
                <h1>{output}%</h1>
              </div> */}

              {/* Dropdown at the top-left corner */}
              <div className="absolute top-3 left-5">
                <Dropdown onOutputChange={setOutput} />
              </div>

              {/* Output centered */}
              <div className="text-center ">
                {/* <h1 className="text-4xl">{output}%</h1> */}
                <CircularProgressbar
                  value={output}
                  text={`${output}%`}
                  className="mx-auto lg:max-w-[80%] sm:max-w-[60%] md:max-w-[50%]"
                />
              </div>
            </div>
            {/* --------------------------------- */}
            {/* <div className="aspect-video rounded-xl bg-muted/50"></div> */}

            {/* <div className="aspect-video rounded-xl bg-muted/50">Formation</div> */}
          </div>

          {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            Result
          </div> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
