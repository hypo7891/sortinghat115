import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MagicWeavingGame } from './MagicWeavingGame';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MagicWeavingGame mbtiElements={['E', 'N', 'F', 'P']} onGameComplete={(score, dominant) => console.log({ score, dominant })} />
  </StrictMode>,
);
