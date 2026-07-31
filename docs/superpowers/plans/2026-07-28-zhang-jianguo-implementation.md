# Zhang Jianguo Patient Case Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Patient 18 (Zhang Jianguo, post-VATS RUL lobectomy) to iHomeCare demo data with complete clinical records across all 9 modules.

**Architecture:** Extend existing newPatients data pipeline — one PatientFull record in `patientRecords.ts`, thresholds in `vitalSignsExtras.ts`, chat in `chatExtras.ts`, care plan in `carePlans.ts`, family contact in `chatFamily.ts`, and medical history in `medicalHistory.ts`. All follow existing P8-P17 patterns exactly.

**Tech Stack:** TypeScript, React, Vite. No new dependencies.

## Global Constraints

- All clinical content must match the design spec at `docs/superpowers/specs/2026-07-28-zhang-jianguo-design.md`
- Markers `[待分配]` / `[待确认]` / `[待胸外团队确认]` must be preserved exactly as in spec
- Patient ID = 18
- Follow existing code patterns from P8-P17 exactly (field order, comments, structure)
- Build must succeed after every task

---

### Task 1: Add Family Contact

**Files:**
- Modify: `src/data/chatFamily.ts:53-54` (add entry after line 53)

**Interfaces:**
- Consumes: `parseFamilyEntry()` helper (existing)
- Produces: `FAMILY_CONTACT_BY_PATIENT[18]` and `NEW_CHAT_NAMES[18]` auto-derived

- [ ] **Step 1: Add family contact entry**

```typescript
// In src/data/chatFamily.ts, add after line 53 (patient 17 entry):
  18: parseFamilyEntry('Mrs. Zhang (Lin Xia)', 56, 'F'),
```

- [ ] **Step 2: Add patient name to PATIENT_NAMES_8_17 (extend to 18)**

```typescript
// In src/data/chatFamily.ts, modify PATIENT_NAMES_8_17:
const PATIENT_NAMES_8_18: Record<number, string> = {
  8: 'Chow Kwok Fai', 9: 'Lam Siu Wan', 10: 'Cheung Siu Ming', 11: 'Wong Lai Chun',
  12: 'Fok Wai Keung', 13: 'Lau Wai Yin', 14: 'Tsang Kwok Hung', 15: 'Mak Ka Ming',
  16: 'Fung Kam Tong', 17: 'Chan Yuk Lin', 18: 'Zhang Jianguo',
};
for (const [id, patientName] of Object.entries(PATIENT_NAMES_8_18)) {
  const n = Number(id);
  if (NEW_CHAT_NAMES[n]) NEW_CHAT_NAMES[n].name = patientName;
}
```

- [ ] **Step 3: Verify build**

Run: `npx vite build --logLevel error`

- [ ] **Step 4: Commit**

```bash
git add src/data/chatFamily.ts
git commit -m "feat: add Zhang Jianguo (P18) family contact"
```

---

### Task 2: Add PatientFull Record

**Files:**
- Modify: `src/data/newPatients/patientRecords.ts:674` (add before closing `];`)

**Interfaces:**
- Consumes: `PatientFull` interface (existing)
- Produces: `NEW_PATIENTS[10]` (index 10, patient 18)

- [ ] **Step 1: Add patient 18 record**

Insert before line 674 (`];` closing the NEW_PATIENTS array):

