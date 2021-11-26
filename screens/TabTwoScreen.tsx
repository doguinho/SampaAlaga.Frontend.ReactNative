/* tslint:disable */
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet,  } from 'react-native';
import {features} from '../assets/shapes/flood.json';

import MapView,
{
  Geojson,
} from 'react-native-maps';

import { View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as Location from "expo-location";
import { getLocation, initialCoods, initialRegion } from "../services/utils";


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [loading, setLoading] = useState<boolean>(true)
  const [location, setLocation] = useState<Location.LocationObject>(initialCoods);

  async function fetchSituation() {
    // const response = await api.get('/regions/situation');    
    setLoading(false)
  }

  async function fetchLocation() {
    const location = await getLocation();
    setLocation(location)
  }

  useEffect(() => {
    fetchSituation()
    fetchLocation() 
  }, []);

  return (
    <>
      {loading ?
        <View style={styles.container}>
          <ActivityIndicator />
        </View> :
        <MapView
          initialRegion={initialRegion}
          style={{ ...StyleSheet.absoluteFillObject }}>

          <Geojson fillColor="rgb(255,153,0)" strokeWidth={1} 
            geojson={{ type: 'FeatureCollection', features: features as any }}></Geojson>

        </MapView>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strokeColor: {
    color: "rgba(0,0,0,0.5)"
  },

});

