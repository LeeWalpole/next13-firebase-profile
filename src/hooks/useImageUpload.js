import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";

export const useImageUpload = (onUpload) => {
  const handleImageUpload = async (image) => {
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

        try {
          onUpload(downloadURL);
          return true;
        } catch (error) {
          console.error("Error in onUpload callback:", error.message);
          console.error("Error object:", error);
          return false;
        }
      } catch (error) {
        console.error("Error uploading image:", error.message);
        console.error("Error object:", error);
        return false;
      }
    } else {
      console.log("No image selected.");
      return false;
    }
  };

  return { handleImageUpload };
};