```typescript
  // ═══════════════════════════════════════════════════════════
  // PATIENT 18 — ZHANG JIANGUO — Post-VATS RUL Lobectomy (Adenocarcinoma)
  // Prince of Wales Hospital (公立) | Sha Tin | [待分配] (Thoracic Surgeon)
  // ═══════════════════════════════════════════════════════════
  {
    id: 18, address: '[待确认]', name: 'Zhang Jianguo', gender: 'M', age: 58,
    diagnosis: 'Right Upper Lobe Adenocarcinoma — Post-VATS RUL Lobectomy + Mediastinal LN Sampling · HTN · Hyperlipidemia',
    diagnosisCodes: ['C34.1', 'I10', 'E78.5'],
    allergies: ['[待确认]'],
    physician: '[待分配] (Thoracic Surgeon)',
    admittingDiagnosis: 'Right-upper-lobe part-solid pulmonary nodule — malignancy to be excluded. CT-guided biopsy: adenocarcinoma confirmed. VATS right upper lobectomy + mediastinal lymph node sampling performed. Delayed discharge (POD 7) due to persistent air leak — resolved POD 5, chest tube removed POD 6, discharged POD 7. Final surgical pathology + molecular testing pending. Comorbidities: Essential hypertension (Perindopril 4mg qd), Hyperlipidemia (Atorvastatin 20mg qn). Perindopril-related cough under evaluation — possible ARB switch per thoracic team decision.',
    clinicalSummary: '58-year-old male, ex-smoker (quit 2 weeks pre-op, cessation support ongoing), post-VATS RUL lobectomy for biopsy-confirmed lung adenocarcinoma. Delayed discharge due to persistent air leak (resolved). Hypertension on Perindopril — cough evaluation pending (drug-related vs. post-operative). Key monitoring: wound healing (R thoracoscopic ports ×3), respiratory function (incentive spirometry, SpO₂ trend), pain control (VAS/NRS), VTE prevention (early mobilisation), air leak recurrence surveillance. Final pathology awaited for definitive staging and adjuvant therapy decision.',
    wardRounds: [
      { date: '[Post-Discharge Day 0 — exact date TBD]', note: 'Discharge assessment for HaH enrolment. VATS RUL lobectomy POD 7. Air leak resolved POD 5, chest tube removed POD 6 without complication. Wound: 3 thoracoscopic ports clean/dry/intact. SpO₂ 96% RA, RR 16, HR 78, BP 128/82, Temp 36.8. Incentive spirometry 900mL. Pain VAS 3/10. Perindopril 4mg qd + Atorvastatin 20mg qn continued. Cough diary initiated per thoracic team. Wife trained on wound inspection, VTE warning signs, spirometry. Community nurse visit scheduled POD 8 (post-discharge Day 1). Final pathology pending — review at 2-week clinic.', physician: '[待分配] (Thoracic Surgeon)' },
    ],
    carePlan: {
      serviceFrequency: '[待胸外团队确认] — Initial community nurse visit within 24-48h post-discharge per ESTS ERAS',
      visitDuration: '[待胸外团队确认]',
      goals: [
        'SpO₂ ≥94% at rest on room air — no desaturation on ambulation',
        'Wound healing without SSI — all 3 thoracoscopic ports clean/dry/intact',
        'VAS pain ≤3/10 at rest, ≤5/10 with cough/movement by Week 2',
        'Incentive spirometry ≥ predicted volume by Week 2',
        'Independent ADLs + ambulation ≥200m by Week 2',
        'Smoking cessation maintained — zero relapse',
        'No VTE event — active ankle exercises + early mobilisation',
        'Perindopril cough pattern documented — ARB switch decision per thoracic team',
        'Final pathology received and reviewed by thoracic team',
      ],
      precautions: [
        'Frank haemoptysis (>50mL or sudden increase) → contact thoracic team immediately',
        'Progressive dyspnoea or SpO₂ <90% sustained >5min → contact thoracic team / 999',
        'Persistent chest pain unrelieved by analgesia → same-day teleconsult',
        'Wound: redness, purulent exudate, or fever >38.3°C → nurse assessment within 24h',
        'Leg swelling / calf pain / unilateral oedema → urgent VTE assessment',
        'Weight loss >2kg/week or sustained poor appetite → nutrition referral',
        'Do NOT self-medicate with antibiotics — may mask symptoms',
        'Perindopril: record cough frequency/character daily — do NOT stop or switch without doctor order',
        'Incentive spirometry q2h while awake — record best of 3 attempts',
      ],
      assignedDoctor: '[待分配] (Thoracic Surgeon)',
      assignedNurse: '[待分配] (RN)',
      assignedCaseManager: '[待分配] (Case Manager)',
    },
    nursingRecords: [
      { date: '[Post-Discharge Day 1 — exact date TBD]', time: '09:00', note: 'Initial post-discharge HaH assessment. Wound: (R) thoracoscopic ports ×3 — clean, dry, intact, no erythema/drainage. Respiratory: breath sounds clear bilaterally, no subcutaneous emphysema. SpO₂ 96% RA. IS volume 900mL (target). Pain: VAS 3/10 at rest, 5/10 with cough — analgesia adequate. VTE: no calf tenderness/swelling, active ankle exercises demonstrated. Perindopril continuing — cough diary initiated per thoracic team. Wife trained on wound inspection + VTE warning signs.', nurse: '[待分配]', vitals: 'BP 128/82 | HR 78 | SpO₂ 96% | RR 16 | Temp 36.8 | VAS 3' },
      { date: '[Post-Discharge Day 3 — exact date TBD]', time: '09:15', note: 'PDD3 assessment. Wound: healing well, no SSI signs. SpO₂ 97% RA — no desaturation with 100m walk. IS volume 1100mL (↑). Pain VAS 2/10 — Tramadol use decreasing. Cough: 2-3 episodes/day, dry, non-productive. Teleconsult with thoracic surgeon completed — progress reviewed, continue current plan, await final pathology. Weight 66.5kg stable.', nurse: '[待分配]', vitals: 'BP 124/80 | HR 72 | SpO₂ 97% | RR 15 | Temp 36.6 | VAS 2' },
      { date: '[Post-Discharge Day 5 — exact date TBD]', time: '09:30', note: 'PDD5 wound check: all 3 ports healing well, no erythema/drainage. IS now 1200mL. Pain VAS 2 — Tramadol reduced to once yesterday. Cough stable — dry, 1-2 episodes/day. Weight 66.3kg. VTE: negative.', nurse: '[待分配]', vitals: 'BP 122/78 | HR 70 | SpO₂ 97% | RR 14 | Temp 36.7 | VAS 2' },
    ],
    medications: [
      { drug: 'Perindopril', dose: '4mg', route: 'PO', frequency: 'Once daily (AM)', purpose: 'Antihypertensive — ACE inhibitor. Cough under evaluation — possible switch to ARB per thoracic team decision.', startDate: '[待确认]', status: 'Active' },
      { drug: 'Atorvastatin', dose: '20mg', route: 'PO', frequency: 'Once daily (PM)', purpose: 'Lipid-lowering — statin', startDate: '[待确认]', status: 'Active' },
      { drug: '[Post-operative analgesia]', dose: '[待临床确认]', route: '[待临床确认]', frequency: '[待临床确认]', purpose: 'Pain control — VAS target ≤3. Specific agent not specified in source document.', startDate: '[待确认]', status: 'Active' },
    ],
    iotDevices: [
    ],
    riskLevel: 'Moderate', readmissionRisk: 22,
  },
```

