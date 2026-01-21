import { useState, useEffect } from 'react';
import RarityBadge from './RarityBadge';
import './Card.css';

export default function Card({ cardData, pokemonData }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [pokemonData]);

  if (!pokemonData) {
    return (
      <div className="card loading">
        <div className="card-spinner">Loading...</div>
      </div>
    );
  }

  const sprite = cardData.isShiny && pokemonData.spriteShiny 
    ? pokemonData.spriteShiny 
    : pokemonData.sprite;

  return (
    <div 
      className={`card ${cardData.isShiny ? 'shiny' : ''}`}
      style={{
        '--rarity-color': cardData.rarityData.color,
        '--glow-color': cardData.rarityData.glowColor
      }}
    >
      <div className="card-header">
        <RarityBadge rarity={cardData.rarity} isShiny={cardData.isShiny} />
      </div>
      
      <div className="card-image-container">
        {!imageLoaded && <div className="card-spinner">Loading...</div>}
        <img 
          src={sprite} 
          alt={pokemonData.name}
          className={`card-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      <div className="card-info">
        <h3 className="card-name">
          {pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}
        </h3>
        <div className="card-types">
          {pokemonData.types.map((type) => (
            <span key={type} className={`type-badge type-${type}`}>
              {type}
            </span>
          ))}
        </div>
        <div className="card-id">#{pokemonData.id}</div>
      </div>
    </div>
  );
}
