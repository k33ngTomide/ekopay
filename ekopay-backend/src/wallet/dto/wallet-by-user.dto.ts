/* eslint-disable prettier/prettier */
import { Field, ObjectType } from "@nestjs/graphql";
import { Wallet } from "../entity/wallet.entity";
import { Transaction } from "../../transaction/entity/transaction.entity";

@ObjectType()
export class WalletByUserResponse {
  @Field(() => Wallet)
  wallet: Wallet;

  @Field(() => [Transaction])
  transactionHistory: Transaction[];
}
