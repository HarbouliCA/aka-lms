import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
}

export const getChapter = async ({
    userId,
    courseId,
    chapterId,
}: GetChapterProps) => {
    try {
        // Fetch purchase data
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    courseId,
                    userId,
                },
            },
        });

        // Fetch course data
        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId,
            },
            select: {
                price: true,
            },
        });

        // Fetch chapter data
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            },
        });

        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        // Fetch attachments if the user has purchased or if chapter is free
        if (purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId,
                },
            });
        }

        // If the chapter is free or user has purchased the course, fetch muxData and next chapter
        if (chapter.isFree || purchase) {
            muxData = await db.muxData.findMany({
                where: {
                    chapterId: chapterId,
                },
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position,
                    },
                },
                orderBy: {
                    position: "asc",
                },
            });
        }

        // Fetch user progress for the current chapter
        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                },
            },
        });

        // Fetch total chapters in the course
        const totalChapters = await db.chapter.count({
            where: {
                courseId: courseId,
                isPublished: true,
            },
        });

        // Fetch completed chapters for the user in the course
        const completedChapters = await db.userProgress.count({
            where: {
                userId: userId,
                chapterId: chapterId,
                isCompleted: true, // Only count completed chapters for the user
            },
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
            totalChapters, // Add totalChapters to the return value
            completedChapters, // Add completedChapters to the return value
        };
    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapter: null,
            userProgress: null,
            purchase: null,
            totalChapters: 0, // Default value for totalChapters
            completedChapters: 0, // Default value for completedChapters
        };
    }
};
