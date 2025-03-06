import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import axios from "axios";
import { getRandomColor } from "../lib/utils";

const allMealsUrl = import.meta.env.VITE_ALL_MEALS_URL;
const cuisineUrl = import.meta.env.VITE_CUISINE_MEALS_URL;
const mealDetailsUrl = import.meta.env.VITE_MEAL_DETAILS_URL;

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cuisine, setCuisine] = useState("");
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchRecipes = async () => {
    setLoading(true);
    setRecipes([]);
    try {
      const { data } = await axios(allMealsUrl);
      if (data) {
        setRecipes(data.meals); // Now includes full details
      } else {
        console.error("No results found:", data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullDetails = async (mealIds) => {
    try {
      const mealRequests = mealIds.map((id) =>
        axios.get(`${mealDetailsUrl}${id}`)
      );
      const responses = await Promise.all(mealRequests);
      const fullDetails = responses.map((res) => res.data.meals[0]);
      return fullDetails;
    } catch (error) {
      console.error("Error fetching meal details:", error);
      return [];
    }
  };

  const handleSearchByCuisine = async (e) => {
    e.preventDefault();
    if (!cuisine) {
      alert("Please enter a cuisine type.");
      return;
    }

    setLoading(true);
    setRecipes([]);
    try {
      const { data } = await axios(`${cuisineUrl}${cuisine}`);
      if (data.meals) {
        const mealIds = data.meals.map((meal) => meal.idMeal);
        const fullRecipes = await fetchFullDetails(mealIds);
        setRecipes(fullRecipes);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (recipeId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(recipeId)
        ? prevFavorites.filter((id) => id !== recipeId)
        : [...prevFavorites, recipeId]
    );
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="bg-[#faf9fb] p-10 flex-1">
      <div className="max-w-screen-lg mx-auto">
        <form onSubmit={handleSearchByCuisine}>
          <label className="input shadow-md flex items-center gap-2 min-w-full">
            <Search size={"24"} />
            <input
              type="text"
              className="text-sm md:text-md grow"
              placeholder="What kind of cuisine you want to cook today?"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            />
          </label>
        </form>

        <h1 className="font-bold text-3xl md:text-5xl mt-4">
          Recommended Recipes
        </h1>
        <p className="text-slate-500 font-semibold ml-1 my-2 text-sm tracking-tight">
          Popular Choices
        </p>

        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            recipes.map((meal, index) => (
              <RecipeCard
                key={index}
                recipe={meal}
                isFavorite={favorites.includes(meal.idMeal)}
                toggleFavorite={toggleFavorite}
                {...getRandomColor()}
              />
            ))}

          {loading &&
            [...Array(9)].map((_, index) => (
              <div key={index} className="flex flex-col gap-4 w-full">
                <div className="skeleton h-32 w-full"></div>
                <div className="flex justify-between">
                  <div className="skeleton h-4 w-28"></div>
                  <div className="skeleton h-4 w-24"></div>
                </div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