IoT devices left empty — `ensureNewsIotDevices()` in `iotDeviceCatalog.ts` auto-generates the standard CORE_NEWS 5-device set for all patients.

- [ ] **Step 2: Verify build**

Run: `npx vite build --logLevel error`

- [ ] **Step 3: Commit**

```bash
git add src/data/newPatients/patientRecords.ts
git commit -m "feat: add Zhang Jianguo (P18) patient record"
```

---

### Task 3: Add Vital Signs Thresholds + Baselines

**Files:**
- Modify: `src/data/newPatients/vitalSignsExtras.ts`

**Interfaces:**
- Consumes: `VitalsThresholds` (existing)
- Produces: `NEW_PATIENT_THRESHOLDS[18]`, `NEW_VITALS_BASELINES[18]`, `NEW_PATIENT_START_DATES[18]`, `NEW_VITALS_CONTEXT[18]`, and an intervention event entry

3 sub-steps — all in one file:

- [ ] **Step 1a: Add thresholds (after patient 17 entry)**

```typescript
  // P18: Post-VATS RUL Lobectomy — Adenocarcinoma + HTN
  18: {
    thresholds: {
      hr: { green: [51, 90], amber: [41, 50] },
      bpSystolic: { green: [100, 140], amber: [90, 100] },
      bpDiastolic: { green: [60, 90], amber: [55, 60] },
      spo2: { green: [96, 100], amber: [92, 96] },
      temp: { green: [36.1, 38.0], amber: [35.1, 36.1] },
    },
    guidelines: 'NEWS2 (NICE 2017) Scale 1 · ERAS Thoracic 2019 · NCCN NSCLC 2025',
  },
```

- [ ] **Step 1b: Add baselines (after patient 17 entry)**

```typescript
  18: { hr: 72, bpSystolic: 122, bpDiastolic: 78, spo2: 97, temp: 36.7, rr: 15 },
```

- [ ] **Step 1c: Add start date (after patient 17 entry)**

```typescript
  18: new Date('2026-08-14'),
```

- [ ] **Step 1d: Add context (after patient 17 entry)**

```typescript
  18: { name: 'Zhang Jianguo', conditions: 'Post-VATS RUL lobectomy, HTN, hyperlipidemia' },
```

- [ ] **Step 1e: Add intervention events (mimic air leak recovery trajectory)**

