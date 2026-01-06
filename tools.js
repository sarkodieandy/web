// Protein Calculator
function calculateProtein() {
  const weight = parseFloat(document.getElementById('weight').value);
  const unit = document.getElementById('weightUnit').value;
  const activity = parseFloat(document.getElementById('activity').value);
  
  if (!weight || weight <= 0) {
    alert('Please enter a valid weight');
    return;
  }
  
  // Convert to kg if needed
  const weightKg = unit === 'lbs' ? weight * 0.453592 : weight;
  
  // Calculate protein: 1.6-2.2g per kg body weight adjusted for activity
  const baseProtein = weightKg * 1.6;
  const proteinGrams = Math.round(baseProtein * activity);
  
  // Calculate per-meal amount (assuming 5 meals)
  const perMeal = Math.round(proteinGrams / 5);
  
  // Display results
  document.getElementById('proteinValue').textContent = `${proteinGrams}g per day`;
  document.getElementById('proteinDetails').innerHTML = `
    <strong>Per meal (5 meals):</strong> ~${perMeal}g protein<br>
    <strong>Your weight:</strong> ${weight} ${unit}<br>
    <strong>Recommendation:</strong> ${Math.round(weightKg * 1.6)}-${Math.round(weightKg * 2.2)}g protein daily
  `;
  document.getElementById('proteinResult').classList.add('show');
}

// Hydration Calculator
function calculateHydration() {
  const weight = parseFloat(document.getElementById('hydrationWeight').value);
  const unit = document.getElementById('hydrationUnit').value;
  const exercise = parseInt(document.getElementById('hydrationActivity').value);
  
  if (!weight || weight <= 0) {
    alert('Please enter a valid weight');
    return;
  }
  
  // Convert to kg if needed
  const weightKg = unit === 'lbs' ? weight * 0.453592 : weight;
  
  // Calculate: 30-35ml per kg + exercise bonus
  const baseWater = weightKg * 35;
  const totalWaterMl = Math.round(baseWater + exercise);
  const totalWaterOz = Math.round(totalWaterMl / 29.5735);
  const totalWaterLitres = (totalWaterMl / 1000).toFixed(1);
  
  // Display results
  document.getElementById('hydrationValue').textContent = `${totalWaterLitres}L / ${totalWaterOz} fl oz`;
  document.getElementById('hydrationDetails').innerHTML = `
    <strong>Minimum:</strong> ${(baseWater / 1000).toFixed(1)}L (${Math.round(baseWater / 29.5735)} fl oz)<br>
    <strong>With exercise bonus:</strong> +${exercise}ml (+${Math.round(exercise / 29.5735)} fl oz)<br>
    <strong>Tip:</strong> Sip 200-300ml (7-10 fl oz) every 1-2 hours
  `;
  document.getElementById('hydrationResult').classList.add('show');
}

// Meal Timing Planner
function planMeals() {
  const wakeTime = document.getElementById('wakeTime').value;
  const sleepTime = document.getElementById('sleepTime').value;
  const mealCount = parseInt(document.getElementById('mealCount').value);
  
  if (!wakeTime || !sleepTime) {
    alert('Please enter wake and sleep times');
    return;
  }
  
  // Convert times to minutes
  const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
  const [sleepHour, sleepMin] = sleepTime.split(':').map(Number);
  
  let wakeMinutes = wakeHour * 60 + wakeMin;
  let sleepMinutes = sleepHour * 60 + sleepMin;
  
  // Handle overnight sleep
  if (sleepMinutes < wakeMinutes) {
    sleepMinutes += 24 * 60;
  }
  
  const awakeMinutes = sleepMinutes - wakeMinutes;
  const mealInterval = awakeMinutes / (mealCount - 1);
  
  let schedule = '<div style="line-height: 2;">';
  const mealNames = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Evening Snack'];
  
  for (let i = 0; i < mealCount; i++) {
    const mealTime = wakeMinutes + (mealInterval * i);
    const hour = Math.floor(mealTime / 60) % 24;
    const min = Math.round(mealTime % 60);
    const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    
    const mealName = mealNames[i] || `Meal ${i + 1}`;
    schedule += `<strong>${mealName}:</strong> ${timeStr}<br>`;
  }
  
  schedule += '</div>';
  schedule += `<p style="margin-top: 16px; font-size: 0.9rem; color: #065f46;">
    <strong>Remember:</strong> Eat slowly, chew thoroughly, and stop when comfortably satisfied. 
    Each meal should take 20-30 minutes.
  </p>`;
  
  document.getElementById('mealSchedule').innerHTML = schedule;
  document.getElementById('mealResult').classList.add('show');
}

