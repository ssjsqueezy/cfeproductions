let scene, camera, renderer, model;
let wiggleDirection = 0.005;
let wiggleAmount = 0.3;

function init() {
  // Create the scene
  scene = new THREE.Scene();

  // Set up the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 2);

  // Set up the renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  setRendererSize(); // Adjust the renderer size based on viewport
  document.getElementById('threejs-logo-container').appendChild(renderer.domElement);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // Load the model
  const loader = new THREE.GLTFLoader();
  loader.load('img/logo.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(0, 0, 0);

    scene.add(model);
    animate();
  }, undefined, (error) => {
    console.error('An error happened', error);
  });

  // Handle window resizing
  window.addEventListener('resize', onWindowResize);
}

function setRendererSize() {
  // Adjust the renderer size for different screen sizes
  if (window.innerWidth < 768) {
    renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7); // Smaller on mobile
  } else {
    renderer.setSize(window.innerWidth * 0.25, window.innerHeight * 0.25); // Smaller on desktop
  }
}

function onWindowResize() {
  // Update camera aspect ratio and renderer size on resize
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Adjust the renderer size based on viewport
  setRendererSize();
}

function animate() {
  requestAnimationFrame(animate);

  // Wiggle the model side to side
  if (model) {
    model.rotation.y += wiggleDirection;
    model.position.x += wiggleDirection;
    if (Math.abs(model.position.x) >= wiggleAmount) {
      wiggleDirection *= -1; // Reverse direction at bounds
    }
  }

  renderer.render(scene, camera);
}

// Initialize the scene once the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    init();
});

// Update background video based on viewport size
function updateBackgroundVideo() {
  const video = document.getElementById('background-video');
  const source = video.querySelector('source');

  // Check the viewport width
  if (window.innerWidth < 480) {
    // If the viewport is less than 480px, load the mobile-friendly video
    source.setAttribute('src', 'img/phoneanimation.mp4');
  } else {
    // Otherwise, load the default video
    source.setAttribute('src', 'img/animation.mp4');
  }

  // Reload the video to apply the source change
  video.load();
}

// Run the function on page load and when the window is resized
window.addEventListener('load', updateBackgroundVideo);
window.addEventListener('resize', updateBackgroundVideo);
