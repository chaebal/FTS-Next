"use client";

import React, { useState } from "react";
import "./Loading.css";

const VideoUpload = () => {
  const [video, setVideo] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for modal visibility
  const [downloadLink, setDownloadLink] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setVideo(event.target.files[0]);
      setUploadMessage(null); // Reset previous messages
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    if (!video) {
      setUploadMessage("Please choose a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", video);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
        headers: {
          // No custom CORS headers needed here
        },
      });

      if (!response.ok) {
        setUploadMessage("Failed to upload video. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("data", data);
      console.log("data.info", data.info);
      setUploadMessage(data.message);
      setDownloadLink(data.download_link);
    } catch (error) {
      setUploadMessage("An error occurred while uploading.");
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold text-center mb-6">Upload a Video</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-6 bg-white border border-gray-200 shadow rounded-lg"
      >
        <div className="mb-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full text-gray-700 border border-gray-300 p-3 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded font-semibold hover:bg-blue-600"
        >
          Upload Video
        </button>

        {loading && (
          <div className="loader-container">
            {/* Replace with your preferred loader */}
            <div className="loader"></div>
            <p>Processing the video, please wait...</p>
          </div>
        )}

        {uploadMessage && (
          <p
            className={`mt-4 text-center ${
              uploadMessage.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {uploadMessage}
          </p>
        )}
      </form>
      <div>
        {downloadLink && (
          <div>
            <a href={downloadLink} target="_blank" rel="noopener noreferrer">
              Download Processed Video
            </a>
          </div>
        )}
      </div>

      {/* Show the button after a successful upload */}
      {videoUrl && !isModalOpen && (
        <div className="mt-8 text-center">
          <button
            onClick={toggleModal}
            className="bg-blue-500 text-white py-3 px-6 rounded font-semibold hover:bg-blue-600"
          >
            Show Uploaded Video
          </button>
        </div>
      )}

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-3/4 max-w-3xl relative">
            <button
              onClick={toggleModal}
              className="text-white text-xl absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-700"
            >
              &times;
            </button>
            <h2 className="text-xl mb-4 text-center">Uploaded Video</h2>
            <video controls className="w-full max-w-4xl mx-auto">
              {videoUrl && <source src={videoUrl} type="video/mp4" />}
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
