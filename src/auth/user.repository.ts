import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { nanoid } from 'nanoid';
import { ValidateUserDto } from './dto/validate-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<string> {
    try {
      const { username, password, email } = createUserDto;

      // encrypt password
      const salt = await genSalt(8);
      const hashedPassword = await hash(password, salt);

      // generate validationCode
      const validationCode = nanoid(4);

      const createdUser = new this.userModel({
        username,
        password: hashedPassword,
        email,
        validationCode,
      });
      await createdUser.save();

      return validationCode;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `${Object.keys(error.keyValue)[0]} already in use`,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUser(validateUserDto: ValidateUserDto): Promise<UserDocument> {
    try {
      const { username, validationCode } = validateUserDto;

      return await this.userModel.findOneAndUpdate(
        {
          username,
          validationCode,
        },
        {
          $set: { isVerified: true },
        },
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async singIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { username, password } = signInDto;

    const user = await this.userModel.findOne({
      username,
    });

    if (!user && !(await compare(password, user.password))) {
      throw new UnauthorizedException('invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('user not verified');
    }

    const payload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
