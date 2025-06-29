// src/database/database.module.ts
import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        console.log('Connecting to MongoDB URI:', uri); // <--- ADD THIS LINE
        return { uri };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  onModuleInit() {
    mongoose.connection.on('connected', () => {
      this.logger.log('✅ DB connected');
    });

    mongoose.connection.on('error', (err) => {
      this.logger.error('❌ DB connection error:', err);
    });
  }
}
