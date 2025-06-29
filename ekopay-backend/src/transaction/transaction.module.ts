import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './entity/transaction.entity';
import { Wallet, WalletSchema } from '../wallet/entity/wallet.entity';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { User, UserSchema } from 'src/user/entity/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [TransactionService, TransactionResolver],
  exports: [TransactionService],
})
export class TransactionModule {}
