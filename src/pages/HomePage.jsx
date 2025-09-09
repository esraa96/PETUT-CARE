// src/pages/HomePage.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../store/slices/catalogSlice"; // Import the new thunk
import ProductCard from "../components/ProductCard";
import { addToCart } from "../store/slices/cartSlice";
import LoadingAnimation from "../components/common/LoadingAnimation.jsx";
import {
  RiHeartPulseLine,
  RiScissorsLine,
  RiHomeHeartLine,
  RiPhoneLine,
  RiMedicineBottleLine,
  RiTruckLine,
  RiStarFill
} from 'react-icons/ri';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.catalog);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Data from the new design
  const services = [
    {
      icon: RiHeartPulseLine,
      title: 'Veterinary Care',
      description: 'Comprehensive health checkups, vaccinations, and medical treatments by experienced veterinarians.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20veterinarian%20examining%20a%20friendly%20dog%20with%20stethoscope%20in%20modern%20clinic%2C%20bright%20clean%20environment%20with%20medical%20equipment%2C%20caring%20hands%20holding%20pet%20gently%2C%20professional%20healthcare%20setting&width=600&height=400&seq=vet-care&orientation=landscape'
    },
    {
      icon: RiScissorsLine,
      title: 'Pet Grooming',
      description: 'Professional grooming services including baths, haircuts, nail trimming, and styling for all breeds.',
      image: 'https://readdy.ai/api/search-image?query=Cute%20fluffy%20dog%20being%20groomed%20by%20professional%20groomer%2C%20clean%20salon%20environment%20with%20grooming%20tools%2C%20dog%20looking%20happy%20and%20relaxed%2C%20bright%20lighting%20with%20modern%20grooming%20station&width=600&height=400&seq=grooming&orientation=landscape'
    },
    {
      icon: RiHomeHeartLine,
      title: 'Pet Boarding',
      description: 'Safe and comfortable boarding facilities with spacious rooms, playtime, and personalized care.',
      image: 'https://readdy.ai/api/search-image?query=Cozy%20pet%20boarding%20facility%20with%20multiple%20cats%20and%20dogs%20playing%20together%2C%20clean%20modern%20kennels%20with%20comfortable%20beds%2C%20supervised%20playtime%20in%20bright%20spacious%20area&width=600&height=400&seq=boarding&orientation=landscape'
    },
    {
      icon: RiPhoneLine,
      title: '24/7 Emergency',
      description: 'Round-the-clock emergency services for urgent pet health situations and critical care needs.',
      image: 'https://readdy.ai/api/search-image?query=Emergency%20veterinary%20clinic%20at%20night%20with%20bright%20lights%2C%20medical%20equipment%20ready%2C%20professional%20staff%20attending%20to%20pets%2C%20urgent%20care%20atmosphere%20with%20modern%20emergency%20room%20setup&width=600&height=400&seq=emergency&orientation=landscape'
    },
    {
      icon: RiMedicineBottleLine,
      title: 'Dental Care',
      description: 'Complete dental services including cleanings, extractions, and oral health maintenance programs.',
      image: 'https://readdy.ai/api/search-image?query=Veterinary%20dental%20examination%20of%20dog%20showing%20healthy%20teeth%2C%20professional%20dental%20tools%20and%20equipment%2C%20clean%20clinical%20environment%20with%20dental%20care%20setup%20visible&width=600&height=400&seq=dental&orientation=landscape'
    },
    {
      icon: RiTruckLine,
      title: 'Mobile Services',
      description: 'Convenient at-home visits for routine checkups, vaccinations, and basic care services.',
      image: 'https://readdy.ai/api/search-image?query=Mobile%20veterinary%20van%20parked%20outside%20house%2C%20professional%20vet%20carrying%20medical%20bag%2C%20pet%20owner%20with%20happy%20dog%20waiting%2C%20suburban%20neighborhood%20setting%20with%20friendly%20atmosphere&width=600&height=400&seq=mobile&orientation=landscape'
    }
  ];

  const testimonials = [
    {
      name: 'Jennifer Martinez',
      location: 'Dog Owner',
      rating: 5,
      comment: 'The team saved my golden retriever Max when he had a serious health scare. The emergency care was exceptional, and their follow-up support has been amazing. I trust them completely with my pets.',
      petImage: 'https://readdy.ai/api/search-image?query=Happy%20golden%20retriever%20dog%20sitting%20in%20sunny%20park%2C%20healthy%20and%20energetic%20appearance%2C%20bright%20natural%20lighting%2C%20beautiful%20outdoor%20background%20with%20trees%20and%20grass&width=300&height=300&seq=pet-max&orientation=squarish'
    },
    {
      name: 'Robert Chen',
      location: 'Cat Owner',
      rating: 5,
      comment: 'The grooming service here is fantastic! My Persian cat Luna always comes back looking beautiful and smelling great. The staff is so gentle and patient with her, making the whole experience stress-free.',
      petImage: 'https://readdy.ai/api/search-image?query=Beautiful%20fluffy%20Persian%20cat%20with%20long%20white%20fur%2C%20sitting%20elegantly%20on%20soft%20cushion%2C%20well-groomed%20appearance%2C%20bright%20studio%20lighting%20with%20clean%20background&width=300&height=300&seq=pet-luna&orientation=squarish'
    },
    {
      name: 'Amanda Thompson',
      location: 'Multiple Pet Owner',
      rating: 5,
      comment: 'Having three dogs and two cats means frequent visits to the vet. PetCare+ makes it so convenient with their comprehensive services. From routine checkups to boarding, they handle everything professionally.',
      petImage: 'https://readdy.ai/api/search-image?query=Group%20of%20happy%20pets%20including%20dogs%20and%20cats%20sitting%20together%2C%20mixed%20breeds%20looking%20healthy%20and%20well-cared%20for%2C%20bright%20veterinary%20clinic%20background&width=300&height=300&seq=multiple-pets&orientation=squarish'
    },
  ];

  return (
    <div className="min-h-screen  ">
      {/* Hero Section */}
      <section
        className="relative min-h-screen bg-cover bg-center flex items-center animate-fade-in"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Happy%20golden%20retriever%20and%20persian%20cat%20playing%20together%20in%20a%20bright%20veterinary%20clinic%20with%20modern%20equipment%2C%20soft%20natural%20lighting%2C%20clean%20white%20background%20with%20plants%2C%20professional%20pet%20care%20atmosphere%2C%20warm%20and%20welcoming%20environment%20with%20medical%20tools%20visible%20in%20background&width=1920&height=1080&seq=hero-bg&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Premium Care for Your Beloved Pets
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Professional veterinary services, grooming, and boarding with 24/7 emergency care. Your pet's health and happiness is our top priority.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/clinics" className="btn-primary-app px-8 py-4 rounded-full text-lg font-semibold">
                Schedule Appointment
              </Link>
              <Link to="/clinics" className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-neutral transition-colors">
                Emergency Care
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral dark:text-white mb-4">
              Complete Pet Care Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From routine checkups to emergency care, we provide comprehensive services to keep your pets healthy and happy throughout their lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card cursor-pointer hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 bg-secondary-light dark:bg-secondary-dark rounded-xl flex items-center justify-center mb-4">
                    <service.icon className="text-2xl text-primary_app" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral dark:text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Integrated from old component */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral dark:text-white">Featured Products</h2>
            <Link to="/catalog" className="text-primary_app hover:underline font-semibold">
              View All
            </Link>
          </div>

          {error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary-light dark:bg-secondary-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral dark:text-white mb-4">
              What Pet Parents Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers and their beloved pets have to say about our services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial.petImage}
                      alt="Pet"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral dark:text-white">{testimonial.name}</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <RiStarFill key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>

                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="btn-primary-app px-8 py-3 font-semibold">
              Read More Reviews
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;