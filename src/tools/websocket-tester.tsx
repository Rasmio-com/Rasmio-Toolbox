"use client";

import { useEffect, useRef, useState } from "react";
import { Plug, PlugZap, Send, X } from "lucide-react";
import { Button, ErrorNote, Field, Panel, TextInput } from "@/components/tool/kit";

type State = "closed" | "connecting" | "open" | "closing";

interface Msg {
  dir: "in" | "out" | "sys";
  text: string;
  at: string;
}

const STATE_FA: Record<State, string> = {
  closed: "قطع",
  connecting: "در حال اتصال…",
  open: "متصل",
  closing: "در حال قطع…",
};

const STATE_CLS: Record<State, string> = {
  closed: "border-border bg-bg-soft text-muted",
  connecting: "border-saffron/40 bg-saffron/10 text-saffron",
  open: "border-success/40 bg-success/10 text-success",
  closing: "border-saffron/40 bg-saffron/10 text-saffron",
};

export default function WebsocketTesterTool() {
  const [url, setUrl] = useState<string>("wss://echo.websocket.events");
  const [state, setState] = useState<State>("closed");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [outgoing, setOutgoing] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);

  const now = () => new Date().toLocaleTimeString("en-US", { hour12: false });
  const log = (dir: Msg["dir"], text: string) =>
    setMsgs((m) => [...m, { dir, text, at: now() }]);

  const cleanup = () => {
    const ws = wsRef.current;
    if (ws) {
      ws.onopen = ws.onmessage = ws.onerror = ws.onclose = null;
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close();
    }
    wsRef.current = null;
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  const connect = () => {
    const u = url.trim();
    if (!u) return;
    if (!/^wss?:\/\//i.test(u)) {
      setErr("آدرس باید با ws:// یا wss:// شروع شود.");
      return;
    }
    setErr("");
    cleanup();
    setState("connecting");
    try {
      const ws = new WebSocket(u);
      wsRef.current = ws;
      ws.onopen = () => {
        setState("open");
        log("sys", "اتصال برقرار شد.");
      };
      ws.onmessage = (ev: MessageEvent) => {
        const data = typeof ev.data === "string" ? ev.data : "[داده دودویی]";
        log("in", data);
      };
      ws.onerror = () => setErr("خطا در اتصال WebSocket.");
      ws.onclose = (ev: CloseEvent) => {
        setState("closed");
        log("sys", `اتصال بسته شد${ev.code ? ` (کد ${ev.code})` : ""}.`);
      };
    } catch {
      setState("closed");
      setErr("ایجاد اتصال WebSocket ناموفق بود.");
    }
  };

  const disconnect = () => {
    setState("closing");
    cleanup();
    setState("closed");
  };

  const send = () => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(outgoing);
    log("out", outgoing);
    setOutgoing("");
  };

  const connected = state === "open";

  return (
    <div className="space-y-4">
      <Field label="آدرس WebSocket">
        <div className="flex flex-wrap gap-2">
          <TextInput
            mono
            dir="ltr"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={state !== "closed"}
            placeholder="wss://example.com/socket"
            className="min-w-0 flex-1"
          />
          {state === "closed" ? (
            <Button variant="primary" onClick={connect} className="gap-1.5">
              <PlugZap className="size-4" />
              اتصال
            </Button>
          ) : (
            <Button variant="danger" onClick={disconnect} className="gap-1.5">
              <X className="size-4" />
              قطع اتصال
            </Button>
          )}
        </div>
      </Field>

      <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${STATE_CLS[state]}`}>
        <Plug className="size-4" />
        وضعیت: {STATE_FA[state]}
      </div>

      {err && <ErrorNote>{err}</ErrorNote>}

      <Field label="ارسال پیام">
        <div className="flex gap-2">
          <TextInput
            mono
            dir="ltr"
            value={outgoing}
            onChange={(e) => setOutgoing(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={!connected}
            placeholder="متن پیام…"
          />
          <Button variant="secondary" onClick={send} disabled={!connected} className="gap-1.5">
            <Send className="size-4" />
            ارسال
          </Button>
        </div>
      </Field>

      <Panel title={`پیام‌ها (${msgs.length})`}>
        {msgs.length === 0 ? (
          <p className="text-sm text-faint">هنوز پیامی رد‌و‌بدل نشده است.</p>
        ) : (
          <div className="max-h-72 space-y-1.5 overflow-y-auto" dir="ltr">
            {msgs.map((m, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="w-20 shrink-0 font-mono text-xs text-faint">{m.at}</span>
                <span
                  className={`w-12 shrink-0 text-xs font-semibold ${
                    m.dir === "in" ? "text-success" : m.dir === "out" ? "text-turquoise" : "text-muted"
                  }`}
                >
                  {m.dir === "in" ? "◀ دریافت" : m.dir === "out" ? "▶ ارسال" : "سیستم"}
                </span>
                <code className="min-w-0 flex-1 break-all text-fg">{m.text}</code>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
