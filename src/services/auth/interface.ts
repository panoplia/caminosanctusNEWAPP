export interface AuthService {
  currentUserId(): Promise<string>;
}
