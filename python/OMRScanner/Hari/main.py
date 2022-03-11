import cv2
# import imutils
import numpy as np
import utils
from datetime import datetime


Answer_Key= {0:1,1:2,2:4,5:6}

image = cv2.imread("python/OMR Scanner/omr.jpeg")
# (omr.jpeg")
contourImage = image.copy()
biggestContourImage = image.copy()

#PREPROCESSING
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(gray, (5,5), 0)
edged = cv2.Canny(blurred, 75, 200)

#FIND ALL CONTOURS
contours, hierarchy = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL,
	cv2.CHAIN_APPROX_SIMPLE)
cv2.drawContours(contourImage, contours, -1, (0,255,0), 10)

#FIND RECTAGLE
rectContours = utils.reactContour(contours)
biggestContour = utils.getCornerPoints(rectContours[0])
cv2.drawContours(biggestContourImage, biggestContour, -1, (0,255,0), 10)

biggestContour = utils.reorder(biggestContour)
pt1 = np.float32(biggestContour)
widthImg = 700
heightImg = 350
pt2 = np.float32([[0,0],[widthImg,0],[0,heightImg],[widthImg, heightImg]])
matrix = cv2.getPerspectiveTransform(pt1,pt2)
imgWrapColored = cv2.warpPerspective(image,matrix,(widthImg,heightImg))

# cv2.imshow('edged', imgWrapColored)
temp=datetime.now()
random_temp=temp.strftime("%d/%m/%Y %H:%M:%S")
print(random_temp)
cv2.imwrite('assets/uploaded_file/image.png',image)
cv2.imwrite('assets/uploaded_file/gray.png',gray)
cv2.imwrite('assets/uploaded_file/blurred.png',blurred)
cv2.imwrite('assets/uploaded_file/edged.png',edged)
# cv2.imshow('edged', imgWrapColored)
# cv2.waitKey(0)
print("Omr Processing Completed")