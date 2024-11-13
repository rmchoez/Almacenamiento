import React, { useEffect, useState } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { createDatabase } from '../database/rxdb';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'; // Para manejar permisos en Android/iOS

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [db, setDb] = useState(null);

  // Solicitar permisos de ubicación
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      // iOS - Solicitar permiso
      const permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (permission === RESULTS.GRANTED) {
        return true;
      } else {
        console.log('Permiso de ubicación denegado en iOS');
        return false;
      }
    } else {
      // Android - Solicitar permiso
      const permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (permission === RESULTS.GRANTED) {
        return true;
      } else {
        console.log('Permiso de ubicación denegado en Android');
        return false;
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      // Solicitar permisos antes de obtener la ubicación
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      }

      // Crear la base de datos RxDB
      const database = await createDatabase();
      setDb(database);

      // Obtener la ubicación actual del usuario
      Geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.log(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    };

    init();
  }, []);

  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newMarker = { lat: latitude, lng: longitude, address: 'Dirección desconocida' };

    // Guardar en RxDB
    if (db) {
      await db.coordinates.insert(newMarker);
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>Ubicación actual:</Text>
      <Text>{location ? `${location.latitude}, ${location.longitude}` : 'Cargando ubicación...'}</Text>

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location ? location.latitude : 37.78825,
          longitude: location ? location.longitude : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
        provider="default" // Esto usa el proveedor de mapa por defecto (OpenStreetMap)
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.lat,
              longitude: marker.lng,
            }}
            title={`Marcador ${index + 1}`}
            description={marker.address}
          />
        ))}
      </MapView>

      <Button
        title="Ver Coordenadas Guardadas"
        onPress={() => {
          console.log('Coordenadas guardadas:', markers);
        }}
      />
    </View>
  );
};

export default MapScreen;
