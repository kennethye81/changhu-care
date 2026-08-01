// === Medical History — 6 HaH Patients (NICE HaH + HK HA Protocols) ===

export interface HistoryEntry {
  date: string;
  type: 'outpatient' | 'admission' | 'er' | 'surgery' | 'followup' | 'discharge';
  facility: string;
  department: string;
  physician: string;
  chiefComplaint: string;
  diagnosis: string;
  labs?: string;
  imaging?: string;
  prescriptions?: string;
  procedures?: string;
  notes: string;
}

export interface PatientHistory {
  patientId: number;
  entries: HistoryEntry[];
  aiSummary: string;
}

export const MEDICAL_HISTORY: Record<number, PatientHistory> = {};

// ═══════════════════════════════════════════════════════════
// PATIENT 1 — CHEUNG WAI MAN — CHF NYHA III
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[1] = {
  patientId: 1,
  entries: [],
  aiSummary: '冯存富，77岁男性，高血压3级极高危10年病史，不规则服药。临床轨迹：2025年11月初诊BP 172/95伴双下肢乏力（Barthel 30分重度依赖，Braden 10分压疮高危）→ 2025年12月血压部分控制（155/88）→ 2026年3月骶尾部压疮II期入院（3cm×4cm），提示长期卧床+营养不良导致皮肤完整性受损。AI核心关注：1. 血压管理 — 氨氯地平5mg+厄贝沙坦150mg方案下BP控制不充分，需优化GDMT并加强服药依从性监督；2. 压疮防控 — Braden 16分中度风险，翻身q2h+泡沫敷料+营养支持必不可少，社区护士每周换药监督；3. 跌倒风险极高（Morse 105分）— 助行器适配+居家安全改造+防跌倒教育；4. 功能衰退 — Barthel 30分重度依赖，双侧上下肢活动异常，需持续ADL协助；5. 照护者支持 — 王小凤（配偶）为主要照护者，需护理技巧培训及喘息服务。',
};

