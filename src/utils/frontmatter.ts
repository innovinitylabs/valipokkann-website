export interface ArticleMeta {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  date: string;
  tags?: string[];
  coverImage?: string;
}

export interface Article {
  slug: string;
  meta: ArticleMeta;
  content: string;
}

export function parseFrontmatter(content: string): { meta: ArticleMeta; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('No frontmatter found in markdown file');
  }

  const [, frontmatter, markdownContent] = match;
  const meta: Partial<ArticleMeta> = {
    title: '',
    description: '',
    date: '',
  };

  // Parse frontmatter key-value pairs
  let currentKey = '';
  let isInTagsList = false;
  const tags: string[] = [];

  frontmatter.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      isInTagsList = false;
      return;
    }

    // Check if we're starting a tags list
    if (trimmedLine === 'tags:') {
      isInTagsList = true;
      return;
    }

    // If we're in a tags list
    if (isInTagsList) {
      if (trimmedLine.startsWith('- ')) {
        // This is a tag
        tags.push(trimmedLine.substring(2));
        return;
      }
      isInTagsList = false;
    }

    // Regular key-value parsing
    if (!isInTagsList) {
      const [key, ...valueParts] = trimmedLine.split(':');
      if (key && valueParts.length > 0) {
        currentKey = key.trim();
        const value = valueParts.join(':').trim();
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '');
        
        // Handle different field types
        switch (currentKey) {
          case 'tags':
            // Skip tags here as we handle them separately
            break;
          case 'coverImage':
            meta.coverImage = cleanValue;
            break;
          default:
            if (currentKey !== 'tags') {
              meta[currentKey as keyof Omit<ArticleMeta, 'tags' | 'coverImage'>] = cleanValue;
            }
        }
      }
    }
  });

  // Add tags to meta if we found any
  if (tags.length > 0) {
    meta.tags = tags;
  }

  return {
    meta: meta as ArticleMeta,
    content: markdownContent.trim()
  };
} 