# GLP-1 Care Companion

A comprehensive, non-medical health support website for adults using GLP-1 medications. This website provides evidence-based information, practical strategies, and tracking resources to help users manage their GLP-1 journey.

## 🌟 Features

- **Comprehensive Information Hub**: Detailed guides on nausea management, hydration, muscle protection, and nutrition
- **Mobile-Responsive Design**: Optimized for all devices (phones, tablets, desktops)
- **Harvard-Inspired UI**: Clean, trustworthy, and accessible design
- **Search Functionality**: Quick navigation to relevant topics
- **Ad-Monetized**: Google AdSense integration for sustainable operation
- **Dual-Unit Support**: Imperial and metric units for American and European users
- **Animated Sliders**: Engaging image carousels with auto-rotation
- **Accessibility**: WCAG-friendly design with keyboard navigation

## 📱 Pages

- **Home** (`index.html`) - Landing page with overview and quick links
- **GLP-1 Updates** (`updates.html`) - Latest playbooks and safety information
- **Nausea-Smart Eating** (`eating.html`) - Dietary strategies and meal planning
- **Hydration Strategy** (`hydration.html`) - Comprehensive hydration guide
- **Muscle & Metabolic Health** (`muscle.html`) - Strength training and protein guidance
- **Easy Protein Recipes** (`recipes.html`) - Simple, GLP-1-friendly recipes

## 🚀 Quick Start

### Local Development

1. Clone this repository:
```bash
git clone https://github.com/YOUR_USERNAME/glp1-care-companion.git
cd glp1-care-companion
```

2. Open `index.html` in your browser:
```bash
open index.html
# or
python -m http.server 8000
# then visit http://localhost:8000
```

### Deployment

This is a static website that can be deployed to:

- **Cloudflare Pages** (recommended - fast, free, global CDN)
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Any static hosting service**

#### Cloudflare Pages Deployment (Recommended)

**Option 1: Via Cloudflare Dashboard (Easiest)**

1. Push your code to GitHub (see instructions below)
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Click **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
4. Select your GitHub repository
5. Configure build settings:
   - **Project name**: `glp1-care-companion`
   - **Production branch**: `main`
   - **Build command**: Leave empty (no build needed)
   - **Build output directory**: `/` (root)
6. Click **Save and Deploy**

Your site will be live at: `https://glp1-care-companion.pages.dev`

**Option 2: Via Wrangler CLI**

```bash
# Install Wrangler globally (one time)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy directly from your local directory
npx wrangler pages deploy . --project-name=glp1-care-companion
```

#### GitHub Pages Deployment

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "Deploy from a branch"
4. Choose `main` branch and `/root` folder
5. Click "Save"
6. Your site will be live at `https://YOUR_USERNAME.github.io/glp1-care-companion/`

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom styling with CSS variables
- **Vanilla JavaScript** - No frameworks, pure JS
- **Google AdSense** - Monetization
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
glp1-care-companion/
├── index.html          # Landing page
├── updates.html        # GLP-1 updates & playbooks
├── eating.html         # Nausea-smart eating guide
├── hydration.html      # Hydration strategies
├── muscle.html         # Muscle & metabolic health
├── recipes.html        # Protein recipes
├── style.css           # Global styles
├── app.js              # Interactive functionality
└── README.md           # This file
```

## 🎨 Customization

### Colors

Edit CSS variables in `style.css`:

```css
:root {
  --bg: #f8fbff;
  --ink: #0f172a;
  --muted: #475569;
  --line: #e2e8f0;
  --brand: #0ea5e9;
  --brand-2: #10b981;
  --shell: 1180px;
}
```

### Content

All content is in HTML files and can be edited directly. Each page follows a consistent structure:

- Hero section with slider
- Main content sections
- Ad slots
- Footer

### AdSense

Replace the publisher ID in all HTML files:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
     crossorigin="anonymous"></script>
```

## 📊 Google AdSense Setup

1. Sign up at [Google AdSense](https://www.google.com/adsense/)
2. Add your website
3. Get your publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)
4. Replace the publisher ID in all HTML files
5. Add the AdSense code snippet to your site
6. Wait for approval (typically 1-2 weeks)

### Ad Placement

The site includes responsive ad slots at:
- Below hero sections
- Between content sections
- In sidebars (desktop)
- Bottom of pages

## 🔒 Compliance & Legal

This website is designed to be:

- **Non-medical**: No medical advice, diagnoses, or treatment recommendations
- **Educational**: Information and support only
- **Safe**: Clear disclaimers and safety warnings
- **Privacy-focused**: No personal health data collection

**Important**: Always include proper disclaimers and consult with legal counsel before launching a health-related website.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

- Semantic HTML5
- ARIA labels where needed
- Keyboard navigation support
- Color contrast WCAG AA compliant
- Reduced motion support
- Screen reader friendly

## 📈 SEO Optimization

- Semantic HTML structure
- Meta descriptions (add to each page)
- Alt text for images (add when using real images)
- Fast load times
- Mobile-responsive
- Clean URLs

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This website provides general information and support for individuals using GLP-1 medications. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🙏 Acknowledgments

- Design inspired by Harvard T.H. Chan School of Public Health Nutrition Source
- Built with accessibility and user experience in mind
- Community-driven content and feedback

---

**Made with ❤️ for the GLP-1 community**

