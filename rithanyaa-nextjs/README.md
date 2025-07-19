# Rithanyaa Store - Modern React & Next.js E-commerce Website

A stunning, modern e-commerce website built with React, Next.js, and Tailwind CSS featuring a beautiful **Forest Green** and **Gold** color scheme perfect for an Indian traditional silk saree store.

## ✨ Features

### 🎨 **Modern Design**
- **Forest Green (#2d5f2d)** as primary color
- **Gold (#f9c93c)** as secondary color
- Indian traditional aesthetic with modern UI/UX
- Responsive design for all devices
- Beautiful animations with Framer Motion

### 🛍️ **E-commerce Functionality**
- Product catalog with advanced filtering
- Category-wise product organization
- Search functionality
- Wishlist management
- Shopping cart (ready for integration)
- Product ratings and reviews

### 🏛️ **Collections**
- **Chettinad Silks** - Authentic handwoven silk sarees
- **Soft Sico** - Contemporary luxury silk collection
- **Ikath** - Traditional tie-dye technique sarees

### 🚀 **Technical Features**
- **Next.js 15** with App Router
- **React 19** with modern hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Heroicons** for beautiful icons
- **SEO Optimized** with metadata
- **Performance Optimized** images

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd E:/NJS_website/rithanyaa-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
rithanyaa-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── catalog/           # Catalog page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   └── components/            # React components
│       ├── layout/            # Layout components
│       │   ├── Header.tsx     # Navigation header
│       │   └── Footer.tsx     # Footer
│       └── ui/                # UI components
├── public/
│   └── images/                # Product images
│       ├── hero/              # Hero slideshow images
│       ├── products/          # Product photos
│       └── logos/             # Brand assets
├── tailwind.config.js         # Tailwind configuration
└── package.json
```

## 🎨 Design System

### Color Palette
```css
/* Primary - Forest Green */
--primary-50: #f0f9f0
--primary-500: #2d5f2d  /* Main forest green */
--primary-900: #122612

/* Secondary - Gold */
--secondary-50: #fffef7
--secondary-500: #f9c93c  /* Main gold */
--secondary-900: #92400e

/* Accent Colors */
--accent-maroon: #8B1538
--accent-cream: #FDF6E3
```

### Typography
- **Display Font**: Cinzel (Traditional headings)
- **Serif Font**: Playfair Display (Elegant headings)
- **Sans Font**: Inter (Body text)

## 📱 Pages & Features

### 🏠 **Homepage**
- Hero slideshow with product showcases
- Featured products grid
- Collections overview
- Trust indicators (shipping, quality, etc.)

### 🛍️ **Catalog Page**
- Advanced product filtering
- Category-based organization
- Search functionality
- Sorting options (price, rating, newest)
- Wishlist integration

### 🧵 **Collection Pages** (Planned)
- Chettinad Silks collection
- Soft Sico collection  
- Ikath collection
- About Us page

## 🔧 Customization

### Adding New Products
Edit the product data in `src/app/catalog/page.tsx`:

```typescript
const allProducts = [
  {
    id: 10,
    name: 'Your Product Name',
    price: 2999,
    originalPrice: 3500,
    image: '/images/products/your-image.jpg',
    category: 'your-category',
    // ... other properties
  }
]
```

### Modifying Colors
Update the color scheme in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#your-primary-color', // Change forest green
  },
  secondary: {
    500: '#your-secondary-color', // Change gold
  }
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 📈 Performance Features

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **SEO Optimization**: Complete metadata setup
- **Loading States**: Smooth transitions
- **Responsive Images**: Adaptive image loading

## 🛠️ Built With

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Heroicons](https://heroicons.com/) - Icons

## 📜 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Future Enhancements

- [ ] Shopping cart functionality
- [ ] User authentication
- [ ] Payment integration
- [ ] Order management
- [ ] Admin dashboard
- [ ] Product reviews system
- [ ] Multi-language support

## 📞 Support

For questions and support:
- Email: info@rithanyaa.store
- Phone: +91 12345 67890

---

**Made with ❤️ for traditional Indian textiles**