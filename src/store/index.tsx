import {configureStore} from "@reduxjs/toolkit";
import gameConfigReducer from "../features/game/gameConfigSlice";
import timerConfigReducer from "../features/timer/timerConfigSlice";
import playerReducer from "../features/player/playerSlice";

export const store = configureStore({
    reducer: {
        gameConfig: gameConfigReducer,
        timerConfig: timerConfigReducer,
        player: playerReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;