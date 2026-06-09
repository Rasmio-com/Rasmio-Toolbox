import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "feature-detector",
    title: "تشخیص قابلیت‌ها",
    titleEn: "Feature Detector",
    description:
      "نمایش جدول پشتیبانی مرورگر از قابلیت‌هایی مانند WebGL، WebGPU، WebRTC، WebAssembly و موارد دیگر.",
    category: "browser",
    keywords: ["feature", "قابلیت", "webgl", "webgpu", "webrtc", "wasm", "پشتیبانی", "support"],
  },
  {
    id: "screen-info",
    title: "اطلاعات صفحه",
    titleEn: "Screen Info",
    description:
      "نمایش زنده ابعاد صفحه و پنجره، نسبت پیکسل، عمق رنگ، جهت‌گیری و وضعیت اتصال.",
    category: "browser",
    keywords: ["screen", "صفحه", "viewport", "resolution", "وضوح", "devicePixelRatio", "orientation"],
  },
  {
    id: "keycode-inspector",
    title: "بازرس کلید",
    titleEn: "Keycode Inspector",
    description:
      "نمایش key، code، keyCode و کلیدهای تغییردهنده (Ctrl/Alt/Shift/Meta) برای هر کلید فشرده‌شده.",
    category: "browser",
    keywords: ["keycode", "کلید", "keyboard", "صفحه‌کلید", "event.key", "event.code", "keydown"],
  },
];
