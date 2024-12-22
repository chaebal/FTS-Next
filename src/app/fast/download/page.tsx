// pages/download.tsx

"use client";
import { useState, ChangeEvent } from "react";

function DownloadPage() {
  const [filename, setFilename] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleDownload = async () => {
    if (!filename) {
      setMessage("Please enter a filename");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/download/${filename}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename; // Set filename for the download link
        link.click();
      } else {
        setMessage("File not found");
      }
    } catch (error) {
      setMessage(
        `Error downloading file: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }
  };

  return (
    <div>
      <h1>Download Video</h1>
      <input
        type="text"
        value={filename}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setFilename(e.target.value)
        }
        placeholder="Enter filename"
      />
      <button onClick={handleDownload}>Download</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DownloadPage;
