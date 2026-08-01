export interface HubMessage {
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

export const HUB_MESSAGES: HubMessage[] = [
  {
    from: '姜珊（护士经理）',
    subject: '沈国栋 — 体重与血压更新',
    preview: '今日体重67.5kg，血压152/88。降压药规律服用。建议早晚监测血压×3天后复评。',
    time: '5分钟前',
    unread: true,
  },
  {
    from: '汤菊玲（照护师）',
    subject: '上门护理记录 — 沈国栋',
    preview: '右足压疮换药完成，创面面积缩小至1.2×0.8cm。Barthel ADL评分30分（重度依赖），需加强翻身训练。',
    time: '1小时前',
    unread: true,
  },
  {
    from: '李妍（评估员）',
    subject: '季度复评提醒 — 沈国栋',
    preview: '距离上次长护险综合评估已满90天，请安排复评。Barthel/Braden/跌倒风险评估量表已备齐。',
    time: '2小时前',
    unread: true,
  },
  {
    from: '系统通知',
    subject: '物联网设备告警 — 沈国栋',
    preview: '血压袖带电量低于20%，建议48小时内更换电池。跌倒手环在线状态正常。',
    time: '昨天',
    unread: false,
  },
  {
    from: '系统通知',
    subject: '压疮愈合进度更新',
    preview: 'Braden评分14→16分（轻度风险），营养师介入后蛋白摄入达标。伤口面积缩小趋势良好。',
    time: '昨天',
    unread: false,
  },
  {
    from: '姜珊（护士经理）',
    subject: '用药方案确认 — 硝苯地平',
    preview: '硝苯地平控释片30mg qd持续。家属反馈无头晕等低血压症状。暂不调整剂量。',
    time: '2天前',
    unread: false,
  },
];
