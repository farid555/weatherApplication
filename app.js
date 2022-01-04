
//memory data store (CRUD)

//UI(Dom)
//Create - New element creation 
//read -- showing UI
//Update -- updating UI
//Delete -- deleting UI
//LocalStorage(CRUD)................................................................



//grouping data 

const weatherStore = {
    privateCity: 'Helsinki',
    privateCountry: 'Finland',
    API_KEY: 'c2e0399f440c0b3aa7e1de391b78f1c8',

    set city(name) {
        console.log('city name');
        this.privateCity = name;
    },
    set country(name) {

        console.log('country name');
        this.privateContry = name;
    },

    async fetchData() {
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.privateCity},${this.privateCountry}&units=metric&appid=${this.API_KEY}`)
            return await res.json();
        } catch (err) {
            UI.showMessage(err.message);
        }


    },

}

const storage = {
    privateCity: '',
    privateCountry: '',
    set city(name) {
        console.log('city name');
        this.privateCity = name;
    },
    set country(name) {

        console.log('country name');
        this.privateCountry = name;
    },

    saveItem() {
        localStorage.setItem('weather-App-city', this.privateCity);
        localStorage.setItem('weather-App-country', this.privateCountry);
    },
}


const UI = {


    loadSelectors() {
        const cityElm = document.querySelector('#city');
        const cityInfoElm = document.querySelector('#w-city');
        const iconElm = document.querySelector('#w-icon');
        const tempatureElm = document.querySelector('#w-temp');
        const pressureElm = document.querySelector('#w-pressure');
        const humidityElm = document.querySelector('#w-humidity');
        const feelElm = document.querySelector('#w-feel');
        const formElm = document.querySelector('#form');
        const countryElm = document.querySelector('#country');
        const messageElm = document.querySelector('#messageWrapper');

        return {
            cityElm,
            cityInfoElm,
            iconElm,
            tempatureElm,
            pressureElm,
            humidityElm,
            feelElm,
            formElm,
            countryElm,
            messageElm
        }
    },

    getInputValues() {
        const { cityElm, countryElm } = this.loadSelectors();
        const city = cityElm.value;
        const country = countryElm.value;

        return { city, country }

    },

    validateInput(city, country) {
        let error = false;
        if (city === '' || country === '') {
            error = true
        }
        return error;
    },



    showMessage(msg) {
        const msgContentElm = document.querySelector('.err-msg')
        const { messageElm } = this.loadSelectors();
        const elm = `<div class="alert alert-danger err-msg">${msg}</div>`
        if (!msgContentElm) {
            messageElm.insertAdjacentHTML('afterbegin', elm);
        }
        this.hideMessage();

    },

    hideMessage() {
        const msgContentElm = document.querySelector('.err-msg')
        if (msgContentElm) {
            setTimeout(() => {
                msgContentElm.remove();
            }, 2000);
        }
    },

    getIconSrc(iconCode) {
        return 'https://openweathermap.org/img/w/' + iconCode + '.png';
    },

    printWeather(data) {
        const {
            cityInfoElm,
            iconElm,
            tempatureElm,
            pressureElm,
            humidityElm,
            feelElm

        } = this.loadSelectors();

        const { main, weather, name } = data;
        cityInfoElm.textContent = name;
        tempatureElm.textContent = `Tempature: ${main.temp}°C`;
        humidityElm.textContent = `Humidity: ${main.humidity} Kpa`;
        pressureElm.textContent = `pressure: ${main.pressure} Kpa`;
        feelElm.textContent = weather[0].description;
        const src = this.getIconSrc(weather[0].icon);
        iconElm.setAttribute('src', src);

        console.log(src);
    },

    resetInput() {
        const { cityElm, countryElm } = this.loadSelectors();
        cityElm.value = '';
        countryElm.value = '';
    },

    init() {
        const { formElm } = this.loadSelectors();
        formElm.addEventListener('submit', async (e) => {
            e.preventDefault();
            //get the input value...
            const { city, country } = this.getInputValues();
            //reset Input
            this.resetInput();
            //validate input...
            const error = this.validateInput(city, country);
            //show error message in UI
            if (error) return this.showMessage('Please provide valid Input...');
            //set city and country
            // this.city = city;
            // this.country = country;


            //seting data to weather data stored 
            weatherStore.city = city;
            weatherStore.country = country;


            // setting to localStroage
            storage.city = city;
            storage.country = country;
            storage.saveItem();


            //send request to API server...
            const data = await weatherStore.fetchData();
            this.printWeather(data);
        })

        document.addEventListener('DOMContentLoaded', async (e) => {
            //loadData from localStorage............
            if (weatherStore.city = localStorage.getItem('weather-App-city')) {
                //set data to data store
                weatherStore.city = localStorage.getItem('weather-App-city')
            }

            if (weatherStore.city = localStorage.getItem('weather-App-country')) {
                //set data to data store
                weatherStore.city = localStorage.getItem('weather-App-country')
            }

            // send request to API server...
            const data = await weatherStore.fetchData();

            if (Number(data.cod) > 400) {
                this.showMessage(data.message);
            } else {
                //show  data to UI
                this.printWeather(data);
            }
            console.log(data);



        })
    },


}

UI.init();


