import { Link } from "react-router-dom";
import { useSocialStats } from "../hooks/useSocialStats";
import { SocialStatsRail } from "../components/SocialStatsRail";
import type { InteractionStat } from "../lib/types";

function StatList({
  title,
  icon,
  stats,
}: {
  title: string;
  icon: string;
  stats: InteractionStat[];
}) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary text-[22px]">{icon}</span>
        <h2 className="font-headline-sm text-primary">{title}</h2>
      </div>

      <div className="flex flex-col gap-2">
        {stats.length === 0 ? (
          <p className="text-sm text-on-surface-variant py-2">Nenhum dado registrado até o momento.</p>
        ) : (
          stats.map(({ user, count }) => {
            const initials = (user.name || user.username).slice(0, 2).toUpperCase();
            return (
              <Link
                key={user.id}
                to={`/perfil/${user.username}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container transition-all group border border-outline-variant/10"
              >
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm uppercase shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-lg text-primary truncate group-hover:underline">
                      {user.name}
                    </span>
                    <span className="font-label-sm text-on-surface-variant truncate">
                      @{user.username}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface-container-low text-primary font-semibold text-sm">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    chat_bubble_outline
                  </span>
                  <span>{count} interações</span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export function Stats() {
  const { iComment, commentsMe, loading } = useSocialStats(10);

  return (
    <div className="max-w-[1400px] mx-auto w-full px-space-md lg:px-space-xl py-space-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <section className="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
          <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex items-center gap-space-sm">
            <div className="w-2.5 h-7 bg-secondary-container rounded-full" />
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                Estatísticas Sociais &amp; Redes
              </h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Métricas de engajamento acadêmico e trocas de ideias
              </p>
            </div>
          </div>

          {loading ? (
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl text-center text-on-surface-variant shadow-sm border border-outline-variant/20 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-3xl animate-spin">
                autorenew
              </span>
              <span>Carregando estatísticas sociais...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-space-lg">
              <StatList title="Quem você mais comenta" icon="forum" stats={iComment} />
              <StatList title="Quem mais te comenta" icon="mark_chat_unread" stats={commentsMe} />
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
