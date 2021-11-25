import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Location from "expo-location";
import { LocationObject } from "expo-location";

export const initialRegion = {
  latitude: -23.7,
  longitude: -46.6,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export const initialCoods = {
  timestamp:new Date().getTime(),
  coords:{
    latitude:initialRegion.latitude,
    longitude:initialRegion.longitude,
    altitude: null, 
    accuracy: null, 
    altitudeAccuracy: null, 
    heading: null, 
    speed: null
  }
}


export async function getLocation():Promise<LocationObject> {

  if (Platform.OS === 'android' && !Constants.isDevice) {
    console.log(
      'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
    );
    return initialCoods;
  }
  /* @end */
  let { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return initialCoods;
  }

  let location = await Location.getCurrentPositionAsync({});
  return location
  
}