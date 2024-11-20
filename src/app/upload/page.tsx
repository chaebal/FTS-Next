// "use client";

// import { SingleImageDropzone } from "@/components/SingleImageDropzone";
// import { MultiFileDropzone } from "@/components/MultiFileDropzone";
// import { useEdgeStore } from "@/lib/edgestore";
// import Link from "next/link";
// import { useState } from "react";

// export default function Page() {
//   const [file, setFile] = useState<File>();
//   const [progress, setProgress] = useState(0);
//   const [urls, setUrls] = useState<{
//     url: string;
//     thumbnailUrl: string | null;
//   }>();
//   const { edgestore } = useEdgeStore();

//   return (
//     <div className="flex flex-col items-center m-6 gap-2">
//       <SingleImageDropzone
//         width={200}
//         height={200}
//         value={file}
//         dropzoneOptions={{
//           maxSize: 1024 * 1024 * 1, // 1MB
//         }}
//         onChange={(file) => {
//           setFile(file);
//         }}
//       />
//       <div className="h-[6px] w-44 border rounded overflow-hidden">
//         <div
//           className="h-full bg-white transition-all duration-150"
//           style={{
//             width: `${progress}%`,
//           }}
//         />
//       </div>
//       <button
//         className="bg-white text-black rounded px-2 hover:opacity-80"
//         onClick={async () => {
//           if (file) {
//             const res = await edgestore.myPublicImages.upload({
//               file,
//               input: { type: "post" },
//               onProgressChange: (progress) => {
//                 setProgress(progress);
//               },
//             });
//             // save your data here
//             setUrls({
//               url: res.url,
//               thumbnailUrl: res.thumbnailUrl,
//             });
//           }
//         }}
//       >
//         Upload
//       </button>
//       {urls?.url && (
//         <Link href={urls.url} target="_blank">
//           URL
//         </Link>
//       )}
//       {urls?.thumbnailUrl && (
//         <Link href={urls.thumbnailUrl} target="_blank">
//           THUMBNAIL
//         </Link>
//       )}
//     </div>
//   );
// }

"use client";

import {
  MultiFileDropzone,
  type FileState,
} from "@/components/MultiFileDropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";

export default function Page() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <div>
      <MultiFileDropzone
        value={fileStates}
        onChange={(files) => {
          setFileStates(files);
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles]);
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.myProtectedFiles.upload({
                  file: addedFileState.file,
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress);
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      updateFileProgress(addedFileState.key, "COMPLETE");
                    }
                  },
                });
                console.log(res);
              } catch (err) {
                updateFileProgress(addedFileState.key, "ERROR");
              }
            })
          );
        }}
      />
    </div>
  );
}
