import { Heart, ChefHat, WheatOff, Wheat } from "lucide-react";
import React, { useState, useEffect } from "react";

const RecipeCard = ({ recipe, bg, badge, isFavorite, toggleFavorite }) => {
  const [isFav, setIsFav] = useState(
    JSON.parse(localStorage.getItem("favorites"))?.some(
      (fav) => fav.strMeal === recipe.strMeal
    ) || false
  );

  const addRecipeToFavorites = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isRecipeAlreadyInFavorites = favorites.some(
      (fav) => fav.strMeal === recipe.strMeal
    );
    if (isRecipeAlreadyInFavorites) {
      favorites = favorites.filter((fav) => fav.strMeal !== recipe.strMeal);
      setIsFav(false);
    } else {
      favorites.push(recipe);
      setIsFav(true);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    toggleFavorite();
  };

  const glutenIngredients = [
    "Wheat",
    "Maida",
    "Flour",
    "Bread",
    "Pasta",
    "Barley",
    "Rye",
    "Cracker",
  ];

  const isGlutenFree = (recipe) => {
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`]?.toLowerCase();
      if (
        ingredient &&
        glutenIngredients.some((glutenItem) => ingredient.includes(glutenItem))
      ) {
        return false; // Contains gluten
      }
    }
    return true; // Gluten-free
  };

  const glutenFreeLabel = isGlutenFree(recipe)
    ? "Gluten-free"
    : "Contains Gluten";

  return (
    <div
      className={`flex flex-col rounded-md ${bg} overflow-hidden p-3 relative`}
    >
      {/* href={recipe.strYoutube} */}
      <a
        href={`https://www.youtube.com/results?search_query=${recipe.strMeal} recipe`}
        target="_blank"
        className="relative h-32"
      >
        <div className="skeleton absolute inset-0" />
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="rounded-md w-full h-full object-cover cursor-pointer opacity-0 transition-opacity duration-500"
          onLoad={(e) => {
            e.currentTarget.style.opacity = 1;
            e.currentTarget.previousElementSibling.style.display = "none";
          }}
        />
        <div
          className={`absolute bottom-2 left-2 bg-white rounded-full p-1 cursor-pointer flex items-center gap-1 text-sm`}
        >
          <ChefHat size={16} />{" "}
          {recipe.strCategory == "Miscellaneous"
            ? recipe.strIngredient1
            : recipe.strCategory}
        </div>

        <div
          className="absolute top-1 right-2 bg-white rounded-full p-1 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            addRecipeToFavorites();
          }}
        >
          {!isFavorite && (
            <Heart
              size={17}
              className="hover:fill-red-500 hover:text-red-500"
            />
          )}
          {isFavorite && (
            <Heart size={17} className="fill-red-500 text-red-500" />
          )}
        </div>
      </a>
      <div className="flex mt-1">
        <p className="font-bold tracking-wide">{recipe.strMeal}</p>
      </div>
      <p className="my-2">{recipe.strArea} Kitchen</p>
      <div className="flex gap-2 mt-auto">
        {glutenFreeLabel === "Gluten-free" ? (
          <div className={`flex gap-1 ${badge} items-center p-1 rounded-md`}>
            <WheatOff size={16} />
            <span className="text-sm tracking-tighter font-semibold">
              {glutenFreeLabel}
            </span>
          </div>
        ) : (
          <div className={`flex gap-1 ${badge} items-center p-1 rounded-md`}>
            <Wheat size={16} />
            <span className="text-sm tracking-tighter font-semibold">
              {glutenFreeLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
