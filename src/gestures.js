export default class GestureTracker {
    poses = [];
    canvasWidth = 640;
    canvasHeight = 480;

    constructor() {
        // createCanvas(canvasWidth, canvasHeight);
        // video = createCapture(VIDEO);
        // video.size(width, height);
        this.initCamera(this.canvasWidth, this.canvasHeight, 30);

        // Create a new poseNet method with a single detection
        const poseNet = ml5.poseNet(this.video, this.modelReady);
        // This sets up an event that fills the global variable "poses"
        // with an array every time new poses are detected
        poseNet.on('pose', function(results) {
            this.poses = results;
        });

    }

    async initCamera(width, height, fps) {
        const constraints = {
            audio: false,
            video: {
                facingMode: "user",
                width: width,
                height: height,
                frameRate: { max: fps }
            }
        };

        this.video = document.querySelector("#video");
        this.video.width = width;
        this.video.height = height;

        // get video stream
        const stream = await window.navigator
            .mediaDevices
            .enumerateDevices();
        video.srcObject = stream;

        return new Promise(resolve => {
            video.onloadedmetadata = () => { resolve(video) };
        });
    }

    modelReady() {
        console.log('Model Loaded');
    }

    moveGlobe() {
        for (let i = 0; i < this.poses.length; i++) {
            let pose = this.poses[i].pose;

            const goLeftBoundingBox = {
                x: this.canvasWidth * 0.75,
                y: this.canvasHeight * 0.25,
                w: this.canvasWidth * 0.25,
                h: this.canvasHeight * 0.5,
            };

            // rect(goLeftBoundingBox.x, goLeftBoundingBox.y, goLeftBoundingBox.w, goLeftBoundingBox.h);

            const goRightBoundingBox = {
                x: 0,
                y: this.canvasHeight * 0.25,
                w: this.canvasWidth * 0.25,
                h: this.canvasHeight * 0.5,
            }

            // rect(goRightBoundingBox.x, goRightBoundingBox.y, goRightBoundingBox.w, goRightBoundingBox.h);

            const goUpBoundingBox = {
                x: this.canvasWidth * 0.25,
                y: 0,
                w: this.canvasWidth * 0.5,
                h: this.canvasHeight * 0.25,
            }

            // rect(goUpBoundingBox.x, goUpBoundingBox.y, goUpBoundingBox.w, goUpBoundingBox.h);

            const goDownBoundingBox = {
                x: this.canvasWidth * 0.25,
                y: this.canvasHeight * 0.75,
                w: this.canvasWidth * 0.5,
                h: this.canvasHeight * 0.25,
            }

            // rect(goDownBoundingBox.x, goDownBoundingBox.y, goDownBoundingBox.w, goDownBoundingBox.h);



            if (pose.rightWrist.confidence > 0.5) {
                const rightWristX = pose.rightWrist.x;
                const rightWristY = pose.rightWrist.y;

                // go left
                if (rightWristX > goLeftBoundingBox.x &&
                    rightWristY > goLeftBoundingBox.y &&
                    rightWristY < goLeftBoundingBox.y + goLeftBoundingBox.h
                ) {
                    console.log('go left')
                }

                // go right
                if (rightWristX < goRightBoundingBox.x + goRightBoundingBox.w &&
                    rightWristY > goRightBoundingBox.y &&
                    rightWristY < goRightBoundingBox.y + goRightBoundingBox.h
                ) {
                    console.log('go right')
                }

                //go up
                if (rightWristX > goUpBoundingBox.x &&
                    rightWristX < goUpBoundingBox.x + goUpBoundingBox.w &&
                    rightWristY < goUpBoundingBox.y + goUpBoundingBox.h
                ) {
                    console.log('go up')
                }

                // go down
                if (rightWristX > goDownBoundingBox.x &&
                    rightWristX < goDownBoundingBox.x + goDownBoundingBox.w &&
                    rightWristY > goDownBoundingBox.y
                ) {
                    console.log('go down')
                }


            }
        }
    }
}

