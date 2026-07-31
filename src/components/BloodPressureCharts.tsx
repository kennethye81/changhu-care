import { type FC, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ReferenceArea, ReferenceLine,
  ResponsiveContainer, Legend,
} from 'recharts';
import { Activity } from 'lucide-react';
import {
  getVitalColor, resolveThresholds, VITAL_RANGE_KIND,
  type VitalsPoint, type VitalRangeKind,
} from '../data/vitalSigns';

const LINE_SYS_NORMAL = '#0d9488';
const LINE_SYS_ABNORMAL = '#ef4444';
const LINE_SYS_AMBER = '#f59e0b';
const LINE_DIA_NORMAL = '#6366f1';
const LINE_DIA_AMBER = '#d97706';
const LINE_DIA_ABNORMAL = '#dc2626';
const SYS_TARGET_FILL = '#d1fae5';
const SYS_TARGET_STROKE = '#86efac';
const DIA_TARGET_FILL = '#e0e7ff';
const DIA_TARGET_STROKE = '#a5b4fc';

type ChartRow = VitalsPoint & Record<string, number | string | null>;

function buildZoneSeries(
  data: VitalsPoint[],
  dataKey: string,
  threshold: { green: [number, number]; amber: [number, number] },
  kind: VitalRangeKind,
): ChartRow[] {
  const normalKey = `${dataKey}__normal`;
  const amberKey = `${dataKey}__amber`;
  const abnormalKey = `${dataKey}__abnormal`;

  return data.map((pt, i) => {
    const v = pt[dataKey as keyof VitalsPoint] as number;
    const zone = getVitalColor(v, threshold, kind);
    const prevV = i > 0 ? (data[i - 1][dataKey as keyof VitalsPoint] as number) : v;
    const prevZone = i > 0 ? getVitalColor(prevV, threshold, kind) : zone;
    const bridge = i > 0 && zone !== prevZone;

    const inTarget = zone === 'green';
    const borderline = zone === 'amber';

    let normalVal: number | null = inTarget ? v : null;
    let amberVal: number | null = borderline ? v : null;
    let abnormalVal: number | null = zone === 'red' ? v : null;

    if (bridge) {
      normalVal = v;
      amberVal = v;
      abnormalVal = v;
    }

    return {
      ...pt,
      [normalKey]: normalVal,
      [amberKey]: amberVal,
      [abnormalKey]: abnormalVal,
    };
  });
}

function mergeBpChartData(
  fullData: VitalsPoint[],
  sysThreshold: { green: [number, number]; amber: [number, number] },
  diaThreshold: { green: [number, number]; amber: [number, number] },
): ChartRow[] {
  const sysRows = buildZoneSeries(fullData, 'bpSystolic', sysThreshold, VITAL_RANGE_KIND.bpSystolic ?? 'bounded');
  const diaRows = buildZoneSeries(fullData, 'bpDiastolic', diaThreshold, VITAL_RANGE_KIND.bpDiastolic ?? 'bounded');
  return sysRows.map((row, i) => ({
    ...row,
    bpDiastolic__normal: diaRows[i].bpDiastolic__normal,
    bpDiastolic__amber: diaRows[i].bpDiastolic__amber,
    bpDiastolic__abnormal: diaRows[i].bpDiastolic__abnormal,
  }));
}

