import { ImageKey } from './images';

export type LearningResource = {
  id: string;
  title: string;
  kind: 'Article' | 'Video';
  topic: 'Beginners' | 'Equipment' | 'Competition';
  publisher: string;
  url: string;
  image: ImageKey;
  description: string;
  highlights: string[];
};
export const learningResources: LearningResource[] = [
  {
    id: 'getting-started',
    title: 'Your first steps in archery',
    kind: 'Article',
    topic: 'Beginners',
    publisher: 'Archery Canada',
    url: 'https://archerycanada.ca/new-to-archery/basic-guide-to-archery/',
    image: 'lesson',
    description:
      'A beginner-friendly introduction to finding a club, meeting an instructor and discovering the sport.',
    highlights: [
      'Start with a supervised introduction at a local club.',
      'Explore the different ways to participate before choosing equipment.',
      'Ask your instructor which equipment suits your experience.',
    ],
  },
  {
    id: 'bow-equipment',
    title: 'Explore modern archery equipment',
    kind: 'Article',
    topic: 'Equipment',
    publisher: 'World Archery',
    url: 'https://www.worldarchery.sport/sport/equipment',
    image: 'equipment',
    description:
      'Meet the major bow categories and learn how competition equipment differs.',
    highlights: [
      'Compare recurve, compound and barebow equipment.',
      'Discover how different bow designs fit different disciplines.',
      'Use the official equipment pages as a starting point for deeper reading.',
    ],
  },
  {
    id: 'recurve-guide',
    title: 'Inside the recurve bow',
    kind: 'Article',
    topic: 'Equipment',
    publisher: 'World Archery',
    url: 'https://www.worldarchery.sport/sport/equipment/recurve',
    image: 'recurve',
    description:
      'An official overview of recurve equipment, accessories and competition.',
    highlights: [
      'Identify the riser, limbs, bowstring and sight.',
      'Learn why stabilisers and protective accessories matter.',
      'Connect the equipment to the way recurve events are organised.',
    ],
  },
  {
    id: 'archery-disciplines',
    title: 'Find your archery discipline',
    kind: 'Article',
    topic: 'Competition',
    publisher: 'World Archery',
    url: 'https://www.worldarchery.sport/sport/disciplines',
    image: 'range',
    description:
      'Explore the different settings and formats in which archers compete.',
    highlights: [
      'Discover target archery and other recognised disciplines.',
      'Compare the environments in which competitions take place.',
      'Follow the governing body’s links to learn about each format.',
    ],
  },
  {
    id: 'olympic-history',
    title: 'Archery at the Olympic Games',
    kind: 'Article',
    topic: 'Competition',
    publisher: 'World Archery',
    url: 'https://www.worldarchery.sport/sport/history/archery-olympic-games',
    image: 'medals',
    description:
      'Follow archery’s Olympic story and its development as a spectator sport.',
    highlights: [
      'Explore milestones in Olympic archery.',
      'Learn how the sport returned to the Olympic programme.',
      'Discover the setting behind today’s championship experience.',
    ],
  },
  {
    id: 'championship-guide',
    title: 'How a world championship works',
    kind: 'Article',
    topic: 'Competition',
    publisher: 'World Archery',
    url: 'https://www.worldarchery.sport/news/202133/beginners-guide-2025-hyundai-world-archery-championships',
    image: 'competition',
    description:
      'A spectator’s introduction to the 2025 World Archery Championships, with useful context for following tournaments.',
    highlights: [
      'Learn which bow categories appear at the event.',
      'Get oriented before watching a championship.',
      'This guide describes the 2025 event; schedules and formats are event-specific.',
    ],
  },
  {
    id: 'recurve-video',
    title: 'What is a recurve bow in archery?',
    kind: 'Video',
    topic: 'Equipment',
    publisher: 'World Archery',
    url: 'https://www.youtube.com/watch?v=nUMMLTvgg5o',
    image: 'traditional',
    description:
      'Watch the recurve explainer linked from World Archery’s official equipment guide.',
    highlights: [
      'See recurve equipment in a visual format.',
      'Pair the video with the in-app equipment guide.',
      'Opens on YouTube. An internet connection is required.',
    ],
  },
  {
    id: 'recurve-technique-video',
    title: 'How to shoot a recurve bow',
    kind: 'Video',
    topic: 'Beginners',
    publisher: 'Archery 360 · via World Archery',
    url: 'https://www.youtube.com/watch?v=08bv2eAugJM',
    image: 'coaching',
    description:
      'An English-language technique introduction recommended on World Archery’s recurve page.',
    highlights: [
      'Watch an overview of the recurve shooting process.',
      'Use the video alongside supervised instruction.',
      'Practise only at a suitable range with an instructor.',
    ],
  },
];
export function filterLearning(
  query: string,
  topic: string,
  kind: string,
  saved: string[],
) {
  const search = query.trim().toLowerCase();
  return learningResources.filter(
    item =>
      (topic === 'All' ||
        (topic === 'Saved' ? saved.includes(item.id) : item.topic === topic)) &&
      (kind === 'All formats' || item.kind === kind) &&
      (!search ||
        `${item.title} ${item.description} ${item.publisher} ${item.topic}`
          .toLowerCase()
          .includes(search)),
  );
}
