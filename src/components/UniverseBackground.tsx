"use client";

import { useEffect, useState } from "react";

interface StarPosition {
  left: number;
  top: number;
  delay: number;
  size: 'small' | 'medium' | 'large';
}

interface ShootingStarPosition {
  left: number;
  top: number;
  delay: number;
}

interface PlanetPosition {
  left: number;
  top: number;
  type: 1 | 2 | 3;
  delay: number;
}

export default function UniverseBackground() {
  const [stars, setStars] = useState<StarPosition[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStarPosition[]>([]);
  const [planets, setPlanets] = useState<PlanetPosition[]>([]);

  useEffect(() => {
    // Generate stars
    const starPositions: StarPosition[] = Array.from({ length: 200 }, (_, i) => {
      const sizeChance = Math.random();
      let size: 'small' | 'medium' | 'large' = 'small';
      
      if (sizeChance > 0.9) size = 'large';
      else if (sizeChance > 0.7) size = 'medium';

      return {
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        size
      };
    });

    // Generate shooting stars
    const shootingStarPositions: ShootingStarPosition[] = Array.from({ length: 3 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 50,
      delay: i * 8 + Math.random() * 5
    }));

    // Generate planets
    const planetPositions: PlanetPosition[] = [
      {
        left: 15,
        top: 20,
        type: 1,
        delay: 0
      },
      {
        left: 75,
        top: 65,
        type: 2,
        delay: -10
      },
      {
        left: 45,
        top: 85,
        type: 3,
        delay: -5
      }
    ];

    setStars(starPositions);
    setShootingStars(shootingStarPositions);
    setPlanets(planetPositions);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Galaxy background */}
      <div className="galaxy" />
      
      {/* Nebulas */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      
      {/* Star field */}
      <div className="star-field">
        {/* Static stars with twinkling effect */}
        {stars.map((star, i) => (
          <div
            key={`star-${i}`}
            className={`star star-${star.size}`}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        {/* Moving stars layer */}
        <div className="moving-stars">
          {stars.slice(0, 50).map((star, i) => (
            <div
              key={`moving-star-${i}`}
              className="star star-small"
              style={{
                left: `${star.left}%`,
                top: `${star.top + 100}%`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>
        
        {/* Shooting stars */}
        {shootingStars.map((shootingStar, i) => (
          <div
            key={`shooting-${i}`}
            className="shooting-star"
            style={{
              left: `${shootingStar.left}%`,
              top: `${shootingStar.top}%`,
              animationDelay: `${shootingStar.delay}s`,
            }}
          />
        ))}
        
        {/* Planets */}
        {planets.map((planet, i) => (
          <div
            key={`planet-${i}`}
            className={`planet planet-${planet.type}`}
            style={{
              left: `${planet.left}%`,
              top: `${planet.top}%`,
              animationDelay: `${planet.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Additional atmospheric effects */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 800px 600px at 20% 40%, rgba(120, 119, 198, 0.03), transparent 50%),
            radial-gradient(ellipse 600px 800px at 80% 70%, rgba(255, 119, 198, 0.02), transparent 50%),
            radial-gradient(ellipse 400px 300px at 50% 100%, rgba(119, 198, 255, 0.03), transparent 50%)
          `
        }}
      />
      
      {/* Subtle grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}