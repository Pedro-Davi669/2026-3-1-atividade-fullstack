import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { request } from "../lib/api";
import type { Rating } from "../lib/types";

const VALUES = [1, 2, 3];

type StarRatingProps = {
  postId: string;
  rating: Rating;
  onChange: (rating: Rating) => void;
};

export function StarRating({ postId, rating, onChange }: StarRatingProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const submit = async (value: number) => {
    if (!user) {
      navigate("/login", { state: { from: `/post/${postId}` } });
      return;
    }

    setSaving(true);

    try {
      const updated =
        rating.myValue === value
          ? await request<Rating>(`/posts/${postId}/rating`, { method: "DELETE" })
          : await request<Rating>(`/posts/${postId}/rating`, { method: "PUT", body: { value } });
      onChange(updated);
    } catch {
      /* mantém a avaliação atual quando a requisição falha */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-xl">
      <div
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md font-label-md text-label-md ${
          rating.count > 0 ? "bg-tertiary-fixed text-on-tertiary-fixed font-bold" : "text-primary"
        }`}
        title={`${rating.count} avaliação(ões)`}
      >
        <span
          className="material-symbols-outlined text-secondary text-[18px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
        <span>{rating.count > 0 ? rating.average : 0}</span>
      </div>

      <div className="h-4 w-px bg-outline-variant/40" />

      <div className="flex items-center gap-1">
        {VALUES.map((value) => {
          const isSelected = rating.myValue === value;
          return (
            <button
              key={value}
              type="button"
              disabled={saving}
              onClick={() => submit(value)}
              className={`px-2 py-0.5 rounded-lg text-on-surface font-label-sm text-label-sm transition-all flex items-center gap-0.5 ${
                isSelected
                  ? "bg-secondary-container text-on-primary font-bold shadow-sm"
                  : "bg-surface-container-lowest hover:bg-secondary-fixed/60"
              }`}
              title={
                !user
                  ? "Entre para avaliar"
                  : isSelected
                    ? "Remover sua avaliação"
                    : `Avaliar com ${value} estrela(s)`
              }
            >
              <span>{value}</span>
              <span className="text-secondary text-[12px]">★</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