// ═══════════════════════════════════════════════════════════
// PATIENT 2 — WONG CHI MING — COPD GOLD Stage 3
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[2] = {
  patientId: 2,
  entries: [
    {
      date: '2026-06-18', type: 'discharge', facility: '常州市金坛区人民医院', department: 'Respiratory Medicine',
      physician: '姜珊（护士经理）', chiefComplaint: 'COPD exacerbation — stabilised for HaH discharge',
      diagnosis: 'Acute COPD Exacerbation (infective — H. influenzae); COPD GOLD Stage 3 (FEV₁ 36%); Chronic Hypoxaemia',
      labs: 'ABG: pH 7.37, PaCO₂ 48, PaO₂ 70, HCO₃ 28. CBC: WBC 9.8 (↓ from 14.5). CRP 38 (↓ from 112). Sputum culture: H. influenzae, sensitive to Amoxicillin.',
      imaging: 'CXR: hyperinflation, no new infiltrate. Previous CXR comparison: stable emphysematous changes.',
      prescriptions: 'Stiolto Respimat 2.5/2.5mcg 2 puffs qd, Salbutamol MDI 100mcg prn, Prednisolone 40mg taper (7 days), O₂ 2L/min prn, Perindopril 4mg qd, Atorvastatin 20mg qd',
      notes: 'Exacerbation managed with IV Ceftriaxone × 3 days + Prednisolone. Oral switch to Amoxicillin 500mg TID completed. Steroid taper ongoing. Home O₂ concentrator delivered. Pulmonary rehab enrolled. Discharged to HaH with RN visits 3×/week + PT 2×/week.',
    },
    {
      date: '2026-06-14', type: 'admission', facility: '常州市金坛区人民医院', department: 'Respiratory Medicine',
      physician: '姜珊（护士经理）', chiefComplaint: 'Acute COPD exacerbation — increased SOB, purulent sputum, wheeze × 3 days',
      diagnosis: 'COPD Exacerbation (infective — H. influenzae); Community-Acquired Pneumonia ruled out',
      labs: 'CRP 112, WBC 14.5. ABG: pH 7.33, PaCO₂ 52, PaO₂ 58 (on RA). Blood cultures: no growth. Sputum: H. influenzae.',
      imaging: 'CXR: hyperinflated lungs, flat diaphragms, no focal infiltrate. CT chest (2025): diffuse centrilobular emphysema.',
      prescriptions: 'IV Ceftriaxone 1g qd × 3 days, Prednisolone 40mg PO qd, O₂ 2L NC, Salbutamol neb q4h prn',
      notes: 'Admitted via ER. SpO₂ 85% on room air → 93% on 2L O₂. IV antibiotics started. Responded well: afebrile by Day 3, sputum clearing. Steroid taper initiated. Suitable for HaH discharge on Day 5.',
    },
    {
      date: '2026-02-01', type: 'admission', facility: 'Prince of Wales Hospital', department: 'Respiratory Medicine',
      physician: '姜珊（护士经理）', chiefComplaint: 'Acute COPD exacerbation — increased SOB, purulent sputum × 3 days',
      diagnosis: 'COPD Exacerbation (infective); Community-Acquired Pneumonia (right lower lobe)',
      labs: 'CRP 86, WBC 13.2. ABG: pH 7.33, PaCO₂ 55, PaO₂ 58 (RA). Sputum culture: H. influenzae.',
      imaging: 'CXR: RLL consolidation, hyperinflation.',
      prescriptions: 'Ceftriaxone 1g IV qd × 5 days, Prednisolone 40mg × 7 days (taper), Doxycycline 100mg BID × 7 days',
      notes: 'Second exacerbation in 12 months. Admitted via ER. Required IV antibiotics + O₂. Discharged Day 7. Referred to Queen Mary Hospital respiratory clinic for ongoing care (患者转至金坛区).',
    },
    {
      date: '2025-09-18', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Respiratory Clinic',
      physician: '姜珊（护士经理）', chiefComplaint: 'Annual COPD review — stable',
      diagnosis: 'COPD GOLD Stage 3 — FEV₁ 36% predicted, stable',
      labs: 'Spirometry: FEV₁ 36% pred, FVC 58%, FEV₁/FVC 0.47. ABG: compensated respiratory acidosis. 6MWT: 280m.',
      imaging: 'CXR: stable hyperinflation, no new changes.',
      prescriptions: 'Tiotropium 18mcg HandiHaler qd → changed to Stiolto Respimat for better drug delivery',
      notes: 'Upgraded inhaler therapy to Stiolto Respimat. Pulmonary rehab renewed. Smoking cessation maintained × 4 years. Influenza + pneumococcal vaccines updated.',
    },
    {
      date: '2024-05-10', type: 'outpatient', facility: 'Tuen Mun Hospital', department: 'Respiratory Clinic',
      physician: 'Dr. Leung Kwok Ho', chiefComplaint: 'Initial COPD workup — chronic cough, SOB on exertion × 1 year',
      diagnosis: 'COPD GOLD Stage 2 (FEV₁ 52%) — progressing; 40 pack-year smoking history (quit 2020)',
      labs: 'Spirometry: FEV₁ 52%, FEV₁/FVC 0.58. Post-bronchodilator: FEV₁ 55% (+3%).',
      imaging: 'CXR: emphysematous changes, flat diaphragms, increased AP diameter.',
      prescriptions: 'Tiotropium 18mcg HandiHaler qd, Salbutamol MDI prn',
      notes: 'First COPD diagnosis. 40 pack-year history. Referred for smoking cessation (already quit 2020 — maintained). Pulmonary rehab referral. Spirometry shows moderate obstruction with progression over 1 year.',
    },
  ],
  aiSummary: '王志明患有晚期COPD（GOLD 3级，FEV₁ 36%），疾病轨迹显著：从初次诊断时FEV₁ 52%（2024年）降至36%（2025年），现经双支扩剂治疗后稳定。过去18个月内因感染性急性加重住院2次（2026年2月伴CAP，2026年6月无肺炎）。关键风险因素：40包年吸烟史（2020年已戒，维持6年），慢性低氧血症（PaO₂ 70），反复流感嗜血杆菌感染。AI评估：1. 目前稳定但急性加重风险仍存 — 早期识别痰量增多/呼吸困难加重至关重要；2. SpO₂处于可接受范围下限 — 每日家庭血氧监测；3. 肺康复参与度（2/8次已完成）— 功能改善的关键；4. 疫苗接种状态最新 — 流感/肺炎球菌；5. 长期氧疗评估待定 — 若活动时SpO₂<88%可考虑。NEWS低危（1分）— COPD急性加重监测反映近期急性加重史和中度疾病严重性。从Prince of Wales医院转至Queen Mary医院反映患者搬迁至九龙。',
};

