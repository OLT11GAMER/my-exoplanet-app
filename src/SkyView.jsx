import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls } from '@react-three/drei';
import { useState, useRef } from 'react';
// App.jsx
const [selectedStar, setSelectedStar] = useState(null);
const [viewMode, setViewMode] = useState('sky'); // 'sky' or 'system'

// In handleStarClick:
gsap.to(camera.position, { x: targetX, y: targetY, z: targetZ, duration: 2, ease: 'power2.inOut', onComplete: () => setViewMode('system') });
const StarField = ({ data, onStarClick }) => {
  const pointsRef = useRef();
  const positions = new Float32Array(data.length * 3);
  const colors = new Float32Array(data.length * 3);

  data.forEach((star, i) => {
    const raRad = (star.ra * Math.PI) / 180;
    const decRad = (star.dec * Math.PI) / 180;
    const dist = 100; // Arbitrary for visualization
    positions[i * 3] = dist * Math.cos(decRad) * Math.cos(raRad);
    positions[i * 3 + 1] = dist * Math.cos(decRad) * Math.sin(raRad);
    positions[i * 3 + 2] = dist * Math.sin(decRad);

    // Color by temperature (see colorMap.js below)
    const [r, g, b] = kelvinToRGB(star.st_teff || 5000); // Default 5000K
    colors[i * 3] = r / 255;
    colors[i * 3 + 1] = g / 255;
    colors[i * 3 + 2] = b / 255;
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} onClick={onStarClick}>
      <PointMaterial vertexColors size={0.1} />
    </Points>
  );
};

const SkyView = ({ data }) => {
  const [fov, setFov] = useState(75); // Adjustable FOV

  const handleStarClick = (event) => {
    const starIndex = event.intersections[0].index; // Get clicked star
    const selectedStar = data[starIndex];
  // In handleStarClick:
gsap.to(camera.position, { x: targetX, y: targetY, z: targetZ, duration: 2, ease: 'power2.inOut', onComplete: () => setViewMode('system') });
    // Trigger transition to detailed view (pass to parent)
  };

  return (
    <Canvas camera={{ fov }}>
      <OrbitControls enableZoom={true} /> {/* Look around, zoom */}
      <StarField data={data} onStarClick={handleStarClick} />
      <Slider value={params.learningRate} onChange={v => setParams({ ...params, learningRate: v })} />
<Button onClick={() => trainModel(data)}>Retrain</Button>
    </Canvas>
  );
};