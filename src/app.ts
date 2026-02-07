import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./lib/auth";

import { tutorRoutes } from "./modules/tutor/tutor.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";
import { studentRoutes } from "./modules/student/student.routes";
import { categoryRouter } from "./modules/category/category.routes";
import { reviewRoutes } from "./modules/reviews/reviews.routes";

// import errorHandler from "./middleware/globalError";
// import { notFound } from "./middleware/notFound";

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: [
      //   "http://localhost:3000",
      process.env.BETTER_AUTH_URL || "http://localhost:5000",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/v1", adminRoutes);

app.use("/tutor", tutorRoutes);

app.use("/student", studentRoutes);

app.use("/booking", bookingRoutes);

app.use("/category", categoryRouter);

app.use("/review", reviewRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// app.use(notFound);

// app.use(errorHandler);

export default app;
