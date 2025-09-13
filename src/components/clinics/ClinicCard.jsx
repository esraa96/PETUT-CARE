import React from "react";
const ClinicCard = ({ clinic, onClick, userLocation }) => {
  const rating = clinic.rating || 0;
  const doctorName = clinic.doctorName || "No Doctor Assigned";
  const isValidDoctor = clinic.isValidDoctor !== false;
  const distanceText = clinic.formattedDistance || "Distance unknown";
  const hasDistance = clinic.distance !== null && clinic.distance !== undefined;

  let displayAddress = "Unknown Address";
  if (clinic.address && typeof clinic.address === "string") {
    displayAddress = clinic.address;
  } else if (
    clinic.address &&
    typeof clinic.address === "object" &&
    clinic.address.city &&
    clinic.address.governorate
  ) {
    displayAddress = `${clinic.address.city}, ${clinic.address.governorate}`;
  }

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700 p-6"
      onClick={onClick}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary_app/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex gap-6 items-center relative z-10">
        {/* Clinic Image */}
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary_app/10 to-primary_app/20 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            {clinic.profileImage ? (
              <img
                src={clinic.profileImage}
                alt="Clinic"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <span className="material-icons text-primary_app text-4xl">
                local_hospital
              </span>
            )}
          </div>
          
          {/* Status indicator */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg">
            <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Clinic Name */}
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary_app transition-colors duration-300 truncate">
              {clinic.clinicName || clinic.name || "Unknown Clinic Name"}
            </h3>
            {isValidDoctor && (
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <span className="material-icons text-xs">verified</span>
                <span>Verified</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="material-icons text-gray-500 dark:text-gray-400 text-lg">place</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 truncate">{displayAddress}</p>
          </div>

          {/* Doctor Info */}
          {isValidDoctor &&
            doctorName &&
            ![
              "No Doctor Assigned",
              "Not a Doctor",
              "Doctor Not Found",
              "Error Loading Doctor",
            ].includes(doctorName) && (
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-primary_app/10 rounded-lg">
                  <span className="material-icons text-primary_app text-lg">
                    person
                  </span>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Dr. {doctorName}
                </span>
              </div>
            )}

          {!isValidDoctor && (
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <span className="material-icons text-orange-500 text-lg">
                  warning
                </span>
              </div>
              <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                {doctorName}
              </span>
            </div>
          )}

          {/* Rating and Distance */}
          <div className="flex items-center justify-between">
            {/* Rating */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`material-icons transition-colors duration-200 ${
                    i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                  } text-lg`}
                >
                  star
                </span>
              ))}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                ({rating.toFixed(1)})
              </span>
            </div>

            {/* Distance Badge */}
            {hasDistance && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm ${
                  clinic.distance <= 5
                    ? "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                    : clinic.distance <= 15
                    ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                    : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
              >
                <span
                  className={`material-icons text-sm ${
                    clinic.distance <= 5
                      ? "text-green-600 dark:text-green-400"
                      : clinic.distance <= 15
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  near_me
                </span>
                <span
                  className={`text-sm font-semibold ${
                    clinic.distance <= 5
                      ? "text-green-700 dark:text-green-300"
                      : clinic.distance <= 15
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {distanceText}
                </span>
              </div>
            )}
          </div>

          {/* Price and Additional Info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              {clinic.price && (
                <div className="flex items-center gap-2 bg-primary_app/10 px-3 py-1 rounded-full">
                  <span className="material-icons text-primary_app text-sm">attach_money</span>
                  <span className="text-primary_app font-semibold text-sm">{clinic.price}</span>
                </div>
              )}
            </div>

            {!hasDistance && userLocation && (
              <span className="text-xs text-gray-400 italic">
                Location data unavailable
              </span>
            )}
          </div>
        </div>

        {/* Arrow Icon */}
        <div className="flex-shrink-0">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-primary_app group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
            <span className="material-icons text-xl">
              arrow_forward_ios
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicCard;
