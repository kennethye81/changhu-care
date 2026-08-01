// === Care Team Member Profiles ===

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  gender: string;
  age: number;
  yearsExperience: number;
  specialty: string;
  certifications: string[];
  institution: string;
  education: string;
  bio: string;
  avatar: string;
  registrationNo?: string;
}

export const CARE_TEAM: Record<string, TeamMember> = {
  'Dr. Chan Chi Keung': {
    id: 'D001', name: 'Dr. Chan Chi Keung', role: 'Cardiologist / Internal Medicine', gender: 'Male', age: 46,
    yearsExperience: 20, specialty: 'Interventional Cardiology & Heart Failure Management',
    certifications: ['FRCP (Cardiology)', 'FHKAM', 'Fellowship in Interventional Cardiology (Mayo Clinic)', 'Advanced Cardiac Life Support Instructor'],
    institution: 'HK Sanatorium & Hospital',
    education: 'MBBS (HKU), MD (Cardiology, CUHK), Fellowship in Interventional Cardiology (Mayo Clinic, USA)',
    bio: 'Dr. Chan Chi Keung is a consultant cardiologist at HK Sanatorium & Hospital with 20 years of experience in interventional cardiology and heart failure management. He leads the HaH cardiac programme, overseeing CHF and complex medical patients in the community. His expertise includes GDMT optimisation, remote haemodynamic monitoring, and prevention of heart failure decompensation through NEWS2-guided home monitoring.',
    avatar: '/avatars/dr-chan-chi-keung.png',
    registrationNo: 'M08765',
  },
  'Dr. Lee Mei Ling': {
    id: 'D002', name: 'Dr. Lee Mei Ling', role: 'Respiratory Physician / Internal Medicine', gender: 'Female', age: 42,
    yearsExperience: 16, specialty: 'Respiratory Medicine & General Internal Medicine',
    certifications: ['FRCP (Respiratory Medicine)', 'FHKAM', 'Diploma in Tropical Medicine & Hygiene', 'Certified COPD Educator'],
    institution: 'Queen Mary Hospital',
    education: 'MBBS (CUHK), MD (Respiratory Medicine, HKU), Fellowship in Respiratory Medicine (Royal Brompton, UK)',
    bio: 'Dr. Lee Mei Ling is a consultant respiratory physician at Queen Mary Hospital with 16 years of clinical experience. She specialises in COPD management, pulmonary rehabilitation, and acute respiratory infections. As the HaH respiratory lead, she oversees COPD and respiratory infection patients transitioning from hospital to home, with a focus on exacerbation prevention and LTOT assessment.',
    avatar: '/avatars/dr-lee-mei-ling.png',
    registrationNo: 'M09234',
  },
  'Dr. Cheung Kwok Wai': {
    id: 'D003', name: 'Dr. Cheung Kwok Wai', role: 'Infectious Disease / Internal Medicine', gender: 'Male', age: 50,
    yearsExperience: 24, specialty: 'Infectious Disease & General Internal Medicine',
    certifications: ['FRCP (Infectious Disease)', 'FHKAM', 'Diploma in Tropical Medicine & Hygiene', 'Antimicrobial Stewardship Lead'],
    institution: 'Gleneagles Hospital',
    education: 'MBBS (HKU), MD (Infectious Disease, CUHK), Fellowship in Infectious Disease (Royal Free Hospital, UK)',
    bio: 'Dr. Cheung Kwok Wai is a consultant in infectious disease and internal medicine at Gleneagles Hospital with 24 years of experience. He specialises in managing complex infections including CAP, UTI, cellulitis, and DVT in the HaH setting. He leads the antimicrobial stewardship programme and has extensive experience in outpatient parenteral antimicrobial therapy (OPAT) and IV-to-oral switch protocols.',
    avatar: '/avatars/dr-cheung-kwok-wai.png',
    registrationNo: 'M10567',
  },

  'Dr. Wang Wei': {
    id: 'D004', name: 'Dr. Wang Wei', role: 'Thoracic Surgeon', gender: 'Male', age: 45,
    yearsExperience: 18, specialty: 'Thoracic Surgery · VATS Lobectomy · Lung Cancer Surgery',
    certifications: ['FRCS (Cardiothoracic)', 'FHKAM', 'Fellowship in Thoracic Oncology (MSKCC)', 'Advanced Trauma Life Support Instructor'],
    institution: 'Shanghai United Family Hospital',
    education: 'MBBS (Fudan University), MD (Cardiothoracic Surgery, Peking Union Medical College), Fellowship in Thoracic Surgical Oncology (MSKCC, New York)',
    bio: 'Dr. Wang Wei is an attending thoracic surgeon at Shanghai United Family Hospital with 18 years of experience in minimally invasive thoracic surgery. He specialises in VATS lobectomy, segmentectomy, and complex mediastinal procedures. As the primary surgeon for Mr. Zhang, he performed the RUL VATS lobectomy and directs the post-operative recovery plan including wound surveillance, air leak monitoring, pain management, chest physiotherapy progression, and VTE prophylaxis. He co-chairs the hospital\'s Lung Nodule MDT and leads the ERAS thoracic pathway.',
    avatar: '/avatars/dr-wang-wei.png',
    registrationNo: 'M21045',
  },

  'Maggie Lam': {
    id: 'N004', name: 'Maggie Lam', role: 'Advanced Practice Nurse (APN) — Nursing Director', gender: 'Female', age: 48,
    yearsExperience: 25, specialty: 'Respiratory Home Care, POCT, IV Therapy & NEWS Escalation',
    certifications: ['Registered Nurse (HKNC)', 'Advanced Practice Nurse (Nursing Council of HK)', 'ACLS Instructor', 'Certified Respiratory Educator', 'Infection Control Certificate (HA)', 'POCT Programme Lead'],
    institution: 'Prince of Wales Hospital · iHomeCare Respiratory Programme',
    education: 'BNurs (HKU), MSc Advanced Nursing Practice (CUHK), Post-grad Diploma in Infection Control (PolyU)',
    bio: 'Maggie Lam is an Advanced Practice Nurse with 25 years of respiratory care experience. Formerly the Respiratory APN at Prince of Wales Hospital, she specialises in COPD home care programmes, POCT training and quality assurance, IV antibiotic management, and early infection recognition with NEWS2 escalation protocols. As iHomeCare Nursing Director, she oversees clinical quality for high-intensity HaH cases (>4h/day RN), supervises the home nursing team, and coordinates directly with respiratory physicians for complex respiratory and infection cases.',
    avatar: '/avatars/maggie-lam.png', registrationNo: 'RN145678',
  },

  'Sarah Leung': {
    id: 'N001', name: 'Sarah Leung', role: 'Senior Home Care Nurse (RN)', gender: 'Female', age: 34,
    yearsExperience: 12, specialty: 'Cardiac & Post-Surgical Home Care',
    certifications: ['Registered Nurse (HKNC)', 'BLS Instructor', 'Wound Care Certified', 'Certified Diabetes Educator', 'Palliative Care Certificate'],
    institution: 'HK Sanatorium & Hospital Home Care Services',
    education: 'BNurs (PolyU), MSc in Clinical Nursing (CUHK)',
    bio: 'Sarah Leung is the lead home care nurse for iHomeCare, managing all 6 patients in the Hospital-at-Home programme. She specialises in IV therapy administration, heart failure monitoring, wound care management, and medication compliance. Sarah is the primary point of contact for patients and coordinates with physicians, therapists, and care workers.',
    avatar: '/avatars/sarah-leung.png', registrationNo: 'RN187543',
  },
  'Peter Ho (Case Manager)': {
    id: 'C001', name: 'Peter Ho', role: 'Senior Case Manager', gender: 'Male', age: 40,
    yearsExperience: 15, specialty: 'Patient Care Coordination & Service Operations',
    certifications: ['Certified Case Manager (CCM)', 'Healthcare Management Diploma', 'Six Sigma Green Belt'],
    institution: 'iHomeCare Operations Centre',
    education: 'BSc Health Services Management (PolyU), MBA (HKUST)',
    bio: 'Peter Ho is the Case Manager for all iHomeCare patients, responsible for patient onboarding, service package matching, care team coordination, and patient progress tracking. He serves as the bridge between patients, families, physicians, and the care delivery team, ensuring seamless service delivery and timely interventions.',
    avatar: '/avatars/peter-ho.png',
  },
  'David Chan': {
    id: 'R001', name: 'David Chan', role: 'Senior Rehabilitation Therapist', gender: 'Male',age: 38,
    yearsExperience: 14, specialty: 'Cardiac Rehab, Pulmonary Rehab & Neuro Rehab',
    certifications: ['Registered Physiotherapist (HKPA)', 'Certified Cardiac Rehab Specialist (AACVPR)', 'Neuro Rehab Certificate (IBITA)', 'Bobath Concept Trained'],
    institution: 'HK Sanatorium & Hospital Rehabilitation Centre',
    education: 'BSc Physiotherapy (PolyU), MSc Sports Medicine & Health Science (CUHK)',
    bio: 'David Chan is the lead rehabilitation therapist for iHomeCare. He specialises in cardiac rehabilitation (heart failure, post-MI), pulmonary rehabilitation (COPD), post-infectious recovery, and anticoagulation therapy mobility. David designs personalised exercise programmes for each patient and conducts supervised home-based therapy sessions.',
    avatar: '/avatars/david-chan.png', registrationNo: 'PT001234',
  },
  'May Wong': {
    id: 'CW001', name: 'May Wong', role: 'Senior Care Worker', gender: 'Female', age: 42,
    yearsExperience: 10, specialty: 'Post-Surgical Home Support & Meal Preparation',
    certifications: ['Health Care Assistant Certificate', 'First Aid Certified', 'Food Hygiene Certified'],
    institution: 'Kwong Wah Hospital · iHomeCare Home Support',
    education: 'Certificate in Health Care Assistance (VTC)',
    bio: 'May Wong is an experienced care worker who provides meal preparation, light housekeeping, and companionship for post-surgical patients.',
    avatar: '/avatars/may-wong.png', registrationNo: 'RN203456',
  },
  // Nurses
  'Jenny Tam': {
    id: 'N002', name: 'Jenny Tam', role: 'Home Care Nurse (RN)', gender: 'Female', age: 29,
    yearsExperience: 7, specialty: 'Geriatric & Post-Surgical Home Care',
    certifications: ['Registered Nurse (HKNC)', 'BLS Certified', 'Wound Care Certified'],
    institution: 'Tuen Mun Hospital · United Christian Hospital',
    education: 'BNurs (HKU)',
    bio: 'Jenny Tam is a dedicated home care nurse specializing in geriatric and post-surgical care.',
    avatar: '/avatars/jenny-tam.png', registrationNo: 'RN215678',
  },
  'Angela Ng': {
    id: 'N003', name: 'Angela Ng', role: 'Home Care Nurse (RN)', gender: 'Female', age: 35,
    yearsExperience: 11, specialty: 'Palliative & Oncology Home Care',
    certifications: ['Registered Nurse (HKNC)', 'Palliative Care Certified'],
    institution: '常州市第一人民医院',
    education: 'BNurs (CUHK), MSc Palliative Care (HKU)',
    bio: 'Angela Ng is a specialist palliative care nurse with over a decade of experience.',
    avatar: '/avatars/angela-ng.png', registrationNo: 'RN192345',
  },
  'Connie Cheung': {
    id: 'N004', name: 'Connie Cheung', role: 'Home Care Nurse (RN)', gender: 'Female', age: 42,
    yearsExperience: 18, specialty: 'Chronic Disease Management & Diabetic Care',
    certifications: ['Registered Nurse (HKNC)', 'Certified Diabetes Educator'],
    institution: 'Prince of Wales Hospital',
    education: 'BNurs (PolyU), MSc Clinical Nursing (HKU)',
    bio: 'Connie Cheung is a veteran home care nurse specializing in chronic disease management.',
    avatar: '/avatars/connie-cheung.png', registrationNo: 'RN178901',
  },
  'Vivian Lau': {
    id: 'N005', name: 'Vivian Lau', role: 'Home Care Nurse (RN)', gender: 'Female', age: 28,
    yearsExperience: 5, specialty: 'Post-Surgical & Wound Care',
    certifications: ['Registered Nurse (HKNC)', 'Wound Care Certified', 'BLS Instructor'],
    institution: 'Tuen Mun Hospital · United Christian Hospital',
    education: 'BNurs (HKU)',
    bio: 'Vivian Lau is a dedicated post-surgical care nurse with a passion for wound management.',
    avatar: '/avatars/vivian-lau.png', registrationNo: 'RN228901',
  },
  // Therapists
  'Michael Kwok': {
    id: 'R002', name: 'Michael Kwok', role: 'Rehab Therapist', gender: 'Male', age: 32,
    yearsExperience: 9, specialty: 'Orthopedic & Neurological Rehabilitation',
    certifications: ['Registered Physiotherapist (HKPA)', 'Certified Manual Therapist'],
    institution: 'PYNEH · Gleneagles Hospital',
    education: 'BSc Physiotherapy (PolyU), MSc Rehab Science (CUHK)',
    bio: 'Michael Kwok specializes in orthopedic and neurological rehabilitation.',
    avatar: '/avatars/michael-kwok.png', registrationNo: 'PT004567',
  },
  'Raymond Wong': {
    id: 'R003', name: 'Raymond Wong', role: 'Rehab Therapist', gender: 'Male', age: 45,
    yearsExperience: 20, specialty: 'Geriatric Rehabilitation & Fall Prevention',
    certifications: ['Registered Physiotherapist (HKPA)', 'Geriatric Certified Specialist'],
    institution: 'Kwong Wah Hospital · Queen Mary Hospital',
    education: 'BSc Physiotherapy (PolyU), MSc Gerontology (CUHK)',
    bio: 'Raymond Wong is a senior rehabilitation therapist with 20 years of experience in geriatric care.',
    avatar: '/avatars/raymond-wong.png', registrationNo: 'PT002345',
  },
  'Shirley Fong': {
    id: 'R004', name: 'Shirley Fong', role: 'Rehab Therapist', gender: 'Female', age: 31,
    yearsExperience: 8, specialty: "Women's Health & Post-Surgical Rehab",
    certifications: ['Registered Physiotherapist (HKPA)', "Women's Health Certified"],
    institution: '常州市第二人民医院',
    education: 'BSc Physiotherapy (PolyU), MSc Women\'s Health (CUHK)',
    bio: 'Shirley Fong specializes in women\'s health rehabilitation.',
    avatar: '/avatars/shirley-fong.png', registrationNo: 'PT005678',
  },
  'Eric Chan': {
    id: 'R005', name: 'Eric Chan', role: 'Rehab Therapist', gender: 'Male', age: 37,
    yearsExperience: 13, specialty: 'Sports Injury & Post-Operative Orthopedic Rehab',
    certifications: ['Registered Physiotherapist (HKPA)', 'Certified Strength & Conditioning Specialist'],
    institution: 'Gleneagles Hospital · St. Teresa\'s Hospital',
    education: 'BSc Physiotherapy (PolyU), MSc Sports Medicine (CUHK)',
    bio: 'Eric Chan is an orthopedic and sports rehabilitation specialist.',
    avatar: '/avatars/eric-chan.png', registrationNo: 'PT003456',
  },
  // Case Managers
  'Grace Tang': {
    id: 'CM001', name: 'Grace Tang', role: 'Case Manager (RN)', gender: 'Female', age: 40,
    yearsExperience: 12, specialty: 'Complex Care Coordination & Family Liaison',
    certifications: ['Registered Nurse (HKNC)', 'Certified Case Manager (CCM)'],
    institution: 'Queen Mary Hospital · iHomeCare Community Services',
    education: 'BNurs (HKU), MSc Health Services Management (PolyU)',
    bio: 'Grace Tang is a senior case manager with 12 years of clinical nursing experience.',
    avatar: '/avatars/grace-tang.png', registrationNo: 'RN195432',
  },
  'Tony Lam': {
    id: 'CM002', name: 'Tony Lam', role: 'Case Manager (RN)', gender: 'Male', age: 43,
    yearsExperience: 15, specialty: 'Chronic Disease Management & LTC Insurance Coordination',
    certifications: ['Registered Nurse (HKNC)', 'Certified Diabetes Educator'],
    institution: 'Prince of Wales Hospital · United Christian Hospital',
    education: 'BNurs (CUHK), MSc Clinical Gerontology (HKU)',
    bio: 'Tony Lam brings 15 years of nursing experience to his case manager role.',
    avatar: '/avatars/tony-lam.png', registrationNo: 'RN183210',
  },
  'Anna Leung': {
    id: 'CM003', name: 'Anna Leung', role: 'Case Manager (RN)', gender: 'Female', age: 38,
    yearsExperience: 10, specialty: 'Post-Surgical & Oncology Care Coordination',
    certifications: ['Registered Nurse (HKNC)', 'Oncology Nursing Certificate'],
    institution: 'HK Sanatorium & Hospital · St. Teresa\'s Hospital',
    education: 'BNurs (PolyU), MSc Nursing (HKU)',
    bio: 'Anna Leung is a dedicated case manager specializing in post-surgical recovery.',
    avatar: '/avatars/anna-leung.png', registrationNo: 'RN207654',
  },
  // Care Workers
  'Lisa Cheng': {
    id: 'CW002', name: 'Lisa Cheng', role: 'Home Care Worker', gender: 'Female', age: 38,
    yearsExperience: 8, specialty: 'Personal Care & Daily Living Assistance',
    certifications: ['Health Care Assistant (HCA)', 'First Aid Certified'],
    institution: 'St. Teresa\'s Hospital · iHomeCare Home Support',
    education: 'Certificate in Health Care Assistance (VTC)',
    bio: 'Lisa Cheng provides compassionate home support including personal hygiene and meal preparation.',
    avatar: '/avatars/lisa-cheng.png', registrationNo: 'HCA-2016-0312',
  },
  'Carol Ng': {
    id: 'CW003', name: 'Carol Ng', role: 'Home Care Worker', gender: 'Female', age: 45,
    yearsExperience: 8, specialty: 'Personal Care & Meal Preparation',
    certifications: ['Health Care Assistant (HCA)', 'First Aid Certified', 'Food Hygiene Certificate'],
    institution: 'Queen Mary Hospital · iHomeCare Home Support',
    education: 'Certificate in Health Care Assistance (VTC)',
    bio: 'Carol Ng is a compassionate care worker with 8 years of experience in home-based personal care.',
    avatar: '/avatars/carol-ng.png', registrationNo: 'HCA-2018-0423',
  },
  'Derek Ho': {
    id: 'CW004', name: 'Derek Ho', role: 'Home Care Worker', gender: 'Male', age: 32,
    yearsExperience: 5, specialty: 'Mobility Assistance & Companionship',
    certifications: ['Health Care Assistant (HCA)', 'First Aid Certified'],
    institution: 'Prince of Wales Hospital · iHomeCare Home Support',
    education: 'Certificate in Health Care Assistance (VTC)',
    bio: 'Derek Ho is a dedicated care worker specializing in mobility assistance and companionship.',
    avatar: '/avatars/derek-ho.png', registrationNo: 'HCA-2021-0156',
  },
  'Fanny Yip': {
    id: 'CW005', name: 'Fanny Yip', role: 'Home Care Worker', gender: 'Female', age: 50,
    yearsExperience: 12, specialty: 'Housekeeping & Daily Living Support',
    certifications: ['Health Care Assistant (HCA)', 'First Aid Certified', 'Dementia Care Trained'],
    institution: 'United Christian Hospital · iHomeCare Home Support',
    education: 'Certificate in Health Care Assistance (VTC)',
    bio: 'Fanny Yip is an experienced care worker with 12 years of service in home care.',
    avatar: '/avatars/fanny-yip.png', registrationNo: 'HCA-2014-0089',
  },
  'Peter Kwan': {
    id: 'CW006', name: 'Peter Kwan', role: 'Home Care Worker', gender: 'Male', age: 55,
    yearsExperience: 15, specialty: 'Post-Stroke & Mobility Support',
    certifications: ['Health Care Assistant (HCA)', 'First Aid Instructor', 'Stroke Care Certificate'],
    institution: 'Pamela Youde Nethersole Eastern Hospital · iHomeCare Home Support',
    education: 'Certificate in Health Care Assistance (VTC), Diploma in Stroke Care',
    bio: 'Peter Kwan is a highly experienced care worker with 15 years specializing in post-stroke support.',
    avatar: '/avatars/peter-kwan.png', registrationNo: 'HCA-2011-0278',
  },
};

