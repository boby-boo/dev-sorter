export type Color = '#F7DF1E' | '#3178C6' | '#61DAFB' | '#DD0031' | '#42B883' | '#764ABC' | "white";

export type GameObject = {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: Color;
  isActive: boolean;
  vx?: number;
  vy?: number;
  driftAngle?: number;
  driftTimer?: number;
}

export type Hero = GameObject & {
  isHero: boolean;
}

export type Ball = GameObject & {
  isHero?: boolean;
  groupId?: string;
  groupOffsetX?: number;
  groupOffsetY?: number;
  isMatched?: boolean;
  groupCenter?: { x: number; y: number };
}

export type MousePosition = {
  x: number;
  y: number;
}

export type GameConfig = {
  friction: number;
  acceleration: number;
  heroActivationRadius: number;
  heroMaxSpeed: number;
  heroMinDistance: number;
  ballsQuantity: number;
}

export type BallItem = {
  id: string;
  label: string;
}
