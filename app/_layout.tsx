import { Stack } from "expo-router";
import './globals.css';

export default function RootLayout() {
  return <Stack >
    <Stack.Screen 
      options={{ headerShown: false }} 
      name="(tabs)" 
    />
    <Stack.Screen 
      options={{ headerShown: false }} 
      name="movie/[id]" 
    />
  </Stack>;
}
