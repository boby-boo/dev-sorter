import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetGame } from '../../features/game/gameConfigSlice';
import { resetCounter } from '../../features/timer/timerConfigSlice';
import { Button } from '..';
import {
    selectAllGameTime,
    selectCurrentGameTime,
} from '../../features/selectors';

const Modal = () => {
    const currentGameTime = useSelector(selectCurrentGameTime);
    const allGameTime = useSelector(selectAllGameTime);
    const statistic = { bestTime: 0, worstTime: 0 };

    const dispatch = useDispatch();

    const allTimeGameQty = allGameTime.length;

    if (allTimeGameQty) {
        statistic.bestTime = Math.min(...allGameTime);
        statistic.worstTime = Math.max(...allGameTime);
    }
    return createPortal(
        <div className="modal">
            <div className="modal__content">
                <h2 className="modal__title">
                    You sorted the <span>dev stack</span> in {currentGameTime}{' '}
                    seconds
                </h2>
                <ul className="modal__list">
                    <li className="modal__item">
                        <span>Best time</span>: {statistic.bestTime}
                    </li>
                    <li className="modal__item">
                        <span>Worst time</span>:{' '}
                        {allTimeGameQty === 1 ? '-' : statistic.worstTime}
                    </li>
                </ul>
                <Button
                    text="Play Again"
                    onClick={() => {
                        dispatch(resetGame());
                        dispatch(resetCounter());
                    }}
                />
            </div>
        </div>,
        document.getElementById('portal')!,
    );
};

export default Modal;
