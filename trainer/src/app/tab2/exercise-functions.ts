import * as ex from './exercise-functions2';

let currentExercise: string;
let reps: number;
let state: number;
let states:{GOING_UP: number, GOING_DOWN: number}; 
let joints: number[];
let exerciseFunction: any;
let anglesFunction: any;



document.getElementById('exercises').addEventListener('change', (e) => {
  currentExercise = e.target.value;

  console.log('Current exercise: ' + currentExercise);

  reps = ex.exercises[currentExercise]['initial_reps'];
  state = ex.exercises[currentExercise]['initial_state'];
  states = ex.exercises[currentExercise]['states'];
  joints = ex.exercises[currentExercise]['joints'];
  exerciseFunction = ex.exercises[currentExercise]['exercise_function'];
  anglesFunction = ex.exercises[currentExercise]['angles_function'];
});

document.addEventListener('DOMContentLoaded', async () => {
  let detector;
  // Carregar o modelo MoveNet
  // Capturar vídeo
  const video = document.getElementById('webcam');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = '20px Arial';
  const EDGES = [
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



  let e = document.getElementById("exercises");
  currentExercise = e.options[e.selectedIndex].text;
  reps = ex.exercises[currentExercise]['initial_reps'];
  state = ex.exercises[currentExercise]['initial_state'];
  states = ex.exercises[currentExercise]['states'];
  joints = ex.exercises[currentExercise]['joints'];
  exerciseFunction = ex.exercises[currentExercise]['exercise_function'];
  anglesFunction = ex.exercises[currentExercise]['angles_function'];

  
  async function init() {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      enableTracking: true,
      trackerType: poseDetection.TrackerType.BoundingBox
    };
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

    detectPose();
  }
  
  // Iniciar detecção de poses
  async function detectPose() {
    const poses = await detector.estimatePoses(video, { flipHorizontal: false });
    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Desenhar keypoints, edges e ângulos
    ctx.fillText(Math.trunc(reps), 10, 50);
    if (poses && poses[0]) {
      drawAllEdges(poses[0].keypoints, EDGES, ctx);
      drawKeypoints(poses[0].keypoints, ctx);

      if (exerciseJointsAreVisible(poses[0].keypoints, joints)) {
        [reps, state] = exerciseFunction(reps, anglesFunction(poses[0].keypoints), state, states);
      }
    }
    else {
      reps = ex.exercises[currentExercise]['initial_reps'];
      state = ex.exercises[currentExercise]['initial_state'];
    }

    requestAnimationFrame(detectPose);
  }

  function drawAllEdges(keypoints, edges, context) {
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
  function drawKeypoints(keypoints, context) {
    for (let i = 0; i < keypoints.length; i++) {
      const { x, y, score } = keypoints[i];
      if (score >= 0.3) {
        context.beginPath();
        context.arc(x, y, 5, 0, 6);
        context.fillStyle = 'red';
        context.fill();
      }
    }
  }

  function exerciseJointsAreVisible(keypoints, joints) {
    for (let i = 0; i < joints.length; i++) {
      if (keypoints[joints[i]].score < 0.3) {
        return false;
      }
    }
    return true;
  }

  init();
});