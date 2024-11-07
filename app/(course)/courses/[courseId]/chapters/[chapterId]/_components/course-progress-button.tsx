"use client"

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    isCompleted?: boolean;
    nextChapterId?: string;
    totalChapters: number;  // Total number of chapters in the course
    completedChapters: number;  // Completed chapters count
};

export const CourseProgressButton = ({
    chapterId,
    courseId,
    isCompleted,
    nextChapterId,
    totalChapters,
    completedChapters,
}: CourseProgressButtonProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsloading] = useState(false);

    const onClick = async () => {
        try {
            setIsloading(true);

            // Update progress for this chapter
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted,
            });

            // Trigger confetti if all chapters are completed
            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }

            // If there is a next chapter, navigate to it
            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast.success("Progress updated");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsloading(false);
        }
    };

    const Icon = isCompleted ? XCircle : CheckCircle;

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            type="button"
            variant={isCompleted ? "outline" : "success"}
            className="w-full md:w-auto"
        >
            <Icon className="mr-2" />
            {isCompleted ? "Not completed" : "Mark as complete"}
        </Button>
    );
};
