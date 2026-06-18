import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPen, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useGrubClub } from '../../state/GrubClubContext';
import type { Reward } from '../../state/types';

export function StorePanel() {
  const { state, addReward, removeReward, updateReward } = useGrubClub();
  const [emoji, setEmoji] = useState('');
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editReward, setEditReward] = useState({ emoji: '', name: '', cost: '' });

  const startEdit = (r: Reward) => {
    setEditingId(r.id);
    setEditReward({ emoji: r.emoji, name: r.name, cost: String(r.cost) });
  };

  const saveEdit = (id: number) => {
    const trimmedName = editReward.name.trim();
    if (!trimmedName) return;
    updateReward(id, {
      emoji: editReward.emoji.trim() || '🎁',
      name: trimmedName,
      cost: parseInt(editReward.cost) || 50,
    });
    setEditingId(null);
  };

  const handleAdd = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    addReward({
      emoji: emoji.trim() || '🎁',
      name: trimmedName,
      cost: parseInt(cost) || 50,
    });
    setEmoji('');
    setName('');
    setCost('');
  };

  return (
    <div>
      <div className="section-label">Add a Reward</div>
      <form className="input-row" onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
        <input
          type="text"
          className="emoji-input"
          placeholder="🎮"
          maxLength={2}
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
        />
        <input type="text" placeholder="Reward name..." value={name} onChange={(e) => setName(e.target.value)} />
        <input
          type="number"
          className="pts-input"
          placeholder="cost"
          min={1}
          max={9999}
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        <button type="submit" className="btn btn-sm btn-purple">
          Add
        </button>
      </form>
      <div className="section-label">Current Rewards</div>
      {state.rewards.length === 0 ? (
        <div style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 700, padding: '12px 0' }}>
          No rewards added yet
        </div>
      ) : (
        state.rewards.map((r) =>
          editingId === r.id ? (
            <form
              className="input-row"
              key={r.id}
              onSubmit={(e) => { e.preventDefault(); saveEdit(r.id); }}
            >
              <input
                type="text"
                className="emoji-input"
                maxLength={2}
                value={editReward.emoji}
                onChange={(e) => setEditReward({ ...editReward, emoji: e.target.value })}
              />
              <input
                type="text"
                value={editReward.name}
                onChange={(e) => setEditReward({ ...editReward, name: e.target.value })}
              />
              <input
                type="number"
                className="pts-input"
                min={1}
                max={9999}
                value={editReward.cost}
                onChange={(e) => setEditReward({ ...editReward, cost: e.target.value })}
              />
              <button type="submit" className="btn btn-sm btn-purple" title="Save">
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button type="button" className="btn btn-sm btn-pink" title="Cancel" onClick={() => setEditingId(null)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </form>
          ) : (
            <div className="parent-item" key={r.id}>
              <div className="parent-item-emoji">{r.emoji}</div>
              <div className="parent-item-info">
                <div className="parent-item-name">{r.name}</div>
                <div className="parent-item-pts"><FontAwesomeIcon icon={faStar} /> {r.cost} pts</div>
              </div>
              <button className="btn btn-sm btn-purple" title="Edit" onClick={() => startEdit(r)}>
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button className="btn btn-sm btn-pink" onClick={() => removeReward(r.id)}>
                Remove
              </button>
            </div>
          )
        )
      )}
    </div>
  );
}
