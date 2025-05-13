#include <SDL2/SDL.h>

#include <array>
#include <cstdint>
#include <iostream>
#include <random>
#include <string>
#include <vector>

#include "../helper/helper.h"
#include "convergeHeader.h"

extern int Winwidth;
extern int Winheight;

static int intialWinwidth = Winwidth;
static int intialWinheight = Winheight;

static std::random_device rd;
static std::mt19937 gen(rd());
static std::uniform_int_distribution<int> dis(0, Winwidth);
static std::uniform_int_distribution<uint8_t> dis_Color(0, 255);

// Name space to free up global space
namespace {
// False means go down, true means go up
struct Pixel {
  uint8_t mass;                  // Mass of the pixel
  Vector position;               // Position of the pixel
  Vector velocity;               // Velocity of the pixel
  Vector acceleration;           // Acceleration of the pixel
  std::array<uint8_t, 3> color;  // RGB color of the pixel
  bool Direction;                // Direction of the pixel (for linear motion)

  Pixel(uint8_t mass = 1, Vector position = Vector(0, 0),
        Vector velocity = Vector(0, 0), Vector acceleration = Vector(0, 0),
        std::array<uint8_t, 3> color = {0, 0, 0}, bool Direction = false)
      : mass(mass),
        position(position),
        velocity(velocity),
        acceleration(acceleration),
        color(color),
        Direction(Direction) {}

  // Apply a force to the pixel
  void applyForce(const Vector& force) {
    Vector forceCopy = force;
    forceCopy.divide(this->mass);       // F = ma -> a = F / m
    this->acceleration.add(forceCopy);  // Add the resulting acceleration
  }

  void updatePosition() {
    // Update the position based on velocity
    this->velocity.add(this->acceleration);
    this->position.add(this->velocity);
    this->acceleration.multiply(0);
  }

  void drawData(SDL_Renderer* renderer) {
    // Draw the pixel using the helper function
    DrawPixel(renderer, position.x, position.y, color[0], color[1], color[2], 0,
              2);
  }
};
}  // namespace
static std::vector<Pixel> pixels;
// Function to initialize the pixels
void initPixels(std::vector<Pixel>& pixels) {
  static const int numPixels = 100;  // Number of pixels to create
  for (int i = 0; i < numPixels; ++i) {
    Vector position;
    bool direction;

    if (i % 2 == 0) {
      position = Vector(dis(gen), Winheight - 15);
      direction = false;
    } else {
      position = Vector(dis(gen), 15);  // Top of the screen
      direction = true;                 // Move downward
    }

    Vector velocity(0, 0);
    Vector acceleration(0, 0);
    std::array<uint8_t, 3> color = {dis_Color(gen), dis_Color(gen),
                                    dis_Color(gen)};
    uint8_t mass = static_cast<uint8_t>(dis_Color(gen) % 10 + 1);

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
    dis = std::uniform_int_distribution<int>(0, Winwidth);
    initPixels(pixels);
  }
}

void MainConvergeCall(SDL_Renderer* renderer) {
  // Initialize the pixels
  if (pixels.empty()) {
    initPixels(pixels);
  }
  // If window size changes
  WindowSizeChange();

  for (auto& pixel : pixels) {
    // Apply gravity
    if (pixel.Direction == true) {
      pixel.applyForce(Vector(0, 1));  // Downward force for pixels at the top
    } else if (pixel.Direction == false) {
      pixel.applyForce(Vector(0, -1));  // Upward force for pixels at the bottom
    }
    pixel.updatePosition();
    // Draw the pixel
    pixel.drawData(renderer);

    // Reset acceleration for the next frame
    pixel.acceleration = Vector(0, 0);
  }
}
