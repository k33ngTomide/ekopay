/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/user/user.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entity/user.entity';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcryptjs';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private readonly walletService: WalletService, // Assuming you have a WalletService to handle wallet-related operations
  ) {}

  async create(input: CreateUserInput): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(input.password, 10);

      const existingUser = await this.userModel.findOne({
        $or: [{ email: input.email }, { phone: input.phone }],
      });

      if (existingUser) {
        throw new ConflictException('User with email or phone already exists');
      }
      const user = new this.userModel({
        ...input,
        password: hashedPassword,
      });

      const userData = await user.save();
      const wallet = await this.walletService.createWallet({
        user: userData,
        accountNumber: userData.phone.startsWith('0')
          ? userData.phone.slice(1)
          : userData.phone,
      });
      if (!wallet) {
        throw new Error('Failed to create wallet for user');
      }
      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByPhone(accountNumber: string): Promise<any> {
    return this.userModel.findOne({ phone: `0${accountNumber}` });
  }

  async findByEmail(email: string): Promise<any> {
    return this.userModel.findOne({ email: email });
  }

  async findById(id: string): Promise<any> {
    const user = await this.userModel.findById(id);
    return user;
  }
}
