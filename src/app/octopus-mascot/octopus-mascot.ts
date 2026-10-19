// Octopus mascot for Testify.
// Swims around the screen on its own, leaves bubbles behind it, and opens a mini game when clicked.
import { Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  drift: number;
}

const OCTOPUS_SIZE = 60;

@Component({
  selector: 'app-octopus-mascot',
  template: `
    @for (b of bubbles(); track b.id) {
      <span
        class="bubble"
        [style.left.px]="b.x"
        [style.top.px]="b.y"
        [style.width.px]="b.size"
        [style.height.px]="b.size"
        [style.--drift.px]="b.drift"
      ></span>
    }

    <div
      class="octopus-mascot"
      [style.transform]="'translate(' + posX() + 'px, ' + posY() + 'px)'"
      (click)="triggerMiniGame()"
      title="Click to play!"
    >
      <img [class.flip]="facingLeft()" src="octopus.png" alt="Octopus Mascot" />
    </div>

    @if (miniGameActive()) {
      <div class="mini-game-overlay">
        <canvas #gameCanvas width="400" height="400"></canvas>
        <button class="close-btn" (click)="closeMiniGame()">Close</button>
      </div>
    }
  `,
  styles: [`
    .octopus-mascot {
      position: fixed;
      top: 0;
      left: 0;
      width: 60px;
      height: 60px;
      cursor: pointer;
      z-index: 1000;
      will-change: transform;
    }
    .octopus-mascot img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      animation: bob 1.2s ease-in-out infinite;
    }
    .octopus-mascot img.flip {
      transform: scaleX(-1);
    }
    .octopus-mascot:hover img {
      filter: drop-shadow(3px 3px 0 #111111);
    }
    @keyframes bob {
      0%, 100% { translate: 0 0; }
      50% { translate: 0 -6px; }
    }
    .bubble {
      position: fixed;
      z-index: 999;
      border: 2px solid #111111;
      border-radius: 50%;
      background: rgba(0, 240, 255, 0.35);
      pointer-events: none;
      animation: rise 1.5s ease-out forwards;
    }
    @keyframes rise {
      0% { transform: translate(0, 0) scale(0.6); opacity: 0.95; }
      100% { transform: translate(var(--drift), -70px) scale(1.1); opacity: 0; }
    }
    .mini-game-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }
    canvas {
      background: #111;
      border: 2px solid #fff;
    }
    .close-btn {
      margin-top: 10px;
      padding: 8px 16px;
      background: #ff4444;
      color: white;
      border: none;
      cursor: pointer;
    }
  `]
})
export class OctopusMascotComponent implements OnDestroy {
  @ViewChild('gameCanvas') gameCanvas!: ElementRef<HTMLCanvasElement>;

  posX = signal(window.innerWidth - OCTOPUS_SIZE - 20);
  posY = signal(window.innerHeight - OCTOPUS_SIZE - 20);
  facingLeft = signal(false);
  bubbles = signal<Bubble[]>([]);
  miniGameActive = signal(false);

  private targetX = this.posX();
  private targetY = this.posY();
  private lastBubbleX = this.posX();
  private lastBubbleY = this.posY();
  private nextBubbleId = 0;
  private swimFrameId = 0;
  private animationFrameId = 0;
  private timers: number[] = [];

  constructor() {
    this.pickTarget();
    this.swim();
  }

  // Picks a new spot on the screen to swim to.
  private pickTarget(): void {
    const maxX = Math.max(0, window.innerWidth - OCTOPUS_SIZE);
    const maxY = Math.max(0, window.innerHeight - OCTOPUS_SIZE);
    this.targetX = Math.random() * maxX;
    this.targetY = Math.random() * maxY;
  }

  // Moves the octopus a little toward its target each frame and drops bubbles as it goes.
  private swim = (): void => {
    if (!this.miniGameActive()) {
      const dx = this.targetX - this.posX();
      const dy = this.targetY - this.posY();
      const distance = Math.hypot(dx, dy);

      if (distance < 8) {
        this.pickTarget();
      } else {
        // A steady speed, slowing down a little when close to the target.
        const speed = Math.min(2.2, Math.max(0.6, distance * 0.02));
        this.posX.update((x) => x + (dx / distance) * speed);
        this.posY.update((y) => y + (dy / distance) * speed);
        this.facingLeft.set(dx < 0);

        const moved = Math.hypot(this.posX() - this.lastBubbleX, this.posY() - this.lastBubbleY);
        if (moved > 22) {
          this.addBubble();
          this.lastBubbleX = this.posX();
          this.lastBubbleY = this.posY();
        }
      }
    }
    this.swimFrameId = requestAnimationFrame(this.swim);
  };

  // Adds one bubble behind the octopus and removes it after its animation ends.
  private addBubble(): void {
    const bubble: Bubble = {
      id: this.nextBubbleId++,
      x: this.posX() + OCTOPUS_SIZE / 2 + (Math.random() * 20 - 10),
      y: this.posY() + OCTOPUS_SIZE / 2 + (Math.random() * 20 - 10),
      size: 8 + Math.random() * 12,
      drift: Math.random() * 30 - 15
    };
    this.bubbles.update((list) => [...list, bubble]);
    this.timers.push(
      window.setTimeout(() => {
        this.bubbles.update((list) => list.filter((b) => b.id !== bubble.id));
      }, 1500)
    );
  }

  triggerMiniGame(): void {
    this.miniGameActive.set(true);
    setTimeout(() => this.initCanvasGame(), 50);
  }

  closeMiniGame(): void {
    this.miniGameActive.set(false);
    cancelAnimationFrame(this.animationFrameId);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.swimFrameId);
    cancelAnimationFrame(this.animationFrameId);
    this.timers.forEach((t) => clearTimeout(t));
  }

  initCanvasGame(): void {
    const canvas = this.gameCanvas?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let x = 200;
    let y = 200;
    const radius = 20;
    let dx = 2;
    let dy = 2;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff69b4';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      x += dx;
      y += dy;

      if (x < radius || x > canvas.width - radius) dx = -dx;
      if (y < radius || y > canvas.height - radius) dy = -dy;

      if (this.miniGameActive()) {
        this.animationFrameId = requestAnimationFrame(render);
      }
    };

    render();
  }
}
