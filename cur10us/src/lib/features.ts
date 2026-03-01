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

// Feature descriptions for admin UI
export const featureDescriptions: Record<FeatureKey, string> = {
  students: "Gestão de alunos, matrículas e perfis",
  teachers: "Gestão de professores e atribuições",
  classes: "Gestão de turmas, classes e períodos",
  attendance: "Registo e controlo de assiduidade",
  announcements: "Avisos e comunicações à comunidade escolar",
  basicGrades: "Registo de notas, exames e resultados",
  finances: "Gestão financeira, propinas e pagamentos",
  submissions: "Submissão e avaliação de trabalhos",
  portfolio: "Portfólio académico do aluno",
  certificates: "Emissão de certificados e declarações",
  advancedReports: "Relatórios analíticos avançados",
  inventory: "Gestão de inventário e recursos",
  calendar: "Calendário escolar e horários de aulas",
  internalMessages: "Sistema de mensagens internas",
}

// Reverse map: feature → affected menu items
export const featureMenuItems: Record<FeatureKey, string[]> = {
  students: ["Alunos"],
  teachers: ["Professores"],
  classes: ["Turmas"],
  attendance: ["Assiduidade"],
  announcements: ["Avisos"],
  basicGrades: ["Notas", "Exames"],
  finances: [],
  submissions: ["Trabalhos"],
  portfolio: [],
  certificates: [],
  advancedReports: [],
  inventory: [],
  calendar: ["Aulas"],
  internalMessages: ["Mensagens"],
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