// ═══════════════════════════════════════════════════════════
// PATIENT 3 — LAM KA CHUN — CAP
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[3] = {
  patientId: 3,
  entries: [
    {
      date: '2026-06-18', type: 'discharge', facility: 'Gleneagles Hospital', department: 'Infectious Disease / Internal Medicine',
      physician: '王医生（内科）', chiefComplaint: 'CAP — stabilised for HaH discharge',
      diagnosis: 'Community-Acquired Pneumonia (RLL) — Streptococcus pneumoniae (penicillin-resistant); CURB-65: 1; Penicillin allergy (anaphylaxis)',
      labs: 'WBC 10.5 (↓ from 16.8), CRP 48 (↓ from 156). Blood cultures: no growth. Sputum: S. pneumoniae (penicillin-resistant).',
      imaging: 'CXR: dense RLL consolidation — resolving. No pleural effusion.',
      prescriptions: 'Levofloxacin 750mg qd (7-day course, 3 days remaining), Paracetamol 1g prn',
      notes: 'IV Levofloxacin × 3 days → oral switch. Clinically improved: afebrile × 48h, SpO₂ 96% RA. Discharged to HaH. Complete 7-day antibiotic course. Penicillin allergy (anaphylaxis) documented prominently. Return to work (remote) anticipated Day 7.',
    },
    {
      date: '2026-06-14', type: 'admission', facility: 'Gleneagles Hospital', department: 'Internal Medicine',
      physician: '王医生（内科）', chiefComplaint: 'Productive cough, fever (Tmax 39.2°C), rigors, pleuritic chest pain × 5 days',
      diagnosis: 'Community-Acquired Pneumonia (RLL), moderate severity; CURB-65: 1; Penicillin allergy (anaphylaxis)',
      labs: 'WBC 16.8, CRP 156, PCT 4.2. Sputum: Gram-positive diplococci. Blood cultures: pending. Renal/LFT normal.',
      imaging: 'CXR: dense RLL consolidation. No pleural effusion.',
      prescriptions: 'IV Levofloxacin 750mg qd (penicillin-allergic patient). Paracetamol 1g prn.',
      notes: 'Moderate CAP. Penicillin allergy precludes beta-lactam therapy. Levofloxacin chosen per IDSA guidelines for penicillin-allergic CAP patients. Afebrile by Day 3. IV→oral switch Day 4. Clinically stable for HaH.',
    },
    {
      date: '2018-07-22', type: 'er', facility: '常州市金坛区人民医院', department: 'Emergency',
      physician: '姜珊（护士经理）', chiefComplaint: 'Anaphylaxis — airway swelling, urticaria, hypotension after Amoxicillin',
      diagnosis: 'Anaphylactic Reaction to Amoxicillin (Penicillin) — confirmed IgE-mediated',
      labs: 'Tryptase: 24.5 (elevated — confirms anaphylaxis).',
      imaging: 'N/A',
      prescriptions: 'IM Adrenaline 0.5mg, IV Hydrocortisone 200mg, IV Chlorpheniramine 10mg. Discharged with Adrenaline auto-injector (EpiPen) prescription.',
      notes: 'Anaphylaxis within 15 minutes of first Amoxicillin dose for dental infection. Confirmed penicillin allergy — Type I IgE-mediated. All beta-lactams contraindicated. Allergy alert bracelet recommended. Patient educated on avoidance.',
    },
    {
      date: '2018-07-15', type: 'outpatient', facility: 'Gleneagles Hospital', department: 'Dental',
      physician: '汤菊玲（照护师）', chiefComplaint: 'Dental abscess — right lower molar, pain × 3 days',
      diagnosis: 'Periapical Abscess — tooth 46',
      labs: 'N/A',
      imaging: 'Dental XR: periapical radiolucency tooth 46.',
      prescriptions: 'Amoxicillin 500mg TID × 7 days, Paracetamol 1g q6h prn',
      notes: 'Dental abscess requiring antibiotics. Amoxicillin prescribed. Patient had no prior known drug allergies. Anaphylaxis occurred on first dose (see Jul 22 ER visit). Allergy now documented permanently.',
    },
    {
      date: '2023-06-10', type: 'outpatient', facility: 'Gleneagles Hospital', department: 'Health Screening',
      physician: '李妍（评估员）', chiefComplaint: 'Annual health check — no complaints',
      diagnosis: 'Healthy; No chronic conditions; BMI 24; Non-smoker; Moderate alcohol; Active lifestyle',
      labs: 'CBC normal, FPG 5.1, HbA1c 5.2%, Lipids: TC 4.8, LDL 2.6, HDL 1.4, TG 1.1. LFT normal. Cr 78.',
      imaging: 'CXR: clear lung fields, normal heart size. ECG: NSR, normal.',
      prescriptions: 'None.',
      notes: 'Healthy 42-year-old. No chronic conditions. Non-smoker. Jogs 3×/week. Penicillin allergy alert reconfirmed. Up to date on vaccinations. No other significant medical history.',
    },
  ],
  aiSummary: '林家俊，45岁，既往健康男性，患社区获得性肺炎（右下肺，肺炎链球菌，青霉素耐药）。CURB-65 1分提示低死亡风险。最显著的临床特征是严重青霉素过敏（过敏性休克，2018年）— 限制抗生素选择为非β-内酰胺类药物（使用氟喹诺酮类）。无合并症，不吸烟，生活方式活跃。预期2周内完全康复。AI评估：1. NEWS低危（0分）— 年轻、健康、单器官感染，治疗反应极佳；2. 完成7天左氧氟沙星疗程 — 即使症状好转，完整疗程对根除感染至关重要；3. 监测氟喹诺酮类副作用（肌腱炎，该年龄段罕见）；4. 青霉素过敏记录至关重要 — 所有未来医疗就诊必须标注此项；5. 2周后逐渐恢复运动。预后：极佳。',
};

