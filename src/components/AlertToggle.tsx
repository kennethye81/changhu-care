import { type FC } from 'react';
import { usePatientStore } from '../store/patientStore';

const AlertToggle: FC = () => {
  const p7AlertActive = usePatientStore(s => s.p7AlertActive);
  const triggerP7Alert = usePatientStore(s => s.triggerP7Alert);
  const deactivateP7Alert = usePatientStore(s => s.deactivateP7Alert);

  return (
    <button
      onClick={() => p7AlertActive ? deactivateP7Alert() : triggerP7Alert()}
      className={`fixed bottom-4 right-4 z-[2000] px-2.5 py-1 rounded-full text-[9px] font-semibold shadow-md backdrop-blur-md transition-all duration-300 border ${
        p7AlertActive
          ? 'bg-red-500/15 border-red-400/50 text-red-500 hover:bg-red-500/25'
          : 'bg-white/50 border-slate-300/50 text-slate-400 hover:bg-white/70 hover:border-teal-400/50 hover:text-teal-500'
      }`}
      title={p7AlertActive ? 'Deactivate NEWS escalation' : 'Activate NEWS escalation (P7 demo)'}
    >
      {p7AlertActive ? '✕ NEWS' : '⚡ NEWS'}
    </button>
  );
};

export default AlertToggle;
