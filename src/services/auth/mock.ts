import type { AuthService } from './interface';

const MOCK_USER_ID = 'anon-local-001';

export const mockAuthService: AuthService = {
  async currentUserId(): Promise<string> {
    return MOCK_USER_ID;
  },
};
