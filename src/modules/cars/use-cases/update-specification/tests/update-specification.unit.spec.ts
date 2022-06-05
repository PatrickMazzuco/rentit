import { SpecificationError } from "@modules/cars/errors/specification.errors";
import { Test } from "@nestjs/testing";
import {
  getSpecificationDTO,
  MockSpecificationsRepository,
  MockSpecificationsRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { UpdateSpecificationService } from "../update-specification.service";

describe("UpdateSpecificationService", () => {
  let updateSpecificationService: UpdateSpecificationService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateSpecificationService,
        MockSpecificationsRepositoryProvider,
      ],
    }).compile();

    updateSpecificationService = moduleRef.get<UpdateSpecificationService>(
      UpdateSpecificationService,
    );
  });

  it("should not be able to update a specification to have a duplicated name", async () => {
    const specification = getSpecificationDTO();

    const updatedSpecificationData = {
      name: "Updated Specification",
      description: "Updated Description",
    };

    jest
      .spyOn(MockSpecificationsRepository, "findById")
      .mockResolvedValue(specification);

    jest
      .spyOn(MockSpecificationsRepository, "findByName")
      .mockResolvedValue(specification);

    await expect(
      updateSpecificationService.execute({
        id: specification.id,
        ...updatedSpecificationData,
      }),
    ).rejects.toThrow(SpecificationError.AlreadyExists);
  });

  it("should be able to update a specification", async () => {
    const specification = getSpecificationDTO();

    const updatedSpecificationData = {
      name: "Updated Specification",
      description: "Updated Description",
    };

    jest
      .spyOn(MockSpecificationsRepository, "findById")
      .mockResolvedValue(specification);

    jest
      .spyOn(MockSpecificationsRepository, "findByName")
      .mockResolvedValue(null);

    await expect(
      updateSpecificationService.execute({
        id: specification.id,
        ...updatedSpecificationData,
      }),
    ).resolves.not.toThrow();
  });

  it("should not be able to update an inexistent specification", async () => {
    const specification = getSpecificationDTO();

    const updatedSpecificationData = {
      name: "Updated Specification",
      description: "Updated Description",
    };

    jest
      .spyOn(MockSpecificationsRepository, "findById")
      .mockResolvedValue(null);

    await expect(
      updateSpecificationService.execute({
        id: specification.id,
        ...updatedSpecificationData,
      }),
    ).rejects.toThrow(SpecificationError.NotFound);
  });
});
