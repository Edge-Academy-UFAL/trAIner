import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-wasm';
import {exercises} from './exercise-functions2';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements AfterViewInit {
  detector: any;
  @ViewChild('video')
  video!: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

 currentExercise ='Bicep Curl';
 reps!: number;
 state!: number;
 states!:{GOING_UP: number, GOING_DOWN: number}; 
 joints!: number[];
 exerciseFunction: any;
 anglesFunction: any;

  EDGES = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 4],
    [0, 5],
    [0, 6],
    [5, 7],
    [7, 9],
    [6, 8],
    [8, 10],
    [5, 6],
    [5, 11],
    [6, 12],
    [11, 12],
    [11, 13],
    [13, 15],
    [12, 14],
    [14, 16]
  ];
  listExercises: string[] = [
    'Triceps Extension',
    'Bicep Curl',
    "Left Bicep Curl",
    "Right Bicep Curl",
    "Shoulder Press",
    "Shoulder Side Raise"];



  
  async ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;  
    this.ctx.font = '20px Arial';
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    this.video.nativeElement.srcObject = stream;
    await this.video.nativeElement.play();
    this.handleChange({detail: {value: 'Bicep Curl'}})
    tf.ready();
    this.init()
   
  }

  handleChange(e: any) {
    this.currentExercise = e.detail.value;
    console.log('Current exercise: ' + this.currentExercise);
    this.reps = exercises[this.currentExercise]['initial_reps'];
    this.state = exercises[this.currentExercise]['initial_state'];
    this.states = exercises[this.currentExercise]['states'];
    this.joints = exercises[this.currentExercise]['joints'];
    this.exerciseFunction = exercises[this.currentExercise]['exercise_function'];
    this.anglesFunction = exercises[this.currentExercise]['angles_function'];
    
    console.log('Reps: ' + this.reps);
    console.log('State: ' + this.state);
    console.log('States: ' + this.states);
    console.log('Joints: ' + this.joints);
    console.log('Exercise function: ' + this.exerciseFunction);
    console.log('Angles function: ' + this.anglesFunction);

  }
  async init() {
    await tf.ready();
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      enableTracking: true,
      trackerType: poseDetection.TrackerType.BoundingBox
    };
    this.detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

    await this.detectPose();
  }

  // Iniciar detecção de poses
async detectPose() {
  
  const poses = await this.detector.estimatePoses(this.video.nativeElement, { flipHorizontal: false });
  // Limpar o canvas
  this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  // Desenhar keypoints, edges e ângulos
  this.ctx.fillText(Math.trunc(this.reps).toString(), 10, 50);
  if (poses && poses[0]) {
    this.drawAllEdges(poses[0].keypoints, this.EDGES, this.ctx);
    this.drawKeypoints(poses[0].keypoints, this.ctx);

    if (this.exerciseJointsAreVisible(poses[0].keypoints, this.joints)) {
      [this.reps, this.state] = this.exerciseFunction(this.reps, this.anglesFunction(poses[0].keypoints), this.state, this.states);
    }
  }
  else {
    this.reps = exercises[this.currentExercise]['initial_reps'];
    this.state = exercises[this.currentExercise]['initial_state'];
  }

  requestAnimationFrame(this.detectPose.bind(this));
}

drawAllEdges(keypoints:any, edges: number[][], context: CanvasRenderingContext2D) {
  
  for (let i = 0; i < edges.length; i++) {
    if (keypoints[edges[i][0]].score < 0.3 || keypoints[edges[i][1]].score < 0.3) {
      continue;
    }
    console.log("entrou")
    const edge = edges[i];
    const p1 = keypoints[edge[0]];
    const p2 = keypoints[edge[1]];
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.strokeStyle = 'white';
    context.stroke();
  }
}

// Função para desenhar keypoints no canvas
drawKeypoints(keypoints:any, context: CanvasRenderingContext2D) {
  console.log("entrou")
  for (let i = 0; i < keypoints.length; i++) {
    const { x, y, score } = keypoints[i];
    if (score >= 0.3) {
      
      context.beginPath();
      context.arc(x, y, 5, 0, 6);
      context.fillStyle = 'red';
      context.fill();
      context.stroke();
    }
  }
}

exerciseJointsAreVisible(keypoints: any, joints: any) {	
  for (let i = 0; i < joints.length; i++) {
    if (keypoints[joints[i]].score < 0.3) {
      return false;
    }
  }
  return true;
}
    

  
  

// let e = document.getElementById("exercises");
// currentExercise = e.options[e.selectedIndex].text;
// reps = ex.exercises[currentExercise]['initial_reps'];
// state = ex.exercises[currentExercise]['initial_state'];
// states = ex.exercises[currentExercise]['states'];
// joints = ex.exercises[currentExercise]['joints'];
// exerciseFunction = ex.exercises[currentExercise]['exercise_function'];
// anglesFunction = ex.exercises[currentExercise]['angles_function'];


// async function init() {
//   const detectorConfig = {
//     modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
//     enableTracking: true,
//     trackerType: poseDetection.TrackerType.BoundingBox
//   };
//   detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

//   detectPose();
// }





// Função para desenhar keypoints no canvas
// function drawKeypoints(keypoints, context) {
//   for (let i = 0; i < keypoints.length; i++) {
//     const { x, y, score } = keypoints[i];
//     if (score >= 0.3) {
//       context.beginPath();
//       context.arc(x, y, 5, 0, 6);
//       context.fillStyle = 'red';
//       context.fill();
//     }
//   }
// }

// function exerciseJointsAreVisible(keypoints, joints) {
//   for (let i = 0; i < joints.length; i++) {
//     if (keypoints[joints[i]].score < 0.3) {
//       return false;
//     }
//   }
//   return true;
// }
    

  

}
  