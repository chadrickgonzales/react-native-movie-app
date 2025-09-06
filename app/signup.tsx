import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { createAccount } from '@/services/appwrite'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

const Signup = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    try {
      await createAccount(email, password, name)
      Alert.alert('Success', 'Account created successfully! Please sign in.', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ])
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full h-full z-0" />
      
      <View className="flex-1 justify-center px-8">
        {/* Logo */}
        <View className="items-center mb-8">
          <Image source={icons.logo} className="w-20 h-16 mb-4" />
          <Text className="text-white text-2xl font-bold">Create Account</Text>
          <Text className="text-white/70 text-base mt-2">Join us to discover amazing movies</Text>
        </View>

        {/* Signup Form */}
        <View className="space-y-4">
          {/* Name Input */}
          <View>
            <Text className="text-white text-base font-medium mb-2">Full Name</Text>
            <TextInput
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-4 text-white text-base"
              placeholder="Enter your full name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

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

          {/* Confirm Password Input */}
          <View>
            <Text className="text-white text-base font-medium mb-2">Confirm Password</Text>
            <TextInput
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-4 text-white text-base"
              placeholder="Confirm your password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-4 mt-6"
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center text-lg font-semibold">Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-white/70 text-base">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-blue-400 text-base font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Signup
