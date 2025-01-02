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
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          // `/api/sqlite/playermetrics?player_id=${playerID}`
          `/api/sqlite/playermetrics?player_id=${1}`
        );
        const result = await response.json();
        console.log("result", result);
        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch metrics.");
        }

        setMetrics(result.metrics);
        console.log(metrics);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewClick = () => {
    const url = `http://127.0.0.1:8000/download/solo_drill_1_detections.mp4`; // Replace with dynamic video filename
    setVideoUrl(url);
    setIsModalVisible(true); // Show the modal
  };

  const closeModal = () => {
    setIsModalVisible(false); // Hide the modal
    setVideoUrl(""); // Reset the video URL
  };

  // const handleGetVideo = async () =>{
  //   try{
  //     const response = await fetch(
  //               `/api/sqlite/playermetrics?player_id=${playerID}`
  //             );
  //   }
  // }

  // // Handle form submission
  // const handleFormSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // const playerMetrics: Stats = {
  //   //   player_id: 1,
  //   //   sess: 101,
  //   //   speed: 5.0,
  //   //   distance: 500,
  //   //   time: 100,
  //   // };

  //   // Function to send metrics asynchronously
  //   const sendPlayerMetrics = async () => {
  //     try {
  //       const response = await fetch("/api/sqlite/playermetrics", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(playerMetrics),
  //       });

  //       const data = await response.json();

  //       if (!response.ok) {
  //         throw new Error(data.error || "Error updating player metrics");
  //       }

  //       setMessage("Metrics updated successfully!");
  //       setError(null);
  //     } catch (error: any) {
  //       setMessage(null);
  //       setError(error.message || "Failed to update metrics");
  //     }
  //   };

  //   sendPlayerMetrics();
  // };

  // const handleGetPlayerMetrics = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const fetchMetrics = async () => {
  //     try {
  //       const response = await fetch(
  //         `/api/sqlite/playermetrics?player_id=${playerID}`
  //       );
  //       const data = await response.json();

  //       if (!response.ok) {
  //         throw new Error(data.error || "Failed to fetch metrics.");
  //       }

  //       setMetrics(data.metrics);
  //       setError(null);
  //       // console.log("Metrics: " + metrics?.player_id);
  //     } catch (err: any) {
  //       setError(err.message);
  //     }
  //   };

  //   fetchMetrics();
  // };

  return (
    <div>
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
              <Link href="#">Login</Link>
            </NavbarItem>
            <NavbarItem>
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

      {/* <div>
        <form onSubmit={handleFormSubmit}>
          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
      </div> */}
      <div>
        {/* <form onSubmit={handleGetPlayerMetrics}>
          <input
            placeholder="Player ID"
            type="number"
            onChange={(e) => setPlayerID(Number(e.target.value))}
          ></input>
          <button type="submit">Retrieve</button> */}
        {/* </form> */}
        <div className="top-section mt-2 flex justify-center items-center w-full h-full">
          <div className="flex flex-col w-3/4 border border-dashed border-gray-400 p-4 h-64 items-center justify-center rounded-lg">
            <ImageChecking />
          </div>
        </div>
        <div className="flex flex-2 flex-col gap-4 p-4 pt-0 mt-3 w-full items-center">
          {metrics && metrics.length > 0 ? (
            metrics.map((metric, index) => (
              <React.Fragment key={index}>
                <Card className="py-4 bg-gradient-to-br from-purple-900 to-black-200 w-3/4">
                  <div className="flex-col">
                    <h1 className="text-center text-2xl font-bold mb-5">
                      Summary
                    </h1>
                    <CardHeader className="pb-0 pt-2 px-4 items-start justify-between">
                      <div>
                        {/* <p className="text-tiny uppercase font-bold">
                          Session {metric.session_no}
                        </p> */}
                        <small className="text-default-500">12 Tracks</small>
                        <h4 className="font-bold text-large truncate">
                          Session {metric.session_no}
                        </h4>
                      </div>
                      <div className="w-full text-center">
                        <h1 className="text-sm">Average Speed</h1>
                        <p className="text-4xl mt-3">{`${metric.speed.toFixed(
                          2
                        )} m/s`}</p>
                      </div>
                      <div className="w-full text-center">
                        <h1 className="text-sm">Total Distance Covered</h1>
                        <p className="text-4xl mt-3">
                          {`${metric.distance.toFixed(2)} m`}
                        </p>
                      </div>
                      <div className="w-full text-center">
                        <h1 className="text-sm">Time Taken</h1>
                        <p className="text-4xl mt-3">{metric.time} s</p>
                      </div>
                    </CardHeader>
                  </div>
                  <CardBody className="overflow-visible py-2 flex flex-row">
                    <Image
                      alt="Card background"
                      className="object-cover rounded-xl"
                      // src="http://127.0.0.1:8000/frame/solo.mp4_frame.jpg"
                      // src={`http://127.0.0.1:8000/frame/${frameId}`}
                      src={metric.frame_url}
                      width={140}
                    />
                    <div className="flex-1 flex flex-col justify-end items-center">
                      <div className="flex space-x-4">
                        <Button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
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
                              {/* <video
                                controls
                                width="600"
                                // src={videoUrl}
                                src="http://127.0.0.1:8000/download/solo_drill_1_detections.mp4"
                                className="rounded-md"
                              > */}
                              <video controls width="600">
                                <source
                                  src="http://127.0.0.1:8000/view/solo_drill_1_detections.mp4"
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                              {/* Your browser does not support the video tag.
                              </video> */}
                            </div>
                          </div>
                        )}
                        <a
                          href={
                            "http://127.0.0.1:8000/download/" + metric.video_url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button>Download</Button>
                        </a>
                        <Button>More</Button>
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

          {/* <>
            <Card className="py-4 bg-gradient-to-br from-purple-900 to-black-200 w-3/4">
              <div className="flex-col">
                <CardHeader className="pb-0 pt-2 px-4 items-start justify-between">
                  <div>
                    <p className="text-tiny uppercase font-bold">Session 2</p>
                    <small className="text-default-500">12 Tracks</small>
                    <h4 className="font-bold text-large">Slalom Dribbling</h4>
                  </div>
                  <div className="w-full text-center">
                    <h1 className="text-sm">Average Speed</h1>
                    <p className="text-4xl mt-3">24 m/s</p>
                  </div>
                  <div className="w-full text-center">
                    <h1 className="text-sm">Total Distance Covered</h1>
                    <p className="text-4xl mt-3">65 m</p>
                  </div>
                  <div className="w-full text-center">
                    <h1 className="text-sm">Time Taken</h1>
                    <p className="text-4xl mt-3">20 s</p>
                  </div>
                </CardHeader>
              </div>
              <CardBody className="overflow-visible py-2 flex flex-row">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src="https://nextui.org/images/hero-card-complete.jpeg"
                  width={140}
                />
                <div className="flex-1 flex flex-col justify-end items-center">
                  <div className="flex space-x-4">
                    <Button>View</Button>
                    <Button>Download</Button>
                    <Button>More</Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
          <>
            <Card className="py-4 bg-gradient-to-l from-purple-900 to-black-200">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">Session 2</p>
                <small className="text-default-500">12 Tracks</small>
                <h4 className="font-bold text-large">Slalom Dribbling</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2 flex flex-row justify-between">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src="https://nextui.org/images/hero-card-complete.jpeg"
                  width={270}
                />
                <div>
                  <h1>Average Speed</h1>
                </div>
                <div>
                  <h1>Total Distance Covered</h1>
                </div>
                <div>
                  <h1>Time Taken</h1>
                </div>
              </CardBody>
            </Card>
          </> */}
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
            <Card>
              <CardContent className="p-5 rounded-lg shadow-md text-center">
                Avatar
              </CardContent>
            </Card>
            <div className="col-span-2 flex flex-row w-full justify-between">
              <Card className="flex-1 text-center rounded-none">
                <CardContent className="p-5 shadow-md text-center">
                  <div>Total Training Time</div>
                  <div className="text-5xl mt-2">23</div>
                </CardContent>
              </Card>
              <Card className="flex-1 text-center rounded-none">
                <CardContent className="p-5  shadow-md text-center">
                  <div>Total Distance Covered</div>
                  <div className="text-5xl mt-2">23 m</div>
                </CardContent>
              </Card>
              <Card className="flex-1 text-center rounded-none">
                <CardContent className="p-5 shadow-md text-center">
                  <div>Average Speed</div>
                  <div className="text-5xl mt-2">23 m/s</div>
                </CardContent>
              </Card>
            </div>
            <div>
              <ImageChecking />
            </div>
          </div> */}
        </div>

        {/* <div className="flex gap-4">
          <div className="p-4 bg-gray-200">Test 1</div>
          <div className="p-4 bg-gray-200">Test 2</div>
        </div> */}

        {/* <div className="flex items-center justify-center min-h-screen">
          <div className="grid grid-cols-2 gap-2 w-1/4 max-w-4xl bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-md">
            {metrics && metrics.length > 0 ? (
              metrics.map((metric, index) => (
                <React.Fragment key={index}>
                  <Card>
                    <CardContent className="p-5 rounded-lg shadow-md text-center">
                      <div className="text-2xl mt-2">{metric.training_id}</div>
                      <div className="text-sm font-bold text-gray-500">
                        Training ID
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-5 rounded-lg shadow-md text-center">
                      <IoIosSpeedometer className="mx-auto text-lg text-gray-300" />
                      <div className="text-2xl mt-2">{metric.speed}</div>
                      <div className="text-sm font-bold text-gray-500">
                        Speed
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-5 rounded-lg shadow-md text-center">
                      <IoLocationSharp className="mx-auto text-lg text-gray-300" />
                      <div className="text-2xl mt-2">{metric.distance}</div>
                      <div className="text-sm font-bold text-gray-500">
                        Distance
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-5 rounded-lg shadow-md text-center">
                      <FaClock className="mx-auto text-sm text-gray-300" />
                      <div className="text-2xl mt-2">{metric.time}</div>
                      <div className="text-sm font-bold text-gray-500">
                        Time
                      </div>
                    </CardContent>
                  </Card>
                </React.Fragment>
              ))
            ) : (
              <div className="col-span-2 text-center text-white">
                <p>No data available</p>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default TrainingDetails;
