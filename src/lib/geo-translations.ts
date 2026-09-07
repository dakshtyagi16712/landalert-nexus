/**
 * src/lib/geo-translations.ts
 * ===========================
 * Centralized High-Fidelity Localization Engine for:
 * 1. All 15 Monitored Hill Zones
 * 2. All 8 North Eastern Region (NER) States
 * 3. All 130 NER Districts
 * 4. All 447 NER Cities, Towns, and Localities
 * 5. Dynamic Hydrological & Geological Explanations
 *
 * Supports all 9 official console languages:
 * 'en' | 'hi' | 'bn' | 'as' | 'ne' | 'mni' | 'lus' | 'kha' | 'grt'
 */

export type LanguageCode = "en" | "hi" | "bn" | "as" | "ne" | "mni" | "lus" | "kha" | "grt";

export const ZONE_TRANSLATIONS: Record<number, Record<LanguageCode, string>> = {
  "1": {
    "en": "Tamenglong",
    "hi": "तामेंगलॉन्ग",
    "bn": "তামেংলং",
    "as": "তামেংলং",
    "ne": "तामेङलोङ",
    "mni": "তামেংলোং",
    "lus": "Tamenglong",
    "kha": "Tamenglong",
    "grt": "Tamenglong"
  },
  "2": {
    "en": "Noney",
    "hi": "नोने",
    "bn": "নোনে",
    "as": "ননে",
    "ne": "नोने",
    "mni": "নোনে",
    "lus": "Noney",
    "kha": "Noney",
    "grt": "Noney"
  },
  "3": {
    "en": "Aizawl East",
    "hi": "आइजोल पूर्व",
    "bn": "আইজল পূর্ব",
    "as": "আইজল পূব",
    "ne": "आइजोल पूर्व",
    "mni": "আইজোল নোংপোক",
    "lus": "Aizawl Khawchhak",
    "kha": "Aizawl Mihngi",
    "grt": "Aizawl Salgro-Salgipeng"
  },
  "4": {
    "en": "Lunglei Slopes",
    "hi": "लुंगलेई ढलान",
    "bn": "লুংলেই ঢাল",
    "as": "লুংলেঈ হেলনীয়া এলেকা",
    "ne": "लुङ्लेई भिरालो",
    "mni": "লুংলেই চীংখাই",
    "lus": "Lunglei Awmphang",
    "kha": "Ki Riat Lunglei",
    "grt": "Lunglei A·brirang"
  },
  "5": {
    "en": "Shillong-Sohra Escarpment",
    "hi": "शिलांग-सोहरा कगार",
    "bn": "শিলং-সোহরা খাড়া ঢাল",
    "as": "শ্বিলং-চোহৰা থিয় গড়া",
    "ne": "शिलोङ-सोहरा भीर",
    "mni": "শিলং-সোহরা চীংমায়",
    "lus": "Shillong-Sohra Khamhmun",
    "kha": "Kseh Lum Shillong-Sohra",
    "grt": "Shillong-Sohra A·bri"
  },
  "6": {
    "en": "Jaintia Hills Ridge",
    "hi": "जयंतिया हिल्स कटक",
    "bn": "জয়ন্তীয়া পাহাড় পর্বতশ্রেণী",
    "as": "জয়ন্তীয়া পাহাৰ শৈলশিৰা",
    "ne": "जयन्तिया हिल्स डाँडा",
    "mni": "জয়ন্তিয়া হিলস চীংগোং",
    "lus": "Jaintia Tlangdung",
    "kha": "Riat Lum Jaiñtia",
    "grt": "Jaintia A·bri Nokma"
  },
  "7": {
    "en": "Kohima Ridge",
    "hi": "कोहिमा कटक",
    "bn": "কোহিমা পর্বতশ্রেণী",
    "as": "কহিমা শৈলশিৰা",
    "ne": "कोहिमा डाँडा",
    "mni": "কোহিমা চীংগোং",
    "lus": "Kohima Tlangdung",
    "kha": "Riat Kohima",
    "grt": "Kohima A·bri"
  },
  "8": {
    "en": "Dimapur Foothills",
    "hi": "दीमापुर की तलहटी",
    "bn": "ডিমাপুর পাদদেশ",
    "as": "ডিমাপুৰ নামনি পাহাৰ",
    "ne": "दिमापुर फेदी",
    "mni": "দিমাপুর চীংখায়",
    "lus": "Dimapur Tlangram Hnuai",
    "kha": "Trai Lum Dimapur",
    "grt": "Dimapur A·bri Jadil"
  },
  "9": {
    "en": "Papum Pare",
    "hi": "पापुम पारे",
    "bn": "পাপুম পারে",
    "as": "পাপুম পাৰে",
    "ne": "पापुम पारे",
    "mni": "পাপুম পারে",
    "lus": "Papum Pare",
    "kha": "Papum Pare",
    "grt": "Papum Pare"
  },
  "10": {
    "en": "Dibang Valley",
    "hi": "दिबांग घाटी",
    "bn": "দিবাং উপত্যকা",
    "as": "দিবাং উপত্যকা",
    "ne": "दिबाङ उपत्यका",
    "mni": "দিবাং তম্পাক",
    "lus": "Dibang Phaizawl",
    "kha": "Them Dibang",
    "grt": "Dibang Chibima"
  },
  "11": {
    "en": "Gangtok-Singtam Corridor",
    "hi": "गैंगटॉक-सिंगताम गलियारा",
    "bn": "গ্যাংটক-সিংতাম করিডোর",
    "as": "গেংটক-ছিংটাম কৰিডৰ",
    "ne": "गान्तोक-सिङताम कोरिडोर",
    "mni": "গেংতোক-সিংতাম লম্বী",
    "lus": "Gangtok-Singtam Kawngpui",
    "kha": "Lynti Gangtok-Singtam",
    "grt": "Gangtok-Singtam Rama"
  },
  "12": {
    "en": "Mangan North",
    "hi": "मंगन उत्तर",
    "bn": "মাঙ্গান উত্তর",
    "as": "মাঙ্গান উত্তৰ",
    "ne": "मङ्गन उत्तर",
    "mni": "মঙ্গন অৱাংবা",
    "lus": "Mangan Hmar",
    "kha": "Mangan Shatei",
    "grt": "Mangan Salgro"
  },
  "13": {
    "en": "Haflong Hills",
    "hi": "हाफलोंग हिल्स",
    "bn": "হাফলং পাহাড়",
    "as": "হাফলং পাহাৰ",
    "ne": "हाफलोङ हिल्स",
    "mni": "হাফলোং চীং",
    "lus": "Haflong Tlang",
    "kha": "Lum Haflong",
    "grt": "Haflong A·bri"
  },
  "14": {
    "en": "Karbi Anglong West",
    "hi": "कार्बी आंगलोंग पश्चिम",
    "bn": "কার্বি আংলং পশ্চিম",
    "as": "কাৰ্বি আংলং পশ্চিম",
    "ne": "कार्बी आङलोङ पश्चिम",
    "mni": "কার্বি আংলোং নোংচুপ",
    "lus": "Karbi Anglong Khawthlang",
    "kha": "Karbi Anglong Mihngi",
    "grt": "Karbi Anglong Saliram"
  },
  "15": {
    "en": "Ambassa Hills",
    "hi": "अम्बासा हिल्स",
    "bn": "আমবাসা পাহাড়",
    "as": "আমবাছা পাহাৰ",
    "ne": "अम्बासा हिल्स",
    "mni": "অম্বাছা চীং",
    "lus": "Ambassa Tlang",
    "kha": "Lum Ambassa",
    "grt": "Ambassa A·bri"
  }
};

export const STATE_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "Assam": {
    "en": "Assam",
    "hi": "असम",
    "bn": "অসম",
    "as": "অসম",
    "ne": "असम",
    "mni": "অসাম",
    "lus": "Assam",
    "kha": "Assam",
    "grt": "Assam"
  },
  "Arunachal Pradesh": {
    "en": "Arunachal Pradesh",
    "hi": "अरुणाचल प्रदेश",
    "bn": "অরুণাচল প্রদেশ",
    "as": "অৰুণাচল প্ৰদেশ",
    "ne": "अरुणाचल प्रदेश",
    "mni": "অরুনাচল প্রদেশ",
    "lus": "Arunachal Pradesh",
    "kha": "Arunachal Pradesh",
    "grt": "Arunachal Pradesh"
  },
  "Manipur": {
    "en": "Manipur",
    "hi": "मणिपुर",
    "bn": "মণিপুর",
    "as": "মণিপুৰ",
    "ne": "मणिपुर",
    "mni": "মণিপুর",
    "lus": "Manipur",
    "kha": "Manipur",
    "grt": "Manipur"
  },
  "Meghalaya": {
    "en": "Meghalaya",
    "hi": "मेघालय",
    "bn": "মেঘালয়",
    "as": "মেঘালয়",
    "ne": "मेघालय",
    "mni": "মেঘালয়",
    "lus": "Meghalaya",
    "kha": "Meghalaya",
    "grt": "Meghalaya"
  },
  "Mizoram": {
    "en": "Mizoram",
    "hi": "मिज़ोरम",
    "bn": "মিজোরাম",
    "as": "মিজোৰাম",
    "ne": "मिजोरम",
    "mni": "মিজোরাম",
    "lus": "Mizoram",
    "kha": "Mizoram",
    "grt": "Mizoram"
  },
  "Nagaland": {
    "en": "Nagaland",
    "hi": "नागालैंड",
    "bn": "নাগাল্যান্ড",
    "as": "নাগালেণ্ড",
    "ne": "नागाल्याण्ड",
    "mni": "নাগালেন্দ",
    "lus": "Nagaland",
    "kha": "Nagaland",
    "grt": "Nagaland"
  },
  "Sikkim": {
    "en": "Sikkim",
    "hi": "सिक्किम",
    "bn": "সিকিম",
    "as": "ছিকিম",
    "ne": "सिक्किम",
    "mni": "সিক্কিম",
    "lus": "Sikkim",
    "kha": "Sikkim",
    "grt": "Sikkim"
  },
  "Tripura": {
    "en": "Tripura",
    "hi": "त्रिपुरा",
    "bn": "ত্রিপুরা",
    "as": "ত্ৰিপুৰা",
    "ne": "त्रिपुरा",
    "mni": "ত্রিপুরা",
    "lus": "Tripura",
    "kha": "Tripura",
    "grt": "Tripura"
  }
};

