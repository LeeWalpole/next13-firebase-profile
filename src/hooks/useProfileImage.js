"use client";
import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function useProfileImage() {
  const [profileImage, setProfileImage] = useState(""); // new state variable to store profile image URL

  // effect to get the profile image URL from Firestore
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        if (auth.currentUser) {
          // check if the user is logged in
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const { profile_image } = userDoc.data();
            if (profile_image) {
              setProfileImage(profile_image);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile image:", error.message);
      }
    };

    fetchProfileImage();
  }, []);

  return {
    profileImage,
    setProfileImage,
  };
}

// In the component that renders the image upload form
