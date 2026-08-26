"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FINGER_STAGES } from "@/lib/typing-data"; // ファイルパスはプロジェクト構造に合わせて調整してください

// 各ステージの表示用ラベル定義
const STAGE_LABELS: Record<number, string> = {
  1: "右手人差し指",
  2: "左手人差し指",
  3: "右手中指",
  4: "左手中指",
  5: "右手薬指",
  6: "左手薬指",
  7: "右手小指",
  8: "左手小指",
  9: "人差し指 左右混合",
  10: "人差し指＋中指 混合",
  11: "人差し指＋中指＋薬指 混合",
  12: "全指 混合",
};

export default function FingerPage() {
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [clearedSteps, setClearedSteps] = useState<Record<string, boolean>>({});

  // ユーザーのクリア状況をローカルストレージ等から取得（必要に応じて実装）
  useEffect(() => {
    const savedProgress = localStorage.getItem("finger_progress");
    if (savedProgress) {
      try {
        setClearedSteps(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);

  // 選択中のステージのステップ一覧を取得
  const currentSteps = FINGER_STAGES.filter(
    (stage) => stage.stage === selectedStage
  );

  // 全ステージID一覧を取得（重複排除）
  const stageIds = Array.from(
    new Set(FINGER_STAGES.map((s) => s.stage))
  ).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              👈 各指強化モード
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              一本ずつ指のホームポジションと可動域を鍛えます
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            トップへ戻る
          </Link>
        </div>

        {/* ステージ選択タブ */}
        <div className="flex flex-wrap gap-2 p-2 bg-white rounded-2xl shadow-sm border border-slate-100">
          {stageIds.map((stageNum) => (
            <button
              key={stageNum}
              onClick={() => setSelectedStage(stageNum)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedStage === stageNum
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {STAGE_LABELS[stageNum] || `Stage ${stageNum}`}
            </button>
          ))}
        </div>

        {/* ステップカード一覧 */}
        <div className="grid gap-4 md:grid-cols-2">
          {currentSteps.map((stepItem) => {
            const isCleared = !!clearedSteps[stepItem.id];

            return (
              <Link
                key={stepItem.id}
                href={`/finger/play?id=${stepItem.id}`}
                className={`group block p-5 bg-white rounded-2xl border transition-all duration-200 hover:shadow-md ${
                  isCleared
                    ? "border-emerald-200 bg-emerald-50/20"
                    : "border-slate-100 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-1 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg mb-2">
                      Step {stepItem.step}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                      {stepItem.title}
                    </h3>
                  </div>
                  {isCleared && (
                    <span className="text-xl" title="クリア済み">
                      ✅
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>対象キー: <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">{stepItem.keys}</code></span>
                  <span>合格基準: {stepItem.threshold}%</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
