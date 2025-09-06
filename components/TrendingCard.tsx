import { TrendingMovie } from "@/interfaces/interfaces";
import { Link } from "expo-router";
import React from 'react';
import { Image, Text, TouchableOpacity, View } from "react-native";

interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}

const TrendingCard = ({ movie, index }: TrendingCardProps) => {
  return (
    <Link href={`/movies/${movie.movie_id}`} asChild>
      <TouchableOpacity style={{ width: 120, marginRight: 15 }}>
        <View className="relative">
          <Image
            source={{ uri: movie.poster_url }}
            className="w-full h-52 rounded-lg"
            resizeMode="cover"
          />
          
          {/* Trending rank badge */}
          <View className="absolute top-2 left-2 bg-red-500 rounded-full w-8 h-8 items-center justify-center">
            <Text className="text-white font-bold text-sm">#{index + 1}</Text>
          </View>
          
        </View>
        
        {/* Movie title */}
        <Text className="text-white text-sm font-medium mt-2" numberOfLines={2}>
          {movie.title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;