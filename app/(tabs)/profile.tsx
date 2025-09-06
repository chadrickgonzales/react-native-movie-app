import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'expo-router'
import React from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'

const profile = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout()
            router.replace('/login')
          }
        }
      ]
    )
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full h-full z-0" />
      
      <View className="flex-1 px-5 pt-12">
        {/* Header */}
        <View className="items-center mb-8">
          <Image source={icons.logo} className="w-16 h-12 mb-4" />
          <Text className="text-white text-2xl font-bold">Profile</Text>
        </View>

        {/* User Info */}
        <View className="bg-white/10 rounded-lg p-6 mb-6">
          <View className="items-center mb-4">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-3">
              <Text className="text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text className="text-white text-xl font-bold">{user?.name || 'User'}</Text>
            <Text className="text-white/70 text-base">{user?.email || 'user@example.com'}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-500 rounded-lg py-4 mt-6"
          onPress={handleLogout}
        >
          <Text className="text-white text-center text-lg font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default profile