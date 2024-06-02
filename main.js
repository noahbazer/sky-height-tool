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
            <p>Use the slider to adjust the size and position of the height line until it looks like the picture above.</p>
            <img src="assets/example.png" alt="Example">
            <p>If the template doesn't match your image, use the buttons to switch between angles.</p>
            <div class="video-container">
                <video class="example-vid" src="./assets/angleblurb.mp4" autoplay loop muted playsinline>
            </div>
        </div>
        <div class="middle-container">
            <div class="tool-wrapper">
                <div class="tool-container">
                <img class="template-image" src="assets/lanterntemplate.png" alt="Example">
                    <img class="upload-image">
                </div>
                <div class="slider-container">
                    <div class="horizontal-line"></div>
                    <input orient="vertical" type="range" min="10" max="500" value="255" class="slider vertical" oninput="updateLinePosition(event);">
                </div>
            </div>
            <div class="tool-controls">
                <div class="zoomslider">
                    <span class="fa-solid fa-minus"></span>
                    <input type="range" min="10" max="500" value="150" class="slider slider-zoom" oninput="resizeUploadImage(event)">
                    <span class="fa-solid fa-plus"></span>
                </div>
                <div class="template-buttons">
                    <button class="button" id="angleA" onclick="handleRadioChange('a')">Angle A</button>
                    <button class="button" id="angleB" onclick="handleRadioChange('b')">Angle B</button>
                </div>
            </div>
            <div class="upload-button">
                <input type="file" id="file-input">
                <button id="upload-button" class="button" onclick="document.getElementById('file-input').click();">Upload File</button>
            </div>
        </div>
        <div class="results">
            <h3>Results</h3>
            <p class="results-text">Your height is <span class="height">-</span> of the natural maximum!</p>
            <strong>What does this mean?</strong>
            <p>Out of the 4000 heights naturally available (without using temporary items or the chibi mask), your height is greater than <span class="height">-</span> of them.</p>
            <h2>Things to consider:</h2>
            <p>1. The tool is driven by data from other users. You can improve it's accuracy by posting your results <br><a class="dislink2" href="https://discord.gg/Qy7V6K2auw">In our discord!</a></p>
            <p>2. This tool is not 100% accurate. It is a rough estimate based on the height of the lanterns.</p>
            <p>3. There is a rumor that each player has a unique height modifier that affects their height. This tool does not (and cannot) account for that.</p>
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
    image: 'assets/step2.png',
    text: `Go to this spot in Aviary Village (Home). You'll find it by the fountain in the village plaza.`,
  },
  {
    title: 'Step 3',
    image: 'assets/step3.png',
    text: 'Cross the bridge and stand in front of the RIGHT lantern.',
  },
  {
    title: 'Step 4',
    image: 'assets/step4.png',
    text: 'Adjust your camera so that seams of the lanterns line up, and then take a screenshot you can use to upload.<br><span class=yellow>Want even more accuracy? Use the <a href="https://sky-children-of-the-light.fandom.com/wiki/Saluting_Captain#Expression" target="_blank">Salute</a> expression!</span>',
  },
];

steps.forEach((step) => {
  const img = new Image();
  img.src = step.image;
});

const goToUploadHandler = () => {
  frame.style.transition = 'opacity 1s';
  frame.style.opacity = 0;
  setTimeout(() => {
    frame.innerHTML = screens.tool;
    frame.style.opacity = 1;
    const horizontalSlider = document.querySelector('.slider-zoom');
    const header = document.querySelector('.header');
    console.log(header);

    console.log('Script started');
    window.addEventListener('scroll', function () {
      if (window.scrollY > 0) {
        console.log('Adding scrolled class');
        header.classList.add('scrolled');
      } else {
        console.log('Removing scrolled class');
        header.classList.remove('scrolled');
      }
    });

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

        function startDragging(event) {
          startX = event.clientX || event.touches[0].clientX;
          startY = event.clientY || event.touches[0].clientY;
          initialOffsetX = uploadImage.offsetLeft;
          initialOffsetY = uploadImage.offsetTop;
          isDragging = true;
        }

        function drag(event) {
          if (!isDragging) return;
          event.preventDefault();
          const dx = (event.clientX || event.touches[0].clientX) - startX;
          const dy = (event.clientY || event.touches[0].clientY) - startY;
          uploadImage.style.left = initialOffsetX + dx + 'px';
          uploadImage.style.top = initialOffsetY + dy + 'px';
        }

        function stopDragging() {
          isDragging = false;
        }

        document.addEventListener(
          'touchmove',
          function (event) {
            if (isDragging) {
              event.preventDefault();
            }
          },
          { passive: false }
        );

        uploadImage.addEventListener('mousedown', startDragging);
        uploadImage.addEventListener('touchstart', startDragging);

        window.addEventListener('mousemove', drag);
        window.addEventListener('touchmove', drag);

        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('touchend', stopDragging);

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
  if (sliderPercentage === 100 || sliderPercentage === 0) {
    const resultsText = document.querySelector('.results-text');
    resultsText.innerHTML = `Your height is <span style="color: #32CD32;">${
      sliderPercentage === 100 ? 'close to max!' : 'close to minimum!'
    }</span>`;
  } else {
    const resultsText = document.querySelector('.results-text');
    resultsText.innerHTML = `Your height is <span class="height">${sliderPercentage.toFixed(
      2
    )}</span> of the natural maximum!`;
  }

  const heightElements = document.querySelectorAll('.height');
  heightElements.forEach((element) => {
    if (sliderPercentage <= 10) {
      element.style.color = '#32CD32'; // Lime green for values 0-10
    } else if (sliderPercentage <= 20) {
      element.style.color = '#9ACD32'; // Yellow green for values 20-30
    } else if (sliderPercentage <= 30) {
      element.style.color = '#FFFF00'; // Yellow for values 10-20
    } else if (sliderPercentage <= 40) {
      element.style.color = '#FFA500'; // Orange for values 30-40
    } else if (sliderPercentage <= 50) {
      element.style.color = '#FF0000'; // Red for values 40-50
    } else if (sliderPercentage <= 60) {
      element.style.color = '#FFA500'; // Orange for values 50-60
    } else if (sliderPercentage <= 70) {
      element.style.color = '#FFFF00'; // Yellow for values 60-70
    } else if (sliderPercentage <= 80) {
      element.style.color = '#9ACD32'; // Yellow green for values 70-80
    } else {
      element.style.color = '#32CD32'; // Lime green for values 90-100
    }
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

const handleRadioChange = (angle) => {
  const templateImage = document.querySelector('.template-image');
  if (angle === 'a') {
    templateImage.src = 'assets/lanterntemplate.png';
  } else {
    templateImage.src = 'assets/lanterntemplateb.png';
  }
};
