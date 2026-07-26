import { apiFetch } from "./client";
import { io, Socket } from "socket.io-client";
import { getTokens } from "./client";
export interface MedecinContact {
  id: string;
  nomComplet: string;
  specialite: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  contenu: string | null;
  fichierUrl: string | null;
  fichierNom: string | null;
  fichierType: string | null;
  lu: boolean;
  createdAt: string;
}

export interface Conversation {
  medecin: MedecinContact;
  dernierMessage: string | null;
  dernierMessageDate: string;
  nonLus: number;
}

export interface ConversationDetail {
  medecin: MedecinContact;
  messages: Message[];
}

export function listConversations() {
  return apiFetch<{ conversations: Conversation[] }>("/api/medecin/messages");
}

export function getConversation(medecinId: string) {
  return apiFetch<ConversationDetail>(`/api/medecin/messages/${medecinId}`);
}

export function sendMessage(medecinId: string, contenu: string, file?: File) {
  if (file) {
    const form = new FormData();
    if (contenu) form.append("contenu", contenu);
    form.append("fichier", file);
    return apiFetch<{ message: Message }>(`/api/medecin/messages/${medecinId}`, {
      method: "POST",
      body: form,
    });
  }
  return apiFetch<{ message: Message }>(`/api/medecin/messages/${medecinId}`, {
    method: "POST",
    body: JSON.stringify({ contenu }),
  });
}

export function listActiveMedecins() {
  return apiFetch<{ medecins: MedecinContact[] }>("/api/medecin/active");
}
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const tokens = getTokens();
    socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token: tokens?.accessToken },
    });
  }
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getDownloadUrl(messageId: string) {
  return apiFetch<{ url: string }>(`/api/medecin/messages/file/${messageId}/download`);
}
