"use client";
import { auth, provider, db } from "../src/firebase/config";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Join() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerWithEmail = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await addDoc(collection(db, "users"), { uid: userCredential.user.uid });
      router.push("/create-profile");
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  const registerWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await addDoc(collection(db, "users"), { uid: userCredential.user.uid });
      router.push("/create-profile");
    } catch (error) {
      console.error("Error signing up with Google:", error.message);
    }
  };

  return (
    <div>
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
