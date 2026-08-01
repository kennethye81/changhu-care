import { type FC, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ReferenceArea,
  ResponsiveContainer,
} from 'recharts';
import { Heart, Activity, Droplets, Thermometer, Brain, Wind } from 'lucide-react';
import {
  generateVitalSigns, generateVitalsSummary,
  PATIENT_THRESHOLDS, getVitalColor, resolveThresholds,
  VITAL_RECORD_HOURS, VITAL_RANGE_KIND,
  type VitalsPoint, type VitalRangeKind,
} from '../data/vitalSigns';
import { type PatientFull } from '../data/patients';
import { DEFAULT_VITALS, usePatientStore } from '../store/patientStore';
import {
  buildOverallNewsAssessment,
  buildP7ClinicalRecommendations,
  buildVitalParameterAssessment,
} from '../utils/medicalHistoryNews';
import { calculateNews, P7_NEWS_ESCALATION_VITALS } from '../utils/newsScore';
import { HubBloodPressureChart } from './BloodPressureCharts';

const LINE_NORMAL = '#006F80';
const LINE_ABNORMAL = '#ef4444';
const LINE_AMBER = '#f59e0b';

type ChartRow = VitalsPoint & Record<string, number | string | null>;

/** Split series at zone boundaries but bridge transition points so lines stay continuous (NEWS-style trend). */
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

