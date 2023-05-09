import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const useProfileImage = () => {
  const [profileImage, setProfileImage] = useState("");
  const [profileImageTimestamp, setProfileImageTimestamp] = useState(
    Date.now()
  );

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const { profile_image } = userDoc.data() || {};
            setProfileImage(profile_image || "");
            setProfileImageTimestamp(Date.now());
          }
        }
      } catch (error) {
        console.error("Error fetching profile image:", error.message);
      }
    };

    fetchProfileImage();
  }, [profileImageTimestamp]);

  return { profileImage, setProfileImageTimestamp };
};