// ═══════════════════════════════════════════════════════════
// PATIENT 4 — LAU SUK YEE — UTI
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[4] = {
  patientId: 4,
  entries: [
    {
      date: '2026-06-18', type: 'discharge', facility: 'HK Sanatorium & Hospital', department: 'Internal Medicine',
      physician: '王医生（内科）', chiefComplaint: 'Complicated UTI — stabilised for HaH discharge',
      diagnosis: 'Complicated UTI (E. coli, ESBL-negative); Acute confusional state (resolved); T2DM; CKD Stage 3 (eGFR 48); HTN',
      labs: 'Cr 146, eGFR 48, K⁺ 4.6. Urine culture: E. coli >10⁵ CFU/mL, sensitive to Nitrofurantoin, Cephalexin, Ciprofloxacin. Blood cultures: no growth.',
      imaging: 'Renal US: bilateral medical renal disease, no hydronephrosis.',
      prescriptions: 'Ciprofloxacin 500mg BID (7-day course, 4 days remaining), Losartan 100mg qd, Dapagliflozin 10mg qd, Ferrous Sulfate 325mg qd',
      notes: 'IV Ceftriaxone × 2 days → oral Ciprofloxacin switch. Confusion fully resolved (AMTS 9/10). Afebrile × 36h. Urinary symptoms improving. Discharged to HaH. Complete 7-day antibiotic course. Renal function stable. Monitor for C. difficile.',
    },
    {
      date: '2026-06-15', type: 'admission', facility: 'HK Sanatorium & Hospital', department: 'Internal Medicine',
      physician: '王医生（内科）', chiefComplaint: 'Dysuria, frequency, suprapubic pain, new-onset confusion × 3 days',
      diagnosis: 'Complicated UTI (E. coli); Acute confusional state (infection-related delirium); T2DM; CKD Stage 3; HTN',
      labs: 'WBC 13.5, CRP 86. Urine: nitrite +, leukocyte esterase 3+, blood 2+. Cr 150, eGFR 46. AMTS 6/10 on admission.',
      imaging: 'Renal US (previous): bilateral medical renal disease, cortical thinning.',
      prescriptions: 'IV Ceftriaxone 1g qd, IV fluids, Ciprofloxacin 500mg BID started Day 3',
      notes: 'Complicated UTI in elderly diabetic patient with CKD. Acute confusion (AMTS 6/10) — likely infection-related delirium. IV antibiotics started. Confusion resolving by Day 3 (AMTS 8/10). IV→oral switch Day 3. Stable for HaH.',
    },
    {
      date: '2026-03-10', type: 'outpatient', facility: 'Tuen Mun Hospital', department: 'Nephrology',
      physician: '社区医生', chiefComplaint: 'CKD follow-up — stable',
      diagnosis: 'CKD Stage 3 (eGFR 48); HTN; Anaemia of CKD (mild); T2DM',
      labs: 'Cr 146, eGFR 48, K⁺ 4.8, Hb 10.8, Ferritin 45, TSAT 18%. Urine PCR 0.8. HbA1c 7.2%.',
      imaging: 'Renal US: bilateral medical renal disease, no hydronephrosis, cortical thinning.',
      prescriptions: 'Losartan 100mg qd, Dapagliflozin 10mg qd, Ferrous Sulfate 325mg qd, Atorvastatin 20mg qd',
      notes: 'CKD stable — eGFR decline 2mL/min/year. BP 140/90 at upper target. Iron deficiency anaemia — oral iron continued. Renal diet reviewed. Avoid NSAIDs. Next labs in 3 months.',
    },
    {
      date: '2025-06-05', type: 'outpatient', facility: 'Kwong Wah Hospital', department: 'General Medicine',
      physician: 'Dr. Leung Siu Keung', chiefComplaint: 'New CKD diagnosis — elevated Cr found on routine labs',
      diagnosis: 'CKD Stage 3 (eGFR 50); HTN (long-standing, poorly controlled); Iron Deficiency; T2DM',
      labs: 'Cr 142, eGFR 50, Hb 10.5, Ferritin 22. Urine: protein 1+. HbA1c 7.8%.',
      imaging: 'Renal US: small echogenic kidneys — chronic changes.',
      prescriptions: 'Losartan 50mg qd started, Iron supplements, Metformin 500mg BID',
      notes: 'CKD likely due to long-standing poorly controlled HTN + T2DM. Referred to nephrology. Iron deficiency likely nutritional + CKD-related. Avoid nephrotoxins. Renal diet counselling.',
    },
    {
      date: '2023-09-12', type: 'outpatient', facility: 'Kwun Tong GOPC', department: 'Family Medicine',
      physician: '王医生（内科）', chiefComplaint: 'Routine DM follow-up — suboptimal control',
      diagnosis: 'Type 2 DM (HbA1c 8.2%); HTN (148/90); Overweight (BMI 28.1)',
      labs: 'HbA1c 8.2%, FPG 7.8, Cr 88, eGFR 68. Lipids: TC 5.8, LDL 3.6.',
      imaging: 'ECG: NSR, no LVH.',
      prescriptions: 'Metformin 500mg BID started, Amlodipine 5mg qd',
      notes: 'DM and HTN both above target. Lifestyle modifications reinforced. Metformin + Amlodipine started. Renal function borderline — monitor. Follow-up in 3 months.',
    },
  ],
  aiSummary: '刘淑仪，81岁女性，多种合并症（T2DM、CKD 3期、高血压、CKD贫血），因复杂性尿路感染导致急性意识模糊状态（感染相关性谵妄）就诊。谵妄经抗生素治疗后缓解 — 老年患者UTI典型表现：以意识模糊而非典型泌尿症状为主要表现。CKD 3期（eGFR 48）稳定伴缓慢进展（2mL/min/年）。AI评估：1. NEWS低-中危（3分）— 年龄、CKD、DM及近期谵妄所致；2. 环丙沙星与氯沙坦相互作用 — 监测低血压；3. 老年人使用氟喹诺酮类的艰难梭菌风险 — 监测腹泻；4. 认知基线AMTS 9/10 — 预期恢复至基线；5. UTI预防：充分饮水、规律排尿、保持卫生。预后：预期恢复良好；CKD管理为长期重点。',
};

