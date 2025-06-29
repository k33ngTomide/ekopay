// wallet/entity/wallet.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/entity/user.entity';
import * as mongoose from 'mongoose';
import { Transaction } from '../../transaction/entity/transaction.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Wallet extends Document {
  @Field(() => ID)
  declare _id: string;

  @Field()
  @Prop({ unique: true, required: true })
  accountNumber: string;

  @Field()
  @Prop({ required: true })
  pin: string;

  @Field()
  @Prop({ default: 0 })
  balance: number;

  @Field(() => User)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Field(() => [Transaction], { nullable: true })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  })
  transactions: mongoose.Types.ObjectId[];

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
export type WalletDocument = Wallet & Document;
