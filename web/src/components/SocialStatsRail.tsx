import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSocialStats } from "../hooks/useSocialStats";
import type { InteractionStat } from "../lib/types";

const TRENDING_TOPICS = [
  { tag: "#devlife", posts: "142 publicações" },
  { tag: "#criatividade", posts: "98 publicações" },
  { tag: "#deploy", posts: "54 discussões ativas" },
  { tag: "#diatinf", posts: "Canal Geral da Instituição" },
];

function StatUserList({
  title,
  icon,
  iconColor,
  stats,
  emptyMessage,
}: {
  title: string;
  icon: string;
  iconColor?: string;
  stats: InteractionStat[];
  emptyMessage?: string;
}) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className={`material-symbols-outlined text-[20px] ${iconColor ?? "text-primary"}`}>
            {icon}
          </span>
          <span className="font-headline-sm text-headline-sm text-primary">{title}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
          {stats.length}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        {stats.length === 0 ? (
          <p className="text-sm text-on-surface-variant py-2">{emptyMessage ?? "Nenhuma interação registrada ainda."}</p>
        ) : (
          stats.map(({ user, count }) => {
            const initials = (user.name || user.username).slice(0, 2).toUpperCase();
            return (
              <Link
                key={user.id}
                to={`/perfil/${user.username}`}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container transition-all group"
              >
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary font-label-sm flex items-center justify-center font-bold uppercase shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md text-primary truncate group-hover:underline">
                      {user.name}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-lg shrink-0">
                  <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                  <span className="font-label-sm text-label-sm font-semibold">{count}</span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export function SocialStatsRail() {
  const { user } = useAuth();
  const { iComment, commentsMe, loading } = useSocialStats(6);

  return (
    <aside className="flex flex-col gap-space-lg w-full">
      {/* Trending Topics Card */}
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary-container text-[20px]">
              trending_up
            </span>
            <span className="font-headline-sm text-headline-sm text-primary">Em Alta no DIATINF</span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">Hoje</span>
        </div>
        <div className="flex flex-col gap-space-xs">
          {TRENDING_TOPICS.map((topic) => (
            <Link
              key={topic.tag}
              to={`/buscar?q=${encodeURIComponent(topic.tag)}`}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container transition-colors group"
            >
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-primary group-hover:text-secondary transition-colors">
                  {topic.tag}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {topic.posts}
                </span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary text-[18px]">
                chevron_right
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Social interaction cards */}
      {user ? (
        <>
          <StatUserList
            title="Quem você mais comenta"
            icon="forum"
            iconColor="text-primary"
            stats={iComment}
            emptyMessage={loading ? "Carregando estatísticas..." : "Você ainda não comentou posts de outros usuários."}
          />
          <StatUserList
            title="Quem mais te comenta"
            icon="mark_chat_unread"
            iconColor="text-secondary"
            stats={commentsMe}
            emptyMessage={loading ? "Carregando estatísticas..." : "Nenhum usuário comentou suas publicações ainda."}
          />
        </>
      ) : (
        <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-[20px]">group</span>
            <span className="font-headline-sm text-primary">Social Stats</span>
          </div>
          <p className="text-sm text-on-surface-variant">
            Faça login para ver com quem você mais interage na plataforma acadêmica.
          </p>
          <Link
            to="/login"
            className="mt-2 text-center py-2 px-4 rounded-xl bg-primary text-on-primary font-label-md hover:bg-primary-container transition-colors shadow-sm"
          >
            Entrar na sua conta
          </Link>
        </div>
      )}

      {/* Academic Network Info Badge */}
      <div className="bg-gradient-to-br from-primary-container to-primary text-on-primary p-space-md rounded-2xl flex items-center gap-space-md shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-secondary-container/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-secondary-container text-[24px]">verified</span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-lg text-label-lg font-bold">DIATINF Conectado</span>
          <span className="font-body-sm text-body-sm text-on-primary-container">
            Ambiente colaborativo moderado pelo departamento de TI acadêmico.
          </span>
        </div>
      </div>
    </aside>
  );
}
