import Mux from "@mux/mux-node"
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const muxClient = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
  });
  
  const videoService = muxClient.video;

  export async function DELETE (
    req: Request,
    {params}: {params : {courseId : string}}

  ) {
    try{
        const {userId} = auth()

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const course = await db.course.findUnique({
            where : {
               id: params.courseId,
               userId: userId 
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });
        if (!course) {
            return new NextResponse("Not found",{status:404})
        }

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
              try {
                await videoService.assets.delete(chapter.muxData.assetId);
              } catch (error) {
                if ((error as { status?: number }).status === 404) {
                  console.log(`Mux asset with ID ${chapter.muxData.assetId} not found, skipping deletion.`);
                } else {
                  throw error;
                }
              }
            }
          }

        const detedCourse = await db.course.delete({
            where:{
                id: params.courseId,
            },
        });

        return NextResponse.json(detedCourse);

    } catch (error){
        console.log(" [COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
  }

export async function PATCH(
    req: Request,
    {params}: {params : {courseId : string}}
){
    try {
        const {userId} = auth();
        const {courseId} = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }


        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse('Internal Error', {status: 500});
    }
}