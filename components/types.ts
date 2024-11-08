import { Course, Category, Chapter } from "@prisma/client";

export type CourseWithProgressWithCategory = Omit<Course, "categoryId"> & {
    categoryId: string | null;
    category: Category | null;
    chapters: Chapter[];
    progress?: number | null;
  };
