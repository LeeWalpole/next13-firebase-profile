"use client";
import React, { useState, useEffect } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMove from "array-move";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getDoc,
  doc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../src/firebase/config"; // Adjust this import path based on your project structure

/*
const placeholders = [
  { id: 1, image: "https://via.placeholder.com/150" },
  { id: 2, image: "https://via.placeholder.com/150" },
  { id: 3, image: "https://via.placeholder.com/150" },
  { id: 4, image: "https://via.placeholder.com/150" },
  { id: 5, image: "https://via.placeholder.com/150" },
  { id: 6, image: "https://via.placeholder.com/150" },
  { id: 7, image: "https://via.placeholder.com/150" },
  { id: 8, image: "https://via.placeholder.com/150" },
  { id: 9, image: "https://via.placeholder.com/150" },
];
*/
const SortableImageGrid = () => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setUser(auth.currentUser);
        const imageData = userDoc.data().imageData || [];
        setItems(imageData);
      }
    };
    if (auth.currentUser) {
      fetchUserData();
    }
  }, []);

  const handleImageSelect = async (index, file) => {
    if (file) {
      const storageRef = ref(
        getStorage(),
        `grid_images/${auth.currentUser.uid}_${index}.jpg`
      );
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        const newItems = [...items];
        newItems[index] = { id: index, image: downloadURL };
        setItems(newItems);

        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { imageData: newItems });
      } catch (error) {
        console.error("Error uploading image:", error.message);
      }
    }
  };

  const onSortEnd = async (oldIndex, newIndex) => {
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { imageData: newItems });
  };

  return (
    <SortableList
      onSortEnd={onSortEnd}
      className="sortable_list"
      draggedItemClassName="sortable_dragged"
    >
      {Array.from({ length: 9 }, (_, index) => {
        const item = items.find(({ id }) => id === index);
        return (
          <SortableItem key={index}>
            <div
              className="sortable_item"
              onClick={() => handleImageSelect(index, item?.image)}
            >
              <img
                src={item?.image || "https://via.placeholder.com/150"}
                alt={`item-${index}`}
              />
            </div>
          </SortableItem>
        );
      })}
    </SortableList>
  );
};
