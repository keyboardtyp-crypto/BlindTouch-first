// app/layout.tsx

import "./globals.css"; // 👈 これがスタイルシートを読み込む最重要行です
//import "@/app/globals.css";


export const metadata = {
  title: "Blind Touch",
  description: "Touch typing practice app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}