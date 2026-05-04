import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '../entities/setting.entity';
import { WorkflowStage } from '../entities/workflow-stage.entity';
import { Currency } from '../entities/currency.entity';
import { UpdateGeneralDto } from './dto/update-general.dto';
import { UpdateWorkflowDto, CreateWorkflowStageDto } from './dto/update-workflow.dto';
import { UpdateFinancialDto } from './dto/update-financial.dto';
import {
  UpdateDefaultCurrencyDto,
  CreateCurrencyDto,
  UpdateExchangeRateDto,
} from './dto/update-currency.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
    @InjectRepository(WorkflowStage)
    private workflowStageRepository: Repository<WorkflowStage>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  async getAllSettings() {
    const settings = await this.settingRepository.find();
    const grouped: Record<string, Record<string, string>> = {};

    for (const s of settings) {
      if (!grouped[s.group]) grouped[s.group] = {};
      grouped[s.group][s.key] = s.value;
    }

    const workflowStages = await this.workflowStageRepository.find({
      order: { sortOrder: 'ASC' },
    });
    grouped['workflow'] = { ...(grouped['workflow'] || {}), stages: JSON.stringify(workflowStages) };

    const currencies = await this.currencyRepository.find({ order: { isDefault: 'DESC' } });
    grouped['currency'] = {
      ...(grouped['currency'] || {}),
      currencies: JSON.stringify(currencies),
    };

    return grouped;
  }

  async updateGeneral(dto: UpdateGeneralDto, userId: string) {
    const mapping: Record<string, string | undefined> = {
      system_name: dto.systemName,
      company_name: dto.companyName,
      lang: dto.lang,
      timezone: dto.timezone,
      date_format: dto.dateFormat,
    };
    await this.upsertSettings(mapping, 'general', userId);
    return { message: 'تم تحديث الإعدادات العامة بنجاح' };
  }

  async getWorkflowStages() {
    return this.workflowStageRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async updateWorkflow(dto: UpdateWorkflowDto) {
    for (let i = 0; i < dto.stages.length; i++) {
      const stage = dto.stages[i];
      await this.workflowStageRepository.update(stage.id, {
        title: stage.title,
        isMandatory: stage.isMandatory,
        needsConfirmation: stage.needsConfirmation,
        sortOrder: i,
      });
    }
    return { message: 'تم تحديث مراحل سير العمل بنجاح' };
  }

  async createWorkflowStage(dto: CreateWorkflowStageDto) {
    const maxOrder = await this.workflowStageRepository
      .createQueryBuilder('ws')
      .select('MAX(ws.sort_order)', 'max')
      .getRawOne();

    const stage = this.workflowStageRepository.create({
      title: dto.title,
      isMandatory: dto.isMandatory ?? true,
      needsConfirmation: dto.needsConfirmation ?? false,
      sortOrder: (parseInt(maxOrder?.max, 10) || 0) + 1,
    });

    const saved = await this.workflowStageRepository.save(stage);
    return { message: 'تم إضافة مرحلة جديدة بنجاح', stage: saved };
  }

  async updateFinancial(dto: UpdateFinancialDto, userId: string) {
    const mapping: Record<string, string | undefined> = {
      default_commission: dto.defaultCommission?.toString(),
      allow_override: dto.allowOverride?.toString(),
      credit_limit: dto.creditLimit?.toString(),
      payment_terms: dto.paymentTerms,
      delay_alert_limit: dto.delayAlertLimit?.toString(),
    };
    await this.upsertSettings(mapping, 'financial', userId);
    return { message: 'تم تحديث الإعدادات المالية بنجاح' };
  }

  async updateDefaultCurrency(dto: UpdateDefaultCurrencyDto, userId: string) {
    await this.currencyRepository.update({}, { isDefault: false });

    const currency = await this.currencyRepository.findOneBy({ code: dto.defaultCurrency });
    if (!currency) {
      throw new NotFoundException('العملة غير موجودة');
    }
    await this.currencyRepository.update(currency.id, { isDefault: true });

    await this.upsertSettings(
      { default_currency: dto.defaultCurrency },
      'currency',
      userId,
    );
    return { message: 'تم تحديث العملة الافتراضية بنجاح' };
  }

  async createCurrency(dto: CreateCurrencyDto) {
    const currency = this.currencyRepository.create({
      code: dto.code,
      name: dto.name,
      exchangeRate: dto.exchangeRate,
    });
    const saved = await this.currencyRepository.save(currency);
    return { message: 'تم إضافة عملة جديدة بنجاح', currency: saved };
  }

  async updateExchangeRate(id: string, dto: UpdateExchangeRateDto) {
    const currency = await this.currencyRepository.findOneBy({ id });
    if (!currency) {
      throw new NotFoundException('العملة غير موجودة');
    }
    await this.currencyRepository.update(id, { exchangeRate: dto.exchangeRate });
    return { message: 'تم تحديث سعر الصرف بنجاح' };
  }

  async updatePreferences(dto: UpdatePreferencesDto, userId: string) {
    const mapping: Record<string, string | undefined> = {
      dark_mode: dto.darkMode?.toString(),
      auto_logout: dto.autoLogout?.toString(),
      audit_log: dto.auditLog?.toString(),
    };
    await this.upsertSettings(mapping, 'preferences', userId);
    return { message: 'تم تحديث التفضيلات بنجاح' };
  }

  private async upsertSettings(
    mapping: Record<string, string | undefined>,
    group: string,
    userId: string,
  ) {
    for (const [key, value] of Object.entries(mapping)) {
      if (value === undefined) continue;

      const existing = await this.settingRepository.findOneBy({ key });
      if (existing) {
        await this.settingRepository.update(existing.id, {
          value,
          lastModifiedBy: userId,
        });
      } else {
        await this.settingRepository.save(
          this.settingRepository.create({
            key,
            value,
            group,
            lastModifiedBy: userId,
          }),
        );
      }
    }
  }
}
