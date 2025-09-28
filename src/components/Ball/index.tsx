import React from 'react';
import type { Ball as BallType } from '../../types';
import { drawBall } from '../../utils/gameUtils';

interface BallProps {
  ball: BallType;
  ctx: CanvasRenderingContext2D;
}

export const Ball: React.FC<BallProps> = ({ ball, ctx }) => {
  React.useEffect(() => {
    drawBall(ctx, ball);
  }, [ball, ctx]);

  return null;
};
