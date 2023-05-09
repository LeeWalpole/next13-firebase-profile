"use client";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { auth, db } from "../../src/firebase/config";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import placeholderImage from "../../public/placeholder.png";
import Image from "next/image";
import { ref } from "@firebase/storage";

export default function ImageUpload({ onUpload, currentImage }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notification, setNotification] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImageTimestamp, setProfileImageTimestamp] = useState(
    Date.now()
  );

  // effect to get the profile image URL from Firestore
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (image) {
      const storageRef = ref(
        getStorage(),
        `profile_images/${auth.currentUser.uid}_profile.jpg`
      );
      try {
        setNotification("Uploading image...");
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Image uploaded successfully:", downloadURL);

        // Update Firestore document with image URL
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { profile_image: downloadURL });
        console.log("Profile image URL updated in Firestore");
        onUpload(downloadURL);

        // Show 'Profile image updated' message
        setNotification("Profile image updated.");
        setTimeout(() => setNotification(""), 3000);
      } catch (error) {
        console.error("Error uploading image:", error.message);
        setNotification("Upload failed.");
      }
    } else {
      console.log("No image selected.");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        id="profile-image"
      />
      <label htmlFor="profile-image">
        <Image
          src={preview || currentImage || profileImage || placeholderImage}
          alt="Profile image"
          width={100}
          height={100}
          objectFit="cover"
        />
      </label>
      <button onClick={handleImageUpload}>
        {notification ? "Uploaded" : "Upload image"}
      </button>
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
