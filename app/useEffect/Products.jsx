'use client';

import { useEffect, useState } from 'react';

// import { getData } from "../api/wordpress";

function Products({ products }) {
  // Set up state variables for products, selected category, favorites, and loading
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setLoading(true);
    const favoriteData = localStorage.getItem('favorites') || '';
    if (favoriteData) {
      setFavorites(JSON.parse(favoriteData) || []);
    }
    setLoading(false);
  }, []);

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
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  }

  // This is not a good way
  // Update localStorage when the favorites state changes
  //   useEffect(() => {
  //     localStorage.setItem('favorites', JSON.stringify(favorites));
  //   }, [favorites]);

  // If the products are still loading, display a loading message
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="main">
      <div>
        <nav className="product-categories">
          <div className="category-column">
            <ul>
              <li
                onClick={() => handleCategorySelection('')}
                className={selectedCategory === '' ? 'active' : ''}
                key="all"
              >
                All
              </li>
              {categories.map((category) => (
                <li
                  key={category}
                  onClick={() => handleCategorySelection(category)}
                  className={selectedCategory === category ? 'active' : ''}
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
              <h6 key={product.id} className="product-title">
                {product.title}
              </h6>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Products;
