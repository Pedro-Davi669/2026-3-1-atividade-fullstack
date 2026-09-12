import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { SocialStatsRail } from "../components/SocialStatsRail";
import { usePostList } from "../hooks/usePostList";

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const term = searchParams.get("q") ?? "";
  const [draft, setDraft] = useState(term);
  const { posts, loading, error, hasMore, loadMore, removePost } = usePostList("/posts", { q: term });

  useEffect(() => {
    setDraft(term);
  }, [term]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSearchParams(draft.trim() ? { q: draft.trim() } : {});
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full px-space-md lg:px-space-xl py-space-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <section className="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
          {/* Search Header Card */}
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-2.5 h-7 bg-secondary-container rounded-full" />
              <div>
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                  Explorar &amp; Pesquisar
                </h1>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Encontre publicações, discussões acadêmicas e pessoas
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="flex gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary-container transition-all"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Buscar por texto, hashtag (#devlife) ou nome..."
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-secondary-container text-on-primary font-label-md hover:bg-secondary transition-all shadow-sm flex items-center gap-1 shrink-0"
              >
                <span>Buscar</span>
              </button>
            </form>

            {term && (
              <p className="text-sm text-on-surface-variant">
                Exibindo resultados para: <strong className="text-primary">"{term}"</strong>
              </p>
            )}
          </div>

          {/* Results Stream */}
          {loading && posts.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center text-on-surface-variant shadow-sm border border-outline-variant/20 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-3xl animate-spin">
                autorenew
              </span>
              <span>Buscando publicações...</span>
            </div>
          ) : error ? (
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg text-center text-error shadow-sm border border-error-container">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center text-on-surface-variant shadow-sm border border-outline-variant/20 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-4xl">search_off</span>
              <p className="font-headline-sm text-primary">Nenhum resultado encontrado</p>
              <p className="text-sm">Tente buscar por outros termos, temas ou tags populares como #devlife.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-space-lg">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  preview={post.firstComment}
                  onRemoved={removePost}
                />
              ))}

              {hasMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  className="w-full py-3 bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md rounded-2xl shadow-sm border border-outline-variant/20 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  <span>Carregar mais resultados</span>
                </button>
              )}
            </div>
          )}
        </section>

        <div className="lg:col-span-4 w-full">
          <SocialStatsRail />
        </div>
      </div>
    </div>
  );
}
