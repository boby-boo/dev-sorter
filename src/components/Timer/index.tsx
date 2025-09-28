import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectCurrentGameCounter,
    selectIsGameOver,
} from '../../features/selectors';
import { setCurrentGameTime } from '../../features/timer/timerConfigSlice';

const Timer = () => {
    const [time, setTime] = useState(0);
    const timerId = useRef<number | null>(null);

    const gameOver = useSelector(selectIsGameOver);
    const currentGameCounter = useSelector(selectCurrentGameCounter);
    const dispatch = useDispatch();

    useEffect(() => {
        if (timerId.current) {
            clearInterval(timerId.current);
            timerId.current = null;
        }

        if (gameOver) return;

        setTime(0);
        timerId.current = window.setInterval(() => {
            setTime(prev => {
                const newTime = prev + 1;
                dispatch(setCurrentGameTime(newTime));
                return newTime;
            });
        }, 1000);

        return () => {
            if (timerId.current) {
                clearInterval(timerId.current);
                timerId.current = null;
            }
        };
    }, [gameOver, currentGameCounter, dispatch]);

    return <div className="timer">{time}</div>;
};

export default Timer;
