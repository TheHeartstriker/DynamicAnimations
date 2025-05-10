//Location and individual vars for each item
export const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

uniform vec2 u_resolution;
uniform vec2 u_translation; 

void main() {
  // Convert position from pixel coordinates to normalized device coordinates
  vec2 normalizedPosition = a_position + u_translation; // Apply translation
  normalizedPosition = normalizedPosition / u_resolution; // Scale to [0, 1]
  normalizedPosition = normalizedPosition * 2.0 - 1.0; // Map to [-1, 1]

  // Flip y-axis if needed (WebGL has y=1 at the top)
  normalizedPosition.y = -normalizedPosition.y;

  gl_Position = vec4(normalizedPosition, 0.0, 1.0);
  v_texCoord = a_texCoord;
}
`;

//Decides the color, gradient, glow, and other visual effects of each item
export const fragmentShader = `precision mediump float;
varying vec2 v_texCoord;

uniform vec4 u_color; // Ensure this is a vec4
uniform float u_innerRadius;
uniform float u_outerRadius;
uniform float u_intensity;

void main() {
  vec2 coord = v_texCoord - vec2(0.5);
  float dist = length(coord);

  if (dist <= u_innerRadius) {
    gl_FragColor = u_color; // Use u_color directly
    return;
  }

  float glow = smoothstep(u_outerRadius, u_innerRadius, dist);
  glow = pow(glow, 2.0) * u_intensity;

  float alpha = glow * u_color.a; // Use the alpha from u_color
  vec3 color = u_color.rgb * glow; // Use the RGB components of u_color

  if (alpha < 0.01) discard;
  gl_FragColor = vec4(color, alpha); // Combine color and alpha
}`;
//
//Creates the program that links the vertex and fragment shaders
//
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
//
// Defines the reused buffer for rendering
//
export function defineBuffer(gl) {
  //
  // Defines view box and stucture of what we rendering
  //

  const vertices = new Float32Array([
    -50.0,
    -50.0,
    0.0,
    0.0, // Bottom-left
    50.0,
    -50.0,
    1.0,
    0.0, // Bottom-right
    -50.0,
    50.0,
    0.0,
    1.0, // Top-left
    50.0,
    50.0,
    1.0,
    1.0, // Top-right
  ]);

  const indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

  // Create and bind vertex buffer
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

  // Create and bind index buffer
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);

  return { vertexBuffer, indexBuffer, indices };
}