export const DISTRICT_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "Aizawl": {
    "en": "Aizawl",
    "hi": "आइजोल",
    "bn": "আইজল",
    "as": "আইজল",
    "ne": "आइजोल",
    "mni": "আইজোল",
    "lus": "Aizawl",
    "kha": "Aizawl",
    "grt": "Aizawl"
  },
  "Anjaw": {
    "en": "Anjaw",
    "hi": "अंजाव",
    "bn": "আনজাও",
    "as": "অনজাও",
    "ne": "अञ्जाव",
    "mni": "অঞ্জাও",
    "lus": "Anjaw",
    "kha": "Anjaw",
    "grt": "Anjaw"
  },
  "Bajali": {
    "en": "Bajali",
    "hi": "बाजाली",
    "bn": "বাজালি",
    "as": "বজালী",
    "ne": "बाजाली",
    "mni": "বাজালি",
    "lus": "Bajali",
    "kha": "Bajali",
    "grt": "Bajali"
  },
  "Baksa": {
    "en": "Baksa",
    "hi": "बाक्सा",
    "bn": "বাক্সা",
    "as": "বাক্সা",
    "ne": "बाक्सा",
    "mni": "বাক্সা",
    "lus": "Baksa",
    "kha": "Baksa",
    "grt": "Baksa"
  },
  "Barpeta": {
    "en": "Barpeta",
    "hi": "बरपेटा",
    "bn": "বরপেটা",
    "as": "বৰপেটা",
    "ne": "बरपेटा",
    "mni": "বরপেটা",
    "lus": "Barpeta",
    "kha": "Barpeta",
    "grt": "Barpeta"
  },
  "Bishnupur": {
    "en": "Bishnupur",
    "hi": "बिष्णुपुर",
    "bn": "বিষ্ণুপুর",
    "as": "বিষ্ণুপুৰ",
    "ne": "बिष्णुपुर",
    "mni": "বিষ্ণুপুর",
    "lus": "Bishnupur",
    "kha": "Bishnupur",
    "grt": "Bishnupur"
  },
  "Biswanath": {
    "en": "Biswanath",
    "hi": "विश्वनाथ",
    "bn": "বিশ্বনাথ",
    "as": "বিশ্বনাথ",
    "ne": "विश्वनाथ",
    "mni": "বিশ্বনাথ",
    "lus": "Biswanath",
    "kha": "Biswanath",
    "grt": "Biswanath"
  },
  "Bongaigaon": {
    "en": "Bongaigaon",
    "hi": "बोंगाईगांव",
    "bn": "বঙাইগাঁও",
    "as": "বঙাইগাঁও",
    "ne": "बोङ्गाइगाउँ",
    "mni": "বোঙ্গাইগাঁও",
    "lus": "Bongaigaon",
    "kha": "Bongaigaon",
    "grt": "Bongaigaon"
  },
  "Cachar": {
    "en": "Cachar",
    "hi": "Cachar",
    "bn": "Cachar",
    "as": "Cachar",
    "ne": "Cachar",
    "mni": "Cachar",
    "lus": "Cachar",
    "kha": "Cachar",
    "grt": "Cachar"
  },
  "Champhai": {
    "en": "Champhai",
    "hi": "चम्फाई",
    "bn": "চাম্ফাই",
    "as": "চাম্ফাই",
    "ne": "चम्फाई",
    "mni": "চাম্ফাই",
    "lus": "Champhai",
    "kha": "Champhai",
    "grt": "Champhai"
  },
  "Chandel": {
    "en": "Chandel",
    "hi": "चंदेल",
    "bn": "চান্দেল",
    "as": "চান্দেল",
    "ne": "चन्देल",
    "mni": "চান্দেল",
    "lus": "Chandel",
    "kha": "Chandel",
    "grt": "Chandel"
  },
  "Changlang": {
    "en": "Changlang",
    "hi": "चांगलांग",
    "bn": "চাংলাং",
    "as": "চাংলাং",
    "ne": "चाङलाङ",
    "mni": "চাংলাং",
    "lus": "Changlang",
    "kha": "Changlang",
    "grt": "Changlang"
  },
  "Charaideo": {
    "en": "Charaideo",
    "hi": "चराइदेव",
    "bn": "চরাদেও",
    "as": "চৰাইদেউ",
    "ne": "चराइदेव",
    "mni": "চরাদেও",
    "lus": "Charaideo",
    "kha": "Charaideo",
    "grt": "Charaideo"
  },
  "Chirang": {
    "en": "Chirang",
    "hi": "चिरांग",
    "bn": "চিরাং",
    "as": "চিৰাং",
    "ne": "चिराङ",
    "mni": "চিরাং",
    "lus": "Chirang",
    "kha": "Chirang",
    "grt": "Chirang"
  },
  "Chumoukedima": {
    "en": "Chumoukedima",
    "hi": "Chumoukedima",
    "bn": "Chumoukedima",
    "as": "Chumoukedima",
    "ne": "Chumoukedima",
    "mni": "Chumoukedima",
    "lus": "Chumoukedima",
    "kha": "Chumoukedima",
    "grt": "Chumoukedima"
  },
  "Churachandpur": {
    "en": "Churachandpur",
    "hi": "चुराचांदपुर",
    "bn": "চূড়াচাঁদপুর",
    "as": "চুৰাচান্দপুৰ",
    "ne": "चुराचान्दपुर",
    "mni": "চূড়াচান্দপুর",
    "lus": "Churachandpur",
    "kha": "Churachandpur",
    "grt": "Churachandpur"
  },
  "Darrang": {
    "en": "Darrang",
    "hi": "दरंग",
    "bn": "দরং",
    "as": "দৰং",
    "ne": "दरङ",
    "mni": "দরং",
    "lus": "Darrang",
    "kha": "Darrang",
    "grt": "Darrang"
  },
  "Dhalai": {
    "en": "Dhalai",
    "hi": "धलाई",
    "bn": "ধলাই",
    "as": "ধলাই",
    "ne": "धलाई",
    "mni": "ধলাই",
    "lus": "Dhalai",
    "kha": "Dhalai",
    "grt": "Dhalai"
  },
  "Dhemaji": {
    "en": "Dhemaji",
    "hi": "धेमाजी",
    "bn": "ধেমাজি",
    "as": "ধেমাজি",
    "ne": "धेमाजी",
    "mni": "ধেমাজি",
    "lus": "Dhemaji",
    "kha": "Dhemaji",
    "grt": "Dhemaji"
  },
  "Dhubri": {
    "en": "Dhubri",
    "hi": "धुबरी",
    "bn": "ধুবড়ী",
    "as": "ধুবুৰী",
    "ne": "धुबरी",
    "mni": "ধুবরী",
    "lus": "Dhubri",
    "kha": "Dhubri",
    "grt": "Dhubri"
  },
  "Dibang Valley": {
    "en": "Dibang Valley",
    "hi": "दिबांग घाटी",
    "bn": "দিবাং উপত্যকা",
    "as": "দিবাং উপত্যকা",
    "ne": "दिबाङ उपत्यका",
    "mni": "দিবাং তম্পাক",
    "lus": "Dibang Phaizawl",
    "kha": "Them Dibang",
    "grt": "Dibang Chibima"
  },
  "Dibrugarh": {
    "en": "Dibrugarh",
    "hi": "डिब्रूगढ़",
    "bn": "ডিব্রুগড়",
    "as": "ডিব্ৰুগড়",
    "ne": "डिब्रुगढ",
    "mni": "দিব্রুগড়",
    "lus": "Dibrugarh",
    "kha": "Dibrugarh",
    "grt": "Dibrugarh"
  },
  "Dima Hasao": {
    "en": "Dima Hasao",
    "hi": "दीमा हसाओ",
    "bn": "ডিমা হাসাও",
    "as": "ডিমা হাছাও",
    "ne": "दिमा हसाओ",
    "mni": "দিমা হাসাও",
    "lus": "Dima Hasao",
    "kha": "Dima Hasao",
    "grt": "Dima Hasao"
  },
  "Dimapur": {
    "en": "Dimapur",
    "hi": "दीमापुर",
    "bn": "ডিমাপুর",
    "as": "ডিমাপুৰ",
    "ne": "दिमापुर",
    "mni": "দিমাপুর",
    "lus": "Dimapur",
    "kha": "Dimapur",
    "grt": "Dimapur"
  },
  "East Garo Hills": {
    "en": "East Garo Hills",
    "hi": "पूर्वी गारो हिल्स",
    "bn": "পূর্ব গারো পাহাড়",
    "as": "পূব গাৰো পাহাৰ",
    "ne": "पूर्वी गारो हिल्स",
    "mni": "নোংপোক গারো হিলস",
    "lus": "East Garo Hills",
    "kha": "East Garo Hills",
    "grt": "East Garo Hills"
  },
  "East Jaintia Hills": {
    "en": "East Jaintia Hills",
    "hi": "पूर्वी जयंतिया हिल्स",
    "bn": "পূর্ব জয়ন্তীয়া পাহাড়",
    "as": "পূব জয়ন্তীয়া পাহাৰ",
    "ne": "पूर्वी जयन्तिया हिल्स",
    "mni": "নোংপোক জয়ন্তিয়া হিলস",
    "lus": "East Jaintia Hills",
    "kha": "East Jaintia Hills",
    "grt": "East Jaintia Hills"
  },
  "East Kameng": {
    "en": "East Kameng",
    "hi": "पूर्व Kameng",
    "bn": "পূর্ব Kameng",
    "as": "পূব Kameng",
    "ne": "पूर्व Kameng",
    "mni": "নোংপোক Kameng",
    "lus": "Khawchhak Kameng",
    "kha": "Mihngi Kameng",
    "grt": "Salgro-Salgipeng Kameng"
  },
  "East Khasi Hills": {
    "en": "East Khasi Hills",
    "hi": "पूर्वी खासी हिल्स",
    "bn": "পূর্ব খাসি পাহাড়",
    "as": "পূব খাচী পাহাৰ",
    "ne": "पूर्वी खासी हिल्स",
    "mni": "নোংপোক খাসী হিলস",
    "lus": "East Khasi Hills",
    "kha": "East Khasi Hills",
    "grt": "East Khasi Hills"
  },
  "East Siang": {
    "en": "East Siang",
    "hi": "पूर्व Siang",
    "bn": "পূর্ব Siang",
    "as": "পূব Siang",
    "ne": "पूर्व Siang",
    "mni": "নোংপোক Siang",
    "lus": "Khawchhak Siang",
    "kha": "Mihngi Siang",
    "grt": "Salgro-Salgipeng Siang"
  },
  "East Sikkim (Gangtok)": {
    "en": "East Sikkim (Gangtok)",
    "hi": "पूर्वी सिक्किम",
    "bn": "পূর্ব সিকিম",
    "as": "পূব ছিকিম",
    "ne": "पूर्वी सिक्किम",
    "mni": "নোংপোক সিক্কিম",
    "lus": "East Sikkim",
    "kha": "East Sikkim",
    "grt": "East Sikkim"
  },
  "Eastern West Khasi Hills": {
    "en": "Eastern West Khasi Hills",
    "hi": "पूर्वी पश्चिमी खासी हिल्स",
    "bn": "পূর্ব পশ্চিম খাসি পাহাড়",
    "as": "পূব পশ্চিম খাচী পাহাৰ",
    "ne": "पूर्वी पश्चिमी खासी हिल्स",
    "mni": "নোংপোক নোংচুপ খাসী হিলস",
    "lus": "Eastern West Khasi Hills",
    "kha": "Eastern West Khasi Hills",
    "grt": "Eastern West Khasi Hills"
  },
  "Goalpara": {
    "en": "Goalpara",
    "hi": "गोलपारा",
    "bn": "গোয়ালপাড়া",
    "as": "গোৱালপাৰা",
    "ne": "गोलपारा",
    "mni": "গোয়ালপাড়া",
    "lus": "Goalpara",
    "kha": "Goalpara",
    "grt": "Goalpara"
  },
  "Golaghat": {
    "en": "Golaghat",
    "hi": "गोलाघाट",
    "bn": "গোলাঘাট",
    "as": "গোলাঘাট",
    "ne": "गोलाघाट",
    "mni": "গোলাঘাট",
    "lus": "Golaghat",
    "kha": "Golaghat",
    "grt": "Golaghat"
  },
  "Gomati": {
    "en": "Gomati",
    "hi": "गोमती",
    "bn": "গোমতী",
    "as": "গোমতী",
    "ne": "गोमती",
    "mni": "গোমতী",
    "lus": "Gomati",
    "kha": "Gomati",
    "grt": "Gomati"
  },
  "Gyalshing (West Sikkim)": {
    "en": "Gyalshing (West Sikkim)",
    "hi": "Gyalshing",
    "bn": "Gyalshing",
    "as": "Gyalshing",
    "ne": "Gyalshing",
    "mni": "Gyalshing",
    "lus": "Gyalshing",
    "kha": "Gyalshing",
    "grt": "Gyalshing"
  },
  "Hailakandi": {
    "en": "Hailakandi",
    "hi": "हैलाकांडी",
    "bn": "হাইলাকান্দি",
    "as": "হাইলাকান্দি",
    "ne": "हैलाकान्डी",
    "mni": "হাইলাকান্দি",
    "lus": "Hailakandi",
    "kha": "Hailakandi",
    "grt": "Hailakandi"
  },
  "Hnahthial": {
    "en": "Hnahthial",
    "hi": "ह्नाहथियाल",
    "bn": "হ্নাহথিয়াল",
    "as": "হ্নাহথিয়াল",
    "ne": "ह्नाहथियाल",
    "mni": "হ্নাহথিয়াল",
    "lus": "Hnahthial",
    "kha": "Hnahthial",
    "grt": "Hnahthial"
  },
  "Hojai": {
    "en": "Hojai",
    "hi": "होजाई",
    "bn": "হোজাই",
    "as": "হোজাই",
    "ne": "होजाई",
    "mni": "হোজাই",
    "lus": "Hojai",
    "kha": "Hojai",
    "grt": "Hojai"
  },
  "Imphal East": {
    "en": "Imphal East",
    "hi": "इम्फाल पूर्व",
    "bn": "ইম্ফল পূর্ব",
    "as": "ইম্ফল পূব",
    "ne": "इम्फाल पूर्व",
    "mni": "ইম্ফাল নোংপোক",
    "lus": "Imphal Khawchhak",
    "kha": "Imphal Mihngi",
    "grt": "Imphal Salgro-Salgipeng"
  },
  "Imphal West": {
    "en": "Imphal West",
    "hi": "इम्फाल पश्चिम",
    "bn": "ইম্ফল পশ্চিম",
    "as": "ইম্ফল পশ্চিম",
    "ne": "इम्फाल पश्चिम",
    "mni": "ইম্ফাল নোংচুপ",
    "lus": "Imphal Khawthlang",
    "kha": "Imphal Mihngi",
    "grt": "Imphal Saliram"
  },
  "Itanagar Capital Complex": {
    "en": "Itanagar Capital Complex",
    "hi": "Itanagar Capital Complex",
    "bn": "Itanagar Capital Complex",
    "as": "Itanagar Capital Complex",
    "ne": "Itanagar Capital Complex",
    "mni": "Itanagar Capital Complex",
    "lus": "Itanagar Capital Complex",
    "kha": "Itanagar Capital Complex",
    "grt": "Itanagar Capital Complex"
  },
  "Jiribam": {
    "en": "Jiribam",
    "hi": "जिरीबाम",
    "bn": "জিরিবাম",
    "as": "জিৰিবাম",
    "ne": "जिरीबाम",
    "mni": "জিরিবাম",
    "lus": "Jiribam",
    "kha": "Jiribam",
    "grt": "Jiribam"
  },
  "Jorhat": {
    "en": "Jorhat",
    "hi": "जोरहाट",
    "bn": "জোরহাট",
    "as": "যোৰহাট",
    "ne": "जोरहाट",
    "mni": "জোরহাত",
    "lus": "Jorhat",
    "kha": "Jorhat",
    "grt": "Jorhat"
  },
  "Kakching": {
    "en": "Kakching",
    "hi": "काकचिंग",
    "bn": "কাকচিং",
    "as": "কাকচিং",
    "ne": "काकचिङ",
    "mni": "কাকচিং",
    "lus": "Kakching",
    "kha": "Kakching",
    "grt": "Kakching"
  },
  "Kamjong": {
    "en": "Kamjong",
    "hi": "कामजोंग",
    "bn": "কামজং",
    "as": "কামজং",
    "ne": "कामजोङ",
    "mni": "কামজোং",
    "lus": "Kamjong",
    "kha": "Kamjong",
    "grt": "Kamjong"
  },
  "Kamle": {
    "en": "Kamle",
    "hi": "कमले",
    "bn": "কামলে",
    "as": "কামলে",
    "ne": "कमले",
    "mni": "কামলে",
    "lus": "Kamle",
    "kha": "Kamle",
    "grt": "Kamle"
  },
  "Kamrup": {
    "en": "Kamrup",
    "hi": "कामरूप",
    "bn": "কামরূপ",
    "as": "কামৰূপ",
    "ne": "कामरूप",
    "mni": "কামরূপ",
    "lus": "Kamrup",
    "kha": "Kamrup",
    "grt": "Kamrup"
  },
  "Kamrup Metropolitan": {
    "en": "Kamrup Metropolitan",
    "hi": "Kamrup Metropolitan",
    "bn": "Kamrup Metropolitan",
    "as": "Kamrup Metropolitan",
    "ne": "Kamrup Metropolitan",
    "mni": "Kamrup Metropolitan",
    "lus": "Kamrup Metropolitan",
    "kha": "Kamrup Metropolitan",
    "grt": "Kamrup Metropolitan"
  },
  "Kangpokpi": {
    "en": "Kangpokpi",
    "hi": "कांगपोकपी",
    "bn": "কাংপোকপি",
    "as": "কাংপোকপী",
    "ne": "काङपोकपी",
    "mni": "কাংপোকপি",
    "lus": "Kangpokpi",
    "kha": "Kangpokpi",
    "grt": "Kangpokpi"
  },
  "Karbi Anglong": {
    "en": "Karbi Anglong",
    "hi": "कार्बी आंगलोंग",
    "bn": "কার্বি আংলং",
    "as": "কাৰ্বি আংলং",
    "ne": "कार्बी आङलोङ",
    "mni": "কার্বি আংলোং",
    "lus": "Karbi Anglong",
    "kha": "Karbi Anglong",
    "grt": "Karbi Anglong"
  },
  "Karimganj": {
    "en": "Karimganj",
    "hi": "करीमगंज",
    "bn": "করিমগঞ্জ",
    "as": "কৰিমগঞ্জ",
    "ne": "करिमगञ्ज",
    "mni": "করিমগঞ্জ",
    "lus": "Karimganj",
    "kha": "Karimganj",
    "grt": "Karimganj"
  },
  "Khawzawl": {
    "en": "Khawzawl",
    "hi": "खौजॉल",
    "bn": "খৌজাওল",
    "as": "খৌজাওল",
    "ne": "खौजोल",
    "mni": "খৌজোল",
    "lus": "Khawzawl",
    "kha": "Khawzawl",
    "grt": "Khawzawl"
  },
  "Khowai": {
    "en": "Khowai",
    "hi": "खोवाई",
    "bn": "খোয়াই",
    "as": "খোৱাই",
    "ne": "खोवाई",
    "mni": "খোৱাই",
    "lus": "Khowai",
    "kha": "Khowai",
    "grt": "Khowai"
  },
  "Kiphire": {
    "en": "Kiphire",
    "hi": "किफिरे",
    "bn": "কিফিরে",
    "as": "কিফিৰে",
    "ne": "किफिरे",
    "mni": "কিফিরে",
    "lus": "Kiphire",
    "kha": "Kiphire",
    "grt": "Kiphire"
  },
  "Kohima": {
    "en": "Kohima",
    "hi": "कोहिमा",
    "bn": "কোহিমা",
    "as": "কহিমা",
    "ne": "कोहिमा",
    "mni": "কোহিমা",
    "lus": "Kohima",
    "kha": "Kohima",
    "grt": "Kohima"
  },
  "Kokrajhar": {
    "en": "Kokrajhar",
    "hi": "कोकराझार",
    "bn": "কোকড়াঝাড়",
    "as": "কোকৰাঝাৰ",
    "ne": "कोक्राझार",
    "mni": "কোকরাঝার",
    "lus": "Kokrajhar",
    "kha": "Kokrajhar",
    "grt": "Kokrajhar"
  },
  "Kolasib": {
    "en": "Kolasib",
    "hi": "कोलासिब",
    "bn": "কোলাসিব",
    "as": "কোলাছিব",
    "ne": "कोलासिब",
    "mni": "কোলাসিব",
    "lus": "Kolasib",
    "kha": "Kolasib",
    "grt": "Kolasib"
  },
  "Kra Daadi": {
    "en": "Kra Daadi",
    "hi": "क्रा दादी",
    "bn": "ক্রা দাদি",
    "as": "ক্ৰা দাদী",
    "ne": "क्रा दादी",
    "mni": "ক্রা দাদী",
    "lus": "Kra Daadi",
    "kha": "Kra Daadi",
    "grt": "Kra Daadi"
  },
  "Kurung Kumey": {
    "en": "Kurung Kumey",
    "hi": "कुरुंग कुमे",
    "bn": "কুরুং কুমে",
    "as": "কুৰুং কুমে",
    "ne": "कुरुङ कुमे",
    "mni": "কুরুং কুমে",
    "lus": "Kurung Kumey",
    "kha": "Kurung Kumey",
    "grt": "Kurung Kumey"
  },
  "Lakhimpur": {
    "en": "Lakhimpur",
    "hi": "लखीमपुर",
    "bn": "লখিমপুর",
    "as": "লখিমপুৰ",
    "ne": "लखिमपुर",
    "mni": "লখিমপুর",
    "lus": "Lakhimpur",
    "kha": "Lakhimpur",
    "grt": "Lakhimpur"
  },
  "Lawngtlai": {
    "en": "Lawngtlai",
    "hi": "लॉन्गत्लाई",
    "bn": "লংৎলাই",
    "as": "লংত্লাই",
    "ne": "लङत्लाई",
    "mni": "লংৎলাই",
    "lus": "Lawngtlai",
    "kha": "Lawngtlai",
    "grt": "Lawngtlai"
  },
  "Lepa Rada": {
    "en": "Lepa Rada",
    "hi": "लेपा रादा",
    "bn": "লেপা রাদা",
    "as": "লেপা ৰাদা",
    "ne": "लेपा रादा",
    "mni": "লেপা রাদা",
    "lus": "Lepa Rada",
    "kha": "Lepa Rada",
    "grt": "Lepa Rada"
  },
  "Lohit": {
    "en": "Lohit",
    "hi": "Lohit",
    "bn": "Lohit",
    "as": "Lohit",
    "ne": "Lohit",
    "mni": "Lohit",
    "lus": "Lohit",
    "kha": "Lohit",
    "grt": "Lohit"
  },
  "Longding": {
    "en": "Longding",
    "hi": "लोंगडिंग",
    "bn": "লংডিং",
    "as": "লংডিং",
    "ne": "लोङडिङ",
    "mni": "লোংদিং",
    "lus": "Longding",
    "kha": "Longding",
    "grt": "Longding"
  },
  "Longleng": {
    "en": "Longleng",
    "hi": "लोंगलेंग",
    "bn": "লংলেং",
    "as": "লংলেং",
    "ne": "लोङ्लेङ",
    "mni": "লোংলেং",
    "lus": "Longleng",
    "kha": "Longleng",
    "grt": "Longleng"
  },
  "Lower Dibang Valley": {
    "en": "Lower Dibang Valley",
    "hi": "निचला Dibang घाटी",
    "bn": "নিম্ন Dibang উপত্যকা",
    "as": "নামনি Dibang উপত্যকা",
    "ne": "तल्लो Dibang उपत्यका",
    "mni": "মখাগী Dibang তম্পাক",
    "lus": "Hnuai Dibang Phaizawl",
    "kha": "Lower Dibang Them",
    "grt": "Ka·mao Dibang Chibima"
  },
  "Lower Siang": {
    "en": "Lower Siang",
    "hi": "निचला Siang",
    "bn": "নিম্ন Siang",
    "as": "নামনি Siang",
    "ne": "तल्लो Siang",
    "mni": "মখাগী Siang",
    "lus": "Hnuai Siang",
    "kha": "Lower Siang",
    "grt": "Ka·mao Siang"
  },
  "Lower Subansiri": {
    "en": "Lower Subansiri",
    "hi": "निचला Subansiri",
    "bn": "নিম্ন Subansiri",
    "as": "নামনি Subansiri",
    "ne": "तल्लो Subansiri",
    "mni": "মখাগী Subansiri",
    "lus": "Hnuai Subansiri",
    "kha": "Lower Subansiri",
    "grt": "Ka·mao Subansiri"
  },
  "Lunglei": {
    "en": "Lunglei",
    "hi": "लुंगलेई",
    "bn": "লুংলেই",
    "as": "লুংলেঈ",
    "ne": "लुङ्लेई",
    "mni": "লুংলেই",
    "lus": "Lunglei",
    "kha": "Lunglei",
    "grt": "Lunglei"
  },
  "Majuli": {
    "en": "Majuli",
    "hi": "माजुली",
    "bn": "মাজুলী",
    "as": "মাজুলী",
    "ne": "माजुली",
    "mni": "মাজুলী",
    "lus": "Majuli",
    "kha": "Majuli",
    "grt": "Majuli"
  },
  "Mamit": {
    "en": "Mamit",
    "hi": "मामित",
    "bn": "মামিত",
    "as": "মামিত",
    "ne": "मामित",
    "mni": "মামিত",
    "lus": "Mamit",
    "kha": "Mamit",
    "grt": "Mamit"
  },
  "Mangan (North Sikkim)": {
    "en": "Mangan (North Sikkim)",
    "hi": "मंगन",
    "bn": "মাঙ্গান",
    "as": "মাঙ্গান",
    "ne": "मङ्गन",
    "mni": "মঙ্গন",
    "lus": "Mangan",
    "kha": "Mangan",
    "grt": "Mangan"
  },
  "Mokokchung": {
    "en": "Mokokchung",
    "hi": "मोकोकचुंग",
    "bn": "মোককচুং",
    "as": "মোককচাং",
    "ne": "मोकोकचुङ",
    "mni": "মোকোকচুং",
    "lus": "Mokokchung",
    "kha": "Mokokchung",
    "grt": "Mokokchung"
  },
  "Mon": {
    "en": "Mon",
    "hi": "मोन",
    "bn": "মোন",
    "as": "মন",
    "ne": "मोन",
    "mni": "মোন",
    "lus": "Mon",
    "kha": "Mon",
    "grt": "Mon"
  },
  "Morigaon": {
    "en": "Morigaon",
    "hi": "मोरीगांव",
    "bn": "মরিগাঁও",
    "as": "মৰিগাঁও",
    "ne": "मरीगाउँ",
    "mni": "মোরিগাঁও",
    "lus": "Morigaon",
    "kha": "Morigaon",
    "grt": "Morigaon"
  },
  "Nagaon": {
    "en": "Nagaon",
    "hi": "नगांव",
    "bn": "নগাঁও",
    "as": "নগাঁও",
    "ne": "नगाउँ",
    "mni": "নগাঁও",
    "lus": "Nagaon",
    "kha": "Nagaon",
    "grt": "Nagaon"
  },
  "Nalbari": {
    "en": "Nalbari",
    "hi": "नलबाड़ी",
    "bn": "নলবাড়ি",
    "as": "নলবাৰী",
    "ne": "नलबाडी",
    "mni": "নলবাড়ী",
    "lus": "Nalbari",
    "kha": "Nalbari",
    "grt": "Nalbari"
  },
  "Namchi (South Sikkim)": {
    "en": "Namchi (South Sikkim)",
    "hi": "नामची",
    "bn": "নামচি",
    "as": "নামচি",
    "ne": "नाम्ची",
    "mni": "নামচি",
    "lus": "Namchi",
    "kha": "Namchi",
    "grt": "Namchi"
  },
  "Namsai": {
    "en": "Namsai",
    "hi": "नामसाई",
    "bn": "নামসাই",
    "as": "নামছাই",
    "ne": "नामसाई",
    "mni": "নামসাই",
    "lus": "Namsai",
    "kha": "Namsai",
    "grt": "Namsai"
  },
  "Niuland": {
    "en": "Niuland",
    "hi": "न्यूलैंड",
    "bn": "নিউল্যান্ড",
    "as": "নিউলেণ্ড",
    "ne": "न्युल्याण्ड",
    "mni": "নিউলেন্দ",
    "lus": "Niuland",
    "kha": "Niuland",
    "grt": "Niuland"
  },
  "Noklak": {
    "en": "Noklak",
    "hi": "नोकलाक",
    "bn": "নকলাক",
    "as": "নক্লাক",
    "ne": "नोक्लाक",
    "mni": "নোকলাক",
    "lus": "Noklak",
    "kha": "Noklak",
    "grt": "Noklak"
  },
  "Noney": {
    "en": "Noney",
    "hi": "नोने",
    "bn": "নোনে",
    "as": "ননে",
    "ne": "नोने",
    "mni": "নোনে",
    "lus": "Noney",
    "kha": "Noney",
    "grt": "Noney"
  },
  "North Garo Hills": {
    "en": "North Garo Hills",
    "hi": "उत्तरी गारो हिल्स",
    "bn": "উত্তর গারো পাহাড়",
    "as": "উত্তৰ গাৰো পাহাৰ",
    "ne": "उत्तरी गारो हिल्स",
    "mni": "অৱাংবা গারো হিলস",
    "lus": "North Garo Hills",
    "kha": "North Garo Hills",
    "grt": "North Garo Hills"
  },
  "North Tripura": {
    "en": "North Tripura",
    "hi": "उत्तर त्रिपुरा",
    "bn": "উত্তর ত্রিপুরা",
    "as": "উত্তৰ ত্ৰিপুৰা",
    "ne": "उत्तर त्रिपुरा",
    "mni": "অৱাংবা ত্রিপুরা",
    "lus": "Hmar Tripura",
    "kha": "Shatei Tripura",
    "grt": "Salgro Tripura"
  },
  "Pakke Kessang": {
    "en": "Pakke Kessang",
    "hi": "पक्के केसांग",
    "bn": "পাক্কে কেসাং",
    "as": "পাক্কে কেচাং",
    "ne": "पक्के केसाङ",
    "mni": "পাক্কে কেসাং",
    "lus": "Pakke Kessang",
    "kha": "Pakke Kessang",
    "grt": "Pakke Kessang"
  },
  "Pakyong": {
    "en": "Pakyong",
    "hi": "पाकयोंग",
    "bn": "পাকইয়ং",
    "as": "পাকিয়ং",
    "ne": "पाक्योङ",
    "mni": "পাকইয়ং",
    "lus": "Pakyong",
    "kha": "Pakyong",
    "grt": "Pakyong"
  },
  "Papum Pare": {
    "en": "Papum Pare",
    "hi": "पापुम पारे",
    "bn": "পাপুম পারে",
    "as": "পাপুম পাৰে",
    "ne": "पापुम पारे",
    "mni": "পাপুম পারে",
    "lus": "Papum Pare",
    "kha": "Papum Pare",
    "grt": "Papum Pare"
  },
  "Peren": {
    "en": "Peren",
    "hi": "पेरेन",
    "bn": "পেরেন",
    "as": "পেৰেন",
    "ne": "पेरेन",
    "mni": "পেরেন",
    "lus": "Peren",
    "kha": "Peren",
    "grt": "Peren"
  },
  "Phek": {
    "en": "Phek",
    "hi": "फेक",
    "bn": "ফেক",
    "as": "ফেক",
    "ne": "फेक",
    "mni": "ফেক",
    "lus": "Phek",
    "kha": "Phek",
    "grt": "Phek"
  },
  "Pherzawl": {
    "en": "Pherzawl",
    "hi": "फेरज़ॉल",
    "bn": "ফেরজল",
    "as": "ফেৰজল",
    "ne": "फेरजावल",
    "mni": "ফেরজোল",
    "lus": "Pherzawl",
    "kha": "Pherzawl",
    "grt": "Pherzawl"
  },
  "Ri-Bhoi": {
    "en": "Ri-Bhoi",
    "hi": "Ri-Bhoi",
    "bn": "Ri-Bhoi",
    "as": "Ri-Bhoi",
    "ne": "Ri-Bhoi",
    "mni": "Ri-Bhoi",
    "lus": "Ri-Bhoi",
    "kha": "Ri-Bhoi",
    "grt": "Ri-Bhoi"
  },
  "Saiha": {
    "en": "Saiha",
    "hi": "Saiha",
    "bn": "Saiha",
    "as": "Saiha",
    "ne": "Saiha",
    "mni": "Saiha",
    "lus": "Saiha",
    "kha": "Saiha",
    "grt": "Saiha"
  },
  "Saitual": {
    "en": "Saitual",
    "hi": "सैतुअल",
    "bn": "সাইতুয়াল",
    "as": "ছাইতুৱাল",
    "ne": "सैतुअल",
    "mni": "সাইতুয়াল",
    "lus": "Saitual",
    "kha": "Saitual",
    "grt": "Saitual"
  },
  "Senapati": {
    "en": "Senapati",
    "hi": "सेनापति",
    "bn": "সেনাপতি",
    "as": "সেনাপতি",
    "ne": "सेनापति",
    "mni": "সেনাপতি",
    "lus": "Senapati",
    "kha": "Senapati",
    "grt": "Senapati"
  },
  "Sepahijala": {
    "en": "Sepahijala",
    "hi": "सिपाहीजाला",
    "bn": "সিপাহীজলা",
    "as": "চিপাহীজলা",
    "ne": "सिपाहीजाला",
    "mni": "সিপাহীজলা",
    "lus": "Sepahijala",
    "kha": "Sepahijala",
    "grt": "Sepahijala"
  },
  "Serchhip": {
    "en": "Serchhip",
    "hi": "सेरछिप",
    "bn": "সেরছিপ",
    "as": "চেৰছিপ",
    "ne": "सेरछिप",
    "mni": "সেরছিপ",
    "lus": "Serchhip",
    "kha": "Serchhip",
    "grt": "Serchhip"
  },
  "Shamator": {
    "en": "Shamator",
    "hi": "शामटोर",
    "bn": "শামাটোর",
    "as": "শামাটৰ",
    "ne": "शामटोर",
    "mni": "শামাতোর",
    "lus": "Shamator",
    "kha": "Shamator",
    "grt": "Shamator"
  },
  "Shi Yomi": {
    "en": "Shi Yomi",
    "hi": "शी योमी",
    "bn": "শি ইয়োমি",
    "as": "শ্বী য়োমি",
    "ne": "शी योमी",
    "mni": "শী য়োমি",
    "lus": "Shi Yomi",
    "kha": "Shi Yomi",
    "grt": "Shi Yomi"
  },
  "Siang": {
    "en": "Siang",
    "hi": "Siang",
    "bn": "Siang",
    "as": "Siang",
    "ne": "Siang",
    "mni": "Siang",
    "lus": "Siang",
    "kha": "Siang",
    "grt": "Siang"
  },
  "Sivasagar": {
    "en": "Sivasagar",
    "hi": "शिवसागर",
    "bn": "শিবসাগর",
    "as": "শিৱসাগৰ",
    "ne": "शिवसागर",
    "mni": "শিবসাগর",
    "lus": "Sivasagar",
    "kha": "Sivasagar",
    "grt": "Sivasagar"
  },
  "Sonitpur": {
    "en": "Sonitpur",
    "hi": "सोनितपुर",
    "bn": "শোনিতপুর",
    "as": "শোণিতপুৰ",
    "ne": "सोनितपुर",
    "mni": "সোনিতপুর",
    "lus": "Sonitpur",
    "kha": "Sonitpur",
    "grt": "Sonitpur"
  },
  "Soreng": {
    "en": "Soreng",
    "hi": "सोरेन्ग",
    "bn": "সোরেং",
    "as": "চোৰেং",
    "ne": "सोरेङ",
    "mni": "সোরেং",
    "lus": "Soreng",
    "kha": "Soreng",
    "grt": "Soreng"
  },
  "South Garo Hills": {
    "en": "South Garo Hills",
    "hi": "दक्षिण गारो हिल्स",
    "bn": "দক্ষিণ গারো পাহাড়",
    "as": "দক্ষিণ গাৰো পাহাৰ",
    "ne": "दक्षिण गारो हिल्स",
    "mni": "মখা গারো হিলস",
    "lus": "South Garo Hills",
    "kha": "South Garo Hills",
    "grt": "South Garo Hills"
  },
  "South Salmara-Mankachar": {
    "en": "South Salmara-Mankachar",
    "hi": "दक्षिण Salmara-Mankachar",
    "bn": "দক্ষিণ Salmara-Mankachar",
    "as": "দক্ষিণ Salmara-Mankachar",
    "ne": "दक्षिण Salmara-Mankachar",
    "mni": "মখা Salmara-Mankachar",
    "lus": "Chhim Salmara-Mankachar",
    "kha": "Shaphang Salmara-Mankachar",
    "grt": "Salbag Salmara-Mankachar"
  },
  "South Tripura": {
    "en": "South Tripura",
    "hi": "दक्षिण त्रिपुरा",
    "bn": "দক্ষিণ ত্রিপুরা",
    "as": "দক্ষিণ ত্ৰিপুৰা",
    "ne": "दक्षिण त्रिपुरा",
    "mni": "মখা ত্রিপুরা",
    "lus": "Chhim Tripura",
    "kha": "Shaphang Tripura",
    "grt": "Salbag Tripura"
  },
  "South West Garo Hills": {
    "en": "South West Garo Hills",
    "hi": "दक्षिण पश्चिम गारो हिल्स",
    "bn": "দক্ষিণ পশ্চিম গারো পাহাড়",
    "as": "দক্ষিণ পশ্চিম গাৰো পাহাৰ",
    "ne": "दक्षिण पश्चिम गारो हिल्स",
    "mni": "মখা নোংচুপ গারো হিলস",
    "lus": "South West Garo Hills",
    "kha": "South West Garo Hills",
    "grt": "South West Garo Hills"
  },
  "South West Khasi Hills": {
    "en": "South West Khasi Hills",
    "hi": "दक्षिण पश्चिम खासी हिल्स",
    "bn": "দক্ষিণ পশ্চিম খাসি পাহাড়",
    "as": "দক্ষিণ পশ্চিম খাচী পাহাৰ",
    "ne": "दक्षिण पश्चिम खासी हिल्स",
    "mni": "মখা নোংচুপ খাসী হিলস",
    "lus": "South West Khasi Hills",
    "kha": "South West Khasi Hills",
    "grt": "South West Khasi Hills"
  },
  "Tamenglong": {
    "en": "Tamenglong",
    "hi": "तामेंगलॉन्ग",
    "bn": "তামেংলং",
    "as": "তামেংলং",
    "ne": "तामेङलोङ",
    "mni": "তামেংলোং",
    "lus": "Tamenglong",
    "kha": "Tamenglong",
    "grt": "Tamenglong"
  },
  "Tamulpur": {
    "en": "Tamulpur",
    "hi": "तामुलपुर",
    "bn": "তামুলপুর",
    "as": "তামুলপুৰ",
    "ne": "तामुलपुर",
    "mni": "তামুলপুর",
    "lus": "Tamulpur",
    "kha": "Tamulpur",
    "grt": "Tamulpur"
  },
  "Tawang": {
    "en": "Tawang",
    "hi": "तवांग",
    "bn": "তাওয়াং",
    "as": "টাৱাং",
    "ne": "तवाङ",
    "mni": "তৱাং",
    "lus": "Tawang",
    "kha": "Tawang",
    "grt": "Tawang"
  },
  "Tengnoupal": {
    "en": "Tengnoupal",
    "hi": "तेंगनौपाल",
    "bn": "তেংনৌপাল",
    "as": "তেংনৌপাল",
    "ne": "तेङनौपाल",
    "mni": "তেংনৌপাল",
    "lus": "Tengnoupal",
    "kha": "Tengnoupal",
    "grt": "Tengnoupal"
  },
  "Thoubal": {
    "en": "Thoubal",
    "hi": "थौबल",
    "bn": "থৌবাল",
    "as": "থৌবাল",
    "ne": "थौबल",
    "mni": "থৌবাল",
    "lus": "Thoubal",
    "kha": "Thoubal",
    "grt": "Thoubal"
  },
  "Tinsukia": {
    "en": "Tinsukia",
    "hi": "तिनसुकिया",
    "bn": "তিনসুকিয়া",
    "as": "তিনিচুকীয়া",
    "ne": "तिनसुकिया",
    "mni": "তিনসুকিয়া",
    "lus": "Tinsukia",
    "kha": "Tinsukia",
    "grt": "Tinsukia"
  },
  "Tirap": {
    "en": "Tirap",
    "hi": "तिराप",
    "bn": "তিরাপ",
    "as": "তিৰাপ",
    "ne": "तिराप",
    "mni": "তিরাপ",
    "lus": "Tirap",
    "kha": "Tirap",
    "grt": "Tirap"
  },
  "Tseminyu": {
    "en": "Tseminyu",
    "hi": "Tseminyu",
    "bn": "Tseminyu",
    "as": "Tseminyu",
    "ne": "Tseminyu",
    "mni": "Tseminyu",
    "lus": "Tseminyu",
    "kha": "Tseminyu",
    "grt": "Tseminyu"
  },
  "Tuensang": {
    "en": "Tuensang",
    "hi": "तुएनसांग",
    "bn": "টুয়েনসাং",
    "as": "টুৱেনচাং",
    "ne": "तुएनसाङ",
    "mni": "তুয়েনসাং",
    "lus": "Tuensang",
    "kha": "Tuensang",
    "grt": "Tuensang"
  },
  "Udalguri": {
    "en": "Udalguri",
    "hi": "उदलगुड़ी",
    "bn": "ওদালগুড়ি",
    "as": "ওদালগুৰি",
    "ne": "उदलगुडी",
    "mni": "উদালগুড়ি",
    "lus": "Udalguri",
    "kha": "Udalguri",
    "grt": "Udalguri"
  },
  "Ukhrul": {
    "en": "Ukhrul",
    "hi": "उखरुल",
    "bn": "উখরুল",
    "as": "উখৰুল",
    "ne": "उखरुल",
    "mni": "উখরুল",
    "lus": "Ukhrul",
    "kha": "Ukhrul",
    "grt": "Ukhrul"
  },
  "Unakoti": {
    "en": "Unakoti",
    "hi": "उनाकोटी",
    "bn": "ঊনকোটি",
    "as": "উনকোটি",
    "ne": "उनाकोटी",
    "mni": "উনা কোটি",
    "lus": "Unakoti",
    "kha": "Unakoti",
    "grt": "Unakoti"
  },
  "Upper Siang": {
    "en": "Upper Siang",
    "hi": "ऊपरी Siang",
    "bn": "উচ্চ Siang",
    "as": "উচ্চ Siang",
    "ne": "माथिल्लो Siang",
    "mni": "মথক্কী Siang",
    "lus": "Chung Siang",
    "kha": "Upper Siang",
    "grt": "Kosako Siang"
  },
  "Upper Subansiri": {
    "en": "Upper Subansiri",
    "hi": "ऊपरी Subansiri",
    "bn": "উচ্চ Subansiri",
    "as": "উচ্চ Subansiri",
    "ne": "माथिल्लो Subansiri",
    "mni": "মথক্কী Subansiri",
    "lus": "Chung Subansiri",
    "kha": "Upper Subansiri",
    "grt": "Kosako Subansiri"
  },
  "West Garo Hills": {
    "en": "West Garo Hills",
    "hi": "पश्चिमी गारो हिल्स",
    "bn": "পশ্চিম গারো পাহাড়",
    "as": "পশ্চিম গাৰো পাহাৰ",
    "ne": "पश्चिमी गारो हिल्स",
    "mni": "নোংচুপ গারো হিলস",
    "lus": "West Garo Hills",
    "kha": "West Garo Hills",
    "grt": "West Garo Hills"
  },
  "West Jaintia Hills": {
    "en": "West Jaintia Hills",
    "hi": "पश्चिमी जयंतिया हिल्स",
    "bn": "পশ্চিম জয়ন্তীয়া পাহাড়",
    "as": "পশ্চিম জয়ন্তীয়া পাহাৰ",
    "ne": "पश्चिमी जयन्तिया हिल्स",
    "mni": "নোংচুপ জয়ন্তিয়া হিলস",
    "lus": "West Jaintia Hills",
    "kha": "West Jaintia Hills",
    "grt": "West Jaintia Hills"
  },
  "West Kameng": {
    "en": "West Kameng",
    "hi": "पश्चिम Kameng",
    "bn": "পশ্চিম Kameng",
    "as": "পশ্চিম Kameng",
    "ne": "पश्चिम Kameng",
    "mni": "নোংচুপ Kameng",
    "lus": "Khawthlang Kameng",
    "kha": "Mihngi Kameng",
    "grt": "Saliram Kameng"
  },
  "West Karbi Anglong": {
    "en": "West Karbi Anglong",
    "hi": "पश्चिम कार्बी आंगलोंग",
    "bn": "পশ্চিম কার্বি আংলং",
    "as": "পশ্চিম কাৰ্বি আংলং",
    "ne": "पश्चिम कार्बी आङलोङ",
    "mni": "নোংচুপ কার্বি আংলোং",
    "lus": "West Karbi Anglong",
    "kha": "West Karbi Anglong",
    "grt": "West Karbi Anglong"
  },
  "West Khasi Hills": {
    "en": "West Khasi Hills",
    "hi": "पश्चिमी खासी हिल्स",
    "bn": "পশ্চিম খাসি পাহাড়",
    "as": "পশ্চিম খাচী পাহাৰ",
    "ne": "पश्चिमी खासी हिल्स",
    "mni": "নোংচুপ খাসী হিলস",
    "lus": "West Khasi Hills",
    "kha": "West Khasi Hills",
    "grt": "West Khasi Hills"
  },
  "West Siang": {
    "en": "West Siang",
    "hi": "पश्चिम Siang",
    "bn": "পশ্চিম Siang",
    "as": "পশ্চিম Siang",
    "ne": "पश्चिम Siang",
    "mni": "নোংচুপ Siang",
    "lus": "Khawthlang Siang",
    "kha": "Mihngi Siang",
    "grt": "Saliram Siang"
  },
  "West Tripura": {
    "en": "West Tripura",
    "hi": "पश्चिम त्रिपुरा",
    "bn": "পশ্চিম ত্রিপুরা",
    "as": "পশ্চিম ত্ৰিপুৰা",
    "ne": "पश्चिम त्रिपुरा",
    "mni": "নোংচুপ ত্রিপুরা",
    "lus": "Khawthlang Tripura",
    "kha": "Mihngi Tripura",
    "grt": "Saliram Tripura"
  },
  "Wokha": {
    "en": "Wokha",
    "hi": "वोखा",
    "bn": "ওখা",
    "as": "ৱখা",
    "ne": "वोखा",
    "mni": "ৱোখা",
    "lus": "Wokha",
    "kha": "Wokha",
    "grt": "Wokha"
  },
  "Zunheboto": {
    "en": "Zunheboto",
    "hi": "जुन्हेबोटो",
    "bn": "জুনহেবোটো",
    "as": "জুনহেব'ট'",
    "ne": "जुन्हेबोटो",
    "mni": "জুন্হেবোতো",
    "lus": "Zunheboto",
    "kha": "Zunheboto",
    "grt": "Zunheboto"
  }
};

