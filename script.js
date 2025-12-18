
// Application State
const state = {
    user: null,
    budget: {
        total: 0,
        spent: 0,
        daily: 0,
        expenses: []
    },
    groupMembers: ['AJ', 'SP', 'RK', 'MV', 'TP'],
    reviews: [
        {
            id: 1,
            place: 'Beach Resort',
            category: 'hotels',
            rating: 4.8,
            comment: 'Beautiful location with amazing sunset views. The staff was very helpful!',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            user: 'Traveler123',
            date: '2025-03-10',
            location: 'Goa'
        },
        {
            id: 2,
            place: 'Mountain Cafe',
            category: 'restaurants',
            rating: 4.5,
            comment: 'Great food with a spectacular view. A bit crowded during weekends.',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            user: 'FoodExplorer',
            date: '2025-03-08',
            location: 'Manali'
        },
        {
            id: 3,
            place: 'Heritage Hotel',
            category: 'hotels',
            rating: 4.2,
            comment: 'Historic building with modern amenities. Loved the traditional architecture!',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            user: 'HistoryBuff',
            date: '2025-03-05',
            location: 'Jaipur'
        }
    ],
    chatMessages: [
        { sender: 'AJ', message: 'Has everyone reached the hotel?', time: '10:30 AM', type: 'received' },
        { sender: 'You', message: 'Yes, just checked in. The view is amazing!', time: '10:32 AM', type: 'sent' },
        { sender: 'RK', message: 'I\'m 10 minutes away. See you soon!', time: '10:35 AM', type: 'received' },
        { sender: 'SP', message: 'Let\'s meet at the rooftop restaurant at 7 PM for dinner.', time: '10:40 AM', type: 'received' }
    ],
    currentTrip: null,
    map: null,
    editingExpenseId: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeBudget();
    renderExpenses();
    renderReviews();
    initializeMap();
    checkLoginStatus();

    // Set up event listeners
    document.getElementById('sosButton').addEventListener('click', triggerSOS);
    document.getElementById('startJourneyBtn').addEventListener('click', function () {
        document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('loginBtn').addEventListener('click', function () {
        showAuthModal();
        switchAuthTab('login');
    });

    document.getElementById('signupBtn').addEventListener('click', function () {
        showAuthModal();
        switchAuthTab('register');
    });

    // Simulate real-time updates
    setInterval(updateAlerts, 10000);
});

// Authentication Functions
function checkLoginStatus() {
    const savedUser = localStorage.getItem('voyatra_user');
    if (savedUser) {
        state.user = JSON.parse(savedUser);
        updateUIForUser();
    }
}

function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-content').forEach(c => c.classList.remove('active'));

    document.querySelector(`.auth-tab:nth-child(${tab === 'login' ? 1 : 2})`).classList.add('active');
    document.getElementById(`${tab}-content`).classList.add('active');
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Simulate login - in a real app, this would be an API call
    state.user = {
        name: email.split('@')[0],
        email: email,
        preferences: {
            budget: 'mid-range',
            accommodation: 'hotel'
        }
    };

    localStorage.setItem('voyatra_user', JSON.stringify(state.user));
    updateUIForUser();
    closeAuthModal();
    showNotification('Login successful!', 'success');

    // Check if profile needs to be completed
    if (!state.user.profileComplete) {
        showProfileSetupModal();
    }
}

function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    if (!name || !email || !password || !confirm) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirm) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    // Simulate registration - in a real app, this would be an API call
    state.user = {
        name: name,
        email: email,
        preferences: {
            budget: 'mid-range',
            accommodation: 'hotel'
        },
        profileComplete: false
    };

    localStorage.setItem('voyatra_user', JSON.stringify(state.user));
    updateUIForUser();
    closeAuthModal();
    showNotification('Registration successful!', 'success');

    // Show profile setup modal
    showProfileSetupModal();
}

