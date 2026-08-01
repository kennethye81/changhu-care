import { useState, type FC, type FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Activity, Eye, EyeOff, Smartphone, Shield } from 'lucide-react';

const ROLE_ACCOUNTS: Record<string, string> = {
  doctor: 'chan.chi.keung',
  case_manager: 'peter.ho',
  nurse: 'jiang.shan',
  admin: 'admin',
  finance: 'finance',
};

const LoginPage: FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');

  const [institutionId, setInstitutionId] = useState('');
  const [account, setAccount] = useState(ROLE_ACCOUNTS[roleParam || ''] || '');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoLogging, setAutoLogging] = useState(!roleParam);
  const [typeInst, setTypeInst] = useState('');
  const [typeAcct, setTypeAcct] = useState('');
  const [typePwd, setTypePwd] = useState('');
  const [animStep, setAnimStep] = useState(0);

  // Auto-login as admin with typing animation
  useEffect(() => {
    if (!roleParam) {
      setAutoLogging(true);
      const inst = 'HK-INST-001';
      const acct = 'admin';
      const pwd = '123456';
      let i = 0;
      const t1 = setInterval(() => {
        if (i < inst.length) { setTypeInst(inst.slice(0, i + 1)); i++; }
        else { clearInterval(t1); setAnimStep(1); i = 0;
          const t2 = setInterval(() => {
            if (i < acct.length) { setTypeAcct(acct.slice(0, i + 1)); i++; }
            else { clearInterval(t2); setAnimStep(2); i = 0;
              const t3 = setInterval(() => {
                if (i < pwd.length) { setTypePwd('●'.repeat(i + 1)); i++; }
                else { clearInterval(t3); setAnimStep(3);
                  setTimeout(() => {
                    const result = login('admin', '123456', 'HK-INST-001');
                    if (result.success) navigate('/command-center', { replace: true });
                    else setAutoLogging(false);
                  }, 400);
                }
              }, 100);
            }
          }, 100);
        }
      }, 80);
      return () => { clearInterval(t1); };
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/command-center', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(account, password, institutionId);
      if (result.success) {
        navigate('/command-center', { replace: true });
      } else {
        setError(result.error || '登录失败');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-warm-900 flex items-center justify-center">
      {autoLogging && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-white font-bold text-lg">iHome<span className="text-blue-400">长护险平台</span></p>
          <div className="w-72 space-y-3">
            <div className="bg-white/10 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <span className="text-slate-400 text-xs w-16">机构</span>
              <span className="text-white text-xs font-mono">{typeInst}<span className="animate-pulse text-blue-400">|</span></span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <span className="text-slate-400 text-xs w-16">账号</span>
              <span className="text-white text-xs font-mono">{typeAcct}{animStep === 1 ? <span className="animate-pulse text-blue-400">|</span> : ''}</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <span className="text-slate-400 text-xs w-16">密码</span>
              <span className="text-white text-xs font-mono">{typePwd}{animStep === 2 ? <span className="animate-pulse text-blue-400">|</span> : ''}</span>
            </div>
            {animStep === 3 && (
              <button className="w-full bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold py-2.5 rounded-lg animate-pulse">
                Signing in...
              </button>
            )}
            {animStep < 3 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            )}
          </div>
        </div>
      )}
      <div className={`bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 w-[400px] ${autoLogging ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mx-auto mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">iHome<span className="text-teal-600">长护险平台</span></h1>
          <p className="text-sm text-slate-500 mt-1">Home Medical Care SaaS · Clinical Command Center</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">机构编号</label>
              <input
                type="text"
                value={institutionId}
                onChange={e => setInstitutionId(e.target.value)}
                placeholder="HK-INST-001"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">账号</label>
              <input
                type="text"
                value={account}
                onChange={e => setAccount(e.target.value)}
                placeholder="输入账号"
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">密码</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="输入密码"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all pr-10"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">验证码</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={captcha}
                  onChange={e => setCaptcha(e.target.value)}
                  placeholder="验证码"
                  maxLength={4}
                  className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
                <div className="w-24 h-[42px] bg-slate-200 rounded-xl flex items-center justify-center text-sm font-bold text-slate-500 select-none cursor-pointer">
                  AB3K
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded" />
                Remember me
              </label>
              <button type="button" className="text-xs text-teal-600 font-medium hover:underline">忘记密码</button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gold-600 hover:bg-gold-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-xl transition-colors shadow-md shadow-blue-200"
            >
              {loading ? '验证中...' : '登录'}
            </button>
          </form>

          {/* Demo quick login */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 text-center mb-3">Demo Quick Login (password: 123456)</p>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Admin', account: 'admin' },
                { label: 'Physician', account: 'doctor' },
                { label: 'Nursing Dir.', account: 'nurse_dir' },
                { label: 'Case Manager', account: 'case_mgr' },
                { label: 'Finance', account: 'finance' },
              ].map(d => (
                <button
                  key={d.account}
                  onClick={() => { setInstitutionId('HK-INST-001'); setAccount(d.account); setPassword('123456'); setCaptcha('AB3K'); }}
                  className="text-[10px] py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-warm-100 hover:border-blue-300 transition-all font-medium"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile App Access */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 text-center mb-3">移动端应用（无需登录）)</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/family')}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-200 hover:shadow-lg transition-all"
              >
                <Smartphone className="w-3.5 h-3.5" /> iHomeCare Family
              </button>
              <button
                onClick={() => navigate('/elites')}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold shadow-md shadow-emerald-200 hover:shadow-lg transition-all"
              >
                <Shield className="w-3.5 h-3.5" /> iHomeCare for Elites
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-6">iHomeCare v1.36 · Hong Kong Medical SaaS</p>
      </div>
    </div>
  );
};

export default LoginPage;
