// === HaH Daily Care Plans — 6 Patients (NICE HaH + HK HA Protocols) ===

export interface DailyActivity {
  time: string;
  activity: string;
  type: 'medication' | 'monitoring' | 'therapy' | 'nurse_visit' | 'doctor_consult' | 'care_worker' | 'self_care';
  detail: string;
  status: 'completed' | 'pending' | 'missed' | 'in_progress';
  provider?: string;
}

export interface FollowupLogEntry {
  date: string;
  time: string;
  type: string;
  detail: string;
  author: string;
  role: string;
  vitals?: string;
  status: 'completed' | 'escalated' | 'pending';
}

export interface TwoWeekCarePlan {
  patientName: string;
  startDate: string;
  endDate: string;
  schedule: Record<string, DailyActivity[]>;
  logs: FollowupLogEntry[];
}

export const TWO_WEEK_PLANS: Record<number, TwoWeekCarePlan> = {};

function makeDates(start: string, days: number): string[] {
  const d = new Date(start);
  return Array.from({ length: days }, (_, i) => {
    const nd = new Date(d); nd.setDate(d.getDate() + i);
    return nd.toISOString().slice(0, 10);
  });
}

// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// PATIENT 1 — 沈国栋 — 高血压+心衰+压疮 (14天计划)
// ═══════════════════════════════════════════════════════════
{
  const dates = makeDates('2026-08-01', 16);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    s[d] = [
      { time: '07:00', activity: '晨间用药', type: 'medication', detail: '硝苯地平控释片30mg qd + 阿司匹林100mg。配偶陈玉兰协助服药。', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: '血压+体重监测', type: 'monitoring', detail: 'BP、HR、体重。目标BP<150/90。记录家庭血压日记。', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: '护士上门访视', type: 'nurse_visit', detail: '生命体征检查、压疮评估(Braden 16)、翻身护理指导、用药核对、饮食执行检查。', status: i < 3 ? 'completed' : 'pending', provider: '姜珊（主管护师）' },
      { time: '10:00', activity: '翻身+皮肤检查', type: 'care_worker', detail: '每2h翻身执行，髋部压疮部位检查、敷料更换。减压气垫床压力监测。', status: i < 3 ? 'completed' : 'pending', provider: '汤菊玲（护理员）' },
      { time: '12:00', activity: '午餐', type: 'self_care', detail: '低盐低脂饮食（<3g盐/日）。蛋白摄入约45g/日。配偶协助进食。', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: '康复训练', type: 'therapy', detail: '被动关节活动度训练、床上活动能力恢复、呼吸训练。卧床为主。', status: i < 3 ? (i % 2 === 0 ? 'completed' : 'pending') : 'pending', provider: '周明（康复师）' },
      { time: '16:00', activity: '家属沟通时间', type: 'self_care', detail: '配偶陈玉兰汇报当日血压、饮食、翻身执行情况。护士电话随访。', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: '晚餐', type: 'self_care', detail: '低盐低脂饮食。控制饮水量（带刻度水杯）。配偶监测摄入。', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: '晚间血压+翻身', type: 'monitoring', detail: '晚间血压监测。q2h翻身+皮肤检查。跌倒防护确认（夜间照明/护栏）。', status: i < 3 ? 'completed' : 'pending' },
      { time: '22:00', activity: '就寝准备', type: 'self_care', detail: '减压气垫床开启。床头呼叫铃就位。智能手环充电。睡眠监测开启。', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  TWO_WEEK_PLANS[1] = {
    patientName: '沈国栋', startDate: dates[0], endDate: dates[15],
    schedule: s,
    logs: [
      { date: '2026-08-16', time: '08:30', type: '护士访视', detail: 'BP 158/86较前略降。压疮面积稳定(3.5×2.8cm)无渗出。翻身护理q2h执行良好。配偶陈玉兰血压测量操作规范。', author: '姜珊', role: '护士', vitals: 'BP 158/86 | HR 78 | SpO₂ 96% | 压疮稳定', status: 'completed' },
      { date: '2026-08-14', time: '09:30', type: '护士访视', detail: '血压168/95连续2次超标。个案经理林晓东已通知社区医生。建议硝苯地平剂量优化。配偶在场。', author: '姜珊', role: '护士', vitals: 'BP 168/95 | HR 82 | SpO₂ 96% | Temp 36.8', status: 'completed' },
      { date: '2026-08-10', time: '10:00', type: '个案经理', detail: '8月第2周服务评估。血压管理需加强。压疮改善。家属照护技能培训达标。下周期待血压<150/90。', author: '林晓东', role: '个案经理', vitals: 'BP 156/84 | 执行率90%', status: 'completed' },
      { date: '2026-08-03', time: '08:30', type: '初评访视', detail: '8月首次上门。与家属确认月度排程（每周4次）、用药方案、饮食要求。配偶表示配合。首次血压160/85。', author: '姜珊', role: '护士', vitals: 'BP 160/85 | HR 78 | 执行率达标', status: 'completed' },
    ],
  };
}

// ═══════════════════════════════════════════════════════════
// PATIENT 2 — 周志强 — 脑出血术后+右侧偏瘫+DVT (10天计划)
// ═══════════════════════════════════════════════════════════
{
  const dates = makeDates('2026-08-01', 16);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day % 2 === 1 || day <= 2;
    const isRehabDay = day % 3 === 1 || day === 2;
    s[d] = [
      { time: '07:00', activity: '晨间用药', type: 'medication', detail: '降压药每日一次。儿子周明辉协助服药。依从性100%。', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: '血压监测', type: 'monitoring', detail: 'BP监测，目标<150/90。DVT观察：右下肢肿胀/皮温/颜色。记录家庭血压日记。', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: '护士上门访视', type: 'nurse_visit', detail: '生命体征、右下肢DVT评估(Caprini 7分)、Braden压疮风险评估(14分)、被动ROM指导。', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: '刘敏（主管护师）' },
      { time: '10:00', activity: '翻身+二便护理', type: 'care_worker', detail: '每2h翻身执行。右下肢抬高、避免挤压。二便管理。被动ROM训练。', status: i < 3 ? 'completed' : 'pending', provider: '王秀英（护理员）' },
      { time: '11:00', activity: '康复训练', type: 'therapy', detail: '右侧偏瘫侧被动ROM、关节活动度维持、床上活动能力训练。左侧主动训练。', status: isRehabDay ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: '陈军（康复师）' },
      { time: '12:00', activity: '午餐', type: 'self_care', detail: '软食为主。儿子协助进食。蛋白摄入约40g/日。', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: '家属沟通', type: 'self_care', detail: '儿子周明辉汇报当日血压、翻身、DVT观察结果。护士电话随访。', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: '晚餐', type: 'self_care', detail: '软食。儿子协助进食。关注饮水。', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: '晚间血压+DVT观察', type: 'monitoring', detail: '晚间BP监测。右下肢肿胀/皮温/颜色检查。床旁护栏确认。', status: i < 3 ? 'completed' : 'pending' },
      { time: '22:00', activity: '就寝准备', type: 'self_care', detail: 'q2h翻身最后检查。床头呼叫铃到位。智能手环充电。', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  TWO_WEEK_PLANS[2] = {
    patientName: '周志强', startDate: dates[0], endDate: dates[15],
    schedule: s,
    logs: [
      { date: '2026-08-16', time: '08:30', type: '护士访视', detail: 'BP 146/88较上次略降。右侧偏瘫肌张力稳定。右下肢DVT无进展(肿胀无加重、皮温正常)。翻身q2h执行。儿子周明辉照护操作达标。', author: '刘敏', role: '护士', vitals: 'BP 146/88 | HR 82 | SpO₂ 97% | Caprini 7', status: 'completed' },
      { date: '2026-08-14', time: '09:00', type: '护士访视', detail: '右下肢肿胀轻微加重，已通知个案经理。避免挤压抬高患肢继续。血压148/90关注中。儿子周明辉在场配合。', author: '刘敏', role: '护士', vitals: 'BP 148/90 | DVT 加重警戒', status: 'completed' },
      { date: '2026-08-10', time: '10:30', type: '个案经理', detail: '8月第2周服务评估。血压管理需关注(目标<150/90)。DVT观察每日执行。康复训练每周3次。服务执行率90%。', author: '张丽华', role: '个案经理', vitals: 'BP 146/88 | 执行率90%', status: 'completed' },
      { date: '2026-08-03', time: '09:00', type: '初评访视', detail: '8月首次上门。确认月度排程（每周4次）、用药方案。首次血压146/90。儿子周明辉已培训翻身护理+DVT观察+血压监测。', author: '刘敏', role: '护士', vitals: 'BP 146/90 | HR 82 | 执行率达标', status: 'completed' },
    ],
  };
}

// PATIENT 3-7: Reserved for future 长护险 patients
