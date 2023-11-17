import { SetMetadata } from '@nestjs/common';
import { roleNames } from 'src/core/constants';

export const ROLES = 'ROLES';
export const Roles = (roles: string[]) => SetMetadata(ROLES, roles);

export const accessRole = {
  accessAdmin: [roleNames.admin],
  accessCustomer: [roleNames.admin, roleNames.customer],
};
