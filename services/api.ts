export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
    }
}

export const fetchMovies = async ({query}: {query: string}) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const endpoint = query
        ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=release_date.desc&primary_release_date.gte=2020-01-01&primary_release_date.lte=${today}`;
    const response = await fetch (endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }

    const data = await response.json();
    // Filter out movies without poster images and ensure they have been released
    return data.results.filter((movie: any) => 
        movie.poster_path !== null && 
        movie.poster_path !== undefined &&
        movie.release_date && 
        new Date(movie.release_date) <= new Date()
    );
}

// Fetch trending movies by genre
export const fetchTrendingMoviesByGenre = async (genreId: number) => {
    const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`;
    
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch trending movies by genre: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.filter((movie: any) => movie.poster_path !== null && movie.poster_path !== undefined);
}

// Fetch popular movies by genre
export const fetchPopularMoviesByGenre = async (genreId: number) => {
    const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`;
    
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch popular movies by genre: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.filter((movie: any) => movie.poster_path !== null && movie.poster_path !== undefined);
}

// Fetch top rated movies by genre
export const fetchTopRatedMoviesByGenre = async (genreId: number) => {
    const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=vote_average.desc&page=1`;
    
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch top rated movies by genre: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.filter((movie: any) => movie.poster_path !== null && movie.poster_path !== undefined);
}

// Fetch latest movies by genre
export const fetchLatestMoviesByGenre = async (genreId: number) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=release_date.desc&primary_release_date.gte=2020-01-01&primary_release_date.lte=${today}&page=1`;
    
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch latest movies by genre: ${response.statusText}`);
    }

    const data = await response.json();
    // Filter out movies without poster images and ensure they have been released
    return data.results.filter((movie: any) => 
        movie.poster_path !== null && 
        movie.poster_path !== undefined &&
        movie.release_date && 
        new Date(movie.release_date) <= new Date()
    );
}

// Fetch movie genres
export const fetchGenres = async () => {
    const endpoint = `${TMDB_CONFIG.BASE_URL}/genre/movie/list`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch genres: ${response.statusText}`);
    }

    const data = await response.json();
    return data.genres;
}

export const fetchMovieDetails = async (movieId: number) => {
    const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

// Fetch multiple movie details by IDs
export const fetchMoviesByIds = async (movieIds: number[]) => {
    try {
        // Fetch all movie details in parallel
        const moviePromises = movieIds.map(id => fetchMovieDetails(id));
        const movies = await Promise.all(moviePromises);
        
        // Filter out movies without posters and return with saved_at info
        return movies.filter((movie: any) => movie.poster_path !== null && movie.poster_path !== undefined);
    } catch (error) {
        console.error('Error fetching movies by IDs:', error);
        throw error;
    }
}

// Fetch movies by category
export const fetchMoviesByCategory = async (category: string, page: number = 1) => {
    let endpoint = '';
    
    switch (category) {
        case 'popular':
            endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
            break;
        case 'top_rated':
            endpoint = `${TMDB_CONFIG.BASE_URL}/movie/top_rated?page=${page}`;
            break;
        case 'now_playing':
            endpoint = `${TMDB_CONFIG.BASE_URL}/movie/now_playing?page=${page}`;
            break;
        case 'upcoming':
            endpoint = `${TMDB_CONFIG.BASE_URL}/movie/upcoming?page=${page}`;
            break;
        case 'action':
            endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=28&sort_by=popularity.desc&page=${page}`;
            break;
        case 'comedy':
            endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=35&sort_by=popularity.desc&page=${page}`;
            break;
        case 'horror':
            endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=27&sort_by=popularity.desc&page=${page}`;
            break;
        case 'romance':
            endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=10749&sort_by=popularity.desc&page=${page}`;
            break;
        case 'sci_fi':
            endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=878&sort_by=popularity.desc&page=${page}`;
            break;
        default:
            // Handle genre_XX format for dynamic genre filtering
            if (category.startsWith('genre_')) {
                const genreId = category.replace('genre_', '');
                endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`;
            } else {
                endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
            }
    }

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${category} movies: ${response.statusText}`);
    }

    const data = await response.json();
    // Filter out movies without poster images
    return data.results.filter((movie: any) => movie.poster_path !== null && movie.poster_path !== undefined);
}