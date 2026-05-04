import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role, Permission, User } from '../entities';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll() {
    const roles = await this.roleRepo.find({ relations: ['permissions'] });
    const withCounts = await Promise.all(
      roles.map(async (role) => {
        const userCount = await this.userRepo.count({
          where: { roleId: role.id },
        });
        return { ...role, userCount };
      }),
    );
    return withCounts;
  }

  async findAllPermissions() {
    return this.permissionRepo.find({ order: { key: 'ASC' } });
  }

  async remove(id: string) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('الدور غير موجود');
    }
    const inUse = await this.userRepo.count({ where: { roleId: id } });
    if (inUse > 0) {
      throw new BadRequestException(
        `لا يمكن حذف الدور لأنه مستخدم من قبل ${inUse} مستخدم`,
      );
    }
    await this.roleRepo.delete(id);
    return { message: 'تم حذف الدور بنجاح' };
  }

  async create(dto: CreateRoleDto) {
    const permissions = await this.permissionRepo.findBy({
      id: In(dto.permissionIds),
    });

    if (permissions.length !== dto.permissionIds.length) {
      throw new NotFoundException('بعض الصلاحيات غير موجودة');
    }

    const role = this.roleRepo.create({
      name: dto.name,
      nameEn: dto.nameEn,
      description: dto.description,
      permissions,
    });

    return this.roleRepo.save(role);
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('الدور غير موجود');
    }

    if (dto.name !== undefined) role.name = dto.name;
    if (dto.nameEn !== undefined) role.nameEn = dto.nameEn;
    if (dto.description !== undefined) role.description = dto.description;

    if (dto.permissionIds) {
      const permissions = await this.permissionRepo.findBy({
        id: In(dto.permissionIds),
      });

      if (permissions.length !== dto.permissionIds.length) {
        throw new NotFoundException('بعض الصلاحيات غير موجودة');
      }

      role.permissions = permissions;
    }

    return this.roleRepo.save(role);
  }
}
