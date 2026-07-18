"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Level } from "../lib/typing-data";
import { Keyboard } from "./Keyboard";

interface TypingGameProps {
  level: Level;
  onFinish: (accuracy: number, isSuccess: boolean) => void;
  onCancel: () => void;
}

export function TypingGame({ level, onFinish, onCancel }: TypingGameProps) {
  const [targetText, setTargetText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((frequency: number, duration: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
    }
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, []);

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
    setCurrentIndex(0);
    setMistakes(0);
    setTimeLeft(60);
    setStatus("idle");
  }, [generateTargetText]);

  const endSession = useCallback((finalIndex: number, finalMistakes: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("finished");
    
    const totalAttempts = finalIndex + finalMistakes;
    const accuracy = totalAttempts > 0 ? (finalIndex / totalAttempts) * 100 : 0;
    const isSuccess = accuracy >= level.threshold;
    
    onFinish(accuracy, isSuccess);
  }, [level.threshold, onFinish]);

  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endSession(currentIndex, mistakes);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, currentIndex, mistakes, endSession]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === "finished") return;
      if (e.key === "Escape") {
        onCancel();
        return;
      }
      if (e.key.length !== 1) return;

      if (status === "idle") {
        setStatus("playing");
      }

      const expected = targetText[currentIndex];
      if (e.key === expected) {
        playSound(880, 0.1); // Success beep

        // 🟢 正解したときの処理の中
        /*const successAudio = new Audio("/success.mp3");
        successAudio.volume = 0.4;
        successAudio.currentTime = 0;
        successAudio.play().catch((err) => console.log("再生エラー:", err));
        */

        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        if (nextIndex >= targetText.length) {
          endSession(nextIndex, mistakes);
        }
      } else {
        //playSound(220, 0.1); // Failure beep



// 🟢 修正後：public フォルダに置いた mp3 ファイルを再生する処理
const audio = new Audio("/donaisitan.m4a"); // パスを指定
audio.volume = 0.5;                      // 音量調節（0.0 〜 1.0）
audio.currentTime = 0;                  // 連打された時のために再生位置を先頭に戻す
audio.play().catch((err) => console.log("オーディオ再生エラー:", err));


        setMistakes((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, currentIndex, targetText, playSound, endSession, onCancel, mistakes]);

  const accuracy = (currentIndex + mistakes) > 0 
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
            <p className={`text-2xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-gray-700'}`}>
              {timeLeft}s
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase">Accuracy</p>
            <p className="text-2xl font-mono font-bold text-blue-500">{accuracy}%</p>
          </div>
        </div>
      </div>

      <div className="w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100 min-h-[120px] flex items-center justify-center relative overflow-hidden">
        <div className="text-4xl font-mono tracking-[0.2em] whitespace-pre-wrap text-center">
          <span className="text-green-500 opacity-50">{targetText.slice(0, currentIndex)}</span>
          <span className="bg-blue-100 border-b-4 border-blue-600 px-1">{targetText[currentIndex]}</span>
          <span className="text-gray-300">{targetText.slice(currentIndex + 1, currentIndex + 10)}</span>
        </div>
        {status === "idle" && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <p className="text-xl font-medium text-blue-600 animate-bounce">
              Press any key to start!
            </p>
          </div>
        )}
      </div>

      <Keyboard 
        targetKey={targetText[currentIndex]} 
        highlightTarget={level.showHighlight} 
        homeKey={level.homeKey} 
      />

      <button
        onClick={onCancel}
        className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
      >
        Exit Practice (Esc)
      </button>
    </div>
  );
}
