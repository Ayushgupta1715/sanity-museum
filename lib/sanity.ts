import { createClient, type SanityClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '@/sanity/env';

function getClient(useToken = false): SanityClient {
  return createClient({
    projectId: projectId || 'placeholder',
    dataset: dataset || 'production',
    apiVersion,
    useCdn: !useToken,
    token: useToken ? process.env.SANITY_API_TOKEN : undefined,
  });
}

// Search Knowledge Base for relevant tutorials
export async function searchKnowledgeBase(query: string) {
  const client = getClient(true);

  const groqQuery = `*[_type == "tutorial" && (
    title match $searchQuery ||
    content match $searchQuery ||
    $searchQuery in tags ||
    count((tags)[@ match $searchQuery]) > 0
  )] | order(_createdAt desc) [0...5] {
    _id,
    title,
    "slug": slug.current,
    difficulty,
    content,
    codeExamples,
    tags,
    "topicName": topic->name,
    "topicIcon": topic->icon,
    "topicColor": topic->color
  }`;

  const results = await client.fetch(groqQuery, {
    searchQuery: `*${query}*`,
  });

  return results;
}

// Get all topics
export async function getTopics() {
  const client = getClient();
  return client.fetch(`*[_type == "topic"] | order(name asc) { _id, name, "slug": slug.current, icon, description, color }`);
}

// Get tutorials by topic
export async function getTutorialsByTopic(topicSlug: string) {
  const client = getClient();
  return client.fetch(
    `*[_type == "tutorial" && topic->slug.current == $topicSlug] | order(title asc) {
      _id, title, "slug": slug.current, difficulty, tags,
      "topicName": topic->name, "topicIcon": topic->icon
    }`,
    { topicSlug }
  );
}
