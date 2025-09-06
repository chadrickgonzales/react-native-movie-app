import GenreDropdown from "@/components/GenreDropdown";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchLatestMoviesByGenre, fetchMovies, fetchMoviesByCategory, fetchPopularMoviesByGenre, fetchTopRatedMoviesByGenre } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/userFetch";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";


export default function Index() {

  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [genrePopularMovies, setGenrePopularMovies] = useState<Movie[]>([]);
  const [genreTopRatedMovies, setGenreTopRatedMovies] = useState<Movie[]>([]);
  const [genreLatestMovies, setGenreLatestMovies] = useState<Movie[]>([]);
  const [genreLoading, setGenreLoading] = useState(false);

  const {data: trendingMovies, loading: trendingLoading, error: errortrending} = useFetch(getTrendingMovies);

  const { data: movies, loading: moviesLoading, error: moviesError} = useFetch(() => fetchMovies({ query: '' }));
  
  // Additional movie categories
  const { data: topRatedMovies, loading: topRatedLoading } = useFetch(() => fetchMoviesByCategory('top_rated'));
  const { data: popularMovies, loading: popularLoading } = useFetch(() => fetchMoviesByCategory('popular'));

  const handleGenreSelect = async (genreId: number, genreName: string) => {
    setSelectedGenre(genreName);
    if (genreId === 0) {
      setGenrePopularMovies([]);
      setGenreTopRatedMovies([]);
      setGenreLatestMovies([]);
      return;
    }

    setGenreLoading(true);
    try {
      const [popularMovies, topRatedMovies, latestMovies] = await Promise.all([
        fetchPopularMoviesByGenre(genreId),
        fetchTopRatedMoviesByGenre(genreId),
        fetchLatestMoviesByGenre(genreId)
      ]);
      
      setGenrePopularMovies(popularMovies);
      setGenreTopRatedMovies(topRatedMovies);
      setGenreLatestMovies(latestMovies);
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
    } finally {
      setGenreLoading(false);
    }
  };


  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0"/>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 20 }}>
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto"/>

        {moviesLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ): moviesError ? (
          <Text>Error: {moviesError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
        
        {/* Trending Movies Section */}
        {trendingLoading ? (
          <ActivityIndicator
            size="small"
            color="#0000ff"
            className="mt-5 self-center"
          />
        ) : trendingMovies && trendingMovies.length > 0 ? (
          <>
            <View className="flex-row justify-between items-center mt-5 mb-3">
              <Text className="text-lg text-white font-bold">Trending Movies</Text>
              <GenreDropdown 
                onGenreSelect={handleGenreSelect}
                selectedGenre={selectedGenre}
              />
            </View>
            <FlatList
              data={trendingMovies}
              renderItem={({ item, index }) => (
                <TrendingCard movie={item} index={index} />
              )}
              keyExtractor={(item) => item.movie_id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 0 }}
            />
          </>
        ) : null}


        {/* Popular Movies */}
        <Text className="text-lg text-white font-bold mt-5 mb-3">Popular Movies</Text>
        
        {selectedGenre === 'All Genres' ? (
          /* Show original popular movies */
          popularLoading ? (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              className="self-center"
            />
          ) : popularMovies && popularMovies.length > 0 ? (
            <FlatList
              data={popularMovies.slice(0, 10)}
              renderItem={({ item }) => (
                <View style={{ width: 120, marginRight: 15 }}>
                  <MovieCard {...item} />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 0 }}
            />
          ) : null
        ) : (
          /* Show genre-filtered popular movies */
          genreLoading ? (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              className="self-center"
            />
          ) : genrePopularMovies && genrePopularMovies.length > 0 ? (
            <FlatList
              data={genrePopularMovies.slice(0, 10)}
              renderItem={({ item }) => (
                <View style={{ width: 120, marginRight: 15 }}>
                  <MovieCard {...item} />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 0 }}
            />
          ) : (
            <Text className="text-white/70 text-center py-4">No popular movies found for this genre</Text>
          )
        )}

        {/* Top Rated Movies */}
        <Text className="text-lg text-white font-bold mt-5 mb-3">Top Rated Movies</Text>
        
        {selectedGenre === 'All Genres' ? (
          /* Show original top rated movies */
          topRatedLoading ? (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              className="self-center"
            />
          ) : topRatedMovies && topRatedMovies.length > 0 ? (
            <FlatList
              data={topRatedMovies.slice(0, 10)}
              renderItem={({ item }) => (
                <View style={{ width: 120, marginRight: 15 }}>
                  <MovieCard {...item} />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 0 }}
            />
          ) : null
        ) : (
          /* Show genre-filtered top rated movies */
          genreLoading ? (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              className="self-center"
            />
          ) : genreTopRatedMovies && genreTopRatedMovies.length > 0 ? (
            <FlatList
              data={genreTopRatedMovies.slice(0, 10)}
              renderItem={({ item }) => (
                <View style={{ width: 120, marginRight: 15 }}>
                  <MovieCard {...item} />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 0 }}
            />
          ) : (
            <Text className="text-white/70 text-center py-4">No top rated movies found for this genre</Text>
          )
        )}

        {/* Latest Movies */}
        <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>
        
        {selectedGenre === 'All Genres' ? (
          /* Show original latest movies */
          moviesLoading ? (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              className="self-center"
            />
          ) : movies && movies.length > 0 ? (
            <FlatList
              data={movies.slice(0, 10)}
              renderItem={({ item }) => (
                <View style={{ width: 120, marginRight: 15 }}>
                  <MovieCard {...item} />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 0 }}
            />
          ) : null
        ) : (
          /* Show genre-filtered latest movies */
          genreLoading ? (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              className="self-center"
            />
          ) : genreLatestMovies && genreLatestMovies.length > 0 ? (
            <FlatList
              data={genreLatestMovies.slice(0, 10)}
              renderItem={({ item }) => (
                <View style={{ width: 120, marginRight: 15 }}>
                  <MovieCard {...item} />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 0 }}
            />
          ) : (
            <Text className="text-white/70 text-center py-4">No latest movies found for this genre</Text>
          )
        )}

        {/* Bottom Spacing */}
        <View className="h-20" />

      </View>
        )
        }

      </ScrollView>

    </View>
  );
}