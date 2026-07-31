import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileFamilyApp from './FamilyApp';

type MobileTab = 'home' | 'vitals' | 'care' | 'chat';
type CareSubTab = 'plan' | 'meds' | 'devices' | 'logs';

const FamilyStandalone: FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<MobileTab>('home');
  const [careSub, setCareSub] = useState<CareSubTab>('plan');
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center relative">
      <button onClick={() => navigate('/')} className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-white/80 backdrop-blur border border-slate-200 flex items-center justify-center shadow-sm hover:bg-white hover:shadow-md transition-all" title="Back to Home">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A5C6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      </button>
      <MobileFamilyApp tab={tab} setTab={setTab} careSub={careSub} setCareSub={setCareSub} />
    </div>
  );
};

export default FamilyStandalone;
