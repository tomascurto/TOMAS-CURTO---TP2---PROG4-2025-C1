import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { RegistroUserDto } from '../dto/registro.dto';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string) {
    const user = await this.usersService.findByUsernameOrEmail(usernameOrEmail);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Contraseña incorrecta');

    const { password: _, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }

    async login(usernameOrEmail: string, password: string) {
        const user = await this.validateUser(usernameOrEmail, password);
        const token = this.jwtService.sign(
            {
            sub: user._id.toString(),
            username: user.username,
            role: user.role,
            },
            {
            expiresIn: '15m',
            },
        );

        return {
            message: 'Login exitoso',
            token,
            user,
        };
    }

  async registro(registroUserDto: RegistroUserDto) {
    const { username, email, password } = registroUserDto;

    const existingUser = await this.usersService.findByUsernameOrEmail(username);
    if (existingUser) {
      throw new BadRequestException('Nombre de usuario o email ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: UserDocument = await this.usersService.create({
      ...registroUserDto,
      password: hashedPassword,
    });

    const userObj = newUser.toObject() as any;
    delete userObj.password;

    return userObj;
  }

    generarToken(user: any) {
        return this.jwtService.sign(
            {
            sub: (user.userId || user._id).toString(),
            username: user.username,
            role: user.profile || 'usuario',
            },
            {
            expiresIn: '15m',
            },
        );
    }
}
