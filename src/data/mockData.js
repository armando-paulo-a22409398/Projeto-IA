// ── MOCK INVENTORY ─────────────────────────────────────────────────────────
export const MOCK_INVENTORY = [
  {
    id: 1,
    name: "Leite Mimosa",
    barcode: "5601209001234",
    category: "Laticínios",
    emoji: "🥛",
    quantity: 2,
    expiration_date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
    added_at: "2025-03-01",
  },
  {
    id: 2,
    name: "Ovos Biológicos",
    barcode: "5601209005678",
    category: "Proteínas",
    emoji: "🥚",
    quantity: 12,
    expiration_date: new Date(Date.now() + 9 * 86400000).toISOString().split("T")[0],
    added_at: "2025-03-05",
  },
  {
    id: 3,
    name: "Arroz Carolino",
    barcode: "5601209009012",
    category: "Cereais",
    emoji: "🍚",
    quantity: 1,
    expiration_date: new Date(Date.now() + 300 * 86400000).toISOString().split("T")[0],
    added_at: "2025-02-20",
  },
  {
    id: 4,
    name: "Iogurte Natural",
    barcode: "5601209003456",
    category: "Laticínios",
    emoji: "🫙",
    quantity: 4,
    expiration_date: new Date(Date.now() + 1 * 86400000).toISOString().split("T")[0],
    added_at: "2025-03-08",
  },
  {
    id: 5,
    name: "Azeite Virgem Extra",
    barcode: "5601209007890",
    category: "Condimentos",
    emoji: "🫒",
    quantity: 1,
    expiration_date: new Date(Date.now() + 460 * 86400000).toISOString().split("T")[0],
    added_at: "2025-01-15",
  },
  {
    id: 6,
    name: "Maçãs Fuji",
    barcode: "5601209002345",
    category: "Frutas",
    emoji: "🍎",
    quantity: 6,
    expiration_date: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    added_at: "2025-03-09",
  },
  {
    id: 7,
    name: "Pão de Forma",
    barcode: "5601209006789",
    category: "Padaria",
    emoji: "🍞",
    quantity: 1,
    expiration_date: new Date(Date.now() + 0 * 86400000).toISOString().split("T")[0],
    added_at: "2025-03-08",
  },
  {
    id: 8,
    name: "Frango do Campo",
    barcode: "5601209001111",
    category: "Carnes",
    emoji: "🍗",
    quantity: 2,
    expiration_date: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0],
    added_at: "2025-03-10",
  },
  {
    id: 9,
    name: "Massa Esparguete",
    barcode: "5601209002222",
    category: "Cereais",
    emoji: "🍝",
    quantity: 3,
    expiration_date: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
    added_at: "2025-03-01",
  },
  {
    id: 10,
    name: "Tomates Cherry",
    barcode: "5601209003333",
    category: "Vegetais",
    emoji: "🍅",
    quantity: 2,
    expiration_date: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    added_at: "2025-03-10",
  },
];

// ── MOCK BARCODE DATABASE (simulando OpenFoodFacts) ─────────────────────────
export const BARCODE_DB = {
  "5601209001234": { name: "Leite Mimosa", category: "Laticínios", emoji: "🥛" },
  "5601209005678": { name: "Ovos Biológicos", category: "Proteínas", emoji: "🥚" },
  "5601209099999": { name: "Massa Esparguete", category: "Cereais", emoji: "🍝" },
  "5601209011111": { name: "Queijo Flamengo", category: "Laticínios", emoji: "🧀" },
  "5601209022222": { name: "Atum em Conserva", category: "Proteínas", emoji: "🐟" },
  "5601209033333": { name: "Feijão Vermelho", category: "Leguminosas", emoji: "🫘" },
  "7622210100146": { name: "Bolachas Oreo", category: "Snacks", emoji: "🍪" },
  "8000500310427": { name: "Nutella", category: "Snacks", emoji: "🫙" },
};

