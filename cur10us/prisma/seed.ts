import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash("cur10usx", 12)

  await prisma.user.upsert({
    where: { email: "admin@cur10usx.com" },
    update: { hashedPassword },
    create: {
      name: "Administrador",
      email: "admin@cur10usx.com",
      hashedPassword,
      role: "admin",
    },
  })

  const teachers = [
    { name: "João Silva", email: "joao@silva.com", phone: "11999999999", subjects: ["Matemática", "Geometria"], classes: ["1B", "2A", "3C"], address: "Rua Principal, 123, São Paulo, SP", foto: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Joana Santos", email: "joana@santos.com", phone: "11999999999", subjects: ["Física", "Química"], classes: ["5A", "4B", "3C"], address: "Avenida Central, 456, Rio de Janeiro, RJ", foto: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Miguel Geller", email: "miguel@geller.com", phone: "11999999999", subjects: ["Biologia"], classes: ["5A", "4B", "3C"], address: "Rua das Flores, 789, Curitiba, PR", foto: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Jayme Franco", email: "jayme@gmail.com", phone: "11999999999", subjects: ["História"], classes: ["5A", "4B", "3C"], address: "Rua XV de Novembro, 101, Blumenau, SC", foto: "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Jane Smith", email: "jane@gmail.com", phone: "11999999999", subjects: ["Música", "História"], classes: ["5A", "4B", "3C"], address: "Alameda Santos, 202, São Paulo, SP", foto: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Ana Santiago", email: "anna@gmail.com", phone: "11999999999", subjects: ["Física"], classes: ["5A", "4B", "3C"], address: "Rua do Sol, 303, Salvador, BA", foto: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Allan Preto", email: "allan@preto.com", phone: "11999999999", subjects: ["Inglês", "Espanhol"], classes: ["5A", "4B", "3C"], address: "Rua da Paz, 404, Porto Alegre, RS", foto: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Ofélia Castro", email: "ofelia@castro.com", phone: "11999999999", subjects: ["Matemática", "Geometria"], classes: ["5A", "4B", "3C"], address: "Avenida Brasil, 505, Belo Horizonte, MG", foto: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Derek Briggs", email: "derek@briggs.com", phone: "11999999999", subjects: ["Literatura", "Inglês"], classes: ["5A", "4B", "3C"], address: "Rua Amazonas, 606, Manaus, AM", foto: "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "João Glover", email: "joao@glover.com", phone: "11999999999", subjects: ["Biologia"], classes: ["5A", "4B", "3C"], address: "Rua Maranhão, 707, Brasília, DF", foto: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  ]

  for (const t of teachers) {
    await prisma.teacher.upsert({
      where: { email: t.email },
      update: t,
      create: t,
    })
  }

  const students = [
    { name: "Joãozinho Silva", email: "joaozinho@silva.com", phone: "11999999999", serie: 5, turma: "1B", address: "Rua Principal, 123, São Paulo, SP", foto: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Maria Oliveira", email: "maria@oliveira.com", phone: "11988888888", serie: 6, turma: "2A", address: "Avenida Central, 456, Rio de Janeiro, RJ", foto: "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Pedro Santos", email: "pedro@santos.com", phone: "11977777777", serie: 5, turma: "1B", address: "Rua das Flores, 789, Curitiba, PR", foto: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Ana Costa", email: "ana@costa.com", phone: "11966666666", serie: 7, turma: "3C", address: "Rua XV de Novembro, 101, Blumenau, SC", foto: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Lucas Ferreira", email: "lucas@ferreira.com", phone: "11955555555", serie: 6, turma: "2A", address: "Alameda Santos, 202, São Paulo, SP", foto: "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Camila Rocha", email: "camila@rocha.com", phone: "11944444444", serie: 5, turma: "1B", address: "Rua do Sol, 303, Salvador, BA", foto: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Gabriel Lima", email: "gabriel@lima.com", phone: "11933333333", serie: 7, turma: "3C", address: "Rua da Paz, 404, Porto Alegre, RS", foto: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Isabela Mendes", email: "isabela@mendes.com", phone: "11922222222", serie: 6, turma: "2A", address: "Avenida Brasil, 505, Belo Horizonte, MG", foto: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Rafael Almeida", email: "rafael@almeida.com", phone: "11911111111", serie: 5, turma: "1B", address: "Rua Amazonas, 606, Manaus, AM", foto: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Larissa Souza", email: "larissa@souza.com", phone: "11900000000", serie: 7, turma: "3C", address: "Rua Maranhão, 707, Brasília, DF", foto: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  ]

  const createdStudents: Record<string, string> = {}
  for (const s of students) {
    const student = await prisma.student.upsert({
      where: { email: s.email },
      update: s,
      create: s,
    })
    createdStudents[s.name] = student.id
  }

  const parents = [
    { name: "Carlos Silva", email: "carlos@silva.com", phone: "11999999999", address: "Rua Principal, 123, São Paulo, SP", foto: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Joãozinho Silva"] },
    { name: "Fernanda Oliveira", email: "fernanda@oliveira.com", phone: "11988888888", address: "Avenida Central, 456, Rio de Janeiro, RJ", foto: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Maria Oliveira"] },
    { name: "Roberto Santos", email: "roberto@santos.com", phone: "11977777777", address: "Rua das Flores, 789, Curitiba, PR", foto: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Pedro Santos"] },
    { name: "Patrícia Costa", email: "patricia@costa.com", phone: "11966666666", address: "Rua XV de Novembro, 101, Blumenau, SC", foto: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Ana Costa", "Lucas Ferreira"] },
    { name: "Marcos Ferreira", email: "marcos@ferreira.com", phone: "11955555555", address: "Alameda Santos, 202, São Paulo, SP", foto: "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Lucas Ferreira"] },
    { name: "Juliana Rocha", email: "juliana@rocha.com", phone: "11944444444", address: "Rua do Sol, 303, Salvador, BA", foto: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Camila Rocha"] },
    { name: "Eduardo Lima", email: "eduardo@lima.com", phone: "11933333333", address: "Rua da Paz, 404, Porto Alegre, RS", foto: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Gabriel Lima", "Isabela Mendes"] },
    { name: "Sandra Mendes", email: "sandra@mendes.com", phone: "11922222222", address: "Avenida Brasil, 505, Belo Horizonte, MG", foto: "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Isabela Mendes"] },
    { name: "Ricardo Almeida", email: "ricardo@almeida.com", phone: "11911111111", address: "Rua Amazonas, 606, Manaus, AM", foto: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Rafael Almeida"] },
    { name: "Claudia Souza", email: "claudia@souza.com", phone: "11900000000", address: "Rua Maranhão, 707, Brasília, DF", foto: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Larissa Souza"] },
  ]

  for (const { studentNames, ...p } of parents) {
    const studentIds = studentNames
      .map((name) => createdStudents[name])
      .filter(Boolean)

    await prisma.parent.upsert({
      where: { email: p.email },
      update: {
        ...p,
        students: { set: studentIds.map((id) => ({ id })) },
      },
      create: {
        ...p,
        students: { connect: studentIds.map((id) => ({ id })) },
      },
    })
  }

  console.log("Seed concluído: admin + 10 teachers + 10 students + 10 parents")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
