class _UpdateUserDto {
  dropBoxAuth: {
    clientId: string;
    clientSecret: string;
    accessToken: string;
    refreshToken: string;
  };
}

export class UpdateUserDto extends _UpdateUserDto {}
