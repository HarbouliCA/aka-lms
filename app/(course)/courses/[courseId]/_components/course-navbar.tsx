import { NavbarRoutes } from "@/components/navbar-routes";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface ChapterWithProgress extends Chapter {
  userProgress: UserProgress[] | null;
}

interface CourseWithChapters extends Course {
  chapters: ChapterWithProgress[];
}

interface CourseNavbarProps {
  course: CourseWithChapters;
  progressCount: number;
}

export const CourseNavbar = ({
  course,
  progressCount,
}: CourseNavbarProps) => {
  return (
    <div className="p- border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar 
        course={course}
        progressCount={progressCount}
      />
      <NavbarRoutes />
    </div>
  );
};
