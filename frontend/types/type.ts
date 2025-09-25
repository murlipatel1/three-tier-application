// types.ts (put in frontend/ for reuse)

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string; // Date serialized as string in JSON
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  userId: number;
  user?: User;
}
