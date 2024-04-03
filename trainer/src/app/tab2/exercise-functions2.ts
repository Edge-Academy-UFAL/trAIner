export const exercises: Record<string, any> = {
  'Bicep Curl': {
    image: 'assets/imgs/bicep-curl.png',
    'states': {
      'GOING_UP': 0,
      'GOING_DOWN': 1,
    },
    'joints': [5, 6, 7, 8, 9, 10, 11, 12],
    'initial_reps': 0.5,
    'initial_state': 0,
    'exercise_function': bicepCurls,
    'angles_function': getAnglesBiceps,
    'initial_instruction': 'Slowly lift the weight up.'
  },
  'Left Bicep Curl': {
    image: 'assets/imgs/left-bicep-curl.png',
    'states': {
      'GOING_UP': 0,
      'GOING_DOWN': 1,
    },
    'joints': [5, 7, 9],
    'initial_reps': 0.5,
    'initial_state': 0,
    'exercise_function': unilateralBicepCurls,
    'angles_function': getAnglesLeftCurl,
    'initial_instruction': 'Slowly lift the weight up.'
  },
  'Right Bicep Curl': {
    image: 'assets/imgs/right-bicep-curl.png',
    'states': {
      'GOING_UP': 0,
      'GOING_DOWN': 1,
    },
    'joints': [6, 8, 10],
    'initial_reps': 0.5,
    'initial_state': 0,
    'exercise_function': unilateralBicepCurls,
    'angles_function': getAnglesRightCurl,
    'initial_instruction': 'Slowly lift the weight up.'
  },
  'Cable Triceps Extension': {
    image: 'assets/imgs/cable-triceps-extension.png',
    'states': {
      'GOING_UP': 0,
      'GOING_DOWN': 1,
    },
    'joints': [5, 6, 7, 8, 9, 10, 11, 12],
    'initial_reps': 0.5,
    'initial_state': 1,
    'exercise_function': tricepExtension,
    'angles_function': getAnglesTriceps,
    'initial_instruction': 'Slowly push the weight down.'
  },
  'Shoulder Press': {
    image: 'assets/imgs/shoulder-press.png',
    'states': {
      'GOING_UP': 0,
      'GOING_DOWN': 1,
    },
    'joints': [5, 6, 7, 8, 9, 10],
    'initial_reps': 0.5,
    'initial_state': 0,
    'exercise_function': shoulderPress,
    'angles_function': getElbowAndShoulderAngles,
    'initial_instruction': 'Slowly push the weight up.'
  },
  'Lateral Raise': {
    image: 'assets/imgs/lateral-raise.png',
    'states': {
      'GOING_UP': 0,
      'GOING_DOWN': 1,
    },
    'joints': [5, 6, 7, 8, 9, 10, 11, 12],
    'initial_reps': 0.5,
    'initial_state': 0,
    'exercise_function': shoulderSideRaise,
    'angles_function': getElbowAndShoulderAngles,
    'initial_instruction': 'Slowly lift the weight up.'
  }
};

function getAngleBetweenPoints(p1: any, p2: any, p3: any) {
  try {
    const angle = Math.acos(((p1.x - p2.x) * (p3.x - p2.x) + (p1.y - p2.y) * (p3.y - p2.y)) / (Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) * Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2))));
    return angle * (180 / Math.PI);
  }
  catch (e) {
    return null;
  }
}

export function getLeftElbowAngle(keypoints: any) {
  const leftShoulder = keypoints[5];
  const leftElbow = keypoints[7];
  const leftWrist = keypoints[9];

  return getAngleBetweenPoints(leftShoulder, leftElbow, leftWrist);
}

export function getRightElbowAngle(keypoints: any) {
  const rightShoulder = keypoints[6];
  const rightElbow = keypoints[8];
  const rightWrist = keypoints[10];

  return getAngleBetweenPoints(rightShoulder, rightElbow, rightWrist);
}

