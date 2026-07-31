// src/hooks/useApiPatients.ts
import { useState, useEffect } from 'react';

export interface Patient {
  id: number;
  name: string;
  age?: number;
  status?: string;
  // 精简版，仅满足 demo 渲染
}

export const useApiPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟 API 调用（路演 Demo 专用）
    const timer = setTimeout(() => {
      fetch('/api/patients')
        .then(res => res.json().catch(() => []))
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setPatients(data);
          } else {
            // 安全兜底：硬编码 2 条患者数据（符合 HK 隐私规范，无真实信息）
            setPatients([
              { id: 1, name: "Mr. Chan", age: 78, status: "Stable" },
              { id: 2, name: "Ms. Lee", age: 82, status: "High Risk" }
            ]);
          }
          setLoading(false);
        })
        .catch(() => {
          setPatients([
            { id: 1, name: "Mr. Chan", age: 78, status: "Stable" },
            { id: 2, name: "Ms. Lee", age: 82, status: "High Risk" }
          ]);
          setLoading(false);
        });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { patients, loading };
};