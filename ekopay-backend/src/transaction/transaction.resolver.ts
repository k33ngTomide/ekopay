// src/transaction/transaction.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { Transaction } from './entity/transaction.entity';
import { TransactionService } from './transaction.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Transaction])
  async transactions(
    @CurrentUser() user: { userId: string },
  ): Promise<Transaction[]> {
    return this.transactionService.getUserTransactions(user.userId);
  }
}