export function getShoulderAngles(keypoints: any) {
  const leftShoulder = keypoints[5];
  const leftElbow = keypoints[7];
  const leftHip = keypoints[11];

  const rightShoulder = keypoints[6];
  const rightElbow = keypoints[8];
  const rightHip = keypoints[12];

  return [getAngleBetweenPoints(leftHip, leftShoulder, leftElbow), getAngleBetweenPoints(rightHip, rightShoulder, rightElbow)];

}

export function getElbowAngles(keypoints: any) {
  const leftShoulder = keypoints[5];
  const leftElbow = keypoints[7];
  const leftWrist = keypoints[9];

  const rightShoulder = keypoints[6];
  const rightElbow = keypoints[8];
  const rightWrist = keypoints[10];

  return [getAngleBetweenPoints(leftShoulder, leftElbow, leftWrist), getAngleBetweenPoints(rightShoulder, rightElbow, rightWrist)];
}

export function getAnglesBiceps(keypoints: any) {
  return getElbowAngles(keypoints).concat(getShoulderAngles(keypoints));
}

export function getAnglesTriceps(keypoints: any) {
  return getElbowAngles(keypoints).concat(getShoulderAngles(keypoints));
}

export function getElbowAndShoulderAngles(keypoints: any) {
  const [leftElbowAngle, rightElbowAngle] = getElbowAngles(keypoints);

  const leftShoulder = keypoints[5];
  const leftElbow = keypoints[7];

  const rightShoulder = keypoints[6];
  const rightElbow = keypoints[8];

  const leftShoulderAngle = getAngleBetweenPoints(leftElbow, leftShoulder, {x: leftShoulder.x, y: leftShoulder.y + 1});
  const rightShoulderAngle = getAngleBetweenPoints(rightElbow, rightShoulder, {x: rightShoulder.x, y: rightShoulder.y + 1});

  return [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle];
}

export function getAnglesLeftCurl(keypoints: any){
  const angles = getElbowAndShoulderAngles(keypoints);
  return [angles[0], angles[2]];
}

export function getAnglesRightCurl(keypoints: any){
  const angles = getElbowAndShoulderAngles(keypoints);
  return [angles[1], angles[3]];
}

export function bicepCurls(reps: any, angles: any, state: any, states: any, instruction: any) {
  const [leftAngle, rightAngle, leftShoulderAngle, rightShoulderAngle] = angles;
  if (leftAngle === null || rightAngle === null || leftShoulderAngle === null || rightShoulderAngle === null) {
    return [reps, state, instruction];
  }
  let correct = true;

  if (leftShoulderAngle > 25 || rightShoulderAngle > 25) {
    instruction = 'Keep your elbows\nclose to your body.'
    correct = false;
  }
  else if (state == states['GOING_UP']) {
    instruction = 'Slowly lift the\nweight up.'
  }
  else if (state == states['GOING_DOWN']) {
    instruction = 'Slowly let the\nweight down.'
  }

  if (!correct) return [reps, state, instruction];

  if (leftAngle < 45 && rightAngle < 45 && state === states['GOING_UP']) {
    state = states['GOING_DOWN'];
    reps += 0.5;
  }
  else if (leftAngle > 120 && rightAngle > 120 && state === states['GOING_DOWN']) {
    state = states['GOING_UP'];
    reps += 0.5;
  }

  return [reps, state, instruction];
}

export function unilateralBicepCurls(reps: any, angles: any, state: any, states: any, instruction: any) {
  const [elbowAngle, shoulderAngle] = angles;

  if (elbowAngle === null || shoulderAngle === null) {
    return [reps, state, instruction];
  }
  let correct = true;

  if (shoulderAngle > 25) {
    instruction = 'Keep your elbow\nclose to your body.';
    correct = false;
  }
  else if (state == states['GOING_UP']) {
    instruction = 'Slowly lift the\nweight up.';
  }
  else if (state == states['GOING_DOWN']) {
    instruction = 'Slowly let the\nweight down.';
  }

  if (!correct) return [reps, state, instruction];

  if (elbowAngle < 45 && state === states['GOING_UP']) {
    state = states['GOING_DOWN'];
    reps += 0.5;
  }
  else if (elbowAngle > 140 && state === states['GOING_DOWN']) {
    state = states['GOING_UP'];
    reps += 0.5;
  }

  return [reps, state, instruction];
}

