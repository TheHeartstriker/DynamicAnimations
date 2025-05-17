#include "pixel.h"

#include <SDL2/SDL.h>

#include <array>
#include <cstdint>
#include <iostream>
#include <random>
#include <string>
#include <vector>

#include "../helper/helper.h"
#include "classes.h"
#include "pixelUtil.h"

extern int Winwidth;
extern int Winheight;

static int intialWinwidth = Winwidth;
static int intialWinheight = Winheight;
static int midPoint = Winheight / 2;
static std::string name = "BlackHole";

static std::random_device rd;
static std::mt19937 gen(rd());
static std::uniform_int_distribution<int> disW(0, Winwidth);
static std::uniform_int_distribution<int> disH(0, Winheight);

static std::uniform_real_distribution<float> dis_vel(-1.0f, 1.0f);
static std::uniform_real_distribution<float> dis_mass(1.0f, 3.0f);
static std::uniform_int_distribution<uint8_t> dis_Color(0, 255);

static std::vector<Pixel> pixels;

static void resetPixel(Pixel& pixel, std::string name) {
  pixel.color[0] = dis_Color(gen);  // Randomize color
  pixel.color[1] = dis_Color(gen);
  pixel.color[2] = dis_Color(gen);
  pixel.velocity = Vector(0, 0);      // Reset velocity
  pixel.acceleration = Vector(0, 0);  // Reset acceleration
  if (name == "BlackHole") {
    pixel.position.y = disH(gen);
    pixel.position.x = disW(gen);
    pixel.velocity = Vector(dis_vel(gen), dis_vel(gen));
  }
  if (name == "Converge") {
    pixel.position.x = disW(gen);  // Randomize x position
    if (pixel.Direction == true) {
      pixel.position.y = 1;  // Reset to top
    } else {
      pixel.position.y = Winheight - 1;  // Reset to bottom
    }
  }
}
// Think about attracting as if the black hole is spinning
struct Attractor {
  Vector position;  // Position of the attractor
  int Radius;       // Size of the attractor
  float mass;       // Mass of the attractor

  Attractor(Vector position, float mass, int Radius)
      : position(position), mass(mass), Radius(Radius) {}

  // Apply a force to the pixel
  Vector attract(Pixel& pixel) {
    Vector force = position;
    force.subtract(pixel.position);
    float distance = force.magnitude();
    float strength = (1 * mass * pixel.mass) / (distance * distance);

    // --- Radial force (towards center) ---
    force.normalize();
    force.multiply(strength);

    // --- Tangential "spin" force ---
    // Create a perpendicular vector (2D cross product)
    Vector tangent(-force.y, force.x);  // 90-degree rotation
    tangent.normalize();
    float spinStrength =
        0.03f * strength;  // Adjust this value for more/less spin
    tangent.multiply(spinStrength);

    // Combine radial and tangential forces
    force.add(tangent);

    return force;
  }

  void consume(Pixel& pixel) {
    // Consume the pixel
    float dx = position.x - pixel.position.x;
    float dy = position.y - pixel.position.y;
    float distance = std::sqrt(dx * dx + dy * dy);
    if (distance < Radius) {
      resetPixel(pixel, "BlackHole");
    }
  }
};

// Function to initialize the pixels
void initPixels(std::vector<Pixel>& pixels) {
  static const int numPixels = 1000;
  for (int i = 0; i < numPixels; ++i) {
    Vector position;
    bool direction;
    Vector velocity;

    if (name == "BlackHole") {
      blackHoleCreation(position, direction, disW, gen, disH);
      velocity = Vector(dis_vel(gen), dis_vel(gen));
    } else {
      convergeCreation(position, direction, i, disW, gen, Winheight);
      velocity = Vector(0, 0);
    }
    Vector acceleration(0, 0);
    std::array<uint8_t, 3> color = {dis_Color(gen), dis_Color(gen),
                                    dis_Color(gen)};
    float mass = dis_mass(gen);

    pixels.emplace_back(mass, position, velocity, acceleration, color,
                        direction);
  }
}
// Instructions for window size change
static void WindowSizeChange() {
  if (Winwidth != intialWinwidth || Winheight != intialWinheight) {
    pixels.clear();
    intialWinwidth = Winwidth;
    intialWinheight = Winheight;
    midPoint = Winheight / 2;
    disW = std::uniform_int_distribution<int>(0, Winwidth);
    disH = std::uniform_int_distribution<int>(0, Winheight);
    initPixels(pixels);
  }
}

static void centerDetection(Pixel& pixel) {
  // Chance to disappear if close to center
  if (pixel.position.y > Winheight / 2 - 85 &&
      pixel.position.y < Winheight / 2 + 85 && dis_Color(gen) < 15) {
    resetPixel(pixel, "Converge");
  }
  // If at center
  if (pixel.position.y > Winheight / 2 - 18 &&
      pixel.position.y < Winheight / 2 + 18) {
    resetPixel(pixel, "Converge");
  }
}

static float convergeForce(Pixel& pixel, float Decay) {
  float distanceFromCenter = std::abs(pixel.position.y - Winheight / 2);
  float slowFactor = (1.0f + distanceFromCenter * Decay);

  if (pixel.Direction == true) {
    Vector force(0,
                 1.0f / slowFactor);  // Apply smaller force as it gets closer
    pixel.applyForce(force);          // Downward force for pixels at the top
  } else if (pixel.Direction == false) {
    Vector force(0,
                 -1.0f / slowFactor);  // Apply smaller force as it gets closer
    pixel.applyForce(force);           // Upward force for pixels at the bottom
  }
  return slowFactor;
}

// Function to

static void pixelColorDegradation(Pixel& pixel, float slowFactor) {
  const float adjustmentFactor =
      1.5f;  // Adjust this value to control the speed of color change

  // Decrease the color values over time
  pixel.color[0] = static_cast<uint8_t>(std::min(
      255.0f,
      pixel.color[0] + 0.005f / (slowFactor * adjustmentFactor)));  // Red
  pixel.color[1] = static_cast<uint8_t>(std::max(
      0.0f,
      pixel.color[1] - 0.003f / (slowFactor * adjustmentFactor)));  // Green
  pixel.color[2] = static_cast<uint8_t>(std::max(
      0.0f,
      pixel.color[2] - 0.003f / (slowFactor * adjustmentFactor)));  // Blue
}

void MainConvergeCall(SDL_Renderer* renderer) {
  // Initialize the pixels
  if (pixels.empty()) {
    initPixels(pixels);
  }
  // If window size changes
  WindowSizeChange();

  const double Decay = 0.8;

  for (auto& pixel : pixels) {
    if (name == "Converge") {
      float slowFactor = convergeForce(pixel, Decay);
      centerDetection(pixel);
      pixelColorDegradation(pixel, slowFactor);
    } else if (name == "BlackHole") {
      // Create a black hole at the center of the screen
      Attractor blackHole(Vector(Winwidth / 2, Winheight / 2), 750, 100);
      // Attract the pixel towards the black hole
      Vector force = blackHole.attract(pixel);
      pixel.applyForce(force);
      blackHole.consume(pixel);
    }
    // Update the pixel's position
    pixel.updatePosition();
    // Draw the pixel
    pixel.drawData(renderer);

    // Reset acceleration for the next frame
    pixel.acceleration = Vector(0, 0);
  }
}
