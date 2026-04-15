/*
 * CLAUDINE — Navbar (auth-aware)
 * - Logo: Abril Fatface italic bordeaux
 * - Profils always visible
 * - Messages + Mon profil only when authenticated (with unread badge)
 * - Se connecter / S'inscrire when not authenticated → Manus OAuth
 *   (supports Google, Microsoft, Apple, email)
 */
import { Link, useLocation } from "wouter";
import { Users, MessageCircle, User, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function ClaudineNav() {
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const { data: unread } = trpc.chat.unreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  const isActive = (path: string) => location === path;

  const navBtn = (
    path: string,
    label: string,
    icon: React.ReactNode,
    badge?: number
  ) => (
    <Link href={path} key={path}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.4rem 0.9rem",
          borderRadius: "9999px",
          fontFamily: "'Nunito', sans-serif",
          fontWeight: isActive(path) ? 700 : 500,
          fontSize: "0.875rem",
          color: isActive(path) ? "#FAF3E0" : "#5C0029",
          background: isActive(path) ? "#5C0029" : "transparent",
          transition: "all 0.15s",
          cursor: "pointer",
          textDecoration: "none",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          if (!isActive(path)) {
            (e.currentTarget as HTMLElement).style.background = "#F3E4EC";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive(path)) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }
        }}
      >
        {icon}
        <span>{label}</span>
        {badge != null && badge > 0 && (
          <span
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              background: "#E53E3E",
              color: "white",
              borderRadius: "50%",
              width: 16,
              height: 16,
              fontSize: "0.6rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
            }}
          >
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </span>
    </Link>
  );

  return (
    <header
      style={{
        background: "white",
        borderBottom: "1px solid #EDD5E5",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}
      >
        {/* Logo */}
        <Link href="/">
          <span
            style={{
              fontFamily: "'Abril Fatface', serif",
              fontStyle: "italic",
              fontSize: "1.4rem",
              color: "#5C0029",
              transform: "rotate(-3deg)",
              display: "inline-block",
              letterSpacing: "0.03em",
              cursor: "pointer",
            }}
          >
            CLAUDINE
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {navBtn("/profils", "Profils", <Users size={15} />)}
          {isAuthenticated && navBtn("/chat", "Messages", <MessageCircle size={15} />, unread ?? 0)}
          {isAuthenticated && navBtn("/mon-profil", "Mon profil", <User size={15} />)}

          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              title="Se déconnecter"
              style={{
                marginLeft: "0.25rem",
                color: "#8B6B6B",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.4rem",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <LogOut size={16} />
            </button>
          ) : (
            <>
              <a href={getLoginUrl()} style={{ textDecoration: "none" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.4rem 0.9rem",
                    borderRadius: "9999px",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    color: "#5C0029",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  <LogIn size={15} />
                  Se connecter
                </span>
              </a>
              <a href={getLoginUrl()} style={{ textDecoration: "none" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.5rem 1.1rem",
                    borderRadius: "9999px",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 800,
                    fontSize: "0.875rem",
                    color: "#FAF3E0",
                    background: "#5C0029",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  S'inscrire
                </span>
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