export const CITY_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "Aalo": {
    "en": "Aalo",
    "hi": "Aalo",
    "bn": "Aalo",
    "as": "Aalo",
    "ne": "Aalo",
    "mni": "Aalo",
    "lus": "Aalo",
    "kha": "Aalo",
    "grt": "Aalo"
  },
  "Abhayapuri": {
    "en": "Abhayapuri",
    "hi": "Abhayapuri",
    "bn": "Abhayapuri",
    "as": "Abhayapuri",
    "ne": "Abhayapuri",
    "mni": "Abhayapuri",
    "lus": "Abhayapuri",
    "kha": "Abhayapuri",
    "grt": "Abhayapuri"
  },
  "Aboi": {
    "en": "Aboi",
    "hi": "Aboi",
    "bn": "Aboi",
    "as": "Aboi",
    "ne": "Aboi",
    "mni": "Aboi",
    "lus": "Aboi",
    "kha": "Aboi",
    "grt": "Aboi"
  },
  "Agartala": {
    "en": "Agartala",
    "hi": "अगरतला",
    "bn": "আগরতলা",
    "as": "আগৰতলা",
    "ne": "अगरतला",
    "mni": "আগরতলা",
    "lus": "Agartala",
    "kha": "Agartala",
    "grt": "Agartala"
  },
  "Aghunato": {
    "en": "Aghunato",
    "hi": "Aghunato",
    "bn": "Aghunato",
    "as": "Aghunato",
    "ne": "Aghunato",
    "mni": "Aghunato",
    "lus": "Aghunato",
    "kha": "Aghunato",
    "grt": "Aghunato"
  },
  "Aizawl": {
    "en": "Aizawl",
    "hi": "आइजोल",
    "bn": "আইজল",
    "as": "আইজল",
    "ne": "आइजोल",
    "mni": "আইজোল",
    "lus": "Aizawl",
    "kha": "Aizawl",
    "grt": "Aizawl"
  },
  "Akuluto": {
    "en": "Akuluto",
    "hi": "Akuluto",
    "bn": "Akuluto",
    "as": "Akuluto",
    "ne": "Akuluto",
    "mni": "Akuluto",
    "lus": "Akuluto",
    "kha": "Akuluto",
    "grt": "Akuluto"
  },
  "Algapur": {
    "en": "Algapur",
    "hi": "Algapur",
    "bn": "Algapur",
    "as": "Algapur",
    "ne": "Algapur",
    "mni": "Algapur",
    "lus": "Algapur",
    "kha": "Algapur",
    "grt": "Algapur"
  },
  "Amarpur": {
    "en": "Amarpur",
    "hi": "Amarpur",
    "bn": "Amarpur",
    "as": "Amarpur",
    "ne": "Amarpur",
    "mni": "Amarpur",
    "lus": "Amarpur",
    "kha": "Amarpur",
    "grt": "Amarpur"
  },
  "Ambassa": {
    "en": "Ambassa",
    "hi": "Ambassa",
    "bn": "Ambassa",
    "as": "Ambassa",
    "ne": "Ambassa",
    "mni": "Ambassa",
    "lus": "Ambassa",
    "kha": "Ambassa",
    "grt": "Ambassa"
  },
  "Amguri": {
    "en": "Amguri",
    "hi": "Amguri",
    "bn": "Amguri",
    "as": "Amguri",
    "ne": "Amguri",
    "mni": "Amguri",
    "lus": "Amguri",
    "kha": "Amguri",
    "grt": "Amguri"
  },
  "Amingaon": {
    "en": "Amingaon",
    "hi": "Amingaon",
    "bn": "Amingaon",
    "as": "Amingaon",
    "ne": "Amingaon",
    "mni": "Amingaon",
    "lus": "Amingaon",
    "kha": "Amingaon",
    "grt": "Amingaon"
  },
  "Amlarem": {
    "en": "Amlarem",
    "hi": "Amlarem",
    "bn": "Amlarem",
    "as": "Amlarem",
    "ne": "Amlarem",
    "mni": "Amlarem",
    "lus": "Amlarem",
    "kha": "Amlarem",
    "grt": "Amlarem"
  },
  "Ampati": {
    "en": "Ampati",
    "hi": "Ampati",
    "bn": "Ampati",
    "as": "Ampati",
    "ne": "Ampati",
    "mni": "Ampati",
    "lus": "Ampati",
    "kha": "Ampati",
    "grt": "Ampati"
  },
  "Andro": {
    "en": "Andro",
    "hi": "Andro",
    "bn": "Andro",
    "as": "Andro",
    "ne": "Andro",
    "mni": "Andro",
    "lus": "Andro",
    "kha": "Andro",
    "grt": "Andro"
  },
  "Anini": {
    "en": "Anini",
    "hi": "Anini",
    "bn": "Anini",
    "as": "Anini",
    "ne": "Anini",
    "mni": "Anini",
    "lus": "Anini",
    "kha": "Anini",
    "grt": "Anini"
  },
  "Babupara": {
    "en": "Babupara",
    "hi": "Babupara",
    "bn": "Babupara",
    "as": "Babupara",
    "ne": "Babupara",
    "mni": "Babupara",
    "lus": "Babupara",
    "kha": "Babupara",
    "grt": "Babupara"
  },
  "Badarpur": {
    "en": "Badarpur",
    "hi": "Badarpur",
    "bn": "Badarpur",
    "as": "Badarpur",
    "ne": "Badarpur",
    "mni": "Badarpur",
    "lus": "Badarpur",
    "kha": "Badarpur",
    "grt": "Badarpur"
  },
  "Baghmara": {
    "en": "Baghmara",
    "hi": "Baghmara",
    "bn": "Baghmara",
    "as": "Baghmara",
    "ne": "Baghmara",
    "mni": "Baghmara",
    "lus": "Baghmara",
    "kha": "Baghmara",
    "grt": "Baghmara"
  },
  "Bairabi": {
    "en": "Bairabi",
    "hi": "Bairabi",
    "bn": "Bairabi",
    "as": "Bairabi",
    "ne": "Bairabi",
    "mni": "Bairabi",
    "lus": "Bairabi",
    "kha": "Bairabi",
    "grt": "Bairabi"
  },
  "Baithalangso": {
    "en": "Baithalangso",
    "hi": "Baithalangso",
    "bn": "Baithalangso",
    "as": "Baithalangso",
    "ne": "Baithalangso",
    "mni": "Baithalangso",
    "lus": "Baithalangso",
    "kha": "Baithalangso",
    "grt": "Baithalangso"
  },
  "Bajengdoba": {
    "en": "Bajengdoba",
    "hi": "Bajengdoba",
    "bn": "Bajengdoba",
    "as": "Bajengdoba",
    "ne": "Bajengdoba",
    "mni": "Bajengdoba",
    "lus": "Bajengdoba",
    "kha": "Bajengdoba",
    "grt": "Bajengdoba"
  },
  "Bana": {
    "en": "Bana",
    "hi": "Bana",
    "bn": "Bana",
    "as": "Bana",
    "ne": "Bana",
    "mni": "Bana",
    "lus": "Bana",
    "kha": "Bana",
    "grt": "Bana"
  },
  "Banderdewa": {
    "en": "Banderdewa",
    "hi": "Banderdewa",
    "bn": "Banderdewa",
    "as": "Banderdewa",
    "ne": "Banderdewa",
    "mni": "Banderdewa",
    "lus": "Banderdewa",
    "kha": "Banderdewa",
    "grt": "Banderdewa"
  },
  "Barama": {
    "en": "Barama",
    "hi": "Barama",
    "bn": "Barama",
    "as": "Barama",
    "ne": "Barama",
    "mni": "Barama",
    "lus": "Barama",
    "kha": "Barama",
    "grt": "Barama"
  },
  "Barpeta": {
    "en": "Barpeta",
    "hi": "बरपेटा",
    "bn": "বরপেটা",
    "as": "বৰপেটা",
    "ne": "बरपेटा",
    "mni": "বরপেটা",
    "lus": "Barpeta",
    "kha": "Barpeta",
    "grt": "Barpeta"
  },
  "Barpeta Road": {
    "en": "Barpeta Road",
    "hi": "Barpeta Road",
    "bn": "Barpeta Road",
    "as": "Barpeta Road",
    "ne": "Barpeta Road",
    "mni": "Barpeta Road",
    "lus": "Barpeta Road",
    "kha": "Barpeta Road",
    "grt": "Barpeta Road"
  },
  "Basar": {
    "en": "Basar",
    "hi": "Basar",
    "bn": "Basar",
    "as": "Basar",
    "ne": "Basar",
    "mni": "Basar",
    "lus": "Basar",
    "kha": "Basar",
    "grt": "Basar"
  },
  "Basugaon": {
    "en": "Basugaon",
    "hi": "Basugaon",
    "bn": "Basugaon",
    "as": "Basugaon",
    "ne": "Basugaon",
    "mni": "Basugaon",
    "lus": "Basugaon",
    "kha": "Basugaon",
    "grt": "Basugaon"
  },
  "Bawngkawn": {
    "en": "Bawngkawn",
    "hi": "Bawngkawn",
    "bn": "Bawngkawn",
    "as": "Bawngkawn",
    "ne": "Bawngkawn",
    "mni": "Bawngkawn",
    "lus": "Bawngkawn",
    "kha": "Bawngkawn",
    "grt": "Bawngkawn"
  },
  "Behiang": {
    "en": "Behiang",
    "hi": "Behiang",
    "bn": "Behiang",
    "as": "Behiang",
    "ne": "Behiang",
    "mni": "Behiang",
    "lus": "Behiang",
    "kha": "Behiang",
    "grt": "Behiang"
  },
  "Belonia": {
    "en": "Belonia",
    "hi": "Belonia",
    "bn": "Belonia",
    "as": "Belonia",
    "ne": "Belonia",
    "mni": "Belonia",
    "lus": "Belonia",
    "kha": "Belonia",
    "grt": "Belonia"
  },
  "Belsor": {
    "en": "Belsor",
    "hi": "Belsor",
    "bn": "Belsor",
    "as": "Belsor",
    "ne": "Belsor",
    "mni": "Belsor",
    "lus": "Belsor",
    "kha": "Belsor",
    "grt": "Belsor"
  },
  "Beltola": {
    "en": "Beltola",
    "hi": "Beltola",
    "bn": "Beltola",
    "as": "Beltola",
    "ne": "Beltola",
    "mni": "Beltola",
    "lus": "Beltola",
    "kha": "Beltola",
    "grt": "Beltola"
  },
  "Betasing": {
    "en": "Betasing",
    "hi": "Betasing",
    "bn": "Betasing",
    "as": "Betasing",
    "ne": "Betasing",
    "mni": "Betasing",
    "lus": "Betasing",
    "kha": "Betasing",
    "grt": "Betasing"
  },
  "Bhairabkunda": {
    "en": "Bhairabkunda",
    "hi": "Bhairabkunda",
    "bn": "Bhairabkunda",
    "as": "Bhairabkunda",
    "ne": "Bhairabkunda",
    "mni": "Bhairabkunda",
    "lus": "Bhairabkunda",
    "kha": "Bhairabkunda",
    "grt": "Bhairabkunda"
  },
  "Bhalukpong": {
    "en": "Bhalukpong",
    "hi": "Bhalukpong",
    "bn": "Bhalukpong",
    "as": "Bhalukpong",
    "ne": "Bhalukpong",
    "mni": "Bhalukpong",
    "lus": "Bhalukpong",
    "kha": "Bhalukpong",
    "grt": "Bhalukpong"
  },
  "Bhandari": {
    "en": "Bhandari",
    "hi": "Bhandari",
    "bn": "Bhandari",
    "as": "Bhandari",
    "ne": "Bhandari",
    "mni": "Bhandari",
    "lus": "Bhandari",
    "kha": "Bhandari",
    "grt": "Bhandari"
  },
  "Bhowanipur": {
    "en": "Bhowanipur",
    "hi": "Bhowanipur",
    "bn": "Bhowanipur",
    "as": "Bhowanipur",
    "ne": "Bhowanipur",
    "mni": "Bhowanipur",
    "lus": "Bhowanipur",
    "kha": "Bhowanipur",
    "grt": "Bhowanipur"
  },
  "Bhuragaon": {
    "en": "Bhuragaon",
    "hi": "Bhuragaon",
    "bn": "Bhuragaon",
    "as": "Bhuragaon",
    "ne": "Bhuragaon",
    "mni": "Bhuragaon",
    "lus": "Bhuragaon",
    "kha": "Bhuragaon",
    "grt": "Bhuragaon"
  },
  "Biate": {
    "en": "Biate",
    "hi": "Biate",
    "bn": "Biate",
    "as": "Biate",
    "ne": "Biate",
    "mni": "Biate",
    "lus": "Biate",
    "kha": "Biate",
    "grt": "Biate"
  },
  "Bihpuria": {
    "en": "Bihpuria",
    "hi": "Bihpuria",
    "bn": "Bihpuria",
    "as": "Bihpuria",
    "ne": "Bihpuria",
    "mni": "Bihpuria",
    "lus": "Bihpuria",
    "kha": "Bihpuria",
    "grt": "Bihpuria"
  },
  "Bijni": {
    "en": "Bijni",
    "hi": "Bijni",
    "bn": "Bijni",
    "as": "Bijni",
    "ne": "Bijni",
    "mni": "Bijni",
    "lus": "Bijni",
    "kha": "Bijni",
    "grt": "Bijni"
  },
  "Bilasipara": {
    "en": "Bilasipara",
    "hi": "Bilasipara",
    "bn": "Bilasipara",
    "as": "Bilasipara",
    "ne": "Bilasipara",
    "mni": "Bilasipara",
    "lus": "Bilasipara",
    "kha": "Bilasipara",
    "grt": "Bilasipara"
  },
  "Bishnupur": {
    "en": "Bishnupur",
    "hi": "बिष्णुपुर",
    "bn": "বিষ্ণুপুর",
    "as": "বিষ্ণুপুৰ",
    "ne": "बिष्णुपुर",
    "mni": "বিষ্ণুপুর",
    "lus": "Bishnupur",
    "kha": "Bishnupur",
    "grt": "Bishnupur"
  },
  "Bishramganj": {
    "en": "Bishramganj",
    "hi": "Bishramganj",
    "bn": "Bishramganj",
    "as": "Bishramganj",
    "ne": "Bishramganj",
    "mni": "Bishramganj",
    "lus": "Bishramganj",
    "kha": "Bishramganj",
    "grt": "Bishramganj"
  },
  "Biswanath Chariali": {
    "en": "Biswanath Chariali",
    "hi": "Biswanath Chariali",
    "bn": "Biswanath Chariali",
    "as": "Biswanath Chariali",
    "ne": "Biswanath Chariali",
    "mni": "Biswanath Chariali",
    "lus": "Biswanath Chariali",
    "kha": "Biswanath Chariali",
    "grt": "Biswanath Chariali"
  },
  "Bokajan": {
    "en": "Bokajan",
    "hi": "Bokajan",
    "bn": "Bokajan",
    "as": "Bokajan",
    "ne": "Bokajan",
    "mni": "Bokajan",
    "lus": "Bokajan",
    "kha": "Bokajan",
    "grt": "Bokajan"
  },
  "Bokakhat": {
    "en": "Bokakhat",
    "hi": "Bokakhat",
    "bn": "Bokakhat",
    "as": "Bokakhat",
    "ne": "Bokakhat",
    "mni": "Bokakhat",
    "lus": "Bokakhat",
    "kha": "Bokakhat",
    "grt": "Bokakhat"
  },
  "Boleng": {
    "en": "Boleng",
    "hi": "Boleng",
    "bn": "Boleng",
    "as": "Boleng",
    "ne": "Boleng",
    "mni": "Boleng",
    "lus": "Boleng",
    "kha": "Boleng",
    "grt": "Boleng"
  },
  "Bomdila": {
    "en": "Bomdila",
    "hi": "बोमडिला",
    "bn": "বোমডিলা",
    "as": "বোমডিলা",
    "ne": "बोमडिला",
    "mni": "বোমদিলা",
    "lus": "Bomdila",
    "kha": "Bomdila",
    "grt": "Bomdila"
  },
  "Bongaigaon": {
    "en": "Bongaigaon",
    "hi": "बोंगाईगांव",
    "bn": "বঙাইগাঁও",
    "as": "বঙাইগাঁও",
    "ne": "बोङ्गाइगाउँ",
    "mni": "বোঙ্গাইগাঁও",
    "lus": "Bongaigaon",
    "kha": "Bongaigaon",
    "grt": "Bongaigaon"
  },
  "Bordumsa": {
    "en": "Bordumsa",
    "hi": "Bordumsa",
    "bn": "Bordumsa",
    "as": "Bordumsa",
    "ne": "Bordumsa",
    "mni": "Bordumsa",
    "lus": "Bordumsa",
    "kha": "Bordumsa",
    "grt": "Bordumsa"
  },
  "Byrnihat": {
    "en": "Byrnihat",
    "hi": "Byrnihat",
    "bn": "Byrnihat",
    "as": "Byrnihat",
    "ne": "Byrnihat",
    "mni": "Byrnihat",
    "lus": "Byrnihat",
    "kha": "Byrnihat",
    "grt": "Byrnihat"
  },
  "Chabua": {
    "en": "Chabua",
    "hi": "Chabua",
    "bn": "Chabua",
    "as": "Chabua",
    "ne": "Chabua",
    "mni": "Chabua",
    "lus": "Chabua",
    "kha": "Chabua",
    "grt": "Chabua"
  },
  "Chakpikarong": {
    "en": "Chakpikarong",
    "hi": "Chakpikarong",
    "bn": "Chakpikarong",
    "as": "Chakpikarong",
    "ne": "Chakpikarong",
    "mni": "Chakpikarong",
    "lus": "Chakpikarong",
    "kha": "Chakpikarong",
    "grt": "Chakpikarong"
  },
  "Champhai": {
    "en": "Champhai",
    "hi": "चम्फाई",
    "bn": "চাম্ফাই",
    "as": "চাম্ফাই",
    "ne": "चम्फाई",
    "mni": "চাম্ফাই",
    "lus": "Champhai",
    "kha": "Champhai",
    "grt": "Champhai"
  },
  "Chandel": {
    "en": "Chandel",
    "hi": "चंदेल",
    "bn": "চান্দেল",
    "as": "চান্দেল",
    "ne": "चन्देल",
    "mni": "চান্দেল",
    "lus": "Chandel",
    "kha": "Chandel",
    "grt": "Chandel"
  },
  "Chandmari": {
    "en": "Chandmari",
    "hi": "Chandmari",
    "bn": "Chandmari",
    "as": "Chandmari",
    "ne": "Chandmari",
    "mni": "Chandmari",
    "lus": "Chandmari",
    "kha": "Chandmari",
    "grt": "Chandmari"
  },
  "Changlang": {
    "en": "Changlang",
    "hi": "चांगलांग",
    "bn": "চাংলাং",
    "as": "চাংলাং",
    "ne": "चाङलाङ",
    "mni": "চাংলাং",
    "lus": "Changlang",
    "kha": "Changlang",
    "grt": "Changlang"
  },
  "Changtongya": {
    "en": "Changtongya",
    "hi": "Changtongya",
    "bn": "Changtongya",
    "as": "Changtongya",
    "ne": "Changtongya",
    "mni": "Changtongya",
    "lus": "Changtongya",
    "kha": "Changtongya",
    "grt": "Changtongya"
  },
  "Chapar": {
    "en": "Chapar",
    "hi": "Chapar",
    "bn": "Chapar",
    "as": "Chapar",
    "ne": "Chapar",
    "mni": "Chapar",
    "lus": "Chapar",
    "kha": "Chapar",
    "grt": "Chapar"
  },
  "Charaideo Maidam": {
    "en": "Charaideo Maidam",
    "hi": "Charaideo Maidam",
    "bn": "Charaideo Maidam",
    "as": "Charaideo Maidam",
    "ne": "Charaideo Maidam",
    "mni": "Charaideo Maidam",
    "lus": "Charaideo Maidam",
    "kha": "Charaideo Maidam",
    "grt": "Charaideo Maidam"
  },
  "Chawngte": {
    "en": "Chawngte",
    "hi": "Chawngte",
    "bn": "Chawngte",
    "as": "Chawngte",
    "ne": "Chawngte",
    "mni": "Chawngte",
    "lus": "Chawngte",
    "kha": "Chawngte",
    "grt": "Chawngte"
  },
  "Chayang Tajo": {
    "en": "Chayang Tajo",
    "hi": "Chayang Tajo",
    "bn": "Chayang Tajo",
    "as": "Chayang Tajo",
    "ne": "Chayang Tajo",
    "mni": "Chayang Tajo",
    "lus": "Chayang Tajo",
    "kha": "Chayang Tajo",
    "grt": "Chayang Tajo"
  },
  "Chaygaon": {
    "en": "Chaygaon",
    "hi": "Chaygaon",
    "bn": "Chaygaon",
    "as": "Chaygaon",
    "ne": "Chaygaon",
    "mni": "Chaygaon",
    "lus": "Chaygaon",
    "kha": "Chaygaon",
    "grt": "Chaygaon"
  },
  "Cherrapunji": {
    "en": "Cherrapunji",
    "hi": "Cherrapunji",
    "bn": "Cherrapunji",
    "as": "Cherrapunji",
    "ne": "Cherrapunji",
    "mni": "Cherrapunji",
    "lus": "Cherrapunji",
    "kha": "Cherrapunji",
    "grt": "Cherrapunji"
  },
  "Chessore": {
    "en": "Chessore",
    "hi": "Chessore",
    "bn": "Chessore",
    "as": "Chessore",
    "ne": "Chessore",
    "mni": "Chessore",
    "lus": "Chessore",
    "kha": "Chessore",
    "grt": "Chessore"
  },
  "Chiephobozou": {
    "en": "Chiephobozou",
    "hi": "Chiephobozou",
    "bn": "Chiephobozou",
    "as": "Chiephobozou",
    "ne": "Chiephobozou",
    "mni": "Chiephobozou",
    "lus": "Chiephobozou",
    "kha": "Chiephobozou",
    "grt": "Chiephobozou"
  },
  "Chingai": {
    "en": "Chingai",
    "hi": "Chingai",
    "bn": "Chingai",
    "as": "Chingai",
    "ne": "Chingai",
    "mni": "Chingai",
    "lus": "Chingai",
    "kha": "Chingai",
    "grt": "Chingai"
  },
  "Chowkham": {
    "en": "Chowkham",
    "hi": "Chowkham",
    "bn": "Chowkham",
    "as": "Chowkham",
    "ne": "Chowkham",
    "mni": "Chowkham",
    "lus": "Chowkham",
    "kha": "Chowkham",
    "grt": "Chowkham"
  },
  "Chozuba": {
    "en": "Chozuba",
    "hi": "Chozuba",
    "bn": "Chozuba",
    "as": "Chozuba",
    "ne": "Chozuba",
    "mni": "Chozuba",
    "lus": "Chozuba",
    "kha": "Chozuba",
    "grt": "Chozuba"
  },
  "Chumoukedima": {
    "en": "Chumoukedima",
    "hi": "Chumoukedima",
    "bn": "Chumoukedima",
    "as": "Chumoukedima",
    "ne": "Chumoukedima",
    "mni": "Chumoukedima",
    "lus": "Chumoukedima",
    "kha": "Chumoukedima",
    "grt": "Chumoukedima"
  },
  "Chumukedima": {
    "en": "Chumukedima",
    "hi": "Chumukedima",
    "bn": "Chumukedima",
    "as": "Chumukedima",
    "ne": "Chumukedima",
    "mni": "Chumukedima",
    "lus": "Chumukedima",
    "kha": "Chumukedima",
    "grt": "Chumukedima"
  },
  "Churachandpur": {
    "en": "Churachandpur",
    "hi": "चुराचांदपुर",
    "bn": "চূড়াচাঁদপুর",
    "as": "চুৰাচান্দপুৰ",
    "ne": "चुराचान्दपुर",
    "mni": "চূড়াচান্দপুর",
    "lus": "Churachandpur",
    "kha": "Churachandpur",
    "grt": "Churachandpur"
  },
  "Dalu": {
    "en": "Dalu",
    "hi": "Dalu",
    "bn": "Dalu",
    "as": "Dalu",
    "ne": "Dalu",
    "mni": "Dalu",
    "lus": "Dalu",
    "kha": "Dalu",
    "grt": "Dalu"
  },
  "Dambuk": {
    "en": "Dambuk",
    "hi": "Dambuk",
    "bn": "Dambuk",
    "as": "Dambuk",
    "ne": "Dambuk",
    "mni": "Dambuk",
    "lus": "Dambuk",
    "kha": "Dambuk",
    "grt": "Dambuk"
  },
  "Daporijo": {
    "en": "Daporijo",
    "hi": "Daporijo",
    "bn": "Daporijo",
    "as": "Daporijo",
    "ne": "Daporijo",
    "mni": "Daporijo",
    "lus": "Daporijo",
    "kha": "Daporijo",
    "grt": "Daporijo"
  },
  "Daramdin": {
    "en": "Daramdin",
    "hi": "Daramdin",
    "bn": "Daramdin",
    "as": "Daramdin",
    "ne": "Daramdin",
    "mni": "Daramdin",
    "lus": "Daramdin",
    "kha": "Daramdin",
    "grt": "Daramdin"
  },
  "Daring": {
    "en": "Daring",
    "hi": "Daring",
    "bn": "Daring",
    "as": "Daring",
    "ne": "Daring",
    "mni": "Daring",
    "lus": "Daring",
    "kha": "Daring",
    "grt": "Daring"
  },
  "Dawki": {
    "en": "Dawki",
    "hi": "Dawki",
    "bn": "Dawki",
    "as": "Dawki",
    "ne": "Dawki",
    "mni": "Dawki",
    "lus": "Dawki",
    "kha": "Dawki",
    "grt": "Dawki"
  },
  "Demow": {
    "en": "Demow",
    "hi": "Demow",
    "bn": "Demow",
    "as": "Demow",
    "ne": "Demow",
    "mni": "Demow",
    "lus": "Demow",
    "kha": "Demow",
    "grt": "Demow"
  },
  "Deomali": {
    "en": "Deomali",
    "hi": "Deomali",
    "bn": "Deomali",
    "as": "Deomali",
    "ne": "Deomali",
    "mni": "Deomali",
    "lus": "Deomali",
    "kha": "Deomali",
    "grt": "Deomali"
  },
  "Dergaon": {
    "en": "Dergaon",
    "hi": "Dergaon",
    "bn": "Dergaon",
    "as": "Dergaon",
    "ne": "Dergaon",
    "mni": "Dergaon",
    "lus": "Dergaon",
    "kha": "Dergaon",
    "grt": "Dergaon"
  },
  "Dhakuakhana": {
    "en": "Dhakuakhana",
    "hi": "Dhakuakhana",
    "bn": "Dhakuakhana",
    "as": "Dhakuakhana",
    "ne": "Dhakuakhana",
    "mni": "Dhakuakhana",
    "lus": "Dhakuakhana",
    "kha": "Dhakuakhana",
    "grt": "Dhakuakhana"
  },
  "Dharmanagar": {
    "en": "Dharmanagar",
    "hi": "धर्मनगर",
    "bn": "ধর্মনগর",
    "as": "ধৰ্মনগৰ",
    "ne": "धर्मनगर",
    "mni": "ধর্মনগর",
    "lus": "Dharmanagar",
    "kha": "Dharmanagar",
    "grt": "Dharmanagar"
  },
  "Dhekiajuli": {
    "en": "Dhekiajuli",
    "hi": "Dhekiajuli",
    "bn": "Dhekiajuli",
    "as": "Dhekiajuli",
    "ne": "Dhekiajuli",
    "mni": "Dhekiajuli",
    "lus": "Dhekiajuli",
    "kha": "Dhekiajuli",
    "grt": "Dhekiajuli"
  },
  "Dhemaji": {
    "en": "Dhemaji",
    "hi": "धेमाजी",
    "bn": "ধেমাজি",
    "as": "ধেমাজি",
    "ne": "धेमाजी",
    "mni": "ধেমাজি",
    "lus": "Dhemaji",
    "kha": "Dhemaji",
    "grt": "Dhemaji"
  },
  "Dhing": {
    "en": "Dhing",
    "hi": "Dhing",
    "bn": "Dhing",
    "as": "Dhing",
    "ne": "Dhing",
    "mni": "Dhing",
    "lus": "Dhing",
    "kha": "Dhing",
    "grt": "Dhing"
  },
  "Dholai": {
    "en": "Dholai",
    "hi": "Dholai",
    "bn": "Dholai",
    "as": "Dholai",
    "ne": "Dholai",
    "mni": "Dholai",
    "lus": "Dholai",
    "kha": "Dholai",
    "grt": "Dholai"
  },
  "Dhubri": {
    "en": "Dhubri",
    "hi": "धुबरी",
    "bn": "ধুবড়ী",
    "as": "ধুবুৰী",
    "ne": "धुबरी",
    "mni": "ধুবরী",
    "lus": "Dhubri",
    "kha": "Dhubri",
    "grt": "Dhubri"
  },
  "Dibrugarh": {
    "en": "Dibrugarh",
    "hi": "डिब्रूगढ़",
    "bn": "ডিব্রুগড়",
    "as": "ডিব্ৰুগড়",
    "ne": "डिब्रुगढ",
    "mni": "দিব্রুগড়",
    "lus": "Dibrugarh",
    "kha": "Dibrugarh",
    "grt": "Dibrugarh"
  },
  "Digboi": {
    "en": "Digboi",
    "hi": "Digboi",
    "bn": "Digboi",
    "as": "Digboi",
    "ne": "Digboi",
    "mni": "Digboi",
    "lus": "Digboi",
    "kha": "Digboi",
    "grt": "Digboi"
  },
  "Dimapur": {
    "en": "Dimapur",
    "hi": "दीमापुर",
    "bn": "ডিমাপুর",
    "as": "ডিমাপুৰ",
    "ne": "दिमापुर",
    "mni": "দিমাপুর",
    "lus": "Dimapur",
    "kha": "Dimapur",
    "grt": "Dimapur"
  },
  "Diphu": {
    "en": "Diphu",
    "hi": "दिफू",
    "bn": "দিফু",
    "as": "ডিফু",
    "ne": "दिफु",
    "mni": "দিফু",
    "lus": "Diphu",
    "kha": "Diphu",
    "grt": "Diphu"
  },
  "Dirang": {
    "en": "Dirang",
    "hi": "Dirang",
    "bn": "Dirang",
    "as": "Dirang",
    "ne": "Dirang",
    "mni": "Dirang",
    "lus": "Dirang",
    "kha": "Dirang",
    "grt": "Dirang"
  },
  "Dispur": {
    "en": "Dispur",
    "hi": "Dispur",
    "bn": "Dispur",
    "as": "Dispur",
    "ne": "Dispur",
    "mni": "Dispur",
    "lus": "Dispur",
    "kha": "Dispur",
    "grt": "Dispur"
  },
  "Doboka": {
    "en": "Doboka",
    "hi": "Doboka",
    "bn": "Doboka",
    "as": "Doboka",
    "ne": "Doboka",
    "mni": "Doboka",
    "lus": "Doboka",
    "kha": "Doboka",
    "grt": "Doboka"
  },
  "Doimukh": {
    "en": "Doimukh",
    "hi": "Doimukh",
    "bn": "Doimukh",
    "as": "Doimukh",
    "ne": "Doimukh",
    "mni": "Doimukh",
    "lus": "Doimukh",
    "kha": "Doimukh",
    "grt": "Doimukh"
  },
  "Dokmoka": {
    "en": "Dokmoka",
    "hi": "Dokmoka",
    "bn": "Dokmoka",
    "as": "Dokmoka",
    "ne": "Dokmoka",
    "mni": "Dokmoka",
    "lus": "Dokmoka",
    "kha": "Dokmoka",
    "grt": "Dokmoka"
  },
  "Dollungmukh": {
    "en": "Dollungmukh",
    "hi": "Dollungmukh",
    "bn": "Dollungmukh",
    "as": "Dollungmukh",
    "ne": "Dollungmukh",
    "mni": "Dollungmukh",
    "lus": "Dollungmukh",
    "kha": "Dollungmukh",
    "grt": "Dollungmukh"
  },
  "Doomdooma": {
    "en": "Doomdooma",
    "hi": "Doomdooma",
    "bn": "Doomdooma",
    "as": "Doomdooma",
    "ne": "Doomdooma",
    "mni": "Doomdooma",
    "lus": "Doomdooma",
    "kha": "Doomdooma",
    "grt": "Doomdooma"
  },
  "Dudhnoi": {
    "en": "Dudhnoi",
    "hi": "Dudhnoi",
    "bn": "Dudhnoi",
    "as": "Dudhnoi",
    "ne": "Dudhnoi",
    "mni": "Dudhnoi",
    "lus": "Dudhnoi",
    "kha": "Dudhnoi",
    "grt": "Dudhnoi"
  },
  "Dumporijo": {
    "en": "Dumporijo",
    "hi": "Dumporijo",
    "bn": "Dumporijo",
    "as": "Dumporijo",
    "ne": "Dumporijo",
    "mni": "Dumporijo",
    "lus": "Dumporijo",
    "kha": "Dumporijo",
    "grt": "Dumporijo"
  },
  "Durtlang": {
    "en": "Durtlang",
    "hi": "Durtlang",
    "bn": "Durtlang",
    "as": "Durtlang",
    "ne": "Durtlang",
    "mni": "Durtlang",
    "lus": "Durtlang",
    "kha": "Durtlang",
    "grt": "Durtlang"
  },
  "East Lungdar": {
    "en": "East Lungdar",
    "hi": "पूर्व Lungdar",
    "bn": "পূর্ব Lungdar",
    "as": "পূব Lungdar",
    "ne": "पूर्व Lungdar",
    "mni": "নোংপোক Lungdar",
    "lus": "Khawchhak Lungdar",
    "kha": "Mihngi Lungdar",
    "grt": "Salgro-Salgipeng Lungdar"
  },
  "East Sikkim (Gangtok)": {
    "en": "East Sikkim (Gangtok)",
    "hi": "पूर्व सिक्किम (Gangtok)",
    "bn": "পূর্ব সিকিম (Gangtok)",
    "as": "পূব ছিকিম (Gangtok)",
    "ne": "पूर्व सिक्किम (Gangtok)",
    "mni": "নোংপোক সিক্কিম (Gangtok)",
    "lus": "Khawchhak Sikkim (Gangtok)",
    "kha": "Mihngi Sikkim (Gangtok)",
    "grt": "Salgro-Salgipeng Sikkim (Gangtok)"
  },
  "Etalin": {
    "en": "Etalin",
    "hi": "Etalin",
    "bn": "Etalin",
    "as": "Etalin",
    "ne": "Etalin",
    "mni": "Etalin",
    "lus": "Etalin",
    "kha": "Etalin",
    "grt": "Etalin"
  },
  "Fakiragram": {
    "en": "Fakiragram",
    "hi": "Fakiragram",
    "bn": "Fakiragram",
    "as": "Fakiragram",
    "ne": "Fakiragram",
    "mni": "Fakiragram",
    "lus": "Fakiragram",
    "kha": "Fakiragram",
    "grt": "Fakiragram"
  },
  "Gandacherra": {
    "en": "Gandacherra",
    "hi": "Gandacherra",
    "bn": "Gandacherra",
    "as": "Gandacherra",
    "ne": "Gandacherra",
    "mni": "Gandacherra",
    "lus": "Gandacherra",
    "kha": "Gandacherra",
    "grt": "Gandacherra"
  },
  "Gangtok": {
    "en": "Gangtok",
    "hi": "गैंगटॉक",
    "bn": "গ্যাংটক",
    "as": "গেংটক",
    "ne": "गान्तोक",
    "mni": "গেংতোক",
    "lus": "Gangtok",
    "kha": "Gangtok",
    "grt": "Gangtok"
  },
  "Garamur": {
    "en": "Garamur",
    "hi": "Garamur",
    "bn": "Garamur",
    "as": "Garamur",
    "ne": "Garamur",
    "mni": "Garamur",
    "lus": "Garamur",
    "kha": "Garamur",
    "grt": "Garamur"
  },
  "Gasuapara": {
    "en": "Gasuapara",
    "hi": "Gasuapara",
    "bn": "Gasuapara",
    "as": "Gasuapara",
    "ne": "Gasuapara",
    "mni": "Gasuapara",
    "lus": "Gasuapara",
    "kha": "Gasuapara",
    "grt": "Gasuapara"
  },
  "Gauripur": {
    "en": "Gauripur",
    "hi": "Gauripur",
    "bn": "Gauripur",
    "as": "Gauripur",
    "ne": "Gauripur",
    "mni": "Gauripur",
    "lus": "Gauripur",
    "kha": "Gauripur",
    "grt": "Gauripur"
  },
  "Geku": {
    "en": "Geku",
    "hi": "Geku",
    "bn": "Geku",
    "as": "Geku",
    "ne": "Geku",
    "mni": "Geku",
    "lus": "Geku",
    "kha": "Geku",
    "grt": "Geku"
  },
  "Goalpara": {
    "en": "Goalpara",
    "hi": "गोलपारा",
    "bn": "গোয়ালপাড়া",
    "as": "গোৱালপাৰা",
    "ne": "गोलपारा",
    "mni": "গোয়ালপাড়া",
    "lus": "Goalpara",
    "kha": "Goalpara",
    "grt": "Goalpara"
  },
  "Gogamukh": {
    "en": "Gogamukh",
    "hi": "Gogamukh",
    "bn": "Gogamukh",
    "as": "Gogamukh",
    "ne": "Gogamukh",
    "mni": "Gogamukh",
    "lus": "Gogamukh",
    "kha": "Gogamukh",
    "grt": "Gogamukh"
  },
  "Gohpur": {
    "en": "Gohpur",
    "hi": "Gohpur",
    "bn": "Gohpur",
    "as": "Gohpur",
    "ne": "Gohpur",
    "mni": "Gohpur",
    "lus": "Gohpur",
    "kha": "Gohpur",
    "grt": "Gohpur"
  },
  "Golaghat": {
    "en": "Golaghat",
    "hi": "गोलाघाट",
    "bn": "গোলাঘাট",
    "as": "গোলাঘাট",
    "ne": "गोलाघाट",
    "mni": "গোলাঘাট",
    "lus": "Golaghat",
    "kha": "Golaghat",
    "grt": "Golaghat"
  },
  "Golakganj": {
    "en": "Golakganj",
    "hi": "Golakganj",
    "bn": "Golakganj",
    "as": "Golakganj",
    "ne": "Golakganj",
    "mni": "Golakganj",
    "lus": "Golakganj",
    "kha": "Golakganj",
    "grt": "Golakganj"
  },
  "Gossaigaon": {
    "en": "Gossaigaon",
    "hi": "Gossaigaon",
    "bn": "Gossaigaon",
    "as": "Gossaigaon",
    "ne": "Gossaigaon",
    "mni": "Gossaigaon",
    "lus": "Gossaigaon",
    "kha": "Gossaigaon",
    "grt": "Gossaigaon"
  },
  "Gularthol": {
    "en": "Gularthol",
    "hi": "Gularthol",
    "bn": "Gularthol",
    "as": "Gularthol",
    "ne": "Gularthol",
    "mni": "Gularthol",
    "lus": "Gularthol",
    "kha": "Gularthol",
    "grt": "Gularthol"
  },
  "Guwahati": {
    "en": "Guwahati",
    "hi": "गुवाहाटी",
    "bn": "গুয়াহাটি",
    "as": "গুৱাহাটী",
    "ne": "गुवाहाटी",
    "mni": "গুৱাহাটি",
    "lus": "Guwahati",
    "kha": "Guwahati",
    "grt": "Guwahati"
  },
  "Gyalshing (West Sikkim)": {
    "en": "Gyalshing (West Sikkim)",
    "hi": "Gyalshing (West Sikkim)",
    "bn": "Gyalshing (West Sikkim)",
    "as": "Gyalshing (West Sikkim)",
    "ne": "Gyalshing (West Sikkim)",
    "mni": "Gyalshing (West Sikkim)",
    "lus": "Gyalshing (West Sikkim)",
    "kha": "Gyalshing (West Sikkim)",
    "grt": "Gyalshing (West Sikkim)"
  },
  "Haflong": {
    "en": "Haflong",
    "hi": "हाफलोंग",
    "bn": "হাফলং",
    "as": "হাফলং",
    "ne": "हाफलोङ",
    "mni": "হাফলোং",
    "lus": "Haflong",
    "kha": "Haflong",
    "grt": "Haflong"
  },
  "Hailakandi": {
    "en": "Hailakandi",
    "hi": "हैलाकांडी",
    "bn": "হাইলাকান্দি",
    "as": "হাইলাকান্দি",
    "ne": "हैलाकान्डी",
    "mni": "হাইলাকান্দি",
    "lus": "Hailakandi",
    "kha": "Hailakandi",
    "grt": "Hailakandi"
  },
  "Hajo": {
    "en": "Hajo",
    "hi": "Hajo",
    "bn": "Hajo",
    "as": "Hajo",
    "ne": "Hajo",
    "mni": "Hajo",
    "lus": "Hajo",
    "kha": "Hajo",
    "grt": "Hajo"
  },
  "Hamren": {
    "en": "Hamren",
    "hi": "Hamren",
    "bn": "Hamren",
    "as": "Hamren",
    "ne": "Hamren",
    "mni": "Hamren",
    "lus": "Hamren",
    "kha": "Hamren",
    "grt": "Hamren"
  },
  "Haochong": {
    "en": "Haochong",
    "hi": "Haochong",
    "bn": "Haochong",
    "as": "Haochong",
    "ne": "Haochong",
    "mni": "Haochong",
    "lus": "Haochong",
    "kha": "Haochong",
    "grt": "Haochong"
  },
  "Hapoli": {
    "en": "Hapoli",
    "hi": "Hapoli",
    "bn": "Hapoli",
    "as": "Hapoli",
    "ne": "Hapoli",
    "mni": "Hapoli",
    "lus": "Hapoli",
    "kha": "Hapoli",
    "grt": "Hapoli"
  },
  "Harangajao": {
    "en": "Harangajao",
    "hi": "Harangajao",
    "bn": "Harangajao",
    "as": "Harangajao",
    "ne": "Harangajao",
    "mni": "Harangajao",
    "lus": "Harangajao",
    "kha": "Harangajao",
    "grt": "Harangajao"
  },
  "Hatsingimari": {
    "en": "Hatsingimari",
    "hi": "Hatsingimari",
    "bn": "Hatsingimari",
    "as": "Hatsingimari",
    "ne": "Hatsingimari",
    "mni": "Hatsingimari",
    "lus": "Hatsingimari",
    "kha": "Hatsingimari",
    "grt": "Hatsingimari"
  },
  "Hawai": {
    "en": "Hawai",
    "hi": "Hawai",
    "bn": "Hawai",
    "as": "Hawai",
    "ne": "Hawai",
    "mni": "Hawai",
    "lus": "Hawai",
    "kha": "Hawai",
    "grt": "Hawai"
  },
  "Hayuliang": {
    "en": "Hayuliang",
    "hi": "Hayuliang",
    "bn": "Hayuliang",
    "as": "Hayuliang",
    "ne": "Hayuliang",
    "mni": "Hayuliang",
    "lus": "Hayuliang",
    "kha": "Hayuliang",
    "grt": "Hayuliang"
  },
  "Helem": {
    "en": "Helem",
    "hi": "Helem",
    "bn": "Helem",
    "as": "Helem",
    "ne": "Helem",
    "mni": "Helem",
    "lus": "Helem",
    "kha": "Helem",
    "grt": "Helem"
  },
  "Henglep": {
    "en": "Henglep",
    "hi": "Henglep",
    "bn": "Henglep",
    "as": "Henglep",
    "ne": "Henglep",
    "mni": "Henglep",
    "lus": "Henglep",
    "kha": "Henglep",
    "grt": "Henglep"
  },
  "Hnahthial": {
    "en": "Hnahthial",
    "hi": "ह्नाहथियाल",
    "bn": "হ্নাহথিয়াল",
    "as": "হ্নাহথিয়াল",
    "ne": "ह्नाहथियाल",
    "mni": "হ্নাহথিয়াল",
    "lus": "Hnahthial",
    "kha": "Hnahthial",
    "grt": "Hnahthial"
  },
  "Hojai": {
    "en": "Hojai",
    "hi": "होजाई",
    "bn": "হোজাই",
    "as": "হোজাই",
    "ne": "होजाई",
    "mni": "হোজাই",
    "lus": "Hojai",
    "kha": "Hojai",
    "grt": "Hojai"
  },
  "Howly": {
    "en": "Howly",
    "hi": "Howly",
    "bn": "Howly",
    "as": "Howly",
    "ne": "Howly",
    "mni": "Howly",
    "lus": "Howly",
    "kha": "Howly",
    "grt": "Howly"
  },
  "Howraghat": {
    "en": "Howraghat",
    "hi": "Howraghat",
    "bn": "Howraghat",
    "as": "Howraghat",
    "ne": "Howraghat",
    "mni": "Howraghat",
    "lus": "Howraghat",
    "kha": "Howraghat",
    "grt": "Howraghat"
  },
  "Imphal": {
    "en": "Imphal",
    "hi": "इम्फाल",
    "bn": "ইম্ফল",
    "as": "ইম্ফল",
    "ne": "इम्फाल",
    "mni": "ইম্ফাল",
    "lus": "Imphal",
    "kha": "Imphal",
    "grt": "Imphal"
  },
  "Itanagar": {
    "en": "Itanagar",
    "hi": "ईटानगर",
    "bn": "ইটানগর",
    "as": "ইটানগৰ",
    "ne": "इटानगर",
    "mni": "ইটানগর",
    "lus": "Itanagar",
    "kha": "Itanagar",
    "grt": "Itanagar"
  },
  "Itanagar Capital Complex": {
    "en": "Itanagar Capital Complex",
    "hi": "Itanagar Capital Complex",
    "bn": "Itanagar Capital Complex",
    "as": "Itanagar Capital Complex",
    "ne": "Itanagar Capital Complex",
    "mni": "Itanagar Capital Complex",
    "lus": "Itanagar Capital Complex",
    "kha": "Itanagar Capital Complex",
    "grt": "Itanagar Capital Complex"
  },
  "Jagiroad": {
    "en": "Jagiroad",
    "hi": "Jagiroad",
    "bn": "Jagiroad",
    "as": "Jagiroad",
    "ne": "Jagiroad",
    "mni": "Jagiroad",
    "lus": "Jagiroad",
    "kha": "Jagiroad",
    "grt": "Jagiroad"
  },
  "Jairampur": {
    "en": "Jairampur",
    "hi": "Jairampur",
    "bn": "Jairampur",
    "as": "Jairampur",
    "ne": "Jairampur",
    "mni": "Jairampur",
    "lus": "Jairampur",
    "kha": "Jairampur",
    "grt": "Jairampur"
  },
  "Jakhama": {
    "en": "Jakhama",
    "hi": "Jakhama",
    "bn": "Jakhama",
    "as": "Jakhama",
    "ne": "Jakhama",
    "mni": "Jakhama",
    "lus": "Jakhama",
    "kha": "Jakhama",
    "grt": "Jakhama"
  },
  "Jalukbari": {
    "en": "Jalukbari",
    "hi": "Jalukbari",
    "bn": "Jalukbari",
    "as": "Jalukbari",
    "ne": "Jalukbari",
    "mni": "Jalukbari",
    "lus": "Jalukbari",
    "kha": "Jalukbari",
    "grt": "Jalukbari"
  },
  "Jalukie": {
    "en": "Jalukie",
    "hi": "Jalukie",
    "bn": "Jalukie",
    "as": "Jalukie",
    "ne": "Jalukie",
    "mni": "Jalukie",
    "lus": "Jalukie",
    "kha": "Jalukie",
    "grt": "Jalukie"
  },
  "Jamin": {
    "en": "Jamin",
    "hi": "Jamin",
    "bn": "Jamin",
    "as": "Jamin",
    "ne": "Jamin",
    "mni": "Jamin",
    "lus": "Jamin",
    "kha": "Jamin",
    "grt": "Jamin"
  },
  "Jamugurihat": {
    "en": "Jamugurihat",
    "hi": "Jamugurihat",
    "bn": "Jamugurihat",
    "as": "Jamugurihat",
    "ne": "Jamugurihat",
    "mni": "Jamugurihat",
    "lus": "Jamugurihat",
    "kha": "Jamugurihat",
    "grt": "Jamugurihat"
  },
  "Jang": {
    "en": "Jang",
    "hi": "Jang",
    "bn": "Jang",
    "as": "Jang",
    "ne": "Jang",
    "mni": "Jang",
    "lus": "Jang",
    "kha": "Jang",
    "grt": "Jang"
  },
  "Japuijala": {
    "en": "Japuijala",
    "hi": "Japuijala",
    "bn": "Japuijala",
    "as": "Japuijala",
    "ne": "Japuijala",
    "mni": "Japuijala",
    "lus": "Japuijala",
    "kha": "Japuijala",
    "grt": "Japuijala"
  },
  "Jatinga": {
    "en": "Jatinga",
    "hi": "Jatinga",
    "bn": "Jatinga",
    "as": "Jatinga",
    "ne": "Jatinga",
    "mni": "Jatinga",
    "lus": "Jatinga",
    "kha": "Jatinga",
    "grt": "Jatinga"
  },
  "Jengraimukh": {
    "en": "Jengraimukh",
    "hi": "Jengraimukh",
    "bn": "Jengraimukh",
    "as": "Jengraimukh",
    "ne": "Jengraimukh",
    "mni": "Jengraimukh",
    "lus": "Jengraimukh",
    "kha": "Jengraimukh",
    "grt": "Jengraimukh"
  },
  "Jessami": {
    "en": "Jessami",
    "hi": "Jessami",
    "bn": "Jessami",
    "as": "Jessami",
    "ne": "Jessami",
    "mni": "Jessami",
    "lus": "Jessami",
    "kha": "Jessami",
    "grt": "Jessami"
  },
  "Jirania": {
    "en": "Jirania",
    "hi": "Jirania",
    "bn": "Jirania",
    "as": "Jirania",
    "ne": "Jirania",
    "mni": "Jirania",
    "lus": "Jirania",
    "kha": "Jirania",
    "grt": "Jirania"
  },
  "Jiribam": {
    "en": "Jiribam",
    "hi": "जिरीबाम",
    "bn": "জিরিবাম",
    "as": "জিৰিবাম",
    "ne": "जिरीबाम",
    "mni": "জিরিবাম",
    "lus": "Jiribam",
    "kha": "Jiribam",
    "grt": "Jiribam"
  },
  "Jonai": {
    "en": "Jonai",
    "hi": "Jonai",
    "bn": "Jonai",
    "as": "Jonai",
    "ne": "Jonai",
    "mni": "Jonai",
    "lus": "Jonai",
    "kha": "Jonai",
    "grt": "Jonai"
  },
  "Jorhat": {
    "en": "Jorhat",
    "hi": "जोरहाट",
    "bn": "জোরহাট",
    "as": "যোৰহাট",
    "ne": "जोरहाट",
    "mni": "জোরহাত",
    "lus": "Jorhat",
    "kha": "Jorhat",
    "grt": "Jorhat"
  },
  "Jowai": {
    "en": "Jowai",
    "hi": "जोवाई",
    "bn": "জোয়াই",
    "as": "যোৱাই",
    "ne": "जोवाई",
    "mni": "জোৱাই",
    "lus": "Jowai",
    "kha": "Jowai",
    "grt": "Jowai"
  },
  "Kailashahar": {
    "en": "Kailashahar",
    "hi": "कैलाशहर",
    "bn": "কৈলাসহর",
    "as": "কৈলাসহৰ",
    "ne": "कैलाशहर",
    "mni": "কৈলাসহর",
    "lus": "Kailashahar",
    "kha": "Kailashahar",
    "grt": "Kailashahar"
  },
  "Kajalgon": {
    "en": "Kajalgon",
    "hi": "Kajalgon",
    "bn": "Kajalgon",
    "as": "Kajalgon",
    "ne": "Kajalgon",
    "mni": "Kajalgon",
    "lus": "Kajalgon",
    "kha": "Kajalgon",
    "grt": "Kajalgon"
  },
  "Kakching": {
    "en": "Kakching",
    "hi": "काकचिंग",
    "bn": "কাকচিং",
    "as": "কাকচিং",
    "ne": "काकचिङ",
    "mni": "কাকচিং",
    "lus": "Kakching",
    "kha": "Kakching",
    "grt": "Kakching"
  },
  "Kakching Khunou": {
    "en": "Kakching Khunou",
    "hi": "Kakching Khunou",
    "bn": "Kakching Khunou",
    "as": "Kakching Khunou",
    "ne": "Kakching Khunou",
    "mni": "Kakching Khunou",
    "lus": "Kakching Khunou",
    "kha": "Kakching Khunou",
    "grt": "Kakching Khunou"
  },
  "Kaliabor": {
    "en": "Kaliabor",
    "hi": "Kaliabor",
    "bn": "Kaliabor",
    "as": "Kaliabor",
    "ne": "Kaliabor",
    "mni": "Kaliabor",
    "lus": "Kaliabor",
    "kha": "Kaliabor",
    "grt": "Kaliabor"
  },
  "Kamalabari": {
    "en": "Kamalabari",
    "hi": "Kamalabari",
    "bn": "Kamalabari",
    "as": "Kamalabari",
    "ne": "Kamalabari",
    "mni": "Kamalabari",
    "lus": "Kamalabari",
    "kha": "Kamalabari",
    "grt": "Kamalabari"
  },
  "Kamalpur": {
    "en": "Kamalpur",
    "hi": "Kamalpur",
    "bn": "Kamalpur",
    "as": "Kamalpur",
    "ne": "Kamalpur",
    "mni": "Kamalpur",
    "lus": "Kamalpur",
    "kha": "Kamalpur",
    "grt": "Kamalpur"
  },
  "Kamjong": {
    "en": "Kamjong",
    "hi": "कामजोंग",
    "bn": "কামজং",
    "as": "কামজং",
    "ne": "कामजोङ",
    "mni": "কামজোং",
    "lus": "Kamjong",
    "kha": "Kamjong",
    "grt": "Kamjong"
  },
  "Kanchanpur": {
    "en": "Kanchanpur",
    "hi": "Kanchanpur",
    "bn": "Kanchanpur",
    "as": "Kanchanpur",
    "ne": "Kanchanpur",
    "mni": "Kanchanpur",
    "lus": "Kanchanpur",
    "kha": "Kanchanpur",
    "grt": "Kanchanpur"
  },
  "Kangpokpi": {
    "en": "Kangpokpi",
    "hi": "कांगपोकपी",
    "bn": "কাংপোকপি",
    "as": "কাংপোকপী",
    "ne": "काङपोकपी",
    "mni": "কাংপোকপি",
    "lus": "Kangpokpi",
    "kha": "Kangpokpi",
    "grt": "Kangpokpi"
  },
  "Kanubari": {
    "en": "Kanubari",
    "hi": "Kanubari",
    "bn": "Kanubari",
    "as": "Kanubari",
    "ne": "Kanubari",
    "mni": "Kanubari",
    "lus": "Kanubari",
    "kha": "Kanubari",
    "grt": "Kanubari"
  },
  "Karbook": {
    "en": "Karbook",
    "hi": "Karbook",
    "bn": "Karbook",
    "as": "Karbook",
    "ne": "Karbook",
    "mni": "Karbook",
    "lus": "Karbook",
    "kha": "Karbook",
    "grt": "Karbook"
  },
  "Karimganj": {
    "en": "Karimganj",
    "hi": "करीमगंज",
    "bn": "করিমগঞ্জ",
    "as": "কৰিমগঞ্জ",
    "ne": "करिमगञ्ज",
    "mni": "করিমগঞ্জ",
    "lus": "Karimganj",
    "kha": "Karimganj",
    "grt": "Karimganj"
  },
  "Kasom Khullen": {
    "en": "Kasom Khullen",
    "hi": "Kasom Khullen",
    "bn": "Kasom Khullen",
    "as": "Kasom Khullen",
    "ne": "Kasom Khullen",
    "mni": "Kasom Khullen",
    "lus": "Kasom Khullen",
    "kha": "Kasom Khullen",
    "grt": "Kasom Khullen"
  },
  "Katlicherra": {
    "en": "Katlicherra",
    "hi": "Katlicherra",
    "bn": "Katlicherra",
    "as": "Katlicherra",
    "ne": "Katlicherra",
    "mni": "Katlicherra",
    "lus": "Katlicherra",
    "kha": "Katlicherra",
    "grt": "Katlicherra"
  },
  "Kaying": {
    "en": "Kaying",
    "hi": "Kaying",
    "bn": "Kaying",
    "as": "Kaying",
    "ne": "Kaying",
    "mni": "Kaying",
    "lus": "Kaying",
    "kha": "Kaying",
    "grt": "Kaying"
  },
  "Keithelmanbi": {
    "en": "Keithelmanbi",
    "hi": "Keithelmanbi",
    "bn": "Keithelmanbi",
    "as": "Keithelmanbi",
    "ne": "Keithelmanbi",
    "mni": "Keithelmanbi",
    "lus": "Keithelmanbi",
    "kha": "Keithelmanbi",
    "grt": "Keithelmanbi"
  },
  "Kharupetia": {
    "en": "Kharupetia",
    "hi": "Kharupetia",
    "bn": "Kharupetia",
    "as": "Kharupetia",
    "ne": "Kharupetia",
    "mni": "Kharupetia",
    "lus": "Kharupetia",
    "kha": "Kharupetia",
    "grt": "Kharupetia"
  },
  "Khatla": {
    "en": "Khatla",
    "hi": "Khatla",
    "bn": "Khatla",
    "as": "Khatla",
    "ne": "Khatla",
    "mni": "Khatla",
    "lus": "Khatla",
    "kha": "Khatla",
    "grt": "Khatla"
  },
  "Khawbung": {
    "en": "Khawbung",
    "hi": "Khawbung",
    "bn": "Khawbung",
    "as": "Khawbung",
    "ne": "Khawbung",
    "mni": "Khawbung",
    "lus": "Khawbung",
    "kha": "Khawbung",
    "grt": "Khawbung"
  },
  "Khawzawl": {
    "en": "Khawzawl",
    "hi": "खौजॉल",
    "bn": "খৌজাওল",
    "as": "খৌজাওল",
    "ne": "खौजोल",
    "mni": "খৌজোল",
    "lus": "Khawzawl",
    "kha": "Khawzawl",
    "grt": "Khawzawl"
  },
  "Kheroni": {
    "en": "Kheroni",
    "hi": "Kheroni",
    "bn": "Kheroni",
    "as": "Kheroni",
    "ne": "Kheroni",
    "mni": "Kheroni",
    "lus": "Kheroni",
    "kha": "Kheroni",
    "grt": "Kheroni"
  },
  "Khliehriat": {
    "en": "Khliehriat",
    "hi": "Khliehriat",
    "bn": "Khliehriat",
    "as": "Khliehriat",
    "ne": "Khliehriat",
    "mni": "Khliehriat",
    "lus": "Khliehriat",
    "kha": "Khliehriat",
    "grt": "Khliehriat"
  },
  "Khongsang": {
    "en": "Khongsang",
    "hi": "Khongsang",
    "bn": "Khongsang",
    "as": "Khongsang",
    "ne": "Khongsang",
    "mni": "Khongsang",
    "lus": "Khongsang",
    "kha": "Khongsang",
    "grt": "Khongsang"
  },
  "Khonsa": {
    "en": "Khonsa",
    "hi": "Khonsa",
    "bn": "Khonsa",
    "as": "Khonsa",
    "ne": "Khonsa",
    "mni": "Khonsa",
    "lus": "Khonsa",
    "kha": "Khonsa",
    "grt": "Khonsa"
  },
  "Khowai": {
    "en": "Khowai",
    "hi": "खोवाई",
    "bn": "খোয়াই",
    "as": "খোৱাই",
    "ne": "खोवाई",
    "mni": "খোৱাই",
    "lus": "Khowai",
    "kha": "Khowai",
    "grt": "Khowai"
  },
  "Kibithu": {
    "en": "Kibithu",
    "hi": "Kibithu",
    "bn": "Kibithu",
    "as": "Kibithu",
    "ne": "Kibithu",
    "mni": "Kibithu",
    "lus": "Kibithu",
    "kha": "Kibithu",
    "grt": "Kibithu"
  },
  "Kiphire": {
    "en": "Kiphire",
    "hi": "किफिरे",
    "bn": "কিফিরে",
    "as": "কিফিৰে",
    "ne": "किफिरे",
    "mni": "কিফিরে",
    "lus": "Kiphire",
    "kha": "Kiphire",
    "grt": "Kiphire"
  },
  "Kisama": {
    "en": "Kisama",
    "hi": "Kisama",
    "bn": "Kisama",
    "as": "Kisama",
    "ne": "Kisama",
    "mni": "Kisama",
    "lus": "Kisama",
    "kha": "Kisama",
    "grt": "Kisama"
  },
  "Kohima": {
    "en": "Kohima",
    "hi": "कोहिमा",
    "bn": "কোহিমা",
    "as": "কহিমা",
    "ne": "कोहिमा",
    "mni": "কোহিমা",
    "lus": "Kohima",
    "kha": "Kohima",
    "grt": "Kohima"
  },
  "Kokrajhar": {
    "en": "Kokrajhar",
    "hi": "कोकराझार",
    "bn": "কোকড়াঝাড়",
    "as": "কোকৰাঝাৰ",
    "ne": "कोक्राझार",
    "mni": "কোকরাঝার",
    "lus": "Kokrajhar",
    "kha": "Kokrajhar",
    "grt": "Kokrajhar"
  },
  "Kolasib": {
    "en": "Kolasib",
    "hi": "कोलासिब",
    "bn": "কোলাসিব",
    "as": "কোলাছিব",
    "ne": "कोलासिब",
    "mni": "কোলাসিব",
    "lus": "Kolasib",
    "kha": "Kolasib",
    "grt": "Kolasib"
  },
  "Koloriang": {
    "en": "Koloriang",
    "hi": "Koloriang",
    "bn": "Koloriang",
    "as": "Koloriang",
    "ne": "Koloriang",
    "mni": "Koloriang",
    "lus": "Koloriang",
    "kha": "Koloriang",
    "grt": "Koloriang"
  },
  "Kora": {
    "en": "Kora",
    "hi": "Kora",
    "bn": "Kora",
    "as": "Kora",
    "ne": "Kora",
    "mni": "Kora",
    "lus": "Kora",
    "kha": "Kora",
    "grt": "Kora"
  },
  "Kumarghat": {
    "en": "Kumarghat",
    "hi": "Kumarghat",
    "bn": "Kumarghat",
    "as": "Kumarghat",
    "ne": "Kumarghat",
    "mni": "Kumarghat",
    "lus": "Kumarghat",
    "kha": "Kumarghat",
    "grt": "Kumarghat"
  },
  "Kumarikata": {
    "en": "Kumarikata",
    "hi": "Kumarikata",
    "bn": "Kumarikata",
    "as": "Kumarikata",
    "ne": "Kumarikata",
    "mni": "Kumarikata",
    "lus": "Kumarikata",
    "kha": "Kumarikata",
    "grt": "Kumarikata"
  },
  "Kynshi": {
    "en": "Kynshi",
    "hi": "Kynshi",
    "bn": "Kynshi",
    "as": "Kynshi",
    "ne": "Kynshi",
    "mni": "Kynshi",
    "lus": "Kynshi",
    "kha": "Kynshi",
    "grt": "Kynshi"
  },
  "Lad Rymbai": {
    "en": "Lad Rymbai",
    "hi": "Lad Rymbai",
    "bn": "Lad Rymbai",
    "as": "Lad Rymbai",
    "ne": "Lad Rymbai",
    "mni": "Lad Rymbai",
    "lus": "Lad Rymbai",
    "kha": "Lad Rymbai",
    "grt": "Lad Rymbai"
  },
  "Laitumkhrah": {
    "en": "Laitumkhrah",
    "hi": "Laitumkhrah",
    "bn": "Laitumkhrah",
    "as": "Laitumkhrah",
    "ne": "Laitumkhrah",
    "mni": "Laitumkhrah",
    "lus": "Laitumkhrah",
    "kha": "Laitumkhrah",
    "grt": "Laitumkhrah"
  },
  "Lakhipur": {
    "en": "Lakhipur",
    "hi": "Lakhipur",
    "bn": "Lakhipur",
    "as": "Lakhipur",
    "ne": "Lakhipur",
    "mni": "Lakhipur",
    "lus": "Lakhipur",
    "kha": "Lakhipur",
    "grt": "Lakhipur"
  },
  "Lala": {
    "en": "Lala",
    "hi": "Lala",
    "bn": "Lala",
    "as": "Lala",
    "ne": "Lala",
    "mni": "Lala",
    "lus": "Lala",
    "kha": "Lala",
    "grt": "Lala"
  },
  "Lamka": {
    "en": "Lamka",
    "hi": "Lamka",
    "bn": "Lamka",
    "as": "Lamka",
    "ne": "Lamka",
    "mni": "Lamka",
    "lus": "Lamka",
    "kha": "Lamka",
    "grt": "Lamka"
  },
  "Lamlai": {
    "en": "Lamlai",
    "hi": "Lamlai",
    "bn": "Lamlai",
    "as": "Lamlai",
    "ne": "Lamlai",
    "mni": "Lamlai",
    "lus": "Lamlai",
    "kha": "Lamlai",
    "grt": "Lamlai"
  },
  "Lamphelpat": {
    "en": "Lamphelpat",
    "hi": "Lamphelpat",
    "bn": "Lamphelpat",
    "as": "Lamphelpat",
    "ne": "Lamphelpat",
    "mni": "Lamphelpat",
    "lus": "Lamphelpat",
    "kha": "Lamphelpat",
    "grt": "Lamphelpat"
  },
  "Lamsang": {
    "en": "Lamsang",
    "hi": "Lamsang",
    "bn": "Lamsang",
    "as": "Lamsang",
    "ne": "Lamsang",
    "mni": "Lamsang",
    "lus": "Lamsang",
    "kha": "Lamsang",
    "grt": "Lamsang"
  },
  "Lanka": {
    "en": "Lanka",
    "hi": "Lanka",
    "bn": "Lanka",
    "as": "Lanka",
    "ne": "Lanka",
    "mni": "Lanka",
    "lus": "Lanka",
    "kha": "Lanka",
    "grt": "Lanka"
  },
  "Lawngtlai": {
    "en": "Lawngtlai",
    "hi": "लॉन्गत्लाई",
    "bn": "লংৎলাই",
    "as": "লংত্লাই",
    "ne": "लङत्लाई",
    "mni": "লংৎলাই",
    "lus": "Lawngtlai",
    "kha": "Lawngtlai",
    "grt": "Lawngtlai"
  },
  "Ledo": {
    "en": "Ledo",
    "hi": "Ledo",
    "bn": "Ledo",
    "as": "Ledo",
    "ne": "Ledo",
    "mni": "Ledo",
    "lus": "Ledo",
    "kha": "Ledo",
    "grt": "Ledo"
  },
  "Lemmi": {
    "en": "Lemmi",
    "hi": "Lemmi",
    "bn": "Lemmi",
    "as": "Lemmi",
    "ne": "Lemmi",
    "mni": "Lemmi",
    "lus": "Lemmi",
    "kha": "Lemmi",
    "grt": "Lemmi"
  },
  "Likabali": {
    "en": "Likabali",
    "hi": "Likabali",
    "bn": "Likabali",
    "as": "Likabali",
    "ne": "Likabali",
    "mni": "Likabali",
    "lus": "Likabali",
    "kha": "Likabali",
    "grt": "Likabali"
  },
  "Lilong": {
    "en": "Lilong",
    "hi": "Lilong",
    "bn": "Lilong",
    "as": "Lilong",
    "ne": "Lilong",
    "mni": "Lilong",
    "lus": "Lilong",
    "kha": "Lilong",
    "grt": "Lilong"
  },
  "Loktak": {
    "en": "Loktak",
    "hi": "Loktak",
    "bn": "Loktak",
    "as": "Loktak",
    "ne": "Loktak",
    "mni": "Loktak",
    "lus": "Loktak",
    "kha": "Loktak",
    "grt": "Loktak"
  },
  "Longding": {
    "en": "Longding",
    "hi": "लोंगडिंग",
    "bn": "লংডিং",
    "as": "লংডিং",
    "ne": "लोङडिङ",
    "mni": "লোংদিং",
    "lus": "Longding",
    "kha": "Longding",
    "grt": "Longding"
  },
  "Longkhim": {
    "en": "Longkhim",
    "hi": "Longkhim",
    "bn": "Longkhim",
    "as": "Longkhim",
    "ne": "Longkhim",
    "mni": "Longkhim",
    "lus": "Longkhim",
    "kha": "Longkhim",
    "grt": "Longkhim"
  },
  "Longleng": {
    "en": "Longleng",
    "hi": "लोंगलेंग",
    "bn": "লংলেং",
    "as": "লংলেং",
    "ne": "लोङ्लेङ",
    "mni": "লোংলেং",
    "lus": "Longleng",
    "kha": "Longleng",
    "grt": "Longleng"
  },
  "Longmai": {
    "en": "Longmai",
    "hi": "Longmai",
    "bn": "Longmai",
    "as": "Longmai",
    "ne": "Longmai",
    "mni": "Longmai",
    "lus": "Longmai",
    "kha": "Longmai",
    "grt": "Longmai"
  },
  "Longtharai Valley": {
    "en": "Longtharai Valley",
    "hi": "Longtharai घाटी",
    "bn": "Longtharai উপত্যকা",
    "as": "Longtharai উপত্যকা",
    "ne": "Longtharai उपत्यका",
    "mni": "Longtharai তম্পাক",
    "lus": "Longtharai Phaizawl",
    "kha": "Longtharai Them",
    "grt": "Longtharai Chibima"
  },
  "Lumding": {
    "en": "Lumding",
    "hi": "Lumding",
    "bn": "Lumding",
    "as": "Lumding",
    "ne": "Lumding",
    "mni": "Lumding",
    "lus": "Lumding",
    "kha": "Lumding",
    "grt": "Lumding"
  },
  "Lumla": {
    "en": "Lumla",
    "hi": "Lumla",
    "bn": "Lumla",
    "as": "Lumla",
    "ne": "Lumla",
    "mni": "Lumla",
    "lus": "Lumla",
    "kha": "Lumla",
    "grt": "Lumla"
  },
  "Lunglei": {
    "en": "Lunglei",
    "hi": "लुंगलेई",
    "bn": "লুংলেই",
    "as": "লুংলেঈ",
    "ne": "लुङ्लेई",
    "mni": "লুংলেই",
    "lus": "Lunglei",
    "kha": "Lunglei",
    "grt": "Lunglei"
  },
  "Machi": {
    "en": "Machi",
    "hi": "Machi",
    "bn": "Machi",
    "as": "Machi",
    "ne": "Machi",
    "mni": "Machi",
    "lus": "Machi",
    "kha": "Machi",
    "grt": "Machi"
  },
  "Mahadevpur": {
    "en": "Mahadevpur",
    "hi": "Mahadevpur",
    "bn": "Mahadevpur",
    "as": "Mahadevpur",
    "ne": "Mahadevpur",
    "mni": "Mahadevpur",
    "lus": "Mahadevpur",
    "kha": "Mahadevpur",
    "grt": "Mahadevpur"
  },
  "Mahendraganj": {
    "en": "Mahendraganj",
    "hi": "Mahendraganj",
    "bn": "Mahendraganj",
    "as": "Mahendraganj",
    "ne": "Mahendraganj",
    "mni": "Mahendraganj",
    "lus": "Mahendraganj",
    "kha": "Mahendraganj",
    "grt": "Mahendraganj"
  },
  "Mahur": {
    "en": "Mahur",
    "hi": "Mahur",
    "bn": "Mahur",
    "as": "Mahur",
    "ne": "Mahur",
    "mni": "Mahur",
    "lus": "Mahur",
    "kha": "Mahur",
    "grt": "Mahur"
  },
  "Maibang": {
    "en": "Maibang",
    "hi": "Maibang",
    "bn": "Maibang",
    "as": "Maibang",
    "ne": "Maibang",
    "mni": "Maibang",
    "lus": "Maibang",
    "kha": "Maibang",
    "grt": "Maibang"
  },
  "Mairang": {
    "en": "Mairang",
    "hi": "Mairang",
    "bn": "Mairang",
    "as": "Mairang",
    "ne": "Mairang",
    "mni": "Mairang",
    "lus": "Mairang",
    "kha": "Mairang",
    "grt": "Mairang"
  },
  "Maligaon": {
    "en": "Maligaon",
    "hi": "Maligaon",
    "bn": "Maligaon",
    "as": "Maligaon",
    "ne": "Maligaon",
    "mni": "Maligaon",
    "lus": "Maligaon",
    "kha": "Maligaon",
    "grt": "Maligaon"
  },
  "Mamit": {
    "en": "Mamit",
    "hi": "मामित",
    "bn": "মামিত",
    "as": "মামিত",
    "ne": "मामित",
    "mni": "মামিত",
    "lus": "Mamit",
    "kha": "Mamit",
    "grt": "Mamit"
  },
  "Mangaldai": {
    "en": "Mangaldai",
    "hi": "Mangaldai",
    "bn": "Mangaldai",
    "as": "Mangaldai",
    "ne": "Mangaldai",
    "mni": "Mangaldai",
    "lus": "Mangaldai",
    "kha": "Mangaldai",
    "grt": "Mangaldai"
  },
  "Mangan": {
    "en": "Mangan",
    "hi": "मंगन",
    "bn": "মাঙ্গান",
    "as": "মাঙ্গান",
    "ne": "मङ्गन",
    "mni": "মঙ্গন",
    "lus": "Mangan",
    "kha": "Mangan",
    "grt": "Mangan"
  },
  "Mangan (North Sikkim)": {
    "en": "Mangan (North Sikkim)",
    "hi": "Mangan (North Sikkim)",
    "bn": "Mangan (North Sikkim)",
    "as": "Mangan (North Sikkim)",
    "ne": "Mangan (North Sikkim)",
    "mni": "Mangan (North Sikkim)",
    "lus": "Mangan (North Sikkim)",
    "kha": "Mangan (North Sikkim)",
    "grt": "Mangan (North Sikkim)"
  },
  "Mangkolemba": {
    "en": "Mangkolemba",
    "hi": "Mangkolemba",
    "bn": "Mangkolemba",
    "as": "Mangkolemba",
    "ne": "Mangkolemba",
    "mni": "Mangkolemba",
    "lus": "Mangkolemba",
    "kha": "Mangkolemba",
    "grt": "Mangkolemba"
  },
  "Manja": {
    "en": "Manja",
    "hi": "Manja",
    "bn": "Manja",
    "as": "Manja",
    "ne": "Manja",
    "mni": "Manja",
    "lus": "Manja",
    "kha": "Manja",
    "grt": "Manja"
  },
  "Mankachar": {
    "en": "Mankachar",
    "hi": "Mankachar",
    "bn": "Mankachar",
    "as": "Mankachar",
    "ne": "Mankachar",
    "mni": "Mankachar",
    "lus": "Mankachar",
    "kha": "Mankachar",
    "grt": "Mankachar"
  },
  "Mao": {
    "en": "Mao",
    "hi": "Mao",
    "bn": "Mao",
    "as": "Mao",
    "ne": "Mao",
    "mni": "Mao",
    "lus": "Mao",
    "kha": "Mao",
    "grt": "Mao"
  },
  "Maram": {
    "en": "Maram",
    "hi": "Maram",
    "bn": "Maram",
    "as": "Maram",
    "ne": "Maram",
    "mni": "Maram",
    "lus": "Maram",
    "kha": "Maram",
    "grt": "Maram"
  },
  "Margherita": {
    "en": "Margherita",
    "hi": "Margherita",
    "bn": "Margherita",
    "as": "Margherita",
    "ne": "Margherita",
    "mni": "Margherita",
    "lus": "Margherita",
    "kha": "Margherita",
    "grt": "Margherita"
  },
  "Mariani": {
    "en": "Mariani",
    "hi": "Mariani",
    "bn": "Mariani",
    "as": "Mariani",
    "ne": "Mariani",
    "mni": "Mariani",
    "lus": "Mariani",
    "kha": "Mariani",
    "grt": "Mariani"
  },
  "Mawkyrwat": {
    "en": "Mawkyrwat",
    "hi": "Mawkyrwat",
    "bn": "Mawkyrwat",
    "as": "Mawkyrwat",
    "ne": "Mawkyrwat",
    "mni": "Mawkyrwat",
    "lus": "Mawkyrwat",
    "kha": "Mawkyrwat",
    "grt": "Mawkyrwat"
  },
  "Mawlai": {
    "en": "Mawlai",
    "hi": "Mawlai",
    "bn": "Mawlai",
    "as": "Mawlai",
    "ne": "Mawlai",
    "mni": "Mawlai",
    "lus": "Mawlai",
    "kha": "Mawlai",
    "grt": "Mawlai"
  },
  "Mawsynram": {
    "en": "Mawsynram",
    "hi": "Mawsynram",
    "bn": "Mawsynram",
    "as": "Mawsynram",
    "ne": "Mawsynram",
    "mni": "Mawsynram",
    "lus": "Mawsynram",
    "kha": "Mawsynram",
    "grt": "Mawsynram"
  },
  "Mawthadraishan": {
    "en": "Mawthadraishan",
    "hi": "Mawthadraishan",
    "bn": "Mawthadraishan",
    "as": "Mawthadraishan",
    "ne": "Mawthadraishan",
    "mni": "Mawthadraishan",
    "lus": "Mawthadraishan",
    "kha": "Mawthadraishan",
    "grt": "Mawthadraishan"
  },
  "Mayang Imphal": {
    "en": "Mayang Imphal",
    "hi": "Mayang Imphal",
    "bn": "Mayang Imphal",
    "as": "Mayang Imphal",
    "ne": "Mayang Imphal",
    "mni": "Mayang Imphal",
    "lus": "Mayang Imphal",
    "kha": "Mayang Imphal",
    "grt": "Mayang Imphal"
  },
  "Mayong": {
    "en": "Mayong",
    "hi": "Mayong",
    "bn": "Mayong",
    "as": "Mayong",
    "ne": "Mayong",
    "mni": "Mayong",
    "lus": "Mayong",
    "kha": "Mayong",
    "grt": "Mayong"
  },
  "Mebo": {
    "en": "Mebo",
    "hi": "Mebo",
    "bn": "Mebo",
    "as": "Mebo",
    "ne": "Mebo",
    "mni": "Mebo",
    "lus": "Mebo",
    "kha": "Mebo",
    "grt": "Mebo"
  },
  "Mechuka": {
    "en": "Mechuka",
    "hi": "Mechuka",
    "bn": "Mechuka",
    "as": "Mechuka",
    "ne": "Mechuka",
    "mni": "Mechuka",
    "lus": "Mechuka",
    "kha": "Mechuka",
    "grt": "Mechuka"
  },
  "Medziphema": {
    "en": "Medziphema",
    "hi": "Medziphema",
    "bn": "Medziphema",
    "as": "Medziphema",
    "ne": "Medziphema",
    "mni": "Medziphema",
    "lus": "Medziphema",
    "kha": "Medziphema",
    "grt": "Medziphema"
  },
  "Meluri": {
    "en": "Meluri",
    "hi": "मेलुरी",
    "bn": "মেলুরি",
    "as": "মেলুৰী",
    "ne": "मेलुरी",
    "mni": "মেলুরি",
    "lus": "Meluri",
    "kha": "Meluri",
    "grt": "Meluri"
  },
  "Mendipathar": {
    "en": "Mendipathar",
    "hi": "Mendipathar",
    "bn": "Mendipathar",
    "as": "Mendipathar",
    "ne": "Mendipathar",
    "mni": "Mendipathar",
    "lus": "Mendipathar",
    "kha": "Mendipathar",
    "grt": "Mendipathar"
  },
  "Miao": {
    "en": "Miao",
    "hi": "Miao",
    "bn": "Miao",
    "as": "Miao",
    "ne": "Miao",
    "mni": "Miao",
    "lus": "Miao",
    "kha": "Miao",
    "grt": "Miao"
  },
  "Mirza": {
    "en": "Mirza",
    "hi": "Mirza",
    "bn": "Mirza",
    "as": "Mirza",
    "ne": "Mirza",
    "mni": "Mirza",
    "lus": "Mirza",
    "kha": "Mirza",
    "grt": "Mirza"
  },
  "Mohanpur": {
    "en": "Mohanpur",
    "hi": "Mohanpur",
    "bn": "Mohanpur",
    "as": "Mohanpur",
    "ne": "Mohanpur",
    "mni": "Mohanpur",
    "lus": "Mohanpur",
    "kha": "Mohanpur",
    "grt": "Mohanpur"
  },
  "Moirang": {
    "en": "Moirang",
    "hi": "Moirang",
    "bn": "Moirang",
    "as": "Moirang",
    "ne": "Moirang",
    "mni": "Moirang",
    "lus": "Moirang",
    "kha": "Moirang",
    "grt": "Moirang"
  },
  "Mokokchung": {
    "en": "Mokokchung",
    "hi": "मोकोकचुंग",
    "bn": "মোককচুং",
    "as": "মোককচাং",
    "ne": "मोकोकचुङ",
    "mni": "মোকোকচুং",
    "lus": "Mokokchung",
    "kha": "Mokokchung",
    "grt": "Mokokchung"
  },
  "Mon": {
    "en": "Mon",
    "hi": "मोन",
    "bn": "মোন",
    "as": "মন",
    "ne": "मोन",
    "mni": "মোন",
    "lus": "Mon",
    "kha": "Mon",
    "grt": "Mon"
  },
  "Monigong": {
    "en": "Monigong",
    "hi": "Monigong",
    "bn": "Monigong",
    "as": "Monigong",
    "ne": "Monigong",
    "mni": "Monigong",
    "lus": "Monigong",
    "kha": "Monigong",
    "grt": "Monigong"
  },
  "Moran": {
    "en": "Moran",
    "hi": "Moran",
    "bn": "Moran",
    "as": "Moran",
    "ne": "Moran",
    "mni": "Moran",
    "lus": "Moran",
    "kha": "Moran",
    "grt": "Moran"
  },
  "Moranhat": {
    "en": "Moranhat",
    "hi": "Moranhat",
    "bn": "Moranhat",
    "as": "Moranhat",
    "ne": "Moranhat",
    "mni": "Moranhat",
    "lus": "Moranhat",
    "kha": "Moranhat",
    "grt": "Moranhat"
  },
  "Moreh": {
    "en": "Moreh",
    "hi": "Moreh",
    "bn": "Moreh",
    "as": "Moreh",
    "ne": "Moreh",
    "mni": "Moreh",
    "lus": "Moreh",
    "kha": "Moreh",
    "grt": "Moreh"
  },
  "Moreh Border": {
    "en": "Moreh Border",
    "hi": "Moreh Border",
    "bn": "Moreh Border",
    "as": "Moreh Border",
    "ne": "Moreh Border",
    "mni": "Moreh Border",
    "lus": "Moreh Border",
    "kha": "Moreh Border",
    "grt": "Moreh Border"
  },
  "Morigaon": {
    "en": "Morigaon",
    "hi": "मोरीगांव",
    "bn": "মরিগাঁও",
    "as": "মৰিগাঁও",
    "ne": "मरीगाउँ",
    "mni": "মোরিগাঁও",
    "lus": "Morigaon",
    "kha": "Morigaon",
    "grt": "Morigaon"
  },
  "Motbung": {
    "en": "Motbung",
    "hi": "Motbung",
    "bn": "Motbung",
    "as": "Motbung",
    "ne": "Motbung",
    "mni": "Motbung",
    "lus": "Motbung",
    "kha": "Motbung",
    "grt": "Motbung"
  },
  "Mukalmua": {
    "en": "Mukalmua",
    "hi": "Mukalmua",
    "bn": "Mukalmua",
    "as": "Mukalmua",
    "ne": "Mukalmua",
    "mni": "Mukalmua",
    "lus": "Mukalmua",
    "kha": "Mukalmua",
    "grt": "Mukalmua"
  },
  "Mukto": {
    "en": "Mukto",
    "hi": "Mukto",
    "bn": "Mukto",
    "as": "Mukto",
    "ne": "Mukto",
    "mni": "Mukto",
    "lus": "Mukto",
    "kha": "Mukto",
    "grt": "Mukto"
  },
  "Musalpur": {
    "en": "Musalpur",
    "hi": "Musalpur",
    "bn": "Musalpur",
    "as": "Musalpur",
    "ne": "Musalpur",
    "mni": "Musalpur",
    "lus": "Musalpur",
    "kha": "Musalpur",
    "grt": "Musalpur"
  },
  "Nacho": {
    "en": "Nacho",
    "hi": "Nacho",
    "bn": "Nacho",
    "as": "Nacho",
    "ne": "Nacho",
    "mni": "Nacho",
    "lus": "Nacho",
    "kha": "Nacho",
    "grt": "Nacho"
  },
  "Nagaon": {
    "en": "Nagaon",
    "hi": "नगांव",
    "bn": "নগাঁও",
    "as": "নগাঁও",
    "ne": "नगाउँ",
    "mni": "নগাঁও",
    "lus": "Nagaon",
    "kha": "Nagaon",
    "grt": "Nagaon"
  },
  "Naginimora": {
    "en": "Naginimora",
    "hi": "Naginimora",
    "bn": "Naginimora",
    "as": "Naginimora",
    "ne": "Naginimora",
    "mni": "Naginimora",
    "lus": "Naginimora",
    "kha": "Naginimora",
    "grt": "Naginimora"
  },
  "Nagrijuli": {
    "en": "Nagrijuli",
    "hi": "Nagrijuli",
    "bn": "Nagrijuli",
    "as": "Nagrijuli",
    "ne": "Nagrijuli",
    "mni": "Nagrijuli",
    "lus": "Nagrijuli",
    "kha": "Nagrijuli",
    "grt": "Nagrijuli"
  },
  "Naharkatia": {
    "en": "Naharkatia",
    "hi": "Naharkatia",
    "bn": "Naharkatia",
    "as": "Naharkatia",
    "ne": "Naharkatia",
    "mni": "Naharkatia",
    "lus": "Naharkatia",
    "kha": "Naharkatia",
    "grt": "Naharkatia"
  },
  "Naharlagun": {
    "en": "Naharlagun",
    "hi": "Naharlagun",
    "bn": "Naharlagun",
    "as": "Naharlagun",
    "ne": "Naharlagun",
    "mni": "Naharlagun",
    "lus": "Naharlagun",
    "kha": "Naharlagun",
    "grt": "Naharlagun"
  },
  "Nalbari": {
    "en": "Nalbari",
    "hi": "नलबाड़ी",
    "bn": "নলবাড়ি",
    "as": "নলবাৰী",
    "ne": "नलबाडी",
    "mni": "নলবাড়ী",
    "lus": "Nalbari",
    "kha": "Nalbari",
    "grt": "Nalbari"
  },
  "Nambol": {
    "en": "Nambol",
    "hi": "Nambol",
    "bn": "Nambol",
    "as": "Nambol",
    "ne": "Nambol",
    "mni": "Nambol",
    "lus": "Nambol",
    "kha": "Nambol",
    "grt": "Nambol"
  },
  "Namchi": {
    "en": "Namchi",
    "hi": "नामची",
    "bn": "নামচি",
    "as": "নামচি",
    "ne": "नाम्ची",
    "mni": "নামচি",
    "lus": "Namchi",
    "kha": "Namchi",
    "grt": "Namchi"
  },
  "Namchi (South Sikkim)": {
    "en": "Namchi (South Sikkim)",
    "hi": "Namchi (South Sikkim)",
    "bn": "Namchi (South Sikkim)",
    "as": "Namchi (South Sikkim)",
    "ne": "Namchi (South Sikkim)",
    "mni": "Namchi (South Sikkim)",
    "lus": "Namchi (South Sikkim)",
    "kha": "Namchi (South Sikkim)",
    "grt": "Namchi (South Sikkim)"
  },
  "Namrup": {
    "en": "Namrup",
    "hi": "Namrup",
    "bn": "Namrup",
    "as": "Namrup",
    "ne": "Namrup",
    "mni": "Namrup",
    "lus": "Namrup",
    "kha": "Namrup",
    "grt": "Namrup"
  },
  "Namsai": {
    "en": "Namsai",
    "hi": "नामसाई",
    "bn": "নামসাই",
    "as": "নামছাই",
    "ne": "नामसाई",
    "mni": "নামসাই",
    "lus": "Namsai",
    "kha": "Namsai",
    "grt": "Namsai"
  },
  "Narayanpur": {
    "en": "Narayanpur",
    "hi": "Narayanpur",
    "bn": "Narayanpur",
    "as": "Narayanpur",
    "ne": "Narayanpur",
    "mni": "Narayanpur",
    "lus": "Narayanpur",
    "kha": "Narayanpur",
    "grt": "Narayanpur"
  },
  "Nari": {
    "en": "Nari",
    "hi": "Nari",
    "bn": "Nari",
    "as": "Nari",
    "ne": "Nari",
    "mni": "Nari",
    "lus": "Nari",
    "kha": "Nari",
    "grt": "Nari"
  },
  "Nazira": {
    "en": "Nazira",
    "hi": "Nazira",
    "bn": "Nazira",
    "as": "Nazira",
    "ne": "Nazira",
    "mni": "Nazira",
    "lus": "Nazira",
    "kha": "Nazira",
    "grt": "Nazira"
  },
  "New Bongaigaon": {
    "en": "New Bongaigaon",
    "hi": "New Bongaigaon",
    "bn": "New Bongaigaon",
    "as": "New Bongaigaon",
    "ne": "New Bongaigaon",
    "mni": "New Bongaigaon",
    "lus": "New Bongaigaon",
    "kha": "New Bongaigaon",
    "grt": "New Bongaigaon"
  },
  "Ngopa": {
    "en": "Ngopa",
    "hi": "Ngopa",
    "bn": "Ngopa",
    "as": "Ngopa",
    "ne": "Ngopa",
    "mni": "Ngopa",
    "lus": "Ngopa",
    "kha": "Ngopa",
    "grt": "Ngopa"
  },
  "Ningthoukhong": {
    "en": "Ningthoukhong",
    "hi": "Ningthoukhong",
    "bn": "Ningthoukhong",
    "as": "Ningthoukhong",
    "ne": "Ningthoukhong",
    "mni": "Ningthoukhong",
    "lus": "Ningthoukhong",
    "kha": "Ningthoukhong",
    "grt": "Ningthoukhong"
  },
  "Nirjuli": {
    "en": "Nirjuli",
    "hi": "Nirjuli",
    "bn": "Nirjuli",
    "as": "Nirjuli",
    "ne": "Nirjuli",
    "mni": "Nirjuli",
    "lus": "Nirjuli",
    "kha": "Nirjuli",
    "grt": "Nirjuli"
  },
  "Niuland": {
    "en": "Niuland",
    "hi": "न्यूलैंड",
    "bn": "নিউল্যান্ড",
    "as": "নিউলেণ্ড",
    "ne": "न्युल्याण्ड",
    "mni": "নিউলেন্দ",
    "lus": "Niuland",
    "kha": "Niuland",
    "grt": "Niuland"
  },
  "Noklak": {
    "en": "Noklak",
    "hi": "नोकलाक",
    "bn": "নকলাক",
    "as": "নক্লাক",
    "ne": "नोक्लाक",
    "mni": "নোকলাক",
    "lus": "Noklak",
    "kha": "Noklak",
    "grt": "Noklak"
  },
  "Noksen": {
    "en": "Noksen",
    "hi": "Noksen",
    "bn": "Noksen",
    "as": "Noksen",
    "ne": "Noksen",
    "mni": "Noksen",
    "lus": "Noksen",
    "kha": "Noksen",
    "grt": "Noksen"
  },
  "Noney": {
    "en": "Noney",
    "hi": "नोने",
    "bn": "নোনে",
    "as": "ননে",
    "ne": "नोने",
    "mni": "নোনে",
    "lus": "Noney",
    "kha": "Noney",
    "grt": "Noney"
  },
  "Nongpoh": {
    "en": "Nongpoh",
    "hi": "नोंगपोह",
    "bn": "নংপো",
    "as": "নংপো",
    "ne": "नोङपोह",
    "mni": "নোংপোহ",
    "lus": "Nongpoh",
    "kha": "Nongpoh",
    "grt": "Nongpoh"
  },
  "Nongstoin": {
    "en": "Nongstoin",
    "hi": "Nongstoin",
    "bn": "Nongstoin",
    "as": "Nongstoin",
    "ne": "Nongstoin",
    "mni": "Nongstoin",
    "lus": "Nongstoin",
    "kha": "Nongstoin",
    "grt": "Nongstoin"
  },
  "North Lakhimpur": {
    "en": "North Lakhimpur",
    "hi": "उत्तर लखीमपुर",
    "bn": "উত্তর লখিমপুর",
    "as": "উত্তৰ লখিমপুৰ",
    "ne": "उत्तर लखिमपुर",
    "mni": "অৱাংবা লখিমপুর",
    "lus": "Hmar Lakhimpur",
    "kha": "Shatei Lakhimpur",
    "grt": "Salgro Lakhimpur"
  },
  "Numaligarh": {
    "en": "Numaligarh",
    "hi": "Numaligarh",
    "bn": "Numaligarh",
    "as": "Numaligarh",
    "ne": "Numaligarh",
    "mni": "Numaligarh",
    "lus": "Numaligarh",
    "kha": "Numaligarh",
    "grt": "Numaligarh"
  },
  "Nungba": {
    "en": "Nungba",
    "hi": "Nungba",
    "bn": "Nungba",
    "as": "Nungba",
    "ne": "Nungba",
    "mni": "Nungba",
    "lus": "Nungba",
    "kha": "Nungba",
    "grt": "Nungba"
  },
  "Nyapin": {
    "en": "Nyapin",
    "hi": "Nyapin",
    "bn": "Nyapin",
    "as": "Nyapin",
    "ne": "Nyapin",
    "mni": "Nyapin",
    "lus": "Nyapin",
    "kha": "Nyapin",
    "grt": "Nyapin"
  },
  "Old Ziro": {
    "en": "Old Ziro",
    "hi": "Old Ziro",
    "bn": "Old Ziro",
    "as": "Old Ziro",
    "ne": "Old Ziro",
    "mni": "Old Ziro",
    "lus": "Old Ziro",
    "kha": "Old Ziro",
    "grt": "Old Ziro"
  },
  "Pakke Kessang": {
    "en": "Pakke Kessang",
    "hi": "पक्के केसांग",
    "bn": "পাক্কে কেসাং",
    "as": "পাক্কে কেচাং",
    "ne": "पक्के केसाङ",
    "mni": "পাক্কে কেসাং",
    "lus": "Pakke Kessang",
    "kha": "Pakke Kessang",
    "grt": "Pakke Kessang"
  },
  "Pakyong": {
    "en": "Pakyong",
    "hi": "पाकयोंग",
    "bn": "পাকইয়ং",
    "as": "পাকিয়ং",
    "ne": "पाक्योङ",
    "mni": "পাকইয়ং",
    "lus": "Pakyong",
    "kha": "Pakyong",
    "grt": "Pakyong"
  },
  "Palasbari": {
    "en": "Palasbari",
    "hi": "Palasbari",
    "bn": "Palasbari",
    "as": "Palasbari",
    "ne": "Palasbari",
    "mni": "Palasbari",
    "lus": "Palasbari",
    "kha": "Palasbari",
    "grt": "Palasbari"
  },
  "Palin": {
    "en": "Palin",
    "hi": "Palin",
    "bn": "Palin",
    "as": "Palin",
    "ne": "Palin",
    "mni": "Palin",
    "lus": "Palin",
    "kha": "Palin",
    "grt": "Palin"
  },
  "Pallel": {
    "en": "Pallel",
    "hi": "Pallel",
    "bn": "Pallel",
    "as": "Pallel",
    "ne": "Pallel",
    "mni": "Pallel",
    "lus": "Pallel",
    "kha": "Pallel",
    "grt": "Pallel"
  },
  "Pan Bazaar": {
    "en": "Pan Bazaar",
    "hi": "Pan Bazaar",
    "bn": "Pan Bazaar",
    "as": "Pan Bazaar",
    "ne": "Pan Bazaar",
    "mni": "Pan Bazaar",
    "lus": "Pan Bazaar",
    "kha": "Pan Bazaar",
    "grt": "Pan Bazaar"
  },
  "Pangchao": {
    "en": "Pangchao",
    "hi": "Pangchao",
    "bn": "Pangchao",
    "as": "Pangchao",
    "ne": "Pangchao",
    "mni": "Pangchao",
    "lus": "Pangchao",
    "kha": "Pangchao",
    "grt": "Pangchao"
  },
  "Pangin": {
    "en": "Pangin",
    "hi": "Pangin",
    "bn": "Pangin",
    "as": "Pangin",
    "ne": "Pangin",
    "mni": "Pangin",
    "lus": "Pangin",
    "kha": "Pangin",
    "grt": "Pangin"
  },
  "Panisagar": {
    "en": "Panisagar",
    "hi": "Panisagar",
    "bn": "Panisagar",
    "as": "Panisagar",
    "ne": "Panisagar",
    "mni": "Panisagar",
    "lus": "Panisagar",
    "kha": "Panisagar",
    "grt": "Panisagar"
  },
  "Parbung": {
    "en": "Parbung",
    "hi": "Parbung",
    "bn": "Parbung",
    "as": "Parbung",
    "ne": "Parbung",
    "mni": "Parbung",
    "lus": "Parbung",
    "kha": "Parbung",
    "grt": "Parbung"
  },
  "Pasighat": {
    "en": "Pasighat",
    "hi": "पासीघाट",
    "bn": "পাসিঘাট",
    "as": "পাছিঘাট",
    "ne": "पासीघाट",
    "mni": "পাসিঘাত",
    "lus": "Pasighat",
    "kha": "Pasighat",
    "grt": "Pasighat"
  },
  "Patharkandi": {
    "en": "Patharkandi",
    "hi": "Patharkandi",
    "bn": "Patharkandi",
    "as": "Patharkandi",
    "ne": "Patharkandi",
    "mni": "Patharkandi",
    "lus": "Patharkandi",
    "kha": "Patharkandi",
    "grt": "Patharkandi"
  },
  "Pathsala": {
    "en": "Pathsala",
    "hi": "Pathsala",
    "bn": "Pathsala",
    "as": "Pathsala",
    "ne": "Pathsala",
    "mni": "Pathsala",
    "lus": "Pathsala",
    "kha": "Pathsala",
    "grt": "Pathsala"
  },
  "Peren": {
    "en": "Peren",
    "hi": "पेरेन",
    "bn": "পেরেন",
    "as": "পেৰেন",
    "ne": "पेरेन",
    "mni": "পেরেন",
    "lus": "Peren",
    "kha": "Peren",
    "grt": "Peren"
  },
  "Pf\\u00fctsero": {
    "en": "Pf\\u00fctsero",
    "hi": "Pf\\u00fctsero",
    "bn": "Pf\\u00fctsero",
    "as": "Pf\\u00fctsero",
    "ne": "Pf\\u00fctsero",
    "mni": "Pf\\u00fctsero",
    "lus": "Pf\\u00fctsero",
    "kha": "Pf\\u00fctsero",
    "grt": "Pf\\u00fctsero"
  },
  "Phek": {
    "en": "Phek",
    "hi": "फेक",
    "bn": "ফেক",
    "as": "ফেক",
    "ne": "फेक",
    "mni": "ফেক",
    "lus": "Phek",
    "kha": "Phek",
    "grt": "Phek"
  },
  "Pherzawl": {
    "en": "Pherzawl",
    "hi": "फेरज़ॉल",
    "bn": "ফেরজল",
    "as": "ফেৰজল",
    "ne": "फेरजावल",
    "mni": "ফেরজোল",
    "lus": "Pherzawl",
    "kha": "Pherzawl",
    "grt": "Pherzawl"
  },
  "Phulbari": {
    "en": "Phulbari",
    "hi": "Phulbari",
    "bn": "Phulbari",
    "as": "Phulbari",
    "ne": "Phulbari",
    "mni": "Phulbari",
    "lus": "Phulbari",
    "kha": "Phulbari",
    "grt": "Phulbari"
  },
  "Phungyar": {
    "en": "Phungyar",
    "hi": "Phungyar",
    "bn": "Phungyar",
    "as": "Phungyar",
    "ne": "Phungyar",
    "mni": "Phungyar",
    "lus": "Phungyar",
    "kha": "Phungyar",
    "grt": "Phungyar"
  },
  "Police Bazar": {
    "en": "Police Bazar",
    "hi": "Police Bazar",
    "bn": "Police Bazar",
    "as": "Police Bazar",
    "ne": "Police Bazar",
    "mni": "Police Bazar",
    "lus": "Police Bazar",
    "kha": "Police Bazar",
    "grt": "Police Bazar"
  },
  "Porompat": {
    "en": "Porompat",
    "hi": "Porompat",
    "bn": "Porompat",
    "as": "Porompat",
    "ne": "Porompat",
    "mni": "Porompat",
    "lus": "Porompat",
    "kha": "Porompat",
    "grt": "Porompat"
  },
  "Pungro": {
    "en": "Pungro",
    "hi": "Pungro",
    "bn": "Pungro",
    "as": "Pungro",
    "ne": "Pungro",
    "mni": "Pungro",
    "lus": "Pungro",
    "kha": "Pungro",
    "grt": "Pungro"
  },
  "Purana Bazar": {
    "en": "Purana Bazar",
    "hi": "Purana Bazar",
    "bn": "Purana Bazar",
    "as": "Purana Bazar",
    "ne": "Purana Bazar",
    "mni": "Purana Bazar",
    "lus": "Purana Bazar",
    "kha": "Purana Bazar",
    "grt": "Purana Bazar"
  },
  "Purul": {
    "en": "Purul",
    "hi": "Purul",
    "bn": "Purul",
    "as": "Purul",
    "ne": "Purul",
    "mni": "Purul",
    "lus": "Purul",
    "kha": "Purul",
    "grt": "Purul"
  },
  "Pynursla": {
    "en": "Pynursla",
    "hi": "Pynursla",
    "bn": "Pynursla",
    "as": "Pynursla",
    "ne": "Pynursla",
    "mni": "Pynursla",
    "lus": "Pynursla",
    "kha": "Pynursla",
    "grt": "Pynursla"
  },
  "Raga": {
    "en": "Raga",
    "hi": "Raga",
    "bn": "Raga",
    "as": "Raga",
    "ne": "Raga",
    "mni": "Raga",
    "lus": "Raga",
    "kha": "Raga",
    "grt": "Raga"
  },
  "Raha": {
    "en": "Raha",
    "hi": "Raha",
    "bn": "Raha",
    "as": "Raha",
    "ne": "Raha",
    "mni": "Raha",
    "lus": "Raha",
    "kha": "Raha",
    "grt": "Raha"
  },
  "Ramhlun": {
    "en": "Ramhlun",
    "hi": "Ramhlun",
    "bn": "Ramhlun",
    "as": "Ramhlun",
    "ne": "Ramhlun",
    "mni": "Ramhlun",
    "lus": "Ramhlun",
    "kha": "Ramhlun",
    "grt": "Ramhlun"
  },
  "Ramkrishna Nagar": {
    "en": "Ramkrishna Nagar",
    "hi": "Ramkrishna Nagar",
    "bn": "Ramkrishna Nagar",
    "as": "Ramkrishna Nagar",
    "ne": "Ramkrishna Nagar",
    "mni": "Ramkrishna Nagar",
    "lus": "Ramkrishna Nagar",
    "kha": "Ramkrishna Nagar",
    "grt": "Ramkrishna Nagar"
  },
  "Rangapara": {
    "en": "Rangapara",
    "hi": "Rangapara",
    "bn": "Rangapara",
    "as": "Rangapara",
    "ne": "Rangapara",
    "mni": "Rangapara",
    "lus": "Rangapara",
    "kha": "Rangapara",
    "grt": "Rangapara"
  },
  "Rangia": {
    "en": "Rangia",
    "hi": "Rangia",
    "bn": "Rangia",
    "as": "Rangia",
    "ne": "Rangia",
    "mni": "Rangia",
    "lus": "Rangia",
    "kha": "Rangia",
    "grt": "Rangia"
  },
  "Rangpo": {
    "en": "Rangpo",
    "hi": "रंगपो",
    "bn": "রংপো",
    "as": "ৰংপো",
    "ne": "रङ्पो",
    "mni": "রংপো",
    "lus": "Rangpo",
    "kha": "Rangpo",
    "grt": "Rangpo"
  },
  "Ranikor": {
    "en": "Ranikor",
    "hi": "Ranikor",
    "bn": "Ranikor",
    "as": "Ranikor",
    "ne": "Ranikor",
    "mni": "Ranikor",
    "lus": "Ranikor",
    "kha": "Ranikor",
    "grt": "Ranikor"
  },
  "Ranirbazar": {
    "en": "Ranirbazar",
    "hi": "Ranirbazar",
    "bn": "Ranirbazar",
    "as": "Ranirbazar",
    "ne": "Ranirbazar",
    "mni": "Ranirbazar",
    "lus": "Ranirbazar",
    "kha": "Ranirbazar",
    "grt": "Ranirbazar"
  },
  "Resubelpara": {
    "en": "Resubelpara",
    "hi": "Resubelpara",
    "bn": "Resubelpara",
    "as": "Resubelpara",
    "ne": "Resubelpara",
    "mni": "Resubelpara",
    "lus": "Resubelpara",
    "kha": "Resubelpara",
    "grt": "Resubelpara"
  },
  "Rhenock": {
    "en": "Rhenock",
    "hi": "Rhenock",
    "bn": "Rhenock",
    "as": "Rhenock",
    "ne": "Rhenock",
    "mni": "Rhenock",
    "lus": "Rhenock",
    "kha": "Rhenock",
    "grt": "Rhenock"
  },
  "Roing": {
    "en": "Roing",
    "hi": "Roing",
    "bn": "Roing",
    "as": "Roing",
    "ne": "Roing",
    "mni": "Roing",
    "lus": "Roing",
    "kha": "Roing",
    "grt": "Roing"
  },
  "Rongjeng": {
    "en": "Rongjeng",
    "hi": "Rongjeng",
    "bn": "Rongjeng",
    "as": "Rongjeng",
    "ne": "Rongjeng",
    "mni": "Rongjeng",
    "lus": "Rongjeng",
    "kha": "Rongjeng",
    "grt": "Rongjeng"
  },
  "Rongli": {
    "en": "Rongli",
    "hi": "Rongli",
    "bn": "Rongli",
    "as": "Rongli",
    "ne": "Rongli",
    "mni": "Rongli",
    "lus": "Rongli",
    "kha": "Rongli",
    "grt": "Rongli"
  },
  "Rowta": {
    "en": "Rowta",
    "hi": "Rowta",
    "bn": "Rowta",
    "as": "Rowta",
    "ne": "Rowta",
    "mni": "Rowta",
    "lus": "Rowta",
    "kha": "Rowta",
    "grt": "Rowta"
  },
  "Ruksin": {
    "en": "Ruksin",
    "hi": "Ruksin",
    "bn": "Ruksin",
    "as": "Ruksin",
    "ne": "Ruksin",
    "mni": "Ruksin",
    "lus": "Ruksin",
    "kha": "Ruksin",
    "grt": "Ruksin"
  },
  "Rupa": {
    "en": "Rupa",
    "hi": "Rupa",
    "bn": "Rupa",
    "as": "Rupa",
    "ne": "Rupa",
    "mni": "Rupa",
    "lus": "Rupa",
    "kha": "Rupa",
    "grt": "Rupa"
  },
  "Sabroom": {
    "en": "Sabroom",
    "hi": "Sabroom",
    "bn": "Sabroom",
    "as": "Sabroom",
    "ne": "Sabroom",
    "mni": "Sabroom",
    "lus": "Sabroom",
    "kha": "Sabroom",
    "grt": "Sabroom"
  },
  "Saiha": {
    "en": "Saiha",
    "hi": "Saiha",
    "bn": "Saiha",
    "as": "Saiha",
    "ne": "Saiha",
    "mni": "Saiha",
    "lus": "Saiha",
    "kha": "Saiha",
    "grt": "Saiha"
  },
  "Saikul": {
    "en": "Saikul",
    "hi": "Saikul",
    "bn": "Saikul",
    "as": "Saikul",
    "ne": "Saikul",
    "mni": "Saikul",
    "lus": "Saikul",
    "kha": "Saikul",
    "grt": "Saikul"
  },
  "Sairang": {
    "en": "Sairang",
    "hi": "Sairang",
    "bn": "Sairang",
    "as": "Sairang",
    "ne": "Sairang",
    "mni": "Sairang",
    "lus": "Sairang",
    "kha": "Sairang",
    "grt": "Sairang"
  },
  "Saitual": {
    "en": "Saitual",
    "hi": "सैतुअल",
    "bn": "সাইতুয়াল",
    "as": "ছাইতুৱাল",
    "ne": "सैतुअल",
    "mni": "সাইতুয়াল",
    "lus": "Saitual",
    "kha": "Saitual",
    "grt": "Saitual"
  },
  "Salakati": {
    "en": "Salakati",
    "hi": "Salakati",
    "bn": "Salakati",
    "as": "Salakati",
    "ne": "Salakati",
    "mni": "Salakati",
    "lus": "Salakati",
    "kha": "Salakati",
    "grt": "Salakati"
  },
  "Sangau": {
    "en": "Sangau",
    "hi": "Sangau",
    "bn": "Sangau",
    "as": "Sangau",
    "ne": "Sangau",
    "mni": "Sangau",
    "lus": "Sangau",
    "kha": "Sangau",
    "grt": "Sangau"
  },
  "Sanis": {
    "en": "Sanis",
    "hi": "Sanis",
    "bn": "Sanis",
    "as": "Sanis",
    "ne": "Sanis",
    "mni": "Sanis",
    "lus": "Sanis",
    "kha": "Sanis",
    "grt": "Sanis"
  },
  "Santirbazar": {
    "en": "Santirbazar",
    "hi": "Santirbazar",
    "bn": "Santirbazar",
    "as": "Santirbazar",
    "ne": "Santirbazar",
    "mni": "Santirbazar",
    "lus": "Santirbazar",
    "kha": "Santirbazar",
    "grt": "Santirbazar"
  },
  "Sarli": {
    "en": "Sarli",
    "hi": "Sarli",
    "bn": "Sarli",
    "as": "Sarli",
    "ne": "Sarli",
    "mni": "Sarli",
    "lus": "Sarli",
    "kha": "Sarli",
    "grt": "Sarli"
  },
  "Sarthebari": {
    "en": "Sarthebari",
    "hi": "Sarthebari",
    "bn": "Sarthebari",
    "as": "Sarthebari",
    "ne": "Sarthebari",
    "mni": "Sarthebari",
    "lus": "Sarthebari",
    "kha": "Sarthebari",
    "grt": "Sarthebari"
  },
  "Sarupathar": {
    "en": "Sarupathar",
    "hi": "Sarupathar",
    "bn": "Sarupathar",
    "as": "Sarupathar",
    "ne": "Sarupathar",
    "mni": "Sarupathar",
    "lus": "Sarupathar",
    "kha": "Sarupathar",
    "grt": "Sarupathar"
  },
  "Satakha": {
    "en": "Satakha",
    "hi": "Satakha",
    "bn": "Satakha",
    "as": "Satakha",
    "ne": "Satakha",
    "mni": "Satakha",
    "lus": "Satakha",
    "kha": "Satakha",
    "grt": "Satakha"
  },
  "Sawombung": {
    "en": "Sawombung",
    "hi": "Sawombung",
    "bn": "Sawombung",
    "as": "Sawombung",
    "ne": "Sawombung",
    "mni": "Sawombung",
    "lus": "Sawombung",
    "kha": "Sawombung",
    "grt": "Sawombung"
  },
  "Seijosa": {
    "en": "Seijosa",
    "hi": "Seijosa",
    "bn": "Seijosa",
    "as": "Seijosa",
    "ne": "Seijosa",
    "mni": "Seijosa",
    "lus": "Seijosa",
    "kha": "Seijosa",
    "grt": "Seijosa"
  },
  "Senapati": {
    "en": "Senapati",
    "hi": "सेनापति",
    "bn": "সেনাপতি",
    "as": "সেনাপতি",
    "ne": "सेनापति",
    "mni": "সেনাপতি",
    "lus": "Senapati",
    "kha": "Senapati",
    "grt": "Senapati"
  },
  "Seppa": {
    "en": "Seppa",
    "hi": "Seppa",
    "bn": "Seppa",
    "as": "Seppa",
    "ne": "Seppa",
    "mni": "Seppa",
    "lus": "Seppa",
    "kha": "Seppa",
    "grt": "Seppa"
  },
  "Serchhip": {
    "en": "Serchhip",
    "hi": "सेरछिप",
    "bn": "সেরছিপ",
    "as": "চেৰছিপ",
    "ne": "सेरछिप",
    "mni": "সেরছিপ",
    "lus": "Serchhip",
    "kha": "Serchhip",
    "grt": "Serchhip"
  },
  "Seyochung": {
    "en": "Seyochung",
    "hi": "Seyochung",
    "bn": "Seyochung",
    "as": "Seyochung",
    "ne": "Seyochung",
    "mni": "Seyochung",
    "lus": "Seyochung",
    "kha": "Seyochung",
    "grt": "Seyochung"
  },
  "Shamator": {
    "en": "Shamator",
    "hi": "शामटोर",
    "bn": "শামাটোর",
    "as": "শামাটৰ",
    "ne": "शामटोर",
    "mni": "শামাতোর",
    "lus": "Shamator",
    "kha": "Shamator",
    "grt": "Shamator"
  },
  "Shillong": {
    "en": "Shillong",
    "hi": "शिलांग",
    "bn": "শিলং",
    "as": "শ্বিলং",
    "ne": "शिलोङ",
    "mni": "শিলং",
    "lus": "Shillong",
    "kha": "Shillong",
    "grt": "Shillong"
  },
  "Shirui": {
    "en": "Shirui",
    "hi": "Shirui",
    "bn": "Shirui",
    "as": "Shirui",
    "ne": "Shirui",
    "mni": "Shirui",
    "lus": "Shirui",
    "kha": "Shirui",
    "grt": "Shirui"
  },
  "Siju": {
    "en": "Siju",
    "hi": "Siju",
    "bn": "Siju",
    "as": "Siju",
    "ne": "Siju",
    "mni": "Siju",
    "lus": "Siju",
    "kha": "Siju",
    "grt": "Siju"
  },
  "Silapathar": {
    "en": "Silapathar",
    "hi": "Silapathar",
    "bn": "Silapathar",
    "as": "Silapathar",
    "ne": "Silapathar",
    "mni": "Silapathar",
    "lus": "Silapathar",
    "kha": "Silapathar",
    "grt": "Silapathar"
  },
  "Silchar": {
    "en": "Silchar",
    "hi": "सिलचर",
    "bn": "শিলচর",
    "as": "শিলচৰ",
    "ne": "सिलचर",
    "mni": "শিলচর",
    "lus": "Silchar",
    "kha": "Silchar",
    "grt": "Silchar"
  },
  "Sille-Oyan": {
    "en": "Sille-Oyan",
    "hi": "Sille-Oyan",
    "bn": "Sille-Oyan",
    "as": "Sille-Oyan",
    "ne": "Sille-Oyan",
    "mni": "Sille-Oyan",
    "lus": "Sille-Oyan",
    "kha": "Sille-Oyan",
    "grt": "Sille-Oyan"
  },
  "Singchung": {
    "en": "Singchung",
    "hi": "Singchung",
    "bn": "Singchung",
    "as": "Singchung",
    "ne": "Singchung",
    "mni": "Singchung",
    "lus": "Singchung",
    "kha": "Singchung",
    "grt": "Singchung"
  },
  "Singjamei": {
    "en": "Singjamei",
    "hi": "Singjamei",
    "bn": "Singjamei",
    "as": "Singjamei",
    "ne": "Singjamei",
    "mni": "Singjamei",
    "lus": "Singjamei",
    "kha": "Singjamei",
    "grt": "Singjamei"
  },
  "Singngat": {
    "en": "Singngat",
    "hi": "Singngat",
    "bn": "Singngat",
    "as": "Singngat",
    "ne": "Singngat",
    "mni": "Singngat",
    "lus": "Singngat",
    "kha": "Singngat",
    "grt": "Singngat"
  },
  "Singtam": {
    "en": "Singtam",
    "hi": "सिंगताम",
    "bn": "সিংতাম",
    "as": "ছিংটাম",
    "ne": "सिङताम",
    "mni": "সিংতাম",
    "lus": "Singtam",
    "kha": "Singtam",
    "grt": "Singtam"
  },
  "Sipajhar": {
    "en": "Sipajhar",
    "hi": "Sipajhar",
    "bn": "Sipajhar",
    "as": "Sipajhar",
    "ne": "Sipajhar",
    "mni": "Sipajhar",
    "lus": "Sipajhar",
    "kha": "Sipajhar",
    "grt": "Sipajhar"
  },
  "Sivasagar": {
    "en": "Sivasagar",
    "hi": "शिवसागर",
    "bn": "শিবসাগর",
    "as": "শিৱসাগৰ",
    "ne": "शिवसागर",
    "mni": "শিবসাগর",
    "lus": "Sivasagar",
    "kha": "Sivasagar",
    "grt": "Sivasagar"
  },
  "Sohra": {
    "en": "Sohra",
    "hi": "सोहरा",
    "bn": "সোহরা",
    "as": "চোহৰা",
    "ne": "सोहरा",
    "mni": "সোহরা",
    "lus": "Sohra",
    "kha": "Sohra",
    "grt": "Sohra"
  },
  "Sonai": {
    "en": "Sonai",
    "hi": "Sonai",
    "bn": "Sonai",
    "as": "Sonai",
    "ne": "Sonai",
    "mni": "Sonai",
    "lus": "Sonai",
    "kha": "Sonai",
    "grt": "Sonai"
  },
  "Sonamura": {
    "en": "Sonamura",
    "hi": "Sonamura",
    "bn": "Sonamura",
    "as": "Sonamura",
    "ne": "Sonamura",
    "mni": "Sonamura",
    "lus": "Sonamura",
    "kha": "Sonamura",
    "grt": "Sonamura"
  },
  "Sonari": {
    "en": "Sonari",
    "hi": "Sonari",
    "bn": "Sonari",
    "as": "Sonari",
    "ne": "Sonari",
    "mni": "Sonari",
    "lus": "Sonari",
    "kha": "Sonari",
    "grt": "Sonari"
  },
  "Songsak": {
    "en": "Songsak",
    "hi": "Songsak",
    "bn": "Songsak",
    "as": "Songsak",
    "ne": "Songsak",
    "mni": "Songsak",
    "lus": "Songsak",
    "kha": "Songsak",
    "grt": "Songsak"
  },
  "Soreng": {
    "en": "Soreng",
    "hi": "सोरेन्ग",
    "bn": "সোরেং",
    "as": "চোৰেং",
    "ne": "सोरेङ",
    "mni": "সোরেং",
    "lus": "Soreng",
    "kha": "Soreng",
    "grt": "Soreng"
  },
  "South Vanlaiphai": {
    "en": "South Vanlaiphai",
    "hi": "दक्षिण Vanlaiphai",
    "bn": "দক্ষিণ Vanlaiphai",
    "as": "দক্ষিণ Vanlaiphai",
    "ne": "दक्षिण Vanlaiphai",
    "mni": "মখা Vanlaiphai",
    "lus": "Chhim Vanlaiphai",
    "kha": "Shaphang Vanlaiphai",
    "grt": "Salbag Vanlaiphai"
  },
  "Sugnoo": {
    "en": "Sugnoo",
    "hi": "Sugnoo",
    "bn": "Sugnoo",
    "as": "Sugnoo",
    "ne": "Sugnoo",
    "mni": "Sugnoo",
    "lus": "Sugnoo",
    "kha": "Sugnoo",
    "grt": "Sugnoo"
  },
  "Sunpura": {
    "en": "Sunpura",
    "hi": "Sunpura",
    "bn": "Sunpura",
    "as": "Sunpura",
    "ne": "Sunpura",
    "mni": "Sunpura",
    "lus": "Sunpura",
    "kha": "Sunpura",
    "grt": "Sunpura"
  },
  "Sutnga": {
    "en": "Sutnga",
    "hi": "Sutnga",
    "bn": "Sutnga",
    "as": "Sutnga",
    "ne": "Sutnga",
    "mni": "Sutnga",
    "lus": "Sutnga",
    "kha": "Sutnga",
    "grt": "Sutnga"
  },
  "Tadubi": {
    "en": "Tadubi",
    "hi": "Tadubi",
    "bn": "Tadubi",
    "as": "Tadubi",
    "ne": "Tadubi",
    "mni": "Tadubi",
    "lus": "Tadubi",
    "kha": "Tadubi",
    "grt": "Tadubi"
  },
  "Tamei": {
    "en": "Tamei",
    "hi": "Tamei",
    "bn": "Tamei",
    "as": "Tamei",
    "ne": "Tamei",
    "mni": "Tamei",
    "lus": "Tamei",
    "kha": "Tamei",
    "grt": "Tamei"
  },
  "Tamenglong": {
    "en": "Tamenglong",
    "hi": "तामेंगलॉन्ग",
    "bn": "তামেংলং",
    "as": "তামেংলং",
    "ne": "तामेङलोङ",
    "mni": "তামেংলোং",
    "lus": "Tamenglong",
    "kha": "Tamenglong",
    "grt": "Tamenglong"
  },
  "Tamlu": {
    "en": "Tamlu",
    "hi": "Tamlu",
    "bn": "Tamlu",
    "as": "Tamlu",
    "ne": "Tamlu",
    "mni": "Tamlu",
    "lus": "Tamlu",
    "kha": "Tamlu",
    "grt": "Tamlu"
  },
  "Tamulpur": {
    "en": "Tamulpur",
    "hi": "तामुलपुर",
    "bn": "তামুলপুর",
    "as": "তামুলপুৰ",
    "ne": "तामुलपुर",
    "mni": "তামুলপুর",
    "lus": "Tamulpur",
    "kha": "Tamulpur",
    "grt": "Tamulpur"
  },
  "Tangla": {
    "en": "Tangla",
    "hi": "Tangla",
    "bn": "Tangla",
    "as": "Tangla",
    "ne": "Tangla",
    "mni": "Tangla",
    "lus": "Tangla",
    "kha": "Tangla",
    "grt": "Tangla"
  },
  "Tato": {
    "en": "Tato",
    "hi": "Tato",
    "bn": "Tato",
    "as": "Tato",
    "ne": "Tato",
    "mni": "Tato",
    "lus": "Tato",
    "kha": "Tato",
    "grt": "Tato"
  },
  "Tawang": {
    "en": "Tawang",
    "hi": "तवांग",
    "bn": "তাওয়াং",
    "as": "টাৱাং",
    "ne": "तवाङ",
    "mni": "তৱাং",
    "lus": "Tawang",
    "kha": "Tawang",
    "grt": "Tawang"
  },
  "Teliamura": {
    "en": "Teliamura",
    "hi": "Teliamura",
    "bn": "Teliamura",
    "as": "Teliamura",
    "ne": "Teliamura",
    "mni": "Teliamura",
    "lus": "Teliamura",
    "kha": "Teliamura",
    "grt": "Teliamura"
  },
  "Tengnoupal": {
    "en": "Tengnoupal",
    "hi": "तेंगनौपाल",
    "bn": "তেংনৌপাল",
    "as": "তেংনৌপাল",
    "ne": "तेङनौपाल",
    "mni": "তেংনৌপাল",
    "lus": "Tengnoupal",
    "kha": "Tengnoupal",
    "grt": "Tengnoupal"
  },
  "Tening": {
    "en": "Tening",
    "hi": "Tening",
    "bn": "Tening",
    "as": "Tening",
    "ne": "Tening",
    "mni": "Tening",
    "lus": "Tening",
    "kha": "Tening",
    "grt": "Tening"
  },
  "Teok": {
    "en": "Teok",
    "hi": "Teok",
    "bn": "Teok",
    "as": "Teok",
    "ne": "Teok",
    "mni": "Teok",
    "lus": "Teok",
    "kha": "Teok",
    "grt": "Teok"
  },
  "Tezpur": {
    "en": "Tezpur",
    "hi": "तेजपुर",
    "bn": "তেজপুর",
    "as": "তেজপুৰ",
    "ne": "तेजपुर",
    "mni": "তেজপুর",
    "lus": "Tezpur",
    "kha": "Tezpur",
    "grt": "Tezpur"
  },
  "Tezu": {
    "en": "Tezu",
    "hi": "Tezu",
    "bn": "Tezu",
    "as": "Tezu",
    "ne": "Tezu",
    "mni": "Tezu",
    "lus": "Tezu",
    "kha": "Tezu",
    "grt": "Tezu"
  },
  "Thadlaskein": {
    "en": "Thadlaskein",
    "hi": "Thadlaskein",
    "bn": "Thadlaskein",
    "as": "Thadlaskein",
    "ne": "Thadlaskein",
    "mni": "Thadlaskein",
    "lus": "Thadlaskein",
    "kha": "Thadlaskein",
    "grt": "Thadlaskein"
  },
  "Thanlon": {
    "en": "Thanlon",
    "hi": "Thanlon",
    "bn": "Thanlon",
    "as": "Thanlon",
    "ne": "Thanlon",
    "mni": "Thanlon",
    "lus": "Thanlon",
    "kha": "Thanlon",
    "grt": "Thanlon"
  },
  "Thenzawl": {
    "en": "Thenzawl",
    "hi": "Thenzawl",
    "bn": "Thenzawl",
    "as": "Thenzawl",
    "ne": "Thenzawl",
    "mni": "Thenzawl",
    "lus": "Thenzawl",
    "kha": "Thenzawl",
    "grt": "Thenzawl"
  },
  "Thonoknyu": {
    "en": "Thonoknyu",
    "hi": "Thonoknyu",
    "bn": "Thonoknyu",
    "as": "Thonoknyu",
    "ne": "Thonoknyu",
    "mni": "Thonoknyu",
    "lus": "Thonoknyu",
    "kha": "Thonoknyu",
    "grt": "Thonoknyu"
  },
  "Thoubal": {
    "en": "Thoubal",
    "hi": "थौबल",
    "bn": "থৌবাল",
    "as": "থৌবাল",
    "ne": "थौबल",
    "mni": "থৌবাল",
    "lus": "Thoubal",
    "kha": "Thoubal",
    "grt": "Thoubal"
  },
  "Tihu": {
    "en": "Tihu",
    "hi": "Tihu",
    "bn": "Tihu",
    "as": "Tihu",
    "ne": "Tihu",
    "mni": "Tihu",
    "lus": "Tihu",
    "kha": "Tihu",
    "grt": "Tihu"
  },
  "Tikrikilla": {
    "en": "Tikrikilla",
    "hi": "Tikrikilla",
    "bn": "Tikrikilla",
    "as": "Tikrikilla",
    "ne": "Tikrikilla",
    "mni": "Tikrikilla",
    "lus": "Tikrikilla",
    "kha": "Tikrikilla",
    "grt": "Tikrikilla"
  },
  "Tinsukia": {
    "en": "Tinsukia",
    "hi": "तिनसुकिया",
    "bn": "তিনসুকিয়া",
    "as": "তিনিচুকীয়া",
    "ne": "तिनसुकिया",
    "mni": "তিনসুকিয়া",
    "lus": "Tinsukia",
    "kha": "Tinsukia",
    "grt": "Tinsukia"
  },
  "Tipaimukh": {
    "en": "Tipaimukh",
    "hi": "Tipaimukh",
    "bn": "Tipaimukh",
    "as": "Tipaimukh",
    "ne": "Tipaimukh",
    "mni": "Tipaimukh",
    "lus": "Tipaimukh",
    "kha": "Tipaimukh",
    "grt": "Tipaimukh"
  },
  "Tirbin": {
    "en": "Tirbin",
    "hi": "Tirbin",
    "bn": "Tirbin",
    "as": "Tirbin",
    "ne": "Tirbin",
    "mni": "Tirbin",
    "lus": "Tirbin",
    "kha": "Tirbin",
    "grt": "Tirbin"
  },
  "Titabar": {
    "en": "Titabar",
    "hi": "Titabar",
    "bn": "Titabar",
    "as": "Titabar",
    "ne": "Titabar",
    "mni": "Titabar",
    "lus": "Titabar",
    "kha": "Titabar",
    "grt": "Titabar"
  },
  "Tizit": {
    "en": "Tizit",
    "hi": "Tizit",
    "bn": "Tizit",
    "as": "Tizit",
    "ne": "Tizit",
    "mni": "Tizit",
    "lus": "Tizit",
    "kha": "Tizit",
    "grt": "Tizit"
  },
  "Tlabung": {
    "en": "Tlabung",
    "hi": "Tlabung",
    "bn": "Tlabung",
    "as": "Tlabung",
    "ne": "Tlabung",
    "mni": "Tlabung",
    "lus": "Tlabung",
    "kha": "Tlabung",
    "grt": "Tlabung"
  },
  "Tobu": {
    "en": "Tobu",
    "hi": "Tobu",
    "bn": "Tobu",
    "as": "Tobu",
    "ne": "Tobu",
    "mni": "Tobu",
    "lus": "Tobu",
    "kha": "Tobu",
    "grt": "Tobu"
  },
  "Tseminyu": {
    "en": "Tseminyu",
    "hi": "Tseminyu",
    "bn": "Tseminyu",
    "as": "Tseminyu",
    "ne": "Tseminyu",
    "mni": "Tseminyu",
    "lus": "Tseminyu",
    "kha": "Tseminyu",
    "grt": "Tseminyu"
  },
  "Tuensang": {
    "en": "Tuensang",
    "hi": "तुएनसांग",
    "bn": "টুয়েনসাং",
    "as": "টুৱেনচাং",
    "ne": "तुएनसाङ",
    "mni": "তুয়েনসাং",
    "lus": "Tuensang",
    "kha": "Tuensang",
    "grt": "Tuensang"
  },
  "Tuibong": {
    "en": "Tuibong",
    "hi": "Tuibong",
    "bn": "Tuibong",
    "as": "Tuibong",
    "ne": "Tuibong",
    "mni": "Tuibong",
    "lus": "Tuibong",
    "kha": "Tuibong",
    "grt": "Tuibong"
  },
  "Tuli": {
    "en": "Tuli",
    "hi": "Tuli",
    "bn": "Tuli",
    "as": "Tuli",
    "ne": "Tuli",
    "mni": "Tuli",
    "lus": "Tuli",
    "kha": "Tuli",
    "grt": "Tuli"
  },
  "Tupul": {
    "en": "Tupul",
    "hi": "Tupul",
    "bn": "Tupul",
    "as": "Tupul",
    "ne": "Tupul",
    "mni": "Tupul",
    "lus": "Tupul",
    "kha": "Tupul",
    "grt": "Tupul"
  },
  "Tura": {
    "en": "Tura",
    "hi": "तुरा",
    "bn": "তুরা",
    "as": "তুৰা",
    "ne": "तुरा",
    "mni": "তুরা",
    "lus": "Tura",
    "kha": "Tura",
    "grt": "Tura"
  },
  "Tuting": {
    "en": "Tuting",
    "hi": "Tuting",
    "bn": "Tuting",
    "as": "Tuting",
    "ne": "Tuting",
    "mni": "Tuting",
    "lus": "Tuting",
    "kha": "Tuting",
    "grt": "Tuting"
  },
  "Udaipur": {
    "en": "Udaipur",
    "hi": "उदयपुर",
    "bn": "উদয়পুর",
    "as": "উদয়পুৰ",
    "ne": "उदयपुर",
    "mni": "উদয়পুর",
    "lus": "Udaipur",
    "kha": "Udaipur",
    "grt": "Udaipur"
  },
  "Udalguri": {
    "en": "Udalguri",
    "hi": "उदलगुड़ी",
    "bn": "ওদালগুড়ি",
    "as": "ওদালগুৰি",
    "ne": "उदलगुडी",
    "mni": "উদালগুড়ি",
    "lus": "Udalguri",
    "kha": "Udalguri",
    "grt": "Udalguri"
  },
  "Ukhrul": {
    "en": "Ukhrul",
    "hi": "उखरुल",
    "bn": "উখরুল",
    "as": "উখৰুল",
    "ne": "उखरुल",
    "mni": "উখরুল",
    "lus": "Ukhrul",
    "kha": "Ukhrul",
    "grt": "Ukhrul"
  },
  "Umiam": {
    "en": "Umiam",
    "hi": "Umiam",
    "bn": "Umiam",
    "as": "Umiam",
    "ne": "Umiam",
    "mni": "Umiam",
    "lus": "Umiam",
    "kha": "Umiam",
    "grt": "Umiam"
  },
  "Umrangso": {
    "en": "Umrangso",
    "hi": "Umrangso",
    "bn": "Umrangso",
    "as": "Umrangso",
    "ne": "Umrangso",
    "mni": "Umrangso",
    "lus": "Umrangso",
    "kha": "Umrangso",
    "grt": "Umrangso"
  },
  "Umsning": {
    "en": "Umsning",
    "hi": "Umsning",
    "bn": "Umsning",
    "as": "Umsning",
    "ne": "Umsning",
    "mni": "Umsning",
    "lus": "Umsning",
    "kha": "Umsning",
    "grt": "Umsning"
  },
  "Uripok": {
    "en": "Uripok",
    "hi": "Uripok",
    "bn": "Uripok",
    "as": "Uripok",
    "ne": "Uripok",
    "mni": "Uripok",
    "lus": "Uripok",
    "kha": "Uripok",
    "grt": "Uripok"
  },
  "Vairengte": {
    "en": "Vairengte",
    "hi": "Vairengte",
    "bn": "Vairengte",
    "as": "Vairengte",
    "ne": "Vairengte",
    "mni": "Vairengte",
    "lus": "Vairengte",
    "kha": "Vairengte",
    "grt": "Vairengte"
  },
  "Viswema": {
    "en": "Viswema",
    "hi": "Viswema",
    "bn": "Viswema",
    "as": "Viswema",
    "ne": "Viswema",
    "mni": "Viswema",
    "lus": "Viswema",
    "kha": "Viswema",
    "grt": "Viswema"
  },
  "Wakro": {
    "en": "Wakro",
    "hi": "Wakro",
    "bn": "Wakro",
    "as": "Wakro",
    "ne": "Wakro",
    "mni": "Wakro",
    "lus": "Wakro",
    "kha": "Wakro",
    "grt": "Wakro"
  },
  "Walong": {
    "en": "Walong",
    "hi": "Walong",
    "bn": "Walong",
    "as": "Walong",
    "ne": "Walong",
    "mni": "Walong",
    "lus": "Walong",
    "kha": "Walong",
    "grt": "Walong"
  },
  "Wangjing": {
    "en": "Wangjing",
    "hi": "Wangjing",
    "bn": "Wangjing",
    "as": "Wangjing",
    "ne": "Wangjing",
    "mni": "Wangjing",
    "lus": "Wangjing",
    "kha": "Wangjing",
    "grt": "Wangjing"
  },
  "Wangoi": {
    "en": "Wangoi",
    "hi": "Wangoi",
    "bn": "Wangoi",
    "as": "Wangoi",
    "ne": "Wangoi",
    "mni": "Wangoi",
    "lus": "Wangoi",
    "kha": "Wangoi",
    "grt": "Wangoi"
  },
  "West Phaileng": {
    "en": "West Phaileng",
    "hi": "पश्चिम Phaileng",
    "bn": "পশ্চিম Phaileng",
    "as": "পশ্চিম Phaileng",
    "ne": "पश्चिम Phaileng",
    "mni": "নোংচুপ Phaileng",
    "lus": "Khawthlang Phaileng",
    "kha": "Mihngi Phaileng",
    "grt": "Saliram Phaileng"
  },
  "Williamnagar": {
    "en": "Williamnagar",
    "hi": "Williamnagar",
    "bn": "Williamnagar",
    "as": "Williamnagar",
    "ne": "Williamnagar",
    "mni": "Williamnagar",
    "lus": "Williamnagar",
    "kha": "Williamnagar",
    "grt": "Williamnagar"
  },
  "Wokha": {
    "en": "Wokha",
    "hi": "वोखा",
    "bn": "ওখা",
    "as": "ৱখা",
    "ne": "वोखा",
    "mni": "ৱোখা",
    "lus": "Wokha",
    "kha": "Wokha",
    "grt": "Wokha"
  },
  "Yachuli": {
    "en": "Yachuli",
    "hi": "Yachuli",
    "bn": "Yachuli",
    "as": "Yachuli",
    "ne": "Yachuli",
    "mni": "Yachuli",
    "lus": "Yachuli",
    "kha": "Yachuli",
    "grt": "Yachuli"
  },
  "Yairipok": {
    "en": "Yairipok",
    "hi": "Yairipok",
    "bn": "Yairipok",
    "as": "Yairipok",
    "ne": "Yairipok",
    "mni": "Yairipok",
    "lus": "Yairipok",
    "kha": "Yairipok",
    "grt": "Yairipok"
  },
  "Yingkiong": {
    "en": "Yingkiong",
    "hi": "Yingkiong",
    "bn": "Yingkiong",
    "as": "Yingkiong",
    "ne": "Yingkiong",
    "mni": "Yingkiong",
    "lus": "Yingkiong",
    "kha": "Yingkiong",
    "grt": "Yingkiong"
  },
  "Yupia": {
    "en": "Yupia",
    "hi": "Yupia",
    "bn": "Yupia",
    "as": "Yupia",
    "ne": "Yupia",
    "mni": "Yupia",
    "lus": "Yupia",
    "kha": "Yupia",
    "grt": "Yupia"
  },
  "Zawlnuam": {
    "en": "Zawlnuam",
    "hi": "Zawlnuam",
    "bn": "Zawlnuam",
    "as": "Zawlnuam",
    "ne": "Zawlnuam",
    "mni": "Zawlnuam",
    "lus": "Zawlnuam",
    "kha": "Zawlnuam",
    "grt": "Zawlnuam"
  },
  "Zemithang": {
    "en": "Zemithang",
    "hi": "Zemithang",
    "bn": "Zemithang",
    "as": "Zemithang",
    "ne": "Zemithang",
    "mni": "Zemithang",
    "lus": "Zemithang",
    "kha": "Zemithang",
    "grt": "Zemithang"
  },
  "Ziro": {
    "en": "Ziro",
    "hi": "ज़ीरो",
    "bn": "জিরো",
    "as": "জিৰো",
    "ne": "जिरो",
    "mni": "জিরো",
    "lus": "Ziro",
    "kha": "Ziro",
    "grt": "Ziro"
  },
  "Zokhawthar": {
    "en": "Zokhawthar",
    "hi": "Zokhawthar",
    "bn": "Zokhawthar",
    "as": "Zokhawthar",
    "ne": "Zokhawthar",
    "mni": "Zokhawthar",
    "lus": "Zokhawthar",
    "kha": "Zokhawthar",
    "grt": "Zokhawthar"
  },
  "Zunheboto": {
    "en": "Zunheboto",
    "hi": "जुन्हेबोटो",
    "bn": "জুনহেবোটো",
    "as": "জুনহেব'ট'",
    "ne": "जुन्हेबोटो",
    "mni": "জুন্হেবোতো",
    "lus": "Zunheboto",
    "kha": "Zunheboto",
    "grt": "Zunheboto"
  }
};

