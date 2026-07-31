import { type FamilyContact, type FamilyComm } from '../careTeam';

export const NEW_PATIENT_FAMILY: Record<number, FamilyContact[]> = {
  8: [
    { name: 'Chow Mei Ling', relationship: 'Daughter', phone: '+852 9123 4567', email: 'mei.ling.chow@email.com', isPrimary: true, livingWith: false, notes: 'Visits daily after work. Manages medication box, cardiac rehab appointments, and SMBG log. Primary contact for chest pain or bleeding emergencies.' },
    { name: 'Mrs. Chow', relationship: 'Wife', phone: '+852 9123 4567', email: '', isPrimary: false, livingWith: true, notes: 'Full-time caregiver. Assists with meals, low-sodium diet, and daily weight monitoring post-PCI.' },
  ],
  9: [
    { name: 'Lam Ka Ho', relationship: 'Son', phone: '+852 9234 5678', email: 'ka.ho.lam@email.com', isPrimary: true, livingWith: false, notes: 'Lives nearby in Hung Hom. Manages O₂ concentrator, inhaler supplies, and pulmonary rehab transport. Trained on COPD action plan and fall prevention.' },
  ],
  10: [
    { name: 'Cheung Lai King', relationship: 'Wife', phone: '+852 9345 6789', email: 'lai.king.cheung@email.com', isPrimary: true, livingWith: true, notes: 'Primary caregiver. Assists with transfers, IDDSI Level 5 diet preparation, medication administration, and fall prevention. Trained on NIHSS observation and stroke warning signs.' },
  ],
  11: [
    { name: 'Wong Ka Wai', relationship: 'Husband', phone: '+852 9456 7890', email: 'ka.wai.wong@email.com', isPrimary: true, livingWith: true, notes: 'Supports wound care, drain monitoring, and emotional support during adjuvant chemo planning. Trained on return precautions and infection signs.' },
  ],
  12: [
    { name: 'Fok Siu Ying', relationship: 'Daughter', phone: '+852 9567 8901', email: 'siu.ying.fok@email.com', isPrimary: true, livingWith: false, notes: 'Visits BID. Manages daily weight log, fluid restriction (1.5L), low-sodium meals, and GDMT schedule. Power of attorney for medical decisions.' },
  ],
  13: [
    { name: 'Lau Man Fai', relationship: 'Brother', phone: '+852 9678 9012', email: 'man.fai.lau@email.com', isPrimary: true, livingWith: false, notes: 'Visits daily. Supervises insulin administration, SMBG qid, and foot inspection. Coordinates podiatry and DM educator appointments.' },
  ],
  14: [
    { name: 'Tsang Mei Fong', relationship: 'Wife', phone: '+852 9789 0123', email: 'mei.fong.tsang@email.com', isPrimary: true, livingWith: true, notes: 'Full-time caregiver. Manages renal diet (low K⁺/PO₄), fluid balance chart, ESA weekly injection, and home BP monitoring. AVF pre-op education completed.' },
  ],
  15: [
    { name: 'Mak Ching Yee', relationship: 'Wife', phone: '+852 9890 1234', email: 'ching.yee.mak@email.com', isPrimary: true, livingWith: true, notes: 'Monitors home BP BID, CPAP compliance (≥4h/night), and weight management programme. Low-sodium meal preparation.' },
  ],
  16: [
    { name: 'Fung Wai Man', relationship: 'Son', phone: '+852 9901 2345', email: 'wai.man.fung@email.com', isPrimary: true, livingWith: false, notes: 'Visits daily. Assists with NWB transfers, sliding board technique, DVT prophylaxis (Enoxaparin), and home safety modifications. Ortho follow-up coordinator.' },
  ],
  17: [
    { name: 'Chan Wai Keung', relationship: 'Husband', phone: '+852 9012 3456', email: 'wai.keung.chan@email.com', isPrimary: true, livingWith: true, notes: 'Assists with antibiotic completion, SpO₂ monitoring, incentive spirometry, and inhaler technique. Trained on COPD + CAP escalation criteria.' },
  ],
  18: [
    { name: 'Mrs. Zhang (Lin Xia)', relationship: 'Wife', phone: '+86 138 1792 3456', email: 'linxia.zhang@email.com', isPrimary: true, livingWith: true, notes: 'Full-time caregiver. Manages medication box, incentive spirometry log, wound inspection, and smoking cessation support. Trained on VTE warning signs and thoracic surgery escalation criteria.' },
  ],
};

