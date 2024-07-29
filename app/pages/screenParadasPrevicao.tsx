import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getParadas, getLinhasPorParada, getPrevisaoChegada } from '../../api/olhoVivo'; 

type Parada = {
  cp: number; // código da parada
  np: string; // nome da parada
  ed: string; // endereço de localização da parada
};

type Linha = {
  cl: number; // código da linha
  lt: string; // nome da linha
  tp: string; // tipo de linha
};

type Previsao = {
  linha: string; // código da linha
  sentido: string; // sentido da linha
  chegada: string; // previsão de chegada
};

export default function ParadasScreen() {
  const [linhaBusca, setLinhaBusca] = useState<string>(''); 
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [linhas, setLinhas] = useState<Linha[]>([]); 
  const [previsoes, setPrevisoes] = useState<Previsao[]>([]); 
  const [selectedParada, setSelectedParada] = useState<Parada | null>(null); 
  const [selectedLinha, setSelectedLinha] = useState<Linha | null>(null); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buscarParadas = async (linha: string) => {
    setLoading(true);
    setError(null);
    try {
      const paradasData = await getParadas(linha);
      setParadas(paradasData);
    } catch (err) {
      setError('Erro ao buscar paradas');
      console.error('Erro ao buscar paradas:', err);
    } finally {
      setLoading(false);
    }
  };

  const buscarLinhasPorParada = async (codigoParada: number) => {
    setLoading(true);
    setError(null);
    try {
      const linhasData = await getLinhasPorParada(codigoParada);
      setLinhas(linhasData);
    } catch (err) {
      setError('Erro ao buscar linhas');
      console.error('Erro ao buscar linhas por parada:', err);
    } finally {
      setLoading(false);
    }
  };

  const buscarPrevisaoChegada = async (codigoParada: number, codigoLinha: number) => {
    setLoading(true);
    setError(null);
    try {
      const previsoesData = await getPrevisaoChegada(codigoParada, codigoLinha);
      setPrevisoes(previsoesData);
    } catch (err) {
      setError('Erro ao buscar previsões de chegada');
      console.error('Erro ao buscar previsões de chegada:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleParadaPress = (parada: Parada) => {
    setSelectedParada(parada);
    buscarLinhasPorParada(parada.cp);
  };

  const handleLinhaPress = (linha: Linha) => {
    setSelectedLinha(linha);
    if (selectedParada) {
      buscarPrevisaoChegada(selectedParada.cp, linha.cl);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o número da linha"
        value={linhaBusca}
        onChangeText={setLinhaBusca}
        onSubmitEditing={() => buscarParadas(linhaBusca)} 
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={paradas}
            keyExtractor={(item) => item.cp.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.item} 
                onPress={() => handleParadaPress(item)}
              >
                <Text style={styles.title}>{item.np}</Text>
                <Text>{item.ed}</Text>
                <Text>{item.cp}</Text>
              </TouchableOpacity>
            )}
          />
          {selectedParada && (
            <View style={styles.linhasContainer}>
              <Text style={styles.linhasTitle}>Linhas que passam pela parada {selectedParada.np}:</Text>
              <FlatList
                data={linhas}
                keyExtractor={(item) => item.cl.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.linhaItem}
                    onPress={() => handleLinhaPress(item)}
                  >
                    <Text>{`Linha: ${item.lt}`}</Text>
                    <Text>{`Código: ${item.cl}`}</Text>
                    <Text>{`Tipo: ${item.tp}`}</Text>
                  </TouchableOpacity>
                )}
              />
              {selectedLinha && (
                <View style={styles.previsaoContainer}>
                  <Text style={styles.previsaoTitle}>Previsões de chegada para a linha {selectedLinha.lt}:</Text>
                  <FlatList
                    data={previsoes}
                    keyExtractor={(item) => item.linha}
                    renderItem={({ item }) => (
                      <View style={styles.previsaoItem}>
                        <Text>{`Linha: ${item.linha}`}</Text>
                        <Text>{`Sentido: ${item.sentido}`}</Text>
                        <Text>{`Chegada: ${item.chegada}`}</Text>
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8d1d1',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  linhasContainer: {
    marginTop: 20,
    width: '100%',
  },
  linhasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  linhaItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  previsaoContainer: {
    marginTop: 20,
    width: '100%',
  },
  previsaoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  previsaoItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
});
