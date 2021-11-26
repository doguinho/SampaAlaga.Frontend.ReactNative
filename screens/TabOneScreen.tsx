import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from 'react-native';
import { subprefeituras } from '../assets/shapes/subprefeituras';
import { api } from "../services/api";

import MapView,
{
  Geojson,
  Callout,
  Marker
} from 'react-native-maps';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as Location from "expo-location";
import { getLocation, initialCoods, initialRegion } from "../services/utils";
import { Situation } from "../models/situation";


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [loading, setLoading] = useState<boolean>(true)
  const [normal, setNormal] = useState<any[]>([])
  const [attention, setAttention] = useState<any[]>([])
  const [alert, setAlert] = useState<any[]>([])
  const [overflow, setOverflow] = useState<any[]>([])
  const [location, setLocation] = useState<Location.LocationObject>(initialCoods);

  async function fetchSituation() {
    const response = await api.get('/regions/situation');
    splitSituation(response.data)
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

  function splitSituation(situations: Situation[]) {

    let notNormal: number[] = []

    situations.forEach(
      s => {

        const features = subprefeituras.features.filter(
          sub => s.regions.includes(sub.properties.sp_cod)
        )

        notNormal = notNormal.concat(features.map(f => f.properties.sp_cod))

        switch (s.class) {
          case 'attention':
            setAttention(features)
            break;
          case 'alert':
            setAlert(features)
            break;
          case 'overflow':
            setOverflow(features)
            break;
        }

      }
    )

    setNormal(
      subprefeituras.features.filter(
        sub => !notNormal.includes(sub.properties.sp_cod)
      )
    )

  }


  return (
    <>
      {loading ?
        <View style={styles.container}>
          <ActivityIndicator />
        </View> :
        <MapView
          initialRegion={initialRegion}
          style={{ ...StyleSheet.absoluteFillObject }}>

          <Marker
            key='123'
            calloutAnchor={{
              x: 2.9,
              y: 0.8,
            }}
            coordinate={{
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
            }}
          >
            <Callout tooltip>
              <View>
                <Text>Douglas</Text>
                <Text>{normal.toString()}</Text>
              </View>
            </Callout>
          </Marker>

          <Marker
            key='1234'
            calloutAnchor={{
              x: 2.9,
              y: 0.8,
            }}
            coordinate={{
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
            }}
          >
            <Callout tooltip>
              <View>
                <Text>Douglas</Text>
                <Text>{normal.toString()}</Text>
              </View>
            </Callout>
          </Marker>

          <Geojson strokeColor={styles.strokeColor.color} fillColor="rgba(255,255,0,0.5)" strokeWidth={1}
            geojson={{ type: 'FeatureCollection', features: attention }}></Geojson>

          <Geojson strokeColor={styles.strokeColor.color} fillColor="rgb(255,153,0)" strokeWidth={1}
            geojson={{ type: 'FeatureCollection', features: alert }}></Geojson>

          <Geojson strokeColor={styles.strokeColor.color} fillColor="rgba(255,0,0,0.5)" strokeWidth={1}
            geojson={{ type: 'FeatureCollection', features: overflow }}></Geojson>

          <Geojson strokeColor={styles.strokeColor.color} fillColor="rgba(255,255,255,0.5)" strokeWidth={1}
            geojson={{ type: 'FeatureCollection', features: normal }}></Geojson>

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

