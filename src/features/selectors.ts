import type { RootState } from "../store";

export const selectIsGameOver = (state: RootState) => state.gameConfig.isGameOver;
export const selectIsSoundOn = (state: RootState) => state.player.isSoundOn;
export const selectIsSettingsOpen = (state: RootState) => state.gameConfig.isSettingsOpen;
export const selectBalls = (state: RootState) => state.gameConfig.balls;
export const selectCurrentGameCounter = (state: RootState) => state.timerConfig.currentGameCounter;
export const selectCurrentGameTime = (state: RootState) => state.timerConfig.currentGameTime;
export const selectAllGameTime = (state: RootState) => state.timerConfig.allGameTime;