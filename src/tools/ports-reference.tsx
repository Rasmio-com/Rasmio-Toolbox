"use client";

import { useMemo, useState } from "react";
import { Field, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

type Port = { port: number; proto: string; service: string; note: string };

const PORTS: Port[] = [
  { port: 20, proto: "TCP", service: "FTP-DATA", note: "انتقال دادهٔ FTP" },
  { port: 21, proto: "TCP", service: "FTP", note: "کنترل FTP" },
  { port: 22, proto: "TCP", service: "SSH", note: "اتصال امن و SFTP" },
  { port: 23, proto: "TCP", service: "Telnet", note: "ترمینال ناامن" },
  { port: 25, proto: "TCP", service: "SMTP", note: "ارسال ایمیل" },
  { port: 53, proto: "TCP/UDP", service: "DNS", note: "سامانهٔ نام دامنه" },
  { port: 67, proto: "UDP", service: "DHCP", note: "سرور تخصیص IP" },
  { port: 68, proto: "UDP", service: "DHCP", note: "کلاینت DHCP" },
  { port: 69, proto: "UDP", service: "TFTP", note: "انتقال فایل ساده" },
  { port: 80, proto: "TCP", service: "HTTP", note: "وب بدون رمزنگاری" },
  { port: 110, proto: "TCP", service: "POP3", note: "دریافت ایمیل" },
  { port: 123, proto: "UDP", service: "NTP", note: "همگام‌سازی زمان" },
  { port: 135, proto: "TCP", service: "RPC", note: "RPC مایکروسافت" },
  { port: 137, proto: "UDP", service: "NetBIOS", note: "نام NetBIOS" },
  { port: 139, proto: "TCP", service: "NetBIOS", note: "جلسهٔ NetBIOS" },
  { port: 143, proto: "TCP", service: "IMAP", note: "دسترسی به ایمیل" },
  { port: 161, proto: "UDP", service: "SNMP", note: "مدیریت شبکه" },
  { port: 162, proto: "UDP", service: "SNMP Trap", note: "تله‌های SNMP" },
  { port: 179, proto: "TCP", service: "BGP", note: "مسیریابی بین دامنه" },
  { port: 389, proto: "TCP/UDP", service: "LDAP", note: "سرویس دایرکتوری" },
  { port: 443, proto: "TCP", service: "HTTPS", note: "وب امن (TLS)" },
  { port: 445, proto: "TCP", service: "SMB", note: "اشتراک فایل ویندوز" },
  { port: 465, proto: "TCP", service: "SMTPS", note: "ارسال ایمیل امن" },
  { port: 514, proto: "UDP", service: "Syslog", note: "لاگ سیستم" },
  { port: 587, proto: "TCP", service: "SMTP", note: "ارسال ایمیل (submission)" },
  { port: 631, proto: "TCP", service: "IPP", note: "چاپ تحت شبکه" },
  { port: 636, proto: "TCP", service: "LDAPS", note: "LDAP امن" },
  { port: 993, proto: "TCP", service: "IMAPS", note: "IMAP امن" },
  { port: 995, proto: "TCP", service: "POP3S", note: "POP3 امن" },
  { port: 1080, proto: "TCP", service: "SOCKS", note: "پراکسی SOCKS" },
  { port: 1194, proto: "UDP", service: "OpenVPN", note: "تونل VPN" },
  { port: 1433, proto: "TCP", service: "MSSQL", note: "SQL Server" },
  { port: 1521, proto: "TCP", service: "Oracle", note: "پایگاه‌دادهٔ اوراکل" },
  { port: 2049, proto: "TCP", service: "NFS", note: "سیستم فایل شبکه" },
  { port: 2375, proto: "TCP", service: "Docker", note: "API داکر (ناامن)" },
  { port: 2376, proto: "TCP", service: "Docker", note: "API داکر (TLS)" },
  { port: 3000, proto: "TCP", service: "Dev", note: "سرور توسعه (Node/React)" },
  { port: 3306, proto: "TCP", service: "MySQL", note: "پایگاه‌دادهٔ MySQL/MariaDB" },
  { port: 3389, proto: "TCP", service: "RDP", note: "دسکتاپ راه دور ویندوز" },
  { port: 5432, proto: "TCP", service: "PostgreSQL", note: "پایگاه‌دادهٔ PostgreSQL" },
  { port: 5601, proto: "TCP", service: "Kibana", note: "داشبورد Kibana" },
  { port: 5672, proto: "TCP", service: "AMQP", note: "RabbitMQ" },
  { port: 6379, proto: "TCP", service: "Redis", note: "پایگاه‌دادهٔ Redis" },
  { port: 8080, proto: "TCP", service: "HTTP-alt", note: "وب جایگزین/پراکسی" },
  { port: 8443, proto: "TCP", service: "HTTPS-alt", note: "HTTPS جایگزین" },
  { port: 9000, proto: "TCP", service: "Dev", note: "PHP-FPM/SonarQube" },
  { port: 9200, proto: "TCP", service: "Elasticsearch", note: "API الستیک‌سرچ" },
  { port: 11211, proto: "TCP/UDP", service: "Memcached", note: "کش حافظه" },
  { port: 27017, proto: "TCP", service: "MongoDB", note: "پایگاه‌دادهٔ MongoDB" },
];

export default function PortsReferenceTool() {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const raw = q.trim();
    const t = toAsciiDigits(raw).toLowerCase();
    if (!t) return PORTS;
    return PORTS.filter(
      (p) =>
        String(p.port).includes(t) ||
        p.service.toLowerCase().includes(t) ||
        p.proto.toLowerCase().includes(t) ||
        p.note.includes(raw),
    );
  }, [q]);

  return (
    <div className="space-y-4">
      <Field label="جست‌وجو" hint="شماره پورت، سرویس یا پروتکل">
        <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="443  یا  ssh  یا  mysql" />
      </Field>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-xs text-muted">
            <tr>
              <th className="px-3 py-2 text-left" dir="ltr">Port</th>
              <th className="px-3 py-2 text-left" dir="ltr">Proto</th>
              <th className="px-3 py-2 text-left" dir="ltr">Service</th>
              <th className="px-3 py-2 text-right">توضیح</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={`${p.port}-${p.service}`} className="border-t border-border odd:bg-bg-soft/40">
                <td className="px-3 py-1.5 font-mono font-semibold tabular-nums text-turquoise" dir="ltr">{p.port}</td>
                <td className="px-3 py-1.5 font-mono text-xs text-muted" dir="ltr">{p.proto}</td>
                <td className="px-3 py-1.5 font-mono text-saffron" dir="ltr">{p.service}</td>
                <td className="px-3 py-1.5 text-right text-muted">{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="py-8 text-center text-sm text-muted">نتیجه‌ای یافت نشد.</p>}
      </div>
    </div>
  );
}
