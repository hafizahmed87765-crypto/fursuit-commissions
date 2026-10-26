import "server-only";
import nodemailer from "nodemailer";

export type Attachment = { filename: string; content: Buffer; contentType: string };

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.OWNER_EMAIL);
}

let transport: nodemailer.Transporter | null = null;
function getTransport() {
  if (!transport) {
    const port = Number(process.env.SMTP_PORT || 465);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transport;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Renders label/value pairs as a simple table so the studio can scan it. */
export function renderRows(rows: [string, string | undefined][]) {
  const filled = rows.filter(([, v]) => v && v.trim());
  const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${filled
    .map(([k, v]) => `<tr><th align="left" valign="top" style="background:#D1FADF;color:#21463F">${esc(k)}</th><td style="white-space:pre-wrap">${esc(v!)}</td></tr>`)
    .join("")}</table>`;
  const text = filled.map(([k, v]) => `${k}: ${v}`).join("\n");
  return { html, text };
}

export async function sendToStudio(opts: { subject: string; replyTo: string; rows: [string, string | undefined][]; attachments?: Attachment[] }) {
  const { html, text } = renderRows(opts.rows);
  await getTransport().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.OWNER_EMAIL,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text,
    html,
    attachments: opts.attachments,
  });
}
