import { defineCollection, z } from 'astro:content';

// Define the schema for the sections collection
const sections = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
  // Allow using components in Markdown through MDX
  render: async (entry) => {
    const { Content } = await entry.render();
    return { Content };
  },
});

// Export the collections
export const collections = {
  sections,
};