export const NEW_FAMILY_COMMS: Record<number, FamilyComm[]> = {
  8: [
    { date: '2026-07-02', time: '16:00', contact: 'Chow Mei Ling (Daughter)', method: 'Phone', summary: 'Day 2 post-PCI HaH. No chest pain. Weight stable. DAPT compliance confirmed. Daughter reports father walked to bathroom independently.', actionItems: 'Continue DAPT ×12 months. Call if CP, SOB, or bleeding. Cardiac rehab Wk2 confirmed.', direction: 'outgoing' },
    { date: '2026-07-01', time: '10:00', contact: 'Mrs. Chow (Wife)', method: 'In-Person', summary: 'Initial HaH visit. PCI site clean, no haematoma. SMBG technique reviewed. Low-sodium diet education.', actionItems: 'SMBG qid log. PCI site check daily. ECG remote sync confirmed.', direction: 'outgoing' },
    { date: '2026-06-30', time: '14:00', contact: 'Chow Mei Ling (Daughter)', method: 'Video Call', summary: 'Discharge planning from QMH Cardiology. Reviewed DAPT, cardiac meds, and RPM device setup.', actionItems: 'Medication box setup. Emergency numbers on fridge.', direction: 'outgoing' },
  ],
  9: [
    { date: '2026-07-04', time: '17:00', contact: 'Lam Ka Ho (Son)', method: 'Phone', summary: 'SpO₂ 94% on 2L O₂. Steroid taper Day 5. No increase in sputum. Pulmonary rehab re-enrolled.', actionItems: 'Continue O₂ PRN. Call if SpO₂ <88%. Falls OT assessment Friday.', direction: 'outgoing' },
    { date: '2026-07-03', time: '11:00', contact: 'Lam Ka Ho (Son)', method: 'In-Person', summary: 'Son trained on O₂ concentrator, LAMA/LABA inhaler, and exacerbation action plan during RN visit.', actionItems: 'Daily SpO₂ log. O₂ safety checklist posted.', direction: 'outgoing' },
    { date: '2026-07-02', time: '15:00', contact: 'Lam Ka Ho (Son)', method: 'Message', summary: 'Confirmed home O₂ delivery and nebulizer setup complete.', actionItems: 'RN visit scheduled 11:00 tomorrow.', direction: 'incoming' },
  ],
  10: [
    { date: '2026-07-07', time: '16:30', contact: 'Cheung Lai King (Wife)', method: 'In-Person', summary: 'NIHSS 4 stable. RUE 3+/5 improving. Speech 85% intelligible. IDDSI 5 tolerated. No falls since discharge.', actionItems: 'Continue PT/OT 3×/wk. ST 2×/wk. Report new weakness or speech change.', direction: 'outgoing' },
    { date: '2026-07-06', time: '09:00', contact: 'Cheung Lai King (Wife)', method: 'In-Person', summary: 'Home safety assessment. Grab bars installed. Walker technique reviewed. DAPT education completed.', actionItems: 'Bedside commode for night. Fall alarm on smartwatch active.', direction: 'outgoing' },
    { date: '2026-07-05', time: '14:00', contact: 'Cheung Lai King (Wife)', method: 'Video Call', summary: 'PYNEH discharge planning. Reviewed stroke warning signs, medication schedule, and therapy appointments.', actionItems: 'Neuro clinic F/U 4 weeks. NIHSS home log started.', direction: 'outgoing' },
  ],
  11: [
    { date: '2026-07-03', time: '11:00', contact: 'Wong Ka Wai (Husband)', method: 'In-Person', summary: 'POD5 wound clean. Drain output 28mL — approaching removal threshold. Pain NRS 2/10.', actionItems: 'Continue wound care BID. Oncology appointment 2026-07-10 for chemo planning.', direction: 'outgoing' },
    { date: '2026-07-02', time: '15:00', contact: 'Wong Ka Wai (Husband)', method: 'Phone', summary: 'Drain care technique reviewed. No signs of infection. Husband confident with dressing change.', actionItems: 'Photograph wound daily. Call if Temp >38°C or drain output increases.', direction: 'outgoing' },
    { date: '2026-07-01', time: '10:00', contact: 'Wong Ka Wai (Husband)', method: 'In-Person', summary: 'Initial HaH wound nurse visit. Drain output 35mL. Surgical site intact. Psychological support resources provided.', actionItems: 'Low-effort meal plan. Rest between activities.', direction: 'outgoing' },
  ],
  12: [
    { date: '2026-07-05', time: '18:00', contact: 'Fok Siu Ying (Daughter)', method: 'Phone', summary: 'Weight 68.2kg stable (target <68.5). No orthopnoea. Pedal oedema trace. BNP trending down.', actionItems: 'Continue daily weight. Fluid 1.5L max. Renal panel Wednesday.', direction: 'outgoing' },
    { date: '2026-07-04', time: '09:30', contact: 'Fok Siu Ying (Daughter)', method: 'In-Person', summary: 'Daughter trained on GDMT schedule, weight scale, and fluid restriction during RN visit.', actionItems: 'I/O chart on fridge. Call if weight gain >1kg/24h.', direction: 'outgoing' },
    { date: '2026-07-03', time: '16:00', contact: 'Fok Siu Ying (Daughter)', method: 'Video Call', summary: 'QMH discharge planning. Euvolemic at 68kg. Oral Furosemide transition confirmed.', actionItems: 'Smart scale paired. Telehealth weight upload qAM.', direction: 'outgoing' },
  ],
  13: [
    { date: '2026-07-06', time: '14:00', contact: 'Lau Man Fai (Brother)', method: 'Phone', summary: 'CBG 6-10 range on basal-bolus. No hypoglycaemia. Ketones negative. Foot monofilament 8/10.', actionItems: 'Continue SMBG qid. DM educator visit Friday. Podiatry monthly.', direction: 'outgoing' },
    { date: '2026-07-05', time: '10:00', contact: 'Lau Man Fai (Brother)', method: 'In-Person', summary: 'Insulin technique verified. Renal dietitian meal plan reviewed. UACR 320 — nephrology F/U scheduled.', actionItems: 'Insulin pen storage. Sick day rules card on fridge.', direction: 'outgoing' },
    { date: '2026-07-04', time: '15:00', contact: 'Lau Man Fai (Brother)', method: 'Message', summary: 'Brother confirmed discharge from Kwong Wah. Home prepared for insulin storage.', actionItems: 'DM educator visit Day 2.', direction: 'incoming' },
  ],
  14: [
    { date: '2026-07-08', time: '11:00', contact: 'Tsang Mei Fong (Wife)', method: 'In-Person', summary: 'K⁺ 4.8 stable. Hb 10.2 post-ESA. Nausea resolved. AVF planning in 4 weeks.', actionItems: 'Continue renal diet. ESA weekly — wife demonstrates SC technique. Fluid balance chart daily.', direction: 'outgoing' },
    { date: '2026-07-07', time: '09:00', contact: 'Tsang Mei Fong (Wife)', method: 'In-Person', summary: 'ESA injection training completed. PO₄ binders with meals reviewed. Avoid NSAIDs reinforced.', actionItems: 'BP log BID. Report pruritus worsening or K⁺ symptoms.', direction: 'outgoing' },
    { date: '2026-07-06', time: '14:00', contact: 'Tsang Mei Fong (Wife)', method: 'Phone', summary: 'Tuen Mun discharge planning. Uraemic symptoms improved. Renal diet handout provided.', actionItems: 'Nephrology monthly telehealth. AVF pre-op education booklet.', direction: 'outgoing' },
  ],
  15: [
    { date: '2026-07-01', time: '16:00', contact: 'Mak Ching Yee (Wife)', method: 'Phone', summary: 'Home BP 136/84. CPAP 6.2h last night. No morning headaches. Weight ↓0.5kg this week.', actionItems: 'Continue CPAP. DASH diet. Exercise 150min/wk target.', direction: 'outgoing' },
    { date: '2026-06-30', time: '10:00', contact: 'Mak Ching Yee (Wife)', method: 'In-Person', summary: '24h ABPM device fitted. CPAP remote compliance dashboard reviewed. 4-drug HTN regimen confirmed.', actionItems: 'ABPM return in 24h. CPAP mask refit if leak >24L/min.', direction: 'outgoing' },
    { date: '2026-06-29', time: '14:00', contact: 'Mak Ching Yee (Wife)', method: 'Video Call', summary: 'UCH discharge. BP controlled on 4-drug + CPAP. LVH stable on echo.', actionItems: 'Home BP BID log. Cardiology 3-month echo.', direction: 'outgoing' },
  ],
  16: [
    { date: '2026-07-09', time: '15:00', contact: 'Fung Wai Man (Son)', method: 'In-Person', summary: 'POD10. Wound clean. NRS 2/10. Transfers with sliding board. PT gait training progressing.', actionItems: 'NWB ×6 weeks. Enoxaparin until Day 14. XR follow-up 4 weeks.', direction: 'outgoing' },
    { date: '2026-07-08', time: '09:00', contact: 'Fung Wai Man (Son)', method: 'In-Person', summary: 'Home OT assessment. Grab bars, raised toilet seat, clear pathways. Fall risk HIGH — night light installed.', actionItems: 'Care worker 3×/wk for ADLs. PT 3×/wk.', direction: 'outgoing' },
    { date: '2026-07-07', time: '11:00', contact: 'Fung Wai Man (Son)', method: 'Phone', summary: 'St Teresa discharge planning. DHS ORIF stable. Osteoporosis management started.', actionItems: 'WC + walker delivered. DVT ppx education.', direction: 'outgoing' },
  ],
  17: [
    { date: '2026-07-03', time: '17:00', contact: 'Chan Wai Keung (Husband)', method: 'Phone', summary: 'Afebrile Day 3. SpO₂ 94% RA. Amox-clav Day 5 of 7. Cough improving. Incentive spirometry 10×/day.', actionItems: 'Complete antibiotics. Pulm rehab referral sent. GP F/U 1 week.', direction: 'outgoing' },
    { date: '2026-07-02', time: '10:00', contact: 'Chan Wai Keung (Husband)', method: 'In-Person', summary: 'Husband trained on SpO₂ monitoring, antibiotic schedule, and COPD inhaler technique.', actionItems: 'SpO₂ BID log. Call if fever >38°C or SpO₂ <92%.', direction: 'outgoing' },
    { date: '2026-07-01', time: '14:00', contact: 'Chan Wai Keung (Husband)', method: 'Message', summary: 'Confirmed PWH discharge. Antibiotics and O₂ monitor ready at home.', actionItems: 'RN visit 10:00 tomorrow.', direction: 'incoming' },
  ],
  18: [
    { date: '[Post-Discharge Day 1 — exact date TBD]', time: '10:00', contact: 'Mrs. Zhang (Lin Xia) (Wife)', method: 'In-Person', summary: 'Initial HaH visit. Wound assessment completed. Incentive spirometry technique reviewed. VTE signs education. Cough diary initiated.', actionItems: 'Wound photo daily. IS log q2h. Cough diary. VTE warning signs poster on fridge.', direction: 'outgoing' },
    { date: '[Post-Discharge Day 1 — exact date TBD]', time: '18:30', contact: 'Mrs. Zhang (Lin Xia) (Wife)', method: 'Message', summary: 'Wife reports: Mr. Zhang walked to bathroom independently. Pill box and IS chart set up. Concerned about cough — reassured that thoracic team is monitoring.', actionItems: 'Continue current plan. Report any worsening cough or new symptoms.', direction: 'incoming' },
    { date: '[Post-Discharge Day 5 — exact date TBD]', time: '16:00', contact: 'Mrs. Zhang (Lin Xia) (Wife)', method: 'Message', summary: 'Week 1 progress. IS 1200mL. Pain VAS 2. Cough stable. Wife confident with wound care and spirometry. Reports good appetite and mood improving.', actionItems: 'Continue PT exercises. Await final pathology. 2-week thoracic clinic confirmed.', direction: 'outgoing' },
  ],
};
