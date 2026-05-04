import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, Product } from '../entities';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll() {
    const categories = await this.categoryRepo
      .createQueryBuilder('category')
      .loadRelationCountAndMap('category.productCount', 'category.products')
      .leftJoinAndSelect('category.children', 'children')
      .where('category.parentId IS NULL')
      .orderBy('category.createdAt', 'DESC')
      .getMany();

    return categories;
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['children', 'parent'],
    });

    if (!category) {
      throw new NotFoundException('التصنيف غير موجود');
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    if (dto.parentId) {
      const parent = await this.categoryRepo.findOne({ where: { id: dto.parentId } });
      if (!parent) {
        throw new NotFoundException('التصنيف الأب غير موجود');
      }
    }

    const category = this.categoryRepo.create(dto);
    const saved = await this.categoryRepo.save(category);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (dto.parentId) {
      const parent = await this.categoryRepo.findOne({ where: { id: dto.parentId } });
      if (!parent) {
        throw new NotFoundException('التصنيف الأب غير موجود');
      }
    }

    Object.assign(category, dto);
    await this.categoryRepo.save(category);
    return this.findOne(id);
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    await this.productRepo
      .createQueryBuilder()
      .update(Product)
      .set({ categoryId: null as any })
      .where('category_id = :id', { id })
      .execute();

    await this.categoryRepo.remove(category);
    return { message: 'تم حذف التصنيف بنجاح' };
  }

  async updateImage(id: string, imageUrl: string) {
    const category = await this.findOne(id);
    category.image = imageUrl;
    await this.categoryRepo.save(category);
    return this.findOne(id);
  }
}
