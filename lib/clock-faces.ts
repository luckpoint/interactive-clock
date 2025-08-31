const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

interface ClockFaceDefinition {
  src: string      // 960px for clock face pattern
  thumbSrc: string // 320px thumbnail for UI icons
  label: string
}

const createFace = (fileBase: string, label: string): ClockFaceDefinition => ({
  src: `${basePath}/clock-faces/${fileBase}-960.webp`,
  thumbSrc: `${basePath}/clock-faces/${fileBase}-320.webp`,
  label,
})

export const CLOCK_FACES = {
  sun: createFace('clock-face-sun', 'Sun'),
  animal: createFace('clock-face-cute-animal', 'Cute Animal'),
  sportsCar: createFace('clock-face-sports-car', 'Sports Car'),
  bomb: createFace('clock-face-bomb', 'Bomb'),
  ninja: createFace('clock-face-ninja', 'Ninja'),
  submarine: createFace('clock-face-submarine', 'Submarine'),
  cyberpunk: createFace('clock-face-cyberpunk', 'Cyberpunk'),
  sportsStadium: createFace('clock-face-sports-stadium', 'Sports Stadium'),
  jungle: createFace('clock-face-jungle', 'Jungle'),
  magicalForest: createFace('clock-face-magical-forest', 'Magical Forest'),
  dreamySky: createFace('clock-face-dreamy-sky', 'Dreamy Sky'),
  mermaids: createFace('clock-face-mermaids', 'Mermaids'),
  rainbowCastle: createFace('clock-face-rainbow-castle', 'Rainbow Castle'),
  cuteRocket: createFace('clock-face-cute-rocket', 'Cute Rocket'),
  cupcakesDonuts: createFace('clock-face-cupcakes-donuts', 'Cupcakes & Donuts'),
  unicorn: createFace('clock-face-unicorn', 'Unicorn'),
  animalBedroom: createFace('clock-face-animal-bedroom', 'Animal Bedroom'),
  gardenButterflies: createFace('clock-face-garden-butterflies', 'Garden Butterflies'),
  /* Newly added faces */
  animalFriends: createFace('clock-face-animal-friends', 'Animal Friends'),
  cuteFashionAnimal: createFace('clock-face-cute-fasion-animal', 'Cute Fashion Animal'),
  dinosaur: createFace('clock-face-dinosaur', 'Dinosaur'),
  dragon: createFace('clock-face-dragon', 'Dragon'),
  fairyTaleGarden: createFace('clock-face-fairy-tale-garden', 'Fairy Tale Garden'),
  football: createFace('clock-face-football', 'Football'),
  gardenButterfly: createFace('clock-face-garden-butterfly', 'Garden Butterfly'),
  magicalCastle: createFace('clock-face-magical-castle', 'Magical Castle'),
  mermaid: createFace('clock-face-mermaid', 'Mermaid'),
  pirate: createFace('clock-face-pirate', 'Pirate'),
  rainbowAnimal: createFace('clock-face-rainbow-animal', 'Rainbow Animal'),
  robot: createFace('clock-face-robot', 'Robot'),
  space: createFace('clock-face-space', 'Space'),
  sweetsTheme: createFace('clock-face-sweets-theme', 'Sweets Theme'),
} as const

export type ClockFaceKey = keyof typeof CLOCK_FACES
export type ClockFace = typeof CLOCK_FACES[ClockFaceKey] 