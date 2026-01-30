'use client';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  update(): void;
  draw(): void;
}

/**
 * 空间分区网格,用于优化粒子间距离计算
 * 将画布分成固定大小的网格单元,只检查相邻单元的粒子
 */
class SpatialGrid {
  cellSize = 120; // 网格单元大小 (等于连接距离)
  grid: Map<string, Particle[]> = new Map();

  /**
   * 重建网格,将所有粒子分配到对应的网格单元
   */
  rebuild(particles: Particle[]) {
    this.grid.clear();
    particles.forEach((p) => {
      const key = this.getCellKey(p.x, p.y);
      if (!this.grid.has(key)) {
        this.grid.set(key, []);
      }
      this.grid.get(key)!.push(p);
    });
  }

  /**
   * 获取粒子所在网格单元的 key
   */
  private getCellKey(x: number, y: number): string {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    return `${col},${row}`;
  }

  /**
   * 获取指定粒子附近的所有粒子 (包括相邻 9 个单元)
   */
  getNearbyParticles(particle: Particle): Particle[] {
    const neighbors: Particle[] = [];
    const [colStr, rowStr] = this.getCellKey(particle.x, particle.y).split(',');
    const col = parseInt(colStr);
    const row = parseInt(rowStr);

    // 检查当前单元和相邻 8 个单元
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${col + dx},${row + dy}`;
        const cellParticles = this.grid.get(key);
        if (cellParticles) {
          neighbors.push(...cellParticles);
        }
      }
    }
    return neighbors;
  }
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const particles: Particle[] = [];
    const particleCount = 60;
    const colors = [
      'rgba(138, 173, 244, 0.3)', // blue
      'rgba(183, 189, 248, 0.25)', // lavender
      'rgba(198, 160, 246, 0.2)', // mauve
      'rgba(125, 196, 228, 0.25)', // sapphire
    ];

    class ParticleClass implements Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2.5 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (canvas) {
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new ParticleClass());
    }

    // 创建空间分区网格
    const spatialGrid = new SpatialGrid();

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 重建空间网格 (每帧重建,因为粒子位置会变化)
      spatialGrid.rebuild(particles);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();

        // Mouse attraction
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          particle.vx += dx * 0.00005;
          particle.vy += dy * 0.00005;
        }
      });

      // 使用空间分区优化连接线绘制
      const drawnConnections = new Set<string>();

      particles.forEach((particle) => {
        const nearbyParticles = spatialGrid.getNearbyParticles(particle);

        nearbyParticles.forEach((otherParticle) => {
          // 避免重复绘制同一对粒子的连接线
          const particleIndex = particles.indexOf(particle);
          const otherIndex = particles.indexOf(otherParticle);
          if (particleIndex >= otherIndex) return;

          const connectionKey = `${particleIndex}-${otherIndex}`;
          if (drawnConnections.has(connectionKey)) return;

          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(138, 173, 244, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            drawnConnections.add(connectionKey);
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-40"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