// ═══════════════════════════════════════════════════════════
// PATIENT 5 — HO TAI WAI — Cellulitis
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[5] = {
  patientId: 5,
  entries: [
    {
      date: '2026-06-18', type: 'discharge', facility: '常州市金坛区人民医院', department: 'Internal Medicine',
      physician: '姜珊（护士经理）', chiefComplaint: 'Cellulitis — stabilised for HaH discharge',
      diagnosis: 'Moderate Cellulitis (Eron Class III) — left lower limb, likely streptococcal; T2DM (HbA1c 7.8%); HTN',
      labs: 'WBC 10.5 (↓ from 14.2), CRP 48 (↓ from 128). Blood cultures: no growth. Wound swab: no growth.',
      imaging: 'No imaging required. Clinical assessment: erythema 15cm diameter (↓ from 25cm), well-demarcated.',
      prescriptions: 'Clindamycin 450mg q6h (9-day course, 5 days remaining), Metformin 500mg BID, Amlodipine 5mg qd',
      notes: 'IV Clindamycin × 2 days → oral switch. Erythema reduced from 25→15cm. Afebrile × 36h. Pain 2/10. Discharged to HaH with daily RN for wound care. Complete 9-day antibiotic course. Leg elevation. Mark erythema margins daily.',
    },
    {
      date: '2026-06-15', type: 'admission', facility: '常州市金坛区人民医院', department: 'Internal Medicine',
      physician: '姜珊（护士经理）', chiefComplaint: 'Progressive left leg erythema, swelling, warmth, pain × 4 days',
      diagnosis: 'Cellulitis (Eron Class III) — left lower limb; T2DM (HbA1c 7.8%); HTN; Portal of entry: shin abrasion from gardening',
      labs: 'WBC 14.2, CRP 128. Blood cultures: no growth. Wound swab: pending. HbA1c 7.8%.',
      imaging: 'No DVT — Doppler US negative. No gas on XR — necrotising fasciitis ruled out.',
      prescriptions: 'IV Clindamycin 600mg q8h. Paracetamol 1g q6h prn.',
      notes: 'Moderate cellulitis (Eron Class III) with systemic symptoms (Temp 38.4°C, HR 96). Erythema 25cm diameter. No abscess, no tracking. IV Clindamycin started — good response within 48h. DM control suboptimal (HbA1c 7.8%). Wound care education initiated.',
    },
    {
      date: '2025-09-20', type: 'outpatient', facility: 'Kwun Tong GOPC', department: 'Family Medicine',
      physician: '王医生（内科）', chiefComplaint: 'DM follow-up — suboptimal control',
      diagnosis: 'Type 2 DM (HbA1c 7.8%); HTN (suboptimal); Hyperlipidaemia',
      labs: 'HbA1c 7.8%, FPG 7.2, Cr 90, eGFR 65. Lipids: LDL 3.2.',
      imaging: 'Foot exam: normal sensation, no ulcers. Retinal screen: no retinopathy.',
      prescriptions: 'Metformin increased 500mg→1g BID, Amlodipine 5mg qd, Atorvastatin 20mg qd started',
      notes: 'HbA1c above target. Metformin dose increased. Statin started for primary prevention. Foot care education provided. Lifestyle: reduce refined carbs, increase activity.',
    },
    {
      date: '2024-06-02', type: 'outpatient', facility: 'Kwun Tong GOPC', department: 'Family Medicine',
      physician: '王医生（内科）', chiefComplaint: 'Routine check-up — elevated glucose',
      diagnosis: 'Type 2 DM (newly diagnosed, HbA1c 7.5%); Pre-HTN (138/86); Overweight (BMI 28.4)',
      labs: 'HbA1c 7.5%, FPG 7.8, Cr 85. Lipids: TC 5.8, LDL 3.8.',
      imaging: 'ECG: normal. BMI 28.4.',
      prescriptions: 'Metformin 500mg BID started',
      notes: 'New DM diagnosis. Overweight. Diabetes education provided. Self-monitoring of blood glucose. Lifestyle modifications. Follow-up in 3 months.',
    },
  ],
  aiSummary: '何大伟，72岁男性，T2DM（HbA1c 7.8% — 控制欠佳）和高血压，继发于轻微园艺擦伤后出现左下肢中度蜂窝织炎（Eron III级）。糖尿病和年龄增加皮肤感染风险、伤口愈合受损及潜在并发症。静脉→口服克林霉素转换后显著改善。AI评估：1. NEWS低-中危（3分）— DM、年龄及感染严重度所致；2. 克林霉素q6h给药 — 完整9天疗程的依从性至关重要；3. 艰难梭菌风险 — 监测腹泻；4. 糖尿病控制需要优化 — HbA1c 7.8%高于目标值；5. 糖尿病足护理教育对预防至关重要；6. 伤口预期14天内愈合 — 每日监测脓肿形成。预后：适当的抗生素治疗和伤口护理下预后良好。',
};

