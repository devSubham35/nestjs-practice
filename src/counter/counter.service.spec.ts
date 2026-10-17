import { Test, TestingModule } from '@nestjs/testing';
import { CounterService } from './counter.service';
import { getModelToken } from '@nestjs/mongoose';
import { Counter } from './schemas/counter.schema';

describe('CounterService', () => {
  let service: CounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CounterService,
        { provide: getModelToken(Counter.name), useValue: {} },
      ],
    }).compile();

    service = module.get<CounterService>(CounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
