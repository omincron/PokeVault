import './RarityBadge.css';

export default function RarityBadge({ rarity, isShiny }) {
  return (
    <div className="rarity-badge-container">
      <span 
        className={`rarity-badge rarity-${rarity}`}
      >
        {rarity.toUpperCase()}
      </span>
      {isShiny && (
        <span className="shiny-badge">
          ✨ SHINY
        </span>
      )}
    </div>
  );
}
