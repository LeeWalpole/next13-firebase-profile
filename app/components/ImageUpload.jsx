"use client";
import { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../../src/firebase/config";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import placeholderImage from "../../public/placeholder.png";
import Image from "next/image";

export default function ImageUpload({ onUpload, currentImage }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

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
      try {
        console.log("Uploading image...");
        setNotification("Uploading image...");
        const storage = getStorage();
        const filePath = `${auth.currentUser.uid}_profile.jpg`;
        const storageRef = ref(storage, `profile_images/${filePath}`);
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
        {preview ? (
          <Image
            src={preview}
            alt="Profile preview"
            width={100}
            height={100}
            objectFit="cover"
          />
        ) : currentImage ? (
          <Image
            src={currentImage}
            alt="Current profile image"
            width={100}
            height={100}
            objectFit="cover"
          />
        ) : (
          <Image
            src={placeholderImage}
            alt="Default profile image"
            width={100}
            height={100}
            objectFit="cover"
          />
        )}
      </label>
      <button onClick={handleImageUpload}>
        {image
          ? notification
            ? "Uploaded"
            : "Uploading..."
          : "Change Profile Pic"}
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
