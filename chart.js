/* =========================================================
   Smriti - Interactive Daily Score Bar Graph Engine
   Renders smooth, crisp, responsive canvas bar charts
   with tooltips, target guidelines, and dynamic metric filters.
   ========================================================= */

class CognitiveBarChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.activeFilter = 'overall'; // 'overall' | 'memory' | 'sequencing' | 'recognition' | 'garden'
    this.hoverIndex = -1;
    this.tooltipData = null;
    this.animationProgress = 1.0;

    this.initEvents();
  }

  initEvents() {
    // Handle responsive sizing
    window.addEventListener('resize', () => this.resizeAndDraw());

    // Mouse hover tooltips
    this.canvas.addEventListener('mousemove', (e) => this.handlePointer(e));
    this.canvas.addEventListener('mouseleave', () => {
      this.hoverIndex = -1;
      this.draw();
    });

    // Mobile touch support
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.handlePointer(e.touches[0]);
      }
    }, { passive: true });
  }

  setFilter(filterKey) {
    this.activeFilter = filterKey;
    this.animate();
  }

  animate() {
    let start = null;
    const duration = 400; // ms
    this.animationProgress = 0;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      this.animationProgress = Math.min(elapsed / duration, 1.0);
      // Ease out cubic
      this.animationProgress = 1 - Math.pow(1 - this.animationProgress, 3);
      this.draw();

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        this.animationProgress = 1.0;
        this.draw();
      }
    };
    requestAnimationFrame(step);
  }

  resizeAndDraw() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Set display size
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    // Set actual resolution in memory
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);

    this.draw();
  }

  getData() {
    const records = window.smritiData ? window.smritiData.getRecords() : [];
    // Take last 7 to 10 days
    const sliced = records.slice(-8);

    return sliced.map(rec => {
      let val = rec.averageScore || 0;
      if (this.activeFilter === 'memory') val = rec.memoryScore || 0;
      else if (this.activeFilter === 'sequencing') val = rec.sequencingScore || 0;
      else if (this.activeFilter === 'recognition') val = rec.recognitionScore || 0;
      else if (this.activeFilter === 'garden') val = rec.gardenScore || 0;

      return {
        label: rec.weekday + " " + (rec.date.split('-')[2] || ''),
        fullDate: rec.displayDate,
        value: val,
        mood: rec.mood || 'happy',
        completed: rec.gamesCompleted || 0,
        raw: rec
      };
    });
  }

  getColorTheme() {
    switch (this.activeFilter) {
      case 'memory':
        return { start: '#60a5fa', end: '#2563eb', stroke: '#93c5fd', name: 'Memory Pairs' };
      case 'sequencing':
        return { start: '#818cf8', end: '#4f46e5', stroke: '#c7d2fe', name: 'Routine Steps' };
      case 'recognition':
        return { start: '#fbbf24', end: '#d97706', stroke: '#fde68a', name: 'Object Recall' };
      case 'garden':
        return { start: '#34d399', end: '#059669', stroke: '#a7f3d0', name: 'Garden Focus' };
      default:
        return { start: '#38bdf8', end: '#0284c7', stroke: '#7dd3fc', name: 'Overall Cognitive Index' };
    }
  }

  handlePointer(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!this.barBounds) return;

    let found = -1;
    for (let i = 0; i < this.barBounds.length; i++) {
      const b = this.barBounds[i];
      if (x >= b.x && x <= b.x + b.width) {
        found = i;
        break;
      }
    }

    if (found !== this.hoverIndex) {
      this.hoverIndex = found;
      this.draw();
    }
  }

  draw() {
    if (!this.ctx || !this.canvas) return;

    const width = this.canvas.getBoundingClientRect().width;
    const height = this.canvas.getBoundingClientRect().height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    const data = this.getData();
    if (data.length === 0) return;

    const padLeft = 46;
    const padRight = 24;
    const padTop = 32;
    const padBottom = 40;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    // Draw horizontal grid lines & Y-axis labels
    const ySteps = [0, 25, 50, 75, 100];
    ctx.font = '500 11px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    ySteps.forEach(val => {
      const y = padTop + chartH - (val / 100) * chartH;
      
      // Grid line
      ctx.beginPath();
      ctx.strokeStyle = val === 75 ? 'rgba(52, 211, 153, 0.25)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = val === 75 ? 1.5 : 1;
      ctx.setLineDash(val === 75 ? [4, 4] : []);
      ctx.moveTo(padLeft, y);
      ctx.lineTo(width - padRight, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = val === 75 ? '#34d399' : '#94a3b8';
      ctx.fillText(val + '%', padLeft - 8, y);
    });

    // Baseline label
    ctx.fillStyle = 'rgba(52, 211, 153, 0.7)';
    ctx.textAlign = 'left';
    ctx.font = '600 10px system-ui, sans-serif';
    ctx.fillText('TARGET (75%)', padLeft + 6, padTop + chartH - (75 / 100) * chartH - 8);

    // Calculate Bar Layout
    const totalBars = data.length;
    const slotW = chartW / totalBars;
    const barW = Math.min(Math.max(slotW * 0.52, 28), 54);
    const theme = this.getColorTheme();

    this.barBounds = [];

    data.forEach((item, index) => {
      const x = padLeft + index * slotW + (slotW - barW) / 2;
      const targetH = (item.value / 100) * chartH;
      const currentH = Math.max(targetH * this.animationProgress, 4);
      const y = padTop + chartH - currentH;

      this.barBounds.push({ x, y, width: barW, height: currentH, data: item });

      // Create Bar Gradient
      const isHovered = this.hoverIndex === index;
      const grad = ctx.createLinearGradient(x, y, x, padTop + chartH);
      grad.addColorStop(0, isHovered ? '#ffffff' : theme.start);
      grad.addColorStop(1, theme.end);

      // Draw Rounded Bar
      ctx.beginPath();
      const radius = 6;
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barW - radius, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
      ctx.lineTo(x + barW, padTop + chartH);
      ctx.lineTo(x, padTop + chartH);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      ctx.fillStyle = grad;
      ctx.fill();

      // Glow / border on hover
      if (isHovered) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Bar Top Value Label
      ctx.fillStyle = isHovered ? '#ffffff' : '#e2e8f0';
      ctx.font = '700 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      if (currentH > 20) {
        ctx.fillText(item.value + '%', x + barW / 2, y - 4);
      }

      // X-Axis Day Label
      ctx.fillStyle = isHovered ? '#60a5fa' : '#94a3b8';
      ctx.font = isHovered ? '700 12px system-ui, sans-serif' : '500 11px system-ui, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(item.label, x + barW / 2, padTop + chartH + 10);
    });

    // Draw Tooltip if hovered
    if (this.hoverIndex >= 0 && this.barBounds[this.hoverIndex]) {
      const b = this.barBounds[this.hoverIndex];
      const item = b.data;

      const tipText1 = `${item.fullDate}: ${item.value}%`;
      const tipText2 = `Mood: ${item.mood.toUpperCase()} • ${item.completed}/4 games`;
      
      ctx.font = '600 12px system-ui, sans-serif';
      const textW = Math.max(ctx.measureText(tipText1).width, ctx.measureText(tipText2).width) + 24;
      const tipH = 46;
      
      let tipX = b.x + b.width / 2 - textW / 2;
      if (tipX < padLeft) tipX = padLeft;
      if (tipX + textW > width - padRight) tipX = width - padRight - textW;
      
      let tipY = b.y - tipH - 12;
      if (tipY < 4) tipY = b.y + 12;

      // Tooltip Card background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = theme.stroke;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(tipX, tipY, textW, tipH, 8);
      ctx.fill();
      ctx.stroke();

      // Tooltip Text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(tipText1, tipX + 12, tipY + 8);

      ctx.font = '400 11px system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(tipText2, tipX + 12, tipY + 26);
    }
  }
}

window.CognitiveBarChart = CognitiveBarChart;
