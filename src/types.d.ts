declare module 'astro:content' {
  interface CollectionEntry<T extends keyof typeof collections> {
    slug: string;
    data: any;
    render(): Promise<{
      Content: any;
      headings: any[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }

  const collections: {
    'sections': {
      type: 'content';
      schema: {
        title: string;
        order: number;
      };
    };
  };

  function getCollection<T extends keyof typeof collections>(
    collection: T,
    filter?: (entry: CollectionEntry<T>) => boolean
  ): Promise<CollectionEntry<T>[]>;
}