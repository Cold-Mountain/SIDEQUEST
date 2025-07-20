export const APP_NAME = 'Sidequest';

export const SIDEQUEST_CATEGORIES = {
  adventure: {
    label: 'Adventure',
    description: 'Explore new places and experiences',
    color: '#FF6B6B'
  },
  creative: {
    label: 'Creative',
    description: 'Express yourself through art and creation',
    color: '#4ECDC4'
  },
  social: {
    label: 'Social',
    description: 'Connect with others in meaningful ways',
    color: '#45B7D1'
  },
  learning: {
    label: 'Learning',
    description: 'Discover new skills and knowledge',
    color: '#96CEB4'
  },
  wellness: {
    label: 'Wellness',
    description: 'Take care of your mind and body',
    color: '#FFEAA7'
  },
  mystery: {
    label: 'Mystery',
    description: 'Uncover hidden experiences',
    color: '#DDA0DD'
  }
} as const;

export const DIFFICULTY_LEVELS = {
  easy: { label: 'Easy', points: 10, color: '#96CEB4' },
  medium: { label: 'Medium', points: 25, color: '#FFEAA7' },
  hard: { label: 'Hard', points: 50, color: '#FF6B6B' },
  extreme: { label: 'Extreme', points: 100, color: '#6C5CE7' }
} as const;