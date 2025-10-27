  import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'>;

interface PokemonDetail {
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
}

export default function PokemonDetailScreen({ route, navigation }: Props) {
  const { url } = route.params;
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setPokemon(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPokemon();
  }, [url]);

  if (!pokemon) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{pokemon.name}</Text>
      <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
      <View style={styles.typesContainer}>
        {pokemon.types.map((t) => (
          <View key={t.type.name} style={styles.typeBadge}>
            <Text style={styles.typeText}>{t.type.name}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#f5f5f5' },
  name: { fontSize: 28, fontWeight: 'bold', textTransform: 'capitalize', marginBottom: 16 },
  image: { width: 200, height: 200, marginBottom: 16 },
  typesContainer: { flexDirection: 'row', marginBottom: 20 },
  typeBadge: { backgroundColor: '#ffcc00', padding: 8, marginHorizontal: 4, borderRadius: 8 },
  typeText: { textTransform: 'capitalize', fontWeight: 'bold' },
  button: {
    backgroundColor: '#ffcc00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: { fontWeight: 'bold', fontSize: 16 },
});
