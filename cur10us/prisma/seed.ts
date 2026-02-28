import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash("cur10usx", 12)

  // 1. Super Admin (no school)
  await prisma.user.upsert({
    where: { email: "super@cur10usx.com" },
    update: { hashedPassword, role: "super_admin", isActive: true },
    create: {
      name: "Super Admin",
      email: "super@cur10usx.com",
      hashedPassword,
      role: "super_admin",
      isActive: true,
    },
  })

  // 2. Demo School — Colégio Esperança, Luanda
  const school = await prisma.school.upsert({
    where: { slug: "colegio-esperanca" },
    update: {},
    create: {
      name: "Colégio Esperança",
      slug: "colegio-esperanca",
      email: "contacto@colegio-esperanca.ao",
      phone: "923456789",
      address: "Rua da Missão, 45",
      city: "Luanda",
      provincia: "Luanda",
      status: "ativa",
    },
  })

  // 3. School Admin
  await prisma.user.upsert({
    where: { email: "admin@colegio-esperanca.ao" },
    update: { hashedPassword, role: "school_admin", schoolId: school.id, isActive: true },
    create: {
      name: "Administrador Escolar",
      email: "admin@colegio-esperanca.ao",
      hashedPassword,
      role: "school_admin",
      schoolId: school.id,
      isActive: true,
    },
  })

  // 4. Teachers
  const teachers = [
    { name: "João Mbala", email: "joao@mbala.ao", phone: "923456789", subjects: ["Matemática", "Geometria"], classes: ["7A", "8B", "9C"], address: "Rua da Missão, 123, Luanda", foto: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Ana Tchissola", email: "ana@tchissola.ao", phone: "912345678", subjects: ["Física", "Química"], classes: ["10A", "11B", "9C"], address: "Av. 4 de Fevereiro, 456, Luanda", foto: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Pedro Domingos", email: "pedro@domingos.ao", phone: "924567890", subjects: ["Biologia"], classes: ["10A", "11B", "9C"], address: "Rua Major Kanhangulo, 789, Luanda", foto: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Maria Ngueve", email: "maria@ngueve.ao", phone: "913456789", subjects: ["História"], classes: ["10A", "11B", "9C"], address: "Rua Amílcar Cabral, 101, Benguela", foto: "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Teresa Kamara", email: "teresa@kamara.ao", phone: "925678901", subjects: ["Música", "História"], classes: ["10A", "11B", "9C"], address: "Rua Direita, 202, Huambo", foto: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Rosa Valentim", email: "rosa@valentim.ao", phone: "914567890", subjects: ["Física"], classes: ["10A", "11B", "9C"], address: "Av. Norton de Matos, 303, Lubango", foto: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Manuel Catumbela", email: "manuel@catumbela.ao", phone: "926789012", subjects: ["Inglês", "Francês"], classes: ["10A", "11B", "9C"], address: "Rua da Praia, 404, Cabinda", foto: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Luísa Fernandes", email: "luisa@fernandes.ao", phone: "915678901", subjects: ["Matemática", "Geometria"], classes: ["10A", "11B", "9C"], address: "Rua do Comércio, 505, Malanje", foto: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Carlos Tavares", email: "carlos@tavares.ao", phone: "927890123", subjects: ["Literatura", "Inglês"], classes: ["10A", "11B", "9C"], address: "Av. da Independência, 606, Namibe", foto: "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Helena Cassule", email: "helena@cassule.ao", phone: "916789012", subjects: ["Biologia"], classes: ["10A", "11B", "9C"], address: "Rua Principal, 707, Uíge", foto: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  ]

  for (const t of teachers) {
    await prisma.teacher.upsert({
      where: { email: t.email },
      update: { ...t, schoolId: school.id },
      create: { ...t, schoolId: school.id },
    })
  }

  // 5. Students
  const students = [
    { name: "Kiala Mbala", email: "kiala@mbala.ao", phone: "923111111", classe: 7, turma: "7A", address: "Rua da Missão, 123, Luanda", foto: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Ndalu Ngueve", email: "ndalu@ngueve.ao", phone: "912222222", classe: 8, turma: "8B", address: "Av. 4 de Fevereiro, 456, Luanda", foto: "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Tchissola Santos", email: "tchissola@santos.ao", phone: "924333333", classe: 7, turma: "7A", address: "Rua Major Kanhangulo, 789, Luanda", foto: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Amara Costa", email: "amara@costa.ao", phone: "913444444", classe: 9, turma: "9C", address: "Rua Amílcar Cabral, 101, Benguela", foto: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Djesus Ferreira", email: "djesus@ferreira.ao", phone: "925555555", classe: 8, turma: "8B", address: "Rua Direita, 202, Huambo", foto: "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Nzinga Rocha", email: "nzinga@rocha.ao", phone: "914666666", classe: 7, turma: "7A", address: "Av. Norton de Matos, 303, Lubango", foto: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Kalulu Lima", email: "kalulu@lima.ao", phone: "926777777", classe: 9, turma: "9C", address: "Rua da Praia, 404, Cabinda", foto: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Yara Mendes", email: "yara@mendes.ao", phone: "915888888", classe: 8, turma: "8B", address: "Rua do Comércio, 505, Malanje", foto: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Bento Almeida", email: "bento@almeida.ao", phone: "927999999", classe: 7, turma: "7A", address: "Av. da Independência, 606, Namibe", foto: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200" },
    { name: "Esperança Souza", email: "esperanca@souza.ao", phone: "916000000", classe: 9, turma: "9C", address: "Rua Principal, 707, Uíge", foto: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  ]

  const createdStudents: Record<string, string> = {}
  for (const s of students) {
    const student = await prisma.student.upsert({
      where: { email: s.email },
      update: { ...s, schoolId: school.id },
      create: { ...s, schoolId: school.id },
    })
    createdStudents[s.name] = student.id
  }

  // 6. Parents (Encarregados de educação)
  const parents = [
    { name: "António Mbala", email: "antonio@mbala.ao", phone: "923456001", address: "Rua da Missão, 123, Luanda", foto: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Kiala Mbala"] },
    { name: "Graça Ngueve", email: "graca@ngueve.ao", phone: "912456002", address: "Av. 4 de Fevereiro, 456, Luanda", foto: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Ndalu Ngueve"] },
    { name: "Francisco Santos", email: "francisco@santos.ao", phone: "924456003", address: "Rua Major Kanhangulo, 789, Luanda", foto: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Tchissola Santos"] },
    { name: "Josefa Costa", email: "josefa@costa.ao", phone: "913456004", address: "Rua Amílcar Cabral, 101, Benguela", foto: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Amara Costa", "Djesus Ferreira"] },
    { name: "Domingos Ferreira", email: "domingos@ferreira.ao", phone: "925456005", address: "Rua Direita, 202, Huambo", foto: "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Djesus Ferreira"] },
    { name: "Belarmina Rocha", email: "belarmina@rocha.ao", phone: "914456006", address: "Av. Norton de Matos, 303, Lubango", foto: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Nzinga Rocha"] },
    { name: "Augusto Lima", email: "augusto@lima.ao", phone: "926456007", address: "Rua da Praia, 404, Cabinda", foto: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Kalulu Lima", "Yara Mendes"] },
    { name: "Conceição Mendes", email: "conceicao@mendes.ao", phone: "915456008", address: "Rua do Comércio, 505, Malanje", foto: "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Yara Mendes"] },
    { name: "Mateus Almeida", email: "mateus@almeida.ao", phone: "927456009", address: "Av. da Independência, 606, Namibe", foto: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Bento Almeida"] },
    { name: "Filomena Souza", email: "filomena@souza.ao", phone: "916456010", address: "Rua Principal, 707, Uíge", foto: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200", studentNames: ["Esperança Souza"] },
  ]

  for (const { studentNames, ...p } of parents) {
    const studentIds = studentNames
      .map((name) => createdStudents[name])
      .filter(Boolean)

    await prisma.parent.upsert({
      where: { email: p.email },
      update: {
        ...p,
        schoolId: school.id,
        students: { set: studentIds.map((id) => ({ id })) },
      },
      create: {
        ...p,
        schoolId: school.id,
        students: { connect: studentIds.map((id) => ({ id })) },
      },
    })
  }

  console.log("Seed concluído: super_admin + Colégio Esperança + school_admin + 10 professores + 10 alunos + 10 encarregados")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
