import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import './globals.css';

function RootLayoutNav() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)')
      } else {
        router.replace('/login')
      }
    }
  }, [user, loading])

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <Stack>
      <Stack.Screen 
        options={{ headerShown: false }} 
        name="login" 
      />
      <Stack.Screen 
        options={{ headerShown: false }} 
        name="signup" 
      />
      <Stack.Screen 
        options={{ headerShown: false }} 
        name="(tabs)" 
      />
      <Stack.Screen 
        options={{ headerShown: false }} 
        name="movies/[id]" 
      />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="hidden" />
      <RootLayoutNav />
    </AuthProvider>
  );
}
