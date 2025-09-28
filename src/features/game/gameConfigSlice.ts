import { createSlice } from "@reduxjs/toolkit";

type GameState = {
    isGameOver: boolean;
    isSettingsOpen: boolean;
    balls: string[];
    ballsQty: number;
}

const initialState: GameState = {
    isGameOver: false,
    ballsQty: JSON.parse(localStorage.getItem('ballsQty') || '4'),
    isSettingsOpen: true,
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
        setBallsQty: (state, action) => {
            state.ballsQty = action.payload;
            localStorage.setItem('ballsQty', JSON.stringify(state.ballsQty));
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

export const { setIsGameOver, resetGame, setIsSettingsOpen, setBalls, setBallsQty } = gameConfigSlice.actions;
export default gameConfigSlice.reducer;