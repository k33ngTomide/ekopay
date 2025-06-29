// src/auth/dto/login-response.type.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/entity/user.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
