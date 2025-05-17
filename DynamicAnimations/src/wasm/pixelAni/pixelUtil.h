#ifndef PIXELUTIL_H
#define PIXELUTIL_H

#include <random>

#include "../helper/helper.h"

void convergeCreation(Vector& position, bool& direction, int i,
                      std::uniform_int_distribution<int>& disW,
                      std::mt19937& gen, int Winheight);

void blackHoleCreation(Vector& position, bool& direction,
                       std::uniform_int_distribution<int>& disW,
                       std::mt19937& gen,
                       std::uniform_int_distribution<int>& disH);

// void resetPixel(Pixel& pixel, std::string name,
//                 std::uniform_int_distribution<uint8_t>& dis_Color,
//                 std::mt19937& gen, std::uniform_int_distribution<int>& disW,
//                 std::uniform_int_distribution<int>& disH,
//                 std::uniform_real_distribution<float>& dis_vel, int
//                 Winheight);

#endif