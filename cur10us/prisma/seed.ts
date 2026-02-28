import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash("cur10usx", 12)

  // Super Admin (no school)
  await prisma.user.upsert({
    where: { email: "super@cur10usx.com" },
    update: { hashedPassword, role: "super_admin", isActive: true, provider: "credentials" },
    create: {
      name: "Super Admin",
      email: "super@cur10usx.com",
      hashedPassword,
      role: "super_admin",
      isActive: true,
      provider: "credentials",
    },
  })

  console.log("Seed concluído: super_admin (super@cur10usx.com / cur10usx)")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
