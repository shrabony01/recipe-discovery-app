## Recipe Discovery App(SBA )
A React web app that lets you explore meals from around the world using the free TheMealDB API. You can browse dishes by category, search meals by name, check full ingredients and cooking steps, and save your favorite recipes so they stay saved even when you refresh or close the tab.

# What the App Does
* Browse Categories: Shows all food categories right on the home page with pictures and descriptions.

* Category View: Clicking a category opens up all recipes in that specific category (/category/:categoryName).

* Recipe Details: Shows the full recipe page with ingredients, measurements, instructions, and YouTube video tutorials (/recipe/:recipeId).

* Live Search: Search bar in the top navigation takes you straight to results (/search?query=...).

* Persistent Favorites: Heart or star recipes to keep them saved in your personal favorites list (/favorites).

* Feedback States: Clean loading spinners when fetching and friendly error messages if an API call fails.


## Project Reflection
1. The Hardest Part
The most challenging part of this project was definitely the Favorites page. TheMealDB API lets you search or filter by category easily, but it doesn't give you an endpoint to look up multiple IDs all at once. Because of that, when someone had 5 or 6 favorite meals saved, I had to fetch each meal's details one by one using lookup.php?i=id.

Getting Promise.all to fetch everything together without crashing the whole page if one recipe failed took some trial and error. I wrapped each single request so that if one failed, the rest of the favorites would still load without breaking the UI.

2. Design Decisions
Custom useFetch with Cleanup: Instead of writing useEffect and fetch calls over and over in every page, I made a generic useFetch hook. I also added AbortController inside it. That way, if a user clicks around quickly between categories or types fast in search, unfinished API calls get canceled so the app doesn't try to update state on an unmounted component or trigger console warnings.

Combining useLocalStorage with Context: Instead of putting local storage code directly inside the recipe card buttons, I created useLocalStorage and hooked it directly into FavoritesContext. This made the favorites count in the navbar, the toggle button on recipe cards, and the details page stay perfectly in sync without messy prop drilling.