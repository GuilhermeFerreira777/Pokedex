import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PokemonListScreen from './src/screens/PokemonListScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';

export type RootStackParamList = {
  PokemonList: undefined;
  PokemonDetail: { name: string; url: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PokemonList">
        <Stack.Screen name="PokemonList" options={{ title: "Pokedex" }} component={PokemonListScreen} />
        <Stack.Screen name="PokemonDetail" options={{ title: "Detalhes do Pokémon" }} component={PokemonDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
