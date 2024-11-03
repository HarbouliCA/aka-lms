import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";

const ChapterIdPage = async ({
    params,
}: {
    params: { courseId: string; chapterId: string };
}) => {
    const { userId } = auth();

    if (!userId) {
        redirect("/");
    }

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } = await getChapter({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId,
    });

    if (!chapter || !course) {
        return redirect("/")
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd =  !!purchase && !userProgress?.isCompleted;

    return (
        <div>
        {userProgress?.isCompleted && (
            <Banner 
                label="You already completed this chapter."
            />
        )}
        {isLocked && (
            <Banner 
                variant={"warning"}
                label="You need to purchase this course to watch this chapter"
            />
        )}
        <div className="flex flex-col max-w-4xl mx-auto pb-20">
            <VideoPlayer 
                chapterId = {params.chapterId}
                title = {chapter.title}
                courseId = {params.courseId}
                nextChapter = {nextChapter?.id}
                playbackId={muxData?.[0].playbackId!}
                isLocked = {isLocked}
                completeOnEnd = {completeOnEnd}
            />
        </div>
        </div>
    );
};

export default ChapterIdPage;