/** Hub — 24h hourly BP chart (SYS + DIA dual line). */
export const HubBloodPressureChart: FC<{
  fullData: VitalsPoint[];
  sysThreshold: { green: [number, number]; amber: [number, number] };
  diaThreshold: { green: [number, number]; amber: [number, number] };
}> = ({ fullData, sysThreshold, diaThreshold }) => {
  const chartData = useMemo(
    () => mergeBpChartData(fullData, sysThreshold, diaThreshold),
    [fullData, sysThreshold, diaThreshold],
  );

  const sysVals = fullData.map(d => d.bpSystolic);
  const diaVals = fullData.map(d => d.bpDiastolic);
  const allVals = [...sysVals, ...diaVals];
  const dataMin = Math.min(...allVals);
  const dataMax = Math.max(...allVals);
  const pad = Math.max(4, (dataMax - dataMin) * 0.12);
  const yMin = Math.floor(dataMin - pad);
  const yMax = Math.ceil(dataMax + pad);

  const latestSys = sysVals[sysVals.length - 1];
  const latestZone = getVitalColor(latestSys, sysThreshold, 'bounded');
  const zoneLabel = latestZone === 'green' ? 'Normal' : latestZone === 'amber' ? 'Borderline' : 'Out of range';
  const zoneClass = latestZone === 'green' ? 'text-emerald-600 bg-emerald-50' : latestZone === 'amber' ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
  const sysRefLow = sysThreshold.green[0];
  const sysRefHigh = sysThreshold.green[1];
  const diaRefLow = diaThreshold.green[0];
  const diaRefHigh = diaThreshold.green[1];

  return (
    <div className="glass-card rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Activity className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <h3 className="text-sm font-bold text-slate-800 truncate">Blood Pressure (SYS / DIA)</h3>
          <span className="text-[10px] text-slate-400 flex-shrink-0">mmHg</span>
        </div>
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${zoneClass}`}>{zoneLabel}</span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={chartData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 9, fill: '#94a3b8' }}
            interval={3}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 9, fill: '#94a3b8' }}
            width={36}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={{ stroke: '#e2e8f0' }}
          />
          <ReferenceArea y1={sysRefLow} y2={sysRefHigh} fill={SYS_TARGET_FILL} fillOpacity={0.35} strokeOpacity={0} />
          <ReferenceArea y1={diaRefLow} y2={diaRefHigh} fill={DIA_TARGET_FILL} fillOpacity={0.45} strokeOpacity={0} />
          <ReferenceLine y={sysRefLow} stroke={SYS_TARGET_STROKE} strokeWidth={1} strokeOpacity={0.7} strokeDasharray="4 3" />
          <ReferenceLine y={sysRefHigh} stroke={SYS_TARGET_STROKE} strokeWidth={1} strokeOpacity={0.7} strokeDasharray="4 3" />
          <ReferenceLine y={diaRefLow} stroke={DIA_TARGET_STROKE} strokeWidth={1} strokeOpacity={0.7} strokeDasharray="4 3" />
          <ReferenceLine y={diaRefHigh} stroke={DIA_TARGET_STROKE} strokeWidth={1} strokeOpacity={0.7} strokeDasharray="4 3" />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
            formatter={(v: number, name: string) => {
              if (name === 'DIA' || name === 'Diastolic') return [`${v} mmHg`, 'Diastolic'];
              return [`${v} mmHg`, 'Systolic'];
            }}
            labelFormatter={(_t: string, payload) => (payload?.[0]?.payload as VitalsPoint)?.dateTime ?? _t}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="plainline"
            wrapperStyle={{ fontSize: 9, paddingBottom: 4 }}
          />
          <Line type="linear" dataKey="bpSystolic__normal" name="SYS" stroke={LINE_SYS_NORMAL} strokeWidth={2} dot={false} connectNulls isAnimationActive={false} />
          <Line type="linear" dataKey="bpSystolic__amber" stroke={LINE_SYS_AMBER} strokeWidth={2} dot={false} connectNulls isAnimationActive={false} legendType="none" />
          <Line type="linear" dataKey="bpSystolic__abnormal" stroke={LINE_SYS_ABNORMAL} strokeWidth={2} dot={false} connectNulls isAnimationActive={false} legendType="none" />
          <Line type="linear" dataKey="bpDiastolic__normal" name="DIA" stroke={LINE_DIA_NORMAL} strokeWidth={2} dot={false} connectNulls isAnimationActive={false} />
          <Line type="linear" dataKey="bpDiastolic__amber" stroke={LINE_DIA_AMBER} strokeWidth={2} dot={false} connectNulls isAnimationActive={false} legendType="none" />
          <Line type="linear" dataKey="bpDiastolic__abnormal" stroke={LINE_DIA_ABNORMAL} strokeWidth={2} dot={false} connectNulls isAnimationActive={false} legendType="none" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

function smoothLinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1] ?? p1;
    const cp1x = p0.x + (p1.x - p0.x) / 3;
    const cp1y = p0.y + (p1.y - p0.y) / 3;
    const cp2x = p1.x - (p2.x - p0.x) / 6;
    const cp2y = p1.y - (p2.y - p0.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
  }
  return d;
}

function buildDualYScale(sys: number[], dia: number[]) {
  const all = [...sys, ...dia];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 4;
  const pad = span * 0.15;
  const yMin = min - pad;
  const yMax = max + pad;
  const mid = (yMin + yMax) / 2;
  return { yMin, yMax, ticks: [yMax, mid, yMin] };
}

/** Family — compact dual-line sparkline (Home cards). */
export const FamilyBloodPressureSparkline: FC<{
  sys: number[];
  dia: number[];
  sysColor: string;
}> = ({ sys, dia, sysColor }) => {
  const w = 64;
  const h = 32;
  const sysSeries = sys;
  const diaSeries = dia.length === sys.length ? dia : sys;
  const { yMin, yMax } = buildDualYScale(sysSeries, diaSeries);
  const range = yMax - yMin || 1;
  const toCoords = (series: number[]) =>
    series.map((v, i) => ({
      x: (i / (series.length - 1)) * w,
      y: 2 + (h - 4) * (1 - (v - yMin) / range),
    }));

  const sysCoords = toCoords(sysSeries);
  const diaCoords = toCoords(diaSeries);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-16 h-8 flex-shrink-0" aria-hidden>
      <path d={smoothLinePath(diaCoords)} fill="none" stroke={LINE_DIA_NORMAL} strokeWidth={1.75} strokeLinecap="round" />
      <path d={`${smoothLinePath(sysCoords)} L ${w},${h} L 0,${h} Z`} fill={`${sysColor}14`} />
      <path d={smoothLinePath(sysCoords)} fill="none" stroke={sysColor} strokeWidth={2} strokeLinecap="round" />
      <circle cx={sysCoords[sysCoords.length - 1].x} cy={sysCoords[sysCoords.length - 1].y} r={2} fill={sysColor} />
    </svg>
  );
};

/** Family — 72h dual-line trend chart (Vitals detail). */
export const FamilyBloodPressureTrendChart: FC<{
  sys: number[];
  dia: number[];
  sysColor: string;
  plotW?: number;
  plotH?: number;
  labels: { date: string; time: string }[];
  xLabelEvery?: number;
}> = ({ sys, dia, sysColor, plotW = 280, plotH = 62, labels, xLabelEvery = 3 }) => {
  const { yMin, yMax, ticks: yTicks } = buildDualYScale(sys, dia);
  const yRange = yMax - yMin || 1;
  const padTop = 2;

  const toCoords = (series: number[]) =>
    series.map((v, i) => ({
      x: (i / (series.length - 1)) * plotW,
      y: padTop + plotH * (1 - (v - yMin) / yRange),
    }));

  const sysCoords = toCoords(sys);
  const diaCoords = toCoords(dia);
  const sysPath = smoothLinePath(sysCoords);
  const diaPath = smoothLinePath(diaCoords);

  const xLabelIndices = labels
    .map((_, i) => i)
    .filter(i => i % xLabelEvery === 0 || i === labels.length - 1);

  return (
    <div className="relative w-full pt-2 border-t border-slate-50">
      <div className="flex items-center justify-between mb-1.5 pr-0.5">
        <span className="text-[9px] font-semibold text-slate-500">72-Hour Trend</span>
        <div className="flex items-center gap-2 text-[8px] text-slate-500">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-teal-600 inline-block rounded" /> SYS</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" /> DIA</span>
        </div>
      </div>
      <div className="flex gap-1.5">
        <div className="flex flex-col justify-between w-7 flex-shrink-0 text-right" style={{ height: plotH, paddingTop: 2 }}>
          {yTicks.map((v, i) => (
            <span key={i} className="text-[7px] leading-none text-slate-400 tabular-nums">{Math.round(v)}</span>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <svg viewBox={`0 0 ${plotW} ${plotH + padTop}`} className="w-full" style={{ height: plotH }} preserveAspectRatio="none">
            {yTicks.map((v, i) => {
              const y = padTop + plotH * (1 - (v - yMin) / yRange);
              return <line key={i} x1={0} y1={y} x2={plotW} y2={y} stroke="#f1f5f9" strokeWidth={0.75} />;
            })}
            <path d={diaPath} fill="none" stroke={LINE_DIA_NORMAL} strokeWidth={2} strokeLinecap="round" />
            <path d={`${sysPath} L ${plotW},${padTop + plotH} L 0,${padTop + plotH} Z`} fill={`${sysColor}18`} />
            <path d={sysPath} fill="none" stroke={sysColor} strokeWidth={2.25} strokeLinecap="round" />
            <circle cx={sysCoords[sysCoords.length - 1].x} cy={sysCoords[sysCoords.length - 1].y} r={2.75} fill={sysColor} />
            <circle cx={diaCoords[diaCoords.length - 1].x} cy={diaCoords[diaCoords.length - 1].y} r={2.25} fill={LINE_DIA_NORMAL} />
          </svg>
          <div className="relative h-7 mt-0.5">
            {xLabelIndices.map(i => {
              const lbl = labels[i];
              const pct = (i / (labels.length - 1)) * 100;
              const align = i === 0 ? 'left' : i === labels.length - 1 ? 'right' : 'center';
              return (
                <div
                  key={i}
                  className="absolute top-0 whitespace-nowrap"
                  style={{
                    left: `${pct}%`,
                    transform: align === 'center' ? 'translateX(-50%)' : align === 'right' ? 'translateX(-100%)' : undefined,
                  }}
                >
                  <p className="text-[7px] leading-tight text-slate-400">{lbl.date}</p>
                  <p className="text-[7px] leading-tight text-slate-500">{lbl.time}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { resolveThresholds };

/** Hub modal — 2h dual-line BP trend (matches PatientDetailModal card style). */
export const CompactDualLineTrendSvg: FC<{
  sys: number[];
  dia: number[];
  sysColor: string;
  width?: number;
  height?: number;
  padTop?: number;
  timeLabels: string[];
  timeLabelIndices?: number[];
  idSuffix?: string;
}> = ({
  sys,
  dia,
  sysColor,
  width: W = 480,
  height: H = 80,
  padTop: PAD = 40,
  timeLabels,
  timeLabelIndices = [0, 2, 4, 6, 8],
  idSuffix = 'bp',
}) => {
  const { yMin, yMax } = buildDualYScale(sys, dia);
  const range = yMax - yMin || 1;
  const toY = (val: number) => PAD + H - ((val - yMin) / range) * H;
  const toCoords = (series: number[]) =>
    series.map((val, di) => ({
      x: di * (W / (series.length - 1)),
      y: toY(val),
    }));

  const buildSmoothPathFromCoords = (coords: { x: number; y: number }[]): string => {
    if (coords.length < 2) return '';
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const cx = (coords[i - 1].x + coords[i].x) / 2;
      d += ` C ${cx} ${coords[i - 1].y}, ${cx} ${coords[i].y}, ${coords[i].x} ${coords[i].y}`;
    }
    return d;
  };

  const sysCoords = toCoords(sys);
  const diaCoords = toCoords(dia);
  const sysPath = buildSmoothPathFromCoords(sysCoords);
  const diaPath = buildSmoothPathFromCoords(diaCoords);

  return (
    <svg viewBox={`0 0 ${W} ${H + PAD + 12}`} className="w-full h-20">
      {[0, 1].map((gi) => (
        <line key={gi} x1={0} y1={PAD + gi * H} x2={W} y2={PAD + gi * H} stroke="#f1f5f9" strokeWidth="1" />
      ))}
      <defs>
        <linearGradient id={`gradv-dual-${idSuffix}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sysColor} stopOpacity="0.12" />
          <stop offset="100%" stopColor={sysColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={diaPath} fill="none" stroke={LINE_DIA_NORMAL} strokeWidth="2" strokeLinecap="round" />
      <path d={sysPath} fill="none" stroke={sysColor} strokeWidth="2" strokeLinecap="round" />
      <path d={`${sysPath} V ${PAD + H} H 0 Z`} fill={`url(#gradv-dual-${idSuffix})`} />
      {timeLabelIndices.map((ti) => (
        <text key={ti} x={(ti / (timeLabels.length - 1)) * W} y={H + PAD + 12} textAnchor="middle" className="text-[8px]" fill="#94a3b8">{timeLabels[ti]}</text>
      ))}
      {sysCoords.map((pt, di) => (
        <circle key={`s-${di}`} cx={pt.x} cy={pt.y} r="2" fill={sysColor} />
      ))}
      {diaCoords.map((pt, di) => (
        <circle key={`d-${di}`} cx={pt.x} cy={pt.y} r="1.75" fill={LINE_DIA_NORMAL} />
      ))}
      <g transform={`translate(${W - 72}, ${PAD + 4})`}>
        <line x1={0} y1={0} x2={14} y2={0} stroke={sysColor} strokeWidth="2" />
        <text x={18} y={3} className="text-[7px]" fill="#64748b">SYS</text>
        <line x1={0} y1={10} x2={14} y2={10} stroke={LINE_DIA_NORMAL} strokeWidth="2" />
        <text x={18} y={13} className="text-[7px]" fill="#64748b">DIA</text>
      </g>
    </svg>
  );
};
