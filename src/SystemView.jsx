import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls } from '@react-three/drei';
import { kelvinToRGB } from '../utils/colorMap';
import { gsap } from 'gsap';

const StarField = ({ data, predictions, onStarClick }) => {
  const pointsRef = useRef();
  const positions = new Float32Array(data.length * 3);
  const colors = new Float32Array(data.length * 3);

  data.forEach((star, i) => {
    const raRad = (star.ra * Math.PI) / 180;
    const decRad = (star.dec * Math.PI) / 180;
    const dist = 100; // Arbitrary radius for celestial sphere
    positions[i * 3] = dist * Math.cos(decRad) * Math.cos(raRad);
    positions[i * 3 + 1] = dist * Math.cos(decRad) * Math.sin(raRad);
    positions[i * 3 + 2] = dist * Math.sin(decRad);

    // Color: Use ML prediction if available, else temperature
    let r, g, b;
    if (predictions && predictions[star.id]) {
      const prob = predictions[star.id];
      // Green (high prob) to red (low prob)
      r = 255 * (1 - prob);
      g = 255 * prob;
      b = 0;
    } else {
      [r, g, b] = kelvinToRGB(star.teff || 5772); // Default Sun-like temp
    }
    colors[i * 3] = r / 255;
    colors[i * 3 + 1] = g / 255;
    colors[i * 3 + 2] = b / 255;
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial vertexColors size={0.1} sizeAttenuation={true} />
    </Points>
  );
};

const SkyView = ({ data, predictions, setSelectedStar, setViewMode }) => {
  const [fov, setFov] = useState(75);
  const cameraRef = useRef();

  const handleStarClick = (event) => {
    const starIndex = event.intersections[0]?.index;
    if (starIndex == null) return;
    const star = data[starIndex];
    setSelectedStar(star);

    // Cinematic zoom: Animate camera
    const raRad = (star.ra * Math.PI) / 180;
    const decRad = (star.dec * Math.PI) / 180;
    const dist = 10; // Closer for transition
    const targetPos = {
      x: dist * Math.cos(decRad) * Math.cos(raRad),
      y: dist * Math.cos(decRad) * Math.sin(raRad),
      z: dist * Math.sin(decRad),
    };
    gsap.to(cameraRef.current.position, {
      duration: 2,
      ease: 'power2.inOut',
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      onComplete: () => setViewMode('system'),
    });
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <Canvas camera={{ fov, position: [0, 0, 100], ref: cameraRef }}>
        <ambientLight intensity={0.5} />
        <OrbitControls enableZoom={true} enablePan={true} />
        <StarField data={data} predictions={predictions} onStarClick={handleStarClick} />
      </Canvas>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <input
          type="range"
          min="10"
          max="120"
          value={fov}
          onChange={(e) => setFov(Number(e.target.value))}
        />
        <label>FOV: {fov}°</label>
      </div>
    </div>
  );
};

export default SkyView;