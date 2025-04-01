
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ChefHat, Heart, Sparkles, Award } from 'lucide-react';
import { Recipe } from '@/utils/moodRecipeData';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, isFavorite = false, onToggleFavorite }: RecipeCardProps) => {
  const [showSparkle, setShowSparkle] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  // Random color for recipe card gradient
  const getRandomGradient = () => {
    const gradients = [
      'recipe-gradient-1',
      'recipe-gradient-2',
      'recipe-gradient-3',
      'recipe-gradient-4',
      'recipe-gradient-5',
      'recipe-gradient-6',
      'recipe-gradient-7',
      'recipe-gradient-8',
      'recipe-gradient-9',
      'recipe-gradient-10',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const [gradientClass] = useState(getRandomGradient());

  // Get recipe image URL based on recipe name
  const getRecipeImageUrl = (recipeName: string) => {
    // Clean up recipe name to use in search query
    const searchQuery = recipeName.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '+');
    return `https://source.unsplash.com/featured/?${searchQuery},food,dish,recipe&fit=crop&w=600&h=350`;
  };

  // Get a backup image if the first one fails
  const getBackupImageUrl = (recipeName: string) => {
    const searchQuery = recipeName.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '+');
    // Adding random parameters to prevent caching and get a different image
    return `https://source.unsplash.com/random/?${searchQuery},food&fit=crop&w=600&h=350&random=${Math.random()}`;
  };
  
  useEffect(() => {
    // Initial image URL
    setImageUrl(getRecipeImageUrl(recipe.name));
  }, [recipe.name]);

  useEffect(() => {
    // Show sparkle animation occasionally
    const sparkleTimer = setInterval(() => {
      if (isHovered) {
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 1000);
      }
    }, 3000);

    return () => clearInterval(sparkleTimer);
  }, [isHovered]);

  const handleImageError = () => {
    setImageError(true);
    // Try a different query to get another image
    setImageUrl(getBackupImageUrl(recipe.name));
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onToggleFavorite) {
      onToggleFavorite(recipe);
      
      toast({
        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: isFavorite ? `${recipe.title || recipe.name} has been removed from your favorites.` : `${recipe.title || recipe.name} has been added to your favorites.`,
        duration: 3000,
      });
    }
  };

  // Use title if available, otherwise use name for display
  const displayTitle = recipe.title || recipe.name;

  // Generate AI enthusiasm rating - this is just for fun
  const getEnthusiasmRating = () => {
    const ratings = ["Intriguing!", "Must try!", "Chef's pick!", "Crowd pleaser!"];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <Link
        to={`/recipe/${recipe.id}`}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 ${isHovered ? 'shadow-lg shadow-primary/20 dark:shadow-primary/10' : 'shadow-sm'}`}>
          {/* Recipe Image */}
          <div className="h-48 overflow-hidden">
            <img 
              src={imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              onError={handleImageError}
            />
          </div>

          {/* Content with gradient background */}
          <div className={`p-4 ${gradientClass} bg-opacity-20`}>
            <div className="absolute top-3 left-3 flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium
                ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                  recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                  'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}
              >
                {recipe.difficulty}
              </span>
              
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 flex items-center gap-1">
                <Sparkles size={10} className="inline" />
                AI Matched
              </span>
            </div>
            
            {/* Favorite button */}
            <button
              onClick={handleFavoriteToggle}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                isFavorite 
                  ? 'bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300 scale-110' 
                  : 'bg-gray-100/80 text-gray-500 dark:bg-gray-800/80 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              } ${isHovered ? 'transform scale-110' : ''}`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </button>

            <h3 className="font-bold text-lg mt-2 mb-1 line-clamp-1">{recipe.title || recipe.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{recipe.description}</p>
            
            {/* Recipe info */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{recipe.prepTime} + {recipe.cookTime}</span>
              </div>
              
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                <span>{recipe.servings}</span>
              </div>
              
              <div className="flex items-center">
                <ChefHat size={14} className="mr-1" />
                <span>{recipe.calories} cal</span>
              </div>
            </div>
            
            {/* AI enthusiasm rating */}
            <div className="mt-2 mb-2">
              <span className="text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <Award size={12} />
                <span className="font-medium">{Math.random() > 0.5 ? "Chef's pick!" : "Must try!"}</span>
              </span>
            </div>
            
            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              {recipe.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs transition-all hover:bg-primary/20 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary"
                >
                  {tag}
                </span>
              ))}
              {recipe.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                  +{recipe.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
