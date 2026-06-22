const PEXELS_BASE = 'https://images.pexels.com/photos'

export const seededMediaPexelsIds: Record<string, number> = {
  'living-room-1.jpg': 5998040,
  'bedroom-1.jpg': 90319,
  'dining-1.jpg': 7018254,
  'home-decor-1.jpg': 5825540,
  'lighting-1.jpg': 2043569,
  'outdoor-1.jpg': 9578711,
  'eve-armchair-3.jpg': 19219305,
  'eve-armchair-4.jpg': 29383009,
  'nova-coffee-table-3.jpg': 279607,
  'nova-coffee-table-4.jpg': 271795,
  'swell-sofa-3.jpg': 1571468,
  'swell-sofa-4.jpg': 12187764,
  'oslo-sideboard-3.jpg': 930602,
  'oslo-sideboard-4.jpg': 18330048,
  'dune-bed-frame-3.jpg': 7019028,
  'dune-bed-frame-4.jpg': 36887757,
  'twill-nightstand-3.jpg': 6394565,
  'twill-nightstand-4.jpg': 2062431,
  'folio-desk-3.jpg': 1957477,
  'folio-desk-4.jpg': 19240055,
  'boho-pendant-3.jpg': 11208970,
  'boho-pendant-4.jpg': 7219505,
  'arc-floor-lamp-3.jpg': 14495881,
  'arc-floor-lamp-4.jpg': 30458591,
  'mesa-dining-table-3.jpg': 10855260,
  'mesa-dining-table-4.jpg': 12715504,
  'slim-dining-chair-3.jpg': 7576110,
  'slim-dining-chair-4.jpg': 32666586,
  'vent-terrarium-3.jpg': 6471700,
  'vent-terrarium-4.jpg': 6045259,
  'pivot-outdoor-chair-3.jpg': 8680681,
  'pivot-outdoor-chair-4.jpg': 133920,
  'loom-woven-rug-3.jpg': 5746250,
  'loom-woven-rug-4.jpg': 16087220,
  'lounge-edit-1.jpg': 35574732,
  'nordic-nights-1.jpg': 14076390,
  'outdoor-oasis-1.jpg': 32945128,
  'fewer-better-pieces-1.jpg': 29383009,
  'geometry-of-calm-1.jpg': 4451739,
  'soft-light-hard-edges-1.jpg': 15465524,
  'wabi-sabi-imperfection-1.jpg': 16709512,
  'bringing-outdoors-in-1.jpg': 8916602,
  'art-of-gallery-wall-1.jpg': 271795,
  'hero-bg-1.jpg': 5998040,
}

export function getOriginalFilename(filename: string) {
  return filename.replace(/-\d+x\d+(?=\.jpg$)/, '')
}

export function getSeededPexelsUrl(filename: string, width = 1200, height = 900) {
  const pexelsId = seededMediaPexelsIds[getOriginalFilename(filename)]

  return pexelsId
    ? `${PEXELS_BASE}/${pexelsId}/pexels-photo-${pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop`
    : undefined
}
