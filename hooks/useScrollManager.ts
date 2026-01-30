'use client';
import { useEffect, useRef } from 'react';

export interface ScrollData {
  scrollY: number;
  headerBottom: number;
}

export type ScrollCallback = (scrollY: number, headerBottom: number) => void;

class ScrollManager {
  private callbacks = new Set<ScrollCallback>();
  private rafId: number | null = null;
  private isListening = false;

  subscribe(callback: ScrollCallback): () => void {
    this.callbacks.add(callback);
    if (this.callbacks.size === 1) {
      this.startListening();
    }

    // 立即执行一次回调以获取初始状态
    this.notifyCallback(callback);

    return () => {
      this.callbacks.delete(callback);
      if (this.callbacks.size === 0) {
        this.stopListening();
      }
    };
  }

  private startListening() {
    if (this.isListening) return;
    this.isListening = true;
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  private stopListening() {
    if (!this.isListening) return;
    this.isListening = false;
    window.removeEventListener('scroll', this.handleScroll);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private handleScroll = () => {
    if (this.rafId !== null) return;

    this.rafId = requestAnimationFrame(() => {
      const header = document.getElementById('site-header');
      const headerBottom = header?.getBoundingClientRect().bottom || 56;
      const scrollY = window.scrollY;

      this.callbacks.forEach((cb) => cb(scrollY, headerBottom));
      this.rafId = null;
    });
  };

  private notifyCallback(callback: ScrollCallback) {
    const header = document.getElementById('site-header');
    const headerBottom = header?.getBoundingClientRect().bottom || 56;
    const scrollY = window.scrollY;
    callback(scrollY, headerBottom);
  }
}

// 单例实例
const scrollManager = new ScrollManager();

/**
 * 统一的滚动管理 Hook
 * 使用单例模式减少事件监听器数量,使用 requestAnimationFrame 节流
 *
 * @param callback 滚动时的回调函数,接收 scrollY 和 headerBottom 参数
 */
export function useScrollManager(callback: ScrollCallback) {
  const callbackRef = useRef(callback);

  // 保持 callback 引用最新
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const wrappedCallback = (scrollY: number, headerBottom: number) => {
      callbackRef.current(scrollY, headerBottom);
    };

    return scrollManager.subscribe(wrappedCallback);
  }, []);
}
