/*
 * CLAUDINE — Page Profils (Découvrir les profils)
 * Uses real tRPC data. "Contacter" creates a conversation and redirects to /chat/:id
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, Store, Sparkles, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import ClaudineNav from "@/components/ClaudineNav";
import { getLoginUrl } from "@/const";

function Avatar({ name, size = 44 }: { name?: string | null; size?: number }) {
  const letter = (name ?? "?")[0]?.toUpperCase() ?? "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#EDD5E5",
        color: "#5C0029",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 800,
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}

export default function Profils() {
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const { data: profiles, isLoading } = trpc.profile.list.useQuery();
  const startConvo = trpc.chat.getOrCreateConversation.useMutation({
    onSuccess: (convo) => navigate(`/chat/${convo.id}`),
    onError: (e) => toast.error(e.message),
  });

  const filtered = (profiles ?? []).filter((row) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      row.profile.pseudo?.toLowerCase().includes(q) ||
      row.profile.enseigne?.toLowerCase().includes(q) ||
      row.profile.ville?.toLowerCase().includes(q)
    );
  });

  const handleContact = (userId: number) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    startConvo.mutate({ otherUserId: userId });
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#F3E4EC", minHeight: "100vh" }}>
      <ClaudineNav />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <h1 style={{ fontFamily: "'Abril Fatface', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", color: "#5C0029", marginBottom: "0.4rem" }}>
          Découvrir les profils
        </h1>
        <p style={{ color: "#8B6B6B", fontSize: "1rem", marginBottom: "1.5rem" }}>
          Trouvez des collègues du retail avec qui partager vos avantages.
        </p>

        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: "2rem", maxWidth: 600 }}>
          <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#8B6B6B" }} />
          <input
            className="claudine-input"
            style={{ paddingLeft: "2.5rem", borderRadius: "9999px", width: "100%", boxSizing: "border-box" }}
            placeholder="Rechercher par nom, enseigne ou ville..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ color: "#8B6B6B", textAlign: "center", padding: "3rem" }}>Chargement des profils...</div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#8B6B6B" }}>
            <Sparkles size={40} style={{ margin: "0 auto 1rem", color: "#EDD5E5" }} />
            <p>{query ? "Aucun profil ne correspond à ta recherche." : "Aucun profil public pour l'instant. Sois le premier !"}</p>
          </div>
        )}

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {filtered.map((row) => {
            const { profile, user } = row;
            const name = profile.pseudo ?? user.name ?? `Membre #${user.id}`;
            const enseignes: string[] = Array.isArray(profile.enseignesRecherchees)
              ? (profile.enseignesRecherchees as string[])
              : [];

            return (
              <div
                key={profile.id}
                className="claudine-card"
                style={{ background: "white", display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Avatar name={name} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1rem", color: "#2C1A1A" }}>{name}</div>
                      {profile.enseigne && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#8B6B6B", fontSize: "0.8rem" }}>
                          <Store size={12} />
                          {profile.enseigne}
                        </div>
                      )}
                    </div>
                  </div>
                  {profile.reductionPct != null && profile.reductionPct > 0 && (
                    <span className="badge-discount">% -{profile.reductionPct}%</span>
                  )}
                </div>

                {/* Ville */}
                {profile.ville && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#8B6B6B", fontSize: "0.82rem" }}>
                    <MapPin size={12} />
                    {profile.ville.toUpperCase()}
                  </div>
                )}

                {/* Enseignes recherchées */}
                {enseignes.length > 0 && (
                  <div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#8B6B6B", letterSpacing: "0.08em", marginBottom: "0.35rem", textTransform: "uppercase" }}>
                      Recherche
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {enseignes.slice(0, 3).map((e) => (
                        <span key={e} style={{ border: "1.5px solid #EDD5E5", borderRadius: "9999px", padding: "0.2rem 0.65rem", fontSize: "0.78rem", color: "#5C0029", fontWeight: 600 }}>
                          {e}
                        </span>
                      ))}
                      {enseignes.length > 3 && (
                        <span style={{ border: "1.5px solid #EDD5E5", borderRadius: "9999px", padding: "0.2rem 0.65rem", fontSize: "0.78rem", color: "#8B6B6B" }}>
                          +{enseignes.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact button */}
                <button
                  onClick={() => handleContact(user.id)}
                  disabled={startConvo.isPending}
                  className="btn-bordeaux"
                  style={{ width: "100%", justifyContent: "center", marginTop: "auto", fontSize: "0.875rem" }}
                >
                  <MessageCircle size={14} />
                  Contacter
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
