export const GameConfig = {
  width: 800,
  height: 580,
  backgroundColor: 0x2d6a2d,

  hero: {
    speed: 200,
    collectRadius: 60,
  },

  animal: {
    speed: 170,
    followSpacing: 38,
    patrolRadius: 80,
    patrolSpeed: 55,
    patrolChangeIntervalMs: { min: 2000, max: 4500 },
    idleDurationMs: { min: 1000, max: 3000 },
  },

  yard: {
    x: 640,
    y: 30,
    width: 130,
    height: 110,
  },

  spawn: {
    initialCount: 6,
    intervalMs: { min: 3000, max: 7000 },
    maxOnField: 18,
  },

  maxGroupSize: 5,

  ui: {
    fontSize: 22,
    fontFamily: 'Arial, sans-serif',
    fontColor: '#ffffff',
  },

  arrivalThreshold: 4,
} as const;
