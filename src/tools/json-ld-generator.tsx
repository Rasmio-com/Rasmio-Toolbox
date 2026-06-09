"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Select, TextArea, TextInput } from "@/components/tool/kit";

type Schema = "Article" | "Product" | "Organization" | "FAQPage" | "BreadcrumbList";

export default function JsonLdGeneratorTool() {
  const [schema, setSchema] = useState<Schema>("Article");
  const [f, setF] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const t = (k: string) => (f[k] ?? "").trim();

  const out = useMemo(() => {
    let obj: Record<string, unknown> = { "@context": "https://schema.org" };
    if (schema === "Article") {
      obj = { ...obj, "@type": "Article", headline: t("headline"), author: t("author") ? { "@type": "Person", name: t("author") } : undefined, datePublished: t("datePublished") || undefined, image: t("image") || undefined };
    } else if (schema === "Product") {
      obj = { ...obj, "@type": "Product", name: t("name"), description: t("description") || undefined, brand: t("brand") ? { "@type": "Brand", name: t("brand") } : undefined, offers: t("price") ? { "@type": "Offer", price: t("price"), priceCurrency: t("currency") || "IRR" } : undefined };
    } else if (schema === "Organization") {
      obj = { ...obj, "@type": "Organization", name: t("name"), url: t("url") || undefined, logo: t("logo") || undefined };
    } else if (schema === "FAQPage") {
      const pairs = (f.faq ?? "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const mainEntity = pairs.map((line) => {
        const [q, ...a] = line.split("|");
        return { "@type": "Question", name: (q ?? "").trim(), acceptedAnswer: { "@type": "Answer", text: a.join("|").trim() } };
      });
      obj = { ...obj, "@type": "FAQPage", mainEntity };
    } else {
      const items = (f.crumbs ?? "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const itemListElement = items.map((line, i) => {
        const [name, ...u] = line.split("|");
        return { "@type": "ListItem", position: i + 1, name: (name ?? "").trim(), item: u.join("|").trim() || undefined };
      });
      obj = { ...obj, "@type": "BreadcrumbList", itemListElement };
    }
    // Drop empty values.
    const clean = JSON.parse(JSON.stringify(obj, (_k, v) => (v === "" ? undefined : v)));
    return `<script type="application/ld+json">\n${JSON.stringify(clean, null, 2)}\n</script>`;
  }, [schema, f]);

  return (
    <div className="space-y-4">
      <Field label="نوع طرح‌واره (Schema)">
        <Select value={schema} onChange={(e) => setSchema(e.target.value as Schema)}>
          <option value="Article">Article (مقاله)</option>
          <option value="Product">Product (محصول)</option>
          <option value="Organization">Organization (سازمان)</option>
          <option value="FAQPage">FAQPage (پرسش‌های متداول)</option>
          <option value="BreadcrumbList">BreadcrumbList (مسیر راهنما)</option>
        </Select>
      </Field>

      {schema === "Article" && (
        <Grid2>
          <Field label="عنوان (headline)"><TextInput value={f.headline ?? ""} onChange={(e) => set("headline", e.target.value)} /></Field>
          <Field label="نویسنده"><TextInput value={f.author ?? ""} onChange={(e) => set("author", e.target.value)} /></Field>
          <Field label="تاریخ انتشار"><TextInput mono dir="ltr" value={f.datePublished ?? ""} onChange={(e) => set("datePublished", e.target.value)} placeholder="2025-01-31" /></Field>
          <Field label="تصویر (URL)"><TextInput mono dir="ltr" value={f.image ?? ""} onChange={(e) => set("image", e.target.value)} /></Field>
        </Grid2>
      )}
      {schema === "Product" && (
        <Grid2>
          <Field label="نام محصول"><TextInput value={f.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="برند"><TextInput value={f.brand ?? ""} onChange={(e) => set("brand", e.target.value)} /></Field>
          <Field label="قیمت"><TextInput mono dir="ltr" value={f.price ?? ""} onChange={(e) => set("price", e.target.value)} placeholder="100000" /></Field>
          <Field label="واحد پول"><TextInput mono dir="ltr" value={f.currency ?? ""} onChange={(e) => set("currency", e.target.value)} placeholder="IRR" /></Field>
          <Field label="توضیحات" className="lg:col-span-2"><TextInput value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field>
        </Grid2>
      )}
      {schema === "Organization" && (
        <Grid2>
          <Field label="نام سازمان"><TextInput value={f.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="آدرس سایت"><TextInput mono dir="ltr" value={f.url ?? ""} onChange={(e) => set("url", e.target.value)} /></Field>
          <Field label="لوگو (URL)" className="lg:col-span-2"><TextInput mono dir="ltr" value={f.logo ?? ""} onChange={(e) => set("logo", e.target.value)} /></Field>
        </Grid2>
      )}
      {schema === "FAQPage" && (
        <Field label="پرسش و پاسخ" hint="هر خط: پرسش | پاسخ">
          <TextArea mono={false} dir="auto" value={f.faq ?? ""} onChange={(e) => set("faq", e.target.value)} placeholder={"ساعت کاری چیست؟ | شنبه تا چهارشنبه ۹ تا ۱۷\nهزینه ارسال چقدر است؟ | رایگان"} />
        </Field>
      )}
      {schema === "BreadcrumbList" && (
        <Field label="مسیر راهنما" hint="هر خط: عنوان | آدرس">
          <TextArea mono={false} dir="auto" value={f.crumbs ?? ""} onChange={(e) => set("crumbs", e.target.value)} placeholder={"خانه | https://example.com\nوبلاگ | https://example.com/blog"} />
        </Field>
      )}

      <Output label="خروجی JSON-LD" value={out} download={{ filename: "json-ld.html" }} />
    </div>
  );
}
