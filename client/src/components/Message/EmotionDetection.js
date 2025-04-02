import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const EmotionDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("");

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Error accessing webcam: ", err));
  };

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    detectEmotions();
  };
  alert('calling')

  const detectEmotions = () => {
    setInterval(async () => {
      if (videoRef.current) {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        
        if (detections.length > 0) {
          const emotions = detections[0].expressions;
          const maxEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
          setEmotion(maxEmotion);
        }

        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }
      }
    }, 500);
  };

  return (
    <div>
      <h2>Emotion Detection</h2>
      <video ref={videoRef} autoPlay muted width="600" height="400" />
      <canvas ref={canvasRef} width="600" height="400" style={{ position: "absolute" }} />
      <h3>Detected Emotion: {emotion}</h3>
    </div>
  );
};

export default EmotionDetection;
