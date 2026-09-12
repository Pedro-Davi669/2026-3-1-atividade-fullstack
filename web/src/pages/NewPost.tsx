import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError, request } from "../lib/api";
import { SocialStatsRail } from "../components/SocialStatsRail";
import type { Post } from "../lib/types";

const LIMIT = 280;

export function NewPost() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;

    setError(null);
    setSending(true);

    try {
      await request<Post>("/posts", { method: "POST", body: { content: content.trim() } });
      navigate("/meus-posts");
    } catch (cause) {
      const detail = cause instanceof ApiError ? cause.details?.[0]?.message : null;
      setError(detail ?? (cause instanceof Error ? cause.message : "Não foi possível publicar."));
      setSending(false);
    }
  };

  const insertSnippet = (snippet: string) => {
    setContent((prev) => (prev ? `${prev} ${snippet}` : snippet));
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-space-md lg:px-space-xl py-space-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <section className="lg:col-span-8 flex flex-col gap-space-md min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-primary hover:text-secondary font-label-md transition-colors mb-1"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Voltar ao Feed</span>
          </Link>

          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-2.5 h-7 bg-secondary-container rounded-full" />
              <div>
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                  Nova Publicação
                </h1>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  As publicações no Diatinf X são acadêmicas e moderadas.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-error-container/40 text-error rounded-xl text-sm border border-error/20 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-space-md">
              <div className="flex flex-col gap-2">
                <label htmlFor="post-content" className="font-label-sm text-on-surface-variant">
                  O que você quer compartilhar com a turma?
                </label>
                <textarea
                  id="post-content"
                  className="w-full bg-surface-container-low/70 hover:bg-surface-container-low focus:bg-surface-container-lowest p-space-md rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all resize-none border border-outline-variant/20"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={LIMIT}
                  placeholder="Compartilhe uma dúvida, trecho de código, artigo ou conquista acadêmica..."
                  rows={5}
                  autoFocus
                  required
                />
                <div className="flex justify-between items-center text-xs text-on-surface-variant px-1">
                  <span>Dica: Use hashtags como #devlife ou #diatinf</span>
                  <span className={content.length > LIMIT * 0.9 ? "text-secondary font-bold" : ""}>
                    {content.length} / {LIMIT}
                  </span>
                </div>
              </div>

              {/* Formatting helper buttons */}
              <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant/20">
                <div className="flex items-center gap-space-xs">
                  <button
                    type="button"
                    onClick={() => insertSnippet("```\n// código aqui\n```")}
                    className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors"
                    title="Inserir bloco de código"
                  >
                    <span className="material-symbols-outlined text-[20px]">terminal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet("#devlife")}
                    className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors"
                    title="Inserir tag #devlife"
                  >
                    <span className="material-symbols-outlined text-[20px]">tag</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet("#diatinf")}
                    className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors"
                    title="Inserir tag #diatinf"
                  >
                    <span className="material-symbols-outlined text-[20px]">hub</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={sending || !content.trim()}
                  className="flex items-center gap-space-xs px-space-lg py-2.5 rounded-xl bg-secondary-container text-on-primary font-label-lg text-label-lg hover:bg-secondary active:scale-[0.98] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>{sending ? "Publicando..." : "Publicar Agora"}</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        <div className="lg:col-span-4 w-full">
          <SocialStatsRail />
        </div>
      </div>
    </div>
  );
}
