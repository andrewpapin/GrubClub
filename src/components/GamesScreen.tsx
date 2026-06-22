import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { AppIcon } from './AppIcon';
import { GAMES } from '../data/games';
import { HangmanGame } from './games/HangmanGame';

interface GamesScreenProps {
  open: boolean;
  onClose: () => void;
}

export function GamesScreen({ open, onClose }: GamesScreenProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handleClose = () => {
    onClose();
    setActiveGame(null);
  };

  const activeGameDef = GAMES.find((g) => g.id === activeGame);

  return (
    <div
      className={`calendar-modal-overlay ${open ? 'show' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="calendar-modal-sheet">
        <div className="calendar-modal-header">
          <div className="calendar-modal-header-titles">
            {activeGameDef && (
              <button className="calendar-modal-back" onClick={() => setActiveGame(null)} aria-label="Back to Games" type="button">
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            )}
            <span className="calendar-modal-title">{activeGameDef ? activeGameDef.name : 'Games'}</span>
          </div>
          <button className="calendar-modal-close" onClick={handleClose} aria-label="Close games" type="button">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="calendar-modal-body">
          {activeGame === 'hangman' ? (
            <HangmanGame onExit={() => setActiveGame(null)} />
          ) : (
            <div className="games-grid">
              {GAMES.map((g) => (
                <button key={g.id} className="game-tile" onClick={() => setActiveGame(g.id)} type="button">
                  <AppIcon iconKey={g.icon} emojiFallback={g.emoji} className="game-tile-icon" />
                  <div className="game-tile-name">{g.name}</div>
                  <div className="game-tile-desc">{g.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
