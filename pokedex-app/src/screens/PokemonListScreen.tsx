import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonList'>;

interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string; 
}

export default function PokemonListScreen({ navigation }: Props) {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
      const data = await res.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (poke: Pokemon) => {
          const pokeRes = await fetch(poke.url);
          const pokeData = await pokeRes.json();
          return { ...poke, imageUrl: pokeData.sprites.front_default };
        })
      );

      setPokemons(detailedPokemons);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PokemonDetail', { name: item.name, url: item.url })}
          >
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.pokemonImage} />}
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.pagination}>
        <TouchableOpacity style={styles.button} onPress={() => setOffset(Math.max(0, offset - 20))}>
          <Text style={styles.buttonText}>◀ Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setOffset(offset + 20)}>
          <Text style={styles.buttonText}>Próximo ▶</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text style={styles.loading}>Carregando...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  pokemonImage: { width: 60, height: 60, marginRight: 16 },
  name: { fontSize: 18, fontWeight: 'bold', textTransform: 'capitalize' },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  button: {
    backgroundColor: '#ffcc00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: { fontWeight: 'bold', fontSize: 16 },
  loading: { textAlign: 'center', marginTop: 10, fontSize: 16 },
});
