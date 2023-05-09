"use client";
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
import { auth, db } from "../../../src/firebase/config";
import ImageUpload from "../../components/ImageUpload";

export default function EditProfile() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState("");
  const [user, setUser] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
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

  const handleImageUpload = async (url) => {
    setIsUploading(true);
    try {
      const storageRef = ref(
        storage,
        `users/${auth.currentUser.uid}/profile.jpg`
      );
      await uploadString(storageRef, url, "data_url");
      setImageUrl(url);
      setNotification("Uploaded.");
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      setNotification("Error uploading image.");
      setTimeout(() => setNotification(""), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const submitProfile = async (e) => {
    e.preventDefault();

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty || querySnapshot.docs[0].id === user.uid) {
        console.log("Updating profile...");
        setNotification("Saving...");
        setIsUploading(true);
        const docRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(
          docRef,
          {
            displayName,
            username,
            imageUrl,
          },
          { merge: true }
        );
        console.log("Profile updated successfully.");
        setNotification("Updated.");
        setImageUrl(null);
        setTimeout(() => setNotification(""), 3000);
        setIsUploading(false);
      } else {
        setNotification("This username is already taken.");
        setTimeout(() => setNotification(""), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const handleBack = () => {
    router.back();
  };
  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={submitProfile}>
        <br />
        <ImageUpload onUpload={handleImageUpload} />
        <br />
        <input
          type="text"
          value={displayName ?? ""}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <input
          type="text"
          value={username ?? ""}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isUploading || notification === "Saving..."}
        >
          {isUploading || notification === "Saving..."
            ? "Saving..."
            : "Save Profile"}
        </button>
        <button type="button" onClick={handleBack}>
          Back
        </button>
      </form>
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "10px",
            background: "lightgray",
            borderRadius: "5px",
          }}
        >
          {notification}
        </div>
      )}
    </div>
  );
}
