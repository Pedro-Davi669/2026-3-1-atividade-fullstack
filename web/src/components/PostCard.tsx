import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { request } from "../lib/api";
import { fullDate, relativeTime } from "../lib/format";
import { StarRating } from "./StarRating";
import type { CommentPreview, Post, Rating } from "../lib/types";

type PostCardProps = {
  post: Post;
  preview?: CommentPreview | null;
  onRemoved?: (id: string) => void;
};

function getAvatarStyle(username: string) {
  const hash = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const styles = [
    "bg-primary-container text-on-primary",
    "bg-gradient-to-tr from-secondary-container to-secondary text-on-primary",
    "bg-primary-fixed-variant text-on-primary",
    "bg-surface-variant text-primary",
    "bg-secondary-fixed text-on-secondary-fixed",
  ];
  return styles[hash % styles.length];
}

function getTagBadge(username: string) {
  const map: Record<string, string> = {
    mariasilva: "Design",
    carloscosta: "DevOps",
    pedrolima: "Frontend",
    joaosouza: "Infoweb",
    anacosta: "A11y",
    fernandadias: "Database",
    luispereira: "TypeScript",
  };
  return map[username.toLowerCase()] ?? "DIATINF";
}

export function PostCard({ post, preview, onRemoved }: PostCardProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<Rating>(post.rating);
  const [removing, setRemoving] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(() => (post.id.charCodeAt(0) % 15) + 1);
  const [copied, setCopied] = useState(false);

  const remove = async () => {
    if (!confirm("Tem certeza que deseja apagar esta publicação?")) return;
    setRemoving(true);
    try {
      await request(`/posts/${post.id}`, { method: "DELETE" });
      onRemoved?.(post.id);
    } catch {
      setRemoving(false);
    }
  };

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikesCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render text with highlighted hashtags
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return (
      <p className="whitespace-pre-wrap leading-relaxed">
        {parts.map((part, index) => {
          if (part.startsWith("#")) {
            return (
              <span
                key={index}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded-lg bg-surface-container text-secondary font-label-md hover:bg-surface-variant cursor-pointer transition-colors"
              >
                {part}
              </span>
            );
          }
          return part;
        })}
      </p>
    );
  };

  const initials = (post.author.name || post.author.username)
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col gap-space-md border border-outline-variant/20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <Link
            to={`/perfil/${post.author.username}`}
            className={`w-10 h-10 rounded-xl ${getAvatarStyle(
              post.author.username
            )} flex items-center justify-center font-label-lg font-bold shadow-sm shrink-0`}
          >
            {initials}
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs flex-wrap">
              <Link
                to={`/perfil/${post.author.username}`}
                className="font-headline-sm text-headline-sm text-primary hover:underline"
              >
                {post.author.name}
              </Link>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                @{post.author.username}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                {getTagBadge(post.author.username)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <time dateTime={post.createdAt} title={fullDate(post.createdAt)}>
                {relativeTime(post.createdAt)}
              </time>
            </div>
          </div>
        </div>

        {user?.id === post.author.id && onRemoved ? (
          <button
            onClick={remove}
            disabled={removing}
            className="p-space-xs rounded-lg text-error hover:bg-error-container/20 transition-colors"
            title="Apagar publicação"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        ) : (
          <button
            aria-label="Opções do post"
            className="p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
          </button>
        )}
      </header>

      {/* Post Text */}
      <div className="text-on-surface font-body-lg text-body-lg pl-0 sm:pl-12 flex flex-col gap-space-sm">
        {renderFormattedContent(post.content)}
      </div>

      {/* Post Actions Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs pl-0 sm:pl-12 border-t border-outline-variant/10">
        <div className="flex items-center gap-space-sm flex-wrap">
          <Link
            to={`/post/${post.id}`}
            className="flex items-center gap-space-xs px-space-md py-1.5 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span>Comentar {post.commentCount > 0 ? `(${post.commentCount})` : ""}</span>
          </Link>

          <button
            onClick={toggleLike}
            className={`p-2 rounded-xl transition-colors flex items-center gap-1 font-label-sm text-label-sm ${
              liked
                ? "text-secondary bg-secondary-fixed"
                : "text-on-surface-variant hover:bg-surface-container hover:text-secondary"
            }`}
            title="Curtir publicação"
            type="button"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
            >
              thumb_up
            </span>
            <span>{likesCount}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors flex items-center gap-1 font-label-sm"
            title="Compartilhar link"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
            {copied && <span className="text-xs text-secondary font-semibold">Copiado!</span>}
          </button>
        </div>

        {/* Rating Component */}
        <StarRating postId={post.id} rating={rating} onChange={setRating} />
      </footer>

      {/* Nested Comment Thread Preview */}
      {preview && (
        <div className="pl-0 sm:pl-12 pt-space-xs flex flex-col gap-space-xs">
          <Link
            to={`/post/${post.id}`}
            className="bg-surface-container-low/70 hover:bg-surface-container-low rounded-xl p-space-md flex items-start gap-space-sm transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-label-sm font-bold shrink-0 uppercase">
              {preview.author.username.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-space-xs mb-1">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-md text-label-md text-primary group-hover:underline">
                    {preview.author.name}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    @{preview.author.username}
                  </span>
                </div>
              </div>
              <p className="text-on-surface font-body-md text-body-md">{preview.content}</p>
              <div className="flex items-center gap-space-md mt-2">
                <span className="text-on-surface-variant hover:text-secondary font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">reply</span>
                  Ver conversa completa
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}
    </article>
  );
}
