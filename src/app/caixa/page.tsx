'use client';

import { useMemo, useState } from "react";
import {
  INITIAL_CASHIER_TABLES,
  formatBRL,
  formatCashierTime,
  tableSubtotal,
  type CashierTable,
} from "@/data/mockCashierTables";
import styles from "./caixa.module.css";

function previewLines(t: CashierTable) {
  return t.lines
    .slice(0, 4)
    .map((l) => `${l.qty}× ${l.name}`)
    .join(" · ");
}

export default function CaixaPage() {
  const [tables, setTables] = useState<CashierTable[]>(INITIAL_CASHIER_TABLES);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CashierTable | null>(null);
  const [paymentOk, setPaymentOk] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return tables;
    const n = Number.parseInt(q, 10);
    if (!Number.isNaN(n)) {
      return tables.filter((t) => String(t.tableNumber).includes(String(n)));
    }
    return tables.filter((t) =>
      t.customerNames.some((c) => c.toLowerCase().includes(q.toLowerCase())),
    );
  }, [tables, query]);

  const openDetail = (t: CashierTable) => {
    setSelected(t);
    setPaymentOk(false);
  };

  const closeDetail = () => {
    setSelected(null);
    setPaymentOk(false);
  };

  const encerrarMesa = () => {
    if (!selected || !paymentOk) return;
    setTables((prev) => prev.filter((t) => t.id !== selected.id));
    closeDetail();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.kicker}>Área do caixa</span>
        <h1 className={styles.title}>Conferência e encerramento</h1>
        <p className={styles.sub}>
          Busque pelo número da mesa para conferir o consumo. Após o pagamento, encerre a mesa para liberar
          o lugar ao próximo cliente.
        </p>

        <div className={styles.searchWrap}>
          <label htmlFor="mesa-busca">Buscar mesa</label>
          <div className={styles.searchRow}>
            <input
              id="mesa-busca"
              type="search"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Ex.: 8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query ? (
              <button type="button" className={styles.clearBtn} onClick={() => setQuery("")}>
                Limpar
              </button>
            ) : null}
          </div>
          <p className={styles.hint}>
            Dica: digite só o número da mesa. Com o campo vazio, aparecem todas as mesas em aberto.
          </p>
        </div>
      </header>

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>
            {tables.length === 0
              ? "Nenhuma mesa com consumo em aberto."
              : "Nenhum resultado para essa busca."}
          </p>
        ) : (
          filtered.map((t) => (
            <button key={t.id} type="button" className={styles.card} onClick={() => openDetail(t)}>
              <div className={styles.cardTop}>
                <div>
                  <div className={styles.mesa}>Mesa {t.tableNumber}</div>
                  <div className={styles.clients}>{t.customerNames.join(" · ")}</div>
                </div>
                <div className={styles.total}>{formatBRL(tableSubtotal(t))}</div>
              </div>
              <div className={styles.preview}>{previewLines(t)}</div>
              <div className={styles.meta}>Aberta em {formatCashierTime(t.openedAt)}</div>
            </button>
          ))
        )}
      </div>

      {selected && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDetail();
          }}
        >
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHead}>
              <div>
                <div className={styles.mesa}>Mesa {selected.tableNumber}</div>
                <div className={styles.clients}>{selected.customerNames.join(" · ")}</div>
              </div>
              <button type="button" onClick={closeDetail}>
                Fechar
              </button>
            </div>
            <div className={styles.sheetBody}>
              <p className={styles.meta} style={{ marginBottom: 12 }}>
                Aberta em {formatCashierTime(selected.openedAt)}
              </p>
              {selected.lines.map((line, i) => (
                <div key={i} className={styles.line}>
                  <div className={styles.lineInfo}>
                    <strong>{line.name}</strong>
                    <small>
                      {line.qty} × {formatBRL(line.unitPrice)}
                    </small>
                    {line.note ? <div className={styles.lineNote}>Obs.: {line.note}</div> : null}
                  </div>
                  <div className={styles.linePrice}>{formatBRL(line.unitPrice * line.qty)}</div>
                </div>
              ))}
              <div className={styles.totalRow}>
                <span>Total</span>
                <strong>{formatBRL(tableSubtotal(selected))}</strong>
              </div>
            </div>
            <div className={styles.sheetFooter}>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={paymentOk}
                  onChange={(e) => setPaymentOk(e.target.checked)}
                />
                Pagamento recebido — confirmo que o valor foi conferido com o cliente.
              </label>
              <p className={styles.warn}>
                Ao encerrar, esta mesa some da lista até novos pedidos chegarem pelo sistema (simulação
                local).
              </p>
              <button
                type="button"
                className={styles.closeBtn}
                disabled={!paymentOk}
                onClick={encerrarMesa}
              >
                Encerrar mesa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
