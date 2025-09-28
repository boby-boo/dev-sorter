import type { GameConfig, BallItem } from '../types';

export const GAME_CONFIG: GameConfig = {
  friction: 0.98,
  acceleration: 0.2,
  heroActivationRadius: 100,
  heroMaxSpeed: 5,
  heroMinDistance: 40,
  ballsQuantity: 12,
};

export const ballsItems: BallItem[] = [
  {
    id: 'js',
    label: 'JS',
  },
  {
    id: 'ts',
    label: 'TS',
  },
  {
    id: 'react',
    label: 'React',
  },
  {
    id: 'angular',
    label: 'Angular',
  },
  {
    id: 'vue',
    label: 'Vue',
  },
  {
    id: 'redux',
    label: 'Redux',
  },
]

export const COLORS: Array<"green" | "blue" | "yellow"> = ["green", "blue", "yellow"];
