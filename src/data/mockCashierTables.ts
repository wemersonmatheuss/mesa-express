export type CashierLine = {
  name: string;
  qty: number;
  unitPrice: number;
  note?: string;
};

export type CashierTable = {
  id: string;
  tableNumber: number;
  customerNames: string[];
  lines: CashierLine[];
  openedAt: string;
};

export function tableSubtotal(t: CashierTable) {
  return t.lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
}

/** Mesas com consumo em aberto (demonstração até a API do caixa existir). */
export const INITIAL_CASHIER_TABLES: CashierTable[] = [
  {
    id: "c1",
    tableNumber: 8,
    customerNames: ["Lucas"],
    openedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    lines: [
      { name: "Smash Bacon", qty: 2, unitPrice: 34.9, note: "Um sem cebola" },
      { name: "Batata rústica", qty: 1, unitPrice: 21.9 },
      { name: "Refrigerante 350 ml", qty: 2, unitPrice: 7.5 },
    ],
  },
  {
    id: "c2",
    tableNumber: 3,
    customerNames: ["Aline", "Bruno"],
    openedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    lines: [
      { name: "Pizza margherita", qty: 1, unitPrice: 52 },
      { name: "Salada Caesar", qty: 1, unitPrice: 28.5 },
    ],
  },
  {
    id: "c3",
    tableNumber: 11,
    customerNames: ["Pedro"],
    openedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    lines: [
      { name: "Pastel de carne", qty: 4, unitPrice: 12 },
      { name: "Suco natural laranja", qty: 2, unitPrice: 14, note: "Sem gelo" },
    ],
  },
  {
    id: "c4",
    tableNumber: 2,
    customerNames: ["Família Souza"],
    openedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    lines: [
      { name: "Combo família", qty: 1, unitPrice: 89.9 },
      { name: "Brownie com sorvete", qty: 3, unitPrice: 18.9 },
    ],
  },
];

export function formatCashierTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
