"use client";
import { auth, db } from "../../../src/firebase/config";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function EditProfile() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/join");
      } else {
        setUser(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setDisplayName(userDoc.data().displayName);
            setUsername(userDoc.data().username);
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const submitProfile = async (e) => {
    e.preventDefault();

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty || querySnapshot.docs[0].id === user.uid) {
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            displayName,
            username,
          },
          { merge: true }
        );

        router.push("/dashboard");
      } else {
        setError("This username is already taken.");
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={submitProfile}>
        <label>
          Display Name:
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
