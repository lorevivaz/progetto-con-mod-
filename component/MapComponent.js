import * as Location from 'expo-location';
import { Alert } from 'react-native';
import React, { useState } from 'react';

// const [location, setLocation] = useState(null);

export async function locationPermissionAsync() {
    let canUseLocation = false;
    const grantedPermission = await Location.getForegroundPermissionsAsync();
    
    if (grantedPermission.status === "granted") {
        canUseLocation = true;
    } else {
        const permissionResponse = await Location.requestForegroundPermissionsAsync();
        if (permissionResponse.status === "granted") {
            canUseLocation = true;
        }
    }

    if (canUseLocation) {
        const location = await Location.getCurrentPositionAsync();
        console.log("received location:", location);

        const lat = location.coords.latitude;
        const lng = location.coords.longitude;
        console.log("lat and lng are:", lat, lng);

        return { latitude: lat, longitude: lng };
    } else {
        Alert.alert("Permission denied", "Unable to access location");
        return null;
    }
}

/*
export async function FetchLocation() {
    try {
      const currentLocation = await locationPermissionAsync();
      if (currentLocation) {
        setLocation(currentLocation);
      } else {
        // Se non è possibile ottenere la posizione, usa la posizione del dipartimento come fallback
        setLocation({
          latitude: 45.4781, // Posizione del dipartimento
          longitude: 9.2261,
        });
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }


  */