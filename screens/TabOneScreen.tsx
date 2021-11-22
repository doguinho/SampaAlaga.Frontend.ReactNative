import React, { useEffect, useState } from "react";
import { StyleSheet } from 'react-native';
import { subprefeituras } from '../assets/shapes/subprefeituras';

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

const initialRegion = {
  latitude: -23.533773,
  longitude: -46.625290,
  latitudeDelta: 0.25,
  longitudeDelta: 0.25,
};

const alerts = ['13'] // preciso fazer o filtro pelos ids

const featuresAlert: any[] = subprefeituras.features.filter(
  sub => sub.properties.sp_codigo === "13"
);
const featuresNormal: any[] = [];
const featuresEmergence: any[] = [];

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

  return (
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
            <Text></Text>
          </View>
        </Callout>
      </Marker>

      <Geojson strokeColor={styles.strokeColor.color} fillColor="rgba(255,255,0,0.5)" strokeWidth={1}
        geojson={{ type: 'FeatureCollection', features: featuresAlert }}></Geojson>

      <Geojson strokeColor={styles.strokeColor.color} fillColor="rgba(255,255,255,0.5)" strokeWidth={1}
        geojson={{ type: 'FeatureCollection', features: featuresNormal }}></Geojson>

      <Geojson strokeColor={styles.strokeColor.color} fillColor="rgba(255,0,0,0.5)" strokeWidth={1}
        geojson={{ type: 'FeatureCollection', features: featuresEmergence }}></Geojson>

    </MapView>
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

