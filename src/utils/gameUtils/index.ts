import type { Ball } from '../../types';

export const distance = (a: Ball, b: Ball): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export const drawBall = (ctx: CanvasRenderingContext2D, ball: Ball): void => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  
  if (ball.id !== "hero") {
    ctx.fillStyle = "#2A2A2A";
    ctx.font = `${ball.radius * 0.8}px Roboto`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ball.id.split("-")[0].slice(0, 3).toUpperCase(), ball.x, ball.y);
  }
}

export const createGroupId = (): () => string => {
  let groupCounter = 0;
  return () => {
    groupCounter++;
    return `group-${groupCounter}`;
  };
}

export const updateGroups = (balls: Ball[]): Record<string, Ball[]> => {
  const groups: Record<string, Ball[]> = {};

  balls.forEach(ball => {
    if (ball.groupId) {
      if (!groups[ball.groupId]) groups[ball.groupId] = [];
      groups[ball.groupId].push(ball);
    }
  });

  Object.values(groups).forEach(group => {
    const leader = group[0]; 
    group.forEach((ball, idx) => {
      if (idx === 0) return;
      if (ball !== leader) {
        ball.x = leader.x + (ball.groupOffsetX ?? (ball.x - leader.x));
        ball.y = leader.y + (ball.groupOffsetY ?? (ball.y - leader.y));
      }
      ball.vx = leader.vx;
      ball.vy = leader.vy;
    });
  });

  return groups;
}
