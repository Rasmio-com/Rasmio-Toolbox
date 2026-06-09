"use client";

import { useEffect, useState } from "react";
import { Stat } from "@/components/tool/kit";

interface Snapshot {
  rows: { label: string; value: string }[];
}

function snapshot(): Snapshot {
  const orient =
    (screen.orientation && screen.orientation.type) ||
    (innerWidth >= innerHeight ? "افقی (landscape)" : "عمودی (portrait)");
  return {
    rows: [
      { label: "عرض صفحه", value: `${screen.width}px` },
      { label: "ارتفاع صفحه", value: `${screen.height}px` },
      { label: "عرض قابل‌استفاده", value: `${screen.availWidth}px` },
      { label: "ارتفاع قابل‌استفاده", value: `${screen.availHeight}px` },
      { label: "عرض viewport", value: `${innerWidth}px` },
      { label: "ارتفاع viewport", value: `${innerHeight}px` },
      { label: "نسبت پیکسل", value: String(devicePixelRatio) },
      { label: "عمق رنگ", value: `${screen.colorDepth}-bit` },
      { label: "جهت‌گیری", value: orient },
      { label: "وضعیت اتصال", value: navigator.onLine ? "آنلاین" : "آفلاین" },
    ],
  };
}

export default function ScreenInfoTool() {
  const [snap, setSnap] = useState<Snapshot | null>(null);

  useEffect(() => {
    const update = () => setSnap(snapshot());
    update();
    window.addEventListener("resize", update);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    screen.orientation?.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      screen.orientation?.removeEventListener("change", update);
    };
  }, []);

  if (!snap) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {snap.rows.map((r) => (
        <Stat
          key={r.label}
          label={r.label}
          value={<span dir="ltr" className="text-xl">{r.value}</span>}
        />
      ))}
    </div>
  );
}
