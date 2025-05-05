//Location and individual vars for each item
export const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

uniform vec2 u_resolution;

void main() {
  // Convert position to clip space, accounting for aspect ratio
  vec2 scaledPosition = a_position * vec2(u_resolution.y / u_resolution.x, 1.0);
  gl_Position = vec4(scaledPosition, 0.0, 1.0);
  v_texCoord = a_texCoord;
}
`;

//Decides the color, gradient, glow, and other visual effects of each item
export const fragmentShader = `precision mediump float;
varying vec2 v_texCoord;

uniform vec3 u_color;
uniform float u_innerRadius;
uniform float u_outerRadius;
uniform float u_intensity;

void main() {
  vec2 coord = v_texCoord - vec2(0.5);
  float dist = length(coord);

  if (dist <= u_innerRadius) {
    gl_FragColor = vec4(u_color, 1.0);
    return;
  }

  float glow = smoothstep(u_outerRadius, u_innerRadius, dist);
  glow = pow(glow, 2.0) * u_intensity;

  float alpha = glow;
  vec3 color = u_color * glow;

  if (alpha < 0.01) discard;
  gl_FragColor = vec4(color, alpha);
}`;

export function initWebGL(canvasRef, programRef) {
  const canvas = canvasRef.current;
  const gl =
    canvas.getContext("webgl2") || canvas.getContext("experimental-webgl");

  if (!gl) {
    console.error("WebGL not supported");
    return;
  }

  // Compile the vertex shader
  const vertexShaderObj = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShaderObj, vertexShader);
  gl.compileShader(vertexShaderObj);
  if (!gl.getShaderParameter(vertexShaderObj, gl.COMPILE_STATUS)) {
    console.error(
      "Error compiling vertex shader:",
      gl.getShaderInfoLog(vertexShaderObj)
    );
    return;
  }
  // Compile the fragment shader
  const fragmentShaderObj = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShaderObj, fragmentShader);
  gl.compileShader(fragmentShaderObj);
  if (!gl.getShaderParameter(fragmentShaderObj, gl.COMPILE_STATUS)) {
    console.error(
      "Error compiling fragment shader:",
      gl.getShaderInfoLog(fragmentShaderObj)
    );
    return;
  }
  // Create and link the WebGL program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShaderObj);
  gl.attachShader(program, fragmentShaderObj);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Error linking program:", gl.getProgramInfoLog(program));
    return;
  }
  programRef.current = program;
  gl.useProgram(program);
}
