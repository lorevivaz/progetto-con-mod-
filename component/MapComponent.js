import * as Location from "expo-location";
import { Alert } from "react-native";

// const [location, setLocation] = useState(null);

export async function locationPermissionAsync() {
  let canUseLocation = false;
  const grantedPermission = await Location.getForegroundPermissionsAsync();

  if (grantedPermission.status === "granted") {
    canUseLocation = true;
  } else {
    const permissionResponse =
      await Location.requestForegroundPermissionsAsync();
    if (permissionResponse.status === "granted") {
      canUseLocation = true;
    }
  }

  if (canUseLocation) {
    const location = await Location.getCurrentPositionAsync();
    // console.log("received location:", location);

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;
    //console.log("lat and lng are:", lat, lng);

    return { latitude: lat, longitude: lng };
  } else {
    Alert.alert("Permission denied", "Unable to access location");
    return null;
  }
}
