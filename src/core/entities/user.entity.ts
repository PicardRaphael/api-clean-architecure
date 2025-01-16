import { createHmac } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { env } from 'node:process';
import { z } from 'zod';

const ConfigSchema = z.object({
  secret: z.string().min(1),
  salt: z.string().min(1),
});
type UserConfig = z.infer<typeof ConfigSchema>;

abstract class User {
  protected readonly config: UserConfig;
  constructor() {
    this.config = ConfigSchema.parse({
      secret: env['JWT_SECRET'],
      salt: env['USER_SALT'],
    });
  }
}
type ExistingUserConstructorArgs = {
  id: string;
};
export class ExistingUser extends User {
  private _id: string;
  constructor({ id }: ExistingUserConstructorArgs) {
    super();
    this._id = id;
  }

  public get id() {
    return this._id;
  }

  /**
   * The function `signAndEncodeUserAccessToken` signs and encodes a user access token using a secret
   * key and returns the token.
   * @returns A string containing the signed and encoded user access token is being returned.
   */
  public signAndEncodeUserAccessToken(): string {
    const accessToken = sign({ sub: this.id }, this.config.secret, {
      expiresIn: 86400, //24hours
    });
    return accessToken;
  }
}

export class NotExistingUser extends User {
  constructor() {
    super();
  }

  /**
   * The function `hashPassword` takes a plaintext password, hashes it using SHA-512 algorithm with a
   * salt, and returns the hashed password in hexadecimal format.
   * @param {string} notHashedPassword - The `notHashedPassword` parameter is the password that has not
   * been hashed yet. This function takes the plain text password as input and uses a cryptographic
   * hash function (in this case, SHA-512) along with a salt value to securely hash the password before
   * returning the hashed value.
   * @returns The function `hashPassword` is returning the hashed password in hexadecimal format after
   * using the SHA-512 algorithm with the provided salt.
   */
  public hashPassword(notHashedPassword: string) {
    const hmac = createHmac('sha512', this.config.salt);
    hmac.update(notHashedPassword);
    return hmac.digest('hex');
  }

  /**
   * This function verifies and decodes a user access token to extract the user ID.
   * @param {string} accessToken - The `accessToken` parameter is a string that represents the user's
   * access token.
   * @returns The function `verifyAndDecodeUserAccessToken` is returning an object with a property `id`
   * that contains the value of the `sub` property from the decoded JWT token payload. If the `sub`
   * property exists and is a string, it returns an object with the `id` property set to the value of
   * `sub`. If the `sub` property is missing or not a string, it
   */
  public verifyAndDecodeUserAccessToken(accessToken: string): { id: string } {
    const { sub } = verify(accessToken, this.config.secret);
    if (sub && typeof sub === 'string') {
      return { id: sub };
    }
    throw "Expect a 'sub' property in jwt token payload";
  }
}
