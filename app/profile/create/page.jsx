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
import { useAuth } from "../../../src/hooks/useAuth";
import { onAuthStateChanged } from "firebase/auth";

export default function CreateProfile() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { user, setUser } = useAuth();
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
    const checkUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    checkUserData();
  }, [user]);

  const submitProfile = async (e) => {
    e.preventDefault();

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            displayName,
            username,
            email: auth.currentUser.email,
          },
          { merge: true }
        );

        router.push("/profile");
      } else {
        setError("This username is already taken.");
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <div>
      <h1>Create Profile</h1>
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
        <button type="submit">Submit</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
