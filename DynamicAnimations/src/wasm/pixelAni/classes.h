#ifndef CLASSES_H
#define CLASSES_H
#include <SDL2/SDL.h>

#include <array>

#include "../helper/helper.h"  // Make sure this defines Vector and DrawPixel

struct Pixel {
  float mass;
  Vector position;
  Vector velocity;
  Vector acceleration;
  std::array<uint8_t, 3> color;
  bool Direction;

  Pixel(float mass = 1, Vector position = Vector(0, 0),
        Vector velocity = Vector(0, 0), Vector acceleration = Vector(0, 0),
        std::array<uint8_t, 3> color = {0, 0, 0}, bool Direction = false);

  void applyForce(const Vector& force);
  void updatePosition();
  void drawData(SDL_Renderer* renderer);
};

#endif