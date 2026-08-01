// 2026年8月护理排程 — 沈国栋（ID 1）
// 参照：中国高血压防治指南2024 · 中国压疮诊疗与预防指南 · 中国脑卒中康复治疗指南 · 中国老年患者营养支持指南 · 中国老年人跌倒干预技术指南
// 频率：每周4次（周一/周三/周五/周日），每次60-90分钟

import type { DailyActivity } from './carePlans';

export interface ScheduleRow {
  d: string;
  t: string;
  r: string;
  c: string;
  ref: string;
}

export const MONTHLY_SCHEDULE: ScheduleRow[] = [
  { d: '8/3(一)', t: '09:00-10:30', r: '护理员+护士', c: '入月初评：生命体征基线（BP/HR/Temp/SpO2）+ 压疮评估 + Braden评分 + 用药审查（硝苯地平30mg依从性）', ref: '中国高血压防治指南2024 / 中国压疮诊疗与预防指南' },
  { d: '8/5(三)', t: '14:00-15:30', r: '护理员+康复师', c: '被动全关节活动度训练（双上肢+双下肢）+ 床上翻身训练 + 肌力评估（MMT分级）+ 按摩放松', ref: '中国脑卒中康复治疗指南 - 早期康复' },
  { d: '8/7(五)', t: '09:00-10:00', r: '护理员', c: '翻身护理q2h核查 + 全身清洁 + 血压监测（BP小于150/90）+ 皮肤完整性检查 + 用药提醒', ref: '常规照护' },
  { d: '8/9(日)', t: '08:30-09:30', r: '护理员', c: '助餐（低盐低脂）+ 翻身护理 + 个人清洁 + 居家安全巡查（地面/扶手/照明/呼叫铃）', ref: '中国老年人跌倒干预技术指南' },
  { d: '8/10(一)', t: '09:00-10:00', r: '护理员', c: '翻身护理 + 血压监测 + 助餐 + 皮肤检查 + 用药提醒', ref: '常规照护' },
  { d: '8/12(三)', t: '14:00-15:30', r: '护理员+康复师', c: '被动ROM + 按摩 + 床上活动训练 + 肌力渐进训练 + 家属照护技能指导（翻身操作规范）', ref: '中国脑卒中康复治疗指南' },
  { d: '8/14(五)', t: '09:00-10:30', r: '护理员+护士', c: '中期随访：血压趋势分析（比对基线160/82, 目标小于150/90）+ 压疮复查 + Braden重评 + 用药依从性核查', ref: '中国高血压防治指南2024 / Braden量表' },
  { d: '8/16(日)', t: '08:30-10:00', r: '护理员+营养师', c: '营养风险筛查 + 膳食调查（24h回顾法）+ 蛋白补充方案制定（目标1.2g/kg/日, 约84g/日）+ 翻身护理', ref: '中国老年患者营养支持指南' },
  { d: '8/17(一)', t: '09:00-10:00', r: '护理员', c: '翻身护理 + 血压监测 + 清洁 + 用药提醒 + 营养方案执行督促', ref: '常规照护' },
  { d: '8/19(三)', t: '14:00-15:30', r: '护理员+康复师', c: '关节活动训练 + 肌力维持 + 助行器适应性训练 + 床上坐位平衡练习', ref: '中国脑卒中康复治疗指南' },
  { d: '8/21(五)', t: '09:00-10:00', r: '护理员', c: '翻身护理 + 血压监测 + 皮肤检查 + 清洁 + 用药提醒', ref: '常规照护' },
  { d: '8/23(日)', t: '08:30-09:30', r: '护理员', c: '助餐 + 翻身护理 + 清洁 + 防跌倒巡查（助行器/地面/照明检查）', ref: '中国老年人跌倒干预技术指南' },
  { d: '8/24(一)', t: '09:00-10:30', r: '护理员+护士', c: '月末综合评估：全套生命体征 + 压疮评估 + Braden评分 + 血压达标验证 + 用药审查 + 30天照护质量报告', ref: '月度评估：对照30天转归目标' },
  { d: '8/26(三)', t: '14:00-15:30', r: '护理员+康复师', c: '被动ROM + 渐进抗阻训练 + 坐位平衡训练 + 月度康复进展评估 + 下月方案调整建议', ref: '中国脑卒中康复治疗指南' },
  { d: '8/28(五)', t: '09:00-10:00', r: '护理员', c: '翻身护理 + 血压监测 + 皮肤检查 + 清洁 + 用药提醒', ref: '常规照护' },
  { d: '8/30(日)', t: '08:30-10:00', r: '护理员', c: '月度收尾：全面护理复核 + 月度小结（零跌倒/血压趋势/压疮状况/营养依从性）+ 家属沟通会 + 下月计划预告', ref: '月度服务总结' },
];

