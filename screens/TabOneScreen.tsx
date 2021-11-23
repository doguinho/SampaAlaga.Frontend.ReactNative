import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { subprefeituras } from '../assets/shapes/subprefeituras';
import { api } from "../services/api";
import Constants from 'expo-constants';

import MapView,
{
  Geojson,
  Callout,
  Marker
} from 'react-native-maps';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as Location from "expo-location";

interface Situation {
  id: number,
  color: string,
  name: string,
  class: string,
  regions: number[]
}




// subprefeituras.features.map(
//   feature => {
//     if (feature.properties.sp_codigo === "13") {
//       featuresAlert.push(feature)
//     } else if (feature.properties.sp_codigo === "32") {
//       featuresEmergence.push(feature)
//     } else {
//       featuresNormal.push(feature)
//     }
//   }
// )


// const regions: GeojsonProps = {
//   geojson: {
//     type: 'FeatureCollection',
//     features: []
//   }
// }





export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const initialRegion = {
    latitude: -23.7,
    longitude: -46.6,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  const initialCoods = {
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

  const [loading, setLoading] = useState<boolean>(true)
  const [normal, setNormal] = useState<any[]>([])
  const [attention, setAttention] = useState<any[]>([])
  const [alert, setAlert] = useState<any[]>([])
  const [overflow, setOverflow] = useState<any[]>([])
  const [location, setLocation] = useState<Location.LocationObject>(initialCoods);
  const [errorMsg, setErrorMsg] = useState<any>();

  async function fetchSituation() {
    const response = await api.get('/regions/situation');
    splitSituation(response.data)
    setLoading(false)
  }

  function getLocation() {

    (async () => {
      /* @hide */
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
        );
        return;
      }
      /* @end */
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
    
  }

  useEffect(() => {
    fetchSituation();
    getLocation();
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

  // const splitSituation = () => {
  //   obj.forEach(
  //     sit => {        

  //       if (sit.class === 'alert') {
  //         featuresAlert = subprefeituras.features.filter(
  //           sub => sub.properties.sp_cod === sit.id
  //         )
  //       }

  //       // console.log(situation[sit.class as any])



  //     }
  //   )
  // }


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

