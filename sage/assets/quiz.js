// Shared recall-quiz widget for STOR 323 ML pipeline lessons.
// Usage: <div class="quiz" data-answer="answer1|answer2">
//          <div class="q">Question text</div>
//          <input type="text"><button onclick="checkQuiz(this)">Check</button>
//          <button class="reveal-btn" onclick="revealQuiz(this)">Show answer</button>
//          <div class="feedback"></div>
//        </div>
function normalize(s) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function checkQuiz(btn) {
  const quiz = btn.closest(".quiz");
  const input = quiz.querySelector("input");
  const feedback = quiz.querySelector(".feedback");
  const accepted = quiz.dataset.answer.split("|").map(normalize);
  const given = normalize(input.value);

  if (accepted.includes(given)) {
    feedback.textContent = "Correct.";
    feedback.className = "feedback correct";
  } else {
    feedback.textContent = "Not quite — try again, or reveal the answer.";
    feedback.className = "feedback incorrect";
  }
}

function revealQuiz(btn) {
  const quiz = btn.closest(".quiz");
  const feedback = quiz.querySelector(".feedback");
  const accepted = quiz.dataset.answer.split("|")[0];
  feedback.textContent = "Answer: " + accepted;
  feedback.className = "feedback";
}
