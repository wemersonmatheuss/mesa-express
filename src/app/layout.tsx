import "./globals.css";

export const metadata = {
  title: "MesaExpress",
  description: "Sistema de pedidos para restaurantes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}