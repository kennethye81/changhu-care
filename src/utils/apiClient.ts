// src/utils/apiClient.ts (extended with Stage 2)
import { useEffect, useState } from 'react';
import { DEFAULT_VITALS } from '../store/patientStore';
import { formatNewsHeadline } from './medicalHistoryNews';
import { calculateNews } from './newsScore';

// ... [existing interfaces] ...

export interface Assessment {
  id: number;
  assessment_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  bmi: number | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  hr_bpm: number | null;
  rr_bpm: number | null;
  spo2_percent: number | null;
  temp_c: number | null;
  adl_score: number | null;
  iadl_score: number | null;
  fall_risk: string | null;
  mmse_score: number | null;
  gds_score: number | null;
  mna_score: number | null;
  albumin_gdl: number | null;
  pain_intensity: number | null;
  pressure_ulcer_stage: string | null;
  news_score: number | null;
  delirium_risk: string | null;
  risk_level: 'Stable' | 'Attention' | 'Critical' | null;
  clinical_summary: string | null;
}

export interface CarePlan {
  id: number;
  plan_date: string;
  status: 'Draft' | 'Approved' | 'Active' | 'Completed' | 'Archived';
  short_term_goals: string[];
  long_term_goals: string[];
  nursing_interventions: string[];
  physio_interventions: string[];
  social_work_interventions: string[];
  medication_review: boolean;
  medication_adjustments: string[];
  vitals_frequency: string | null;
  lab_tests: string[];
  patient_education: string[];
  family_education: string[];
  next_visit: string | null;
  referral_required: boolean;
  referral_specialty: string | null;
  fall_prevention_plan: string | null;
  pressure_ulcer_prevention: string | null;
  delirium_prevention: string | null;
  expected_outcomes: string[];
  success_metrics: string[];
}

export interface Medication {
  medication_name: string;
  generic_name: string;
  dosage: string;
  frequency: string;
  route: string;
  start_date: string;
  end_date: string | null;
  status: 'Active' | 'Discontinued' | 'On Hold';
  indications: string;
}

// ... [existing hooks] ...

export const useApiAssessment = (patientId: number) => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const useDb = urlParams.get('demo') === 'db';

    if (!useDb) {
      setAssessment({
        id: 1,
        assessment_date: "2024-07-05",
        height_cm: 170,
        weight_kg: 65.5,
        bmi: 22.6,
        bp_systolic: 162,
        bp_diastolic: 92,
        hr_bpm: 102,
        rr_bpm: 18,
        spo2_percent: 94,
        temp_c: 36.8,
        adl_score: 95,
        iadl_score: 88,
        fall_risk: "Moderate",
        mmse_score: 28,
        gds_score: 2,
        mna_score: 26,
        albumin_gdl: 3.8,
        pain_intensity: 2,
        pressure_ulcer_stage: "None",
        news_score: 2,
        delirium_risk: "Moderate",
        risk_level: "Critical",
        clinical_summary: "Post-PCI recovery, stable"
      });
      setLoading(false);
      return;
    }

    fetch(`/api/assessments/${patientId}`)
      .then(res => res.json())
      .then(data => setAssessment(data))
      .catch(err => {
        console.warn("Assessment API failed, using mock:", err);
        setAssessment(null as any);
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  return { assessment, loading };
};

export const useApiCarePlan = (patientId: number) => {
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const useDb = urlParams.get('demo') === 'db';

    if (!useDb) {
      // DEPRECATED: dead code path — useApiCarePlan is not imported anywhere.
      // Use patientStore data instead.
      setCarePlan(null);
      setLoading(false);
      return;
    }

    fetch(`/api/care-plans/${patientId}`)
      .then(res => res.json())
      .then(data => setCarePlan(data))
      .catch(err => {
        console.warn("CarePlan API failed, using mock:", err);
        setCarePlan(null as any);
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  return { carePlan, loading };
};

export const useApiMedications = (patientId: number) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const useDb = urlParams.get('demo') === 'db';

    if (!useDb) {
      setMedications([
        { medication_name: "Aspirin", generic_name: "Acetylsalicylic Acid", dosage: "81mg", frequency: "Once Daily", route: "Oral", start_date: "2024-01-01", end_date: null, status: "Active", indications: "Secondary prevention of MI" },
        { medication_name: "Atorvastatin", generic_name: "Atorvastatin Calcium", dosage: "40mg", frequency: "Once Daily", route: "Oral", start_date: "2024-01-01", end_date: null, status: "Active", indications: "Hyperlipidemia" }
      ]);
      setLoading(false);
      return;
    }

    fetch(`/api/medications/${patientId}`)
      .then(res => res.json())
      .then(data => setMedications(data))
      .catch(err => {
        console.warn("Medications API failed, using mock:", err);
        setMedications([/* mock */]);
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  return { medications, loading };
};