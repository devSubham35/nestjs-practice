
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class UpperCasePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    return value.toUpperCase();
  }
}

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    return value.trim();
  }
}

@Injectable()
export class IsAdult implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const age = Number(value)

    if(Number.isNaN(age)){
        throw new BadRequestException("Age should be a valid number")
    }

    if(age < 18){
        throw new BadRequestException("Age must be 18 or above")
    }

    return value
  }
}
