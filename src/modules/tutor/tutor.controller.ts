import { NextFunction, Request, Response } from "express";
import { tutorService } from "./tutor.service";
import { paginationSortingHelper } from "../../helpers/paginationSortingHelper";

const createTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(403).json({ success: false, message: "forbidden!" });
    }
    const result = await tutorService.createTutor(user?.id as string, req.body);

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
    next(err);
  }
};

// const getAllTutor = async (req: Request, res: Response) => {
//   try {
//     const { search } = req.query;

//     const searchStr = typeof search === "string" ? search : undefined;

//     const expertise = req.query.expertise
//       ? (req.query.expertise as string).split(",")
//       : [];

//     const rating = req.query.averageRating
//       ? Number(req.query.averageRating as string)
//       : undefined;
//     const data = await tutorService.getAllTutor({
//       search: searchStr,
//       expertise,
//       rating,
//     });
//     res.status(200).json({ success: true, data: data });
//   } catch (err: any) {
//     res.status(404).json({ success: false, message: err.message });
//   }
// };

const getAllTutor = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const searchStr = typeof search === "string" ? search : undefined;

    const expertise = req.query.expertise
      ? (req.query.expertise as string).split(",")
      : [];

    const rating = req.query.averageRating
      ? Number(req.query.averageRating)
      : undefined;

    // pagination helper use
    const { pageNumber, limitNumber, skip, sortBy, sortOrder } =
      paginationSortingHelper(req.query);

    const result = await tutorService.getAllTutor({
      search: searchStr,
      expertise,
      rating,
      pageNumber,
      limitNumber,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      meta: {
        pageNumber,
        limitNumber,
        total: result.total,
      },
      data: result.data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getTutorById = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;
    const result = await tutorService.getTutorById(tutorId as string);

    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const tutorController = {
  createTutor,
  getAllTutor,
  getTutorById,
};
