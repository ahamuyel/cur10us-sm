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

  console.log("Seed concluído: admin@cur10usx.com / cu")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
