import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useFavorites } from '../context/FavoritesContext';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

export default function RecipeDetailPage() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Endpoint to lookup meal details by unique ID
  const apiUrl = recipeId
    ? `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(recipeId)}`
    : null;

  const { data, loading, error } = useFetch(apiUrl);

  if (loading) {
    return <Spinner message="Loading full recipe details..." />;
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const meal = data?.meals?.[0];

  // Handle non-existent recipe IDs gracefully
  if (!meal) {
    return (
      <div className="page-container">
        <ErrorMessage message="Recipe not found." />
        <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginTop: '1rem', cursor: 'pointer' }}>
          ← Go Back
        </button>
      </div>
    );
  }

  const favorite = isFavorite(meal.idMeal);

  // TheMealDB returns up to 20 separate keys for ingredients and measures.
  // Parse and match non-empty pairs into an array of objects.
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : '',
      });
    }
  }

  return (
    <div className="page-container">
      {/* Back button to return to previous browsing state */}
      <button onClick={() => navigate(-1)} className="back-link">
        ← Back
      </button>

      {/* Header with Title and Metadata Badges */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>{meal.strMeal}</h1>
        <div className="tags">
          {meal.strCategory && <span className="badge">{meal.strCategory}</span>}
          {meal.strArea && <span className="badge">{meal.strArea}</span>}
        </div>
      </div>

      {/* Main Section: Image & Favorites Toggle on left, Ingredients on right */}
      <div className="detail-grid">
        <div className="detail-media">
          <img src={meal.strMealThumb} alt={meal.strMeal} />
          <button
            onClick={() =>
              favorite ? removeFavorite(meal.idMeal) : addFavorite(meal.idMeal)
            }
            className={`favorite-action-btn ${favorite ? 'btn-remove' : 'btn-add'}`}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
          </button>
        </div>

        <div className="detail-ingredients">
          <h3>Ingredients</h3>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.8rem' }}>
            {ingredients.map((item, index) => (
              <li key={index} style={{ marginBottom: '0.35rem' }}>
                <strong>{item.measure}</strong> {item.ingredient}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Step-by-Step Cooking Instructions */}
      <div className="detail-instructions">
        <h3>Cooking Instructions</h3>
        <p style={{ marginTop: '0.8rem', lineHeight: '1.8' }}>
          {meal.strInstructions}
        </p>
      </div>

      {/* External YouTube Tutorial Link */}
      {meal.strYoutube && (
        <div className="video-section">
          <h3>Video Tutorial</h3>
          <a
            href={meal.strYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="video-link"
          >
            Watch step-by-step video on YouTube ↗
          </a>
        </div>
      )}
    </div>
  );
}