import { Object3DNode } from '@react-three/fiber';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // 基础对象
      group: Object3DNode<THREE.Group, typeof THREE.Group>;
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;

      // 几何体
      boxGeometry: Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
      cylinderGeometry: Object3DNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>;
      planeGeometry: Object3DNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;

      // 材质
      meshStandardMaterial: Object3DNode<
        THREE.MeshStandardMaterial,
        typeof THREE.MeshStandardMaterial
      >;
      meshBasicMaterial: Object3DNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;

      // 灯光
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
      spotLight: Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>;
      directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;

      // 辅助对象
      gridHelper: Object3DNode<THREE.GridHelper, typeof THREE.GridHelper>;
      axesHelper: Object3DNode<THREE.AxesHelper, typeof THREE.AxesHelper>;
    }
  }
}

export {};
