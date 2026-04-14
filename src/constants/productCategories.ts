/**
 * Categorias padrão do cardápio (mesmo conjunto usado no seed do Prisma).
 * Ordem: refeições → tipos de prato → bebidas → doces → especiais.
 */
export const PRODUCT_CATEGORIES = [
  "Entrada",
  "Almoço",
  "Jantar",
  "Lanche da tarde",
  "Hambúrguer",
  "Sanduíche",
  "Pastel",
  "Salgado",
  "Pizza",
  "Porção",
  "Acompanhamento",
  "Prato executivo",
  "Massas",
  "Saladas",
  "Carnes",
  "Peixe",
  "Frutos do mar",
  "Vegetariano",
  "Vegano",
  "Infantil",
  "Combo",
  "Promoção",
  "Bebida",
  "Suco",
  "Refrigerante",
  "Água",
  "Café",
  "Drinks e coquetéis",
  "Sobremesa",
  "Doces",
] as const;

export type ProductCategoryName = (typeof PRODUCT_CATEGORIES)[number];
