import { CropDiagnosis, CropGuide, DemoSample } from '../types/farming';

// Real SVG leaf representations for high-fidelity interactive demo images
export const SAMPLE_LEAF_IMAGES = {
  tomatoBlight: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <defs>
        <radialGradient id="leafGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#4ade80" />
          <stop offset="70%" stop-color="#15803d" />
          <stop offset="100%" stop-color="#14532d" />
        </radialGradient>
        <radialGradient id="blightSpot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3e2723" />
          <stop offset="40%" stop-color="#5d4037" />
          <stop offset="75%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#84cc16" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="#ecfdf5" rx="16"/>
      <!-- Stem -->
      <path d="M 250 480 Q 248 350 250 80" stroke="#166534" stroke-width="8" stroke-linecap="round" fill="none"/>
      <!-- Main Leaf Blade -->
      <path d="M 250 80 C 130 140 100 280 160 380 C 200 440 240 450 250 470 C 260 450 300 440 340 380 C 400 280 370 140 250 80 Z" fill="url(#leafGrad)" stroke="#14532d" stroke-width="4"/>
      <!-- Veins -->
      <path d="M 250 160 Q 200 140 150 160 M 250 230 Q 180 200 130 250 M 250 300 Q 190 280 160 340" stroke="#86efac" stroke-width="2.5" fill="none" opacity="0.6"/>
      <path d="M 250 160 Q 300 140 350 160 M 250 230 Q 320 200 370 250 M 250 300 Q 310 280 340 340" stroke="#86efac" stroke-width="2.5" fill="none" opacity="0.6"/>
      <!-- Concentric Early Blight Target Spots -->
      <circle cx="210" cy="220" r="38" fill="url(#blightSpot)"/>
      <circle cx="210" cy="220" r="28" stroke="#271c19" stroke-width="2" fill="none"/>
      <circle cx="210" cy="220" r="16" stroke="#1a120b" stroke-width="2" fill="none"/>
      <circle cx="300" cy="290" r="30" fill="url(#blightSpot)"/>
      <circle cx="300" cy="290" r="20" stroke="#271c19" stroke-width="1.5" fill="none"/>
      <circle cx="180" cy="330" r="24" fill="url(#blightSpot)"/>
      <!-- Yellow Chlorotic Halo Margins -->
      <path d="M 125 290 Q 110 340 145 375" stroke="#eab308" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.75"/>
      <text x="250" y="40" font-family="sans-serif" font-weight="bold" font-size="20" fill="#15803d" text-anchor="middle">Tomato: Early Blight (Alternaria solani)</text>
    </svg>
  `)}`,

  riceBlast: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#f0fdf4" rx="16"/>
      <!-- Rice Blade -->
      <path d="M 230 480 C 220 300 240 150 250 50 C 260 150 280 300 270 480 Z" fill="#22c55e" stroke="#15803d" stroke-width="3"/>
      <path d="M 250 50 L 250 480" stroke="#86efac" stroke-width="2"/>
      <!-- Spindle/Diamond shaped lesions -->
      <g transform="translate(250, 180) rotate(-15)">
        <ellipse cx="0" cy="0" rx="35" ry="12" fill="#78350f" stroke="#ca8a04" stroke-width="3"/>
        <ellipse cx="0" cy="0" rx="20" ry="6" fill="#e2e8f0"/>
      </g>
      <g transform="translate(245, 270) rotate(10)">
        <ellipse cx="0" cy="0" rx="42" ry="14" fill="#78350f" stroke="#ca8a04" stroke-width="3"/>
        <ellipse cx="0" cy="0" rx="24" ry="7" fill="#e2e8f0"/>
      </g>
      <g transform="translate(252, 360) rotate(-5)">
        <ellipse cx="0" cy="0" rx="28" ry="10" fill="#78350f" stroke="#ca8a04" stroke-width="2.5"/>
        <ellipse cx="0" cy="0" rx="14" ry="5" fill="#e2e8f0"/>
      </g>
      <text x="250" y="35" font-family="sans-serif" font-weight="bold" font-size="20" fill="#15803d" text-anchor="middle">Rice: Blast / Bacterial Blight</text>
    </svg>
  `)}`,

  wheatRust: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#fefce8" rx="16"/>
      <!-- Wheat Leaf Blade -->
      <path d="M 220 490 C 210 320 230 170 250 40 C 270 170 290 320 280 490 Z" fill="#84cc16" stroke="#4d7c0f" stroke-width="3"/>
      <!-- Yellow / Orange stripe pustules -->
      <line x1="240" y1="120" x2="240" y2="400" stroke="#f59e0b" stroke-width="5" stroke-dasharray="10 8"/>
      <line x1="248" y1="100" x2="248" y2="420" stroke="#d97706" stroke-width="4" stroke-dasharray="8 6"/>
      <line x1="256" y1="140" x2="256" y2="390" stroke="#f59e0b" stroke-width="5" stroke-dasharray="12 7"/>
      <line x1="264" y1="160" x2="264" y2="370" stroke="#ea580c" stroke-width="4" stroke-dasharray="6 6"/>
      <text x="250" y="32" font-family="sans-serif" font-weight="bold" font-size="20" fill="#a16207" text-anchor="middle">Wheat: Yellow Stripe Rust (Puccinia striiformis)</text>
    </svg>
  `)}`,

  cottonCurl: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#f0fdf4" rx="16"/>
      <!-- Curled crumpled cotton leaf -->
      <path d="M 250 450 C 180 420 120 370 110 300 C 100 220 160 160 210 120 C 230 80 270 80 290 120 C 340 160 400 220 390 300 C 380 370 320 420 250 450 Z" fill="#65a30d" stroke="#3f6212" stroke-width="4"/>
      <!-- Upward curling / thickening veins -->
      <path d="M 250 450 L 250 140 M 250 300 Q 180 240 140 280 M 250 300 Q 320 240 360 280" stroke="#facc15" stroke-width="6" fill="none"/>
      <!-- Mottled yellow mosaic patches -->
      <circle cx="190" cy="220" r="24" fill="#eab308" opacity="0.6"/>
      <circle cx="310" cy="230" r="26" fill="#eab308" opacity="0.6"/>
      <circle cx="250" cy="220" r="18" fill="#ca8a04" opacity="0.5"/>
      <text x="250" y="40" font-family="sans-serif" font-weight="bold" font-size="20" fill="#15803d" text-anchor="middle">Cotton: Leaf Curl Virus (CLCuV)</text>
    </svg>
  `)}`,

  healthyLeaf: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#f0fdf4" rx="16"/>
      <!-- Pristine healthy leaf -->
      <path d="M 250 60 C 130 130 110 270 170 380 C 210 430 240 450 250 460 C 260 450 290 430 330 380 C 390 270 370 130 250 60 Z" fill="#16a34a" stroke="#15803d" stroke-width="4"/>
      <path d="M 250 60 L 250 460" stroke="#86efac" stroke-width="4"/>
      <path d="M 250 150 Q 190 130 150 170 M 250 230 Q 180 200 140 250 M 250 310 Q 190 280 170 340" stroke="#4ade80" stroke-width="3" fill="none"/>
      <path d="M 250 150 Q 310 130 350 170 M 250 230 Q 320 200 360 250 M 250 310 Q 310 280 330 340" stroke="#4ade80" stroke-width="3" fill="none"/>
      <text x="250" y="35" font-family="sans-serif" font-weight="bold" font-size="20" fill="#15803d" text-anchor="middle">Healthy Leaf / स्वस्थ पत्ती</text>
    </svg>
  `)}`
};

