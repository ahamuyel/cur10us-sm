import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const from = process.env.RESEND_FROM_EMAIL || "noreply@cur10usx.com"
const baseUrl = process.env.AUTH_URL || "http://localhost:3000"

function wrap(title: string, body: string) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;">
      <h2 style="color:#6366f1;margin-bottom:8px;">${title}</h2>
      ${body}
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;" />
      <p style="font-size:12px;color:#a1a1aa;">Cur10usX — Sistema de Gestão Escolar</p>
    </div>
  `
}

export async function sendApplicationConfirmation(to: string, name: string, trackingToken: string) {
  const statusUrl = `${baseUrl}/aplicacao/status?token=${trackingToken}`
  await resend.emails.send({
    from,
    to,
    subject: "Solicitação recebida — Cur10usX",
    html: wrap(
      "Solicitação recebida!",
      `<p>Olá ${name},</p>
       <p>Sua solicitação foi recebida com sucesso. Acompanhe o status pelo link abaixo:</p>
       <p><a href="${statusUrl}" style="color:#6366f1;font-weight:600;">Acompanhar minha solicitação</a></p>
       <p>Seu código de acompanhamento: <strong>${trackingToken}</strong></p>`
    ),
  })
}

export async function sendApplicationApproved(to: string, name: string, schoolName: string) {
  await resend.emails.send({
    from,
    to,
    subject: "Solicitação aprovada — Cur10usX",
    html: wrap(
      "Solicitação aprovada!",
      `<p>Olá ${name},</p>
       <p>Sua solicitação para <strong>${schoolName}</strong> foi aprovada!</p>
       <p>O próximo passo é aguardar a matrícula pela escola. Você receberá um e-mail quando sua conta estiver ativa.</p>`
    ),
  })
}

export async function sendApplicationRejected(to: string, name: string, reason: string) {
  await resend.emails.send({
    from,
    to,
    subject: "Solicitação não aprovada — Cur10usX",
    html: wrap(
      "Solicitação não aprovada",
      `<p>Olá ${name},</p>
       <p>Infelizmente sua solicitação não foi aprovada.</p>
       <p><strong>Motivo:</strong> ${reason}</p>
       <p>Se tiver dúvidas, entre em contato com a escola.</p>`
    ),
  })
}

export async function sendEnrollmentComplete(to: string, name: string, schoolName: string) {
  const loginUrl = `${baseUrl}/signin`
  await resend.emails.send({
    from,
    to,
    subject: "Matrícula confirmada — Cur10usX",
    html: wrap(
      "Matrícula confirmada!",
      `<p>Olá ${name},</p>
       <p>Sua matrícula na <strong>${schoolName}</strong> foi confirmada! Sua conta está ativa.</p>
       <p>Se você já criou sua senha, pode acessar a plataforma:</p>
       <p><a href="${loginUrl}" style="color:#6366f1;font-weight:600;">Acessar Cur10usX</a></p>
       <p>Caso ainda não tenha criado uma conta, cadastre-se com este mesmo e-mail (${to}).</p>`
    ),
  })
}

export async function sendSchoolApproved(to: string, schoolName: string) {
  await resend.emails.send({
    from,
    to,
    subject: "Escola aprovada — Cur10usX",
    html: wrap(
      "Escola aprovada!",
      `<p>A escola <strong>${schoolName}</strong> foi aprovada na plataforma Cur10usX.</p>
       <p>O próximo passo é a ativação pela equipe da plataforma. Você receberá um e-mail quando a escola estiver ativa.</p>`
    ),
  })
}

export async function sendSchoolRejected(to: string, schoolName: string, reason: string) {
  await resend.emails.send({
    from,
    to,
    subject: "Escola não aprovada — Cur10usX",
    html: wrap(
      "Escola não aprovada",
      `<p>Infelizmente a escola <strong>${schoolName}</strong> não foi aprovada na plataforma.</p>
       <p><strong>Motivo:</strong> ${reason}</p>
       <p>Se tiver dúvidas, entre em contato conosco.</p>`
    ),
  })
}
