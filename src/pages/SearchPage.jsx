import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import RecipeCard from '../components/RecipeCard';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

export default function SearchPage() {
  // Read query parameters from URL: /search?query=name
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  // TheMealDB search endpoint by meal name
  const apiUrl = query.trim()
    ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query.trim())}`
    : null;

  const { data, loading, error } = useFetch(apiUrl);

  if (loading) {
    return <Spinner message={`Searching recipes for "${query}"...`} />;
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const results = data?.meals || [];

  return (
    <div className="page-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link> &gt; <span>Search</span>
      </nav>

      <h2 style={{ marginBottom: '1.5rem' }}>
        {query ? `Search Results for "${query}"` : 'Search Recipes'}
      </h2>

      {/* Case 1: No query entered */}
      {!query && (
        <p style={{ color: '#6c757d' }}>
          Please enter a recipe name in the search bar above to discover dishes.
        </p>
      )}

      {/* Case 2: Query entered, but no matching meals found */}
      {query && results.length === 0 && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
            No recipes found matching "{query}". Try another search term!
          </p>
        </div>
      )}

      {/* Case 3: Matching results found */}
      {results.length > 0 && (
        <div className="grid-layout">
          {results.map((meal) => (
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