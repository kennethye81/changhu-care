import { useState, type FC } from 'react';
import DesktopCommandCenter from './CommandCenter';
import MobileFamilyApp from './FamilyApp';
import MobileElitesApp from './ElitesApp';
import { useView } from '../auth/ViewContext';

type MobileTab = 'home' | 'vitals' | 'care' | 'chat';
type CareSubTab = 'plan' | 'meds' | 'devices' | 'logs';
type ElitesTab = 'today' | 'candidate' | 'patients' | 'chat';

const CommandCenterPage: FC = () => {
  const { view } = useView();
  const [mobileTab, setMobileTab] = useState<MobileTab>('home');
  const [careSub, setCareSub] = useState<CareSubTab>('plan');
  const [elitesTab, setElitesTab] = useState<ElitesTab>('today');

  if (view === 'mobile') {
    return <MobileFamilyApp tab={mobileTab} setTab={setMobileTab} careSub={careSub} setCareSub={setCareSub} />;
  }
  if (view === 'elites') {
    return <MobileElitesApp tab={elitesTab} setTab={setElitesTab} />;
  }
  return <DesktopCommandCenter />;
};

export default CommandCenterPage;
