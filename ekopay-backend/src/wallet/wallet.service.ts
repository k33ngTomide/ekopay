/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// wallet/wallet.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet } from './entity/wallet.entity';
import { Model } from 'mongoose';
import { User } from 'src/user/entity/user.entity';
import {
  INCORRECT_CURRENT_PIN,
  INCORRECT_PIN,
  INSUFFICIENT_FUND,
  INVALID_ZERO_AMOUNT,
  PIN_UPDATED_SUCCESSFULLY,
  SAME_PIN_ERROR,
  USER_NOT_FOUND,
  WALLET_NOT_FOUND,
} from 'src/common/utils/constants';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly transactionService: TransactionService,
  ) {}

  async createWallet({
    user,
    accountNumber,
  }: {
    user: User;
    accountNumber: string;
  }) {
    try {
      return await this.walletModel.create({
        user: user,
        accountNumber,
        balance: 0,
        pin: 'default_' + accountNumber,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updatePin(
    userId: string,
    formerPin: string,
    newPin: string,
  ): Promise<any> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new BadRequestException(USER_NOT_FOUND);
      }

      if (formerPin === newPin) {
        throw new NotAcceptableException(SAME_PIN_ERROR);
      }

      const wallet = await this.getUserWallet(userId);

      const isFirstTimeUpdate =
        wallet.pin === 'default_' + wallet.accountNumber &&
        formerPin === '0000';

      if (!isFirstTimeUpdate && wallet.pin !== formerPin) {
        throw new UnauthorizedException(INCORRECT_CURRENT_PIN);
      }

      wallet.pin = newPin;
      const savedWallet = await wallet.save();

      // TODO: send email to user about this update
      return { message: PIN_UPDATED_SUCCESSFULLY, wallet: savedWallet };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getUserWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletModel.findOne({ user: userId });
    if (!wallet) throw new NotFoundException(WALLET_NOT_FOUND);
    return wallet;
  }

  async deposit(userId: string, amount: number): Promise<any> {
    if (amount <= 0) throw new BadRequestException(INVALID_ZERO_AMOUNT);

    const wallet = await this.getUserWallet(userId);
    wallet.balance += amount;
    const savedWallet = await wallet.save();
    await this.transactionService.addTransaction(
      savedWallet,
      'DEPOSIT',
      amount,
    );
    return { wallet: savedWallet, message: 'Deposit successful' };
  }

  async withdraw(userId: string, amount: number, pin: string): Promise<any> {
    const wallet = await this.getUserWallet(userId);
    if (wallet.pin !== pin) {
      throw new BadRequestException(INCORRECT_PIN);
    }
    if (wallet.balance < amount) {
      throw new BadRequestException(INSUFFICIENT_FUND);
    }

    wallet.balance -= amount;
    const updatedWallet = await wallet.save();

    await this.transactionService.addTransaction(
      updatedWallet,
      'WITHDRAW',
      amount,
    );

    return { wallet: updatedWallet, message: 'Withdrawal successful' };
  }

  async findByUserId(userId: string): Promise<any> {
    const wallet = await this.walletModel
      .findOne({ user: userId })
      .populate('user', 'name email phone')
      .exec();
    
    if (!wallet) {
      throw new NotFoundException(WALLET_NOT_FOUND);
    }
    const transactions = await this.transactionService.getTransactionHistory(wallet._id);
    return {
      wallet: {
        _id: wallet._id,
        accountNumber: wallet.accountNumber,
        balance: wallet.balance,
        createdAt: wallet.createdAt,
      },
      transactionHistory: transactions || []
    };
  }

}
