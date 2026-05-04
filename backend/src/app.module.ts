import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CustomersModule } from './customers/customers.module';
import { FinanceModule } from './finance/finance.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CommissionsModule } from './commissions/commissions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProfileModule } from './profile/profile.module';
import { ReportsModule } from './reports/reports.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: configService.get<string>('DB_LOGGING') === 'true',
      }),
    }),
    AuthModule,
    UsersModule,
    OrdersModule,
    ProductsModule,
    CategoriesModule,
    CustomersModule,
    FinanceModule,
    TransactionsModule,
    CommissionsModule,
    DashboardModule,
    SettingsModule,
    NotificationsModule,
    ProfileModule,
    ReportsModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
