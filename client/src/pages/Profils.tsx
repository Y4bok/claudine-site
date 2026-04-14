/*
 * CLAUDINE — Page Profils (Découvrir les profils)
 * Matches maquette: pink bg, search bar, filter pills, member cards with discount badge
 * Nav: "Profils" active (bordeaux pill), "Mon profil" inactive
 */
import { useState } from "react";
import { Link } from "wouter";
import { Search, MapPin, Store, Sparkles } from "lucide-react";
import ClaudineNav from "@/components/ClaudineNav";

const MEMBERS = [
  { id: 1, name: "Nicolas", initial: "N", store: "NIKE", city: "PARIS", discount: 30, wants: ["Sephora", "Decathlon", "H&M", "+1"] },
  { id: 2, name: "QuentinURL", initial: "Q", store: "ZARA", city: "PARIS", discount: 30, wants: ["Zara", "Fnac", "Nike", "+3"] },
  { id: 3, name: "Marie", initial: "M", store: "SEPHORA", city: "LYON", discount: 25, wants: ["Nike", "Adidas", "+2"] },
  { id: 4, name: "Thomas", initial: "T", store: "DECATHLON", city: "BORDEAUX", discount: 20, wants: ["H&M", "Zara", "Uniqlo"] },
  { id: 5, name: "Sophie", initial: "S", store: "H&M", city: "PARIS", discount: 25, wants: ["Sephora", "Nike", "+1"] },
  { id: 6, name: "Lucas", initial: "L", store: "FNAC", city: "MARSEILLE", discount: 15, wants: ["Decathlon", "Adidas"] },
];

type FilterType = "autour" | "tous" | "recherche" | "interesses" | "mutuel";

export default function Profils() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("autour");

  const filtered = MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.store.toLowerCase().includes(query.toLowerCase()) ||
      m.city.toLowerCase().includes(query.toLowerCase())
  );

  const filters: { key: FilterType; label: string }[] = [
    { key: "autour", label: `Autour de moi (${filtered.length})` },
    { key: "tous", label: `Tous (${MEMBERS.length})` },
    { key: "recherche", label: "Ce que je recherche (1)" },
    { key: "interesses", label: "Ils sont intéressés par moi (0)" },
    { key: "mutuel", label: "✦ Whaou ! vous êtes mutuellement intéressé (0)" },
  ];

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#F3E4EC", minHeight: "100vh" }}>
      <ClaudineNav />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {/* Header */}
        <h1 style={{ fontFamily: "'Abril Fatface', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", color: "#5C0029", marginBottom: "0.4rem" }}>
          Découvrir les profils
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#8B6B6B", fontSize: "1rem", marginBottom: "1rem" }}>
          Trouvez des collègues du retail avec qui partager vos avantages.
        </p>

        {/* Connection counter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <div style={{ width: 10, height: 10, borderRadius: "9999px", background: "#5C0029" }} />
            <div style={{ width: 10, height: 10, borderRadius: "9999px", background: "#EDD5E5" }} />
            <div style={{ width: 10, height: 10, borderRadius: "9999px", background: "#EDD5E5" }} />
          </div>
          <span style={{ fontFamily: "'Nunito', sans-serif", color: "#8B6B6B", fontSize: "0.875rem" }}>
            2 mises en relation gratuites restantes
          </span>
        </div>

        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: "1.5rem" }}>
          <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#8B6B6B" }} />
          <input
            className="claudine-input"
            style={{ paddingLeft: "2.5rem", borderRadius: "9999px" }}
            placeholder="Rechercher par nom, enseigne ou ville..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {filters.map((f) => (
            <button
              key={f.key}
              className={`filter-pill ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Member cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {filtered.map((member) => (
            <div key={member.id} className="claudine-card" style={{ background: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div className="avatar-circle">
                    {member.initial}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2C1A1A" }}>
                      {member.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#8B6B6B", fontSize: "0.8rem" }}>
                      <Store size={12} />
                      <span>{member.store}</span>
                    </div>
                  </div>
                </div>
                <span className="badge-discount">% -{member.discount}%</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#8B6B6B", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
                <MapPin size={12} />
                <span>{member.city}</span>
              </div>

              <div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#8B6B6B", letterSpacing: "0.08em", marginBottom: "0.4rem", textTransform: "uppercase" }}>
                  Recherche
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {member.wants.map((w) => (
                    <span key={w} style={{ border: "1.5px solid #EDD5E5", borderRadius: "9999px", padding: "0.2rem 0.6rem", fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", color: "#5C0029", fontWeight: 600 }}>
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              <button
                className="btn-bordeaux"
                style={{ width: "100%", justifyContent: "center", marginTop: "1rem", fontSize: "0.875rem" }}
              >
                Contacter
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#8B6B6B" }}>
            <Sparkles size={40} style={{ margin: "0 auto 1rem", color: "#EDD5E5" }} />
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1rem" }}>Aucun profil trouvé pour cette recherche.</p>
          </div>
        )}
      </main>
    </div>
  );
}
