import { createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator((data, req) => {
  return data ? req.user[data] : req.user;
});
