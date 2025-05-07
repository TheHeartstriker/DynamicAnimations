export function getCenteredRandom() {
  let min = 0;
  let max = window.innerWidth;
  // Calculate mean (center) of the range
  const mean = (min + max) / 2;
  const stdDev = (max - min) / 6; // Approx 99.7% of values within range

  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  let result = mean + z * stdDev;

  result = Math.max(min, Math.min(max, Math.round(result)));

  return { x: result, y: window.innerHeight };
}

export function getRandomCirclePoint(screenWidth, screenHeight, maxRadius) {
  // Center of the screen
  const centerX = screenWidth / 2;
  const centerY = screenHeight / 2;

  // Use Gaussian distribution for radius (more points near center)
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  // Scale radius (stdDev controls spread, adjust as needed)
  const stdDev = maxRadius / 3; // Most points within maxRadius
  const radius = Math.abs(z * stdDev); // Ensure non-negative

  // Uniform angle for circular distribution
  const angle = Math.random() * 2 * Math.PI;

  // Convert polar to Cartesian coordinates
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  // Round to integers and clamp to screen bounds
  const finalX = Math.max(0, Math.min(screenWidth, Math.round(x)));
  const finalY = Math.max(0, Math.min(screenHeight, Math.round(y)));

  return { x: finalX, y: finalY };
}
