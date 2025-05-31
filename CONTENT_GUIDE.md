# Content Management Guide

This guide explains how to update and add content to your website, including articles, artwork, and links.

## General Content Structure

The content for different sections of the site is often stored in data files or directly within the page components. Static assets like images are typically placed in the `public` directory.

## Articles (Blog)

Articles are displayed on the `/articles` page. The content is likely stored in a data file or fetched from a source that is processed into the required format.

To add or edit articles:

1.  **Locate the Article Data:** Look for a file that holds the article data. This might be in a `data` or `config` directory, or possibly directly within `src/pages/Articles.tsx`. The data structure likely includes fields like `title`, `slug`, `date`, `tags`, and `content` (or a path to the content file).
2.  **Add or Edit Data:** Follow the existing structure to add a new article entry or modify an existing one. Article content might be written in Markdown (.md) files, which would be referenced in the data.
3.  **Update Tags:** If adding new tags for filtering, ensure they are consistent.

## Artwork (Art Gallery)

The artwork displayed on the `/art` page is currently defined directly within the `src/pages/Art.tsx` file.

To add new artwork:

1.  **Prepare Your Image:** Place your artwork image file (e.g., `my_new_art.jpg`) into the `public/artworks` directory.
2.  **Open `src/pages/Art.tsx`:** Navigate to this file in your code editor.
3.  **Find the `artworks` array:** Scroll down until you find the `artworks: Artwork[] = [...]` array.
4.  **Add a New Entry:** Add a new object to the array following the existing structure. Make sure to give it a unique `id` and correctly reference the image file from the `public/artworks` directory (e.g., `image: 'artworks/my_new_art.jpg'`).

    ```typescript
    {
      id: YOUR_UNIQUE_ID,
      title: 'Your Artwork Title',
      image: 'artworks/your_image_file.jpg', // Path relative to public/
      description: 'A brief description of your artwork.',
      year: YOUR_ART_YEAR
    },
    ```

5.  **Save the File:** Save the changes to `src/pages/Art.tsx`.

## Links

The links displayed on the `/links` page are likely stored in a data file or directly in the `src/pages/Links.tsx` component.

To add or edit links:

1.  **Locate the Links Data:** Look for a file or section within `src/pages/Links.tsx` that contains the list of links.
2.  **Add or Edit Data:** Follow the existing structure to add new link entries or modify existing ones. Each link entry likely includes the URL and display text.

## General Site Updates

*   **Changing Text:** For general text updates (like in the Navbar, Footer, About page text), locate the component or page file (`.tsx`) and directly edit the text within the JSX.
*   **Updating Logo:** Replace the `valipokkann_transparent_logo.png` file in the `public` directory with your new logo image. Ensure the new file has the exact same name. If you want a different name, you'll need to update all references to the logo file throughout the codebase (e.g., in `index.html`, `public/manifest.json`, and relevant `.tsx` components).
*   **Adding Images:** For images used in other parts of the site (not artwork), you can place them in the `public` directory or within the `src/assets` folder and reference them accordingly in your components.
*   **Styling:** Most styling is handled by Tailwind CSS classes applied directly in the JSX. Global styles might be in an index CSS file.

## Seeing Your Changes

*   **Local Development:** If your local development server (`npm run dev`) is running, most changes to code and data files will automatically update in your browser (Hot Module Replacement).
*   **Deployment:** To see changes live on `valipokkann.in`, you must commit your changes and push them to the `main` branch on GitHub. The GitHub Actions workflow will then build and deploy the updated site to the `gh-pages` branch.

Refer to the [README.md](README.md) for instructions on setting up the project and deployment. 