/**
 * Normalizes language code from i18n instance or string
 */
export function normalizeLanguage(lang?: string): LanguageCode {
  if (!lang) return "en";
  const first = lang.split("-")[0];
  const clean = (first ? first.toLowerCase() : "en") as LanguageCode;
  const valid: LanguageCode[] = ["en", "hi", "bn", "as", "ne", "mni", "lus", "kha", "grt"];
  return valid.includes(clean) ? clean : "en";
}

/**
 * Returns localized zone name for monitored zones 1-15
 */
export function getLocalizedZoneName(
  zoneId: number | string,
  defaultName?: string,
  tOrLang?: any
): string {
  const idNum = Number(zoneId);
  const lang: LanguageCode =
    typeof tOrLang === "string"
      ? normalizeLanguage(tOrLang)
      : tOrLang?.i18n?.language
      ? normalizeLanguage(tOrLang.i18n.language)
      : typeof window !== "undefined"
      ? normalizeLanguage(window.localStorage?.getItem("landalert_ui_language") || "en")
      : "en";

  const zoneObj = ZONE_TRANSLATIONS[idNum];
  if (zoneObj && zoneObj[lang]) {
    return zoneObj[lang];
  }

  if (defaultName) {
    if (CITY_TRANSLATIONS[defaultName]?.[lang]) return CITY_TRANSLATIONS[defaultName][lang];
    if (DISTRICT_TRANSLATIONS[defaultName]?.[lang]) return DISTRICT_TRANSLATIONS[defaultName][lang];
    return defaultName;
  }

  return `Zone ${zoneId}`;
}

