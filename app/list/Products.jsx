"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Product from "./Product";

function Products({ products }) {
  // Set up state variables for products, selected category, favorites, and loading
  //   const [products, setProducts] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setLoading(true);
    const favoriteData = localStorage.getItem("favorites") || "";
    if (favoriteData) {
      setFavorites(JSON.parse(favoriteData) || []);
    }
    setLoading(false);
  }, []);

  console.log({ favorites });
  // const wp_api_endpoint = "http://localhost:10058/wp-json/api/lists/";
  // const wp_api_endpoint = "https://bubblybeaks.com/wp-json/api/lists";

  // Fetch data from the API and update the products state
  //   useEffect(() => {
  //     fetch('https://bubblybeaks.com/wp-json/api/lists')
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log({ data });
  //         setProducts(data);
  //         setLoading(false);
  //       })
  //       .catch((error) => console.dir(error));
  //   }, []);

  // Generate an array of categories based on the products state
  const categories = products
    .map((product) => product.category)
    .flat()
    .filter((category, index, array) => array.indexOf(category) === index);

  // Create a new array of products based on the selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category.includes(selectedCategory))
    : products;

  // Handle category selection by updating the selectedCategory state
  function handleCategorySelection(category) {
    setSelectedCategory(category);
  }

  // Handle favorite product selection by updating the favorites state and storing in localStorage
  function handleFavoriteSelection(id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const updatedFavorites = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  }

  // Update localStorage when the favorites state changes
  // This is not a good way
  //   useEffect(() => {
  //     localStorage.setItem('favorites', JSON.stringify(favorites));
  //   }, [favorites]);

  // If the products are still loading, display a loading message
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <nav className="product-categories">
        <div className="category-column">
          <ul>
            <li
              onClick={() => handleCategorySelection("")}
              className={selectedCategory === "" ? "active" : ""}
              key="all"
            >
              All
            </li>
            {categories.map((category) => (
              <li
                key={category}
                onClick={() => handleCategorySelection(category)}
                className={selectedCategory === category ? "active" : ""}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section className="products">
        <div className="product-list">
          {filteredProducts.map((product) => (
            <Product
              key={product.id}
              product={product}
              handleFavoriteSelection={handleFavoriteSelection}
              favorites={favorites}
            />
          ))}
        </div>
      </section>

      <section className="products">
        <h3>Favorites</h3>
        {favorites.length > 0 ? (
          favorites.map((favorite) => {
            const favoriteProduct = products.find((p) => p.id === favorite);
            return favoriteProduct ? (
              <article key={favoriteProduct.id} className="product">
                <figure className="product-feature">
                  <Image
                    src={favoriteProduct.image}
                    alt={favoriteProduct.title}
                    height={100}
                    width={100}
                  />
                </figure>
                <section className="product-data">
                  <div className="product-header">
                    <div className="product-header-left">
                      <small className="product-kicker">
                        {favoriteProduct.brand}
                      </small>
                      <h6 className="product-title">{favoriteProduct.title}</h6>
                    </div>
                    <div className="product-header-right">Reviewss</div>
                  </div>
                  <div className="product-body">
                    <p className="product-description">
                      {favoriteProduct.description}
                    </p>
                  </div>

                  <div className="product-buttons-wrapper">
                    <section className="product-buttons">
                      <div
                        className="product-fav-button"
                        onClick={() =>
                          handleFavoriteSelection(favoriteProduct.id)
                        }
                      >
                        {favorites.includes(favoriteProduct.id) ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                          >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                          </svg>
                        )}
                      </div>

                      {favoriteProduct.post && (
                        <a
                          href={favoriteProduct.post}
                          target="_blank"
                          className="product-more-button"
                        >
                          Review
                        </a>
                      )}

                      <a
                        className="product-buy-button"
                        href={favoriteProduct.link.url}
                        title={favoriteProduct.link.title}
                        target={favoriteProduct.link.target}
                      >
                        {favoriteProduct.link.title
                          ? favoriteProduct.link.title
                          : "Buy Now"}
                      </a>
                    </section>
                  </div>
                </section>
              </article>
            ) : null;
          })
        ) : (
          <p>No favorite products yet</p>
        )}
      </section>
    </div>
  );
}

export default Products;
