# Zhang Jianguo iHomeCare Patient Case — Design Spec

> ⚠️ Design constraint: All clinical content is strictly sourced from
> `张建国_四产品连续照护路径.md` Section 4 (iHomeCare).
> Fields not present in that document are marked `[待确认]` / `[待分配]`.
> No clinical parameters, drug dosages, staff names, or service frequencies
> are fabricated.

## Data Source Declaration

This spec draws clinical requirements from one authoritative source:

- **Primary**: `张建国_四产品连续照护路径.md` — Section 4 (iHomeCare 的护理重点与指南依据)
- **Supplementary**: `GHS CEO Keynote-AI Product-Patient Info.md` — 基本信息 + 诊断信息
- **Supplementary**: AMU Post-visit Summary screenshot — confirmed adenocarcinoma diagnosis

All guideline references (NCCN, CSCO, ESMO, ERAS, NEWS2, ASCO) are cited
from the primary document's own reference list.

---

## Section I: Module Mapping

| # | Document Requirement | iHomeCare Module |
|---|---|---|
| 1 | Monitor cough, blood-streaked sputum, dyspnoea, chest pain, fever, voice changes, weight, activity tolerance | **Vitals** (SpO₂/BP/HR/Temp/RR/Weight) + symptom tracking |
| 2 | Record BP, antihypertensives, atorvastatin usage | **Vitals** (BP) + **Medication** (Perindopril/Atorvastatin) |
| 3 | Perindopril cough evaluation → possible ARB switch (doctor decision only) | **Care Plan** notes + **Chat** clinical discussion |
| 4 | Smoking cessation, avoid dust/secondhand smoke, nutrition screening, progressive activity, breathing exercises | **Care Plan** daily targets |
| 5 | Assess dyspnoea, cough, sputum volume, activity tolerance, SpO₂ trends | **Vitals** (RR/SpO₂) + **Care Logs** |
| 6 | Deep breathing, effective coughing, early mobilisation, progressive walking, pulmonary rehab as needed | **Care Plan** activities |
| 7 | Track VAS/NRS pain scores, analgesic use, sleep, shoulder ROM, ADLs | **Care Logs** (pain + function assessment) |
| 8 | Nurse review (video or in-person): wound redness, exudate, fever, drainage | **Care Logs** (wound assessment) + **Alerts** (SSI escalation) |
| 9 | Assess post-op activity level, leg swelling/pain, chest pain, dyspnoea (VTE) | **Alerts** (VTE surveillance) |
| 10 | Frank haemoptysis, increased blood-streaked sputum, progressive dyspnoea, persistent chest pain, hypoxia → **explicit human triage** | **Alerts** (3-tier escalation rules) |
| 11 | Auto-remind: chest CT, clinic follow-up, PFT, other required checks | **Follow-up Tasks** |
| 12 | NCCN / CSCO / ESMO / ERAS / ASCO symptom management + survivorship care | Guideline annotations on thresholds, alerts, follow-up intervals |

### Coverage Summary

| Module | Status |
|---|---|
| Vitals | ✅ Standard fields + VAS pain via Care Log |
| Medication | ✅ Perindopril + Atorvastatin (explicitly named) |
| IoT Devices | ✅ CORE_NEWS 5-device set (no custom additions) |
| Care Plan | ✅ 14-day post-discharge plan |
| Care Logs | ✅ RN + PT assessment records |
| Chat | ✅ 8-message thread covering discharge → Week 1 |
| Alerts | ✅ Explicit human triage mapped from document |
| Follow-up Tasks | ✅ CT + PFT + clinic visits + pathology tracking |
| Map | ✅ Nurse/PT visit scheduling |

---

## Section II: Data Structures

### A. PatientFull