function logout() {
    state.user = null;
    localStorage.removeItem('voyatra_user');
    updateUIForUser();
    showNotification('Logged out successfully', 'success');
}

function updateUIForUser() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const userAvatarSmall = document.getElementById('userAvatarSmall');
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');

    if (state.user) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = state.user.name;
        userAvatarSmall.textContent = state.user.name.charAt(0).toUpperCase();
        profileName.textContent = state.user.name;
        profileEmail.textContent = state.user.email;

        // Load user preferences
        if (state.user.preferences) {
            document.getElementById('pref-budget').value = state.user.preferences.budget;
            document.getElementById('pref-accommodation').value = state.user.preferences.accommodation;
        }

        // Load profile data if available
        if (state.user.profile) {
            document.getElementById('setup-full-name').value = state.user.profile.fullName || '';
            document.getElementById('setup-age').value = state.user.profile.age || '';
            document.getElementById('setup-gender').value = state.user.profile.gender || '';
            document.getElementById('setup-phone').value = state.user.profile.phone || '';
            document.getElementById('setup-address').value = state.user.profile.address || '';
        }
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        profileName.textContent = 'User Name';
        profileEmail.textContent = 'user@example.com';
    }

    updateCurrentJourney();
}

// Profile Setup Functions
function showProfileSetupModal() {
    document.getElementById('profileSetupModal').style.display = 'flex';
}

function closeProfileSetupModal() {
    document.getElementById('profileSetupModal').style.display = 'none';
}

function completeProfileSetup() {
    const fullName = document.getElementById('setup-full-name').value;
    const age = document.getElementById('setup-age').value;
    const gender = document.getElementById('setup-gender').value;
    const phone = document.getElementById('setup-phone').value;
    const address = document.getElementById('setup-address').value;

    if (!fullName || !age || !gender) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    state.user.profile = {
        fullName,
        age,
        gender,
        phone,
        address
    };

    state.user.profileComplete = true;
    localStorage.setItem('voyatra_user', JSON.stringify(state.user));
    closeProfileSetupModal();
    showNotification('Profile completed successfully!', 'success');
    updateUIForUser();
}

function savePreferences() {
    if (!state.user) {
        showNotification('Please login to save preferences', 'warning');
        return;
    }

    const budgetPref = document.getElementById('pref-budget').value;
    const accommodationPref = document.getElementById('pref-accommodation').value;

    state.user.preferences = {
        budget: budgetPref,
        accommodation: accommodationPref
    };

    localStorage.setItem('voyatra_user', JSON.stringify(state.user));
    showNotification('Preferences saved successfully!', 'success');
}

