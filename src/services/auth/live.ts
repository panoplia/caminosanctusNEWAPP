import type { AuthService } from './interface';

// Stub — wired when Supabase Auth is configured (🔒 human gate)
export const liveAuthService: AuthService = {
  async currentUserId(): Promise<string> {
    throw new Error('Live AuthService not yet configured. Add Supabase credentials.');
  },
};
