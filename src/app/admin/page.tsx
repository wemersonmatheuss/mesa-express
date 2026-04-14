'use client';

import { FormEvent, useMemo, useState } from "react";
import styles from "./admin.module.css";

const metrics = [
  { label: "Pedidos hoje", value: "128", trend: "+12%" },
  { label: "Faturamento do dia", value: "R$ 3.420", trend: "+8%" },
  { label: "Ticket médio", value: "R$ 48,90", trend: "+5%" },
  { label: "Mesas ativas", value: "14", trend: "Agora" },
];

const initialProducts: ProductItem[] = [
  {
    id: "P001",
    name: "Smash Bacon",
    category: "Hambúrguer",
    price: "R$ 34,90",
    status: "Ativo",
  },
  {
    id: "P002",
    name: "Batata Rustica",
    category: "Porção",
    price: "R$ 21,90",
    status: "Ativo",
  },
  {
    id: "P003",
    name: "Refrigerante 350ml",
    category: "Bebida",
    price: "R$ 7,50",
    status: "Ativo",
  },
  {
    id: "P004",
    name: "Brownie com sorvete",
    category: "Sobremesa",
    price: "R$ 18,90",
    status: "Inativo",
  },
];

const orders = [
  { code: "#1251", customer: "Lucas (Mesa 08)", status: "Em preparação" },
  { code: "#1252", customer: "Aline (Mesa 03)", status: "Concluído" },
  { code: "#1253", customer: "Pedro (Mesa 11)", status: "Novo pedido" },
];

