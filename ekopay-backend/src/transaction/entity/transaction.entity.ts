import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Wallet } from 'src/wallet/entity/wallet.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Transaction {
  @Field(() => ID)
  declare _id: string;

  @Field(() => Wallet)
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  wallet: mongoose.Types.ObjectId;

  @Field()
  @Prop({ enum: ['DEPOSIT', 'WITHDRAW', 'TRANSFER'], required: true })
  type: string;

  @Field()
  @Prop({ required: true })
  amount: number;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
