import { SpecificationError } from "@modules/cars/errors/specification.errors";
import { Test } from "@nestjs/testing";
import {
  getSpecificationDTO,
  MockSpecificationsRepository,
  MockSpecificationsRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { CreateSpecificationService } from "../create-specification.service";

describe("CreateSpecificationService", () => {
  let createSpecificationService: CreateSpecificationService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateSpecificationService,
        MockSpecificationsRepositoryProvider,
      ],
    }).compile();

    createSpecificationService = moduleRef.get<CreateSpecificationService>(
      CreateSpecificationService,
    );
  });

  it("should be able to create a new specification", async () => {
    const specification = getSpecificationDTO();

    jest
      .spyOn(MockSpecificationsRepository, "findByName")
      .mockResolvedValue(null);
    jest
      .spyOn(MockSpecificationsRepository, "create")
      .mockResolvedValue(specification);

    const createdSpecification = await createSpecificationService.execute({
      name: specification.name,
      description: specification.description,
    });

    expect(createdSpecification).toHaveProperty("id");
    expect(createdSpecification).toEqual(
      expect.objectContaining({
        name: specification.name,
        description: specification.description,
      }),
    );
  });

  it("should not be able to create a specification with duplicated name", async () => {
    const specification = getSpecificationDTO();

    jest
      .spyOn(MockSpecificationsRepository, "findByName")
      .mockResolvedValue(specification);

    await expect(
      createSpecificationService.execute({
        name: specification.name,
        description: specification.description,
      }),
    ).rejects.toThrow(SpecificationError.AlreadyExists);
  });
});