// ── MOCK RECIPES ────────────────────────────────────────────────────────────
export const MOCK_RECIPES = [
  {
    id: 1,
    name: "Arroz de Frango",
    time: 35,
    servings: 4,
    difficulty: "Fácil",
    emoji: "🍲",
    required_ingredients: ["Arroz Carolino", "Frango do Campo", "Azeite Virgem Extra"],
    optional_ingredients: ["Tomates Cherry"],
    steps: [
      "Tempera o frango com sal e azeite.",
      "Aloura o frango numa panela durante 10 min.",
      "Adiciona o arroz e água fervente (2:1).",
      "Cozinha em lume brando 20 min com tampa.",
    ],
  },
  {
    id: 2,
    name: "Omeleta Simples",
    time: 10,
    servings: 2,
    difficulty: "Muito Fácil",
    emoji: "🍳",
    required_ingredients: ["Ovos Biológicos", "Azeite Virgem Extra"],
    optional_ingredients: ["Tomates Cherry"],
    steps: [
      "Bate 3 ovos com uma pitada de sal.",
      "Aquece o azeite numa frigideira antiaderente.",
      "Verte os ovos e deixa cozer 3-4 min.",
      "Dobra ao meio e serve.",
    ],
  },
  {
    id: 3,
    name: "Iogurte com Fruta",
    time: 5,
    servings: 1,
    difficulty: "Muito Fácil",
    emoji: "🥗",
    required_ingredients: ["Iogurte Natural", "Maçãs Fuji"],
    optional_ingredients: [],
    steps: [
      "Corta as maçãs em pedaços pequenos.",
      "Coloca o iogurte numa taça.",
      "Adiciona a fruta e serve fresco.",
    ],
  },
  {
    id: 4,
    name: "Esparguete ao Azeite",
    time: 20,
    servings: 2,
    difficulty: "Fácil",
    emoji: "🍝",
    required_ingredients: ["Massa Esparguete", "Azeite Virgem Extra"],
    optional_ingredients: ["Tomates Cherry"],
    steps: [
      "Coze a massa em água com sal abundante.",
      "Escorre deixando um pouco da água da cozedura.",
      "Tempera com azeite generoso.",
      "Adiciona tomate fresco se disponível.",
    ],
  },
];

// ── MOCK SHOPPING LIST ──────────────────────────────────────────────────────
export const MOCK_SHOPPING = [
  { id: 1, product_name: "Manteiga",        quantity: 1, purchased: false, auto: true },
  { id: 2, product_name: "Queijo Flamengo", quantity: 2, purchased: false, auto: false },
  { id: 3, product_name: "Tomate",          quantity: 4, purchased: true,  auto: false },
  { id: 4, product_name: "Cebola",          quantity: 3, purchased: false, auto: false },
  { id: 5, product_name: "Sumo de Laranja", quantity: 1, purchased: false, auto: true },
];

// ── CONSUMPTION HISTORY ─────────────────────────────────────────────────────
export const MOCK_HISTORY = [
  { id: 1, product_name: "Leite Mimosa",   emoji: "🥛", quantity: 1, consumed_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 2, product_name: "Ovos Biológicos",emoji: "🥚", quantity: 3, consumed_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 3, product_name: "Iogurte Natural",emoji: "🫙", quantity: 2, consumed_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 4, product_name: "Pão de Forma",   emoji: "🍞", quantity: 1, consumed_at: new Date(Date.now() - 5 * 86400000).toISOString() },
];

// ── CATEGORIES ──────────────────────────────────────────────────────────────
export const CATEGORIES = [
  "Laticínios", "Proteínas", "Cereais", "Frutas", "Vegetais",
  "Carnes", "Peixe", "Condimentos", "Padaria", "Snacks",
  "Bebidas", "Leguminosas", "Congelados", "Outros",
];

export const CATEGORY_EMOJIS = {
  "Laticínios": "🥛", "Proteínas": "🥩", "Cereais": "🌾", "Frutas": "🍎",
  "Vegetais": "🥦", "Carnes": "🍗", "Peixe": "🐟", "Condimentos": "🫙",
  "Padaria": "🍞", "Snacks": "🍪", "Bebidas": "🥤", "Leguminosas": "🫘",
  "Congelados": "❄️", "Outros": "📦",
};