// Family contact info for each patient
export interface FamilyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  livingWith: boolean;
  notes?: string;
}

// Family communication records
export interface FamilyComm {
  date: string;
  time: string;
  contact: string;
  method: 'Phone' | 'Message' | 'Video Call' | 'In-Person';
  summary: string;
  actionItems: string;
  direction: 'outgoing' | 'incoming';
}

export const FAMILY_COMMS: Record<number, FamilyComm[]> = {
  1: [
    { date: '2026-06-20', time: '18:30', contact: 'Cheung Mei Ling (Daughter)', method: 'Phone', summary: 'Updated on weight stability (68.0kg). Reviewed fluid restriction compliance. Daughter reports patient ate well, less dyspnoeic today.', actionItems: 'Continue daily weight log. Call if weight gain >1kg/day.', direction: 'outgoing' },
    { date: '2026-06-19', time: '14:00', contact: 'Mrs. Cheung (Wife)', method: 'In-Person', summary: 'Wife trained on BP monitor, weight scale, and medication schedule during nurse visit. Wife reports patient is compliant with fluid restriction but sometimes forgets afternoon Furosemide.', actionItems: 'Set phone alarm for 2PM Furosemide. Wife to call if weight gain >1kg.', direction: 'outgoing' },
    { date: '2026-06-18', time: '16:00', contact: 'Cheung Mei Ling (Daughter)', method: 'Video Call', summary: 'HaH discharge planning call. Reviewed daily weight monitoring, fluid restriction, low-sodium diet, and emergency contact numbers. Smartwatch pairing confirmed.', actionItems: 'Daughter to set up medication box for the week. Post emergency numbers on fridge.', direction: 'outgoing' },
  ],
  2: [
    { date: '2026-06-20', time: '17:00', contact: 'Wong Siu Ming (Daughter)', method: 'Phone', summary: 'Updated on SpO₂ improvement (93% RA). Reviewed O₂ safety and inhaler technique. Daughter reports patient less wheezy today.', actionItems: 'Continue O₂ prn. Call if SpO₂ <88%.', direction: 'outgoing' },
    { date: '2026-06-19', time: '10:00', contact: 'Wong Siu Ming (Daughter)', method: 'In-Person', summary: 'Daughter present during nurse visit. Trained on O₂ concentrator setup, inhaler technique, and exacerbation action plan.', actionItems: 'Daughter to monitor SpO₂ daily. Exacerbation action plan posted on fridge.', direction: 'outgoing' },
    { date: '2026-06-18', time: '15:00', contact: 'Wong Siu Ming (Daughter)', method: 'Message', summary: 'Daughter confirmed O₂ concentrator delivery received. Home ready for patient discharge.', actionItems: 'Nurse acknowledged. HaH visit scheduled tomorrow 11:00.', direction: 'incoming' },
  ],
  3: [
    { date: '2026-06-20', time: '16:00', contact: 'Lam Wai Leng (Spouse)', method: 'Phone', summary: 'Spouse reports patient feels "80% better". Eating well, no fever. Levofloxacin taken without issues.', actionItems: 'Complete 2 more days antibiotics. Return to work (remote) from Day 7.', direction: 'outgoing' },
    { date: '2026-06-19', time: '10:30', contact: 'Lam Wai Leng (Spouse)', method: 'In-Person', summary: 'Spouse present during nurse visit. Trained on temperature monitoring and return precautions. PENICILLIN ALLERGY confirmed and documented.', actionItems: 'Spouse to call if temp >38.0°C. Allergy alert card placed in wallet.', direction: 'outgoing' },
    { date: '2026-06-18', time: '14:00', contact: 'Lam Wai Leng (Spouse)', method: 'Message', summary: 'Spouse confirmed discharge plans. Home prepared. Patient afebrile.', actionItems: 'Home visit scheduled tomorrow 10:30.', direction: 'incoming' },
  ],
  4: [
    { date: '2026-06-20', time: '17:00', contact: 'Lau Wai Hung (Son)', method: 'Phone', summary: 'Updated on AMTS improvement (9/10). Urinary symptoms improving. No diarrhoea. Son reports mother more alert and eating well.', actionItems: 'Continue Ciprofloxacin. Monitor for diarrhoea. Call if confusion returns.', direction: 'outgoing' },
    { date: '2026-06-19', time: '10:00', contact: 'Lau Wai Hung (Son)', method: 'In-Person', summary: 'Son present during nurse visit. Reviewed UTI prevention, hydration plan, Ciprofloxacin + Losartan interaction, and fall prevention.', actionItems: 'Son to ensure 1.5L daily fluid intake. Assist with ambulation. Report any cognitive decline.', direction: 'outgoing' },
    { date: '2026-06-18', time: '16:00', contact: 'Lau Wai Hung (Son)', method: 'Phone', summary: 'HaH discharge planning. Son confirmed home ready. Reviewed medication schedule and cognitive baseline (AMTS 9/10).', actionItems: 'Son to monitor AMTS daily. Call if any decline.', direction: 'outgoing' },
  ],
  5: [
    { date: '2026-06-20', time: '18:00', contact: 'Mrs. Ho (Wife)', method: 'In-Person', summary: 'Wife reports wound looks better. Patient compliant with leg elevation. Clindamycin doses all taken on schedule.', actionItems: 'Continue wound inspection between nurse visits. Report any spreading redness.', direction: 'outgoing' },
    { date: '2026-06-19', time: '08:30', contact: 'Mrs. Ho (Wife)', method: 'In-Person', summary: 'Wife present during wound care visit. Trained on wound inspection, erythema border marking, and Clindamycin q6h schedule.', actionItems: 'Wife to inspect wound evening and midnight. Photograph daily for comparison.', direction: 'outgoing' },
    { date: '2026-06-18', time: '15:00', contact: 'Mrs. Ho (Wife)', method: 'Phone', summary: 'HaH discharge planning. Wife confirmed leg elevation setup (recliner + pillows). Wound care supplies delivered.', actionItems: 'Wife to set q6h alarms for Clindamycin. RN visit tomorrow 08:30.', direction: 'outgoing' },
  ],
  6: [
    { date: '2026-06-20', time: '17:00', contact: 'Ng Ka Yan (Daughter)', method: 'Phone', summary: 'Updated on INR 2.1 (therapeutic). No bleeding. Leg swelling improving. Warfarin education progressing well.', actionItems: 'Continue INR daily. Daughter to ensure consistent vitamin K intake at dinner.', direction: 'outgoing' },
    { date: '2026-06-19', time: '09:00', contact: 'Ng Ka Yan (Daughter)', method: 'In-Person', summary: 'Daughter present during nurse visit. Trained on INR POCT, Warfarin administration, bleeding precautions, and compression stocking application.', actionItems: 'Daughter to supervise Warfarin 6PM dose. Report any bleeding or bruising. INR check tomorrow 08:00.', direction: 'outgoing' },
    { date: '2026-06-18', time: '14:00', contact: 'Ng Ka Yan (Daughter)', method: 'Video Call', summary: 'HaH discharge planning. Reviewed Warfarin safety, INR monitoring schedule, diet consistency, and emergency bleeding signs. Compression stockings fitted.', actionItems: 'Daughter to set up pill box with alarm. Anticoagulation alert card in wallet. Call 999 for any bleeding.', direction: 'outgoing' },
  ],
  7: [
    { date: '2026-06-25', time: '09:00', contact: 'Mrs. Chan (Wife)', method: 'In-Person', summary: 'Discharge education: COPD action plan, warning signs (SpO₂ <92%, fever, green sputum, confusion). PO Augmentin Day 8-10. Follow-up respiratory clinic 2026-07-09.', actionItems: 'Continue daily SpO₂. Call RN if <92%. Clinic confirmed.', direction: 'outgoing' },
    { date: '2026-06-24', time: '17:30', contact: 'Emily Chan (Daughter)', method: 'Phone', summary: 'Updated: afebrile × 72h, SpO₂ 95% RA, walking 100m. RN to once-daily. PO Augmentin prescription explained.', actionItems: 'Pick up Augmentin from PWH pharmacy. Supervise AM dose Day 8.', direction: 'outgoing' },
    { date: '2026-06-23', time: '10:30', contact: 'Mrs. Chan (Wife)', method: 'In-Person', summary: 'C&S results: H. influenzae, Ceftriaxone-sensitive. Stop Doxycycline, add Azithromycin. Patient improving — SpO₂ 95%, afebrile.', actionItems: 'Continue current care. Azithromycin added to AM meds.', direction: 'outgoing' },
    { date: '2026-06-20', time: '14:45', contact: 'Mrs. Chan (Wife)', method: 'In-Person', summary: 'Emergency during RED alert. SpO₂ 90%, Temp 38.3°C. POCT + septic workup started. IV antibiotics beginning. Wife reassured by Jenny Tam.', actionItems: 'Stay calm. Jenny Tam staying. Emily Chan en route.', direction: 'outgoing' },
    { date: '2026-06-20', time: '08:30', contact: 'Emily Chan (Daughter)', method: 'Phone', summary: 'Infection Watch triggered: SpO₂ 91%, Temp 37.8, green sputum. Maggie Lam + Dr. Lee notified.', actionItems: 'Standby for update. Will call if POCT needed.', direction: 'outgoing' },
    { date: '2026-06-19', time: '09:00', contact: 'Mrs. Chan (Wife)', method: 'In-Person', summary: 'Initial HaH education: SpO₂/BP/Temp monitoring, escalation call, O₂ safety, Spiriva technique. Demonstrated correctly.', actionItems: 'Practice SpO₂ at 14:00 + 20:00. Call if <92%. Grab bars Day 2.', direction: 'outgoing' },
  ],
};

