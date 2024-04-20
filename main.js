const screens = {
  route: `
    <div class="route">
        <div class="route-card steps-link">
            <h3>Step-By-Step Guide<span class="new-text">new!</span></h3>
            <p>Walks you through the measuring process, step by step.</p>
        </div>
        <div class="route-card skip" onclick="goToUploadHandler()">
            <h3>I know what I'm doing!</h3>
            <p>Takes you straight to the upload. Not recommended for new users.</p>
        </div>
    </div>`,
  steps: `
    <div class="steps">
        <div class="step-frame">
            <img src="assets/step1.png" alt="Step 1" class="step-image">
            <h3 class="step-title">Step 1:</h3>
                <p class="step-text">Go to any closet and choose the default hair and stance.</p>
                <div class="step-buttons">
                    <button class="button step-button-back">Back</button>
                    <button class="button step-button-next">Next</button>
                </div>
        </div>
    </div>
    `,
  tool: `<div class="tool">
    <div class="tool-frame">
        <div class="example">
            <img src="assets/example.png" alt="Example">
            <p>Use the slider to adjust the size and position of the height line until it looks like the picture above.</p>
        </div>
        <div class="middle-container">
            <div class="tool-wrapper">
                <div class="tool-container">
                <img class="template-image" src="assets/lanterntemplate.png" alt="Example">
                    <img class="upload-image">
                </div>
                <div class="slider-container">
                    <div class="horizontal-line"></div>
                    <input type="range" min="10" max="500" value="255" class="slider vertical" oninput="updateLinePosition(event); handleHeightChange(event);">
                </div>
            </div>
            <div class="tool-controls">
                <span class="fa-solid fa-minus"></span>
                <input type="range" min="10" max="500" value="200" class="slider slider-zoom" oninput="resizeUploadImage(event)">
                <span class="fa-solid fa-plus"></span>
            </div>
            <div class="upload-button">
                <input type="file" id="file-input">
                <button id="upload-button" class="button" onclick="document.getElementById('file-input').click();">Upload File</button>
            </div>
        </div>
        <div class="results">
            <h3>Results</h3>
            <p>Your height is <span class="height">-</span> of the natural maximum!</p>
            <p>What does this mean?</p>
            <p>Out of the 4000 heights naturally available (without using temporary items or the chibi mask), your height is greater than <span class="height">-</span> of them.</p>
            <h2>Things to consider:</h2>
            <p>1. This tool is not 100% accurate. It is a rough estimate based on the height of the lanterns.</p>
            <p>2. There is a rumor that each player has a unique height modifier that affects their height. This tool does not (and cannot) account for that.</p>
            <p>3. Using hundreds of potions to get the perfect height is not recommended. It is expensive and time-consuming, and may not be rewarding.</p>
        </div>
    </div>
</div>`,
};

const steps = [
  {
    title: 'Step 1:',
    image: 'assets/step1.png',
    text: 'Go to any closet and choose the default hair and stance.',
  },
  {
    title: 'Step 2',
    image: 'assets/step2.jpg',
    text: `Go to this spot in Aviary Village (Home). You'll find it on the by the fountain in the village plaza.`,
  },
  {
    title: 'Step 3',
    image: 'assets/step3.png',
    text: 'Cross the bridge and stand in front of this lantern.',
  },
  {
    title: 'Step 4',
    image: 'assets/step4.png',
    text: 'Adjust your camera so that seams of the lanterns line up, and then take a screenshot you can use to upload.<br><span class=yellow>Want even more accuracy? Use the <a href="https://sky-children-of-the-light.fandom.com/wiki/Saluting_Captain#Expression" target="_blank">Salute</a> expression!</span>',
  },
];

const goToUploadHandler = () => {
  frame.style.transition = 'opacity 1s';
  frame.style.opacity = 0;
  setTimeout(() => {
    frame.innerHTML = screens.tool;
    frame.style.opacity = 1;
    const horizontalSlider = document.querySelector('.slider-zoom');

    horizontalSlider.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });
    updateLinePosition();

    // Set up file upload and image dragging
    function handleFileUpload(event) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      const uploadImage = document.querySelector('.upload-image');

      if (uploadImage) {
        uploadImage.src = url;

        resizeUploadImage({ target: document.querySelector('.slider-zoom') });

        let isDragging = false;
        let startX, startY, initialOffsetX, initialOffsetY;

        uploadImage.addEventListener('mousedown', (event) => {
          startX = event.clientX;
          startY = event.clientY;
          initialOffsetX = uploadImage.offsetLeft;
          initialOffsetY = uploadImage.offsetTop;
          isDragging = true;
        });

        window.addEventListener('mousemove', (event) => {
          if (!isDragging) return;
          const dx = event.clientX - startX;
          const dy = event.clientY - startY;
          uploadImage.style.left = initialOffsetX + dx + 'px';
          uploadImage.style.top = initialOffsetY + dy + 'px';
        });

        window.addEventListener('mouseup', () => {
          isDragging = false;
        });

        uploadImage.addEventListener('dragstart', (event) => {
          event.preventDefault();
        });
      }
    }

    // Attach the handleFileUpload function to the file input element
    const fileInput = document.querySelector('#file-input');
    if (fileInput) {
      fileInput.addEventListener('change', handleFileUpload);
    }
  }, 1000);
};

