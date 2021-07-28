import { Injectable, NotFoundException } from '@nestjs/common';
import { sendEmail } from 'src/services/sendEmail';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { ValidateUserDto } from './dto/validate-user.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const validationCode = await this.userRepository.createUser(createUserDto);

    return sendEmail(createUserDto.email, 'verify user', 'verifyUser', {
      validationCode,
    });
  }

  async validateUser(validateUserDto: ValidateUserDto): Promise<void> {
    const findUser = await this.userRepository.validateUser(validateUserDto);

    if (!findUser) {
      throw new NotFoundException('invalid user or code');
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    return this.userRepository.singIn(signInDto);
  }
}
