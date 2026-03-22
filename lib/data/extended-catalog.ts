import { Product, Category } from './products'

const IMG = {
  kitchen1: '/images/products/pot-set-5.jpg',
  kitchen2: '/images/products/pan-pro-28.jpg',
  kitchen3: '/images/products/casserole-24.jpg',
  kitchen4: '/images/products/wok-32.jpg',
  kitchen5: '/images/products/grill-pan.jpg',
  kitchen6: '/images/products/knife-set-6.jpg',
  kitchen7: '/images/products/board-oak.jpg',
  kitchen8: '/images/products/board-walnut.jpg',
}

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const getRandomImgs = (seed: number) => {
  const images = Object.values(IMG);
  const idx1 = Math.floor(pseudoRandom(seed) * images.length);
  const idx2 = Math.floor(pseudoRandom(seed + 1) * images.length);
  return [images[idx1], images[idx2 === idx1 ? (idx2 + 1) % images.length : idx2]];
}

export const extendedCategoriesList: Category[] = [
  { id: 'smart_kitchen', name: { de: 'Smart Kitchen' }, image: IMG.kitchen1, count: 24 },
  { id: 'elektrokleingeraete', name: { de: 'Elektrokleingeräte' }, image: IMG.kitchen2, count: 28 },
  { id: 'sous_vide', name: { de: 'Sous-Vide & Vakuum' }, image: IMG.kitchen3, count: 22 },
  { id: 'kaffee_tee', name: { de: 'Kaffee & Tee Bar' }, image: IMG.kitchen4, count: 35 },
  { id: 'weinzubehoer', name: { de: 'Wein & Bar' }, image: IMG.kitchen5, count: 20 },
  { id: 'fermentation', name: { de: 'Fermentation' }, image: IMG.kitchen6, count: 18 },
  { id: 'grillen', name: { de: 'Indoor Grill & Teppanyaki' }, image: IMG.kitchen7, count: 25 },
  { id: 'messer_premium', name: { de: 'Premium Messer (Damast)' }, image: IMG.kitchen8, count: 30 },
  { id: 'backen', name: { de: 'Backen & Pâtisserie' }, image: IMG.kitchen1, count: 40 },
  { id: 'wok', name: { de: 'Wok & Asiatisch' }, image: IMG.kitchen2, count: 21 },
  { id: 'nachhaltigkeit', name: { de: 'Eco & Nachhaltigkeit' }, image: IMG.kitchen3, count: 26 },
  { id: 'aufbewahrung', name: { de: 'Aufbewahrung Premium' }, image: IMG.kitchen4, count: 32 },
  { id: 'pflege', name: { de: 'Spezial-Pflege' }, image: IMG.kitchen5, count: 15 },
]

