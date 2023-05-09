"use client";
// Import required modules and components
import { auth, provider, db } from "../../src/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthButton } from "../components/AuthButton";

export default function Join() {
  // Declare state variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Redirect user to /profile page if they are already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/profile");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  // Register new user with email and password
  const registerWithEmail = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await addDoc(collection(db, "users"), { uid: userCredential.user.uid });
      // Redirect user to /profile/edit after successful registration
      router.push("/profile/edit");
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  // Register new user with Google
  const registerWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await addDoc(collection(db, "users"), { uid: userCredential.user.uid });
      // Redirect user to /profile/edit after successful registration
      router.push("/profile/edit");
    } catch (error) {
      console.error("Error signing up with Google:", error.message);
    }
  };

  // Render the component
  return (
    <div>
      <AuthButton />
      <h1>Home</h1>
      <form onSubmit={registerWithEmail}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up with Email</button>
      </form>
      <button onClick={registerWithGoogle}>Sign Up with Google</button>
    </div>
  );
}
