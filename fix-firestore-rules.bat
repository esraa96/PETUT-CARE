@echo off
echo Deploying Firestore rules...
firebase deploy --only firestore:rules
echo.
echo Firestore rules deployed successfully!
echo.
echo The following permissions are now available:
echo - Doctors can read/write their own bookings
echo - Doctors can read user information for patients
echo - Doctors can manage their own clinics
echo - All authenticated users can access necessary data
echo.
pause