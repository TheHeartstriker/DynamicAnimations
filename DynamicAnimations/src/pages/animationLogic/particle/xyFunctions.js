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

//Handles collision between objects and the window
export function collision(data, ObjectData, Radius) {
  // Window collision's
  if (data.position[0] < Radius) {
    data.position[0] = Radius;
    data.velX *= 0.7;
    data.velX *= -1;
  }
  if (data.position[0] > window.innerWidth - Radius) {
    data.position[0] = window.innerWidth - Radius;
    data.velX *= 0.7;
    data.velX *= -1;
  }
  if (data.position[1] < Radius) {
    data.position[1] = Radius;
    data.velY *= 0.7;
    data.velY *= -1;
  }
  if (data.position[1] > window.innerHeight - Radius) {
    data.position[1] = window.innerHeight - Radius;
    data.velY *= 0.7;
    data.velY *= -1;
  }

  // Object collision's
  for (let i = 0; i < ObjectData.length; i++) {
    if (data === ObjectData[i]) continue;

    let Distance = Math.sqrt(
      Math.pow(data.position[0] - ObjectData[i].position[0], 2) +
        Math.pow(data.position[1] - ObjectData[i].position[1], 2)
    );

    if (Distance < Radius * 2 && Distance > 0) {
      // Avoid division by zero
      let angle = Math.atan2(
        data.position[1] - ObjectData[i].position[1],
        data.position[0] - ObjectData[i].position[0]
      );
      let overlap = Radius * 2 - Distance;
      let moveX = (Math.cos(angle) * overlap) / 2;
      let moveY = (Math.sin(angle) * overlap) / 2;

      // Move both objects away from each other
      data.position[0] += moveX;
      data.position[1] += moveY;
      ObjectData[i].position[0] -= moveX;
      ObjectData[i].position[1] -= moveY;

      // Velocity update for elastic collision (assuming equal masses)
      let nx = Math.cos(angle); // Normal vector x-component
      let ny = Math.sin(angle); // Normal vector y-component

      // Relative velocity components along the collision axis
      let v1n = data.velX * nx + data.velY * ny; // Normal component of data's velocity
      let v2n = ObjectData[i].velX * nx + ObjectData[i].velY * ny; // Normal component of other object's velocity
      // Tangential components (unchanged in elastic collision)
      let v1t = data.velX * -ny + data.velY * nx;
      let v2t = ObjectData[i].velX * -ny + ObjectData[i].velY * nx;
      // Swap normal components for elastic collision (equal masses)
      // New velocities: normal component swapped, tangential unchanged
      data.velX = v2n * nx - v1t * ny;
      data.velY = v2n * ny + v1t * nx;
      ObjectData[i].velX = v1n * nx - v2t * ny;
      ObjectData[i].velY = v1n * ny + v2t * nx;
      // Damping effect to reduce speed after collision
      data.velX *= 0.7;
      data.velY *= 0.7;
      ObjectData[i].velX *= 0.7;
      ObjectData[i].velY *= 0.7;
    }
  }
}

export function mouseAura(particle, mousePosRef) {
  const dx = mousePosRef.current.x - particle.position[0];
  const dy = mousePosRef.current.y - particle.position[1];
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= 200 && distance > 1) {
    // The closer the particle, the stronger the force
    const strength = (1 - distance / 200) * 3; // 0.5 is a tunable factor
    // Normalize direction
    const nx = dx / distance;
    const ny = dy / distance;
    // Apply force toward mouse
    particle.velX += nx * strength;
    particle.velY += ny * strength;
  }
}
