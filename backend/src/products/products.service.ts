import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, Category, Customer } from '../entities';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async findAll(query: QueryProductDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.customer', 'customer');

    if (query.search) {
      qb.andWhere(
        '(product.name ILIKE :search OR product.nameAr ILIKE :search OR product.model ILIKE :search OR product.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.client) {
      qb.andWhere('product.customer_id = :clientId', { clientId: query.client });
    }

    if (query.category) {
      qb.andWhere('product.category_id = :categoryId', { categoryId: query.category });
    }

    if (query.status) {
      qb.andWhere('product.status = :status', { status: query.status });
    }

    qb.orderBy('product.createdAt', 'DESC');

    const [data, totalItems] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'customer'],
    });

    if (!product) {
      throw new NotFoundException('المنتج غير موجود');
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!category) {
        throw new NotFoundException('التصنيف غير موجود');
      }
    }

    if (dto.customerId) {
      const customer = await this.customerRepo.findOne({ where: { id: dto.customerId } });
      if (!customer) {
        throw new NotFoundException('العميل غير موجود');
      }
    }

    const displayId = await this.generateDisplayId();

    const product = this.productRepo.create({
      ...dto,
      displayId,
    });

    const saved = await this.productRepo.save(product);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!category) {
        throw new NotFoundException('التصنيف غير موجود');
      }
    }

    if (dto.customerId) {
      const customer = await this.customerRepo.findOne({ where: { id: dto.customerId } });
      if (!customer) {
        throw new NotFoundException('العميل غير موجود');
      }
    }

    Object.assign(product, dto);
    await this.productRepo.save(product);
    return this.findOne(id);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    product.status = 'archived';
    await this.productRepo.save(product);
    return { message: 'تم أرشفة المنتج بنجاح' };
  }

  async updateImage(id: string, imagePath: string) {
    const product = await this.findOne(id);
    product.image = imagePath;
    await this.productRepo.save(product);
    return this.findOne(id);
  }

  async updateGallery(id: string, imagePaths: string[]) {
    const product = await this.findOne(id);
    product.gallery = [...(product.gallery || []), ...imagePaths];
    await this.productRepo.save(product);
    return this.findOne(id);
  }

  private async generateDisplayId(): Promise<string> {
    const lastProduct = await this.productRepo
      .createQueryBuilder('product')
      .orderBy('product.createdAt', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (lastProduct?.displayId) {
      const match = lastProduct.displayId.match(/PROD-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    return `PROD-${String(nextNumber).padStart(5, '0')}`;
  }
}
