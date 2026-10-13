import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';


@Injectable()
export class TrimPipe2 implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {

    if (value === undefined || value === null) {
      throw new BadRequestException('Name is required');
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('Value must be a string');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      throw new BadRequestException('Whitespace not allowed');
    }

    return trimmedValue;
  }
}

