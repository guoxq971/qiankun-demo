import type { Ref } from 'vue';
import * as THREE from 'three';

export interface UseThreeType {
  three: Ref<null | InitThreeInterface>;
}

export type paramType = {
  in: (three: Ref<InitThreeInterface>) => void; // 点击了容器之内
  out: (three: Ref<InitThreeInterface>) => void; // 点击了容器之外
};

export interface InitThreeInterface {
  width: number;
  height: number;
  container: HTMLDivElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  axesHelper: THREE.AxesHelper;
  pointLightHelper: THREE.PointLightHelper;
  animationId: number;

  // constructor(): void;
  destroy(): void;
  render(): void;
  screenShot(): string;
}
