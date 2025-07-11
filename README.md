# Valipokkann's Personal Artist Website

A modern, responsive personal website for artist Valipokkann, built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Art gallery with interactive image rotation and video support
- 📸 Photography gallery with lazy loading
- 📝 Blog-style articles with markdown support
- 🎵 Music section
- 🌓 Dark mode by default (light mode optional)
- 🌐 Responsive design for all devices
- 🎮 Easter eggs (Konami code)
- 💫 Smooth page transitions
- 📱 PWA-ready
- 🔍 SEO optimized
- 🖼️ Image optimization and lazy loading
- 📚 Thirukkural section with chapter navigation

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Vite
- React Helmet Async (SEO)
- YAML for content management

## Getting Started

This guide will help you set up the project locally and understand the basic structure.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/valipokkann/valipokkann-website.git
    cd valipokkann-website
    ```

2.  **Install dependencies:**
    Make sure you have Node.js (version 20 or higher recommended) and npm installed.
    ```bash
    npm install
    ```

3.  **Start the development server:**
    This will compile the project and serve it locally. The site will typically be available at `http://localhost:3000`.
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    This command compiles and optimizes your project for deployment, creating the `dist` folder.
    ```bash
    npm run build
    ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── config/        # Configuration files
├── assets/        # Static assets
└── data/          # Content data (markdown files)
    ├── artwork/   # Art gallery content
    ├── articles/  # Blog articles
    └── photography/ # Photography content
```

## Content Management

Content is managed through markdown files in the `src/data` directory:

- **Art Gallery**: Add artwork in `src/data/artwork/*.md`
- **Photography**: Add photos in `src/data/photography/*.md`
- **Articles**: Add blog posts in `src/data/articles/*.md`

Each markdown file should include YAML frontmatter with required metadata.

## Performance Optimizations

- **Image Optimization**: All images are optimized for web delivery
- **Lazy Loading**: Images load only when they enter the viewport
- **Code Splitting**: Routes are code-split for faster initial load
- **SEO**: Meta tags and structured data for better search visibility

## Deployment

The site is automatically deployed to GitHub Pages using GitHub Actions on every push to the main branch.

## Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/your-feature-name`)
3.  Commit your changes (`git commit -m 'Add your commit message'`)
4.  Push to the branch (`git push origin feature/your-feature-name`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Valipokkann - [@valipokkann](https://twitter.com/valipokkann)

Project Link: https://github.com/innovinitylabs/valipokkann-website

Last updated: March 19, 2024 

<!-- Trigger redeploy: trivial change --> 