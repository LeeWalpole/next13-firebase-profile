"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../src/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { AuthButton } from "../components/AuthButton";
import Header from "../components/Header";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists || !userDoc.data() || !userDoc.data().username) {
          router.push("/profile/create/");
        } else {
          setUser(userDoc.data());
          setLoading(false);
        }
      } else {
        router.push("/join");
      }
    });

    return () => unsubscribe();
  }, []);

  // Display the loading indicator while waiting for the user data to load
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header>
        <AuthButton />
      </header>

      <Header
        title="Dashboard Here"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        className="custom-header"
      />

      <h1>Dashboard!</h1>
      <h1>Hello {user.username}!</h1>
      <p>This is your {user.email}</p>
    </div>
  );
}
