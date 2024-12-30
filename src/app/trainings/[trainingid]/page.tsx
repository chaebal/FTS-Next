"use client"; // Ensure this runs on the client-side

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { FaClock } from "react-icons/fa";
import { IoIosSpeedometer } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import VideoUpload from "@/app/upload/page";
import { BarChart } from "@mui/x-charts/BarChart";
import { Video } from "lucide-react";
import ImageChecking from "@/app/image_checking/page";
interface Stats {
  player_id: number;
  training_id: number;
  speed: number;
  distance: number;
  time: number;
}

const TrainingDetails = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Stats[]>([]);
  const [playerID, setPlayerID] = useState<number>();

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const playerMetrics: Stats = {
      player_id: 1,
      training_id: 101,
      speed: 5.0,
      distance: 500,
      time: 100,
    };

    // Function to send metrics asynchronously
    const sendPlayerMetrics = async () => {
      try {
        const response = await fetch("/api/sqlite/playermetrics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(playerMetrics),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error updating player metrics");
        }

        setMessage("Metrics updated successfully!");
        setError(null);
      } catch (error: any) {
        setMessage(null);
        setError(error.message || "Failed to update metrics");
      }
    };

    sendPlayerMetrics();
  };

  const handleGetPlayerMetrics = async (e: React.FormEvent) => {
    e.preventDefault();

    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `/api/sqlite/playermetrics?player_id=${playerID}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch metrics.");
        }

        setMetrics(data.metrics);
        setError(null);
        // console.log("Metrics: " + metrics?.player_id);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchMetrics();
  };

  return (
    <div>
      <div>
        <form onSubmit={handleFormSubmit}>
          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
      </div>
      <div>
        <form onSubmit={handleGetPlayerMetrics}>
          <input
            placeholder="Player ID"
            type="number"
            // value={playerID}
            onChange={(e) => setPlayerID(Number(e.target.value))}
          ></input>
          <button type="submit">Retrieve</button>
        </form>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3 ">
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
            <div>
              <VideoUpload />
            </div>

            {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
              <h1>Select Session</h1>
              <div className="grid auto-rows-min gap-4 md:grid-cols-3 w-full">
                <div className="col-span-2">
                  <div>
                    <VideoUpload />
                  </div>
                  <Card className="flex-1 text-center w-full rounded-none">
                    <CardContent className="p-5 shadow-md text-center w-full">
                      <BarChart
                        xAxis={[
                          {
                            scaleType: "band",
                            data: ["group A", "group B", "group C"],
                          },
                        ]}
                        series={[
                          { data: [4, 3, 5] },
                          { data: [1, 6, 3] },
                          { data: [2, 5, 6] },
                        ]}
                        width={500}
                        height={300}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="col-span-2"></div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="flex items-center justify-center min-h-screen">
          <div className="grid grid-cols-2 gap-2 w-1/4 max-w-4xl bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-md">
            {metrics && metrics.length > 0 ? (
              metrics.map((metric, index) => (
                <React.Fragment key={index}>
                  {/* Card 1 for Training ID */}
                  <Card>
                    <CardContent className="p-5 rounded-lg shadow-md text-center">
                      <div className="text-2xl mt-2">{metric.training_id}</div>
                      <div className="text-sm font-bold text-gray-500">
                        Training ID
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 2 for Speed */}
                  <Card>
                    <CardContent className="p-5 rounded-lg shadow-md text-center">
                      <IoIosSpeedometer className="mx-auto text-lg text-gray-300" />
                      <div className="text-2xl mt-2">{metric.speed}</div>
                      <div className="text-sm font-bold text-gray-500">
                        Speed
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 3 for Distance */}
                  <Card>
                    <CardContent className="p-5 rounded-lg shadow-md text-center">
                      <IoLocationSharp className="mx-auto text-lg text-gray-300" />
                      <div className="text-2xl mt-2">{metric.distance}</div>
                      <div className="text-sm font-bold text-gray-500">
                        Distance
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 4 for Time */}
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
        </div>
      </div>
    </div>
  );
};

export default TrainingDetails;
