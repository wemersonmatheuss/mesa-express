export type MenuProduct = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
};

/** Cardápio de demonstração até integrar com a API. */
export const MOCK_MENU_PRODUCTS: MenuProduct[] = [
  {
    id: "m1",
    name: "Smash Bacon",
    shortDescription: "Blend duplo, cheddar e bacon crocante.",
    description:
      "Dois discos de blend 90 g cada, queijo cheddar derretido, bacon crocante, cebola roxa, picles e maionese da casa no pão brioche tostado. Acompanha batata rústica.",
    price: 34.9,
    category: "Hambúrguer",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&h=700&fit=crop&q=80",
  },
  {
    id: "m2",
    name: "Batata rústica",
    shortDescription: "Porção generosa com cheddar e bacon.",
    description:
      "Batatas cortadas em casca, fritas na hora. Cobertas com cheddar cremoso, bacon em cubos e cebolinha. Ideal para compartilhar.",
    price: 21.9,
    category: "Porção",
    imageUrl:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4d13c?w=900&h=700&fit=crop&q=80",
  },
  {
    id: "m3",
    name: "Refrigerante 350 ml",
    shortDescription: "Lata gelada — diversos sabores.",
    description:
      "Refrigerante em lata 350 ml. Consulte sabores disponíveis no balcão: cola, cola zero, guaraná, limão, laranja e água com gás.",
    price: 7.5,
    category: "Bebida",
    imageUrl:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=900&h=700&fit=crop&q=80",
  },
  {
    id: "m4",
    name: "Brownie com sorvete",
    shortDescription: "Brownie quente e bola de creme.",
    description:
      "Brownie de chocolate belga servido quente com bola de sorvete de creme, calda de chocolate e farofa de amendoim.",
    price: 18.9,
    category: "Sobremesa",
    imageUrl:
      "https://images.unsplash.com/photo-1606313564200-e75d5e304764?w=900&h=700&fit=crop&q=80",
  },
  {
    id: "m5",
    name: "Pastel de carne",
    shortDescription: "Massa crocante, recheio suculento.",
    description:
      "Pastel frito na hora com carne moída temperada, azeitona e queijo. Acompanha vinagrete opcional.",
    price: 12.0,
    category: "Pastel",
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900&h=700&fit=crop&q=80",
  },
  {
    id: "m6",
    name: "Salada Caesar",
    shortDescription: "Alface, frango grelhado e parmesão.",
    description:
      "Mix de alface romana, frango grelhado em tiras, lascas de parmesão, croutons e molho Caesar à parte.",
    price: 28.5,
    category: "Saladas",
    imageUrl:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=900&h=700&fit=crop&q=80",
  },
  {
    id: "m7",
    name: "Pizza margherita",
    shortDescription: "Molho de tomate, mussarela e manjericão.",
    description:
      "Massa fina assada em forno a lenha, molho de tomate San Marzano, mussarela de búfala e manjericão fresco.",
    price: 52.0,
    category: "Pizza",
    imageUrl:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&h=700&fit=crop&q=80",
  },
  {
    id: "m8",
    name: "Suco natural laranja",
    shortDescription: "500 ml espremido na hora.",
    description:
      "Laranjas espremidas na hora, sem água nem açúcar. Copo 500 ml com gelo opcional.",
    price: 14.0,
    category: "Suco",
    imageUrl:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=900&h=700&fit=crop&q=80",
  },
  {
    id: "m9",
    name: "Combo família",
    shortDescription: "2 burgers + 2 porções + 2 bebidas.",
    description:
      "Dois hambúrguers à escolha (exceto premium), duas porções de batata média e duas bebidas 350 ml. Economia em relação ao avulso.",
    price: 89.9,
    category: "Combo",
    imageUrl:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=900&h=700&fit=crop&q=80",
  },
  {
    id: "m10",
    name: "Coxinha de frango",
    shortDescription: "Unidade — massa leve e cremosa.",
    description:
      "Coxinha artesanal com frango desfiado e requeijão. Frita na hora. Peça a quantidade no carrinho.",
    price: 6.5,
    category: "Salgado",
    imageUrl:
      "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=900&h=700&fit=crop&q=80",
  },
  {
    id: "m11",
    name: "Espaguete à bolonhesa",
    shortDescription: "Molho caseiro e parmesão.",
    description:
      "Massa al dente com ragù de carne cozido lentamente, tomate pelati e parmesão ralado na hora.",
    price: 36.0,
    category: "Massas",
    imageUrl:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=900&h=700&fit=crop&q=80",
  },
  {
    id: "m12",
    name: "Água mineral",
    shortDescription: "500 ml com ou sem gás.",
    description:
      "Água mineral nacional, garrafa 500 ml. Escolha com gás ou sem gás nas observações do pedido.",
    price: 5.0,
    category: "Água",
    imageUrl:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=900&h=700&fit=crop&q=80",
  },
];

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
