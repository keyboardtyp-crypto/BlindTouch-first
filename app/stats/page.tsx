"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TypingResult {
  id: number;
  level_id: string;
  accuracy: number;
  created_at: string;
}

export default function StatsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchResults = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Supabase の typing_results から日時順（古い順→最新順）で取得
      const { data: results, error } = await supabase
        .from("typing_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ 履歴取得エラー:", error.message);
      } else if (results) {
        // グラフ描画用に日本時間の日付・時刻フォーマットを作成
        const formattedData = results.map((item: TypingResult) => {
          const date = new Date(item.created_at);
          const displayDate = `${date.getMonth() + 1}/${date.getDate()} ${String(
            date.getHours()
          ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

          return {
            ...item,
            displayDate,
          };
        });
        setData(formattedData);
      }
      setLoading(false);
    };

    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* ヘッダー領域 */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Practice Stats
          </h1>
          <p className="text-sm text-gray-500">タイピング精度の成長記録</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md hover:shadow-indigo-100 flex items-center gap-1"
        >
          ← 練習画面に戻る
        </Link>
      </header>

      {/* メイングラフカード */}
      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
        {loading ? (
          <div className="h-72 flex items-center justify-center text-gray-400 animate-pulse">
            データを読み込み中...
          </div>
        ) : data.length === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center text-gray-400 gap-4">
            <p>まだプレイ履歴がありません。</p>
            <Link
              href="/"
              className="text-indigo-600 hover:underline text-sm font-bold"
            >
              タイピング練習を始める 🚀
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">正確性 (%) の推移</h2>
              <p className="text-xs font-bold text-gray-400">総プレイ回数: {data.length} 回</p>
            </div>
            
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="displayDate" stroke="#9ca3af" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={12} unit="%" />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, "正確性"]}
                    labelFormatter={(label) => `日時: ${label}`}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#4f46e5" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
