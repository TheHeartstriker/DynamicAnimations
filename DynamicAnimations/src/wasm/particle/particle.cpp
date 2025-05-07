#include <random>
#include <string>
#include <vector>

#include "../Shapes/Shapes.h"
#include "particleHeader.h"

extern int Winwidth;
extern int Winheight;

int intialWinwidth = Winwidth;
int intialWinheight = Winheight;

static std::random_device rd;
static std::mt19937 gen(rd());
static std::uniform_int_distribution<Uint8> genColor(0, 255);
static std::uniform_real_distribution<float> disVel(-100.0f, 100.0f);
static std::uniform_int_distribution<int> genX(0, Winwidth);
static std::uniform_int_distribution<int> genY(0, Winheight);

namespace {
struct particle {
  float x;
  float y;

  Uint8 r;
  Uint8 g;
  Uint8 b;
  Uint8 a = 255;
  std::vector<float> velocity;
};
}  // namespace

static std::vector<particle> particles;

static void initParticles(std::vector<particle>& particles) {
  if (Winheight && Winwidth) {
    for (int i = 0; i < 4000; i++) {
      particles.push_back(particle{
          static_cast<float>(genX(gen)),
          static_cast<float>(genY(gen)),
          genColor(gen),
          genColor(gen),
          genColor(gen),
          genColor(gen),
          std::vector<float>{disVel(gen), disVel(gen)},
      });
    }
  }
}

static void resetParticle(particle& p) {
  p.x = static_cast<float>(genX(gen));
  p.y = static_cast<float>(genY(gen));
  p.r = genColor(gen);
  p.g = genColor(gen);
  p.b = genColor(gen);
  p.a = genColor(gen);
  p.velocity[0] = disVel(gen);
  p.velocity[1] = disVel(gen);
}

static void WindowSizeChange() {
  if (Winwidth != intialWinwidth || Winheight != intialWinheight) {
    particles.clear();
    intialWinwidth = Winwidth;
    intialWinheight = Winheight;
    genX = std::uniform_int_distribution<int>(0, Winwidth);
    genY = std::uniform_int_distribution<int>(0, Winheight);
    initParticles(particles);
  }
}

void mainParticle(SDL_Renderer* renderer) {
  if (particles.empty()) {
    initParticles(particles);
  }
  WindowSizeChange();
  for (auto& p : particles) {
    ChoasOrbWithGlow(renderer, 10, static_cast<int>(p.x), static_cast<int>(p.y),
                     {p.r, p.g, p.b, p.a}, 10);
    p.x += p.velocity[0] * 0.05f;
    p.y += p.velocity[1] * 0.05f;
  }
}