// NEW: Food-to-Relief Smart Matcher Logic
function matchReliefFood() {
  const symptom = document.getElementById('symptomSelect').value;
  const content = document.getElementById('reliefContent');
  const resultBox = document.getElementById('reliefResult');
  
  if (!symptom) {
    resultBox.classList.remove('show');
    return;
  }
  
  const reliefMap = {
    nausea: {
      title: "Nausea Relief Pack",
      foods: ["Cold ginger tea", "Plain crackers", "Green apples", "Protein-water (sip slowly)", "Peppermint mints"],
      tip: "Avoid warm, heavy, or fatty foods. Stick to 'cold and bland'."
    },
    reflux: {
      title: "Reflux Management",
      foods: ["Papaya (natural enzymes)", "Oatmeal", "Melon", "Ginger", "Almond milk"],
      tip: "Stay upright for 2 hours after eating. Avoid mint, chocolate, and citrus."
    },
    constipation: {
      title: "Digestion Support",
      foods: ["Chia seeds (soaked)", "Kiwi fruit", "Magnesium-rich foods", "Warm lemon water", "Flaxseed"],
      tip: "Ensure you are hitting your hydration target before increasing fiber."
    },
    fatigue: {
      title: "Energy Boosters",
      foods: ["Hard-boiled eggs", "Greek yogurt", "Electrolyte water", "B-Vitamin rich turkey", "Handful of almonds"],
      tip: "Fatigue is often dehydration or low protein. Check your daily logs."
    },
    aversion: {
      title: "Cold Food Strategy",
      foods: ["Cottage cheese", "Cold chicken strips", "Protein smoothies", "Chilled cucumber with salt", "Greek yogurt bowls"],
      tip: "When hot food smells are too much, chilled protein is your best friend."
    }
  };
  
  const selected = reliefMap[symptom];
  document.getElementById('reliefTitle').textContent = selected.title;
  content.innerHTML = `
    <ul style="margin: 12px 0; padding-left: 20px; line-height: 1.8;">
      ${selected.foods.map(f => `<li><strong>${f}</strong></li>`).join('')}
    </ul>
    <p style="background: rgba(16, 185, 129, 0.1); padding: 12px; border-radius: 6px; font-size: 0.9rem;">
      💡 <strong>Expert Tip:</strong> ${selected.tip}
    </p>
  `;
  resultBox.classList.add('show');
}

// NEW: GLP-1 Routine Assessment Quiz Logic
function calculateQuiz() {
  const q1 = parseInt(document.getElementById('q1').value);
  const q2 = parseInt(document.getElementById('q2').value);
  const q3 = parseInt(document.getElementById('q3').value);
  
  const total = q1 + q2 + q3;
  const resultBox = document.getElementById('quizResult');
  const valueBox = document.getElementById('quizValue');
  const feedback = document.getElementById('quizFeedback');
  const tips = document.getElementById('quizTips');
  
  valueBox.textContent = `${total} / 60`;
  
  if (total <= 20) {
    feedback.textContent = "Needs Attention ⚠️";
    feedback.style.color = "#ef4444";
    tips.innerHTML = "Priority 1: Increase protein. Priority 2: Add daily electrolytes to prevent headaches.";
  } else if (total <= 40) {
    feedback.textContent = "Getting There! 👍";
    feedback.style.color = "#fbbf24";
    tips.innerHTML = "You're on the right track. Try adding 2 days of resistance training to protect your metabolic health.";
  } else {
    feedback.textContent = "GLP-1 Pro! 🌟";
    feedback.style.color = "#10b981";
    tips.innerHTML = "Excellent habits! You are optimizing for long-term health and muscle preservation.";
  }
  
  resultBox.classList.add('show');
}

