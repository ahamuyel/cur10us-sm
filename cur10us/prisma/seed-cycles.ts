import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding ciclos do sistema educativo angolano...")

  // Criar os 3 ciclos
  const primario = await prisma.educationCycle.upsert({
    where: { name: "Ensino Primário" },
    update: {},
    create: {
      name: "Ensino Primário",
      level: "primario",
      startGrade: 1,
      endGrade: 6,
    },
  })

  const primeiroCiclo = await prisma.educationCycle.upsert({
    where: { name: "1.º Ciclo do Ensino Secundário" },
    update: {},
    create: {
      name: "1.º Ciclo do Ensino Secundário",
      level: "primeiro_ciclo",
      startGrade: 7,
      endGrade: 9,
    },
  })

  const segundoCiclo = await prisma.educationCycle.upsert({
    where: { name: "2.º Ciclo / Ensino Médio" },
    update: {},
    create: {
      name: "2.º Ciclo / Ensino Médio",
      level: "segundo_ciclo",
      startGrade: 10,
      endGrade: 13,
    },
  })

  console.log("Ciclos criados:", { primario: primario.id, primeiroCiclo: primeiroCiclo.id, segundoCiclo: segundoCiclo.id })

  // Criar as 13 classes globais
  const classNames = [
    { grade: 1, name: "1.ª Classe", cycleId: primario.id },
    { grade: 2, name: "2.ª Classe", cycleId: primario.id },
    { grade: 3, name: "3.ª Classe", cycleId: primario.id },
    { grade: 4, name: "4.ª Classe", cycleId: primario.id },
    { grade: 5, name: "5.ª Classe", cycleId: primario.id },
    { grade: 6, name: "6.ª Classe", cycleId: primario.id },
    { grade: 7, name: "7.ª Classe", cycleId: primeiroCiclo.id },
    { grade: 8, name: "8.ª Classe", cycleId: primeiroCiclo.id },
    { grade: 9, name: "9.ª Classe", cycleId: primeiroCiclo.id },
    { grade: 10, name: "10.ª Classe", cycleId: segundoCiclo.id },
    { grade: 11, name: "11.ª Classe", cycleId: segundoCiclo.id },
    { grade: 12, name: "12.ª Classe", cycleId: segundoCiclo.id },
    { grade: 13, name: "13.ª Classe", cycleId: segundoCiclo.id },
  ]

  for (const cls of classNames) {
    await prisma.globalClass.upsert({
      where: { grade: cls.grade },
      update: { cycleId: cls.cycleId },
      create: cls,
    })
  }

  console.log("13 classes globais criadas com ciclos associados.")

  // Criar disciplinas globais comuns do sistema angolano
  const subjects = [
    { name: "Língua Portuguesa", code: "LP" },
    { name: "Matemática", code: "MAT" },
    { name: "Ciências da Natureza", code: "CN" },
    { name: "Física", code: "FIS" },
    { name: "Química", code: "QUI" },
    { name: "Biologia", code: "BIO" },
    { name: "Geografia", code: "GEO" },
    { name: "História", code: "HIS" },
    { name: "Educação Moral e Cívica", code: "EMC" },
    { name: "Educação Física", code: "EF" },
    { name: "Educação Visual e Plástica", code: "EVP" },
    { name: "Educação Musical", code: "EM" },
    { name: "Inglês", code: "ING" },
    { name: "Francês", code: "FRA" },
    { name: "Filosofia", code: "FIL" },
    { name: "Informática", code: "INF" },
    { name: "Empreendedorismo", code: "EMP" },
  ]

  for (const sub of subjects) {
    await prisma.globalSubject.upsert({
      where: { code: sub.code },
      update: {},
      create: sub,
    })
  }

  console.log(`${subjects.length} disciplinas globais criadas.`)

  // Criar cursos globais comuns
  const courses = [
    { name: "Ciências Físicas e Biológicas", code: "CFB" },
    { name: "Ciências Económicas e Jurídicas", code: "CEJ" },
    { name: "Ciências Humanas", code: "CH" },
    { name: "Artes Visuais", code: "AV" },
    { name: "Informática", code: "INF" },
    { name: "Ensino Geral", code: "EG" },
  ]

  for (const course of courses) {
    await prisma.globalCourse.upsert({
      where: { code: course.code },
      update: {},
      create: course,
    })
  }

  console.log(`${courses.length} cursos globais criados.`)
}

main()
  .then(() => {
    console.log("Seed completo!")
    process.exit(0)
  })
  .catch((e) => {
    console.error("Erro no seed:", e)
    process.exit(1)
  })
