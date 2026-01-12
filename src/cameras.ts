import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export type CamerasBundle = {
  mainCamera: THREE.PerspectiveCamera;
  mirroredCamera: THREE.PerspectiveCamera;
  controlsMain: OrbitControls;
  controlsMirror: OrbitControls;
  onPointerEvent: (event: PointerEvent) => void;
  update: (delta: number) => void;
  renderViews: () => void;
};

export function createCamerasAndInteraction(renderer: THREE.WebGLRenderer, scene: THREE.Scene, canvas: HTMLCanvasElement): CamerasBundle {
  const width = () => canvas.clientWidth;
  const height = () => canvas.clientHeight;

  // create cameras at same Y but different X positions
  const mainCamera = new THREE.PerspectiveCamera(60, width() / height(), 0.1, 1000);
  mainCamera.position.set(-1.5, 1.6, 3); // left
  mainCamera.lookAt(0, 1, 0);

  const mirroredCamera = new THREE.PerspectiveCamera(60, width() / height(), 0.1, 1000);
  mirroredCamera.position.set(1.5, 1.6, 3); // right (mirrored X)
  // Optionally mirror orientation so it feels like a true mirrored view:
  mirroredCamera.lookAt(0, 1, 0);

  // controls for each camera
  const controlsMain = new OrbitControls(mainCamera, renderer.domElement);
  controlsMain.enableDamping = true;
  controlsMain.dampingFactor = 0.05;
  controlsMain.enabled = false; // enabled only when interacting left

  const controlsMirror = new OrbitControls(mirroredCamera, renderer.domElement);
  controlsMirror.enableDamping = true;
  controlsMirror.dampingFactor = 0.05;
  controlsMirror.enabled = false; // enabled only when interacting right

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerDown = false;
  let activeSide: 'left' | 'right' | null = null;

  function getPointerSide(clientX: number) {
    return clientX < canvas.clientWidth / 2 ? 'left' : 'right';
  }

  function setNormalizedPointerForSide(side: 'left' | 'right', clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    // Compute position relative to the chosen viewport half
    const halfW = rect.width / 2;
    const localX = (side === 'left') ? clientX - rect.left : clientX - rect.left - halfW;
    const ndcX = (localX / halfW) * 2 - 1;
    const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
    pointer.set(ndcX, ndcY);
  }

  function handlePointerDown(event: PointerEvent) {
    pointerDown = true;
    activeSide = getPointerSide(event.clientX);
    // enable the corresponding control, disable the other
    controlsMain.enabled = activeSide === 'left';
    controlsMirror.enabled = activeSide === 'right';
    // set pointer for raycast / initial interaction
    setNormalizedPointerForSide(activeSide, event.clientX, event.clientY);
    // simple raycast example (customize as needed)
    const cam = activeSide === 'left' ? mainCamera : mirroredCamera;
    raycaster.setFromCamera(pointer, cam);
    // ...existing code...
    // You can perform selection with raycaster.intersectObjects([...])
  }

  function handlePointerMove(event: PointerEvent) {
    if (!pointerDown || !activeSide) return;
    setNormalizedPointerForSide(activeSide, event.clientX, event.clientY);
    // update raycaster or let OrbitControls respond (controls are enabled so they will handle rotation)
    // If you need custom hover, use:
    // const cam = activeSide === 'left' ? mainCamera : mirroredCamera;
    // raycaster.setFromCamera(pointer, cam);
    // const hits = raycaster.intersectObjects(scene.children, true);
    // ...existing code...
  }

  function handlePointerUp() {
    pointerDown = false;
    activeSide = null;
    controlsMain.enabled = false;
    controlsMirror.enabled = false;
  }

  // attach handlers to canvas
  canvas.addEventListener('pointerdown', handlePointerDown);
  canvas.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);

  // rendering two viewports side-by-side
  function renderViews() {
    // ensure size
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
    }

    // left view (mainCamera)
    renderer.setScissorTest(true);
    const halfW = Math.floor(w / 2);

    renderer.setViewport(0, 0, halfW, h);
    renderer.setScissor(0, 0, halfW, h);
    mainCamera.aspect = halfW / h;
    mainCamera.updateProjectionMatrix();
    renderer.render(scene, mainCamera);

    // right view (mirroredCamera)
    renderer.setViewport(halfW, 0, w - halfW, h);
    renderer.setScissor(halfW, 0, w - halfW, h);
    mirroredCamera.aspect = (w - halfW) / h;
    mirroredCamera.updateProjectionMatrix();
    renderer.render(scene, mirroredCamera);

    renderer.setScissorTest(false);
  }

  function update(delta: number) {
    controlsMain.update();
    controlsMirror.update();
  }

  // public pointer event wrapper (if you prefer external wiring)
  function onPointerEvent(event: PointerEvent) {
    if (event.type === 'pointerdown') handlePointerDown(event);
    else if (event.type === 'pointermove') handlePointerMove(event);
    else if (event.type === 'pointerup') handlePointerUp();
  }

  return {
    mainCamera,
    mirroredCamera,
    controlsMain,
    controlsMirror,
    onPointerEvent,
    update,
    renderViews,
  };
}

