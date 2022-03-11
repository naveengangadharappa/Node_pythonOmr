import cv2
import numpy as np

def reactContour(contours):
    rectContours = []
    for i in contours:
        area = cv2.contourArea(i)

        if area>200:
            perimeter = cv2.arcLength(i,True)
            approx = cv2.approxPolyDP(i,0.02*perimeter,True)
            if len(approx)==4:
                rectContours.append(i)
    
    rectContours = sorted(rectContours, key= cv2.contourArea, reverse=True)

    return rectContours


def getCornerPoints(contour):
    perimeter = cv2.arcLength(contour,True)
    approx = cv2.approxPolyDP(contour,0.02*perimeter,True)
    return approx

def reorder(myPoints):
    myPoints = myPoints.reshape((4,2))
    myNewPoints = np.zeros((4,1,2),np.int32)
    
    add = myPoints.sum(1)
    
    myNewPoints[0] = myPoints[np.argmin(add)] # [0,0]
    myNewPoints[3] = myPoints[np.argmax(add)] # [w,h]

    diff = np.diff(myPoints, axis=1)

    myNewPoints[1] = myPoints[np.argmin(diff)] # [w, 0]
    myNewPoints[2] = myPoints[np.argmax(diff)] # [h, 0]

    return myNewPoints

