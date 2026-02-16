type IOptions = {
  pageNumber?: number | string;
  limitNumber?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

type IOptionsResult = {
  pageNumber: number;
  limitNumber: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

export const paginationSortingHelper = (options: IOptions): IOptionsResult => {
  const pageNumber = Number(options.pageNumber) || 1;

  const limitNumber = Number(options.limitNumber) || 10;

  const skip = (pageNumber - 1) * limitNumber;

  const sortBy = options.sortBy || "createdAt";

  const sortOrder =
    options.sortOrder === "asc" || options.sortOrder === "desc"
      ? options.sortOrder
      : "desc";

  return {
    pageNumber,
    limitNumber,
    skip,
    sortBy,
    sortOrder,
  };
};
