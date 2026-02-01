// DADOS TEMPORÁRIOS

export let role = "admin";

export const teachersData = [
  {
    id: 1,
    teacherId: "1234567890",
    nome: "João Silva",
    email: "joao@silva.com",
    foto: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telefone: "11999999999",
    materias: ["Matemática", "Geometria"],
    turmas: ["1B", "2A", "3C"],
    endereco: "Rua Principal, 123, São Paulo, SP",
  },
  {
    id: 2,
    teacherId: "1234567890",
    nome: "Joana Santos",
    email: "joana@santos.com",
    foto: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telefone: "11999999999",
    materias: ["Física", "Química"],
    turmas: ["5A", "4B", "3C"],
    endereco: "Avenida Central, 456, Rio de Janeiro, RJ",
  },
  {
    id: 3,
    teacherId: "1234567890",
    nome: "Miguel Geller",
    email: "miguel@geller.com",
    foto: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telefone: "11999999999",
    materias: ["Biologia"],
    turmas: ["5A", "4B", "3C"],
    endereco: "Rua das Flores, 789, Curitiba, PR",
  },
  {
    id: 4,
    teacherId: "1234567890",
    nome: "Jayme Franco",
    email: "jayme@gmail.com",
    foto: "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telefone: "11999999999",
    materias: ["História"],
    turmas: ["5A", "4B", "3C"],
    endereco: "Rua XV de Novembro, 101, Blumenau, SC",
  },
  {
    id: 5,
    teacherId: "1234567890",
    nome: "Jane Smith",
    email: "jane@gmail.com",
    foto: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telefone: "11999999999",
    materias: ["Música", "História"],
    turmas: ["5A", "4B", "3C"],
    endereco: "Alameda Santos, 202, São Paulo, SP",
  },
  {
    id: 6,
    teacherId: "1234567890",
    nome: "Ana Santiago",
    email: "anna@gmail.com",
    foto: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telefone: "11999999999",
    materias: ["Física"],
    turmas: ["5A", "4B", "3C"],
    endereco: "Rua do Sol, 303, Salvador, BA",
  },
  {
    id: 7,
    teacherId: "1234567890",
    nome: "Allan Preto",
    email: "allan@preto.com",
    foto: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telefone: "11999999999",
    materias: ["Inglês", "Espanhol"],
    turmas: ["5A", "4B", "3C"],
    endereco: "Rua da Paz, 404, Porto Alegre, RS",
  },
  {
    id: 8,
    teacherId: "1234567890",
    nome: "Ofélia Castro",
    email: "ofelia@castro.com",
    foto: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telefone: "11999999999",
    materias: ["Matemática", "Geometria"],
    turmas: ["5A", "4B", "3C"],
    endereco: "Avenida Brasil, 505, Belo Horizonte, MG",
  },
  {
    id: 9,
    teacherId: "1234567890",
    nome: "Derek Briggs",
    email: "derek@briggs.com",
    foto: "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telefone: "11999999999",
    materias: ["Literatura", "Inglês"],
    turmas: ["5A", "4B", "3C"],
    endereco: "Rua Amazonas, 606, Manaus, AM",
  },
  {
    id: 10,
    teacherId: "1234567890",
    nome: "João Glover",
    email: "joao@glover.com",
    foto: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telefone: "11999999999",
    materias: ["Biologia"],
    turmas: ["5A", "4B", "3C"],
    endereco: "Rua Maranhão, 707, Brasília, DF",
  },
];

export const studentsData = [
  {
    id: 1,
    studentId: "1234567890",
    nome: "Joãozinho Silva",
    email: "joaozinho@silva.com",
    foto: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telefone: "11999999999",
    serie: 5,
    turma: "1B",
    endereco: "Rua Principal, 123, São Paulo, SP",
  },
  // ... (Outros alunos seguem o mesmo padrão de tradução)
];

export const subjectsData = [
  { id: 1, nome: "Matemática", professores: ["Alice Phelps", "Russell Davidson"] },
  { id: 2, nome: "Inglês", professores: ["Manuel Becker", "Eddie Chavez"] },
  { id: 3, nome: "Física", professores: ["Lola Newman", "Darrell Delgado"] },
  { id: 4, nome: "Química", professores: ["Nathan Kelly", "Benjamin Snyder"] },
  { id: 5, nome: "Biologia", professores: ["Alma Benson", "Lina Collier"] },
  { id: 6, nome: "História", professores: ["Hannah Bowman", "Betty Obrien"] },
  { id: 7, nome: "Geografia", professores: ["Lora French", "Sue Brady"] },
  { id: 8, nome: "Arte", professores: ["Harriet Alvarado", "Mayme Keller"] },
  { id: 9, nome: "Música", professores: ["Gertrude Roy", "Rosa Singleton"] },
  { id: 10, nome: "Literatura", professores: ["Effie Lynch", "Brett Flowers"] },
];

export const examsData = [
  {
    id: 1,
    materia: "Matemática",
    turma: "1A",
    professor: "Martha Morris",
    data: "2026-05-10",
  },
  {
    id: 2,
    materia: "Inglês",
    turma: "2A",
    professor: "Randall Garcia",
    data: "2026-05-11",
  },
  // ...
];

export const calendarEvents = [
  // === SEGUNDA-FEIRA – 02/02/2026 ===
  {
    title: "Matemática",
    allDay: false,
    start: new Date(2026, 1, 2, 7, 30),
    end: new Date(2026, 1, 2, 8, 50),
  },
  {
    title: "Inglês",
    allDay: false,
    start: new Date(2026, 1, 2, 9, 0),
    end: new Date(2026, 1, 2, 9, 45),
  },
  {
    title: "Biologia",
    allDay: false,
    start: new Date(2026, 1, 2, 10, 0),
    end: new Date(2026, 1, 2, 11, 20),
  },
  // === TERÇA-FEIRA – 03/02/2026 ===
  {
    title: "Física",
    allDay: false,
    start: new Date(2026, 1, 3, 7, 30),
    end: new Date(2026, 1, 3, 8, 50),
  },
  {
    title: "Química",
    allDay: false,
    start: new Date(2026, 1, 3, 9, 0),
    end: new Date(2026, 1, 3, 10, 20),
  },
];