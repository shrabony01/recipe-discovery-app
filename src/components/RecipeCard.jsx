import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

/**
 * Reusable card to display meal previews with immediate favorite toggling.
 * @param {string} id - Meal ID (idMeal from TheMealDB)
 * @param {string} title - Meal title (strMeal)
 * @param {string} image - Meal thumbnail URL (strMealThumb)
 * @param {string} [category] - Optional category badge
 */
export default function RecipeCard({ id, title, image, category }) {
  // Access favorites state and action handlers from global context
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(id);

  // Toggle favorite status without navigating to the recipe detail page
  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (favorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  return (
    <div className="recipe-card">
      <Link to={`/recipe/${id}`} className="card-media-wrapper">
        <img src={image} alt={title} loading="lazy" />
      </Link>
      
      <div className="card-content">
        {category && <span className="card-badge">{category}</span>}
        
        <h3 className="card-title">
          <Link to={`/recipe/${id}`}>{title}</Link>
        </h3>

        <button
          onClick={handleToggleFavorite}
          className={`favorite-btn ${favorite ? 'active' : ''}`}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorite ? '★ In Favorites' : '☆ Add to Favorites'}
        </button>
      </div>
    </div>
  );
}