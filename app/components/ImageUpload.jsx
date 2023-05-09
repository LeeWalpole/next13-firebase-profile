"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import placeholderImage from "../../public/placeholder.png";
import { useProfileImage } from "../../src/hooks/useProfileImage";
import { useImageUpload } from "../../src/hooks/useImageUpload";

export default function ImageUpload({ onUpload, currentImage }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notification, setNotification] = useState("");
  const { profileImage, setProfileImageTimestamp } = useProfileImage();
  const { handleImageUpload } = useImageUpload((downloadURL) => {
    onUpload(downloadURL);
    setProfileImageTimestamp(Date.now());
    setNotification("Profile image updated.");
    setTimeout(() => setNotification(""), 3000);
  });

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

  const handleButtonClick = async (e) => {
    e.preventDefault();
    setNotification("Uploading image...");
    const success = await handleImageUpload(image);
    if (!success) {
      setNotification("Upload failed.");
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
      <button onClick={handleButtonClick}>
        {notification ? "Uploaded" : "Upload image"}
      </button>
      {notification && <div className="imageNotification">{notification}</div>}
    </div>
  );
}
