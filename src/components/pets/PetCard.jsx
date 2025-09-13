import React from 'react';

const PetCard = ({ pet, onSelect }) => (
  <div
    className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700 p-6"
    onClick={onSelect}
  >
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary_app/5 via-transparent to-primary_app/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="flex items-center gap-4 relative z-10">
      {/* Pet Image */}
      <div className="relative">
        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-primary_app/10 to-primary_app/20">
          <img
            src={pet.picture || 'https://i.ibb.co/2v7v7xG/paw-print.png'}
            alt={pet.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Pet type badge */}
        <div className="absolute -top-2 -right-2 bg-primary_app text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
          {pet.type?.charAt(0)?.toUpperCase() || '🐾'}
        </div>
      </div>

      {/* Pet Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary_app transition-colors duration-300">
            {pet.name}
          </h3>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-primary_app/10 rounded-lg">
            <span className="text-primary_app text-sm">🐾</span>
          </div>
          <span className="text-gray-600 dark:text-gray-300 capitalize font-medium">
            {pet.type}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            <span className="text-gray-500 dark:text-gray-400">🎂</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {pet.age} years
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            <span className="text-gray-500 dark:text-gray-400">⚖️</span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {pet.weight} kg
            </span>
          </div>
        </div>
      </div>
      
      {/* Arrow */}
      <div className="flex-shrink-0">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-primary_app group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

export default PetCard;
