import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('auth')
@ApiResponse({
  status: 500,
  description: 'SERVER ERROR',
})
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('/validateUser')
  validateUser(@Body() validateUserDto: ValidateUserDto) {
    return this.authService.validateUser(validateUserDto);
  }

  @Post('/signIn')
  signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInDto);
  }
}
