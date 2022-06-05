import { Test } from "@nestjs/testing";
import { uuidV4 } from "@utils/misc/uuid";
import {
  getSpecificationDTO,
  MockSpecificationsRepository,
  MockSpecificationsRepositoryProvider,
} from "@utils/tests/mocks/cars";

import { DeleteSpecificationService } from "../delete-specification.service";

describe("DeleteSpecificationService", () => {
  let deleteSpecificationService: DeleteSpecificationService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteSpecificationService,
        MockSpecificationsRepositoryProvider,
      ],
    }).compile();

    deleteSpecificationService = moduleRef.get<DeleteSpecificationService>(
      DeleteSpecificationService,
    );
  });

  it("should be able to delete an existing specification", async () => {
    const specification = getSpecificationDTO();

    jest
      .spyOn(MockSpecificationsRepository, "findById")
      .mockResolvedValue(specification);

    await expect(
      deleteSpecificationService.execute({
        id: specification.id,
      }),
    ).resolves.not.toThrow();
  });

  it("should not return error when deleting an inexistent specification", async () => {
    jest
      .spyOn(MockSpecificationsRepository, "findById")
      .mockResolvedValue(null);

    await expect(
      deleteSpecificationService.execute({
        id: uuidV4(),
      }),
    ).resolves.not.toThrow();
  });
});
