import { PutUserDto } from './put';

export interface PatchUserDto extends Partial<PutUserDto> {}
