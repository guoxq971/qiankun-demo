/**
 * hook的理解;
 * 1. hook是一个函数;
 * 2. hook的作用是为了解决函数组件中没有state的问题;
 * 3. hook的使用规则:
 *   1. 只能在函数组件中使用;
 *   2. 只能在顶层调用;
 * 4. 集成一些场景，返回一个响应式的ref，供外部使用;
 * */

import { ref } from 'vue';
import type { Ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface UseThree {
  three: Ref<IThree>;
}

interface IThree {
  scene: THREE.Scene; // 场景
  camera: THREE.PerspectiveCamera; // 相机
  renderer: THREE.WebGLRenderer; // 渲染器
  axesHelper: THREE.AxesHelper; // 辅助线
}

/**
 * three的hook;
 * */
export function useThree(): UseThree {
  const three = ref(IThree()) as Ref<IThree>;

  return {
    three,
  };
}

/**
 * 添加模型
 * */
function addModel() {}

/**
 * 初始化three;
 * - 初始化了场景、相机、渲染器、辅助线;
 * - 灯光、模型、动画等都可以在此基础上进行添加;
 * @returns IThree;
 * */
function IThree(): IThree {
  const config = {
    width: 800,
    height: 800,
  };
  // 动画id
  let animationId: number | null = null;

  // 容器
  const container = document.getElementById('canvas-three') as HTMLDivElement;

  // 场景
  const scene = new THREE.Scene();
  // 设置背景色 粉色 0xff00ff 黑色 0x000000 浅黑色(#232324) 0x232324
  scene.background = new THREE.Color(0x232324);
  // 设置雾化效果
  scene.fog = new THREE.Fog(0xffffff, 0.015, 100);

  // 相机
  const camera = new THREE.PerspectiveCamera(45, config.width / config.height, 1, 1000);
  // 设置相机位置
  camera.position.set(5, 5, 5);

  // 轨道
  new OrbitControls(camera, container);

  // 辅助线
  const axesHelper = new THREE.AxesHelper(250);
  axesHelper.name = 'AxesHelper';
  scene.add(axesHelper);

  // 渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
  });
  renderer.setSize(config.width, config.height);
  renderer.render(scene, camera);
  container.appendChild(renderer.domElement);
  const render = () => {
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(render);
  };
  render();

  return {
    scene,
    camera,
    renderer,
    axesHelper,
  };
}
