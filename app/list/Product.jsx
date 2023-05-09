import Image from "next/image";
/* eslint-disable @next/next/no-img-element */
function Product({ product, handleFavoriteSelection, favorites }) {
  return (
    <article key={product.id} className="product">
      <figure className="product-feature">
        <Image
          src={product.image}
          alt={product.title}
          height={100}
          width={100}
        />
      </figure>
      <section className="product-data">
        <div className="product-header">
          <div className="product-header-left">
            <small className="product-kicker">{product.brand}</small>
            <h6 className="product-title">{product.title}</h6>
          </div>
          <div className="product-header-right">Reviewss</div>
        </div>
        <div className="product-body">
          <p className="product-description">{product.description}</p>
        </div>

        <div className="product-buttons-wrapper">
          <section className="product-buttons">
            <div
              className="product-fav-button"
              onClick={() => handleFavoriteSelection(product.id)}
            >
              {favorites.includes(product.id) ? (
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

            {product.post && (
              <a
                href={product.post}
                target="_blank"
                className="product-more-button"
              >
                Review
              </a>
            )}

            <a
              className="product-buy-button"
              href={product.link.url}
              title={product.link.title}
              target={product.link.target}
            >
              {product.link.title ? product.link.title : "Buy Now"}
            </a>
          </section>
        </div>
      </section>
    </article>
  );
}

export default Product;
