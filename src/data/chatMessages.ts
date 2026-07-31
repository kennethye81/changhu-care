import { generateNewPatientChats } from './newPatients/chatExtras';
import { FAMILY_SENDER_BY_PATIENT } from './chatFamily';
import { PATIENTS_FULL } from './patients';
import {
  formatNewsChatLine,
  formatP7BaselineChat,
  formatP7EscalationChat,
} from '../utils/medicalHistoryNews';

export type ChatMessage = {
  id: number;
  from: 'doctor' | 'nurse' | 'caseManager' | 'family' | 'ai' | 'system';
  senderName: string;
  text: string;
  time: string;
  patientId: number;
};

const CHAT_FROM_ALIASES: Record<string, ChatMessage['from']> = {
  doctor: 'doctor',
  nurse: 'nurse',
  casemanager: 'caseManager',
  case_manager: 'caseManager',
  family: 'family',
  ai: 'ai',
  system: 'system',
};

/** Coerce legacy / smoke-test payloads into ChatMessage shape. */
export function normalizeChatMessage(
  raw: Partial<ChatMessage> & Record<string, unknown>,
  fallbackPatientId = 7,
): ChatMessage {
  const legacy = raw as { sender?: string; role?: string };
  const fromKey = String(raw.from ?? legacy.role ?? 'system').toLowerCase().replace(/\s+/g, '');
  const from = CHAT_FROM_ALIASES[fromKey] ?? 'system';
  return {
    id: typeof raw.id === 'number' ? raw.id : Date.now(),
    from,
    senderName: String(raw.senderName ?? legacy.sender ?? 'Care Team'),
    text: String(raw.text ?? ''),
    time: String(raw.time ?? '—'),
    patientId: typeof raw.patientId === 'number' ? raw.patientId : fallbackPatientId,
  };
}

function patientDiagnosis(patientId: number): string {
  return PATIENTS_FULL.find(p => p.id === patientId)?.diagnosis ?? '';
}

// ── Generate realistic chat messages for all patients ──
export function generateP7Chats(alertMode: boolean): ChatMessage[] {
  if (alertMode) return [
    { id: 7001, from: 'ai', senderName: '🤖 iHomeCare AI', text: `🚨 ${formatP7EscalationChat('Chan Tai Ming')}`, time: '14:32', patientId: 7 },
    { id: 7002, from: 'nurse', senderName: 'Jenny Tam (RN)', text: 'RED ALERT acknowledged. En route for urgent assessment. Will perform POCT CRP/PCT on arrival. O₂ 2L/min initiated via concentrator.', time: '14:34', patientId: 7 },
    { id: 7003, from: 'family', senderName: 'Mrs. Chan (Chan Siu Ling)', text: 'His SpO₂ dropped to 90% just now — I started the O₂ concentrator. He is confused and keeps asking for water. Please come quickly.', time: '14:35', patientId: 7 },
    { id: 7004, from: 'doctor', senderName: 'Dr. Lee Mei Ling (Respiratory)', text: 'Noted. Start IV Ceftriaxone 2g if not already given. Send blood cultures ×2 + sputum C&S. I will review within 30 minutes. Monitor AVPU/AMTS q1h.', time: '14:36', patientId: 7 },
    { id: 7005, from: 'caseManager', senderName: 'Grace Tang (Case Manager)', text: 'Spoke with Mrs. Chan — she is anxious but calm, monitoring SpO₂ at bedside. Daughter Emily en route. POCT kit ready.', time: '14:38', patientId: 7 },
    { id: 7006, from: 'family', senderName: 'Mrs. Chan (Chan Siu Ling)', text: 'Thank you Dr. Lee. Temp now 38.3°C. I logged vitals in the app — should I give paracetamol?', time: '14:39', patientId: 7 },
    { id: 7007, from: 'ai', senderName: '🤖 iHomeCare AI', text: `📋 Action Plan: 1. Nurse Call ✓ → 2. Urgent Assessment (in progress) → 3. POCT CRP/PCT (pending) → 4. Doctor Review (Dr. Lee Mei Ling). ${formatP7EscalationChat('Vitals on file')}`, time: '14:40', patientId: 7 },
  ];
  return [
    { id: 7101, from: 'ai', senderName: '🤖 iHomeCare AI', text: `📊 Daily Summary: Chan Tai Ming — HaH Day 1. ${formatP7BaselineChat('Initial RN assessment completed. AMTS 10/10')}`, time: '09:30', patientId: 7 },
    { id: 7102, from: 'nurse', senderName: 'Jenny Tam (RN)', text: 'Initial HaH visit done — baseline vitals recorded, wife trained on SpO₂/BP monitoring and escalation protocol.', time: '09:35', patientId: 7 },
    { id: 7103, from: 'doctor', senderName: 'Dr. Lee Mei Ling (Respiratory)', text: 'Day 1 plan confirmed. Continue CAP protocol — IV Ceftriaxone from Day 2 per C&S. Tiotropium 18mcg daily for COPD maintenance.', time: '09:38', patientId: 7 },
    { id: 7104, from: 'family', senderName: 'Mrs. Chan (Chan Siu Ling)', text: 'Thank you Dr. Lee. Monitoring log ready, grab bars installed. Honestly I was terrified leaving hospital — but seeing his SpO₂ stable helps me breathe too.', time: '09:42', patientId: 7 },
    { id: 7105, from: 'caseManager', senderName: 'Grace Tang (Case Manager)', text: 'HaH Day 1 intake complete. Family self-monitoring protocol reinforced. BID RN visits scheduled per triage.', time: '09:45', patientId: 7 },
  ];
}

