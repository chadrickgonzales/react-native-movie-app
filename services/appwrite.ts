import { Account, Client, Databases, ID, Query } from 'appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_MOVIES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID!;

const client = new Client()
      .setEndpoint('https://syd.cloud.appwrite.io/v1')
      .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const databases = new Databases(client);
const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  if (!query || !movie || !movie.id) {
    console.warn('Invalid parameters for updateSearchCount:', { query, movie });
    return;
  }

  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', query),
      Query.equal('movie_id', movie.id)
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
        count: (existingMovie.count || 0) + 1
      });
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query, 
        movie_id: movie.id,
        title: movie.title, 
        count: 1, 
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      });
    }
  } catch (error) {
    console.error('Error updating search count:', error);
  }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try{
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(20), // Get more documents to ensure we have enough unique movies
      Query.orderDesc('count'),
    ]);

    const documents = result.documents as unknown as TrendingMovie[];
    
    // Deduplicate by movie title, keeping the one with highest count
    const uniqueMovies = new Map<string, TrendingMovie>();
    
    documents.forEach(movie => {
      const existingMovie = uniqueMovies.get(movie.title);
      if (!existingMovie || movie.count > existingMovie.count) {
        uniqueMovies.set(movie.title, movie);
      }
    });
    
    // Convert back to array and take only top 5
    const deduplicatedMovies = Array.from(uniqueMovies.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return deduplicatedMovies;

  }catch(error){
    console.error('Error fetching trending movies:', error);
    return undefined;
  }

}

// Authentication functions
export const createAccount = async (email: string, password: string, name: string) => {
  try {
    const response = await account.create(ID.unique(), email, password, name);
    return response;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

export const loginAccount = async (email: string, password: string) => {
  try {
    const response = await account.createEmailPasswordSession(email, password);
    return response;
  } catch (error: any) {
    console.error('Error logging in:', error);
    
    // If it's an email verification error, try to get user info anyway
    if (error.message && error.message.includes('verification')) {
      try {
        const user = await account.get();
        return { userId: user.$id, email: user.email, name: user.name };
      } catch (userError) {
        throw error; // Throw original error if we can't get user info
      }
    }
    
    throw error;
  }
}

export const logoutAccount = async () => {
  try {
    const response = await account.deleteSessions();
    return response;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await account.get();
    return response;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Saved Movies Functions
export const saveMovie = async (movieId: number) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const response = await databases.createDocument(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      ID.unique(),
      {
        user_id: user.$id,
        movie_id: movieId,
        saved_at: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error saving movie:', error);
    throw error;
  }
}

export const unsaveMovie = async (movieId: number) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Find the saved movie document
    const savedMovies = await databases.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [
        Query.equal('user_id', user.$id),
        Query.equal('movie_id', movieId)
      ]
    );

    if (savedMovies.documents.length > 0) {
      const documentId = savedMovies.documents[0].$id;
      await databases.deleteDocument(
        DATABASE_ID,
        SAVED_MOVIES_COLLECTION_ID,
        documentId
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error unsaving movie:', error);
    throw error;
  }
}

export const getSavedMovies = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [
        Query.equal('user_id', user.$id),
        Query.orderDesc('saved_at')
      ]
    );
    // Return just the movie IDs
    return response.documents.map(doc => doc.movie_id);
  } catch (error) {
    console.error('Error getting saved movies:', error);
    throw error;
  }
}

export const isMovieSaved = async (movieId: number) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [
        Query.equal('user_id', user.$id),
        Query.equal('movie_id', movieId)
      ]
    );
    return response.documents.length > 0;
  } catch (error) {
    console.error('Error checking if movie is saved:', error);
    return false;
  }
}

// Get saved movies with full details from TMDB
export const getSavedMoviesWithDetails = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get saved movie IDs from Appwrite
    const response = await databases.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [
        Query.equal('user_id', user.$id),
        Query.orderDesc('saved_at')
      ]
    );

    if (response.documents.length === 0) {
      return [];
    }

    // Extract movie IDs and fetch details from TMDB
    const movieIds = response.documents.map(doc => doc.movie_id);
    
    // Import fetchMoviesByIds dynamically to avoid circular dependency
    const { fetchMoviesByIds } = await import('./api');
    const moviesWithDetails = await fetchMoviesByIds(movieIds);
    
    // Combine TMDB data with saved_at timestamp
    return moviesWithDetails.map(movie => ({
      ...movie,
      saved_at: response.documents.find(doc => doc.movie_id === movie.id)?.saved_at
    }));
  } catch (error) {
    console.error('Error getting saved movies with details:', error);
    throw error;
  }
}