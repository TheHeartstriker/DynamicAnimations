#include "pixelUtil.h"

// Intial pixel parameters
void convergeCreation(Vector& position, bool& direction, int i,
                      std::uniform_int_distribution<int>& disW,
                      std::mt19937& gen, int Winheight) {
  if (i % 2 == 0) {
    position = Vector(disW(gen), Winheight);  // Bottom of the screen
    direction = false;
  } else {
    position = Vector(disW(gen), 0);  // Top of the screen
    direction = true;                 // Move downward
  }
}

void blackHoleCreation(Vector& position, bool& direction,
                       std::uniform_int_distribution<int>& disW,
                       std::mt19937& gen,
                       std::uniform_int_distribution<int>& disH) {
  // Create a black hole at the center of the screen
  position = Vector(disW(gen), disH(gen));
}

// void resetPixel(Pixel& pixel, std::string name,
//                 std::uniform_int_distribution<uint8_t>& dis_Color,
//                 std::mt19937& gen, std::uniform_int_distribution<int>& disW,
//                 std::uniform_int_distribution<int>& disH,
//                 std::uniform_real_distribution<float>& dis_vel, int
//                 Winheight) {
//   pixel.color[0] = dis_Color(gen);  // Randomize color
//   pixel.color[1] = dis_Color(gen);
//   pixel.color[2] = dis_Color(gen);
//   pixel.velocity = Vector(0, 0);      // Reset velocity
//   pixel.acceleration = Vector(0, 0);  // Reset acceleration
//   if (name == "BlackHole") {
//     pixel.position.y = disH(gen);
//     pixel.position.x = disW(gen);
//     pixel.velocity = Vector(dis_vel(gen), dis_vel(gen));
//   }
//   if (name == "Converge") {
//     pixel.position.x = disW(gen);  // Randomize x position
//     if (pixel.Direction == true) {
//       pixel.position.y = 1;  // Reset to top
//     } else {
//       pixel.position.y = Winheight - 1;  // Reset to bottom
//     }
//   }
// }