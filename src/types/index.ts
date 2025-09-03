export interface Meeting {
  id: string;
  title: string;
  participants: Participant[];
  date: string;
  time: string;
  type: string;
  tags: string[];
  notes?: string;
  transcript?: string;
  status: 'past' | 'upcoming';
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  company?: string;
  website?: string;
  title?: string;
  avatar?: string;
}