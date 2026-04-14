/*
 * CLAUDINE Navbar
 * - Logo: "CLAUDINE" Abril Fatface italic, slightly rotated, bordeaux color
 * - Nav items: Accueil, Recherche, Notifications, Chat, Mon Profil
 * - Active item highlighted with bordeaux pill
 * - Sticky top, white background, thin bottom border
 */
import { Link, useLocation } from "wouter";
import { Home, Search, Bell, MessageCircle, User, LogOut } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/", label: "Accueil", icon: <Home size={16} /> },
  { href: "/profils", label: "Profils", icon: <Search size={16} /> },
  { href: "/notifications", label: "Notifications", icon: <Bell size={16} /> },
  { href: "/chat", label: "Chat", icon: <MessageCircle size={16} /> },
  { href: "/mon-profil", label: "Mon Profil", icon: <User size={16} /> },
];

export default function ClaudineNav() {
  const [location] = useLocation();

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
            className="claudine-logo"
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

        {/* Nav items */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.4rem 0.9rem",
                    borderRadius: "9999px",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.875rem",
                    color: isActive ? "#FAF3E0" : "#5C0029",
                    background: isActive ? "#5C0029" : "transparent",
                    transition: "all 0.15s",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "#F3E4EC";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </Link>
            );
          })}

          {/* Logout icon */}
          <button
            style={{
              marginLeft: "0.5rem",
              color: "#8B6B6B",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.4rem",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
            }}
            title="Se déconnecter"
            onClick={() => {}}
          >
            <LogOut size={18} />
          </button>
        </nav>
      </div>
    </header>
  );
}
