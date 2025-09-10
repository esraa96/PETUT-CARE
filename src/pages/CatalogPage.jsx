import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  setSelectedCategories,
  setSelectedBrands,
  setPriceRange,
  setRating,
} from '../store/slices/filterSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import {fetchProducts} from "../store/slices/catalogSlice.js";
import SearchBar from "../components/search/SearchBar.jsx";
import LoadingAnimation from "../components/common/LoadingAnimation.jsx";
import { Pagination } from 'flowbite-react';

// Custom hook to detect mobile/tablet view
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // 1024px is the lg breakpoint in Tailwind

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const CatalogPage = () => {
    const dispatch = useDispatch();
  const location = useLocation();
  const filters = useSelector((state) => state.filter);
  const { products, loading, error } = useSelector(state => state.catalog)
  const { items: favorites } = useSelector(state => state.favorites);
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('all')
  const [categories, setCategories] = useState([])
  const [inputValue, setInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const productsPerPage = isMobile ? 15 : 20;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const performSearch = (value) => {
    console.log('Searching for:', value);
  };

  const handleClearInput = () => {
    setInputValue('');
  };

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category))]
      setCategories(uniqueCategories)
    }else {
      dispatch(fetchProducts())
    }

    }, [products, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categories = params.getAll('category');
    const brands = params.getAll('brand');
    const priceMin = params.get('price_min');
    const priceMax = params.get('price_max');
    const rating = params.get('rating');
    const sort = params.get('sort');

    // Always update the filters based on the URL, dispatching defaults if params are absent
    dispatch(setSelectedCategories(categories));
    dispatch(setSelectedBrands(brands));

    if (priceMin && priceMax) {
      dispatch(setPriceRange({ min: parseInt(priceMin, 10), max: parseInt(priceMax, 10) }));
    } else {
      // Reset to a default that includes all prices if not specified
      dispatch(setPriceRange({ min: 0, max: 10000 }));
    }

    if (rating) {
      dispatch(setRating(parseInt(rating, 10)));
    } else {
      dispatch(setRating(0)); // A rating of 0 means no filter
    }

    if (sort) {
      // This assumes you have a setSortOption in filterSlice
      // dispatch(setSortOption(sort));
    }

  }, [location.search, dispatch]);

  const toggleFavorite = (product) => {
    if (!currentUser) {
      alert('Please log in to manage your favorites.');
      return;
    }
    const isFavorite = favorites.some(item => item.id === product.id);
    if (isFavorite) {
      dispatch(removeFavorite({ userId: currentUser.uid, productId: product.id }));
    } else {
      dispatch(addFavorite({ userId: currentUser.uid, product }));
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
  }

  const filteredProducts = products.filter((product) => {
    const { selectedCategories, selectedBrands, priceRange, rating } = filters;

    // Search filter
    if (inputValue && !product.productName.toLowerCase().includes(inputValue.toLowerCase())) {
      return false;
    }

    // Category filter from Redux state
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }

    // Brand filter from Redux state
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }

    // Price range filter from Redux state
    if (product.price < priceRange.min || product.price > priceRange.max) {
      return false;
    }

    // Rating filter from Redux state
    if (rating > 0 && product.rating < rating) {
      return false;
    }
    
    // Local category tab filter
    if (activeTab !== 'all' && product.category.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, activeTab, inputValue]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral dark:text-white mb-2">Product Catalog</h1>
            <p className="text-gray-600 dark:text-gray-300">Discover premium pet care products for your beloved companions</p>
          </div>
          <div className="flex space-x-3">
            <Link 
              to="/search" 
              className="p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary_app hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-sm transition-all duration-200"
              title="Search Products"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link 
              to="/favorites" 
              className="p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary_app hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg shadow-sm transition-all duration-200"
              title="My Favorites"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="bg-gradient-to-r from-primary_app to-petut-orange-600 text-white rounded-2xl p-6 mb-8 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-3xl sm:text-4xl font-bold mb-2">20% OFF</div>
              <div className="text-lg mb-1">on all pet products</div>
              <div className="text-sm opacity-90">Limited Time Offer - Use code: PETCARE20</div>
              <button className="mt-4 px-6 py-2 bg-white text-primary_app rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200">
                Shop Now
              </button>
            </div>
            <div className="hidden sm:block w-32 h-32 relative">
              <img 
                src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg" 
                alt="Happy Cat" 
                className="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-white/20"
              />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        <div className="mb-8">
          <SearchBar
            value={inputValue}
            onChange={handleInputChange}
            onSearch={performSearch}
            onClear={handleClearInput}
          />
        </div>
        {/* Category Tabs */}
        <div className="flex overflow-x-auto space-x-3 mb-8 pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('all')} 
            className={`px-6 py-3 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
              activeTab === 'all' 
                ? 'bg-primary_app text-white shadow-lg shadow-primary_app/30' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
            }`}
          >
            All Products
          </button>
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setActiveTab(category)} 
              className={`px-6 py-3 rounded-full whitespace-nowrap capitalize font-medium transition-all duration-200 ${
                activeTab === category 
                  ? 'bg-primary_app text-white shadow-lg shadow-primary_app/30' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingAnimation />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto">
              <div className="text-red-500 text-lg font-medium mb-2">Error Loading Products</div>
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.length > 0 ? (
                currentProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.some(item => item.id === product.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Products Found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't find any products matching your current filters. Try adjusting your search criteria.</p>
                    <button 
                      onClick={() => {
                        setActiveTab('all');
                        setInputValue('');
                      }}
                      className="px-6 py-3 bg-primary_app text-white rounded-lg hover:bg-primary_app/90 transition-colors duration-200 font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    showIcons
                    previousLabel=""
                    nextLabel=""
                    className="pagination"
                    theme={{
                      pages: {
                        base: "inline-flex items-center -space-x-px",
                        showIcon: "inline-flex"
                      },
                      pageItem: {
                        base: "flex items-center justify-center px-3 h-10 leading-tight text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-colors duration-200",
                        active: "z-10 flex items-center justify-center px-3 h-10 leading-tight text-white bg-primary_app border border-primary_app hover:bg-primary_app/90"
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Filters Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <Link 
            to="/filters"
            className="bg-primary_app text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:bg-primary_app/90 hover:scale-110 transition-all duration-300"
            title="Advanced Filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CatalogPage
