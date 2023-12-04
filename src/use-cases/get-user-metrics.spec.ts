import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInRepository: InMemoryCheckinsRepository;
let sut: GetUserMetricsUseCase;

describe("Get user metrics Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckinsRepository();
    sut = new GetUserMetricsUseCase(checkInRepository);
  });

  it("Should be able to get check-ins count from metrics", async () => {
    await checkInRepository.create({
      gym_Id: "gym-01",
      user_Id: "user-01",
    });

    await checkInRepository.create({
      gym_Id: "gym-02",
      user_Id: "user-01",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-01",
    });

    expect(checkInsCount).toEqual(2);
  });
});
