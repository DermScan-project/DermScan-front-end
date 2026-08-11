"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import PortalHeader from "@/components/ui/PortalHeader";
import HeaderActions from "@/components/ui/HeaderActions";
import MedecinNav from "@/components/medecin/MedecinNav";
import { useAuth } from "@/context/AuthContext";
import DossierCard from "@/components/medecin/DossierCard";
import {
  listConversations,
  getConversation,
  sendMessage,
  listActiveMedecins,
  getSocket,
  disconnectSocket,
  getDownloadUrl,
  Conversation,
  Message,
  MedecinContact,
} from "@/lib/api/messages";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return "À l'instant";
  if (mins < 60) return `${mins}min`;
  if (hours < 24) return `${hours}h`;
  return `${days}j`;
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className={`rounded-full bg-sauge-clair flex items-center justify-center shrink-0 font-medium text-sauge ${
        size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"
      }`}
    >
      {initials}
    </div>
  );
}

async function downloadFile(messageId: string, filename: string) {
  try {
    const { url } = await getDownloadUrl(messageId);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename || "fichier";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download error:", err);
  }
}

async function openInNewTab(messageId: string) {
  try {
    const { url } = await getDownloadUrl(messageId);
    window.open(url, "_blank");
  } catch (err) {
    console.error("Open error:", err);
  }
}

interface ContextMenuState {
  x: number;
  y: number;
  messageId: string;
  filename: string;
}

interface LightboxState {
  messageId: string;
  url: string;
  name: string;
}



