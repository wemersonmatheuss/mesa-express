'use client';

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MOCK_MENU_PRODUCTS,
  formatBRL,
  type MenuProduct,
} from "@/data/mockMenuProducts";
import styles from "./cardapio.module.css";

type CartLine = {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  note: string;
};

const CART_STORAGE_KEY = "mesa-express-cart-v1";

function newLineId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `line-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function CardapioPage() {
  const [filterCategory, setFilterCategory] = useState<string>("Todas");
  const [detailProduct, setDetailProduct] = useState<MenuProduct | null>(null);
  const [detailQty, setDetailQty] = useState(1);
  const [detailNote, setDetailNote] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [orderNote, setOrderNote] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartLine[];
      if (Array.isArray(parsed)) setCart(parsed);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  const categories = useMemo(() => {
    const set = new Set(MOCK_MENU_PRODUCTS.map((p) => p.category));
    return ["Todas", ...Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"))];
  }, []);

  const filteredProducts = useMemo(() => {
    if (filterCategory === "Todas") return MOCK_MENU_PRODUCTS;
    return MOCK_MENU_PRODUCTS.filter((p) => p.category === filterCategory);
  }, [filterCategory]);

  const cartCount = useMemo(
    () => cart.reduce((acc, line) => acc + line.quantity, 0),
    [cart],
  );

  const cartTotal = useMemo(
    () => cart.reduce((acc, line) => acc + line.unitPrice * line.quantity, 0),
    [cart],
  );

  const openDetail = useCallback((p: MenuProduct) => {
    setDetailProduct(p);
    setDetailQty(1);
    setDetailNote("");
  }, []);

  const closeDetail = useCallback(() => {
    setDetailProduct(null);
  }, []);

  const addFromDetail = useCallback(() => {
    if (!detailProduct) return;
    const note = detailNote.trim();
    setCart((prev) => {
      const idx = prev.findIndex(
        (l) => l.productId === detailProduct.id && l.note === note,
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + detailQty };
        return next;
      }
      return [
        ...prev,
        {
          id: newLineId(),
          productId: detailProduct.id,
          name: detailProduct.name,
          unitPrice: detailProduct.price,
          quantity: detailQty,
          imageUrl: detailProduct.imageUrl,
          note,
        },
      ];
    });
    closeDetail();
    setCartOpen(true);
  }, [detailProduct, detailQty, detailNote, closeDetail]);

  const updateLineQty = useCallback((lineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((line) => {
          if (line.id !== lineId) return line;
          const q = line.quantity + delta;
          return { ...line, quantity: q };
        })
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setCart((prev) => prev.filter((l) => l.id !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const submitCheckout = useCallback(() => {
    if (!customerName.trim() || !tableNumber.trim()) return;
    alert(
      `Pedido simulado (sem backend ainda):\n\nCliente: ${customerName.trim()}\nMesa: ${tableNumber.trim()}\n${orderNote.trim() ? `Observação: ${orderNote.trim()}\n` : ""}\nTotal: ${formatBRL(cartTotal)}\nItens: ${cartCount}`,
    );
    clearCart();
    setCheckoutOpen(false);
    setCartOpen(false);
    setCustomerName("");
    setTableNumber("");
    setOrderNote("");
  }, [customerName, tableNumber, orderNote, cartTotal, cartCount, clearCart]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.brand}>MesaExpress</div>
          <div className={styles.sub}>Cardápio digital</div>
        </div>
        <button type="button" className={styles.cartBtn} onClick={() => setCartOpen(true)}>
          Carrinho
          {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
        </button>
      </header>

      <div className={styles.filters}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.filterChip} ${
              filterCategory === cat ? styles.filterChipActive : ""
            }`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            type="button"
            className={styles.card}
            onClick={() => openDetail(product)}
          >
            <div className={styles.cardImageWrap}>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 280px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardName}>{product.name}</div>
              <div className={styles.cardDesc}>{product.shortDescription}</div>
              <div className={styles.cardPrice}>{formatBRL(product.price)}</div>
            </div>
          </button>
        ))}
      </div>

      {detailProduct && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDetail();
          }}
        >
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHeader}>
              <span style={{ fontWeight: 700 }}>Detalhes</span>
              <button type="button" onClick={closeDetail}>
                Fechar
              </button>
            </div>
            <div className={styles.sheetScroll}>
              <div className={styles.detailImage}>
                <Image
                  src={detailProduct.imageUrl}
                  alt={detailProduct.name}
                  fill
                  sizes="100vw"
                  priority
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.detailBody}>
                <span className={styles.detailCategory}>{detailProduct.category}</span>
                <h1 className={styles.detailTitle}>{detailProduct.name}</h1>
                <div className={styles.detailPrice}>{formatBRL(detailProduct.price)}</div>
                <p className={styles.detailText}>{detailProduct.description}</p>

                <div className={styles.field}>
                  <span>Observação deste item (opcional)</span>
                  <textarea
                    value={detailNote}
                    onChange={(e) => setDetailNote(e.target.value)}
                    placeholder="Ex.: sem cebola, ponto da carne bem passado…"
                  />
                </div>

                <div className={styles.qtyRow}>
                  <span className={styles.qtyLabel}>Quantidade</span>
                  <div className={styles.qtyControls}>
                    <button type="button" onClick={() => setDetailQty((q) => Math.max(1, q - 1))}>
                      −
                    </button>
                    <span className={styles.qtyValue}>{detailQty}</span>
                    <button type="button" onClick={() => setDetailQty((q) => q + 1)}>
                      +
                    </button>
                  </div>
                </div>

                <button type="button" className={styles.addBtn} onClick={addFromDetail}>
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${styles.drawer} ${cartOpen ? styles.drawerOpen : ""}`}>
        <button
          type="button"
          className={styles.drawerBackdrop}
          aria-label="Fechar carrinho"
          onClick={() => setCartOpen(false)}
        />
        <aside className={styles.drawerPanel}>
          <div className={styles.drawerHead}>
            <h2>Seu carrinho</h2>
            <button type="button" onClick={() => setCartOpen(false)}>
              Fechar
            </button>
          </div>
          <div className={styles.drawerList}>
            {cart.length === 0 ? (
              <p className={styles.emptyCart}>Nenhum item ainda. Toque em um produto para começar.</p>
            ) : (
              cart.map((line) => (
                <div key={line.id} className={styles.cartLine}>
                  <div className={styles.cartThumb}>
                    <Image
                      src={line.imageUrl}
                      alt={line.name}
                      fill
                      sizes="56px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className={styles.cartLineInfo}>
                    <strong>{line.name}</strong>
                    {line.note ? <small>{line.note}</small> : null}
                    <div className={styles.cartLineMeta}>
                      <div className={styles.qtyControls}>
                        <button type="button" onClick={() => updateLineQty(line.id, -1)}>
                          −
                        </button>
                        <span className={styles.qtyValue}>{line.quantity}</span>
                        <button type="button" onClick={() => updateLineQty(line.id, 1)}>
                          +
                        </button>
                      </div>
                      <span className={styles.cartLinePrice}>
                        {formatBRL(line.unitPrice * line.quantity)}
                      </span>
                    </div>
                    <button type="button" className={styles.removeLine} onClick={() => removeLine(line.id)}>
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className={styles.drawerFooter}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <strong>{formatBRL(cartTotal)}</strong>
              </div>
              <button
                type="button"
                className={styles.checkoutBtn}
                onClick={() => {
                  setCheckoutOpen(true);
                }}
              >
                Finalizar pedido
              </button>
            </div>
          )}
        </aside>
      </div>

      {cartCount > 0 && !cartOpen && (
        <div className={styles.bottomBar}>
          <div className={styles.bottomBarInfo}>
            <span>{cartCount} itens no carrinho</span>
            <strong>{formatBRL(cartTotal)}</strong>
          </div>
          <button type="button" className={styles.bottomBarBtn} onClick={() => setCartOpen(true)}>
            Ver carrinho
          </button>
        </div>
      )}

      {checkoutOpen && (
        <div
          className={styles.overlay}
          style={{ zIndex: 110, placeItems: "center" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setCheckoutOpen(false);
          }}
        >
          <div className={styles.modalSmall} onClick={(e) => e.stopPropagation()}>
            <h3>Finalizar pedido</h3>
            <p>Informe nome e mesa. Em breve isso será enviado à cozinha pelo sistema.</p>
            <label>
              Seu nome
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex.: Maria"
                required
              />
            </label>
            <label>
              Número da mesa
              <input
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Ex.: 12"
                inputMode="numeric"
                required
              />
            </label>
            <label>
              Observação do pedido (opcional)
              <input
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Ex.: trazer talheres extras"
              />
            </label>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancel}
                onClick={() => setCheckoutOpen(false)}
              >
                Voltar
              </button>
              <button
                type="button"
                className={styles.modalConfirm}
                disabled={!customerName.trim() || !tableNumber.trim()}
                onClick={submitCheckout}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
