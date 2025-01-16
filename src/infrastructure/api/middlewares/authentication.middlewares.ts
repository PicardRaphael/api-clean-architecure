import express from 'express';
import { container } from 'tsyringe';
import {
  ExistingUser,
  NotExistingUser,
} from '../../../core/entities/user.entity';
import { AuthenticatedContext } from '../../../core/ports/api.port';
import { UserRepository } from '../../../core/ports/database.port';
import { UnauthorizedError } from '../error-handler';

/**
 * The function `extractTokenFromRequest` extracts a token from the authorization header of a request
 * in TypeScript.
 * @param req - The `req` parameter is an object representing the HTTP request in an Express
 * application. It contains information about the incoming request such as headers, body, query
 * parameters, and more.
 * @return {string | 'TOKEN_NOT_FOUND'} - The function returns a string if the token is found in the
 * request, or 'TOKEN_NOT_FOUND' if the token is not found.
 */
const extractTokenFromRequest = (
  req: express.Request,
): string | 'TOKEN_NOT_FOUND' =>
  (req.headers.authorization ?? '').replace('Bearer ', '') || 'TOKEN_NOT_FOUND';

/**
 * The function `verifyAndDecodeJwtToken` attempts to verify and decode a JWT token, returning either
 * an object with an `id` property or the string 'INVALID_JWT_TOKEN'.
 * @param {string} token - The `token` parameter is a string that represents a JWT (JSON Web Token)
 * that needs to be verified and decoded to extract the user's ID.
 * @returns The `verifyAndDecodeJwtToken` function is returning either 'INVALID_JWT_TOKEN' if an error
 * occurs during the verification and decoding process, or an object with the property `id: string` if
 * the token is successfully verified and decoded.
 */
const verifyAndDecodeJwtToken = (
  token: string,
): 'INVALID_JWT_TOKEN' | { id: string } => {
  try {
    const notExistingUser = new NotExistingUser();
    return notExistingUser.verifyAndDecodeUserAccessToken(token);
  } catch (e) {
    return 'INVALID_JWT_TOKEN';
  }
};

/**
 * The function `retriveUserFromId` asynchronously retrieves an existing user based on their ID or
 * returns a string indicating an unknown user.
 * @param {string} id - The `id` parameter is a string representing the unique identifier of a user
 * that you want to retrieve from the database.
 * @returns The function `retriveUserFromId` is returning a `Promise` that resolves to either an
 * `ExistingUser` object if the user with the provided `id` is found in the database, or the string
 * `'UNKNOW_USER'` if the user is not found.
 */
const retriveUserFromId = async (
  id: string,
): Promise<ExistingUser | 'UNKNOW_USER'> => {
  const userRepository = container.resolve<UserRepository>('UserRepository');
  return (await userRepository.findById(id)) || 'UNKNOW_USER';
};

/**
 * The function `getUserFromJwtToken` verifies a JWT token, retrieves user information based on the
 * token, and returns the user ID or specific error messages.
 * @param {string} token - The `token` parameter is a string that represents a JWT token.
 * @returns The function `getUserFromJwtToken` returns a Promise that resolves to either an object
 * containing the `userId` property, the string `'UNKNOW_USER'`, or the string `'INVALID_JWT_TOKEN'`.
 */
const getUserFromJwtToken = async (
  token: string,
): Promise<{ userId: string } | 'UNKNOW_USER' | 'INVALID_JWT_TOKEN'> => {
  const payload = verifyAndDecodeJwtToken(token);
  if (payload === 'INVALID_JWT_TOKEN') {
    return payload;
  }
  const user = await retriveUserFromId(payload.id);
  if (user === 'UNKNOW_USER') {
    return user;
  }
  return { userId: payload.id };
};

/**
 * The function `expressAuthentication` handles authentication in an Express application by extracting
 * a token from the request, validating it, and returning an authenticated user context.
 * @param req - The `req` parameter is an object representing the HTTP request in an Express
 * application. It contains information about the incoming request such as headers, query parameters,
 * body data, and more. This parameter is typically provided by Express when handling a request from a
 * client.
 * @param {string} _securityName - The `_securityName` parameter in the `expressAuthentication`
 * function is a string that represents the security scheme name or identifier. It is typically used in
 * API documentation or configuration to specify the security requirements for a particular endpoint or
 * operation.
 * @param {string[]} _scope - The `_scope` parameter in the `expressAuthentication` function is an
 * array of strings that represents the required scope or permissions for the authenticated user. It is
 * used to define what actions or resources the user is allowed to access within the application.
 * @returns The `expressAuthentication` function returns a Promise that resolves to an
 * `AuthenticatedContext` object if the authentication process is successful. If there is an issue with
 * the token (such as it not being found or being invalid), the function returns a rejected Promise
 * with an `UnauthorizedError` containing the appropriate error message.
 */
export async function expressAuthentication(
  req: express.Request,
  _securityName: string,
  _scope: string[],
): Promise<AuthenticatedContext> {
  const token = extractTokenFromRequest(req);
  if (token === 'TOKEN_NOT_FOUND') {
    return Promise.reject(new UnauthorizedError('Missing authentification'));
  }

  const user = await getUserFromJwtToken(token);
  if (user === 'UNKNOW_USER' || user === 'INVALID_JWT_TOKEN') {
    return Promise.reject(new UnauthorizedError('Invalid token'));
  }
  return Promise.resolve(user);
}
