import { type PatientHistory } from '../medicalHistory';

export const NEW_MEDICAL_HISTORY: Record<number, PatientHistory> = {
  8: {
    patientId: 8,
    entries: [
      { date: '2026-06-30', type: 'discharge', facility: 'Queen Mary Hospital', department: 'Cardiology', physician: 'Dr. Kevin Wong', chiefComplaint: 'Post-PCI pain-free. Mobilising independently.', diagnosis: 'Resolved NSTEMI post-PCI×2 · T2DM · HTN · EF 50%', labs: 'Trop I 3.1. CK-MB 22. Cr 88. HbA1c 7.9%. LDL 3.8.', imaging: 'Echo EF 50%. PCI TIMI 3 flow LAD + RCA.', prescriptions: 'Aspirin 100 Clopidogrel 75 DAPTx12m Metoprolol 37.5 BID Atorvastatin 40 Lisinopril 5 Metformin 500 BID', notes: 'iHomeCare RPM. Nurse 3×/wk. ECG q2w. Cardiac rehab Phase 2. Card clinic 2w.' },
      { date: '2026-06-18', type: 'admission', facility: 'Queen Mary Hospital', department: 'Cardiology', physician: 'Dr. Kevin Wong', chiefComplaint: 'Acute crushing chest pain to L arm ×3h, diaphoresis, nausea.', diagnosis: 'NSTEMI anterior. ECG ST↑ V1-V4. Trop I 12.4. Echo ant hypokinesis EF 48%.', labs: 'Trop I 12.4→3.1. CK-MB 45→22. WBC 11.2. Cr 88 K⁺ 4.1.', imaging: 'Cor angio: 85% mid-LAD, 90% prox RCA. PCI 2 DES. Post TIMI 3.', prescriptions: 'Aspirin 100 Clopidogrel 75 Metoprolol Atorvastatin 40', notes: 'Uncomplicated PCI. CCU 48h. No arrhythmias.' },
      { date: '2023-05-10', type: 'outpatient', facility: 'Kwong Wah Hospital', department: 'Endocrinology', physician: 'Dr. Leung Siu Keung', chiefComplaint: 'Routine check. Fasting glucose 7.8.', diagnosis: 'New T2DM. HbA1c 8.5%.', labs: 'Fasting 7.8 OGTT 2h 13.2 HbA1c 8.5% UACR 15 eGFR 92.', prescriptions: 'Metformin 500 BID→1g BID.', notes: 'DM education. Annual retinal. Foot q6m.' },
      { date: '2020-03-15', type: 'outpatient', facility: 'GOPC Kwun Tong', department: 'Family Medicine', physician: 'Dr. Lam Wai Keung', chiefComplaint: 'Elevated BP workplace screening. BP 158/94.', diagnosis: 'Essential HTN Grade 2.', labs: 'Lipids renal lytes normal. ECG NSR.', prescriptions: 'Amlodipine 5 Lisinopril 10.', notes: 'Home BP log. Target <130/80. DASH Na<2g.' },
    ],
    aiSummary: '周国辉，72岁男性，急性冠脉综合征轨迹：高血压（2020年）→ T2DM（2023年）→ NSTEMI双支PCI（2026年）。目前PCI术后第12天，EF 50%，DAPT×12月。AI核心关注：1. NEWS中危（4分）— 近期心梗、T2DM、新GDMT方案；2. DAPT出血vs支架内血栓平衡；3. HbA1c 7.9%控制欠佳 — 每日4次SMBG至关重要；4. 心脏康复二期对二级预防至关重要；5. 远程心电监测发现无症状心肌缺血。依从性良好则预后良好。',
  },
  9: {
    patientId: 9,
    entries: [
      { date: '2026-07-02', type: 'discharge', facility: 'Prince of Wales Hospital', department: 'Respiratory Medicine', physician: 'Dr. Peter Ho', chiefComplaint: 'SpO₂ 94% on 2L O₂. Mobilising. No distress.', diagnosis: 'Resolved COPD exacerbation GOLD3 + hypoxaemia. Osteoporosis T-2.8.', labs: 'WBC normalised. CRP ↓. ABG compensated.', prescriptions: 'Amox-clav 7d Pred taper LAMA/LABA Salbutamol PRN O₂ PRN Alendronate 70mg wkly.', notes: 'iHomeCare. Nurse 2×/wk. Pulm rehab. Falls OT.' },
      { date: '2026-06-22', type: 'admission', facility: 'Prince of Wales Hospital', department: 'Respiratory Medicine', physician: 'Dr. Peter Ho', chiefComplaint: 'Increasing dyspnoea ×3d. Purulent sputum. SpO₂ 88% RA.', diagnosis: 'COPD GOLD3 acute exacerbation. ABG pH 7.34 PaCO₂ 52 PaO₂ 58.', labs: 'WBC 14.2 CRP 86. Sputum H.influenzae.', imaging: 'CXR hyperinflation. No PTX.', prescriptions: 'Ceftriaxone IV Pred 40mg taper Tio/Olo BID O₂ 2L', notes: 'Improved Day 4. Home O₂ assessment.' },
      { date: '2025-11-05', type: 'admission', facility: 'Prince of Wales Hospital', department: 'Respiratory Medicine', physician: 'Dr. Peter Ho', chiefComplaint: 'Mild COPD exacerbation SOB sputum ×2d.', diagnosis: 'COPD moderate exacerbation. Viral trigger.', prescriptions: 'Pred 30mg ×5d Doxycycline 100mg BID ×7d.', notes: 'DC 4d. FEV₁ 52% stable.' },
      { date: '2022-01-18', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Respiratory Medicine', physician: 'Dr. Peter Ho', chiefComplaint: 'Progressive DOE ×6m. 40pk-yr smoking.', diagnosis: 'COPD GOLD2→GOLD3 progression. FEV₁ 36%.', labs: 'Spiro FEV₁ 1.45L(58%)→36%. DLCO 65%.', imaging: 'CXR hyperinflation. CT centrilobular emphysema.', prescriptions: 'Tiotropium/Olodaterol BID. Smoking cessation.', notes: 'Quit 2022-01-18. Pulm rehab.' },
    ],
    aiSummary: '林小芸，68岁女性，晚期COPD（GOLD 3级，FEV₁ 36%）伴慢性低氧血症和反复感染性急性加重（12个月内2次入院）。骨质疏松（T-2.8）增加跌倒风险。AI评估：1. NEWS中危（5分）— 近期急性加重、低氧血症；2. SpO₂基线92% — 每日血氧监测+必要时吸氧；3. 激素逐渐减量依从性至关重要；4. 肺康复重新入组；5. 阿仑膦酸钠+防跌倒OT。2022年起已戒烟并维持。',
  },
  10: {
    patientId: 10,
    entries: [
      { date: '2026-07-05', type: 'discharge', facility: 'PYNEH', department: 'Neurology', physician: 'Dr. Chan Ka Wai', chiefComplaint: 'NIHSS 4. Mobilising with walker. Speech improving.', diagnosis: 'Resolved L MCA stroke · R hemiparesis · Dysphagia resolving · HTN. mRS 3.', labs: 'LDL 3.8. HbA1c 5.9%.', prescriptions: 'ASA 100 Clopidogrel 75 DAPTx21d. Atorva 40. Perindopril 4. Amlo 5.', notes: 'Home PT/OT 3× ST 2×. IDDSI 5. Neuro F/U 4w.' },
      { date: '2026-06-25', type: 'admission', facility: 'PYNEH', department: 'Neurology', physician: 'Dr. Chan Ka Wai', chiefComplaint: 'Acute R weakness, facial droop, slurred speech ×2h.', diagnosis: 'Acute Ischaemic Stroke L MCA. NIHSS 10. IV Alteplase given.', labs: 'Glucose 6.8 INR 1.0. LDL 3.8.', imaging: 'CT no haemorrhage. CTA L MCA M1 occlusion. CTP penumbra 42mL.', prescriptions: 'IV Alteplase 0.9mg/kg. ASA 300→100. Atorva 40.', notes: 'Thrombolysis <3.5h. NIHSS 6 at 24h.' },
      { date: '2023-08-12', type: 'outpatient', facility: 'GOPC Kwun Tong', department: 'Family Medicine', physician: 'Dr. Lam Wai Keung', chiefComplaint: 'HTN follow-up. BP 148/90.', diagnosis: 'Uncontrolled HTN. BMI 28.4.', prescriptions: 'Amlodipine↑10mg Lisinopril 20mg.', notes: 'DASH reinforced. Home BP.' },
    ],
    aiSummary: '张小明，76岁男性，左侧MCA缺血性卒中，IV阿替普酶溶栓（NIHSS 10→4）。右侧偏瘫正在改善（RUE 3+/5）。吞咽困难缓解中（IDDSI 5级）。AI核心关注：1. NEWS中危（4分）— 老年卒中、跌倒风险；2. DAPT×21天后单用阿司匹林；3. 血压目标<140/90用于二级预防；4. 强化PT/OT/ST康复；5. 照护者转移技能培训。出院mRS 3分 — 预期中度残疾可改善。',
  },
  11: {
    patientId: 11,
    entries: [
      { date: '2026-07-01', type: 'discharge', facility: 'HK Sanatorium & Hospital', department: 'Breast Surgery', physician: 'Dr. Margaret Chan', chiefComplaint: 'POD3. Drain decreasing. Wound clean.', diagnosis: 'Post-lumpectomy+SLNB recovery. Pending adjuvant chemo AC-T.', labs: 'Post-op Hb 11.2. SLN 2/3 negative.', prescriptions: 'Analgesia PRN. Drain/wound care.', notes: 'iHomeCare wound nurse. Drain removal <30mL/d.' },
      { date: '2026-06-28', type: 'surgery', facility: 'HK Sanatorium & Hospital', department: 'Breast Surgery', physician: 'Dr. Margaret Chan', chiefComplaint: 'L breast lumpectomy for IDC. SLNB.', diagnosis: 'IDC L breast 2.4cm Grade 2 ER+/PR+/HER2-. pT2N0M0 IIB.', labs: 'Pre-op WBC 6.2 Hb 12.5.', imaging: 'MRI 2.4cm mass L UOQ. Specimen radiograph confirms.', prescriptions: 'Paracetamol 1g q6h Cephalexin 500mg TID ×5d.', notes: 'Drain output 45mL/d. Oncology AC-T ×8 planned.' },
      { date: '2026-06-15', type: 'outpatient', facility: 'HK Sanatorium & Hospital', department: 'Breast Centre', physician: 'Dr. Margaret Chan', chiefComplaint: 'Core biopsy follow-up.', diagnosis: 'IDC L breast ER+/PR+/HER2- Luminal A Grade 2.', labs: 'IHC ER 8/8 PR 7/8 HER2 0 Ki-67 18%.', imaging: 'Mammo BI-RADS 5. MRI no multicentric. CT no mets.', prescriptions: 'Surgical referral lumpectomy+SLNB.', notes: 'MDT BCS+SLNB. Adj AC-T→RT→Letrozole ×5y.' },
    ],
    aiSummary: '王丽珍，62岁女性，ER+/PR+/HER2-浸润性导管癌IIB期，保乳术后切缘阴性，SLNB阴性（2/3淋巴结）。辅助AC-T化疗待启动。AI评估：1. NEWS低危（2分）— 术后恢复低风险；2. 伤口/引流管理至引流量<30mL/d；3. 化疗规划期间心理支持；4. 化疗第一周期前放置输液港；5. 预后极佳（Luminal A型，淋巴结阴性）。家庭支持强。',
  },
  12: {
    patientId: 12,
    entries: [
      { date: '2026-07-03', type: 'discharge', facility: 'Queen Mary Hospital', department: 'Cardiology', physician: 'Dr. Kevin Wong', chiefComplaint: 'Euvolemic. Wt 68kg. No DOE at rest.', diagnosis: 'Stabilised HF NYHA II-III. Ischemic CMP EF 32%. AF controlled. CKD3.', labs: 'BNP 620. Cr 124 eGFR 48. K⁺ 4.6.', prescriptions: 'Entresto 97/103 BID Bisoprolol 5 Spironolactone 25 Empagliflozin 10 Apixaban 5 BID Furosemide 40 flexible.', notes: 'iHomeCare. Daily wt. Fluid 1.5L. HF nurse 3×. Readmit 28%.' },
      { date: '2026-06-28', type: 'admission', facility: 'Queen Mary Hospital', department: 'Cardiology', physician: 'Dr. Kevin Wong', chiefComplaint: 'Progressive DOE orthopnoea leg edema ×1wk. Weight gain 3kg.', diagnosis: 'Acute decompensated HF NYHA III. EF 32%. BNP 1850.', labs: 'BNP 1850. Cr 124 eGFR 48. K⁺ 4.8.', imaging: 'Echo EF 32% severe ant hypokinesis mod MR. CXR pulm congestion.', prescriptions: 'IV Furosemide 80 BID GDMT optimisation.', notes: 'Net -3.2L/72h. Wt 72→68kg.' },
      { date: '2024-09-10', type: 'admission', facility: 'Queen Mary Hospital', department: 'Cardiology', physician: 'Dr. Kevin Wong', chiefComplaint: 'Acute anterior STEMI. Primary PCI LAD.', diagnosis: 'Anterior STEMI. EF 35% post-MI.', labs: 'Peak Trop I 45.', imaging: 'Echo EF 35% ant/apical akinesis.', prescriptions: 'GDMT initiated. Cardiac rehab.', notes: 'ICD consideration if EF<35% at 3m.' },
    ],
    aiSummary: '霍伟强，69岁男性，缺血性心肌病（EF 32%）STEMI 2024年后，近期ADHF失代偿（BNP 1850→620）。永久性房颤，服用阿哌沙班。CKD 3期限制利尿剂上调。AI核心关注：1. NEWS中危（5分）— 队列中最高心脏监护级别；2. 每日体重监测至关重要（干体重67-68kg）；3. GDMT已达目标剂量 — 每2周监测K⁺/Cr；4. 液体1.5L，钠<2g；5. 恩格列净用于HF+CKD获益。女儿作为照护者对依从性至关重要。',
  },
  13: {
    patientId: 13,
    entries: [
      { date: '2026-07-04', type: 'discharge', facility: 'Kwong Wah Hospital', department: 'Endocrinology', physician: 'Dr. Leung Siu Keung', chiefComplaint: 'CBG 6-10 on basal-bolus. No hypos.', diagnosis: 'Resolved DKA · T2DM on insulin · Diabetic nephropathy · Mild NPDR · Obesity.', labs: 'HbA1c 9.2%. UACR 320. eGFR 72. CBG 6-10.', prescriptions: 'Glargine 20u hs Lispro 6u AC. Metformin 1g BID Empagliflozin 10 Lisinopril 10 Atorva 20.', notes: 'iHomeCare DM educator weekly. SMBG qid. Podiatry monthly.' },
      { date: '2026-06-26', type: 'admission', facility: 'Kwong Wah Hospital', department: 'Endocrinology', physician: 'Dr. Leung Siu Keung', chiefComplaint: 'Polyuria polydipsia blurred vision. CBG 18.6.', diagnosis: 'DKA mild pH 7.31. T2DM HbA1c 9.2%. Diabetic nephropathy UACR 320. Mild NPDR.', labs: 'CBG 18.6 ketones 2.8. ABG pH 7.31 HCO₃ 18.', imaging: 'Fundoscopy mild NPDR. Foot monofilament 8/10.', prescriptions: 'IV insulin infusion→SC basal-bolus.', notes: 'DKA resolved 12h. Wt 82kg BMI 32.' },
      { date: '2024-06-10', type: 'outpatient', facility: 'Kwong Wah Hospital', department: 'Endocrinology', physician: 'Dr. Leung Siu Keung', chiefComplaint: 'Routine DM F/U. HbA1c 8.1%.', diagnosis: 'Suboptimal control. Early nephropathy UACR 85.', prescriptions: 'Metformin↑ Empagliflozin added.', notes: 'HbA1c <7.0% target in 6m.' },
    ],
    aiSummary: '刘惠贤，55岁女性，控制欠佳的T2DM（HbA1c 9.2%）、糖尿病肾病（UACR 320）、轻度NPDR和肥胖（BMI 32）背景下出现轻度DKA。现为基础-餐时胰岛素方案，血糖控制正在改善。AI评估：1. NEWS低危（2分）— DKA已缓解，反应良好；2. 3个月内HbA1c目标<7.0%；3. 赖诺普利+恩格列净肾脏保护；4. 足病每月，眼底每6个月；5. 体重管理计划。兄弟作为照护者支持胰岛素注射监督。',
  },
  14: {
    patientId: 14,
    entries: [
      { date: '2026-07-06', type: 'discharge', facility: 'Tuen Mun Hospital', department: 'Nephrology', physician: 'Dr. Wong Kwok Ming', chiefComplaint: 'Uraemic symptoms improved. K⁺ 4.8. Hb 10.2 post-ESA.', diagnosis: 'Stabilised CKD4 eGFR 22. Anaemia improving. 2°HPT controlled.', labs: 'Cr 265 eGFR 22. K⁺ 4.8. Hb 10.2. PTH 165.', prescriptions: 'NaHCO₃ Sevelamer Epoetin 4000u SC weekly Losartan 50 Furosemide 40.', notes: 'iHomeCare. Home BP. Renal dietitian. AVF 4w.' },
      { date: '2026-06-30', type: 'admission', facility: 'Tuen Mun Hospital', department: 'Nephrology', physician: 'Dr. Wong Kwok Ming', chiefComplaint: 'Progressive fatigue pruritus nausea ×2m.', diagnosis: 'CKD4 eGFR 22 decline. HTN nephrosclerosis. Anaemia Hb 9.8. 2°HPT.', labs: 'Cr 265 eGFR 22 K⁺ 5.6 HCO₃ 19 Hb 9.8 PTH 185.', imaging: 'Renal US small kidneys bilateral.', prescriptions: 'NaHCO₃ Sevelamer Epoetin Iron sucrose IV', notes: 'Renal diet. AVF planned. RRT when eGFR<15.' },
      { date: '2023-02-15', type: 'outpatient', facility: 'Tuen Mun Hospital', department: 'Nephrology', physician: 'Dr. Wong Kwok Ming', chiefComplaint: 'Incidental elevated Cr. Asymptomatic.', diagnosis: 'CKD3b eGFR 38. HTN nephrosclerosis.', labs: 'Cr 168 eGFR 38 UACR 180.', prescriptions: 'Losartan 100 Amlodipine 10.', notes: 'Annual renal F/U. AVF when eGFR<25.' },
    ],
    aiSummary: '曾国雄，80岁男性，高血压性肾硬化致进展性CKD（3b期→4期，eGFR 22），伴CKD贫血、继发性甲旁亢、代谢性酸中毒。AI核心关注：1. NEWS中危（4分）— 电解质不稳定、尿毒症症状；2. K⁺监测至关重要（曾5.6）；3. ESA每周+铁剂补充；4. 4周内规划AVF — 透析前教育；5. 肾病饮食严格控制（K⁺ 2-3g，PO₄ 800-1000mg）。妻子已培训ESA注射。',
  },
  15: {
    patientId: 15,
    entries: [
      { date: '2026-06-29', type: 'discharge', facility: 'United Christian Hospital', department: 'Cardiology', physician: 'Dr. Kevin Wong', chiefComplaint: 'BP 138/86 on 4-drug+CPAP. CPAP compliant.', diagnosis: 'Resistant HTN controlled. OSA on CPAP AHI 4. LVH stable.', labs: 'Cr 92 K⁺ 4.0. LDL 3.6. Fasting 5.8.', prescriptions: 'Amlodipine 10 Losartan 100 Chlorthalidone 25 Spironolactone 25 Atorva 20 CPAP 10cm.', notes: 'iHomeCare. Nurse BP weekly. CPAP remote. Wt management.' },
      { date: '2026-06-22', type: 'admission', facility: 'United Christian Hospital', department: 'Cardiology', physician: 'Dr. Kevin Wong', chiefComplaint: 'Persistent HTN despite triple therapy. Morning headaches. Snoring.', diagnosis: 'Resistant HTN. LVH IVS 13mm. Severe OSA AHI 32. BMI 34.', labs: 'Aldo/renin normal. Metanephrines normal.', imaging: 'Echo concentric LVH EF 62%. PSG AHI 32 nadir SpO₂ 82%.', prescriptions: '4-drug regimen + CPAP 10cmH₂O.', notes: 'CPAP reduced AHI to 4. Wt loss target BMI<30.' },
    ],
    aiSummary: '麦家明，58岁男性，难治性高血压需4药联合+CPAP治疗重度OSA（AHI 32→4治疗中）。心脏超声示向心性LVH。肥胖BMI 34。AI评估：1. NEWS低危（0分）— 现行方案控制良好；2. CPAP依从性≥4h/晚至关重要；3. 体重下降BMI<30目标；4. 家庭血压每日两次+24h动态血压每3月；5. DASH饮食钠<2g，运动150min/周。OSA治疗效果极佳。',
  },
  16: {
    patientId: 16,
    entries: [
      { date: '2026-07-07', type: 'discharge', facility: 'St. Teresa\'s Hospital', department: 'Orthopedics', physician: 'Dr. Raymond Li', chiefComplaint: 'POD8. Wound clean. Pain NRS 2. Transfers sliding board.', diagnosis: 'Post-ORIF R intertrochanteric healing. Osteoporosis T-3.2. Frailty CFS 6.', prescriptions: 'Paracetamol PRN Enoxaparin 40mg ×14d Alendronate 70mg wkly Ca VitD FeSO₄.', notes: 'iHomeCare PT 3× OT home safety. Care worker 3×. Ortho 4w XR.' },
      { date: '2026-06-29', type: 'surgery', facility: 'St. Teresa\'s Hospital', department: 'Orthopedics', physician: 'Dr. Raymond Li', chiefComplaint: 'Mechanical fall→R hip. Unable to bear weight.', diagnosis: 'R intertrochanteric fracture AO/OTA 31-A2. Osteoporosis T-3.2.', labs: 'Pre-op Hb 11.5. POD1 Hb 9.8.', imaging: 'X-ray displaced R intertrochanteric. DEXA FN -3.2.', prescriptions: 'ORIF DHS 135°. Enoxaparin DVT ppx.', notes: 'Surgery <24h. NWB ×6w→PWB 6-8w.' },
      { date: '2025-10-05', type: 'outpatient', facility: 'St. Teresa\'s Hospital', department: 'Orthopedics', physician: 'Dr. Raymond Li', chiefComplaint: 'Fall clinic after 2 falls in 6m.', diagnosis: 'Recurrent falls. Osteoporosis. Gait impairment.', labs: 'DEXA L1-4 -3.0 FN -3.2. VitD 22.', prescriptions: 'Alendronate 70mg wkly Ca VitD.', notes: 'Home OT grab bars. PT balance.' },
    ],
    aiSummary: '冯锦棠，83岁男性，右侧股骨转子间骨折ORIF术后，重度骨质疏松（T-3.2），衰弱（CFS 6），反复跌倒史。AI核心关注：1. NEWS中危（4分）— 老年、衰弱、术后；2. 非负重×6周后渐进负重；3. DVT预防依诺肝素×14天；4. 强化PT/OT+照护师ADL支持；5. 防跌倒居家环境改造。Hb 9.8术后 — 铁剂补充。该人群一年死亡率升高。',
  },
  17: {
    patientId: 17,
    entries: [
      { date: '2026-07-01', type: 'discharge', facility: 'Prince of Wales Hospital', department: 'Respiratory Medicine', physician: 'Dr. Peter Ho', chiefComplaint: 'Afebrile. SpO₂ 94% RA. Cough resolving.', diagnosis: 'Resolved CAP RLL. COPD GOLD2 stable.', labs: 'WBC normalising. CRP ↓.', prescriptions: 'Complete Amox-clav 7d. LAMA/LABA. Salbutamol PRN.', notes: 'iHomeCare. Resp nurse 2×. Incentive spirometry. Pulm rehab.' },
      { date: '2026-06-27', type: 'admission', facility: 'Prince of Wales Hospital', department: 'Respiratory Medicine', physician: 'Dr. Peter Ho', chiefComplaint: 'Productive cough green sputum fever 38.5 pleuritic pain ×4d.', diagnosis: 'CAP RLL consolidation. CURB-65 2. COPD GOLD2 FEV₁ 62%.', labs: 'WBC 15.2 CRP 156. Urea 7.8. Sputum GPC.', imaging: 'CXR dense RLL consolidation.', prescriptions: 'Ceftriaxone IV+Azithro→Amox-clav PO.', notes: 'Improved Day 3 afebrile.' },
      { date: '2023-04-20', type: 'outpatient', facility: 'Prince of Wales Hospital', department: 'Respiratory Medicine', physician: 'Dr. Peter Ho', chiefComplaint: 'Chronic cough DOE. 30pk-yr quit 2y.', diagnosis: 'COPD GOLD2 FEV₁ 62%.', labs: 'Spiro FEV₁ 1.62L(62%).', imaging: 'CXR hyperinflation.', prescriptions: 'Tio/Olo 2.5/2.5 qd Salbutamol PRN.', notes: 'Ex-smoker. Vaccines. Pulm rehab.' },
    ],
    aiSummary: '陈玉莲，71岁女性，缓解期CAP（右下肺，CURB-65 2分），背景COPD GOLD 2级（FEV₁ 62%）。2年前已戒烟。AI评估：1. NEWS低危（1分）— CAP反应良好，现CURB-65低；2. 临床改善后仍需完成7天阿莫西林克拉维酸；3. 激励式肺活量计预防肺不张；4. SpO₂基线94% — 恢复期监测；5. 肺康复转诊优化COPD管理。丈夫作为照护者支持抗生素依从性。',
  },
  18: {
    patientId: 18,
    entries: [
      { date: '2026-07-10', type: 'outpatient', facility: 'Shanghai United Family Hospital', department: 'Health Check', physician: 'Dr. Li Wei (Radiologist)', chiefComplaint: 'Screening CT.', diagnosis: 'Right-upper-lobe part-solid pulmonary nodule detected on screening chest CT.', imaging: 'CT chest: RUL part-solid nodule, suspicious features.', notes: 'Nodule referred to thoracic surgery for evaluation. Fleischner guidelines applied.' },
      { date: '2026-07-15', type: 'outpatient', facility: 'Shanghai United Family Hospital', department: 'Thoracic Surgery', physician: 'Dr. Wang Wei', chiefComplaint: 'RUL nodule evaluation.', diagnosis: 'Right-upper-lobe part-solid pulmonary nodule — follow-up plan per thoracic team.', imaging: 'CT chest review: RUL part-solid nodule. PFT ordered. Smoking cessation initiated.', notes: 'Initial thoracic surgery evaluation.' },
      { date: '2026-07-22', type: 'outpatient', facility: 'Shanghai United Family Hospital', department: 'Radiology', physician: 'Dr. Li Wei (Radiologist)', chiefComplaint: 'CT-guided biopsy.', diagnosis: 'CT-guided core needle biopsy — RUL nodule. Pathology: adenocarcinoma confirmed.', procedures: 'CT-guided percutaneous core needle biopsy RUL nodule. No pneumothorax.', notes: 'Biopsy confirmed lung adenocarcinoma. Referred to MDT for surgical planning.' },
      { date: '2026-07-29', type: 'followup', facility: 'Shanghai United Family Hospital', department: 'Thoracic Surgery MDT', physician: 'Dr. Wang Wei', chiefComplaint: 'MDT — RUL adenocarcinoma.', diagnosis: 'MDT consensus: VATS RUL lobectomy + mediastinal LN sampling.', notes: 'MDT decision: surgical resection indicated. PFT adequate for lobectomy. Pre-operative workup initiated.' },
      { date: '2026-08-06', type: 'surgery', facility: 'Shanghai United Family Hospital', department: 'Thoracic Surgery', physician: 'Dr. Wang Wei', chiefComplaint: 'VATS RUL lobectomy.', diagnosis: 'VATS RUL lobectomy + mediastinal LN sampling. Frozen section: clear margins.', procedures: 'VATS RUL lobectomy + systematic mediastinal LN sampling. 3-port technique.', notes: 'Procedure uncomplicated. Chest tube ×1. EBL minimal.' },
      { date: '2026-08-13', type: 'discharge', facility: 'Shanghai United Family Hospital', department: 'Thoracic Surgery', physician: 'Dr. Wang Wei', chiefComplaint: 'POD 7 — discharge for HaH.', diagnosis: 'Post-VATS RUL lobectomy Day 7. Persistent air leak (POD 1-5) — resolved. Chest tube removed POD 6. Wound clean. Final pathology pending.', labs: 'Final surgical pathology + molecular testing (EGFR/ALK/PD-L1) pending.', notes: 'Delayed discharge due to persistent air leak (resolved). HaH enrolment. Community nurse POD 8. Analgesia: Tramadol 50mg PO q6h PRN. Perindopril 4mg + Atorvastatin 20mg. Cough diary. IS target. Smoking cessation ×3w. 2-week thoracic clinic.' },
    ],
    aiSummary: '张建国，58岁男性，右上肺腺癌（活检确诊）VATS肺叶切除术后，延迟出院（POD 7，POD 5漏气已止）。最终病理待出。合并高血压（培哚普利 — 咳嗽待评估）和高脂血症（阿托伐他汀）。AI评估：1. NEWS低危（1-2分）— 胸外科术后，生命体征稳定；2. 伤口愈合（3个VATS切口）— 监测POD 7-14窗口期SSI；3. 呼吸 — 漏气已止但复发监测至关重要；4. VTE中度风险 — 早期活动+踝泵运动；5. 多模式镇痛目标疼痛VAS≤3；6. 培哚普利咳嗽日记 — 可能需换ARB待定；7. 戒烟持续维持中；8. 最终病理待出 — 将决定辅助治疗路径。',
  },
};
