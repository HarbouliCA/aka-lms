"use client"

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string; // Ensure this is passed
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
};

export const VideoPlayer = ({
    playbackId,
    courseId,
    chapterId,
    nextChapterId,
    isLocked,
    completeOnEnd,
    title,
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const onEnd = async () => {
        console.log("Video ended"); // Ensure this is logging when the video finishes
        console.log("Next chapter ID:", nextChapterId); // Log the nextChapterId to check its value

        try {
            if (completeOnEnd) {
                // Update the progress for the current chapter
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: true,
                });
                
                toast.success("Progress updated");
                

                // Trigger confetti if there is no next chapter
                if (!nextChapterId) {
                    
                    console.log("No next chapter, triggering confetti");
                    router.refresh();
                    confetti.onOpen();
                } else {
                    // Ensure nextChapterId exists and redirect to the next chapter
                    console.log("Redirecting to next chapter:", nextChapterId); // Check if nextChapterId is correct
                    if (nextChapterId) {
                        await router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
                        router.refresh();
                        console.log("Redirect successful to next chapter.");
                    }
                }
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">This Chapter is Locked</p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                    autoPlay
                    title={title}
                    className={cn(!isReady && "hidden")}
                    onCanPlay={() => setIsReady(true)}
                    onEnded={onEnd} // Ensure onEnd is properly bound
                    playbackId={playbackId}
                />
            )}
        </div>
    );
};
