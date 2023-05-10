"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc, // Add this import
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { auth, db } from "../../../src/firebase/config";
import ImageUpload from "../../components/ImageUpload";

export default function EditProfile() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState("");
  const [user, setUser] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
            setImageUrl(userDoc.data().profile_image); // Add this line
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleImageUpload = async (image, imageIndex, removeExisting) => {
    if (removeExisting) {
      // Remove the existing profile image from Firebase storage
      const storageRef = ref(
        getStorage(),
        `profile_images/${auth.currentUser.uid}_profile.jpg`
      );
      try {
        await deleteObject(storageRef);
        console.log("Profile image removed from the storage.");
      } catch (error) {
        console.error("Error removing image from storage:", error.message);
        return { success: false };
      }
    }

    if (image) {
      const storageRef = ref(
        getStorage(),
        `profile_images/${auth.currentUser.uid}_profile.jpg`
      );
      try {
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Image uploaded successfully:", downloadURL);

        // Update Firestore document with image URL
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { profile_image: downloadURL });
        console.log("Profile image URL updated in Firestore");
        return { success: true, url: downloadURL };
      } catch (error) {
        console.error("Error uploading image:", error.message);
        console.error("Error object:", error); // Add this line for more information
        return { success: false };
      }
    } else {
      console.log("No image selected.");
      return { success: false };
    }
  };

  const handleRemoveImage = async () => {
    setSelectedImage(null);
    const success = await handleImageUpload(null, true);
    if (success) {
      setImageUrl(null);

      // Update Firestore document with null image URL
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { profile_image: null });
      console.log("Profile image URL removed from Firestore");
    }
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setNotification("Saving...");

    try {
      // Upload the selected image and get the download URL
      let newProfileImageUrl = imageUrl;
      if (selectedImage === null && imageUrl) {
        // Remove the image from the database
        const docRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(docRef, { profile_image: null }, { merge: true });
        console.log("Profile image removed from the database.");
      } else if (selectedImage) {
        // Upload the new image
        const success = await handleImageUpload(selectedImage);
        if (success) {
          newProfileImageUrl = success.url;
        } else {
          setNotification("Error uploading image.");
          setTimeout(() => setNotification(""), 3000);
          return;
        }
      }

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty || querySnapshot.docs[0].id === user.uid) {
        console.log("Updating profile...");

        const docRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(
          docRef,
          {
            displayName,
            username,
            profile_image: newProfileImageUrl || null,
          },
          { merge: true }
        );
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

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={submitProfile}>
        <br />
        <ImageUpload
          onImageSelect={setSelectedImage}
          currentImageUrl={imageUrl}
          onRemoveImage={handleRemoveImage} // Add this prop
        />
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
