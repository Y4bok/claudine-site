/*
 * CLAUDINE — Landing Page
 * Design: Bordeaux #5C0029, rose poudré #F3E4EC, cream #FAF3E0
 * Fonts: Abril Fatface (display) + Nunito (body)
 * Sections: Hero, Comment ça marche, Avantages, CTA
 */
import { Link } from "wouter";
import { ArrowRight, Shield, Users, Tag, Star, ChevronRight, User } from "lucide-react";

const brands = ["Zara", "H&M", "Nike", "Sephora", "Decathlon", "Fnac", "Uniqlo", "Adidas"];

export default function Landing() {
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#F3E4EC", minHeight: "100vh" }}>

      {/* ── NAVBAR ── */}
      <header style={{ background: "white", borderBottom: "1px solid #EDD5E5", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <span style={{ fontFamily: "'Abril Fatface', serif", fontStyle: "italic", fontSize: "1.4rem", color: "#5C0029", transform: "rotate(-3deg)", display: "inline-block" }}>
            CLAUDINE
          </span>
          <nav style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Link href="/profils">
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#5C0029", padding: "0.4rem 0.9rem", borderRadius: "9999px", cursor: "pointer" }}>
                Profils
              </span>
            </Link>
            <Link href="/connexion">
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#5C0029", padding: "0.4rem 0.9rem", borderRadius: "9999px", cursor: "pointer" }}>
                Se connecter
              </span>
            </Link>
            <Link href="/inscription">
              <span className="btn-bordeaux" style={{ fontSize: "0.9rem" }}>
                S'inscrire
              </span>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: "#5C0029", padding: "5rem 1.5rem 4rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Decorative rotated logo watermark */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-8deg)", fontFamily: "'Abril Fatface', serif", fontSize: "clamp(6rem, 20vw, 14rem)", color: "rgba(255,255,255,0.04)", pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>
          CLAUDINE
        </div>

        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "'Abril Fatface', serif", fontStyle: "italic", fontSize: "clamp(3.5rem, 10vw, 6rem)", color: "#FAF3E0", display: "inline-block", transform: "rotate(-4deg)", lineHeight: 1.1 }}>
              CLAUDINE
            </span>
          </div>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1.25rem", color: "#EDD5E5", marginBottom: "0.75rem", fontWeight: 600 }}>
            La plateforme d'échange d'avantages employés
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1rem", color: "#C8A0B8", marginBottom: "2.5rem", maxWidth: 480, margin: "0 auto 2.5rem" }}>
            Tu travailles dans le retail ? Échange tes réductions avec d'autres employés de marques que tu aimes.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/inscription">
              <span style={{ background: "#FAF3E0", color: "#5C0029", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "1rem", padding: "0.8rem 2rem", borderRadius: "9999px", display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                Rejoindre gratuitement <ArrowRight size={18} />
              </span>
            </Link>
            <Link href="/profils">
              <span style={{ border: "2px solid #FAF3E0", color: "#FAF3E0", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "1rem", padding: "0.8rem 2rem", borderRadius: "9999px", display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                Voir les profils
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BRANDS TICKER ── */}
      <section style={{ background: "#FAF3E0", padding: "1.25rem 0", borderTop: "2px solid #EDD5E5", borderBottom: "2px solid #EDD5E5", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "3rem", animation: "ticker 20s linear infinite", whiteSpace: "nowrap" }}>
          {[...brands, ...brands].map((b, i) => (
            <span key={i} style={{ fontFamily: "'Abril Fatface', serif", fontSize: "1.1rem", color: "#5C0029", opacity: 0.7 }}>{b}</span>
          ))}
        </div>
        <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section style={{ background: "#F3E4EC", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Abril Fatface', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", color: "#5C0029", textAlign: "center", marginBottom: "0.5rem" }}>
            Comment ça marche ?
          </h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: "#8B6B6B", textAlign: "center", marginBottom: "3rem", fontSize: "1.05rem" }}>
            Simple, rapide, et 100% anonyme
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {[
              { num: "01", title: "Crée ton profil", desc: "Indique ton enseigne, ta réduction employé, et les marques que tu recherches.", icon: <User size={28} /> },
              { num: "02", title: "Découvre les membres", desc: "Trouve des collègues du retail qui ont les avantages que tu veux.", icon: <Users size={28} /> },
              { num: "03", title: "Échange vos avantages", desc: "Contactez-vous et organisez vos échanges en toute confiance.", icon: <Tag size={28} /> },
            ].map((step) => (
              <div key={step.num} className="claudine-card" style={{ background: "white", textAlign: "center", padding: "2rem 1.5rem" }}>
                <div style={{ width: 56, height: 56, borderRadius: "9999px", background: "#F3E4EC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "#5C0029" }}>
                  {step.icon}
                </div>
                <div style={{ fontFamily: "'Abril Fatface', serif", fontSize: "0.8rem", color: "#C8A84B", marginBottom: "0.4rem", letterSpacing: "0.1em" }}>
                  ÉTAPE {step.num}
                </div>
                <h3 style={{ fontFamily: "'Abril Fatface', serif", fontSize: "1.2rem", color: "#5C0029", marginBottom: "0.5rem" }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: "'Nunito', sans-serif", color: "#8B6B6B", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POURQUOI CLAUDINE ── */}
      <section style={{ background: "#FAF3E0", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Abril Fatface', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", color: "#5C0029", textAlign: "center", marginBottom: "3rem" }}>
            Pourquoi Claudine ?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: <Shield size={24} />, title: "Anonymat total", desc: "Ton identité reste protégée jusqu'à ce que tu choisisses de te révéler." },
              { icon: <Star size={24} />, title: "Gratuit", desc: "Aucun frais caché. L'échange entre collègues reste libre et accessible." },
              { icon: <Users size={24} />, title: "Communauté retail", desc: "Uniquement des employés du secteur retail — des échanges pertinents." },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: "0.75rem", background: "#F3E4EC", display: "flex", alignItems: "center", justifyContent: "center", color: "#5C0029", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#2C1A1A", marginBottom: "0.25rem" }}>{item.title}</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", color: "#8B6B6B", fontSize: "0.9rem", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ background: "#5C0029", padding: "4rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Abril Fatface', serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", color: "#FAF3E0", marginBottom: "1rem" }}>
          Prêt·e à échanger ?
        </h2>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#C8A0B8", fontSize: "1.05rem", marginBottom: "2rem" }}>
          Rejoins des centaines d'employés du retail qui échangent déjà leurs avantages.
        </p>
        <Link href="/inscription">
          <span style={{ background: "#FAF3E0", color: "#5C0029", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "1rem", padding: "0.9rem 2.5rem", borderRadius: "9999px", display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            Créer mon profil gratuitement <ChevronRight size={18} />
          </span>
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#3D0019", padding: "1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#C8A0B8", fontSize: "0.85rem" }}>
          © 2026 CLAUDINE — Plateforme d'échange d'avantages employés · <a href="mailto:contact@claudine.fr" style={{ color: "#EDD5E5" }}>contact@claudine.fr</a>
        </p>
      </footer>
    </div>
  );
}
