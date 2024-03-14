export const exercises: Record<string, any> = {
    'Bicep Curl': {
      'states': {
        'GOING_UP': 0,
        'GOING_DOWN': 1,
      },
      'joints': [5, 6, 7, 8, 9, 10, 11, 12],
      'initial_reps': 0.5,
      'initial_state': 0,
      'exercise_function': bicepCurls,
      'angles_function': getAnglesBiceps
    },
    'Left Bicep Curl': {
      'states': {
        'GOING_UP': 0,
        'GOING_DOWN': 1,
      },
      'joints': [5, 7, 9],
      'initial_reps': 0.5,
      'initial_state': 0,
      'exercise_function': unilateralBicepCurls,
      'angles_function': getLeftElbowAngle
    },
    'Right Bicep Curl': {
      'states': {
        'GOING_UP': 0,
        'GOING_DOWN': 1,
      },
      'joints': [6, 8, 10],
      'initial_reps': 0.5,
      'initial_state': 0,
      'exercise_function': unilateralBicepCurls,
      'angles_function': getRightElbowAngle
    },
    'Triceps Extension': {
      'states': {
        'GOING_UP': 0,
        'GOING_DOWN': 1,
      },
      'joints': [5, 6, 7, 8, 9, 10, 11, 12],
      'initial_reps': 0.5,
      'initial_state': 1,
      'exercise_function': tricepExtension,
      'angles_function': getAnglesTriceps
    },
    'Shoulder Press': {
      'states': {
        'GOING_UP': 0,
        'GOING_DOWN': 1,
      },
      'joints': [5, 6, 7, 8, 9, 10],
      'initial_reps': 0.5,
      'initial_state': 0,
      'exercise_function': shoulderPress,
      'angles_function': getElbowAndShoulderAngles
    },
    'Shoulder Side Raise': {
      'states': {
        'GOING_UP': 0,
        'GOING_DOWN': 1,
      },
      'joints': [5, 6, 7, 8, 9, 10, 11, 12],
      'initial_reps': 0.5,
      'initial_state': 0,
      'exercise_function': shoulderSideRaise,
      'angles_function': getShoulderAngles
    }
  };
  
  function getAngleBetweenPoints(p1:any, p2:any, p3:any) {
    try {
      const angle = Math.acos(((p1.x - p2.x)*(p3.x - p2.x) + (p1.y - p2.y)*(p3.y - p2.y)) / (Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) * Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2))));
      return angle * (180 / Math.PI);
    }
    catch (e) {
      return null;
    }
  }
  
  export function getLeftElbowAngle(keypoints:any) {
    const leftShoulder = keypoints[5];
    const leftElbow = keypoints[7];
    const leftWrist = keypoints[9];
  
    return getAngleBetweenPoints(leftShoulder, leftElbow, leftWrist);
  }
  
  export function getRightElbowAngle(keypoints:any) {
    const rightShoulder = keypoints[6];
    const rightElbow = keypoints[8];
    const rightWrist = keypoints[10];
  
    return getAngleBetweenPoints(rightShoulder, rightElbow, rightWrist);
  }
  
  export function getShoulderAngles(keypoints:any) {
    const leftShoulder = keypoints[5];
    const leftElbow = keypoints[7];
    const leftHip = keypoints[11];
  
    const rightShoulder = keypoints[6];
    const rightElbow = keypoints[8];
    const rightHip = keypoints[12];
  
    return [getAngleBetweenPoints(leftHip, leftShoulder, leftElbow), getAngleBetweenPoints(rightHip, rightShoulder, rightElbow)];
  
  }
  
  export function getElbowAngles(keypoints:any) {
    const leftShoulder = keypoints[5];
    const leftElbow = keypoints[7];
    const leftWrist = keypoints[9];
  
    const rightShoulder = keypoints[6];
    const rightElbow = keypoints[8];
    const rightWrist = keypoints[10];
  
    return [getAngleBetweenPoints(leftShoulder, leftElbow, leftWrist), getAngleBetweenPoints(rightShoulder, rightElbow, rightWrist)];
  }
  
  // refatorar | unificar as duas funções abaixo
  
  export function getAnglesBiceps(keypoints:any) {
    return getElbowAngles(keypoints).concat(getShoulderAngles(keypoints));
  }
  
  export function getAnglesTriceps(keypoints:any) {
    return getElbowAngles(keypoints).concat(getShoulderAngles(keypoints));
  }
  
  export function getElbowAndShoulderAngles(keypoints:any) {
    const [leftElbowAngle, rightElbowAngle] = getElbowAngles(keypoints);
  
    const leftShoulder = keypoints[5];
    const leftElbow = keypoints[7];
    const leftWrist = keypoints[9];
  
    const rightShoulder = keypoints[6];
    const rightElbow = keypoints[8];
    const rightWrist = keypoints[10];
  
    const leftShoulderAngle = getAngleBetweenPoints(leftElbow, leftShoulder, rightShoulder);
    const rightShoulderAngle = getAngleBetweenPoints(rightElbow, rightShoulder, leftShoulder);
  
    return [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle];
  }
  
  export function bicepCurls(reps:any, angles:any, state:any, states:any) {
    const [leftAngle, rightAngle, leftShoulderAngle, rightShoulderAngle] = angles;
    if (leftAngle === null || rightAngle === null || leftShoulderAngle === null || rightShoulderAngle === null) {
      return [reps, state];
    }
  
    if (leftAngle < 45 && rightAngle < 45  && leftShoulderAngle < 40 && rightShoulderAngle < 40 && state === states['GOING_UP']) {
      state = states['GOING_DOWN'];
      reps += 0.5;
    }
    else if (leftAngle > 120 && rightAngle > 120 && leftShoulderAngle < 40 && rightShoulderAngle < 40 && state === states['GOING_DOWN']) {
      state = states['GOING_UP'];
      reps += 0.5;
    }
  
    return [reps, state];
  }
  
  export function unilateralBicepCurls(reps:any, angle:any, state:any, states:any) {
    if (angle === null) {
      return [reps, state];
    }
  
    if (angle < 45 && state === states['GOING_UP']) {
      state = states['GOING_DOWN'];
      reps += 0.5;
    }
    else if (angle > 140 && state === states['GOING_DOWN']) {
      state = states['GOING_UP'];
      reps += 0.5;
    }
  
    return [reps, state];
  }
  
  export function tricepExtension(reps:any, angles:any, state:any, states:any) {
    const [leftAngle, rightAngle, leftShoulderAngle, rightShoulderAngle] = angles;
    if (leftAngle === null || rightAngle === null || leftShoulderAngle === null || rightShoulderAngle === null) {
      return [reps, state];
    }
  
    if (leftAngle < 45 && rightAngle < 45  && leftShoulderAngle < 20 && rightShoulderAngle < 20 && state === states['GOING_UP']) {
      state = states['GOING_DOWN'];
      reps += 0.5;
    }
    else if (leftAngle > 145 && rightAngle > 145 && leftShoulderAngle < 20 && rightShoulderAngle < 20 && state === states['GOING_DOWN']) {
      state = states['GOING_UP'];
      reps += 0.5;
    }
  
    return [reps, state];
  }
  
  export function unilateralTricepExtension(reps:any, angle:any, state:any, states:any) {
    console.log(angle);
    if (angle === null) {
      return [reps, state];
    }
  
    if (angle < 45 && state === states['GOING_UP']) {
      state = states['GOING_DOWN'];
      reps += 0.5;
    }
    else if (angle > 140 && state === states['GOING_DOWN']) {
      state = states['GOING_UP'];
      reps += 0.5;
    }
  
    return [reps, state];
  }
  
  export function shoulderPress(reps:any, angle:any, state:any, states:any) {
    const [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle] = angle;
    if (leftElbowAngle === null || rightElbowAngle === null || leftShoulderAngle === null || rightShoulderAngle === null) {
      return [reps, state];
    }
  
    if (leftShoulderAngle < 145 && rightShoulderAngle < 145 && leftElbowAngle > 140 && rightElbowAngle > 140 && state === states['GOING_UP']) {
      state = states['GOING_DOWN'];
      reps += 0.5;
    }
    else if (leftShoulderAngle > 160 && rightShoulderAngle > 160 && leftElbowAngle < 110 && rightElbowAngle < 110 && state === states['GOING_DOWN']) {
      state = states['GOING_UP'];
      reps += 0.5;
    }
  
    return [reps, state];
  }
  
  export function shoulderSideRaise(reps:any, angle:any, state:any, states:any) {
    const [leftShoulderAngle, rightShoulderAngle] = angle;
  
    console.log(angle)
    if (leftShoulderAngle === null || rightShoulderAngle === null) {
      return [reps, state];
    }
  
    if (leftShoulderAngle >= 85 && rightShoulderAngle >= 85 && state === states['GOING_UP']) {
      state = states['GOING_DOWN'];
      reps += 0.5;
    }
    else if (leftShoulderAngle < 20 && rightShoulderAngle < 20 && state === states['GOING_DOWN']) {
      state = states['GOING_UP'];
      reps += 0.5;
    }
  
    return [reps, state];
  }