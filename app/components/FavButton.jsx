import React from "react";

function FavoriteButton({ productId, handleFavoriteSelection, favorites }) {
  const isFavorited = favorites.includes(productId);
  const buttonText = isFavorited ? "Favorite" : "Unfavorite";

  return (
    <div
      className="product-fav-button"
      onClick={() => handleFavoriteSelection(productId)}
    >
      <p>{buttonText}</p>
    </div>
  );
}

export default FavoriteButton;
