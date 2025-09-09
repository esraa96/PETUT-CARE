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
    <div className="max-w-7xl mx-auto px-4 pb-24 mt-20">
      <div className="sticky top-0 bg-white dark:bg-[#313340] z-10 p-4 border-b rounded-xl shadow-md border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="text-neutral dark:text-white text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl dark:text-white font-bold">Shopping Cart</h1>
          {items.length > 0 && (
            <button 
              onClick={handleClearCart}
              className="text-red-500 text-sm font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-xl dark:text-white font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/catalog" className="btn-primary-app py-2 px-6">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="py-6">
          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            {items.map(item => (
              <div key={item.id} className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="w-24 flex-shrink-0">
                  <img 
                    src={item.imageUrl || item.imageURL}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x300/E0E0E0/666666?text=${encodeURIComponent(item.productName || 'Product')}`;
                    }}
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex justify-between">
                    <h3 className="font-semibold dark:text-white">{item.productName}</h3>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 dark:text-gray-200 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.description.substring(0, 60)}...</p>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-300"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold dark:text-white">{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Order Summary */}
          <div className="bg-white dark:bg-[#313340] rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <h3 className="font-semibold dark:text-white mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-white">Subtotal ({totalQuantity} items)</span>
                <span className="dark:text-white">{totalAmount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-white">Shipping</span>
                <span className="dark:text-white">Free</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="dark:text-white">Total</span>
                  <span className="dark:text-white">{finalAmount.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button 
            onClick={handleCheckout}
            className="w-full py-3 bg-primary_app text-white font-semibold rounded-lg hover:bg-primary_app/90 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  )
}

export default CartPage
