import { describe, expect, test, jest, beforeEach, it } from "@jest/globals";
import { sum } from "./math.js";

describe("sum module", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });
});

import { userRole } from "../services/user-info-request.js";
import { db } from "../database/database.js";
import { Context } from "hono"; // Adjust if you use a different Context type

// 1. Mock the exact path where 'db' is imported from
jest.mock("../database/database.js", () => ({
  db: {
    query: {
      users: {
        findMany: jest.fn(),
      },
    },
  },
}));

//Testing test
describe("userRole handler", () => {
  const mockContext = {} as Context;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of users with id and role on success", async () => {
    const mockUsers = [
      { id: "1", role: "admin" },
      { id: "2", role: "user" },
    ];

    (db.query.users.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const result = await userRole(mockContext);

    expect(db.query.users.findMany).toHaveBeenCalledWith({
      columns: {
        id: true,
        role: true,
      },
    });
    expect(result).toEqual(mockUsers);
  });

  it("should handle database errors gracefully and return undefined", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (db.query.users.findMany as jest.Mock).mockRejectedValue(
      new Error("DB Connection Failed"),
    );

    const result = await userRole(mockContext);

    expect(db.query.users.findMany).toHaveBeenCalled();
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });
});
