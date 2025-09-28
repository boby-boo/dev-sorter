import {
    Game,
    Timer,
    Modal,
    Menu,
    SettingsModal,
    AudioPlayer,
} from './components';
import { useSelector } from 'react-redux';
import { selectIsGameOver, selectIsSettingsOpen } from './features/selectors';

const App = () => {
    const isGameOver = useSelector(selectIsGameOver);
    const isSettingsOpen = useSelector(selectIsSettingsOpen);

    return (
        <div className="app">
            <Game />
            <Timer />
            <Menu />
            <AudioPlayer />
            {isGameOver && <Modal />}
            {isSettingsOpen && <SettingsModal />}
        </div>
    );
};

export default App;