/** 将月度排程某一行拆分为 DailyActivity 列表（模拟当日服务执行状态） */
export function getDailyActivitiesFromSchedule(date: string): DailyActivity[] {
  const timeStr = (h: number, m = 0): string => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  // date format: '2026-08-16' → match '8/16'
  const m = date.match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (!m) return [];
  const short = `${parseInt(m[1])}/${parseInt(m[2])}`;
  const row = MONTHLY_SCHEDULE.find(r => r.d.startsWith(short));
  if (!row) return [];

  const [startTime, endTime] = row.t.split('-');
  const parseHour = (t: string) => parseInt(t.split(':')[0]);
  const parseMin = (t: string) => parseInt(t.split(':')[1]) || 0;
  const startH = parseHour(startTime);
  const startM = parseMin(startTime);
  const endH = endTime ? parseHour(endTime) : startH + 1;
  const endM = endTime ? parseMin(endTime) : 0;
  const roles = row.r.split('+').map(s => s.trim());
  const content = row.c;

  const activities: DailyActivity[] = [];

  // 护理员任务
  if (roles.includes('护理员')) {
    if (content.includes('翻身')) {
      activities.push({
        time: startTime, activity: '翻身护理 + 皮肤检查', type: 'care_worker',
        detail: 'q2h翻身核查 · 压疮部位皮肤完整性评估',
        status: 'completed', provider: '汤菊玲',
        scheduled: `${startTime} – ${timeStr(startH + (startM + 30 >= 60 ? 1 : 0), (startM + 30) % 60)}`,
        clockIn: timeStr(startH, Math.max(0, startM - 2)),
        clockOut: timeStr(startH + (startM + 35 >= 60 ? 1 : 0), (startM + 35) % 60),
      } as any);
    }
    if (content.includes('清洁') || content.includes('助餐')) {
      activities.push({
        time: startTime,
        activity: content.includes('助餐') ? '助餐 + 个人清洁' : '个人清洁护理',
        type: 'care_worker',
        detail: '床上擦浴 · 口腔护理 · 低盐低脂助餐',
        status: 'completed', provider: '汤菊玲',
        scheduled: `${startTime} – ${timeStr(startH + (startM + 30 >= 60 ? 1 : 0), (startM + 30) % 60)}`,
        clockIn: timeStr(startH, Math.max(0, startM - 3)),
        clockOut: timeStr(startH + (startM + 28 >= 60 ? 1 : 0), (startM + 28) % 60),
      } as any);
    }
    if (content.includes('血压')) {
      activities.push({
        time: startTime, activity: '血压监测', type: 'monitoring',
        detail: 'BP测量 + 记录 · 硝苯地平用药提醒',
        status: 'completed', provider: '汤菊玲',
        scheduled: `${startTime} – ${timeStr(startH + (startM + 15 >= 60 ? 1 : 0), (startM + 15) % 60)}`,
        clockIn: timeStr(startH, Math.max(0, startM - 1)),
        clockOut: timeStr(startH + (startM + 8 >= 60 ? 1 : 0), (startM + 8) % 60),
      } as any);
    }
    if (activities.length === 0 || !activities.some(a => a.type === 'care_worker')) {
      activities.push({
        time: startTime, activity: '基础照护', type: 'care_worker',
        detail: '翻身护理 · 清洁 · 安全巡查',
        status: 'completed', provider: '汤菊玲',
        scheduled: `${startTime} – ${endTime || ''}`,
        clockIn: timeStr(startH, Math.max(0, startM - 5)),
        clockOut: endTime,
      } as any);
    }
  }

  // 护士任务
  if (roles.includes('护士')) {
    const isEndMonth = content.includes('月末');
    activities.push({
      time: startTime,
      activity: content.includes('月初') || isEndMonth ? '综合护理评估' : '护理随访评估',
      type: 'nurse_visit',
      detail: '生命体征全套 · Braden评分 · 用药审查',
      status: isEndMonth ? 'in_progress' : 'completed', provider: '姜珊',
      scheduled: `${startTime} – ${timeStr(startH + (startM + 45 >= 60 ? 1 : 0), (startM + 45) % 60)}`,
      clockIn: timeStr(startH, Math.max(0, startM + 1)),
      clockOut: timeStr(startH + (startM + 42 >= 60 ? 1 : 0), (startM + 42) % 60),
    } as any);
  }

  // 康复师任务
  if (roles.includes('康复师')) {
    if (content.includes('被动ROM') || content.includes('关节活动')) {
      activities.push({
        time: startTime, activity: '被动关节活动训练', type: 'therapy',
        detail: '双上肢+双下肢ROM · MMT肌力评估',
        status: 'in_progress', provider: '周明',
        scheduled: `${startTime} – ${timeStr(startH + (startM + 30 >= 60 ? 1 : 0), (startM + 30) % 60)}`,
        clockIn: timeStr(startH, Math.max(0, startM + 2)),
      } as any);
    }
    if (content.includes('肌力') || content.includes('抗阻')) {
      const tH = endTime ? endH - 1 : startH;
      const tM = endM;
      activities.push({
        time: timeStr(tH, tM), activity: '肌力渐进训练', type: 'therapy',
        detail: '抗阻训练 · 床上活动训练',
        status: 'pending', provider: '周明',
        scheduled: `${timeStr(tH, tM)} – ${timeStr(tH + (tM + 30 >= 60 ? 1 : 0), (tM + 30) % 60)}`,
      } as any);
    }
    if (content.includes('按摩')) {
      const tH = endTime ? endH - 1 : startH;
      const tM = endM + 15;
      activities.push({
        time: timeStr(tH, tM), activity: '治疗性按摩', type: 'therapy',
        detail: '肌肉放松 · 促进血液循环',
        status: 'pending', provider: '周明',
        scheduled: `${timeStr(tH, tM)} – ${timeStr(tH + (tM + 15 >= 60 ? 1 : 0), (tM + 15) % 60)}`,
      } as any);
    }
  }

  // 营养师任务 — 模拟迟到异常
  if (roles.includes('营养师')) {
    activities.push({
      time: startTime, activity: '营养风险筛查', type: 'therapy',
      detail: 'NRS2002量表评估 · 人体测量',
      status: 'missed', provider: '陈雅文',
      scheduled: `${startTime} – ${timeStr(startH + (startM + 30 >= 60 ? 1 : 0), (startM + 30) % 60)}`,
      clockIn: timeStr(startH + (startM + 45 >= 60 ? 1 : 0), (startM + 45) % 60),
      clockOut: timeStr(startH + (startM + 50 >= 60 ? 1 : 0), (startM + 50) % 60),
    } as any);
    activities.push({
      time: timeStr(startH + (startM + 30 >= 60 ? 1 : 0), (startM + 30) % 60),
      activity: '膳食调查', type: 'therapy',
      detail: '24h回顾法 · 膳食结构分析',
      status: 'in_progress', provider: '陈雅文',
      scheduled: `${timeStr(startH + (startM + 30 >= 60 ? 1 : 0), (startM + 30) % 60)} – ${timeStr(startH + (startM + 60 >= 60 ? 1 : 0), (startM + 60) % 60)}`,
      clockIn: timeStr(startH + (startM + 45 >= 60 ? 1 : 0), (startM + 45) % 60),
    } as any);
    activities.push({
      time: timeStr(startH + (startM + 60 >= 60 ? 1 : 0), (startM + 60) % 60),
      activity: '个性化营养方案', type: 'therapy',
      detail: '蛋白补充方案(1.2g/kg/日) · 低盐低脂饮食指导',
      status: 'pending', provider: '陈雅文',
      scheduled: `${timeStr(startH + (startM + 60 >= 60 ? 1 : 0), (startM + 60) % 60)} – ${endTime || ''}`,
    } as any);
  }

  // 安全巡查
  if (content.includes('跌倒') || content.includes('安全巡查')) {
    const tH = endTime ? endH : startH;
    const tM = endTime ? endM : startM;
    activities.push({
      time: timeStr(tH, tM), activity: '居家安全巡查', type: 'care_worker',
      detail: '地面防滑 · 扶手稳固 · 照明检查 · 呼叫铃测试',
      status: 'completed', provider: '汤菊玲',
      scheduled: `${timeStr(tH, tM)} – ${timeStr(tH + (tM + 15 >= 60 ? 1 : 0), (tM + 15) % 60)}`,
      clockIn: timeStr(tH, Math.max(0, tM - 10)),
      clockOut: timeStr(tH + (tM + 2 >= 60 ? 1 : 0), (tM + 2) % 60),
    } as any);
  }

  return activities;
}
