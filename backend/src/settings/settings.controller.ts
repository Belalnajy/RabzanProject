import {
  Controller,
  Get,
  Put,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SettingsService } from './settings.service';
import { UpdateGeneralDto } from './dto/update-general.dto';
import { UpdateWorkflowDto, CreateWorkflowStageDto } from './dto/update-workflow.dto';
import { UpdateFinancialDto } from './dto/update-financial.dto';
import {
  UpdateDefaultCurrencyDto,
  CreateCurrencyDto,
  UpdateExchangeRateDto,
} from './dto/update-currency.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getAllSettings() {
    return this.settingsService.getAllSettings();
  }

  @Put('general')
  updateGeneral(
    @Body() dto: UpdateGeneralDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.settingsService.updateGeneral(dto, userId);
  }

  @Get('workflow/stages')
  getWorkflowStages() {
    return this.settingsService.getWorkflowStages();
  }

  @Put('workflow')
  updateWorkflow(@Body() dto: UpdateWorkflowDto) {
    return this.settingsService.updateWorkflow(dto);
  }

  @Post('workflow/stages')
  createWorkflowStage(@Body() dto: CreateWorkflowStageDto) {
    return this.settingsService.createWorkflowStage(dto);
  }

  @Put('financial')
  updateFinancial(
    @Body() dto: UpdateFinancialDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.settingsService.updateFinancial(dto, userId);
  }

  @Put('currency')
  updateDefaultCurrency(
    @Body() dto: UpdateDefaultCurrencyDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.settingsService.updateDefaultCurrency(dto, userId);
  }

  @Post('currency')
  createCurrency(@Body() dto: CreateCurrencyDto) {
    return this.settingsService.createCurrency(dto);
  }

  @Patch('currency/:id/rate')
  updateExchangeRate(
    @Param('id') id: string,
    @Body() dto: UpdateExchangeRateDto,
  ) {
    return this.settingsService.updateExchangeRate(id, dto);
  }

  @Put('preferences')
  updatePreferences(
    @Body() dto: UpdatePreferencesDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.settingsService.updatePreferences(dto, userId);
  }
}
