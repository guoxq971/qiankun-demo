import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { message } from 'ant-design-vue';
import { onBeforeUnmount, onMounted } from 'vue';

export interface InitThreeType {
  screenShot: () => string;
  container: HTMLDivElement;
  addEvent: () => void;
}

/**
 * 初始化three
 * */
export function initThree(): InitThreeType {
  const container = document.getElementById('canvas-three') as HTMLDivElement;
  const width = 800;
  const height = 800;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

  // 设置背景色 粉色 0xff00ff 黑色 0x000000 浅黑色(#232324) 0x232324
  scene.background = new THREE.Color(0x232324);
  // 设置雾化效果
  scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
  // 设置相机位置
  camera.position.set(5, 5, 5);

  // 轨道
  const controls = new OrbitControls(camera, container);
  // 辅助线
  const axesHelper = new THREE.AxesHelper(250);
  scene.add(axesHelper);

  // 光源
  // 环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  // 点光源
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(2, 3, 4);
  scene.add(pointLight);
  // 辅助器
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(pointLightHelper);

  // 物体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
  container.appendChild(renderer.domElement);

  let raf = false;
  function render() {
    if (raf) return;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  /**
   * 截图一张去除辅助线、辅助器的图片
   * @return {void}
   * */
  function screenShot() {
    raf = true;
    if (axesHelper) scene.remove(axesHelper);
    if (pointLightHelper) scene.remove(pointLightHelper);
    renderer.render(scene, camera);

    const img = renderer.domElement.toDataURL();

    if (axesHelper) scene.add(axesHelper);
    if (pointLightHelper) scene.add(pointLightHelper);
    raf = false;
    return img;
  }

  function bodyAddEvent(e: MouseEvent) {
    if (e.target !== container) {
      message.info('点击了容器之外');
    }
    if (e.target === container) {
      message.info('点击了容器之内');
    }
  }

  function addEvent() {
    console.log('触发了addEvent');
    onMounted(() => {
      console.log('触发了onMounted');
      document.body.addEventListener('click', bodyAddEvent);
    });
    onBeforeUnmount(() => {
      console.log('触发了 onBeforeUnmount');
      document.body.removeEventListener('click', bodyAddEvent);
    });
  }

  return {
    screenShot,
    container,
    addEvent,
  };
}
