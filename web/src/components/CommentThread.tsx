import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { fullDate, relativeTime } from "../lib/format";
import { CommentForm } from "./CommentForm";
import type { Comment } from "../lib/types";

type ThreadProps = {
  comments: Comment[];
  onReply: (parentId: string, content: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
};

function Node({
  comment,
  onReply,
  onRemove,
}: { comment: Comment } & Omit<ThreadProps, "comments">) {
  const { user } = useAuth();
  const [replying, setReplying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const initials = (comment.author.name || comment.author.username).slice(0, 2).toUpperCase();

  const handleRemove = async () => {
    if (!confirm("Deseja apagar este comentário?")) return;
    setDeleting(true);
    try {
      await onRemove(comment.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <li className="flex flex-col gap-2 pt-2">
      <div className="bg-surface-container-low/80 hover:bg-surface-container-low rounded-xl p-space-md flex items-start gap-space-sm transition-colors border border-outline-variant/20">
        <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-label-sm font-bold shrink-0 uppercase">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-space-xs mb-1 flex-wrap">
            <div className="flex items-center gap-space-xs">
              <Link
                to={`/perfil/${comment.author.username}`}
                className="font-label-md text-label-md text-primary hover:underline"
              >
                {comment.author.name}
              </Link>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                @{comment.author.username}
              </span>
            </div>
            <time
              className="text-on-surface-variant font-label-sm text-label-sm"
              dateTime={comment.createdAt}
              title={fullDate(comment.createdAt)}
            >
              {relativeTime(comment.createdAt)}
            </time>
          </div>

          <p className="text-on-surface font-body-md text-body-md whitespace-pre-wrap">
            {comment.content}
          </p>

          <div className="flex items-center gap-space-md mt-2">
            {user && (
              <button
                type="button"
                onClick={() => setReplying((open) => !open)}
                className="text-on-surface-variant hover:text-secondary font-label-sm text-label-sm flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">reply</span>
                <span>{replying ? "Cancelar" : "Responder"}</span>
              </button>
            )}

            {user?.id === comment.author.id && (
              <button
                type="button"
                disabled={deleting}
                onClick={handleRemove}
                className="text-error/70 hover:text-error font-label-sm text-label-sm flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
                <span>Apagar</span>
              </button>
            )}
          </div>

          {replying && (
            <div className="mt-3">
              <CommentForm
                autoFocus
                placeholder={`Responder ${comment.author.name}...`}
                onSubmit={async (content) => {
                  await onReply(comment.id, content);
                  setReplying(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {comment.replies.length > 0 && (
        <ul className="pl-4 sm:pl-8 border-l-2 border-secondary-container/30 flex flex-col gap-2">
          {comment.replies.map((reply) => (
            <Node key={reply.id} comment={reply} onReply={onReply} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function CommentThread({ comments, onReply, onRemove }: ThreadProps) {
  return (
    <ul className="flex flex-col gap-3">
      {comments.map((comment) => (
        <Node key={comment.id} comment={comment} onReply={onReply} onRemove={onRemove} />
      ))}
    </ul>
  );
}
