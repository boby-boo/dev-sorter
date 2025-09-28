import { createSlice } from "@reduxjs/toolkit";

type GameState = {
    isGameOver: boolean;
    isSettingsOpen: boolean;
    balls: string[];
}

const initialState: GameState = {
    isGameOver: false,
    isSettingsOpen: false,
    balls: JSON.parse(localStorage.getItem('balls') || '["js", "ts", "react"]'),
}

export const gameConfigSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setIsGameOver: (state, action) => {
            state.isGameOver = action.payload;
        },
        resetGame: (state) => {
            state.isGameOver = false;
        },
        setIsSettingsOpen: (state, action) => {
            state.isSettingsOpen = action.payload;
        },
        setBalls: (state, action) => {
            state.balls = action.payload;
            localStorage.setItem('balls', JSON.stringify(state.balls));
        },
    },
})

export const { setIsGameOver, resetGame, setIsSettingsOpen, setBalls } = gameConfigSlice.actions;
export default gameConfigSlice.reducer;