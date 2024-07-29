import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getLinhas } from '../../api/olhoVivo';
import { Link } from 'expo-router';

interface Linha {
  cl: number;
  lt: string;
  tp: string;
  ts: string;
  result: string;
}

export default function LinhasScreen() {
  const [search, setSearch] = useState<string>('');
  const [linhas, setLinhas] = useState<Linha[]>([]);

  const handleSearch = async (searchTerm: string) => {
    const result: Linha[] = await getLinhas(searchTerm);
    setLinhas(result);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o número da linha"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={() => handleSearch(search)}
      />
      <View>
        <FlatList
          data={linhas}
          keyExtractor={(item) => item.cl.toString()}
          renderItem={({ item }) => (
            <Link href={{ pathname: '/pages/screenVeiculos', params: { codigoLinha: item.cl }}} asChild>
              <TouchableOpacity style={styles.item}>
                <Text style={styles.text}>Linha: {item.lt}</Text>
                <Text style={styles.text}>Sentido: {item.ts}/{item.tp}</Text>
              </TouchableOpacity>
            </Link>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#d8d1d1',
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  item: {
    padding: 20,
    backgroundColor: 'white',
    marginVertical: 8,
    borderRadius: 10,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Roboto',
    color: 'black',
  },
});
