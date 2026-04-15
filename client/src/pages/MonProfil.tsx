/*
 * CLAUDINE — Mon Profil (connected to real DB via tRPC)
 * - Loads profile from DB on mount
 * - Saves changes via trpc.profile.save
 * - Redirects to login if not authenticated
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Save, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import ClaudineNav from "@/components/ClaudineNav";
import { getLoginUrl } from "@/const";

const SUGGESTIONS = ["Zara", "H&M", "Decathlon", "Fnac", "Sephora", "Nike", "Adidas", "Uniqlo", "Mango", "Bershka"];

export default function MonProfil() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const { data: profile, isLoading: profileLoading } = trpc.profile.me.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const saveMutation = trpc.profile.save.useMutation({
    onSuccess: () => {
      toast.success("Profil enregistré !");
      utils.profile.me.invalidate();
      utils.profile.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const [pseudo, setPseudo] = useState("");
  const [enseigne, setEnseigne] = useState("");
  const [ville, setVille] = useState("");
  const [reductionPct, setReductionPct] = useState(0);
  const [enseignesRecherchees, setEnseignesRecherchees] = useState<string[]>([]);
  const [newEnseigne, setNewEnseigne] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (profile) {
      setPseudo(profile.pseudo ?? "");
      setEnseigne(profile.enseigne ?? "");
      setVille(profile.ville ?? "");
      setReductionPct(profile.reductionPct ?? 0);
      setEnseignesRecherchees(
        Array.isArray(profile.enseignesRecherchees) ? (profile.enseignesRecherchees as string[]) : []
      );
      setIsPublic(profile.isPublic ?? true);
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  if (loading || profileLoading) {
    return (
      <div style={{ background: "#F3E4EC", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", color: "#5C0029" }}>Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const addEnseigne = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !enseignesRecherchees.includes(trimmed)) {
      setEnseignesRecherchees([...enseignesRecherchees, trimmed]);
    }
    setNewEnseigne("");
  };

  const removeEnseigne = (e: string) => {
    setEnseignesRecherchees(enseignesRecherchees.filter((x) => x !== e));
  };

  const handleSave = () => {
    saveMutation.mutate({
      pseudo: pseudo || undefined,
      enseigne: enseigne || undefined,
      ville: ville || undefined,
      reductionPct,
      enseignesRecherchees,
      isPublic,
    });
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#F3E4EC", minHeight: "100vh" }}>
      <ClaudineNav />

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <h1 style={{ fontFamily: "'Abril Fatface', serif", fontSize: "2rem", color: "#5C0029", marginBottom: "0.4rem" }}>
          Mon profil
        </h1>
        <p style={{ color: "#8B6B6B", marginBottom: "2rem" }}>
          Complète ton profil pour être visible par les autres membres.
        </p>

        <div style={{ background: "white", borderRadius: "1.25rem", padding: "2rem", border: "1px solid #EDD5E5" }}>

          {/* Prénom ou pseudo */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#2C1A1A", display: "block", marginBottom: "0.5rem" }}>
              Prénom ou pseudo
            </label>
            <input className="claudine-input" placeholder="Ex : Marie" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
          </div>

          {/* Enseigne */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#2C1A1A", display: "block", marginBottom: "0.5rem" }}>
              Enseigne
            </label>
            <input className="claudine-input" placeholder="Ex : Zara, Nike, Sephora..." value={enseigne} onChange={(e) => setEnseigne(e.target.value)} />
          </div>

          {/* Ville */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#2C1A1A", display: "block", marginBottom: "0.5rem" }}>
              Ville
            </label>
            <input className="claudine-input" placeholder="Ex : Paris, Lyon..." value={ville} onChange={(e) => setVille(e.target.value)} />
          </div>

          {/* Réduction employé */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#2C1A1A", display: "block", marginBottom: "0.5rem" }}>
              Réduction employé (%)
            </label>
            <input
              className="claudine-input"
              type="number"
              min={0}
              max={100}
              placeholder="Ex : 30"
              value={reductionPct}
              onChange={(e) => setReductionPct(parseInt(e.target.value) || 0)}
              style={{ borderColor: reductionPct > 0 ? "#5C0029" : undefined }}
            />
          </div>

          {/* Enseignes recherchées */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#2C1A1A", display: "block", marginBottom: "0.5rem" }}>
              Enseignes recherchées
            </label>

            {enseignesRecherchees.length > 0 && (
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                {enseignesRecherchees.map((e) => (
                  <span
                    key={e}
                    style={{ background: "#5C0029", color: "#FAF3E0", borderRadius: "9999px", padding: "0.25rem 0.75rem", fontSize: "0.85rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    {e}
                    <button onClick={() => removeEnseigne(e)} style={{ background: "none", border: "none", color: "#FAF3E0", cursor: "pointer", display: "flex", padding: 0 }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                className="claudine-input"
                placeholder="Ajouter une enseigne..."
                value={newEnseigne}
                onChange={(e) => setNewEnseigne(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEnseigne(newEnseigne); } }}
                style={{ flex: 1 }}
              />
              <button
                onClick={() => addEnseigne(newEnseigne)}
                style={{ width: 40, height: 40, borderRadius: "9999px", background: "#5C0029", border: "none", color: "#FAF3E0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
              >
                <Plus size={16} />
              </button>
            </div>

            <div style={{ marginTop: "0.75rem" }}>
              <span style={{ fontSize: "0.8rem", color: "#8B6B6B", marginRight: "0.5rem" }}>Suggestions :</span>
              {SUGGESTIONS.filter((s) => !enseignesRecherchees.includes(s)).slice(0, 5).map((s) => (
                <button
                  key={s}
                  onClick={() => addEnseigne(s)}
                  style={{ border: "1.5px solid #EDD5E5", borderRadius: "9999px", padding: "0.2rem 0.7rem", fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", color: "#5C0029", fontWeight: 600, background: "white", cursor: "pointer", marginRight: "0.4rem", marginTop: "0.3rem" }}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Visibilité */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              style={{ accentColor: "#5C0029", width: 16, height: 16, cursor: "pointer" }}
            />
            <label htmlFor="isPublic" style={{ fontSize: "0.9rem", color: "#2C1A1A", cursor: "pointer" }}>
              Profil visible par les autres membres
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              className="btn-bordeaux"
              style={{ flex: 1, justifyContent: "center", fontSize: "1rem", padding: "0.85rem" }}
              onClick={handleSave}
              disabled={saveMutation.isPending}
            >
              <Save size={16} />
              {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              className="btn-outline-bordeaux"
              style={{ flex: "0 0 auto", fontSize: "1rem", padding: "0.85rem 1.5rem" }}
              onClick={() => navigate("/profils")}
            >
              Annuler
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
