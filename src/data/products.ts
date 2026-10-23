// Snapshot of the live MAAL catalogue (maal.seedhemaut.com, Oct 2026).
// Variant ids are the real Shopify ids, so checkout hands off to the existing Shopify cart.

export type CollectionHandle = "smx" | "smfc" | "core" | "vinyl" | "accessories";

export type Variant = { id: number; title: string; available: boolean };

export type Product = {
  handle: string;
  title: string;
  code?: string;
  type: string;
  price: number;
  compareAt?: number;
  collections: CollectionHandle[];
  featured?: boolean;
  limited?: boolean;
  short: string;
  description: string;
  images: string[];
  sizeChart?: string;
  variants: Variant[];
};

const CDN = "https://cdn.shopify.com/s/files/1/1005/3537/0021/files/";
const img = (...names: string[]) => names.map((n) => CDN + n);
const SIZES = ["S", "M", "L", "XL", "XXL"];
const sized = (ids: number[], soldOut = false, sizes = SIZES): Variant[] =>
  ids.map((id, i) => ({ id, title: sizes[i], available: !soldOut }));
const single = (id: number): Variant[] => [{ id, title: "One size", available: true }];

export const products: Product[] = [
  {
    handle: "danger-11k-volts-tshirt-smts010",
    title: "Danger 11K Volts T-Shirt",
    code: "SMTS-010",
    type: "T-Shirt",
    price: 1550,
    collections: ["core"],
    featured: true,
    short: "Heavyweight 220 GSM, 100% cotton. A small Seedhe Maut logo up front, the 11K High-Voltage back.",
    description:
      "Shock value in every stitch. Made from 220 GSM, 100% cotton, this heavyweight tee keeps it minimal in the front with a small Seedhe Maut logo and turns up the voltage at the back with an 11K bold High-Voltage graphic. Designed to be as electrifying as the music itself. Made in India.",
    images: img("dangertee1.webp", "dangertee2.webp", "dangertee3.webp"),
    sizeChart: CDN + "sizing-os.jpg",
    variants: sized([52550264324389, 52550264357157, 52550264389925, 52550264422693, 52550264455461]),
  },
  {
    handle: "seedhe-maut-logo-crop-top-smcr002",
    title: "Seedhe Maut Logo Crop Top",
    code: "SMCR-002",
    type: "Crop Top",
    price: 1050,
    collections: ["core"],
    short: "220 GSM, 100% cotton, cropped fit. Large Seedhe Maut logo across the front.",
    description:
      "220 GSM, 100% cotton, cropped fit. Large logo across the front. Clean lines, easy wear, built for everyday rotation. Made in India.",
    images: img("smlogocrop1.webp", "smlogocrop2.webp"),
    sizeChart: CDN + "Sizing-w-crop.gif",
    variants: sized([52550264979749, 52550265012517, 52550265045285, 52550265078053, 52550265110821]),
  },
  {
    handle: "bayaan-vinyl-black-smvi001",
    title: "Bayaan 12\" Vinyl Black Edition",
    code: "SMVI-001",
    type: "Vinyl",
    price: 2350,
    collections: ["vinyl", "smx"],
    short: "Seedhe Maut's seminal debut album on 12\" vinyl. First pressing, pressed in India.",
    description:
      "We know you've been waiting a long time for this one. Seedhe Maut's seminal debut album 'Bayaan' is now on 12\" vinyl. This first pressing is sure to be a collector's item. Feel the full Bayaan sonic experience in analogue. Pressed in India.",
    images: img("bayaanvinylblack2.webp", "bayaanvinylblack1.webp", "bayaanvinylblack3.webp", "bayaanvinylblack4.webp", "bayaanvinylblack5.webp"),
    variants: single(52550265372965),
  },
  {
    handle: "sm-collectable-1-smcl001",
    title: "SM Collectable #1",
    code: "SMCL-001",
    type: "Gamosa",
    price: 1050,
    collections: ["core", "accessories"],
    short: "100% cotton gamosa with an embroidered Seedhe Maut logo. All proceeds go to charity.",
    description:
      "This 100% cotton gamosa is more than just a utility, it's a marker of identity. Featuring a detailed embroidered Seedhe Maut logo up front, it carries the energy of 10 years of breaking barriers, staying true, and never backing down. Made in India. All proceeds from this item will be donated to charity.",
    images: img("smcollectable1.webp", "smcollectable2.webp", "smcollectable3.webp", "smcollectable4.webp"),
    variants: single(52550263308581),
  },
  {
    handle: "lunch-box",
    title: "Lunchbreak Lunch Box",
    type: "Lunch Box",
    price: 850,
    collections: ["core"],
    limited: true,
    short: "Durable lunch box, keeps food fresh and organised with a secure closure. Made in India.",
    description:
      "Durable lunch box designed for daily meal storage and transport. Keeps food fresh and organised with a secure closure. Perfect for work, school and travel. Compact and easy to carry. Made in India.",
    images: img(
      "4_85f4ed51-3f00-4005-b75c-f08688cadc03.png",
      "3_5e1c1e1d-6af1-4997-bf4e-083312ceb667.png",
      "2_f2be6b4f-175c-4583-abc7-97bd9eb3ace8.png",
      "1_222aab7d-38ea-46bd-946d-1c1d1e909b3a.png",
    ),
    variants: single(53593034129701),
  },
  {
    handle: "iconic-gaming-pad-smgp001",
    title: "Iconic Gaming Pad",
    code: "SMGP-001",
    type: "Gaming Pad",
    price: 650,
    collections: ["smx", "accessories"],
    limited: true,
    short: "Calm & Encore, an ever-present Dragon and the SMX 10 Years icons. 24 x 11 inches.",
    description:
      "Game on! This limited-edition gaming pad features a custom illustration of Calm & Encore, an ever-present Dragon, and the SMX 10 Years of Seedhe Maut icons. Alternatively, use it as a home drinks / bar mat. Size: 24 x 11 inches. Made in India. Game responsibly.",
    images: img("gamepad1_7d5b58f1-a0e0-4d8b-adb0-2bb7556461e2.webp", "gamepad2.webp", "gamepad3.webp", "gamepad4.webp"),
    variants: single(52550262522149),
  },
  {
    handle: "killing-it-metal-pin-badge-round-smpb002",
    title: "Killing It Metal Pin Badge Round",
    code: "SMPB-002",
    type: "Metal Pin",
    price: 500,
    collections: ["core", "accessories"],
    short: "Zinc-iron alloy, with the iconic Seedhe Maut Killing It logo.",
    description:
      "Crafted from zinc-iron alloy, this round badge features the iconic Seedhe Maut Killing It logo. Durable, minimal, and built to represent the Nation anywhere you go. Made in India.",
    images: img("roundpin1.webp", "roundpin2.webp"),
    variants: single(52550263963941),
  },
  {
    handle: "limited-edition-invert-tshirt-smts003",
    title: "Limited Edition Invert T-Shirt",
    code: "SMTS-003",
    type: "T-Shirt",
    price: 1600,
    collections: ["smx"],
    featured: true,
    limited: true,
    short: "Oversized, 260 GSM, 100% cotton, finished with a bold Devanagari back print.",
    description:
      "Limited edition. Oversized and unapologetic. 260 GSM, 100% cotton finished with a bold Devanagari back print, a piece made to turn heads and hold ground. Heavyweight feel, everyday comfort. Made in India.",
    images: img("inverttee1.webp", "inverttee2.webp", "inverttee3.webp"),
    sizeChart: CDN + "sizing-os.jpg",
    variants: sized([52550264488229, 52550264520997, 52550264553765, 52550264586533, 52550264619301]),
  },
  {
    handle: "nayaab-picture-smvi004",
    title: "Nayaab 12\" Picture Disk Signed Vinyl",
    code: "SMVI-004",
    type: "Vinyl",
    price: 7100,
    collections: ["vinyl", "smx"],
    limited: true,
    short: "Gatefold double-disk picture vinyl, first pressing, signed by Seedhe Maut. Pressed in India.",
    description:
      "'Nayaab' on gatefold double-disk 12\" vinyl. This limited edition signed first-pressing picture disk variation is sure to be a collector's item. Feel the full Nayaab sonic experience in analogue. And yes, it will be signed by Seedhe Maut. Pressed in India.",
    images: img("nayaabvinyl1.webp", "nayaabvinyl2.webp", "nayaabvinyl3.webp", "nayaabvinyl4.webp", "nayaabvinyl5.webp", "nayaabvinyl6.webp"),
    variants: single(52550263144741),
  },
  {
    handle: "killing-it-mug-smmu001",
    title: "Killing It x TBSM Tea and Coffee Mug",
    code: "SMMU-001",
    type: "Mug",
    price: 400,
    collections: ["core", "accessories"],
    short: "Ceramic, black outside, red on the inside, the TBSM motif and the Killing It stick-men.",
    description:
      "Dual colour Killing It x TBSM mug. Ceramic, black exterior, red on the inside, with a custom TBSM motif and the Killing It stick-men from Seedhe Maut's logo. Escape the mundane and cause a riot. Made in India.",
    images: img("killin_itmug1.webp", "killin_itmug2.webp", "killin_itmug3.webp", "killin_itmug4.webp"),
    variants: single(52550263079205),
  },
  {
    handle: "jersey-top-calm-smfcj01",
    title: "SMFC Jersey Top - Calm",
    type: "Jersey",
    price: 2100,
    collections: ["smfc"],
    limited: true,
    short: "Red and black, a personalised 'Calm' nameplate framed by the signature dragon motif.",
    description:
      "Limited edition red and black jersey top detailed with a personalised 'Calm' nameplate framed by the signature dragon motif on the back, alongside SMFC, DL91 and the subtle Jameson J sleeve mark. Wear the name, own the game.",
    images: img("2.png", "1.png"),
    sizeChart: CDN + "sizing-smfc.png",
    variants: sized([52550261309733, 52550261342501, 52550261375269, 52550261408037], true, ["S", "M", "L", "XL"]),
  },
  {
    handle: "best-in-the-business-tshirt-smts004",
    title: "Best In The Business T-Shirt",
    code: "SMTS-004",
    type: "T-Shirt",
    price: 2000,
    collections: ["smx"],
    featured: true,
    short: "260 GSM, 100% cotton. Minimal icons up front, the statement on the back.",
    description:
      "Made with 100% cotton at 260 GSM, this tee is built strong and made to last. The front keeps it minimal with bold white Seedhe Maut icons, while the back flexes hard with the statement \"Best in the Business\", because that's exactly what it is. Made in India.",
    images: img("BESTINTHEBUSINESST-SHIRT1.webp", "BESTINTHEBUSINESST-SHIRT2.webp", "BESTINTHEBUSINESST-SHIRT3.webp"),
    sizeChart: CDN + "sizing-os.jpg",
    variants: sized([52550265176357, 52550265209125, 52550265241893, 52550265274661, 52550265307429]),
  },
  {
    handle: "tote-bag-smtb-001",
    title: "Lunchbreak Tote Bag",
    type: "Tote Bag",
    price: 1200,
    collections: ["core"],
    limited: true,
    short: "The Lunchbreak tote. Limited edition, made in India.",
    description: "The Lunchbreak tote bag, limited edition. Made in India.",
    images: img("ToteBag-1.png", "ToteBag-2.png"),
    variants: single(52550263734565),
  },
  {
    handle: "smx-acid-washed-tour-tshirt-smts008",
    title: "SMX Acid Washed Tour T-Shirt",
    code: "SMTS-008",
    type: "T-Shirt",
    price: 2000,
    collections: ["smx"],
    short: "Black acid wash, neon SMX artwork up front, the official tour dates on the back.",
    description:
      "Made for the stage, built for the streets. This 220 GSM, 100% cotton tee has a black acid wash finish, giving each piece a unique look. The front features a bold SMX logo with neon artwork, while the back carries the official tour dates, a wearable memory of the movement. Made in India.",
    images: img(
      "smacidtourtee1_87086f0c-6a6d-4bd2-aca8-7383a69ec882.webp",
      "smacidtourtee2_e6b908f6-7d52-4d2f-87e9-2feedddb35b2.webp",
      "smacidtourtee3_e58e5e1e-10cf-4abb-bc41-f041459d3f55.webp",
    ),
    sizeChart: CDN + "sizing-os.jpg",
    variants: sized([52550263570725, 52550263603493, 52550263636261, 52550263669029, 52550263701797]),
  },
  {
    handle: "into-battle-2025-a2-art-print-smpr001",
    title: "Into Battle 2025 - A2 Art Print",
    code: "SMPR-001",
    type: "Art Print",
    price: 500,
    collections: ["accessories"],
    short: "Art by Kunal Anand, Devanagari logotype by Ishan Nakate, on 300 GSM red stock.",
    description:
      "Exclusive artwork designed and illustrated by Kunal Anand with a Devanagari logotype by Ishan Nakate. Printed on 300 GSM red uncoated paper stock. Celebrating a decade of Seedhe Maut: 10 years of raw energy, fearless lyricism, and redefining Indian hip-hop.",
    images: img(
      "intobattleartprint1.webp",
      "intobattleartprint2.webp",
      "intobattleartprint3.webp",
      "intobattleartprint4.webp",
      "intobattleartprint5.webp",
      "intobattleartprint6.webp",
    ),
    variants: single(52550265438501),
  },
  {
    handle: "daily-essential-tshirt-smts001",
    title: "Daily Essential T-Shirt",
    code: "SMTS-001",
    type: "T-Shirt",
    price: 1050,
    collections: ["core"],
    featured: true,
    short: "The daily wear. 200 GSM, 100% cotton, the Seedhe Maut logo front and centre.",
    description:
      "The daily wear. 100% cotton, 200 GSM tee brings comfort with a solid build that lasts. Featuring the Seedhe Maut logo front and centre, it's a no-fuss essential that speaks volumes without trying too hard.",
    images: img("dailytee1.webp", "dailytee2.webp", "dailytee3.webp"),
    sizeChart: CDN + "Sizing-reg.gif",
    variants: sized([52550264652069, 52550264684837, 52550264717605, 52550264750373, 52550264783141]),
  },
  {
    handle: "duffle-bag-sm-smfcd001",
    title: "SMFC Duffle Bag",
    type: "Duffle Bag",
    price: 550,
    collections: ["smfc", "accessories"],
    limited: true,
    short: "Red and black stripes, the SMFC emblem anchored by the signature dragons.",
    description:
      "A limited edition duffel bag in red and black stripes, featuring the SMFC emblem anchored by the signature dragons and Jameson Ginger Ale branding. Carry the game.",
    images: img("9.png", "10.png"),
    variants: single(52550262325541),
  },
  {
    handle: "nayaab-vinyl-black-smvi003",
    title: "Nayaab 12\" Vinyl Black Edition",
    code: "SMVI-003",
    type: "Vinyl",
    price: 4700,
    collections: ["vinyl", "smx"],
    short: "Gatefold double-disk 12\" vinyl. First pressing, pressed in India.",
    description:
      "'Nayaab' is now on gatefold double-disk 12\" vinyl. This first pressing is sure to be a collector's item. Feel the full Nayaab sonic experience in analogue. Pressed in India.",
    images: img("nayaabvinylblack1.webp", "nayaabvinylblack2.webp", "nayaabvinylblack3.webp", "nayaabvinylblack4.webp", "nayaabvinylblack5.webp"),
    variants: single(52550265340197),
  },
  {
    handle: "seedhe-maut-logo-tank-smta002",
    title: "Seedhe Maut Logo Tank",
    code: "SMTA-002",
    type: "Tank",
    price: 1300,
    collections: ["core"],
    short: "220 GSM, 100% cotton tank with the Seedhe Maut logo.",
    description:
      "220 GSM, 100% cotton. Celebrating a decade of Seedhe Maut: 10 years of raw energy, fearless lyricism, and redefining Indian hip-hop. From underground rebels to genre pioneers, their voice echoes a generation.",
    images: img("smlogotank1.webp", "smlogotank2.webp", "smlogotank3.webp"),
    sizeChart: CDN + "Sizing-m-tank.gif",
    variants: sized([52550264815909, 52550264848677, 52550264881445, 52550264914213, 52550264946981]),
  },
  {
    handle: "sipper-smfcs01",
    title: "SMFC Sipper",
    type: "Sipper",
    price: 800,
    collections: ["smfc", "accessories"],
    limited: true,
    short: "Red-black stripes, the final touch to complete your game day kit.",
    description:
      "Limited edition SMFC sippers with signature Jameson Ginger Ale branding and red-black stripes, the final touch to complete your game day kit.",
    images: img("5.png"),
    variants: single(52550265471269),
  },
  {
    handle: "smx-pattern-tshirt-smts005",
    title: "SMX Pattern T-Shirt",
    code: "SMTS-005",
    type: "T-Shirt",
    price: 1000,
    compareAt: 2000,
    collections: ["smx"],
    short: "All-over SMX pattern of Seedhe Maut icons. 220 GSM, 100% cotton.",
    description:
      "A decade in the making, printed on a tee. This 220 GSM, 100% cotton piece is covered in an all-over SMX pattern made up of Seedhe Maut icons, celebrating 10 years of the grind. Clean, bold and unmistakably SMX, for day ones and new listeners alike. Made in India.",
    images: img("smpatterntee1.webp", "smpatterntee2.webp"),
    sizeChart: CDN + "Sizing-reg.gif",
    variants: sized([52550261014821, 52550261047589, 52550261080357, 52550261113125, 52550261145893]),
  },
  {
    handle: "killin-it-metal-pin-smpb001",
    title: "Killin' It Metal Pin Rectangle",
    code: "SMPB-001",
    type: "Metal Pin",
    price: 500,
    collections: ["core", "accessories"],
    short: "Zinc-iron alloy, 4 x 3.2 cm, the Killing It logo.",
    description:
      "Crafted from zinc-iron alloy, this badge measures 4 x 3.2 cm and features the iconic Seedhe Maut Killing It logo. Durable, minimal, and built to represent the Nation anywhere you go. Made in India.",
    images: img("killin_itmetalpin1.webp", "killin_itmetalpin2.webp"),
    variants: single(52550263046437),
  },
  {
    handle: "jersey-top-encore-smfcj02",
    title: "SMFC Jersey Top - Encore",
    type: "Jersey",
    price: 2100,
    collections: ["smfc"],
    limited: true,
    short: "Red and black, a personalised 'Encore' nameplate framed by the signature dragon motif.",
    description:
      "Limited edition red and black jersey top detailed with a personalised 'Encore' nameplate framed by the signature dragon motif on the back, alongside SMFC, DL91 and the subtle Jameson J sleeve mark. Wear the name, own the game.",
    images: img("4.png", "3.png"),
    sizeChart: CDN + "sizing-smfc.png",
    variants: sized([52550262161701, 52550262194469, 52550262227237, 52550262260005], true, ["S", "M", "L", "XL"]),
  },
  {
    handle: "the-minimalist-tshirt-smts002",
    title: "The Minimalist T-Shirt",
    code: "SMTS-002",
    type: "T-Shirt",
    price: 1300,
    collections: ["core"],
    short: "200 GSM, 100% cotton. Bold SMX icons sit front and centre.",
    description:
      "This 100% cotton tee, at 200 GSM, is designed for comfort with a sturdy feel. Bold SMX icons sit at the front centre, making it a statement in minimal style. Made in India.",
    images: img("minimalisttee1.webp", "minimalisttee2.webp"),
    sizeChart: CDN + "Sizing-reg.gif",
    variants: sized([52550264160549, 52550264193317, 52550264226085, 52550264258853, 52550264291621]),
  },
  {
    handle: "sxm-pattern-silk-bandana-smbd001",
    title: "SMX Pattern Silk Bandana",
    code: "SMBD-001",
    type: "Bandana",
    price: 650,
    collections: ["smx", "accessories"],
    short: "26-inch silk bandana in the SMX pattern of Seedhe Maut icons.",
    description:
      "Designed for those who live loud and fearless, this 26-inch Seedhe Maut SMX pattern bandana is more than an accessory, it's a statement. Whether you wear it on the streets, at shows, or as a symbol of the grind, it carries the spirit of 10 years of breaking barriers.",
    images: img("smsilkbandana1.webp", "smsilkbandana2.webp", "smsilkbandana3.webp", "smsilkbandana4.webp", "smsilkbandana5.webp"),
    variants: single(52550263898405),
  },
  {
    handle: "football-sm-smfcf01",
    title: "SMFC Football",
    type: "Football",
    price: 1600,
    collections: ["smfc", "accessories"],
    limited: true,
    short: "Red and black, stamped with SMFC on the panels. For champions that do know the ball.",
    description:
      "Limited edition red and black football, stamped with SMFC and Jameson Ginger Ale logos on the panels. For champions that do know the ball.",
    images: img("8.png"),
    variants: single(52550262063397),
  },
  {
    handle: "she-they-maut-crop-top-smcr001",
    title: "She/They Maut Crop Top",
    code: "SMCR-001",
    type: "Crop Top",
    price: 1300,
    collections: ["core"],
    short: "SHE/THEY MAUT. 220 GSM, 100% cotton, cropped fit.",
    description: "SHE/THEY MAUT crop top. Clean lines, easy wear, built for everyday rotation. 220 GSM, 100% cotton, cropped fit. Made in India.",
    images: img("shetheycroptop1_e7a83cd8-b3bd-4691-8dd5-f35041dfac44.webp", "shetheycroptop2_ba8cc114-0583-4a57-b2cd-a6862e5fc781.webp"),
    sizeChart: CDN + "Sizing-w-crop.gif",
    variants: sized([52550263374117, 52550263406885, 52550263439653, 52550263472421, 52550263505189]),
  },
  {
    handle: "bayaan-picture-smvi002",
    title: "Bayaan 12\" Picture Disk Signed Vinyl",
    code: "SMVI-002",
    type: "Vinyl",
    price: 4150,
    collections: ["vinyl", "smx"],
    limited: true,
    short: "Signed first-pressing picture disk of the debut album. A collector's item.",
    description:
      "Seedhe Maut's seminal debut album 'Bayaan' on 12\" vinyl. This signed first-pressing limited edition picture disk variation is sure to be a collector's item. Feel the full Bayaan sonic experience in analogue. And yes, it will be signed by Seedhe Maut.",
    images: img("bayaanvinyl1.webp", "bayaanvinyl2.webp", "bayaanvinyl3.webp", "bayaanvinyl4.webp", "bayaanvinyl5.webp"),
    variants: single(52550262817061),
  },
  {
    handle: "smx-pattern-polo-shirt-smts006",
    title: "SMX Pattern Polo Shirt",
    code: "SMTS-006",
    type: "Polo",
    price: 1000,
    compareAt: 2000,
    collections: ["smx"],
    short: "Structured collar, all-over SMX pattern. 220 GSM, 100% cotton.",
    description:
      "Elevating the classic polo with 10 years of Seedhe Maut. Made from 220 GSM, 100% cotton, this polo carries an all-over SMX pattern of Seedhe Maut icons, a design that represents a decade of sound, hustle and legacy. Equal parts timeless and statement.",
    images: img("smpatternpolo1.webp", "smpatternpolo2.webp"),
    sizeChart: CDN + "Sizing-polo.gif",
    variants: sized([52550263996709, 52550264029477, 52550264062245, 52550264095013, 52550264127781]),
  },
  {
    handle: "seedhe-made-logo-mask-snood-smsn001",
    title: "Seedhe Made Logo Mask / Snood",
    code: "SMSN-001",
    type: "Snood",
    price: 300,
    collections: ["core", "accessories"],
    short: "For those who ride hard and never hold back. Tera Bhai Seedhe Maut.",
    description:
      "For those who ride hard and never hold back, this is more than just protection, it's a statement. Inspired by Seedhe Maut's relentless spirit: bold, fearless, and ready to take on whatever's ahead. Wear it loud, wear it proud. Tera Bhai Seedhe Maut.",
    images: img("smlogomask1.webp", "smlogomask2.webp"),
    variants: single(52550265143589),
  },
  {
    handle: "jersey-shorts-smcj03",
    title: "SMFC Jersey Shorts",
    type: "Shorts",
    price: 1600,
    collections: ["smfc"],
    limited: true,
    short: "Black shorts with red borders and SMFC, DL91 and Jameson J touches.",
    description:
      "Black jersey shorts with striking red borders and signature SMFC, DL91 and Jameson J touches. Limited edition, made for the pitch, ready for the streets.",
    images: img("7.png", "6.png"),
    sizeChart: CDN + "sizing-smfc.png",
    variants: sized([52550261178661, 52550261211429, 52550261244197, 52550261276965], false, ["S", "M", "L", "XL"]),
  },
  {
    handle: "smx-2025-tour-tshirt-smts007",
    title: "SMX 2025 Tour T-Shirt",
    code: "SMTS-007",
    type: "T-Shirt",
    price: 2000,
    collections: ["smx"],
    short: "For those who've lived the grind with Seedhe Maut. Bold, relentless, unapologetic.",
    description:
      "Celebrating 10 years of breaking boundaries, this tour tee is for those who've lived the grind with Seedhe Maut: bold, relentless and always unapologetic. Made in India.",
    images: img("tourtshirt1.webp", "tourtshirt2.webp", "tourtshirt3.webp"),
    sizeChart: CDN + "sizing-os.jpg",
    variants: sized([52550262554917, 52550262587685, 52550262620453, 52550262653221, 52550262685989]),
  },
  {
    handle: "smx-limited-edition-mask-snood-smsn002",
    title: "SMX Limited Edition Mask / Snood",
    code: "SMSN-002",
    type: "Snood",
    price: 350,
    collections: ["smx", "accessories"],
    limited: true,
    short: "The SMX edition snood. Wear it loud, wear it proud.",
    description:
      "For those who ride hard and never hold back, this is more than just protection, it's a statement. Inspired by Seedhe Maut's relentless spirit. Whether you're on the road or in the streets, wear it loud, wear it proud. Tera Bhai Seedhe Maut.",
    images: img("smlimitedmask1.webp", "smlimitedmask2.webp"),
    variants: single(52550263243045),
  },
];