export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'demo-tomato-blight',
    title: 'Tomato Early Blight',
    titleHindi: 'टमाटर अगेती झुलसा (Early Blight)',
    crop: 'Tomato / टमाटर',
    previewUrl: SAMPLE_LEAF_IMAGES.tomatoBlight,
    diagnosis: {
      id: 'diag-tomato-01',
      cropName: 'Tomato (Solanum lycopersicum)',
      cropNameHindi: 'टमाटर',
      diseaseName: 'Early Blight (Alternaria solani)',
      diseaseNameHindi: 'अगेती झुलसा (ऑल्टरनेरिया सोलानी)',
      isHealthy: false,
      confidenceScore: 94,
      confidenceLevel: 'HIGH',
      pathogenType: 'Fungal',
      symptomsSummary: 'Distinct dark brown to black necrotic spots with characteristic concentric rings (target board pattern) surrounded by chlorotic yellow halos on lower foliage.',
      symptomsSummaryHindi: 'निचली पत्तियों पर गहरे भूरे रंग के छल्लेदार धब्बे (टारगेट बोर्ड जैसे) और उनके चारों ओर पीले घेरे दिखाई दे रहे हैं।',
      affectedLeafArea: '20% - 30%',
      urgency: 'Immediate (1-2 days)',
      immediateSafeSteps: [
        'Prune and safely burn or bury heavily infected lower leaves; do NOT compost them.',
        'Avoid overhead sprinkler watering; use drip or furrow irrigation to keep foliage dry.',
        'Spray organic Neem Oil (5ml/L of water with 1ml liquid soap) early morning to contain spore germination.',
        'Apply bio-fungicide Trichoderma viride @ 5g/L on soil and foliage.'
      ],
      immediateSafeStepsHindi: [
        'संक्रमित निचली पत्तियों को काटकर खेत से दूर जला दें या दबा दें; खाद में न डालें।',
        'फव्वारा सिंचाई से बचें; ड्रिप या थाला विधि अपनाएं ताकि पत्तियां सूखी रहें।',
        'सुबह के समय 5 मिली नीम तेल प्रति लीटर पानी में मिलाकर छिड़काव करें।',
        'ट्राइकोडर्मा विरिडी (Trichoderma viride) 5 ग्राम प्रति लीटर की दर से छिड़कें।'
      ],
      chemicalRemedies: [
        {
          name: 'Mancozeb 75% WP (Indofil M-45)',
          dosage: '2.0 - 2.5 g per liter of water',
          safetyPrecaution: 'Wear mask and rubber gloves during application. Spray during clear weather.',
          phiDays: 5
        },
        {
          name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)',
          dosage: '1.0 ml per liter of water',
          safetyPrecaution: 'Use for severe outbreak. Rotate with contact fungicides to prevent resistance.',
          phiDays: 3
        }
      ],
      preventionChecklist: [
        'Maintain crop rotation with non-solanaceous crops (avoid potato/chilli in same plot).',
        'Ensure plant-to-plant spacing of 60cm x 45cm for air circulation.',
        'Mulch soil with straw or black plastic to stop soil-borne fungal splash.',
        'Disinfect all pruning shears with 70% alcohol or diluted bleach.'
      ],
      preventionChecklistHindi: [
        'फसल चक्र अपनाएं, उसी खेत में तुरंत आलू या मिर्च न लगाएं।',
        'हवा के संचार के लिए पौधों के बीच 60x45 सेमी की पर्याप्त दूरी रखें।',
        'मिट्टी पर पुआल की मल्चिंग करें ताकि मिट्टी के फफूंद छींटों से पत्तों तक न पहुंचें।',
        'कटाई-छंटाई के औजारों को साफ व सैनिटाइज रखें।'
      ],
      uncertaintyNote: 'AI diagnosis is based on computer vision patterns. Weather variations or co-infections may mimic similar lesions. Please verify with physical leaf samples at your local Krishi Vigyan Kendra (KVK).',
      uncertaintyNoteHindi: 'यह एआई आधारित प्राथमिक सलाह है। मौसम या अन्य पोषक तत्व कमी के लक्षण भी इससे मिलते-जुलते हो सकते हैं। नजदीकी कृषि विज्ञान केंद्र से अंतिम पुष्टि अवश्य करें।',
      kvkRecommendation: 'Kisan Call Centre toll-free helpline: 1800-180-1551 (6 AM to 10 PM in Hindi & regional languages).',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'demo-wheat-rust',
    title: 'Wheat Yellow Stripe Rust',
    titleHindi: 'गेहूं पीला रतुआ (Yellow Rust)',
    crop: 'Wheat / गेहूं',
    previewUrl: SAMPLE_LEAF_IMAGES.wheatRust,
    diagnosis: {
      id: 'diag-wheat-02',
      cropName: 'Wheat (Triticum aestivum)',
      cropNameHindi: 'गेहूं',
      diseaseName: 'Yellow Stripe Rust (Puccinia striiformis)',
      diseaseNameHindi: 'पीला रतुआ / हल्दी रोग',
      isHealthy: false,
      confidenceScore: 92,
      confidenceLevel: 'HIGH',
      pathogenType: 'Fungal',
      symptomsSummary: 'Parallel bright yellow to golden-orange powdery pustules arranged in linear stripes along the leaf veins, rubbing off on fingers like turmeric powder.',
      symptomsSummaryHindi: 'पत्तियों की नसों के समानांतर पीले-नारंगी रंग की धारियां, उंगली लगाने पर हल्दी जैसा पीला पाउडर चिपकता है।',
      affectedLeafArea: '15% - 25%',
      urgency: 'Immediate (1-2 days)',
      immediateSafeSteps: [
        'Inspect field daily in early morning for yellow patches, especially in humid shaded corners.',
        'Do not delay spray once first focal foci (patches) are observed to avoid rapid airborne spread.',
        'Avoid excessive nitrogen (urea) application which makes plants succulent and susceptible.'
      ],
      immediateSafeStepsHindi: [
        'सुबह के समय खेत की निगरानी करें, विशेषकर छायादार व नम कोनों में।',
        'पीले धब्बे दिखते ही तुरंत उपचार करें, यह हवा से तेजी से फैलता है।',
        'यूरिया का जरूरत से ज्यादा इस्तेमाल न करें क्योंकि इससे पत्तियां कोमल होकर रोग पकड़ती हैं।'
      ],
      chemicalRemedies: [
        {
          name: 'Propiconazole 25% EC (Tilt)',
          dosage: '1.0 ml per liter of water (200 ml in 200 liters water per acre)',
          safetyPrecaution: 'Spray thoroughly on foliage on a calm sunny day when dew has dried.',
          phiDays: 30
        },
        {
          name: 'Tebuconazole 25.9% EC (Folicur)',
          dosage: '1.0 - 1.25 ml per liter of water',
          safetyPrecaution: 'Use conical mist nozzle for uniform canopy coverage.',
          phiDays: 30
        }
      ],
      preventionChecklist: [
        'Grow resistant certified varieties (e.g. DBW 187, DBW 222, HD 3226, PBW 725).',
        'Avoid late sowing of wheat in North-Western plains.',
        'Practice balanced NPK fertilization with recommended Potash (MOP).'
      ],
      preventionChecklistHindi: [
        'रतुआ रोधी किस्में (जैसे DBW 187, HD 3226, PBW 725) ही बोएं।',
        'गेहूं की देर से बुवाई से बचें।',
        'संतुलित खाद डालें और पोटाश का उचित प्रयोग करें।'
      ],
      uncertaintyNote: 'Yellowing can occasionally occur due to zinc deficiency or frost. Stripe rust rubs off as yellow powder on fingers.',
      uncertaintyNoteHindi: 'जिंक की कमी या पाले से भी पत्तियां पीली हो सकती हैं, लेकिन रतुआ में उंगली पर पीला पाउडर लगता है।',
      kvkRecommendation: 'Report localized rust foci immediately to the district agriculture officer or ICAR-IIWBR Karnal advisory.',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'demo-rice-blast',
    title: 'Rice Blast / Leaf Blight',
    titleHindi: 'धान झुलसा रोग (Blast / Blight)',
    crop: 'Rice / Paddy (धान)',
    previewUrl: SAMPLE_LEAF_IMAGES.riceBlast,
    diagnosis: {
      id: 'diag-rice-03',
      cropName: 'Paddy / Rice (Oryza sativa)',
      cropNameHindi: 'धान (चावल)',
      diseaseName: 'Leaf Blast (Magnaporthe oryzae)',
      diseaseNameHindi: 'धान का ब्लास्ट / झोंका रोग',
      isHealthy: false,
      confidenceScore: 89,
      confidenceLevel: 'HIGH',
      pathogenType: 'Fungal',
      symptomsSummary: 'Spindle-shaped or eye-shaped lesions with pointed ends, gray/ash center and brown margins, merging together to cause leaf blighting.',
      symptomsSummaryHindi: 'नाव या आंख के आकार के धब्बे जिनका केंद्र राख जैसे रंग का और किनारे भूरे होते हैं।',
      affectedLeafArea: '10% - 20%',
      urgency: 'Immediate (1-2 days)',
      immediateSafeSteps: [
        'Drain excess standing water temporarily and maintain shallow water level.',
        'Withhold further top-dressing of nitrogen fertilizer until disease subsides.',
        'Spray Pseudomonas fluorescens @ 5g/liter as bio-agent.'
      ],
      immediateSafeStepsHindi: [
        'खेत से अतिरिक्त पानी निकालकर जलस्तर सामान्य करें।',
        'जब तक बीमारी नियंत्रित न हो, यूरिया की टॉप ड्रेसिंग रोक दें।',
        'स्यूडोमोनास फ्लोरेसेंस (Pseudomonas fluorescens) 5 ग्राम प्रति लीटर छिड़कें।'
      ],
      chemicalRemedies: [
        {
          name: 'Tricyclazole 75% WP (Beam / Baan)',
          dosage: '0.6 g per liter of water (120 g per acre in 200L water)',
          safetyPrecaution: 'Highly systemic and effective. Spray when initial symptoms appear.',
          phiDays: 30
        },
        {
          name: 'Isoprothiolane 40% EC (Fuji-One)',
          dosage: '1.5 ml per liter of water',
          safetyPrecaution: 'Wear face shield and protective clothes.',
          phiDays: 21
        }
      ],
      preventionChecklist: [
        'Treat seeds with Carbendazim 2g/kg or Trichoderma 10g/kg before sowing.',
        'Avoid dense planting; maintain 20cm row spacing for aeration.',
        'Apply split doses of nitrogen in 3 installments instead of single heavy application.'
      ],
      preventionChecklistHindi: [
        'बुवाई से पहले बीज शोधन ट्राइकोडर्मा (10 ग्राम/किग्रा) से अवश्य करें।',
        'पौधों को बहुत घना न लगाएं, 20 सेमी की दूरी रखें।',
        'नाइट्रोजन (यूरिया) को एक साथ न डालकर 3 किश्तों में दें।'
      ],
      uncertaintyNote: 'Symptoms resemble bacterial leaf streak under early stage. Observe whether lesion margin is wavy or water-soaked.',
      uncertaintyNoteHindi: 'शुरुआती अवस्था में यह बैक्टीरियल लीफ स्ट्रीक जैसा लग सकता है।',
      kvkRecommendation: 'Contact local KVK Rice specialist or ICAR-NRRI Cuttack advisory desk.',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'demo-cotton-curl',
    title: 'Cotton Leaf Curl Virus',
    titleHindi: 'कपास पत्ती मरोड़ रोग (CLCuV)',
    crop: 'Cotton / कपास',
    previewUrl: SAMPLE_LEAF_IMAGES.cottonCurl,
    diagnosis: {
      id: 'diag-cotton-04',
      cropName: 'Cotton (Gossypium hirsutum)',
      cropNameHindi: 'कपास',
      diseaseName: 'Cotton Leaf Curl Virus (CLCuV)',
      diseaseNameHindi: 'कपास का पत्ती मरोड़ / कुकड़ा रोग',
      isHealthy: false,
      confidenceScore: 91,
      confidenceLevel: 'HIGH',
      pathogenType: 'Viral',
      symptomsSummary: 'Upward or downward cupping/curling of leaves, thickening and darkening of main veins, and occasional small leaf-like enations on the underside.',
      symptomsSummaryHindi: 'पत्तियों का ऊपर या नीचे की ओर मुड़ना, नसों का मोटा और गहरा होना, पत्ती के नीचे छोटे उभार (enation)।',
      affectedLeafArea: '25% - 35%',
      urgency: 'Moderate (3-5 days)',
      immediateSafeSteps: [
        'Uproot and bury severely infected early plants to eliminate viral reservoir.',
        'Target the Whitefly (Bemisia tabaci) vector immediately, as the virus cannot be cured directly.',
        'Install yellow sticky traps (15-20 traps per acre) at canopy height to monitor and trap whiteflies.'
      ],
      immediateSafeStepsHindi: [
        'शुरुआती संक्रमित पौधों को उखाड़कर नष्ट करें ताकि बाकी फसल बच सके।',
        'रोग फैलाने वाली सफेद मक्खी (Whitefly) का तुरंत नियंत्रण करें।',
        'खेत में प्रति एकड़ 15-20 पीले चिपचिपे ट्रैप (Yellow Sticky Traps) लगाएं।'
      ],
      chemicalRemedies: [
        {
          name: 'Diafenthiuron 50% WP (Polo)',
          dosage: '1.2 g per liter of water',
          safetyPrecaution: 'Controls adult whiteflies and nymphs effectively. Spray underneath leaves.',
          phiDays: 20
        },
        {
          name: 'Pyriproxyfen 10% + Fenpropathrin 15% EC',
          dosage: '1.5 ml per liter of water',
          safetyPrecaution: 'Avoid spraying when honeybees are foraging in peak afternoon.',
          phiDays: 15
        }
      ],
      preventionChecklist: [
        'Sow CLCuD-resistant or tolerant Bt cotton hybrids recommended for your zone.',
        'Avoid planting alternate weed hosts (Abutilon indicum, Parthenium) around field borders.',
        'Complete sowing early (before mid-May) in Northern cotton belt.'
      ],
      preventionChecklistHindi: [
        'क्षेत्र के लिए अनुशंसित रोग-रोधी बीटी कपास की किस्में ही बोएं।',
        'खेत की मेड़ों से गाजर घास और खरपतवार को पूरी तरह साफ रखें।',
        'उत्तर भारत में कपास की बुवाई 15 मई से पहले पूरी कर लें।'
      ],
      uncertaintyNote: 'Severe sap-sucking pest infestation (thrips, aphids) can also cause leaf curling. Look for vein thickening to confirm CLCuV.',
      uncertaintyNoteHindi: 'माहू या थ्रिप्स के प्रकोप से भी पत्तियां मुड़ती हैं। नसों के मोटेपन को देखकर विषाणु की पहचान करें।',
      kvkRecommendation: 'Central Institute for Cotton Research (CICR) advisory hotline: 07103-275536.',
      timestamp: new Date().toISOString()
    }
  },
  {
    id: 'demo-healthy-leaf',
    title: 'Healthy Potato Foliage',
    titleHindi: 'स्वस्थ आलू की पत्तियां',
    crop: 'Potato / आलू',
    previewUrl: SAMPLE_LEAF_IMAGES.healthyLeaf,
    diagnosis: {
      id: 'diag-healthy-05',
      cropName: 'Potato (Solanum tuberosum)',
      cropNameHindi: 'आलू',
      diseaseName: 'No Disease Detected (Healthy Crop)',
      diseaseNameHindi: 'कोई रोग नहीं - पौधा पूर्णतः स्वस्थ है',
      isHealthy: true,
      confidenceScore: 98,
      confidenceLevel: 'HIGH',
      pathogenType: 'Healthy',
      symptomsSummary: 'Leaves exhibit uniform deep green coloration, clear venation, intact cuticle, and no necrotic lesions, chlorosis, or pest chewing marks.',
      symptomsSummaryHindi: 'पत्तियां एकसमान हरी हैं, कोई दाग-धब्बा, पीलापन या कीड़ों के काटने का निशान नहीं है।',
      affectedLeafArea: '0%',
      urgency: 'None',
      immediateSafeSteps: [
        'Maintain balanced moisture via earthing-up and furrow irrigation.',
        'Apply prophylactic organic spray of bio-stimulants or Panchagavya (3%) for vigour.',
        'Keep regular scouting twice a week to detect any initial late blight warning signs.'
      ],
      immediateSafeStepsHindi: [
        'मिट्टी चढ़ाने (Earthing up) के बाद संतुलित नमी बनाए रखें।',
        'पौधों की मजबूती के लिए पंचगव्य (3%) या जीवामृत का स्प्रे करें।',
        'सप्ताह में दो बार खेत का मुआयना करते रहें ताकि कोई नया रोग न पनपे।'
      ],
      chemicalRemedies: [],
      preventionChecklist: [
        'Ensure proper earthing-up at 30 days after planting to prevent greening of tubers.',
        'Monitor temperature: If cloudy weather with humidity > 85% persists, apply preventive Mancozeb @ 2g/L.'
      ],
      preventionChecklistHindi: [
        'बुवाई के 30 दिन बाद मिट्टी अच्छी तरह चढ़ाएं ताकि आलू धूप से हरे न हों।',
        'यदि मौसम में कई दिन तक बदली और नमी रहे, तो सुरक्षात्मक मैन्कोजेब स्प्रे करें।'
      ],
      uncertaintyNote: 'Leaf appears in prime physiological health. Ensure root tubers are also checked during earthing up.',
      uncertaintyNoteHindi: 'पत्ती पूरी तरह स्वस्थ है। जड़ों और कंदों की स्थिति पर भी नजर बनाए रखें।',
      kvkRecommendation: 'Continue best agronomic practices per CPRI (Central Potato Research Institute) calendar.',
      timestamp: new Date().toISOString()
    }
  }
];

