"use client"; // Ensure this runs on the client-side

import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { FaClock } from "react-icons/fa";
import { IoIosSpeedometer } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import VideoUpload from "@/app/upload/page";
import { BarChart } from "@mui/x-charts/BarChart";
import { Video } from "lucide-react";
import ImageChecking from "@/app/image_checking/page";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import { FcGoogle } from "react-icons/fc";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Pagination,
} from "@nextui-org/react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";

interface Stats {
  player_id: number;
  session_no: number;
  speed: number;
  distance: number;
  time: number;
  video_url: string;
  frame_url: string;
}

export const QyveLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 1182 1182" width="36">
      <path
        clipRule="evenodd"
        d="M4904 10244 c-514 -439 -2944 -2764 -2944 -2816 0 -19 982 -987 1525 -1504 597 -568 1501 -1398 1516 -1392 3 2 120 131 259 288 493 555 1080 1251 1060 1258 -5 2 -305 -249 -666 -558 -632 -541 -657 -561 -674 -544 -9 11 -201 217 -425 459 -603 649 -700 751 -1430 1504 -253 260 -462 478 -464 483 -1 5 62 75 141 156 652 668 1147 1187 1737 1822 222 239 417 448 433 465 21 22 32 27 42 20 8 -6 137 -118 288 -251 361 -318 891 -764 1008 -848 25 -19 -242 311 -474 584 -272 321 -820 942 -835 948 -4 1 -48 -32 -97 -74z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M8389 10263 c-722 -645 -1494 -1374 -2458 -2322 l-524 -516 349 -343 c442 -435 1084 -1057 1369 -1327 481 -456 1317 -1220 1334 -1220 23 0 841 940 1170 1345 163 201 160 196 143 186 -61 -37 -659 -541 -1059 -893 -133 -117 -246 -213 -251 -213 -5 0 -157 161 -338 357 -564 613 -841 904 -1683 1768 -176 182 -321 334 -321 339 0 4 138 151 308 325 686 706 1425 1484 1830 1928 l203 223 207 -183 c449 -397 1144 -980 1106 -927 -139 194 -1288 1530 -1314 1530 -4 0 -35 -26 -71 -57z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M3305 3328 c-442 -35 -824 -379 -917 -828 -30 -145 -22 -323 19 -445 98 -285 319 -468 648 -536 33 -7 116 -12 185 -12 129 0 213 14 324 53 33 11 64 20 70 20 6 0 21 -16 34 -35 l22 -35 275 0 c151 0 275 2 275 5 0 3 -54 77 -119 166 l-119 161 54 70 c147 191 219 395 218 623 0 147 -18 226 -79 351 -81 167 -251 318 -431 383 -150 55 -289 72 -459 59z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M4280 3270 c0 -6 76 -251 169 -545 l169 -535 -89 -332 c-49 -183 -89 -334 -89 -335 0 -2 133 -3 295 -3 l294 0 15 53 c8 28 44 161 80 295 36 134 73 254 83 267 10 13 207 242 438 510 335 389 421 483 427 468 4 -10 52 -360 108 -778 56 -418 104 -775 107 -793 l5 -32 285 2 285 3 589 877 c324 483 589 880 589 883 0 3 -148 5 -329 5 l-329 0 -299 -485 c-164 -266 -301 -481 -304 -477 -3 4 -20 207 -38 452 -18 245 -35 460 -38 478 l-5 32 -603 0 -602 0 -224 -289 c-123 -160 -226 -290 -229 -290 -3 -1 -34 119 -69 267 -36 147 -68 277 -72 290 l-9 22 -305 0 c-203 0 -305 -3 -305 -10z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M7890 2523 c-112 -417 -218 -813 -236 -880 l-33 -123 758 0 757 0 62 238 c35 130 63 240 62 244 0 4 -209 9 -463 10 l-464 3 25 88 25 87 428 0 c399 0 428 1 433 18 15 48 106 395 106 403 0 5 -167 9 -425 9 -234 0 -425 3 -425 7 0 4 9 42 21 85 l21 78 461 2 461 3 63 230 c34 127 63 236 63 243 0 9 -156 12 -748 12 l-748 0 -204 -757z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