// Base products per category to multiply into variants
const categoryBases: Record<string, { baseName: string, desc: string, priceBase: number, material: string }[]> = {
  smart_kitchen: [
    { baseName: 'Smart Bluetooth Fleischthermometer PRO', desc: 'Drahtloses Premium-Thermometer mit App-Anbindung (iOS/Android). 50m Reichweite, misst Kerntemperatur exakt.', priceBase: 129, material: 'Edelstahl / Keramik' },
    { baseName: 'Intelligente Küchenwaage NOVA Sync', desc: 'Verbindet sich mit Rezept-Apps, grammgenaues Wiegen, Nährwertberechnung in Echtzeit.', priceBase: 89, material: 'Gehärtetes Glas' },
    { baseName: 'Induktions-Sensor Thermocontrol', desc: 'Aufstecksensor für genaue Temperaturkontrolle am Topfrand. Verhindert Überkochen.', priceBase: 149, material: 'Silikon / Edelstahl' },
    { baseName: 'Smart Timer Echo', desc: 'Sprachgesteuerter Premium-Küchentimer mit 4 gleichzweitigen Alarmen und LED-Ring.', priceBase: 69, material: 'Aluminium' }
  ],
  elektrokleingeraete: [
    { baseName: 'High-Performance Vakuum-Blender V9', desc: 'Mischt unter Vakuum für maximale Nährstofferhaltung und leuchtende Farben ohne Oxidation.', priceBase: 399, material: 'Tritan / Edelstahl' },
    { baseName: 'Präzisions-Wasserkocher gooseneck', desc: 'Auf 1°C genaue Temperatureinstellung für perfekten Tee oder Pour-over Kaffee. Maintien au chaud 60 min.', priceBase: 159, material: 'Edelstahl beschichtet' },
    { baseName: 'Quarz-Toaster Artisan', desc: 'Infrarot-Quarztechnologie für besonders gleichmäßige Bräunung ohne Austrocknen.', priceBase: 199, material: 'Edelstahl gebürstet' },
    { baseName: 'Induktions-Milchaufschäumer', desc: 'Magnetischer Antrieb, komplett spülmaschinenfest. Perfekter Mikroschaum für Latte Art.', priceBase: 119, material: 'Edelstahl rostfrei' }
  ],
  sous_vide: [
    { baseName: 'Profi Sous-Vide Stick 1200W', desc: 'Ultra-präziser Thermoplongeur, wasserdicht (IPX7), flüsterleise. Hält Temperatur auf 0.1°C genau.', priceBase: 189, material: 'Polycarbonat / Edelstahl' },
    { baseName: 'Kammer-Vakuumiergerät Chef', desc: 'Für Flüssigkeiten geeignet. Extrem starkes Vakuum für professionelle Ergebnisse zu Hause.', priceBase: 599, material: 'Edelstahl massiv' },
    { baseName: 'Vakuum-Folienrollen Eco-Safe', desc: 'BPA-frei, kochfest bis 100°C, extrem reißfest und wiederverwendbar (Set aus 5 Rollen).', priceBase: 39, material: 'BPA-freies PA/PE' },
    { baseName: 'Sous-Vide Isolationskugeln', desc: 'Verhindern Wasserverdunstung und Wärmeverlust vollflächig besser als Deckel. 250 Stück.', priceBase: 29, material: 'BPA-freies Silikon' }
  ],
  kaffee_tee: [
    { baseName: 'Manuelle Espresso-Presse NOVA', desc: 'Echter 9-Bar Espresso ohne Strom. Perfekte Extraktion für Zuhause oder Unterwegs.', priceBase: 299, material: 'Aluminium / Kupfer' },
    { baseName: 'Kaffeemühle mit Kegelmahlwerk', desc: 'Stufenlose Mahlgradeinstellung, antistatisch. 40mm Titan-Kegelmahlwerk.', priceBase: 249, material: 'Aluminium eloxiert' },
    { baseName: 'Pour-Over Kaffeebereiter Set', desc: 'Inkl. Glaskaraffe (800ml), wiederverwendbarem Edelstahl-Dauerfilter und Dosierlöffel.', priceBase: 89, material: 'Borosilikatglas / Kupfer' },
    { baseName: 'Doppelwandige Matcha-Schale', desc: 'Thermo-Schale hält Matcha heiß, ohne dass man sich die Hände verbrennt. Inkl. Bambusbesen.', priceBase: 59, material: 'Keramik / Bambus' }
  ],
  weinzubehoer: [
    { baseName: 'Elektrischer Profi-Korkenzieher', desc: 'Entkorkt jede Flasche auf Knopfdruck in 3 Sekunden. Akku reicht für 60 Flaschen. Inkl. Kapselschneider.', priceBase: 79, material: 'Aluminium / Teflon' },
    { baseName: 'Weinbelüfter-Dekantierer', desc: 'Belüftet den Wein direkt beim Einschenken. Ersetzt stundenlanges Dekantieren in der Karaffe.', priceBase: 39, material: 'Acryl / Silikon' },
    { baseName: 'Automatische Weinpumpe (Vakuum)', desc: 'Pumpt automatisch Luft ab, wenn sie auf die Flasche gesetzt wird. Wein bleibt bis zu 14 Tage frisch.', priceBase: 69, material: 'Edelstahl lackiert' },
    { baseName: 'Sektkühler Thermosleeve', desc: 'Gel-Kühlmanschette, kühlt warme Flaschen in 15 Min auf Serviertemperatur.', priceBase: 49, material: 'Neopren / Kühlgel' }
  ],
  fermentation: [
    { baseName: 'Fermentations-Glas Set 2L', desc: 'Das perfekte Set für Kimchi & Sauerkraut. Mit Entlüftungsventil und Beschwerungssteinen aus Glas.', priceBase: 69, material: 'BPA-freies Industrieglas' },
    { baseName: 'Kombucha Brauset Starter Kit', desc: '4L Gärgefäß mit Zapfhahn, Bio-SCOBY, Baumwolltuch und Premium Tee-Mischung.', priceBase: 89, material: 'Glas / Edelstahl / Baumwolle' },
    { baseName: 'Sauerteig Gärkorb-Set', desc: 'Banneton aus natürlichem Rattan, inkl. Teigritzer (Lame) und Teigspachtel.', priceBase: 49, material: 'Naturrattan' }
  ],
  grillen: [
    { baseName: 'Induktions-Teppanyaki Platte', desc: 'Massive Grillplatte, ideal für Flex-Induktionszonen. Gleichmäßige 300°C Hitze für asiatisches Grillen.', priceBase: 249, material: 'Edelstahl / Aluminiumkern' },
    { baseName: 'Gusseisen Burger-Presse', desc: 'Schwere Ausführung (1.2kg) für perfekte Smash-Burger. Mit Echtholzgriff gegen Hitzeübertragung.', priceBase: 45, material: 'Gusseisen / Akazienholz' },
    { baseName: 'Grill-Thermopad für Induktion', desc: 'Hitzebeständige Matte, schützt das Kochfeld beim Einsatz von Gusseisen vor Kratzern (bis 350°C).', priceBase: 29, material: 'Glasfaser / Silikon' }
  ],
  messer_premium: [
    { baseName: 'Gyuto Kochmesser 21cm - Damast', desc: '67 Lagen Damaststahl, VG-10 Kern. Rasiermesserscharf geschliffen (15° Winkel). Für Profis.', priceBase: 199, material: 'VG-10 Damast / Pakkaholz' },
    { baseName: 'Santoku Allzweckmesser 17cm', desc: 'Traditionelle Klingenform mit Kullenschliff. Nichts klebt an. Perfekt ausbalanciert.', priceBase: 159, material: 'VG-10 Damast / Pakkaholz' },
    { baseName: 'Premium Schleifstein-Set 1000/6000', desc: 'Zweiseitiger japanischer Wasserschleifstein inkl. rutschfestem Bambushalter und Winkelhilfe.', priceBase: 79, material: 'Korund (Edelkorund)' }
  ],
  backen: [
    { baseName: 'Platin-Silikon Backform-Set', desc: 'Flexibel, 100% BPA-frei, kein Einfetten nötig. Hitzebeständig bis 260°C. 5-teilig.', priceBase: 89, material: '100% Platin-Silikon' },
    { baseName: 'Profi-Teigmaschine 1500W', desc: 'Kraftvoller Direct-Drive Motor, knetet bis zu 2.5kg schweren Hefeteig mühelos.', priceBase: 599, material: 'Zink-Druckguss' },
    { baseName: 'Silpat-Style Dauerbackfolie', desc: 'Verstärkte Glasfaser-Silikonmatte für Macarons, Brot und Plätzchen. Ersetzt Backpapier.', priceBase: 25, material: 'Lebensmittelsilikon & Glasfaser' }
  ],
  wok: [
    { baseName: 'Carbonstahl Wok 32cm (Flat Bottom)', desc: 'Leichtfließendes Öl-Einbrennen möglich. Der flache Boden sitzt perfekt auf der Induktion.', priceBase: 89, material: 'Carbonstahl natur' },
    { baseName: 'Wok-Zubehör Set (3-teilig)', desc: 'Beinhaltet Wendenkelle (Chuan), Schaumlöffel und Bambus-Reinigungsbesen.', priceBase: 49, material: 'Edelstahl / Bambus' },
    { baseName: 'Dim Sum Dämpfkörbe (3 Etagen)', desc: 'Original asiatische Bambusdämpfer, passen exakt auf unseren 32cm Wok. Für schonendes Dampfgaren.', priceBase: 39, material: 'Natur-Bambus' }
  ],
  nachhaltigkeit: [
    { baseName: 'Bienenwachstuch-Set (5 Größen)', desc: 'Plastikfreie Alternative zu Frischhaltefolie. Aus Bio-Baumwolle und echtem Bienenwachs.', priceBase: 35, material: 'Baumwolle, Bienenwachs, Jojobaöl' },
    { baseName: 'Kompostierbare Schwämme (12er Pack)', desc: '100% plastikfrei, extrem saugstark, wischen streifenfrei und können in den Biomüll.', priceBase: 29, material: 'Holzzellulose & Baumwolle' },
    { baseName: 'Dauer-Kaffeefilter aus Edelstahl', desc: 'Feinmaschig (Mikromesh) - rettet hunderte Papierfilter. Geschmacksneutral und leicht zu reinigen.', priceBase: 24, material: '304 Edelstahl' }
  ],
  aufbewahrung: [
    { baseName: 'Vakuum-Glasbehälter Set 5-teilig', desc: 'Borosilikatglas mit Vakuumventil im Deckel. Backofengeeignet (ohne Deckel) und stapelbar.', priceBase: 119, material: 'Glas / Silikon / Tritan' },
    { baseName: 'UV-Schutz Gewürzgläser (12 Stück)', desc: 'Violettglas blockiert schädliche Lichtstrahlen und erhält das Aroma der Gewürze über Jahre.', priceBase: 89, material: 'Miron-Violettglas' },
    { baseName: 'Modulares Vorratssystem Pantry-Pro', desc: 'Klare Behälter mit Pop-Up Vakuumverschluss für Mehl, Zucker, Pasta. Extrem platzsparend.', priceBase: 149, material: 'BPA-freier Kunststoff' }
  ],
  pflege: [
    { baseName: 'Nova Clean Induktionspflege', desc: 'Spezial-Polierpaste für Kratzer-Minimierung und Spiegelglanz. 100% biologisch abbaubar.', priceBase: 29, material: 'Organische Wirkstoffe' },
    { baseName: 'Edelstahl-Glanz & Schutz Spray', desc: 'Entfernt Fingerabdrücke und bildet eine schmutzabweisende Schutzschicht auf Töpfen.', priceBase: 25, material: 'Aerosol-frei' },
    { baseName: 'Carbonstahl Wok-Wachs Einbrennhilfe', desc: 'Perfekte Mischung aus Bienenwachs und Traubenkernöl für die legendäre Antihaft-Patina.', priceBase: 22, material: 'Wachs / Öl-Mix' }
  ]
}