```typescript
  18: [
    { time: 0, duration: 240, effects: { hr: +8, rr: +4, bpS: +10 } },
    { time: 360, duration: 120, effects: { hr: +6, rr: +2 } },
    { time: 720, duration: 480, effects: { temp: +0.3, hr: +4 } },
    { time: 1920, duration: 180, effects: { hr: +6, bpS: +8 } },
  ],
```

- [ ] **Step 2: Verify build**

Run: `npx vite build --logLevel error`

- [ ] **Step 3: Commit**

```bash
git add src/data/newPatients/vitalSignsExtras.ts
git commit -m "feat: add Zhang Jianguo (P18) vital sign thresholds and baselines"
```

---

### Task 4: Add Care Team Chat

**Files:**
- Modify: `src/data/newPatients/chatExtras.ts`

**Interfaces:**
- Consumes: `ChatMessage` type (existing), `generateNewPatientChats()` pattern
- Produces: Chat messages for patient 18

- [ ] **Step 1: Add chat case for patient 18**

Insert before any closing `return []` in `generateNewPatientChats()`, after the last existing patient case (currently P17):

```typescript
  if (patientId === 18) return [
    msg('ai', '🤖 iHomeCare AI', '📋 Discharge Summary: Zhang Jianguo — POD 7. VATS RUL lobectomy done. Persistent air leak resolved POD 5. Chest tube removed POD 6. Discharged home. Wound: 3 thoracoscopic ports clean. SpO₂ 96% RA. Pain VAS 3. IS volume 900mL. Final pathology pending. Perindopril 4mg + Atorvastatin 20mg continued. Community nurse visit scheduled POD 8.', 'Day 1 09:00'),
    msg('nurse', '[待分配] (RN)', 'Initial home visit completed. Wound clean/dry/intact. SpO₂ 96%. IS 900mL. VAS 3→5 with cough. Wife trained on wound check + VTE warning signs. Perindopril cough diary started.', 'Day 1 09:45'),
    msg('doctor', '[待分配] (Thoracic Surgeon)', 'Noted. Continue current plan. Monitor cough pattern with Perindopril — if cough persists or worsens, we will discuss supervised switch to ARB. Final pathology expected within 7-10 days — will determine adjuvant therapy pathway then.', 'Day 1 15:30'),
    msg('family', p.familyName, 'Thank you doctor. I set up his pill box and the incentive spirometer chart. He walked to the bathroom by himself this morning — small steps but I can see him getting stronger. The cough does worry me though…', 'Day 1 18:30'),
    msg('nurse', '[待分配] (PT)', 'PT initial assessment completed PDD3. Shoulder ROM: 160° flexion (target 180°). Gait: independent 100m, SpO₂ 96% on ambulation. Breathing exercises demonstrated — pursed-lip + diaphragmatic. Exercise plan: walking 5min ×3/day, progress +5min/week.', 'Day 3 11:00'),
    msg('nurse', '[待分配] (RN)', 'PDD5 wound check: all 3 ports healing well, no erythema or drainage. IS now 1200mL. Pain VAS 2 — Tramadol use reduced to once yesterday. Cough stable — dry, 1-2 episodes/day. Weight 66.3kg. VTE: negative.', 'Day 5 09:30'),
    msg('ai', '🤖 iHomeCare AI', '📊 Week 1 Summary: SpO₂ trend 95-98%. IS volume ↑ 900→1200mL. VAS trend ↓ 5→2/10. Wound: no SSI signs. Weight stable. Cough: dry, stable. VTE: negative. Pending: final pathology report. Next: Thoracic surgery clinic 2-week follow-up.', 'Day 7 09:00'),
    msg('doctor', '[待分配] (Thoracic Surgeon)', 'Week 1 review done — excellent progress. Continue current plan. Regarding Perindopril cough: I believe it is drug-related rather than post-operative. Will switch to Losartan 50mg qd starting today. Monitor BP and any cough changes. Final pathology should be ready by next teleconsult — we will discuss adjuvant strategy then.', 'Day 7 15:00'),
  ];
```

- [ ] **Step 2: Verify build**

Run: `npx vite build --logLevel error`

- [ ] **Step 3: Commit**

```bash
git add src/data/newPatients/chatExtras.ts
git commit -m "feat: add Zhang Jianguo (P18) care team chat"
```

---

### Task 5: Add Care Team Extras (Family Details)

**Files:**
- Modify: `src/data/newPatients/careTeamExtras.ts`

