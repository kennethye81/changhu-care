import type { FC } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

interface Props {
  uploading: boolean;
  uploadProgress: number;
  uploadStage: string;
  done: boolean;
  doneLabel: string;
  onSubmit: () => void;
  disabled?: boolean;
}

const EliteFormSubmitFooter: FC<Props> = ({
  uploading,
  uploadProgress,
  uploadStage,
  done,
  doneLabel,
  onSubmit,
  disabled = false,
}) => (
  <div className="px-4 pb-4 pt-2 border-t border-[#E1FCFF] bg-white flex-shrink-0">
    {done ? (
      <div className="flex items-center justify-center gap-2 text-emerald-600 py-2">
        <CheckCircle2 className="w-5 h-5" />
        <span className="text-xs font-bold">{doneLabel}</span>
      </div>
    ) : uploading ? (
      <div className="py-2 flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full border-4 border-[#EBF5F9] border-t-[#0B3550] animate-spin" />
        <p className="text-sm font-bold text-slate-700">{uploadProgress}%</p>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#4DCEFF] to-[#0B3550] h-2 rounded-full transition-all duration-200"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500">{uploadStage}</p>
      </div>
    ) : (
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className={`w-full text-white text-xs font-bold py-2.5 rounded-xl shadow-md shadow-[#E1FCFF] flex items-center justify-center gap-2 ${
          disabled
            ? 'bg-[#D4C4A8] cursor-not-allowed opacity-70'
            : 'bg-[#0B3550] hover:bg-[#FEB903]'
        }`}
      >
        <Send className="w-3.5 h-3.5" /> Submit
      </button>
    )}
  </div>
);

export default EliteFormSubmitFooter;
