import { FileText, Clock, Settings, Rocket } from "lucide-react"
import AnimateOnScroll from "./AnimateOnScroll"

const steps = [
  {
    icon: FileText,
    step: "1",
    title: "Registe a sua escola",
    description: "Preencha o formulário com os dados da escola e submeta a candidatura.",
  },
  {
    icon: Clock,
    step: "2",
    title: "Aguarde aprovação",
    description: "A nossa equipa analisa o pedido e aprova a sua escola na plataforma.",
  },
  {
    icon: Settings,
    step: "3",
    title: "Configure o sistema",
    description: "Adicione turmas, professores e alunos. Personalize as funcionalidades.",
  },
  {
    icon: Rocket,
    step: "4",
    title: "Comece a gerir",
    description: "Tudo pronto! Use os dashboards para acompanhar o dia-a-dia da escola.",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 px-6 bg-white dark:bg-zinc-950 border-y border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Como <span className="text-indigo-600 dark:text-indigo-400">funciona</span>
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Em 4 passos simples, a sua escola está pronta para usar o Cur10usX.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, i) => {
            const Icon = item.icon
            return (
              <AnimateOnScroll key={item.step} delay={i * 100}>
                <div className="relative text-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="absolute top-0 right-1/2 translate-x-10 -translate-y-1 text-[10px] font-bold text-white bg-indigo-600 w-5 h-5 rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
