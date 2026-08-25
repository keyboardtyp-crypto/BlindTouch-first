"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { STAGES, BLIND_STAGES } from "@/lib/typing-data";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type HistoryRecord = {
  created_at: string;
  accuracy: number;
  level_id: string;
  level_title?: string; // 💡 追加
};

export default function StatsPage() {
  const [data, setData] = useState<HistoryRecord[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: history, error } = await supabase
        .from("practice_history") // 履歴用テーブル
        .select("*")
        .order("created_at", { ascending: true });

      if (error || !history) return;

      // 💡 level_id からタイトルを取得してマッピング
      const formatted = history.map((item: any) => {
        const allStages = [...STAGES, ...BLIND_STAGES];
        const levelObj = allStages.find((s) => s.id === item.level_id);
        const title = levelObj ? levelObj.title : `Level ${item.level_id}`;

        const dateObj = new Date(item.created_at);
        const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()} ${String(
          dateObj.getHours()
        ).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;

        return {
          ...item,
          formattedDate: dateStr,
          level_title: title,
        };
      });

      setData(formatted);
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Practice Stats</h1>
            <p className="text-sm text-gray-500">タイピング精度の成長記録</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            ← 練習画面に戻る
          </Link>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 12 }} />
              
              {/* 💡 カスタムツールチップで「レベル名」を表示 */}
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const record = payload[0].payload;
                    return (
                      <div className="bg-gray-900 text-white p-3 rounded-xl shadow-lg text-xs">
                        <p className="font-bold text-indigo-300 mb-1">
                          {record.level_title}
                        </p>
                        <p>日時: {record.formattedDate}</p>
                        <p className="text-base font-black text-green-400 mt-1">
                          正確性: {Math.round(record.accuracy)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 5, fill: "#4f46e5" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