// Map Functions
function initializeMap() {
    state.map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(state.map);

    // Add some sample markers for popular destinations
    const destinations = [
        { name: 'Goa', lat: 15.2993, lng: 74.1240 },
        { name: 'Manali', lat: 32.2396, lng: 77.1887 },
        { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
        { name: 'Kerala', lat: 10.8505, lng: 76.2711 },
        { name: 'Darjeeling', lat: 27.0360, lng: 88.2627 }
    ];

    destinations.forEach(dest => {
        L.marker([dest.lat, dest.lng])
            .addTo(state.map)
            .bindPopup(`<b>${dest.name}</b><br>Click to plan trip to ${dest.name}`)
            .on('click', function () {
                document.getElementById('destination').value = dest.name;
            });
    });
}

// Recommendation Functions
function getRecommendations() {
    if (!state.user) {
        showNotification('Please login to get recommendations', 'warning');
        showAuthModal();
        return;
    }

    const destination = document.getElementById('destination').value;
    const budget = parseInt(document.getElementById('trip-budget').value);
    const duration = parseInt(document.getElementById('trip-duration').value);

    if (!destination) {
        showNotification('Please enter a destination', 'error');
        return;
    }

    // Simulate AI recommendations based on inputs
    const recommendations = generateRecommendations(destination, budget, duration);
    displayRecommendations(recommendations);
}

function generateRecommendations(destination, budget, duration) {
    // This would be replaced with actual AI logic in a real app
    const plans = [
        {
            id: 1,
            name: 'Budget Explorer',
            description: 'Perfect for travelers on a tight budget',
            budget: budget * 0.7,
            duration: duration,
            highlights: ['Hostel accommodation', 'Local transport', 'Free attractions'],
            hotels: ['Backpacker Hostel', 'Budget Inn'],
            activities: ['City walking tour', 'Local market visit', 'Public beach'],
            places: ['Beach', 'Local Market', 'City Center'],
            restaurants: ['Street Food Stalls', 'Local Eateries', 'Budget Cafes'],
            touristSpots: ['Public Beach', 'City Park', 'Local Market']
        },
        {
            id: 2,
            name: 'Comfort Traveler',
            description: 'Balanced experience with comfort and value',
            budget: budget,
            duration: duration,
            highlights: ['3-star hotels', 'Mix of transport options', 'Guided tours'],
            hotels: ['Comfort Hotel', 'City View Inn'],
            activities: ['Half-day guided tour', 'Museum visits', 'Local cuisine tasting'],
            places: ['Historical Museum', 'Fine Dining Restaurant', 'City Park'],
            restaurants: ['Mid-range Restaurants', 'Local Cuisine Spots', 'Cafes with Views'],
            touristSpots: ['Historical Museum', 'City Park', 'Cultural Center']
        },
        {
            id: 3,
            name: 'Luxury Experience',
            description: 'Premium travel with all the comforts',
            budget: budget * 1.5,
            duration: duration,
            highlights: ['5-star hotels', 'Private transport', 'Exclusive experiences'],
            hotels: ['Grand Hotel', 'Luxury Resort'],
            activities: ['Private guided tours', 'Fine dining experiences', 'Spa treatments'],
            places: ['Luxury Resort', 'Private Beach', 'Exclusive Club'],
            restaurants: ['Fine Dining Restaurants', 'Rooftop Bars', 'Gourmet Experiences'],
            touristSpots: ['Private Beach', 'Luxury Resort', 'Exclusive Club']
        }
    ];

    return plans;
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations-container');
    container.innerHTML = '<div class="recommendations-side-by-side">';

    recommendations.forEach(plan => {
        const planEl = document.createElement('div');
        planEl.className = 'recommendation-card';
        planEl.innerHTML = `
                    <h4>${plan.name}</h4>
                    <p>${plan.description}</p>
                    <p><strong>Budget: $${plan.budget}</strong></p>
                    <p><strong>Duration: ${plan.duration} days</strong></p>
                    <p><strong>Recommended Places:</strong> ${plan.places.join(', ')}</p>
                    <ul>
                        ${plan.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                    <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="selectPlan(${plan.id})">Select Plan</button>
                `;
        container.querySelector('.recommendations-side-by-side').appendChild(planEl);
    });

    container.innerHTML += '</div>';
}

function selectPlan(planId) {
    const destination = document.getElementById('destination').value;
    const budget = parseInt(document.getElementById('trip-budget').value);
    const duration = parseInt(document.getElementById('trip-duration').value);

    // Get the selected plan details
    const plans = generateRecommendations(destination, budget, duration);
    const selectedPlan = plans.find(plan => plan.id === planId);

    // In a real app, this would save the selected plan to the user's account
    state.currentTrip = {
        destination,
        budget,
        duration,
        planId,
        plan: selectedPlan,
        startDate: new Date(),
        status: 'planned'
    };

    // Update the trip info section
    updateTripInfo(selectedPlan);

    showNotification('Trip plan selected successfully!', 'success');
    updateCurrentJourney();
}

function updateTripInfo(plan) {
    const container = document.getElementById('selected-plan-info');
    container.innerHTML = `
                <h4>Selected Plan: ${plan.name}</h4>
                <p><strong>Remaining Budget:</strong> $${plan.budget}</p>
                <p><strong>Recommended Restaurants:</strong> ${plan.restaurants.join(', ')}</p>
                <p><strong>Recommended Tourist Spots:</strong> ${plan.touristSpots.join(', ')}</p>
                <p><strong>Hotels:</strong> ${plan.hotels.join(', ')}</p>
                <p><strong>Activities:</strong> ${plan.activities.join(', ')}</p>
            `;

    // Hide recommendations container
    document.getElementById('recommendations-container').innerHTML = '';
}

// Budget Management Functions
function initializeBudget() {
    const spent = state.budget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = state.budget.total - spent;
    const progress = state.budget.total > 0 ? (spent / state.budget.total) * 100 : 0;

    document.getElementById('spent-amount').textContent = spent.toFixed(2);
    document.getElementById('remaining-amount').textContent = remaining.toFixed(2);
    document.getElementById('budget-progress').style.width = `${progress}%`;

    // Update progress bar color based on spending
    if (progress > 80) {
        document.getElementById('budget-progress').style.background = 'var(--danger)';
    } else if (progress > 60) {
        document.getElementById('budget-progress').style.background = 'var(--warning)';
    } else {
        document.getElementById('budget-progress').style.background = 'var(--success)';
    }

    // Initialize budget chart if there are expenses
    if (state.budget.expenses.length > 0) {
        initializeBudgetChart();
    }
}

function setBudget() {
    const budgetInput = document.getElementById('total-budget');
    const newBudget = parseFloat(budgetInput.value);

    if (newBudget && newBudget > 0) {
        state.budget.total = newBudget;
        state.budget.daily = newBudget / 10; // Assuming a 10-day trip
        document.getElementById('daily-budget').textContent = state.budget.daily.toFixed(2);
        initializeBudget();
        showNotification(`Budget set to $${newBudget}`, 'success');
    } else {
        showNotification('Please enter a valid budget amount', 'error');
    }
}

function addExpense() {
    const category = document.getElementById('expense-category').value;
    const amountInput = document.getElementById('expense-amount');
    const descriptionInput = document.getElementById('expense-description');
    const amount = parseFloat(amountInput.value);
    const description = descriptionInput.value || `${category.charAt(0).toUpperCase() + category.slice(1)} expense`;

    if (amount && amount > 0) {
        const newExpense = {
            id: Date.now(),
            category,
            amount,
            description
        };

        state.budget.expenses.push(newExpense);
        amountInput.value = '';
        descriptionInput.value = '';
        renderExpenses();
        initializeBudget();
        initializeBudgetChart();

        // Check if budget is exceeded
        const spent = state.budget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        if (spent > state.budget.total) {
            showNotification('Budget exceeded! Consider adjusting your spending.', 'warning');
        } else {
            showNotification('Expense added successfully', 'success');
        }
    } else {
        showNotification('Please enter a valid expense amount', 'error');
    }
}

function editExpense(id) {
    const expense = state.budget.expenses.find(exp => exp.id === id);
    if (expense) {
        document.getElementById('expense-category').value = expense.category;
        document.getElementById('expense-amount').value = expense.amount;
        document.getElementById('expense-description').value = expense.description;
        state.editingExpenseId = id;
        showNotification('Editing expense. Update values and click Add to save changes.', 'success');
    }
}

function deleteExpense(id) {
    state.budget.expenses = state.budget.expenses.filter(exp => exp.id !== id);
    renderExpenses();
    initializeBudget();
    initializeBudgetChart();
    showNotification('Expense deleted successfully', 'success');
}

function renderExpenses() {
    const container = document.getElementById('expenses-container');
    container.innerHTML = '';

    if (state.budget.expenses.length === 0) {
        container.innerHTML = '<p>No expenses added yet.</p>';
        return;
    }

    state.budget.expenses.forEach(expense => {
        const expenseEl = document.createElement('div');
        expenseEl.className = 'expense-item';
        expenseEl.innerHTML = `
                    <div>
                        <strong>${expense.description}</strong>
                        <div style="font-size: 0.8rem; color: #6c757d;">${expense.category}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div>$${expense.amount.toFixed(2)}</div>
                        <div class="expense-actions">
                            <button class="btn-edit" onclick="editExpense(${expense.id})"><i class="fas fa-edit"></i></button>
                            <button class="btn-delete" onclick="deleteExpense(${expense.id})"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
        container.appendChild(expenseEl);
    });
}

function initializeBudgetChart() {
    const ctx = document.getElementById('budgetChart').getContext('2d');

    // Calculate category totals
    const categories = ['food', 'accommodation', 'transport', 'activities', 'shopping', 'miscellaneous'];
    const categoryTotals = categories.map(category => {
        return state.budget.expenses
            .filter(expense => expense.category === category)
            .reduce((sum, expense) => sum + expense.amount, 0);
    });

    // Destroy existing chart if it exists
    if (window.budgetChartInstance) {
        window.budgetChartInstance.destroy();
    }

    // Only create chart if there are expenses
    if (state.budget.expenses.length > 0) {
        window.budgetChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Food', 'Accommodation', 'Transport', 'Activities', 'Shopping', 'Miscellaneous'],
                datasets: [{
                    data: categoryTotals,
                    backgroundColor: [
                        '#4361ee',
                        '#3a0ca3',
                        '#4cc9f0',
                        '#f72585',
                        '#7209b7',
                        '#4cc9a7'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    } else {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px Arial';
        ctx.fillStyle = '#6c757d';
        ctx.textAlign = 'center';
        ctx.fillText('No expenses to display', ctx.canvas.width / 2, ctx.canvas.height / 2);
    }
}

// Group Coordination Functions
function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (message) {
        const newMessage = {
            sender: 'You',
            message: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'sent'
        };

        state.chatMessages.push(newMessage);
        renderChatMessages();
        input.value = '';

        // Call Gemini API for response
        getGeminiResponse(message);
    }
}

// Gemini AI Configuration
async function getGeminiResponse(userMessage) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        // maintain existing "group chat" feel by picking a random sender
        const randomSender = state.groupMembers[Math.floor(Math.random() * state.groupMembers.length)];

        const responseMessage = {
            sender: randomSender,
            message: aiResponse,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'received'
        };

        state.chatMessages.push(responseMessage);
        renderChatMessages();

    } catch (error) {
        console.error('Error fetching Gemini response:', error);
        // Fallback to simulation in case of error (e.g. invalid key) to ensure app doesn't break
        setTimeout(() => {
            const fallbackResponses = [
                "That sounds great!",
                "I'll be there in 10 minutes.",
                "Can't connect to the network right now.",
                "The weather is perfect today!"
            ];
            const responseMessage = {
                sender: state.groupMembers[Math.floor(Math.random() * state.groupMembers.length)],
                message: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'received'
            };
            state.chatMessages.push(responseMessage);
            renderChatMessages();
        }, 1000);
    }
}


function renderChatMessages() {
    const container = document.getElementById('chat-messages');
    container.innerHTML = '';

    state.chatMessages.forEach(msg => {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${msg.type}`;
        messageEl.innerHTML = `
                    <strong>${msg.sender}:</strong> ${msg.message}
                    <div style="font-size: 0.7rem; margin-top: 5px; opacity: 0.7;">${msg.time}</div>
                `;
        container.appendChild(messageEl);
    });

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function shareLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                showNotification(`Location shared with group: ${lat.toFixed(6)}, ${lng.toFixed(6)}`, 'success');

                // In a real app, this would send to the server
                state.chatMessages.push({
                    sender: 'System',
                    message: `You shared your location with the group`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'received'
                });
                renderChatMessages();
            },
            error => {
                showNotification('Unable to retrieve your location. Please check permissions.', 'error');
            }
        );
    } else {
        showNotification('Geolocation is not supported by this browser.', 'error');
    }
}

