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

interface Stats {
  player_id: number;
  session_no: number;
  speed: number;
  distance: number;
  time: number;
  video_url: string;
}

const TrainingDetails = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Stats[]>([]);
  const [playerID, setPlayerID] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [downloadlink, setDownloadLink] = useState(null);

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
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        <div className="top-section mt-2 flex flex-col w-full border border-gray-400 p-4 h-64 items-center justify-center">
          <ImageChecking />
        </div>
        <div className="flex flex-2 flex-col gap-4 p-4 pt-0 mt-3 w-full items-center">
          {metrics && metrics.length > 0 ? (
            metrics.map((metric, index) => (
              <React.Fragment key={index}>
                <Card className="py-4 bg-gradient-to-br from-purple-900 to-black-200 w-3/4">
                  <div className="flex-col">
                    <h1 className="text-center">Summary</h1>
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
                        <p className="text-4xl mt-3">{metric.speed} m/s</p>
                      </div>
                      <div className="w-full text-center">
                        <h1 className="text-sm">Total Distance Covered</h1>
                        <p className="text-4xl mt-3">{metric.distance} m</p>
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
                      src="https://nextui.org/images/hero-card-complete.jpeg"
                      width={140}
                    />
                    <div className="flex-1 flex flex-col justify-end items-center">
                      <div className="flex space-x-4">
                        <Button>View</Button>
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
