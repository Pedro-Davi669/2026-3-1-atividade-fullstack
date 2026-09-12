import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/buscar");
    }
  };

  const navLinks = [
    { to: "/", label: "Feed Global", icon: "dynamic_feed" },
    { to: "/meus-posts", label: "Meus Posts", icon: "article" },
    { to: "/notificacoes", label: "Notificações", icon: "notifications", badge: "4" },
    { to: "/buscar", label: "Explorar", icon: "explore" },
    { to: "/mensagens", label: "Mensagens", icon: "chat_bubble" },
    { to: user ? `/perfil/${user.username}` : "/login", label: "Perfil", icon: "account_circle" },
    { to: "/stats", label: "Social Stats", icon: "monitoring" },
  ];

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] px-space-md py-space-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-space-lg">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-space-sm px-space-sm group">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-secondary-container text-[24px]">hub</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary-container tracking-tight">
                DIATINF <span className="text-secondary-container">X</span>
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Rede Acadêmica &amp; Tech</span>
            </div>
          </Link>

          {/* New Post Button */}
          <Link
            to="/novo"
            className="w-full flex items-center justify-center gap-space-xs py-space-sm px-space-md rounded-xl bg-secondary-container text-on-primary font-label-lg text-label-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] hover:bg-secondary active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Novo Post</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-space-xs">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center justify-between px-space-md py-space-sm rounded-xl font-label-lg text-label-lg transition-all ${
                    isActive
                      ? "bg-primary-container text-on-primary font-semibold shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-primary font-label-sm text-label-sm leading-none">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Card Footer */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30">
              <Link to={`/perfil/${user.username}`} className="flex items-center gap-space-sm min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shrink-0 uppercase">
                  {user.username.slice(0, 2)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-on-surface truncate">{user.name}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant truncate">@{user.username}</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
                title="Opções da conta"
              >
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-space-sm p-space-sm rounded-xl bg-primary text-on-primary font-label-md hover:bg-primary-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Entrar / Cadastrar</span>
            </Link>
          )}

          {/* User Popover Menu */}
          {userDropdownOpen && user && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/40 py-1.5 z-50 flex flex-col">
              <Link
                to={`/perfil/${user.username}`}
                className="flex items-center gap-2 px-space-md py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                <span>Meu Perfil</span>
              </Link>
              <Link
                to="/meus-posts"
                className="flex items-center gap-2 px-space-md py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">article</span>
                <span>Minhas Publicações</span>
              </Link>
              <div className="h-px bg-outline-variant/30 my-1" />
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 px-space-md py-2 text-sm text-error hover:bg-error-container/20 transition-colors w-full text-left"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sair da conta</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area (Offset for Desktop Sidebar) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Fixed Top Header */}
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-md lg:px-gutter-desktop border-b border-outline-variant/20">
          <div className="flex items-center gap-space-sm lg:gap-space-md w-full max-w-xl">
            {/* Hamburger on mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container"
              title="Abrir menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative w-full">
              <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-space-md py-2 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary-container transition-all"
                placeholder="Pesquisar publicações, tags e pessoas..."
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center gap-space-xs sm:gap-space-md shrink-0">
            <button
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors relative"
              type="button"
              title="Mensagens"
              onClick={() => navigate("/mensagens")}
            >
              <span className="material-symbols-outlined text-[22px]">mail</span>
            </button>
            <button
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors relative"
              type="button"
              title="Notificações"
              onClick={() => navigate("/notificacoes")}
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container ring-2 ring-surface-container-lowest" />
            </button>
            {user ? (
              <Link
                to={`/perfil/${user.username}`}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold uppercase shadow-sm"
                title={user.name}
              >
                {user.username.slice(0, 2)}
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center text-xs font-bold"
                title="Entrar"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content Body */}
        <main className="relative pt-16 bg-surface flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
