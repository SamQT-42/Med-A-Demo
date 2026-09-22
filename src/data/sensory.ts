import type { SensoryOption, Vendor } from '../types';

/**
 * Three fictional vendor records. No real retailer is named, no price is shown,
 * no stock level is claimed, and nothing here can be purchased.
 */
export const VENDORS: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'Example Vendor One',
    note: 'A placeholder supplier record used to show how vendor details would appear.',
    availability: 'Availability not connected',
  },
  {
    id: 'vendor-2',
    name: 'Example Vendor Two',
    note: 'A placeholder supplier record used to show how vendor details would appear.',
    availability: 'Availability not connected',
  },
  {
    id: 'vendor-3',
    name: 'Example Vendor Three',
    note: 'A placeholder supplier record used to show how vendor details would appear.',
    availability: 'Availability not connected',
  },
];

export function vendorById(id: string | null): Vendor | undefined {
  return id ? VENDORS.find((v) => v.id === id) : undefined;
}

/**
 * Six sample options.
 *
 * The important distinction: a `product` is something a person could obtain,
 * an `adjustment` is something to discuss at work and cannot be bought. The UI
 * keeps them visually and behaviourally separate — an adjustment offers a
 * request draft, never a vendor.
 *
 * Descriptions are framed around preference ("for people who prefer…"), never
 * around a condition. No efficacy claim, rating, or price appears anywhere.
 */
export const SENSORY: SensoryOption[] = [
  {
    id: 'sen-headphones',
    kind: 'product',
    category: 'noise',
    title: 'Noise-reducing headphones',
    shortDescription: 'Over-ear headphones that lower steady background sound.',
    intendedUse:
      'Worn while working to reduce continuous background noise such as ventilation, traffic or general office hum.',
    preferenceConsiderations: [
      'Some people find over-ear pressure uncomfortable after a while; others barely notice it.',
      'They reduce steady sound more than sudden speech, so they suit some rooms better than others.',
      'Wearing them can signal "do not interrupt", which some people want and others would rather avoid.',
    ],
    vendorId: 'vendor-1',
    draftSeed: null,
  },
  {
    id: 'sen-earplugs',
    kind: 'product',
    category: 'noise',
    title: 'Filtered earplugs',
    shortDescription: 'Small earplugs that lower volume while keeping speech audible.',
    intendedUse:
      'Worn in shared spaces where you still need to hear people speaking but want the overall level brought down.',
    preferenceConsiderations: [
      'Much less visible than headphones, which some people prefer.',
      'Fit varies a lot between people and between products.',
      'Some people dislike the sensation of anything in the ear.',
    ],
    vendorId: 'vendor-2',
    draftSeed: null,
  },
  {
    id: 'sen-quiet-fidget',
    kind: 'product',
    category: 'tactile',
    title: 'Quiet fidget item',
    shortDescription: 'A small silent object to hold while thinking or listening.',
    intendedUse:
      'Held during meetings or focused work by people who find it easier to concentrate with something in their hands.',
    preferenceConsiderations: [
      'Silent versions exist specifically for shared spaces and meetings.',
      'Some people find it helps them listen; others find it pulls attention away.',
      'Size and texture preferences differ a lot, so it is worth trying more than one.',
    ],
    vendorId: 'vendor-3',
    draftSeed: null,
  },
  {
    id: 'sen-tactile',
    kind: 'product',
    category: 'tactile',
    title: 'Textured tactile item',
    shortDescription: 'A small object with a distinct surface texture.',
    intendedUse:
      'Kept at a desk by people who find a consistent physical texture steadying while working.',
    preferenceConsiderations: [
      'Texture preference is very individual — the same surface is pleasant to one person and unpleasant to another.',
      'Easy to try cheaply before committing to anything.',
      'Some people prefer weight over texture, which is a different kind of item.',
    ],
    vendorId: 'vendor-1',
    draftSeed: null,
  },
  {
    id: 'sen-desk-light',
    kind: 'product',
    category: 'workspace',
    title: 'Adjustable desk light',
    shortDescription: 'A desk lamp with adjustable brightness and direction.',
    intendedUse:
      'Used to control the light on your own desk when overhead lighting is too bright, too dim, or badly angled.',
    preferenceConsiderations: [
      'Lets you change your own light without affecting anyone else in the room.',
      'Warmer or cooler light suits different people; adjustable models let you find out which.',
      'Desk space and socket position may limit where it can go.',
    ],
    vendorId: 'vendor-2',
    draftSeed: null,
  },
  {
    id: 'sen-quieter-workspace',
    kind: 'adjustment',
    category: 'workspace',
    title: 'A quieter place for focused work',
    shortDescription:
      'Not a product. Something to agree with your workplace — a desk or room away from through-traffic for focused tasks.',
    intendedUse:
      'Used for tasks that need sustained concentration, either as a permanent desk change or as a room you can book when you need it.',
    preferenceConsiderations: [
      'This cannot be bought. It is a change to discuss with the people who decide where you work.',
      'Some people want a permanent move; others only want somewhere to go for a few hours at a time.',
      'Being further from colleagues can make collaboration harder, which is worth weighing up.',
    ],
    vendorId: null,
    draftSeed:
      'Background conversations make it difficult for me to follow my work. Could we explore a quieter place for focused tasks?',
  },
];

export function sensoryById(id: string): SensoryOption | undefined {
  return SENSORY.find((s) => s.id === id);
}
