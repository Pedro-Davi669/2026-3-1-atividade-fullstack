import { useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usePostList } from "../hooks/usePostList";
import { PostCard } from "../components/PostCard";
import { SocialStatsRail } from "../components/SocialStatsRail";
import { request } from "../lib/api";
import type { Post } from "../lib/types";

type FilterType = "recent" | "rated" | "following";

export function Feed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { posts, loading, error, hasMore, loadMore, removePost } = usePostList("/posts");
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [composerText, setComposerText] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("recent");

  const combinedPosts = [
    ...localPosts,
    ...posts.filter((p) => !localPosts.some((lp) => lp.id === p.id)),
  ];

  const sortedPosts = [...combinedPosts].sort((a, b) => {
    if (activeFilter === "rated") {
      return (b.rating?.average || 0) - (a.rating?.average || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handlePublish = async () => {
    if (!composerText.trim()) return;
    if (!user) {
      navigate("/login");
      return;
    }

    setPosting(true);
    setPostError(null);

    try {
      const created = await request<Post>("/posts", {
        method: "POST",
        body: { content: composerText.trim() },
      });
      setLocalPosts((prev) => [created, ...prev]);
      setComposerText("");
    } catch (err: unknown) {
      setPostError(err instanceof Error ? err.message : "Erro ao publicar.");
    } finally {
      setPosting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handlePublish();
    }
  };

  const insertSnippet = (snippet: string) => {
    setComposerText((prev) => (prev ? `${prev} ${snippet}` : snippet));
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-space-md lg:px-space-xl py-space-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Central Feed Flow (Cols 1-8 Desktop) */}
        <section className="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
          {/* Header & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-space-sm">
              <div className="w-2.5 h-7 bg-secondary-container rounded-full" />
              <div className="flex flex-col">
                <span className="font-headline-lg text-headline-lg text-primary tracking-tight">
                  Feed Global
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Compartilhamento de ideias, dúvidas e projetos acadêmicos
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setActiveFilter("recent")}
                className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1 ${
                  activeFilter === "recent"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                <span>Recentes</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("rated")}
                className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1 ${
                  activeFilter === "rated"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span>Mais avaliados</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("following")}
                className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1 ${
                  activeFilter === "following"
                    ? "bg-surface-container-lowest text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">group</span>
                <span>Seguindo</span>
              </button>
            </div>
          </div>

          {/* Quick Post Composer */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md transition-all border border-outline-variant/20">
            <div className="flex gap-space-md items-start">
              {user ? (
                <div className="w-11 h-11 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-label-lg font-bold shrink-0 shadow-sm uppercase">
                  {user.username.slice(0, 2)}
                </div>
              ) : (
                <div className="w-11 h-11 rounded-xl bg-surface-container-high text-primary flex items-center justify-center font-label-lg shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">person</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                {user ? (
                  <div className="flex items-center gap-space-xs mb-1">
                    <span className="font-label-lg text-label-lg text-primary">{user.name}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      @{user.username}
                    </span>
                    <span className="text-on-surface-variant font-body-sm text-body-sm">•</span>
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-primary font-label-sm text-label-sm">
                      Você
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-space-xs mb-1">
                    <Link to="/login" className="font-label-md text-secondary hover:underline">
                      Faça login
                    </Link>
                    <span className="font-label-sm text-on-surface-variant">para participar das discussões</span>
                  </div>
                )}

                <textarea
                  className="w-full bg-surface-container-low/60 hover:bg-surface-container-low focus:bg-surface-container-lowest p-space-md rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all resize-none border border-transparent focus:border-secondary-container/40"
                  placeholder="O que você está pensando ou desenvolvendo hoje? Compartilhe um trecho de código, projeto ou reflexão..."
                  rows={3}
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!user || posting}
                />
              </div>
            </div>

            {postError && (
              <div className="text-sm text-error bg-error-container/40 px-3 py-1.5 rounded-lg ml-0 sm:ml-14">
                {postError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs pl-0 sm:pl-14">
              <div className="flex items-center gap-space-xs">
                <button
                  className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors"
                  title="Publicações apenas aceitam texto"
                  type="button"
                  onClick={() => alert("As publicações do Diatinf X aceitam apenas textos e emojis.")}
                >
                  <span className="material-symbols-outlined text-[20px]">image</span>
                </button>
                <button
                  className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors"
                  title="Inserir Código"
                  type="button"
                  onClick={() => insertSnippet("```\n// seu código aqui\n```")}
                >
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                </button>
                <button
                  className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors"
                  title="Adicionar Tag"
                  type="button"
                  onClick={() => insertSnippet("#devlife")}
                >
                  <span className="material-symbols-outlined text-[20px]">tag</span>
                </button>
                <button
                  className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors"
                  title="Adicionar Tag Institucional"
                  type="button"
                  onClick={() => insertSnippet("#diatinf")}
                >
                  <span className="material-symbols-outlined text-[20px]">hub</span>
                </button>
              </div>

              <div className="flex items-center gap-space-md">
                <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">
                  Ctrl + Enter para postar
                </span>
                {user ? (
                  <button
                    onClick={handlePublish}
                    disabled={posting || !composerText.trim()}
                    className="flex items-center gap-space-xs px-space-lg py-2 rounded-xl bg-secondary-container text-on-primary font-label-lg text-label-lg hover:bg-secondary active:scale-[0.98] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>{posting ? "Enviando..." : "Publicar"}</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-space-xs px-space-lg py-2 rounded-xl bg-primary text-on-primary font-label-lg hover:bg-primary-container shadow-sm transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    <span>Entrar</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Posts Stream */}
          {loading && combinedPosts.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center text-on-surface-variant shadow-sm border border-outline-variant/20 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-3xl animate-spin">
                autorenew
              </span>
              <span>Carregando publicações...</span>
            </div>
          ) : error ? (
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg text-center text-error shadow-sm border border-error-container">
              {error}
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center text-on-surface-variant shadow-sm border border-outline-variant/20 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-4xl">dynamic_feed</span>
              <p className="font-headline-sm text-primary">Nenhuma publicação por enquanto</p>
              <p className="text-sm">Seja o primeiro a compartilhar algo com a comunidade acadêmica!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-space-lg">
              {sortedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  preview={post.firstComment}
                  onRemoved={(id) => {
                    setLocalPosts((prev) => prev.filter((p) => p.id !== id));
                    removePost(id);
                  }}
                />
              ))}

              {hasMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  className="w-full py-3 bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md rounded-2xl shadow-sm border border-outline-variant/20 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  <span>Carregar mais publicações</span>
                </button>
              )}
            </div>
          )}
        </section>

        {/* Contextual Discovery Rail (Cols 9-12 Desktop) */}
        <div className="lg:col-span-4 w-full">
          <SocialStatsRail />
        </div>
      </div>
    </div>
  );
}
