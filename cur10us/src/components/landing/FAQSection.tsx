"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "O Cur10usX é gratuito?",
    answer: "A plataforma está actualmente em fase de lançamento. Contacte-nos para saber mais sobre os planos disponíveis.",
  },
  {
    question: "Como registo a minha escola?",
    answer: "Clique em \"Registar escola\" e preencha o formulário com os dados da instituição. A nossa equipa irá analisar e aprovar o pedido em até 48 horas.",
  },
  {
    question: "Que informações preciso para o registo?",
    answer: "Nome da escola, NIF, e-mail, telefone, endereço, cidade e província. Após aprovação, receberá as credenciais de acesso por e-mail.",
  },
  {
    question: "Funciona em telemóveis?",
    answer: "Sim! O Cur10usX é totalmente responsivo e funciona em qualquer dispositivo com browser — computador, tablet ou telemóvel.",
  },
  {
    question: "Os dados da minha escola estão seguros?",
    answer: "Sim. Utilizamos encriptação, autenticação segura e cada escola tem os seus dados completamente isolados das demais.",
  },
  {
    question: "Posso personalizar as funcionalidades da minha escola?",
    answer: "Sim. O administrador da plataforma pode activar ou desactivar módulos conforme as necessidades de cada escola.",
  },
  {
    question: "Como funciona o processo de matrícula online?",
    answer: "Os candidatos preenchem um formulário público, recebem um código de acompanhamento, e o administrador da escola gere as candidaturas diretamente na plataforma.",
  },
  {
    question: "Posso importar alunos e professores em massa?",
    answer: "Sim. A plataforma suporta importação via ficheiro Excel/CSV com validação prévia dos dados antes da inserção.",
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Perguntas <span className="text-indigo-600 dark:text-indigo-400">frequentes</span>
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          Encontre respostas para as dúvidas mais comuns sobre o Cur10usX.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition"
            >
              {faq.question}
              <ChevronDown
                size={16}
                className={`shrink-0 text-zinc-400 transition-transform duration-200 ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                open === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
