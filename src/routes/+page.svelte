<script lang="ts">
    import { quizzes } from '$lib/quizData';
  
    let currentIndex = 0;
    let selected: string | null = null;
    let showExplanation = false;
    let score = 0;
    let answeredCount = 0;
    let isFinished = false;
    let wrongQuestions: typeof quizzes = [];
  
    let quiz = quizzes[currentIndex];
    $: quiz = quizzes[currentIndex];
  
    const select = (option: string) => {
      if (selected) return;
      selected = option;
      showExplanation = true;
      answeredCount++;
      if (option === quiz.correctAnswer) {
        score++;
      } else {
        wrongQuestions.push(quiz);
      }
    };
  
    const next = () => {
      selected = null;
      showExplanation = false;
      if (currentIndex + 1 < quizzes.length) {
        currentIndex++;
      } else {
        isFinished = true;
      }
    };
  
    const retryWrong = () => {
      if (wrongQuestions.length === 0) return;
      currentIndex = 0;
      selected = null;
      showExplanation = false;
      score = 0;
      answeredCount = 0;
      isFinished = false;
      // Replace quizzes with wrongQuestions copy
      quizzes.length = 0;
      quizzes.push(...wrongQuestions);
      wrongQuestions = [];
    };
  </script>
  
  <main class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    {#if !isFinished}
      <div class="max-w-xl w-full bg-white shadow-lg rounded-2xl p-6">
        <div class="flex justify-between text-sm text-gray-400 mb-2">
          <span>{quiz.id}</span>
          <span>점수: {score} / {answeredCount}</span>
        </div>
  
        <h1 class="text-xl font-semibold mb-6">{quiz.question}</h1>
  
        <div class="grid gap-3">
          {#each quiz.options as option}
            <button
              on:click={() => select(option)}
              class="px-4 py-2 rounded-xl border text-left transition-all duration-200
                {selected === option
                  ? option === quiz.correctAnswer
                    ? 'bg-green-100 border-green-400'
                    : 'bg-red-100 border-red-400'
                  : 'hover:bg-gray-100 border-gray-300'}"
              disabled={!!selected}
            >
              {option}
            </button>
          {/each}
        </div>
  
        {#if selected}
          <div class="mt-4">
            <p class="text-sm font-medium">
              ✅ 정답: <span class="font-bold">{quiz.correctAnswer}</span>
            </p>
            {#if showExplanation && quiz.explanation}
              <p class="mt-2 text-gray-600 text-sm">💡 {quiz.explanation}</p>
            {/if}
          </div>
  
          <button
            on:click={next}
            class="mt-6 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            다음 문제 ▶
          </button>
        {/if}
      </div>
    {:else}
      <div class="max-w-xl w-full bg-white shadow-lg rounded-2xl p-6 text-center">
        <h2 class="text-2xl font-bold mb-4">퀴즈 완료! 🎉</h2>
        <p class="text-lg mb-2">총 {answeredCount}문제 중 {score}문제 맞췄어요!</p>
        <p class="text-sm text-gray-500 mb-6">정답률: {Math.round((score / answeredCount) * 100)}%</p>
        {#if wrongQuestions.length > 0}
          <button
            on:click={retryWrong}
            class="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition mb-2"
          >
            틀린 문제 다시 풀기 🔁
          </button>
        {/if}
        <button
          on:click={() => location.reload()}
          class="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
        >
          처음부터 다시 하기 🔄
        </button>
      </div>
    {/if}
  </main>
  
  <style>
    button:disabled {
      cursor: default;
      opacity: 0.8;
    }
  </style>
  