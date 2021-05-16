import React, { useContext } from "react";
import  Skeleton,{ SkeletonTheme } from "react-loading-skeleton";
import { ThemeContext } from "../utils/ThemeContext";

export const VideoSkeleton = ()=>{
    const {theme} = useContext(ThemeContext)
    return <SkeletonTheme color={theme.Skeletoncolor}>
                <Skeleton className="videocard" width={270} height={190}>
                    <Skeleton className="videocard_video" width={230} height={190}></Skeleton>
                    <Skeleton className="videocard_info">
                        <Skeleton circle={true} className='videocard_avatar' width={40} height={40}></Skeleton>
                        <Skeleton className="videocard_text" width={40}></Skeleton>
                        <Skeleton className="videocard_des" width={60}></Skeleton>
                    </Skeleton>
                </Skeleton>
            </SkeletonTheme>
}
export default VideoSkeleton;