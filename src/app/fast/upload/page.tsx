// pages/upload.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";

function UploadPage() {
  const [video, setVideo] = useState<File | null>(null); // Allow only File or null
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setVideo(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!video) {
      setMessage("Please select a video to upload.");
      return;
    }

    // Prepare FormData for sending the video
    const formData = new FormData();
    formData.append("file", video);

    try {
      // Sending the POST request to FastAPI backend
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`File uploaded successfully: ${data.info}`);
      } else {
        setMessage("Upload failed. Please try again.");
      }
    } catch (error) {
      setMessage(
        `Error uploading file: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  };

  return (
    <div>
      <h1>Upload Video</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadPage;
