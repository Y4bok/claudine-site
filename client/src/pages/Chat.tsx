/*
 * CLAUDINE — Page Chat
 * Left panel: list of conversations
 * Right panel: message thread with send input
 * Uses tRPC + polling (refetchInterval: 2s) for near-real-time feel
 */
import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { Send, MessageCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import ClaudineNav from "@/components/ClaudineNav";
import { getLoginUrl } from "@/const";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Avatar({ name, size = 40 }: { name?: string | null; size?: number }) {
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
        fontSize: size * 0.4,
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}

// ─── Conversation List ────────────────────────────────────────────────────────

function ConversationList({
  activeId,
  onSelect,
}: {
  activeId?: number;
  onSelect: (id: number) => void;
}) {
  const { data: convos, isLoading } = trpc.chat.myConversations.useQuery(undefined, {
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", color: "#8B6B6B", fontFamily: "'Nunito', sans-serif", textAlign: "center" }}>
        Chargement...
      </div>
    );
  }

  if (!convos || convos.length === 0) {
    return (
      <div style={{ padding: "2rem", color: "#8B6B6B", fontFamily: "'Nunito', sans-serif", textAlign: "center", fontSize: "0.9rem" }}>
        <MessageCircle size={32} style={{ margin: "0 auto 0.75rem", display: "block", opacity: 0.4 }} />
        Aucune conversation encore.
        <br />
        Contacte un membre depuis la page Profils.
      </div>
    );
  }

  return (
    <div>
      {convos.map((c) => {
        const name = c.otherProfile?.pseudo ?? `Membre #${c.otherUserId}`;
        const enseigne = c.otherProfile?.enseigne ?? "";
        const isActive = c.id === activeId;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "1rem 1.25rem",
              background: isActive ? "#F3E4EC" : "white",
              border: "none",
              borderBottom: "1px solid #EDD5E5",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#FAF3E0"; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "white"; }}
          >
            <Avatar name={name} />
            <div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: "#2C1A1A", fontSize: "0.95rem" }}>
                {name}
              </div>
              {enseigne && (
                <div style={{ fontFamily: "'Nunito', sans-serif", color: "#8B6B6B", fontSize: "0.8rem" }}>
                  {enseigne}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Message Thread ───────────────────────────────────────────────────────────

function MessageThread({ conversationId, currentUserId }: { conversationId: number; currentUserId: number }) {
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const { data: msgs, isLoading } = trpc.chat.messages.useQuery(
    { conversationId },
    { refetchInterval: 2000 }
  );

  const sendMutation = trpc.chat.send.useMutation({
    onSuccess: () => {
      setContent("");
      utils.chat.messages.invalidate({ conversationId });
    },
    onError: (e) => toast.error(e.message),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    sendMutation.mutate({ conversationId, content: trimmed });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {isLoading && (
          <div style={{ color: "#8B6B6B", fontFamily: "'Nunito', sans-serif", textAlign: "center" }}>
            Chargement des messages...
          </div>
        )}
        {msgs?.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  background: isMine ? "#5C0029" : "white",
                  color: isMine ? "#FAF3E0" : "#2C1A1A",
                  borderRadius: isMine ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem",
                  padding: "0.6rem 1rem",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "0.9rem",
                  border: isMine ? "none" : "1px solid #EDD5E5",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                {msg.content}
                <div style={{ fontSize: "0.7rem", opacity: 0.6, marginTop: "0.25rem", textAlign: "right" }}>
                  {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: "1px solid #EDD5E5", padding: "1rem 1.25rem", background: "white", display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <input
          className="claudine-input"
          style={{ flex: 1 }}
          placeholder="Écris un message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || sendMutation.isPending}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: content.trim() ? "#5C0029" : "#EDD5E5",
            border: "none",
            color: content.trim() ? "#FAF3E0" : "#8B6B6B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: content.trim() ? "pointer" : "default",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Chat() {
  const { user, loading, isAuthenticated } = useAuth();
  const params = useParams<{ conversationId?: string }>();
  const [, navigate] = useLocation();
  const [activeConvoId, setActiveConvoId] = useState<number | undefined>(
    params.conversationId ? parseInt(params.conversationId) : undefined
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div style={{ background: "#F3E4EC", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", color: "#5C0029" }}>Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleSelect = (id: number) => {
    setActiveConvoId(id);
    navigate(`/chat/${id}`);
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#F3E4EC", minHeight: "100vh" }}>
      <ClaudineNav />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem", height: "calc(100vh - 60px)" }}>
        <h1 style={{ fontFamily: "'Abril Fatface', serif", fontSize: "1.75rem", color: "#5C0029", marginBottom: "1rem" }}>
          Messages
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            height: "calc(100% - 60px)",
            background: "white",
            borderRadius: "1.25rem",
            border: "1px solid #EDD5E5",
            overflow: "hidden",
          }}
        >
          {/* Left: conversation list */}
          <div style={{ borderRight: "1px solid #EDD5E5", overflowY: "auto" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #EDD5E5" }}>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: "#5C0029", fontSize: "0.9rem" }}>
                Conversations
              </span>
            </div>
            <ConversationList activeId={activeConvoId} onSelect={handleSelect} />
          </div>

          {/* Right: message thread */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {activeConvoId ? (
              <MessageThread conversationId={activeConvoId} currentUserId={user!.id} />
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.75rem", color: "#8B6B6B" }}>
                <MessageCircle size={48} style={{ opacity: 0.3 }} />
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem" }}>
                  Sélectionne une conversation
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
