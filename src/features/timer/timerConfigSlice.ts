import { createSlice } from "@reduxjs/toolkit";
import { setIsGameOver } from "../game/gameConfigSlice"; 

type TimerState = {
    currentGameCounter: number;
    currentGameTime: number;
    allGameTime: number[];
}

const initialState: TimerState = {
    currentGameCounter: 0,    
    currentGameTime: 0,
    allGameTime: JSON.parse(localStorage.getItem('allGameTime') || '[]'),
}

export const timerConfigSlice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        setCurrentGameTime: (state, action) => {
            state.currentGameTime = action.payload;
        },
        resetCounter: (state) => {
            state.currentGameCounter += 1;
            state.currentGameTime = 0;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setIsGameOver, (state, action) => {
            if (action.payload === true) {
                state.allGameTime = [...state.allGameTime, state.currentGameTime];
                localStorage.setItem('allGameTime', JSON.stringify(state.allGameTime));
            }
        });
    },
})

export const { setCurrentGameTime, resetCounter } = timerConfigSlice.actions;
export default timerConfigSlice.reducer;