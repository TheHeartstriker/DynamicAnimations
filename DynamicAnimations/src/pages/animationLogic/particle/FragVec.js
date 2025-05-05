//Location and individual vars for each item
export const vertexShader = `
attribute vec2 a_position;

void main() {
  gl_PointSize = 1.0; // 1x1 pixel
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

//Decides the color, gradient, glow, and other visual effects of each item
export const fragmentShader = `precision mediump float;

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color; // RGBA color from JS
}`;
