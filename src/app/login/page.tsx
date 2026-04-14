"use client";

import styles from "./login.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (user === "admin" && password === "admin123") {
      router.push("/admin");
    } else if (user === "cozinha" && password === "cozinha123") {
      router.push("/cozinha");
    } else if (user === "caixa" && password === "caixa123") {
      router.push("/caixa");
    } else {
      alert("Credenciais inválidas");
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        {/* LEFT */}
        <div className={styles.left}>
          <span className={styles.badge}>Mesa Express</span>
          <h1>
            GERENCIE <br />
            SEUS <span>PEDIDOS.</span>
          </h1>
          <p>Controle total do seu restaurante em tempo real.</p>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <form onSubmit={handleLogin} className={styles.form}>
            <h2>Login</h2>
            <p className={styles.formSubtitle}>Acesse seu painel com segurança.</p>

            <label className={styles.field}>
              <span>
                Usuário <strong className={styles.required}>*</strong>
              </span>
              <input
                type="text"
                placeholder="Digite seu usuário"
                value={user}
                required
                onChange={(e) => setUser(e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>
                Senha <strong className={styles.required}>*</strong>
              </span>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button type="submit">
              <span className={styles.buttonText}>Entrar</span>
              <span className={styles.buttonIcon} aria-hidden="true">
                →
              </span>
            </button>
            <span className={styles.helperText}>Somente usuários autorizados.</span>
          </form>
        </div>
      </div>
    </div>
  );
}