// Data
const areaData = {
    pantanal: {
        name: "Pantanal",
        animals: ["Jaguar", "Capybara", "Anaconda"],
        currentVisitors: 45,
        capacity: 100,
        nextFeedingTime: "14:30"
    },
    savanne: {
        name: "Savanne",
        animals: ["Lion", "Giraffe", "Zebra"],
        currentVisitors: 65,
        capacity: 120,
        nextFeedingTime: "15:00"
    },
    rainforest: {
        name: "Rainforest",
        animals: ["Gorilla", "Toucan", "Sloth"],
        currentVisitors: 30,
        capacity: 80,
        nextFeedingTime: "13:45"
    }
};

const ticketPrices = {
    adult: 25,
    child: 15,
    senior: 20
};

const ticketCounts = {
    adult: 0,
    child: 0,
    senior: 0
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createAreaCards();
    setupTabs();
    setupTicketCounters();
    setupDateMin();
    setupBookingModal();
    loadSavedTickets();
});

// Area Cards
function createAreaCards() {
    const grid = document.getElementById('areasGrid');
    
    for (const [id, area] of Object.entries(areaData)) {
        const card = document.createElement('div');
        card.className = 'area-card';
        
        const capacityPercentage = (area.currentVisitors / area.capacity) * 100;
        const capacityColor = capacityPercentage >= 80 ? '#ef4444' : '#22c55e';
        
        card.innerHTML = `
            <div class="area-header">
                <h3>${area.name}</h3>
                <span style="color: ${capacityColor}">${area.currentVisitors}/${area.capacity}</span>
            </div>
            <div>Next Feeding: ${area.nextFeedingTime}</div>
            <div class="animals-list">
                ${area.animals.map(animal => `
                    <span class="animal-tag">${animal}</span>
                `).join('')}
            </div>
        `;

        grid.appendChild(card);
    }
}

// Tabs
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-buttons [data-tab]');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-buttons [data-tab]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Ticket Counters
function setupTicketCounters() {
    const ticketCountersContainer = document.getElementById('ticketCounters');
    
    Object.keys(ticketPrices).forEach(type => {
        const counterDiv = document.createElement('div');
        counterDiv.className = 'ticket-counter';
        counterDiv.innerHTML = `
            <label>${type.charAt(0).toUpperCase() + type.slice(1)} Ticket</label>
            <div class="counter-controls">
                <button onclick="updateTicketCount('${type}', -1)">-</button>
                <span id="${type}Count">0</span>
                <button onclick="updateTicketCount('${type}', 1)">+</button>
            </div>
            <div class="ticket-price">$${ticketPrices[type]}</div>
        `;
        ticketCountersContainer.appendChild(counterDiv);
    });
}

function updateTicketCount(type, change) {
    ticketCounts[type] = Math.max(0, ticketCounts[type] + change);
    document.getElementById(`${type}Count`).textContent = ticketCounts[type];
    updateOrderSummary();
}

// Date Setup
function setupDateMin() {
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// Booking Modal
function setupBookingModal() {
    const bookButton = document.querySelector('button[onclick="openBooking()"]');
    const closeButton = document.querySelector('.close-modal');
    const modal = document.getElementById('bookingModal');

    if (bookButton) {
        bookButton.addEventListener('click', openBooking);
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', closeBooking);
    }
}

function openBooking() {
    document.getElementById('bookingModal').classList.add('active');
}

function closeBooking() {
    document.getElementById('bookingModal').classList.remove('active');
}

// Order Summary
function updateOrderSummary() {
    const summaryContainer = document.getElementById('orderSummary');
    if (!summaryContainer) return;

    let total = 0;
    let summaryHTML = '';

    Object.keys(ticketCounts).forEach(type => {
        if (ticketCounts[type] > 0) {
            const subtotal = ticketCounts[type] * ticketPrices[type];
            summaryHTML += `
                <div class="summary-item">
                    <span>${type.charAt(0).toUpperCase() + type.slice(1)} Ticket x ${ticketCounts[type]}</span>
                    <span>$${subtotal}</span>
                </div>
            `;
            total += subtotal;
        }
    });

    summaryHTML += `
        <div class="summary-total">
            <strong>Total</strong>
            <strong>$${total}</strong>
        </div>
    `;

    summaryContainer.innerHTML = summaryHTML;
}

// Ticket Booking
function completeBooking() {
    const dateInput = document.querySelector('input[type="date"]');
    const nameInput = document.querySelector('input[name="fullName"]');
    const emailInput = document.querySelector('input[name="email"]');

    if (!dateInput || !nameInput || !emailInput) return;

    const bookingData = {
        date: dateInput.value,
        name: nameInput.value,
        email: emailInput.value,
        tickets: {...ticketCounts}
    };

    // Save ticket to localStorage
    const savedTickets = JSON.parse(localStorage.getItem('zooTickets') || '[]');
    savedTickets.push(bookingData);
    localStorage.setItem('zooTickets', JSON.stringify(savedTickets));

    // Update tickets tab
    loadSavedTickets();

    // Reset form and close modal
    resetBookingForm();
    closeBooking();
}

function loadSavedTickets() {
    const ticketsContainer = document.getElementById('tickets-container');
    if (!ticketsContainer) return;

    const savedTickets = JSON.parse(localStorage.getItem('zooTickets') || '[]');

    if (savedTickets.length === 0) {
        ticketsContainer.innerHTML = `
            <div class="empty-state">
                No tickets yet. Book your visit to get started!
            </div>
        `;
        return;
    }

    ticketsContainer.innerHTML = savedTickets.map((ticket, index) => `
        <div class="ticket-card">
            <div class="ticket-info">
                <h3>Zoo Visit</h3>
                <p>Date: ${ticket.date}</p>
                <p>Name: ${ticket.name}</p>
                ${Object.entries(ticket.tickets)
                    .filter(([_, count]) => count > 0)
                    .map(([type, count]) => `<p>${type.charAt(0).toUpperCase() + type.slice(1)} Tickets: ${count}</p>`)
                    .join('')
                }
            </div>
            <div class="ticket-qr">
                QR Code
            </div>
        </div>
    `).join('');
}

function resetBookingForm() {
    // Reset ticket counts
    Object.keys(ticketCounts).forEach(type => {
        ticketCounts[type] = 0;
        document.getElementById(`${type}Count`).textContent = '0';
    });

    // Clear inputs
    const dateInput = document.querySelector('input[type="date"]');
    const nameInput = document.querySelector('input[name="fullName"]');
    const emailInput = document.querySelector('input[name="email"]');

    if (dateInput) dateInput.value = '';
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';

    // Clear order summary
    const summaryContainer = document.getElementById('orderSummary');
    if (summaryContainer) summaryContainer.innerHTML = '';
}