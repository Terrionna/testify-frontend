import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  isBouncing = false;
  isGameActive = false;
  catchCount = 0;

  mascotX = 100;
  mascotY = 100;
  velocityX = 4;
  velocityY = 4;
  animFrameId: number | null = null;

  triggerMascotGame(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    this.isGameActive = true;
    this.catchCount = 0;
    this.mascotX = window.innerWidth / 2 - 40;
    this.mascotY = 120;

    this.startPhysics();
  }

  onLogoClick(event: MouseEvent): void {
    if (this.isGameActive) {
      event.preventDefault();
    }
  }

  startPhysics(): void {
    const updatePosition = () => {
      if (!this.isGameActive) return;

      this.mascotX += this.velocityX;
      this.mascotY += this.velocityY;

      // Bounce off viewport borders
      if (this.mascotX <= 0 || this.mascotX >= window.innerWidth - 80) {
        this.velocityX *= -1;
      }
      if (this.mascotY <= 0 || this.mascotY >= window.innerHeight - 80) {
        this.velocityY *= -1;
      }

      this.animFrameId = requestAnimationFrame(updatePosition);
    };

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.animFrameId = requestAnimationFrame(updatePosition);
  }

  catchMascot(event: MouseEvent): void {
    event.stopPropagation();
    this.catchCount++;
    // Speed up slightly on each click
    this.velocityX = (this.velocityX > 0 ? 1 : -1) * (Math.abs(this.velocityX) + 1.5);
    this.velocityY = (this.velocityY > 0 ? 1 : -1) * (Math.abs(this.velocityY) + 1.5);
  }

  popMascot(): void {
    this.isGameActive = false;
    this.velocityX = 4;
    this.velocityY = 4;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  ngOnDestroy(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}
