interface stats {
  player_id: number;
  training_id: number;
  speed: number;
  distance: number;
  time: number;
}

const sendPlayerMetrics = async (playerMetrics: stats) => {
  try {
    const response = await fetch("/api/mysql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerMetrics), // Send data as JSON
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    alert("Metrics updated successfully!");
  } catch (error) {
    console.error("Error updating player metrics:", error);
  }
};

export default sendPlayerMetrics;
