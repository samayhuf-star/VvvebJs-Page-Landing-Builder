# Modern Page Builder 🚀

A beautiful, modern page builder with excellent UI, drag-and-drop functionality, and smooth animations built on top of VvvebJs.

## Features ✨

### 🎨 Beautiful Modern UI
- Gradient-based design with smooth animations
- Clean, intuitive interface with modern color scheme
- Responsive layout that works on all devices
- Dark mode support

### 🖱️ Enhanced Drag & Drop
- Smooth visual feedback during dragging
- Animated drop indicators
- Component preview on hover
- Auto-scroll during drag operations
- Ghost effects for better visual feedback

### 🧩 Rich Component Library
- **Modern Hero Section** - Eye-catching hero sections with gradient backgrounds
- **Feature Cards** - Beautiful cards to showcase features
- **Pricing Cards** - Professional pricing tables
- **Call to Action** - Compelling CTA sections
- **Testimonials** - Customer testimonial cards
- **Stats Counters** - Animated statistics displays
- **Contact Forms** - Modern, styled contact forms
- **Image Grids** - Responsive image galleries
- **Team Members** - Team member cards with social links
- **Progress Bars** - Animated progress indicators

Plus all the standard VvvebJs components:
- Bootstrap 5 components
- HTML elements
- Embeds (YouTube, Maps, etc.)
- Widgets and more

### 🎭 Smooth Animations
- Fade-in effects for components
- Slide-in animations for panels
- Smooth transitions on all interactions
- Pulse effects during drag operations

### 💡 User Experience Enhancements
- Success notifications
- Loading indicators
- Breadcrumb navigation
- Tree view for page structure
- Real-time preview
- Undo/Redo functionality

## Getting Started 🏁

### Quick Start

1. **Open the Modern Builder**
   ```
   Open `modern-builder.html` in your web browser
   ```

2. **Start Building**
   - Drag components from the left panel onto the canvas
   - Click elements to select and edit them
   - Use the property panel to customize components
   - Save your work when done

### File Structure

```
VvvebJs-Page-Landing-Builder/
├── modern-builder.html              # Main modern page builder interface
├── css/
│   ├── editor.css                   # Base editor styles
│   └── modern-builder-theme.css     # Modern theme styles
├── libs/builder/
│   ├── components-modern.js         # Modern components library
│   └── modern-drag-feedback.js      # Enhanced drag & drop
├── demo/modern-landing/
│   ├── index.html                   # Modern landing page template
│   └── modern-landing.css           # Landing page styles
└── MODERN-BUILDER-README.md         # This file
```

## Usage Guide 📖

### Building Pages

1. **Add Sections**
   - Click the "Sections" tab in the left panel
   - Browse available sections
   - Drag and drop onto the canvas

2. **Add Components**
   - Click the "Components" tab
   - Find the component you need
   - Drag it to your desired location
   - Components will snap to valid drop zones

3. **Edit Components**
   - Click any element on the canvas to select it
   - Use the Properties panel to edit content and styles
   - Change text, colors, spacing, and more

4. **Organize Structure**
   - Use the Navigator panel to see page structure
   - Drag elements in the tree to reorder
   - Click breadcrumbs to navigate parent elements

### Keyboard Shortcuts ⌨️

- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- `Ctrl/Cmd + S` - Save page
- `F11` - Fullscreen mode
- `Ctrl/Cmd + Shift + N` - Toggle navigator

### Design Tips 💎

1. **Start with a Hero Section**
   - Drag the "Modern Hero" component first
   - Set an eye-catching gradient background
   - Add a clear call-to-action

2. **Use Feature Cards**
   - Showcase key features with "Feature Card" components
   - Keep descriptions concise and compelling
   - Use consistent icon styles

3. **Add Social Proof**
   - Include testimonials to build trust
   - Display stats with counter components
   - Show team members for credibility

4. **Strong Call-to-Action**
   - End with a "Call to Action" section
   - Make buttons prominent and clear
   - Offer multiple contact options

## Customization 🎨

### Theme Colors

The modern builder uses CSS variables that can be customized in `css/modern-builder-theme.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --primary-color: #667eea;
    --primary-dark: #5568d3;
    --secondary-color: #764ba2;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* ... more variables */
}
```

### Adding Custom Components

Create new components in `libs/builder/components-modern.js`:

```javascript
Vvveb.Components.extend("_base", "custom/component-name", {
    name: "Component Name",
    image: "icons/icon.svg",
    classes: ["custom-class"],
    html: `
        <div class="custom-component">
            <!-- Your HTML here -->
        </div>
    `,
    properties: [
        // Define editable properties
    ]
});
```

