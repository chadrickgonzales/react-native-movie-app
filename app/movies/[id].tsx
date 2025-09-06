import { icons } from '@/constants/icons'
import { fetchMovieDetails } from '@/services/api'
import { isMovieSaved, saveMovie, unsaveMovie } from '@/services/appwrite'
import useFetch from '@/services/userFetch'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const MovieDetails = () => {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const { data: movie, loading, error } = useFetch(() => fetchMovieDetails(Number(id)))

  // Check if movie is saved when component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      if (movie) {
        try {
          const saved = await isMovieSaved(movie.id)
          setIsSaved(saved)
        } catch (error) {
          console.error('Error checking if movie is saved:', error)
        }
      }
    }
    checkIfSaved()
  }, [movie])

  const handleSaveToggle = async () => {
    if (!movie) return
    
    setSaving(true)
    try {
      if (isSaved) {
        await unsaveMovie(movie.id)
        setIsSaved(false)
      } else {
        await saveMovie(movie.id)
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Error toggling save status:', error)
      Alert.alert('Error', 'Failed to update save status. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error || !movie) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Text className="text-white text-lg">Error loading movie details</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatRuntime = (minutes: number) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <View className="flex-1 bg-primary">
      {/* Fixed Back Button */}
      <View className="absolute top-12 left-5 z-20">
        <TouchableOpacity 
          className="bg-black/30 rounded-full p-3"
          onPress={() => router.back()}
        >
          <Image source={icons.arrow} className="w-6 h-6" style={{ tintColor: 'white', transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Movie Poster - Full width, no padding */}
        <View className="mb-6">
          <Image
            source={{ 
              uri: movie.backdrop_path 
                ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` 
                : 'https://via.placeholder.com/400x600/1a1a1a/ffffff.png' 
            }}
            className="w-full h-[500px]"
            resizeMode="cover"
          />
        </View>

        {/* Movie Details */}
        <View className="px-5 pb-8">
          {/* Title and Save Button */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-3xl font-bold flex-1 mr-3">{movie.title}</Text>
            <TouchableOpacity
              onPress={handleSaveToggle}
              disabled={saving}
              className={`px-4 py-2 rounded-lg flex-row items-center ${
                isSaved ? 'bg-red-500' : 'bg-blue-500'
              }`}
            >
              {saving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Image 
                    source={icons.save} 
                    className="w-4 h-4 mr-2" 
                    style={{ tintColor: 'white' }} 
                  />
                  <Text className="text-white font-semibold">
                    {isSaved ? 'Saved' : 'Save'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Year and Duration */}
          <Text className="text-white/70 text-lg mb-4">
            {movie.release_date?.split('-')[0]} {formatRuntime(movie.runtime)}
          </Text>
          
          {/* Rating Badge */}
          <View className="flex-row items-center mb-6">
            <View className="bg-primary rounded-lg px-3 py-2 flex-row items-center">
              <Image source={icons.star} className="w-4 h-4 mr-1" style={{ tintColor: '#FFD700' }} />
              <Text className="text-white text-sm font-semibold">
                {Math.round(movie.vote_average * 10) / 10}/10 ({movie.vote_count.toLocaleString()} votes)
              </Text>
            </View>
          </View>

          {/* Overview */}
          <View className="mb-6">
            <Text className="text-white text-xl font-bold mb-3">Overview</Text>
            <Text className="text-white/80 text-base leading-6">{movie.overview}</Text>
          </View>

          {/* Genres */}
          <View className="mb-6">
            <Text className="text-white text-xl font-bold mb-3">Genres</Text>
            <Text className="text-white/80 text-base">
              {movie.genres?.map((genre: { name: string }) => genre.name).join(' - ') || 'N/A'}
            </Text>
          </View>

          {/* Budget and Revenue */}
          <View className="flex-row justify-between mb-8">
            <View className="flex-1 mr-4">
              <Text className="text-white text-xl font-bold mb-2">Budget</Text>
              <Text className="text-white/80 text-base">{formatCurrency(movie.budget)}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-bold mb-2">Revenue</Text>
              <Text className="text-white/80 text-base">{formatCurrency(movie.revenue)}</Text>
            </View>
          </View>
        </View>

        
      </ScrollView>
    </View>
  )
}

export default MovieDetails