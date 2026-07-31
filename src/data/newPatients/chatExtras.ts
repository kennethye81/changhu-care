import type { ChatMessage } from '../chatMessages';
import { NEW_CHAT_NAMES } from '../chatFamily';
import { PATIENTS_FULL } from '../patients';
import { formatNewsChatLine } from '../../utils/medicalHistoryNews';

export { NEW_CHAT_NAMES } from '../chatFamily';

function patientDiagnosis(patientId: number): string {
  return PATIENTS_FULL.find(p => p.id === patientId)?.diagnosis ?? '';
}

export function generateNewPatientChats(patientId: number): ChatMessage[] {
  const p = NEW_CHAT_NAMES[patientId];
  if (!p) return [];
  let id = patientId * 1000;
  const msg = (from: ChatMessage['from'], senderName: string, text: string, time: string): ChatMessage =>
    ({ id: id++, from, senderName, text, time, patientId });

  if (patientId === 8) return [
    msg('system', 'System', 'Care team assigned for Chow Kwok Fai: Dr. Chan Chi Keung (Cardiology), Nurse Sarah Leung, Case Manager Peter Ho', '07/01 09:00'),
    msg('caseManager', 'Peter Ho (Case Manager)', 'Welcome to iHomeCare! Post-PCI NSTEMI home care plan activated. Key goals: DAPT compliance, cardiac RPM monitoring, SMBG qid, Phase II cardiac rehab.', '07/01 09:15'),
    msg('family', p.familyName, 'Thank you Peter. Father discharged from QMH yesterday after PCI ×2. No chest pain since procedure. We have the KardiaMobile ready.', '07/01 09:20'),
    msg('nurse', 'Sarah Leung (RN)', 'Good morning! I will visit today to check PCI site, set up RPM devices, and review DAPT. Please do not skip Aspirin or Ticagrelor — bleeding AND clotting risks both matter.', '07/01 09:30'),
    msg('doctor', 'Dr. Chan Chi Keung', 'Chow sir — troponin cleared. Continue DAPT ×12 months minimum. Report any chest pain, SOB, or unusual bruising immediately. Cardiac rehab starts Day 3.', '07/01 10:00'),
    msg('nurse', 'Sarah Leung (RN)', 'Visit complete: PCI site clean, no haematoma. BP 130/80, HR 78, SpO₂ 95%. SMBG 6.4 fasting. Remote ECG NSR. Daughter trained on bleeding precautions.', '07/01 11:00'),
    msg('family', p.familyName, 'Sarah — father asked about lifting groceries. When can he resume normal activities?', '07/01 11:15'),
    msg('nurse', 'Sarah Leung (RN)', 'No heavy lifting >5kg for 7 days post-PCI. Groceries should be light bags only. Daughter can assist. Cardiac rehab will guide gradual return to activity.', '07/01 11:20'),
    msg('ai', '🤖 iHomeCare AI', formatNewsChatLine(8, patientDiagnosis(8), 'Cardiac RPM Day 1: HR 76 avg, BP 128/78, SpO₂ 96%. DAPT compliance 100%. SMBG range 5.8-8.2. No ischaemic alerts'), '07/02 08:00'),
    msg('doctor', 'Dr. Chan Chi Keung', 'Day 2 review — excellent progress. RPM data stable. Continue current regimen. Lipids recheck Week 2. Cardiac rehab Day 1 tolerated well.', '07/02 15:00'),
    msg('family', p.familyName, 'Father completed cardiac rehab session today — walked 120m with David Chan. No chest pain! He is in good spirits.', '07/03 16:00'),
    msg('caseManager', 'Peter Ho (Case Manager)', 'Week 1 summary: 5 RN visits, DAPT adherence 100%, cardiac rehab enrolled, SMBG log complete. Great teamwork!', '07/07 16:00'),
  ];

  if (patientId === 9) return [
    msg('system', 'System', 'Care team assigned for Lam Siu Wan: Dr. Lee Mei Ling (Respiratory), Nurse Jenny Tam, Case Manager Grace Tang', '07/03 09:00'),
    msg('caseManager', 'Grace Tang (Case Manager)', 'Welcome Mrs. Lam! COPD GOLD3 home care plan ready. Key goals: SpO₂ ≥88%, O₂ safety, inhaler technique, steroid taper, pulmonary rehab.', '07/03 09:15'),
    msg('family', p.familyName, 'Thank you Grace. Mother has been on O₂ 2L since discharge. O₂ concentrator installed. She is less wheezy today.', '07/03 09:20'),
    msg('nurse', 'Jenny Tam (RN)', 'I will visit today for baseline SpO₂, inhaler technique check, and O₂ safety education. Please have current medications ready including Prednisolone.', '07/03 09:30'),
    msg('nurse', 'Jenny Tam (RN)', 'Initial visit done: SpO₂ 92% RA, 93% on 2L O₂. Wheeze present but improving. Prednisolone 30mg Day 1. LAMA/LABA technique corrected. O₂ safety checklist posted.', '07/03 11:00'),
    msg('doctor', 'Dr. Lee Mei Ling', 'Day 1 review — GOLD3 exacerbation stabilising. Continue steroid taper: 30→20→10→stop over 7 days. Pulmonary rehab re-enrolled. LTOT assessment in 2 weeks if SpO₂ persistently <88%.', '07/03 15:00'),
    msg('family', p.familyName, 'Dr. Lee — mother desaturated to 89% when walking to bathroom. Should we increase O₂ flow?', '07/04 10:00'),
    msg('nurse', 'Jenny Tam (RN)', 'Increase to 2.5L/min during exertion if SpO₂ <90%. At rest, 2L is fine. Record exertion SpO₂ in log. Call if <85% or not recovering within 2 minutes.', '07/04 10:10'),
    msg('ai', '🤖 iHomeCare AI', 'COPD Day 2: SpO₂ avg 93% on O₂. RR 18. Steroid taper Day 5 (20mg). No desaturation events overnight. Exacerbation risk: moderate-low.', '07/04 18:00'),
    msg('family', p.familyName, 'Mother completed pulmonary rehab — walked 80m. SpO₂ dropped to 89% but recovered quickly. She is motivated!', '07/05 16:00'),
    msg('doctor', 'Dr. Lee Mei Ling', 'Excellent — exertional desaturation expected in GOLD3. Continue rehab with SpO₂ monitoring. Steroid taper on track. Next review Day 5.', '07/05 16:30'),
    msg('caseManager', 'Grace Tang (Case Manager)', 'Week 1: O₂ compliance 15h/day, inhaler adherence 95%, pulmonary rehab 2 sessions. Falls OT assessment scheduled Friday.', '07/07 17:00'),
  ];

  if (patientId === 10) return [
    msg('system', 'System', 'Care team assigned for Cheung Siu Ming: Dr. Cheung Kwok Wai (Internal Medicine), Connie Cheung (RN), Anna Leung (Case Manager)', '07/06 09:00'),
    msg('caseManager', 'Anna Leung (Case Manager)', 'Welcome to iHomeCare post-stroke programme. Key goals: NIHSS monitoring, PT/OT/ST 3×/wk, IDDSI Level 5 diet, fall prevention.', '07/06 09:15'),
    msg('family', p.familyName, 'Thank you Anna. My husband had L MCA stroke. Right side weak. We have grab bars installed and walker ready.', '07/06 09:20'),
    msg('nurse', 'Connie Cheung (RN)', 'Initial visit today: NIHSS assessment, home safety check, IDDSI diet review, and caregiver training on stroke warning signs. Please have discharge summary available.', '07/06 09:30'),
    msg('nurse', 'Connie Cheung (RN)', 'Day 1 complete: NIHSS 5. R hemiparesis RUE 3/5, RLE 4/5. IDDSI 5 tolerated — no aspiration. Morse 55 HIGH. Fall alarm activated. Wife competent with bed↔chair transfers.', '07/06 11:00'),
    msg('doctor', 'Dr. Cheung Kwok Wai', 'Day 1 plan confirmed. BP target <140/90 — do not lower too aggressively in acute phase. Continue DAPT. PT/OT/ST starting tomorrow. Repeat CT showed no haemorrhagic conversion.', '07/06 15:00'),
    msg('family', p.familyName, 'Michael Kwok came for PT today. Husband walked 15m with walker! Right arm moving better. Very encouraged.', '07/07 16:00'),
    msg('nurse', 'Connie Cheung (RN)', 'Day 2: NIHSS improved to 4. Speech 85% intelligible. No falls. Wife managing IDDSI meals well. Continue current therapy frequency.', '07/07 16:30'),
    msg('ai', '🤖 iHomeCare AI', formatNewsChatLine(10, patientDiagnosis(10), 'Stroke Day 2: NIHSS 4 (↓ from 5). BP 140/84. No new neurological deficits. Fall risk HIGH — zero falls recorded'), '07/07 20:00'),
    msg('doctor', 'Dr. Cheung Kwok Wai', 'NIHSS improving — excellent early recovery. Swallow reassessment Day 5 for possible IDDSI upgrade. Continue aggressive rehab while window is open.', '07/07 15:00'),
    msg('family', p.familyName, 'Speech therapist says he is finding words faster. Can we try soft solids soon?', '07/08 14:00'),
    msg('caseManager', 'Anna Leung (Case Manager)', 'ST will assess swallow safety Day 5. Do not advance diet without formal assessment — aspiration risk is real. You are doing wonderful caregiving!', '07/08 14:15'),
  ];

  if (patientId === 11) return [
    msg('system', 'System', 'Care team assigned for Wong Lai Chun: Dr. Chan Chi Keung (Breast/Oncology), Nurse Angela Ng, Case Manager Grace Tang', '07/02 09:00'),
    msg('caseManager', 'Grace Tang (Case Manager)', 'Welcome Mrs. Wong! Post-lumpectomy home care activated. Key goals: wound care, drain management, pain control, rest between activities.', '07/02 09:15'),
    msg('family', p.familyName, 'Thank you Grace. My wife had lumpectomy + SLNB on June 27. Drain still in place — output about 35mL yesterday. She is tired but coping.', '07/02 09:20'),
    msg('nurse', 'Angela Ng (RN)', 'I will visit for wound assessment, drain care education, and pain management review. Please have dressing supplies ready.', '07/02 09:30'),
    msg('nurse', 'Angela Ng (RN)', 'POD5 visit: Wound clean, no erythema. Drain output 28mL/24h (↓ from 35mL). Pain NRS 2/10. Husband trained on dressing change technique.', '07/03 11:00'),
    msg('doctor', 'Dr. Chan Chi Keung', 'Wound healing well. Drain likely removable when output <30mL ×2 consecutive days — almost there. Pain controlled on PRN regimen. Oncology appointment July 10 for adjuvant chemo planning.', '07/03 15:00'),
    msg('family', p.familyName, 'Drain output 22mL today. Less pain. She rested most of the day as advised. When can drain come out?', '07/04 16:00'),
    msg('nurse', 'Angela Ng (RN)', 'Output 22mL — approaching threshold. If <30mL tomorrow as well, I can remove drain at next visit. Keep photographing wound daily.', '07/04 16:15'),
    msg('ai', '🤖 iHomeCare AI', 'Oncology recovery Day 3: Pain NRS avg 1.5/10. Drain output trending down. Temp stable 36.5°C. No infection alerts. Rest compliance good.', '07/04 20:00'),
    msg('family', p.familyName, 'She is anxious about chemotherapy. Any support resources you can recommend?', '07/05 10:00'),
    msg('caseManager', 'Grace Tang (Case Manager)', 'Oncology social worker referral sent. Psychosocial support group meets Thursdays at HK Sanatorium. I will arrange pre-chemo education session before July 10 appointment.', '07/05 10:30'),
    msg('doctor', 'Dr. Chan Chi Keung', 'POD6 — excellent recovery trajectory. Drain removal likely next visit. Continue gentle arm exercises. Avoid lifting >2kg with affected arm.', '07/04 15:00'),
  ];

  if (patientId === 12) return [
    msg('system', 'System', 'Care team assigned for Fok Wai Keung: Dr. Chan Chi Keung (Cardiology), Nurse Sarah Leung, Case Manager Peter Ho', '07/04 09:00'),
    msg('caseManager', 'Peter Ho (Case Manager)', 'Welcome Fok sir! Heart failure NYHA III home care plan ready. Key goals: daily weight, fluid 1.5L max, GDMT compliance, I/O monitoring.', '07/04 09:15'),
    msg('family', p.familyName, 'Thank you Peter. Father discharged euvolemic at 68kg. We have smart scale paired. Daughter will manage daily weight log.', '07/04 09:20'),
    msg('nurse', 'Sarah Leung (RN)', 'First visit today: weight baseline, GDMT reconciliation, I/O chart setup, and pedal oedema assessment. Please have all medications ready.', '07/04 09:30'),
    msg('nurse', 'Sarah Leung (RN)', 'Day 1: Weight 68.5kg baseline. JVP 5cm. Pedal oedema 1+. BP 110/70, HR 86 AF. GDMT confirmed. Fluid restriction education completed.', '07/04 11:00'),
    msg('ai', '🤖 iHomeCare AI', formatNewsChatLine(12, patientDiagnosis(12), 'HF Day 2: Weight 68.2kg (↓0.3). I/O net -320mL. BNP 920 (↓ from 1,800). GDMT compliance 100% — continue weight/BNP monitoring'), '07/05 08:00'),
    msg('doctor', 'Dr. Chan Chi Keung', 'Day 2 — euvolemic at 68.2kg. Continue GDMT. Recheck renal panel Day 5. Daughter — you are doing excellent with the fluid log!', '07/05 15:00'),
    msg('family', p.familyName, 'Father had good appetite today. No orthopnoea. Weight 68.0kg this morning. Can he have soup with dinner?', '07/06 18:00'),
    msg('nurse', 'Sarah Leung (RN)', 'Soup counts towards 1.5L fluid limit! Use a measuring cup — typical bowl is 200-250mL. Track in I/O chart. Low sodium soup preferred.', '07/06 18:15'),
    msg('family', p.familyName, 'Understood — we will measure everything. Father says he feels much less breathless than in hospital.', '07/06 18:20'),
    msg('doctor', 'Dr. Chan Chi Keung', 'Weight 68.0kg Day 3 — continuing diuresis appropriately. No uptitration needed yet. BNP trending correctly.', '07/06 15:00'),
    msg('caseManager', 'Peter Ho (Case Manager)', 'Week 1 summary: Weight ↓0.5kg, GDMT adherence 100%, 5 RN visits, zero HF decompensation alerts. Excellent family engagement.', '07/08 16:00'),
  ];

  if (patientId === 13) return [
    msg('system', 'System', 'Care team assigned for Lau Wai Yin: Dr. Cheung Kwok Wai (Endocrinology), Nurse Vivian Lau, Case Manager Anna Leung', '07/05 09:00'),
    msg('caseManager', 'Anna Leung (Case Manager)', 'Welcome! T2DM basal-bolus home care activated. Key goals: SMBG qid, insulin technique, foot checks, DM educator sessions.', '07/05 09:15'),
    msg('family', p.familyName, 'Thank you Anna. Sister discharged from Kwong Wah. Insulin pens and glucagon kit ready. I will supervise all injections.', '07/05 09:20'),
    msg('nurse', 'Vivian Lau (RN)', 'First visit: insulin technique verification, SMBG log setup, foot inspection, hypoglycaemia education. DM educator session scheduled tomorrow.', '07/05 09:30'),
    msg('nurse', 'Vivian Lau (RN)', 'Day 1 complete: Glargine 22u + lispro with meals. SMBG 7.2 fasting. Injection sites rotating. Foot monofilament 8/10. Brother trained on glucagon.', '07/05 11:00'),
    msg('doctor', 'Dr. Cheung Kwok Wai', 'Day 1 plan: Continue basal-bolus. Empagliflozin for renoprotection (UACR 320). Target HbA1c <7%. Podiatry monthly. Sick day rules card on fridge.', '07/05 15:00'),
    msg('family', p.familyName, 'DM educator session went well — carb counting makes sense now. SMBG range 5.8-10.2 today. No lows.', '07/06 14:00'),
    msg('ai', '🤖 iHomeCare AI', 'DM Day 2: SMBG avg 7.8 mmol/L. No hypoglycaemia (<4.0). Ketones negative. Insulin adherence 100%. Foot check normal.', '07/06 20:00'),
    msg('nurse', 'Vivian Lau (RN)', 'Day 2: Insulin technique perfect. Brother demonstrates correct rotation. Ketone strips reviewed. Sick day rules card posted.', '07/06 11:00'),
    msg('family', p.familyName, 'Quick question — she wants dim sum this weekend. How do we count carbs for har gow?', '07/07 10:00'),
    msg('doctor', 'Dr. Cheung Kwok Wai', 'Har gow ~6g carbs each — bolus accordingly. Better to choose steamed over fried. SMBG 2h post-meal to learn her response. Enjoy in moderation!', '07/07 10:15'),
    msg('caseManager', 'Anna Leung (Case Manager)', 'Week 1: SMBG qid compliance 98%, insulin technique verified, DM educator session complete, podiatry booked. Nephrology F/U in 4 weeks.', '07/09 16:00'),
  ];

  if (patientId === 14) return [
    msg('system', 'System', 'Care team assigned for Tsang Kwok Hung: Dr. Chan Chi Keung (Nephrology), Nurse Connie Cheung, Case Manager Peter Ho', '07/07 09:00'),
    msg('caseManager', 'Peter Ho (Case Manager)', 'Welcome Tsang sir! CKD Stage 4 home care plan activated. Key goals: BP <130/80, renal diet, fluid balance, weekly ESA injection.', '07/07 09:15'),
    msg('family', p.familyName, 'Thank you Peter. My husband eGFR 22 at discharge. I am ready to learn ESA injection. Renal diet handout received.', '07/07 09:20'),
    msg('nurse', 'Connie Cheung (RN)', 'First visit: BP baseline, ESA injection training, renal diet review, fluid balance chart setup. AVF planning education included.', '07/07 09:30'),
    msg('nurse', 'Connie Cheung (RN)', 'Day 1: BP 144/90. eGFR 22. Hb 9.8 pre-ESA. ESA injection training completed — wife practised on pillow. PO₄ binders reviewed. Avoid NSAIDs reinforced.', '07/07 11:00'),
    msg('doctor', 'Dr. Chan Chi Keung', 'Day 1 plan: Darbepoetin 40mcg weekly. Target Hb 10-12. Strict renal diet K⁺ <2g, PO₄ control. AVF referral submitted — planning in 4 weeks.', '07/07 15:00'),
    msg('family', p.familyName, 'First ESA injection done this morning — left thigh, no reaction. Hb 10.2 on lab result. Husband less fatigued already.', '07/08 14:00'),
    msg('nurse', 'Connie Cheung (RN)', 'Day 2: ESA administered correctly. K⁺ 4.8 stable. No oedema. Pruritus mild — emollients advised. Wife confident for weekly injections.', '07/08 11:00'),
    msg('ai', '🤖 iHomeCare AI', 'CKD4 Day 2: BP 142/88. Hb 10.2 (↑ from 9.8). K⁺ 4.8. Weight stable. ESA response positive. eGFR monitoring active.', '07/08 20:00'),
    msg('family', p.familyName, 'Can he have a small banana? He misses fruit.', '07/09 10:00'),
    msg('doctor', 'Dr. Chan Chi Keung', 'Banana is high K⁺ — avoid in CKD4. Try apple (small, peeled) or berries in moderation. Dietitian can suggest safe fruit list. K⁺ target 4.0-5.0.', '07/09 10:15'),
    msg('caseManager', 'Peter Ho (Case Manager)', 'Week 1: ESA ×1 administered, BP log BID, renal diet compliance good, AVF pre-op education booklet provided. Nephrology telehealth monthly.', '07/10 16:00'),
  ];

  if (patientId === 15) return [
    msg('system', 'System', 'Care team assigned for Mak Ka Ming: Dr. Chan Chi Keung (Cardiology), Nurse Sarah Leung, Case Manager Peter Ho', '06/30 09:00'),
    msg('caseManager', 'Peter Ho (Case Manager)', 'Welcome Mak sir! Resistant HTN + OSA home care plan ready. Key goals: BP BID monitoring, CPAP ≥4h/night, weight management, exercise 150min/wk.', '06/30 09:15'),
    msg('family', p.familyName, 'Thank you Peter. Husband on 4-drug BP regimen + CPAP. ABPM device fitted at UCH. CPAP compliance has been 5-6 hours recently.', '06/30 09:20'),
    msg('nurse', 'Sarah Leung (RN)', 'First visit: 24h ABPM setup check, CPAP data download, home BP technique, DASH diet education. Please have CPAP machine ready.', '06/30 09:30'),
    msg('nurse', 'Sarah Leung (RN)', 'Day 1: ABPM fitted. CPAP 5.8h last night, AHI residual 4.1. Home BP 138/86. 4-drug regimen confirmed. DASH diet handout reviewed.', '06/30 11:00'),
    msg('ai', '🤖 iHomeCare AI', 'HTN/OSA Day 2: AM BP 136/84, PM 128/80. CPAP 6.2h, AHI 3.2. Weight ↓0.5kg. No orthostatic symptoms. LVH stable on echo.', '07/01 08:00'),
    msg('doctor', 'Dr. Chan Chi Keung', 'Day 2 — BP improving on 4-drug + CPAP. Compliance excellent. Continue current regimen. Weight target: 5% reduction over 3 months. Cardiology echo in 3 months.', '07/01 15:00'),
    msg('family', p.familyName, 'CPAP mask sometimes leaks — husband wakes with dry mouth. Normal?', '07/02 09:00'),
    msg('nurse', 'Sarah Leung (RN)', 'Leak >24L/min affects therapy. Try chin strap or mask refit. Humidifier level can help dry mouth. I will arrange CPAP clinic review if leak persists.', '07/02 09:15'),
    msg('family', p.familyName, 'He walked 25 minutes today with David Chan. Felt good! BP after exercise 142/88.', '07/02 16:00'),
    msg('doctor', 'Dr. Chan Chi Keung', 'Post-exercise BP 142/88 is acceptable. Continue building to 150min/week. Morning headaches gone since CPAP compliance improved — great sign!', '07/02 15:00'),
    msg('caseManager', 'Peter Ho (Case Manager)', 'Week 1: BP avg 132/82, CPAP avg 6.0h/night, exercise 60min total. ABPM results pending. Resistant HTN responding well to combined approach.', '07/04 16:00'),
  ];

  if (patientId === 16) return [
    msg('system', 'System', 'Care team assigned for Fung Kam Tong: Dr. Lee Mei Ling (Internal Med), Nurse Angela Ng, Case Manager Tony Lam', '07/08 09:00'),
    msg('caseManager', 'Tony Lam (Case Manager)', 'Welcome Fung sir! Post R hip ORIF home care activated. Key goals: NWB ×6 weeks, PT gait training, DVT prophylaxis, pain management, safe transfers.', '07/08 09:15'),
    msg('family', p.familyName, 'Thank you Tony. Father POD9 from St. Teresa\'s. NWB right leg. Grab bars and raised toilet seat installed. Sliding board ready.', '07/08 09:20'),
    msg('nurse', 'Angela Ng (RN)', 'First visit: wound check, DVT assessment, NWB education, enoxaparin technique, fall risk review. Home OT modifications confirmed.', '07/08 09:30'),
    msg('nurse', 'Angela Ng (RN)', 'POD9 visit: Wound dry, staples intact. Pain NRS 3/10. No calf swelling. Enoxaparin 40mg started. Morse 65 HIGH. NWB compliance confirmed.', '07/08 11:00'),
    msg('doctor', 'Dr. Lee Mei Ling', 'POD9 review — wound healing on track. Continue NWB ×6 weeks total. Enoxaparin until Day 14 or fully ambulatory. XR follow-up 4 weeks post-op.', '07/08 15:00'),
    msg('family', p.familyName, 'Eric Chan came for PT — father walked 20m with walker NWB! Pain 3/10 during session. Very proud of him.', '07/09 16:00'),
    msg('nurse', 'Angela Ng (RN)', 'POD10: Wound clean. Pain 2/10 at rest. Transfers with sliding board improving. Enoxaparin Day 10. Continue PT 3×/wk.', '07/09 11:00'),
    msg('ai', '🤖 iHomeCare AI', 'Ortho Day 2: Pain NRS avg 2.5/10. NWB compliance 100%. No DVT signs. Fall risk HIGH — zero falls. Gait distance 20m with walker.', '07/09 20:00'),
    msg('family', p.familyName, 'Father frustrated he cannot use bathroom alone. How long until partial weight-bearing?', '07/10 10:00'),
    msg('doctor', 'Dr. Lee Mei Ling', 'Partial weight-bearing from Week 6 per ortho protocol — XR will confirm healing. Care worker 3×/wk for ADLs until then. Frustration is normal — reassure him progress is good.', '07/10 10:15'),
    msg('caseManager', 'Tony Lam (Case Manager)', 'Week 1: PT 3 sessions, enoxaparin Day 10/14, wound healing well, zero falls. Ortho XR scheduled Week 4. Care worker roster confirmed.', '07/12 16:00'),
  ];

  if (patientId === 17) return [
    msg('system', 'System', 'Care team assigned for Chan Yuk Lin: Dr. Lee Mei Ling (Respiratory), Nurse Jenny Tam, Case Manager Grace Tang', '07/02 09:00'),
    msg('caseManager', 'Grace Tang (Case Manager)', 'Welcome Mrs. Chan! CAP + COPD GOLD2 home care plan ready. Key goals: complete antibiotics, SpO₂ monitoring, incentive spirometry, inhaler technique.', '07/02 09:15'),
    msg('family', p.familyName, 'Thank you Grace. My wife was discharged from PWH on Amox-Clav Day 3. Still coughing but no fever since yesterday. SpO₂ 94% on room air — we\'re relieved.', '07/02 09:20'),
    msg('nurse', 'Jenny Tam (RN)', 'First visit: vitals, lung auscultation, antibiotic tolerance, inhaler technique, incentive spirometry training. Please have medications ready.', '07/02 09:30'),
    msg('nurse', 'Jenny Tam (RN)', 'Day 1: Temp 37.0. SpO₂ 94%. RR 20. RLL crackles improving. Amox-Clav Day 3 tolerated. Tiotropium technique reviewed. Husband trained on escalation criteria.', '07/02 11:00'),
    msg('doctor', 'Dr. Lee Mei Ling', 'Day 1 — CAP responding. Complete 7-day Amox-Clav. Continue Tiotropium for COPD. Incentive spirometry 10 breaths q2h. RTC CXR Week 4.', '07/02 15:00'),
    msg('family', p.familyName, 'Wife did incentive spirometry — peak 520mL! Temp 36.6 today. Much less cough. Feeling "much better".', '07/04 16:00'),
    msg('ai', '🤖 iHomeCare AI', 'CAP+COPD Day 3: Temp 36.6. SpO₂ 96%. RR 16. Antibiotic Day 5/7. Incentive spirometry compliance 90%. Infection resolving.', '07/04 18:00'),
    msg('nurse', 'Jenny Tam (RN)', 'Day 3: Afebrile ×72h. SpO₂ 96%. Appetite returned. Sputum white, decreasing. Amox-Clav Day 5 — 2 more days. COPD stable.', '07/04 11:00'),
    msg('family', p.familyName, 'Should she restart her usual walks in the park after antibiotics finish?', '07/05 10:00'),
    msg('doctor', 'Dr. Lee Mei Ling', 'Wait until antibiotic course complete + 48h afebrile. Then gradual return — start with 10min flat walk, monitor SpO₂. COPD action plan applies if wheeze returns.', '07/05 10:15'),
    msg('caseManager', 'Grace Tang (Case Manager)', 'Week 1: Antibiotic course completing Day 7, SpO₂ improved 94→96%, incentive spirometry compliant, zero escalation events. COPD action plan updated.', '07/08 17:00'),
  ];

  if (patientId === 18) return [
    msg('ai', '🤖 iHomeCare AI', '📋 Discharge Summary: Zhang Jianguo — POD 7. VATS RUL lobectomy done. Persistent air leak resolved POD 5. Chest tube removed POD 6. Discharged home. Wound: 3 thoracoscopic ports clean. SpO₂ 96% RA. Pain VAS 3. IS volume 900mL. Final pathology pending. Perindopril 4mg + Atorvastatin 20mg continued. Community nurse visit scheduled POD 8.', 'Day 1 09:00'),
    msg('nurse', 'Jenny Tam (RN)', 'Initial home visit completed. Wound clean/dry/intact. SpO₂ 96%. IS 900mL. VAS 3→5 with cough. Wife trained on wound check + VTE warning signs. Perindopril cough diary started.', 'Day 1 09:45'),
    msg('doctor', 'Dr. Wang Wei (Thoracic Surgeon)', 'Noted. Continue current plan. Monitor cough pattern with Perindopril — if cough persists or worsens, we will discuss supervised switch to ARB. Final pathology expected within 7-10 days — will determine adjuvant therapy pathway then.', 'Day 1 15:30'),
    msg('family', p.familyName, 'Thank you doctor. I set up his pill box and the incentive spirometer chart. He walked to the bathroom by himself this morning — small steps but I can see him getting stronger. The cough does worry me though…', 'Day 1 18:30'),
    msg('nurse', 'Raymond Wong (PT)', 'PT initial assessment completed PDD3. Shoulder ROM: 160° flexion (target 180°). Gait: independent 100m, SpO₂ 96% on ambulation. Breathing exercises demonstrated — pursed-lip + diaphragmatic. Exercise plan: walking 5min ×3/day, progress +5min/week.', 'Day 3 11:00'),
    msg('nurse', 'Jenny Tam (RN)', 'PDD5 wound check: all 3 ports healing well, no erythema or drainage. IS now 1200mL. Pain VAS 2 — Tramadol use reduced to once yesterday. Cough stable — dry, 1-2 episodes/day. Weight 66.3kg. VTE: negative.', 'Day 5 09:30'),
    msg('ai', '🤖 iHomeCare AI', '📊 Week 1 Summary: SpO₂ trend 95-98%. IS volume ↑ 900→1200mL. VAS trend ↓ 5→2/10. Wound: no SSI signs. Weight stable. Cough: dry, stable. VTE: negative. Pending: final pathology report. Next: Thoracic surgery clinic 2-week follow-up.', 'Day 7 09:00'),
    msg('doctor', 'Dr. Wang Wei (Thoracic Surgeon)', 'Week 1 review done — excellent progress. Continue current plan. Regarding Perindopril cough: I believe it is drug-related rather than post-operative. Will switch to Losartan 50mg qd starting today. Monitor BP and any cough changes. Final pathology should be ready by next teleconsult — we will discuss adjuvant strategy then.', 'Day 7 15:00'),
  ];

  return [];
}
