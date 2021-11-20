import React, { useEffect, useState } from "react";
import { StyleSheet, Alert } from 'react-native';
import MapView, 
{ 
  Geojson,
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region 
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

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  return (
    <MapView 
    initialRegion={initialRegion}
    style={{...StyleSheet.absoluteFillObject}}>
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
});