export default function MessagesPage() {
  const { user } = useAuth();
  const medecin = user as any;
  const currentMedecinId = medecin?.id || medecin?.sub;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMedecins, setActiveMedecins] = useState<MedecinContact[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMedecin, setSelectedMedecin] = useState<MedecinContact | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [searchMedecin, setSearchMedecin] = useState("");
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [lightboxImage, setLightboxImage] = useState<LightboxState | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const loadConversations = useCallback(async () => {
    try {
      const res = await listConversations();
      setConversations(res.conversations);
      setTotalUnread(res.conversations.reduce((acc, c) => acc + c.nonLus, 0));
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  const loadActiveMedecins = useCallback(async () => {
    try {
      const res = await listActiveMedecins();
      setActiveMedecins(res.medecins);
    } catch {}
  }, []);

  useEffect(() => {
    loadConversations();
    loadActiveMedecins();
    const interval = setInterval(loadConversations, 15000);
    return () => clearInterval(interval);
  }, [loadConversations, loadActiveMedecins]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
    socket.on("connect_error", (err: Error) => console.error("❌ Socket error:", err.message));

    socket.on("new_message", (msg: Message) => {
      const currentSelectedId = selectedIdRef.current;
      loadConversations();
      if (
        currentSelectedId &&
        (msg.senderId === currentSelectedId || msg.receiverId === currentSelectedId)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("new_message");
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setContextMenu(null);
        setLightboxImage(null);
      }
    };
    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleFileContextMenu = (
    e: React.MouseEvent,
    messageId: string,
    filename: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, messageId, filename });
  };

  const openConversation = useCallback(
    async (medecinId: string, medecinInfo?: MedecinContact) => {
      setSelectedId(medecinId);
      setLoadingMsgs(true);
      setMessages([]);
      try {
        const res = await getConversation(medecinId);
        setMessages(res.messages);
        setSelectedMedecin(res.medecin || medecinInfo || null);
        setConversations((prev) =>
          prev.map((c) => (c.medecin.id === medecinId ? { ...c, nonLus: 0 } : c))
        );
        setTotalUnread((prev) =>
          Math.max(
            0,
            prev - (conversations.find((c) => c.medecin.id === medecinId)?.nonLus || 0)
          )
        );
      } finally {
        setLoadingMsgs(false);
      }
    },
    [conversations]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;
    if (!selectedId || sending) return;

    const text = input.trim();
    const file = selectedFile;
    setInput("");
    setSelectedFile(null);
    setFilePreview(null);
    setSending(true);

    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      senderId: currentMedecinId,
      receiverId: selectedId,
      contenu: text || null,
      fichierUrl: filePreview,
      fichierNom: file?.name || null,
      fichierType: file?.type || null,
      lu: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await sendMessage(selectedId, text, file ?? undefined);
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? res.message : m)));
      loadConversations();
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(text);
      setSelectedFile(file);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen bg-papier flex flex-col overflow-hidden">
      <PortalHeader
        title="DermaLink Pro"
        subtitle={medecin?.nomComplet || ""}
        onBack={() => (window.location.href = "/medecin/dashboard")}
        right={<HeaderActions hasUnread={totalUnread > 0} />}
      />
      <MedecinNav messagesBadge={totalUnread} />

      <div className="flex flex-1 overflow-hidden min-h-0">
  {/* LEFT — Praticiens actifs */}
  <div className={`${selectedId ? "hidden sm:flex" : "flex"} w-full sm:w-60 shrink-0 border-r border-ardoise/10 bg-white flex-col`}>
          <div className="px-4 py-3 border-b border-ardoise/8">
            <p className="text-xs font-semibold text-encre uppercase tracking-wide">
              Praticiens actifs
            </p>
            <p className="text-[11px] text-ardoise/50 mt-0.5">
              {activeMedecins.length} disponible{activeMedecins.length !== 1 ? "s" : ""}
            </p>
            <div className="relative mt-2">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ardoise/40"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchMedecin}
                onChange={(e) => setSearchMedecin(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-ardoise/15 bg-papier text-xs text-encre placeholder:text-ardoise/40 outline-none focus:border-sauge/40 transition-colors"
              />
              {searchMedecin && (
                <button
                  onClick={() => setSearchMedecin("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-ardoise/40 hover:text-ardoise"
                >
                  &#x2715;
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 p-3 flex flex-col gap-1.5">
            {activeMedecins.length === 0 && (
              <p className="text-xs text-ardoise/40 text-center pt-8">Aucun praticien actif</p>
            )}
           {activeMedecins
  .filter((m) =>
    m.nomComplet.toLowerCase().includes(searchMedecin.toLowerCase())
  )
  .sort((a, b) => {
    const convA = conversations.find((c) => c.medecin.id === a.id);
    const convB = conversations.find((c) => c.medecin.id === b.id);

    const timeA = convA?.dernierMessageDate ? new Date(convA.dernierMessageDate).getTime() : 0;
    const timeB = convB?.dernierMessageDate ? new Date(convB.dernierMessageDate).getTime() : 0;

    return timeB - timeA;
  })
  .map((m) => {
                const isSelected = selectedId === m.id;
                const conv = conversations.find((c) => c.medecin.id === m.id);
                const unread = conv?.nonLus ?? 0;
                return (
                  <button
                    key={m.id}
                    onClick={() => openConversation(m.id, m)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      isSelected
                        ? "bg-sauge-clair border border-sauge/20"
                        : "hover:bg-sauge-clair/30 border border-transparent"
                    }`}
                  >
                    <div className="relative">
                      <Avatar name={m.nomComplet} size="sm" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-encre truncate">Dr. {m.nomComplet}</p>
                      <p className="text-[10px] text-ardoise/50 truncate">{m.specialite}</p>
                    </div>
                    {/* Badge non-lu */}
                    {unread > 0 && !isSelected ? (
                      <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-sauge text-white text-[10px] font-semibold flex items-center justify-center px-1">
                        {unread}
                      </span>
                    ) : conv ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1B3A2D"
                        strokeWidth="2"
                        className="shrink-0 opacity-40"
                      >
                        <path
                          d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </button>
                );
              })}
          </div>
        </div>

        {/* CENTER — Chat */}
       <div className={`${selectedId ? "flex" : "hidden sm:flex"} flex-1 flex-col min-w-0 bg-papier`}>
          {!selectedId ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
              <div className="w-14 h-14 rounded-2xl bg-sauge-clair flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1B3A2D"
                  strokeWidth="1.5"
                >
                  <path
                    d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-encre">
                S&#233;lectionnez une conversation
              </p>
              <p className="text-xs text-ardoise/50">
                Choisissez un praticien actif &#224; gauche pour d&#233;marrer
              </p>
            </div>
          ) : (
            <>
              <div className="px-5 py-3 border-b border-ardoise/10 bg-white flex items-center gap-3 shrink-0">
  {/* Bouton retour mobile */}
  <button
    onClick={() => setSelectedId(null)}
    className="sm:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-ardoise/5"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
  {selectedMedecin && <Avatar name={selectedMedecin.nomComplet} size="sm" />}
  <div>
    <p className="text-sm font-semibold text-encre">
      Dr. {selectedMedecin?.nomComplet}
    </p>
    <p className="text-[11px] text-ardoise/50">{selectedMedecin?.specialite}</p>
  </div>
</div>

              <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 flex flex-col gap-3">
                {loadingMsgs && (
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-10 w-48 rounded-2xl bg-ardoise/8 animate-pulse ${
                          i % 2 === 0 ? "self-end" : "self-start"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {!loadingMsgs && messages.length === 0 && (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs text-ardoise/40">D&#233;marrez la conversation</p>
                  </div>
                )}

                {!loadingMsgs &&
                  messages.map((msg) => {
                    const isMine = msg.senderId === currentMedecinId;
                    const isImage = msg.fichierType?.startsWith("image/");
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMine
                              ? "bg-encre text-white rounded-br-md"
                              : "bg-white border border-ardoise/10 text-encre rounded-bl-md"
                          }`}
                        >
                          {msg.contenu && msg.contenu.match(/^📋 Dossier partagé : (https?:\/\/\S+)$/) ? (
  <DossierCard
    url={msg.contenu.match(/^📋 Dossier partagé : (https?:\/\/\S+)$/)![1]}
    isMine={isMine}
  />
) : msg.contenu ? (
  <p>{msg.contenu}</p>
) : null}

                          {msg.fichierUrl && isImage && (
                            <img
                              src={msg.fichierUrl}
                              alt={msg.fichierNom || "image"}
                              className="mt-1.5 max-w-full rounded-xl object-cover cursor-pointer"
                              style={{ maxHeight: "200px" }}
                              onClick={() =>
                                setLightboxImage({
                                  messageId: msg.id,
                                  url: msg.fichierUrl!,
                                  name: msg.fichierNom || "image",
                                })
                              }
                              onContextMenu={(e) =>
                                handleFileContextMenu(
                                  e,
                                  msg.id,
                                  msg.fichierNom || "image"
                                )
                              }
                            />
                          )}

                          {msg.fichierUrl && !isImage && (
                            <button
                              onClick={() =>
                                downloadFile(msg.id, msg.fichierNom || "fichier")
                              }
                              className="flex items-center gap-1.5 text-xs underline opacity-80 mt-1"
                              onContextMenu={(e) =>
                                handleFileContextMenu(
                                  e,
                                  msg.id,
                                  msg.fichierNom || "Pi&#232;ce jointe"
                                )
                              }
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                              {msg.fichierNom || "Pi&#232;ce jointe"}
                            </button>
                          )}

                          <p
                            className={`text-[10px] mt-1 ${
                              isMine ? "text-white/50" : "text-ardoise/40"
                            }`}
                          >
                            {timeAgo(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-4 py-3 border-t border-ardoise/10 bg-white shrink-0">
                {selectedFile && (
                  <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-sauge-clair/40 border border-sauge/20">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-sauge-clair flex items-center justify-center shrink-0">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#1B3A2D"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                    )}
                    <p className="text-xs text-encre truncate flex-1">{selectedFile.name}</p>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}
                      className="text-ardoise/50 hover:text-urgent transition-colors shrink-0"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-xl border border-ardoise/15 bg-papier flex items-center justify-center shrink-0 hover:border-sauge/40 transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1B3A2D"
                      strokeWidth="2"
                    >
                      <path
                        d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="&#201;crire un message..."
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-ardoise/15 bg-papier px-4 py-2.5 text-sm text-encre placeholder:text-ardoise/40 focus:outline-none focus:border-sauge/40 transition-colors"
                    style={{ maxHeight: "120px" }}
                  />

                  <button
                    onClick={handleSend}
                    disabled={(!input.trim() && !selectedFile) || sending}
                    className="w-10 h-10 rounded-xl bg-encre text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-encre/90 transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
                <p className="text-[10px] text-ardoise/30 mt-1.5 pl-1">
                  Entr&#233;e pour envoyer &#183; Maj+Entr&#233;e pour sauter une ligne
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {contextMenu && (
        <div
          className="fixed z-[60] bg-white rounded-xl shadow-lg border border-ardoise/10 py-1 min-w-[190px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              downloadFile(contextMenu.messageId, contextMenu.filename);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-2 text-sm text-encre hover:bg-sauge-clair/40 flex items-center gap-2"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="7 10 12 15 17 10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            T&#233;l&#233;charger
          </button>
          <button
            onClick={() => {
              openInNewTab(contextMenu.messageId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-2 text-sm text-encre hover:bg-sauge-clair/40 flex items-center gap-2"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Ouvrir dans un nouvel onglet
          </button>
        </div>
      )}

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-6"
          onClick={() => setLightboxImage(null)}
          onContextMenu={(e) =>
            handleFileContextMenu(e, lightboxImage.messageId, lightboxImage.name)
          }
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadFile(lightboxImage.messageId, lightboxImage.name);
            }}
            className="absolute top-5 right-[70px] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="7 10 12 15 17 10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <img
            src={lightboxImage.url}
            alt={lightboxImage.name}
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}