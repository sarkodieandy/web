// Simple localStorage-backed check-in tracker
(function () {
  const STORAGE_KEY = "glp1_checkins_v1";

  const form = document.getElementById("checkinForm");
  const listEl = document.getElementById("ciList");
  const chartEl = document.getElementById("ciChart");

  const statHydration = document.getElementById("statHydration");
  const statProtein = document.getElementById("statProtein");
  const statNausea = document.getElementById("statNausea");
  const statWeightAvg = document.getElementById("statWeightAvg");
  const statCount = document.getElementById("statCount");
  const statAppetite = document.getElementById("statAppetite");

  const exportBtn = document.getElementById("exportCsv");

  // Init date default today
  const dateInput = document.getElementById("ciDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  function loadEntries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function toKg(weight, unit) {
    if (!weight) return null;
    return unit === "lbs" ? weight * 0.453592 : weight;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function renderList(entries) {
    if (!listEl) return;
    if (!entries.length) {
      listEl.innerHTML =
        '<div style="text-align: center; padding: 48px; color: #94a3b8;"><p style="font-size: 1.1rem; margin-bottom: 8px;">📋 No check-ins yet</p><p>Add your first entry above to start tracking patterns.</p></div>';
      return;
    }

    const items = entries
      .slice(-20)
      .reverse()
      .map((e) => {
        return `
          <div class="timeline-item">
            <div>
              <p class="eyebrow" style="color: #10b981; font-weight: 600;">${formatDate(e.date)}</p>
              <h4>${e.weight ? `⚖️ ${e.weight}${e.unit || "kg"}` : "--"} · 💧 ${e.hydration || 0}L · 🥩 ${e.protein || 0}g</h4>
              <p class="small">🤢 Nausea ${e.nausea || "-"} /5 · 🍽️ Appetite ${e.appetite || "-"} /5</p>
              ${e.notes ? `<p class="tiny" style="color:#64748b; margin-top:10px; padding: 12px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #10b981;"><strong>Notes:</strong> ${e.notes}</p>` : ""}
            </div>
          </div>
        `;
      })
      .join("");
    listEl.innerHTML = items;
  }

  function avg(arr) {
    const valid = arr.filter((n) => typeof n === "number" && !Number.isNaN(n));
    if (!valid.length) return null;
    return valid.reduce((a, b) => a + b, 0) / valid.length;
  }

  function summarize(entries) {
    const last7 = entries.slice(-7);
    const hydrationAvg = avg(last7.map((e) => e.hydration));
    const proteinAvg = avg(last7.map((e) => e.protein));
    const nauseaAvg = avg(last7.map((e) => e.nausea));
    const appetiteAvg = avg(last7.map((e) => e.appetite));
    const weightAvg = avg(last7.map((e) => e.weightKg));

    statHydration && (statHydration.textContent = hydrationAvg ? hydrationAvg.toFixed(1) : "--");
    statProtein && (statProtein.textContent = proteinAvg ? Math.round(proteinAvg) : "--");
    statNausea && (statNausea.textContent = nauseaAvg ? nauseaAvg.toFixed(1) : "--");
    statAppetite && (statAppetite.textContent = appetiteAvg ? appetiteAvg.toFixed(1) : "--");
    statWeightAvg && (statWeightAvg.textContent = weightAvg ? `${weightAvg.toFixed(1)} kg` : "--");

    // Calculate Streak
    const statStreak = document.getElementById("statStreak");
    if (statStreak) {
      const sortedDates = [...new Set(entries.map(e => e.date))].sort();
      let streak = 0;
      if (sortedDates.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const lastDate = sortedDates[sortedDates.length - 1];

        // Only count streak if latest entry is today or yesterday
        if (lastDate === today || lastDate === yesterday) {
          streak = 1;
          for (let i = sortedDates.length - 2; i >= 0; i--) {
            const curr = new Date(sortedDates[i]);
            const next = new Date(sortedDates[i + 1]);
            const diffTime = Math.abs(next - curr);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              streak++;
            } else {
              break;
            }
          }
        }
      }
      statStreak.textContent = `${streak} days`;
    }
  }

  function renderChart(entries) {
    if (!chartEl || !chartEl.getContext) return;
    const ctx = chartEl.getContext("2d");
    const last14 = entries.slice(-14);
    const labels = last14.map((e) => formatDate(e.date));
    const nausea = last14.map((e) => e.nausea || 0);
    const hydration = last14.map((e) => e.hydration || 0);

    const width = chartEl.width;
    const height = chartEl.height;
    ctx.clearRect(0, 0, width, height);

    function drawLine(data, color, maxValue) {
      if (!data.length) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      data.forEach((v, i) => {
        const x = (i / Math.max(data.length - 1, 1)) * (width - 40) + 20;
        const y = height - 20 - (Math.min(v, maxValue) / maxValue) * (height - 40);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const y = ((i + 1) / 5) * (height - 40) + 10;
      ctx.moveTo(20, y);
      ctx.lineTo(width - 20, y);
    }
    ctx.stroke();

    drawLine(nausea, "#f97316", 5); // nausea orange
    drawLine(hydration, "#10b981", 5); // hydration green
  }

  function handleExport(entries) {
    if (!entries.length) {
      alert("No entries to export yet.");
      return;
    }
    const header = ["date", "weight", "unit", "weightKg", "nausea", "hydration_L", "protein_g", "appetite", "notes"];
    const rows = entries.map((e) =>
      header
        .map((h) => {
          const val = e[h] ?? "";
          const safe = String(val).replace(/\"/g, '""');
          return `"${safe}"`;
        })
        .join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "glp1-checkins.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const entry = {
      date: document.getElementById("ciDate")?.value || new Date().toISOString().split("T")[0],
      weight: parseFloat(document.getElementById("ciWeight")?.value || ""),
      unit: document.getElementById("ciWeightUnit")?.value || "kg",
      nausea: parseFloat(document.getElementById("ciNausea")?.value || ""),
      hydration: parseFloat(document.getElementById("ciHydration")?.value || ""),
      protein: parseFloat(document.getElementById("ciProtein")?.value || ""),
      appetite: parseFloat(document.getElementById("ciAppetite")?.value || ""),
      notes: document.getElementById("ciNotes")?.value?.trim() || "",
    };
    entry.weightKg = toKg(entry.weight, entry.unit);

    const entries = loadEntries();
    entries.push(entry);
    saveEntries(entries);
    renderList(entries);
    summarize(entries);
    renderChart(entries);
    form.reset();
    // keep date today
    dateInput && (dateInput.value = new Date().toISOString().split("T")[0]);

    // Modern success notification
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 100px; right: 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; padding: 20px 28px; border-radius: 12px; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3); z-index: 10000; animation: slideInRight 0.4s ease;';
    notification.innerHTML = '✅ <strong>Check-in saved!</strong>';
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.4s ease';
      setTimeout(() => notification.remove(), 400);
    }, 2500);
  });

  exportBtn?.addEventListener("click", () => {
    const entries = loadEntries();
    handleExport(entries);
  });

  // Initial render
  const initialEntries = loadEntries();
  renderList(initialEntries);
  summarize(initialEntries);
  renderChart(initialEntries);
})();

