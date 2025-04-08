import { store } from "@/store/store";
import { setUser } from "@/store/slices/authSlice";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  image?: string | null | undefined;
  isNew?: boolean;
}

interface SessionData {
  token: string;
  expiresAt: Date;
}

export function updateReduxAuthState(userData: UserData, sessionData: SessionData) {
  store.dispatch(setUser({
    user: userData,
    token: sessionData.token,
    expiresAt: sessionData.expiresAt,
  }));
} 