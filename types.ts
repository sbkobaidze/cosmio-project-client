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

export type Logins = {
  email: string;
  sign_in_count: number;
  sign_in_dates: string[];
};
