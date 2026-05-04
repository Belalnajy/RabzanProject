import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user with password and role (since password is select: false by default)
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'fullName', 'status'],
      relations: ['role', 'role.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('هذا الحساب غير نشط');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    // Update last login
    await this.userRepository.update(user.id, { lastLogin: new Date() });

    // Generate JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.nameEn,
      permissions: user.role?.permissions?.map((p) => p.key) || [],
    };

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('البريد الإلكتروني مسجل مسبقاً');
    }

    const defaultRole = await this.roleRepository.findOneBy({ nameEn: 'Operations' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      fullName,
      email,
      password: hashedPassword,
      ...(defaultRole ? { role: defaultRole } : {}),
    });

    await this.userRepository.save(user);

    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'تم إنشاء الحساب بنجاح',
      user: userWithoutPassword,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('لا يوجد حساب مرتبط بهذا البريد الإلكتروني');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userRepository.update(user.id, {
      resetToken,
      resetTokenExpires,
    });

    // TODO: Integrate an email service (e.g. nodemailer, SendGrid) to send the reset link.
    // Currently, the token is only logged — the user will NOT receive an email.
    this.logger.warn(
      `⚠️ SMTP NOT CONFIGURED — Reset token for ${email}: ${resetToken}. ` +
      `This token must be sent via email. Configure an email service to enable this feature.`,
    );

    return {
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword, confirmNewPassword } = resetPasswordDto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
    }

    const user = await this.userRepository.findOne({
      where: {
        resetToken: token,
        resetTokenExpires: MoreThan(new Date()),
      },
      select: ['id', 'resetToken', 'resetTokenExpires'],
    });

    if (!user) {
      throw new BadRequestException('رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetToken: null as any,
      resetTokenExpires: null as any,
    });

    return {
      message: 'تم تغيير كلمة المرور بنجاح',
    };
  }
}
