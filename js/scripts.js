// Imports
import { lowercaseTransformator, isEmpty, isNumber } from './validation';
import { db } from './mockedDB';

document.addEventListener('DOMContentLoaded', e => {
    const formUserBtn = document.querySelector('.container__add-form-btn');
    const userSearchField = document.querySelector('.container__search-input');
    const userSearchRenderOutput = document.querySelector('.container__search-content');
    const popupInfo = document.querySelector('.callback-info-list');
    const { people } = db;

    formUserBtn.addEventListener('click', e => {
        e.preventDefault();

        // On add btn functions
        const name = document.querySelector('[name=name]').value;
        const age = document.querySelector('[name=age]').value;

        if (isEmpty(name) || isEmpty(age) || isNumber(age)) {
            // Create popUp negative
            const err = document.createElement('li');
            styleMessage(err, 'callback-info-list__item-fail');
            prepereMessage(err, 'ERROR: Name or age not defined.');
            showTheMessage(popupInfo, err);
        }else {
            // Create possitive popUp
            const succ = document.createElement('li');
            styleMessage(succ, 'callback-info-list__item-success');
            prepereMessage(succ, 'SUCCESS: Added to DB.');
            showTheMessage(popupInfo, succ);

            // And push to database
            const user = { name: name, age: Number(age)};
            pushToLocaleDB(user, people);

            console.log(people);
        }
    });

    userSearchField.addEventListener('keyup', e => {
        const searchingValue = e.target.value;
        const searchedPerson = getResult(searchingValue, people);

        searchRenderer(userSearchRenderOutput, searchedPerson);
    })
    // Message front-end
    function showTheMessage(ul, li) {
        ul.appendChild(li);
        setTimeout(() => {
            ul.removeChild(li);
        }, 2000);
    }
    function styleMessage(element, format) {
        element.classList.add('callback-info-list__item');
        element.classList.add(format);
    }
    function prepereMessage(element, message) {
        const info = document.createElement('p');
        info.classList.add('callback-info-list__paragraph');
        info.insertAdjacentHTML('beforeend', message);
        element.appendChild(info);
    }
    // Filtred values
    function getResult(val, data) {
        const base = data;
        const arrayOfResults = [];
        for (const person of base) {
            let { name } = person;
            if(lowercaseTransformator(name).includes(val.toLowerCase())) { arrayOfResults.push(person) };
        }
        return arrayOfResults;
    }
    function searchRenderer(ul, list) {
        ul.innerHTML = '';
        if(list.length === 0) {
            const li = document.createElement('li');
            const p = prepereParagraph();
            p.innerHTML = 'Nothing to find';
            li.appendChild(p);
            ul.appendChild(li);
            return;
        }
        if(list.length === people.length) {
            const li = document.createElement('li');
            const p = prepereParagraph();
            p.innerHTML = 'Nothing found';
            li.appendChild(p);
            ul.appendChild(li);
            return;
        }
        list.forEach(el => {
            const { name, age } = el;
            const li = document.createElement('li');
            li.classList.add('container__search-content-item');
            const p = prepereParagraph(name, age);
            li.appendChild(p);
            ul.appendChild(li);
        });
        function prepereParagraph(name = '', age = '') {
            const paragraph = document.createElement('p');
            paragraph.classList.add('container__search-content-paragraph');
            paragraph.innerHTML = `${name} - ${age}`;
            return paragraph;
        }
    };
    //Locale DB to show logic
    function pushToLocaleDB(data, db) {
        const database = db.filter(el => el.name === data.name)
        console.log(database);
        if(database.length === 0) {
            db.push(data);
        }
    }

    // There should be backend responses with express
    function submitData(data) {
        fetch('http://localhost:1234/db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(() => {

        })
        .catch(err => {

        })
    }
})
