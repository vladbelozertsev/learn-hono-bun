import { Equal } from "./valid";
import { Users } from "../../../prisma/types";

export type User = Equal<
  Users,
  {
    email: string;
    name: string;
    password: string | null;
    id: number;
    emailVerified: boolean;
    signature: string | null;
    role: string;
    oauth: string | null;
    oauthId: string | null;
  }
>;
