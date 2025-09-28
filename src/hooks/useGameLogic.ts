import { useCallback, useRef } from 'react';
import type { Ball, Color, MousePosition } from '../types';
import { GAME_CONFIG } from '../constants/gameConfig';
import { distance, createGroupId } from '../utils/gameUtils';
import { selectBalls } from '../features/selectors';
import { useSelector } from 'react-redux';

const BALL_COLORS: Record<string, Color> = {
  js: '#F7DF1E',
  ts: '#3178C6',
  react: '#61DAFB',
  angular: '#DD0031',
  vue: '#42B883',
  redux: '#764ABC',
};

export const useGameLogic = (canvasWidth: number, canvasHeight: number) => {
  const ballsRef = useRef<Ball[]>([]);
  const selectedBalls = useSelector(selectBalls);
  const mouseRef = useRef<MousePosition>({ x: canvasWidth / 2, y: canvasHeight / 2 });
  const createGroupIdRef = useRef(createGroupId());

  const initializeBalls = useCallback(() => {
    const newBalls: Ball[] = [];

    selectedBalls.forEach((id) => {
      for (let i = 0; i < 5; i++) {
        newBalls.push({
          id: `${id}-${i}`,
          x: canvasWidth / 2 + Math.random() * 100,
          y: canvasHeight / 2 + Math.random() * 100,
          radius: 15,
          color: BALL_COLORS[id],
          isActive: false,
        });
      }
    });

    ballsRef.current = newBalls;
  }, [canvasWidth, canvasHeight, selectedBalls]);

  const checkBallCollisions = useCallback((balls: Ball[]) => {
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i];
        const b = balls[j];

        if (a.color !== "white" && a.color === b.color) {
          const d = distance(a, b);

          if (d < a.radius + b.radius + 20) {
            const hasOtherNearby = balls.some((other) => {
              if (other === a || other === b) return false;
              if (other.color !== a.color && other.color !== "white") {
                return distance(a, other) < a.radius * 4;
              }
              return false;
            });

            if (hasOtherNearby) {
              continue;
            }

            if (!a.groupId && !b.groupId) {
              const gid = createGroupIdRef.current();
              a.groupId = gid;
              b.groupId = gid;

              a.groupOffsetX = 0;
              a.groupOffsetY = 0;
              b.groupOffsetX = b.x - a.x;
              b.groupOffsetY = b.y - a.y;

              a.isMatched = true;
              b.isMatched = true;
            }
            else if (a.groupId && !b.groupId) {
              const leader = balls.find(ball => ball.groupId === a.groupId)!;
              b.groupId = a.groupId;
              b.groupOffsetX = b.x - leader.x;
              b.groupOffsetY = b.y - leader.y;
              b.isMatched = true;
            }
            else if (b.groupId && !a.groupId) {
              const leader = balls.find(ball => ball.groupId === b.groupId)!;
              a.groupId = b.groupId;
              a.groupOffsetX = a.x - leader.x;
              a.groupOffsetY = a.y - leader.y;
              a.isMatched = true;
            }
            else if (a.groupId !== b.groupId) {
              const oldId = b.groupId!;
              const newId = a.groupId!;
              const leader = a;

              balls.forEach(ball => {
                if (ball.groupId === oldId) {
                  ball.groupId = newId;
                  ball.groupOffsetX = ball.x - leader.x;
                  ball.groupOffsetY = ball.y - leader.y;
                  ball.isMatched = true;
                }
              });

              a.isMatched = true;
              b.isMatched = true;
            }
          }

        }

      }
    }
  }, []);

  const areAllGroupsComplete = useCallback((balls: Ball[], selectedColors: string[]): boolean => {
    for (const color of selectedColors) {
      const colorBalls = balls.filter(b => b.color === BALL_COLORS[color]);
      if (colorBalls.length === 0) continue;

      const groupIds = [...new Set(colorBalls.map(b => b.groupId))];
      if (groupIds.length !== 1) return false;

      if (!colorBalls.every(b => b.isMatched)) return false;
    }
    return true;
  }, []);


  const resolveBallCollision = useCallback((a: Ball, b: Ball) => {
    if (a.groupId && b.groupId && a.groupId === b.groupId) return;

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < a.radius + b.radius) {
      const nx = dx / dist;
      const ny = dy / dist;
      const overlap = a.radius + b.radius - dist;

      a.x -= nx * overlap / 2;
      a.y -= ny * overlap / 2;
      b.x += nx * overlap / 2;
      b.y += ny * overlap / 2;

      const dvx = (a.vx || 0) - (b.vx || 0);
      const dvy = (a.vy || 0) - (b.vy || 0);
      const dot = dvx * nx + dvy * ny;

      if (dot > 0) {
        const bounce = 0.9;
        const impulse = dot * bounce;
        a.vx = (a.vx || 0) - impulse * nx;
        a.vy = (a.vy || 0) - impulse * ny;
        b.vx = (b.vx || 0) + impulse * nx;
        b.vy = (b.vy || 0) + impulse * ny;
      }
    }
  }, []);

  const getRandomHeroPosition = useCallback((width: number, height: number) => {
    let x = Math.random() * width;
    let y = Math.random() * height;

    const centerX = width / 2;
    const centerY = height / 2;
    const minDistFromCenter = 200;

    while (Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) < minDistFromCenter) {
      x = Math.random() * width;
      y = Math.random() * height;
    }

    return { x, y };
  }, []);


  const applyRandomDrift = useCallback(
    (balls: Ball[], canvasWidth: number, canvasHeight: number) => {
      balls.forEach((ball) => {
        if (ball.isHero) return;

        if (ball.driftAngle === undefined) {
          ball.driftAngle = Math.random() * Math.PI * 2;
        }
        if (!ball.driftTimer || ball.driftTimer <= 0) {
          ball.driftAngle += (Math.random() - 0.5) * 0.3;
          ball.driftTimer = 60;
        } else {
          ball.driftTimer--;
        }

        const driftForce = 0.02;
        ball.vx = (ball.vx || 0) + Math.cos(ball.driftAngle) * driftForce;
        ball.vy = (ball.vy || 0) + Math.sin(ball.driftAngle) * driftForce;

        ball.x += ball.vx || 0;
        ball.y += ball.vy || 0;

        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.driftAngle = Math.PI - ball.driftAngle;
        }
        if (ball.x + ball.radius > canvasWidth) {
          ball.x = canvasWidth - ball.radius;
          ball.driftAngle = Math.PI - ball.driftAngle;
        }
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.driftAngle = -ball.driftAngle;
        }
        if (ball.y + ball.radius > canvasHeight) {
          ball.y = canvasHeight - ball.radius;
          ball.driftAngle = -ball.driftAngle;
        }

        const speed = Math.sqrt((ball.vx || 0) ** 2 + (ball.vy || 0) ** 2) || 1;
        ball.vx = Math.cos(ball.driftAngle) * speed;
        ball.vy = Math.sin(ball.driftAngle) * speed;

        ball.vx! *= 0.98;
        ball.vy! *= 0.98;
      });
    },
    []
  );

  const handleBallCollisions = useCallback((balls: Ball[]) => {
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        resolveBallCollision(balls[i], balls[j]);
      }
    }
  }, [resolveBallCollision]);

  const updateBallPhysics = useCallback(
    (
      ball: Ball,
      hero: Ball,
      canvasWidth: number,
      canvasHeight: number,
      groups: Record<string, Ball[]>
    ) => {
      const applyBounce = (b: Ball) => {
        if (b.x - b.radius < 0) {
          b.x = b.radius;
          b.vx = -(b.vx || 0);
          b.driftAngle = Math.PI - (b.driftAngle || 0);
        }
        if (b.x + b.radius > canvasWidth) {
          b.x = canvasWidth - b.radius;
          b.vx = -(b.vx || 0);
          b.driftAngle = Math.PI - (b.driftAngle || 0);
        }
        if (b.y - b.radius < 0) {
          b.y = b.radius;
          b.vy = -(b.vy || 0);
          b.driftAngle = -(b.driftAngle || 0);
        }
        if (b.y + b.radius > canvasHeight) {
          b.y = canvasHeight - b.radius;
          b.vy = -(b.vy || 0);
          b.driftAngle = -(b.driftAngle || 0);
        }
      };

      if (ball.groupId && groups[ball.groupId]) {
        const group = groups[ball.groupId];
        const leader = group[0];

        for (const member of group) {
          const dx = member.x - hero.x;
          const dy = member.y - hero.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < hero.radius + member.radius * 2) {
            leader.isActive = true;
            leader.vx = (leader.vx || 0) + (dx / dist) * GAME_CONFIG.acceleration;
            leader.vy = (leader.vy || 0) + (dy / dist) * GAME_CONFIG.acceleration;

            leader.driftAngle = Math.atan2(dy, dx);
            break;
          }
        }

        if (leader.isActive) {
          leader.x += leader.vx || 0;
          leader.y += leader.vy || 0;

          applyBounce(leader);

          leader.vx! *= GAME_CONFIG.friction;
          leader.vy! *= GAME_CONFIG.friction;

          if (Math.abs(leader.vx!) < 0.05 && Math.abs(leader.vy!) < 0.05) {
            leader.vx = 0;
            leader.vy = 0;
            leader.isActive = false;
          }
        }
      } else {
        const dx = ball.x - hero.x;
        const dy = ball.y - hero.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < hero.radius + ball.radius * 2 + 20) {
          ball.isActive = true;
          ball.vx = (ball.vx || 0) + (dx / dist) * GAME_CONFIG.acceleration;
          ball.vy = (ball.vy || 0) + (dy / dist) * GAME_CONFIG.acceleration;

          ball.driftAngle = Math.atan2(dy, dx);
        }

        if (ball.isActive) {
          ball.x += ball.vx || 0;
          ball.y += ball.vy || 0;

          applyBounce(ball);

          ball.vx! *= GAME_CONFIG.friction;
          ball.vy! *= GAME_CONFIG.friction;

          if (Math.abs(ball.vx!) < 0.05 && Math.abs(ball.vy!) < 0.05) {
            ball.vx = 0;
            ball.vy = 0;
            ball.isActive = false;
          }
        }
      }
    },
    []
  );


  const updateMousePosition = useCallback((x: number, y: number) => {
    mouseRef.current = { x, y };
  }, []);

  return {
    ballsRef,
    mouseRef,
    initializeBalls,
    checkBallCollisions,
    handleBallCollisions,
    updateBallPhysics,
    areAllGroupsComplete,
    updateMousePosition,
    applyRandomDrift,
    getRandomHeroPosition,
  };
};