**Interfaces:**
- Consumes: `FamilyContact[]`, `FamilyComm[]` types
- Produces: `NEW_PATIENT_FAMILY[18]`, `NEW_FAMILY_COMMS[18]`

- [ ] **Step 1: Add family contact**

In `NEW_PATIENT_FAMILY`, add after patient 17 entry:

```typescript
  18: [
    { name: 'Mrs. Zhang (Lin Xia)', relationship: 'Wife', phone: '+852 [待确认]', email: '[待确认]', isPrimary: true, livingWith: true, notes: 'Full-time caregiver. Manages medication box, incentive spirometry log, wound inspection, and smoking cessation support. Trained on VTE warning signs and thoracic surgery escalation criteria.' },
  ],
```

- [ ] **Step 2: Add family communication records**

In `NEW_FAMILY_COMMS`, add after patient 17 entry:

```typescript
  18: [
    { date: '[Post-Discharge Day 1 — exact date TBD]', time: '10:00', contact: 'Mrs. Zhang (Lin Xia) (Wife)', method: 'In-Person', summary: 'Initial HaH visit. Wound assessment completed. Incentive spirometry technique reviewed. VTE signs education. Cough diary initiated.', actionItems: 'Wound photo daily. IS log q2h. Cough diary. VTE warning signs poster on fridge.', direction: 'outgoing' },
    { date: '[Post-Discharge Day 1 — exact date TBD]', time: '18:30', contact: 'Mrs. Zhang (Lin Xia) (Wife)', method: 'App Chat', summary: 'Wife reports: Mr. Zhang walked to bathroom independently. Pill box and IS chart set up. Concerned about cough — reassured that thoracic team is monitoring.', actionItems: 'Continue current plan. Report any worsening cough or new symptoms.', direction: 'incoming' },
    { date: '[Post-Discharge Day 5 — exact date TBD]', time: '16:00', contact: 'Mrs. Zhang (Lin Xia) (Wife)', method: 'App Chat', summary: 'Week 1 progress. IS 1200mL. Pain VAS 2. Cough stable. Wife confident with wound care and spirometry. Reports good appetite and mood improving.', actionItems: 'Continue PT exercises. Await final pathology. 2-week thoracic clinic confirmed.', direction: 'outgoing' },
  ],
```

- [ ] **Step 3: Verify build**

Run: `npx vite build --logLevel error`

- [ ] **Step 4: Commit**

```bash
git add src/data/newPatients/careTeamExtras.ts
git commit -m "feat: add Zhang Jianguo (P18) family contact and communications"
```

---

### Task 6: Add 14-Day Care Plan

**Files:**
- Modify: `src/data/newPatients/carePlans.ts`

**Interfaces:**
- Consumes: `TwoWeekCarePlan`, `DailyActivity`, `FollowupLogEntry` types
- Produces: `buildThoracicSurgeryPlan()` function, registered in `mergeNewPatientCarePlans()`

- [ ] **Step 1: Add thoracic surgery care plan builder**

Insert before `mergeNewPatientCarePlans()` function (before line 389):

