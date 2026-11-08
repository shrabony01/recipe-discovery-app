import React from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

// Free endpoint listing all available categories
const CATEGORIES_API_URL = 'https://www.themealdb.com/api/json/v1/1/categories.php';

export default function HomePage() {
  // Use our custom data-fetching hook
  const { data, loading, error } = useFetch(CATEGORIES_API_URL);

  // Render loading state while data is being retrieved
  if (loading) {
    return <Spinner message="Fetching recipe categories..." />;
  }

  // Render error component if the fetch fails
  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message={error} />
      </div>
    );
  }

  // Extract categories safely with fallback to empty array
  const categories = data?.categories || [];

  return (
    <div className="page-container">
      {/* Hero / Introduction section */}
      <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          Discover Delicious Recipes
        </h1>
        <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
          Browse recipes by category, find meal inspiration, and save your favorites.
        </p>
      </section>

      {/* Grid of categories */}
      <div className="grid-layout">
        {categories.map((category) => (
          <Link
            to={`/category/${category.strCategory}`}
            key={category.idCategory}
            className="category-card"
          >
            <img
              src={category.strCategoryThumb}
              alt={category.strCategory}
              loading="lazy"
            />
            <div className="category-info">
              <h3>{category.strCategory}</h3>
              <p style={{ fontSize: '0.88rem', color: '#6c757d', marginTop: '0.4rem' }}>
                {category.strCategoryDescription.slice(0, 80)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}