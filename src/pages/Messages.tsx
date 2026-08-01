import { type FC, useState, useRef, useMemo, useEffect } from 'react';
import { MessageCircle, Send, Search, Phone, ChevronRight } from 'lucide-react';
import PatientAvatar from '../components/PatientAvatar';
import ChatBubbleAvatar from '../components/ChatBubbleAvatar';
import WeChatChatRow from '../components/WeChatChatRow';
import { useWeChatChatReveal } from '../hooks/useWeChatChatReveal';
import {
  formatChatDisplayName,
  getChatBubbleClasses,
  getChatSenderLabelClass,
  isOutgoingChatMessage,
} from '../utils/chatBubbleStyles';
import { useAuth } from '../auth/AuthContext';
import { getVisiblePatientIds } from '../auth/permissions';
import { useCollaborationStore } from '../store/collaborationStore';
import { type ChatMessage } from '../data/chatMessages';
import { getDemoNow, getDemoTimeString, getDemoTimestamp } from '../utils/demoClock';
import { countUnreadForPatient, getLatestUnreadPreview } from '../utils/hubNotifications';
import { getHubNurseSender } from '../utils/chatSenders';

const PATIENTS_LIST = [
  { id: 1, name: 'Cheung Wai Man', lastMsg: 'He walked 1,200 steps today!', lastTime: '06/22 16:30' },
  { id: 2, name: 'Wong Chi Ming', lastMsg: 'Outcome prediction: 6-month exacerbation risk...', lastTime: '06/24 08:00' },
  { id: 3, name: 'Lam Ka Chun', lastMsg: 'Feeling 80% back to normal. Thank you!', lastTime: '06/20 14:00' },
  { id: 4, name: 'Lau Suk Yee', lastMsg: 'AMTS 9/10 — confusion fully resolved.', lastTime: '06/20 09:30' },
  { id: 5, name: 'Ho Tai Wai', lastMsg: 'Wound healing well, erythema down to 12cm.', lastTime: '06/20 08:00' },
  { id: 6, name: 'Ng Siu Wan', lastMsg: 'INR 2.1 therapeutic, leg swelling improving.', lastTime: '06/20 08:00' },
  { id: 7, name: 'Chan Tai Ming', lastMsg: 'HaH Day 1 intake complete. Family self-monitoring reinforced.', lastTime: '09:45' },
  { id: 8, name: 'Chow Kwok Fai', lastMsg: 'PCI site clean. Cardiac rehab Day 1 tolerated.', lastTime: '07/03 10:30' },
  { id: 9, name: 'Lam Siu Wan', lastMsg: 'SpO₂ 92% on 2L O₂. Nebulizer technique reviewed.', lastTime: '07/04 09:15' },
  { id: 10, name: 'Cheung Siu Ming', lastMsg: 'NIHSS 4 stable. PT gait training progressing.', lastTime: '07/06 11:00' },
  { id: 11, name: 'Wong Lai Chun', lastMsg: 'Drain output decreasing. Wound granulation noted.', lastTime: '07/02 14:20' },
  { id: 12, name: 'Fok Wai Keung', lastMsg: 'Weight 68kg stable. Net negative fluid balance.', lastTime: '07/05 08:45' },
  { id: 13, name: 'Lau Wai Yin', lastMsg: 'SMBG 6-10 on basal-bolus. No hypoglycaemia.', lastTime: '07/05 16:30' },
  { id: 14, name: 'Tsang Kwok Hung', lastMsg: 'K+ 4.8 after diet adjustment. ESA injection done.', lastTime: '07/07 09:00' },
  { id: 15, name: 'Mak Ka Ming', lastMsg: 'CPAP compliance 6.2h/night. BP 138/86.', lastTime: '07/01 10:15' },
  { id: 16, name: 'Fung Kam Tong', lastMsg: 'PWB gait with walker 15m. Pain NRS 2.', lastTime: '07/08 11:30' },
  { id: 17, name: 'Chan Yuk Lin', lastMsg: 'Afebrile. Completing Amox-clav course.', lastTime: '07/03 09:20' },
  { id: 18, name: 'Zhang Jianguo', lastMsg: 'PDD5 wound check: all 3 ports healing well. VTE: negative.', lastTime: 'Day 5 09:30' },
];

const roleNames: Record<string, string> = {
  doctor: 'Doctor', nurse: 'Nurse', caseManager: 'Case Mgr', family: 'Family', ai: 'AI', system: 'System',
};

