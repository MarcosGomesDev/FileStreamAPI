export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  dropBoxAuth?: {
    clientId: string;
    clientSecret: string;
    accessToken: string;
    refreshToken: string;
  };
}
