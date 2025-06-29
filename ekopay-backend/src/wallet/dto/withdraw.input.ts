// wallet/dto/withdraw.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class WithdrawInput {
  @Field()
  amount: number;

  @Field()
  pin: string;
}
