'use client';

import { useCallback, useMemo, useState } from "react";
import {
  INITIAL_KITCHEN_ORDERS,
  formatOrderTime,
  type KitchenOrder,
  type KitchenOrderStatus,
} from "@/data/mockKitchenOrders";
import styles from "./cozinha.module.css";

function sortByCreatedAsc(a: KitchenOrder, b: KitchenOrder) {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

function sortByCreatedDesc(a: KitchenOrder, b: KitchenOrder) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function statusLabel(s: KitchenOrderStatus) {
  if (s === "NEW") return "Novo pedido";
  if (s === "PREPARING") return "Em preparação";
  return "Concluído";
}

function statusBadgeClass(s: KitchenOrderStatus) {
  if (s === "NEW") return styles.badgeNew;
  if (s === "PREPARING") return styles.badgePrep;
  return styles.badgeDone;
}

export default function CozinhaPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_KITCHEN_ORDERS);
  const [selected, setSelected] = useState<KitchenOrder | null>(null);

  const newOrders = useMemo(
    () => orders.filter((o) => o.status === "NEW").sort(sortByCreatedAsc),
    [orders],
  );
  const preparing = useMemo(
    () => orders.filter((o) => o.status === "PREPARING").sort(sortByCreatedAsc),
    [orders],
  );
  const done = useMemo(
    () => orders.filter((o) => o.status === "DONE").sort(sortByCreatedDesc),
    [orders],
  );

  const stats = useMemo(() => {
    return {
      new: newOrders.length,
      prep: preparing.length,
      done: done.length,
    };
  }, [newOrders.length, preparing.length, done.length]);

  const setStatus = useCallback((id: string, status: KitchenOrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected((cur) => (cur && cur.id === id ? { ...cur, status } : cur));
  }, []);

  const previewItems = (o: KitchenOrder) =>
    o.items
      .slice(0, 3)
      .map((i) => `${i.quantity}× ${i.name}`)
      .join(" · ") + (o.items.length > 3 ? "…" : "");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.kicker}>Área da cozinha</span>
          <h1 className={styles.title}>Pedidos</h1>
          <p className={styles.sub}>
            Fila por ordem de chegada. Toque no pedido para ver itens e observações. Atualize o
            status conforme o preparo.
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <strong>{stats.new}</strong>
            <span>Novos</span>
          </div>
          <div className={styles.stat}>
            <strong>{stats.prep}</strong>
            <span>Em preparação</span>
          </div>
          <div className={styles.stat}>
            <strong>{stats.done}</strong>
            <span>Concluídos (lista)</span>
          </div>
        </div>
      </header>

      <div className={styles.columns}>
        <section className={styles.column}>
          <div className={styles.columnHead}>
            <h2>Novo pedido</h2>
            <span className={styles.count}>{newOrders.length}</span>
          </div>
          <div className={styles.columnBody}>
            {newOrders.length === 0 ? (
              <p className={styles.empty}>Nenhum pedido novo na fila.</p>
            ) : (
              newOrders.map((o) => (
                <article key={o.id} className={styles.cardWrap}>
                  <button type="button" className={styles.cardMain} onClick={() => setSelected(o)}>
                    <div className={styles.cardTop}>
                      <span className={styles.ticket}>#{o.ticketNumber}</span>
                      <span className={styles.time}>{formatOrderTime(o.createdAt)}</span>
                    </div>
                    <div className={styles.customer}>{o.customerName}</div>
                    <div className={styles.table}>Mesa {o.tableNumber}</div>
                    <div className={styles.preview}>{previewItems(o)}</div>
                  </button>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnPrep}`}
                      onClick={() => setStatus(o.id, "PREPARING")}
                    >
                      Em preparação
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnDone}`}
                      onClick={() => setStatus(o.id, "DONE")}
                    >
                      Concluído
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className={styles.column}>
          <div className={styles.columnHead}>
            <h2>Em preparação</h2>
            <span className={styles.count}>{preparing.length}</span>
          </div>
          <div className={styles.columnBody}>
            {preparing.length === 0 ? (
              <p className={styles.empty}>Nada em preparação no momento.</p>
            ) : (
              preparing.map((o) => (
                <article key={o.id} className={styles.cardWrap}>
                  <button type="button" className={styles.cardMain} onClick={() => setSelected(o)}>
                    <div className={styles.cardTop}>
                      <span className={styles.ticket}>#{o.ticketNumber}</span>
                      <span className={styles.time}>{formatOrderTime(o.createdAt)}</span>
                    </div>
                    <div className={styles.customer}>{o.customerName}</div>
                    <div className={styles.table}>Mesa {o.tableNumber}</div>
                    <div className={styles.preview}>{previewItems(o)}</div>
                  </button>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnBack}`}
                      onClick={() => setStatus(o.id, "NEW")}
                    >
                      Voltar para fila
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnDone}`}
                      onClick={() => setStatus(o.id, "DONE")}
                    >
                      Concluído
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className={styles.column}>
          <div className={styles.columnHead}>
            <h2>Concluído</h2>
            <span className={styles.count}>{done.length}</span>
          </div>
          <div className={styles.columnBody}>
            {done.length === 0 ? (
              <p className={styles.empty}>Ainda não há pedidos concluídos nesta sessão.</p>
            ) : (
              done.map((o) => (
                <article key={o.id} className={styles.cardWrap}>
                  <button type="button" className={styles.cardMain} onClick={() => setSelected(o)}>
                    <div className={styles.cardTop}>
                      <span className={styles.ticket}>#{o.ticketNumber}</span>
                      <span className={styles.time}>{formatOrderTime(o.createdAt)}</span>
                    </div>
                    <div className={styles.customer}>{o.customerName}</div>
                    <div className={styles.table}>Mesa {o.tableNumber}</div>
                    <div className={styles.preview}>{previewItems(o)}</div>
                  </button>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnPrep}`}
                      onClick={() => setStatus(o.id, "PREPARING")}
                    >
                      Reabrir preparo
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {selected && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHead}>
              <div>
                <span className={styles.ticket}>Pedido #{selected.ticketNumber}</span>
                <div style={{ marginTop: 6, fontWeight: 800, fontSize: "1.1rem" }}>
                  {selected.customerName}{" "}
                  <span style={{ color: "#a1a1aa", fontWeight: 600 }}>(Mesa {selected.tableNumber})</span>
                </div>
              </div>
              <button type="button" onClick={() => setSelected(null)}>
                Fechar
              </button>
            </div>
            <div className={styles.sheetBody}>
              <div className={styles.detailMeta}>
                <span className={`${styles.badge} ${statusBadgeClass(selected.status)}`}>
                  {statusLabel(selected.status)}
                </span>
                <span className={styles.time}>Recebido às {formatOrderTime(selected.createdAt)}</span>
              </div>

              <div className={styles.itemsTitle}>Itens do pedido</div>
              {selected.items.map((item, idx) => (
                <div key={idx} className={styles.itemRow}>
                  <strong>{item.name}</strong>
                  <div className={styles.itemQty}>Quantidade: {item.quantity}</div>
                  {item.note ? <div className={styles.itemNote}>Obs.: {item.note}</div> : null}
                </div>
              ))}

              {selected.orderNote ? (
                <div className={styles.orderNote}>
                  <span>Observação geral do pedido</span>
                  {selected.orderNote}
                </div>
              ) : null}
            </div>
            <div className={styles.sheetFooter}>
              {selected.status === "NEW" && (
                <>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrep}`}
                    onClick={() => setStatus(selected.id, "PREPARING")}
                  >
                    Em preparação
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnDone}`}
                    onClick={() => setStatus(selected.id, "DONE")}
                  >
                    Concluído
                  </button>
                </>
              )}
              {selected.status === "PREPARING" && (
                <>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnBack}`}
                    onClick={() => setStatus(selected.id, "NEW")}
                  >
                    Voltar para fila
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnDone}`}
                    onClick={() => setStatus(selected.id, "DONE")}
                  >
                    Concluído
                  </button>
                </>
              )}
              {selected.status === "DONE" && (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrep}`}
                  onClick={() => setStatus(selected.id, "PREPARING")}
                >
                  Reabrir preparo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
