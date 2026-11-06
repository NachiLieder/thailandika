/**
 * מרשם נכסי התמונה של האפליקציה.
 * כל תמונה נטענת דרך הקובץ הזה, כך שהחלפת תצלום נעשית במקום אחד בלבד.
 */
export const images = {
  /** מפרץ פי פי – סירות לונג־טייל, מצוקי גיר ומים טורקיז. גיבור מסך הבית */
  phiPhiHero: require('../../assets/thailand/phi-phi-hero.jpg'),
  /** מפרץ פי פי במלואו – ההרכב הרחב, לכרטיסי שיעור */
  phiPhiBay: require('../../assets/thailand/phi-phi-bay.jpg'),
  /** חוף טרופי – חול לבן, דקלים ושמיים כחולים. רקע מסך הסיום */
  tropicalBeach: require('../../assets/thailand/tropical-beach.jpg'),
  /** מקדש תאילנדי ברצועת גיבור – הגג המוזהב והצ'די במרכז */
  heroTemple: require('../../assets/thailand/hero-temple.jpg'),
  /** מקדש תאילנדי – גגות זהב ואדריכלות מסורתית. כותרות שיעור וחידון */
  thaiTemple: require('../../assets/thailand/thai-temple.jpg'),
  /** זר טרופי שקוף – היביסקוס, פרנג׳יפני ועלי דקל */
  bouquet: require('../../assets/flowers/tropical-bouquet.png'),
  /** עלה דקל בודד – לקישוט פינות */
  palmLeaf: require('../../assets/flowers/palm-leaf.png'),
  /** היביסקוס ורוד – לאקסנטים קטנים */
  hibiscus: require('../../assets/flowers/hibiscus-pink.png'),
  /** רצועות רחבות לכרטיסי השיעור והחידון */
  cardBay: require('../../assets/thailand/card-bay.jpg'),
  cardTemple: require('../../assets/thailand/card-temple.jpg'),
  cardBeach: require('../../assets/thailand/card-beach.jpg'),
} as const;

export type ImageKey = keyof typeof images;

/** התצלום שמלווה כל קטגוריה בכותרת השיעור והחידון */
export const categoryPhoto: Record<string, ImageKey> = {
  conversations: 'cardTemple',
  words: 'cardBay',
  food: 'cardBeach',
  travel: 'cardBay',
  numbers: 'cardTemple',
  games: 'cardBeach',
};
