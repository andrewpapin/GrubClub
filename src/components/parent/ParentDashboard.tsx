import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faCircleCheck,
  faListCheck,
  faGear,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

import { useGravy } from '../../state/GravyContext';
import { OverviewPanel } from './OverviewPanel';
import { ApprovalsPanel } from './ApprovalsPanel';
import { ManagePanel, type ManageSub } from './ManagePanel';
import { SettingsPanel, type SettingsSub } from './SettingsPanel';

type Top = 'overview' | 'approvals' | 'manage' | 'settings';

const NAV: { id: Top; label: string; icon: IconDefinition }[] = [
  { id: 'overview', label: 'Overview', icon: faHouse },
  { id: 'approvals', label: 'Approvals', icon: faCircleCheck },
  { id: 'manage', label: 'Manage', icon: faListCheck },
  { id: 'settings', label: 'Settings', icon: faGear },
];

const MANAGE_TITLES: Record<ManageSub, string> = {
  menu: 'Manage',
  goals: 'Goals',
  store: 'Store',
  badges: 'Badges',
};

const SETTINGS_TITLES: Record<SettingsSub, string> = {
  menu: 'Settings',
  points: 'Points & Rules',
  security: 'Security & PIN',
  sync: 'Cloud Sync',
  danger: 'Danger Zone',
};

interface ParentDashboardProps {
  onHeaderChange: (header: { title: string; onBack?: () => void }) => void;
}

export function ParentDashboard({ onHeaderChange }: ParentDashboardProps) {
  const { state } = useGravy();
  const [top, setTop] = useState<Top>('overview');
  const [manageSub, setManageSub] = useState<ManageSub>('menu');
  const [settingsSub, setSettingsSub] = useState<SettingsSub>('menu');
  const pendingCount = state.pendingRewards.length;

  const goTo = (next: Top) => {
    setTop(next);
    setManageSub('menu');
    setSettingsSub('menu');
  };

  useEffect(() => {
    if (top === 'manage' && manageSub !== 'menu') {
      onHeaderChange({ title: MANAGE_TITLES[manageSub], onBack: () => setManageSub('menu') });
    } else if (top === 'settings' && settingsSub !== 'menu') {
      onHeaderChange({ title: SETTINGS_TITLES[settingsSub], onBack: () => setSettingsSub('menu') });
    } else {
      const navItem = NAV.find((n) => n.id === top);
      onHeaderChange({ title: navItem ? navItem.label : 'Parent Dashboard' });
    }
  }, [top, manageSub, settingsSub, onHeaderChange]);

  return (
    <>
      <div className="parent-tabs" role="tablist" aria-label="Parent dashboard">
        {NAV.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={top === t.id}
            className={`parent-tab ${top === t.id ? 'active' : ''} ${t.id === 'approvals' ? 'nav-badge' : ''}`}
            data-count={t.id === 'approvals' ? pendingCount : undefined}
            onClick={() => goTo(t.id)}
          >
            <FontAwesomeIcon icon={t.icon} /> {t.label}
          </button>
        ))}
      </div>
      <div>
        {top === 'overview' && (
          <OverviewPanel
            onReviewApprovals={() => goTo('approvals')}
            onOpenManage={(sub) => { setTop('manage'); setManageSub(sub); }}
            onOpenSettings={() => goTo('settings')}
          />
        )}
        {top === 'approvals' && <ApprovalsPanel />}
        {top === 'manage' && <ManagePanel sub={manageSub} onNavigate={setManageSub} />}
        {top === 'settings' && <SettingsPanel sub={settingsSub} onNavigate={setSettingsSub} />}
      </div>
    </>
  );
}
