export interface Response {
  data: any;
  errors: Array<{
    message: string;
  }>;
  message: string;
  success: boolean;
}

export interface User {
  email: string;
}

export interface SessionState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export type PersonalLogins = {
  total_sign_ins: number;
  dates: { date: string }[];
};

export type GlobalLogins = {
  total_sign_ins: number;
  dates: { date: string; email: string }[];
};

export type DateWEmail = { date: string; email: string };
