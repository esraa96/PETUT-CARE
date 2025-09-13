@echo off
echo Deploying Firestore rules fix for doctor registration...
firebase deploy --only firestore:rules
echo.
echo Rules deployed successfully!
echo Doctors should now be able to create accounts properly.
pause