const Messages: FC = () => {
  const { user } = useAuth();
  const messagesByPatient = useCollaborationStore(s => s.messagesByPatient);
  const readUpToByPatient = useCollaborationStore(s => s.readUpToByPatient);
  const appendMessage = useCollaborationStore(s => s.appendMessage);
  const markPatientMessagesRead = useCollaborationStore(s => s.markPatientMessagesRead);
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const patientsList = useMemo(() => PATIENTS_LIST.map(p => {
    const thread = messagesByPatient[p.id] || [];
    const last = thread[thread.length - 1];
    if (!last) return p;
    return {
      ...p,
      lastMsg: last.text.length > 72 ? `${last.text.slice(0, 72)}...` : last.text,
      lastTime: last.time,
    };
  }), [messagesByPatient]);

  const scrollToBottom = () => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const visibleIds = user ? getVisiblePatientIds(user.role, user.account) : null;
  const visiblePatients = visibleIds ? patientsList.filter(p => visibleIds.includes(p.id)) : patientsList;
  const filtered = visiblePatients.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const currentMessages = selectedPid ? (messagesByPatient[selectedPid] || []) : [];
  const threadKey = selectedPid != null ? `${selectedPid}` : null;
  const visibleCount = useWeChatChatReveal(currentMessages.length, threadKey);

  useEffect(() => {
    if (selectedPid != null) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount, selectedPid]);

  const handleSelectPatient = (patientId: number) => {
    setSelectedPid(patientId);
    markPatientMessagesRead(patientId);
  };

  const handleSend = () => {
    if (!inputText.trim() || !selectedPid) return;
    const { from, senderName } = getHubNurseSender(selectedPid, currentMessages);
    const newMsg: ChatMessage = {
      id: getDemoTimestamp(), from, senderName,
      text: inputText.trim(), time: getDemoTimeString(),
      patientId: selectedPid,
    };
    appendMessage(selectedPid, newMsg);
    setInputText('');
    setTimeout(scrollToBottom, 50);
  };

  return (
    <div className="flex flex-1 min-h-0">
      {/* Left: Patient List */}
      <aside className="w-72 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-teal-600" /> Messages</h2>
          <div className="mt-2 flex items-center gap-2 bg-warm-50 rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="flex-1 text-xs bg-transparent outline-none text-slate-700 placeholder-slate-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(p => {
            const thread = messagesByPatient[p.id] || [];
            const readUpTo = readUpToByPatient[p.id] ?? 0;
            const unreadCount = countUnreadForPatient(thread, readUpTo);
            const unreadPreview = getLatestUnreadPreview(thread, readUpTo);
            return (
            <div key={p.id} onClick={() => handleSelectPatient(p.id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-slate-50 hover:bg-gold-100/30 transition-colors ${selectedPid === p.id ? 'bg-gold-100 border-l-2 border-l-gold-600' : ''}`}>
              <div className="relative flex-shrink-0">
                <PatientAvatar patientId={p.id} size={36} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -left-1 min-w-[16px] h-[16px] rounded-full bg-red-500 text-white text-[7px] font-bold flex items-center justify-center px-0.5 animate-pulse shadow-sm shadow-red-500/40 z-10 border border-white">{unreadCount}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{p.name}</span>
                  <span className="text-[9px] text-slate-400">{p.lastTime}</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">{unreadPreview ?? p.lastMsg}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            </div>
            );
          })}
        </div>
      </aside>

      {/* Right: Chat View */}
      <main className="flex-1 flex flex-col min-w-0 bg-warm-50">
        {selectedPid ? (
          <>
            {/* Chat Header */}
            <div className="bg-white px-5 py-3 border-b border-slate-200 flex items-center gap-3 flex-shrink-0 sticky top-0 z-10">
              <PatientAvatar patientId={selectedPid} size={36} />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{patientsList.find(p => p.id === selectedPid)?.name}</p>
                <p className="text-[9px] text-emerald-600">Care Team Chat · {currentMessages.length} messages</p>
              </div>
              <button className="w-8 h-8 rounded-lg hover:bg-warm-100 flex items-center justify-center"><Phone className="w-4 h-4 text-teal-600" /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col gap-3 w-full">
              {currentMessages.map((msg, i) => {
                if (i >= visibleCount) return null;
                const isMe = isOutgoingChatMessage(msg.from, 'hub');
                return (
                  <WeChatChatRow
                    key={msg.id}
                    isMe={isMe}
                    avatar={<ChatBubbleAvatar msg={msg} size={28} />}
                    header={
                      <div className={`flex items-center gap-1.5 mb-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-[9px] font-medium ${getChatSenderLabelClass(msg.from)}`}>
                          {formatChatDisplayName(msg.senderName)}{' '}
                          <span className="text-slate-300">· {roleNames[msg.from]}</span>
                        </span>
                        <span className="text-[8px] text-slate-300">{msg.time}</span>
                      </div>
                    }
                  >
                    <div className={getChatBubbleClasses(msg.from, { isMe, textClass: 'text-[11px]' })}>
                      {msg.text}
                    </div>
                  </WeChatChatRow>
                );
              })}
              <div ref={chatEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="bg-white px-5 py-3 border-t border-slate-200 flex items-center gap-2 flex-shrink-0">
              <input value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..." className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-teal-400" />
              <button onClick={handleSend} className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center hover:bg-teal-700 transition-colors">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center"><MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" /><p className="text-sm">选择一个病人查看消息</p><p className="text-xs mt-1">消息在桌面端与家属手机端实时同步</p></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
