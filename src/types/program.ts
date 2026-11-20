export interface Program {
  id: string;
  title: string;
  venueName?: string;
  venueAddress?: string;
  eventDate?: string;
  status: 'Active' | 'Draft' | 'Completed' | 'Cancelled' | 'Open' | string;
  targetBudget?: number | null;
  notes?: string;
  imageDataUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type QuestionType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | string;

export interface ProgramQuestion {
  id: string;
  projectId: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options?: string;
  order: number;
}

export interface RegistrationInput {
  projectId: string;
  volunteerName: string;
  volunteerEmail: string;
  phone: string;
  answers: Record<string, string>;
}

export interface RegistrationRecord extends RegistrationInput {
  id: string;
  registeredAt: string;
}
