// src/auth/dto/login.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  credential: string;

  @Field()
  password: string;
}