## Components Reference 📚

### Modern Hero

Full-width hero section with gradient background, heading, description, and CTA buttons.

**Properties:**
- Background gradient
- Heading text
- Description text
- Button links

### Feature Card

Card component for showcasing features with icon, title, and description.

**Properties:**
- Icon (using Line Awesome icons)
- Title
- Description
- Background color

### Pricing Card

Professional pricing table with plan details and CTA button.

**Properties:**
- Plan name
- Price
- Features list
- Button text and link

### Call to Action

Full-width CTA section with heading, description, and action buttons.

**Properties:**
- Heading
- Description
- Button texts and links
- Background gradient

### Testimonial

Customer testimonial card with rating, quote, author name, and photo.

**Properties:**
- Rating (star count)
- Testimonial text
- Author name
- Author title
- Author photo

### Stats Counter

Animated number display for showing statistics.

**Properties:**
- Number value
- Label text
- Color scheme

### Contact Form

Modern styled contact form with name, email, and message fields.

**Properties:**
- Form title
- Field labels
- Submit button text
- Action URL

### Image Grid

Responsive grid layout for displaying multiple images.

**Properties:**
- Grid columns (1-4)
- Image URLs
- Border radius
- Spacing

### Team Member

Team member card with photo, name, role, and social links.

**Properties:**
- Photo URL
- Name
- Role/Title
- Social links (Twitter, LinkedIn, GitHub)

### Progress Bar

Animated progress indicator with label and percentage.

**Properties:**
- Label text
- Percentage value
- Bar color

## Technical Details 🔧

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

### Dependencies

- jQuery 3.x
- Bootstrap 5.x
- Line Awesome icons
- VvvebJs core

### Performance

- Optimized CSS animations
- Lazy loading for components
- Efficient DOM manipulation
- Smooth 60fps animations

## Saving & Exporting 💾

### Save Page

1. Click the "Save" button in the top toolbar
2. Page is saved via AJAX to `save.php`
3. Success notification appears

### Export HTML

1. Click the "Download" button
2. Clean HTML is generated
3. File downloads automatically

### Export Options

- **HTML Only** - Just the page HTML
- **With Assets** - Include CSS and images
- **Production Ready** - Minified and optimized

## Troubleshooting 🔍

### Components not dragging

- Ensure JavaScript is enabled
- Check browser console for errors
- Try refreshing the page

### Styles not applying

- Clear browser cache
- Check that CSS files are loaded
- Verify file paths are correct

### Save not working

- Check `save.php` permissions
- Verify server configuration
- Check browser console for errors

## Best Practices ✅

1. **Structure First** - Plan your page structure before adding content
2. **Consistent Spacing** - Use consistent padding and margins
3. **Responsive Design** - Test on multiple screen sizes
4. **Performance** - Don't overload pages with too many components
5. **Accessibility** - Use semantic HTML and proper alt text
6. **SEO** - Add proper headings and meta information

## Advanced Features 🚀

### Custom CSS

Add custom styles in the Styles tab:
```css
.custom-class {
    /* Your styles */
}
```

### Custom JavaScript

Add custom scripts at the end of your page:
```javascript
<script>
    // Your code here
</script>
```

### Responsive Breakpoints

Test different screen sizes:
- Mobile: 375px
- Tablet: 768px
- Desktop: 1200px

Use the viewport buttons in the toolbar to switch between views.

## Support & Resources 📚

- **Documentation**: [VvvebJs Docs](https://www.vvveb.com/docs/)
- **GitHub**: [VvvebJs Repository](https://github.com/givanz/VvvebJs)
- **Issues**: Report bugs on GitHub
- **Community**: Join the Discord community

## Credits 👏

Built with:
- **VvvebJs** - The core page builder framework
- **Bootstrap 5** - UI components and grid system
- **Line Awesome** - Icon library
- **AOS** - Animate on scroll library

## License 📄

This project uses VvvebJs which is licensed under the Apache 2.0 License.

---

## Quick Tips 💡

1. **Use Gradients** - Modern designs love gradients! The primary gradient is available in all modern components.

2. **Hover Effects** - All components have built-in hover effects for better user engagement.

3. **Consistent Colors** - Stick to the primary color palette for a cohesive design.

4. **White Space** - Don't be afraid of white space - it makes designs breathe.

5. **Mobile First** - Always check mobile view to ensure responsiveness.

6. **Call to Action** - Every section should guide users to take action.

7. **Visual Hierarchy** - Use size and color to create clear visual hierarchy.

---

**Happy Building! 🎉**

Create amazing websites with the Modern Page Builder. Start simple, iterate, and make it beautiful!