// ═══════════════════════════════════════════════════════════
// PATIENT 6 — NG SIU WAN — DVT
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[6] = {
  patientId: 6,
  entries: [
    {
      date: '2026-06-18', type: 'discharge', facility: 'Gleneagles Hospital', department: 'Internal Medicine',
      physician: '王医生（内科）', chiefComplaint: 'DVT — stabilised for HaH discharge',
      diagnosis: 'Acute Proximal DVT — left femoral + popliteal vein; No PE; HTN; Hyperlipidaemia',
      labs: 'INR 2.1 (therapeutic, target 2.0-3.0). D-dimer: 3,200 (elevated). Cr 78, Hb 13.2. Thrombophilia screen: pending (outpatient).',
      imaging: 'Doppler US: acute non-occlusive thrombus left femoral vein extending to proximal popliteal vein. CTPA: no PE. No iliac vein involvement.',
      prescriptions: 'Warfarin 5mg qd (dose adjusted per INR), Perindopril 4mg qd, Atorvastatin 20mg qd',
      procedures: 'LMWH (Enoxaparin 1mg/kg BID) bridging × 4 days → discontinued. Warfarin 5mg qd started Day 1. INR 2.1 on Day 4 — therapeutic.',
      notes: 'LMWH bridging completed. Warfarin monotherapy — INR 2.1 (target 2.0-3.0). Compression stockings (Class II, 23-32mmHg) fitted. No bleeding. Discharged to HaH with daily INR via POCT. Warfarin education provided. Anticoagulation 3-6 months planned. Follow-up Doppler US at 3 months.',
    },
    {
      date: '2026-06-14', type: 'admission', facility: 'Gleneagles Hospital', department: 'Internal Medicine',
      physician: '王医生（内科）', chiefComplaint: 'Progressive left leg swelling, calf pain, mild erythema × 3 days',
      diagnosis: 'Acute Proximal DVT — left femoral + popliteal vein; Wells Score 3 (moderate probability); No PE',
      labs: 'D-dimer: 3,200 (elevated). CBC: normal. Coagulation: PT 12.8, aPTT 28. CT pulmonary angiogram: no PE.',
      imaging: 'Doppler US: acute non-occlusive thrombus in left femoral vein extending to proximal popliteal vein. No iliac vein involvement. CTPA: no PE.',
      prescriptions: 'LMWH (Enoxaparin 1mg/kg BID) started. Warfarin 5mg qd bridging started Day 1.',
      notes: 'Provoked DVT — no clear provoking factor identified (no recent surgery, trauma, travel, or OCP use). Wells Score 3. D-dimer elevated. Doppler US confirmed proximal DVT. CTPA negative for PE. LMWH + Warfarin bridging initiated. Thrombophilia screen ordered (outpatient).',
    },
    {
      date: '2025-08-15', type: 'outpatient', facility: 'Gleneagles Hospital', department: 'Health Screening',
      physician: '李妍（评估员）', chiefComplaint: 'Annual health check — no complaints',
      diagnosis: 'HTN (Stage 1, 140/86); Hyperlipidaemia (LDL 3.6); Post-menopausal; BMI 25.2',
      labs: 'CBC normal, FPG 5.4, HbA1c 5.3%. Lipids: TC 5.6, LDL 3.6, HDL 1.3, TG 1.8. Cr 72, eGFR 82.',
      imaging: 'CXR: clear. ECG: NSR, normal. Mammogram: normal. Bone density: mild osteopenia L-spine T-score -1.4.',
      prescriptions: 'Perindopril 4mg qd started, Atorvastatin 20mg qd started, Calcium 600mg + Vitamin D 800IU qd',
      notes: 'New HTN and hyperlipidaemia diagnosis. Cardiovascular risk factors identified. ACEi + statin started. Lifestyle modifications. Osteopenia — calcium + vitamin D supplementation. Regular exercise encouraged.',
    },
    {
      date: '2022-03-20', type: 'outpatient', facility: 'Gleneagles Hospital', department: 'Health Screening',
      physician: '李妍（评估员）', chiefComplaint: 'Annual health check — no complaints',
      diagnosis: 'Healthy; Perimenopausal; No chronic conditions; BMI 24.8',
      labs: 'All within normal limits. FPG 5.1, Lipids: TC 4.8, LDL 2.8. Cr 68.',
      imaging: 'CXR: clear. ECG: normal. Mammogram: normal.',
      prescriptions: 'None.',
      notes: 'Healthy 63-year-old. No chronic conditions. Active lifestyle — walks daily. No significant medical history. Family history: father had DVT at age 72 (post-hip surgery). Mother HTN. Advised to maintain active lifestyle.',
    },
  ],
  aiSummary: '吴小云，67岁女性，既往高血压和高脂血症控制良好，无明显诱因发生急性近端深静脉血栓（左股静脉+腘静脉）。CTPA未见肺栓塞。家族史显著：父亲72岁时DVT（术后）。目前服用华法林（INR 2.1，目标2.0-3.0），低分子肝素桥接已完成。AI评估：1. NEWS中危（4分）— 抗凝管理（出血风险、INR不稳定）、血栓扩展和肺栓塞风险；2. 每日POCT监测INR直至连续稳定×3天 — 对华法林安全性至关重要；3. 患者教育至关重要 — 华法林治疗窗狭窄，多种药物/食物相互作用；4. 保持维生素K摄入量一致至关重要 — 避免饮食骤然变化；5. 弹力袜预防血栓后综合征；6. 易栓症筛查待定 — 可能决定抗凝疗程（3个月 vs 长期）；7. 家族DVT史 — 可能存在遗传易感性。预后：治疗性抗凝下预后良好；关键风险：INR未达治疗范围时出血或血栓复发。',
};

