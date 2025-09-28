import { useDispatch, useSelector } from 'react-redux';
import { SettingsIcon, SoundIcon, SoundOffIcon } from '../../assets/icons';
import { setIsSettingsOpen } from '../../features/game/gameConfigSlice';
import { setIsSoundOn } from '../../features/player/playerSlice';
import { selectIsSoundOn } from '../../features/selectors';

const Menu = () => {
    const dispatch = useDispatch();
    const isSoundOn = useSelector(selectIsSoundOn);

    const handleSound = () => {
        dispatch(setIsSoundOn(!isSoundOn));
    };

    return (
        <nav className="menu">
            <ul className="menu__list">
                <li className="menu__item">
                    <button
                        className="menu__button"
                        onClick={() => dispatch(setIsSettingsOpen(true))}
                    >
                        {<SettingsIcon />}
                    </button>
                </li>
                <li className="menu__item">
                    <button className="menu__button" onClick={handleSound}>
                        {isSoundOn ? <SoundIcon /> : <SoundOffIcon />}
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;
