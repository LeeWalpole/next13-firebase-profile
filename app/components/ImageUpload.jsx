"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import placeholderImage from "../../public/placeholder.png";

export default function ImageUpload({ onImageSelect, currentImageUrl }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (currentImageUrl) {
      setPreview(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (typeof onImageSelect === "function") {
        onImageSelect(file);
      }
    } else {
      setPreview(null);
      if (typeof onImageSelect === "function") {
        onImageSelect(null);
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (typeof onImageSelect === "function") {
      onImageSelect(null);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        id="profile-image"
      />
      <label htmlFor="profile-image">
        <Image
          src={preview || currentImageUrl || placeholderImage}
          alt="Profile image"
          width={100}
          height={100}
          objectFit="cover"
        />
      </label>
      {(preview || currentImageUrl) && (
        <div className="cross-icon" onClick={handleRemoveImage}>
          &times;
        </div>
      )}
    </div>
  );
}
