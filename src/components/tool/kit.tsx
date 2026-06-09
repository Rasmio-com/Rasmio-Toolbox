"use client";

import {
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { Check, Copy, Download, X } from "lucide-react";
import { cn, copyText, downloadFile } from "@/lib/utils";

/* ── Button ─────────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-turquoise text-bg font-semibold hover:bg-turquoise-bright shadow-[0_6px_20px_-8px] shadow-turquoise/60",
  secondary:
    "bg-surface-2 text-fg border border-border hover:border-turquoise-dim hover:bg-surface-3",
  ghost: "text-muted hover:text-fg hover:bg-surface-2",
  danger: "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
};

export function Button({
  variant = "secondary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

/* ── Panel ──────────────────────────────────────────────── */

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-surface/70 p-4 sm:p-5",
        className,
      )}
    >
      {(title || actions) && (
        <header className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h3 className="truncate text-sm font-semibold text-fg">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

/* ── Field ──────────────────────────────────────────────── */

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="flex items-baseline justify-between gap-2 text-xs font-medium text-muted"
        >
          <span>{label}</span>
          {hint && <span className="text-faint">{hint}</span>}
        </label>
      )}
      {children}
    </div>
  );
}

/* ── Inputs ─────────────────────────────────────────────── */

export function TextInput({
  className,
  mono,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }) {
  return (
    <input
      className={cn("field", mono && "field-mono", className)}
      spellCheck={false}
      autoComplete="off"
      {...props}
    />
  );
}

export function TextArea({
  className,
  mono = true,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { mono?: boolean }) {
  return (
    <textarea
      className={cn(
        "field min-h-40 resize-y leading-relaxed",
        mono && "field-mono",
        className,
      )}
      spellCheck={false}
      dir="ltr"
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: InputHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={cn("field cursor-pointer pe-8", className)} {...props}>
      {children}
    </select>
  );
}

/* ── Segmented control ──────────────────────────────────── */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-border bg-bg-soft p-1",
        className,
      )}
      role="tablist"
    >
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors",
            value === o.value
              ? "bg-turquoise text-bg font-semibold"
              : "text-muted hover:text-fg",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Toggle (switch) ────────────────────────────────────── */

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
    >
      <span
        className={cn(
          "relative h-5 w-9 rounded-full border transition-colors",
          checked
            ? "border-turquoise-dim bg-turquoise/30"
            : "border-border bg-surface-2",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-3.5 rounded-full transition-all",
            checked ? "start-4 bg-turquoise" : "start-0.5 bg-faint",
          )}
        />
      </span>
      {label}
    </button>
  );
}

/* ── Copy button ────────────────────────────────────────── */

export function CopyButton({
  value,
  className,
  label = "کپی",
}: {
  value: string;
  className?: string;
  label?: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      disabled={!value}
      onClick={async () => {
        if (await copyText(value)) {
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-turquoise-dim hover:text-fg disabled:opacity-40",
        className,
      )}
    >
      {done ? (
        <Check className="size-3.5 text-success" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {done ? "کپی شد" : label}
    </button>
  );
}

export function DownloadButton({
  value,
  filename,
  mime,
  label = "دانلود",
}: {
  value: string;
  filename: string;
  mime?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      disabled={!value}
      onClick={() => downloadFile(value, filename, mime)}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-turquoise-dim hover:text-fg disabled:opacity-40"
    >
      <Download className="size-3.5" />
      {label}
    </button>
  );
}

/* ── Output area (read-only with copy) ──────────────────── */

export function Output({
  value,
  label,
  placeholder = "خروجی اینجا نمایش داده می‌شود",
  mono = true,
  className,
  download,
}: {
  value: string;
  label?: ReactNode;
  placeholder?: string;
  mono?: boolean;
  className?: string;
  download?: { filename: string; mime?: string };
}) {
  return (
    <Field
      label={label}
      className="h-full"
      hint={
        <span className="flex items-center gap-2">
          {download && value && (
            <DownloadButton
              value={value}
              filename={download.filename}
              mime={download.mime}
            />
          )}
          <CopyButton value={value} />
        </span>
      }
    >
      <textarea
        readOnly
        dir="ltr"
        value={value}
        placeholder={placeholder}
        className={cn(
          "field min-h-40 w-full resize-y leading-relaxed",
          mono && "field-mono",
          !value && "text-faint",
          className,
        )}
      />
    </Field>
  );
}

/* ── Misc ───────────────────────────────────────────────── */

export function Stat({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-bg-soft px-4 py-3">
      <div className="text-2xl font-bold tabular-nums text-turquoise">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
      {children}
    </p>
  );
}

export function Grid2({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-2">{children}</div>;
}

/** Pass/fail result banner. `valid === null` renders nothing (empty input). */
export function Verdict({
  valid,
  validText = "معتبر است",
  invalidText = "نامعتبر است",
  children,
}: {
  valid: boolean | null;
  validText?: string;
  invalidText?: string;
  children?: ReactNode;
}) {
  if (valid === null) return null;
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3",
        valid
          ? "border-success/40 bg-success/10 text-success"
          : "border-danger/40 bg-danger/10 text-danger",
      )}
    >
      <div className="flex items-center gap-2 font-semibold">
        {valid ? <Check className="size-5" /> : <X className="size-5" />}
        {valid ? validText : invalidText}
      </div>
      {children && <div className="mt-1.5 text-sm text-fg">{children}</div>}
    </div>
  );
}