export function generateChats(patientId: number): ChatMessage[] {
  if (patientId >= 8 && patientId <= 17) return generateNewPatientChats(patientId);
  const familyName = FAMILY_SENDER_BY_PATIENT[patientId] ?? 'Family Member';
  let id = patientId * 100;
  const msg = (from: ChatMessage['from'], senderName: string, text: string, time: string): ChatMessage =>
    ({ id: id++, from, senderName, text, time, patientId });

  if (patientId === 1) return [
    msg('system', 'System', 'Care team assigned for Cheung Wai Man: Dr. Chan Chi Keung (Cardiology), Sarah Leung (RN), Peter Ho (Case Manager)', '06/16 09:00'),
    msg('caseManager', 'Peter Ho (Case Manager)', 'Good morning Mrs. Cheung. HaH activated for Mr. Cheung\'s heart failure. Today we start IV Furosemide BID at home — Sarah will establish IV access and teach you the weight/fluid log.', '06/16 09:15'),
    msg('family', familyName, 'Thank you Peter. He was discharged from HK Sanatorium yesterday still a bit breathless. I\'m nervous about the IV at home — is that safe?', '06/16 09:18'),
    msg('nurse', 'Sarah Leung (RN)', 'Completely safe — same Baxter pump protocol as inpatient. I\'ll check orthostatic BP before and after each infusion. Please have his morning GDMT ready; we weigh him before the first dose.', '06/16 09:25'),
    msg('doctor', 'Dr. Chan Chi Keung', 'Mrs. Cheung — dry weight target 67–68 kg. Report gain >1 kg in 24 h immediately. Continue Entresto, Bisoprolol, Spironolactone, Apixaban. IV diuresis until net negative balance, then PO switch.', '06/16 09:32'),
    msg('nurse', 'Sarah Leung (RN)', 'Day 1 AM visit done. Weight 68.5 kg. IV Furosemide 60 mg over 15 min tolerated. Post-infusion BP 118/72 — no dizziness. UO monitor connected. You demonstrated IV site check correctly.', '06/16 11:00'),
    msg('family', familyName, 'He slept flat last night — first time in a week! I logged 1,380 mL intake and 1,650 mL output. Is that good?', '06/17 08:30'),
    msg('nurse', 'Sarah Leung (RN)', 'Excellent — net negative ~270 mL is exactly what we want. Weight this morning 68.0 kg (↓0.5). Pedal oedema trace only. Continue fluid cap 1.5 L — use the marked bottle.', '06/17 11:45'),
    msg('ai', '🤖 iHomeCare AI', formatNewsChatLine(1, patientDiagnosis(1), 'Weight trend ↓0.7 kg/48 h. BNP 850 (↓ from 2,200). GDMT adherence 94%. No escalation triggers'), '06/18 08:00'),
    msg('doctor', 'Dr. Chan Chi Keung', 'Renal panel stable — Cr 138, K⁺ 3.9. Continue current regimen. Mrs. Cheung, your I/O log is outstanding. Call us if orthopnoea returns.', '06/18 12:10'),
    msg('family', familyName, 'He walked to the living room twice today without stopping. Appetite is back — he even asked for rice instead of congee!', '06/18 12:15'),
    msg('caseManager', 'Peter Ho (Case Manager)', 'Week 1 summary: 6 RN visits, GDMT 94%, weight 68.0 kg, zero HF alerts. Cardiac rehab with David Chan starts Monday.', '06/22 16:00'),
    msg('family', familyName, 'He wants everyone to know he hit 1,200 steps today — his best since admission. Thank you for not sending him back to hospital.', '06/22 16:30'),
  ];

  if (patientId === 2) return [
    msg('system', 'System', 'Care team assigned for Wong Chi Ming: Dr. Lee Mei Ling (Respiratory), Jenny Tam (RN), Grace Tang (Case Manager)', '06/17 09:00'),
    msg('caseManager', 'Grace Tang (Case Manager)', 'Mrs. Wong, welcome home. COPD GOLD 3 exacerbation plan: finish Prednisolone taper, daily SpO₂ checks, O₂ prn if <90%, pulmonary rehab Tue/Thu.', '06/17 09:10'),
    msg('family', familyName, 'Thank you Grace. Mum is less wheezy but she\'s scared of running out of breath. She forgot her evening Stiolto dose twice this week.', '06/17 09:14'),
    msg('nurse', 'Jenny Tam (RN)', 'I\'ll bring a reminder chart and re-check Respimat technique today. Pursed-lip breathing during activity — stop if SpO₂ <88%. Prednisolone 30 mg today (taper day 2).', '06/17 09:22'),
    msg('doctor', 'Dr. Lee Mei Ling', 'SpO₂ 92% at rest is acceptable for GOLD 3. Complete steroid taper — do not stop early. Daughter, watch for increased purulent sputum or confusion — that triggers our exacerbation protocol.', '06/17 09:30'),
    msg('nurse', 'Jenny Tam (RN)', 'Visit 06/18: SpO₂ 93% rest, 89% after 50 m walk — expected in GOLD 3. Wheeze mild. Inhaler technique corrected. O₂ concentrator flow verified at 2 L/min.', '06/18 14:00'),
    msg('family', familyName, 'She used pursed-lip breathing when climbing one flight — it helped! Only needed rescue inhaler once. Mum is less anxious now.', '06/19 10:00'),
    msg('nurse', 'Jenny Tam (RN)', 'That\'s exactly the goal. Prednisolone 20 mg today. Has she had any night sweats or fever?', '06/19 10:05'),
    msg('family', familyName, 'No fever. Sleep better last two nights. She wants to know when rehab starts — she\'s actually looking forward to it.', '06/19 10:10'),
    msg('ai', '🤖 iHomeCare AI', formatNewsChatLine(2, patientDiagnosis(2), 'COPD Day 3: SpO₂ avg 93.1%. Steroid taper on schedule. No overnight desaturation'), '06/20 08:00'),
    msg('doctor', 'Dr. Lee Mei Ling', 'Good progress. Pulmonary rehab starts Monday at Prince of Wales — Raymond Wong will lead. Flu vaccine due in clinic — remind her.', '06/20 11:00'),
    msg('caseManager', 'Grace Tang (Case Manager)', 'Rehab transport confirmed. Week 1: inhaler adherence 95%, O₂ safety checklist signed, zero ED triggers.', '06/23 16:00'),
    msg('family', familyName, 'Mum said she hasn\'t felt this clear in her chest for months. We\'re so grateful — please tell Dr. Lee.', '06/23 16:30'),
  ];

  if (patientId === 3) return [
    msg('system', 'System', 'Care team assigned for Lam Ka Chun: Dr. Cheung Kwok Wai (Infectious Disease), Connie Cheung (RN), Anna Leung (Case Manager)', '06/16 09:00'),
    msg('caseManager', 'Anna Leung (Case Manager)', 'Lam sir — CAP home antibiotics started. Critical: penicillin anaphylaxis on record — Levofloxacin only. Complete all 7 days even if you feel 100%.', '06/16 09:12'),
    msg('family', familyName, 'Thank you Anna. He\'s much better but still tired. We have the allergy alert card on the fridge.', '06/16 09:18'),
    msg('nurse', 'Connie Cheung (RN)', 'Day 1 visit: Temp 37.0, SpO₂ 96%, RR 18. Levofloxacin 750 mg taken — no GI upset. RLL crackles improving. Return precautions reviewed: fever, worsening SOB, pleuritic pain → call us.', '06/17 11:00'),
    msg('doctor', 'Dr. Cheung Kwok Wai', 'Afebrile ×48 h, CRP 28 (↓ from 156). Two more days Levofloxacin. Avoid strenuous exercise ×2 weeks. Desk work from home OK from Day 7.', '06/18 12:00'),
    msg('family', familyName, 'Temp 36.8 this morning. Cough almost gone. He wants to jog again — too soon?', '06/19 09:00'),
    msg('nurse', 'Connie Cheung (RN)', 'Wait until course complete + 48 h afebrile, then gradual return. Light walking only first week. Tendon pain on Levofloxacin — report immediately (rare but serious).', '06/19 09:10'),
    msg('ai', '🤖 iHomeCare AI', formatNewsChatLine(3, patientDiagnosis(3), 'CAP Day 4: Temp stable. SpO₂ 97%. Antibiotic day 5/7 — adherence 100%'), '06/19 18:00'),
    msg('family', familyName, 'Feeling 80% back to normal. Thank you — we were worried with the penicillin allergy.', '06/20 14:00'),
    msg('doctor', 'Dr. Cheung Kwok Wai', 'Excellent response. Finish Days 6–7 Levofloxacin. Repeat CXR Week 4. No beta-lactams ever — allergy band and app alert active.', '06/20 14:15'),
    msg('caseManager', 'Anna Leung (Case Manager)', 'HaH Day 5 complete. Zero complications. Discharge assessment Day 7 scheduled.', '06/21 16:00'),
  ];

  if (patientId === 4) return [
    msg('system', 'System', 'Care team assigned for Lau Suk Yee: Dr. Chan Chi Keung (Internal Medicine), Vivian Lau (RN), Tony Lam (Case Manager)', '06/19 09:00'),
    msg('caseManager', 'Tony Lam (Case Manager)', 'Mrs. Lau\'s complicated UTI plan: IV Ciprofloxacin BID ×7 days, AMTS qshift, strict I/O. Son is primary caregiver — we\'ll train you on cognition checks.', '06/19 09:10'),
    msg('family', familyName, 'Mother was confused in hospital — much clearer today. I\'m staying overnight. When do IV antibiotics finish?', '06/19 09:15'),
    msg('nurse', 'Vivian Lau (RN)', 'AM visit Day 1: AMTS 8/10 (improving). IV Cipro 400 mg over 60 min tolerated. Pre-IV BP 142/86 → post 136/82. I/O chart started. Fall precautions — Morse 35, assist all ambulation.', '06/19 09:30'),
    msg('doctor', 'Dr. Chan Chi Keung', 'Confusion was infection-related delirium — resolving. Monitor QT if HR >100 on Cipro. Repeat urine culture 1 week post-treatment. Hydration 1.5 L/day — CKD adjusted.', '06/19 12:00'),
    msg('family', familyName, 'AMTS 10/10 this evening! She remembered all three words. Frequency much better. No dysuria.', '06/20 18:30'),
    msg('nurse', 'Vivian Lau (RN)', 'PM visit: AMTS 10/10 confirmed. IV site patent. Bowel formed — no diarrhoea (C. diff watch). Post-IV BP 130/76. You\'re doing excellent caregiving.', '06/20 18:45'),
    msg('ai', '🤖 iHomeCare AI', formatNewsChatLine(4, patientDiagnosis(4), 'UTI Day 2: AMTS 10/10. Temp 36.5. UO adequate. No fall events'), '06/20 20:00'),
    msg('family', familyName, 'She walked to kitchen with walker — steady. Should we switch to oral soon?', '06/21 09:00'),
    msg('doctor', 'Dr. Chan Chi Keung', 'If afebrile ×72 h and AMTS stable, PO Cipro switch Day 4 per protocol. Continue I/O until course complete.', '06/21 09:15'),
    msg('caseManager', 'Tony Lam (Case Manager)', 'Week 1 on track. Cognition restored. IV→PO transition planned Day 4. Nephrology F/U in 4 weeks.', '06/22 14:00'),
  ];

  if (patientId === 5) return [
    msg('system', 'System', 'Care team assigned for Ho Tai Wai: Dr. Lee Mei Ling (Internal Medicine), Angela Ng (RN), Grace Tang (Case Manager)', '06/19 08:00'),
    msg('caseManager', 'Grace Tang (Case Manager)', 'Ho sir\'s cellulitis plan: IV Clindamycin q6h, daily wound photos, leg elevation 6 h/day. Diabetic foot check every visit — report spreading redness immediately.', '06/19 08:10'),
    msg('family', familyName, 'Thank you Grace. His leg looks less red. He\'s frustrated sitting with leg up all day — normal?', '06/19 08:15'),
    msg('nurse', 'Angela Ng (RN)', 'Day 1 IV: Erythema 15 cm (↓ from 25 cm admission). Pain 2/10. Clindamycin 600 mg over 30 min ×5 today — all tolerated. Cap glucose 7.8. Wound photo uploaded to MolecuLight log.', '06/19 08:30'),
    msg('doctor', 'Dr. Lee Mei Ling', 'Good response. Mark erythema margins BID. C. diff risk on Clindamycin — >3 loose stools/day, hold antibiotic and call. PO switch Day 5 if afebrile + CRP <20.', '06/19 12:00'),
    msg('family', familyName, 'Erythema 10 cm today per your marker. Pain almost gone. He walked to bathroom alone — OK?', '06/20 14:00'),
    msg('nurse', 'Angela Ng (RN)', 'Short distances OK with leg elevated between. Erythema 10 cm stable. Cap gluc 8.2 — infection stress can raise sugars; continue Metformin. No diarrhoea — good.', '06/20 14:15'),
    msg('ai', '🤖 iHomeCare AI', formatNewsChatLine(5, patientDiagnosis(5), 'Cellulitis Day 2: Erythema ↓60% from admission. Temp 36.6. WBC trending down'), '06/20 18:00'),
    msg('family', familyName, 'Wound photo looks better every day. Wife doing dressing change like you taught — no bleeding.', '06/21 10:00'),
    msg('doctor', 'Dr. Lee Mei Ling', 'Erythema 12→10 cm — continue course. Eric Chan PT tomorrow for mobility with elevation breaks. HbA1c optimisation after infection resolves.', '06/21 10:30'),
    msg('caseManager', 'Grace Tang (Case Manager)', 'IV day 3 complete. Zero necrotising signs. Family engagement excellent.', '06/22 16:00'),
  ];

  if (patientId === 6) return [
    msg('system', 'System', 'Care team assigned for Ng Siu Wan: Dr. Cheung Kwok Wai (Internal Medicine), Sarah Leung (RN), Anna Leung (Case Manager)', '06/19 09:00'),
    msg('caseManager', 'Anna Leung (Case Manager)', 'Mrs. Ng — DVT home anticoagulation started. Daily INR via CoaguChek until stable ×3 days. Compression stockings ≥12 h/day. Daughter in same building — ideal support.', '06/19 09:10'),
    msg('family', familyName, 'Mum\'s leg swelling improved. INR was 2.3 yesterday — nurse said slightly high. Is she OK?', '06/19 09:15'),
    msg('nurse', 'Sarah Leung (RN)', 'INR 2.3 — held Warfarin one dose per protocol, recheck today. Calf 39 cm (↓ from 41). Compression stockings fitted Class II. Pill box alarm set for 6 PM daily.', '06/19 09:30'),
    msg('doctor', 'Dr. Cheung Kwok Wai', 'Bridging complete — LMWH stopped. Target INR 2.0–3.0. Consistent vitamin K intake — don\'t suddenly change leafy greens. No NSAIDs — paracetamol only.', '06/19 12:00'),
    msg('family', familyName, 'INR 2.1 today — in range! No bleeding, no bruising. She asks if she can ride the bus to market.', '06/20 08:30'),
    msg('nurse', 'Sarah Leung (RN)', 'INR 2.1 therapeutic. Ambulation encouraged — early walking helps DVT recovery. Avoid prolonged standing. Report chest pain or sudden SOB immediately (PE watch).', '06/20 08:45'),
    msg('ai', '🤖 iHomeCare AI', formatNewsChatLine(6, patientDiagnosis(6), 'DVT Day 2: INR 2.1 in range. Calf ↓2 cm. Compression compliance 18 h'), '06/20 18:00'),
    msg('family', familyName, 'She\'s less anxious now the numbers make sense. Food diary helps — same vegetables daily.', '06/21 11:00'),
    msg('doctor', 'Dr. Cheung Kwok Wai', 'Stable — continue Warfarin 5 mg. Doppler US at 3 months. Anticoagulation card in wallet — done.', '06/21 11:15'),
    msg('caseManager', 'Anna Leung (Case Manager)', 'Week 1: INR in range, zero bleeding events, stocking compliance good. Michael Kwok PT for gait Friday.', '06/22 16:00'),
  ];

  if (patientId === 18) return [
    msg('system', 'System', 'Care team assigned for Zhang Jianguo: Dr. Wang Wei (Thoracic Surgeon), Jenny Tam (RN), Grace Tang (Case Manager), Raymond Wong (PT)', '06/29 09:00'),
    msg('caseManager', 'Grace Tang (Case Manager)', 'Mr. Zhang — HaH activated post-VATS RUL lobectomy. Discharged POD7 after air leak resolved. RN Jenny visits q2d for wound + respiratory assessment. PT pulmonary rehab 2×/wk. Incentive spirometry q2h while awake.', '06/29 09:15'),
    msg('family', familyName, 'Thank you Grace. We are home now. His pain is about 3/10 — manageable with Tramadol. I am keeping the cough diary per Dr. Wang. When will final pathology come back?', '06/29 09:20'),
    msg('nurse', 'Jenny Tam (RN)', 'Initial HaH visit: wound clean — all 3 ports intact, no erythema. SpO₂ 96% RA, IS 900mL. Pain VAS 3/10. Perindopril continuing — record cough frequency in diary. Wife demonstrated correct wound inspection + VTE warning signs.', '06/30 09:00'),
    msg('doctor', 'Dr. Wang Wei (Thoracic Surgeon)', 'PDD2 review. IS improving (950mL). Wound clean. Cough dry — 2-3 episodes/day. Continue Perindopril 4mg + Atorvastatin 20mg. Tramadol 50mg PRN — reduce as pain allows. Final pathology + molecular testing pending — results by next week. No air leak recurrence — excellent.', '07/01 15:00'),
    msg('family', familyName, 'He walked 100m indoors today — SpO₂ stayed 97%! IS up to 1100mL. Tramadol only once yesterday. Cough diary shows 2-3 dry coughs per day — is that from Perindopril or post-op?', '07/02 18:00'),
    msg('nurse', 'Jenny Tam (RN)', 'PDD3 assessment: wound healing well, no SSI signs. SpO₂ 97% — no desaturation with 100m walk. IS 1100mL (↑). Pain VAS 2 — Tramadol decreasing. Cough stable — thoracic team evaluating Perindopril vs post-op etiology. Weight 66.5kg stable.', '07/03 09:15'),
    msg('ai', '🤖 iHomeCare AI', formatNewsChatLine(18, patientDiagnosis(18), 'Post-VATS Day 10: SpO₂ 97%. Wound clean. Pain VAS 2. IS 1100mL. No air leak recurrence. VTE: negative'), '07/04 08:00'),
    msg('doctor', 'Dr. Wang Wei (Thoracic Surgeon)', 'PDD5 assessment — wound all 3 ports healing well. IS now 1200mL. Cough dry, 1-2/day — likely post-operative, not drug-related. Continue monitoring. Smoking cessation ×5 weeks — zero relapse. Recommend continued walking 3-5min ×3/day.', '07/05 09:30'),
    msg('family', familyName, 'He did 3 walks today without stopping! No shortness of breath. Doctor said cough is probably from the surgery itself — that helps us worry less about the Perindopril. Thank you for everything.', '07/06 18:30'),
    msg('caseManager', 'Grace Tang (Case Manager)', 'Week 1 summary: 3 RN visits, wound healing on track, IS 900→1200mL, pain 3→2/10, no VTE, smoking cessation maintained. PT Raymond Wong continues 2×/wk. 2-week thoracic clinic follow-up confirmed. Awaiting final pathology — Grace will coordinate oncology if indicated per MDT.', '07/08 16:00'),
  ];

  return [];
}

export function buildInitialMessagesByPatient(p7AlertActive: boolean): Record<number, ChatMessage[]> {
  const messages: Record<number, ChatMessage[]> = {};
  for (let i = 1; i <= 18; i++) {
    messages[i] = i === 7 ? generateP7Chats(p7AlertActive) : generateChats(i);
  }
  return messages;
}
