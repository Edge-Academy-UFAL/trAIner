import React, { useEffect, useRef, useState } from "react";	
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

export default function PoseDetection() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadMoveNet = async () => {
            await tf.ready();

            const net = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
                enableTracking: true,
                trackerType: poseDetection.TrackerType.BoundingBox,
            });
        return net;
        }

        const detectPose = async (net: any, video: any) => {
            const poses = await net.estimatePoses(video);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
        }
    }, []); 
}
