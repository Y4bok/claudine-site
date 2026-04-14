/*
 * CLAUDINE — Page Connexion
 * Mirror of Inscription but for login
 */
import { useState } from "react";
import { Link } from "wouter";
import { Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    toast.success("Connexion réussie ! Bienvenue.");
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#F3E4EC", minHeight: "100vh" }}>

      {/* Navbar */}
      <header style={{ background: "white", borderBottom: "1px solid #EDD5E5", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <Link href="/">
            <span style={{ fontFamily: "'Abril Fatface', serif", fontStyle: "italic", fontSize: "1.4rem", color: "#5C0029", transform: "rotate(-3deg)", display: "inline-block", cursor: "pointer" }}>
              CLAUDINE
            </span>
          </Link>
          <nav style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {["Accueil", "Recherche", "Notifications", "Chat", "Mon Profil"].map((item) => (
              <span key={item} style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: "0.875rem", color: "#5C0029", padding: "0.4rem 0.7rem", borderRadius: "9999px", cursor: "pointer" }}>
                {item}
              </span>
            ))}
          </nav>
        </div>
      </header>

      {/* Anonyme badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "1.25rem", color: "#5C0029" }}>
        <Shield size={16} />
        <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: "0.9rem" }}>
          Connexion sécurisée
        </span>
      </div>

      {/* Card */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 1.5rem 3rem" }}>
        <div style={{ background: "white", borderRadius: "1.25rem", padding: "2.5rem 2rem", border: "1px solid #EDD5E5" }}>
          <h1 style={{ fontFamily: "'Abril Fatface', serif", fontSize: "2rem", color: "#2C1A1A", textAlign: "center", marginBottom: "0.5rem" }}>
            Connexion
          </h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: "#8B6B6B", textAlign: "center", marginBottom: "2rem", fontSize: "0.95rem" }}>
            Accédez à votre espace CLAUDINE
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#2C1A1A", display: "block", marginBottom: "0.4rem" }}>
                Email
              </label>
              <input
                className="claudine-input"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#2C1A1A", display: "block", marginBottom: "0.4rem" }}>
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className="claudine-input"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8B6B6B", cursor: "pointer" }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{ width: "100%", background: "#2C1A1A", color: "white", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "1rem", padding: "0.9rem", borderRadius: "9999px", border: "none", cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#5C0029")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2C1A1A")}
            >
              Se connecter
            </button>
          </form>

          <p style={{ fontFamily: "'Nunito', sans-serif", color: "#8B6B6B", textAlign: "center", marginTop: "1.25rem", fontSize: "0.875rem" }}>
            Pas encore de compte ?{" "}
            <Link href="/inscription">
              <span style={{ color: "#5C0029", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                S'inscrire
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