export const CROP_GUIDES: CropGuide[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    nameHindi: 'गेहूं',
    scientificName: 'Triticum aestivum',
    category: 'Cereal',
    season: 'Rabi',
    durationDays: '120 - 140 Days',
    idealSoil: 'Well-drained fertile loam or clay-loam, pH 6.0 - 7.5',
    idealSoilHindi: 'दोमट या बलुई दोमट मिट्टी, अच्छी जल निकासी वाली, pH 6.0 - 7.5',
    idealTemp: '12°C - 25°C',
    wateringGuide: {
      frequency: '4 - 6 irrigations at critical stages',
      criticalStages: [
        'Crown Root Initiation (CRI) - 21 days after sowing (Most Critical)',
        'Tillering stage - 40 to 45 days',
        'Late Jointing stage - 60 to 65 days',
        'Flowering stage - 80 to 85 days',
        'Milking stage - 100 to 105 days',
        'Dough stage - 115 to 120 days'
      ],
      criticalStagesHindi: [
        'सीआरआई (शिखर जड़ अवस्था) - बुवाई के 21 दिन बाद (सबसे जरूरी)',
        'कल्ले फूटने की अवस्था - 40 से 45 दिन',
        'गांठ बनने की अवस्था - 60 से 65 दिन',
        'फूल आने की अवस्था - 80 से 85 दिन',
        'दूधिया अवस्था - 100 से 105 दिन',
        'दाना पकने की अवस्था - 115 से 120 दिन'
      ],
      tips: 'Never skip the first irrigation at Crown Root Initiation (CRI). Avoid waterlogging which causes yellowing.',
      tipsHindi: 'बुवाई के 20-22 दिन बाद पहली सिंचाई (CRI) कभी न छोड़ें। खेत में पानी रुकने न दें।'
    },
    nutrientManagement: {
      npkRatio: '120:60:40 kg/hectare (N:P2O5:K2O) + 25 kg Zinc Sulphate',
      organicRecommendation: 'Apply 10 tonnes well-decomposed FYM (Farmyard Manure) or Vermicompost before last ploughing.',
      organicRecommendationHindi: 'अंतिम जुताई के समय 8-10 टन अच्छी सड़ी गोबर की खाद या केंचुआ खाद मिलाएं।',
      deficiencySigns: 'Yellowing of older leaves indicates Nitrogen deficiency; bronze leaf margins indicate Potash deficiency; pale yellow streaks indicate Zinc deficiency.',
      deficiencySignsHindi: 'निचली पत्तियों का पीला पड़ना नाइट्रोजन की कमी है; किनारों का झुलसना पोटाश की कमी है।'
    },
    commonPestsAndDiseases: [
      {
        name: 'Yellow Stripe Rust',
        nameHindi: 'पीला रतुआ',
        type: 'Fungal',
        organicControl: 'Spray Trichoderma viride @ 5g/L; cultivate resistant varieties (DBW 187, HD 3226).',
        organicControlHindi: 'ट्राइकोडर्मा 5 ग्राम/लीटर या नीम तेल का छिड़काव करें।'
      },
      {
        name: 'Wheat Aphid (Mahun)',
        nameHindi: 'गेहूं का चेपा / माहू',
        type: 'Pest',
        organicControl: 'Spray 5% Neem Seed Kernel Extract (NSKE) or Verticillium lecanii bio-pesticide.',
        organicControlHindi: 'नीम के बीज का काढ़ा (NSKE 5%) या नीम तेल 5 मिली/लीटर छिड़कें।'
      },
      {
        name: 'Loose Smut',
        nameHindi: 'कंगियारी रोग',
        type: 'Fungal',
        organicControl: 'Solar heat treatment of seeds in May-June or seed treatment with Trichoderma.',
        organicControlHindi: 'मई-जून में बीज को धूप में सुखाएं या बीज शोधन करें।'
      }
    ],
    harvestTips: 'Harvest when grains turn golden-yellow and moisture content is below 14% to prevent storage pests.',
    harvestTipsHindi: 'जब दाने सुनहरे हो जाएं और नमी 14% से कम हो जाए तब कटाई करें।',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'paddy',
    name: 'Paddy / Rice',
    nameHindi: 'धान / चावल',
    scientificName: 'Oryza sativa',
    category: 'Cereal',
    season: 'Kharif',
    durationDays: '110 - 150 Days',
    idealSoil: 'Clayey loam with high water-holding capacity, pH 5.5 - 7.0',
    idealSoilHindi: 'चिकनी दोमट मिट्टी जिसमें पानी रोकने की अच्छी क्षमता हो, pH 5.5 - 7.0',
    idealTemp: '22°C - 35°C',
    wateringGuide: {
      frequency: 'Maintain 2-5 cm standing water during vegetative and panicle initiation',
      criticalStages: [
        'Transplanting to establishment (3-5 cm water)',
        'Tillering stage',
        'Panicle initiation stage (Crucial)',
        'Flowering stage',
        'Grain filling stage'
      ],
      criticalStagesHindi: [
        'रोपाई के 10 दिन तक 3-5 सेमी पानी',
        'कल्ले निकलने की अवस्था',
        'बाली निकलने की शुरुआत (अति महत्वपूर्ण)',
        'फूल आने की अवस्था',
        'दुग्ध व दाना भराव अवस्था'
      ],
      tips: 'Adopt Alternate Wetting and Drying (AWD) to save 25% water and reduce methane emissions.',
      tipsHindi: 'पानी की बचत के लिए समय-समय पर पानी सुखाकर दोबारा भरने की AWD विधि अपनाएं।'
    },
    nutrientManagement: {
      npkRatio: '100:50:50 kg/hectare + 25 kg Zinc Sulphate (ZnSO4 21%)',
      organicRecommendation: 'Incorporate green manure (Dhaincha or Sunhemp) 45-50 days before puddling.',
      organicRecommendationHindi: 'रोपाई से पहले खेत में ढैंचा या सनई की हरी खाद पलटें।',
      deficiencySigns: 'Khaira disease (rusty brown spots) caused by Zinc deficiency within 2-3 weeks of transplanting.',
      deficiencySignsHindi: 'रोपाई के 2-3 हफ्ते बाद पत्तियों पर लाल-भूरे धब्बे पड़ना खैरा रोग (जिंक की कमी) है।'
    },
    commonPestsAndDiseases: [
      {
        name: 'Brown Plant Hopper (BPH)',
        nameHindi: 'भूरा फुदका (माहू)',
        type: 'Pest',
        organicControl: 'Provide alleyways (30 cm gap every 2 meters); conserve natural spiders; neem oil spray.',
        organicControlHindi: 'खेत में हर 2 मीटर बाद 30 सेमी का रास्ता छोड़ें ताकि हवा व रोशनी लगे।'
      },
      {
        name: 'Stem Borer',
        nameHindi: 'तना छेदक (डेड हार्ट)',
        type: 'Pest',
        organicControl: 'Release egg parasitoid Trichogramma japonicum cards @ 40,000/acre; pheromone traps (5/acre).',
        organicControlHindi: 'ट्राइकोग्रामा कार्ड (Trichogramma) लगाएं और फेरोमोन ट्रैप लगाएं।'
      },
      {
        name: 'Bacterial Leaf Blight (BLB)',
        nameHindi: 'जीवाणु झुलसा',
        type: 'Bacterial',
        organicControl: 'Spray cow dung supernatant slurry or Pseudomonas fluorescens @ 5g/L.',
        organicControlHindi: 'स्यूडोमोनास 5 ग्राम/लीटर या ताजा गोबर का अर्क छिड़कें।'
      }
    ],
    harvestTips: 'Drain water 10-12 days before harvesting. Harvest when 80-85% grains in panicles turn golden yellow.',
    harvestTipsHindi: 'कटाई से 10 दिन पहले पानी निकाल दें। 85% बालियां सुनहरी होने पर कटाई करें।',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    nameHindi: 'टमाटर',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetable',
    season: 'All Season',
    durationDays: '90 - 120 Days',
    idealSoil: 'Sandy loam to well-drained fertile loam rich in organic matter, pH 6.0 - 7.0',
    idealSoilHindi: 'अच्छी जैविक खाद युक्त बलुई दोमट मिट्टी, pH 6.0 - 7.0',
    idealTemp: '18°C - 30°C',
    wateringGuide: {
      frequency: 'Every 4-7 days depending on soil moisture',
      criticalStages: [
        'Transplanting shock recovery',
        'Flowering and fruit set',
        'Fruit enlargement'
      ],
      criticalStagesHindi: [
        'रोपाई के तुरंत बाद',
        'फूल व फल बनते समय',
        'फल के आकार वृद्धि के समय'
      ],
      tips: 'Irregular watering leads to Blossom End Rot and fruit cracking. Drip irrigation is highly recommended.',
      tipsHindi: 'अनियमित सिंचाई से फल फटने लगते हैं। ड्रिप सिंचाई सबसे उत्तम है।'
    },
    nutrientManagement: {
      npkRatio: '150:100:100 kg/ha with micronutrients (Calcium & Boron)',
      organicRecommendation: 'Apply 25 tonnes FYM per hectare + Neem cake 250 kg/ha to deter soil nematodes.',
      organicRecommendationHindi: '25 टन सड़ी गोबर खाद + 250 किग्रा नीम खली प्रति हेक्टेयर मिलाएं।'
      ,
      deficiencySigns: 'Blossom End Rot (black sunken bottom of fruit) indicates Calcium deficiency caused by water stress.',
      deficiencySignsHindi: 'फल के नीचे काला धब्बा (ब्लॉसम एंड रॉट) कैल्शियम और अनियमित पानी की कमी से होता है।'
    },
    commonPestsAndDiseases: [
      {
        name: 'Fruit Borer (Helicoverpa armigera)',
        nameHindi: 'फल छेदक इल्ली',
        type: 'Pest',
        organicControl: 'Plant African Marigold as trap crop (1 row marigold for every 16 tomato rows); spray Bacillus thuringiensis (Bt) @ 2g/L.',
        organicControlHindi: 'गेंदे के फूल को ट्रैप फसल के रूप में लगाएं और बीटी (Bt) 2 ग्राम/लीटर छिड़कें।'
      },
      {
        name: 'Early Blight',
        nameHindi: 'अगेती झुलसा',
        type: 'Fungal',
        organicControl: 'Mulch soil; remove lower leaves; spray copper oxychloride or bio-fungicide Trichoderma.',
        organicControlHindi: 'निचली पत्तियों की छंटाई करें और ट्राइकोडर्मा का छिड़काव करें।'
      }
    ],
    harvestTips: 'Harvest at breaker or turning stage for distant markets; harvest fully red-ripe for local consumption.',
    harvestTipsHindi: 'दूर की मंडी भेजने के लिए फल थोड़ा लाल-पीला होने पर तोड़ें, स्थानीय बिक्री के लिए पूरा पकने पर।',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    nameHindi: 'कपास (सफेद सोना)',
    scientificName: 'Gossypium hirsutum',
    category: 'Cash Crop',
    season: 'Kharif',
    durationDays: '150 - 180 Days',
    idealSoil: 'Deep black cotton soil (Vertisols) or alluvial loam, pH 6.5 - 8.0',
    idealSoilHindi: 'गहरी काली मिट्टी (रेगुर) या दोमट मिट्टी, pH 6.5 - 8.0',
    idealTemp: '21°C - 35°C',
    wateringGuide: {
      frequency: 'Irrigate every 10-15 days during dry spells; total 4-6 irrigations',
      criticalStages: [
        'Squaring stage (Square formation)',
        'Flowering stage',
        'Boll development stage (Most critical for yield)'
      ],
      criticalStagesHindi: [
        'डोडिया (Square) बनते समय',
        'फूल खिलते समय',
        'टिंडे (Boll) बनते समय (सबसे महत्वपूर्ण)'
      ],
      tips: 'Do not over-irrigate during boll opening as it stains lint and delays maturity.',
      tipsHindi: 'टिंडे फूटने के समय पानी न दें ताकि रुई साफ और चमकदार रहे।'
    },
    nutrientManagement: {
      npkRatio: '120:60:60 kg/ha + Magnesium Sulphate (20 kg/ha) + Boron',
      organicRecommendation: 'Apply 10 tonnes FYM + Vermicompost 2 tonnes/ha.',
      organicRecommendationHindi: '10 टन गोबर खाद + 2 टन वर्मीकम्पोस्ट खेत में मिलाएं।',
      deficiencySigns: 'Reddening of cotton leaves due to Magnesium deficiency or sudden cold night temperatures.',
      deficiencySignsHindi: 'पत्तियों का लाल होना मैग्नीशियम की कमी या अचानक ठंड के कारण होता है।'
    },
    commonPestsAndDiseases: [
      {
        name: 'Pink Bollworm (PBW)',
        nameHindi: 'गुलाबी सुंडी (PBW)',
        type: 'Pest',
        organicControl: 'Install Pheromone traps @ 8-10/acre (Gossyplure); mass mating disruption rope lures.',
        organicControlHindi: 'गुलाबी सुंडी के लिए फेरोमोन ट्रैप (8-10 प्रति एकड़) लगाएं।'
      },
      {
        name: 'Whitefly',
        nameHindi: 'सफेद मक्खी',
        type: 'Pest',
        organicControl: 'Yellow sticky traps (20/acre); spray neem oil 5ml/L or soap solution.',
        organicControlHindi: 'पीले चिपचिपे कार्ड लगाएं और नीम तेल 5 मिली/लीटर छिड़कें।'
      }
    ],
    harvestTips: 'Pick cotton in morning hours when dewdrops have evaporated; avoid mixing dried leaves or bracts.',
    harvestTipsHindi: 'ओस सूखने के बाद सुबह के समय साफ-सुथरी रुई की चुनाई करें।',
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'potato',
    name: 'Potato',
    nameHindi: 'आलू',
    scientificName: 'Solanum tuberosum',
    category: 'Vegetable',
    season: 'Rabi',
    durationDays: '80 - 110 Days',
    idealSoil: 'Loose, friable sandy loam rich in humus, pH 5.2 - 6.5',
    idealSoilHindi: 'भुरभुरी, उपजाऊ बलुई दोमट मिट्टी, pH 5.2 - 6.5',
    idealTemp: '15°C - 22°C (tuberization stops above 28°C)',
    wateringGuide: {
      frequency: 'Light and frequent irrigation every 7-10 days',
      criticalStages: [
        'Sprouting/Stolon formation (20-25 days)',
        'Tuber initiation (35-40 days)',
        'Tuber bulking stage (50-70 days)'
      ],
      criticalStagesHindi: [
        'जमाव व स्टोलन बनते समय (20-25 दिन)',
        'आलू कंद की शुरुआत (35-40 दिन)',
        'कंदों का आकार बढ़ते समय (50-70 दिन)'
      ],
      tips: 'Stop irrigation 10-12 days before dehaulming to allow skin curing.',
      tipsHindi: 'बेल काटने से 10-12 दिन पहले सिंचाई बंद कर दें ताकि आलू का छिलका कड़ा हो जाए।'
    },
    nutrientManagement: {
      npkRatio: '150:80:100 kg/ha (Potash gives uniform tuber skin and disease resistance)',
      organicRecommendation: 'Apply 20 tonnes well-rotted FYM/ha.',
      organicRecommendationHindi: '20 टन अच्छी सड़ी गोबर की खाद खेत में अवश्य डालें।',
      deficiencySigns: 'Interveinal chlorosis on young leaves indicates Iron/Manganese deficiency in alkaline soils.',
      deficiencySignsHindi: 'पत्तियों का पीला पड़ना और नसों का हरा रहना लौह तत्व की कमी दर्शाता है।'
    },
    commonPestsAndDiseases: [
      {
        name: 'Late Blight (Phytophthora infestans)',
        nameHindi: 'पिछेती झुलसा',
        type: 'Fungal',
        organicControl: 'Spray Trichoderma or preventive Mancozeb when relative humidity stays above 85% for 48 hours.',
        organicControlHindi: 'कोहरा या 85% से अधिक नमी होने पर सुरक्षात्मक फफूंदनाशी का छिड़काव करें।'
      },
      {
        name: 'Potato Tuber Moth',
        nameHindi: 'कंद शलभ (ट्यूबर मॉथ)',
        type: 'Pest',
        organicControl: 'Earthing up to depth of 10-12 cm prevents moth from laying eggs on exposed tubers.',
        organicControlHindi: 'समय पर अच्छी मिट्टी चढ़ाएं ताकि आलू बाहर न दिखें।'
      }
    ],
    harvestTips: 'Cut foliage (dehaulming) 10-15 days before digging to harden tuber skin and prevent bruising.',
    harvestTipsHindi: 'खुदाई से 12-15 दिन पहले बेल काट दें ताकि छिलका मजबूत हो जाए और भंडारण में सड़े नहीं।',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mustard',
    name: 'Mustard / Rapeseed',
    nameHindi: 'सरसों / तोरिया',
    scientificName: 'Brassica juncea',
    category: 'Oilseed',
    season: 'Rabi',
    durationDays: '110 - 130 Days',
    idealSoil: 'Sandy loam to clay loam, pH 6.0 - 7.5',
    idealSoilHindi: 'हल्की से मध्यम दोमट मिट्टी, pH 6.0 - 7.5',
    idealTemp: '15°C - 25°C',
    wateringGuide: {
      frequency: '2 critical irrigations (Very low water requirement crop)',
      criticalStages: [
        'Pre-flowering / Rosette stage (28-35 days after sowing)',
        'Siliqua (pod) development stage (55-65 days)'
      ],
      criticalStagesHindi: [
        'फूल आने से पहले (28-35 दिन)',
        'फलियां बनते समय (55-65 दिन)'
      ],
      tips: 'Avoid irrigation during peak flowering to prevent flower drop and white rot.',
      tipsHindi: 'पूरा फूल खिले होने पर पानी न लगाएं वरना फूल झड़ सकते हैं।'
    },
    nutrientManagement: {
      npkRatio: '80:40:40 kg/ha + 30-40 kg Sulphur/ha (Essential for high oil content!)',
      organicRecommendation: 'Apply 8 tonnes FYM/ha.',
      organicRecommendationHindi: '8 टन गोबर खाद + 30 किग्रा सल्फर (गंधक) तेल की मात्रा बढ़ाने के लिए जरूर दें।',
      deficiencySigns: 'Cupping of leaves and purpling of margins indicates Sulphur deficiency.',
      deficiencySignsHindi: 'पत्तियों का मुड़ना और तेल कम बनना सल्फर की कमी का लक्षण है।'
    },
    commonPestsAndDiseases: [
      {
        name: 'Mustard Aphid (Lipaphis erysimi)',
        nameHindi: 'सरसों का चेपा / माहू',
        type: 'Pest',
        organicControl: 'Conserve ladybird beetles (Coccinella); spray 5% neem extract; early sowing in October escapes peak aphid flight.',
        organicControlHindi: 'अक्टूबर के प्रथम पखवाड़े में समय पर बुवाई करें; नीम का अर्क छिड़कें।'
      },
      {
        name: 'White Rust (Albugo candida)',
        nameHindi: 'सफेद रतुआ',
        type: 'Fungal',
        organicControl: 'Seed treatment with Apron 35 SD @ 6g/kg or Trichoderma viride.',
        organicControlHindi: 'बुवाई से पहले बीज उपचार करें और रोगी पौधे हटाएं।'
      }
    ],
    harvestTips: 'Harvest when 75% pods turn brownish-yellow. Harvest early morning to avoid pod shattering loss.',
    harvestTipsHindi: 'जब 75% फलियां पीली हो जाएं तो सुबह के समय कटाई करें ताकि दाना बिखरे नहीं।',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
  }
];

export const PRESET_DISTRICTS = [
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lon: 75.8573, cropFocus: 'Wheat, Paddy' },
  { name: 'Karnal', state: 'Haryana', lat: 29.6857, lon: 76.9905, cropFocus: 'Basmati Rice, Wheat' },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lon: 73.7898, cropFocus: 'Onion, Grapes, Tomato' },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567, cropFocus: 'Sugarcane, Vegetables' },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739, cropFocus: 'Paddy, Wheat, Vegetables' },
  { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lon: 70.8022, cropFocus: 'Groundnut, Cotton' },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577, cropFocus: 'Soybean, Wheat' },
  { name: 'Dharwad', state: 'Karnataka', lat: 15.4589, lon: 75.0078, cropFocus: 'Cotton, Pulses, Millets' },
  { name: 'Muzaffarpur', state: 'Bihar', lat: 26.1226, lon: 85.3906, cropFocus: 'Maize, Paddy, Litchi' },
  { name: 'Kota', state: 'Rajasthan', lat: 25.2138, lon: 75.8648, cropFocus: 'Soybean, Mustard, Wheat' }
];
