import { Users } from "../../../prisma/types";
import { Equal } from "./valid";

export type User = Equal<
  Users,
  {
    email: string;
    password: string;
    signature: string;
    id: number;
    emailVerified: boolean;
    name: string;
    role: string;
  }
>;