// Review Management Functions
function renderReviews(filter = 'all') {
    const container = document.getElementById('reviews-list');
    container.innerHTML = '';

    const filteredReviews = filter === 'all'
        ? state.reviews
        : state.reviews.filter(review => review.category === filter);

    if (filteredReviews.length === 0) {
        container.innerHTML = '<p>No reviews found for this category.</p>';
        return;
    }

    filteredReviews.forEach(review => {
        const reviewEl = document.createElement('div');
        reviewEl.className = 'review-card';
        reviewEl.innerHTML = `
                    <div class="review-image" style="background-image: url('${review.image}');"></div>
                    <div class="review-content">
                        <div class="review-meta">
                            <span>${review.place}</span>
                            <span>⭐ ${review.rating}</span>
                        </div>
                        <p>${review.comment}</p>
                        <div style="font-size: 0.8rem; color: #6c757d; margin-top: 0.5rem;">
                            By ${review.user} on ${new Date(review.date).toLocaleDateString()}
                        </div>
                    </div>
                `;
        container.appendChild(reviewEl);
    });
}

function filterReviews(category) {
    renderReviews(category);
}

function openAddReviewModal() {
    if (!state.user) {
        showNotification('Please login to add a review', 'warning');
        showAuthModal();
        return;
    }
    document.getElementById('addReviewModal').style.display = 'flex';
}