export const generateMassiveCatalog = (): any[] => {
  const generated: any[] = []
  let idCounter = 1000

  // Standard variants
  const variants = [
    { suffix: ' - Edition Onyx Black', priceMult: 1.2 },
    { suffix: ' - Edition Polar White', priceMult: 1.15 },
    { suffix: ' - Classic Steel', priceMult: 1.0 },
    { suffix: ' - Titan Grau', priceMult: 1.1 },
    { suffix: ' - Pro Series V2', priceMult: 1.4 },
    { suffix: ' - Compact Design', priceMult: 0.9 }
  ]

  for (const [categoryId, productsArr] of Object.entries(categoryBases)) {
    for (const base of productsArr) {
      // Create 6-7 variants per base product to reach ~20-30 per category
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i]
        const actualPrice = Math.round(base.priceBase * v.priceMult) - 0.01
        const generateSlug = (str: string) => {
          return str.toLowerCase()
            .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        
        generated.push({
          id: `nova-${categoryId}-${idCounter++}`,
          slug: `${generateSlug(base.baseName)}-${generateSlug(v.suffix)}`,
          name: { de: `${base.baseName}${v.suffix}` },
          category: categoryId,
          price: actualPrice,
          oldPrice: Math.round(actualPrice * 1.3),
          images: getRandomImgs(idCounter * 10),
          rating: 4.5 + (pseudoRandom(idCounter) * 0.5), // 4.5 to 5.0
          reviewCount: Math.floor(pseudoRandom(idCounter + 1) * 400) + 10,
          stock: Math.floor(pseudoRandom(idCounter + 2) * 150) + 2,
          badges: pseudoRandom(idCounter + 3) > 0.7 ? ['new'] as ('new' | 'premium' | 'bestseller')[] : [],
          description: { de: `${base.desc} Die ${v.suffix.replace(' - ', '')} bietet exklusives Design und herausragende Performance. Entwickelt für höchste Ansprüche in der modernen Küche.` },
          shortDescription: { de: base.desc.substring(0, 60) + '...' },
          specs: {
            material: base.material,
            dimensions: 'Standardgröße',
            weight: (pseudoRandom(idCounter + 4) * 3 + 0.5).toFixed(1) + ' kg',
            dishwasher: pseudoRandom(idCounter + 5) > 0.3,
            induction: true
          }
        })
      }
    }
  }

  return generated
}
