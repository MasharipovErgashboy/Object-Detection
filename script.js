let model;
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // TensorFlow.js modelni yuklash
        cocoSsd.load().then(loadedModel => {
            model = loadedModel;
            console.log("Model loaded successfully");
            startWebcam();
        });

        // Web-kamera oqimini boshlash
        async function startWebcam() {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
            const video = document.createElement('video');
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play();
                detectObjects(video);
            };
        }

        // Web-kameradagi video oqimi orqali object detection qilish
        async function detectObjects(video) {
            if (!model) {
                console.log("Model is not loaded yet");
                return;
            }

            const drawFrame = async () => {
                // Tasvirni canvasga chizish
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Ob'ektlarni aniqlash
                const predictions = await model.detect(video);

                // Tasvirdagi ob'ektlarni belgilash
                predictions.forEach(prediction => {
                    ctx.beginPath();
                    ctx.rect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = "red";
                    ctx.fillStyle = "red";
                    ctx.stroke();
                    ctx.fillText(
                        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
                        prediction.bbox[0],
                        prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
                    );
                });

                requestAnimationFrame(drawFrame);
            };

            drawFrame();
        }
