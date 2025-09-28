import { createPortal } from 'react-dom';
import { useState } from 'react';
import Button from '../Button';
import { useDispatch, useSelector } from 'react-redux';
import {
    resetGame,
    setBalls,
    setIsSettingsOpen,
} from '../../features/game/gameConfigSlice';
import { selectBalls } from '../../features/selectors';
import { resetCounter } from '../../features/timer/timerConfigSlice';
import { ballsItems } from '../../constants/gameConfig';

const SettingsModal = () => {
    const balls = useSelector(selectBalls);
    const dispatch = useDispatch();
    const [activeButtonsId, setActiveButtonsId] = useState<string[]>(balls);

    const handleClick = (id: string) => {
        if (activeButtonsId.includes(id)) {
            setActiveButtonsId(activeButtonsId.filter(item => item !== id));
        } else {
            setActiveButtonsId([...activeButtonsId, id]);
        }
    };

    const handleApply = () => {
        dispatch(resetGame());
        dispatch(resetCounter());
        dispatch(setBalls(activeButtonsId));
        dispatch(setIsSettingsOpen(false));
    };

    return createPortal(
        <div
            className="settings-modal"
            onClick={() => dispatch(setIsSettingsOpen(false))}
        >
            <div
                className="settings-modal__content"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="settings-modal__title">Choose your stack</h2>
                <ul className="settings-modal__list">
                    {ballsItems.map(item => {
                        const isActive = activeButtonsId.includes(item.id);
                        const currentClass = isActive
                            ? 'selected__button'
                            : `settings-modal-button_${item.id}`;

                        return (
                            <li
                                key={item.label}
                                className="settings-modal__item"
                            >
                                <button
                                    className={`settings-modal__button ${currentClass}`}
                                    onClick={() => handleClick(item.id)}
                                >
                                    <span className="settings-modal__button-text">
                                        {item.label}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <div className="settings-modal__button-container">
                    <Button
                        text="Apply"
                        disabled={activeButtonsId.length < 3}
                        onClick={handleApply}
                    />
                </div>
            </div>
        </div>,
        document.getElementById('settings-portal')!,
    );
};

export default SettingsModal;
