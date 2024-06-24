import { LoginPayloadDto } from '../auth/dto/loginPaylod.dto';

export const authorizationToLoginPayload = (
  authorization: string,
): LoginPayloadDto => {
  const authorizationSplited = authorization.split('.');

  if (authorizationSplited.length < 3 || !authorizationSplited[1]) {
    return undefined;
  }

  return JSON.parse(
    Buffer.from(authorizationSplited[1], 'base64').toString('ascii'),
  );
};
