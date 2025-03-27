document.getElementById('searchButton').addEventListener('click', () => searchDigimon('searchInput'));
document.getElementById('showAllButton').addEventListener('click', showAllDigimon);
document.getElementById('searchButtonResults').addEventListener('click', () => searchDigimon('searchInputResults'));
document.getElementById('backButton').addEventListener('click', goBackHome);
document.querySelector('.close-button').addEventListener('click', closeModal);

function openModal(digimon) {
    const modal = document.getElementById('digimonModal');
    const modalBody = document.getElementById('modalBody');

    while (modalBody.firstChild) {
        modalBody.removeChild(modalBody.firstChild);
    }

    const title = document.createElement('h2');
    title.textContent = digimon.name;

    const image = document.createElement('img');
    image.src = digimon.img;
    image.alt = digimon.name;
    image.style.width = '100%';
    image.style.maxWidth = '300px';
    image.style.borderRadius = '8px';

    const levelLabel = document.createElement('strong');
    levelLabel.textContent = 'Level: ';

    const level = document.createElement('p');
    level.appendChild(levelLabel);
    level.appendChild(document.createTextNode(digimon.level));

    modalBody.appendChild(title);
    modalBody.appendChild(image);
    modalBody.appendChild(level);

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('digimonModal').classList.add('hidden');
}

async function searchDigimon(inputId) {
    const searchTerm = document.getElementById(inputId).value.trim();
    let url = '';

    if (searchTerm) {
        const levels = ["in training", "rookie", "champion", "ultimate", "fresh", "mega", "training", "armor"];
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        if (levels.includes(lowerCaseSearchTerm)) {
            url = `https://digimon-api.vercel.app/api/digimon/level/${lowerCaseSearchTerm}`;
        } else {
            url = `https://digimon-api.vercel.app/api/digimon/name/${searchTerm}`;
        }
    } else {
        alert('Por favor, insira um nome ou nível para pesquisar.');
        return;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Error) {
            alert('Nenhum Digimon encontrado.');
            return;
        }

        displayResults(data);
        goToResultsScreen();
    } catch (error) {
        console.error('Erro ao buscar Digimon:', error);
        alert('Ocorreu um erro ao buscar Digimon. Tente novamente.');
    }
}

function displayResults(digimons) {
    const resultsDiv = document.getElementById('results');

    while (resultsDiv.firstChild) {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }

    if (digimons.length === 0) {
        const noResultsMsg = document.createElement('p');
        noResultsMsg.textContent = 'Nenhum Digimon encontrado.';
        resultsDiv.appendChild(noResultsMsg);
        return;
    }

    digimons.forEach(digimon => {
        const digimonCard = document.createElement('div');
        digimonCard.className = 'digimon-card';

        const name = document.createElement('h2');
        name.textContent = digimon.name;

        const img = document.createElement('img');
        img.src = digimon.img;
        img.alt = digimon.name;

        const levelLabel = document.createElement('strong');
        levelLabel.textContent = 'Level: ';

        const level = document.createElement('p');
        level.appendChild(levelLabel);
        level.appendChild(document.createTextNode(digimon.level));

        digimonCard.appendChild(name);
        digimonCard.appendChild(img);
        digimonCard.appendChild(level);

        digimonCard.addEventListener('click', () => openModal(digimon));

        resultsDiv.appendChild(digimonCard);
    });
}

function goToResultsScreen() {
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('resultsScreen').classList.remove('hidden');
}

function goBackHome() {
    document.getElementById('homeScreen').classList.remove('hidden');
    document.getElementById('resultsScreen').classList.add('hidden');
    document.getElementById('searchInput').value = '';
}

async function showAllDigimon() {
    const url = 'https://digimon-api.vercel.app/api/digimon';

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data);
        goToResultsScreen();
    } catch (error) {
        console.error('Erro ao buscar todos os Digimons:', error);
        alert('Ocorreu um erro ao buscar todos os Digimons. Tente novamente.');
    }
}
