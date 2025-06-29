// wallet/wallet.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './entity/wallet.entity';
import { WalletService } from './wallet.service';
import { WalletResolver } from './wallet.resolver';
import { User, UserSchema } from 'src/user/entity/user.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import {
  Transaction,
  TransactionSchema,
} from 'src/transaction/entity/transaction.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [WalletService, WalletResolver, TransactionService],
  exports: [WalletService],
})
export class WalletModule {}
