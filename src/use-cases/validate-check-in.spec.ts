import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let checkInRepository: InMemoryCheckinsRepository;
let sut: ValidateCheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckinsRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to validate the check in", async () => {
    const createdcheckIn = await checkInRepository.create({
      gym_Id: "gym-01",
      user_Id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdcheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("Should not be able to validate an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistent-check-in",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInRepository.create({
      gym_Id: "gym-01",
      user_Id: "user-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
