// Асинхронность, промисы и HTTP.  Домашняя работа

// Задание №1
// Создать программу - список покемонов.

// Пример:
// Bulbasaur
// Ivysaur
// Venusaur
// Charmander
// Charmeleon
// Charizard
// Squirtle
// … и т.п.

// При клике на имя покемона, показать рядом (в соседнем div-е) или во всплывающем
// окне информацию об этом покемоне, например:

// Имя: Charmeleon
// Тип: fire
// Рост: 11
// Вес: 190
// Изображение покемона (дополнительно)

// Указания:
// Список покемонов (первые 20 штук) получить через запрос к API:
// https://pokeapi.co/api/v2/pokemon/
// Информацию о каждом покемоне получать через запрос к API:
// https://pokeapi.co/api/v2/pokemon/{id}/
// где {id} - номер покемона
// Подсказка об используемых ключах результата
// (предположим что полученный объект у вас лежит в переменной result)
// Изображение: result.sprites.front_default
// Имя: result.name
// Тип: массив result.types. Из каждого элемента массива можно взять только type.name
// Рост: result.height
// Вес: result.weight

// Дополнительно:
// Используя ссылку на следующую страницу в результате (ссылку на API следующих
// результатов) реализовать пагинацию (постраничный вывод) в программе, т.е.:
// На клик по ссылке “Next” делать запрос на следующие 20 штук, заменять текущий список.
// Реализовать “Previous” и “Next” - возможность возвращаться на страницу ранее


// * ============== ВЫЗЫВАЕМ ЭЛЕМЕНТЫ HTML В JS =================

const app = document.getElementById("app");
const modal = document.querySelector(".modal-content");
const nameEl = document.querySelector("#name");
const typeEl = document.querySelector("#type");
const heightEl = document.querySelector("#height");
const weightEl = document.querySelector("#weight");
const imageEl = document.querySelector("#image");
const closeBtn = document.querySelector(".modal-content button");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");

let currentPage = 1;

// * ====================== КНОПКИ ПОКЕМОНОВ ===================

async function getPokemonList(page = 1) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${(page - 1) * 20}&limit=20`);
  const data = await response.json();
  const pokemonList = data.results;
  const html = pokemonList.map((pokemon) => `<button class="pokemon-btn" data-url="${pokemon.url}">${pokemon.name}</button>`).join("");
  app.innerHTML = html;
}

// * ================== КАРТОЧКА ПОКЕМОНА ========================

async function getPokemonInfo(url) {
  const response = await fetch(url);
  const data = await response.json();
  const { name, types, height, weight, sprites } = data;
  const typeNames = types.map((type) => type.type.name).join(", ");
  return { name, typeNames, height, weight, imageUrl: sprites.front_default };
}

async function displayModal(url) {
  const { name, typeNames, height, weight, imageUrl } = await getPokemonInfo(url);
  nameEl.textContent = name;
  typeEl.textContent = typeNames;
  heightEl.textContent = height;
  weightEl.textContent = weight;
  imageEl.src = imageUrl;
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

// * ===================== PAGINATION ============================

async function showPrevPage() {
  if (currentPage === 1) return;
  currentPage--;
  await getPokemonList(currentPage);
}

async function showNextPage() {
  currentPage++;
  await getPokemonList(currentPage);
}

getPokemonList();

app.addEventListener("click", (event) => {
  if (event.target.classList.contains("pokemon-btn")) {
    const url = event.target.dataset.url;
    displayModal(url);
  }
});

closeBtn.addEventListener("click", closeModal);

prevBtn.addEventListener("click", showPrevPage);

nextBtn.addEventListener("click", showNextPage);