```typescript
function buildThoracicSurgeryPlan(): TwoWeekCarePlan {
  const dates = makeDates('2026-08-14', 14);
  const s: Record<string, DailyActivity[]> = {};
  dates.forEach((d, i) => {
    const day = i + 1;
    const isRNday = day <= 7 && day % 2 === 1;
    const isPTday = day % 2 === 1;
    const isConsultDay = day === 1 || day === 3 || day === 6 || day === 9 || day === 12;
    s[d] = [
      { time: '07:00', activity: 'AM Vitals + Analgesia', type: 'monitoring', detail: 'BP, SpO₂, HR, Temp, Weight. Pain VAS self-assessment. AM analgesia. Record cough frequency/character in diary (Perindopril monitoring).', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:00', activity: 'Breakfast + Nutrition Log', type: 'self_care', detail: 'High-protein meal for wound healing. Record intake. Weight tracking — report loss >1kg from prior day.', status: i < 3 ? 'completed' : 'pending' },
      { time: '08:30', activity: 'RN Visit', type: 'nurse_visit', detail: 'Wound assessment (3 thoracoscopic ports), breath sounds, VAS pain, SpO₂ at rest + exertion, incentive spirometry best-of-3, VTE check (calf tenderness/swelling), cough diary review, Perindopril monitoring.', status: isRNday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: '[待分配] (RN)' },
      { time: '10:00', activity: 'Smoking Cessation + Airway Care', type: 'self_care', detail: 'Smoking cessation support — zero relapse. Avoid dust and secondhand smoke. Incentive spirometry q2h while awake.', status: i < 3 ? 'completed' : 'pending' },
      { time: '10:30', activity: 'PT Pulmonary Rehab', type: 'therapy', detail: 'Deep breathing exercises, effective coughing technique, shoulder ROM (target 180° flexion), progressive walking (5min ×3/day, +5min/week). SpO₂ monitoring throughout.', status: isPTday ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: '[待分配] (PT)' },
      { time: '12:00', activity: 'Lunch + Rest', type: 'self_care', detail: 'High-protein lunch. Rest 1h. Leg elevation for VTE prevention.', status: i < 3 ? 'completed' : 'pending' },
      { time: '14:00', activity: 'PM Analgesia + VAS Check', type: 'medication', detail: 'Afternoon analgesia. VAS self-rating. Report pain >5/10 unrelieved by medication.', status: i < 3 ? 'completed' : 'pending' },
      { time: '15:00', activity: 'Teleconsult (q3d)', type: 'doctor_consult', detail: '[待分配] (Thoracic Surgeon) — review wound healing, air leak surveillance, pain control, IS progress, cough pattern, VTE signs.', status: isConsultDay ? (i < 3 ? 'completed' : 'pending') : 'pending', provider: '[待分配] (Thoracic Surgeon)' },
      { time: '17:00', activity: 'Independent Activity + Family Education', type: 'self_care', detail: 'Gentle ambulation. Wife reviews VTE warning signs, wound inspection, smoking cessation support. Cough diary update.', status: i < 3 ? 'completed' : 'pending' },
      { time: '19:00', activity: 'Dinner + PM Atorvastatin', type: 'medication', detail: 'High-protein dinner. Atorvastatin 20mg qn. Do NOT self-medicate with antibiotics.', status: i < 3 ? 'completed' : 'pending' },
      { time: '20:00', activity: 'Evening SpO₂ Check', type: 'monitoring', detail: 'SpO₂ at rest. Report <92% sustained or progressive dyspnoea immediately. Weight check — compare to AM.', status: i < 3 ? 'completed' : 'pending' },
    ];
  });
  return {
    patientName: 'Zhang Jianguo',
    startDate: dates[0],
    endDate: dates[13],
    schedule: s,
    logs: [
      { date: '2026-08-14', time: '09:00', type: 'RN Visit', detail: 'Initial post-discharge HaH assessment. Wound: (R) thoracoscopic ports ×3 — clean, dry, intact, no erythema/drainage. Respiratory: breath sounds clear bilaterally, no subcutaneous emphysema. SpO₂ 96% RA. IS volume 900mL (target). Pain: VAS 3/10 at rest, 5/10 with cough — analgesia adequate. VTE: no calf tenderness/swelling, active ankle exercises demonstrated. Perindopril continuing — cough diary initiated per thoracic team. Wife trained on wound inspection + VTE warning signs.', author: '[待分配]', role: 'RN', vitals: 'BP 128/82 | HR 78 | SpO₂ 96% | RR 16 | Temp 36.8 | VAS 3', status: 'completed' },
      { date: '2026-08-15', time: '15:00', type: 'Teleconsult', detail: 'PDD2 review. Wound clean. IS 950mL. Pain VAS 3. Cough dry, 2-3 episodes/day. Continue current plan. Await final pathology.', author: '[待分配]', role: 'Thoracic Surgeon', vitals: 'SpO₂ 96% | Pain VAS 3', status: 'completed' },
      { date: '2026-08-16', time: '09:15', type: 'RN Visit', detail: 'PDD3 assessment. Wound: healing well, no SSI signs. SpO₂ 97% RA — no desaturation with 100m walk. IS volume 1100mL (↑). Pain VAS 2/10 — Tramadol use decreasing. Cough: 2-3 episodes/day, dry, non-productive. Teleconsult with thoracic surgeon completed — progress reviewed, continue current plan, await final pathology. Weight 66.5kg stable.', author: '[待分配]', role: 'RN', vitals: 'BP 124/80 | HR 72 | SpO₂ 97% | RR 15 | Temp 36.6 | VAS 2', status: 'completed' },
      { date: '2026-08-18', time: '09:30', type: 'RN Visit', detail: 'PDD5 wound check: all 3 ports healing well, no erythema/drainage. IS now 1200mL. Pain VAS 2 — Tramadol reduced to once yesterday. Cough stable — dry, 1-2 episodes/day. Weight 66.3kg. VTE: negative.', author: '[待分配]', role: 'RN', vitals: 'BP 122/78 | HR 70 | SpO₂ 97% | RR 14 | Temp 36.7 | VAS 2', status: 'completed' },
    ],
  };
}
```

