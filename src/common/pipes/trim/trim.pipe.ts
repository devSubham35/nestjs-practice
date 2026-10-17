import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
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