let step = 0;

const handleStep = () => {
  const stepImage = document.querySelector('.step-image');
  const stepTitle = document.querySelector('.step-title');
  const stepText = document.querySelector('.step-text');
  stepImage.src = steps[step].image;
  stepTitle.textContent = steps[step].title;
  stepText.innerHTML = steps[step].text;
  if (step === 0) {
    const stepButtonBack = document.querySelector('.step-button-back');
    stepButtonBack.style.display = 'none';
  } else {
    const stepButtonBack = document.querySelector('.step-button-back');
    stepButtonBack.style.display = 'flex';
  }
  if (step === 3) {
    const stepButtonNext = document.querySelector('.step-button-next');
    stepButtonNext.innerHTML =
      'Go to Upload<span class="fa-solid fa-arrow-right upload-step"></span>';
    stepButtonNext.addEventListener('click', goToUploadHandler);
  } else {
    const stepButtonNext = document.querySelector('.step-button-next');
    stepButtonNext.innerHTML = 'Next';
    stepButtonNext.removeEventListener('click', goToUploadHandler);
  }
};

const handleBackButton = () => {
  const stepButtonBack = document.querySelector('.step-button-back');
  stepButtonBack.addEventListener('click', () => {
    if (step === 0) {
      return;
    }
    step -= 1;
    handleStep(step);
  });
};

const handleNextButton = () => {
  const stepButtonNext = document.querySelector('.step-button-next');
  stepButtonNext.addEventListener('click', () => {
    if (step === 3) {
      return;
    }
    step += 1;
    handleStep(step);
  });
};

const beginStepSequence = () => {
  setTimeout(() => {
    handleNextButton();
    handleBackButton();
  }, 500);
};

const startButton = document.querySelector('.button-begin');
const frame = document.querySelector('.frame');

//make the intro screen fade away before the route screen appears
const startButtonHandler = () => {
  const intro = document.querySelector('.intro');
  intro.style.transition = 'opacity 1s';
  intro.style.opacity = 0;
  intro.style.pointerEvents = 'none';
  setTimeout(() => {
    frame.innerHTML = screens.route;
    const stepsButton = document.querySelector('.steps-link');
    const stepsButtonHandler = () => {
      const route = document.querySelector('.route');
      route.style.transition = 'opacity .5s';
      route.style.opacity = 0;
      route.style.pointerEvents = 'none';
      setTimeout(() => {
        frame.innerHTML = screens.steps;
      }, 500);
      beginStepSequence();
    };
    if (stepsButton) {
      stepsButton.addEventListener('click', stepsButtonHandler);
    }
  }, 1000);
};

startButton.addEventListener('click', startButtonHandler);

function updateLinePosition() {
  const verticalSlider = document.querySelector('.slider.vertical');
  const horizontalLine = document.querySelector('.horizontal-line');
  const heightElements = document.querySelectorAll('.height');
  const sliderMin = parseInt(verticalSlider.min);
  const sliderMax = parseInt(verticalSlider.max);
  const sliderValue = parseInt(verticalSlider.value);
  const sliderHeight = verticalSlider.offsetHeight;
  const thumbHeight = 20; // Estimate of the slider thumb height in pixels
  const topPosition =
    ((sliderMax - sliderValue) / (sliderMax - sliderMin)) *
      (sliderHeight - thumbHeight) +
    thumbHeight / 2;
  const sliderPercentage =
    ((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100;

  horizontalLine.style.top = `${topPosition}px`;
  heightElements.forEach((element) => {
    element.textContent = `${sliderPercentage.toFixed(2)}%`;
  });
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const uploadImage = document.querySelector('.upload-image');
  uploadImage.src = url;
}

function resizeUploadImage() {
  const horizontalSlider = document.querySelector('.slider-zoom');
  const size = horizontalSlider.value / 100;
  const uploadImage = document.querySelector('.upload-image');
  uploadImage.style.transform = `scale(${size})`;
}
