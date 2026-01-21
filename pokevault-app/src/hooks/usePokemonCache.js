import { useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'pokevault_pokemon_cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Load cache from localStorage
function loadCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return {};
    
    const data = JSON.parse(cached);
    const now = Date.now();
    
    // Remove expired entries
    const validCache = {};
    Object.keys(data).forEach(key => {
      if (data[key].timestamp && now - data[key].timestamp < CACHE_EXPIRY) {
        validCache[key] = data[key];
      }
    });
    
    return validCache;
  } catch (error) {
    console.error('Error loading cache:', error);
    return {};
  }
}

// Save cache to localStorage
function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

export function usePokemonCache() {
  const [cache, setCache] = useState(() => loadCache());
  const [loading, setLoading] = useState({});

  // Save cache whenever it changes
  useEffect(() => {
    saveCache(cache);
  }, [cache]);

  const fetchPokemon = useCallback(async (pokemonId) => {
    // Check if already in cache
    if (cache[pokemonId]) {
      return cache[pokemonId].data;
    }

    // Check if currently loading
    if (loading[pokemonId]) {
      return null;
    }

    // Fetch from API
    setLoading(prev => ({ ...prev, [pokemonId]: true }));
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon ${pokemonId}`);
      }
      
      const data = await response.json();
      
      const pokemonData = {
        id: data.id,
        name: data.name,
        types: data.types.map(t => t.type.name),
        sprite: data.sprites.other["official-artwork"].front_default,
        spriteShiny: data.sprites.other["official-artwork"].front_shiny || data.sprites.front_shiny
      };
      
      // Update cache
      setCache(prev => ({
        ...prev,
        [pokemonId]: {
          data: pokemonData,
          timestamp: Date.now()
        }
      }));
      
      setLoading(prev => ({ ...prev, [pokemonId]: false }));
      
      return pokemonData;
    } catch (error) {
      console.error(`Error fetching Pokémon ${pokemonId}:`, error);
      setLoading(prev => ({ ...prev, [pokemonId]: false }));
      return null;
    }
  }, [cache, loading]);

  const fetchMultiple = useCallback(async (pokemonIds) => {
    const promises = pokemonIds.map(id => fetchPokemon(id));
    return await Promise.all(promises);
  }, [fetchPokemon]);

  return {
    fetchPokemon,
    fetchMultiple,
    cache
  };
}
