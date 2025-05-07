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
  SDL_SetRenderDrawBlendMode(renderer, SDL_BLENDMODE_BLEND);

  // Total radius including glow
  int totalRadius = radius + glowRadius;

  // Step size for radial gradient (adjust for quality vs. performance)
  const int radialStep = 2;  // Draw a filled circle every 2 pixels

  // Iterate radially from the center to the glow edge
  for (int r = 0; r <= totalRadius; r += radialStep) {
    // Calculate normalized distance (0 at center, 1 at glow edge)
    float t = static_cast<float>(r) / totalRadius;

    // Quadratic falloff for smooth gradient
    float alphaFactor = 1.0f - t * t;  // Quadratic falloff
    Uint8 currentAlpha = static_cast<Uint8>(color.a * alphaFactor * 0.2f);

    // If within the solid circle radius, use full opacity
    if (r <= radius) {
      currentAlpha = color.a;  // Solid circle
    }

    // Skip if alpha is negligible
    if (currentAlpha == 0) continue;

    // Set color for this radial step
    SDL_SetRenderDrawColor(renderer, color.r, color.g, color.b, currentAlpha);

    // Draw a filled circle for this radius
    for (int y = cy - r; y <= cy + r; y++) {
      int dx = static_cast<int>(std::sqrt(r * r - (y - cy) * (y - cy)));
      SDL_RenderDrawLine(renderer, cx - dx, y, cx + dx, y);
    }
  }

  // Restore the original blend mode
  SDL_SetRenderDrawBlendMode(renderer, originalBlendMode);
}