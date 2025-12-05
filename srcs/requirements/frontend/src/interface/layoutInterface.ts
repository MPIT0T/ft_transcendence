/**
 * @fileoverview Type definitions for Layout component
 */

/**
 * Represents a particle in the animated background
 */
export interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  velX: number;
  velY: number;
}

/**
 * Global window extensions for background animation state
 */
declare global {
  interface Window {
    backgroundParticles?: Particle[];
    backgroundAnimationId?: number;
    backgroundResizeHandler?: () => void;
    googleAuthListenerAdded?: boolean;
  }
}

