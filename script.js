
// FETCH LESSONS LIST
const lessionLoad = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => playLesson(data.data));
};

// PRONOUNCE WORD
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// REMOVE ACTIVE CLASS
const removeActiveClass = () => {
  const lessonBtns = document.querySelectorAll(".lesson-btn-colour-remove");
  lessonBtns.forEach((btn) => {
    btn.classList.remove("btn-active");
  });
};

// FETCH LESSON WORDS
const wordLesson = (id) => {
  fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const lessonBtn = document.getElementById(`lesson-btn-${id}`);
      if (lessonBtn) {
        lessonBtn.classList.add("btn-active");
      }
      showLesson(data.data);
    });
};

// showModalWordInfo data fetch
const showModalWordInfo = async (id) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/word/${id}`
  );
  const data = await res.json();
  openModal(data.data);
};

// open modal
const openModal = (wordData) => {
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `
  <div  class="w-full max-w-sm ">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-end gap-2">
        <h2 class="text-4xl font-bold text-gray-900">
          ${wordData.word ? wordData.word : "No Word Available"}
        </h2>
        <p class="text-lg text-gray-500">(
          ${wordData.pronunciation ? wordData.pronunciation : "No Pronunciation Available"}
        )</p>
      </div>
    </div>

    <div class="mb-4">
      <h3 class="mb-2 text-lg font-bold text-gray-900">Meaning</h3>
      <p class="text-gray-700">
        ${wordData.meaning ? wordData.meaning : "No Meaning Available"}
      </p>
    </div>

    <div class="mb-4">
      <h3 class="mb-2 text-lg font-bold text-gray-900">Example</h3>
      <p class="text-gray-700">
        ${wordData.sentence ? wordData.sentence : "No Example Available"}
      </p>
    </div>

    <div class="mb-6">
      <h3 class="mb-2 text-lg font-bold text-gray-900">সমার্থক শব্দ গুলো</h3>
      <div class="flex flex-wrap gap-2">
        <span class="rounded-full bg-gray-200 px-4 py-1 text-sm text-gray-800">
          ${wordData.synonyms[0] ? wordData.synonyms[0] : "No Synonym Available"}
        </span>
        <span class="rounded-full bg-gray-200 px-4 py-1 text-sm text-gray-800">
          ${wordData.synonyms[1] ? wordData.synonyms[1] : "No Synonym Available"}
        </span>
        <span class="rounded-full bg-gray-200 px-4 py-1 text-sm text-gray-800">
          ${wordData.synonyms[2] ? wordData.synonyms[2] : "No Synonym Available"}
        </span>
      </div>
    </div>

    <div class="modal-action">
      <button class="rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-violet-700">
        Complete Learning
      </button>
      <button class="btn" onclick="document.getElementById('my_modal_5').close()">Close</button>
    </div>
  </div>`;
  document.getElementById("my_modal_5").showModal();
};

const spnnerToggle = (displayStyle) => {
  if (displayStyle == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("cardContainer").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("cardContainer").classList.remove("hidden");
  }
};

// SHOW LESSON WORDS
const showLesson = (words) => {
  const cardContainer = document.getElementById("cardContainer");
  spnnerToggle(true);
  setTimeout(() => {
    spnnerToggle(false);
  }, 1000);
  cardContainer.innerHTML = "";
  if (!words || words.length == 0) {
    cardContainer.innerHTML = `
    <div></div>
      <div class=" text-black p-6 rounded-lg flex flex-col text-center">
      <img class="w-24 mx-auto mb-4" src="./assets/alert-error.png" alt="No Data Found">
        <p class="text-center bangla-font">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="text-xl bangla-font font-bold text-center">নেক্সট Lesson এ যান</h2>
      </div>
      <div></div>
    `;
  } else {
    words.forEach((word) => {
      const div = document.createElement("div");
      div.className =
        "card bg-white shadow-xl flex flex-col justify-center items-center space-y-4 p-4 py-6 max-w-sm w-full";
      div.innerHTML = `
         <h2 class="text-xl font-bold">${word.word ? word.word : "No Word Available"}</h2>
         <p class="text-center">Meaning /Pronunciation</p>
         <span class="italic">"${word.meaning ? word.meaning : "No Meaning Available"}"</span>
         <div class="flex justify-between items-center w-full">
            <button onclick="showModalWordInfo(${word.id})" class="btn "><i class="fa-solid fa-circle-info"></i></button>
            <button onclick="pronounceWord('${word.word}')" class="btn "><i class="fa-solid fa-microphone"></i></button>
         </div>
      `;
      cardContainer.appendChild(div);
    });
  }
};

// LIST LESSON BTNS
const playLesson = (lesson) => {
  const lessonContainer = document.getElementById("lessonListDiv");
  lessonContainer.innerHTML = "";
  lesson.forEach((les) => {
    const div = document.createElement("div");
    div.innerHTML = `<button id="lesson-btn-${les.level_no}" onclick="wordLesson(${les.level_no})" class="btn lesson-btn-colour-remove btn-outline btn-primary mt-2">
       <i class="fa-solid fa-graduation-cap"></i> Lesson ${les.level_no}
     </button>`;
    lessonContainer.appendChild(div);
  });
};

// PAGE LOAD
lessionLoad();

// SEARCH FUNCTION
document.getElementById("searchBtn").addEventListener("click", async function () {
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();

  try {
    const res = await fetch("https://openapi.programming-hero.com/api/words/all");
    const data = await res.json();
    const allWords = data.data;

    // null-check + case-insensitive filter
    const filterWords = searchInput === "" 
      ? allWords 
      : allWords.filter(word => word.word && word.word.toLowerCase().includes(searchInput));

    showLesson(filterWords);
  } catch (error) {
    console.error("Error fetching words:", error);
  }
});


