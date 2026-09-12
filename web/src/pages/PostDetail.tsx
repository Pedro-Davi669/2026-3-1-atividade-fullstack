import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { CommentForm } from "../components/CommentForm";
import { CommentThread } from "../components/CommentThread";
import { SocialStatsRail } from "../components/SocialStatsRail";
import { request } from "../lib/api";
import type { Comment, Post } from "../lib/types";

export function PostDetail() {
  const { id = "" } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setComments(await request<Comment[]>(`/posts/${id}/comments`));
  }, [id]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([request<Post>(`/posts/${id}`), request<Comment[]>(`/posts/${id}/comments`)])
      .then(([loadedPost, loadedComments]) => {
        if (active) {
          setPost(loadedPost);
          setComments(loadedComments);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Não foi possível carregar a publicação.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const bumpCount = (delta: number) => {
    setPost((current) => (current ? { ...current, commentCount: current.commentCount + delta } : current));
  };

  const comment = async (content: string) => {
    await request(`/posts/${id}/comments`, { method: "POST", body: { content } });
    await loadComments();
    bumpCount(1);
  };

  const reply = async (parentId: string, content: string) => {
    await request(`/comments/${parentId}/replies`, { method: "POST", body: { content } });
    await loadComments();
    bumpCount(1);
  };

  const remove = async (commentId: string) => {
    await request(`/comments/${commentId}`, { method: "DELETE" });
    await loadComments();
    bumpCount(-1);
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto w-full px-space-md lg:px-space-xl py-space-lg">
        <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center shadow-sm flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container text-3xl animate-spin">
            autorenew
          </span>
          <span>Carregando publicação...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-[1400px] mx-auto w-full px-space-md lg:px-space-xl py-space-lg">
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg text-center text-error shadow-sm border border-error-container">
          {error ?? "Publicação não encontrada."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto w-full px-space-md lg:px-space-xl py-space-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <section className="lg:col-span-8 flex flex-col gap-space-md min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-primary hover:text-secondary font-label-md transition-colors mb-2"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Voltar ao Feed Global</span>
          </Link>

          <PostCard post={post} />

          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-md mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">forum</span>
                <h2 className="font-headline-sm text-primary">
                  Comentários ({post.commentCount})
                </h2>
              </div>
            </div>

            <CommentForm onSubmit={comment} />

            {comments.length === 0 ? (
              <div className="text-center py-6 text-on-surface-variant">
                <p className="text-sm">Ainda não há comentários nesta publicação. Seja o primeiro a responder!</p>
              </div>
            ) : (
              <CommentThread comments={comments} onReply={reply} onRemove={remove} />
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
