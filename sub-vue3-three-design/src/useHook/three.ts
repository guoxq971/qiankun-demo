import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { message } from 'ant-design-vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { domWithin } from '@/utils/mouse.ts';
import type { InitThreeInterface, paramType, UseThreeType } from '@/interface/index.ts';

// 放在 class中会报错,具体原因不知道; 放在class中，在调用this.renderer.render(scene, this.camera);会报错
var scene = new THREE.Scene();
export function useThree(param: paramType): UseThreeType {
  const three = ref<null | Ref<InitThreeInterface>>(null);

  function render() {
    three.value = new InitThree();
  }

  let unFn: null | Function = null;
  // 渲染
  onMounted(() => {
    render();
    const result = domWithin('canvas-container', (isWithinUp: boolean, isCheck: boolean, isWithinDown: boolean) => {
      if (isCheck) {
        if (isWithinDown) {
          param.in(three as Ref<InitThreeInterface>);
        } else {
          param.out(three as Ref<InitThreeInterface>);
        }
      }
    });
    unFn = result.unFn;
  });

  // 销毁
  onBeforeUnmount(() => {
    unFn && unFn();
    if (three.value) {
      three.value.destroy();
    }
  });

  return {
    three,
  };
}

class InitThree {
  width = 800;
  height = 800;
  // 容器
  container;
  // 场景
  scene;
  // 相机
  camera;
  // 渲染器
  renderer;
  // 辅助线
  axesHelper;
  // 点光源辅助器
  pointLightHelper;
  // 渲染id
  animationId = 0;

  constructor() {
    this.container = document.getElementById('canvas-three') as HTMLDivElement;
    this.scene = scene;
    // this.scene = new THREE.Scene(); //这里会有问题：
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);

    // 设置背景色 粉色 0xff00ff 黑色 0x000000 浅黑色(#232324) 0x232324
    scene.background = new THREE.Color(0x232324);
    // 设置雾化效果
    scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
    // 设置相机位置
    this.camera.position.set(5, 5, 5);

    // 轨道
    const controls = new OrbitControls(this.camera, this.container);
    // 辅助线
    this.axesHelper = new THREE.AxesHelper(250);
    this.axesHelper.name = 'AxesHelper';
    scene.add(this.axesHelper);

    // 光源
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    // 点光源
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);
    // 辅助器
    this.pointLightHelper = new THREE.PointLightHelper(pointLight);
    this.pointLightHelper.name = 'PointLightHelper';
    scene.add(this.pointLightHelper);

    // 物体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
    });

    this.render();
  }

  // 销毁
  destroy() {
    // 停止渲染
    cancelAnimationFrame(this.animationId);

    // 移除dom
    this.container.removeChild(this.renderer.domElement);

    // 释放资源
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.axesHelper = null;
    this.pointLightHelper = null;
  }

  // 启动渲染器
  render() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.render(scene, this.camera);
    this.container.appendChild(this.renderer.domElement);
    const render = () => {
      this.renderer.render(this.scene, this.camera);
      this.animationId = requestAnimationFrame(render);
    };

    render();
  }

  /**
   * 截图一张去除辅助线、辅助器的图片
   * @return {string} 图片base64
   * */
  screenShot() {
    this.axesHelper.visible = false;
    this.pointLightHelper.visible = false;
    this.renderer.render(scene, this.camera);
    const base64 = this.renderer.domElement.toDataURL('image/png');
    this.axesHelper.visible = true;
    this.pointLightHelper.visible = true;
    this.renderer.render(scene, this.camera);
    return base64;
  }
}
