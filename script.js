const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const form = document.querySelector(".form");
// const workoutElement = document.querySelector(".workout");
const mapAppWorkout = document.querySelector(".map__app--workout");
const selectInputType = document.querySelector(".select__input--type");
let inputElementDistance = document.querySelector(".select__element--distance");
let inputElementDuration = document.querySelector(".select__element--duration");
let inputElementCadence = document.querySelector(".select__element--cadence");
let form__button = document.querySelector(".form_button");
let workout_running = document.querySelector(".workout__running");
let workout_cycling = document.querySelector(".workout__cycling");
let workout_title = document.querySelector(".workout__title");
let inputElementElevation = document.querySelector(
  ".select__element--elevation"
);
const input__element = document.querySelectorAll(".select__element");
const form__row = document.querySelectorAll(".form__row");
// let map, mapEvent;
class Workout {
  Date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // km
    this.duration = duration;
    this._setDateTime();
    // mapAppWorkout.addEventListener('click' , this._moveToPopup)
  }
  _setDateTime() {
    // set time and date
    // this.dateTime = new Date().getDay() + " " + months[new Date().getMonth()];
    // console.log(this.dateTime);
    // return this.dateTime;
  }
}
class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    // this._setDateTime();
  }
  calcPace() {
    // min / km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    // this._setDateTime();
  }
  calcSpeed() {
    // min / km
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}
const run1 = new Running([39, -12], 28, 40, 65);
const cyc1 = new Cycling([40, -18], 29, 35, 78);
console.log(run1);
console.log(cyc1);

class MapApp {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();
    form__button.addEventListener("click", this._newForm.bind(this));
    selectInputType.addEventListener(
      "change",
      this._toggleElevationFiled.bind(this)
    );
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("موقعیت مکانی شما پیدا نشد.");
        }
      );
    }
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    console.log(latitude, longitude);
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    console.log(this);
    this.#map.on("click", this._showForm.bind(this));
  }
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("form__hidden");
    form__button.classList.remove("form__hidden");
    // form.style.display = "block";
    inputElementDistance.focus();
  }
  _newForm(e) {
    // get Data from form
    const checkEmpty = (...inputs) => inputs.every((inp) => inp !== "");
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const checkNegative = (...inputs) => inputs.every((inp) => inp > 0);
    const type = selectInputType.value;
    const distance = +inputElementDistance.value;
    const duration = +inputElementDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    // this._setLocalStorage();
    // workout running create running object
    if (type === "running") {
      const cadence = +inputElementCadence.value;

      // check data is valid
      if (
        !checkEmpty(distance, duration, cadence) ||
        !validInputs(distance, duration, cadence) ||
        !checkNegative(distance, duration, cadence)
      ) {
        return alert("ورودی ها نامعتبر هستند.");
      }
      workout = new Workout([lat, lng], distance, duration, cadence);
      this.#workouts.push(workout);
      console.log(workout);
      console.log(this.#workouts);
      this._renderWorkout(workout);
    }
    // workout cycling create cycling object
    if (type === "cycling") {
      const elevation = +inputElementElevation.value;

      // check data is valid
      if (
        !checkEmpty(distance, duration, elevation) ||
        !validInputs(distance, duration, elevation) ||
        !checkNegative(distance, duration)
      ) {
        return alert("ورودی ها نامعتبر هستند.");
      }
      workout = new Workout([lat, lng], distance, duration, elevation);
      this.#workouts.push(workout);
      console.log(workout);
      console.log(this.#workouts);
      this._renderWorkout(workout);
    }

    e.preventDefault();
    inputElementDistance.value =
      inputElementCadence.value =
      inputElementDuration.value =
      inputElementElevation.value =
        "";

    console.log(lat, lng);
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 300,
          minWidth: 50,
          autoClose: false,
          closeOnClick: false,
          className: `${selectInputType.value}-popup`,
        })
      )
      .setPopupContent(
        `${
          type === "running" ? "دویدن" : "دوچرخه سواری"
        } در ${new Date().getDay()} ماه ${months[new Date().getMonth()]}`
      )
      .openPopup();
    // hidden form
    form.classList.add("form__hidden");
    form__button.classList.add("form__hidden");

    let date = new Date();
    let getDate = date.toString().slice(3, 11);
    if (type === "running") {
      // workout_running.classList.remove("workout__running--hidden");
      // workout_running.style.borderRight = "7px solid orangered";
    }
    if (type === "cycling") {
      // workout_cycling.classList.remove("workout__cycling--hidden");
      // workout_cycling.style.borderRight = "7px solid dodgerblue";
    }
  }
  _renderWorkout(workout) {
    let inputType = selectInputType.value;
    let html = `
<!--      <div class="scrollbar">-->
      <li class="workout workout--${inputType} data-id="${workout.id}>
        <h2 class="workout__title">
        ${
          inputType === "running" ? "دویدن" : "دوچرخه سواری"
        } در تاریخ ${new Date().getDay()} ماه ${
      months[new Date().getMonth()]
    } ساعت ${
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds()
    }

<!--        <div class="scrollbar">-->
        </h2>
        <div class="workout__details">
          <span class="workout__icon">${
            inputType === "running" ? "🏃‍♂️" : "🚴‍♀️"
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
    `;

    if (inputType === "running")
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${(
            workout.distance / workout.duration
          ).toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
<!--        </div>-->
      `;

    if (inputType === "cycling")
      html += `
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${(
            workout.duration / workout.distance
          ).toFixed(1)}</span>
          <span class="workout__unit">spm</span>
        </div>
<!--        </div>-->
      `;

    form.insertAdjacentHTML("afterend", html);
  }
  // _moveToPopup(e){
  //   const workout_element = e.target.closest('.workout');
  //   console.log(workout_element);
  //   if(!workout_element) {
  //     return;
  //   }
  //     const workout = this.#workouts.find(work => work.id === workout_element.dataset.id);
  //   console.log(workout)
  //
  // }
  _toggleElevationFiled() {
    inputElementCadence
      .closest(".form__row")
      .classList.toggle("form__row--hidden");
    inputElementElevation
      .closest(".form__row")
      .classList.toggle("form__row--hidden");
  }
  // _setLocalStorage(){
  //   localStorage.setItem('workouts', JSON.stringify(this.#workouts))
  // }
}
const mapApp = new MapApp();
