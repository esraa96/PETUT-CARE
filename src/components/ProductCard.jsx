import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    if (onToggleFavorite) {
      onToggleFavorite(product);
    }
  };
  return (
    <div className="card hover:shadow-lg transition-shadow flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="h-full flex flex-col">
        <div className="relative pb-[100%] overflow-hidden">
          <img
            src={product.imageUrl || product.imageURL}
            alt={product.productName || product.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x300/E0E0E0/666666?text=${encodeURIComponent(product.productName || 'Product')}`;
            }}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3
              className="font-semibold text-lg dark:text-white truncate mr-2"
              title={product.productName}
            >
              {product.productName}
            </h3>
            {onToggleFavorite ? (
              <button
                onClick={handleToggleFavorite}
                className={`${
                  isFavorite
                    ? "text-primary_app"
                    : "text-gray-400 hover:text-primary_app"
                } focus:outline-none transition-colors flex-shrink-0`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill={isFavorite ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={isFavorite ? 0 : 2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            ) : (
              <span className="badge-secondary whitespace-nowrap">
                {product.category}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-grow min-h-[40px]">
            {product.description}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <span className="font-bold text-lg dark:text-white">
              $
              {typeof product.price === "number"
                ? product.price.toFixed(2)
                : typeof product.price === "string"
                ? parseFloat(product.price).toFixed(2)
                : "0.00"}
            </span>
            <button onClick={handleAddToCart} className="btn-primary-app py-1 px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
