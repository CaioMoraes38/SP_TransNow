import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { getVeiculos } from '../../api/olhoVivo';
import VeiculoMarker from '../../components/VeiculoMarker'; 

const { height } = Dimensions.get('window');

interface Veiculo {
  p: string;
  a: boolean;
  ta: string;
  py: number;
  px: number;
}

export default function VeiculosScreen() {
  const route = useRoute();
  const { codigoLinha } = route.params;
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  useEffect(() => {
    const fetchVeiculos = async () => {
      const veiculosData = await getVeiculos(codigoLinha);
      setVeiculos(veiculosData);
    };

    fetchVeiculos();
  }, [codigoLinha]);

  return (
    <View style={styles.container}>
     
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.5505,
          longitude: -46.6333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {veiculos.map((veiculo, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: veiculo.py,
              longitude: veiculo.px,
            }}
          >
            <VeiculoMarker />
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>Prefixo: {veiculo.p}</Text>
                <Text>Acessibilidade: {veiculo.a ? 'Sim' : 'Não'}</Text>
                <Text>Última atualização: {veiculo.ta}</Text>
              </View>
            </Callout>
          </Marker>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    width: 150,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
  },
});
