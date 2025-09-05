import MovieCard from '@/components/MovieCard'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from "@/services/api"
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native'
import SearchBar from '../../components/SearchBar'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [moviesError, setMoviesError] = useState<Error | null>(null);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch movies when debounced query changes
  useEffect(() => {
    const searchMovies = async () => {
      try {
        setMoviesLoading(true);
        setMoviesError(null);
        const results = await fetchMovies({ query: debouncedQuery });
        setMovies(results);
      } catch (error) {
        setMoviesError(error instanceof Error ? error : new Error('Failed to fetch movies'));
        setMovies([]);
      } finally {
        setMoviesLoading(false);
      }
    };

    searchMovies();
  }, [debouncedQuery]);
  
  return (
   <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0"/>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 20 }}>
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto"/>

        <View className="flex-1 mt-5">
          <SearchBar 
            placeholder="Search for a movie"
            value={searchQuery}
            onChangeText={(text:string) => setSearchQuery(text)}
          />

          {moviesLoading && (
            <ActivityIndicator size="large" color="#0000ff" className="my-3 self-center" />
          )}

          {moviesError && (
            <Text className="text-red-500 px-5 my-3 text-center">Error: {moviesError.message}</Text>
          )}

          
          {!moviesLoading && !moviesError && (
            <>
              {searchQuery.trim() ? (
                <Text className="text-xl text-white font-bold mt-5 mb-3">
                  Search Results for{' '}
                  <Text className='text-accent'>{searchQuery}</Text>
                </Text>
              ) : (
                <Text className="text-lg text-white font-bold mt-5 mb-3">Popular Movies</Text>
              )}
            </>
          )}

          
          <View className="mt-2 pb-32">
            {!moviesLoading && !moviesError && movies && movies.length > 0 && (
              <View className="flex-row flex-wrap justify-between">
                {movies.map((item: Movie) => (
                  <View key={item.id} style={{ width: '30%', marginBottom: 10 }}>
                    <MovieCard {...item} />
                  </View>
                ))}
              </View>
            )}

            
            {!moviesLoading && !moviesError && searchQuery.trim() && movies && movies.length === 0 && (
              <Text className="text-white text-center mt-10 text-lg">
                No movies found for {searchQuery}
              </Text>
            )}
          </View>
        </View>

      </ScrollView>

    </View>


  )
}

export default Search;
