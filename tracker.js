// Progress Tracker JavaScript
// All data stored in localStorage

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadTrackerData();
  document.getElementById('entryDate').valueAsDate = new Date();
});

// Load and display data
function loadTrackerData() {
  const entries = getEntries();
  
  if (entries.length === 0) {
    return;
  }
  
  // Calculate stats
  const latestEntry = entries[entries.length - 1];
  const firstEntry = entries[0];
  const totalLost = firstEntry.weight - latestEntry.weight;
  const daysTracking = entries.length;
  
  // Update stat cards
  document.getElementById('currentWeight').textContent = `${latestEntry.weight}${latestEntry.unit}`;
  document.getElementById('totalLost').textContent = `${Math.abs(totalLost).toFixed(1)}${latestEntry.unit}`;
  document.getElementById('weightChange').textContent = totalLost > 0 ? `↓ ${totalLost.toFixed(1)}${latestEntry.unit} lost` : `↑ ${Math.abs(totalLost).toFixed(1)}${latestEntry.unit} gained`;
  document.getElementById('daysTracking').textContent = daysTracking;
  document.getElementById('streak').textContent = calculateStreak(entries);
  
  // Show milestones
  displayMilestones(totalLost, latestEntry.unit);
  
  // Render chart
  renderChart(entries);
  
  // Render history table
  renderHistory(entries);
}

// Get entries from localStorage
function getEntries() {
  const data = localStorage.getItem('glp1TrackerEntries');
  return data ? JSON.parse(data) : [];
}

// Save entries to localStorage
function saveEntries(entries) {
  localStorage.setItem('glp1TrackerEntries', JSON.stringify(entries));
}

// Handle form submission
document.getElementById('trackerForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const entry = {
    date: document.getElementById('entryDate').value,
    weight: parseFloat(document.getElementById('weight').value),
    unit: document.getElementById('weightUnit').value,
    waist: document.getElementById('waist').value || '--',
    sideEffects: document.getElementById('sideEffects').value,
    notes: document.getElementById('notes').value || '--',
    timestamp: Date.now()
  };
  
  const entries = getEntries();
  entries.push(entry);
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveEntries(entries);
  
  // Reset form
  document.getElementById('trackerForm').reset();
  document.getElementById('entryDate').valueAsDate = new Date();
  
  // Reload data
  loadTrackerData();
  
  alert('✅ Entry saved successfully!');
});

// Render weight chart
function renderChart(entries) {
  const chartContainer = document.getElementById('weightChart');
  
  if (entries.length === 0) {
    return;
  }
  
  // Take last 8 entries
  const recentEntries = entries.slice(-8);
  
  chartContainer.innerHTML = '';
  
  const maxWeight = Math.max(...recentEntries.map(e => e.weight));
  const minWeight = Math.min(...recentEntries.map(e => e.weight));
  const range = maxWeight - minWeight || 1;
  
  recentEntries.forEach((entry, index) => {
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    const height = ((entry.weight - minWeight) / range) * 200 + 50;
    bar.style.height = `${height}px`;
    
    const label = document.createElement('div');
    label.className = 'chart-bar-label';
    label.textContent = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    bar.appendChild(label);
    
    const value = document.createElement('div');
    value.className = 'chart-bar-value';
    value.textContent = `${entry.weight}${entry.unit}`;
    bar.appendChild(value);
    
    chartContainer.appendChild(bar);
  });
}

// Render history table
function renderHistory(entries) {
  const tbody = document.getElementById('historyBody');
  
  if (entries.length === 0) {
    return;
  }
  
  tbody.innerHTML = '';
  
  // Reverse to show newest first
  const reversedEntries = [...entries].reverse();
  
  reversedEntries.forEach((entry, index) => {
    const row = document.createElement('tr');
    
    // Calculate change from previous
    const prevEntry = entries[entries.length - 1 - index - 1];
    const change = prevEntry ? (prevEntry.weight - entry.weight).toFixed(1) : '--';
    const changeText = prevEntry ? (change > 0 ? `↓ ${change}` : change < 0 ? `↑ ${Math.abs(change)}` : '0') : '--';
    const changeColor = change > 0 ? '#059669' : change < 0 ? '#dc2626' : '#6b7280';
    
    row.innerHTML = `
      <td>${new Date(entry.date).toLocaleDateString()}</td>
      <td><strong>${entry.weight}${entry.unit}</strong></td>
      <td style="color: ${changeColor}; font-weight: 600;">${changeText}</td>
      <td>${entry.waist}${entry.waist !== '--' ? (entry.unit === 'kg' ? 'cm' : 'in') : ''}</td>
      <td>${entry.sideEffects}/10</td>
      <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${entry.notes}</td>
      <td><button onclick="deleteEntry(${entry.timestamp})" style="color: #ef4444; cursor: pointer; background: none; border: none; font-size: 1.2rem;">🗑️</button></td>
    `;
    
    tbody.appendChild(row);
  });
}

// Calculate streak
function calculateStreak(entries) {
  if (entries.length === 0) return 0;
  
  let streak = 1;
  for (let i = entries.length - 1; i > 0; i--) {
    const current = new Date(entries[i].date);
    const previous = new Date(entries[i - 1].date);
    const diffDays = Math.floor((current - previous) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// Display milestones
function displayMilestones(totalLost, unit) {
  const container = document.getElementById('milestones');
  container.innerHTML = '';
  
  const milestones = [
    { amount: 5, label: '🎉 First 5' },
    { amount: 10, label: '🏆 Double Digits!' },
    { amount: 15, label: '⭐ 15 Lost!' },
    { amount: 20, label: '💪 20 Achievement!' },
    { amount: 25, label: '🔥 Quarter Century!' },
    { amount: 30, label: '👑 30 Milestone!' }
  ];
  
  milestones.forEach(milestone => {
    if (totalLost >= milestone.amount) {
      const badge = document.createElement('span');
      badge.className = 'milestone-badge';
      badge.textContent = `${milestone.label} ${milestone.amount}${unit}`;
      container.appendChild(badge);
    }
  });
}

// Delete entry
function deleteEntry(timestamp) {
  if (!confirm('Are you sure you want to delete this entry?')) return;
  
  const entries = getEntries();
  const filtered = entries.filter(e => e.timestamp !== timestamp);
  saveEntries(filtered);
  loadTrackerData();
}

// Export data as "PDF" (actually formatted text)
function exportData() {
  const entries = getEntries();
  
  if (entries.length === 0) {
    alert('No data to export!');
    return;
  }
  
  let text = '=== GLP-1 PROGRESS TRACKER REPORT ===\n\n';
  text += `Generated: ${new Date().toLocaleDateString()}\n`;
  text += `Total Entries: ${entries.length}\n\n`;
  text += '--- PROGRESS DATA ---\n\n';
  
  entries.forEach(entry => {
    text += `Date: ${entry.date}\n`;
    text += `Weight: ${entry.weight}${entry.unit}\n`;
    text += `Waist: ${entry.waist}\n`;
    text += `Side Effects: ${entry.sideEffects}/10\n`;
    text += `Notes: ${entry.notes}\n`;
    text += '---\n\n';
  });
  
  // Create blob and download
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `glp1-tracker-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// Clear all data
function clearData() {
  if (!confirm('⚠️ Are you sure you want to delete ALL your tracking data? This cannot be undone!')) return;
  if (!confirm('⚠️ FINAL WARNING: All your progress data will be permanently deleted. Continue?')) return;
  
  localStorage.removeItem('glp1TrackerEntries');
  location.reload();
}


