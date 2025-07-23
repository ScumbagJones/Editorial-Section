export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'written-pieces':
      return 'Written Pieces';
    case 'visual-work':
      return 'Visual Work';
    case 'featured-content':
      return 'Featured Content';
    case 'quick-share':
      return 'Quick Share';
    case 'community-work':
      return 'Community Work';
    case 'pitch-idea':
      return 'Editorial Pitch';
    default:
      return 'Editorial';
  }
}

export function getCategoryDescription(category: string): string {
  switch (category) {
    case 'written-pieces':
      return 'Essays, stories, articles, cultural commentary';
    case 'visual-work':
      return 'Photography, art, design, visual content';
    case 'featured-content':
      return 'Interviews, profiles, special features';
    case 'quick-share':
      return 'Something you\'re enamored with right now';
    default:
      return 'Editorial content';
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'written-pieces':
      return 'bg-blue-500/20 text-blue-300';
    case 'visual-work':
      return 'bg-purple-500/20 text-purple-300';
    case 'featured-content':
      return 'bg-green-500/20 text-green-300';
    case 'quick-share':
      return 'bg-pink-500/20 text-pink-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
  }
}