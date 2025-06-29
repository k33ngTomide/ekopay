import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entity/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { WalletService } from 'src/wallet/wallet.service';
import { Wallet, WalletSchema } from 'src/wallet/entity/wallet.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import {
  Transaction,
  TransactionSchema,
} from 'src/transaction/entity/transaction.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [UserService, UserResolver, WalletService, TransactionService],
  exports: [UserService],
})
export class UserModule {}
