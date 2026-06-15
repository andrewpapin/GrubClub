import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faHourglassHalf, faStar, faLock } from '@fortawesome/free-solid-svg-icons';
import { TopBar } from './TopBar';
import { useGrubClub } from '../state/GrubClubContext';

interface StoreScreenProps {
  onEnterParent: () => void;
}

export function StoreScreen({ onEnterParent }: StoreScreenProps) {
  const { state, requestReward } = useGrubClub();
  const pendingIds = state.pendingRewards.map((r) => r.rewardId);
  const available = state.rewards.filter((r) => !pendingIds.includes(r.id));

  return (
    <div className="screen active">
      <TopBar title="Reward Store" onEnterParent={onEnterParent} />
      <div className="scroll-area">
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 14, textAlign: 'center' }}>
          Tap a reward to ask for it — a grown-up will need to say yes!
        </div>

        {state.rewards.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <span className="empty-state-emoji"><FontAwesomeIcon icon={faStore} /></span>
            <div className="empty-state-text">
              The store is empty!
              <br />
              Ask a grown-up to add rewards.
            </div>
          </div>
        ) : available.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <span className="empty-state-emoji"><FontAwesomeIcon icon={faHourglassHalf} /></span>
            <div className="empty-state-text">
              All rewards requested!
              <br />
              Check below for approval status.
            </div>
          </div>
        ) : (
          <div className="store-grid">
            {available.map((r) => {
              const affordable = state.points >= r.cost;
              return (
                <div
                  key={r.id}
                  className={`store-item ${!affordable ? 'unaffordable' : ''}`}
                  onClick={() => requestReward(r.id)}
                >
                  {!affordable && (
                    <span className="store-lock">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                  )}
                  <span className="store-emoji">{r.emoji}</span>
                  <div className="store-name">{r.name}</div>
                  <div className={`store-cost ${!affordable ? 'unaffordable' : ''}`}><FontAwesomeIcon icon={faStar} /> {r.cost}</div>
                  {!affordable && (
                    <div className="store-need-more">Need {r.cost - state.points} more</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <div className="card-title" style={{ marginBottom: 8 }}>
            <FontAwesomeIcon icon={faHourglassHalf} /> Pending Requests
          </div>
          {state.pendingRewards.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center', padding: 8 }}>
              No pending requests
            </div>
          ) : (
            <div>
              {state.pendingRewards.map((pr) => {
                const reward = state.rewards.find((r) => r.id === pr.rewardId);
                if (!reward) return null;
                return (
                  <div className="parent-item" key={pr.id}>
                    <div className="parent-item-emoji">{reward.emoji}</div>
                    <div className="parent-item-info">
                      <div className="parent-item-name">{reward.name}</div>
                      <div className="parent-item-pts" style={{ color: 'var(--orange)' }}>
                        <FontAwesomeIcon icon={faStar} /> {reward.cost} pts • Waiting for approval
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
