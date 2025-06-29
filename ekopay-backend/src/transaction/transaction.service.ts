// src/transaction/transaction.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './entity/transaction.entity';
import { Wallet, WalletDocument } from '../wallet/entity/wallet.entity';
import { User, UserDocument } from '../user/entity/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,

    @InjectModel(Wallet.name)
    private readonly walletModel: Model<WalletDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const wallet = await this.walletModel.findOne({ user: user._id });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return this.transactionModel
      .find({ wallet: wallet._id })
      .sort({ createdAt: -1 })
      .exec();
  }

  async addTransaction(
    wallet: WalletDocument,
    type: 'DEPOSIT' | 'WITHDRAW',
    amount: number,
  ): Promise<Transaction> {
    const transaction = new this.transactionModel({
      wallet: wallet._id,
      type,
      amount,
    });

    return transaction.save();
  }

  async getTransactionHistory(walletId: string): Promise<Transaction[]> {
    const wallet = await this.walletModel.findById(walletId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return this.transactionModel
      .find({ wallet: wallet._id })
      .sort({ createdAt: -1 })
      .exec();
  }
}
