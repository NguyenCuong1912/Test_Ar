import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import {
  ModelDefinition,
  MongooseModule,
  getConnectionToken,
} from '@nestjs/mongoose';
import { Account, AccountSchema } from './entities/account.entity';
import mongoose from 'mongoose';
import { EmailExistsMiddleware } from 'src/middlewares/checkEmail';
import routes from 'src/routes/index.route';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Account.name,
        inject: [getConnectionToken()],
        useFactory: (
          connection: mongoose.Connection,
        ): ModelDefinition['schema'] => {
          const schema = AccountSchema;
          return schema;
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountModule],
})
export class AccountModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EmailExistsMiddleware)
      .forRoutes({ path: `${routes.account}`, method: RequestMethod.POST });
  }
}
