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
// PATIENT 1 — CHEUNG WAI MAN — CHF (14-day plan)
// ═══════════════════════════════════════════════════════════
{
  const dates = makeDates('2026-06-18', 14);
  const s: Record<string, DailyActivity[]> = {};
  // Daily template for CHF
  dates.forEach((d, i) => {
    const day = i + 1;
    s[d] = [
      { time: '06:30', activity: 'Morning Weight + Vitals', type: 'monitoring', detail: 'Weight, BP, HR, SpO₂ via smartwatch + Omron BP monitor. Record in daily log.', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:00', activity: 'AM Medications', type: 'medication', detail: 'Entresto 97/103mg + Bisoprolol 5mg + Furosemide 40mg + Spironolactone 25mg + Apixaban 5mg + Metformin 500mg', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'Light Breakfast', type: 'self_care', detail: 'Low sodium (<500mg), fluid counted towards 1.5L daily limit', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: 'RN Home Visit', type: 'nurse_visit', detail: 'Vital signs check, cardiac auscultation, pedal oedema assessment, JVP, medication reconciliation, I/O review, weight trend analysis', status: i < 3 ? 'completed' : 'pending', provider: 'Sarah Leung (RN)' },
      { time: '10:00', activity: 'Fluid Intake Check', type: 'monitoring', detail: 'Mid-morning fluid: 250mL (cumulative: 500mL). Record in I/O chart.', status: i < 3 ? 'completed' : 'pending' },
      { time: '10:30', activity: 'Cardiac Rehab (PT)', type: 'therapy', detail: 'Seated exercises, gentle walking 10-15min indoors, breathing exercises. Monitor HR/SpO₂ throughout.', status: day % 2 === 0 ? 'pending' : 'completed', provider: 'David Chan (PT)' },
      { time: '12:00', activity: 'Lunch', type: 'self_care', detail: 'Low sodium meal (<500mg), fluid counted. Total fluid so far: 750mL.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'PM Furosemide', type: 'medication', detail: 'Furosemide 40mg. Take with water (counted).', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: 'Dr. Chan Chi Keung virtual ward round. Review weight, I/O, symptoms, medication tolerance.', status: day % 2 === 1 ? 'completed' : (i < 3 ? 'pending' : 'pending'), provider: 'Dr. Chan Chi Keung' },
      { time: '16:00', activity: 'Family Education Moment', type: 'self_care', detail: 'Wife reviews daily weight log, fluid restriction compliance, sodium intake. Discuss any concerns.', status: i < 3 ? 'completed' : 'pending' },
      { time: '17:00', activity: 'Afternoon Rest', type: 'self_care', detail: 'Leg elevation x 30min. No fluid for 1h before dinner.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Dinner', type: 'self_care', detail: 'Low sodium, fluid counted. Total daily fluid target: 1,500mL max.', status: i < 3 ? 'completed' : 'pending' },
      { time: '19:00', activity: 'PM Medications', type: 'medication', detail: 'Entresto 97/103mg + Apixaban 5mg + Metformin 500mg', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening Weight Check', type: 'monitoring', detail: 'Weight (compare to AM). Report if >0.5kg gain from AM.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'Bedtime', type: 'self_care', detail: 'Head of bed elevated 30°. Smartwatch charging. Sleep monitoring via SenseLife mattress.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  TWO_WEEK_PLANS[1] = {
    patientName: '沈国栋', startDate: dates[0], endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-06-20', time: '08:30', type: 'RN Visit', detail: 'Weight 68.0kg stable. BP 118/72. HR 82 AF. SpO₂ 95%. Pedal oedema trace. I/O: net -270mL. AM meds confirmed. Wife demonstrating correct weight log technique.', author: 'Sarah Leung', role: 'RN', vitals: 'BP 118/72 | HR 82 | SpO₂ 95% | Wt 68.0kg', status: 'completed' },
      { date: '2026-06-19', time: '09:15', type: 'RN Visit', detail: 'Initial HaH visit. Weight 68.5kg. BP 122/76. HR 78 AF. SpO₂ 94%. Pedal oedema 1+. JVP 4cm. Med reconciliation completed. Home safety assessed. Wife trained on BP monitor + weight scale.', author: 'Sarah Leung', role: 'RN', vitals: 'BP 122/76 | HR 78 | SpO₂ 94% | Wt 68.5kg', status: 'completed' },
      { date: '2026-06-19', time: '15:00', type: 'Teleconsult', detail: 'Day 1 virtual ward round. Weight 68.5kg (↓3.4kg from admission). Oedema 1+. Breath sounds improving. JVP 4cm. Continue current regimen. Strict I/O. Renal panel in 48h.', author: 'Dr. Chan Chi Keung', role: 'Cardiologist', vitals: 'BP 122/76 | HR 78 | SpO₂ 94%', status: 'completed' },
      { date: '2026-06-20', time: '15:00', type: 'Teleconsult', detail: 'Day 2 review. Weight 68.0kg stable. No orthopnoea. BNP 850 (↓ from 2,200). Renal stable. Continue GDMT. Recheck renal panel tomorrow.', author: 'Dr. Chan Chi Keung', role: 'Cardiologist', vitals: 'BP 118/72 | HR 82 | SpO₂ 95%', status: 'completed' },
    ],
  };
}

// ═══════════════════════════════════════════════════════════
// PATIENT 2 — WONG CHI MING — COPD (10-day plan)
// ═══════════════════════════════════════════════════════════
{
  const dates = makeDates('2026-06-18', 10);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day % 2 === 1 || day <= 2;
    const isPTday = day % 3 === 1 || day === 2;
    const isConsultDay = day % 2 === 1 || day === 1;
    s[d] = [
      { time: '07:00', activity: 'AM Medications', type: 'medication', detail: 'Stiolto Respimat 2 puffs. Prednisolone (taper: Day 1-3: 30mg, Day 4-5: 20mg, Day 6-7: 10mg, Day 8+: stop). Perindopril 4mg.', status: i < 3 ? 'completed' : 'pending' },
      { time: '07:30', activity: 'Morning SpO₂ Check', type: 'monitoring', detail: 'SpO₂ at rest via Nonin oximeter. Record. Use O₂ 2L/min if <90%.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'Breakfast', type: 'self_care', detail: 'Light meal. Sit upright. Pursed-lip breathing if dyspnoeic.', status: i < 3 ? 'completed' : 'pending' },
      { time: '09:00', activity: 'RN Home Visit', type: 'nurse_visit', detail: 'Vital signs, SpO₂ at rest + exertion, lung auscultation, inhaler technique check, sputum assessment, O₂ equipment check.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Jenny Tam (RN)' },
      { time: '10:30', activity: 'Pulmonary Rehab (PT)', type: 'therapy', detail: 'Breathing exercises, pursed-lip breathing, diaphragmatic breathing, upper body strengthening, gentle walking 10-15min with SpO₂ monitoring.', status: isPTday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Raymond Wong (PT)' },
      { time: '12:00', activity: 'Lunch', type: 'self_care', detail: 'High-protein, small frequent meals. Avoid gas-forming foods.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'Afternoon Medications', type: 'medication', detail: 'Salbutamol MDI prn (if wheeze/dyspnoea). Atorvastatin 20mg.', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q48h)', type: 'doctor_consult', detail: 'Dr. Lee Mei Ling virtual ward round. Review SpO₂ trend, sputum, exercise tolerance, CAT score, steroid taper.', status: isConsultDay ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: 'Dr. Lee Mei Ling' },
      { time: '16:00', activity: 'Family Education', type: 'self_care', detail: 'Daughter reviews O₂ safety, inhaler technique, exacerbation action plan. SpO₂ check post-activity.', status: i < 3 ? 'completed' : 'pending' },
      { time: '18:00', activity: 'Dinner', type: 'self_care', detail: 'Light meal. Sit upright. No large meals before bed.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening SpO₂ Check', type: 'monitoring', detail: 'SpO₂ at rest. O₂ prn if <90%. Record in log.', status: i < 3 ? 'completed' : 'pending' },
      { time: '21:00', activity: 'Bedtime', type: 'self_care', detail: 'Head elevated 30-45°. O₂ concentrator on standby. Smartwatch charging.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  TWO_WEEK_PLANS[2] = {
    patientName: '待录入', startDate: dates[0], endDate: dates[9],
    schedule: s,
    logs: [
      { date: '2026-06-20', time: '10:00', type: 'RN Visit', detail: 'SpO₂ 93% at rest, RR 18. Wheeze improved. Inhaler technique correct. Prednisolone 20mg Day 3. O₂ equipment functioning. Daughter present.', author: 'Jenny Tam', role: 'RN', vitals: 'SpO₂ 93% | RR 18 | HR 86 | BP 132/80', status: 'completed' },
      { date: '2026-06-19', time: '11:00', type: 'RN Visit', detail: 'Initial HaH visit. SpO₂ 92% RA. RR 20. Wheeze present. O₂ concentrator tested. Med reconciliation. Prednisolone taper reviewed. O₂ safety education completed.', author: 'Jenny Tam', role: 'RN', vitals: 'SpO₂ 92% | RR 20 | HR 90 | BP 138/84', status: 'completed' },
      { date: '2026-06-20', time: '15:00', type: 'Teleconsult', detail: 'Day 2 review. SpO₂ 93% RA, 89% post 50m walk. RR 20. Wheeze improving. Continue steroid taper. Pulmonary rehab progressing. Recheck exertion SpO₂ in 3 days.', author: 'Dr. Lee Mei Ling', role: 'Respiratory Physician', vitals: 'SpO₂ 93% | RR 20', status: 'completed' },
    ],
  };
}

// ═══════════════════════════════════════════════════════════
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
