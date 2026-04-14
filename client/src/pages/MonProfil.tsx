/*
 * CLAUDINE — Mon Profil
 * Matches maquette: pink bg, form with Prénom/Enseigne/Ville/Réduction/Enseignes recherchées
 * Buttons: "Enregistrer" (bordeaux full) + "Annuler" (outline)
 * Suggestion chips: Zara, H&M, Decathlon, Fnac, Sephora
 */
import { useState } from "react";
import { Save } from "lucide-react";
import ClaudineNav from "@/components/ClaudineNav";
import { toast } from "sonner";

const SUGGESTIONS = ["Zara", "H&M", "Decathlon", "Fnac", "Sephora", "Nike", "Adidas", "Uniqlo"];

export default function MonProfil() {
  const [form, setForm] = useState({
    prenom: "",
    enseigne: "",
    ville: "",
    reduction: "",
  });
  const [enseignes, setEnseignes] = useState<string[]>([]);
  const [newEnseigne, setNewEnseigne] = useState("");

  const addEnseigne = (e: string) => {
    const val = e.trim();
    if (val && !enseignes.includes(val)) {
      setEnseignes([...enseignes, val]);
      setNewEnseigne("");
    }
  };

  const removeEnseigne = (e: string) => {
    setEnseignes(enseignes.filter((x) => x !== e));
  };

  const handleSave = () => {
    toast.success("Profil enregistré avec succès !");
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#F3E4EC", minHeight: "100vh" }}>
      <ClaudineNav />

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <h1 style={{ fontFamily: "'Abril Fatface', serif", fontSize: "2rem", color: "#5C0029", marginBottom: "0.4rem" }}>
          Mon profil
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#8B6B6B", marginBottom: "2rem" }}>
          Complète ton profil pour être visible par les autres membres.
        </p>

        <div style={{ background: "white", borderRadius: "1.25rem", padding: "2rem", border: "1px solid #EDD5E5" }}>

          {/* Prénom ou pseudo */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#2C1A1A", display: "block", marginBottom: "0.5rem" }}>
              Prénom ou pseudo
            </label>
            <input
              className="claudine-input"
              placeholder="Ex : Marie"
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            />
          </div>

          {/* Enseigne */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#2C1A1A", display: "block", marginBottom: "0.5rem" }}>
              Enseigne
            </label>
            <input
              className="claudine-input"
              placeholder="Ex : Zara, Nike, Sephora..."
              value={form.enseigne}
              onChange={(e) => setForm({ ...form, enseigne: e.target.value })}
            />
          </div>

          {/* Ville */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#2C1A1A", display: "block", marginBottom: "0.5rem" }}>
              Ville
            </label>
            <input
              className="claudine-input"
              placeholder="Ex : Paris, Lyon..."
              value={form.ville}
              onChange={(e) => setForm({ ...form, ville: e.target.value })}
            />
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
              value={form.reduction}
              onChange={(e) => setForm({ ...form, reduction: e.target.value })}
              style={{ borderColor: form.reduction ? "#5C0029" : undefined }}
            />
          </div>

          {/* Enseignes recherchées */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#2C1A1A", display: "block", marginBottom: "0.5rem" }}>
              Enseignes recherchées
            </label>

            {/* Added enseignes */}
            {enseignes.length > 0 && (
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                {enseignes.map((e) => (
                  <span
                    key={e}
                    style={{ background: "#5C0029", color: "#FAF3E0", borderRadius: "9999px", padding: "0.25rem 0.75rem", fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    {e}
                    <button onClick={() => removeEnseigne(e)} style={{ background: "none", border: "none", color: "#FAF3E0", cursor: "pointer", fontSize: "1rem", lineHeight: 1, padding: 0 }}>×</button>
                  </span>
                ))}
              </div>
            )}

            {/* Input + add button */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                className="claudine-input"
                placeholder="Ajouter une enseigne..."
                value={newEnseigne}
                onChange={(e) => setNewEnseigne(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addEnseigne(newEnseigne); }}
                style={{ flex: 1 }}
              />
              <button
                onClick={() => addEnseigne(newEnseigne)}
                style={{ width: 40, height: 40, borderRadius: "9999px", background: "white", border: "2px solid #EDD5E5", color: "#5C0029", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
              >
                +
              </button>
            </div>

            {/* Suggestions */}
            <div style={{ marginTop: "0.75rem" }}>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", color: "#8B6B6B", marginRight: "0.5rem" }}>Suggestions :</span>
              {SUGGESTIONS.filter((s) => !enseignes.includes(s)).slice(0, 5).map((s) => (
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

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              className="btn-bordeaux"
              style={{ flex: 1, justifyContent: "center", fontSize: "1rem", padding: "0.85rem" }}
              onClick={handleSave}
            >
              <Save size={16} /> Enregistrer
            </button>
            <button
              className="btn-outline-bordeaux"
              style={{ flex: "0 0 auto", fontSize: "1rem", padding: "0.85rem 1.5rem" }}
              onClick={() => setForm({ prenom: "", enseigne: "", ville: "", reduction: "" })}
            >
              Annuler
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
