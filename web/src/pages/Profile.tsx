import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { SocialStatsRail } from "../components/SocialStatsRail";
import { usePostList } from "../hooks/usePostList";
import { request } from "../lib/api";
import type { Profile as ProfileType } from "../lib/types";

export function Profile() {
  const { username = "" } = useParams();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { posts, loading, hasMore, loadMore, removePost } = usePostList(`/users/${username}/posts`);

  useEffect(() => {
    let active = true;
    setError(null);

    request<ProfileType>(`/users/${username}`)
      .then((loaded) => {
        if (active) {
          setProfile(loaded);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Não foi possível carregar o perfil.");
        }
      });

    return () => {
      active = false;
    };
  }, [username]);

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto w-full px-space-md lg:px-space-xl py-space-lg">
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg text-center text-error shadow-sm border border-error-container">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-[1400px] mx-auto w-full px-space-md lg:px-space-xl py-space-lg">
        <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center shadow-sm flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container text-3xl animate-spin">
            autorenew
          </span>
          <span>Carregando perfil...</span>
        </div>
      </div>
    );
  }

  const initials = (profile.name || profile.username).slice(0, 2).toUpperCase();

  return (
    <div className="max-w-[1400px] mx-auto w-full px-space-md lg:px-space-xl py-space-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <section className="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-primary hover:text-secondary font-label-md transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Voltar ao Feed</span>
          </Link>

          {/* Profile Header Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-container to-secondary text-on-primary flex items-center justify-center font-headline-md font-bold shadow-md uppercase shrink-0">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-headline-lg text-headline-lg text-primary">{profile.name}</h1>
                <span className="font-label-md text-on-surface-variant">@{profile.username}</span>
              </div>

              {profile.bio && (
                <p className="text-on-surface text-sm mt-1 leading-relaxed">{profile.bio}</p>
              )}

              <div className="flex items-center gap-space-md mt-3 text-xs text-on-surface-variant flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-surface-container-low text-primary font-semibold">
                  <strong>{profile.counts.posts}</strong> publicações
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-container-low text-primary font-semibold">
                  <strong>{profile.counts.comments}</strong> comentários
                </span>
              </div>
            </div>
          </div>

          {/* User's Posts list */}
          <div className="flex flex-col gap-space-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">feed</span>
              <h2 className="font-headline-sm text-primary">Publicações de {profile.name}</h2>
            </div>

            {loading && posts.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center text-on-surface-variant shadow-sm border border-outline-variant/20">
                Carregando publicações...
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg text-center text-on-surface-variant shadow-sm border border-outline-variant/20">
                {profile.name} ainda não realizou publicações.
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
                    className="w-full py-3 bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md rounded-2xl shadow-sm border border-outline-variant/20 transition-all"
                  >
                    Carregar mais publicações
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="lg:col-span-4 w-full">
          <SocialStatsRail />
        </div>
      </div>
    </div>
  );
}
