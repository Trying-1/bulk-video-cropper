export enum QualityPreset {
  Fastest = 'fastest',
  Balanced = 'balanced',
  Quality = 'quality'
}

export const qualityPresets = {
  [QualityPreset.Fastest]: {
    bitrate: '500k',
    crf: 23,
    preset: 'ultrafast'
  },
  [QualityPreset.Balanced]: {
    bitrate: '1000k',
    crf: 18,
    preset: 'fast'
  },
  [QualityPreset.Quality]: {
    bitrate: '2000k',
    crf: 15,
    preset: 'medium'
  }
};
