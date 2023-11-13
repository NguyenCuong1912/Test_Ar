import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from '../entities/account.entity';
import { Seeder } from 'nestjs-seeder';

@Injectable()
export class AccountsSeed implements Seeder {
  constructor(
    @InjectModel(Account.name) private readonly user: Model<Account>,
  ) {}

  async seed(): Promise<any> {
    const accountsData = [
      {
        _id: 1,
        email: 'admin@gmail.com',
        fullname: 'Admin',
        password:
          '$2b$10$aXc/rlJnE.Xc.I2S/5jPmuJtxsFpqJTbAOfj16Zjl8bh94VAlfEd.', // Cuong2001
        phonenumber: '0962458202',
        date_of_birth: '2001-01-01T00:00:00.000+00:00',
        role: 1,
        isVerify: true,
      },
      {
        _id: 2,
        email: 'customer@gmail.com',
        fullname: 'Customer',
        password:
          '$2b$10$aXc/rlJnE.Xc.I2S/5jPmuJtxsFpqJTbAOfj16Zjl8bh94VAlfEd.',
        phonenumber: '0962458203',
        date_of_birth: '2001-01-01T00:00:00.000+00:00',
        role: 2,
        isVerify: true,
      },
    ];
    return this.user.insertMany(accountsData);
  }
  async drop(): Promise<any> {
    return this.user.deleteMany({});
  }
}
