export const ESSENTIAL_FEATURES = [
  "students",
  "teachers",
  "classes",
  "attendance",
  "announcements",
  "basicGrades",
] as const

export const OPTIONAL_FEATURES = [
  "finances",
  "submissions",
  "portfolio",
  "certificates",
  "advancedReports",
  "inventory",
  "calendar",
  "internalMessages",
] as const

export const ALL_FEATURES = [...ESSENTIAL_FEATURES, ...OPTIONAL_FEATURES] as const

export type FeatureKey = (typeof ALL_FEATURES)[number]

export const featureLabels: Record<FeatureKey, string> = {
  students: "Alunos",
  teachers: "Professores",
  classes: "Turmas",
  attendance: "Assiduidade",
  announcements: "Avisos",
  basicGrades: "Notas",
  finances: "Finanças",
  submissions: "Submissões de Tarefas",
  portfolio: "Portfólio",
  certificates: "Certificados",
  advancedReports: "Relatórios Avançados",
  inventory: "Inventário",
  calendar: "Calendário",
  internalMessages: "Mensagens Internas",
}

// Default features for new schools
export function getDefaultFeatures(): Record<string, boolean> {
  const features: Record<string, boolean> = {}
  ESSENTIAL_FEATURES.forEach((f) => (features[f] = true))
  OPTIONAL_FEATURES.forEach((f) => (features[f] = false))
  return features
}

// Check if a feature is enabled for a school
export function isFeatureEnabled(
  schoolFeatures: Record<string, boolean> | null | undefined,
  feature: FeatureKey
): boolean {
  // Essential features are always on
  if ((ESSENTIAL_FEATURES as readonly string[]).includes(feature)) return true
  // If no features config, only essentials
  if (!schoolFeatures) return false
  return schoolFeatures[feature] === true
}

// Map menu items to features
export const menuFeatureMap: Record<string, FeatureKey | undefined> = {
  "/list/students": "students",
  "/list/teachers": "teachers",
  "/list/classes": "classes",
  "/list/attendance": "attendance",
  "/list/announcements": "announcements",
  "/list/results": "basicGrades",
  "/list/exams": "basicGrades",
  "/list/messages": "internalMessages",
  "/list/assignments": "submissions",
  "/list/lessons": "calendar",
}
