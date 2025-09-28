import { createRoot } from 'react-dom/client';
import './style/index.scss';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './store/index.tsx';

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>,
);