const VitalChart: FC<{
  title: string; unit: string; icon: FC<{ className?: string }>;
  dataKey: string;
  rangeKind: VitalRangeKind;
  threshold: { green: [number, number]; amber: [number, number] };
  fullData: VitalsPoint[];
  yMin?: number; yMax?: number;
}> = ({ title, unit, icon: Icon, dataKey, rangeKind, threshold, fullData, yMin: yMinProp, yMax: yMaxProp }) => {
  const normalKey = `${dataKey}__normal`;
  const amberKey = `${dataKey}__amber`;
  const abnormalKey = `${dataKey}__abnormal`;
  const chartData = useMemo(
    () => buildZoneSeries(fullData, dataKey, threshold, rangeKind),
    [fullData, dataKey, threshold, rangeKind],
  );

  const allVals = fullData.map(d => d[dataKey as keyof VitalsPoint] as number);
  const latest = allVals[allVals.length - 1];
  const dataMin = Math.min(...allVals);
  const dataMax = Math.max(...allVals);
  const yMin = yMinProp ?? Math.floor(Math.min(dataMin, threshold.green[0] - 5));
  const yMax = yMaxProp ?? Math.ceil(Math.max(dataMax, threshold.green[1] + 5));
  const latestZone = getVitalColor(latest, threshold, rangeKind);
  const zoneLabel = latestZone === 'green' ? 'Normal' : latestZone === 'amber' ? 'Borderline' : 'Out of range';
  const zoneClass = latestZone === 'green' ? 'text-emerald-600 bg-emerald-50' : latestZone === 'amber' ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
  const refLow = threshold.green[0];
  const refHigh = threshold.green[1];

  return (
    <div className="glass-card rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <h3 className="text-sm font-bold text-slate-800 truncate">{title}</h3>
          <span className="text-[10px] text-slate-400 flex-shrink-0">{unit}</span>
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
          <ReferenceArea y1={refLow} y2={refHigh} fill="#d1fae5" fillOpacity={0.4} strokeOpacity={0} />
          <ReferenceLine y={refLow} stroke="#86efac" strokeWidth={1} strokeOpacity={0.7} strokeDasharray="4 3" />
          <ReferenceLine y={refHigh} stroke="#86efac" strokeWidth={1} strokeOpacity={0.7} strokeDasharray="4 3" />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
            formatter={(v: number) => [`${v} ${unit}`, title]}
            labelFormatter={(_t: string, payload) => (payload?.[0]?.payload as VitalsPoint)?.dateTime ?? _t}
          />
          <Line
            type="linear"
            dataKey={normalKey}
            stroke={LINE_NORMAL}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: LINE_NORMAL }}
            isAnimationActive={false}
            connectNulls
          />
          <Line
            type="linear"
            dataKey={amberKey}
            stroke={LINE_AMBER}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: LINE_AMBER }}
            isAnimationActive={false}
            connectNulls
          />
          <Line
            type="linear"
            dataKey={abnormalKey}
            stroke={LINE_ABNORMAL}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: LINE_ABNORMAL }}
            isAnimationActive={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const VITAL_CHARTS = [
  { title: 'Respiratory Rate (RR)', unit: '/min', icon: Wind, dataKey: 'rr', thKey: 'rr' as const, yMin: 8, yMax: 32 },
  { title: 'Pulse (HR)', unit: 'bpm', icon: Heart, dataKey: 'hr', thKey: 'hr' as const },
  { title: 'Oxygen Saturation (SpO₂)', unit: '%', icon: Droplets, dataKey: 'spo2', thKey: 'spo2' as const },
  { title: 'Blood Glucose', unit: 'mg/dL', icon: Activity, dataKey: 'bloodSugar', thKey: 'bloodSugar' as const, yMin: 50, yMax: 280 },
  { title: 'Body Temperature', unit: '°C', icon: Thermometer, dataKey: 'temp', thKey: 'temp' as const, yMin: 34, yMax: 40 },
];

const VitalSignRecord: FC<{ patient: PatientFull }> = ({ patient }) => {
  const rawData = useMemo(() => generateVitalSigns(patient.id), [patient.id]);
  const p7Alert = usePatientStore(s => s.p7AlertActive);

  const data = useMemo(() => {
    if (!p7Alert || patient.id !== 7) return rawData;
    return rawData.map((pt, i) => {
      const total = rawData.length;
      const factor = Math.max(0, (i - (total - 4)) / 4);
      if (factor <= 0) return pt;
      return {
        ...pt,
        hr: Math.round(pt.hr + (98 - pt.hr) * factor * 0.6),
        bpSystolic: Math.round(pt.bpSystolic + (140 - pt.bpSystolic) * factor * 0.5),
        bpDiastolic: Math.round(pt.bpDiastolic + (86 - pt.bpDiastolic) * factor * 0.5),
        spo2: Math.round(pt.spo2 + (90 - pt.spo2) * factor * 0.7),
        temp: Math.round((pt.temp + (38.3 - pt.temp) * factor * 0.7) * 10) / 10,
        rr: Math.round(pt.rr + (26 - pt.rr) * factor * 0.6),
        bloodSugar: Math.round(pt.bloodSugar + (118 - pt.bloodSugar) * factor * 0.3),
      };
    });
  }, [rawData, p7Alert, patient.id]);

  const summary = useMemo(() => generateVitalsSummary(patient.id, data), [patient.id, data]);
  const th = PATIENT_THRESHOLDS[patient.id]?.thresholds
    ? resolveThresholds(PATIENT_THRESHOLDS[patient.id].thresholds)
    : undefined;

  const p7Active = p7Alert && patient.id === 7;
  const p7Vitals = P7_NEWS_ESCALATION_VITALS;
  const p7Baseline = DEFAULT_VITALS[7];
  const p7News = useMemo(
    () => (p7Active ? calculateNews(p7Vitals, patient.diagnosis) : null),
    [p7Active, patient.diagnosis],
  );
  const p7Assessment = (param: Parameters<typeof buildVitalParameterAssessment>[0]) =>
    buildVitalParameterAssessment(param, p7Vitals, patient.diagnosis, p7Baseline);

  if (!th || data.length === 0) return <div className="text-slate-400 p-8">No vital sign data available.</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5 text-teal-600" />
        <h2 className="text-base font-semibold text-slate-800">Vital Sign Record</h2>
        <span className="text-[10px] text-slate-400 ml-2">
          24h · hourly · {VITAL_RECORD_HOURS} readings · 6 parameters
        </span>
        {p7Alert && patient.id === 7 && (
          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full ml-auto">⚠ ALERT ACTIVE</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {VITAL_CHARTS.slice(0, 2).map(cfg => (
          <VitalChart
            key={cfg.dataKey}
            title={cfg.title}
            unit={cfg.unit}
            icon={cfg.icon}
            dataKey={cfg.dataKey}
            rangeKind={VITAL_RANGE_KIND[cfg.dataKey] ?? 'bounded'}
            threshold={th[cfg.thKey]}
            fullData={data}
            yMin={cfg.yMin}
            yMax={cfg.yMax}
          />
        ))}
        <HubBloodPressureChart fullData={data} sysThreshold={th.bpSystolic} diaThreshold={th.bpDiastolic} />
        {VITAL_CHARTS.slice(2).map(cfg => (
          <VitalChart
            key={cfg.dataKey}
            title={cfg.title}
            unit={cfg.unit}
            icon={cfg.icon}
            dataKey={cfg.dataKey}
            rangeKind={VITAL_RANGE_KIND[cfg.dataKey] ?? 'bounded'}
            threshold={th[cfg.thKey]}
            fullData={data}
            yMin={cfg.yMin}
            yMax={cfg.yMax}
          />
        ))}
      </div>

      <div className="glass-card rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-800">AI Clinical Summary</h3>
          <span className="text-[9px] text-slate-400 ml-1">Generated from 24h hourly · 6-parameter data</span>
        </div>
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <SummaryCard icon={Wind} label="Respiratory Rate" stats={{
              ...summary.rr,
              assessment: p7Active ? p7Assessment('rr') : summary.rr.assessment
            }} unit="/min" />
            <SummaryCard icon={Heart} label="Pulse (HR)" stats={{
              ...summary.hr,
              assessment: p7Active ? p7Assessment('hr') : summary.hr.assessment
            }} unit="bpm" />
            <SummaryCard icon={Activity} label="Blood Pressure (SYS/DIA)"
              stats={{
                mean: `${summary.bp.sysMean}/${summary.bp.diaMean}`,
                min: `${summary.bp.sysMin}/${Math.round(data.reduce((a, d) => Math.min(a, d.bpDiastolic), 200))}`,
                max: `${summary.bp.sysMax}/${Math.round(data.reduce((a, d) => Math.max(a, d.bpDiastolic), 0))}`,
                pctAmber: summary.bp.pctAmber,
                pctRed: summary.bp.pctRed,
                trend: summary.bp.trend,
                assessment: p7Active
                  ? `${p7Assessment('bpSystolic')} ${p7Assessment('bpDiastolic')}`
                  : `${summary.bp.assessment} Diastolic mean ${summary.bp.diaMean} mmHg — not scored in NEWS2.`,
              }}
              unit="mmHg" />
            <SummaryCard icon={Droplets} label="SpO₂" stats={{
              ...summary.spo2,
              assessment: p7Active ? p7Assessment('spo2') : summary.spo2.assessment
            }} unit="%" />
            <SummaryCard icon={Activity} label="Blood Glucose" stats={{
              ...summary.bloodSugar,
              assessment: p7Active ? p7Assessment('bloodSugar') : summary.bloodSugar.assessment
            }} unit="mg/dL" />
            <SummaryCard icon={Thermometer} label="Temperature" stats={{
              ...summary.temp,
              assessment: p7Active ? p7Assessment('temp') : summary.temp.assessment
            }} unit="°C" />
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <p className="text-[11px] font-semibold text-teal-800 mb-1">Overall Assessment (6 Parameters · 24h)</p>
            <p className="text-[11px] text-teal-700 leading-relaxed whitespace-pre-line">
              {p7Active && p7News
                ? buildOverallNewsAssessment(p7Vitals, patient.diagnosis)
                : summary.overall}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-[11px] font-semibold text-amber-800 mb-2">Clinical Recommendations</p>
            <ul className="space-y-1">
              {(p7Active && p7News
                ? buildP7ClinicalRecommendations(p7News)
                : summary.recommendations).map((r, i) => (
                <li key={i} className="text-[10px] text-amber-700 flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">•</span> {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-[9px] text-slate-400 text-right">
            Guidelines: {PATIENT_THRESHOLDS[patient.id]?.guidelines}
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard: FC<{
  icon: FC<{ className?: string }>; label: string;
  stats: { mean: number | string; min: number | string; max: number | string; pctAmber: number; pctRed: number; trend: string; assessment: string };
  unit: string;
}> = ({ icon: Icon, label, stats, unit }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-3">
    <div className="flex items-center gap-1.5 mb-2">
      <Icon className="w-3.5 h-3.5 text-teal-600" />
      <span className="text-[10px] font-semibold text-slate-700">{label}</span>
    </div>
    <div className="flex items-baseline gap-2 mb-1">
      <span className="text-lg font-bold text-slate-800">{stats.mean}</span>
      <span className="text-[10px] text-slate-400">{unit}</span>
    </div>
    <div className="text-[9px] text-slate-500 mb-1">
      Range: {stats.min}–{stats.max} · {stats.trend}
    </div>
    <div className="text-[9px] leading-relaxed text-slate-600">{stats.assessment}</div>
  </div>
);

export default VitalSignRecord;