export function tricepExtension(reps: any, angles: any, state: any, states: any, instruction: any) {
  const [leftAngle, rightAngle, leftShoulderAngle, rightShoulderAngle] = angles;
  if (leftAngle === null || rightAngle === null || leftShoulderAngle === null || rightShoulderAngle === null) {
    return [reps, state, instruction];
  }
  let correct = true;

  if (leftShoulderAngle > 25 || rightShoulderAngle > 25) {
    instruction = 'Keep your elbows\nclose to your body.';
    correct = false;
  }
  else if (state == states['GOING_UP']) {
    instruction = 'Let the\nweight up.';
  }
  else if (state == states['GOING_DOWN']) {
    instruction = 'Push the\nweight down.';
  }

  if (!correct) return [reps, state, instruction];

  if (leftAngle < 45 && rightAngle < 45 && state === states['GOING_UP']) {
    state = states['GOING_DOWN'];
    reps += 0.5;
  }
  else if (leftAngle > 145 && rightAngle > 145 && state === states['GOING_DOWN']) {
    state = states['GOING_UP'];
    reps += 0.5;
  }

  return [reps, state, instruction];
}

export function shoulderPress(reps: any, angle: any, state: any, states: any, instruction: any) {
  const [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle] = angle;
  if (leftElbowAngle === null || rightElbowAngle === null || leftShoulderAngle === null || rightShoulderAngle === null) {
    return [reps, state];
  }
  let correct = true;

  if (leftShoulderAngle < 60 || rightShoulderAngle < 60) {
    instruction = 'Don\'t lower your\narms too much.';
    correct = false;
  }
  else if (leftElbowAngle < 80 || rightElbowAngle < 80) {
    instruction = 'Keep your elbows\nat 90°.';
    correct = false;
  }
  else if (state == states['GOING_UP']) {
    instruction = 'Slowly push the\nweight up.';
  }
  else if (state == states['GOING_DOWN']) {
    instruction = 'Slowly let the\nweight down.';
  }

  if (!correct) return [reps, state, instruction];

  if (leftShoulderAngle > 160 && rightShoulderAngle > 160 && state === states['GOING_UP']) {
    state = states['GOING_DOWN'];
    reps += 0.5;
  }
  else if (leftShoulderAngle < 95 && rightShoulderAngle < 95 && state === states['GOING_DOWN']) {
    state = states['GOING_UP'];
    reps += 0.5;
  }

  return [reps, state, instruction];
}

export function shoulderSideRaise(reps: any, angle: any, state: any, states: any, instruction: any) {
  const [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle] = angle;

  if (leftElbowAngle === null || rightElbowAngle === null || leftShoulderAngle === null || rightShoulderAngle === null) {
    return [reps, state, instruction];
  }

  let correct = true;

  if (leftElbowAngle < 160 || rightElbowAngle < 160) {
    instruction = 'Don\'t flex your\nelbow too much.';
    correct = false;
  }
  else if (state == states['GOING_UP']) {
    instruction = 'Slowly lift the\nweight up.';
  }
  else if (state == states['GOING_DOWN']) {
    instruction = 'Slowly let the\nweight down.';
  }

  if (!correct) return [reps, state, instruction];

  if (leftShoulderAngle > 75 && rightShoulderAngle > 75 && state === states['GOING_UP']) {
    state = states['GOING_DOWN'];
    reps += 0.5;
  }
  else if (leftShoulderAngle < 30 && rightShoulderAngle < 30 && state === states['GOING_DOWN']) {
    state = states['GOING_UP'];
    reps += 0.5;
  }

  return [reps, state, instruction];
}