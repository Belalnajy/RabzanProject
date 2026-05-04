import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting, WorkflowStage, Currency } from '../entities';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting, WorkflowStage, Currency])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
