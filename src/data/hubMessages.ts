import { formatHubP7InboxPreview } from '../utils/medicalHistoryNews';

export interface HubMessage {
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

const P7_INBOX = formatHubP7InboxPreview();

export const HUB_MESSAGES: HubMessage[] = [
  {
    from: 'Sarah Leung',
    subject: 'Re: Cheung Wai Man — weight update',
    preview: 'Weight stable at 68.0kg on GDMT. Patient reports feeling better. Continue daily weight + I/O chart.',
    time: '5 min ago',
    unread: true,
  },
  {
    from: 'Dr. Chan Chi Keung',
    subject: 'BNP Results — Cheung Wai Man',
    preview: 'BNP 850 trending down from 1,200. Continue current GDMT. Repeat renal panel in 48h.',
    time: '1 hour ago',
    unread: true,
  },
  {
    from: 'Jenny Tam',
    subject: P7_INBOX.subject,
    preview: P7_INBOX.preview,
    time: '2 hours ago',
    unread: true,
  },
  {
    from: 'Anna Leung',
    subject: 'CAP HaH — Lam Ka Chun Day 3',
    preview: 'Levofloxacin tolerated. SpO₂ 97%. Invoice INV-2026-0140 outstanding — finance follow-up suggested.',
    time: 'Yesterday',
    unread: false,
  },
  {
    from: 'Grace Tang',
    subject: 'Cellulitis visit — Ho Tai Wai',
    preview: 'Wound camera shows erythema improving. IV Clindamycin Day 2 — oral switch planned Day 4.',
    time: 'Yesterday',
    unread: false,
  },
  {
    from: 'Peter Ho',
    subject: 'INR stable — Ng Siu Wan',
    preview: 'POCT INR 2.1 therapeutic. Warfarin education completed. Next check tomorrow 08:00.',
    time: '2 days ago',
    unread: false,
  },
];