function closeAddReviewModal() {
    document.getElementById('addReviewModal').style.display = 'none';
    document.getElementById('image-preview').style.display = 'none';
}

function previewImage() {
    const file = document.getElementById('review-image').files[0];
    const preview = document.getElementById('image-preview');

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }

        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
}

function submitReview() {
    const place = document.getElementById('review-place').value;
    const category = document.getElementById('review-category').value;
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;
    const imageFile = document.getElementById('review-image').files[0];

    if (!place || !comment) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    let imageUrl = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'; // Default image

    // If user uploaded an image, create a URL for it
    if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
    }

    const newReview = {
        id: state.reviews.length + 1,
        place,
        category,
        rating: parseFloat(rating),
        comment,
        image: imageUrl,
        user: state.user ? state.user.name : 'Anonymous',
        date: new Date().toISOString().split('T')[0],
        location: state.currentTrip ? state.currentTrip.destination : 'Unknown'
    };

    state.reviews.unshift(newReview);
    renderReviews();
    closeAddReviewModal();
    showNotification('Review submitted successfully!', 'success');

    // Reset form
    document.getElementById('review-place').value = '';
    document.getElementById('review-comment').value = '';
    document.getElementById('review-image').value = '';
}

// Profile Functions
function showProfile() {
    if (!state.user) {
        showNotification('Please login to view your profile', 'warning');
        showAuthModal();
        return;
    }
    switchTab('profile');
    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
}

