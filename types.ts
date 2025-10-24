export interface Candidate {
  id: string;
  name: string;
  imageUrl: string;
  votes: number;
}

export interface Poll {
  title: string;
  candidates: Candidate[];
}

export type AppView = 'voting' | 'dashboard' | 'admin' | 'user-management';