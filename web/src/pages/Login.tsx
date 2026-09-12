import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../lib/api";

type Mode = "login" | "register";

export function Login() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  if (user) {
    return <Navigate to={from} replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register({ username, name, password });
      }
      navigate(from, { replace: true });
    } catch (cause) {
      const detail = cause instanceof ApiError ? cause.details?.[0]?.message : null;
      setError(detail ?? (cause instanceof Error ? cause.message : "Não foi possível entrar."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-space-md py-space-xl">
      <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-md border border-outline-variant/20 max-w-md w-full flex flex-col gap-space-lg">
        {/* Header / Brand */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-secondary-container text-[28px]">hub</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight">
            DIATINF <span className="text-secondary-container">X</span>
          </h1>
          <p className="text-sm text-on-surface-variant">
            Rede acadêmica da comunidade de Informática para Internet.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-surface-container-low p-1 rounded-xl">
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg font-label-md transition-all ${
              mode === "login"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            onClick={() => setMode("login")}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg font-label-md transition-all ${
              mode === "register"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
            onClick={() => setMode("register")}
          >
            Criar conta
          </button>
        </div>

        {error && (
          <div className="p-3 bg-error-container/40 text-error rounded-xl text-sm border border-error/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-on-surface-variant" htmlFor="username">
              Nome de usuário
            </label>
            <input
              id="username"
              className="w-full px-space-md py-2.5 bg-surface-container-low rounded-xl text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="ex: joaosouza"
              required
            />
          </div>

          {mode === "register" && (
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-on-surface-variant" htmlFor="name">
                Nome completo
              </label>
              <input
                id="name"
                className="w-full px-space-md py-2.5 bg-surface-container-low rounded-xl text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="ex: João Souza"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-on-surface-variant" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              className="w-full px-space-md py-2.5 bg-surface-container-low rounded-xl text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </div>

          <button
            className="w-full mt-2 py-3 rounded-xl bg-secondary-container text-on-primary font-label-lg hover:bg-secondary active:scale-[0.99] shadow-sm transition-all disabled:opacity-50"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Processando..." : mode === "login" ? "Entrar na rede" : "Cadastrar conta"}
          </button>
        </form>

        <div className="p-space-sm bg-surface-container-low rounded-xl text-xs text-on-surface-variant flex flex-col gap-1">
          <span className="font-semibold text-primary">Contas de demonstração:</span>
          <span>
            Usuários: <code className="bg-surface-container px-1 py-0.5 rounded">joaosouza</code>,{" "}
            <code className="bg-surface-container px-1 py-0.5 rounded">mariasilva</code>,{" "}
            <code className="bg-surface-container px-1 py-0.5 rounded">pedrolima</code>
          </span>
          <span>
            Senha padrão: <code className="bg-surface-container px-1 py-0.5 rounded">diatinf123</code>
          </span>
        </div>

        <Link to="/" className="text-center text-sm text-on-surface-variant hover:text-primary transition-colors">
          Continuar sem entrar
        </Link>
      </div>
    </div>
  );
}
