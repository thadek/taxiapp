import { User } from './user.type';
export type Driver = User & { licenseId: string; rating: string; isAvailable: boolean }