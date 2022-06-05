import { SpecificationError } from "@modules/cars/errors/specification.errors";
import { Test } from "@nestjs/testing";
import {
  getSpecificationDTO,
  MockSpecificationsRepository,
  MockSpecificationsRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { FindSpecificationByIdService } from "../find-specification-by-id.service";

describe("FindSpecificationByIdService", () => {
  let findSpecificationByIdService: FindSpecificationByIdService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindSpecificationByIdService,
        MockSpecificationsRepositoryProvider,
      ],
    }).compile();

    findSpecificationByIdService = moduleRef.get<FindSpecificationByIdService>(
      FindSpecificationByIdService,
    );
  });

  it("should be able to find an existing specification", async () => {
    const specification = getSpecificationDTO();

    jest
      .spyOn(MockSpecificationsRepository, "findById")
      .mockResolvedValue(specification);

    const foundSpecification = await findSpecificationByIdService.execute({
      id: specification.id,
    });

    expect(foundSpecification).toHaveProperty("id");
    expect(foundSpecification).toEqual(
      expect.objectContaining({
        name: specification.name,
        description: specification.description,
      }),
    );
  });

  it("should not be able to find an inexistent specification", async () => {
    const specification = getSpecificationDTO();

    jest
      .spyOn(MockSpecificationsRepository, "findById")
      .mockResolvedValue(null);

    await expect(
      findSpecificationByIdService.execute({
        id: specification.id,
      }),
    ).rejects.toThrow(SpecificationError.NotFound);
  });
});
