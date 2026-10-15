import { Types } from 'mongoose';
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid MongoDB ObjectId');
    }

    return value;
  }
}