/**
 * Returns localized district name
 */
export function getLocalizedDistrict(districtName: string, tOrLang?: any): string {
  if (!districtName) return "";
  const lang: LanguageCode =
    typeof tOrLang === "string"
      ? normalizeLanguage(tOrLang)
      : tOrLang?.i18n?.language
      ? normalizeLanguage(tOrLang.i18n.language)
      : typeof window !== "undefined"
      ? normalizeLanguage(window.localStorage?.getItem("landalert_ui_language") || "en")
      : "en";

  if (DISTRICT_TRANSLATIONS[districtName]?.[lang]) {
    return DISTRICT_TRANSLATIONS[districtName][lang];
  }

  const baseName = districtName.replace(/\s*\([^)]*\)/, "").trim();
  if (DISTRICT_TRANSLATIONS[baseName]?.[lang]) {
    return DISTRICT_TRANSLATIONS[baseName][lang];
  }

  return districtName;
}

/**
 * Returns localized state name
 */
export function getLocalizedState(stateName: string, tOrLang?: any): string {
  if (!stateName) return "";
  const lang: LanguageCode =
    typeof tOrLang === "string"
      ? normalizeLanguage(tOrLang)
      : tOrLang?.i18n?.language
      ? normalizeLanguage(tOrLang.i18n.language)
      : typeof window !== "undefined"
      ? normalizeLanguage(window.localStorage?.getItem("landalert_ui_language") || "en")
      : "en";

  if (STATE_TRANSLATIONS[stateName]?.[lang]) {
    return STATE_TRANSLATIONS[stateName][lang];
  }

  return stateName;
}

