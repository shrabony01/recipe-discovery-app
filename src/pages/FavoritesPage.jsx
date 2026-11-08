import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If there are no saved favorites, clear state immediately
    if (favorites.length === 0) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    setError(null);

    // Fetch full meal card details concurrently for every saved meal ID
    const fetchPromises = favorites.map((id) =>
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to load recipe ID: ${id}`);
          }
          return res.json();
        })
        .then((data) => data.meals?.[0])
        .catch(() => null) // Prevent a single network failure from breaking the whole page
    );

    Promise.all(fetchPromises)
      .then((results) => {
        // Filter out null responses from any failed individual lookups
        setRecipes(results.filter(Boolean));
      })
      .catch((err) => {
        setError(err.message || 'An error occurred while loading your saved recipes.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [favorites]);

  if (loading) {
    return <Spinner message="Loading your favorite recipes..." />;
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link> &gt; <span>Favorites</span>
      </nav>

      <h2 style={{ marginBottom: '1.5rem' }}>Your Favorite Recipes</h2>

      {/* Empty State: Prompt user to browse if favorites list is empty */}
      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: '#6c757d', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            You haven't saved any recipes to your favorites yet.
          </p>
          <Link to="/" className="btn-primary">
            Explore Categories
          </Link>
        </div>
      ) : (
        <div className="grid-layout">
          {recipes.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              id={meal.idMeal}
              title={meal.strMeal}
              image={meal.strMealThumb}
              category={meal.strCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}