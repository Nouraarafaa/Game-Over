const categories = ['mmorpg', 'shooter', 'sailing', 'permadeath', 'superhero', 'pixel'];
var result = [];
var showBtn = document.getElementById('showBtn');

const storedGames = localStorage.getItem("games");
if (storedGames) {
    DisplayData(JSON.parse(storedGames));
}

categories.forEach(category => {
    const element = document.getElementById(category);

    element.addEventListener('click', async () => {
        categories.forEach(cat => {
            document.getElementById(cat).classList.remove('active');
        });
        element.classList.add('active');
        showLoading(); 
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '71a46a37a3msh212f7681ed22de1p1086e1jsn49ea844fdd86',
                'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
            }
        };
        try {
            const response = await fetch(url, options);
            result = await response.json();
            localStorage.setItem("games", JSON.stringify(result));
            DisplayData(result);
            hideLoading(); 
        } catch (error) {
            console.error('Error fetching data:', error);
            hideLoading();  
        }
    });
});

function DisplayData(newResult) {
    result = newResult; 
    let cartoona = ``;

    for (let i = 0; i < result.length; i++) {
        cartoona += `
        <div class="card" data-index="${i}">
            <img src="${result[i].thumbnail}" alt="${result[i].title.slice(0 , 20)}">
            <div class="top">
                <p>${result[i].title.slice(0 , 20)}</p>
                <p class="cost">Free</p>
            </div>
            <p class="middle">${result[i].short_description.slice(0 , 50)}</p>
            <div class="bottom">
                <span>${result[i].genre}</span>
                <span>${result[i].platform}</span>
            </div>
        </div>`;
    }
    Allcards.innerHTML = cartoona;
    DisplayDetails(); 
}

function DisplayDetails() {
    const cards = document.querySelectorAll('.card'); 

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index'); 
            var id = result[index].id;
            GetDetails(id);
        });
    });
}

async function GetDetails(id) {
    showLoading(); 
    const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '71a46a37a3msh212f7681ed22de1p1086e1jsn49ea844fdd86',
            'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const gameDetails = await response.json(); 
        var box = `
        <div class="exit">
                <i class="fa-solid fa-xmark" id="exit"></i>
            </div>
            <h2>Game Details</h2>
            <div class="game-details">
                <div class="left">
                    <img src="${gameDetails.thumbnail}" alt="${gameDetails.title}">
                </div>
                <div class="right">
                    <h3>${gameDetails.title}</h3>
                    <p>Category: <span>${gameDetails.genre}</span></p>
                    <p>Platform: <span>${gameDetails.platform}</span></p>
                    <p>Status: <span>${gameDetails.status}</span></p>
                    <p>${gameDetails.description}</p>
                    <button id="showBtn" class="btn btn-primary">
                        <a href="${gameDetails.game_url}" target="_blank">Show Game</a>
                    </button>
                </div>
            </div>
        `;
        document.querySelector('.game').innerHTML = box;

        document.querySelector('.game').classList.remove('d-none');
        hideLoading();  
    } catch (error) {
        console.error('Error fetching game details:', error);
        hideLoading();  
    }
}

const exit = document.getElementById('exit');
document.querySelector('.game').addEventListener('click', (e) => {
    if (e.target.id === 'exit') {
        document.querySelector('.game').classList.add('d-none');
    }
});

var loadingScreen = document.querySelector('.loading');
function showLoading() {
    loadingScreen.classList.remove("d-none");
}

function hideLoading() {
    loadingScreen.classList.add("d-none");
}