const TrainingDetails = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Stats[]>([]);
  const [playerID, setPlayerID] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [downloadlink, setDownloadLink] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisibility, setModalVisibility] = useState<number | null>(null);

  const itemsPerPage = 3;

  // Determine the current set of metrics based on the active page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMetrics = metrics.slice(startIndex, endIndex);
  const [isModalVisibleCancel, setIsModalVisibleCancel] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession(); // Use useSession to get session state
  const [guest, isGuest] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // const player_id = session?.user?.id;
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/sqlite/playermetrics?player_id=${session?.user?.id}`
          // `/api/sqlite/playermetrics?player_id=${userID}`
        );
        const result = await response.json();
        console.log("result", result);
        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch metrics.");
        }

        setMetrics(result.metrics);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);

  //  ----------------------------- Replace with dynamic video filename

  const handleViewClick = () => {
    const url = `http://127.0.0.1:8000/download/solo_drill_1_detections.mp4`; // Replace with dynamic video filename
    setVideoUrl(url);
    setIsModalVisible(true); // Show the modal
  };
  //  -----------------------------
  const closeModal = () => {
    setIsModalVisible(false); // Hide the modal
    setVideoUrl(""); // Reset the video URL
  };

  const handleDelete = async (session_no: number) => {
    console.log("Session to be deleted: ", session_no);
    try {
      const response = await fetch(
        `/api/sqlite/playermetrics?player_id=${session?.user?.id}&session_no=${session_no}`,
        {
          method: "DELETE", // Specify DELETE method
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      try {
        const response = await fetch(
          // `/api/sqlite/playermetrics?player_id=${playerID}`
          `/api/sqlite/playermetrics?player_id=${session?.user?.id}`
        );
        const result = await response.json();
        console.log("result", result);
        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch metrics.");
        }

        setMetrics(result.metrics);
        console.log(metrics);
        setError(null);
        console.log("Record deleted successfully");
        toast.success("Deletion Successful!");
      } catch (error) {
        toast.error("Error deleting record!");
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      // Trigger sign-in process
      await signIn("google", { callbackUrl: "/trainings/dribbling" });
      const session = await getSession(); // Adjust this according to the authentication method

      // Since `useSession` automatically updates, no need for getSession
      if (session) {
        // setUserName(session.user?.name || null);
        // setUserID(session.user?.id || null);
        // setIsUser(true); // Update your component state
        // setIsUserAuthenticated(true); // User is now authenticated
        console.log("username: ", userName);
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/trainings/dribbling" }); // Redirect after signing out if needed
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisibleCancel(false);
    setModalVisibility(null);
  };

  const handleDeleteButton = (session_no: number) => {
    setIsModalVisibleCancel(true);
  };

  const showDeleteModal = (session_no: number) => {
    setModalVisibility(session_no); // Show the modal for a specific session
  };

  return (
    <div>
      {session ? (
        <header>
          <Navbar>
            <NavbarBrand>
              <QyveLogo />
              <p className="font-bold text-inherit">QYVE+</p>
            </NavbarBrand>
            <NavbarContent
              className="hidden sm:flex gap-4"
              justify="center"
            ></NavbarContent>
            <NavbarContent justify="end">
              <NavbarItem className="hidden lg:flex">
                Welcome, {session?.user?.name}
                {/* Welcome, {userName} */}
                {/* {session?.user?.id} */}
              </NavbarItem>
              <NavbarItem className="hidden lg:flex">
                <Button
                  color="primary"
                  href="#"
                  variant="flat"
                  onClick={handleSignOut} // Redirect after sign out
                >
                  Sign Out
                </Button>
              </NavbarItem>

              <NavbarItem>
                {isOpen && (
                  <div className="absolute top-16 right-4 bg-white shadow-lg rounded-md p-4 z-10 justify-center items-center">
                    <form className="space-y-4">
                      <div>
                        <label
                          htmlFor="username"
                          className="block text-gray-700"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-gray-700"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-1 rounded-md hover:bg-indigo-600"
                      >
                        Login
                      </button>
                    </form>
                    <div className="flex justify-center mt-4">
                      <Button
                        className="flex text-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-white hover:border-gray-500 transition-all"
                        // onClick={() => {
                        //   signIn("google", { callbackUrl: "/dashboard" });
                        // }}
                        onClick={handleSignIn}
                      >
                        <FcGoogle />
                        <span className="text-white text-sm">
                          Google Sign In
                        </span>
                      </Button>
                    </div>
                  </div>
                )}
              </NavbarItem>
            </NavbarContent>
          </Navbar>
          <div className="flex flex-col justify-center items-center mt-10">
            <h1 className="text-5xl font-bold mb-6">
              Futsal Individual Drill Analyzer
            </h1>
            <div className="flex flex-col items-center">
              <p className="text-md mb-2 mt-4">
                QYVE+ is your handy video analyzer tool
              </p>
              <p className="text-md mb-2 mt-4">Record, Upload, and Analyze</p>
              <p className="text-md mb-2 mt-4 font-bold">
                Completely free to use
              </p>
            </div>
          </div>
        </header>
      ) : (
        <header>
          <Navbar>
            <NavbarBrand>
              <QyveLogo />
              <p className="font-bold text-inherit">QYVE+</p>
            </NavbarBrand>
            <NavbarContent
              className="hidden sm:flex gap-4"
              justify="center"
            ></NavbarContent>
            <NavbarContent justify="end">
              <NavbarItem className="hidden lg:flex">
                <Link href="#" onClick={togglePopup}>
                  Login
                </Link>
              </NavbarItem>
              <NavbarItem>
                {isOpen && (
                  <div className="absolute top-16 right-4 bg-white shadow-lg rounded-md p-4 z-10 justify-center items-center">
                    <form className="space-y-4">
                      <div>
                        <label
                          htmlFor="username"
                          className="block text-gray-700"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-gray-700"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-1 rounded-md hover:bg-indigo-600"
                      >
                        Login
                      </button>
                    </form>
                    <div className="flex justify-center mt-4">
                      <Button
                        className="flex text-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-white hover:border-gray-500 transition-all"
                        onClick={handleSignIn}
                      >
                        <FcGoogle />
                        <span className="text-white text-sm">
                          Google Sign In
                        </span>
                      </Button>
                    </div>
                  </div>
                )}
                <Button as={Link} color="primary" href="#" variant="flat">
                  Sign Up
                </Button>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
          <div className="flex flex-col justify-center items-center mt-10">
            <h1 className="text-5xl font-bold mb-6">
              Futsal Individual Drill Analyzer
            </h1>
            <div className="flex flex-col items-center">
              <p className="text-md mb-2 mt-4">
                QYVE+ is your handy video analyzer tool
              </p>
              <p className="text-md mb-2 mt-4">Record, Upload, and Analyze</p>
              <p className="text-md mb-2 mt-4 font-bold">
                Completely free to use
              </p>
            </div>
          </div>
        </header>
      )}

      <div>
        <div className="top-section mt-2 flex justify-center items-center w-full h-full">
          <div className="flex flex-col w-3/4 border border-dashed border-gray-400 p-4 h-64 items-center justify-center rounded-lg">
            <ImageChecking user_id={session?.user?.id ?? "guest"} />
          </div>
        </div>
        {/* {session ? ( */}
        {session ? (
          <div className="flex flex-2 flex-col gap-4 p-4 pt-0 mt-3 w-full items-center">
            {/* {metrics && metrics.length > 0 ? ( */}
            {currentMetrics && currentMetrics.length > 0 ? (
              currentMetrics.map((metric, index) => (
                // metrics.map((metric, index) => (
                <React.Fragment key={index}>
                  <Card className="py-4 bg-gradient-to-br from-purple-900 to-black-200 w-3/4">
                    <div className="flex-col gap-4">
                      <h1 className="text-center text-2xl font-bold mb-5">
                        Summary
                      </h1>
                      <CardHeader className="pb-0 pt-2 px-4 items-start justify-between">
                        <div>
                          <h4 className="font-bold text-2xl sm:text-md md:text-lg lg:text-xl xl:text-2xl truncate">
                            Session {metric.session_no}
                          </h4>
                        </div>
                        <div className="w-full text-center">
                          <h1 className="text-sm">Average Speed</h1>
                          <p className="text-2xl sm:text-md md:text-xl lg:text-3xl xl:text-4xl mt-3">{`${metric.speed.toFixed(
                            2
                          )} m/s`}</p>
                        </div>
                        <div className="w-full text-center">
                          <h1 className="text-sm">Total Distance Covered</h1>
                          <p className="text-2xl sm:text-md md:text-xl lg:text-3xl xl:text-4xl mt-3">
                            {`${metric.distance.toFixed(2)} m`}
                          </p>
                        </div>
                        <div className="w-full text-center">
                          <h1 className="text-sm">Time Taken</h1>
                          <p className="text-2xl sm:text-md md:text-xl lg:text-3xl xl:text-4xl mt-3">
                            {metric.time} s
                          </p>
                        </div>
                      </CardHeader>
                    </div>
                    <CardBody className="overflow-visible py-2 flex flex-row">
                      <Image
                        alt="Card background"
                        className="object-cover rounded-xl"
                        src={metric.frame_url}
                        width={140}
                      />
                      <div className="flex-1 flex flex-col justify-end items-center h-">
                        <div className="flex space-x-4">
                          <Button
                            className="bg-blue-500 text-white px-4 py-2 rounded "
                            onClick={handleViewClick}
                          >
                            View
                          </Button>

                          {/* Modal */}
                          {isModalVisible && (
                            <div
                              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
                              onClick={closeModal} // Close the modal when clicking outside the content
                            >
                              <div
                                className="bg-white rounded-lg overflow-hidden p-4 relative"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
                              >
                                <Button
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center"
                                  onClick={closeModal}
                                >
                                  ✕
                                </Button>

                                <video controls width="600">
                                  <source
                                    src="http://127.0.0.1:8000/view/solo_drill_1_detections.mp4"
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            </div>
                          )}
                          <a
                            href={
                              "http://127.0.0.1:8000/download/" +
                              metric.video_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button>Download</Button>
                          </a>
                          <Button
                            onClick={() => showDeleteModal(metric.session_no)}
                          >
                            Delete
                          </Button>
                          {modalVisibility === metric.session_no && (
                            <div className="modal">
                              <div className="modal-content">
                                <h3>
                                  Are you sure you want to delete this session?
                                </h3>
                                <div className="modal-actions">
                                  <Button
                                    onClick={() =>
                                      handleDelete(metric.session_no)
                                    }
                                  >
                                    Confirm
                                  </Button>
                                  <Button onClick={handleCancel}>Cancel</Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </React.Fragment>
              ))
            ) : (
              <div className="col-span-2 text-center text-white">
                <p>No data available</p>
              </div>
            )}
            <div className="mt-4 flex justify-center items-center">
              <Pagination
                initialPage={1}
                total={Math.ceil(metrics.length / itemsPerPage)}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        ) : (
          <div className="col-span-2 text-center text-white">
            <p>Not logged in</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingDetails;