const CHAN_TAI_MING_FAMILY_CONTACTS: FamilyContact[] = [
  { name: 'Mrs. Chan (Chan Siu Ling)', relationship: 'Wife', phone: '+852 9123 7890', email: 'sschan@email.com', isPrimary: true, livingWith: true, notes: 'Full-time caregiver (age 78). Trained on SpO₂/BP/Temp monitoring, escalation call process, O₂ concentrator safety, and COPD medication schedule. Demonstrated correct device technique. Primary contact for all clinical updates.' },
  { name: 'Emily Chan', relationship: 'Daughter', phone: '+852 9234 5678', email: 'emily.chan@email.com', isPrimary: false, livingWith: false, notes: 'Lives in same district (Shatin). Visits daily after work. Backup caregiver. Manages medication reconciliation, pharmacy runs, and grocery shopping. Primary contact for emergencies if wife unreachable.' },
];

export const PATIENT_FAMILY: Record<number, FamilyContact[]> = {
  1: [
    { name: '王小凤', relationship: '配偶', phone: '13092427015', email: '', isPrimary: true, livingWith: true, notes: '同住。全职照护者。负责用药提醒、血压监测、翻身协助。已培训压疮护理和跌倒预防。' },
  ],
  2: [
    { name: 'Wong Siu Ming', relationship: 'Daughter', phone: '+852 9345 6789', email: 'siu.ming@email.com', isPrimary: true, livingWith: false, notes: 'Visits daily. Manages O₂ equipment, inhaler supplies, and medical appointments. Trained on O₂ safety and exacerbation action plan. Lives in same district.' },
  ],
  3: [
    { name: 'Lam Wai Leng', relationship: 'Spouse', phone: '+852 9456 7890', email: 'wl.lam@email.com', isPrimary: true, livingWith: true, notes: 'Works from home. Available full-time during HaH period. Manages medication schedule, temperature monitoring, and meals. Trained on penicillin allergy emergency protocol.' },
  ],
  4: [
    { name: 'Lau Wai Hung', relationship: 'Son', phone: '+852 9567 8901', email: 'wh.lau@email.com', isPrimary: true, livingWith: false, notes: 'Visits twice daily. Manages medications, hydration monitoring, AMTS cognitive assessments, and medical appointments. Lives nearby (same estate).' },
  ],
  5: [
    { name: 'Mrs. Ho (Chan Siu Ling)', relationship: 'Wife', phone: '+852 9678 9012', email: '', isPrimary: true, livingWith: true, notes: 'Retired, full-time caregiver. Manages Clindamycin q6h schedule, wound inspection, leg elevation, and diabetic meals. Trained on wound photography and erythema border marking.' },
  ],
  6: [
    { name: 'Ng Ka Yan', relationship: 'Daughter', phone: '+852 9789 0123', email: 'ka.yan@email.com', isPrimary: true, livingWith: false, notes: 'Lives in same building (different floor). Visits daily. Manages Warfarin administration, INR POCT monitoring, compression stockings, and medical appointments. Trained on bleeding precautions and emergency protocol.' },
  ],
  7: CHAN_TAI_MING_FAMILY_CONTACTS,
};

