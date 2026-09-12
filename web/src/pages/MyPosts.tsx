import { Link } from "react-router-dom";
import { usePostList } from "../hooks/usePostList";
import { PostCard } from "../components/PostCard";
import { SocialStatsRail } from "../components/SocialStatsRail";

export function MyPosts() {
  const { posts, loading, error, hasMore, loadMore, removePost } = usePostList("/posts/me");

  return (
    <div className="max-w-[1400px] mx-auto w-full px-space-md lg:px-space-xl py-space-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <section className="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
          <div className="flex items-center justify-between bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20">
            <div className="flex items-center gap-space-sm">
              <div className="w-2.5 h-7 bg-secondary-container rounded-full" />
              <div>
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                  Minhas Publicações
                </h1>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Histórico de tudo o que você já compartilhou no Diatinf X
                </p>
              </div>
            </div>

            <Link
              to="/novo"
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-secondary-container text-on-primary font-label-md hover:bg-secondary transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Novo Post</span>
            </Link>
          </div>

          {loading && posts.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center text-on-surface-variant shadow-sm border border-outline-variant/20 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-3xl animate-spin">
                autorenew
              </span>
              <span>Carregando suas publicações...</span>
            </div>
          ) : error ? (
            <div className="bg-surface-container-lowest rounded-2xl p-space-lg text-center text-error shadow-sm border border-error-container">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center text-on-surface-variant shadow-sm border border-outline-variant/20 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-secondary-container text-4xl">article</span>
              <p className="font-headline-sm text-primary">Você ainda não publicou nada</p>
              <p className="text-sm">Compartilhe um código, reflexão ou projeto com a comunidade!</p>
              <Link
                to="/novo"
                className="mt-2 inline-flex items-center gap-2 px-space-lg py-2.5 rounded-xl bg-secondary-container text-on-primary font-label-md hover:bg-secondary transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Criar primeira publicação</span>
              </Link>
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
                  <span>Carregar mais publicações</span>
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
