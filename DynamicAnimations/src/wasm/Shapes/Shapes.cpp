#include "Shapes.h"

#include <SDL2/SDL.h>

#include <cmath>

void DrawPixel(SDL_Renderer* renderer, int x, int y, Uint8 r, Uint8 g, Uint8 b,
               Uint8 a, int size) {
  SDL_SetRenderDrawColor(renderer, r, g, b, a);
  SDL_Rect rect = {x, y, size, size};
  SDL_RenderFillRect(renderer, &rect);
}

void ChoasOrb(SDL_Renderer* renderer, int radius, int cx, int cy,
              const SDL_Color& color) {
  SDL_SetRenderDrawColor(renderer, color.r, color.g, color.b, color.a);

  int x = radius;
  int y = 0;
  int MidPoint = 1 - x;

  while (y <= x) {
    SDL_RenderDrawLine(renderer, cx - x, cy + y, cx + x, cy + y);
    SDL_RenderDrawLine(renderer, cx - x, cy - y, cx + x, cy - y);
    SDL_RenderDrawLine(renderer, cx - y, cy + x, cx + y, cy + x);
    SDL_RenderDrawLine(renderer, cx - y, cy - x, cx + y, cy - x);

    y++;
    if (MidPoint <= 0) {
      MidPoint += 2 * y + 1;
    } else {
      x--;
      MidPoint += 2 * (y - x) + 1;
    }
  }
}

void ChoasOrbWithGlow(SDL_Renderer* renderer, int radius, int cx, int cy,
                      const SDL_Color& color, int glowRadius) {
  // Store the current blend mode
  SDL_BlendMode originalBlendMode;
  SDL_GetRenderDrawBlendMode(renderer, &originalBlendMode);

  // Enable alpha blending
  SDL_SetRenderDrawBlendMode(renderer, SDL_BLENDMODE_BLEND);

  // Total radius including glow
  int totalRadius = radius + glowRadius;

  // Iterate over a bounding box around the circle
  for (int y = cy - totalRadius; y <= cy + totalRadius; y++) {
    for (int x = cx - totalRadius; x <= cx + totalRadius; x++) {
      // Calculate distance from the center
      float dx = static_cast<float>(x - cx);
      float dy = static_cast<float>(y - cy);
      float distance = std::sqrt(dx * dx + dy * dy);

      // Skip pixels outside the total radius
      if (distance > totalRadius) continue;

      // Calculate normalized distance (0 at center, 1 at glow edge)
      float t = distance / totalRadius;

      // Quadratic falloff for smooth gradient (fades to 0 at the edge)
      float alphaFactor =
          1.0f -
          t * t;  // Adjust for desired falloff (e.g., 1.0f - t for linear)
      Uint8 currentAlpha =
          static_cast<Uint8>(color.a * alphaFactor * 0.2f);  // Scale intensity

      // Draw pixel with gradient color
      SDL_SetRenderDrawColor(renderer, color.r, color.g, color.b, currentAlpha);
      SDL_RenderDrawPoint(renderer, x, y);
    }
  }

  // Draw the solid circle on top
  ChoasOrb(renderer, radius, cx, cy, color);

  // Restore the original blend mode
  SDL_SetRenderDrawBlendMode(renderer, originalBlendMode);
}