/**
 * Returns localized city name
 */
export function getLocalizedCityName(cityName: string, tOrLang?: any): string {
  if (!cityName) return "";
  const lang: LanguageCode =
    typeof tOrLang === "string"
      ? normalizeLanguage(tOrLang)
      : tOrLang?.i18n?.language
      ? normalizeLanguage(tOrLang.i18n.language)
      : typeof window !== "undefined"
      ? normalizeLanguage(window.localStorage?.getItem("landalert_ui_language") || "en")
      : "en";

  if (CITY_TRANSLATIONS[cityName]?.[lang]) {
    return CITY_TRANSLATIONS[cityName][lang];
  }

  if (DISTRICT_TRANSLATIONS[cityName]?.[lang]) {
    return DISTRICT_TRANSLATIONS[cityName][lang];
  }

  return cityName;
}

/**
 * Formats a localized location string for a zone:
 * e.g. "তামেংলং (তামেংলং, মণিপুৰ)"
 */
export function getLocalizedZoneLocation(
  zone: { id?: number; zone_name: string; district: string; state: string },
  tOrLang?: any
): string {
  if (!zone) return "";
  const zName = getLocalizedZoneName(zone.id ?? 0, zone.zone_name, tOrLang);
  const dist = getLocalizedDistrict(zone.district, tOrLang);
  const st = getLocalizedState(zone.state, tOrLang);
  return `${zName} (${dist}, ${st})`;
}