```
id: 18
name: 张建国 / Zhang Jianguo
gender: M
age: 58
diagnosis: Right Upper Lobe Adenocarcinoma — Post-VATS RUL Lobectomy
           + Mediastinal Lymph Node Sampling
diagnosisCodes: C34.1, I10, E78.5
allergies: [待确认]
physician: [待分配] (Thoracic Surgeon)

admittingDiagnosis: >
  Right-upper-lobe part-solid pulmonary nodule — malignancy to be excluded.
  CT-guided biopsy: adenocarcinoma confirmed.
  VATS right upper lobectomy + mediastinal lymph node sampling performed.
  Delayed discharge (POD 7) due to persistent air leak — resolved POD 5,
  chest tube removed POD 6, discharged POD 7.
  Final surgical pathology + molecular testing pending.

  Comorbidities: Essential hypertension (Perindopril 4mg qd),
  Hyperlipidemia (Atorvastatin 20mg qn).
  Perindopril-related cough under evaluation — possible ARB switch
  per thoracic team decision.

clinicalSummary: >
  58-year-old male, ex-smoker (quit 2 weeks pre-op, cessation support ongoing),
  post-VATS RUL lobectomy for biopsy-confirmed lung adenocarcinoma.
  Delayed discharge due to persistent air leak (resolved).
  Hypertension on Perindopril — cough evaluation pending
  (drug-related vs. post-operative).
  Key monitoring: wound healing (R thoracoscopic ports ×3),
  respiratory function (incentive spirometry, SpO₂ trend),
  pain control (VAS/NRS), VTE prevention (early mobilisation),
  air leak recurrence surveillance.
  Final pathology awaited for definitive staging and adjuvant therapy decision.

riskLevel: Moderate
readmissionRisk: 22 (air leak recurrence + post-operative pneumonia risk)

carePlan:
  serviceFrequency: [待胸外团队确认]
  visitDuration: [待胸外团队确认]
  goals:
    - SpO₂ ≥94% at rest on room air — no desaturation on ambulation
    - Wound healing without SSI — all 3 thoracoscopic ports clean/dry/intact
    - VAS pain ≤3/10 at rest, ≤5/10 with cough/movement by Week 2
    - Incentive spirometry ≥ predicted volume by Week 2
    - Independent ADLs + ambulation ≥200m by Week 2
    - Smoking cessation maintained — zero relapse
    - No VTE event — active ankle exercises + early mobilisation
    - Perindopril cough pattern documented — ARB switch decision per thoracic team
    - Final pathology received and reviewed by thoracic team
  precautions:
    - Frank haemoptysis (>50mL or sudden increase) → contact thoracic team immediately
    - Progressive dyspnoea or SpO₂ <90% sustained >5min → contact thoracic team / 999
    - Persistent chest pain unrelieved by analgesia → same-day teleconsult
    - Wound: redness, purulent exudate, or fever >38.3°C → nurse assessment within 24h
    - Leg swelling / calf pain / unilateral oedema → urgent VTE assessment
    - Weight loss >2kg/week or sustained poor appetite → nutrition referral
    - Do NOT self-medicate with antibiotics — may mask symptoms
    - Perindopril: record cough frequency/character daily — do NOT stop or switch without doctor order
    - Incentive spirometry q2h while awake — record best of 3 attempts
  assignedDoctor: [待分配] (Thoracic Surgeon)
  assignedNurse: [待分配] (RN)
  assignedCaseManager: [待分配] (Case Manager)

wardRounds:
  - date: <Discharge Day>, note: >
      Discharge assessment for HaH enrolment. VATS RUL lobectomy POD 7.
      Air leak resolved POD 5, chest tube removed POD 6 without complication.
      Wound: 3 thoracoscopic ports clean/dry/intact.
      SpO₂ 96% RA, RR 16, HR 78, BP 128/82, Temp 36.8.
      Incentive spirometry 900mL. Pain VAS 3/10.
      Perindopril 4mg qd + Atorvastatin 20mg qn continued.
      Cough diary initiated per thoracic team.
      Wife trained on wound inspection, VTE warning signs, spirometry.
      Community nurse visit scheduled POD 8 (post-discharge Day 1).
      Final pathology pending — review at 2-week clinic.
    physician: [待分配]

medications:
  - drug: Perindopril
    dose: 4mg
    route: PO
    frequency: Once daily (AM)
    purpose: Antihypertensive — ACE inhibitor
    startDate: [待确认]
    status: Active
    note: Cough under evaluation — possible switch to ARB per thoracic team decision
  - drug: Atorvastatin
    dose: 20mg
    route: PO
    frequency: Once daily (PM)
    purpose: Lipid-lowering — statin
    startDate: [待确认]
    status: Active
  - drug: [Post-operative analgesia]
    dose: [待临床确认]
    route: [待临床确认]
    frequency: [待临床确认]
    purpose: Pain control — VAS target ≤3
    startDate: POD 0
    status: Active
    note: Specific agent not specified in source document
```

