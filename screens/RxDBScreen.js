import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useRxDatabase } from '../database/rxdb'; 

const RxDBScreen = () => {
  const [locations, setLocations] = useState([]);
  const db = useRxDatabase();

  useEffect(() => {
    const fetchLocations = async () => {
      const locationsData = await db.location.find();
      setLocations(locationsData);
    };
    fetchLocations();
  }, [db]);

  const saveLocation = async () => {
    await db.location.insert({ latitude: 19.4326, longitude: -99.1332 }); // Ejemplo de datos
    alert('Location saved!');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Stored Locations (RxDB):</Text>
      {locations.map((loc, index) => (
        <Text key={index}>
          {loc.latitude}, {loc.longitude}
        </Text>
      ))}
      <Button title="Save Location" onPress={saveLocation} />
    </View>
  );
};

export default RxDBScreen;
