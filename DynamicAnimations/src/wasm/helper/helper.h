#ifndef HELPER_H
#define HELPER_H

#include <SDL2/SDL.h>

void DrawPixel(SDL_Renderer* renderer, int x, int y, Uint8 r, Uint8 g, Uint8 b,
               Uint8 a, int size = 1);
void ChoasOrbWithGlow(SDL_Renderer* renderer, int radius, int cx, int cy,
                      const SDL_Color& color, int glowRadius);

class Vector {
 public:
  float x, y;

  // Constructor
  Vector(float x = 0, float y = 0);

  // Add another vector
  void add(const Vector& v);

  // Subtract another vector
  void subtract(const Vector& v);

  // Multiply by a scalar
  void multiply(float scalar);

  // Divide by a scalar
  void divide(float scalar);

  // Calculate the magnitude (length) of the vector
  float magnitude() const;

  // Normalize the vector (make it a unit vector)
  void normalize();

  // Print the vector (for debugging)
  void print() const;
};

#endif