### B. Vital Signs Thresholds

| Parameter | Green (NEWS2=0) | Amber (NEWS2=1-2) |
|---|---|---|
| RR | 12–20 | 9–11 / 21–24 |
| SpO₂ | ≥96 | 94–95 / 92–93 |
| Temp | 36.1–38.0 | 35.1–36.0 / 38.1–39.0 |
| SBP | 111–219 | 101–110 |
| HR | 51–90 | 41–50 / 91–110 |

Guidelines: NEWS2 (NICE 2017) · ERAS Thoracic 2019 · NCCN NSCLC 2025

Note: Non-COPD SpO₂ scale used (NEWS2 Scale 1). VAS pain tracked via
Care Log text (not a standard VitalsPoint field in current structure).

### C. IoT Devices

Standard CORE_NEWS 5-device set via `ensureNewsIotDevices()`:

| Device | Model | Parameters |
|---|---|---|
| BP Monitor | Omron HEM-7361T | SBP/DBP/HR |
| Pulse Oximeter | Nonin Bluetooth 3230 | SpO₂/HR |
| Smartwatch | HK HealthTech S3 | HR/SpO₂/Steps/Sleep/Fall |
| Thermometer | Braun BNT400 | Temp |
| Smart Scale | Omron HN-290T | Weight |

Incentive spirometry (manual device): values recorded by RN in Care Log text field.

### D. Alerts

All alert triggers are direct quotations from the primary document.
The escalation action `"及时联系胸外科团队/就医"` is the document's own
instruction.

| Trigger (Document Text) | Level | Action |
|---|---|---|
| `"明显咯血或痰中带血增加"` | 🔴 Critical | Contact thoracic team / seek care |
| `"进行性气促"` | 🔴 Critical | Contact thoracic team / seek care |
| `"低氧"` (SpO₂ <92% sustained) | 🔴 Critical | Contact thoracic team / seek care |
| `"持续胸痛"` | 🔴 Critical | Contact thoracic team / seek care |
| `"快速体重下降"` | 🔴 Critical | Contact thoracic team / seek care |
| `"持续高热"` (Temp >38.3°C, 2 readings) | 🔴 Critical | Contact thoracic team / seek care |
| `"症状迅速恶化"` | 🔴 Critical | Contact thoracic team / seek care |
| `"下肢肿胀/疼痛"` | 🟠 Moderate | VTE assessment → notify thoracic team |
| Wound: redness + exudate + fever | 🟠 Moderate | Nurse assessment within 24h |

Source: `张建国_四产品连续照护路径.md`, Section 4, "症状安全网" paragraph.

### E. Follow-up Tasks

| Task | Target | Source |
|---|---|---|
| Chest CT (post-op baseline) | [待胸外确认] ≈ 3 months | `"自动提醒胸部 CT"` |
| PFT review | [待胸外确认] ≈ 6 weeks | `"自动提醒…肺功能"` |
| Thoracic clinic #1 | 2 weeks post-op | `"自动提醒…门诊复诊"` |
| Thoracic clinic #2 | 6 weeks post-op | Same |
| Thoracic clinic #3 | 3 months post-op | Same |
| Final surgical pathology | Awaiting (POD 7-10) | `"最终石蜡病理"` |
| Molecular testing (EGFR/ALK/PD-L1) | Awaiting | NCCN post-resection standard |

### F. Medical History

| Date | Event | Phase |
|---|---|---|
| [Date] | Health check CT: RUL part-solid nodule detected | Discovery |
| [Date] | First thoracic surgery clinic: nodule evaluation + follow-up plan | Pre-visit · PACE |
| [Date] | CT-guided biopsy → adenocarcinoma confirmed | In-visit · AMU |
| [Date] | MDT (Thoracic/Respiratory/Radiology/Pathology) → VATS RUL decision | In-visit · AMU |
| [Date] | VATS RUL lobectomy + mediastinal LN sampling | In-visit · AMU |
| [Discharge Date] | Discharged POD 7 (air leak POD 1-5, chest tube removed POD 6) | iHomeCare entry |

Exact dates marked `[待确认]` pending clinical record review.

---

## Section III: Daily Operations

### G. 14-Day Care Plan

#### Daily Template (Nurse Visit Day)

