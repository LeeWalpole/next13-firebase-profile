"use client";
import React, { useState, useEffect } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMove from "array-move";

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

const SortableImageGrid = () => {
  const [items, setItems] = useState(placeholders);

  const handleImageSelect = (index, file) => {
    // handle image select here
  };

  const onSortEnd = (oldIndex, newIndex) => {
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <SortableList
      onSortEnd={onSortEnd}
      className="sortable_list"
      draggedItemClassName="sortable_dragged"
    >
      {items.map(({ id, image }) => (
        <SortableItem key={id}>
          <div
            className="sortable_item"
            onClick={() => handleImageSelect(id, image)}
          >
            <img src={image} alt={`item-${id}`} />
          </div>
        </SortableItem>
      ))}
    </SortableList>
  );
};

export default SortableImageGrid;
