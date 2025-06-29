import { ObjectType, Field } from '@nestjs/graphql';
import { Wallet } from '../entity/wallet.entity';

@ObjectType()
export class WalletResponse {
  @Field()
  message: string;

  @Field(() => Wallet)
  wallet: Wallet;
}
