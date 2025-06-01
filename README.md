# Valipokkann's Personal Artist Website

A modern, responsive personal website for artist Valipokkann, built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Art gallery with interactive image rotation
- 📝 Blog-style articles with markdown support
- 🎵 Music section (coming soon)
- 🌓 Dark/Light mode toggle
- 🌐 Responsive design for all devices
- 🎮 Easter eggs (Konami code)
- 💫 Smooth page transitions
- 📱 PWA-ready

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Vite

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
├── config/        # Configuration files (e.g., Tailwind CSS)
├── assets/        # Static assets (images, fonts, etc.)
└── data/          # Content data (e.g., articles, artwork list)
```

## Content Management

Learn how to add/edit articles, artwork, links, and other content in the [Content Management Guide](CONTENT_GUIDE.md).

## Deployment to GitHub Pages

This site is configured for automatic deployment to GitHub Pages using GitHub Actions.

1.  **Prerequisites:**
    *   A GitHub repository for your project.
    *   Node.js and npm installed locally (for initial setup and local development).

2.  **GitHub Pages Setup:**
    *   Go to your GitHub repository on the website.
    *   Navigate to **Settings** -> **Pages**.
    *   Under "Build and deployment", set the **Source** to **"GitHub Actions"**.

3.  **GitHub Actions Workflow:**
    *   A workflow file is included in this repository at `.github/workflows/deploy.yml`.
    *   This workflow automatically builds the project (`npm run build`) and deploys the output from the `dist` folder to the `gh-pages` branch on every push to the `main` branch.

4.  **Configure Workflow Permissions:**
    *   The default GitHub Actions bot needs permission to push to the `gh-pages` branch.
    *   Go to **Settings** -> **Actions** -> **General**.
    *   Scroll down to "Workflow permissions" and select **"Read and write permissions"**.
    *   Click **Save**.

5.  **Custom Domain (Optional):**
    *   If you are using a custom domain (e.g., `yourdomain.com`), create a `CNAME` file in the `public` directory of your project with your custom domain name on a single line.
    *   Ensure your domain's DNS records are configured to point to GitHub Pages (usually using CNAME or A records).
    *   The `vite.config.ts` file is set with `base: '/'` which is appropriate for a custom domain at the root.

6.  **Triggering Deployment:**
    *   Once the workflow file (`.github/workflows/deploy.yml`) is in your `main` branch and workflow permissions are set, any push to the `main` branch will trigger the deployment workflow.
    *   You can monitor the deployment progress in the **Actions** tab of your repository.

7.  **Verification:**
    *   After the workflow completes successfully, it might take a few minutes for GitHub Pages to update and the CDN to refresh.
    *   Clear your browser cache and visit your site at your GitHub Pages URL or custom domain.

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

Last updated: July 24, 2024 