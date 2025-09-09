import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import { useAuth } from '../context/AuthContext';
import {fetchProducts} from "../store/slices/catalogSlice.js";
import LoadingAnimation from "../components/common/LoadingAnimation.jsx";

const ProductPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { products: allProducts, loading, error } = useSelector(state => state.catalog);
  const { items: favorites, status: favoritesStatus } = useSelector(state => state.favorites);
  const { currentUser } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    console.log(allProducts,productId)
    if (allProducts.length > 0 && productId) {
      const selectedProduct = allProducts.find(p => p.id.toString() === productId);
      setProduct(selectedProduct);

      if (selectedProduct) {
        const related = allProducts
          .filter(p => p.category === selectedProduct.category && p.id.toString() !== productId)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    }else {
      dispatch(fetchProducts())
    }
  }, [productId, allProducts]);

  const isFavorite = product ? favorites.some(item => item.id === product.id) : false;

  const handleToggleFavorite = () => {
    if (!currentUser) {
      // TODO: Maybe show a modal to prompt login
      alert('Please log in to add items to your favorites.');
      return;
    }

    if (isFavorite) {
      dispatch(removeFavorite({ userId: currentUser.uid, productId: product.id }));
    } else {
      dispatch(addFavorite({ userId: currentUser.uid, product }));
    }
  };

  if (loading) {
    return (
        <LoadingAnimation />
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl dark:text-white font-bold mb-4">Product not found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">The product you are looking for does not exist.</p>
        <Link to="/catalog" className="btn-primary-app">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      {/* Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white dark:bg-[#313340] p-4 rounded-lg shadow-md flex items-center justify-center">
          <img
            src={product.imageUrl || product.imageURL}
            alt={product.productName}
            className="max-w-full h-auto object-contain max-h-96"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x300/E0E0E0/666666?text=${encodeURIComponent(product.productName || 'Product')}`;
            }}
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl dark:text-white font-bold mb-2">{product.productName}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <svg
                className="w-5 h-5 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="text-lg text-gray-700 dark:text-gray-300 ml-1">
                {product.rate || "N/A"}
              </span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>

          <div className="flex items-center mb-6">
            <span className="text-3xl font-bold text-primary_app mr-4">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
              In Stock
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(addToCart(product))}
              className="btn-primary-app flex-grow"
            >
              Add to Cart
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-3 rounded-full border-2 ${
                isFavorite
                  ? "bg-primary_app text-white border-primary"
                  : "bg-white text-gray-500 border-gray-300"
              } hover:border-primary transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isFavorite ? 0 : 2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl dark:text-white font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="card hover:shadow-lg transition-shadow"
              >
                <Link to={`/product/${relatedProduct.id}`}>
                  <div className="relative pb-[100%] overflow-hidden">
                    <img
                      src={relatedProduct.imageUrl || relatedProduct.imageURL}
                      alt={relatedProduct.productName}
                      className="absolute inset-0 w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x300/E0E0E0/666666?text=${encodeURIComponent(relatedProduct.productName || 'Product')}`;
                      }}
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <h3
                    className="font-semibold dark:text-white text-lg truncate"
                    title={relatedProduct.productName}
                  >
                    <Link to={`/product/${relatedProduct.id}`}>
                      {relatedProduct.productName}
                    </Link>
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-lg dark:text-white">
                      ${relatedProduct.price.toFixed(2)}
                    </span>
                    <button className="btn-primary-app py-1 px-3">
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
