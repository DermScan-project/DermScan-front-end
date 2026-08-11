export type Sexe = 'H' | 'F'; 

export type MedecinStatut = 'EN_ATTENTE' | 'ACTIF' | 'REJETE' | 'DESACTIVE';

export type DossierStatut = 'BROUILLON' | 'EN_ATTENTE' | 'EN_COURS' | 'EVALUE';

export type NiveauPriorite = 'PAS_URGENT' | 'MOYENNEMENT_URGENT' | 'URGENT';

export type AvisMedical = 'CONSULTATION_URGENTE' | 'CONSULTATION_RECOMMANDEE' | 'PAS_URGENCE';

export interface Patient {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  sexe: Sexe;
  dateNaissance: string;
  telephone: string;
  emailVerified: boolean;
  createdAt: string;
  numeroSecuriteSociale: string | null;
}

export interface Medecin {
  id: string;
  nomComplet: string;
  specialite: string;
  rpps: string;
  telephone: string;
  email: string;
  adresseCabinet: string | null;
  statut: MedecinStatut;
  motifRejet: string | null;
  motifDesactivation: string | null;
  referencee: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface DossierPhoto {
  id: string;
  url: string;
  createdAt: string;
}

export interface Dossier {
  id: string;
  patientId: string;
    patient?: {
    prenom: string;
    nom: string;
    dateNaissance: string;
    sexe: string;
  };
  statut: DossierStatut;
  zones: string[];
  asymetrie: string | null;
  bords: string | null;
  couleurs: string[];
  diametre: string | null;
  evolution: string[];
  symptomes: string[];
  ancienneteObservation: string | null;
  expositionSolaire: string | null;
  phototype: string | null;
  antecedentsPersonnels: string[];
  antecedentsFamiliauxMelanome: string | null;
  nombreNaevus: string | null;
  scoreABCDE: number | null;
  niveauPriorite: NiveauPriorite | null;
  avisMedical: AvisMedical | null;
  messageAutomatique: string | null;
  commentaireMedecin: string | null;
  medecinEvaluateurId: string | null;
  medecinEvaluateur?: { nomComplet: string; specialite: string };
  photos: DossierPhoto[];
  createdAt: string;
  evaluatedAt: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type UserRole = 'patient' | 'medecin' | 'admin';