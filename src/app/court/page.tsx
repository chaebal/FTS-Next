"use client";
import { useState } from "react";

import styles from "./FutsalField.module.css";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type FormationType = "2-2" | "1-3";

const formations: Record<
  FormationType,
  {
    id: number;
    name: string;
    x: number;
    y: number;
    shots: number;
    passing: number;
  }[]
> = {
  "2-2": [
    { id: 1, name: "Adam", x: 60, y: 270, shots: 5, passing: 4 },
    { id: 2, name: "Yaqin", x: 190, y: 270, shots: 9, passing: 7 },
    { id: 3, name: "Syafiq", x: 60, y: 350, shots: 3, passing: 9 },
    { id: 4, name: "Aqmar", x: 190, y: 350, shots: 8, passing: 16 },
    { id: 5, name: "Terun", x: 130, y: 450, shots: 15, passing: 10 },
  ],
  "1-3": [
    { id: 1, name: "Player 1", x: 75, y: 50, shots: 3, passing: 18 },
    { id: 2, name: "Player 2", x: 125, y: 50, shots: 6, passing: 19 },
  ],
};

export default function Court() {
  const [currentFormation, setCurrentFormation] =
    useState<FormationType>("2-2");
  const [players, setPlayers] = useState(formations[currentFormation]);

  const handleFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formation = e.target.value as FormationType;
    setCurrentFormation(formation);
    setPlayers(formations[formation]);
  };

  return (
    <div className={styles.formationContainer}>
      <div className={styles.field}>
        <div className={`${styles.goalArea} ${styles.top}`}></div>
        <div className={`${styles.goalArea} ${styles.bottom}`}></div>

        {/* <HoverCard>
          <HoverCardTrigger>
            {players.map((player) => (
              <div
                key={player.id}
                className={styles.player}
                style={{ left: player.x, top: player.y }}
                title={player.name}
              >
                {player.name}
              </div>
            ))}
          </HoverCardTrigger>
          <HoverCardContent>
            <h1>{player.passing}</h1>
          </HoverCardContent>
        </HoverCard> */}

        {players.map((player) => (
          <HoverCard key={player.id}>
            <HoverCardTrigger>
              <div
                className={styles.player}
                style={{ left: player.x, top: player.y }}
                title={player.name}
              >
                {player.name}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <h1>Passing: {player.passing}</h1>
              <p>Shots: {player.shots}</p>
            </HoverCardContent>
          </HoverCard>
        ))}

        {/* {players.map((player) => (
          <div
            key={player.id}
            className={styles.player}
            style={{ left: player.x, top: player.y }}
            title={player.name}
          >
            {player.name}
          </div>
        ))} */}
      </div>
      <select
        value={currentFormation}
        onChange={handleFormationChange}
        className={styles.formationSelect}
      >
        <option value="2-2">2-2 Formation</option>
        <option value="1-3">1-3 Formation</option>
      </select>
    </div>
  );
}
