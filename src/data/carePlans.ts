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
// PATIENT 3 — LAM KA CHUN — CAP (7-day plan)
// ═══════════════════════════════════════════════════════════
{
  const dates = makeDates('2026-06-18', 7);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day <= 3 || day === 5;
    s[d] = [
      { time: '07:00', activity: 'AM Medication', type: 'medication', detail: 'Levofloxacin 750mg (Day ' + (day + 3) + ' of 7). Take with full glass of water. No dairy within 2h.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'Morning Vitals', type: 'monitoring', detail: 'Temp, SpO₂, HR, BP via smartwatch + oximeter. Record.', status: i < 3 ? 'completed' : 'pending' },
      { time: '09:00', activity: 'RN Home Visit', type: 'nurse_visit', detail: 'Vitals, lung auscultation, cough assessment, antibiotic tolerance check, hydration status.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Connie Cheung (RN)' },
      { time: '10:00', activity: 'Hydration', type: 'self_care', detail: 'Drink 500mL water. Minimum 2L total today.', status: i < 3 ? 'completed' : 'pending' },
      { time: '12:00', activity: 'Lunch + Rest', type: 'self_care', detail: 'Light meal. Rest 1h after eating. No strenuous activity.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'Afternoon Vitals', type: 'monitoring', detail: 'Temp, SpO₂ check. Paracetamol 1g prn if pain/fever.', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (Day 3)', type: 'doctor_consult', detail: '姜珊（护士经理） — review progress, antibiotic completion plan, return to work clearance.', status: day === 3 ? 'completed' : 'pending', provider: '姜珊（护士经理）' },
      { time: '16:00', activity: 'Gentle Activity', type: 'self_care', detail: 'Short walk indoors. Deep breathing exercises. No exertion.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Dinner', type: 'self_care', detail: 'Nutritious meal. Continue hydration.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening Vitals', type: 'monitoring', detail: 'Temp, SpO₂. Record. Report any fever >38.0°C.', status: i < 3 ? 'completed' : 'pending' },
      { time: '22:00', activity: 'Bedtime', type: 'self_care', detail: 'Sleep with head slightly elevated. Smartwatch charging.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  TWO_WEEK_PLANS[3] = {
    patientName: '待录入', startDate: dates[0], endDate: dates[6],
    schedule: s,
    logs: [
      { date: '2026-06-20', time: '09:00', type: 'RN Visit', detail: 'Day 2 visit. Temp 36.8. SpO₂ 97%. RLL crackles resolving. Cough dry, occasional. Levofloxacin Day 5 taken. No GI upset. Appetite returned. Patient feels "80% better".', author: 'Connie Cheung', role: 'RN', vitals: 'Temp 36.8 | SpO₂ 97% | RR 16 | HR 72', status: 'completed' },
      { date: '2026-06-19', time: '10:30', type: 'RN Visit', detail: 'Initial HaH visit. Temp 37.0. SpO₂ 96%. RLL crackles improving. Levofloxacin Day 4. PENICILLIN ALLERGY confirmed. Spouse trained on temp monitoring. Return precautions reviewed.', author: 'Connie Cheung', role: 'RN', vitals: 'Temp 37.0 | SpO₂ 96% | RR 18 | HR 76', status: 'completed' },
      { date: '2026-06-20', time: '15:00', type: 'Teleconsult', detail: 'Day 3 virtual review. Afebrile × 72h. SpO₂ 97% RA. CRP 28 (↓ from 156). Complete 2 more days Levofloxacin. Return to work (remote) Day 7. RTC CXR Week 4.', author: '姜珊（护士经理）', role: 'ID Physician', vitals: 'Temp 36.8 | SpO₂ 97%', status: 'completed' },
    ],
  };
}

// ═══════════════════════════════════════════════════════════
// PATIENT 4 — LAU SUK YEE — UTI (7-day plan)
// ═══════════════════════════════════════════════════════════
{
  const dates = makeDates('2026-06-18', 7);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day <= 3 || day === 5;
    s[d] = [
      { time: '07:00', activity: 'AM Medications', type: 'medication', detail: 'Ciprofloxacin 500mg (Day ' + (day + 3) + ' of 7). Losartan 100mg. Dapagliflozin 10mg. Ferrous Sulfate 325mg.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'Morning Vitals + AMTS', type: 'monitoring', detail: 'Temp, BP, HR. AMTS cognitive screen. Urine output check. Record.', status: i < 3 ? 'completed' : 'pending' },
      { time: '09:00', activity: 'RN Home Visit', type: 'nurse_visit', detail: 'Vitals, AMTS, urinary symptom review, hydration assessment, antibiotic tolerance, bowel monitoring (C. diff risk).', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Vivian Lau (RN)' },
      { time: '10:00', activity: 'Hydration', type: 'self_care', detail: '250mL water. Minimum 1.5L total today. Use marked water bottle.', status: i < 3 ? 'completed' : 'pending' },
      { time: '12:00', activity: 'Lunch', type: 'self_care', detail: 'Regular meal. Continue hydration. No cranberry juice (not evidence-based).', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'Fall Prevention Check', type: 'self_care', detail: 'Son assists with ambulation. Grab bars used. Non-slip mat in bathroom. Morse Fall Scale: 35 (moderate).', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (Day 3)', type: 'doctor_consult', detail: 'Dr. Chan Chi Keung — review AMTS, renal function, urinary symptoms, antibiotic completion.', status: day === 3 ? 'completed' : 'pending', provider: 'Dr. Chan Chi Keung' },
      { time: '17:00', activity: 'PM Ciprofloxacin', type: 'medication', detail: 'Ciprofloxacin 500mg (second dose). Take with full glass of water.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Dinner', type: 'self_care', detail: 'Regular meal. Continue hydration.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening Vitals', type: 'monitoring', detail: 'Temp, BP. Urine output total for day. Record.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'Bedtime', type: 'self_care', detail: 'Bathroom before bed. Night light on. Call bell within reach.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  TWO_WEEK_PLANS[4] = {
    patientName: '待录入', startDate: dates[0], endDate: dates[6],
    schedule: s,
    logs: [
      { date: '2026-06-20', time: '09:30', type: 'RN Visit', detail: 'Day 2 visit. Temp 36.7. BP 138/84. AMTS 9/10. Urinary symptoms improving. Ciprofloxacin Day 4. No diarrhoea. Son present — UTI prevention reviewed.', author: 'Vivian Lau', role: 'RN', vitals: 'Temp 36.7 | BP 138/84 | HR 88 | AMTS 9/10', status: 'completed' },
      { date: '2026-06-19', time: '10:00', type: 'RN Visit', detail: 'Initial HaH visit. Temp 37.2. BP 142/86. AMTS 8/10 (improving). Ciprofloxacin Day 3. Med reconciliation. Hydration plan set up. Cipro + Losartan interaction reviewed.', author: 'Vivian Lau', role: 'RN', vitals: 'Temp 37.2 | BP 142/86 | HR 92 | AMTS 8/10', status: 'completed' },
      { date: '2026-06-20', time: '15:00', type: 'Teleconsult', detail: 'Day 3 review. Afebrile. AMTS 9/10 (baseline). Renal function stable. Complete 7-day Ciprofloxacin. Repeat urine culture 1 week post-treatment. No diarrhoea — C. diff monitoring continues.', author: 'Dr. Chan Chi Keung', role: 'Internal Medicine', vitals: 'Temp 36.7 | AMTS 9/10', status: 'completed' },
    ],
  };
}

// ═══════════════════════════════════════════════════════════
// PATIENT 5 — HO TAI WAI — Cellulitis (9-day plan)
// ═══════════════════════════════════════════════════════════
{
  const dates = makeDates('2026-06-18', 9);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isConsultDay = day <= 3 || day === 5 || day === 7;
    s[d] = [
      { time: '06:00', activity: 'Clindamycin', type: 'medication', detail: 'Clindamycin 450mg (Day ' + (day + 3) + ' of 9). Dose 1 of 4. Take with full glass of water.', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:00', activity: 'Morning Vitals', type: 'monitoring', detail: 'Temp, BP, HR. Wound pain score (0-10). Record.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'RN Wound Care Visit', type: 'nurse_visit', detail: 'Wound assessment: erythema diameter measurement, photo documentation, saline irrigation, non-adherent silicone dressing. Mark erythema border. Diabetic foot check.', status: i < 3 ? 'completed' : 'pending', provider: 'Angela Ng (RN)' },
      { time: '09:00', activity: 'AM Medications', type: 'medication', detail: 'Metformin 500mg + Amlodipine 5mg', status: i < 3 ? 'completed' : 'pending' },
      { time: '10:00', activity: 'Leg Elevation', type: 'self_care', detail: 'Sit in recliner, leg elevated above heart level. Minimum 2h morning session.', status: i < 3 ? 'completed' : 'pending' },
      { time: '12:00', activity: 'Clindamycin', type: 'medication', detail: 'Clindamycin 450mg (dose 2 of 4).', status: i < 3 ? 'completed' : 'pending' },
      { time: '12:30', activity: 'Lunch', type: 'self_care', detail: 'Diabetic-friendly meal. Continue hydration.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'PT Mobility Session', type: 'therapy', detail: 'Gentle ambulation, leg elevation breaks, ankle pumps. Fall prevention.', status: day % 3 === 1 ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Eric Chan (PT)' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: 'Dr. Lee Mei Ling — review wound photos, erythema progression, pain, antibiotic tolerance.', status: isConsultDay ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Lee Mei Ling' },
      { time: '16:00', activity: 'Leg Elevation', type: 'self_care', detail: 'Afternoon session. Minimum 2h. Wife checks wound between visits.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Clindamycin', type: 'medication', detail: 'Clindamycin 450mg (dose 3 of 4).', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:30', activity: 'Dinner', type: 'self_care', detail: 'Diabetic-friendly meal.', status: i < 3 ? 'completed' : 'pending' },
      { time: '19:00', activity: 'PM Metformin', type: 'medication', detail: 'Metformin 500mg.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening Wound Check', type: 'monitoring', detail: 'Wife inspects wound. Report any spreading erythema, increased pain, or pus.', status: i < 3 ? 'completed' : 'pending' },
      { time: '00:00', activity: 'Clindamycin (midnight)', type: 'medication', detail: 'Clindamycin 450mg (dose 4 of 4). Set alarm. Take with water.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  TWO_WEEK_PLANS[5] = {
    patientName: '待录入', startDate: dates[0], endDate: dates[8],
    schedule: s,
    logs: [
      { date: '2026-06-20', time: '08:00', type: 'RN Wound Care', detail: 'Wound Day 2. Temp 36.6. Erythema 12cm (↓ from 15cm). No fluctuance. Pain 1/10. Saline irrigation + silicone dressing. New border marked. Photo taken. Diabetic foot: no new wounds.', author: 'Angela Ng', role: 'RN', vitals: 'Temp 36.6 | Erythema 12cm | Pain 1/10', status: 'completed' },
      { date: '2026-06-19', time: '08:30', type: 'RN Wound Care', detail: 'Initial HaH visit. Temp 37.0. Erythema 15cm (↓ from 25cm at admission). Clean wound, no pus. Clindamycin Day 3. Leg elevation setup. Wife trained on wound inspection.', author: 'Angela Ng', role: 'RN', vitals: 'Temp 37.0 | Erythema 15cm | Pain 2/10', status: 'completed' },
      { date: '2026-06-20', time: '15:00', type: 'Teleconsult', detail: 'Day 2 review. Erythema 12cm — continuing to improve. WBC 9.8. Afebrile. Continue Clindamycin q6h. PT mobilisation started. Wound healing on track.', author: 'Dr. Lee Mei Ling', role: 'Internal Medicine', vitals: 'Temp 36.6 | Erythema 12cm', status: 'completed' },
    ],
  };
}

// ═══════════════════════════════════════════════════════════
// PATIENT 6 — NG SIU WAN — DVT (10-day plan)
// ═══════════════════════════════════════════════════════════
{
  const dates = makeDates('2026-06-18', 10);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day <= 5 || day === 7 || day === 9;
    const isConsultDay = day <= 3 || day === 5 || day === 7 || day === 9;
    s[d] = [
      { time: '07:00', activity: 'AM Medications', type: 'medication', detail: 'Perindopril 4mg. Atorvastatin 20mg.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'INR Check (POCT)', type: 'monitoring', detail: 'Fingerstick INR via CoaguChek. Record result. Report to HaH team if outside 2.0-3.0.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: 'RN Visit', type: 'nurse_visit', detail: 'INR review, bleeding assessment (gums, skin, urine), leg circumference measurement, pain score, compression stocking check, Warfarin education.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Sarah Leung (RN)' },
      { time: '09:00', activity: 'Compression Stockings ON', type: 'self_care', detail: 'Apply Class II (23-32mmHg) stockings. Wear during daytime. Remove at night.', status: i < 3 ? 'completed' : 'pending' },
      { time: '10:00', activity: 'Leg Elevation', type: 'self_care', detail: 'Elevate leg while sitting. Minimum 2h morning session.', status: i < 3 ? 'completed' : 'pending' },
      { time: '10:30', activity: 'PT Mobility (weekly)', type: 'therapy', detail: 'Gentle ambulation, ankle pumps, calf stretches. Early mobilisation with compression stockings.', status: day % 7 === 2 ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Michael Kwok (PT)' },
      { time: '12:00', activity: 'Lunch', type: 'self_care', detail: 'Consistent vitamin K intake: maintain usual greens portion. No sudden diet changes.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'Afternoon Check', type: 'monitoring', detail: 'Leg pain score. Check for any new bruising or bleeding.', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: '姜珊（护士经理） — review INR trend, bleeding risk, leg swelling, Warfarin dose adjustment if needed.', status: isConsultDay ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: '姜珊（护士经理）' },
      { time: '16:00', activity: 'Warfarin Education', type: 'self_care', detail: 'Review 5 key safety points: 1. consistent vitamin K 2. avoid NSAIDs 3. bleeding signs 4. INR schedule 5. alcohol limit. Daughter participates.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'WARFARIN DOSE', type: 'medication', detail: 'Warfarin 5mg (same time daily). Use pill box with alarm. DO NOT skip or double dose.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:30', activity: 'Dinner', type: 'self_care', detail: 'Consistent vitamin K intake. No alcohol.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Compression Stockings OFF', type: 'self_care', detail: 'Remove stockings. Inspect skin for any irritation or breakdown. Apply moisturiser.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'Evening Leg Assessment', type: 'monitoring', detail: 'Check for swelling, pain, discolouration. Report any sudden changes.', status: i < 3 ? 'completed' : 'pending' },
      { time: '22:00', activity: 'Bedtime', type: 'self_care', detail: 'Leg slightly elevated. No stockings. Smartwatch charging.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  TWO_WEEK_PLANS[6] = {
    patientName: '待录入', startDate: dates[0], endDate: dates[9],
    schedule: s,
    logs: [
      { date: '2026-06-20', time: '08:00', type: 'INR + RN Visit', detail: 'INR 2.1 (therapeutic). BP 132/80. No bleeding — gums, skin, urine clear. Calf 38cm (↓ from 39cm). Pain 1/10. Compression stockings 18h yesterday. Warfarin education: 5 key points reviewed. Patient demonstrated correct self-administration.', author: 'Sarah Leung', role: 'RN', vitals: 'INR 2.1 | BP 132/80 | HR 74 | Calf 38cm', status: 'completed' },
      { date: '2026-06-19', time: '09:00', type: 'INR + RN Visit', detail: 'Initial HaH visit. INR 2.3 — slightly high, Warfarin held per protocol. Calf 39cm (↓ from 41cm). Pain 2/10. Compression stockings fitted. Med reconciliation. Anticoagulation alert card provided. Pill box with alarm set up.', author: 'Sarah Leung', role: 'RN', vitals: 'INR 2.3 | BP 136/84 | HR 78 | Calf 39cm', status: 'completed' },
      { date: '2026-06-20', time: '15:00', type: 'Teleconsult', detail: 'Day 2 review. INR 2.1 — therapeutic. No bleeding. Leg swelling improving. Continue Warfarin 5mg qd. If INR stable × 3 days, reduce monitoring to q2d. Warfarin education progressing well.', author: '姜珊（护士经理）', role: 'Internal Medicine', vitals: 'INR 2.1', status: 'completed' },
    ],
  };
}
// ═══════════════════════════════════════════════════════════
// PATIENT 7 — CHAN TAI MING — COPD GOLD 2 + CAP (21-day plan through demo date)
// ═══════════════════════════════════════════════════════════
{
  const dates = makeDates('2026-06-18', 21);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    if (day <= 7) {
      const isBID = day <= 5;
      const isPTday = day === 3 || day === 5;
      const isConsultDay = day % 2 === 1;
      const isIVday = day >= 2 && day <= 7;
      s[d] = [
        { time: '07:00', activity: 'AM Medications', type: 'medication', detail: 'Spiriva 18mcg HandiHaler + Amlodipine 5mg. Wife to confirm administration.', status: i < 3 ? 'completed' : 'pending' },
        { time: '07:30', activity: 'Morning SpO₂ Check', type: 'monitoring', detail: 'SpO₂ at rest via Nonin pulse oximeter. Report if <92%. O₂ PRN at 2L/min.', status: i < 3 ? 'completed' : 'pending' },
        { time: '08:00', activity: 'Breakfast', type: 'self_care', detail: 'Light meal, sit upright. Pursed-lip breathing if dyspnoeic. Fluid intake logged.', status: i < 3 ? 'completed' : 'pending' },
        { time: '08:00', activity: 'AM RN Visit', type: 'nurse_visit', detail: 'Vitals, respiratory assessment, medication reconciliation, O₂ check, IV Ceftriaxone if Day 2+, family education', status: i < 3 ? 'completed' : 'pending', provider: 'Jenny Tam (RN)' },
        ...(isPTday ? [{ time: '10:30', activity: 'Pulmonary Rehab (PT)', type: 'therapy' as const, detail: 'Pursed-lip + diaphragmatic breathing, seated exercises, 30m walk tolerance with SpO₂ monitoring', status: i < 3 ? 'completed' as const : 'pending' as const, provider: 'David Chan (PT)' }] : []),
        { time: '12:00', activity: 'Lunch', type: 'self_care', detail: 'High-protein small meal. Avoid gas-forming foods. Sit upright.', status: i < 3 ? 'completed' : 'pending' },
        { time: '14:00', activity: 'Afternoon SpO₂ Check', type: 'monitoring', detail: 'Wife to check SpO₂. Record in log. Report if <92% or patient feels unwell.', status: i < 3 ? 'completed' : 'pending' },
        ...(isConsultDay ? [{ time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult' as const, detail: 'Dr. Lee Mei Ling — review vitals trend, SpO₂, antibiotic response, escalation decisions', status: i < 3 ? 'completed' as const : 'pending' as const, provider: 'Dr. Lee Mei Ling' }] : []),
        ...(isBID ? [{ time: '17:00', activity: 'PM RN Visit', type: 'nurse_visit' as const, detail: 'Vitals reassessment, I/O check, mobility assessment, fall risk, family support check', status: i < 3 ? 'completed' as const : 'pending' as const, provider: 'Jenny Tam (RN)' }] : []),
        ...(isIVday && day >= 2 ? [{ time: day === 2 ? '14:30' : '09:00', activity: 'IV Ceftriaxone', type: 'medication' as const, detail: 'Ceftriaxone 2g IV over 30min — CAP treatment per C&S (H. influenzae, sensitive)', status: i < 3 ? 'completed' as const : 'pending' as const }] : []),
        { time: '18:00', activity: 'Dinner', type: 'self_care', detail: 'Light meal, sit upright. Avoid large meals before bed.', status: i < 3 ? 'completed' : 'pending' },
        { time: '20:00', activity: 'Evening SpO₂ Check', type: 'monitoring', detail: 'SpO₂ at rest. O₂ if <90%. Record in log.', status: i < 3 ? 'completed' : 'pending' },
        { time: '21:00', activity: 'Bedtime', type: 'self_care', detail: 'Head elevated 30-45°. O₂ concentrator on standby. Emergency call button within reach.', status: i < 3 ? 'completed' : 'pending' },
      ];
    } else {
      const isRNday = day % 2 === 1;
      const isConsultDay = day % 7 === 1;
      const isPTday = day % 7 === 3;
      s[d] = [
        { time: '07:00', activity: 'AM Medications', type: 'medication', detail: 'Spiriva 18mcg + Amlodipine 5mg. PO Augmentin if still on course (Day 8-10).', status: i < 12 ? 'completed' : 'pending' },
        { time: '07:30', activity: 'Morning SpO₂ Check', type: 'monitoring', detail: 'SpO₂ at rest. Report if <92%. O₂ PRN 2L/min.', status: i < 12 ? 'completed' : 'pending' },
        { time: '08:00', activity: 'Breakfast', type: 'self_care', detail: 'Light meal. Pursed-lip breathing as needed.', status: i < 12 ? 'completed' : 'pending' },
        { time: '08:30', activity: 'RN Maintenance Visit', type: 'nurse_visit', detail: 'Post-discharge maintenance: vitals, respiratory review, inhaler technique, fall risk, family support', status: isRNday ? (i < 12 ? 'completed' : 'pending') : 'pending', provider: 'Jenny Tam (RN)' },
        ...(isPTday ? [{ time: '10:30', activity: 'Pulmonary Rehab (PT)', type: 'therapy' as const, detail: 'Maintenance pulmonary rehab — walking programme, breathing exercises, SpO₂ monitoring', status: i < 12 ? 'completed' as const : 'pending' as const, provider: 'David Chan (PT)' }] : []),
        { time: '12:00', activity: 'Lunch', type: 'self_care', detail: 'Regular diet. Hydration logged.', status: i < 12 ? 'completed' : 'pending' },
        { time: '14:00', activity: 'Afternoon SpO₂ Check', type: 'monitoring', detail: 'Wife records SpO₂ in log. Escalate if <92%.', status: i < 12 ? 'completed' : 'pending' },
        ...(isConsultDay ? [{ time: '15:00', activity: 'Teleconsult (weekly)', type: 'doctor_consult' as const, detail: 'Dr. Lee Mei Ling — maintenance review, COPD action plan, NEWS tier review', status: i < 12 ? 'completed' as const : 'pending' as const, provider: 'Dr. Lee Mei Ling' }] : []),
        { time: '18:00', activity: 'Dinner', type: 'self_care', detail: 'Light evening meal.', status: i < 12 ? 'completed' : 'pending' },
        { time: '20:00', activity: 'Evening SpO₂ Check', type: 'monitoring', detail: 'SpO₂ at rest before bed.', status: i < 12 ? 'completed' : 'pending' },
        { time: '21:00', activity: 'Bedtime', type: 'self_care', detail: 'O₂ standby. Action plan visible.', status: i < 12 ? 'completed' : 'pending' },
      ];
    }
  });
  TWO_WEEK_PLANS[7] = {
    patientName: 'Chan Tai Ming', startDate: dates[0], endDate: dates[20],
    schedule: s,
    logs: [
      { date: '2026-06-19', time: '08:30', type: 'RN — Initial Assessment', detail: 'Day 1 AM. Baseline: SpO₂ 93% RA, Temp 37.0, RR 20, HR 84, BP 138/84. Morse 55 (HIGH). Wife trained on SpO₂/BP/Temp monitoring + escalation call. Spiriva technique corrected. Bathroom grab bars ordered.', author: 'Jenny Tam', role: 'RN', vitals: 'SpO₂ 93% | Temp 37.0 | RR 20 | HR 84 | BP 138/84', status: 'completed' },
      { date: '2026-06-20', time: '08:00', type: 'RN — Infection Watch', detail: 'Day 2 AM. SpO₂ 91% ⚠️, Temp 37.8, RR 24, HR 94. Sputum green. Infection Watch triggered — Maggie Lam + Dr. Lee notified. Prepare POCT.', author: 'Jenny Tam', role: 'RN', vitals: 'SpO₂ 91% | Temp 37.8 | RR 24 | HR 94', status: 'completed' },
      { date: '2026-06-20', time: '14:30', type: 'RN — RED Alert + POCT', detail: 'Day 2 PM. SpO₂ 90%, Temp 38.3, RR 26, HR 98. POCT: CRP 68, PCT 0.8. IV Ceftriaxone 2g + Doxycycline started. Septic workup sent to PWH. O₂ at 2L/min.', author: 'Jenny Tam', role: 'RN', vitals: 'SpO₂ 90% | Temp 38.3 | RR 26 | HR 98 | CRP 68 | PCT 0.8', status: 'completed' },
      { date: '2026-06-21', time: '08:30', type: 'RN — Post-IV Assessment', detail: 'Day 3. 16h post-IV. SpO₂ 93% RA (O₂ weaned). Temp 37.5, RR 20, HR 88. CRP 42, PCT 0.3 — responding. AMTS 9/10.', author: 'Jenny Tam', role: 'RN', vitals: 'SpO₂ 93% | Temp 37.5 | RR 20 | HR 88 | CRP 42 | PCT 0.3', status: 'completed' },
      { date: '2026-06-21', time: '10:00', type: 'PT — Pulmonary Rehab', detail: 'David Chan — Day 1 PT. Light pursed-lip + diaphragmatic breathing exercises. Seated exercises tolerated. SpO₂ maintained >92%. No desaturation.', author: 'David Chan', role: 'PT', vitals: 'SpO₂ 93% (exercise)', status: 'completed' },
      { date: '2026-06-22', time: '08:00', type: 'RN — Day 4 Assessment', detail: 'Day 4. SpO₂ 94% RA, Temp 37.1, RR 18, HR 84. Crackles resolved. IV Ceftriaxone Day 3. Morse 45 (↓). Patient walked to bathroom independently.', author: 'Jenny Tam', role: 'RN', vitals: 'SpO₂ 94% | Temp 37.1 | RR 18 | HR 84 | Morse 45', status: 'completed' },
      { date: '2026-06-23', time: '09:00', type: 'MD — C&S Review', detail: 'Dr. Lee Mei Ling — Septic workup results from PWH. H. influenzae, Ceftriaxone-sensitive. CRP 12, PCT <0.05, WBC 9.8. Plan: continue IV Ceftriaxone, stop Doxycycline, add Azithromycin. RN to qd from Day 6.', author: 'Dr. Lee Mei Ling', role: 'Respiratory Physician', vitals: 'CRP 12 | PCT <0.05 | WBC 9.8 | C&S: H. influenzae', status: 'completed' },
      { date: '2026-06-24', time: '08:30', type: 'RN — Day 6', detail: 'Day 6. SpO₂ 95% RA, Temp 36.6, RR 16, HR 80. IV Ceftriaxone Day 5. PT 100m walk. Transition: PO Augmentin Day 8-10.', author: 'Jenny Tam', role: 'RN', vitals: 'SpO₂ 95% | Temp 36.6 | RR 16 | HR 80', status: 'completed' },
      { date: '2026-06-25', time: '08:00', type: 'RN — Discharge Assessment', detail: 'Day 7 DISCHARGE. SpO₂ 96%, Temp 36.5, RR 15, HR 78, BP 124/72. CRP 8, WBC 8.4, PCT <0.05. All criteria met. HOSPITAL READMISSION AVOIDED. PO Augmentin Day 8-10.', author: 'Jenny Tam', role: 'RN', vitals: 'SpO₂ 96% | CRP 8 | WBC 8.4 | Discharge ✅', status: 'completed' },
      { date: '2026-06-25', time: '16:00', type: 'MD — Discharge Sign-off', detail: 'Dr. Lee Mei Ling — Final review. 7-day HaH completed. All clinical targets met. No complications. No adverse drug reactions. COPD action plan updated. Follow-up: respiratory clinic 2 weeks.', author: 'Dr. Lee Mei Ling', role: 'Respiratory Physician', vitals: 'Discharge ✅', status: 'completed' },
      { date: '2026-06-22', time: '14:00', type: 'FC — Family Communication', detail: 'Jenny Tam called Mrs. Chan — Reassured wife that patient is responding well to IV antibiotics. SpO₂ improving, no more fever. Wife reports patient eating light meals and in good spirits. Confirmed grab bars installed.', author: 'Jenny Tam', role: 'RN', vitals: '', status: 'completed' },
    ],
  };
}

import { mergeNewPatientCarePlans } from './newPatients/carePlans';
import { syncDemoMapCarePlanSchedule } from '../utils/demoMapVisitAssignments';

mergeNewPatientCarePlans(TWO_WEEK_PLANS);
syncDemoMapCarePlanSchedule(TWO_WEEK_PLANS);
