import type { Ball } from '../../types';

type clampToCanvasBoundsProps = {
  ball: Ball;
  canvasWidth: number;
  canvasHeight: number;
}

export const clampToCanvasBounds = ({ ball, canvasWidth, canvasHeight }: clampToCanvasBoundsProps): void => {
  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
  }
  if (ball.x + ball.radius > canvasWidth) {
    ball.x = canvasWidth - ball.radius;
  }
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
  }
  if (ball.y + ball.radius > canvasHeight) {
    ball.y = canvasHeight - ball.radius;
  }
}