/**
 * Dynamic factor translation mappings
 */
const FACTOR_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "72-hr rainfall intensity": {
    en: "72-hr rainfall intensity",
    hi: "72-घंटे की वर्षा तीव्रता",
    bn: "৭২-ঘণ্টার বৃষ্টিপাতের তীব্রতা",
    as: "৭২-ঘণ্টাৰ বৰষুণৰ তীব্রতা",
    ne: "७२-घण्टाको वर्षाको तीव्रता",
    mni: "পুং ৭২গী নোংগী কন্নবা",
    lus: "Darkar 72 ruah sur nasat zawng",
    kha: "Ka jingjur slap 72 kynta",
    grt: "Kynta 72 mikka jiman",
  },
  "30-day antecedent rainfall": {
    en: "30-day antecedent rainfall",
    hi: "30-दिवसीय पूर्ववर्ती वर्षा",
    bn: "৩০-দিনের পূর্ববর্তী বৃষ্টিপাত",
    as: "৩০-দিনীয়া পূর্ববর্তী বৰষুণ",
    ne: "३०-दिने पूर्ववर्ती वर्षा",
    mni: "নুমিৎ ৩০গী নোংজু",
    lus: "Ni 30 chhung ruah sur tawh",
    kha: "U slap 30 sngi",
    grt: "Sal 30-na mikka chimik",
  },
  "soil moisture": {
    en: "soil moisture",
    hi: "मृदा नमी",
    bn: "মাটির আর্দ্রতা",
    as: "মাটিৰ আর্দ্রতা",
    ne: "माटोको ओसिलोपना",
    mni: "লৈবাক্কী অশেৎপা",
    lus: "Lei hnawng",
    kha: "Ka jingsngem ka khyndew",
    grt: "A·ani soka",
  },
  "terrain slope": {
    en: "terrain slope",
    hi: "भूभाग ढलान",
    bn: "পাহাড়ের ঢাল",
    as: "পাহাৰৰ হেলনীয়া অৱস্থা",
    ne: "भिरालो जमिन",
    mni: "চীংগী শ্লোপ",
    lus: "Awmphang",
    kha: "Ka jingriat",
    grt: "A·bri chidap",
  },
  "historical landslide density": {
    en: "historical landslide density",
    hi: "ऐतिहासिक भूस्खलन घनत्व",
    bn: "ঐতিহাসিক ভূমিধসের ঘনত্ব",
    as: "ঐতিহাসিক ভূমিস্খলনৰ ঘনত্ব",
    ne: "ऐतिहासिक पहिरोको घनत्व",
    mni: "মমাংগী চীংহায়বা",
    lus: "Chanchin hlui lei min",
    kha: "Ki jingtwap rim",
    grt: "Gitcham a·a beani",
  },
};

