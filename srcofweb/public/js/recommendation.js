const blurHeader = () => {
  const header = document.getElementById('header');
  window.scrollY >= 50 ? header.classList.add('blur-header') : header.classList.remove('blur-header');
};
window.addEventListener('scroll', blurHeader);

document.addEventListener('DOMContentLoaded', function () {
  var menu = document.getElementById('nav-menu');
  var openMenuButton = document.getElementById('nav-toggle');
  var closeMenuButton = document.getElementById('nav-close');

  openMenuButton.addEventListener('click', function () {
      menu.classList.add('show-menu');
  });

  closeMenuButton.addEventListener('click', function () {
      menu.classList.remove('show-menu');
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const questions = [
      { question: "Do you prefer fast-paced gameplay or slower-paced exploration?", options: ["Fast-paced", "Slower-paced", "Neither"] },
      { question: "Are you drawn to competitive challenges or relaxed adventures?", options: ["Competitive", "Relaxed", "Neither"] },
      { question: "Do you enjoy complex narratives or straightforward action?", options: ["Complex narratives", "Straightforward action", "Neither"] },
      { question: "Are you interested in character customization or fixed character stories?", options: ["Character customization", "Fixed character stories", "Neither"] },
      { question: "Do you like exploring open worlds or more linear experiences?", options: ["Open worlds", "Linear experiences", "Neither"] },
      { question: "Are you interested in tactical combat or strategic decision-making?", options: ["Tactical combat", "Strategic decision-making", "Neither"] },
      { question: "Do you prefer real-world sports simulations or fantastical adventures?", options: ["Real-world sports", "Fantastical adventures", "Neither"] },
      { question: "Are you drawn to cooperative multiplayer experiences or solo adventures?", options: ["Cooperative multiplayer", "Solo adventures", "Neither"] },
      { question: "Do you enjoy immersive role-playing experiences or action-packed shootouts?", options: ["Role-playing", "Action-packed shootouts", "Neither"] },
  ];

  let answers = [];

  function displayQuestion(idx) {
      const question = questions[idx];
      const questionnaire = document.getElementById('questionnaire');
      questionnaire.innerHTML = `<p>${question.question}</p>` +
        question.options.map((opt) => 
          `<button data-idx="${idx}" data-answer="${opt}">${opt}</button>`
        ).join('');
  }

  const questionnaire = document.getElementById('questionnaire');
  questionnaire.addEventListener('click', function (event) {
      const button = event.target;
      if (button.tagName === 'BUTTON' && button.dataset.idx) {
          const idx = button.dataset.idx;
          const answer = button.dataset.answer;
          recordAnswer(answer, parseInt(idx, 10));
      }
  });

  function recordAnswer(answer, idx) {
      answers[idx] = answer;
      if (idx + 1 < questions.length) {
          displayQuestion(idx + 1);
      } else {
          generateRecommendation();
          displayDoneButton();
      }
  }

  function generateRecommendation() {
      let genre, imageUrl;
      if (answers[0] === "Fast-paced" || answers[1] === "Competitive" || answers[8] === "Action-packed shootouts") {
          genre = "Shooting";
          imageUrl = "img/shooting.png";
      } else if (answers[6] === "Real-world sports") {
          genre = "Sports";
          imageUrl = "img/sports.png";
      } else if (answers[2] === "Straightforward action" || answers[5] === "Tactical combat") {
          genre = "Action";
          imageUrl = "img/action.png";
      } else if (answers[3] === "Character customization" || answers[4] === "Open worlds" || answers[8] === "Role-playing") {
          genre = "Adventure";
          imageUrl = "img/adventure.png";
      }

      displayRecommendation(genre, imageUrl);
      questionnaire.style.display = 'none';
      displayDoneButton();
  }

  function displayRecommendation(genre, imageUrl) {
      const recommendation = document.getElementById('recommendation');
      recommendation.innerHTML = '';
      recommendation.style.opacity = '0';
      recommendation.style.display = 'flex';
      recommendation.style.flexDirection = 'column';
      recommendation.style.alignItems = 'center';
      recommendation.style.justifyContent = 'center';
      recommendation.style.height = 'auto';
      recommendation.style.marginTop = '150px';

      const title = document.createElement('h2');
      title.textContent = `The gaming genre we recommend for you is ${genre}!`;
      title.style.color = 'white';
      title.style.textShadow = '0px 0px 12px rgba(0, 0, 0, 0.85)';
      title.style.padding = '10px 20px';
      title.style.borderRadius = '5px';
      title.style.backgroundImage = 'linear-gradient(to right, #6e48aa, #9d50bb)';
      title.style.display = 'inline-block';
      title.style.margin = '10px 0';
      recommendation.appendChild(title);

      const gameImage = new Image();
      gameImage.src = imageUrl;
      gameImage.alt = `Cover image for ${genre} genre`;
      gameImage.classList.add('game-image');
      gameImage.style.width = '100%';
      gameImage.style.height = 'auto';
      gameImage.style.objectFit = 'cover';

      gameImage.onload = function() {
          recommendation.appendChild(gameImage);
          displayDoneButton();
          recommendation.style.opacity = '0';
          setTimeout(() => recommendation.style.opacity = '1', 100);
      };

      gameImage.onerror = function() {
          imageUrl = 'img/imagefailure.png';
      };
  }

  function displayDoneButton() {
      const recommendation = document.getElementById('recommendation');
      let doneButton = document.querySelector('#recommendation button.done');

      if (!doneButton) {
          doneButton = document.createElement('button');
          doneButton.textContent = 'Done';
          doneButton.classList.add('done');
          doneButton.style.background = 'hsl(262, 100%, 59%)';
          doneButton.style.border = 'none';
          doneButton.style.borderRadius = '7px';
          doneButton.style.color = '#ffffff';
          doneButton.style.cursor = 'pointer';
          doneButton.style.fontSize = '1.15em';
          doneButton.style.fontWeight = 'bold';
          doneButton.style.padding = '0.75em 0';
          doneButton.style.width = '15%';
          doneButton.style.marginTop = '25px';
          doneButton.style.marginBottom = '25px';
          doneButton.style.transition = 'background-color 0.3s ease';

          doneButton.addEventListener('mouseover', function() {
              doneButton.style.background = 'hsl(273, 72%, 50%)';
          });

          doneButton.addEventListener('mouseout', function() {
              doneButton.style.background = 'hsl(262, 100%, 59%)';
          });

          doneButton.addEventListener('click', function () {
              answers = [];
              document.getElementById('questionnaire').style.display = 'flex';
              document.getElementById('recommendation').innerHTML = '';
              displayQuestion(0);
          });
      }
      recommendation.appendChild(doneButton);
  }

  displayQuestion(0);
});
