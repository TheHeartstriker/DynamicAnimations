#include <cmath>
#include <iostream>

#include "helper.h"

// Constructor
Vector::Vector(float x, float y) : x(x), y(y) {}

// Add another vector
void Vector::add(const Vector& v) {
  x += v.x;
  y += v.y;
}

// Subtract another vector
void Vector::subtract(const Vector& v) {
  x -= v.x;
  y -= v.y;
}

// Multiply by a scalar
void Vector::multiply(float scalar) {
  x *= scalar;
  y *= scalar;
}

// Divide by a scalar
void Vector::divide(float scalar) {
  if (scalar != 0) {
    x /= scalar;
    y /= scalar;
  } else {
    std::cerr << "Error: Division by zero!" << std::endl;
  }
}

// Calculate the magnitude (length) of the vector
float Vector::magnitude() const { return std::sqrt(x * x + y * y); }

// Normalize the vector (make it a unit vector)
void Vector::normalize() {
  float mag = magnitude();
  if (mag != 0) {
    divide(mag);
  }
}

// Print the vector (for debugging)
void Vector::print() const {
  std::cout << "Vector(" << x << ", " << y << ")" << std::endl;
}