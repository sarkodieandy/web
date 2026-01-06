document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Date & Greeting
    const updateHeader = () => {
        const now = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);

        const hour = now.getHours();
        const greeting = document.getElementById('greeting');
        if (hour < 12) greeting.textContent = 'Good morning,';
        else if (hour < 18) greeting.textContent = 'Good afternoon,';
        else greeting.textContent = 'Good evening,';
    };
    updateHeader();

    // 2. LocalStorage Helper
    const getData = (key, defaultVal) => JSON.parse(localStorage.getItem(key)) || defaultVal;
    const setData = (key, val) => localStorage.setItem(key, JSON.stringify(val));

    // 3. Water Tracker Logic
    let waterCount = getData('water_today', 0);
    const waterFill = document.getElementById('waterFill');
    const waterLabel = document.getElementById('waterCount');
    const snapWater = document.getElementById('snapWater');
    const waterBtns = document.querySelectorAll('.water-btn');

    const updateWaterUI = () => {
        waterLabel.textContent = waterCount;
        if (snapWater) snapWater.textContent = waterCount;
        waterFill.style.width = `${(waterCount / 8) * 100}%`;
        waterBtns.forEach((btn, idx) => {
            if (idx < waterCount) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    };

    waterBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            waterCount = idx + 1;
            setData('water_today', waterCount);
            updateWaterUI();
        });
    });
    updateWaterUI();

    // 4. Daily Check-In Mood Logic
    const moodBtns = document.querySelectorAll('.mood-btn');
    const checkInDetails = document.querySelector('.check-in-details');

    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            checkInDetails.style.display = 'block';
            checkInDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });

    document.getElementById('saveCheckIn').addEventListener('click', () => {
        const mood = document.querySelector('.mood-btn.active').dataset.mood;
        const energy = document.getElementById('energySlider').value;
        const appetite = document.getElementById('appetiteSlider').value;

        setData('last_checkin', {
            date: new Date().toDateString(),
            mood, energy, appetite
        });

        alert('Habits logged for today! Keep it up.');
        checkInDetails.style.display = 'none';
        document.querySelector('.status-dot').style.background = 'var(--brand)';
    });

    // 5. Weight Progress Chart
    const ctx = document.getElementById('weightChart').getContext('2d');
    const weightData = getData('weight_history', [195, 194, 194.5, 193, 192]);

    const weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Lifestyle Awareness (Neutral Trend)',
                data: weightData,
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { display: false },
                x: { display: true, grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // 6. Motivation Engine
    const quotes = [
        "“Your journey is unique. Honor your pace today.”",
        "“Small habits are the foundation of big shifts.”",
        "“Listen to your body; it knows the way.”",
        "“Consistency is a quiet, steady rhythm.”",
        "“You are doing better than you think.”"
    ];
    const motivationQuote = document.getElementById('motivationQuote');
    if (motivationQuote) {
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        motivationQuote.textContent = quotes[dayOfYear % quotes.length];
    }

    // 7. Meal Generator Mock-up
    const mealBtn = document.getElementById('generateMealBtn');
    const mealDisplay = document.getElementById('dashboardMealIdeas');
    const mealIdeas = [
        "Lean protein wrap with cucumber slices",
        "Small bowl of Greek yogurt with berries",
        "Roasted vegetables with grilled tofu",
        "Clear broth soup with soft carrots",
        "Cottage cheese with a few almond slivers"
    ];

    if (mealBtn) {
        mealBtn.addEventListener('click', () => {
            mealDisplay.innerHTML = `<ul class="lifestyle-list">
                ${mealIdeas.sort(() => 0.5 - Math.random()).slice(0, 3).map(m => `<li>${m}</li>`).join('')}
            </ul>`;
        });
    }

    // 8. Reset Logic (Daily)
    const lastVisit = localStorage.getItem('last_visit');
    const today = new Date().toDateString();

    let streakCount = getData('streak_count', 0);
    if (lastVisit !== today) {
        if (lastVisit === new Date(Date.now() - 86400000).toDateString()) {
            streakCount++;
        } else if (lastVisit) {
            streakCount = 1;
        } else {
            streakCount = 1;
        }
        setData('streak_count', streakCount);
        localStorage.setItem('water_today', 0);
        localStorage.setItem('last_visit', today);
        waterCount = 0;
        updateWaterUI();
    }

    const miniStreak = document.getElementById('miniStreak');
    const fullStreak = document.getElementById('fullStreak');
    const snapStreak = document.getElementById('snapStreak');
    if (miniStreak) miniStreak.textContent = streakCount;
    if (fullStreak) fullStreak.textContent = `${streakCount} Days`;
    if (snapStreak) snapStreak.textContent = streakCount;

    // 9. Weight Snapshot
    const snapWeight = document.getElementById('snapWeight');
    if (snapWeight && weightData.length > 0) {
        snapWeight.textContent = `${weightData[weightData.length - 1]} lbs`;
    }
});
