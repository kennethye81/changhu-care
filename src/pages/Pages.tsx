import { type FC, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { type Role } from '../auth/types';
import {
  Users, ClipboardList, Smartphone, FileText, Pill, Activity,
  AlertTriangle, Calendar, Heart, MessageCircle, BookOpen,
  Search, Filter, Plus, Download, ChevronRight,
  Clock, Award, Star, X, MapPin, Briefcase, Mail, Phone,
  Boxes, Package, CreditCard,
} from 'lucide-react';
import { CARE_TEAM, type TeamMember } from '../data/careTeam';
import type { TwoWeekCarePlan } from '../data/carePlans';
import { DEMO_CARE_PLAN_DATE } from '../utils/carePlanSync';
import { buildFollowupTasks } from '../utils/hubFollowupTasks';
import PatientAvatar from '../components/PatientAvatar';
import { usePatientStore, type PatientSummary } from '../store/patientStore';
import { useCollaborationStore } from '../store/collaborationStore';
import { buildFinanceInvoices, summarizeFinance } from '../utils/hubFinance';
import { INVENTORY_CONSUMABLES, INVENTORY_DEVICE_CATALOG } from '../data/inventoryCatalog';
import { buildInventoryDevices, countLowStock, countUniqueSuppliers } from '../utils/hubInventory';
import {
  DISCHARGE_SUMMARIES, LAB_REPORTS, PROGRESS_NOTES, REFERRAL_LETTERS,
  type ClinicalDoc,
} from '../data/hubClinicalDocs';
import {
  buildPidToCareWorker, buildPidToName, buildPidToNurse, buildPidToTherapist,
} from '../utils/hubStaffAssignments';
import { HUB_MESSAGES } from '../data/hubMessages';
import { FAMILY } from '../theme/familyTokens';

/* ─────────────────────── Page Shell ──────────────────────── */

export const PageHeader: FC<{ title: string; icon: FC<{ className?: string }>; subtitle: string; action?: React.ReactNode }> = ({ title, icon: Icon, subtitle, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center border" style={{ borderColor: FAMILY.border }}>
        <Icon className="w-5 h-5 text-gold-700" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-warm-900 font-display">{title}</h2>
        <p className="text-sm text-slate-500 font-body">{subtitle}</p>
      </div>
    </div>
    {action}
  </div>
);

/* ─────────────────────── Patient Records ────────────────── */

const NURSE_MAP: Record<number, string> = {
  1: 'Sarah Leung', 2: 'Peter Ho', 3: '—', 4: 'Sarah Leung', 5: 'Peter Ho', 6: '—', 7: 'Jenny Tam',
};

function statusFromSummary(p: PatientSummary): string {
  if (p.newsTier === 'high') return '预警';
  if (p.newsTier === 'medium') return '关注';
  return '稳定';
}
function genderCN(g: 'M'|'F'): string { return g === 'M' ? '男' : '女'; }
function disabilityLevel(score?: number): string {
  if (score == null) return '—';
  if (score <= 40) return '重度';
  if (score <= 60) return '中度';
  return '轻度';
}
function bradenRisk(score?: number): string {
  if (score == null) return '—';
  if (score <= 12) return '高风险';
  if (score <= 16) return '中风险';
  return '低风险';
}
function fallRiskLevel(score?: number): string {
  if (score == null) return '—';
  if (score >= 45) return '高风险';
  if (score >= 25) return '中风险';
  return '低风险';
}

const staffAvatar: Record<string, string> = {
  '林晓东': '/avatars/lin-xiaodong.png',
  '姜珊': '/avatars/jiang-shan.png',
  '周明': '/avatars/zhou-ming.png',
  '陈雅文': '/avatars/chen-yawen.png',
  '汤菊玲': '/avatars/tang-juling.png',
  '张丽华': '/avatars/zhang-lihua.png',
  '刘敏': '/avatars/liu-min.png',
  '陈军': '/avatars/chen-jun.png',
  '赵静': '/avatars/zhao-jing.png',
  '王秀英': '/avatars/wang-xiuying.png',
};

import { PATIENTS_FULL } from '../data/patients';

export const PatientRecords: FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const patientsSummary = usePatientStore(s => s.patientsSummary);
  const enriched = patientsSummary.map(p => {
    const full = PATIENTS_FULL.find(f => f.id === p.id);
    return {
      ...p,
      status: statusFromSummary(p),
      carePlan: full?.carePlan,
      barthelScore: full?.barthel?.score,
      bradenScore: full?.braden?.score,
      fallRiskScore: full?.fallRisk?.score,
    };
  });
  const filtered = enriched
    .filter(p => !search || p.name.includes(search) || p.diagnosis.includes(search))
    .sort((a, b) => {
      const order: Record<string, number> = { '预警': 0, '关注': 1, '稳定': 2 };
      return (order[a.status] ?? 3) - (order[b.status] ?? 3);
    });
  const stats = { total: enriched.length, critical: enriched.filter(p => p.status === '预警').length, attention: enriched.filter(p => p.status === '关注').length, stable: enriched.filter(p => p.status === '稳定').length };

  return (
    <div className="p-6">
      <PageHeader title="客户列表" icon={Users} subtitle={`${stats.total} 位在管客户 · 按风险等级排序`}
        action={<button className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-600 hover:bg-gold-700 text-white text-xs font-semibold rounded"><Plus className="w-3.5 h-3.5" /> 添加客户</button>}
      />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{ label: '总计', value: stats.total, color: 'text-teal-600', bg: 'bg-teal-50' }, { label: '预警', value: stats.critical, color: 'text-red-600', bg: 'bg-red-50' }, { label: '关注', value: stats.attention, color: 'text-amber-600', bg: 'bg-amber-50' }, { label: '稳定', value: stats.stable, color: 'text-emerald-600', bg: 'bg-emerald-50' }].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl p-4`}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="glass-card rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="按姓名或诊断搜索..." className="flex-1 text-xs outline-none" />
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-warm-100 rounded-lg hover:bg-warm-200"><Filter className="w-3 h-3" /> 筛选</button>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-xs table-fixed">
          <thead className="bg-warm-50">
            <tr>
              <th className="text-left px-2 py-2 font-semibold text-slate-600 w-[36px]"></th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">客户编号</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">姓名</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">性别</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">年龄</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">临床诊断</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">失能等级</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">压疮风险</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">跌倒风险</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">个案经理</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">护士</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">康复治疗师</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">营养师</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">护理员</th>
              <th className="text-left px-2 py-2 font-semibold text-slate-600">状态</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const statusC = p.status === '预警' ? 'bg-red-100 text-red-700' : p.status === '关注' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
              const cp = p.carePlan;
              return (
                <tr key={p.id} className="border-t border-slate-50 hover:bg-teal-50/30 transition-colors cursor-pointer" onClick={() => navigate(`/patient/${p.id}`)}>
                  <td className="px-2 py-2.5"><PatientAvatar patientId={p.id} size={28} /></td>
                  <td className="px-2 py-2.5 text-slate-500 text-[10px] font-mono">{String(p.id).padStart(5,'0')}</td>
                  <td className="px-2 py-2.5 font-semibold text-slate-700">{p.name}</td>
                  <td className="px-2 py-2.5 text-slate-600">{genderCN(p.gender)}</td>
                  <td className="px-2 py-2.5 text-slate-600">{p.age}</td>
                  <td className="px-2 py-2.5 text-slate-600 max-w-[180px] truncate" title={p.diagnosis}>{p.diagnosis}</td>
                  <td className="px-2 py-2.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${(p as any).barthelScore != null && (p as any).barthelScore <= 40 ? 'bg-red-50 text-red-600' : (p as any).barthelScore <= 60 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {disabilityLevel((p as any).barthelScore)}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${(p as any).bradenScore != null && (p as any).bradenScore <= 12 ? 'bg-red-50 text-red-600' : (p as any).bradenScore <= 16 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {bradenRisk((p as any).bradenScore)}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${(p as any).fallRiskScore != null && (p as any).fallRiskScore >= 45 ? 'bg-red-50 text-red-600' : (p as any).fallRiskScore >= 25 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {fallRiskLevel((p as any).fallRiskScore)}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">{cp?.assignedCaseManager ? <div className="flex items-center gap-1.5"><img src={staffAvatar[cp.assignedCaseManager]} className="w-5 h-5 rounded-full" /><span className="text-slate-600">{cp.assignedCaseManager}</span></div> : '—'}</td>
                  <td className="px-2 py-2.5">{cp?.assignedNurse ? <div className="flex items-center gap-1.5"><img src={staffAvatar[cp.assignedNurse]} className="w-5 h-5 rounded-full" /><span className="text-slate-600">{cp.assignedNurse}</span></div> : '—'}</td>
                  <td className="px-2 py-2.5">{cp?.assignedRehabTherapist ? <div className="flex items-center gap-1.5"><img src={staffAvatar[cp.assignedRehabTherapist]} className="w-5 h-5 rounded-full" /><span className="text-slate-600">{cp.assignedRehabTherapist}</span></div> : '—'}</td>
                  <td className="px-2 py-2.5">{cp?.assignedNutritionist ? <div className="flex items-center gap-1.5"><img src={staffAvatar[cp.assignedNutritionist]} className="w-5 h-5 rounded-full" /><span className="text-slate-600">{cp.assignedNutritionist}</span></div> : '—'}</td>
                  <td className="px-2 py-2.5">{cp?.assignedCareWorker ? <div className="flex items-center gap-1.5"><img src={staffAvatar[cp.assignedCareWorker]} className="w-5 h-5 rounded-full" /><span className="text-slate-600">{cp.assignedCareWorker}</span></div> : '—'}</td>
                  <td className="px-2 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusC}`}>{p.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── IoT Devices ────────────────────── */



export const Inventory: FC = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const patients = usePatientStore(s => s.patients);
  const devices = useMemo(
    () => buildInventoryDevices(INVENTORY_DEVICE_CATALOG, patients),
    [patients],
  );
  const consumables = INVENTORY_CONSUMABLES;
  const lowStockDevices = countLowStock(devices) + countLowStock(consumables);
  const supplierCount = countUniqueSuppliers(devices, consumables);
  return (
    <div className="p-6">
      <PageHeader title="Inventory Management" icon={Boxes} subtitle={`${devices.length + consumables.length} items · ${lowStockDevices} low stock alerts`}
        action={<button className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-600 hover:bg-gold-700 text-white text-xs font-semibold rounded-lg"><Plus className="w-3.5 h-3.5" /> Add Item</button>}
      />
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{ label: 'Devices', value: devices.length, color: 'text-teal-600', bg: 'bg-teal-50' }, { label: 'Consumables', value: consumables.length, color: 'text-purple-600', bg: 'bg-purple-50' }, { label: 'Low Stock', value: lowStockDevices, color: 'text-amber-600', bg: 'bg-amber-50' }, { label: 'Suppliers', value: supplierCount, color: 'text-emerald-600', bg: 'bg-emerald-50' }].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl p-4`}><p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p><p className="text-xs text-slate-500 mt-1">{s.label}</p></div>
        ))}
      </div>
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Smartphone className="w-4 h-4 text-teal-600" /> Remote Patient Monitoring Devices</h3>
        <div className="glass-card rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-[11px]">
            <thead className="bg-warm-50"><tr><th className="text-left px-4 py-2 font-semibold text-slate-600">设备</th><th className="text-left px-4 py-2 font-semibold text-slate-600">型号</th><th className="text-left px-4 py-2 font-semibold text-slate-600">供应商</th><th className="text-center px-4 py-2 font-semibold text-slate-600">库存</th><th className="text-left px-4 py-2 font-semibold text-slate-600">分配给</th></tr></thead>
            <tbody>{devices.map(d => { const low = d.stock < d.minStock; return (
              <tr key={d.id} className="border-t border-slate-50 hover:bg-warm-100 cursor-pointer" onClick={() => setSelectedItem(d)}>
                <td className="px-4 py-2.5 font-semibold text-slate-700">{d.name}</td>
                <td className="px-4 py-2.5 text-slate-500">{d.model}</td>
                <td className="px-4 py-2.5 text-slate-500">{d.supplier}</td>
                <td className="px-4 py-2.5 text-center"><span className={`font-bold ${low ? 'text-red-600 alert-blink' : 'text-emerald-600'}`}>{d.stock}</span><span className="text-slate-400">/{d.minStock}</span></td>
                <td className="px-4 py-2.5 text-[10px] text-slate-500 max-w-[200px] truncate">{d.assigned}</td>
              </tr>
            )})}</tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Package className="w-4 h-4 text-purple-600" /> Medical Consumables</h3>
        <div className="glass-card rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-[11px]">
            <thead className="bg-warm-50"><tr><th className="text-left px-4 py-2 font-semibold text-slate-600">物品</th><th className="text-left px-4 py-2 font-semibold text-slate-600">型号</th><th className="text-left px-4 py-2 font-semibold text-slate-600">供应商</th><th className="text-center px-4 py-2 font-semibold text-slate-600">库存</th><th className="text-left px-4 py-2 font-semibold text-slate-600">类别</th></tr></thead>
            <tbody>{consumables.map(c => { const low = c.stock < c.minStock; return (
              <tr key={c.id} className="border-t border-slate-50 hover:bg-warm-100 cursor-pointer" onClick={() => setSelectedItem(c)}>
                <td className="px-4 py-2.5 font-semibold text-slate-700">{c.name}</td>
                <td className="px-4 py-2.5 text-slate-500">{c.model}</td>
                <td className="px-4 py-2.5 text-slate-500">{c.supplier}</td>
                <td className="px-4 py-2.5 text-center"><span className={`font-bold ${low ? 'text-red-600 alert-blink' : 'text-emerald-600'}`}>{c.stock}</span><span className="text-slate-400">/{c.minStock}</span></td>
                <td className="px-4 py-2.5 text-[10px]"><span className="bg-warm-100 text-slate-600 px-2 py-0.5 rounded-full">{c.category}</span></td>
              </tr>
            )})}</tbody>
          </table>
        </div>
      </div>
      {selectedItem && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-teal-900/30 backdrop-blur-md" onClick={() => setSelectedItem(null)}>
          <div className="glass-card rounded-2xl shadow-2xl w-[400px] m-4" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b flex items-center justify-between"><span className="text-sm font-bold text-slate-800">物品详情</span><button onClick={() => setSelectedItem(null)} className="w-7 h-7 rounded-lg hover:bg-warm-100 flex items-center justify-center"><X className="w-4 h-4 text-slate-400" /></button></div>
            <div className="p-5 space-y-2 text-xs">
              <div><span className="text-slate-400">名称</span><p className="font-semibold text-slate-800">{selectedItem.name}</p></div>
              <div><span className="text-slate-400">型号</span><p className="text-slate-700">{selectedItem.model}</p></div>
              <div><span className="text-slate-400">供应商</span><p className="text-slate-700">{selectedItem.supplier}</p></div>
              <div><span className="text-slate-400">当前库存</span><p className={`font-bold ${selectedItem.stock < selectedItem.minStock ? 'text-red-600' : 'text-emerald-600'}`}>{selectedItem.stock} / min {selectedItem.minStock} {selectedItem.unit}</p></div>
              {selectedItem.assigned && <div><span className="text-slate-400">分配给</span><p className="text-slate-700">{selectedItem.assigned}</p></div>}
              {selectedItem.category && <div><span className="text-slate-400">类别</span><p className="text-slate-700">{selectedItem.category}</p></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ──────────────────── Follow-up Workbench ────────────────── */

export const FollowupWorkbench: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'mine'>('all');
  const role = user?.role as Role;
  const myName = user?.name || 'Staff';
  const patientsSummary = usePatientStore(s => s.patientsSummary);
  const carePlans = usePatientStore(s => s.carePlans);
  const alertActive = usePatientStore(s => s.alertActive);
  const carePlanStatus = useCollaborationStore(s => s.carePlanStatus);
  const allTasks = useMemo(
    () => buildFollowupTasks(patientsSummary, carePlans, carePlanStatus, alertActive),
    [patientsSummary, carePlans, carePlanStatus, alertActive],
  );
  const tasks = filter === 'mine' ? allTasks.filter(t => t.assignee === myName) : allTasks;

  return (
    <div className="p-6">
      <PageHeader title="Follow-up Workbench" icon={ClipboardList} subtitle={`${allTasks.filter(t => t.status !== 'completed').length} active tasks · ${allTasks.filter(t => t.status === 'completed').length} completed`}
        action={<div className="flex gap-2">
          <button onClick={()=>setFilter('all')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${filter==='all'?'bg-gold-600 text-white':'bg-warm-100 text-slate-600'}`}>全部任务</button>
          <button onClick={()=>setFilter('mine')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${filter==='mine'?'bg-gold-600 text-white':'bg-warm-100 text-slate-600'}`}>我的任务</button>
        </div>}
      />
      <div className="grid grid-cols-3 gap-4">
        {['pending', 'in_progress', 'completed'].map(col => {
          const colTasks = tasks.filter(t => t.status === col);
          const colLabel = col === 'pending' ? 'To Do' : col === 'in_progress' ? 'In Progress' : 'Completed';
          const colColor = col === 'pending' ? 'border-t-amber-400' : col === 'in_progress' ? 'border-t-blue-400' : 'border-t-emerald-400';
          return (
            <div key={col} className={`glass-card rounded-xl border border-slate-200 border-t-2 ${colColor} overflow-hidden`}>
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">{colLabel}</span>
                <span className="text-[10px] text-slate-400">{colTasks.length}</span>
              </div>
              <div className="p-2 space-y-2 min-h-[200px]">
                {colTasks.map(t => {
                  const priC = t.priority === 'Critical' ? 'bg-red-100 text-red-700' : t.priority === 'High' ? 'bg-amber-100 text-amber-700' : t.priority === 'Attention' ? 'bg-blue-100 text-teal-700' : 'bg-warm-100 text-slate-600';
                  return (
                    <div key={t.id} onClick={() => navigate(`/patient/${t.patientId}`)} className="bg-warm-50 rounded-lg p-2.5 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-slate-700">{t.patient}</span><span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${priC}`}>{t.priority}</span></div>
                      <p className="text-[11px] text-slate-600 mb-2">{t.task}</p>
                      <div className="flex items-center justify-between text-[9px] text-slate-400"><span>{t.assignee}</span><span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {t.due}</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────── Clinical Reports ──────────────────── */


type ReportCategory = 'discharge' | 'progress' | 'lab' | 'referral';

export const ClinicalReports: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<ClinicalDoc | null>(null);

  const categories: { key: ReportCategory; title: string; icon: FC<{ className?: string }>; docs: ClinicalDoc[]; color: string }[] = [
    { key: 'discharge', title: 'Discharge Summaries', icon: FileText, docs: DISCHARGE_SUMMARIES, color: 'text-teal-600 bg-teal-50' },
    { key: 'progress', title: 'Clinical Progress Notes', icon: ClipboardList, docs: PROGRESS_NOTES, color: 'text-emerald-600 bg-emerald-50' },
    { key: 'lab', title: 'Lab & Diagnostic Reports', icon: Activity, docs: LAB_REPORTS, color: 'text-purple-600 bg-purple-50' },
    { key: 'referral', title: 'Referral Letters', icon: Mail, docs: REFERRAL_LETTERS, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Clinical Reports" icon={FileText} subtitle="Clinical documentation, discharge summaries & referrals"
        action={selectedCategory ? (
          <button onClick={() => { setSelectedCategory(null); setSelectedDoc(null); }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-warm-100 rounded-lg hover:bg-warm-200">
            ← Back to Categories
          </button>
        ) : <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-600 text-white text-xs font-semibold rounded-lg hover:bg-gold-700"><Plus className="w-3.5 h-3.5" /> New Report</button>}
      />

      {!selectedCategory ? (
        /* Category grid */
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.key} onClick={() => setSelectedCategory(cat.key)}
              className="glass-card rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center`}>
                  <cat.icon className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-800">{cat.title}</p>
              <p className="text-xs text-slate-400 mt-1">{cat.docs.length} documents · Latest: {cat.docs[cat.docs.length - 1]?.date || 'N/A'}</p>
            </div>
          ))}
        </div>
      ) : selectedDoc ? (
        /* Document detail view */
        <div className="glass-card rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">{selectedDoc.title}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">{selectedDoc.patient} · {selectedDoc.date} · {selectedDoc.author}</p>
            </div>
            <button onClick={() => setSelectedDoc(null)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-warm-100 rounded-lg hover:bg-warm-200">← Back</button>
          </div>
          <div className="p-5">
            <div className="bg-teal-50 rounded-lg p-3 mb-4">
              <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide">摘要</span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">{selectedDoc.summary}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">完整报告</span>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{selectedDoc.content}</p>
            </div>
          </div>
        </div>
      ) : (
        /* Document list for selected category */
        <div className="glass-card rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
            {(() => { const cat = categories.find(c => c.key === selectedCategory)!; const Icon = cat.icon;
              return <><div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center`}><Icon className="w-4 h-4" /></div><span className="text-sm font-bold text-slate-800">{cat.title}</span><span className="text-xs text-slate-400">{cat.docs.length} documents</span></>;
            })()}
          </div>
          <div className="divide-y divide-slate-50 max-h-[60vh] overflow-y-auto">
            {categories.find(c => c.key === selectedCategory)!.docs.map((doc) => (
              <div key={doc.id} onClick={() => setSelectedDoc(doc)}
                className="px-5 py-3 hover:bg-warm-100 cursor-pointer transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{doc.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{doc.patient} · {doc.date} · {doc.author}</p>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{doc.summary}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────── Medication ────────────────────────── */

const MED_DATA = [
  { drug: 'Apixaban (Eliquis)', class: 'Anticoagulant', patients: 1, status: 'Active' },
  { drug: 'Aspirin', class: 'Antiplatelet', patients: 8, status: 'Active' },
  { drug: 'Metformin', class: 'Antidiabetic', patients: 3, status: 'Active' },
  { drug: 'Lipitor (Atorvastatin)', class: 'Statin', patients: 5, status: 'Active' },
  { drug: 'Bisoprolol', class: 'Beta Blocker', patients: 2, status: 'Review' },
  { drug: 'Lisinopril', class: 'ACE Inhibitor', patients: 1, status: 'Active' },
];

export const MedicationPage: FC = () => (
  <div className="p-6">
    <PageHeader title="Medication Management" icon={Pill} subtitle="Prescribe, review, and manage patient medications" action={<button className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-600 text-white text-xs font-semibold rounded-lg hover:bg-gold-700"><Plus className="w-3.5 h-3.5" /> Prescribe</button>} />
    <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-warm-50"><tr><th className="text-left px-4 py-2.5 font-semibold text-slate-600">药品</th><th className="text-left px-4 py-2.5 font-semibold text-slate-600">分类</th><th className="text-center px-4 py-2.5 font-semibold text-slate-600">Patients</th><th className="text-center px-4 py-2.5 font-semibold text-slate-600">状态</th></tr></thead>
        <tbody>{MED_DATA.map((m, i) => (
          <tr key={i} className="border-t border-slate-50 hover:bg-warm-100"><td className="px-4 py-2.5 font-semibold text-slate-700">{m.drug}</td><td className="px-4 py-2.5 text-slate-500">{m.class}</td><td className="px-4 py-2.5 text-center font-bold text-slate-700">{m.patients}</td><td className="px-4 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${m.status==='Active'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{m.status}</span></td></tr>
        ))}</tbody>
      </table>
    </div>
  </div>
);

/* ─────────────────── Billing & Reports ──────────────────── */


export const Finance: FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const patients = usePatientStore(s => s.patients);
  const alertActive = usePatientStore(s => s.alertActive);
  const invoices = useMemo(
    () => buildFinanceInvoices(patients, alertActive),
    [patients, alertActive],
  );
  const { totalRevenue, outstanding, paidCount, avgPerPatient } = useMemo(
    () => summarizeFinance(invoices, patients.length),
    [invoices, patients.length],
  );

  return (<div className="p-6">
    <PageHeader title="Finance" icon={CreditCard} subtitle={`${invoices.length} invoices · HK$ ${totalRevenue.toLocaleString()} total · ${invoices.length - paidCount} outstanding`} action={<div className="flex gap-2"><button className="flex items-center gap-1.5 px-3 py-1.5 bg-warm-100 text-xs font-semibold rounded-lg hover:bg-warm-200"><Download className="w-3.5 h-3.5" /> Export</button><button className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-600 text-white text-xs font-semibold rounded-lg hover:bg-gold-700"><Plus className="w-3.5 h-3.5" /> New Invoice</button></div>} />
    <div className="grid grid-cols-4 gap-4 mb-6">
      {[{ label: 'Total Revenue', value: `HK$ ${totalRevenue.toLocaleString()}`, color: 'text-emerald-600', bg: 'bg-emerald-50' }, { label: 'Outstanding', value: `HK$ ${outstanding.toLocaleString()}`, color: 'text-amber-600', bg: 'bg-amber-50' }, { label: 'Paid Invoices', value: `${paidCount}/${invoices.length}`, color: 'text-teal-600', bg: 'bg-teal-50' }, { label: 'Avg / Patient', value: `HK$ ${avgPerPatient.toLocaleString()}`, color: 'text-purple-600', bg: 'bg-purple-50' }].map((s, i) => (<div key={i} className={`${s.bg} rounded-xl p-4`}><p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p><p className="text-xs text-slate-500 mt-1">{s.label}</p></div>))}
    </div>
    <div className="space-y-2">
      {invoices.map((inv) => {
        const statusC = inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : inv.status === 'Partial' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
        return (<div key={inv.id} className="glass-card rounded-xl border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-shadow flex items-center" onClick={() => setSelectedInvoice(inv)}>
          <span className="text-xs font-bold text-teal-600 w-32">{inv.id}</span>
          <span className="text-sm font-semibold text-slate-800 flex-1">{inv.patient}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusC}`}>{inv.status}</span>
          <span className="text-sm font-extrabold text-slate-800 ml-4">HK$ {inv.total.toLocaleString()}</span>
          <ChevronRight className="w-4 h-4 text-slate-300 ml-2" />
        </div>);
      })}
    </div>
    {selectedInvoice && (<div className="fixed inset-0 z-[300] flex items-center justify-center bg-teal-900/30 backdrop-blur-md" onClick={() => setSelectedInvoice(null)}><div className="glass-card rounded-2xl shadow-2xl w-[500px] max-h-[85vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}><div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-800 px-5 py-4 flex items-center justify-between z-10 rounded-t-2xl"><div className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-white" /><span className="text-sm font-bold text-white">Invoice Detail</span></div><button onClick={() => setSelectedInvoice(null)} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><X className="w-3.5 h-3.5 text-white" /></button></div><div className="p-5 space-y-4"><div className="grid grid-cols-2 gap-3 text-xs"><div><span className="text-slate-400">Invoice #</span><p className="font-bold text-slate-800">{selectedInvoice.id}</p></div><div><span className="text-slate-400">病人</span><p className="font-bold text-slate-800">{selectedInvoice.patient}</p></div><div><span className="text-slate-400">状态</span><p className={`font-bold ${selectedInvoice.status==='Paid'?'text-emerald-600':selectedInvoice.status==='Partial'?'text-amber-600':'text-red-600'}`}>{selectedInvoice.status}</p></div><div><span className="text-slate-400">合计</span><p className="font-extrabold text-lg text-slate-800">HK$ {selectedInvoice.total.toLocaleString()}</p></div></div><div><span className="text-xs font-semibold text-slate-600 uppercase">Service Items</span><div className="mt-2 divide-y border rounded-lg"><div className="grid grid-cols-[1fr_120px] gap-3 px-3 py-2 bg-warm-50 text-[10px] font-semibold text-slate-400 uppercase"><span>Description</span><span className="text-right">Amount</span></div>{selectedInvoice.items.map((item: any, i: number) => (<div key={i} className="grid grid-cols-[1fr_120px] gap-3 px-3 py-2 text-[11px]"><span className="text-slate-700">{item.desc}</span><span className="text-right font-semibold text-slate-800">HK$ {item.amount.toLocaleString()}</span></div>))}<div className="grid grid-cols-[1fr_120px] gap-3 px-3 py-2 bg-teal-50 font-bold text-xs"><span className="text-teal-700">合计</span><span className="text-right text-teal-700">HK$ {selectedInvoice.total.toLocaleString()}</span></div></div></div></div></div></div>)}
  </div>);
};


export const ReportsPage: FC = () => (
  <div className="p-6">
    <PageHeader title="Reports & Analytics" icon={FileText} subtitle="Financial and operational performance reports" action={<button className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-600 text-white text-xs font-semibold rounded-lg hover:bg-gold-700"><Download className="w-3.5 h-3.5" /> Export All</button>} />
    <div className="grid grid-cols-2 gap-4">
      {[{ title: 'Monthly Revenue Report', type: 'Financial', date: 'Jun 2026' }, { title: 'LTC Insurance Reconciliation', type: 'Insurance', date: 'Q2 2026' }, { title: 'Service Utilization Report', type: 'Operations', date: 'Jun 2026' }, { title: 'Patient Billing Summary', type: 'Financial', date: 'Monthly' }].map((r, i) => (
        <div key={i} className="glass-card rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-800">{r.title}</p><p className="text-xs text-slate-400 mt-1">{r.type} · {r.date}</p></div><Download className="w-4 h-4 text-slate-300" /></div>
      ))}
    </div>
  </div>
);

/* ─────────────── Side Nav Pages ─────────────────────────── */

export const RiskAlerts: FC = () => {
  const alerts = usePatientStore(s => s.alerts.filter(a => !a.resolved));
  const patients = usePatientStore(s => s.patients);
  const resolveAlert = usePatientStore(s => s.resolveAlert);
  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('en-HK', { hour: '2-digit', minute: '2-digit' });
  return (
  <div className="p-6">
    <PageHeader title="Risk Alerts" icon={AlertTriangle} subtitle="Real-time clinical risk alerts and notifications" />
    <div className="space-y-3">
      {alerts.map((a) => {
        const patient = patients.find(p => p.id === a.patientId);
        const severity = a.type === 'critical' ? 'Critical' : 'Attention';
        const sevC = severity === 'Critical' ? 'border-l-red-500 bg-red-50' : 'border-l-amber-500 bg-amber-50';
        return (
          <div key={a.id} className={`${sevC} border-l-4 glass-card rounded-xl border border-slate-200 p-3`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700">{patient?.name || `Patient ${a.patientId}`}</span>
              <span className="text-[9px] text-slate-400">{formatTime(a.timestamp)}</span>
            </div>
            <p className="text-xs text-slate-600">{a.message}</p>
            <button
              onClick={() => resolveAlert(a.id)}
              className="mt-2 text-[10px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              Dismiss
            </button>
          </div>
        );
      })}
      {alerts.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No active alerts — all patients stable.</p>}
    </div>
  </div>
  );
};

export const FollowupCalendar: FC = () => (
  <div className="p-6">
    <PageHeader title="Follow-up Calendar" icon={Calendar} subtitle="Schedule and track all follow-up appointments" />
    <div className="glass-card rounded-2xl border border-slate-200 p-4">
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><div key={d} className="font-semibold text-slate-500 py-1">{d}</div>)}
        {Array.from({length: 30}, (_, i) => i+1).map(d => {
          const hasEvent = [3,10,15,18,21,24].includes(d);
          return (<div key={d} className={`py-2 rounded-lg text-xs ${hasEvent?'bg-teal-50 text-teal-700 font-bold':'text-slate-500 hover:bg-warm-100'}`}>{d}{hasEvent&&<div className="w-1 h-1 bg-teal-500 rounded-full mx-auto mt-0.5"/>}</div>);
        })}
      </div>
    </div>
  </div>
);

/* ────────────── Care Elites ───────────────────────────── */

const ELITE_STAFF: TeamMember[] = [
  { ...CARE_TEAM['Sarah Leung'], avatar: '/avatars/sarah-leung.png', institution: 'Queen Mary Hospital · HK Sanatorium & Hospital' },
  { ...CARE_TEAM['David Chan'],  avatar: '/avatars/david-chan.png',  institution: 'Prince of Wales Hospital · St. Teresa\'s Hospital · HK Sanatorium' },
  { ...CARE_TEAM['May Wong'],    avatar: '/avatars/may-wong.png',    institution: 'Kwong Wah Hospital · iHomeCare Home Support' },
  { id: 'N002', name: 'Jenny Tam', role: 'Home Care Nurse (RN)', gender: 'Female', age: 29, yearsExperience: 7,
    specialty: 'Geriatric & Post-Surgical Home Care',
    certifications: ['Registered Nurse (HKNC)', 'BLS Certified', 'Wound Care Certified', 'Dementia Care Trained'],
    institution: 'Tuen Mun Hospital · United Christian Hospital · HK Sanatorium', education: 'BNurs (HKU)',
    bio: 'Jenny Tam is a dedicated home care nurse specializing in geriatric and post-surgical care. She provides compassionate bedside nursing, wound management, and medication administration for elderly patients recovering at home. Jenny is trained in dementia care and fall prevention strategies.',
    avatar: '/avatars/jenny-tam.png', registrationNo: 'RN215678' },
  { id: 'R002', name: 'Michael Kwok', role: 'Rehab Therapist', gender: 'Male', age: 32, yearsExperience: 9,
    specialty: 'Orthopedic & Neurological Rehabilitation',
    certifications: ['Registered Physiotherapist (HKPA)', 'Certified Manual Therapist', 'Vestibular Rehab Certified'],
    institution: 'Pamela Youde Nethersole Eastern Hospital · Gleneagles Hospital · HK Sanatorium', education: 'BSc Physiotherapy (PolyU), MSc Rehab Science (CUHK)',
    bio: 'Michael Kwok specializes in orthopedic and neurological rehabilitation. He designs progressive exercise programs for post-fracture, joint replacement, and stroke recovery patients. Michael is skilled in manual therapy techniques and balance retraining for fall-risk patients.',
    avatar: '/avatars/michael-kwok.png', registrationNo: 'PT004567' },
  { id: 'CW002', name: 'Lisa Cheng', role: 'Home Care Worker', gender: 'Female', age: 38, yearsExperience: 8,
    specialty: 'Personal Care & Daily Living Assistance',
    certifications: ['Health Care Assistant (HCA)', 'First Aid Certified', 'Nutrition & Meal Planning Certified'],
    institution: 'St. Teresa\'s Hospital · iHomeCare Home Support', education: 'Certificate in Health Care Assistance (VTC)',
    bio: 'Lisa Cheng provides compassionate home support including personal hygiene assistance, meal preparation, light housekeeping, and companionship. She specializes in supporting patients with limited mobility and those requiring assistance with activities of daily living.',
    avatar: '/avatars/lisa-cheng.png', registrationNo: 'HCA-2016-0312' },
  // New nurses
  { id: 'N003', name: 'Angela Ng', role: 'Home Care Nurse (RN)', gender: 'Female', age: 35, yearsExperience: 11,
    specialty: 'Palliative & Oncology Home Care',
    certifications: ['Registered Nurse (HKNC)', 'Palliative Care Certified', 'Chemotherapy Administration Certified'],
    institution: 'Queen Mary Hospital · Hong Kong Baptist Hospital', education: 'BNurs (CUHK), MSc Palliative Care (HKU)',
    bio: 'Angela Ng is a specialist palliative care nurse with over a decade of experience in oncology and end-of-life home care. She provides pain management, symptom control, and emotional support for patients and families facing serious illness.',
    avatar: '/avatars/angela-ng.png', registrationNo: 'RN192345' },
  { id: 'N004', name: 'Connie Cheung', role: 'Home Care Nurse (RN)', gender: 'Female', age: 42, yearsExperience: 18,
    specialty: 'Chronic Disease Management & Diabetic Care',
    certifications: ['Registered Nurse (HKNC)', 'Certified Diabetes Educator', 'Hypertension Management Certified', 'Renal Care Certificate'],
    institution: 'Prince of Wales Hospital · Canossa Hospital · Matilda International Hospital', education: 'BNurs (PolyU), MSc Clinical Nursing (HKU)',
    bio: 'Connie Cheung is a veteran home care nurse specializing in chronic disease management. She has extensive experience in diabetes education, hypertension monitoring, and renal care. Connie takes a holistic approach, empowering patients to self-manage their conditions.',
    avatar: '/avatars/connie-cheung.png', registrationNo: 'RN178901' },
  { id: 'N005', name: 'Vivian Lau', role: 'Home Care Nurse (RN)', gender: 'Female', age: 28, yearsExperience: 5,
    specialty: 'Post-Surgical & Wound Care',
    certifications: ['Registered Nurse (HKNC)', 'Wound Care Certified', 'BLS Instructor', 'Infection Control Certified'],
    institution: 'Tuen Mun Hospital · United Christian Hospital', education: 'BNurs (HKU)',
    bio: 'Vivian Lau is a dedicated post-surgical care nurse with a passion for wound management and infection prevention. She provides meticulous wound care, drain management, and post-operative monitoring for patients recovering at home.',
    avatar: '/avatars/vivian-lau.png', registrationNo: 'RN228901' },
  // New rehab therapists
  { id: 'R003', name: 'Raymond Wong', role: 'Rehab Therapist', gender: 'Male', age: 45, yearsExperience: 20,
    specialty: 'Geriatric Rehabilitation & Fall Prevention',
    certifications: ['Registered Physiotherapist (HKPA)', 'Geriatric Certified Specialist (GCS)', 'Fall Prevention Program Director', 'Manual Therapy Fellow'],
    institution: 'Kwong Wah Hospital · Queen Mary Hospital · HK Sanatorium', education: 'BSc Physiotherapy (PolyU), MSc Gerontology (CUHK)',
    bio: 'Raymond Wong is a senior rehabilitation therapist with 20 years of experience specializing in geriatric care. He is an expert in fall risk assessment, balance training, and mobility restoration for elderly patients. Raymond leads the iHomeCare Fall Prevention Program.',
    avatar: '/avatars/raymond-wong.png', registrationNo: 'PT002345' },
  { id: 'R004', name: 'Shirley Fong', role: 'Rehab Therapist', gender: 'Female', age: 31, yearsExperience: 8,
    specialty: 'Women\'s Health & Post-Surgical Rehab',
    certifications: ['Registered Physiotherapist (HKPA)', 'Women\'s Health Certified Specialist', 'Lymphedema Management Certified'],
    institution: 'Hong Kong Baptist Hospital · Matilda International Hospital', education: 'BSc Physiotherapy (PolyU), MSc Women\'s Health (CUHK)',
    bio: 'Shirley Fong specializes in women\'s health rehabilitation including post-mastectomy care, lymphedema management, and pelvic floor rehabilitation. She provides compassionate, evidence-based therapy to help women recover function and confidence.',
    avatar: '/avatars/shirley-fong.png', registrationNo: 'PT005678' },
  { id: 'R005', name: 'Eric Chan', role: 'Rehab Therapist', gender: 'Male', age: 37, yearsExperience: 13,
    specialty: 'Sports Injury & Post-Operative Orthopedic Rehab',
    certifications: ['Registered Physiotherapist (HKPA)', 'Certified Strength & Conditioning Specialist (CSCS)', 'Sports Physiotherapy Diploma'],
    institution: 'Gleneagles Hospital · St. Teresa\'s Hospital · Prince of Wales Hospital', education: 'BSc Physiotherapy (PolyU), MSc Sports Medicine (CUHK)',
    bio: 'Eric Chan is an orthopedic and sports rehabilitation specialist. He designs progressive exercise programs for post-operative joint replacement, fracture recovery, and sports injury rehabilitation. Eric combines manual therapy with evidence-based exercise prescription.',
    avatar: '/avatars/eric-chan.png', registrationNo: 'PT003456' },
  // Case Managers
  { id: 'CM001', name: 'Grace Tang', role: 'Case Manager', gender: 'Female', age: 40, yearsExperience: 12,
    specialty: 'Complex Care Coordination & Family Liaison',
    certifications: ['Registered Nurse (HKNC)', 'Certified Case Manager (CCM)', 'Geriatric Care Certified', 'Palliative Care Trained'],
    institution: 'Queen Mary Hospital · iHomeCare Community Services', education: 'BNurs (HKU), MSc Health Services Management (PolyU)',
    bio: 'Grace Tang is a senior case manager with 12 years of clinical nursing experience before transitioning to care coordination. She specializes in managing complex multi-disciplinary cases, liaising between hospitals, home care teams, and families to ensure seamless care transitions.',
    avatar: '/avatars/grace-tang.png', registrationNo: 'RN195432' },
  { id: 'CM002', name: 'Tony Lam', role: 'Case Manager', gender: 'Male', age: 43, yearsExperience: 15,
    specialty: 'Chronic Disease Management & LTC Insurance Coordination',
    certifications: ['Registered Nurse (HKNC)', 'Certified Diabetes Educator', 'Long-Term Care Insurance Specialist', 'Gerontology Certificate'],
    institution: 'Prince of Wales Hospital · United Christian Hospital · iHomeCare', education: 'BNurs (CUHK), MSc Clinical Gerontology (HKU)',
    bio: 'Tony Lam brings 15 years of nursing experience to his case manager role, with deep expertise in chronic disease management and LTC insurance navigation. He helps families understand their coverage, coordinates multi-provider care plans, and ensures patients receive all entitled services.',
    avatar: '/avatars/tony-lam.png', registrationNo: 'RN183210' },
  { id: 'CM003', name: 'Anna Leung', role: 'Case Manager', gender: 'Female', age: 38, yearsExperience: 10,
    specialty: 'Post-Surgical & Oncology Care Coordination',
    certifications: ['Registered Nurse (HKNC)', 'Oncology Nursing Certificate', 'Wound & Stoma Care Certified', 'Case Management Certified'],
    institution: 'HK Sanatorium & Hospital · St. Teresa\'s Hospital · iHomeCare', education: 'BNurs (PolyU), MSc Nursing (HKU)',
    bio: 'Anna Leung is a dedicated case manager specializing in post-surgical recovery and oncology care pathways. With 10 years of nursing experience, she excels at coordinating complex discharge plans, managing wound care protocols, and providing psychosocial support to patients and families during challenging treatment journeys.',
    avatar: '/avatars/anna-leung.png', registrationNo: 'RN207654' },
  // Care Workers
  { id: 'CW003', name: 'Carol Ng', role: 'Care Worker', gender: 'Female', age: 45, yearsExperience: 8,
    specialty: 'Personal Care & Meal Preparation',
    certifications: ['Health Care Assistant (HCA)', 'First Aid Certified', 'Food Hygiene Certificate'],
    institution: 'Queen Mary Hospital · iHomeCare Home Support', education: 'Certificate in Health Care Assistance (VTC)',
    bio: 'Carol Ng is a compassionate care worker with 8 years of experience in home-based personal care. She provides assistance with bathing, grooming, meal preparation, and light housekeeping for elderly and post-surgical patients. Carol is known for her warm, patient-centered approach.',
    avatar: '/avatars/carol-ng.png', registrationNo: 'HCA-2018-0423' },
  { id: 'CW004', name: 'Derek Ho', role: 'Care Worker', gender: 'Male', age: 32, yearsExperience: 5,
    specialty: 'Mobility Assistance & Companionship',
    certifications: ['Health Care Assistant (HCA)', 'First Aid Certified', 'Manual Handling & Transfer Certified'],
    institution: 'Prince of Wales Hospital · iHomeCare Home Support', education: 'Certificate in Health Care Assistance (VTC)',
    bio: 'Derek Ho is a dedicated care worker specializing in mobility assistance and companionship for patients with limited mobility. He supports safe transfers, accompanies patients on walks, assists with exercises prescribed by therapists, and provides engaging companionship.',
    avatar: '/avatars/derek-ho.png', registrationNo: 'HCA-2021-0156' },
  { id: 'CW005', name: 'Fanny Yip', role: 'Care Worker', gender: 'Female', age: 50, yearsExperience: 12,
    specialty: 'Housekeeping & Daily Living Support',
    certifications: ['Health Care Assistant (HCA)', 'First Aid Certified', 'Nutrition & Meal Planning Certificate', 'Dementia Care Trained'],
    institution: 'United Christian Hospital · iHomeCare Home Support', education: 'Certificate in Health Care Assistance (VTC)',
    bio: 'Fanny Yip is an experienced care worker with 12 years of service in home care. She provides housekeeping, laundry, grocery shopping, medication prompting, and daily living support. Fanny has additional training in dementia care and is especially skilled at working with elderly patients with cognitive needs.',
    avatar: '/avatars/fanny-yip.png', registrationNo: 'HCA-2014-0089' },
  { id: 'CW006', name: 'Peter Kwan', role: 'Care Worker', gender: 'Male', age: 55, yearsExperience: 15,
    specialty: 'Post-Stroke & Mobility Support',
    certifications: ['Health Care Assistant (HCA)', 'First Aid Instructor', 'Stroke Care Certificate', 'Falls Prevention Trained'],
    institution: 'Pamela Youde Nethersole Eastern Hospital · iHomeCare Home Support', education: 'Certificate in Health Care Assistance (VTC), Diploma in Stroke Care',
    bio: 'Peter Kwan is a highly experienced care worker with 15 years specializing in post-stroke rehabilitation support and mobility assistance. He has extensive training in stroke care, falls prevention, and safe transfer techniques. Peter is passionate about helping patients regain independence through consistent daily support.',
    avatar: '/avatars/peter-kwan.png', registrationNo: 'HCA-2011-0278' },
  // Vacant Positions
  { id: 'N006', name: 'Jessie Fong', role: 'Home Care Nurse (RN)', gender: 'Female', age: 34, yearsExperience: 7,
    specialty: 'Geriatric & Chronic Disease Home Care',
    certifications: ['Registered Nurse (HKNC)', 'Geriatric Care Certificate'],
    institution: 'Queen Mary Hospital · Kwong Wah Hospital · iHomeCare', education: 'BNurs (CUHK)',
    bio: 'Jessie Fong is an experienced geriatric home care nurse with 7 years in community nursing. She specializes in chronic disease management for elderly patients, including medication reconciliation, wound care, and family caregiver education.',
    avatar: '/avatars/rn-vacant-1.png', registrationNo: 'RN245678' },
  { id: 'N007', name: 'Maggie Cheung', role: 'Home Care Nurse (RN)', gender: 'Female', age: 41, yearsExperience: 8,
    specialty: 'Post-Surgical & Palliative Care',
    certifications: ['Registered Nurse (HKNC)', 'Palliative Care Certificate', 'Wound Care Certified'],
    institution: 'Prince of Wales Hospital · Caritas Medical Centre · iHomeCare', education: 'BNurs (HKU)',
    bio: 'Maggie Cheung is a compassionate palliative and post-surgical care nurse with 8 years of experience. She provides holistic end-of-life care and post-operative monitoring, ensuring patient comfort and dignity at home.',
    avatar: '/avatars/rn-vacant-2.png', registrationNo: 'RN198765' },
  { id: 'N008', name: 'Brian Ng', role: 'Home Care Nurse (RN)', gender: 'Male', age: 29, yearsExperience: 6,
    specialty: 'Cardiac & Respiratory Home Care',
    certifications: ['Registered Nurse (HKNC)', 'Cardiac Nursing Certificate', 'BLS Instructor'],
    institution: 'United Christian Hospital · Tuen Mun Hospital · iHomeCare', education: 'BNurs (PolyU)',
    bio: 'Brian Ng is a dedicated cardiac and respiratory home care nurse with 6 years experience. He excels in RPM device management, telemonitoring, and educating patients on self-management of chronic cardiac and respiratory conditions.',
    avatar: '/avatars/rn-vacant-3.png', registrationNo: 'RN267890' },
  { id: 'R006', name: 'Catherine Tsang', role: 'Rehab Therapist', gender: 'Female', age: 37, yearsExperience: 7,
    specialty: 'Orthopedic & Neurological Rehabilitation',
    certifications: ['Registered Physiotherapist (HK)', 'Neuro Rehab Certificate'],
    institution: 'Pamela Youde Nethersole Eastern Hospital · Kowloon Hospital · iHomeCare', education: 'BSc Physiotherapy (PolyU)',
    bio: 'Catherine Tsang is a Registered Physiotherapist with 7 years experience in orthopedic and neurological rehabilitation. She designs progressive home exercise programs for post-stroke, joint replacement, and spinal patients.',
    avatar: '/avatars/pt-vacant-1.png', registrationNo: 'PT007890' },
  { id: 'R007', name: 'Samson Hui', role: 'Rehab Therapist', gender: 'Male', age: 45, yearsExperience: 9,
    specialty: 'Geriatric & Falls Prevention Rehabilitation',
    certifications: ['Registered Physiotherapist (HK)', 'Geriatric Rehab Specialist', 'Falls Prevention Certified'],
    institution: 'Queen Elizabeth Hospital · Hong Kong Sanatorium & Hospital · iHomeCare', education: 'MSc Rehab Sciences (CUHK)',
    bio: 'Samson Hui is a senior Physiotherapist specializing in geriatric rehabilitation and falls prevention with 9 years experience. He conducts comprehensive MSE, Berg Balance, and TUG assessments, and trains family caregivers in safe transfer techniques.',
    avatar: '/avatars/pt-vacant-2.png', registrationNo: 'PT005432' },
  { id: 'R008', name: 'Jason Chan', role: 'Rehab Therapist', gender: 'Male', age: 32, yearsExperience: 5,
    specialty: 'Cardiac & Pulmonary Rehabilitation',
    certifications: ['Registered Physiotherapist (HK)', 'Cardiac Rehab Certified', 'Pulmonary Rehab Trained'],
    institution: 'Kwong Wah Hospital · Princess Margaret Hospital · iHomeCare', education: 'BSc Physiotherapy (HKU)',
    bio: 'Jason Chan is a Physiotherapist passionate about cardiac and pulmonary rehabilitation. He delivers Phase 2 & 3 cardiac rehab programs and performs 6MWT assessments. Jason is dedicated to helping patients regain functional independence.',
    avatar: '/avatars/pt-vacant-3.png', registrationNo: 'PT009876' },
  { id: 'CW007', name: 'Alice Ho', role: 'Care Worker', gender: 'Female', age: 43, yearsExperience: 6,
    specialty: 'Elderly Home Care & Daily Living Support',
    certifications: ['Health Care Assistant (HCA)', 'Elderly Care Certificate'],
    institution: 'TWGHs Wong Tai Sin Hospital · St. Teresa\'s Hospital · iHomeCare', education: 'Certificate in Health Care Assistance (VTC)',
    bio: 'Alice Ho is a warm and dependable Health Care Assistant specializing in elderly home care. With 6 years experience, she provides compassionate personal care, meal preparation, medication prompting, and companionship to seniors.',
    avatar: '/avatars/cw-vacant-1.png', registrationNo: 'HCA-2019-0567' },
  { id: 'CW008', name: 'Michelle Yuen', role: 'Care Worker', gender: 'Female', age: 38, yearsExperience: 8,
    specialty: 'Post-Stroke & Dementia Care',
    certifications: ['Health Care Assistant (HCA)', 'Dementia Care Certificate', 'First Aid Certified'],
    institution: 'Shatin Hospital · Haven of Hope Hospital · iHomeCare', education: 'Diploma in Health Care Studies (HKU SPACE)',
    bio: 'Michelle Yuen is an experienced Health Care Assistant with 8 years specializing in dementia and post-stroke care. Her patience, communication skills, and experience with cognitive stimulation activities make her invaluable to families.',
    avatar: '/avatars/cw-vacant-2.png', registrationNo: 'HCA-2017-0345' },
  { id: 'CW009', name: 'Kenny Ma', role: 'Care Worker', gender: 'Male', age: 48, yearsExperience: 5,
    specialty: 'Post-Surgical & Wound Care Support',
    certifications: ['Health Care Assistant (HCA)', 'Wound Care Basics', 'Post-Op Care Trained'],
    institution: 'Princess Margaret Hospital · Yan Chai Hospital · iHomeCare', education: 'Certificate in Health Care Assistance (VTC)',
    bio: 'Kenny Ma is a reliable Health Care Assistant skilled in post-surgical home care. With 5 years experience, he provides wound observation, drain awareness, mobility assistance, and post-operative monitoring for patients recovering at home.',
    avatar: '/avatars/cw-vacant-3.png', registrationNo: 'HCA-2020-0789' },
];

const STAFF_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Sarah Leung':  { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-blue-300',   dot: 'bg-teal-500' },
  'David Chan':   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300', dot: 'bg-emerald-500' },
  'May Wong':     { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-300',  dot: 'bg-amber-500' },
  'Jenny Tam':    { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-300',   dot: 'bg-cyan-500' },
  'Michael Kwok': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300', dot: 'bg-purple-500' },
  'Lisa Cheng':   { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-300',   dot: 'bg-rose-500' },
  'Angela Ng':    { bg: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-300',    dot: 'bg-sky-500' },
  'Connie Cheung':{ bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-300',   dot: 'bg-teal-500' },
  'Vivian Lau':   { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-300', dot: 'bg-violet-500' },
  'Raymond Wong': { bg: 'bg-lime-50',   text: 'text-lime-700',   border: 'border-lime-300',   dot: 'bg-lime-500' },
  'Shirley Fong': { bg: 'bg-pink-50',   text: 'text-pink-700',   border: 'border-pink-300',   dot: 'bg-pink-500' },
  'Eric Chan':    { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-300', dot: 'bg-indigo-500' },
  'Grace Tang':   { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-500' },
  'Tony Lam':     { bg: 'bg-warm-100', text: 'text-slate-700', border: 'border-slate-300', dot: 'bg-slate-500' },
  'Anna Leung':   { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300', dot: 'bg-yellow-500' },
  'Carol Ng':     { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-300', dot: 'bg-fuchsia-500' },
  'Derek Ho':     { bg: 'bg-stone-50',  text: 'text-stone-700',  border: 'border-stone-300',  dot: 'bg-stone-500' },
  'Fanny Yip':    { bg: 'bg-rose-50',    text: 'text-rose-700',   border: 'border-rose-300',   dot: 'bg-rose-500' },
  'Peter Kwan':   { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-300',  dot: 'bg-green-500' },
  'Jessie Fong':  { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-blue-300',   dot: 'bg-teal-500' },
  'Maggie Cheung': { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-300',   dot: 'bg-teal-500' },
  'Brian Ng':     { bg: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-300',    dot: 'bg-sky-500' },
  'Catherine Tsang': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-300', dot: 'bg-violet-500' },
  'Samson Hui':   { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-500' },
  'Jason Chan':   { bg: 'bg-lime-50',   text: 'text-lime-700',   border: 'border-lime-300',   dot: 'bg-lime-500' },
  'Alice Ho':     { bg: 'bg-pink-50',   text: 'text-pink-700',   border: 'border-pink-300',   dot: 'bg-pink-500' },
  'Michelle Yuen': { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-300', dot: 'bg-fuchsia-500' },
  'Kenny Ma':     { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-300',  dot: 'bg-amber-500' },
};

type CareEliteView = 'roster' | 'calendar';

const pidToName = buildPidToName(PATIENTS_FULL);
const pidToNurse = buildPidToNurse(PATIENTS_FULL);
const pidToTherapist = buildPidToTherapist(PATIENTS_FULL);
const pidToCareWorker = buildPidToCareWorker(PATIENTS_FULL);

function generateStaffCalendar(carePlans: Record<number, TwoWeekCarePlan | undefined>) {
  const today = new Date(`${DEMO_CARE_PLAN_DATE}T12:00:00`);
  const dates: string[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }

  const staffSchedule: Record<string, Record<string, { patient: string; type: string; time: string }[]>> = {};
  for (const staff of ELITE_STAFF) {
    staffSchedule[staff.name] = {};
    for (const date of dates) {
      staffSchedule[staff.name][date] = [];
    }
  }

  for (const [pidStr, plan] of Object.entries(carePlans)) {
    const pid = Number(pidStr);
    if (!plan || !pid) continue;
    for (const date of dates) {
      const acts = plan.schedule?.[date] || [];
      for (const act of acts) {
        if (act.type === 'nurse_visit' && pidToNurse[pid]) {
          staffSchedule[pidToNurse[pid]][date].push({ patient: plan.patientName, type: act.type, time: act.time });
        } else if (act.type === 'therapy' && pidToTherapist[pid]) {
          staffSchedule[pidToTherapist[pid]][date].push({ patient: plan.patientName, type: act.type, time: act.time });
        } else if (act.type === 'care_worker' && pidToCareWorker[pid]) {
          staffSchedule[pidToCareWorker[pid]][date].push({ patient: plan.patientName, type: act.type, time: act.time });
        }
      }
    }
  }
  return { dates, staffSchedule };
}

export const CareElites: FC = () => {
  const [view, setView] = useState<CareEliteView>('roster');
  const [selectedStaff, setSelectedStaff] = useState<TeamMember | null>(null);
  const carePlans = usePatientStore(s => s.carePlans);
  const { dates, staffSchedule } = useMemo(() => generateStaffCalendar(carePlans), [carePlans]);

  // Build active patient list per staff member from schedule + direct assignments
  const staffPatients: Record<string, string[]> = {};
  for (const staff of ELITE_STAFF) {
    const patients = new Set<string>();
    // From schedule
    for (const date of dates.slice(0, 30)) {
      for (const act of (staffSchedule[staff.name]?.[date] || [])) {
        patients.add(act.patient);
      }
    }
    // From direct nurse assignments
    for (const [pid, name] of Object.entries(pidToName)) {
      if (pidToNurse[Number(pid)] === staff.name) patients.add(name);
      if (pidToTherapist[Number(pid)] === staff.name) patients.add(name);
      if (pidToCareWorker[Number(pid)] === staff.name) patients.add(name);
    }
    staffPatients[staff.name] = [...patients].sort();
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-warm-50 -mx-6 px-6 pt-6 pb-3">
        <PageHeader title="Care Elites" icon={Award} subtitle="Nurses, Rehab Therapists & Care Workers"
          action={
            <div className="flex gap-2">
              <button onClick={() => setView('roster')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${view === 'roster' ? 'bg-gold-600 text-white shadow-sm' : 'bg-warm-100 text-slate-600 hover:bg-warm-200'}`}>排班</button>
              <button onClick={() => setView('calendar')} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${view === 'calendar' ? 'bg-gold-600 text-white shadow-sm' : 'bg-warm-100 text-slate-600 hover:bg-warm-200'}`}>日历</button>
            </div>
          }
        />
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-2">

      {view === 'roster' && (
        /* ── Roster View — grouped by role ── */
        <div className="space-y-6">
          {[
            { label: 'Case Managers', icon: ClipboardList, staff: ELITE_STAFF.filter(s => s.role === 'Case Manager') },
            { label: 'Nurses (RN)', icon: Heart, staff: ELITE_STAFF.filter(s => s.role.includes('Nurse')) },
            { label: 'Rehab Therapists', icon: Activity, staff: ELITE_STAFF.filter(s => s.role.includes('Rehab') || s.role.includes('Therapist')) },
            { label: 'Care Workers', icon: Users, staff: ELITE_STAFF.filter(s => s.role.includes('Care Worker')) },
          ].map((group) => group.staff.length > 0 && (
            <div key={group.label}>
              <h3 className="sticky top-[72px] z-[4] bg-warm-50 text-xs font-bold text-slate-500 uppercase tracking-wide py-2 -mx-4 px-4 mb-2 flex items-center gap-2">
                <group.icon className="w-3.5 h-3.5" /> {group.label} <span className="text-slate-300 font-normal normal-case">{group.staff.length} members</span>
              </h3>
              <div className="space-y-2">
                {group.staff.map((staff) => {
                  const colors = STAFF_COLORS[staff.name];
                  return (
                    <div key={staff.id}
                      onClick={() => setSelectedStaff(staff)}
                      className="glass-card rounded-xl border border-slate-200 p-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 shadow-lg border-2 border-white">
                        <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-800">{staff.name}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>{staff.role}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{staff.specialty}</p>
                        {staff.registrationNo && <p className="text-[9px] text-slate-400 font-mono mt-0.5">#{staff.registrationNo}</p>}
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {staff.yearsExperience} yrs</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {staff.institution}</span>
                        </div>
                        {/* Active patients */}
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {(staffPatients[staff.name]?.length || 0) > 0 ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                              <span className="text-[10px] text-emerald-600 font-medium">
                                {staffPatients[staff.name].length} active: {staffPatients[staff.name].slice(0, 3).join(', ')}{(staffPatients[staff.name]?.length || 0) > 3 ? ` +${staffPatients[staff.name].length - 3} more` : ''}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                              <span className="text-[10px] text-slate-400">空缺</span>
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'calendar' && (
        /* ── Calendar View ── */
        <div className="space-y-4">
          {ELITE_STAFF.map((staff) => {
            const colors = STAFF_COLORS[staff.name];
            return (
              <div key={staff.id} className="glass-card rounded-xl border border-slate-200 overflow-hidden">
                <div className={`px-4 py-2.5 flex items-center gap-2 ${colors.bg} border-b ${colors.border}`}>
                  <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                  <span className={`text-xs font-bold ${colors.text}`}>{staff.name}</span>
                  <span className="text-[10px] text-slate-500 ml-auto">{staff.role}</span>
                </div>
                <div className="overflow-x-auto">
                  <div className="flex min-w-max">
                    {dates.map((date, i) => {
                      const dayActs = staffSchedule[staff.name][date] || [];
                      const d = new Date(date);
                      const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                      const isToday = i === 0;
                      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                      return (
                        <div key={date} className={`flex-shrink-0 w-[90px] border-r border-slate-100 last:border-r-0 ${isToday ? 'bg-teal-50/60' : isWeekend ? 'bg-warm-50/50' : ''}`}>
                          <div className="px-1.5 py-1.5 text-center border-b border-slate-100">
                            <p className="text-[9px] text-slate-400 font-medium">{dayNames[d.getDay()]}</p>
                            <p className={`text-xs font-bold ${isToday ? 'text-teal-600' : 'text-slate-600'}`}>{String(d.getDate()).padStart(2,'0')}/{String(d.getMonth()+1).padStart(2,'0')}</p>
                          </div>
                          <div className="px-1 py-1 space-y-0.5 min-h-[64px]">
                            {dayActs.length > 0 ? dayActs.map((act, j) => (
                              <div key={j} className={`text-[8px] px-1 py-0.5 rounded leading-tight ${colors.bg} ${colors.text} font-medium truncate`} title={`${act.time} — ${act.patient}`}>
                                {act.time} {act.patient.split(' ').pop()}
                              </div>
                            )) : <div className="text-[9px] text-slate-300 text-center pt-3">—</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Profile Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-teal-900/30 backdrop-blur-md" onClick={() => setSelectedStaff(null)}>
          <div className="glass-card rounded-2xl shadow-2xl w-[480px] max-h-[85vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Award className="w-4 h-4 text-teal-600" /> Staff Profile</h3>
              <button onClick={() => setSelectedStaff(null)} className="w-7 h-7 rounded-lg hover:bg-warm-100 flex items-center justify-center"><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 shadow-xl border-4 border-white">
                  <img src={selectedStaff.avatar} alt={selectedStaff.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">{selectedStaff.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-slate-500">{selectedStaff.role}</p>
                    <span className="text-[10px] text-slate-300">·</span>
                    <span className="text-[10px] text-slate-400">{selectedStaff.gender === 'Female' ? '♀' : '♂'} {selectedStaff.age} yrs</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: Math.min(5, Math.ceil(selectedStaff.yearsExperience / 5)) }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1">{selectedStaff.yearsExperience} yrs exp</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-warm-50 rounded-lg p-2.5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">经验</span>
                    <p className="font-bold text-slate-700 mt-0.5">{selectedStaff.yearsExperience} years</p>
                  </div>
                  <div className="bg-warm-50 rounded-lg p-2.5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">教育</span>
                    <p className="font-bold text-slate-700 mt-0.5 text-[10px] leading-snug">{selectedStaff.education}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">专科</span>
                  <p className="text-xs text-slate-700 mt-0.5">{selectedStaff.specialty}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">机构</span>
                  <p className="text-xs text-slate-700 mt-0.5">{selectedStaff.institution}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">资质</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedStaff.certifications.map((cert, i) => (
                      <span key={i} className="text-[9px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">{cert}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">简介</span>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{selectedStaff.bio}</p>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" /> +852 9123 4567</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedStaff.name.toLowerCase().replace(/\s/g,'.')}@ihomecare.hk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export const MessagesPage: FC = () => (
  <div className="p-6">
    <PageHeader title="Messages" icon={MessageCircle} subtitle={`${HUB_MESSAGES.filter(m => m.unread).length} unread · ${HUB_MESSAGES.length} messages`} />
    <div className="glass-card rounded-2xl border border-slate-200 divide-y divide-slate-100">
      {HUB_MESSAGES.map((m, i) => (
        <div key={i} className={`px-4 py-3 hover:bg-warm-100 cursor-pointer ${m.unread ? 'bg-teal-50/30' : ''}`}>
          <div className="flex items-center justify-between mb-0.5"><span className="text-xs font-bold text-slate-700">{m.from}</span><span className="text-[10px] text-slate-400">{m.time}</span></div>
          <p className="text-xs font-semibold text-slate-600">{m.subject}</p>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{m.preview}</p>
        </div>
      ))}
    </div>
  </div>
);



export const KnowledgeBase: FC = () => (
  <div className="p-6">
    <PageHeader title="Clinical Knowledge Base" icon={BookOpen} subtitle="Clinical references, protocols, and best practice guidelines" />
    <div className="grid grid-cols-2 gap-4">
      {[{ title: 'Post-PCI Home Care Protocol', category: 'Cardiology', updated: '2026 Q2' }, { title: 'COPD Exacerbation Management', category: 'Pulmonology', updated: '2026 Q1' }, { title: 'Diabetes Home Monitoring Guide', category: 'Endocrinology', updated: '2025 Q4' }, { title: 'CKD Stage 3-4 Care Standards', category: 'Nephrology', updated: '2026 Q1' }, { title: 'Stroke Rehabilitation Protocol', category: 'Neurology', updated: '2025 Q3' }, { title: 'Wound Care Best Practices', category: 'Nursing', updated: '2026 Q2' }].map((a, i) => (
        <div key={i} className="glass-card rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"><p className="text-sm font-semibold text-slate-800">{a.title}</p><p className="text-xs text-slate-400 mt-1">{a.category} · Updated: {a.updated}</p></div>
      ))}
    </div>
  </div>
);
