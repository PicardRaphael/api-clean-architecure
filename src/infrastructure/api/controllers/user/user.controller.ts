import {
  Body,
  Controller,
  Post,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { createUserCodec } from './user.codec';

import {
  ConflictError,
  InvalidInputError,
  NotFoundError,
} from '../../error-handler';
import { signin, signup } from './user.service';

// For TSOA generation, use the service's param type instead of the zod model directly
type SigninParam = Parameters<typeof signin>[0];
type SignupParam = Parameters<typeof signup>[0];

@Route('users')
@Tags('Users')
export class UserController extends Controller {
  constructor() {
    super();
  }

  /**
   * @summary Signin user
   */
  @Post('/signin')
  @SuccessResponse(200)
  @Response(400, 'Invalid request params')
  @Response(404, 'Not found')
  async signin(@Body() requestBody: SigninParam) {
    const decodingResult = createUserCodec.decode(requestBody);

    if (!decodingResult.success) {
      throw new InvalidInputError(decodingResult.error.toString());
    }

    const user = await signin(
      decodingResult.data.login,
      decodingResult.data.password,
    );

    if (user === 'USER_NOT_FOUND') {
      throw new NotFoundError('USER_NOT_FOUND');
    }

    return user;
  }

  /**
   * @summary Signup user
   */
  @Post('/signup')
  @SuccessResponse(201)
  @Response(400, 'Invalid request params')
  @Response(409, 'Already exists')
  async signup(@Body() requestBody: SignupParam) {
    const decodingResult = createUserCodec.decode(requestBody);

    if (!decodingResult.success) {
      throw new InvalidInputError(decodingResult.error.toString());
    }

    const user = await signup(decodingResult.data);

    if (user === 'USER_ALREADY_EXISTS') {
      throw new ConflictError('USER_ALREADY_EXISTS');
    }

    return user;
  }
}
