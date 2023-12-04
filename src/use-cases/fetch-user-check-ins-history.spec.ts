import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInRepository: InMemoryCheckinsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch user check-in History Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckinsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository);
  });

  it("Should be able to fetch check-in history", async () => {
    await checkInRepository.create({
      gym_Id: "gym-01",
      user_Id: "user-01",
    });

    await checkInRepository.create({
      gym_Id: "gym-02",
      user_Id: "user-01",
    });

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_Id: "gym-01" }),
      expect.objectContaining({ gym_Id: "gym-02" }),
    ]);
  });

  it("Should be able to fetch paginated check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_Id: `gym-${i}`,
        user_Id: "user-01",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_Id: "gym-21" }),
      expect.objectContaining({ gym_Id: "gym-22" }),
    ]);
  });
});
