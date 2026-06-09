import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "coordinate-converter",
    title: "تبدیل مختصات",
    titleEn: "Coordinate Converter",
    description:
      "تبدیل دوطرفهٔ مختصات بین درجهٔ اعشاری و فرمت درجه/دقیقه/ثانیه (DMS) با جهت‌های N/S/E/W.",
    category: "geo",
    keywords: [
      "مختصات",
      "coordinate",
      "dms",
      "decimal degrees",
      "latitude",
      "longitude",
      "عرض جغرافیایی",
      "طول جغرافیایی",
    ],
  },
  {
    id: "geo-distance",
    title: "فاصلهٔ جغرافیایی",
    titleEn: "Geo Distance",
    description:
      "محاسبهٔ فاصلهٔ هاورساین بین دو نقطه (کیلومتر و مایل) به‌همراه زاویهٔ سمت اولیه و جهت قطب‌نما.",
    category: "geo",
    keywords: [
      "فاصله",
      "distance",
      "haversine",
      "bearing",
      "سمت",
      "قطب‌نما",
      "lat lng",
      "کیلومتر",
    ],
  },
  {
    id: "geohash",
    title: "جئوهش",
    titleEn: "Geohash",
    description:
      "کدگذاری مختصات به Geohash با دقت دلخواه و رمزگشایی Geohash به مرکز و کادر محدودکننده.",
    category: "geo",
    keywords: [
      "geohash",
      "جئوهش",
      "encode",
      "decode",
      "bounding box",
      "مختصات",
      "lat lng",
      "دقت",
    ],
  },
  {
    id: "polyline",
    title: "پلی‌لاین گوگل",
    titleEn: "Polyline Encoder/Decoder",
    description:
      "کدگذاری فهرستی از نقاط lat,lng به رشتهٔ Polyline گوگل و رمزگشایی رشتهٔ Polyline به نقاط.",
    category: "geo",
    keywords: [
      "polyline",
      "پلی‌لاین",
      "google",
      "encode",
      "decode",
      "مسیر",
      "نقاط",
      "lat lng",
    ],
  },
  {
    id: "geojson-tools",
    title: "ابزار GeoJSON",
    titleEn: "GeoJSON Tools",
    description:
      "اعتبارسنجی GeoJSON، زیباسازی و فشرده‌سازی، نمایش تعداد ویژگی‌ها و محاسبهٔ کادر محدودکننده.",
    category: "geo",
    keywords: [
      "geojson",
      "ژئوجیسون",
      "validate",
      "bounding box",
      "feature",
      "minify",
      "pretty",
      "نقشه",
    ],
  },
];
