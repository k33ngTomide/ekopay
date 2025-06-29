// src/user/user.resolver.ts
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') input: CreateUserInput,
  ): Promise<User> {
    return this.userService.create(input);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: { userId: string }): Promise<any> {
    if (!user || !user.userId) {
      throw new Error('User not authenticated');
    }
    return this.userService.findById(user.userId);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }
}