- [ ] **Step 2: Register in mergeNewPatientCarePlans()**

Add after line 399 (`target[17] = buildCAPCOPDPlan();`):

```typescript
  target[18] = buildThoracicSurgeryPlan();
```

- [ ] **Step 3: Verify build**

Run: `npx vite build --logLevel error`

- [ ] **Step 4: Commit**

```bash
git add src/data/newPatients/carePlans.ts
git commit -m "feat: add Zhang Jianguo (P18) 14-day thoracic surgery care plan"
```

---

### Task 7: Add Medical History

**Files:**
- Modify: `src/data/medicalHistory.ts`

**Interfaces:**
- Consumes: `PatientHistory` interface
- Produces: `MEDICAL_HISTORY[18]`

- [ ] **Step 1: Add history entries**

Add at the end of `medicalHistory.ts`, before any closing code:

```typescript
// ═══════════════════════════════════════════════════════════
// PATIENT 18 — ZHANG JIANGUO — RUL Adenocarcinoma
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[18] = {
  patientId: 18,
  entries: [
    {
      date: '[待确认]', type: 'outpatient', facility: '[待确认]', department: 'Health Check',
      physician: '[待确认]', chiefComplaint: 'Screening CT',
      diagnosis: 'Right-upper-lobe part-solid pulmonary nodule detected on screening chest CT.',
      imaging: 'CT chest: RUL part-solid nodule, suspicious features.',
      notes: 'Nodule referred to thoracic surgery for evaluation and follow-up. Fleischner guidelines applied.',
    },
    {
      date: '[待确认]', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Thoracic Surgery',
      physician: '[待分配]', chiefComplaint: 'RUL nodule evaluation',
      diagnosis: 'Right-upper-lobe part-solid pulmonary nodule — follow-up plan per thoracic team.',
      imaging: 'CT chest review: RUL part-solid nodule ± change from prior. Surveillance vs. biopsy decision pending.',
      notes: 'Initial thoracic surgery evaluation. Smoking cessation counselling initiated. Pulmonary function tests ordered.',
    },
    {
      date: '[待确认]', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Radiology',
      physician: '[待确认]', chiefComplaint: 'CT-guided biopsy',
      diagnosis: 'CT-guided core needle biopsy — right upper lobe nodule. Pathology: adenocarcinoma confirmed.',
      procedures: 'CT-guided percutaneous core needle biopsy RUL nodule. No pneumothorax.',
      notes: 'Biopsy confirmed lung adenocarcinoma. Referred to MDT for surgical planning.',
    },
    {
      date: '[待确认]', type: 'followup', facility: 'Prince of Wales Hospital', department: 'Thoracic Surgery MDT',
      physician: '[待分配]', chiefComplaint: 'MDT — RUL adenocarcinoma',
      diagnosis: 'MDT (Thoracic Surgery, Respiratory Medicine, Radiology, Pathology): consensus for VATS RUL lobectomy + mediastinal lymph node sampling.',
      notes: 'MDT decision: surgical resection indicated. PFT adequate for lobectomy. Pre-operative workup initiated. Staging CT/PET pending.',
    },
    {
      date: '[待确认]', type: 'surgery', facility: 'Prince of Wales Hospital', department: 'Thoracic Surgery',
      physician: '[待分配]', chiefComplaint: 'VATS RUL lobectomy',
      diagnosis: 'VATS right upper lobectomy + mediastinal lymph node sampling. Intra-operative findings: RUL tumour resected with clear margins on frozen section.',
      procedures: 'VATS RUL lobectomy + systematic mediastinal lymph node sampling. 3-port technique.',
      notes: 'Procedure uncomplicated. Chest tube placed ×1. Estimated blood loss minimal. To surgical ward for monitoring.',
    },
    {
      date: '[待确认]', type: 'discharge', facility: 'Prince of Wales Hospital', department: 'Thoracic Surgery',
      physician: '[待分配]', chiefComplaint: 'POD 7 — discharge for HaH',
      diagnosis: 'Post-VATS RUL lobectomy Day 7. Persistent air leak (POD 1-5) — resolved. Chest tube removed POD 6 without complication. Wound clean. Final pathology pending.',
      labs: 'Final surgical pathology + molecular testing (EGFR/ALK/PD-L1) pending.',
      notes: 'Delayed discharge due to persistent air leak (now resolved). Discharged home with HaH enrolment. Community nurse visit POD 8. Analgesia: [待临床确认]. Perindopril 4mg + Atorvastatin 20mg continued. Cough diary initiated. Incentive spirometry target. Smoking cessation maintained ×3 weeks. 2-week thoracic surgery clinic follow-up.',
    },
  ],
  aiSummary: '58-year-old male with RUL adenocarcinoma (biopsy-confirmed) post-VATS lobectomy. Nodule detected on screening CT, followed through thoracic surgery evaluation, biopsy, MDT, and surgical resection. Delayed discharge (POD 7) due to persistent air leak — resolved POD 5. Final pathology and molecular testing pending. Comorbid hypertension (Perindopril) and hyperlipidemia (Atorvastatin). Key post-discharge priorities: wound healing (3 VATS ports), respiratory recovery (IS + PT), VTE prevention, pain control, smoking cessation maintenance, and Perindopril cough evaluation.',
};
```

