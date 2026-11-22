/**
 * Odisha 30 Districts and 147 Assembly Constituencies
 * OSD Movement (Odisha Swabhiman Defender)
 */
const ODISHA_DISTRICTS = {
  "Angul": ["Pallahara", "Chhendipada", "Athamallik", "Angul", "Talcher"],
  "Balangir": ["Loisingha", "Patnagarh", "Balangir", "Titlagarh", "Kantabanji"],
  "Balasore": ["Jaleswar", "Bhograi", "Basta", "Balasore", "Remuna", "Nilgiri", "Soro", "Simulia"],
  "Bargarh": ["Padampur", "Bijepur", "Bargarh", "Attabira", "Bhatli"],
  "Bhadrak": ["Bhandaripokhari", "Bhadrak", "Basudevpur", "Dhamnagar", "Chandabali"],
  "Boudh": ["Kantamal", "Boudh"],
  "Cuttack": ["Barabati-Cuttack", "Choudwar-Cuttack", "Cuttack Sadar", "Salipur", "Mahanga", "Niali", "Banki", "Athagarh", "Badamba"],
  "Deogarh": ["Deogarh"],
  "Dhenkanal": ["Kamakhyanagar", "Parjanga", "Dhenkanal", "Hindol"],
  "Gajapati": ["Mohana", "Paralakhemundi"],
  "Ganjam": ["Bhanjanagar", "Polasara", "Kabisuryanagar", "Khalikote", "Chhatrapur", "Aska", "Sorada", "Sanakhemundi", "Hinjili", "Gopalpur", "Berhampur", "Digapahandi", "Chikiti"],
  "Jagatsinghpur": ["Paradeep", "Tirtol", "Balikuda-Erasama", "Jagatsinghpur"],
  "Jajpur": ["Binjharpur", "Bari", "Barchana", "Dharmasala", "Jajpur", "Korei", "Sukinda"],
  "Jharsuguda": ["Brajarajnagar", "Jharsuguda"],
  "Kalahandi": ["Bhawanipatna", "Junagarh", "Dharmagarh", "Narla", "Lanjigarh"],
  "Kandhamal": ["Baliguda", "G. Udayagiri", "Phulbani"],
  "Kendrapara": ["Aul", "Rajanagar", "Mahakalapada", "Kendrapara", "Patkura"],
  "Kendujhar": ["Telkoi", "Ghasipura", "Anandapur", "Patna", "Keonjhar", "Champua"],
  "Khordha": ["Jayadev", "Bhubaneswar Central", "Bhubaneswar North", "Ekamra-Bhubaneswar", "Jatani", "Begunia", "Khurda", "Chilika"],
  "Koraput": ["Kotpad", "Jeypore", "Koraput", "Pottangi"],
  "Malkangiri": ["Malkangiri", "Chitrakonda"],
  "Mayurbhanj": ["Jashipur", "Saraskana", "Rairangpur", "Bangiriposi", "Karanjia", "Udala", "Badasahi", "Baripada", "Morada"],
  "Nabarangpur": ["Umerkote", "Jharigam", "Nabarangpur", "Dabugam"],
  "Nayagarh": ["Daspalla", "Ranpur", "Khandapada", "Nayagarh"],
  "Nuapada": ["Nuapada", "Khariar"],
  "Puri": ["Kakatpur", "Nimapara", "Puri", "Brahmagiri", "Satyabadi", "Pipili"],
  "Rayagada": ["Gunupur", "Bissam Cuttack", "Rayagada"],
  "Sambalpur": ["Kuchinda", "Rengali", "Sambalpur", "Rairakhol"],
  "Subarnapur": ["Birmaharajpur", "Sonepur"],
  "Sundargarh": ["Talsara", "Sundargarh", "Biramitrapur", "Rourkela", "Raghunathpali", "Panposh", "Rajgangpur", "Bonai"]
};

const ODISHA_DISTRICTS_OR = {
  "Angul": "ଅନୁଗୋଳ",
  "Balangir": "ବଲାଙ୍ଗୀର",
  "Balasore": "ବାଲେଶ୍ୱର",
  "Bargarh": "ବରଗଡ଼",
  "Bhadrak": "ଭଦ୍ରକ",
  "Boudh": "ବୌଦ୍ଧ",
  "Cuttack": "କଟକ",
  "Deogarh": "ଦେବଗଡ଼",
  "Dhenkanal": "ଢେଙ୍କାନାଳ",
  "Gajapati": "ଗଜପତି",
  "Ganjam": "ଗଞ୍ଜାମ",
  "Jagatsinghpur": "ଜଗତସିଂହପୁର",
  "Jajpur": "ଯାଜପୁର",
  "Jharsuguda": "ଝାରସୁଗୁଡ଼ା",
  "Kalahandi": "କଳାହାଣ୍ଡି",
  "Kandhamal": "କନ୍ଧମାଳ",
  "Kendrapara": "କେନ୍ଦ୍ରାପଡ଼ା",
  "Kendujhar": "କେନ୍ଦୁଝର",
  "Khordha": "ଖୋର୍ଦ୍ଧା",
  "Koraput": "କୋରାପୁଟ",
  "Malkangiri": "ମାଲକାନଗିରି",
  "Mayurbhanj": "ମୟୂରଭଞ୍ଜ",
  "Nabarangpur": "ନବରଙ୍ଗପୁର",
  "Nayagarh": "ନୟାଗଡ଼",
  "Nuapada": "ନୂଆପଡ଼ା",
  "Puri": "ପୁରୀ",
  "Rayagada": "ରାୟଗଡ଼ା",
  "Sambalpur": "ସମ୍ବଲପୁର",
  "Subarnapur": "ସୁବର୍ଣ୍ଣପୁର",
  "Sundargarh": "ସୁନ୍ଦରଗଡ଼"
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ODISHA_DISTRICTS, ODISHA_DISTRICTS_OR };
}