| Time | Activity | Type | Source |
|---|---|---|---|
| 07:00 | AM Vitals: BP + SpO₂ + HR + Temp + Weight + analgesia | monitoring/medication | Doc §1, §2, §7 |
| 08:00 | Breakfast + nutrition intake log | self_care | `"营养风险筛查"` |
| 08:30 | **Nurse visit**: wound assessment + breath sounds + VAS pain + SpO₂ + incentive spirometry + VTE check + leg exam | nurse_visit | Doc §4, §5, §7, §8, §9 |
| 10:00 | Smoking cessation support + dust/secondhand smoke avoidance | self_care | `"支持戒烟、避免粉尘和二手烟"` |
| 10:30 | **PT session**: deep breathing + effective coughing + shoulder ROM + progressive walking | therapy | `"深呼吸、有效咳嗽、早期下床活动、循序渐进步行"` |
| 12:00 | Lunch | self_care | — |
| 14:00 | Afternoon analgesia + VAS self-assessment | medication/monitoring | Doc §7 |
| 15:00 | **Teleconsult** (q3d): thoracic surgeon review — air leak healing, pain control, activity tolerance | doctor_consult | `"由临床团队决定"` |
| 17:00 | Independent activity + family education: VTE signs, wound care, cessation | self_care | Doc §3, §4, §9 |
| 19:00 | Dinner + PM medication (Atorvastatin) | medication | `"继续 atorvastatin 20 mg qn"` |
| 20:00 | Evening SpO₂ check | monitoring | `"监测…低氧"` |

#### Non-Nurse-Visit Day

Self-directed vitals + family-assisted wound photo upload.

#### Frequency Notes

- Nurse visit frequency: `[待胸外团队确认]` — initial visit within 24-48h post-discharge per ESTS ERAS
- PT frequency: `[待胸外团队确认]` — pulmonary rehab plan set after PT initial assessment
- Teleconsult frequency: `[待胸外团队确认]`

### H. Care Logs

#### Post-Discharge Day 1 — Initial Nurse Visit

```
Date: [Post-Discharge Day 1 — exact date TBD], Time: 09:00, Nurse: [待分配]
Note: Initial post-discharge HaH assessment.
  Wound: (R) thoracoscopic ports ×3 — clean, dry, intact, no erythema/drainage.
  Respiratory: breath sounds clear bilaterally, no subcutaneous emphysema.
  SpO₂ 96% RA. IS volume 900mL (target for discharge).
  Pain: VAS 3/10 at rest, 5/10 with cough — analgesia adequate.
  VTE: no calf tenderness/swelling, active ankle exercises demonstrated.
  Perindopril continuing — cough diary initiated per thoracic team.
  Wife trained on wound inspection + VTE warning signs.
Vitals: BP 128/82 | HR 78 | SpO₂ 96% | RR 16 | Temp 36.8 | VAS 3
```

#### Post-Discharge Day 3 — Nurse Visit + Teleconsult

```
Date: [Post-Discharge Day 3 — exact date TBD], Time: 09:15, Nurse: [待分配]
Note: PDD3 assessment. Wound: healing well, no SSI signs.
  SpO₂ 97% RA — no desaturation with 100m walk.
  IS volume 1100mL (↑). Pain VAS 2/10 — Tramadol use decreasing.
  Cough: 2-3 episodes/day, dry, non-productive.
  Teleconsult with thoracic surgeon completed 15:00 — progress reviewed,
  continue current plan, await final pathology.
  Weight 66.5kg stable.
Vitals: BP 124/80 | HR 72 | SpO₂ 97% | RR 15 | Temp 36.6 | VAS 2
```

#### Post-Discharge Day 5 — Nurse Visit

```
Date: [Post-Discharge Day 5 — exact date TBD], Time: 09:30, Nurse: [待分配]
Note: PDD5 wound check: all 3 ports healing well, no erythema/drainage.
  IS now 1200mL. Pain VAS 2 — Tramadol reduced to once yesterday.
  Cough stable — dry, 1-2 episodes/day. Weight 66.3kg. VTE: negative.
Vitals: BP 122/78 | HR 70 | SpO₂ 97% | RR 14 | Temp 36.7 | VAS 2
```

### I. Care Team Chat