function updateCurrentJourney() {
    const container = document.getElementById('current-journey');

    if (state.currentTrip) {
        container.innerHTML = `
                    <div style="background: #f0f4ff; padding: 1.5rem; border-radius: 8px;">
                        <h4>Current Trip to ${state.currentTrip.destination}</h4>
                        <p><strong>Budget:</strong> $${state.currentTrip.budget}</p>
                        <p><strong>Duration:</strong> ${state.currentTrip.duration} days</p>
                        <p><strong>Status:</strong> ${state.currentTrip.status}</p>
                        <p><strong>Start Date:</strong> ${new Date(state.currentTrip.startDate).toLocaleDateString()}</p>
                        <button class="btn btn-primary" style="margin-top: 1rem;" onclick="switchTab('planning')">View Details</button>
                    </div>
                `;
    } else {
        container.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-suitcase-rolling" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;"></i>
                        <h4>No Active Journey</h4>
                        <p>Plan your next adventure to get started!</p>
                        <button class="btn btn-primary" style="margin-top: 1rem;" onclick="switchTab('planning')">Plan a Trip</button>
                    </div>
                `;
    }
}

// Safety Functions
function triggerSOS() {
    if (confirm('Are you sure you want to trigger emergency SOS? This will notify your emergency contacts and local authorities.')) {
        showNotification('SOS activated! Help is on the way. Your location has been shared with emergency services.', 'success');

        // In a real app, this would send emergency alerts
        state.chatMessages.push({
            sender: 'System',
            message: 'EMERGENCY SOS ACTIVATED - Help is on the way',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'received'
        });
        renderChatMessages();
    }
}

function showEmergencyContacts() {
    document.getElementById('emergencyContactsModal').style.display = 'flex';
}

function closeEmergencyContactsModal() {
    document.getElementById('emergencyContactsModal').style.display = 'none';
}

function checkCrowdAlerts() {
    const alerts = [
        'Beach area: High crowd expected today',
        'City center: Moderate crowd, normal traffic',
        'Mountain trail: Low crowd, perfect for hiking'
    ];

    showNotification('Crowd Alerts:\n\n' + alerts.join('\n'), 'success');
}

function manageLocationSharing() {
    showNotification('Location sharing settings opened. You can manage who can see your location here.', 'success');
}

// Utility Functions
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName + '-tab').classList.add('active');

    // Activate selected tab
    event.currentTarget.classList.add('active');

    // Special initialization for certain tabs
    if (tabName === 'budget') {
        initializeBudgetChart();
    } else if (tabName === 'group') {
        renderChatMessages();
    } else if (tabName === 'profile') {
        updateCurrentJourney();
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageEl = document.getElementById('notification-message');

    messageEl.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type);
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

function updateAlerts() {
    // Simulate real-time alert updates
    const alerts = document.querySelectorAll('.alert');
    if (alerts.length > 0) {
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        randomAlert.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            randomAlert.style.animation = '';
        }, 500);
    }
}

// Add some CSS animations
const style = document.createElement('style');
style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
        `;
document.head.appendChild(style);


// ===== LOGIN / SIGNUP MODAL LOGIC =====
const loginBtn = document.querySelector(".btn.btn-outline");
const signupBtn = document.querySelector(".btn.btn-primary");
const modal = document.getElementById("auth-modal");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

// Show login or signup modal
loginBtn.addEventListener("click", () => openModal("login"));
signupBtn.addEventListener("click", () => openModal("signup"));

function openModal(type) {
    modal.style.display = "flex";
    toggleAuth(type);
}

function closeModal() {
    modal.style.display = "none";
}

function toggleAuth(type) {
    if (type === "login") {
        loginForm.style.display = "block";
        signupForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
    }
}

// Close modal when clicking outside
window.onclick = function (e) {
    if (e.target == modal) {
        closeModal();
    }
};

// ===== SIGNUP FUNCTION =====
signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = this.querySelector('input[name="name"]').value.trim();
    const email = this.querySelector('input[name="email"]').value.trim();
    const password = this.querySelector('input[name="password"]').value;

    if (!name || !email || !password) {
        alert("Please fill out all fields.");
        return;
    }

    localStorage.setItem("dermaUser", JSON.stringify({ name, email, password }));
    alert("✅ Account created successfully! You can now log in.");
    toggleAuth("login");
    this.reset();
});

// ===== LOGIN FUNCTION =====
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = this.querySelector('input[name="email"]').value.trim();
    const password = this.querySelector('input[name="password"]').value;
    const storedUser = JSON.parse(localStorage.getItem("dermaUser"));

    if (!storedUser) {
        alert("⚠️ No account found. Please sign up first.");
        return;
    }

    if (email === storedUser.email && password === storedUser.password) {
        alert("🎉 Login successful! Welcome back, " + storedUser.name);
        closeModal();
        this.reset();
    } else {
        alert("❌ Incorrect email or password.");
    }
});

