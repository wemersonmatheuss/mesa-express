/** Shell leve durante navegação (streaming) — sem CSS extra nem imagens. */
export default function RouteLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Carregando"
      style={{
        minHeight: "42vh",
        margin: "20px 16px",
        maxWidth: 1200,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 20,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    />
  );
}
