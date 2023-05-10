"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import GalleryUpload from "../../components/GalleryUpload";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { auth, db } from "../../../src/firebase/config";

export default function EditProfile() {
  const [selectedImages, setSelectedImages] = useState(Array(9).fill(null));
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState("");
  const [user, setUser] = useState("");
  const [imageUrl, setImageUrl] = useState({});

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

            const profileImages = {};
            for (let i = 1; i <= 9; i++) {
              profileImages[`profile_image_${i}`] =
                userDoc.data()[`profile_image_${i}`] || null;
            }
            setImageUrl(profileImages);
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleImageUpload = async (image, imageIndex, removeExisting) => {
    const filename = `${auth.currentUser.uid}_profile_image_${
      imageIndex + 1
    }.jpg`;

    if (removeExisting) {
      const storageRef = ref(
        getStorage(),
        `profile_images/${auth.currentUser.uid}_profile_image_${
          imageIndex + 1
        }.jpg`
      );
      try {
        await deleteObject(storageRef);
        console.log(
          `Profile image for index ${imageIndex} removed from the storage.`
        );
      } catch (error) {
        console.error("Error removing image from storage:", error.message);
        return { success: false };
      }
    }

    if (image) {
      const storageRef = ref(
        getStorage(),
        `profile_images/${auth.currentUser.uid}_profile_image_${
          imageIndex + 1
        }.jpg`
      );
      try {
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        console.log(
          `Image for index ${imageIndex} uploaded successfully:`,
          downloadURL
        );

        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          [`profile_image_${imageIndex + 1}`]: downloadURL,
        });
        console.log(
          `Profile image URL for index ${imageIndex} updated in Firestore`
        );

        return { success: true, url: downloadURL };
      } catch (error) {
        console.error("Error uploading image:", error.message);
        console.error("Error object:", error);
        return { success: false };
      }
    } else {
      console.log("No image selected.");
      return { success: false };
    }
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setNotification("Saving...");

    const newProfileImageUrls = Array(9).fill(null); // Add this line

    for (let i = 0; i < 9; i++) {
      if (selectedImages[i]) {
        const result = await handleImageUpload(selectedImages[i], i, false);
        if (result.success) {
          newProfileImageUrls[i] = result.url;
        } else {
          setNotification(`Error uploading image ${i + 1}.`);
          setTimeout(() => setNotification(""), 3000);
          return;
        }
      } else {
        newProfileImageUrls[i] = imageUrl[`profile_image_${i + 1}`] || null;
      }
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty || querySnapshot.docs[0].id === user.uid) {
        console.log("Updating profile...");

        const docRef = doc(db, "users", auth.currentUser.uid);

        const updatedData = {
          displayName,
          username,
        };

        for (let i = 0; i < 9; i++) {
          updatedData[`profile_image_${i + 1}`] = newProfileImageUrls[i];
        }

        await setDoc(docRef, updatedData, { merge: true });
        console.log("Profile updated successfully.");
        setNotification("Updated.");
        setTimeout(() => setNotification(""), 3000);
      } else {
        setNotification("This username is already taken.");
        setTimeout(() => setNotification(""), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      setNotification("Error updating profile.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderGalleryUploads = () => {
    const galleryUploads = [];

    for (let i = 0; i < 9; i++) {
      galleryUploads.push(
        <GalleryUpload
          key={i}
          onImageSelect={(image) => {
            const newSelectedImages = [...selectedImages];
            newSelectedImages[i] = image;
            setSelectedImages(newSelectedImages);
          }}
          currentImageUrl={imageUrl[`profile_image_${i + 1}`]}
          imageIndex={i} // Add this line
        />
      );
    }

    return galleryUploads;
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={submitProfile}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {renderGalleryUploads()}
        </div>
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
        <button type="submit" disabled={notification === "Saving..."}>
          {notification === "Saving..." ? "Saving..." : "Save Profile"}
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
