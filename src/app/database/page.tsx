import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  getDocs,
  Firestore,
  doc,
  getDoc,
} from "firebase/firestore/lite";

export default function database() {
  const firebaseConfig = {
    apiKey: "AIzaSyCq4D50ut5Cim8dLozl7fGTuR_TdQSer7Q",
    authDomain: "futsal-tracking-system.firebaseapp.com",
    projectId: "futsal-tracking-system",
    storageBucket: "futsal-tracking-system.firebasestorage.app",
    messagingSenderId: "528333219377",
    appId: "1:528333219377:web:4b059469a952e5093c5710",
    measurementId: "G-ESLNB2EC46",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const analytics = getAnalytics(app);

  async function getTeamStats(db: Firestore) {
    // const team = collection(db, "Team",);

    const docRef = doc(db, "Team/001");
    const teamDoc = await getDoc(docRef);
    const teamStats = teamDoc.data();
    return teamStats;
  }

  return getTeamStats(db);
}
