/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// wallet/wallet.resolver.ts
import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { Wallet } from './entity/wallet.entity';
import { WalletService } from './wallet.service';
import { DepositInput } from './dto/deposit.input';
import { WithdrawInput } from './dto/withdraw.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UpdatePinInput } from './dto/update-pin.input';
import { WalletResponse } from './dto/response.dto';
import { WalletByUserResponse } from './dto/wallet-by-user.dto';

@Resolver(() => Wallet)
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => Wallet)
  async myWallet(@CurrentUser() user: any): Promise<Wallet> {
    return this.walletService.getUserWallet(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => WalletResponse)
  async deposit(
    @CurrentUser() user: any,
    @Args('depositInput') input: DepositInput,
  ): Promise<any> {
    return this.walletService.deposit(user.userId, input.amount);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => WalletResponse)
  async withdraw(
    @CurrentUser() user: any,
    @Args('withdrawInput') input: WithdrawInput,
  ): Promise<any> {
    return this.walletService.withdraw(user.userId, input.amount, input.pin);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => WalletResponse)
  async updatePin(
    @CurrentUser() user: any,
    @Args('updatePinInput') input: UpdatePinInput,
  ): Promise<any> {
    return this.walletService.updatePin(
      user.userId,
      input.formerPin,
      input.newPin,
    );
  }

  @Query(() => WalletByUserResponse)
  @UseGuards(GqlAuthGuard)
  walletByUser(@CurrentUser() user: {userId: string}): Promise<any> {
    return this.walletService.findByUserId(user.userId);
  }
}
