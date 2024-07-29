import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Polyline, LatLng, LatLngBounds } from 'react-native-maps';
import axios from 'axios';

interface Via {
  id: string;
  coordinates: { latitude: number; longitude: number }[];
  velocidade: number;
}

export default function VelocidadeVias() {
  const [vias, setVias] = useState<Via[]>([]);
  const [initialRegion, setInitialRegion] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const fetchViasData = async () => {
      try {
        
        const response = await axios.get('http://api.olhovivo.sptrans.com.br/v2.1/KMZ');
        const data = response.data;

        console.log('Dados recebidos:', data);

       
        if (!Array.isArray(data)) {
          console.error('Dados recebidos não são um array:', data);
          Alert.alert('Erro', 'Os dados recebidos não estão no formato esperado.');
          return;
        }

        const formattedVias: Via[] = data.map((item: any) => ({
          id: item.id,
          coordinates: item.coordinates.map((coord: any) => ({
            latitude: coord.lat,
            longitude: coord.lng,
          })),
          velocidade: item.velocidade,
        }));

        setVias(formattedVias);

        if (formattedVias.length > 0) {
          const bounds = new LatLngBounds();
          formattedVias.forEach(via => {
            via.coordinates.forEach(coord => {
              bounds.extend(new LatLng(coord.latitude, coord.longitude));
            });
          });

          const { northeast, southwest } = bounds;

          setInitialRegion({
            latitude: (northeast.latitude + southwest.latitude) / 2,
            longitude: (northeast.longitude + southwest.longitude) / 2,
            latitudeDelta: Math.abs(northeast.latitude - southwest.latitude) * 1.2,
            longitudeDelta: Math.abs(northeast.longitude - southwest.longitude) * 1.2,
          });
        }

      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', error.message);
          Alert.alert('Erro', `Axios error: ${error.message}`);
        } else {
          console.error('Error:', error);
          Alert.alert('Erro', 'Não foi possível carregar os dados das vias.');
        }
      }
    };

    fetchViasData();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        {vias.map((via) => (
          <Polyline
            key={via.id}
            coordinates={via.coordinates}
            strokeColor={via.velocidade > 60 ? "#FF0000" : "#00FF00"}
            strokeWidth={2}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#62c5c8',
  },
  map: {
    width: '100%',
    flex: 1,
  },
});
