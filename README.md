# Benne Website Redesign

A modern, responsive website for Benne - an urban South Indian café in Bangalore.

## 🌐 Live Preview

Open `index.html` in your browser, or serve it locally:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

Then visit: http://localhost:8000

## 📁 Project Structure

```
benne-website/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles (design system + components)
├── js/
│   └── main.js         # Interactive functionality
└── images/             # Image assets (placeholder folder)
```

## ✨ Features

- **Responsive Design** - Mobile-first, works on all devices
- **Smooth Animations** - Scroll reveals, hover effects
- **Design System** - Consistent colors, typography, spacing
- **Forms** - Reservation & newsletter with validation
- **Accessibility** - Semantic HTML, keyboard navigation

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary | `#4A3728` (Benne Brown) |
| Accent | `#D4A84B` (Dosa Gold) |
| Background | `#FAF7F2` (Coconut White) |
| Font Headings | Playfair Display |
| Font Body | DM Sans |

## 📱 Sections

1. Hero - Brand introduction + CTAs
2. About - Brand story teaser
3. Menu - Featured items carousel
4. Locations - Multiple venue cards
5. Reviews - Social proof
6. Gallery - Instagram preview grid
7. Offers - Promotional cards
8. Reservation - Table booking form
9. Newsletter - Email signup
10. Footer - Links & contact

## 🔜 Next Steps

- [ ] Replace emoji placeholders with real food photography
- [ ] Connect reservation form to backend (Resy/Dineout)
- [ ] Add online ordering integration
- [ ] Implement lazy loading for images
- [ ] Add schema markup for SEO
- [ ] Set up analytics (GA4)

## 📝 Notes

- Hero uses CSS gradient animation (replace with actual imagery)
- Gallery grid uses placeholder colors (replace with photos)
- Forms show alerts (replace with proper backend)
- All copy is original - designed per brand strategy

---

Built with ❤️ for Benne | Bangalore
