import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { useAuth } from '@/context/AuthContext'
import { loginAccount } from '@/services/appwrite'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

const Login = () => {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const response = await loginAccount(email, password)
      login({
        $id: response.userId,
        name: response.name || '',
        email: response.email || email
      })
      router.replace('/(tabs)')
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full h-full z-0" />
      
      <View className="flex-1 justify-center px-8">
        {/* Logo */}
        <View className="items-center mb-12">
          <Image source={icons.logo} className="w-20 h-16 mb-4" />
          <Text className="text-white text-2xl font-bold">Welcome Back</Text>
          <Text className="text-white/70 text-base mt-2">Sign in to continue</Text>
        </View>

        {/* Login Form */}
        <View className="space-y-6">
          {/* Email Input */}
          <View>
            <Text className="text-white text-base font-medium mb-2">Email</Text>
            <TextInput
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-4 text-white text-base"
              placeholder="Enter your email"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-white text-base font-medium mb-2">Password</Text>
            <TextInput
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-4 text-white text-base"
              placeholder="Enter your password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-4 mt-6"
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center text-lg font-semibold">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-white/70 text-base">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text className="text-blue-400 text-base font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Login
