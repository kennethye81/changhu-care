import { type FC } from 'react';
import { usePatientStore } from '../store/patientStore';

const AlertToggle: FC = () => {
  const alertActive = usePatientStore(s => s.alertActive);
  const triggerAlert = usePatientStore(s => s.triggerAlert);
  const deactivateAlert = usePatientStore(s => s.deactivateAlert);

  return (
    <button
      onClick={() => alertActive ? deactivateAlert() : triggerAlert()}
      className={`fixed bottom-4 right-4 z-[2000] px-2.5 py-1 rounded-full text-[9px] font-semibold shadow-md backdrop-blur-md transition-all duration-300 border ${
        alertActive
          ? 'bg-red-500/15 border-red-400/50 text-red-500 hover:bg-red-500/25'
          : 'bg-white/50 border-slate-300/50 text-slate-400 hover:bg-white/70 hover:border-teal-400/50 hover:text-teal-500'
      }`}
      title={alertActive ? 'Deactivate NEWS escalation' : 'Activate NEWS escalation (alert demo)'}
    >
      {alertActive ? '✕ NEWS' : '⚡ NEWS'}
    </button>
  );
};

export default AlertToggle;
