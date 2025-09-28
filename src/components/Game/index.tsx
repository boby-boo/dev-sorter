import { useEffect, useRef } from "react";
import { useGameLogic } from "../../hooks/useGameLogic";
import { updateGroups, drawBall } from "../../utils/gameUtils";
import type { Ball as BallType } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { setIsGameOver } from "../../features/game/gameConfigSlice";
import { selectIsGameOver, selectBalls } from "../../features/selectors";

const Game: React.FC = () => { 
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dispatch = useDispatch();
  const isGameOver = useSelector(selectIsGameOver);
  const ballsConfig = useSelector(selectBalls);

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  const {
    ballsRef,
    mouseRef,
    initializeBalls,
    checkBallCollisions,
    handleBallCollisions,
    updateBallPhysics,
    updateMousePosition,
    applyRandomDrift,
    areAllGroupsComplete,
    getRandomHeroPosition,
  } = useGameLogic(canvasWidth, canvasHeight);


const { x, y } = getRandomHeroPosition(window.innerWidth, window.innerHeight);

const heroRef = useRef<BallType>({
  id: "hero",
  x,
  y,  
  radius: 20,
  color: "white",
  isHero: true,
  isActive: true,
});

  useEffect(() => {
    initializeBalls();
    mouseRef.current = { 
      x: heroRef.current.x, 
      y: heroRef.current.y 
    };
  }, [ballsConfig, initializeBalls, mouseRef]);

  useEffect(() => {
    if (!isGameOver) {
      initializeBalls();
      mouseRef.current = { 
        x: heroRef.current.x, 
        y: heroRef.current.y 
      };
    }
  }, [isGameOver,mouseRef, initializeBalls]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let animationId: number;

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const groups = updateGroups(ballsRef.current);
      applyRandomDrift(ballsRef.current, canvas.width, canvas.height);
  
      const dxHero = mouseRef.current.x - heroRef.current.x;
      const dyHero = mouseRef.current.y - heroRef.current.y;
      const distHero = Math.sqrt(dxHero * dxHero + dyHero * dyHero);

      if (distHero > 50) {
        heroRef.current.x += dxHero * 0.1;
        heroRef.current.y += dyHero * 0.1;
      }

      if (heroRef.current.x - heroRef.current.radius < 0) {
        heroRef.current.x = heroRef.current.radius;
      }
      if (heroRef.current.x + heroRef.current.radius > canvas.width) {
        heroRef.current.x = canvas.width - heroRef.current.radius;
      }
      if (heroRef.current.y - heroRef.current.radius < 0) {
        heroRef.current.y = heroRef.current.radius;
      }
      if (heroRef.current.y + heroRef.current.radius > canvas.height) {
        heroRef.current.y = canvas.height - heroRef.current.radius;
      }

      drawBall(ctx, heroRef.current);

      ballsRef.current.forEach((ball) => {
        updateBallPhysics(ball, heroRef.current, canvas.width, canvas.height, groups);
        checkBallCollisions(ballsRef.current);
        handleBallCollisions(ballsRef.current);
        updateGroups(ballsRef.current);
        drawBall(ctx, ball);
      });

      const allMatched = areAllGroupsComplete(ballsRef.current, ballsConfig)
      if (allMatched && !isGameOver) {
        dispatch(setIsGameOver(true));
      }

      animationId = requestAnimationFrame(loop);
    }

    loop();
    return () => cancelAnimationFrame(animationId);
  }, [
    canvasWidth, canvasHeight,
    ballsRef, mouseRef,
    checkBallCollisions, handleBallCollisions,
    updateBallPhysics, applyRandomDrift, ballsConfig,
    dispatch, isGameOver,
    areAllGroupsComplete,
  ]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      updateMousePosition(e.clientX - rect.left, e.clientY - rect.top);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [updateMousePosition]);

  return (
    <canvas ref={canvasRef} className="game" />
  );
};

export default Game;
