import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Role, Permission } from '../entities';
import { UsersController } from './users.controller';
import { RolesController } from './roles.controller';
import { UsersService } from './users.service';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  controllers: [UsersController, RolesController],
  providers: [UsersService, RolesService],
  exports: [UsersService],
})
export class UsersModule {}
