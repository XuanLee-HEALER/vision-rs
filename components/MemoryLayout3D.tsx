// @ts-nocheck - React 19 + @react-three/fiber 类型兼容性问题
'use client';

import { Canvas, useFrame, Object3DNode } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cone } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// 扩展 JSX 类型以支持 Three.js 元素
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: Object3DNode<THREE.Group, typeof THREE.Group>;
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      meshStandardMaterial: Object3DNode<
        THREE.MeshStandardMaterial,
        typeof THREE.MeshStandardMaterial
      >;
      cylinderGeometry: Object3DNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>;
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
      spotLight: Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>;
      gridHelper: Object3DNode<THREE.GridHelper, typeof THREE.GridHelper>;
    }
  }
}

interface MemoryBlockProps {
  position: [number, number, number];
  color: string;
  label: string;
  size?: [number, number, number];
  onClick?: () => void;
  isHighlighted?: boolean;
}

function MemoryBlock({
  position,
  color,
  label,
  size = [2, 1, 1],
  onClick,
  isHighlighted = false,
}: MemoryBlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += hovered ? 0.01 : 0;
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={size}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={isHighlighted || hovered ? 0.9 : 0.7}
          emissive={color}
          emissiveIntensity={hovered || isHighlighted ? 0.3 : 0.1}
        />
      </Box>
      <Text position={[0, 0, 0.6]} fontSize={0.3} color="#cad3f5" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

function Arrow({
  start,
  end,
  color = '#8aadf4',
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  const direction = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]);
  const length = direction.length();
  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  return (
    <group>
      <mesh position={midpoint}>
        <cylinderGeometry args={[0.05, 0.05, length, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Cone position={end} args={[0.15, 0.3, 8]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={color} />
      </Cone>
    </group>
  );
}

interface MemoryLayout3DProps {
  scenario?: 'stack' | 'heap' | 'ownership';
}

function MemoryScene({ scenario = 'ownership' }: MemoryLayout3DProps) {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  if (scenario === 'stack') {
    return (
      <>
        {/* 栈帧 */}
        <MemoryBlock
          position={[0, 3, 0]}
          color="#a6da95"
          label="main()"
          size={[3, 0.5, 1]}
          onClick={() => setSelectedBlock('main')}
          isHighlighted={selectedBlock === 'main'}
        />
        <MemoryBlock
          position={[0, 2, 0]}
          color="#8bd5ca"
          label="x: i32 = 5"
          size={[2.5, 0.4, 1]}
          onClick={() => setSelectedBlock('x')}
          isHighlighted={selectedBlock === 'x'}
        />
        <MemoryBlock
          position={[0, 1, 0]}
          color="#8bd5ca"
          label="y: i32 = 10"
          size={[2.5, 0.4, 1]}
          onClick={() => setSelectedBlock('y')}
          isHighlighted={selectedBlock === 'y'}
        />

        {/* 标签 */}
        <Text position={[-2.5, 3, 0]} fontSize={0.4} color="#cad3f5">
          栈 (Stack)
        </Text>
      </>
    );
  }

  if (scenario === 'heap') {
    return (
      <>
        {/* 栈 */}
        <group position={[-3, 0, 0]}>
          <MemoryBlock
            position={[0, 2, 0]}
            color="#8bd5ca"
            label="ptr"
            size={[1.5, 0.5, 1]}
            onClick={() => setSelectedBlock('ptr')}
            isHighlighted={selectedBlock === 'ptr'}
          />
          <MemoryBlock position={[0, 1, 0]} color="#8bd5ca" label="len: 5" size={[1.5, 0.5, 1]} />
          <MemoryBlock position={[0, 0, 0]} color="#8bd5ca" label="cap: 5" size={[1.5, 0.5, 1]} />
          <Text position={[0, 3, 0]} fontSize={0.3} color="#cad3f5">
            栈
          </Text>
        </group>

        {/* 堆 */}
        <group position={[3, 0, 0]}>
          <MemoryBlock
            position={[0, 2, 0]}
            color="#f5a97f"
            label='"hello"'
            size={[2, 1, 1]}
            onClick={() => setSelectedBlock('heap')}
            isHighlighted={selectedBlock === 'heap'}
          />
          <Text position={[0, 3, 0]} fontSize={0.3} color="#cad3f5">
            堆
          </Text>
        </group>

        {/* 指针箭头 */}
        {selectedBlock === 'ptr' && <Arrow start={[-2.25, 2, 0]} end={[2, 2, 0]} color="#8aadf4" />}
      </>
    );
  }

  // ownership scenario
  return (
    <>
      {/* s1 (已失效) */}
      <group position={[-4, 1, 0]}>
        <MemoryBlock
          position={[0, 0, 0]}
          color="#6e738d"
          label="s1 (无效)"
          size={[1.5, 1.5, 1]}
          onClick={() => setSelectedBlock('s1')}
          isHighlighted={selectedBlock === 's1'}
        />
        <Text position={[0, -1.5, 0]} fontSize={0.25} color="#939ab7">
          所有权已转移
        </Text>
      </group>

      {/* s2 (当前所有者) */}
      <group position={[0, 1, 0]}>
        <MemoryBlock
          position={[0, 0, 0]}
          color="#8aadf4"
          label="s2"
          size={[1.5, 1.5, 1]}
          onClick={() => setSelectedBlock('s2')}
          isHighlighted={selectedBlock === 's2'}
        />
        <Text position={[0, -1.5, 0]} fontSize={0.25} color="#b7bdf8">
          当前所有者
        </Text>
      </group>

      {/* 堆内存数据 */}
      <group position={[4, 1, 0]}>
        <MemoryBlock
          position={[0, 0, 0]}
          color="#f5a97f"
          label='"hello"'
          size={[2, 1, 1]}
          onClick={() => setSelectedBlock('heap')}
          isHighlighted={selectedBlock === 'heap'}
        />
        <Text position={[0, -1.5, 0]} fontSize={0.25} color="#f5a97f">
          堆内存
        </Text>
      </group>

      {/* 指针箭头 */}
      {(selectedBlock === 's2' || selectedBlock === null) && (
        <Arrow start={[0.75, 1, 0]} end={[3, 1, 0]} color="#8aadf4" />
      )}
    </>
  );
}

export default function MemoryLayout3D({ scenario = 'ownership' }: MemoryLayout3DProps) {
  return (
    <div className="my-8 w-full h-96 bg-mantle rounded-lg border border-overlay0/30 overflow-hidden">
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[0, 10, 0]} angle={0.3} intensity={0.5} />

        <MemoryScene scenario={scenario} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={20}
          minDistance={5}
        />

        {/* 网格地面 */}
        <gridHelper args={[20, 20, '#363a4f', '#363a4f']} position={[0, -2, 0]} />
      </Canvas>

      <div className="absolute bottom-4 left-4 bg-surface0/90 backdrop-blur px-4 py-2 rounded-lg border border-overlay0/30">
        <p className="text-xs text-subtext1">💡 拖动旋转 | 滚轮缩放 | 点击高亮</p>
      </div>
    </div>
  );
}
