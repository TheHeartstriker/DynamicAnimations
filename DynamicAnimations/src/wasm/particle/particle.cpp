#include <random>
#include <string>
#include <vector>

#include "../Shapes/Shapes.h"
#include "particleHeader.h"

void mainCall(SDL_Renderer* renderer) {
  ChoasOrbWithGlow(renderer, 10, 100, 100, {255, 0, 0, 255}, 20);
}
