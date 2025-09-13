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
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700 h-full flex flex-col">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
      
      <Link to={`/product/${product.id}`} className="h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="aspect-square relative">
            <img
              src={product.imageUrl || product.imageURL}
              alt={product.productName || product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/400x400/F3F4F6/9CA3AF?text=${encodeURIComponent(product.productName || 'Product')}`;
              }}
            />
            
            {/* Category Badge */}
            {!onToggleFavorite && (
              <div className="absolute top-3 left-3 z-20">
                <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  {product.category}
                </span>
              </div>
            )}
            
            {/* Favorite Button */}
            {onToggleFavorite && (
              <button
                onClick={handleToggleFavorite}
                className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
                  isFavorite
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                    : "bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Title */}
          <h3
            className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary_app transition-colors duration-300"
            title={product.productName}
          >
            {product.productName}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow leading-relaxed">
            {product.description}
          </p>
          
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary_app">
                $
                {typeof product.price === "number"
                  ? product.price.toFixed(2)
                  : typeof product.price === "string"
                  ? parseFloat(product.price).toFixed(2)
                  : "0.00"}
              </span>
            </div>
            
            <button 
              onClick={handleAddToCart} 
              className="bg-primary_app hover:bg-primary_app/90 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group/btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-300 group-hover/btn:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
