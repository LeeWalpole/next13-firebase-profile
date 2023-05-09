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
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const router = useRouter();

  // Check if user is authenticated and redirect to login if not
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

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setDisplayName(userDoc.data().displayName);
            setUsername(userDoc.data().username);
            setImageUrl(userDoc.data().profile_image); // Get the profile image URL from Firestore
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Handle the image upload and set the image URL in state
  const handleImageUpload = (url) => {
    setImageUrl(url);
  };

  // Handle form submission
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
            profile_image: imageUrl, // Save the profile image URL in Firestore
          },
          { merge: true }
        );

        setNotification("Profile updated successfully.");
        setTimeout(() => setNotification(""), 3000);
      } else {
        setNotification("This username is already taken.");
        setTimeout(() => setNotification(""), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  // Handle "Back" button click
  const handleBack = () => {
    router.back();
  };
  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={submitProfile}>
        <br />
        {/* Render the ImageUpload component with currentImage prop set to imageUrl */}
        <ImageUpload onUpload={handleImageUpload} currentImage={imageUrl} />
        <br />
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
        <button type="submit">Update</button>
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