export default MEDICAL_HISTORY;

export const PATIENT_7_HISTORY = {
  patientId: 7,
  events: [
    {
      date: '2026-06-14', type: 'admission', facility: 'Prince of Wales Hospital', department: 'Respiratory Medicine',
      physician: '社区医生', chiefComplaint: 'Fever × 3 days, productive cough, increasing dyspnoea',
      diagnosis: 'Community-Acquired Pneumonia (CURB-65: 2 — age + confusion on admission). COPD GOLD Stage 2 exacerbation.',
      labs: 'WBC 15.2, Neutrophils 84%, CRP 156, PCT 3.2. ABG: pH 7.36, PaO₂ 8.2, PaCO₂ 6.8. Sputum culture pending.',
      imaging: 'CXR: right lower lobe consolidation + bibasilar atelectasis. No pleural effusion.',
      prescriptions: 'IV Ceftriaxone 2g QD + IV Azithromycin 500mg QD × 5 days. Salbutamol neb PRN. Prednisolone 40mg PO × 5 days (taper). O₂ 2L/min via NC.',
      notes: 'Admitted via A&E with CAP + COPD exacerbation. Initial confusion (AMTS 6/10) resolved within 24h. Responded well to IV antibiotics — afebrile by Day 3. O₂ weaned to RA by Day 4. CURB-65 downgraded to 1 (age only). Discharge planned Day 6 to HaH for ongoing monitoring. Penicillin allergy (rash) documented — Ceftriaxone chosen due to low cross-reactivity.',
    },
    {
      date: '2025-08-10', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Respiratory Clinic',
      physician: '社区医生', chiefComplaint: 'Routine COPD follow-up — increased dyspnoea',
      diagnosis: 'COPD GOLD Stage 2 progress review. mMRC 2→3 (deterioration). Exacerbation-free × 12 months prior.',
      labs: 'Spirometry: FEV₁ 55% predicted (stable from 2024 — 57%). FEV₁/FVC 0.62. Post-bronchodilator: FEV₁ 58% (+3%). CAT score: 18 (↑ from 14).',
      imaging: 'CXR: hyperinflation, flattened diaphragms — consistent with COPD. No acute infiltrate.',
      prescriptions: 'Continue Spiriva 18mcg QD. Salbutamol MDI PRN. Pulmonary rehab referral (PWH programme — 8 sessions). Influenza + pneumococcal vaccines updated.',
      notes: 'COPD stable but mild functional decline — mMRC increase likely due to deconditioning. Smoking cessation maintained (quit 2015, 30 pack-year history). Pulmonary rehab programme initiated — 2 sessions/week at PWH. O₂ not required at rest but desaturates on walking 30m → O₂ concentrator on standby for future.',
    },
    {
      date: '2024-03-05', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Respiratory Clinic',
      physician: '社区医生', chiefComplaint: 'Annual COPD review — no complaints',
      diagnosis: 'COPD GOLD Stage 2 (FEV₁ 55%). Well-controlled. No exacerbations in past 12 months.',
      labs: 'Spirometry: FEV₁ 57% predicted, FEV₁/FVC 0.64. CAT score: 14. mMRC: 2.',
      imaging: 'CXR: hyperinflation, no interval change. No acute findings.',
      prescriptions: 'Spiriva 18mcg QD. Salbutamol MDI PRN. Continue smoking cessation. Annual flu vaccine.',
      notes: 'COPD well-managed. No exacerbations since diagnosis. Adherent to Spiriva. Exercise tolerance: walks 20-30 min/day with one rest stop. No oxygen desaturation at rest. Continue current management.',
    },
    {
      date: '2022-06-18', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Respiratory Clinic',
      physician: '社区医生', chiefComplaint: 'New patient — dyspnoea on exertion, chronic cough',
      diagnosis: 'COPD diagnosed — GOLD Stage 2. FEV₁ 58% predicted. mMRC 2.',
      labs: 'Spirometry: FEV₁ 58% predicted, FEV₁/FVC 0.64. Post-bronchodilator: FEV₁ 62% (+4%) — positive reversibility. CAT score: 12.',
      imaging: 'CXR: hyperinflated lung fields, flattened diaphragms. No focal lesion. ECG: normal.',
      prescriptions: 'Spiriva 18mcg QD. Salbutamol MDI PRN. Smoking cessation programme (quit 2015 — maintain). Annual flu + pneumococcal vaccines. Pulmonary rehab programme referral.',
      notes: 'COPD GOLD 2 diagnosed on spirometry. Long smoking history (30 pack-years, quit 2015) — likely tobacco-related COPD. No prior hospitalisations for respiratory issues. Good candidate for HaH if needed — strong family support, non-smoker environment. Penicillin allergy noted.',
    },
    {
      date: '2019-04-10', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Family Medicine',
      physician: '王医生（内科）', chiefComplaint: 'Routine check-up — elevated BP',
      diagnosis: 'Hypertension Stage 1 (BP 150/92). Ex-smoker.',
      labs: 'FPG 5.6, HbA1c 5.7% (pre-diabetic). Lipids: TC 5.4, LDL 3.2. Cr 88, eGFR 72. ECG: normal.',
      prescriptions: 'Amlodipine 5mg QD started. Lifestyle: low-salt diet, regular walking.',
      notes: 'New HTN diagnosis. Pre-diabetic — diet and exercise counselling provided. Good baseline health for 75yo. No chronic medications prior.',
    },
    {
      date: '2015-06-01', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Smoking Cessation',
      physician: 'Counsellor', chiefComplaint: 'Smoking cessation — quit programme',
      diagnosis: 'Tobacco dependence (30 pack-year). Quit smoking programme completed.',
      labs: 'Exhaled CO at programme completion: 2 ppm (non-smoker range).',
      prescriptions: 'None. Smoking cessation maintained.',
      notes: 'Successful smoking cessation. Quit at age 71 after 50+ years of smoking. Strong family support. Maintains smoke-free home environment.',
    },
  ],
  aiSummary: '陈大明，82岁男性，中度COPD（GOLD 2级，FEV₁ 55%，2022年确诊）合并近期社区获得性肺炎（2026年6月，CURB-65：2分）。显著病史：30包年吸烟（2015年已戒）、青霉素过敏（皮疹）、高血压（2019年确诊，氨氯地平5mg控制良好）。AI评估：1. 此前COPD控制良好 — 入院前12个月无急性加重；2. 肺炎后临床不稳定是最高风险 — 老年COPD患者CAP后需严密NEWS2监测（目标NEWS低危0-2分）；3. 感染复发风险增高 — COPD肺结构改变+黏液纤毛清除功能受损；4. 青霉素过敏限制经验性抗生素选择 — 头孢曲松<1%交叉反应性，可安全使用；5. 疫苗接种状态最新（流感+肺炎球菌）；6. 居家环境良好 — 配偶照护、有电梯、无烟家庭；7. GOLD 2024推荐：LAMA维持治疗、SABA急救、肺康复改善功能状态、及时识别/治疗急性加重。预后：严密监测下预后良好 — 避免复发感染的关键在于早期发现（SpO₂趋势+POCT升级）而非等待临床恶化。',
};


// ═══════════════════════════════════════════════════════════
// PATIENT 7 — CHAN TAI MING
// ═══════════════════════════════════════════════════════════
MEDICAL_HISTORY[7] = {
  patientId: 7,
  entries: PATIENT_7_HISTORY.events,
  aiSummary: PATIENT_7_HISTORY.aiSummary,
};

import { NEW_MEDICAL_HISTORY } from './newPatients/medicalHistory';
// Proper merge: NEW_MEDICAL_HISTORY uses Record<number, MedicalEntry[]> — wrap into PatientHistory
for (const [pid, entries] of Object.entries(NEW_MEDICAL_HISTORY)) {
  const id = Number(pid);
  if (MEDICAL_HISTORY[id]) {
    // Extend existing patient's entries
    MEDICAL_HISTORY[id].entries = [...entries, ...MEDICAL_HISTORY[id].entries];
  } else {
    // New patient: build PatientHistory wrapper
    MEDICAL_HISTORY[id] = {
      patientId: id,
      entries,
      aiSummary: '',
    } as any;
  }
}
