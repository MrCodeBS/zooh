const locationMarker = document.getElementById('location-marker');
const areaInfo = document.getElementById('area-info');
const mapAreas = document.querySelectorAll('.map-area');

const areaData = {
    pantanal: { name: "Pantanal", animals: ["Jaguar", "Capybara", "Anaconda"] },
    savanne: { name: "Savanne", animals: ["Lion", "Giraffe", "Zebra"] },
    rainforest: { name: "Rainforest", animals: ["Gorilla", "Toucan", "Sloth"] }
};

function updateLocation(area) {
    const areaElement = document.getElementById(area);
    const rect = areaElement.getBoundingClientRect();
    const mapRect = document.getElementById('zoo-map').getBoundingClientRect();

    locationMarker.style.left = `${rect.left - mapRect.left + rect.width / 2}px`;
    locationMarker.style.top = `${rect.top - mapRect.top + rect.height / 2}px`;

    updateInfo(area);
}

function updateInfo(area) {
    const { name, animals } = areaData[area];
    areaInfo.innerHTML = `
        <h3>${name}</h3>
        <p>Animals you might see here:</p>
        <ul>${animals.map(animal => `<li>${animal}</li>`).join('')}</ul>
    `;
}

mapAreas.forEach(area => {
    area.addEventListener('click', () => updateLocation(area.id));
});

// Initialize with a random location
updateLocation(Object.keys(areaData)[Math.floor(Math.random() * Object.keys(areaData).length)]);