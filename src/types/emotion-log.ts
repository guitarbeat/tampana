export interface EmotionLog {
  emoji: string;
  emotion: string;
  position: { x: number; y: number };
  valence: number;
  arousal: number;
  timestamp: string;
}
