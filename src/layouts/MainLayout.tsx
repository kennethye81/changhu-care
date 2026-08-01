import { useState, type FC, type ReactNode, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { usePatientStore } from '../store/patientStore';
import { useCollaborationStore } from '../store/collaborationStore';
import { countPendingRegistrations, countUnreadMessages } from '../utils/hubNotifications';
import { getDemoNow } from '../utils/demoClock';
import { getVisibleModules } from '../auth/permissions';
import {
  Activity, Bell, Users, Heart, Menu,
  MessageCircle, LogOut, Building2, FileText,
  Search, PanelLeftClose, PanelLeftOpen,
  Boxes, CreditCard, ChevronDown, CloudSun, CalendarDays, Clock,
} from 'lucide-react';
import IHomeCareHubLogoIcon from '../components/IHomeCareHubLogoIcon';

type NavItem = {
  key: string;
  label: string;
  icon: FC<{ className?: string }>;
  route: string;
  badge?: number;
};

const ALL_NAV: NavItem[] = [
  { key: 'command_center', label: '客户面板', icon: Activity, route: '/command-center' },
  { key: 'patient_registration', label: '客户登记', icon: FileText, route: '/pending-registration' },
  { key: 'patient_records', label: '客户列表', icon: Users, route: '/patient-records' },
  { key: 'care_elites', label: '照护团队', icon: Heart, route: '/care-elites' },
  { key: 'inventory', label: '设备管理', icon: Boxes, route: '/iot-devices' },
  { key: 'medical_institution', label: '服务机构', icon: Building2, route: '/medical-institution' },
  { key: 'finance', label: '财务管理', icon: CreditCard, route: '/billing' },
  { key: 'messages', label: '消息中心', icon: MessageCircle, route: '/messages' },
];

// Available roles for switching — 仅系统用户
const ROLES = [
  { id: 'admin', label: '系统管理员', subtitle: 'Administrator', role: 'admin' },
  { id: 'jiang.shan', label: '姜珊', subtitle: '护士经理', role: 'nurse' },
  { id: 'case.mgr', label: '个案经理', subtitle: '待分配', role: 'case_manager' },
];

const AVATARS: Record<string, string> = {
  'chan.chi.keung': 'KW', 'peter.ho': 'PH', 'sarah.leung': 'SL', admin: 'AD', finance: 'MC',
  'grace.tang': 'GT', 'tony.lam': 'TL', 'anna.leung': 'AL',
};

const AVATAR_COLORS: Record<string, string> = {
  'chan.chi.keung': 'from-[#6f5b44] to-[#3a2e28]',
  'peter.ho': 'from-[#0B3550] to-[#03304B]',
  'sarah.leung': 'from-emerald-600 to-emerald-800',
  admin: 'from-[#3a2e28] to-[#241914]',
  finance: 'from-slate-500 to-slate-700',
  'grace.tang': 'from-[#4DCEFF] to-[#FEB903]',
  'tony.lam': 'from-[#A5785A] to-[#0B3550]',
  'anna.leung': 'from-[#E1FCFF] to-[#0B3550]',
};

const MainLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, logout, switchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesByPatient = useCollaborationStore(s => s.messagesByPatient);
  const readUpToByPatient = useCollaborationStore(s => s.readUpToByPatient);
  const unresolvedAlerts = usePatientStore(s => s.alerts.filter(a => !a.resolved).length);
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [clock, setClock] = useState(getDemoNow);
  useEffect(() => { const t = setInterval(() => setClock(getDemoNow()), 30000); return () => clearInterval(t); }, []);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleSwitcher(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  const visibleModules = getVisibleModules(user.role);
  const filteredNav = ALL_NAV.filter(n => visibleModules.includes(n.key));

  const currentPath = location.pathname;

  const quickSearchPatients = [
    '冯存富',
    'Chan Tai Ming',
    'Chow Kwok Fai', 'Lam Siu Wan', 'Cheung Siu Ming',
    'Wong Lai Chun', 'Fok Wai Keung', 'Lau Wai Yin',
    'Tsang Kwok Hung', 'Mak Ka Ming', 'Fung Kam Tong',
    'Chan Yuk Lin', 'Zhang Jianguo',
  ];

  // Critical patients count from live store alerts
  const alertCount = unresolvedAlerts;
  const unreadMessages = countUnreadMessages(messagesByPatient, readUpToByPatient);
  const pendingReferrals = countPendingRegistrations();

  const sidebarW = collapsed ? 'w-14' : 'w-52';

  const handleRoleSwitch = (accountId: string) => {
    setShowRoleSwitcher(false);
    switchUser(accountId);
    navigate('/command-center');
  };

  return (
    <div className="hub-shell bg-warm-100 flex flex-col font-body">
      {/* === Top Header Bar — light surface, distinct from dark sidebar === */}
      <header className="bg-white border-b border-slate-200/80 flex-shrink-0 z-50 sticky top-0 shadow-sm">
        <div className="flex items-center justify-between px-4 h-11">
          {/* Left: Logo + Version */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200/80" title="菜单">
              <Menu className="w-4 h-4 text-slate-600" />
            </button>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm bg-gradient-to-br from-[#0B3550] to-[#03304B] cursor-pointer" onClick={() => navigate('/command-center')}>
              <IHomeCareHubLogoIcon size={18} />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-slate-800 font-display">YDiCare 易护</span>
              <span className="text-[9px] text-slate-400 ml-1.5 font-medium">YDiCare 易护</span>
            </div>
          </div>

          {/* Center: Search + Alerts */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Bar — hidden on mobile */}
            <div className="relative hidden md:block">
              <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-56 border border-slate-200/80">
                <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={e => { setPatientSearch(e.target.value); setShowPatientSearch(true); }}
                  onFocus={() => setShowPatientSearch(true)}
                  placeholder="搜索病人..."
                  className="flex-1 text-xs bg-transparent outline-none text-slate-700 placeholder-slate-400 ml-2"
                />
              </div>
              {showPatientSearch && patientSearch && (
                <div className="absolute top-full mt-1 left-0 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                  <div className="max-h-48 overflow-y-auto">
                    {quickSearchPatients.filter(p => p.toLowerCase().includes(patientSearch.toLowerCase())).map(name => (
                      <button key={name} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-[#FFFFFF] transition-colors border-b border-slate-50 last:border-0">{name}</button>
                    ))}
                    {quickSearchPatients.filter(p => p.toLowerCase().includes(patientSearch.toLowerCase())).length === 0 && (
                      <p className="px-3 py-2 text-xs text-slate-400">未找到病人</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Alert Bell */}
            <button className="relative w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors" title={`${alertCount} patient alerts`}>
              <Bell className={`w-4 h-4 ${alertCount > 0 ? 'text-[#0B3550] alert-blink' : 'text-slate-400'}`} />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center shadow-sm animate-pulse">{alertCount}</span>
              )}
            </button>

            {/* Unread Messages */}
            <button className="relative w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors" onClick={() => navigate('/messages')} title={`${unreadMessages} unread messages`}>
              <MessageCircle className={`w-4 h-4 ${unreadMessages > 0 ? 'text-[#03304B] alert-blink' : 'text-slate-400'}`} />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0B3550] text-white text-[8px] font-extrabold rounded-full flex items-center justify-center shadow-sm animate-pulse">{unreadMessages}</span>
              )}
            </button>

            {/* Pending Referrals */}
            <button className="relative w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors" onClick={() => navigate('/pending-registration')} title={`${pendingReferrals} pending registrations`}>
              <FileText className={`w-4 h-4 ${pendingReferrals > 0 ? 'text-amber-500 alert-blink' : 'text-slate-400'}`} />
              {pendingReferrals > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center shadow-sm animate-pulse">{pendingReferrals}</span>
              )}
            </button>
          </div>

          {/* Right: User + Role Switcher + Logout */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Date / Time / Weather */}
            <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-500 mr-1">
              <CalendarDays className="w-3 h-3" />
              <span>{clock.toLocaleDateString('en-HK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className="text-slate-300">|</span>
              <Clock className="w-3 h-3" />
              <span>{clock.toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-slate-300">|</span>
              <CloudSun className="w-3 h-3 text-amber-400" />
              <span>28°C</span>
            </div>

            {/* Role Switcher */}
            <div className="relative" ref={roleRef}>
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-600 transition-colors"
              >
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${AVATAR_COLORS[user.account] || 'from-blue-500 to-blue-700'} flex items-center justify-center text-white text-[8px] font-bold`}>
                  {AVATARS[user.account] || user.avatar}
                </div>
                <span className="hidden md:inline">{user.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {showRoleSwitcher && (
                <div className="absolute top-full mt-1 right-0 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                  <p className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase border-b border-slate-100">切换角色</p>
                  {ROLES.map(r => (
                    <button
                      key={r.id}
                      onClick={() => { setShowRoleSwitcher(false); handleRoleSwitch(r.id); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${user.account === r.id ? 'bg-[#FFFFFF] text-[#0B3550] font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${AVATAR_COLORS[r.id]} flex items-center justify-center text-white text-[8px] font-bold`}>{AVATARS[r.id]}</div>
                      <div className="text-left">
                        <p className="text-xs">{r.label}</p>
                        <p className="text-[9px] text-slate-400">{r.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="w-7 h-7 hover:bg-red-50 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
              title="退出登录"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* === Body: Sidebar + Content === */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop sidebar — deep gold, distinct from white header */}
        <aside className={`hidden lg:flex ${sidebarW} bg-gradient-to-b from-[#0B3550] to-[#00263F] border-r border-[#0a2a22] flex-shrink-0 flex-col transition-all duration-200 h-full shadow-sm`}>
          <div className="p-2 pt-3 space-y-0.5 flex-1 overflow-y-auto">
            {filteredNav.map(nav => {
              const Icon = nav.icon;
              const isActive = currentPath.startsWith(nav.route);
              return (
                <button
                  key={nav.key}
                  onClick={() => navigate(nav.route)}
                  title={collapsed ? nav.label : undefined}
                  className={`flex items-center w-full px-2.5 py-2 rounded-lg text-[11px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#FFFFFF] text-[#0B3550] font-semibold shadow-sm'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  } ${collapsed ? 'justify-center' : 'justify-start gap-2.5'}`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#0B3550]' : ''}`} />
                  {!collapsed && <span className="truncate">{nav.label}</span>}
                  {nav.badge && !collapsed && (
                    <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center flex-shrink-0">{nav.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
          {/* Collapse toggle — bottom of sidebar */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex-shrink-0 flex items-center w-full px-2.5 py-2 border-t border-white/10 hover:bg-white/10 text-white/50 hover:text-white/90 transition-all ${collapsed ? 'justify-center' : 'justify-start gap-2.5'}`}
            title={collapsed ? '展开' : '收起'}
          >
            {collapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <><PanelLeftClose className="w-3.5 h-3.5" /><span className="text-[10px] font-medium truncate">收起</span></>}
          </button>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-56 bg-gradient-to-b from-[#0B3550] to-[#00263F] shadow-2xl flex flex-col animate-slide-in">
              <div className="p-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-bold text-white font-display">YDiCare 易护</span>
                <button onClick={() => setSidebarOpen(false)} className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white text-xs">✕</button>
              </div>
              <div className="p-2 space-y-0.5 flex-1 overflow-y-auto">
                {filteredNav.map(nav => {
                  const Icon = nav.icon;
                  const isActive = currentPath.startsWith(nav.route);
                  return (
                    <button
                      key={nav.key}
                      onClick={() => { navigate(nav.route); setSidebarOpen(false); }}
                      className={`flex items-center w-full px-3 py-2.5 rounded-lg text-[11px] font-medium transition-all gap-2.5 ${
                        isActive
                          ? 'bg-[#FFFFFF] text-[#0B3550] font-semibold shadow-sm'
                          : 'text-white/75 hover:bg-white/10 hover:text-white'
                      }`}>
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#0B3550]' : ''}`} />
                      <span className="truncate">{nav.label}</span>
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 min-w-0 min-h-0 overflow-auto bg-warm-50 font-body flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