import { NEW_PATIENT_FAMILY, NEW_FAMILY_COMMS } from './newPatients/careTeamExtras';
Object.assign(PATIENT_FAMILY, NEW_PATIENT_FAMILY);
Object.assign(FAMILY_COMMS, NEW_FAMILY_COMMS);

// ── 大陆团队数据 ──
export const CN_CARE_TEAM: Record<string, TeamMember> = {
  '姜珊': {
    id: 'CN_N001', name: '姜珊', role: '护士经理',
    gender: '女', age: 35, yearsExperience: 12,
    specialty: '老年护理 · 居家护理 · 压疮管理',
    certifications: ['主管护师', '伤口造口专科护士', '养老护理员培训师'],
    institution: '常州市金坛区护理站',
    education: '护理学本科（南京医科大学）',
    bio: '拥有12年老年护理和居家护理经验。擅长压疮预防与护理、跌倒风险评估、慢性病居家管理。负责制定和执行个性化护理计划。',
    avatar: '姜',
    registrationNo: 'CN3204-001',
  },
  '汤菊玲': {
    id: 'CN_CW001', name: '汤菊玲', role: '护理员',
    gender: '女', age: 48, yearsExperience: 8,
    specialty: '生活照料 · 辅助进食 · 助行陪护',
    certifications: ['养老护理员（中级）', '急救员证'],
    institution: '常州市金坛区护理站',
    education: '养老护理专业培训',
    bio: '8年居家照护经验。负责日常生活照料，包括助餐、助浴、助行、用药提醒等。',
    avatar: '汤',
    registrationNo: 'CN3204-CW001',
  },
  '个案经理': {
    id: 'CN_CM000', name: '个案经理', role: '个案经理（待分配）',
    gender: '—', age: 0, yearsExperience: 0,
    specialty: '待分配',
    certifications: [],
    institution: '常州市金坛区护理站',
    education: '待分配',
    bio: '负责服务协调、进度跟踪、家属沟通及长护险结算对接。目前待分配。',
    avatar: '待',
    registrationNo: '',
  },
  '康复治疗师': {
    id: 'CN_RT000', name: '康复治疗师', role: '康复治疗师（待分配）',
    gender: '—', age: 0, yearsExperience: 0,
    specialty: '待分配',
    certifications: [],
    institution: '常州市金坛区护理站',
    education: '待分配',
    bio: '负责被动关节活动、肌力训练、床上活动能力训练及辅助器具适配评估。目前待分配。',
    avatar: '待',
    registrationNo: '',
  },
  '营养师': {
    id: 'CN_NT000', name: '营养师', role: '营养师（待分配）',
    gender: '—', age: 0, yearsExperience: 0,
    specialty: '待分配',
    certifications: [],
    institution: '常州市金坛区护理站',
    education: '待分配',
    bio: '负责营养评估、膳食指导、蛋白补充方案制定及吞咽功能评估。目前待分配。',
    avatar: '待',
    registrationNo: '',
  },
};

export function getPatientFamily(patientId: number): FamilyContact[] {
  if (patientId === 7) return CHAN_TAI_MING_FAMILY_CONTACTS;
  const raw = PATIENT_FAMILY[patientId] || [];
  return raw.filter((c): c is FamilyContact => typeof c.name === 'string' && c.name.length > 0);
}
