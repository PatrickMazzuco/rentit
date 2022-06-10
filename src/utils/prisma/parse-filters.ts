export type PrismaWhereFilter = Record<
  string,
  {
    contains: string;
    mode?: "insensitive" | "sensitive";
  }
>;

export const parsePrismaFilters = (filters: unknown): PrismaWhereFilter => {
  return Object.entries(filters).reduce((acc, filter) => {
    const [field, value] = filter;
    if (value && typeof value === "string") {
      acc[field] = {
        contains: value,
        mode: "insensitive",
      };
    }
    return acc;
  }, {});
};