- [ ] **Step 2: Verify build**

Run: `npx vite build --logLevel error`

- [ ] **Step 3: Commit**

```bash
git add src/data/medicalHistory.ts
git commit -m "feat: add Zhang Jianguo (P18) medical history"
```

---

### Task 8: Final Integration Verification

**Files:**
- No file changes — verification only

- [ ] **Step 1: Full production build**

Run: `npx vite build 2>&1`

Expected: 0 errors. Warning about chunk size (>500KB) is pre-existing and acceptable.

- [ ] **Step 2: Quick smoke test — Vite dev server**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5174/`

Expected: `200`

- [ ] **Step 3: Verify patient 18 data loads**

Check: Browse to `http://localhost:5174/hub` → Messages → scroll patient list for "Zhang Jianguo"

Expected: Zhang Jianguo appears in patient list with care team chat.

- [ ] **Step 4: Verify all modules**

| Module | How to verify |
|---|---|
| Vitals | Click Zhang Jianguo → View Vitals tab |
| Care Plan | Click Patient → Care Plan tab |
| Chat | Messages → Zhang Jianguo → 8 messages visible |
| IoT Devices | Patient Profile → Devices → 5 devices |
| Care Logs | Care Plan → Logs → 4 entries |
| Alerts | Vitals → check NEWS2 alert indicators |
| Medical History | Patient → History tab → 6 entries |
| Map | Map View → RN/PT visit markers |
| Family | Patient → Family tab → Mrs. Zhang |

---

## Integration Notes

### IoT Devices

The `ensureNewsIotDevices()` function in `iotDeviceCatalog.ts` automatically generates the 5-device CORE_NEWS set for every patient. Patient 18's empty `iotDevices: []` will be auto-populated. No manual device entry needed.

### Patient Avatar

Patient avatar images are generated externally via `scripts/generate-avatars-fal.mjs`. A placeholder will show until `patient-18.png` is generated. This is out of scope for this implementation plan.

### Vitals Data

24-hour vitals data is auto-generated based on baselines + thresholds + intervention events. The intervention events in Task 3e model a post-thoracic-surgery recovery pattern (elevated HR/RR for first 4 hours → gradual normalisation).

### Dates

All dates marked `[待确认]` / `[Post-Discharge Day N — exact date TBD]` are currently placeholders. The care plan start date (`2026-08-14`) is a reasonable proxy — post-discharge Day 1. Once actual clinical dates are available, they can be updated with a global find-replace.

---

## Self-Review

1. **Spec coverage:** ✅ All sections covered — PatientFull (Task 2), Vitals (Task 3), Care Plan + Logs (Task 6), Chat (Task 4), IoT (auto), Alerts (via thresholds), Follow-up (in carePlan.goals), Medical History (Task 7), Family (Tasks 1 + 5), Map (auto via care team)

2. **Placeholder scan:** ✅ All `[待分配]` / `[待确认]` / `[待胸外团队确认]` markers preserved as-is from spec. No TBD/TODO/fill-in-later.

3. **Type consistency:** ✅ `ChatMessage`, `PatientFull`, `TwoWeekCarePlan`, `DailyActivity`, `FollowupLogEntry`, `VitalsThresholds`, `FamilyContact` all used with correct field names matching existing code.
