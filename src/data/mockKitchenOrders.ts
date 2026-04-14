export type KitchenOrderStatus = "NEW" | "PREPARING" | "DONE";

export type KitchenOrderItem = {
  name: string;
  quantity: number;
  note?: string;
};

export type KitchenOrder = {
  id: string;
  ticketNumber: number;
  customerName: string;
  tableNumber: number;
  createdAt: string;
  status: KitchenOrderStatus;
  items: KitchenOrderItem[];
  orderNote?: string;
};

/** Pedidos de demonstração até a API da cozinha existir. */
export const INITIAL_KITCHEN_ORDERS: KitchenOrder[] = [
  {
    id: "k1",
    ticketNumber: 1251,
    customerName: "Lucas",
    tableNumber: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    status: "NEW",
    items: [
      { name: "Smash Bacon", quantity: 2, note: "Um sem cebola" },
      { name: "Batata rústica", quantity: 1 },
    ],
    orderNote: "Trazer catchup extra",
  },
  {
    id: "k2",
    ticketNumber: 1252,
    customerName: "Aline",
    tableNumber: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    status: "PREPARING",
    items: [
      { name: "Pizza margherita", quantity: 1, note: "Bem assada" },
      { name: "Refrigerante 350 ml", quantity: 2 },
    ],
  },
  {
    id: "k3",
    ticketNumber: 1253,
    customerName: "Pedro",
    tableNumber: 11,
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    status: "NEW",
    items: [
      { name: "Pastel de carne", quantity: 4 },
      { name: "Suco natural laranja", quantity: 2, note: "Sem gelo" },
    ],
  },
  {
    id: "k4",
    ticketNumber: 1250,
    customerName: "Marina",
    tableNumber: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    status: "DONE",
    items: [{ name: "Salada Caesar", quantity: 1 }],
  },
  {
    id: "k5",
    ticketNumber: 1249,
    customerName: "Ricardo",
    tableNumber: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    status: "DONE",
    items: [
      { name: "Combo família", quantity: 1, note: "Trocar uma bebida por água" },
    ],
  },
];

export function formatOrderTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
