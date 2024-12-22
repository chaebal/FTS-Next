"use client"; // Ensure this runs on the client-side

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

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
        {/* <div>
          <table>
            <thead>
              <tr>
                <th>Player ID</th>
                <th>Training ID</th>
                <th>Speed</th>
                <th>Distance</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {metrics && metrics.length > 0 ? (
                metrics.map((metric, index) => (
                  <tr key={index}>
                    <td>{metric.player_id}</td>
                    <td>{metric.training_id}</td>
                    <td>{metric.speed}</td>
                    <td>{metric.distance}</td>
                    <td>{metric.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div> */}
        <div className="bg-muted grey ">
          <div className="grid grid-cols-2 gap-3 w-1/4 max-w-4xl mx-auto">
            {metrics && metrics.length > 0 ? (
              metrics.map((metric, index) => (
                <React.Fragment key={index}>
                  {/* Card 1 for Training ID */}
                  <Card>
                    <CardContent className="p-5 rounded-lg shadow-md text-center bg-opacity">
                      <div className="text-sm font-bold">Training ID</div>
                      <div className="text-2xl mt-2">{metric.training_id}</div>
                    </CardContent>
                  </Card>

                  {/* Card 2 for Speed */}
                  <Card>
                    <CardContent className="p-5 rounded-lg shadow-md text-center">
                      <div className="text-sm font-bold">Speed</div>
                      <div className="text-2xl mt-2">{metric.speed}</div>
                    </CardContent>
                  </Card>

                  {/* Card 3 for Distance */}
                  <Card>
                    <CardContent className="p-5 rounded-lg shadow-md text-center">
                      <div className="text-sm font-bold">Distance</div>
                      <div className="text-2xl mt-2">{metric.distance}</div>
                    </CardContent>
                  </Card>

                  {/* Card 4 for Time */}
                  <Card>
                    <CardContent className="p-5 rounded-lg shadow-md text-center">
                      <div className="text-sm font-bold">Time</div>
                      <div className="text-2xl mt-2">{metric.time}</div>
                    </CardContent>
                  </Card>
                </React.Fragment>
              ))
            ) : (
              <div className="col-span-2 text-center">
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
