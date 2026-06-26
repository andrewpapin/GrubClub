import { TimezonePanel } from './TimezonePanel';
import { SecurityPanel } from './SecurityPanel';
import { SyncPanel } from './SyncPanel';
import { DangerZonePanel } from './DangerZonePanel';

export function SettingsPanel() {
  return (
    <div>
      <TimezonePanel />
      <SecurityPanel />
      <SyncPanel />
      <DangerZonePanel />
    </div>
  );
}
