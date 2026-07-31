import { type FC, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type PatientSummary, usePatientStore } from '../store/patientStore';
import { useCollaborationStore } from '../store/collaborationStore';
import { getPatientCoords, HK_MAP_BOUNDS_NE, HK_MAP_BOUNDS_SW, HK_MAP_DEFAULT_VIEW_NE, HK_MAP_DEFAULT_VIEW_SW } from '../data/hkGeo';
import { getMapActiveVisit, getMapServiceDotColor, MAP_SERVICE_LEGEND } from '../utils/mapServiceStatus';

const HK_BOUNDS = L.latLngBounds(HK_MAP_BOUNDS_SW, HK_MAP_BOUNDS_NE);
const HK_DEFAULT_VIEW = L.latLngBounds(HK_MAP_DEFAULT_VIEW_SW, HK_MAP_DEFAULT_VIEW_NE);
const MAP_VIEW_PADDING: L.PointExpression = [24, 32];

function applyHongKongViewport(map: L.Map) {
  map.fitBounds(HK_DEFAULT_VIEW, { padding: MAP_VIEW_PADDING, animate: false });
  const minZoom = map.getBoundsZoom(HK_DEFAULT_VIEW, false, MAP_VIEW_PADDING);
  map.setMinZoom(minZoom);
  map.setMaxBounds(HK_BOUNDS);
  if (map.getZoom() < minZoom) map.setZoom(minZoom);
}
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const MapView: FC<{ patients: PatientSummary[] }> = ({ patients }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const navigate = useNavigate();
  const carePlans = usePatientStore(s => s.carePlans);
  const carePlanStatus = useCollaborationStore(s => s.carePlanStatus);
  const demoMapVisitsByPatient = useCollaborationStore(s => s.demoMapVisitsByPatient);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      maxBoundsViscosity: 1.0,
      worldCopyJump: false,
    });
    applyHongKongViewport(map);
    mapInstance.current = map;

    // Add zoom control to bottom-left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: ['a', 'b', 'c', 'd'],
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
      bounds: HK_BOUNDS,
      noWrap: true,
      className: 'map-tiles-light',
    }).addTo(map);

    // Force resize after render + refit HK bounds
    requestAnimationFrame(() => {
      map.invalidateSize();
      applyHongKongViewport(map);
      setTimeout(() => { map.invalidateSize(); applyHongKongViewport(map); }, 100);
      setTimeout(() => { map.invalidateSize(); applyHongKongViewport(map); }, 500);
    });

    map.on('resize', () => {
      map.invalidateSize();
      applyHongKongViewport(map);
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    patients.forEach(p => {
      const coords = getPatientCoords(p);
      const severityColor = p.newsTier === 'high' ? '#ef4444' : p.newsTier === 'medium' ? '#f59e0b' : '#10b981';
      const pulse = p.newsTier === 'high' ? 'pulse-crit' : p.newsTier === 'medium' ? 'pulse-attn' : 'pulse-stable';

      const activeVisit = getMapActiveVisit(carePlans[p.id], p.id, carePlanStatus, demoMapVisitsByPatient);
      const serviceStatus = activeVisit?.status ?? 'none';
      const dotColor = getMapServiceDotColor(serviceStatus);
      const dotPulse = serviceStatus !== 'none' ? 'service-dot-active' : '';
      const serviceLabel = activeVisit?.provider
        ? `${activeVisit.provider} · ${MAP_SERVICE_LEGEND.find(item => item.status === serviceStatus)?.label ?? 'On visit'}`
        : MAP_SERVICE_LEGEND.find(item => item.status === serviceStatus)?.label ?? 'No active visit';

      const icon = new L.DivIcon({
        className: 'avatar-marker',
        html: `<div class="${pulse}"><div class="avatar-ring" style="border-color:${severityColor}"><img src="/avatars/patient-${p.id}.png" class="avatar-img" /><span class="service-dot ${dotPulse}" style="background:${dotColor}"></span></div></div>`,
        iconSize: [41, 41], iconAnchor: [21, 21], popupAnchor: [0, -23],
      });

      const marker = L.marker(coords, { icon }).addTo(map);

      const popupContent = `
        <div style="min-width:220px;font-family:sans-serif">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <div style="background:${p.newsTier === 'high' ? '#fecaca' : p.newsTier === 'medium' ? '#fef3c7' : p.newsRedScore ? '#ffedd5' : '#d1fae5'};border-radius:8px;padding:4px 8px;font-size:11px;font-weight:700;color:${p.newsTier === 'high' ? '#991b1b' : p.newsTier === 'medium' ? '#92400e' : p.newsRedScore ? '#9a3412' : '#065f46'}">
              ${p.newsTier === 'high' ? 'NEWS HIGH' : p.newsTier === 'medium' ? 'NEWS MEDIUM' : p.newsRedScore ? 'RED SCORE' : 'NEWS LOW'} (${p.newsScore})
            </div>
            <span style="font-size:14px;font-weight:700">${p.name}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;font-size:10px;color:#475569">
            <span style="width:8px;height:8px;border-radius:50%;background:${dotColor};border:1px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,0.08)"></span>
            <span>${serviceLabel}</span>
          </div>
          <div style="font-size:11px;color:#64748b;line-height:1.5;margin-bottom:8px">
            <b>${p.age}y</b> · ${p.diagnosis}<br/>
            📍 ${p.address}<br/>
            🏥 ${p.hospital}<br/>
            👨‍⚕️ ${p.doctor}<br/>
            📊 HR:${p.hr} BP:${p.bpSystolic}/${p.bpDiastolic} SpO₂:${p.spo2}% Temp:${p.temp}°C<br/>
            ⏱ ${p.newsMonitoringLabel}${p.newsRedScore ? ' · RED score' : ''}
          </div>
          <button onclick="window.__selectPatient && window.__selectPatient(${p.id})" 
            style="display:block;width:100%;padding:6px;background:#0A5C6A;color:white;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer">
            View Patient Profile →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300 });
      markersRef.current.push(marker);
    });
  }, [patients, carePlans, carePlanStatus, demoMapVisitsByPatient]);

  // Expose click handler for popup buttons
  useEffect(() => {
    (window as any).__selectPatient = (id: number) => {
      navigate(`/patient/${id}`);
    };
    return () => { delete (window as any).__selectPatient; };
  }, [patients, navigate]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100" />
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl border border-slate-200 shadow-md px-3 py-2.5 pointer-events-none">
        <p className="text-[10px] font-bold text-slate-700 mb-2 uppercase tracking-wide">照护员访视状态</p>
        <div className="space-y-1.5">
          {MAP_SERVICE_LEGEND.map(item => (
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
    </div>
  );
};

export default MapView;
