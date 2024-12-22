// "use client";
// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// type TrainingProgram = {
//   title: string;
//   description: string;
//   imageUrl: string;
// };

// const trainingPrograms: TrainingProgram[] = [
//   {
//     title: "Dribbling",
//     description:
//       "Improve your dribbling quality by going back to the roots of dribbling.",
//     imageUrl: "https://via.placeholder.com/300x200?text=Dribbling",
//   },
//   {
//     title: "Passing",
//     description:
//       "Increase stamina and performance through aerobic and cardio routines.",
//     imageUrl: "https://via.placeholder.com/300x200?text=Passing",
//   },
//   {
//     title: "Strength",
//     description: "Improve your strength",
//     imageUrl: "https://via.placeholder.com/300x200?text=Strength",
//   },
// ];

// const TrainingProgramsPage: React.FC = () => {
//   const router = useRouter();

//   const navigateToTrainingProgram = (program: string) => {
//     router.push(`/trainings/${program}`);
//   };

//   return (
//     <div className="min-h-screen p-8">
//       <h1 className="text-center text-3xl font-bold mb-8">Training Programs</h1>

//       {/* Main Container */}
//       <div className="flex flex-col gap-8">
//         {trainingPrograms.map((program, index) => (
//           <div
//             key={index}
//             className={`flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
//               index % 2 === 1 ? "md:flex-row-reverse" : ""
//             }`}
//             onClick={() =>
//               navigateToTrainingProgram(program.title.toLowerCase())
//             }
//           >
//             {/* Image Section */}
//             <div className="w-full md:w-1/2">
//               <img
//                 src={program.imageUrl}
//                 alt={program.title}
//                 className="object-cover w-full h-56 md:h-64"
//               />
//             </div>

//             {/* Content Section */}
//             <div className="p-6 w-full md:w-1/2 text-center md:text-left">
//               <button>
//                 <CardHeader>
//                   <CardTitle className="text-2xl font-semibold mb-3">
//                     {program.title}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-600">{program.description}</p>
//                 </CardContent>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TrainingProgramsPage;

"use client"; // Ensure it runs on the client-side
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type TrainingProgram = {
  title: string;
  description: string;
  imageUrl: string;
};

const trainingPrograms: TrainingProgram[] = [
  {
    title: "dribbling",
    description:
      "Improve your dribbling quality by going back to the roots of dribbling.",
    imageUrl: "https://via.placeholder.com/300x200?text=Dribbling",
  },
  {
    title: "Passing",
    description:
      "Increase stamina and performance through aerobic and cardio routines.",
    imageUrl: "https://via.placeholder.com/300x200?text=Passing",
  },
  {
    title: "Strength",
    description: "Improve your strength",
    imageUrl: "https://via.placeholder.com/300x200?text=Strength",
  },
];

const TrainingProgramsPage: React.FC = () => {
  const router = useRouter();
  //   // const { program } = router.query;  // Destructure to get the `program` parameter

  const navigateToTrainingProgram = (program: string) => {
    router.push(`/trainings/${program}`);
    // router.push(`/trainings/dribbling`);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-center text-3xl font-bold mb-8">Training Programs</h1>

      {/* Main Container */}
      <div className="flex flex-col gap-8">
        {trainingPrograms.map((program, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
            onClick={() =>
              navigateToTrainingProgram(program.title.toLowerCase())
            }
          >
            {/* Image Section */}
            <div className="w-full md:w-1/2">
              <img
                src={program.imageUrl}
                alt={program.title}
                className="object-cover w-full h-56 md:h-64"
              />
            </div>

            {/* Content Section */}
            <div className="p-6 w-full md:w-1/2 text-center md:text-left">
              <button>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold mb-3">
                    {program.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{program.description}</p>
                </CardContent>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    // <h1>Training programs</h1>
  );
};

export default TrainingProgramsPage;
