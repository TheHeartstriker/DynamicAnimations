#include <emscripten.h>

// Simple add test
extern "C" {
int add(int a, int b) { return a + b; }
}

// Minimal main function
int main() { return 0; }