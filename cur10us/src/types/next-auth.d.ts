import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
      image?: string | null
      schoolId?: string | null
      schoolSlug?: string | null
      isActive: boolean
    }
  }

  interface User {
    role: string
    schoolId?: string | null
    schoolSlug?: string | null
    isActive: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    id: string
    schoolId?: string | null
    schoolSlug?: string | null
    isActive: boolean
  }
}
