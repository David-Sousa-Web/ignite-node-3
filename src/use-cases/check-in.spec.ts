import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberofCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInRepository: InMemoryCheckinsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Register Use Case", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckinsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "javaScript Gym",
      description: "",
      phone: "",
      latitude: -27.2892052,
      longitude: -49.6481891,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.2892052,
      userLogintude: -49.6481891,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  //red, green, refactory vindo do TDD -> Test Driven Development
  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 9, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-id",
      userLatitude: -27.2892052,
      userLogintude: -49.6481891,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-id",
        userLatitude: -27.2892052,
        userLogintude: -49.6481891,
      })
    ).rejects.toBeInstanceOf(MaxNumberofCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 9, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-id",
      userLatitude: -27.2892052,
      userLogintude: -49.6481891,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 9, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-id",
      userLatitude: -27.2892052,
      userLogintude: -49.6481891,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "javaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-27.8747279),
      longitude: new Decimal(-49.4889672),
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -27.2892052,
        userLogintude: -49.6481891,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
