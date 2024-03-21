import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import {exercises} from './exercise-functions2';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';

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
  
  @ViewChild('canvasRepetitions')
  canvasRepetitions!: ElementRef<HTMLCanvasElement>;
  ctxRepetitions!: CanvasRenderingContext2D;

 currentExercise ='Bicep Curl';
 reps!: number;
 state!: number;
 states!:{GOING_UP: number, GOING_DOWN: number}; 
 joints!: number[];
 exerciseFunction: any;
 anglesFunction: any;
 stateWorkout: boolean = false;

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
  
  constructor(private router: ActivatedRoute, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      console.log(params);
      this.currentExercise = params['selectExercise'];
      console.log(this.currentExercise);
    });
  }
  async showLoading(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 3000
    });
    await loading.present();
  }
  
  
  async ngAfterViewInit() {
    
    let stateWorkout = true;
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.ctxRepetitions = this.canvasRepetitions.nativeElement.getContext('2d')!;
    //console.log(this.ctx) 
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    this.video.nativeElement.srcObject = stream;
    await this.video.nativeElement.play();
    console.log(this.ctxRepetitions);

    this.canvasRepetitions.nativeElement.width = this.video.nativeElement.videoWidth;
    this.canvasRepetitions.nativeElement.height = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
    this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;

    this.handleChange(this.currentExercise);
    this.showLoading();
    await tf.ready();
    this.init()
   
  }

  handleChange(exercise: any) {
    console.log('Current exercise: ' + this.currentExercise);
    this.reps = exercises[this.currentExercise]['initial_reps'];
    this.state = exercises[this.currentExercise]['initial_state'];
    this.states = exercises[this.currentExercise]['states'];
    this.joints = exercises[this.currentExercise]['joints'];
    this.exerciseFunction = exercises[this.currentExercise]['exercise_function'];
    this.anglesFunction = exercises[this.currentExercise]['angles_function'];
    

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
  this.ctxRepetitions.clearRect(0, 0, this.canvasRepetitions.nativeElement.width, this.canvasRepetitions.nativeElement.height);
  // Desenhar keypoints, edges e ângulos
  this.ctxRepetitions.font = '50px Arial';
  let widthNumber = this.canvasRepetitions.nativeElement.width / 100;
  this.ctxRepetitions.fillText(Math.trunc(this.reps).toString(), widthNumber, 100);
  //console.log(this.reps);
  
  if (poses && poses[0]) {
    this.ctx.globalAlpha = 1.0
    this.drawAllEdges(poses[0].keypoints, this.EDGES, this.ctx);
    this.drawKeypoints(poses[0].keypoints, this.ctx);

    if (this.exerciseJointsAreVisible(poses[0].keypoints, this.joints) && !(this.stateWorkout)) {
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
  // context.globalAlpha = 2.0;
  //console.log(context)
  for (let i = 0; i < edges.length; i++) {
    if (keypoints[edges[i][0]].score < 0.3 || keypoints[edges[i][1]].score < 0.3) {
      continue;
    }
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
  
  // context.globalAlpha = 1.0;
  
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
    

stopWorkout(){
  if(this.stateWorkout){
    this.stateWorkout = false;
  }
  else{
    this.stateWorkout = true;
  }
  console.log(this.stateWorkout);
  
}
}
  