import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Account } from '../account/entities/account.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { baseRoles, roleNames } from 'src/core/constants';
import * as bcrypt from 'bcrypt';
import { IToken } from 'src/interfaces/token.interfaces';
import baseExceptions from 'src/helpers/baseExceptions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectConnection() private connection: Connection,
    private jwtService: JwtService,
  ) {}
  //! register
  async register(registerDto: RegisterDto) {
    try {
      const roleCustomer = baseRoles.find(
        (role) => role.roleName === roleNames.customer,
      );
      const hashPassword = await this.hashFunc(registerDto.password);
      registerDto.password = hashPassword;
      registerDto.role = roleCustomer.id;
      const createdAccount = new this.accountModel(registerDto);
      const accountSuccess = await createdAccount.save();
      return accountSuccess;
    } catch (error) {
      baseExceptions.HttpException(error);
    }
  }

  //! login
  async login(account: Account) {
    try {
      const role = baseRoles.find((role) => role.id === account.role);
      const payload: IToken = {
        email: account.email,
        role: role.roleName,
      };
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);
      const tokenHash = await this.hashFunc(refreshToken);
      const accountLogin = await this.accountModel.findOneAndUpdate(
        { email: account.email },
        { refreshToken: tokenHash },
        { new: true },
      );
      return {
        accountLogin,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      baseExceptions.HttpException(error);
    }
  }

  //! forgot password
  // async forgotPassword(email: string) {
  //   try {
  //     const UUID: string = uuidv4();
  //     const passwordUser = UUID.split('-')[0];
  //     const newPassword = await this.hashFunc(passwordUser);
  //     await this.getAccountByEmail(email);
  //     const accountDetail = await this.accountModel.findOne({ email });
  //     if (!accountDetail) {
  //       baseExceptions.NotFound(email);
  //     }
  //     await this.accountModel.findOneAndUpdate(
  //       { email },
  //       { password: newPassword, refreshToken: null },
  //     );
  //     this.mailService.sendEmail(email, this.subjectMailForgot, passwordUser);
  //     throw new HttpException(
  //       'Send mail forgot password success',
  //       HttpStatus.OK,
  //     );
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //! getByEmail
  async getAccountByEmail(email: string): Promise<Account> {
    return await this.accountModel.findOne({ email }).exec();
  }
  //! get by email or phone
  async getAccountByEmailorPhone(identifier: string): Promise<Account> {
    return await this.accountModel
      .findOne()
      .or([{ email: identifier }, { phonenumber: identifier }])
      .exec();
  }

  //! check password
  async validateAccount(
    identifier: string,
    password: string,
  ): Promise<Account> {
    const account = await this.accountModel
      .findOne()
      .or([{ email: identifier }, { phonenumber: identifier }])
      .select('+password');
    if (account && (await this.generateFunc(password, account.password))) {
      return account;
    } else {
      throw new HttpException('Password incorect', HttpStatus.BAD_REQUEST);
    }
  }

  //! Check_refreshToken
  async refreshTokenMatchWithAccount(
    email: string,
    refreshToken: string,
  ): Promise<Account> {
    const account = await this.accountModel
      .findOne({ email })
      .select('+refreshToken');
    if (!account) {
      throw new UnauthorizedException();
    }
    await this.generateFunc(refreshToken, account.refreshToken);
    return account;
  }

  // //! hash data
  async hashFunc(data: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data, saltOrRounds);
    return hash;
  }
  //! compare data
  async generateFunc(dataInput: string, dataStore: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(dataInput, dataStore);
    return isMatch;
  }
  //! accessToken
  generateAccessToken(payload: IToken | any) {
    return this.jwtService.sign(payload, {
      secret: `${process.env.accessToken}`,
      // expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });
  }
  //! refreshToken
  generateRefreshToken(payload: IToken) {
    return this.jwtService.sign(payload, {
      secret: `${process.env.refreshToken}`,
      // expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`,
    });
  }
}
