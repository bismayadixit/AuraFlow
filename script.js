/* ===============================
   BASIC SETUP
================================ */
const canvas = document.getElementById("canvas");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.z = 60;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

/* ===============================
   HAND CONTROL VALUES
================================ */
let handX = 0;
let handY = 0;
let scaleControl = 1;
let spinBoost = 0.005;

/* ===============================
   PARTICLES
================================ */
const COUNT = 15000;
const geometry = new THREE.BufferGeometry();

// REQUIRED POSITION ATTRIBUTE ✅
const positions = new Float32Array(COUNT * 3);
const angles = new Float32Array(COUNT);
const heights = new Float32Array(COUNT);

for (let i = 0; i < COUNT; i++) {
  const angle = Math.random() * Math.PI * 2;
  const height = (Math.random() - 0.5) * 60;
  const radius = 10 + Math.random() * 2;

  positions[i * 3]     = Math.cos(angle) * radius;
  positions[i * 3 + 1] = height;
  positions[i * 3 + 2] = Math.sin(angle) * radius;

  angles[i] = angle;
  heights[i] = height;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("angle", new THREE.BufferAttribute(angles, 1));
geometry.setAttribute("height", new THREE.BufferAttribute(heights, 1));

/* ===============================
   SHADER MATERIAL
================================ */
const material = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    time: { value: 0 },
    uHand: { value: new THREE.Vector2(0, 0) },
    uScale: { value: 1 }
  },
  vertexShader: `
    uniform float time;
    uniform vec2 uHand;
    uniform float uScale;
    attribute float angle;
    attribute float height;
    varying float vAlpha;

    void main() {
      float a = angle + time * 0.7;
      float r = (10.0 + sin(height * 0.15 + time) * 2.0) * uScale;

      vec3 pos;
      pos.x = cos(a) * r + uHand.x;
      pos.z = sin(a) * r;
      pos.y = height + uHand.y;

      vAlpha = 1.0 - abs(height) / 35.0;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = 3.0;
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;

      vec3 color = mix(
        vec3(0.1, 0.9, 1.0),
        vec3(1.0, 0.2, 0.8),
        d
      );

      gl_FragColor = vec4(color, vAlpha);
    }
  `
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

/* ===============================
   MEDIAPIPE HAND TRACKING
================================ */
const videoElement = document.getElementById("video");

const hands = new Hands({
  locateFile: file =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(results => {
  if (results.multiHandLandmarks.length > 0) {
    const lm = results.multiHandLandmarks[0];
    const indexTip = lm[8];
    const thumbTip = lm[4];

    handX = (indexTip.x - 0.5) * 30;
    handY = -(indexTip.y - 0.5) * 25;

    const dx = indexTip.x - thumbTip.x;
    const dy = indexTip.y - thumbTip.y;

    scaleControl = THREE.MathUtils.clamp(
      Math.sqrt(dx * dx + dy * dy) * 5,
      0.6,
      2.2
    );
  }

  spinBoost = results.multiHandLandmarks.length === 2 ? 0.02 : 0.005;
});

const cam = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480
});
cam.start();

/* ===============================
   ANIMATION LOOP
================================ */
function animate(t) {
  requestAnimationFrame(animate);

  material.uniforms.time.value = t * 0.001;
  material.uniforms.uHand.value.set(handX, handY);
  material.uniforms.uScale.value = scaleControl;

  particles.rotation.y += spinBoost;

  renderer.render(scene, camera);
}
animate();

/* ===============================
   RESIZE
================================ */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
