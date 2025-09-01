import { Test, TestingModule } from '@nestjs/testing';
import { StateController } from './state.controller';
import { StateService } from './state.service';
import { State } from './state.entity';


describe('StateController', () => {
  let controller: StateController;
  let service: StateService;

  const mockState: State = {
    id: 1,
    name: 'Maharashtra',
    countryId: 1,
    country: null,
    cities: [],
  };

  const mockStateService = {
    findAllWithFilters: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        {
          provide: StateService,
          useValue: mockStateService,
        },
      ],
    }).compile();

    controller = module.get<StateController>(StateController);
    service = module.get<StateService>(StateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all states with filters', async () => {
      const mockStates = [mockState];
      jest.spyOn(service, 'findAllWithFilters').mockResolvedValue(mockStates);

      const result = await controller.findAll({});

      expect(result).toEqual({
        success: true,
        data: mockStates,
        message: 'States fetched successfully',
      });
      expect(service.findAllWithFilters).toHaveBeenCalledWith({});
    });

    it('should handle service errors', async () => {
      jest.spyOn(service, 'findAllWithFilters').mockRejectedValue(new Error('Database error'));

      await expect(controller.findAll({})).rejects.toThrow(Error);
    });
  });

  describe('findById', () => {
    it('should return a state by ID', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockState);

      const result = await controller.findById(1);

      expect(result).toEqual({
        success: true,
        data: mockState,
        message: 'State fetched successfully',
      });
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new state', async () => {
      const createStateDto = { name: 'Maharashtra', countryId: 1 };
      jest.spyOn(service, 'create').mockResolvedValue(mockState);

      const result = await controller.create(createStateDto);

      expect(result).toEqual({
        success: true,
        data: mockState,
        message: 'State created successfully',
      });
      expect(service.create).toHaveBeenCalledWith(createStateDto);
    });
  });

  describe('update', () => {
    it('should update a state', async () => {
      const updateStateDto = { name: 'Updated State Name', countryId: 1 };
      jest.spyOn(service, 'update').mockResolvedValue(mockState);

      const result = await controller.update(1, updateStateDto);

      expect(result).toEqual({
        success: true,
        data: mockState,
        message: 'State updated successfully',
      });
      expect(service.update).toHaveBeenCalledWith(1, updateStateDto);
    });
  });

  describe('delete', () => {
    it('should delete a state', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      const result = await controller.delete(1);

      expect(result).toEqual({
        success: true,
        message: 'State deleted successfully',
      });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
}); 