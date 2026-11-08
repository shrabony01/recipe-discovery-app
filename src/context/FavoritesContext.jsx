import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Create the Context instance for global access
const FavoritesContext = createContext(null);

/**
 * Provider component wrapping the application to supply favorites state and actions.
 */
export function FavoritesProvider({ children }) {
  // Persist the array of favorite meal IDs in localStorage under 'recipe_favorites'
  const [favorites, setFavorites] = useLocalStorage('recipe_favorites', []);

  /**
   * Adds a meal ID to favorites if it is not already present.
   * Wrapped in useCallback to prevent unnecessary re-renders in consumers.
   */
  const addFavorite = useCallback((recipeId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(recipeId)) {
        return prevFavorites;
      }
      return [...prevFavorites, recipeId];
    });
  }, [setFavorites]);

  /**
   * Removes a meal ID from favorites by filtering it out.
   */
  const removeFavorite = useCallback((recipeId) => {
    setFavorites((prevFavorites) => 
      prevFavorites.filter((id) => id !== recipeId)
    );
  }, [setFavorites]);

  /**
   * Checks whether a specific recipe ID currently exists in the favorites list.
   */
  const isFavorite = useCallback((recipeId) => {
    return favorites.includes(recipeId);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Custom hook for child components to easily consume FavoritesContext.
 * Throws an explicit error if invoked outside the provider.
 */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}