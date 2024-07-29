import { Image, StyleSheet, TouchableOpacity, Text, View, ScrollView, Dimensions, TextInput } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'expo-router';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, watchPositionAsync, LocationAccuracy } from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { getParadas } from '../../api/olhoVivo'; // Importar a função de busca
import CustomMarker from '../../components/CustomMarker';

const { height } = Dimensions.get('window');

type Parada = {
  cp: number;
  np: string;
  ed: string;
  py: number;
  px: number;
};

export default function HomeScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [linhaBusca, setLinhaBusca] = useState<string>(''); 
  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      mapRef.current?.animateCamera({
        center: {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        },
        zoom: 15,
      });

      watchPositionAsync({
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      }, (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          center: {
            latitude: response.coords.latitude,
            longitude: response.coords.longitude,
          },
          zoom: 15,
        });
      });
    }
  }

  async function buscarParadas(linha: string) {
    try {
      const paradasData = await getParadas(linha);
      setParadas(paradasData);
    } catch (error) {
      console.error('Erro ao buscar paradas:', error);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.viewMap}>
        {location && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            >
              <CustomMarker />
            </Marker>
            {paradas.map((parada) => (
              <Marker
                key={parada.cp}
                coordinate={{
                  latitude: parada.py,
                  longitude: parada.px,
                }}
                title={parada.np}
                description={parada.ed}
              />
            ))}
          </MapView>
        )}
      </View>
      <View style={styles.viewInput}>
        <TextInput
          style={styles.textInput}
          placeholder="Pesquisar Paradas proximas a você"
          value={linhaBusca}
          onChangeText={setLinhaBusca}
          onSubmitEditing={() => buscarParadas(linhaBusca)}
        />
        <View style={styles.viewButton}>
        <Link href="../pages/screenLinhas" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Linhas</Text>
          </TouchableOpacity>
        </Link>
        <Link href="../pages/screenParadasPrevicao" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Paradas</Text>
          </TouchableOpacity>
        </Link>
        </View>  
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
  },
  viewMap: {
    flex:1,
    width: '100%',
    height: height * 0.7,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  viewInput: {
    height:'100%',
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#d8d1d1',
  },
  textInput: {
    display: 'flex',
    padding: 10,
    width: '85%',
    height: 60,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  viewButton:{
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    padding : 10,
  },
  button: {   
    backgroundColor: '#444242',
    borderRadius: 40,
    height: 120,
    width: 120,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',     
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
