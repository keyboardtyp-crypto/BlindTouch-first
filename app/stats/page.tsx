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
  id: string;
  created_at: string;
  accuracy: number;
  level_id: string;
  level_title: string;
  formattedDate: string;
};

export default function StatsPage() {
  const [data, setData] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);

    const fetchHistory = async () => {
      // ログインユーザーの確認
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // 1. practice_history からユーザーの履歴を取得
      const { data: history, error } = await supabase
        .from("practice_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error || !history || history.length === 0) {
        setLoading(false);
        return;
      }

      // 2. STAGES と BLIND_STAGES からレベル名を検索して付与
      const allStages = [...STAGES, ...BLIND_STAGES];
      const formatted = history.map((item: any) => {
        const levelObj = allStages.find((s) => s.id === item.level_id);
        const title = levelObj ? levelObj.title : `Level ${item.level_id}`;

        const dateObj = new Date(item.created_at);
        const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()} ${String(
          dateObj.getHours()
        ).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`;

        return {
          id: item.id || Math.random().toString(),
          created_at: item.created_at,
          accuracy: Number(item.accuracy) || 0,
          level_id: item.level_id,
          level_title: title,
          formattedDate: dateStr,
        };
      });

      setData(formatted);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-xl flex flex-col gap-8">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800">Practice Stats</h1>
            <p className="text-sm text-gray-500">タイピング精度の成長記録</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-md"
          >
            ← 練習画面に戻る
          </Link>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400 font-medium animate-pulse">
            データを読み込み中...
          </div>
        ) : data.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-2 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="font-bold text-gray-500">まだ練習記録がありません</p>
            <p className="text-xs text-gray-400">練習をプレイすると、ここにグラフと履歴が表示されます。</p>
          </div>
        ) : (
          <>
            {/* 📊 グラフエリア */}
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: "#888888" }} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: "#888888" }} />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const record = payload[0].payload as HistoryRecord;
                        return (
                          <div className="bg-gray-900 text-white p-3 rounded-xl shadow-lg text-xs border border-gray-700">
                            <p className="font-bold text-indigo-300 mb-1">
                              {record.level_title}
                            </p>
                            <p className="text-gray-300">日時: {record.formattedDate}</p>
                            <p className="text-sm font-black text-green-400 mt-1">
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
                    dot={{ r: 4, fill: "#4f46e5" }}
                    activeDot={{ r: 7, fill: "#6366f1" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 📋 レベル別・日付別の詳細履歴リスト */}
            <div className="mt-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">直近の練習履歴一覧</h3>
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-100 font-bold text-gray-400">
                    <tr>
                      <th className="p-3">日時</th>
                      <th className="p-3">レベル / モード</th>
                      <th className="p-3 text-right">正確性</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.slice().reverse().map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-mono text-gray-400">{record.formattedDate}</td>
                        <td className="p-3 font-bold text-gray-800">{record.level_title}</td>
                        <td className="p-3 text-right font-mono font-bold text-indigo-600">
                          {Math.round(record.accuracy)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
