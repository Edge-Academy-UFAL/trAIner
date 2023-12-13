import cv2
from mediapipe import solutions
import mediapipe as mp
from mediapipe.framework.formats import landmark_pb2
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np

def draw_landmarks_on_image(rgb_image, detection_result):
    pose_landmarks_list = detection_result.pose_landmarks
    annotated_image = np.copy(rgb_image)

    # Loop through the detected poses to visualize.
    for pose_landmarks in pose_landmarks_list:
    # Draw the pose landmarks.
        pose_landmarks_proto = landmark_pb2.NormalizedLandmarkList()
        pose_landmarks_proto.landmark.extend([
            landmark_pb2.NormalizedLandmark(x=landmark.x, y=landmark.y, z=landmark.z) for landmark in pose_landmarks
        ])

        solutions.drawing_utils.draw_landmarks(
            annotated_image,
            pose_landmarks_proto,
            solutions.pose.POSE_CONNECTIONS,
            solutions.drawing_styles.get_default_pose_landmarks_style())
    
    return annotated_image

if __name__ == '__main__':
    cap = cv2.VideoCapture('./media/bicepcurl.mp4')

    base_options = python.BaseOptions(model_asset_path="./model/pose_landmarker.task")
    options = vision.PoseLandmarkerOptions(
        base_options=base_options,
        output_segmentation_masks=True,
        running_mode=mp.tasks.vision.RunningMode.VIDEO)
    detector = vision.PoseLandmarker.create_from_options(options)

    fps = cap.get(cv2.CAP_PROP_FPS)

    while True:
        ret, img = cap.read()
        
        if not ret:
            print('stream end, exiting')
            break

        img = cv2.resize(img, (1280, 720))
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img)

        detection_result = detector.detect_for_video(mp_image, int(cap.get(cv2.CAP_PROP_POS_MSEC)))
        annotated_image = draw_landmarks_on_image(mp_image.numpy_view(), detection_result)

        cv2.putText(annotated_image, str(int(fps)), (50, 100), cv2.FONT_HERSHEY_PLAIN, 5, (255, 255, 255), 5)
        cv2.imshow('TrAIner', annotated_image)

        key_code = cv2.waitKey(1)
        if key_code & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()