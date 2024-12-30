"use client";

import React, { useState, useRef, useEffect } from "react";
import "./Loading.css";
import { Button, ButtonGroup } from "@nextui-org/button";

type Coordinate = {
  x: number;
  y: number;
} | null;

const ImageChecking = () => {
  const [video, setVideo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false); // State for popup visibility
  const [selectedInputs, setSelectedInputs] = useState<string | null>(null); // To track which input (A/B/C/D) is selected
  const [inputCoordinates, setInputCoordinates] = useState<{
    A: string | null;
    B: string | null;
    C: string | null;
    D: string | null;
  }>({
    A: null,
    B: null,
    C: null,
    D: null,
  });
  const [inputDistance, setInputDistance] = useState<{
    AB: string | null;
    BD: string | null;
    AC: string | null;
    CD: string | null;
  }>({
    AB: null,
    BD: null,
    AC: null,
    CD: null,
  });

  // const ImageChecking = () => {
  //   const [video, setVideo] = useState<File | null>(null);
  //   const [frameUrl, setFrameUrl] = useState<string | null>(null);
  //   const [popupOpen, setPopupOpen] = useState(false); // State for popup visibility
  //   const [selectedInputs, setSelectedInputs] = useState<string | null>(null); // To track which input (A/B/C/D) is selected
  //   const [inputCoordinates, setInputCoordinates] = useState<{
  //     A: Coordinate;
  //     B: Coordinate;
  //     C: Coordinate;
  //     D: Coordinate;
  //   }>({
  //     A: null,
  //     B: null,
  //     C: null,
  //     D: null,
  //   });

  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Ref for canvas
  const imgRef = useRef<HTMLImageElement | null>(null); // Ref for image

  // Draws lines on the canvas
  const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x1, y1); // Start point
        ctx.lineTo(x2, y2); // End point
        ctx.strokeStyle = "blue"; // Line color
        ctx.lineWidth = 2; // Line width
        ctx.stroke();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setVideo(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!video) return;

    const formData = new FormData();
    formData.append("file", video);

    try {
      const response = await fetch("http://127.0.0.1:8000/extract-frame/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFrameUrl(data.frame_url);
      } else {
        console.error("Failed to extract frame.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Set loading to true
    const payload = {
      coordinates: inputCoordinates,
      distances: inputDistance,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload-coordinates-and-distance/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Let server know you're sending JSON
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Network response for sending coordinates and distances was not ok"
        );
      }

      const data = await response.json();

      console.log("Success:", data);
      setIsSent(true);
    } catch (error) {
      console.error("Error in sending coordinates and distances", error);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!frameUrl) return;

    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left; // X-coordinate relative to the image
    const y = event.clientY - rect.top; // Y-coordinate relative to the image

    if (selectedInputs) {
      setInputCoordinates((prev) => ({
        ...prev,
        [selectedInputs]: `${x},${y}`,
      }));
    }
  };

  // Opens the popup
  const openPopup = () => {
    setPopupOpen(true);
  };

  // Closes the popup
  const closePopup = () => {
    setPopupOpen(false);
  };

  // Sets the current input being selected (A, B, C, or D)
  const handleInputClick = (input: string) => {
    setSelectedInputs(input);
  };

  // Draw lines between A, B, C, D whenever the coordinates change
  useEffect(() => {
    const coordinates = inputCoordinates;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear the previous drawings on the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get the coordinates for A, B, C, D
        const points = {
          A: coordinates.A?.split(",").map(Number),
          B: coordinates.B?.split(",").map(Number),
          C: coordinates.C?.split(",").map(Number),
          D: coordinates.D?.split(",").map(Number),
        };

        // Draw lines if coordinates for both A and B exist
        if (points.A && points.B) {
          drawLine(points.A[0], points.A[1], points.B[0], points.B[1]);
        }
        // Draw lines if coordinates for both C and D exist
        if (points.C && points.D) {
          drawLine(points.C[0], points.C[1], points.D[0], points.D[1]);
        }

        if (points.A && points.C) {
          drawLine(points.A[0], points.A[1], points.C[0], points.C[1]);
        }

        if (points.B && points.D) {
          drawLine(points.B[0], points.B[1], points.D[0], points.D[1]);
        }
      }
    }
  }, [inputCoordinates]);

  return (
    <div>
      <h1>Upload Video and Extract Frame</h1>

      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Extract Frame</button>

      {frameUrl && (
        <div>
          <h2>Extracted Frame:</h2>

          {/* Button to open popup */}
          <button onClick={openPopup}>Open Image in Popup</button>

          {/* Popup to display image */}
          {popupOpen && (
            <div className="popup-container">
              <div className="popup-overlay" onClick={closePopup}></div>
              <div className="popup-content">
                <button onClick={closePopup} className="close-popup-button">
                  ×
                </button>
                <h2>Set coordinates and define real world measurements</h2>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    ref={imgRef}
                    src={frameUrl}
                    alt="Extracted Frame"
                    className="cursor-crosshair"
                    onClick={handleImageClick}
                    style={{ display: "block", width: "auto", height: "auto" }} // Ensure original resolution
                  />
                  <canvas
                    ref={canvasRef}
                    width={imgRef.current?.naturalWidth || 0}
                    height={imgRef.current?.naturalHeight || 0}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      pointerEvents: "none", // Makes sure clicks go through canvas
                    }}
                  ></canvas>
                </div>

                {/* Input for A, B, C, D */}
                {popupOpen && (
                  <div className="flex justify-center items-center">
                    <div className="coordinates-inputs">
                      <label className="flex items-center">
                        A:
                        <input
                          type="text"
                          value={inputCoordinates.A || ""}
                          onClick={() => handleInputClick("A")}
                          placeholder="Click to select for A"
                          readOnly
                        />
                      </label>

                      <label>
                        A to B:
                        <input
                          type="text"
                          value={inputDistance.AB || ""}
                          placeholder="Distance from A to B"
                          onChange={(e) =>
                            setInputDistance({
                              ...inputDistance,
                              AB: e.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        B:
                        <input
                          type="text"
                          value={inputCoordinates.B || ""}
                          onClick={() => handleInputClick("B")}
                          placeholder="Click to select for B"
                          readOnly
                        />
                      </label>

                      <label>
                        B to D:
                        <input
                          type="text"
                          value={inputDistance.BD || ""}
                          placeholder="Distance from B to D"
                          onChange={(e) =>
                            setInputDistance({
                              ...inputDistance,
                              BD: e.target.value,
                            })
                          }
                        />
                      </label>

                      <label>
                        C:
                        <input
                          type="text"
                          value={inputCoordinates.C || ""}
                          placeholder="Click to select for C"
                          onClick={() => handleInputClick("C")}
                          readOnly
                        />
                      </label>

                      <label>
                        A to C:
                        <input
                          type="text"
                          value={inputDistance.AC || ""}
                          placeholder="Distance from A to C"
                          onChange={(e) =>
                            setInputDistance({
                              ...inputDistance,
                              AC: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        D:
                        <input
                          type="text"
                          value={inputCoordinates.D || ""}
                          onClick={() => handleInputClick("D")}
                          placeholder="Click to select for D"
                          readOnly
                        />
                      </label>
                      <label>
                        C to D:
                        <input
                          type="text"
                          value={inputDistance.CD || ""}
                          placeholder="Distance from C to D"
                          onChange={(e) =>
                            setInputDistance({
                              ...inputDistance,
                              CD: e.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                    <div>
                      {isSent ? (
                        <p className="text-success font-bold ml-10">Sent √</p>
                      ) : isLoading ? (
                        <Button
                          className="items-center ml-10"
                          isLoading
                          color="primary"
                          variant="ghost"
                        >
                          Loading...
                        </Button>
                      ) : (
                        <Button
                          className="items-center ml-10"
                          color="primary"
                          onClick={handleSubmit}
                        >
                          Confirm
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageChecking;

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import "./Loading.css";

// const ImageChecking = () => {
//   const [video, setVideo] = useState<File | null>(null);
//   const [frameUrl, setFrameUrl] = useState<string | null>(null);
//   const [coordinates, setCoordinates] = useState<{ x: number; y: number }[]>(
//     []
//   );
//   const [popupOpen, setPopupOpen] = useState(false); // State for popup visibility
//   const [selectedInputs, setSelectedInputs] = useState<string | null>(null); // To track which input (A/B/C/D) is selected
//   const [inputCoordinates, setInputCoordinates] = useState<{
//     A: string | null;
//     B: string | null;
//     C: string | null;
//     D: string | null;
//   }>({
//     A: null,
//     B: null,
//     C: null,
//     D: null,
//   });

//   const canvasRef = useRef<HTMLCanvasElement | null>(null); // Ref for canvas
//   const imgRef = useRef<HTMLImageElement | null>(null); // Ref for image

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setVideo(event.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!video) return;

//     const formData = new FormData();
//     formData.append("file", video);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/extract-frame/", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setFrameUrl(data.frame_url);
//       } else {
//         console.error("Failed to extract frame.");
//       }
//     } catch (error) {
//       console.error("Error uploading video:", error);
//     }
//   };

//   const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
//     if (!frameUrl) return;

//     const img = imgRef.current;
//     if (!img) return;

//     const rect = img.getBoundingClientRect();
//     const x = event.clientX - rect.left; // X-coordinate relative to the image
//     const y = event.clientY - rect.top; // Y-coordinate relative to the image

//     if (selectedInputs) {
//       setInputCoordinates((prev) => ({
//         ...prev,
//         [selectedInputs]: `${x},${y}`,
//       }));
//     }
//   };

//   // Opens the popup
//   const openPopup = () => {
//     setPopupOpen(true);
//   };

//   // Closes the popup
//   const closePopup = () => {
//     setPopupOpen(false);
//   };

//   // Sets the current input being selected (A, B, C, or D)
//   const handleInputClick = (input: string) => {
//     setSelectedInputs(input);
//   };

//   return (
//     <div>
//       <h1>Upload Video and Extract Frame</h1>

//       <input type="file" accept="video/*" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload and Extract Frame</button>

//       {frameUrl && (
//         <div>
//           <h2>Extracted Frame:</h2>

//           {/* Button to open popup */}
//           <button onClick={openPopup}>Open Image in Popup</button>

//           {/* Popup to display image */}
//           {popupOpen && (
//             <div className="popup-container">
//               <div className="popup-overlay" onClick={closePopup}></div>
//               <div className="popup-content">
//                 <button onClick={closePopup} className="close-popup-button">
//                   ×
//                 </button>
//                 <h2>Click to set coordinates for A, B, C, D</h2>
//                 <div style={{ position: "relative", display: "inline-block" }}>
//                   <img
//                     ref={imgRef}
//                     src={frameUrl}
//                     alt="Extracted Frame"
//                     className="max-w-full cursor-crosshair"
//                     onClick={handleImageClick}
//                     style={{ display: "block", width: "auto", height: "auto" }} // Ensure original resolution
//                   />
//                   <canvas
//                     ref={canvasRef}
//                     width={imgRef.current?.naturalWidth || 0}
//                     height={imgRef.current?.naturalHeight || 0}
//                     style={{
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       pointerEvents: "none", // Makes sure clicks go through canvas
//                     }}
//                   ></canvas>
//                 </div>

//                 {/* Input for A, B, C, D */}
//                 <div className="coordinates-inputs">
//                   <label>
//                     A:
//                     <input
//                       type="text"
//                       value={inputCoordinates.A || "Click to select"}
//                       onClick={() => handleInputClick("A")}
//                       readOnly
//                     />
//                   </label>

//                   <label>
//                     B:
//                     <input
//                       type="text"
//                       value={inputCoordinates.B || "Click to select"}
//                       onClick={() => handleInputClick("B")}
//                       readOnly
//                     />
//                   </label>

//                   <label>
//                     C:
//                     <input
//                       type="text"
//                       value={inputCoordinates.C || "Click to select"}
//                       onClick={() => handleInputClick("C")}
//                       readOnly
//                     />
//                   </label>

//                   <label>
//                     D:
//                     <input
//                       type="text"
//                       value={inputCoordinates.D || "Click to select"}
//                       onClick={() => handleInputClick("D")}
//                       readOnly
//                     />
//                   </label>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageChecking;

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import "./Loading.css";

// const ImageChecking = () => {
//   const [video, setVideo] = useState<File | null>(null);
//   const [frameUrl, setFrameUrl] = useState<string | null>(null);
//   const [coordinates, setCoordinates] = useState<{ x: number; y: number }[]>(
//     []
//   );
//   const canvasRef = useRef<HTMLCanvasElement | null>(null); // Ref for canvas
//   const imgRef = useRef<HTMLImageElement | null>(null); // Ref for image

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setVideo(event.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!video) return;

//     const formData = new FormData();
//     formData.append("file", video);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/extract-frame/", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setFrameUrl(data.frame_url);
//       } else {
//         console.error("Failed to extract frame.");
//       }
//     } catch (error) {
//       console.error("Error uploading video:", error);
//     }
//   };

//   const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
//     if (!frameUrl) return;

//     const img = imgRef.current;
//     if (!img) return;

//     const rect = img.getBoundingClientRect();
//     const x = event.clientX - rect.left; // X-coordinate relative to the image
//     const y = event.clientY - rect.top; // Y-coordinate relative to the image

//     setCoordinates((prev) => [...prev, { x, y }]);
//   };

//   useEffect(() => {
//     if (coordinates.length >= 2 && canvasRef.current && imgRef.current) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
//         ctx.beginPath();
//         ctx.strokeStyle = "red";
//         ctx.lineWidth = 2;

//         for (let i = 1; i < coordinates.length; i++) {
//           const start = coordinates[i - 1];
//           const end = coordinates[i];
//           ctx.moveTo(start.x, start.y);
//           ctx.lineTo(end.x, end.y);
//           ctx.stroke();
//         }
//       }
//     }
//   }, [coordinates]);

//   return (
//     <div>
//       <h1>Upload Video and Extract Frame</h1>

//       <input type="file" accept="video/*" onChange={handleFileChange} />

//       <button onClick={handleUpload}>Upload and Extract Frame</button>

//       {frameUrl && (
//         <div>
//           <h2>Extracted Frame:</h2>
//           <div style={{ position: "relative", display: "inline-block" }}>
//             <img
//               ref={imgRef}
//               src={frameUrl}
//               alt="Extracted Frame"
//               className="max-w-full cursor-crosshair"
//               onClick={handleImageClick}
//               style={{ display: "block", width: "auto", height: "auto" }} // Ensure original resolution
//             />
//             <canvas
//               ref={canvasRef}
//               width={imgRef.current?.naturalWidth || 0}
//               height={imgRef.current?.naturalHeight || 0}
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 pointerEvents: "none", // Makes sure clicks go through canvas
//               }}
//             ></canvas>
//           </div>
//           <div>
//             <h3>Captured Coordinates:</h3>
//             {coordinates.length > 0 ? (
//               <ul>
//                 {coordinates.map((coord, index) => (
//                   <li key={index}>
//                     Point {index + 1}: (x: {coord.x}, y: {coord.y})
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>Click on the image to capture coordinates.</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageChecking;

// "use client";

// import React, { useState } from "react";
// import "./Loading.css";

// const ImageChecking = () => {
//   const [video, setVideo] = useState<File | null>(null);
//   const [frameUrl, setFrameUrl] = useState<string | null>(null);
//   const [coordinates, setCoordinates] = useState<{ x: number; y: number }[]>(
//     []
//   );

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setVideo(event.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!video) return;

//     const formData = new FormData();
//     formData.append("file", video);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/extract_frame/", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setFrameUrl(data.frame_url);
//       } else {
//         console.error("Failed to extract frame.");
//       }
//     } catch (error) {
//       console.error("Error uploading video:", error);
//     }
//   };

//   const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
//     if (!frameUrl) return;

//     const img = event.target as HTMLImageElement;
//     const rect = img.getBoundingClientRect();
//     const x = event.clientX - rect.left; // X-coordinate relative to the image
//     const y = event.clientY - rect.top; // Y-coordinate relative to the image

//     setCoordinates((prev) => [...prev, { x, y }]);
//   };

//   return (
//     <div>
//       <h1>Upload Video and Extract Frame</h1>

//       <input type="file" accept="video/*" onChange={handleFileChange} />

//       <button onClick={handleUpload}>Upload and Extract Frame</button>

//       {frameUrl && (
//         <div>
//           <h2>Extracted Frame:</h2>
//           <img
//             src={frameUrl}
//             alt="Extracted Frame"
//             className="max-w-full cursor-crosshair"
//             onClick={handleImageClick}
//           />
//           <div>
//             <h3>Captured Coordinates:</h3>
//             {coordinates.length > 0 ? (
//               <ul>
//                 {coordinates.map((coord, index) => (
//                   <li key={index}>
//                     Point {index + 1}: (x: {coord.x}, y: {coord.y})
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>Click on the image to capture coordinates.</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageChecking;
