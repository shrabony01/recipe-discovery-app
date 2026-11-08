import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

export default function CategoryPage() {
  // Extract categoryName from the dynamic route /category/:categoryName
  const { categoryName } = useParams();

  // Construct endpoint to fetch recipes by category
  const apiUrl = categoryName
    ? `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(categoryName)}`
    : null;

  const { data, loading, error } = useFetch(apiUrl);

  if (loading) {
    return <Spinner message={`Loading recipes for ${categoryName}...`} />;
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const meals = data?.meals || [];

  return (
    <div className="page-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link> &gt; <span>{categoryName}</span>
      </nav>

      <h2 style={{ marginBottom: '1.5rem' }}>{categoryName} Recipes</h2>

      {/* Empty State vs Meal Grid */}
      {meals.length === 0 ? (
        <p style={{ color: '#6c757d' }}>No recipes found under this category.</p>
      ) : (
        <div className="grid-layout">
          {meals.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              id={meal.idMeal}
              title={meal.strMeal}
              image={meal.strMealThumb}
              category={categoryName}
            />
          ))}
        </div>
      )}
    </div>
  );
}