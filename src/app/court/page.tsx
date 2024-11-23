"use client";
import { useState } from "react";

import styles from "./FutsalField.module.css";

type FormationType = "2-2" | "1-3";

const formations: Record<
  FormationType,
  { id: number; name: string; x: number; y: number }[]
> = {
  "2-2": [
    { id: 1, name: "Adam", x: 60, y: 270 },
    { id: 2, name: "Yaqin", x: 190, y: 270 },
    { id: 3, name: "Syafiq", x: 60, y: 350 },
    { id: 4, name: "Aqmar", x: 190, y: 350 },
    { id: 5, name: "Terun", x: 130, y: 450 },
  ],
  "1-3": [
    { id: 1, name: "Player 1", x: 75, y: 50 },
    { id: 2, name: "Player 2", x: 125, y: 50 },
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
