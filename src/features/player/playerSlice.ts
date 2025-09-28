import { createSlice } from "@reduxjs/toolkit";

type PlayerState = {
    isSoundOn: boolean;
}

const initialState: PlayerState = {
    isSoundOn: false,
}

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setIsSoundOn: (state, action) => {
            state.isSoundOn = action.payload;
        },
    },
})

export const { setIsSoundOn } = playerSlice.actions;
export default playerSlice.reducer;