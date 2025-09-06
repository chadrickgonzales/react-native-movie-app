import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { getSavedMoviesWithDetails } from '@/services/appwrite'
import useFetch from '@/services/userFetch'
import { Link } from 'expo-router'
import React from 'react'
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native'

const Saved = () => {
  const { data: savedMovies, loading, error, refetch } = useFetch(getSavedMoviesWithDetails)


  const renderSavedMovie = ({ item }: { item: any }) => (
    <Link href={`/movies/${item.id}`} asChild>
      <TouchableOpacity className="bg-white/5 rounded-lg p-4 mb-4 flex-row">
        <Image
          source={{ 
            uri: item.poster_path 
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
              : 'https://via.placeholder.com/150x225/1a1a1a/ffffff.png' 
          }}
          className="w-20 h-30 rounded-lg mr-4"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-white text-lg font-bold mb-2" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-white/70 text-sm mb-2" numberOfLines={3}>
            {item.overview}
          </Text>
          <View className="flex-row items-center mb-2">
            <Image source={icons.star} className="w-4 h-4 mr-1" style={{ tintColor: '#FFD700' }} />
            <Text className="text-white/70 text-sm">
              {Math.round(item.vote_average * 10) / 10}/10
            </Text>
          </View>
          <Text className="text-white/50 text-xs">
            Saved on {new Date(item.saved_at).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  )

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-white mt-4">Loading saved movies...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 bg-primary justify-center items-center px-5">
        <Text className="text-white text-lg text-center mb-4">
          Error loading saved movies
        </Text>
        <TouchableOpacity 
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={() => refetch()}
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0"/>
      
      <View className="flex-1 px-5 pt-20">
        <View className="flex-row items-center mb-6">
          <Image source={icons.logo} className="w-10 h-8 mr-3"/>
          <Text className="text-white text-2xl font-bold">Saved Movies</Text>
        </View>

        {savedMovies && savedMovies.length > 0 ? (
          <FlatList
            data={savedMovies}
            renderItem={renderSavedMovie}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refetch}
                tintColor="#0000ff"
                colors={["#0000ff"]}
              />
            }
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Image source={icons.save} className="w-16 h-16 mb-4" style={{ tintColor: '#666' }} />
            <Text className="text-white/70 text-lg text-center mb-2">
              No saved movies yet
            </Text>
            <Text className="text-white/50 text-center">
              Save movies you want to watch later by tapping the save button on movie details
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default Saved