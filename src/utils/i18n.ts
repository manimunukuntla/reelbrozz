export type Language = 'en' | 'hi' | 'te' | 'ta' | 'kn';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

export const TRANSLATIONS: Record<Language, {
  heroTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  downloadApp: string;
  viewPackages: string;
  bookCreator: string;
  howItWorks: string;
  features: string;
  packages: string;
  whyReelsBrozz: string;
  becomeCreator: string;
  testimonials: string;
  faq: string;
  turnPhoneIntoIncome: string;
  tenMinDelivery: string;
  startingPrice: string;
}> = {
  en: {
    heroTagline: 'India’s Fastest On-Demand Reel Makers',
    heroHeadline: 'Reels Delivered in 10 Minutes',
    heroSubheadline: 'Book a trained creator. They shoot in 4K, edit with AI on-site, and hand you ready-to-post reels before the moment fades.',
    downloadApp: 'Download the App',
    viewPackages: 'View Packages',
    bookCreator: 'Book Creator Now',
    howItWorks: 'How It Works',
    features: 'Key Differentiators',
    packages: 'Pricing & Packages',
    whyReelsBrozz: 'Why Reels Brozz',
    becomeCreator: 'Become a Creator',
    testimonials: 'What People Say',
    faq: 'Frequently Asked Questions',
    turnPhoneIntoIncome: 'Turn your phone into an income machine',
    tenMinDelivery: 'Delivered in 10 Minutes',
    startingPrice: 'Starts at ₹1,500',
  },
  hi: {
    heroTagline: 'भारत का सबसे तेज़ ऑन-डिमांड रील प्लेटफॉर्म',
    heroHeadline: '10 मिनट में रील डिलीवरी',
    heroSubheadline: 'प्रशिक्षित क्रिएटर बुक करें। 4K में शूट, AI से ऑन-साइट एडिट, और तुरंत पोस्ट करने लायक रील आपके हाथ में।',
    downloadApp: 'ऐप डाउनलोड करें',
    viewPackages: 'पैकेज देखें',
    bookCreator: 'अभी क्रिएटर बुक करें',
    howItWorks: 'यह कैसे काम करता है',
    features: 'खास फीचर्स',
    packages: 'पैकेज और कीमतें',
    whyReelsBrozz: 'रील्स ब्रोज़ क्यों?',
    becomeCreator: 'क्रिएटर बनें',
    testimonials: 'ग्राहकों की राय',
    faq: 'अक्सर पूछे जाने वाले सवाल',
    turnPhoneIntoIncome: 'अपने स्मार्टफोन को कमाई की मशीन बनाएं',
    tenMinDelivery: '10 मिनट में रील डिलीवरी',
    startingPrice: 'शुरुआत केवल ₹1,500 से',
  },
  te: {
    heroTagline: 'భారతదేశంలో అత్యంత వేగవంతమైన రీల్ తయారీదారులు',
    heroHeadline: '10 నిమిషాల్లో రీల్ డెలివరీ',
    heroSubheadline: 'ట్రైన్డ్ క్రియేటర్‌ను బుక్ చేసుకోండి. 4Kలో షూట్ చేస్తారు, ఆన్-సైట్ AI ఎడిటింగ్, వెంటనే పోస్ట్ చేసే రీల్ డెలివరీ.',
    downloadApp: 'యాప్ డౌన్‌లోడ్ చేయండి',
    viewPackages: 'ప్యాకేజీలు చూడండి',
    bookCreator: 'క్రియేటర్‌ను బుక్ చేయండి',
    howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
    features: 'ముఖ్య ఫీచర్లు',
    packages: 'ప్యాకేజీలు & ధరలు',
    whyReelsBrozz: 'రీల్స్ బ్రోజ్ ఎందుకు?',
    becomeCreator: 'క్రియేటర్‌గా మారండి',
    testimonials: 'కస్టమర్ల అనుభవాలు',
    faq: 'తరచుగా అడిగే ప్రశ్నలు',
    turnPhoneIntoIncome: 'మీ ఫోన్‌ను సంపాదన మెషిన్‌గా మార్చండి',
    tenMinDelivery: '10 నిమిషాల్లో డెలివరీ',
    startingPrice: '₹1,500 నుండి ప్రారంభం',
  },
  ta: {
    heroTagline: 'இந்தியாவின் அதிவேக ரீல் மேக்கர்ஸ்',
    heroHeadline: '10 நிமிடங்களில் ரீல் டெலிவரி',
    heroSubheadline: 'பயிற்சி பெற்ற கிரியேட்டரை புக் செய்யுங்கள். 4K-ல் ஷூட், ஆன்-சைட் AI எடிட் செய்து உடனே தருகிறோம்.',
    downloadApp: 'செயலியை பதிவிறக்கவும்',
    viewPackages: 'திட்டங்களை பார்க்கவும்',
    bookCreator: 'இப்போதே புக் செய்க',
    howItWorks: 'எப்படி செயல்படுகிறது',
    features: 'முக்கிய நன்மைகள்',
    packages: 'விலை மற்றும் திட்டங்கள்',
    whyReelsBrozz: 'ஏன் ரீல்ஸ் ப்ரோஸ்?',
    becomeCreator: 'கிரியேட்டராக இணையுங்கள்',
    testimonials: 'வாடிக்கையாளர் கருத்துக்கள்',
    faq: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    turnPhoneIntoIncome: 'உங்கள் போனை வருமான இயந்திரமாக மாற்றுங்கள்',
    tenMinDelivery: '10 நிமிடங்களில் டெலிவரி',
    startingPrice: '₹1,500 முதல் தொடங்குகிறது',
  },
  kn: {
    heroTagline: 'ಭಾರತದ ಅತ್ಯಂತ ವೇಗದ ಆನ್-ಡಿಮಾಂಡ್ ರೀಲ್ ಮೇಕರ್ಸ್',
    heroHeadline: '10 ನಿಮಿಷಗಳಲ್ಲಿ ರೀಲ್ ಡೆಲಿವರಿ',
    heroSubheadline: 'ತರಬೇತಿ ಪಡೆದ ಕ್ರಿಯೇಟರ್ ಬುಕ್ ಮಾಡಿ. 4K ನಲ್ಲಿ ಶೂಟ್ ಮಾಡಿ, AI ನಿಂದ ಎಡಿಟ್ ಮಾಡಿ 10 ನಿಮಿಷಗಳಲ್ಲಿ ಪೋಸ್ಟ್ ಮಾಡಲು ಸಿದ್ಧ ರೀಲ್ ಪಡೆಯಿರಿ.',
    downloadApp: 'ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    viewPackages: 'ಪ್ಯಾಕೇಜ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    bookCreator: 'ಈಗಲೇ ಬುಕ್ ಮಾಡಿ',
    howItWorks: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    features: 'ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳು',
    packages: 'ಪ್ಯಾಕೇಜ್‌ಗಳು & ದರಗಳು',
    whyReelsBrozz: 'ಏಕೆ ರೀಲ್ಸ್ ಬ್ರೋಸ್?',
    becomeCreator: 'ಕ್ರಿಯೇಟರ್ ಆಗಿ',
    testimonials: 'ಗ್ರಾಹಕರ ವಿಮರ್ಶೆಗಳು',
    faq: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೋತ್ತರಗಳು',
    turnPhoneIntoIncome: 'ನಿಮ್ಮ ಫೋನ್ ಅನ್ನು ಆದಾಯದ ಸಾಧನವನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿ',
    tenMinDelivery: '10 ನಿಮಿಷಗಳಲ್ಲಿ ಡೆಲಿವರಿ',
    startingPrice: '₹1,500 ರಿಂದ ಪ್ರಾರಂಭ',
  },
};