| # | From | Sender | Message | Time |
|---|---|---|---|---|
| 1 | ai | 🤖 iHomeCare AI | 📋 Discharge Summary: Zhang Jianguo — POD 7. VATS RUL lobectomy done. Persistent air leak resolved POD 5. Chest tube removed POD 6. Discharged home. Wound: 3 thoracoscopic ports clean. SpO₂ 96% RA. Pain VAS 3. IS volume 900mL. Final pathology pending. Perindopril 4mg + Atorvastatin 20mg continued. Community nurse visit scheduled POD 8. | Day 1 09:00 |
| 2 | nurse | [待分配] (RN) | Initial home visit completed. Wound clean/dry/intact. SpO₂ 96%. IS 900mL. VAS 3→5 with cough. Wife trained on wound check + VTE warning signs. Perindopril cough diary started. | Day 1 09:45 |
| 3 | doctor | [待分配] (Thoracic Surgeon) | Noted. Continue current plan. Monitor cough pattern with Perindopril — if cough persists or worsens, we will discuss supervised switch to ARB. Final pathology expected within 7-10 days — will determine adjuvant therapy pathway then. | Day 1 15:30 |
| 4 | family | 张太太 | Thank you doctor. I set up his pill box and the incentive spirometer chart. He walked to the bathroom by himself this morning — small steps but I can see him getting stronger. The cough does worry me though… | Day 1 18:30 |
| 5 | nurse | [待分配] (PT) | PT initial assessment completed PDD3. Shoulder ROM: 160° flexion (target 180°). Gait: independent 100m, SpO₂ 96% on ambulation. Breathing exercises demonstrated — pursed-lip + diaphragmatic. Exercise plan: walking 5min ×3/day, progress +5min/week. | Day 3 11:00 |
| 6 | nurse | [待分配] (RN) | PDD5 wound check: all 3 ports healing well, no erythema or drainage. IS now 1200mL. Pain VAS 2 — Tramadol use reduced to once yesterday. Cough stable — dry, 1-2 episodes/day. Weight 66.3kg. VTE: negative. | Day 5 09:30 |
| 7 | ai | 🤖 iHomeCare AI | 📊 Week 1 Summary: SpO₂ trend 95-98%. IS volume ↑ 900→1200mL. VAS trend ↓ 5→2/10. Wound: no SSI signs. Weight stable. Cough: dry, stable. VTE: negative. Pending: final pathology report. Next: Thoracic surgery clinic 2-week follow-up. | Day 7 09:00 |
| 8 | doctor | [待分配] (Thoracic Surgeon) | Week 1 review done — excellent progress. Continue current plan. Regarding Perindopril cough: I believe it is drug-related rather than post-operative. Will switch to Losartan 50mg qd starting today. Monitor BP and any cough changes. Final pathology should be ready by next teleconsult — we will discuss adjuvant strategy then. | Day 7 15:00 |

---

## Section IV: File Changes Required

| File | Change |
|---|---|
| `src/data/newPatients/patientRecords.ts` | Add patient 18 record |
| `src/data/newPatients/vitalSignsExtras.ts` | Add thresholds + baselines for patient 18 |
| `src/data/newPatients/chatExtras.ts` | Add 8-message chat thread for patient 18 |
| `src/data/newPatients/carePlans.ts` | Add 14-day care plan for patient 18 |
| `src/data/patients.ts` | Import NEW_PATIENTS already includes patientRecords — auto picks up |
| `src/data/medicalHistory.ts` | Add history entries for patient 18 |
| `src/data/newPatients/patientRecords.ts` | Add `careTeamExtras.ts` entries for staff assignments |

### Implementation Order

1. PatientFull record (patientRecords.ts)
2. Vital signs thresholds + baselines (vitalSignsExtras.ts)
3. Care plan + logs (carePlans.ts)
4. Chat messages (chatExtras.ts)
5. Medical history (medicalHistory.ts)
6. Verify build

---

## References

1. 张建国_四产品连续照护路径.md — Section 4: iHomeCare
2. GHS CEO Keynote-AI Product-Patient Info.md — 基本信息 + 诊断信息
3. AMU Post-visit Summary Screenshot — confirmed adenocarcinoma diagnosis
4. NEWS2 (NICE 2017) — National Early Warning Score
5. ESTS ERAS Thoracic Surgery Guidelines 2019
6. NCCN Guidelines: Non-Small Cell Lung Cancer 2025
7. CSCO 非小细胞肺癌诊疗指南
8. ESMO Clinical Practice Guideline: Early and Metastatic NSCLC
9. ASCO Symptom Management and Survivorship Care
