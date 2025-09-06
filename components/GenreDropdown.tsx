import { fetchGenres } from '@/services/api'
import useFetch from '@/services/userFetch'
import React, { useState } from 'react'
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface Genre {
  id: number
  name: string
}

interface GenreDropdownProps {
  onGenreSelect: (genreId: number, genreName: string) => void
  selectedGenre: string
}

const GenreDropdown = ({ onGenreSelect, selectedGenre }: GenreDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: genres, loading } = useFetch(fetchGenres)

  const handleGenreSelect = (genre: Genre) => {
    onGenreSelect(genre.id, genre.name)
    setIsOpen(false)
  }

  return (
    <>
      <TouchableOpacity
        className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 flex-row items-center"
        onPress={() => setIsOpen(true)}
      >
        <Text className="text-white text-sm font-medium mr-2">
          {selectedGenre || 'All Genres'}
        </Text>
        <Text className="text-white text-sm">▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-primary rounded-3xl mx-6 max-h-[80%] w-[90%]">
            <View className="p-6 border-b border-white/20">
              <Text className="text-white text-xl font-bold text-center">Select Genre</Text>
            </View>
            
            <ScrollView className="max-h-96">
              {loading ? (
                <View className="p-4 items-center">
                  <ActivityIndicator color="#0000ff" />
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    className="p-5 border-b border-white/10"
                    onPress={() => handleGenreSelect({ id: 0, name: 'All Genres' })}
                  >
                    <Text className="text-white text-lg font-medium">All Genres</Text>
                  </TouchableOpacity>
                  
                  {genres?.map((genre: Genre) => (
                    <TouchableOpacity
                      key={genre.id}
                      className="p-5 border-b border-white/10"
                      onPress={() => handleGenreSelect(genre)}
                    >
                      <Text className="text-white text-lg font-medium">{genre.name}</Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  )
}

export default GenreDropdown