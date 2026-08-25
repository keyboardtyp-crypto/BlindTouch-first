"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Level } from "@/lib/typing-data";
import { Keyboard } from "./Keyboard";

interface TypingGameProps {
  level: Level;
  onFinish: (accuracy: number, isSuccess: boolean) => void;
  onCancel: () => void;
}

export function BlindTypingGame({ level, onFinish, onCancel }: TypingGameProps) {
  const [targetText, setTargetText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [showKeyboard, setShowKeyboard] = useState(false);

  const currentIndexRef = useRef(0);
  const mistakesRef = useRef(0);
  const statusRef = useRef(status);

  currentIndexRef.current = currentIndex;
  mistakesRef.current = mistakes;
  statusRef.current = status;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateTargetText = useCallback(() => {
    const chars = level.keys.split("");
    let text = "";
    for (let i = 0; i < 50; i++) {
      text += chars[Math.floor(Math.random() * chars.length)];
    }
    return text;
  }, [level.keys]);

  useEffect(() => {
    setTargetText(generateTargetText());
  }, [generateTargetText]);

  const endSession = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("finished");

    const totalAttempts = currentIndexRef.current + mistakesRef.current;
    const accuracy = totalAttempts > 0 ? (currentIndexRef.current / totalAttempts) * 100 : 0;
    const isSuccess = accuracy >= level.threshold;

    onFinish(accuracy, isSuccess);
  }, [level.threshold, onFinish]);

  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, endSession]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (statusRef.current === "finished") return;
      if (e.key === "Escape") {
        onCancel();
        return;
      }

      // -------------------------------------------------------------
      // 💡 修正1: Space または Enter でスタート（打鍵ミス判定に巻き込まない）
      // -------------------------------------------------------------
      if (statusRef.current === "idle") {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          setStatus("playing");
        }
        return;
      }

      if (e.key.length !== 1) return;

      const expected = targetText[currentIndexRef.current];
      if (e.key === expected) {
        const nextIndex = currentIndexRef.current + 1;
        setCurrentIndex(nextIndex);
        setShowKeyboard(false);

        if (nextIndex >= targetText.length) {
          endSession();
        }
      } else {
        const audio = new Audio("/donaisitan.m4a");
        audio.volume = 0.5;
        audio.currentTime = 0;
        audio.play().catch(() => {});

        setMistakes((prev) => prev + 1);
        setShowKeyboard(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [targetText, endSession, onCancel]);

  const accuracy =
    currentIndex + mistakes > 0
      ? Math.round((currentIndex / (currentIndex + mistakes)) * 100)
      : 100;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
      <div className="flex justify-between w-full px-4 items-center">
        <div className="text-left">
          <h2 className="text-xl font-bold text-gray-800">{level.title}</h2>
          <p className="text-sm text-gray-500">Threshold: {level.threshold}%</p>
        </div>
        <div className="flex gap-8 items-center">
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase">Time</p>
            <p className={`text-2xl font-mono font-bold ${timeLeft < 10 ? "text-red-500" : "text-gray-700"}`}>
              {timeLeft}s
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase">Accuracy</p>
            <p className="text-2xl font-mono font-bold text-blue-500">{accuracy}%</p>
          </div>
        </div>
      </div>

      <div className="w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100 min-h-[140px] flex items-center justify-center relative">
        {/* 文字列を常に表示 */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 text-3xl font-mono leading-relaxed break-all max-w-full">
          {targetText.split("").map((char, index) => {
            if (index < currentIndex) {
              return <span key={index} className="text-green-500 opacity-60">{char === " " ? "␣" : char}</span>;
            }
            if (index === currentIndex) {
              return (
                <span key={index} className="bg-blue-600 text-white font-bold rounded px-2 py-0.5 shadow-md animate-pulse">
                  {char === " " ? "␣" : char}
                </span>
              );
            }
            return <span key={index} className="text-gray-300">{char === " " ? "␣" : char}</span>;
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 💡 修正2: 画面下部に小さく指示を表示（背景を透過させ文字を隠さない） */}
        {/* ------------------------------------------------------------- */}
        {status === "idle" && (
          <div 
            onClick={() => setStatus("playing")}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm cursor-pointer animate-bounce"
          >
            Press Space / Enter (or Click here) to start!
          </div>
        )}
      </div>

      {showKeyboard ? (
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <p className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            ⚠️ ミス！正解キーの位置を確認してください
          </p>
          <Keyboard
            targetKey={targetText[currentIndex]}
            highlightTarget={level.showHighlight}
            homeKey={level.homeKey}
          />
        </div>
      ) : (
        <div className="min-h-[220px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl w-full max-w-2xl bg-gray-50/50">
          <p className="text-sm font-medium text-gray-400">
            🙈 画面を見ずにキーを叩いてください（間違えるとキーボードが表示されます）
          </p>
        </div>
      )}

      <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">
        Exit Practice (Esc)
      </button>
    </div>
  );
}
