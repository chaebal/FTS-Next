// import axios from "axios";
// import fs from "fs";
// import path from "path";
// import ffmpeg from "fluent-ffmpeg";

// // Function to extract frames from the video
// function extractFrames(videoPath, outputFolder) {
//   return new Promise((resolve, reject) => {
//     ffmpeg(videoPath)
//       .output(path.join(outputFolder, "frame-%04d.png"))
//       .outputOptions("-vf", "fps=1") // Extract one frame per second (you can change fps)
//       .on("end", () => {
//         console.log("Frames extracted successfully.");
//         resolve();
//       })
//       .on("error", (err) => {
//         console.error("Error extracting frames: ", err);
//         reject(err);
//       })
//       .run();
//   });
// }

// // Function to send frame to Roboflow API
// async function sendFrameToRoboflow(framePath) {
//   const image = fs.readFileSync(framePath, { encoding: "base64" });

//   try {
//     const response = await axios({
//       method: "POST",
//       url: "https://detect.roboflow.com/futsal-player-and-ball-detection/5",
//       params: {
//         api_key: "Xa3BJMVVWAUz5KeJsO5M",
//       },
//       data: `image=${image}`, // Pass the base64 encoded image
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     console.log("Roboflow Response:", response.data);
//   } catch (error) {
//     console.error("Error sending frame to Roboflow:", error.message);
//   }
// }

// // Main function to process the video
// async function processVideo(videoPath, outputFolder) {
//   try {
//     // Step 1: Extract frames from the video
//     await extractFrames(videoPath, outputFolder);

//     // Step 2: Send each extracted frame to Roboflow
//     const files = fs.readdirSync(outputFolder);
//     for (const file of files) {
//       if (file.endsWith(".png")) {
//         const framePath = path.join(outputFolder, file);
//         await sendFrameToRoboflow(framePath); // Send each frame to the API
//       }
//     }
//   } catch (error) {
//     console.error("Error processing video:", error);
//   }
// }

// // Example usage
// const videoPath = "test.mp4"; // Path to your video file
// const outputFolder = "frames"; // Folder to save the extracted frames

// // Create output folder if not exists
// if (!fs.existsSync(outputFolder)) {
//   fs.mkdirSync(outputFolder);
// }

// // Process the video
// processVideo(videoPath, outputFolder);

import axios from "axios";
import fs from "fs";
const outputFolder = "frames";

const frames = fs.readdirSync(outputFolder);
for (const img of frames) {
  // console.log(typeof img);

  const image = fs.readFileSync(`frames/${img}`, {
    encoding: "base64",
  });

  axios({
    method: "POST",
    url: "https://detect.roboflow.com/futsal-player-and-ball-detection/5",
    params: {
      api_key: "Xa3BJMVVWAUz5KeJsO5M",
    },
    data: image,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

// const image = fs.readFileSync("frames/frame-0002.png", {
//   encoding: "base64",
// });

// axios({
//   method: "POST",
//   url: "https://detect.roboflow.com/futsal-player-and-ball-detection/5",
//   params: {
//     api_key: "Xa3BJMVVWAUz5KeJsO5M",
//   },
//   data: image,
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded",
//   },
// })
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.log(error.message);
//   });
