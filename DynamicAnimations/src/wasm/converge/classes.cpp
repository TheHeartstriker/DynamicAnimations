#include "classes.h"

#include <array>
#include <cstdint>
#include <random>
#include <string>

#include "../helper/helper.h"

Pixel::Pixel(float mass, Vector position, Vector velocity, Vector acceleration,
             std::array<uint8_t, 3> color, bool Direction)
    : mass(mass),
      position(position),
      velocity(velocity),
      acceleration(acceleration),
      color(color),
      Direction(Direction) {}

void Pixel::applyForce(const Vector& force) {
  Vector forceCopy = force;
  forceCopy.divide(this->mass);
  this->acceleration.add(forceCopy);
}

void Pixel::updatePosition() {
  this->velocity.add(this->acceleration);
  this->position.add(this->velocity);
  this->acceleration.multiply(0);
}

void Pixel::drawData(SDL_Renderer* renderer) {
  DrawPixel(renderer, position.x, position.y, color[0], color[1], color[2], 0,
            4);
}