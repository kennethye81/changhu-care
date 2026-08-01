import { type FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type PatientSummary, usePatientStore } from '../store/patientStore';
import { useCollaborationStore } from '../store/collaborationStore';
import { getPatientCoords } from '../data/hkGeo';
import { getMapActiveVisit, getMapServiceDotColor, type MapServiceStatus } from '../utils/mapServiceStatus';

/* ──────────────────── 访视状态图例（中文） ──────────────────── */
const SERVICE_LEGEND_CN: { status: MapServiceStatus | 'all'; color: string; label: string }[] = [
  { status: 'nurse',           color: '#22c55e', label: '护士访视中' },
  { status: 'therapy',         color: '#3b82f6', label: '康复师访视中' },
  { status: 'care_worker',     color: '#ec4899', label: '照护师访视中' },
  { status: 'none',            color: '#94a3b8', label: '无活跃访视' },
];

const STATUS_LABEL_MAP: Record<string, string> = {
  nurse: '护士访视中',
  therapy: '康复师访视中',
  care_worker: '照护师访视中',
  none: '无活跃访视',
};

/* ──────────────────── Leaflet 默认图标 ──────────────────── */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ──────────────────── NEWS 层级中文 ──────────────────── */
function newsLabel(tier: string, redScore: boolean, score: number): string {
  if (tier === 'high') return `高危 (${score}分)`;
  if (tier === 'medium') return `中危 (${score}分)`;
  if (redScore) return `红色预警 (${score}分)`;
  return `低危 (${score}分)`;
}

function newsBadgeStyle(tier: string, redScore: boolean) {
  if (tier === 'high') return { bg: '#fecaca', color: '#991b1b' };
  if (tier === 'medium') return { bg: '#fef3c7', color: '#92400e' };
  if (redScore) return { bg: '#ffedd5', color: '#9a3412' };
  return { bg: '#d1fae5', color: '#065f46' };
}

/* ════════════════════════════════════════════ 组件 ════════════════════════════════════════════ */

const MapView: FC<{ patients: PatientSummary[]; onClose?: () => void }> = ({ patients, onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const featureGroup = useRef<L.FeatureGroup>(L.featureGroup());
  const navigate = useNavigate();
  const carePlans = usePatientStore(s => s.carePlans);
  const carePlanStatus = useCollaborationStore(s => s.carePlanStatus);
  const demoMapVisitsByPatient = useCollaborationStore(s => s.demoMapVisitsByPatient);
  const [mapReady, setMapReady] = useState(false);

  /* ── 初始化地图（仅一次） ── */
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      maxBoundsViscosity: 1.0,
      worldCopyJump: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: ['a', 'b', 'c', 'd'],
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
      className: 'map-tiles-light',
    }).addTo(map);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    featureGroup.current.addTo(map);

    // 常州默认视图（仅初始，标记后自动 fitBounds）
    map.setView([31.8, 119.97], 11);

    // resize 修复
    const raf = requestAnimationFrame(() => {
      map.invalidateSize();
      setTimeout(() => map.invalidateSize(), 100);
    });

    map.on('resize', () => map.invalidateSize());

    mapInstance.current = map;
    setMapReady(true);

    return () => {
      cancelAnimationFrame(raf);
      map.remove();
      mapInstance.current = null;
      setMapReady(false);
    };
  }, []);

  /* ── 更新标记 ── */
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady) return;

    const fg = featureGroup.current;
    fg.clearLayers();

    patients.forEach(p => {
      const coords = getPatientCoords(p);
      const severityColor = p.newsTier === 'high' ? '#ef4444' : p.newsTier === 'medium' ? '#f59e0b' : '#10b981';
      const pulse = p.newsTier === 'high' ? 'pulse-crit' : p.newsTier === 'medium' ? 'pulse-attn' : 'pulse-stable';

      const activeVisit = getMapActiveVisit(carePlans[p.id], p.id, carePlanStatus, demoMapVisitsByPatient);
      const serviceStatus = activeVisit?.status ?? 'none';
      const dotColor = getMapServiceDotColor(serviceStatus);
      const dotPulse = serviceStatus !== 'none' ? 'service-dot-active' : '';
      const serviceLabel = activeVisit?.provider
        ? `${activeVisit.provider} · ${STATUS_LABEL_MAP[serviceStatus] ?? '访视中'}`
        : STATUS_LABEL_MAP[serviceStatus] ?? '无活跃访视';

      const badge = newsBadgeStyle(p.newsTier, p.newsRedScore);

      const icon = new L.DivIcon({
        className: 'avatar-marker',
        html: `<div class="${pulse}"><div class="avatar-ring" style="border-color:${severityColor}"><img src="/avatars/patient-${p.id}.png" class="avatar-img" /><span class="service-dot ${dotPulse}" style="background:${dotColor}"></span></div></div>`,
        iconSize: [41, 41], iconAnchor: [21, 21], popupAnchor: [0, -23],
      });

      const marker = L.marker(coords, { icon });

      const popupContent = `
        <div style="min-width:220px;font-family:sans-serif">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <div style="background:${badge.bg};border-radius:8px;padding:4px 8px;font-size:11px;font-weight:700;color:${badge.color}">${newsLabel(p.newsTier, p.newsRedScore, p.newsScore)}</div>
            <span style="font-size:14px;font-weight:700">${p.name}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:10px;color:#475569">
            <span style="width:8px;height:8px;border-radius:50%;background:${dotColor};border:1px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,0.08)"></span>
            <span>${serviceLabel}</span>
          </div>
          <div style="font-size:11px;color:#64748b;line-height:1.5;margin-bottom:8px">
            <b>${p.age}岁</b> · ${p.diagnosis}<br/>
            📋 评估等级：中度<br/>
            📍 ${p.address}<br/>
            🏥 ${p.hospital}<br/>
            👨‍⚕️ 个案经理：${p.caseManager || '待分配'}<br/>
            📊 心率:${p.hr} 血压:${p.bpSystolic}/${p.bpDiastolic} SpO₂:${p.spo2}% 体温:${p.temp}°C<br/>
            ⏱ ${p.newsMonitoringLabel}${p.newsRedScore ? ' · 红色预警' : ''}
          </div>
          <button onclick="window.__selectPatient && window.__selectPatient(${p.id})"
            style="display:block;width:100%;padding:6px;background:#1B5E4F;color:white;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer">
            查看病人档案 →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300 });
      fg.addLayer(marker);
    });

    // 自动缩放至所有标记
    if (patients.length > 0) {
      const bounds = fg.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, animate: true });
      }
    }
  }, [patients, carePlans, carePlanStatus, demoMapVisitsByPatient, mapReady]);

  /* ── 弹窗按钮导航 ── */
  useEffect(() => {
    (window as any).__selectPatient = (id: number) => navigate(`/patient/${id}`);
    return () => { delete (window as any).__selectPatient; };
  }, [navigate]);

  /* ── 渲染（Portal 至 body，绕过 MainLayout overflow） ── */
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-white" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
      <div ref={mapRef} className="w-full h-full" />
      {/* 关闭按钮 */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-[1001] bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-md px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          ← 返回
        </button>
      )}
      {/* 图例 */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-md px-3 py-2.5 pointer-events-none">
        <p className="text-[10px] font-bold text-slate-700 mb-2 tracking-wide">照护员访视状态</p>
        <div className="space-y-1.5">
          {SERVICE_LEGEND_CN.map(item => (
            <div key={item.status} className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full border border-white shadow-sm flex-shrink-0 ${item.status !== 'none' ? 'service-dot-active' : ''}`}
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] text-slate-600 leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MapView;
