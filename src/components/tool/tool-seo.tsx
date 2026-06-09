import type { ToolContent } from "@/lib/tools/types";

/** Server-rendered SEO/explanatory content shown at the bottom of a tool page. */
export function ToolSeo({
  content,
  title,
}: {
  content: ToolContent;
  title: string;
}) {
  return (
    <section className="mt-14 space-y-10 border-t border-border pt-10">
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-fg">معرفی {title}</h2>
        <p className="leading-loose text-muted">{content.intro}</p>
      </div>

      {content.usages?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-fg">کاربردها</h2>
          <ul className="space-y-2">
            {content.usages.map((u, i) => (
              <li key={i} className="flex gap-2.5 text-muted">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-turquoise" />
                <span className="leading-relaxed">{u}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.guide?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-fg">راهنمای استفاده و گزینه‌ها</h2>
          <dl className="space-y-3">
            {content.guide.map((g, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface/40 p-4">
                <dt className="font-semibold text-fg">{g.title}</dt>
                <dd className="mt-1 leading-relaxed text-muted">{g.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {content.tips && content.tips.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-fg">نکات</h2>
          <ul className="space-y-2">
            {content.tips.map((t, i) => (
              <li key={i} className="flex gap-2.5 text-muted">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-saffron" />
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {content.faq?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-fg">پرسش‌های متداول</h2>
          <div className="space-y-2.5">
            {content.faq.map((f, i) => (
              <details
                key={i}
                className="group rounded-xl border border-border bg-surface/40 p-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-fg [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="shrink-0 text-faint transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
