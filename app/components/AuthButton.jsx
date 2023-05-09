"use client";
import React, { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../src/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export function AuthButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const snapshot = await getDoc(userRef);
        setUser(snapshot.data());
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchUser();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  if (user) {
    return (
      <div>
        <button onClick={handleSignOut}>Sign Out</button>
        <p>Email: {user.email}</p>
        <p>username: : {user.username}</p>
        <p>displayName: : {user.displayName}</p>
        <button onClick={() => (window.location.href = "/profile/edit/")}>
          Edit Profile
        </button>
      </div>
    );
  } else {
    return (
      <button onClick={() => (window.location.href = "/join")}>Sign In</button>
    );
  }
}