export default function Admin() {
  const [products, setProducts] = useState(initialProducts);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<string[]>([]);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    type: "create" | "edit" | "delete";
    productId?: string;
    payload?: ProductForm;
  } | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [draft, setDraft] = useState<ProductForm>({
    name: "",
    category: "",
    price: "",
    description: "",
    imageName: "",
    status: "Ativo",
  });

  const previewProducts = useMemo(() => products.slice(0, 4), [products]);

  function generateAiSummary() {
    const totalProducts = products.length;
    const activeProducts = products.filter((item) => item.status === "Ativo").length;
    const inactiveProducts = totalProducts - activeProducts;
    const preparingOrders = orders.filter((item) => item.status === "Em preparação").length;
    const doneOrders = orders.filter((item) => item.status === "Concluído").length;
    const newOrders = orders.filter((item) => item.status === "Novo pedido").length;

    const topCategory =
      products.reduce<Record<string, number>>((acc, current) => {
        acc[current.category] = (acc[current.category] ?? 0) + 1;
        return acc;
      }, {});
    const sortedCategories = Object.entries(topCategory).sort((a, b) => b[1] - a[1]);

    const summary = [
      `Visão geral: ${totalProducts} produtos cadastrados (${activeProducts} ativos e ${inactiveProducts} inativos).`,
      `Pedidos recentes: ${preparingOrders} em preparação, ${doneOrders} concluídos e ${newOrders} novos.`,
      `Categoria em destaque: ${sortedCategories[0]?.[0] ?? "N/D"}.`,
      "Recomendação: mantenha os itens mais vendidos ativos, revise os inativos com baixa saída e monitore o tempo de preparo no horário de pico.",
    ];

    setAiSummary(summary);
    setIsAiOpen(true);
    setIsReportsOpen(false);
  }

  function resetForm() {
    setDraft({
      name: "",
      category: "",
      price: "",
      description: "",
      imageName: "",
      status: "Ativo",
    });
    setEditingId(null);
  }

  function openCreateForm() {
    resetForm();
    setFormMode("create");
    setIsFormOpen(true);
    setIsReportsOpen(false);
  }

  function openEditForm(productId: string) {
    const target = products.find((item) => item.id === productId);
    if (!target) return;

    setDraft({
      name: target.name,
      category: target.category,
      price: target.price.replace("R$ ", "").replace(",", "."),
      description: target.description ?? "",
      imageName: target.imageName ?? "",
      status: target.status,
    });
    setFormMode("edit");
    setEditingId(productId);
    setIsFormOpen(true);
    setIsReportsOpen(false);
  }

  function askPassword(action: {
    type: "create" | "edit" | "delete";
    productId?: string;
    payload?: ProductForm;
  }) {
    setPendingAction(action);
    setPasswordInput("");
    setPasswordError("");
  }

  function formatPrice(raw: string) {
    const parsed = Number(raw.replace(",", "."));
    if (Number.isNaN(parsed)) return "R$ 0,00";
    return `R$ ${parsed.toFixed(2).replace(".", ",")}`;
  }

  function executeAction() {
    if (!pendingAction) return;
    if (passwordInput !== "admin123") {
      setPasswordError("Senha incorreta. Tente novamente.");
      return;
    }

    if (pendingAction.type === "create" && pendingAction.payload) {
      const payload = pendingAction.payload;
      setProducts((current) => [
        {
          id: `P${String(current.length + 1).padStart(3, "0")}`,
          name: payload.name,
          category: payload.category,
          price: formatPrice(payload.price),
          status: payload.status,
          description: payload.description,
          imageName: payload.imageName,
        },
        ...current,
      ]);
    }

    if (pendingAction.type === "edit" && pendingAction.productId && pendingAction.payload) {
      setProducts((current) =>
        current.map((item) =>
          item.id === pendingAction.productId
            ? {
                ...item,
                name: pendingAction.payload?.name ?? item.name,
                category: pendingAction.payload?.category ?? item.category,
                price: formatPrice(pendingAction.payload?.price ?? "0"),
                status: pendingAction.payload?.status ?? item.status,
                description: pendingAction.payload?.description ?? item.description,
                imageName: pendingAction.payload?.imageName ?? item.imageName,
              }
            : item,
        ),
      );
    }

    if (pendingAction.type === "delete" && pendingAction.productId) {
      setProducts((current) => current.filter((item) => item.id !== pendingAction.productId));
    }

    setPendingAction(null);
    setIsFormOpen(false);
    resetForm();
  }

  function onSubmitProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    askPassword({
      type: formMode === "create" ? "create" : "edit",
      productId: editingId ?? undefined,
      payload: draft,
    });
  }

  function getPasswordTitle() {
    if (!pendingAction) return "";
    if (pendingAction.type === "create") return "Confirmar cadastro de produto";
    if (pendingAction.type === "edit") return "Confirmar edição de produto";
    return "Confirmar exclusão de produto";
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div className={styles.headerMain}>
          <span className={styles.kicker}>Área administrativa</span>
          <h1>
            <span className={styles.brand}>MesaExpress</span>
            <span className={styles.titleLight}> Control Center</span>
          </h1>
          <p>
            Gerencie cardápio, acompanhe pedidos em tempo real e tenha uma visão
            clara da operação do seu restaurante.
          </p>
          <div className={styles.headerBadges}>
            <span>Online agora: 14 mesas</span>
            <span>Última atualização: há 1 min</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.secondaryButton} ${styles.iconButton}`}
            onClick={generateAiSummary}
          >
            <span className={styles.minimalIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M8 9h8M8 13h8M8 17h5M6 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
              </svg>
            </span>
            Resumo IA
          </button>
          <button
            type="button"
            className={`${styles.secondaryButton} ${styles.iconButton}`}
            onClick={() => setIsReportsOpen((prev) => !prev)}
          >
            <span className={styles.minimalIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M5 19V9M12 19V5M19 19v-7M4 19h16" />
              </svg>
            </span>
            Ver relatórios
          </button>
          <button type="button" className={styles.primaryButton} onClick={openCreateForm}>
            + Cadastrar produto
          </button>
        </div>
      </section>

      {isReportsOpen && (
        <section className={styles.reportPanel}>
          <h2>Relatórios rápidos</h2>
          <div className={styles.reportGrid}>
            <article>
              <strong>Produto mais vendido</strong>
              <p>Smash Bacon (31 pedidos hoje)</p>
            </article>
            <article>
              <strong>Horário de pico</strong>
              <p>19:00 - 21:00 (43% dos pedidos)</p>
            </article>
            <article>
              <strong>Status operacional</strong>
              <p>Cozinha com tempo médio de 18 min por pedido</p>
            </article>
          </div>
        </section>
      )}

      {isAiOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <header className={styles.modalHeader}>
              <h3>Resumo inteligente do admin</h3>
              <button type="button" onClick={() => setIsAiOpen(false)}>
                Fechar
              </button>
            </header>
            <div className={styles.aiSummaryBody}>
              <ul>
                {aiSummary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <section className={styles.metricsGrid}>
        {metrics.map((item) => (
          <article key={item.label} className={styles.metricCard}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <em>{item.trend}</em>
          </article>
        ))}
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.panel}>
          <header className={styles.panelHeader}>
            <h2>Produtos cadastrados</h2>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setIsCatalogOpen(true)}
            >
              Ver todos
            </button>
          </header>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {previewProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          product.status === "Ativo"
                            ? styles.badgeActive
                            : styles.badgeInactive
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button type="button" onClick={() => openEditForm(product.id)}>
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            askPassword({
                              type: "delete",
                              productId: product.id,
                            })
                          }
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <aside className={styles.sidebar}>
          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <h2>Pedidos recentes</h2>
            </header>
            <ul className={styles.orderList}>
              {orders.map((order) => (
                <li key={order.code}>
                  <div>
                    <strong>{order.code}</strong>
                    <p>{order.customer}</p>
                  </div>
                  <span
                    className={`${styles.orderStatus} ${
                      order.status === "Concluído"
                        ? styles.statusDone
                        : order.status === "Em preparação"
                          ? styles.statusPreparing
                          : styles.statusNew
                    }`}
                  >
                    {order.status}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <h2>Métricas (preview)</h2>
            </header>
            <div className={styles.chartPlaceholder}>
              <span>Gráfico de vendas</span>
              <div className={styles.bars}>
                <i style={{ height: "34%" }} />
                <i style={{ height: "62%" }} />
                <i style={{ height: "46%" }} />
                <i style={{ height: "78%" }} />
                <i style={{ height: "55%" }} />
                <i style={{ height: "84%" }} />
              </div>
            </div>
          </article>
        </aside>
      </section>

      {isCatalogOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <header className={styles.modalHeader}>
              <h3>Todos os produtos ({products.length})</h3>
              <button type="button" onClick={() => setIsCatalogOpen(false)}>
                Fechar
              </button>
            </header>
            <div className={styles.modalBody}>
              {products.map((product) => (
                <article key={product.id} className={styles.catalogItem}>
                  <div>
                    <strong>
                      {product.id} - {product.name}
                    </strong>
                    <p>
                      {product.category} | {product.price} | {product.status}
                    </p>
                    <small>{product.description || "Sem descrição cadastrada."}</small>
                  </div>
                  <div className={styles.catalogActions}>
                    <button type="button" onClick={() => openEditForm(product.id)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        askPassword({
                          type: "delete",
                          productId: product.id,
                        })
                      }
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <header className={styles.modalHeader}>
              <h3>{formMode === "create" ? "Cadastrar produto" : "Editar produto"}</h3>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
              >
                Fechar
              </button>
            </header>
            <form className={styles.productForm} onSubmit={onSubmitProduct}>
              <label>
                Nome do produto
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((old) => ({ ...old, name: e.target.value }))}
                  required
                />
              </label>
              <label>
                Categoria
                <input
                  value={draft.category}
                  onChange={(e) => setDraft((old) => ({ ...old, category: e.target.value }))}
                  required
                />
              </label>
              <label>
                Preço
                <input
                  value={draft.price}
                  onChange={(e) => setDraft((old) => ({ ...old, price: e.target.value }))}
                  placeholder="Ex: 29.90"
                  required
                />
              </label>
              <label>
                Descrição
                <textarea
                  value={draft.description}
                  onChange={(e) => setDraft((old) => ({ ...old, description: e.target.value }))}
                  rows={3}
                />
              </label>
              <label>
                Status
                <select
                  value={draft.status}
                  onChange={(e) =>
                    setDraft((old) => ({ ...old, status: e.target.value as ProductStatus }))
                  }
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </label>
              <label>
                Foto do produto
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setDraft((old) => ({ ...old, imageName: file ? file.name : old.imageName }));
                  }}
                />
                <small>
                  {draft.imageName ? `Arquivo selecionado: ${draft.imageName}` : "Nenhum arquivo selecionado"}
                </small>
              </label>
              <button type="submit" className={styles.primaryButton}>
                {formMode === "create" ? "Salvar produto" : "Salvar alterações"}
              </button>
            </form>
          </div>
        </div>
      )}

      {pendingAction && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalSmall}>
            <h3>{getPasswordTitle()}</h3>
            <p>Digite a senha de administrador para continuar.</p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              placeholder="Senha"
            />
            {passwordError && <span className={styles.errorText}>{passwordError}</span>}
            <div className={styles.confirmActions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setPendingAction(null)}>
                Cancelar
              </button>
              <button type="button" className={styles.primaryButton} onClick={executeAction}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

type ProductStatus = "Ativo" | "Inativo";

type ProductItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  status: ProductStatus;
  description?: string;
  imageName?: string;
};

type ProductForm = {
  name: string;
  category: string;
  price: string;
  description: string;
  imageName: string;
  status: ProductStatus;
};