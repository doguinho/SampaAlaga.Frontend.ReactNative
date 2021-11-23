import React, { useEffect, useState } from "react";
import { StyleSheet } from 'react-native';
import { subprefeituras } from '../assets/shapes/subprefeituras';
import { api } from "../services/api";

import MapView,
{
  Geojson,
  Callout,
  Marker,
  PROVIDER_GOOGLE
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

const initialRegion = {
  latitude: -23.7,
  longitude: -46.6,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};


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

  const [loading, setLoading] = useState<boolean>(true)
  const [normal, setNormal] = useState<any[]>([])
  const [attention, setAttention] = useState<any[]>([])
  const [alert, setAlert] = useState<any[]>([])
  const [overflow, setOverflow] = useState<any[]>([])
  // const [situations, setSituations] = useState<Situation[]>([])

  async function fetchSituation() {
    const response = await api.get('/regions/situation');
    splitSituation(response.data)
    setLoading(false)
  }
  
  useEffect(() => {
    fetchSituation();
  }, []);

  function splitSituation(situations:Situation[]) {

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
      {loading ? null :
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
              latitude: Number(-23.533773),
              longitude: Number(-46.625290),
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  calloutContainer: {
    width: 160,
    height: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    justifyContent: "center",
  },

  calloutText: {
    color: "#0089a5",
    textDecorationLine: "underline",
    fontSize: 14,
  },

  calloutSmallText: {
    color: "#005555",
    fontSize: 10,
  },
  strokeColor: {
    color: "rgba(0,0,0,0.5)"
  }
});

