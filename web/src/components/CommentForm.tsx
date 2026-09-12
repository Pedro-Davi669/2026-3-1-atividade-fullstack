import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type CommentFormProps = {
  placeholder?: string;
  autoFocus?: boolean;
  onSubmit: (content: string) => Promise<void>;
};

export function CommentForm({
  placeholder = "Escreva um comentário acadêmico ou dúvida...",
  autoFocus,
  onSubmit,
}: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  if (!user) {
    return (
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 text-center">
        <Link to="/login" className="text-secondary font-semibold hover:underline">
          Entre na sua conta
        </Link>{" "}
        <span className="text-on-surface-variant text-sm">para participar da discussão.</span>
      </div>
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-end gap-2 bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 shadow-sm focus-within:ring-2 focus-within:ring-secondary-container transition-all"
    >
      <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
        {user.username.slice(0, 2)}
      </div>

      <textarea
        className="flex-1 bg-transparent border-0 resize-none font-body-md text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none py-1"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        maxLength={280}
        rows={2}
        autoFocus={autoFocus}
      />

      <button
        type="submit"
        disabled={sending || !content.trim()}
        className="px-4 py-2 rounded-xl bg-secondary-container text-on-primary font-label-md hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shrink-0 shadow-sm"
      >
        <span className="material-symbols-outlined text-[18px]">send</span>
        <span>{sending ? "..." : "Enviar"}</span>
      </button>
    </form>
  );
}
