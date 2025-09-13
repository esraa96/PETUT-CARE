import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import MapSection from "../components/clinics/MapSection";
import SearchBarWithFilter from "../components/clinics/SearchBarWithFilter";
import ClinicsList from "../components/clinics/ClinicsList";
import FilterModal from "../components/clinics/FilterModal";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

// Distance calculation utilities
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  if (!lat1 || !lng1 || !lat2 || !lng2) return null;

  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const formatDistance = (distance) => {
  if (!distance && distance !== 0) return "Distance unknown";

  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 10) {
    return `${distance}km`;
  } else {
    return `${Math.round(distance)}km`;
  }
};

const ClinicsScreen = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(50);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setUserLocation(null);
      }
    );
  }, []);

  // Real-time clinics data
  useEffect(() => {
    const q = query(collection(db, "clinics"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const clinicsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch user data for each clinic and calculate distances
      const clinicsWithUserData = await Promise.all(
        clinicsData.map(async (clinic) => {
          let clinicWithDoctor = { ...clinic };

          // Fetch doctor data if doctorId exists
          if (clinic.doctorId) {
            try {
              const userDoc = await getDoc(doc(db, "users", clinic.doctorId));
              if (userDoc.exists()) {
                const userData = userDoc.data();

                if (userData.role === "doctor") {
                  clinicWithDoctor = {
                    ...clinic,
                    doctorName:
                      userData.fullName ||
                      userData.displayName ||
                      "Unknown Doctor",
                    doctorData: userData,
                    isValidDoctor: true,
                  };
                } else {
                  console.log(
                    `User ${clinic.doctorId} is not a doctor. Role: ${userData.role}`
                  );
                  clinicWithDoctor = {
                    ...clinic,
                    doctorName: "Not a Doctor",
                    isValidDoctor: false,
                  };
                }
              } else {
                console.log(
                  `User document not found for doctorId: ${clinic.doctorId}`
                );
                clinicWithDoctor = {
                  ...clinic,
                  doctorName: "Doctor Not Found",
                  isValidDoctor: false,
                };
              }
            } catch (error) {
              console.error(
                `Error fetching user data for doctorId ${clinic.doctorId}:`,
                error
              );
              clinicWithDoctor = {
                ...clinic,
                doctorName: "Error Loading Doctor",
                isValidDoctor: false,
              };
            }
          } else {
            console.log(`Clinic ${clinic.id} has no doctorId field`);
            clinicWithDoctor = {
              ...clinic,
              doctorName: "No Doctor Assigned",
              isValidDoctor: false,
            };
          }

          // Calculate distance if user location and clinic coordinates are available
          if (userLocation && clinic.latitude && clinic.longitude) {
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              clinic.latitude,
              clinic.longitude
            );
            clinicWithDoctor.distance = distance;
            clinicWithDoctor.formattedDistance = formatDistance(distance);
          } else {
            clinicWithDoctor.distance = null;
            clinicWithDoctor.formattedDistance = "Distance unknown";
          }

          return clinicWithDoctor;
        })
      );

      setClinics(clinicsWithUserData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userLocation]); // Re-run when user location changes

  const filteredClinics = clinics
    .filter((c) => {
      // Only show clinics with valid doctors (role = "doctor")
      const hasValidDoctor = c.isValidDoctor !== false;

      const name = (c.clinicName || "") + (c.doctorName || "");
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
      const matchesRating = (c.rating || 0) >= minRating;

      // Don't filter by distance - keep all clinics, just sort them

      return hasValidDoctor && matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === "distance") {
        // Sort by distance if both have distance data
        if (a.distance !== null && b.distance !== null) {
          return a.distance - b.distance;
        }
        // Clinics with unknown distance go to the end
        if (a.distance === null && b.distance !== null) return 1;
        if (a.distance !== null && b.distance === null) return -1;

        return 0;
      } else if (sortBy === "price_asc") {
        return (a.price || 0) - (b.price || 0);
      } else if (sortBy === "price_desc") {
        return (b.price || 0) - (a.price || 0);
      } else if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });

  const handleClinicClick = (clinic) => {
    navigate("/ClinicDetailsScreen", { state: { clinic } });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-primary shadow-lg">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="flex items-center gap-4 mb-4 md:mb-8">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm hover:scale-110"
            >
              <span className="material-icons text-white text-lg md:text-xl">
                arrow_back
              </span>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3">
                Find Your Perfect Vet
              </h1>
              <p className="text-base md:text-lg text-white/90 max-w-2xl">
                Discover trusted veterinary clinics near you with expert care
                for your beloved pets
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="mb-6 md:mb-8 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl bg-white dark:bg-gray-800 border border-primary">
          <div className="p-4 md:p-6 bg-gradient-to-r from-primary/5 to-secondary-light dark:from-primary/10 dark:to-gray-700">
            <h2 className="text-lg md:text-2xl font-bold text-neutral dark:text-white mb-2 md:mb-4 flex items-center gap-2 md:gap-3">
              <span className="material-icons text-primary text-lg md:text-2xl">
                location_on
              </span>
              Nearby Veterinary Clinics
              {userLocation && (
                <span className="text-sm md:text-base font-normal text-green-600 dark:text-green-400">
                  (Location detected)
                </span>
              )}
            </h2>
            <MapSection userLocation={userLocation} />
          </div>
        </div>

        <div className="mb-6 md:mb-8 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-4 md:p-8 border border-primary">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between">
            <div className="flex-1">
              <SearchBarWithFilter
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFilterClick={() => setFilterOpen(true)}
              />
            </div>
          </div>

          {!loading && (
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-primary">
              <div className="flex items-center justify-between">
                <p className="text-base md:text-lg text-neutral dark:text-white flex items-center gap-2">
                  <span className="material-icons text-primary text-base md:text-xl">
                    veterinary
                  </span>
                  Found{" "}
                  <span className="font-bold text-primary">
                    {filteredClinics.length}
                  </span>{" "}
                  veterinary clinic
                  {filteredClinics.length !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  <span className="material-icons text-xs md:text-sm">
                    location_on
                  </span>
                  <span>
                    {userLocation
                      ? "Near your location"
                      : "Location unavailable"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clinics List */}
        <div className="pb-10 md:pb-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-20 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl">
              <div className="relative mb-4 md:mb-6">
                <div className="w-12 md:w-20 h-12 md:h-20 border-4 border-primary/20 rounded-full animate-spin">
                  <div className="absolute top-0 left-0 w-4 md:w-6 h-4 md:h-6 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-neutral dark:text-white mb-1 md:mb-2">
                Finding Veterinary Clinics
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center max-w-md text-sm md:text-base">
                We're searching for the best veterinary clinics near you. This
                may take a moment.
              </p>
            </div>
          ) : filteredClinics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-20 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl">
              <div className="w-12 md:w-20 h-12 md:h-20 bg-gradient-to-br from-primary/10 to-secondary-light dark:from-primary/20 dark:to-gray-700 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <span className="material-icons text-primary text-2xl md:text-3xl">
                  search_off
                </span>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-neutral dark:text-white mb-2 md:mb-3">
                No clinics found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-4 md:mb-6 text-sm md:text-base">
                We couldn't find any veterinary clinics matching your criteria.
                Try adjusting your search terms or filters.
              </p>
              <button
                onClick={() => setFilterOpen(true)}
                className="bg-primary text-white px-6 md:px-8 py-2 md:py-3 rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
              >
                Adjust Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-neutral dark:text-white">
                  Available Clinics
                </h2>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  <span className="material-icons text-xs md:text-sm">
                    sort
                  </span>
                  <span>
                    Sorted by{" "}
                    {sortBy === "distance"
                      ? "distance"
                      : sortBy === "rating"
                      ? "rating"
                      : "price"}
                  </span>
                </div>
              </div>
              <ClinicsList
                clinics={filteredClinics}
                onClinicClick={handleClinicClick}
                userLocation={userLocation}
              />
            </div>
          )}
        </div>
      </div>
      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        sortBy={sortBy}
        setSortBy={setSortBy}
        minRating={minRating}
        setMinRating={setMinRating}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        userLocation={userLocation}
      />
    </div>
  );
};

export default ClinicsScreen;