function translateFactorList(listStr: string, lang: LanguageCode): string {
  if (!listStr || listStr.trim() === "" || listStr === "none significant") {
    const noneMap: Record<LanguageCode, string> = {
      en: "none significant",
      hi: "कोई महत्वपूर्ण नहीं",
      bn: "কোনো উল্লেখযোগ্য নেই",
      as: "কোনো উল্লেখযোগ্য নাই",
      ne: "कुनै उल्लेखनीय छैन",
      mni: "অতোপ্পা লৈতে",
      lus: "Engmah a awm lo",
      kha: "Ym don kiba ma",
      grt: "Maming gnang dongja",
    };
    return noneMap[lang] || "none significant";
  }

  const items = listStr.split(",").map((s) => s.trim());
  const translated = items.map((item) => {
    for (const [key, mapping] of Object.entries(FACTOR_TRANSLATIONS)) {
      if (item.toLowerCase().includes(key.toLowerCase())) {
        return mapping[lang] || key;
      }
    }
    return item;
  });
  return translated.join(", ");
}

/**
 * Translates dynamic hydrological explanations across all 9 languages.
 */
export function getLocalizedExplanation(
  explanation: string | null | undefined,
  tOrLang?: any,
  explicitLang?: string
): string {
  if (!explanation) return "";

  const lang: LanguageCode = explicitLang
    ? normalizeLanguage(explicitLang)
    : typeof tOrLang === "string"
    ? normalizeLanguage(tOrLang)
    : tOrLang?.i18n?.language
    ? normalizeLanguage(tOrLang.i18n.language)
    : typeof window !== "undefined"
    ? normalizeLanguage(window.localStorage?.getItem("landalert_ui_language") || "en")
    : "en";

  if (lang === "en") return explanation;

  // 1. Dynamic Ranking format (matches both DB and Python inference engine strings):
  const dynamicMatch = explanation.match(
    /(?:Main driver|Main risk driver):\s*([^\(]+?)\s*(?:\(([^\)]+)\))?\.\s*Secondary contributors:\s*([^\.]+)\.\s*Detail — 72-hr rainfall:\s*([0-9\.]+)mm\s*(?:\/\s*3-day\s*[0-9\.]+mm\s*)?\(intensity\s*([0-9\.]+)\s*mm\/day\s*vs\s*zone threshold(?:\s*ratio:|\s*)([0-9\.]+)\s*(?:mm\/day)?;\s*(?:threshold source:\s*)?([^\)]*)\)\.\s*30-day antecedent:\s*([0-9\.]+)mm\s*vs\s*zone E-threshold\s*([0-9\.]+)mm\.\s*Soil moisture:\s*([0-9\.]+)%(?:\s*\([^\)]*\))?\.\s*Slope:\s*([0-9\.]+)°\.\s*Historical events in zone:\s*([0-9]+)\.\s*(?:Combined score|Combined operational score):\s*([0-9\.]+)\/100\s*(?:→|->)\s*([^\.]+)/i
  );

  if (dynamicMatch) {
    const [, rawDriver, rawPct, rawSecondary, r72, iObs, iThr, src, r30, eThr, soil, slope, hist, score, lvl] =
      dynamicMatch;

    if (!rawDriver || !lvl) return explanation;

    const driverKey = rawDriver.trim();
    const translatedDriver =
      FACTOR_TRANSLATIONS[driverKey]?.[lang] || driverKey;
    const translatedSecondary = translateFactorList(rawSecondary || "", lang);
    const pctVal = rawPct ? rawPct.replace(/[^0-9%]/g, "").trim() : "";
    const pctStr = pctVal ? ` (${pctVal})` : "";

    const levelMap: Record<string, Record<LanguageCode, string>> = {
      Severe: {
        en: "Severe",
        hi: "अति गंभीर",
        bn: "মারাত্মক",
        as: "গুৰুতৰ",
        ne: "गम्भीर",
        mni: "য়াম্না ৱাংবা",
        lus: "Sang tawpkhawk",
        kha: "Jur bha",
        grt: "Kenbegnibegipa",
      },
      High: {
        en: "High",
        hi: "उच्च",
        bn: "উচ্চ",
        as: "উচ্চ",
        ne: "उच्च",
        mni: "অকনবা",
        lus: "Sang",
        kha: "Kaba ma",
        grt: "Kengipa",
      },
      Moderate: {
        en: "Moderate",
        hi: "मध्यम",
        bn: "মাঝারি",
        as: "মধ্যম",
        ne: "मध्यम",
        mni: "ময়ায় ওইবা",
        lus: "Vangtlang",
        kha: "Pdeng",
        grt: "Jatchi",
      },
      Low: {
        en: "Low",
        hi: "निम्न",
        bn: "নিম্ন",
        as: "নিম্ন",
        ne: "न्यून",
        mni: "নেম্বা",
        lus: "Tlem",
        kha: "Kaba poh",
        grt: "Komgipa",
      },
    };

    const localizedLevel = levelMap[lvl.trim()]?.[lang] || lvl.trim();

    switch (lang) {
      case "hi":
        return `प्रमुख कारण: ${translatedDriver}${pctStr}। गौण कारक: ${translatedSecondary}। विवरण — 72 घंटे की वर्षा: ${r72} मिमी (तीव्रता ${iObs} मिमी/दिन बनाम ज़ोन सीमा ${iThr} मिमी/दिन; स्रोत: ${src || "IMD"})। 30-दिवसीय पूर्ववर्ती वर्षा: ${r30} मिमी बनाम सीमा ${eThr} मिमी। मृदा नमी: ${soil}%। ढलान: ${slope}°। ऐतिहासिक भूस्खलन: ${hist}। संयुक्त जोखिम स्कोर: ${score}/100 → ${localizedLevel}।`;
      case "bn":
        return `প্রধান কারণ: ${translatedDriver}${pctStr}। গৌণ কারণ: ${translatedSecondary}। বিস্তারিত — ৭২ ঘণ্টার বৃষ্টিপাত: ${r72} মিমি (তীব্রতা ${iObs} মিমি/দিন বনাম অঞ্চল থ্রেশহোল্ড ${iThr} মিমি/দিন; উৎস: ${src || "IMD"})। ৩০ দিনের পূর্ববর্তী বৃষ্টিপাত: ${r30} মিমি বনাম থ্রেশহোল্ড ${eThr} মিমি। মাটির আর্দ্রতা: ${soil}%। ঢাল: ${slope}°। ঐতিহাসিক ভূমিধস: ${hist}। সম্মিলিত ঝুঁকি স্কোর: ${score}/১০০ → ${localizedLevel}।`;
      case "as":
        return `মুখ্য কাৰক: ${translatedDriver}${pctStr}। গৌণ কাৰকসমূহ: ${translatedSecondary}। সবিশেষ — ৭২ ঘণ্টাৰ বৰষুণ: ${r72} মিমি (তীব্রতা ${iObs} মিমি/দিন বনাম এলেকা সীমা ${iThr} মিমি/দিন; উৎস: ${src || "IMD"})। ৩০ দিনীয়া পূর্ববর্তী বৰষুণ: ${r30} মিমি বনাম সীমা ${eThr} মিমি। মাটিৰ আৰ্দ্ৰতা: ${soil}%। হেলনীয়া অৱস্থা: ${slope}°। ঐতিহাসিক ভূমিস্খলন: ${hist}। সন্মিলিত স্কোৰ: ${score}/১০০ → ${localizedLevel}।`;
      case "ne":
        return `प्रमुख कारक: ${translatedDriver}${pctStr}। सहायक कारकहरू: ${translatedSecondary}। विवरण — ७२ घण्टाको वर्षा: ${r72} मिमी (तीव्रता ${iObs} मिमी/दिन विरुद्ध क्षेत्र सीमा ${iThr} मिमी/दिन; स्रोत: ${src || "IMD"})। ३० दिने पूर्ववर्ती वर्षा: ${r30} मिमी विरुद्ध सीमा ${eThr} मिमी। माटोको ओसिलोपना: ${soil}%। भिरालोपन: ${slope}°। ऐतिहासिक पहिरो: ${hist}। संयुक्त जोखिम अङ्क: ${score}/१০০ → ${localizedLevel}।`;
      case "mni":
        return `মরুওইবা মরম: ${translatedDriver}${pctStr}। অতৈ মরমশিং: ${translatedSecondary}। অকুপ্পা মরোল — পুং ৭২গী নোংজু: ${r72} মিমি (কন্নবা ${iObs} মিমি/নুমিৎ বনাম থ্রেশহোল্ড ${iThr} মিমি/নুমিৎ; সোর্স: ${src || "IMD"})। নুমিৎ ৩০গী নোংজু: ${r30} মিমি বনাম থ্রেশহোল্ড ${eThr} মিমি। লৈবাক্কী অশেৎপা: ${soil}%। শ্লোপ: ${slope}°। মমাংগী চীংহায়বা: ${hist}। অপুনবা স্কোর: ${score}/১০০ → ${localizedLevel}।`;
      case "lus":
        return `A bulpui ber: ${translatedDriver}${pctStr}. A dangte: ${translatedSecondary}. Chipchiar — darkar 72 ruah sur: ${r72}mm (sur nasat zawng ${iObs} mm/ni vs threshold ${iThr} mm/ni; source: ${src || "IMD"}). Ni 30 chhung ruah sur: ${r30}mm vs E-threshold ${eThr}mm. Lei hnawng: ${soil}%. Awmphang: ${slope}°. Chanchin hlui lei min: ${hist}. Risk score belhkhawm: ${score}/100 → ${localizedLevel}.`;
      case "kha":
        return `Ka daw tynrai: ${translatedDriver}${pctStr}. Kiwei pat: ${translatedSecondary}. Bniah — slap 72 kynta: ${r72}mm (ka jingjur ${iObs} mm/sngi vs pud ${iThr} mm/sngi; source: ${src || "IMD"}). Slap 30 sngi: ${r30}mm vs pud ${eThr}mm. Jing sngem khyndew: ${soil}%. Jingriat: ${slope}°. Jingtwap khyndew rim: ${hist}. Jingkhein jingma: ${score}/100 → ${localizedLevel}.`;
      case "grt":
        return `Mongsong a·sel: ${translatedDriver}${pctStr}. Gipin a·selrang: ${translatedSecondary}. Tale — kynta 72 mikka: ${r72}mm (mikka jiman ${iObs} mm/sal vs threshold ${iThr} mm/sal; source: ${src || "IMD"}). Sal 30-na mikka chimik: ${r30}mm vs threshold ${eThr}mm. A·ani soka: ${soil}%. A·bri chidap: ${slope}°. Gitcham a·a beani: ${hist}. Risk score gimik: ${score}/100 → ${localizedLevel}.`;
    }
  }

  // 2. Legacy formula format:
  const legacyMatch = explanation.match(
    /72-hr cumulative rainfall of\s*([0-9\.]+)mm\s*gives an intensity of\s*([0-9\.]+)\s*mm\/day\s*against the\s*(.*?)\s*I-D threshold of\s*([0-9\.]+)\s*mm\/day.*?30-day antecedent rainfall is\s*([0-9\.]+)mm\s*against the\s*(?:.*?)\s*([0-9\.]+)mm.*?Mean terrain slope\s*([0-9\.]+)\s*deg and\s*([0-9]+)\s*recorded historical landslide\(s\).*?Combined risk score:\s*([0-9\.]+)\s*\/\s*100\s*which maps to\s*([^\.]+)/is
  );

  if (legacyMatch) {
    const [, r72, iObs, region, iThr, r30, eThr, slope, hist, score, lvl] = legacyMatch;
    switch (lang) {
      case "hi":
        return `72 घंटे की कुल ${r72} मिमी वर्षा से ${iObs} मिमी/दिन की तीव्रता प्राप्त होती है (सीमा: ${iThr} मिमी/दिन)। 30-दिवसीय पूर्ववर्ती वर्षा ${r30} मिमी है (नमी सीमा: ${eThr} मिमी)। औसत ढलान ${slope}° और ${hist} दर्ज ऐतिहासिक भूस्खलन भूभाग जोखिम को बढ़ाते हैं। संयुक्त जोखिम स्कोर: ${score}/100 (${lvl})।`;
      case "bn":
        return `৭২ ঘণ্টার সঞ্চিত ${r72} মিমি বৃষ্টিপাত ${iObs} মিমি/দিন তীব্রতা নির্দেশ করে (থ্রেশহোল্ড: ${iThr} মিমি/দিন)। ৩০ দিনের পূর্ববর্তী বৃষ্টিপাত ${r30} মিমি (আর্দ্রতা সীমা: ${eThr} মিমি)। গড় ঢাল ${slope}° এবং ${hist}টি ঐতিহাসিক ভূমিধস রয়েছে। সম্মিলিত ঝুঁকি স্কোর: ${score}/১০০ (${lvl})।`;
      case "as":
        return `৭২ ঘণ্টাৰ মুঠ ${r72} মিমি বৰষুণে ${iObs} মিমি/দিন তীব্রতা দিয়ে (সীমা: ${iThr} মিমি/দিন)। ৩০ দিনীয়া পূৰ্বৱৰ্তী বৰষুণ ${r30} মিমি (আর্দ্রতা সীমা: ${eThr} মিমি)। গড় পাহাৰীয়া ঢাল ${slope}° আৰু ${hist}টা ঐতিহাসিক ভূমিস্খলন নথিভুক্ত। সন্মিলিত স্কোৰ: ${score}/১০০ (${lvl})।`;
      case "ne":
        return `७२ घण्टाको कुल ${r72} मिमी वर्षाले ${iObs} मिमी/दिन तीव्रता दिन्छ (सीमा: ${iThr} मिमी/दिन)। ३० दिने पूर्ववर्ती वर्षा ${r30} मिमी छ (ओसिलोपना सीमा: ${eThr} मिमी)। औसत ढलान ${slope}° र ${hist} ऐतिहासिक पहिरो दर्ता भएका छन्। संयुक्त जोखिम अङ्क: ${score}/१०० (${lvl})।`;
      case "mni":
        return `পুং ৭২গী অপুনবা নোং ${r72} মিমিনা নুমিৎতা ${iObs} মিমিগী কন্নবা পীরি (থ্রেশহোল্ড: ${iThr} মিমি)। নুমিৎ ৩০গী নোংজু ${r30} মিমি (অশেৎপাগী সীমা: ${eThr} মিমি)। ময়ায় ওইবা শ্লোপ ${slope}° অমসুং মমাংগী চীংহায়বা ${hist}নি। অপুনবা স্কোর: ${score}/১০০ (${lvl})।`;
      case "lus":
        return `Darkar 72 chhung ruah sur ${r72}mm hian ni tin ${iObs} mm/ni a pe (threshold: ${iThr} mm/ni). Ni 30 ruah sur zat chu ${r30}mm (hnawnna threshold: ${eThr}mm). Awmphang ${slope}° leh lei min hlui ${hist} a awm. Risk score belhkhawm: ${score}/100 (${lvl}).`;
      case "kha":
        return `U slap 72 kynta uba ${r72}mm u pynmih ${iObs} mm/sngi (pud: ${iThr} mm/sngi). Slap 30 sngi u long ${r30}mm (pud sngem: ${eThr}mm). Jingriat lum ${slope}° bad ki jingtwap rim ${hist}. Jingkhein jingma: ${score}/100 (${lvl}).`;
      case "grt":
        return `Kynta 72 mikka ${r72}mm-ni bidingo salprak ${iObs} mm/sal (threshold: ${iThr} mm/sal). Sal 30 mikka ${r30}mm (sokani threshold: ${eThr}mm). A·bri chidap ${slope}° aro gitcham a·a beani ${hist}. Risk score gimik: ${score}/100 (${lvl}).`;
    }
  }

  return explanation;
}

export const ALERT_TEMPLATES: Record<
  LanguageCode,
  (zone: string, level: string) => string
> = {
  en: (zone, level) =>
    `${level.toUpperCase()} landslide risk in ${zone}. Avoid slope-cut roads. Report cracks or slumping to your district control room.`,
  as: (zone, level) =>
    `${zone}ত ভূমিস্খলনৰ ${level === "Severe" ? "গুৰুতৰ" : "উচ্চ"} আশংকা। পাহাৰীয়া পথ এৰাই চলক। ফাট বা মাটি সৰি পৰা দেখিলে জিলা নিয়ন্ত্ৰণ কক্ষক জনাওক।`,
  bn: (zone, level) =>
    `${zone}-এ ভূমিধসের ${level === "Severe" ? "মারাত্মক" : "উচ্চ"} ঝুঁকি। পাহাড়ি রাস্তা এড়িয়ে চলুন। ফাটল বা ধস দেখলে জেলা নিয়ন্ত্রণ কক্ষে জানান।`,
  ne: (zone, level) =>
    `${zone} मा पहिरोको ${level === "Severe" ? "गम्भीर" : "उच्च"} जोखिम। भिरालो सडक नजानुहोस्। चिरा वा पहिरो देखिए जिल्ला नियन्त्रण कक्षलाई खबर गर्नुहोस्।`,
  hi: (zone, level) =>
    `${zone} में भूस्खलन का ${level === "Severe" ? "अति गंभीर" : "उच्च"} जोखिम। ढलान वाले मार्गों पर जाने से बचें। दरारें दिखने पर जिला नियंत्रण कक्ष को तुरंत सूचित करें।`,
  mni: (zone, level) =>
    `${zone} দা চীংহায়বগী ${level === "Severe" ? "য়াম্না ৱাংবা" : "অকনবা"} খুদোংথীবা লৈরে। চীংগী লম্বী চৎপদা চেকশিনবীয়ু। মফম চৎহায়বা উবদা ডিষ্ট্রিক্ট কন্ত্রোল রুমদা পাউ পীবীয়ু।`,
  lus: (zone, level) =>
    `${zone}-ah lei min hlauhawmna a ${level === "Severe" ? "sang tawpkhawk" : "sang"}. Chhengchhe kawngah fimkhur rawh. Lei khi i hmuh chuan district control room hriattir vat rawh.`,
  kha: (zone, level) =>
    `Ka jingtwap khyndew ha ${zone} ka long kaba ${level === "Severe" ? "jur bha" : "ma"}. Kyntait ban iaid lynti lum. Lada lap ba pait khyndew pyntip kloi sha district control room.`,
  grt: (zone, level) =>
    `${zone}-o a·a bel·ani ${level === "Severe" ? "kenbegnibegipa" : "kengipa"} obosta donga. A·bri ramarango re·rurana simsakbo. A·a bretako nikode district control room-ona paratbo.`,
};

export function getLocalizedAlertMessage(
  zoneName: string,
  riskLevel: string,
  langOrT?: any
): string {
  const lang = normalizeLanguage(
    typeof langOrT === "string"
      ? langOrT
      : langOrT?.i18n?.language || "en"
  );
  const fn = ALERT_TEMPLATES[lang] || ALERT_TEMPLATES.en;
  return fn(zoneName, riskLevel);
}

