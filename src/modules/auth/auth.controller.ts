import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import routes from 'src/routes/index.route';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags(`Auth/Login/Register`)
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //! Register
  @Post(`${routes.register}`)
  @ApiOperation({
    summary: 'Create a new Account_Trial',
    description: `
        * People can register account with only role STUDENT_TRIAL`,
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      account_1: {
        value: {
          email: 'cntt1912@gmail.com',
          fullname: 'NguyenCuong',
          phonenumber: '0962458201',
          password: 'Cuong1912!',
        } as RegisterDto,
      },
    },
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  //! login
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post(`${routes.login}`)
  @ApiOperation({
    summary: 'Login Account',
    description: `
       * Login account with Email and Password`,
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      account_1: {
        value: {
          identifier: 'cuongng1912@gmail.com',
          password: 'Cuong1912!',
        } as LoginDto,
      },
    },
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
