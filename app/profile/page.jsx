"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../src/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { AuthButton } from "../components/AuthButton";

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists || !userDoc.data() || !userDoc.data().username) {
          router.push("/profile/edit");
        } else {
          setUser(userDoc.data());
        }
      } else {
        router.push("/join");
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <h1>Hello {user.username}!</h1>
      <p>This is your {user.email}</p>
      <AuthButton />
    </div>
  );
}