export const productByHandle = new Map(products.map((p) => [p.handle, p]));

export const isSoldOut = (p: Product) => p.variants.every((v) => !v.available);

export type Collection = {
  handle: CollectionHandle;
  title: string;
  kicker: string;
  intro: string;
  body: string;
  field: string;
  ink: string;
  accent: string;
  specs: [string, string][];
};

export const collections: Collection[] = [
  {
    handle: "smfc",
    title: "SMFC",
    kicker: "Drop is live",
    intro: "Red and black stripes, the signature dragons, and a nameplate for each of them.",
    body: "The Seedhe Maut Football Club kit: Calm and Encore jerseys, shorts, the ball, a sipper and the duffle to carry it all. Limited run, made for the pitch, ready for the streets.",
    field: "#b3201a",
    ink: "#f6efe8",
    accent: "#111111",
    specs: [
      ["Pieces", "6"],
      ["Colourway", "Red / Black"],
      ["Run", "Limited"],
    ],
  },
  {
    handle: "smx",
    title: "SMX",
    kicker: "Ten years",
    intro: "A decade of Seedhe Maut, printed, pressed and stitched.",
    body: "The tenth-anniversary line. The SMX pattern of Seedhe Maut icons, the 2025 tour, the Devanagari invert, and both albums on wax.",
    field: "#141414",
    ink: "#efede8",
    accent: "#d7261e",
    specs: [
      ["Pieces", "13"],
      ["Since", "2015"],
      ["Made in", "India"],
    ],
  },
  {
    handle: "core",
    title: "Core",
    kicker: "Daily rotation",
    intro: "The logo, the stick-men, and the things you reach for every day.",
    body: "Heavyweight cotton tees, crops and tanks, the Killing It pins and mug, the gamosa, and the Lunchbreak set. Everything in the everyday kit.",
    field: "#e4e2dc",
    ink: "#141414",
    accent: "#d7261e",
    specs: [
      ["Pieces", "13"],
      ["Cotton", "200 to 260 GSM"],
      ["Made in", "India"],
    ],
  },
  {
    handle: "vinyl",
    title: "Vinyl",
    kicker: "In analogue",
    intro: "Bayaan and Nayaab, first pressings, two of them signed.",
    body: "The debut album and the follow-up, on 12\" black and picture-disk editions. Pressed in India, sure to be collector's items.",
    field: "#2a2622",
    ink: "#efe7da",
    accent: "#e2b062",
    specs: [
      ["Records", "4"],
      ["Format", "12\" LP"],
      ["Pressed in", "India"],
    ],
  },
  {
    handle: "accessories",
    title: "Accessories",
    kicker: "Carry it",
    intro: "Pins, prints, bandanas, a gaming pad, and a mug to cause a riot with.",
    body: "The small things that say a lot. From the Into Battle A2 print to the Killing It pins, everything that isn't a shirt.",
    field: "#d9d4c7",
    ink: "#161616",
    accent: "#b3201a",
    specs: [
      ["Pieces", "12"],
      ["From", "Rs. 300"],
      ["Made in", "India"],
    ],
  },
];

export const collectionByHandle = new Map(collections.map((c) => [c.handle, c]));

export const productsIn = (handle: CollectionHandle) => products.filter((p) => p.collections.includes(handle));

export const formatPrice = (n: number) => "Rs. " + n.toLocaleString("en-IN");

export const STORE_ORIGIN = "https://maal.seedhemaut.com";
export const LOGO = CDN + "SM_logo_final.png";
export const HERO_VIDEO = "https://cdn.shopify.com/videos/c/o/v/13caee1a43c842f193807058ff77023b.mp4";
