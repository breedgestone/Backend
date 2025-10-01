import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'mysql'>('database.type', 'mysql'),
        host: configService.get<string>('database.host', 'localhost'),
        port: configService.get<number>('database.port', 3306),
        username: configService.get<string>('database.username', 'root'),
        password: configService.get<string>('database.password', ''),
        database: configService.get<string>('database.database', 'breedgestone_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // Always false when using migrations
        logging: configService.get<boolean>('database.logging', false),
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
