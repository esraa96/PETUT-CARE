import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice'

const CartPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId))
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }))
    }
  }

  const handleApplyPromo = (e) => {
    e.preventDefault()
    // Mock promo code validation
    if (promoCode.toUpperCase() === 'SAVE20') {
      setPromoApplied(true)
      setDiscount(totalAmount * 0.2) // 20% discount
    } else {
      setPromoApplied(false)
      setDiscount(0)
    }
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart())
    }
  }

  const handleCheckout = () => {
    // In a real app, this would navigate to a checkout page
    navigate('/delivery')
  }

  // Calculate final amount after discount
  const finalAmount = totalAmount - discount

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary_app/10 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary_app" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
              {items.length > 0 && (
                <div className="bg-primary_app text-white px-3 py-1 rounded-full text-sm font-bold">
                  {totalQuantity}
                </div>
              )}
            </div>
            
            {items.length > 0 && (
              <button 
                onClick={handleClearCart}
                className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-primary_app/20 to-primary_app/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary_app" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-400 text-lg">0</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">Discover amazing products for your pets and add them to your cart to get started!</p>
            <Link to="/catalog" className="bg-primary_app hover:bg-primary_app/90 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
              <i className="fas fa-shopping-bag"></i> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-primary_app rounded-full"></span>
                  Cart Items ({items.length})
                </h2>
                
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="group bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative">
                          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white dark:bg-gray-600 shadow-md">
                            <img 
                              src={item.imageUrl || item.imageURL}
                              alt={item.productName}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/400x400/F3F4F6/9CA3AF?text=${encodeURIComponent(item.productName || 'Product')}`;
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate pr-4">{item.productName}</h3>
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex-shrink-0"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                          
                          <div className="flex justify-between items-center">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-white dark:bg-gray-600 rounded-xl shadow-sm border border-gray-200 dark:border-gray-500">
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-l-xl transition-colors"
                              >
                                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="px-4 py-2 font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-r-xl transition-colors"
                              >
                                <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Price */}
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary_app">${(item.price * item.quantity).toFixed(2)}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">${item.price.toFixed(2)} each</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    Order Summary
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal ({totalQuantity} items)</span>
                      <span className="font-semibold text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400 font-semibold">Free</span>
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <i className="fas fa-truck-fast"></i> Fast Delivery
                        </div>
                      </div>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-green-600 dark:text-green-400">Discount</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                        <span className="text-2xl font-bold text-primary_app">${finalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-primary_app to-primary_app/80 hover:from-primary_app/90 hover:to-primary_app/70 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-4 flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-shopping-cart"></i> Proceed to Checkout
                  </button>
                  
                  <div className="text-center">
                    <Link to="/catalog" className="text-primary_app hover:text-primary_app/80 font-medium text-sm transition-colors">
                      ← Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
