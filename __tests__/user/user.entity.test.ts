import { sign } from 'jsonwebtoken';
import {
  ExistingUser,
  NotExistingUser,
} from '../../src/core/entities/user.entity';

describe('User Entity', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.USER_SALT = 'test-salt';
  });

  it('should create an ExistingUser and sign an access token', () => {
    const user = new ExistingUser({ id: 'user-id' });
    const token = user.signAndEncodeUserAccessToken();
    expect(typeof token).toBe('string');
  });

  it('should verify and decode a valid access token', () => {
    const user = new ExistingUser({ id: 'user-id' });
    const token = user.signAndEncodeUserAccessToken();
    const notExistingUser = new NotExistingUser();
    const decoded = notExistingUser.verifyAndDecodeUserAccessToken(token);
    expect(decoded.id).toBe('user-id');
  });

  it('should throw an error for an invalid access token', () => {
    const notExistingUser = new NotExistingUser();
    const invalidToken = sign({}, process.env.JWT_SECRET!); // JWT valide mais sans 'sub'
    expect(() => {
      notExistingUser.verifyAndDecodeUserAccessToken(invalidToken);
    }).toThrow("Expect a 'sub' property in jwt token payload");
  });
});
