# Developer Portfolio Template

A responsive and modern portfolio website template for developers and designers. This template is designed to serve as a stylish placeholder while you work on your actual portfolio content.

## Features

- Clean, modern design with smooth animations
- Fully responsive layout that works on all devices
- Single-page design with smooth scrolling
- Sections for About, Projects, Skills, and Contact
- Project filtering by category
- Skills visualization with animated progress bars
- Contact form (for demonstration - needs backend implementation)
- Social media links integration

## Structure

```
portfolio/
├── index.html         # Main HTML file
├── css/               # Stylesheet folder
│   └── styles.css     # Main CSS file
├── js/                # JavaScript folder
│   └── main.js        # Main JS file
├── images/            # Add your own images here
└── README.md          # This file
```

## How to Use

1. Customize the content in `index.html` with your own information
2. Replace the placeholder emojis with actual images in the `images` directory
3. Update the colors in `css/styles.css` to match your personal brand
4. Add your own projects to the Projects section
5. Update the Skills section with your actual skills and proficiency levels
6. Add your contact details and social media links

## Customization

### Colors

You can easily change the color scheme by modifying the CSS variables at the top of the `styles.css` file:

```css
:root {
    --primary-color: #6c63ff;    /* Main color */
    --secondary-color: #f50057;   /* Accent color */
    --accent-color: #00bfa6;      /* Highlight color */
    --dark-color: #2d2d2d;        /* Dark backgrounds */
    --light-color: #f4f4f4;       /* Light backgrounds */
    --text-color: #333;           /* Main text */
    --text-light: #777;           /* Secondary text */
}
```

### Adding Projects

To add more projects, copy the project card HTML structure in the Projects section and customize it with your project details.

### Contact Form

Note that the contact form is currently set up for demonstration purposes only. To make it functional, you'll need to implement a backend solution or integrate a form submission service.

## Deployment

This is a static website that can be deployed on any web hosting service, including:

- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Firebase Hosting
- Any traditional web hosting provider

## Credits

- Font Awesome for icons
- Google Fonts for typography
- Unsplash for background image placeholder

## License

Feel free to use this template for your personal portfolio. Attribution is appreciated but not required.