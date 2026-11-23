/**
 * Odisha Complete Geographic Dataset
 * 30 Districts, 147 Assembly Constituencies, 314 CD Blocks, and All Urban Local Bodies
 * OSD Connect (Odisha Swabhiman Defender)
 */
const ODISHA_LOCATIONS = {
  "Angul": {
    "nameOr": "ଅନୁଗୋଳ",
    "constituencies": [
      "Pallahara",
      "Chhendipada",
      "Athamallik",
      "Angul",
      "Talcher"
    ],
    "ulbs": [
      {
        "name": "Angul Municipality",
        "nameOr": "ଅନୁଗୋଳ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 23
      },
      {
        "name": "Talcher Municipality",
        "nameOr": "ତାଳଚେର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 21
      },
      {
        "name": "Athamallik NAC",
        "nameOr": "ଆଠମଲ୍ଲିକ ଏନଏସି",
        "type": "NAC",
        "wards": 11
      }
    ],
    "blocks": [
      {
        "name": "Angul Sadar",
        "nameOr": "ଅନୁଗୋଳ ସଦର",
        "gps": [
          "Balasingha",
          "Bantala",
          "Balaramprasad",
          "Basala",
          "Bedasasan",
          "Chheliapada",
          "Dhokuta",
          "Hakimpada",
          "Kangula",
          "Kothabhuin",
          "Kumand",
          "Purunakote",
          "Turanga"
        ]
      },
      {
        "name": "Athamallik",
        "nameOr": "ଆଠମଲ୍ଲିକ",
        "gps": [
          "Aida",
          "Akharabandha",
          "Ambasarmunda",
          "Handapa",
          "Kaintarapur",
          "Kishorenagar",
          "Kudasingha",
          "Madhabapur",
          "Nuagaon",
          "Purunamanatri",
          "Thakurgarh"
        ]
      },
      {
        "name": "Banarpal",
        "nameOr": "ବଣରପାଳ",
        "gps": [
          "Balaramprasad",
          "Banarpal",
          "Budhapanka",
          "Fakirpur",
          "Gotamara",
          "Kaniha",
          "Kulad",
          "Mahidharpur",
          "Nalconagar",
          "Nuahata",
          "Tulasipal"
        ]
      },
      {
        "name": "Chhendipada",
        "nameOr": "ଛେଣ୍ଡିପଦା",
        "gps": [
          "Bagdia",
          "Bahalsahi",
          "Chhendipada",
          "Devalapur",
          "Kainsi",
          "Kandhal",
          "Kosala",
          "Kukudang",
          "Patrapada",
          "Similisahi"
        ]
      },
      {
        "name": "Kaniha",
        "nameOr": "କଣିହାଁ",
        "gps": [
          "Bajrakote",
          "Badasalapada",
          "Derang",
          "Hariharpur",
          "Kaniha",
          "Khamar",
          "Parabil",
          "Rengali",
          "Samal",
          "Susuda"
        ]
      },
      {
        "name": "Kishorenagar",
        "nameOr": "କିଶୋରନଗର",
        "gps": [
          "Angapada",
          "Bamur",
          "Dhauragoth",
          "Jhadbandha",
          "Kadapada",
          "Kishorenagar",
          "Nuniapada",
          "Sanahula",
          "Urukula"
        ]
      },
      {
        "name": "Pallahara",
        "nameOr": "ପାଲଲହଡ଼ା",
        "gps": [
          "Bandhabhuin",
          "Batagaon",
          "Chasagurundi",
          "Dimiria",
          "Khamar",
          "Malyagiri",
          "Nandichhor",
          "Pallahara",
          "Rengalbeda",
          "Seepur"
        ]
      },
      {
        "name": "Talcher Block",
        "nameOr": "ତାଳଚେର ବ୍ଲକ",
        "gps": [
          "Balhar",
          "Brajanathpur",
          "Dera",
          "Ghantapada",
          "Gurujang",
          "Hingula",
          "Kalamchhuin",
          "Kandhal",
          "Padmabati",
          "Sanakhaman"
        ]
      }
    ]
  },
  "Balangir": {
    "nameOr": "ବଲାଙ୍ଗୀର",
    "constituencies": [
      "Loisingha",
      "Patnagarh",
      "Balangir",
      "Titlagarh",
      "Kantabanji"
    ],
    "ulbs": [
      {
        "name": "Balangir Municipality",
        "nameOr": "ବଲାଙ୍ଗୀର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 21
      },
      {
        "name": "Titlagarh Municipality",
        "nameOr": "ଟିଟିଲାଗଡ଼ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 15
      },
      {
        "name": "Patnagarh NAC",
        "nameOr": "ପାଟଣାଗଡ଼ ଏନଏସି",
        "type": "NAC",
        "wards": 15
      },
      {
        "name": "Kantabanji NAC",
        "nameOr": "କଣ୍ଟାବାଞ୍ଜି ଏନଏସି",
        "type": "NAC",
        "wards": 16
      },
      {
        "name": "Tushura NAC",
        "nameOr": "ତୁଷୁରା ଏନଏସି",
        "type": "NAC",
        "wards": 12
      }
    ],
    "blocks": [
      {
        "name": "Agalpur (Rajna)",
        "nameOr": "ଅଗଲପୁର",
        "gps": [
          "Agalpur",
          "Bhaludunguri",
          "Budhadunguri",
          "Dulampur",
          "Fasiyomal",
          "Kutasingha",
          "Naigaon",
          "Nuagaon",
          "Roth"
        ]
      },
      {
        "name": "Balangir Sadar",
        "nameOr": "ବଲାଙ୍ଗୀର ସଦର",
        "gps": [
          "Barapuduga",
          "Bidighat",
          "Chandanbhati",
          "Chhinchhinda",
          "Kukudapada",
          "Madhiapali",
          "Pujaridunguri",
          "Sadeipali",
          "Tukurla"
        ]
      },
      {
        "name": "Bangomunda",
        "nameOr": "ବଙ୍ଗୋମୁଣ୍ଡା",
        "gps": [
          "Almunda",
          "Bangomunda",
          "Bhalumunda",
          "Biripali",
          "Chanabahal",
          "Gandharla",
          "Gohirapadar",
          "Jharani",
          "Sindhekela"
        ]
      },
      {
        "name": "Belpara",
        "nameOr": "ବେଲପଡ଼ା",
        "gps": [
          "Bagdor",
          "Belpara",
          "Bharuamunda",
          "Dhaunradad",
          "Ghogar",
          "Kapani",
          "Mandal",
          "Salepali",
          "Sihini"
        ]
      },
      {
        "name": "Deogaon",
        "nameOr": "ଦେଓଗାଁ",
        "gps": [
          "Badabandha",
          "Bandhapada",
          "Deogaon",
          "Gaiba",
          "Kutasingha",
          "Makatpur",
          "Ponchiram",
          "Sikachhida",
          "Uparjhar"
        ]
      },
      {
        "name": "Gudvella (Tushura)",
        "nameOr": "ଗୁଡ଼ଭେଲ୍ଲା (ତୁଷୁରା)",
        "gps": [
          "Chinajhor",
          "Gudvella",
          "Jamtara",
          "Madhiapali",
          "Nuapali",
          "Radhanagar",
          "Samara",
          "Tushura"
        ]
      },
      {
        "name": "Kantabanji / Muribahal",
        "nameOr": "ମୁରିବାହାଲ",
        "gps": [
          "Bhalumunda",
          "Chhatrapang",
          "Gudighat",
          "Haldia",
          "Malmunda",
          "Muribahal",
          "Patrapali",
          "Tentulikhunti"
        ]
      },
      {
        "name": "Khaprakhol",
        "nameOr": "ଖପ୍ରାଖୋଲ",
        "gps": [
          "Bhalumunda",
          "Dhandamunda",
          "Kankadajhor",
          "Karuanjhar",
          "Khaprakhol",
          "Latur",
          "Nandupala",
          "Tankapani"
        ]
      },
      {
        "name": "Loisingha",
        "nameOr": "ଲୋଇସିଂହା",
        "gps": [
          "Bada Imili",
          "Burda",
          "Jharmunda",
          "Kandajuri",
          "Kandapali",
          "Kusmel",
          "Loisingha",
          "Rengali",
          "Sarabahal"
        ]
      },
      {
        "name": "Patnagarh",
        "nameOr": "ପାଟଣାଗଡ଼",
        "gps": [
          "Bhutiarbahal",
          "Deulgaon",
          "Ghasian",
          "Kandhal",
          "Marangdangar",
          "Patnagarh",
          "Rampur",
          "Tamian",
          "Tentulimunda"
        ]
      },
      {
        "name": "Puintala",
        "nameOr": "ପୁଇଁତଳା",
        "gps": [
          "Alanda",
          "Badasahi",
          "Bilaisarda",
          "Bubel",
          "Chhatamakhna",
          "Kukuda",
          "Mahimunda",
          "Puintala",
          "Saheebahali"
        ]
      },
      {
        "name": "Saintala",
        "nameOr": "ସାଇଁତଳା",
        "gps": [
          "Badamunda",
          "Belgaon",
          "Bibina",
          "Dharpagarh",
          "Kandhajor",
          "Kumbhari",
          "Saintala",
          "Sikuan",
          "Tikrapada"
        ]
      },
      {
        "name": "Titlagarh Block",
        "nameOr": "ଟିଟିଲାଗଡ଼ ବ୍ଲକ",
        "gps": [
          "Bhatipara",
          "Bhuinpali",
          "Bijepur",
          "Digsira",
          "Kholan",
          "Kursud",
          "Manigam",
          "Parasara",
          "Siluan"
        ]
      },
      {
        "name": "Turekela",
        "nameOr": "ତୁରେକେଲା",
        "gps": [
          "Badadunguripali",
          "Chhatarang",
          "Dhamandanga",
          "Haldi",
          "Jharbhal",
          "Kuibahal",
          "Lathor",
          "Turekela"
        ]
      }
    ]
  },
  "Balasore": {
    "nameOr": "ବାଲେଶ୍ୱର",
    "constituencies": [
      "Jaleswar",
      "Bhograi",
      "Basta",
      "Balasore",
      "Remuna",
      "Nilgiri",
      "Soro",
      "Simulia"
    ],
    "ulbs": [
      {
        "name": "Balasore Municipality",
        "nameOr": "ବାଲେଶ୍ୱର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 31
      },
      {
        "name": "Soro Municipality",
        "nameOr": "ସୋର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 19
      },
      {
        "name": "Jaleswar Municipality",
        "nameOr": "ଜଳେଶ୍ୱର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 17
      },
      {
        "name": "Nilgiri NAC",
        "nameOr": "ନୀଳଗିରି ଏନଏସି",
        "type": "NAC",
        "wards": 15
      },
      {
        "name": "Remuna NAC",
        "nameOr": "ରେମୁଣା ଏନଏସି",
        "type": "NAC",
        "wards": 15
      }
    ],
    "blocks": [
      {
        "name": "Bahanaga",
        "nameOr": "ବାହାନଗା",
        "gps": [
          "Anantapur",
          "Aruhabad",
          "Avana",
          "Bahanaga",
          "Chitapada",
          "Dandaharipur",
          "Gopalpur",
          "Kalyani",
          "Kharasahapur",
          "Panapana",
          "Sathipada",
          "Talpada"
        ]
      },
      {
        "name": "Balasore Sadar",
        "nameOr": "ବାଲେଶ୍ୱର ସଦର",
        "gps": [
          "Balia",
          "Chhanpur",
          "Haladipada",
          "Kasipada",
          "Kuruda",
          "Nagram",
          "Patrapada",
          "Ransahi",
          "Rasalpur",
          "Srikona"
        ]
      },
      {
        "name": "Baliapal",
        "nameOr": "ବାଲିଆପାଳ",
        "gps": [
          "Baliapal",
          "Batitand",
          "Bhogarai",
          "Debanandapur",
          "Jamkunda",
          "Kumbhirgadi",
          "Madhyapada",
          "Palasia",
          "Pratappur",
          "Simulia"
        ]
      },
      {
        "name": "Basta",
        "nameOr": "ବସ୍ତା",
        "gps": [
          "Bada Ambilitha",
          "Basta",
          "Darada",
          "Gadipada",
          "Irda",
          "Mathani",
          "Naikudi",
          "Raghunathpur",
          "Sadanandapur",
          "Velora"
        ]
      },
      {
        "name": "Bhograi",
        "nameOr": "ଭୋଗରାଇ",
        "gps": [
          "Bhograi",
          "Chandanheswar",
          "Dehurda",
          "Jaleswarpur",
          "Kakhara",
          "Kumbhirgadi",
          "Nachinda",
          "Purbasahi",
          "Talasari",
          "Udayapur"
        ]
      },
      {
        "name": "Jaleswar Block",
        "nameOr": "ଜଳେଶ୍ୱର ବ୍ଲକ",
        "gps": [
          "Bartana",
          "Chamaragaon",
          "Dhanasimulia",
          "Jaleswar",
          "Kotapada",
          "Laxmannath",
          "Nalabahai",
          "Paunsakuli",
          "Raibania",
          "Sugalo"
        ]
      },
      {
        "name": "Khaira",
        "nameOr": "ଖଇରା",
        "gps": [
          "Achyutapur",
          "Bartana",
          "Durgapur",
          "Gagandharpur",
          "Khaira",
          "Kurunta",
          "Makhanpur",
          "Nandapur",
          "Palasahi",
          "Tudigadia"
        ]
      },
      {
        "name": "Nilgiri Block",
        "nameOr": "ନୀଳଗିରି ବ୍ଲକ",
        "gps": [
          "Ajodhya",
          "Baunsabania",
          "Berhampur",
          "Dunguri",
          "Jamudiha",
          "Kalasahi",
          "Mitrapur",
          "Nilgiri",
          "Sajanagarh",
          "Telipal"
        ]
      },
      {
        "name": "Oupada",
        "nameOr": "ଔପଦା",
        "gps": [
          "Baunsagadia",
          "Fatepur",
          "Gadasahi",
          "Mahisapatna",
          "Oupada",
          "Pitalgo",
          "Santragadia",
          "Syamasundarpur"
        ]
      },
      {
        "name": "Remuna Block",
        "nameOr": "ରେମୁଣା ବ୍ଲକ",
        "gps": [
          "Alumeda",
          "Bada Khirachora",
          "Gopinathpur",
          "Kalyani",
          "Mandarpur",
          "Nuapadhi",
          "Patripal",
          "Remuna",
          "Sahadevkhunta",
          "Tentalia"
        ]
      },
      {
        "name": "Simulia",
        "nameOr": "ସିମୁଳିଆ",
        "gps": [
          "Anandapur",
          "Bada Kuanrpur",
          "Barikpur",
          "Bauri Pada",
          "Jamujhari",
          "Markona",
          "Ranital",
          "Simulia",
          "Uttarabahini"
        ]
      },
      {
        "name": "Soro Block",
        "nameOr": "ସୋର ବ୍ଲକ",
        "gps": [
          "Anantapur",
          "Bagudi",
          "Dahisada",
          "Gopinathpur",
          "Kesharipur",
          "Mangalpur",
          "Pakhar",
          "Soro",
          "Talanagar"
        ]
      }
    ]
  },
  "Bargarh": {
    "nameOr": "ବରଗଡ଼",
    "constituencies": [
      "Padampur",
      "Bijepur",
      "Bargarh",
      "Attabira",
      "Bhatli"
    ],
    "ulbs": [
      {
        "name": "Bargarh Municipality",
        "nameOr": "ବରଗଡ଼ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 19
      },
      {
        "name": "Barpali NAC",
        "nameOr": "ବାରପାଲି ଏନଏସି",
        "type": "NAC",
        "wards": 11
      },
      {
        "name": "Padampur NAC",
        "nameOr": "ପଦ୍ମପୁର ଏନଏସି",
        "type": "NAC",
        "wards": 11
      },
      {
        "name": "Attabira NAC",
        "nameOr": "ଅତାବିରା ଏନଏସି",
        "type": "NAC",
        "wards": 12
      },
      {
        "name": "Bijepur NAC",
        "nameOr": "ବିଜେପୁର ଏନଏସି",
        "type": "NAC",
        "wards": 12
      }
    ],
    "blocks": [
      {
        "name": "Ambabhona",
        "nameOr": "ଅମ୍ବାଭୋନା",
        "gps": [
          "Ambabhona",
          "Bhadigaon",
          "Bhogra",
          "Chichinda",
          "Daldali",
          "Kandapala",
          "Kapileswar",
          "Ruputunga",
          "Utapada"
        ]
      },
      {
        "name": "Attabira",
        "nameOr": "ଅତାବିରା",
        "gps": [
          "Attabira",
          "Bugbuga",
          "Godbhaga",
          "Kadobahal",
          "Kulunda",
          "Manpur",
          "Paharsrigida",
          "Rengali",
          "Topa"
        ]
      },
      {
        "name": "Bargarh Sadar",
        "nameOr": "ବରଗଡ଼ ସଦର",
        "gps": [
          "Adgaon",
          "Bardol",
          "Bhatli",
          "Dangabahal",
          "Haladipali",
          "Jamurda",
          "Kalamati",
          "Khaliapali",
          "Nuagaon",
          "Tora"
        ]
      },
      {
        "name": "Barpali",
        "nameOr": "ବାରପାଲି",
        "gps": [
          "Barpali",
          "Chakarkend",
          "Dhaba",
          "Kainsir",
          "Kumbhari",
          "Mahulpali",
          "Palsada",
          "Remenda",
          "Tulandi"
        ]
      },
      {
        "name": "Bhatli",
        "nameOr": "ଭଟଲି",
        "gps": [
          "Bhatli",
          "Dharmasala",
          "Kamgaon",
          "Karanpali",
          "Kushumura",
          "Nuapali",
          "Rukmini",
          "Sukhasoda"
        ]
      },
      {
        "name": "Bheden",
        "nameOr": "ଭେଡ଼େନ",
        "gps": [
          "Bheden",
          "Chichinda",
          "Desbhatli",
          "Kubedega",
          "Lupursingha",
          "Manpur",
          "Resham",
          "Sunalarambha"
        ]
      },
      {
        "name": "Bijepur",
        "nameOr": "ବିଜେପୁର",
        "gps": [
          "Bairakhpali",
          "Bijepur",
          "Gaisilet",
          "Jaring",
          "Laumunda",
          "Mundakati",
          "Palsada",
          "Sarkanda"
        ]
      },
      {
        "name": "Gaisilet",
        "nameOr": "ଗାଇସିଲେଟ୍",
        "gps": [
          "Badasahir",
          "Chhatrapali",
          "Gaisilet",
          "Jharpali",
          "Kathumunda",
          "Nuapali",
          "Talpali"
        ]
      },
      {
        "name": "Jharbandh",
        "nameOr": "ଝାରବନ୍ଧ",
        "gps": [
          "Amethi",
          "Baturabahali",
          "Chiraikund",
          "Gothuguda",
          "Jharbandh",
          "Kandadangar",
          "Luhurachati"
        ]
      },
      {
        "name": "Padampur",
        "nameOr": "ପଦ୍ମପୁର",
        "gps": [
          "Barihapali",
          "Budhadunguri",
          "Charpali",
          "Dahita",
          "Kendumunda",
          "Padampur",
          "Pujaripali",
          "Rajbora"
        ]
      },
      {
        "name": "Paikmal",
        "nameOr": "ପାଇକମାଳ",
        "gps": [
          "Bhilai",
          "Bithali",
          "Chhuriapali",
          "Jharbandh",
          "Mandosil",
          "Nrusinghanath",
          "Paikmal",
          "Temri"
        ]
      },
      {
        "name": "Sohela",
        "nameOr": "ସୋହେଲା",
        "gps": [
          "Chhuriapali",
          "Dumerpali",
          "Ghess",
          "Kanalapali",
          "Lephri",
          "Sarkanda",
          "Sohela",
          "Tabada"
        ]
      }
    ]
  },
  "Bhadrak": {
    "nameOr": "ଭଦ୍ରକ",
    "constituencies": [
      "Bhandaripokhari",
      "Bhadrak",
      "Basudevpur",
      "Dhamnagar",
      "Chandabali"
    ],
    "ulbs": [
      {
        "name": "Bhadrak Municipality",
        "nameOr": "ଭଦ୍ରକ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 30
      },
      {
        "name": "Basudevpur Municipality",
        "nameOr": "ବାସୁଦେବପୁର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 23
      },
      {
        "name": "Dhamnagar NAC",
        "nameOr": "ଧାମନଗର ଏନଏସି",
        "type": "NAC",
        "wards": 11
      },
      {
        "name": "Chandabali NAC",
        "nameOr": "ଚାନ୍ଦବାଲି ଏନଏସି",
        "type": "NAC",
        "wards": 15
      }
    ],
    "blocks": [
      {
        "name": "Basudevpur",
        "nameOr": "ବାସୁଦେବପୁର",
        "gps": [
          "Adhuan",
          "Anantapur",
          "Barandua",
          "Betada",
          "Bideipur",
          "Eram",
          "Karanjamal",
          "Lunga",
          "Mandari",
          "Naikanidihi",
          "Padmapur",
          "Sudarsanpur"
        ]
      },
      {
        "name": "Bhadrak Sadar",
        "nameOr": "ଭଦ୍ରକ ସଦର",
        "gps": [
          "Arnapal",
          "Barikpur",
          "Betaligaon",
          "Chandigaon",
          "Gelpur",
          "Kaupur",
          "Korant",
          "Nuagaon",
          "Ranital",
          "Sabrang"
        ]
      },
      {
        "name": "Bhandaripokhari",
        "nameOr": "ଭଣ୍ଡାରିପୋଖରୀ",
        "gps": [
          "Bandhalo",
          "Barikpur",
          "Bhandaripokhari",
          "Dakshinabad",
          "Jaganathprasad",
          "Malda",
          "Maninathpur",
          "Naguan",
          "Ranjit",
          "Sarasada"
        ]
      },
      {
        "name": "Bonth",
        "nameOr": "ବନ୍ତ",
        "gps": [
          "Agirapada",
          "Basantia",
          "Bonth",
          "Chhachina",
          "Kadabarang",
          "Mahitang",
          "Nilok",
          "Ramkrushnapur",
          "Sendhapur",
          "Tadada"
        ]
      },
      {
        "name": "Chandabali",
        "nameOr": "ଚାନ୍ଦବାଲି",
        "gps": [
          "Aradi",
          "Bansada",
          "Bhatapada",
          "Chandabali",
          "Dhamra",
          "Ghanteswar",
          "Karanjamal",
          "Motto",
          "Nalagohira",
          "Tenduda"
        ]
      },
      {
        "name": "Dhamnagar",
        "nameOr": "ଧାମନଗର",
        "gps": [
          "Asurali",
          "Chudakuti",
          "Dhamnagar",
          "Dobal",
          "Kalyani",
          "Nadigaon",
          "Palasahi",
          "Radhaballavpur",
          "Sohada"
        ]
      },
      {
        "name": "Tihidi",
        "nameOr": "ତିହିଡ଼ି",
        "gps": [
          "Bhatapada",
          "Bilana",
          "Bodak",
          "Dolapadi",
          "Guabali",
          "Kubera",
          "Piramahat",
          "Sindol",
          "Talapada",
          "Tihidi"
        ]
      }
    ]
  },
  "Boudh": {
    "nameOr": "ବୌଦ୍ଧ",
    "constituencies": [
      "Kantamal",
      "Boudh"
    ],
    "ulbs": [
      {
        "name": "Boudhgarh NAC",
        "nameOr": "ବୌଦ୍ଧଗଡ଼ ଏନଏସି",
        "type": "NAC",
        "wards": 17
      }
    ],
    "blocks": [
      {
        "name": "Boudh Sadar",
        "nameOr": "ବୌଦ୍ଧ ସଦର",
        "gps": [
          "Badadunguri",
          "Boudh",
          "Brundabanpur",
          "Dhalpur",
          "Khuntabandha",
          "Mundipadar",
          "Padmanpur",
          "Telibandha"
        ]
      },
      {
        "name": "Harbhanga",
        "nameOr": "ହରଭଙ୍ଗା",
        "gps": [
          "Adenigarh",
          "Balisahi",
          "Chhatrang",
          "Dhurudakotha",
          "Harbhanga",
          "Kushasingha",
          "Purunakatak",
          "Ramgarh"
        ]
      },
      {
        "name": "Kantamal",
        "nameOr": "କଣ୍ଟାମାଳ",
        "gps": [
          "Ambagahan",
          "Baragaon",
          "Ghantapada",
          "Jogindrapur",
          "Kantamal",
          "Kullu",
          "Manamunda",
          "Palasagora",
          "Similipadar"
        ]
      }
    ]
  },
  "Cuttack": {
    "nameOr": "କଟକ",
    "constituencies": [
      "Barabati-Cuttack",
      "Choudwar-Cuttack",
      "Cuttack Sadar",
      "Salipur",
      "Mahanga",
      "Niali",
      "Banki",
      "Athagarh",
      "Badamba"
    ],
    "ulbs": [
      {
        "name": "CMC (Cuttack Municipal Corporation)",
        "nameOr": "ସିଏମସି (କଟକ ମହାନଗର ନିଗମ)",
        "type": "Corporation",
        "wards": 59
      },
      {
        "name": "Choudwar Municipality",
        "nameOr": "ଚୌଦ୍ୱାର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 19
      },
      {
        "name": "Athagarh NAC",
        "nameOr": "ଆଠଗଡ଼ ଏନଏସି",
        "type": "NAC",
        "wards": 18
      },
      {
        "name": "Banki NAC",
        "nameOr": "ବାଙ୍କୀ ଏନଏସି",
        "type": "NAC",
        "wards": 12
      }
    ],
    "blocks": [
      {
        "name": "Athagarh",
        "nameOr": "ଆଠଗଡ଼",
        "gps": [
          "Bentapada",
          "Chaghar",
          "Dorada",
          "Gobindapur",
          "Kandarei",
          "Khurda",
          "Radhagobindapur",
          "Rajathagarh",
          "Samsarpur"
        ]
      },
      {
        "name": "Badamba",
        "nameOr": "ବଡ଼ମ୍ବା",
        "gps": [
          "Abhimanpur",
          "Badamba",
          "Bhattarika",
          "Gopinathpur",
          "Kanpur",
          "Maniabandha",
          "Nuapatna",
          "Sankhamari"
        ]
      },
      {
        "name": "Banki Sadar",
        "nameOr": "ବାଙ୍କୀ ସଦର",
        "gps": [
          "Anandapur",
          "Baraput",
          "Baidyeswar",
          "Charchika",
          "Gopalpur",
          "Kansar",
          "Nuagaon",
          "Pathapur"
        ]
      },
      {
        "name": "Banki-Dampada",
        "nameOr": "ବାଙ୍କୀ-ଡମପଡ଼ା",
        "gps": [
          "Brahmapura",
          "Chakradharpur",
          "Dampada",
          "Kusupangi",
          "Nuagarh",
          "Talabasta"
        ]
      },
      {
        "name": "Baranga",
        "nameOr": "ବାରଙ୍ଗ",
        "gps": [
          "Belagachhia",
          "Daruthenga",
          "Harianta",
          "Kalyanpur",
          "Madhabpur",
          "Mundali",
          "Nagari",
          "Ramdaspur",
          "Ushuma"
        ]
      },
      {
        "name": "Cuttack Sadar",
        "nameOr": "କଟକ ସଦର",
        "gps": [
          "Bandhunda",
          "Bentkar",
          "Bodamundai",
          "Dadhibamanpur",
          "Kandarpur",
          "Paramahansa",
          "Pratapadityapur",
          "Telengapentha"
        ]
      },
      {
        "name": "Kantapada",
        "nameOr": "କଣ୍ଟାପଡ଼ା",
        "gps": [
          "Bagalpur",
          "Brahmanhandi",
          "Deopada",
          "Dimiri",
          "Gobindapur",
          "Kantapada",
          "Nuagan",
          "Patasundarpur",
          "Uttaran"
        ]
      },
      {
        "name": "Mahanga",
        "nameOr": "ମାହାଙ୍ଗା",
        "gps": [
          "Bhadreswar",
          "Chahapada",
          "Gopinathpur",
          "Koliatha",
          "Kuhunda",
          "Mahanga",
          "Mouda",
          "Pallisahi",
          "Rohan"
        ]
      },
      {
        "name": "Narasinghpur",
        "nameOr": "ନରସିଂହପୁର",
        "gps": [
          "Alara",
          "Basantapur",
          "Champeswar",
          "Debabhumi",
          "Kanpur",
          "Narasinghpur",
          "Nuapatna",
          "Paikapadapatna"
        ]
      },
      {
        "name": "Niali",
        "nameOr": "ନିଆଳୀ",
        "gps": [
          "Alangapada",
          "Bahana",
          "Bilashuni",
          "Kasarda",
          "Madhab",
          "Niali",
          "Nuagaon",
          "Pokharigaon",
          "Sitarampur"
        ]
      },
      {
        "name": "Nischintakoili",
        "nameOr": "ନିଶ୍ଚିନ୍ତକୋଇଲି",
        "gps": [
          "Asureswar",
          "Bandhakantia",
          "Daulatpur",
          "Jankoti",
          "Katikata",
          "Nemesha",
          "Nischintakoili",
          "Oragandira",
          "Sukurpur"
        ]
      },
      {
        "name": "Salipur",
        "nameOr": "ସାଲେପୁର",
        "gps": [
          "Bahugram",
          "Champati",
          "Jankoti",
          "Katikata",
          "Lunahar",
          "Machhagan",
          "Mirzapur",
          "Salipur",
          "Tarito"
        ]
      },
      {
        "name": "Tangi-Choudwar",
        "nameOr": "ଟାଙ୍ଗୀ-ଚୌଦ୍ୱାର",
        "gps": [
          "Agrahat",
          "Bhatimunda",
          "Choudwar Rural",
          "Kakhadi",
          "Mangarajpur",
          "Nakhara",
          "Safipur",
          "Tangi"
        ]
      },
      {
        "name": "Tigiria",
        "nameOr": "ତିଗିରିଆ",
        "gps": [
          "Bindhanima",
          "Gadadharpur",
          "Gopinathpur",
          "Kalibiri",
          "Nuapatna",
          "Panchgaon",
          "Tigiria"
        ]
      }
    ]
  },
  "Deogarh": {
    "nameOr": "ଦେବଗଡ଼",
    "constituencies": [
      "Deogarh"
    ],
    "ulbs": [
      {
        "name": "Deogarh Municipality",
        "nameOr": "ଦେବଗଡ଼ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 11
      }
    ],
    "blocks": [
      {
        "name": "Barkote",
        "nameOr": "ବାରକୋଟ",
        "gps": [
          "Balanda",
          "Barkote",
          "Barihapur",
          "Danra",
          "Kala",
          "Kandeijuri",
          "Madhyapur",
          "Purunagarh",
          "Saradhapur"
        ]
      },
      {
        "name": "Reamal",
        "nameOr": "ରିଆମାଳ",
        "gps": [
          "Budido",
          "Chhatabar",
          "Kundheigola",
          "Naulipada",
          "Palsama",
          "Reamal",
          "Tarang",
          "Tinimunda"
        ]
      },
      {
        "name": "Tileibani",
        "nameOr": "ତିଳେଇବଣି",
        "gps": [
          "Badasahir",
          "Dholpada",
          "Gohira",
          "Kandhal",
          "Parposi",
          "Suguda",
          "Tileibani",
          "Uparbagh"
        ]
      }
    ]
  },
  "Dhenkanal": {
    "nameOr": "ଢେଙ୍କାନାଳ",
    "constituencies": [
      "Kamakhyanagar",
      "Parjanga",
      "Dhenkanal",
      "Hindol"
    ],
    "ulbs": [
      {
        "name": "Dhenkanal Municipality",
        "nameOr": "ଢେଙ୍କାନାଳ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 23
      },
      {
        "name": "Kamakhyanagar NAC",
        "nameOr": "କାମାକ୍ଷାନଗର ଏନଏସି",
        "type": "NAC",
        "wards": 14
      },
      {
        "name": "Bhuban NAC",
        "nameOr": "ଭୁବନ ଏନଏସି",
        "type": "NAC",
        "wards": 15
      },
      {
        "name": "Hindol NAC",
        "nameOr": "ହିନ୍ଦୋଳ ଏନଏସି",
        "type": "NAC",
        "wards": 16
      }
    ],
    "blocks": [
      {
        "name": "Bhuban",
        "nameOr": "ଭୁବନ",
        "gps": [
          "Anandapur",
          "Baruan",
          "Bhuban Rural",
          "Dayanabil",
          "Ektali",
          "Jhadabandha",
          "Kuninda",
          "Mathakargola",
          "Surapratapgarh"
        ]
      },
      {
        "name": "Dhenkanal Sadar",
        "nameOr": "ଢେଙ୍କାନାଳ ସଦର",
        "gps": [
          "Baladiabandha",
          "Badasualo",
          "Beltikiri",
          "Bhabanipur",
          "Chhadesh",
          "Gahamkhunti",
          "Govindpur",
          "Kankadahad",
          "Mangalpur",
          "Sankarpur"
        ]
      },
      {
        "name": "Gondia",
        "nameOr": "ଗଁଦିଆ",
        "gps": [
          "Badasahi",
          "Deogaon",
          "Gondia",
          "Karamul",
          "Khadagprasad",
          "Mandar",
          "Panchamukhi",
          "Pingua",
          "Santhapur"
        ]
      },
      {
        "name": "Hindol",
        "nameOr": "ହିନ୍ଦୋଳ",
        "gps": [
          "Babandha",
          "Dandasingha",
          "Dudurkote",
          "Gandarapasi",
          "Hindol Rural",
          "Kanjia",
          "Khajuriakata",
          "Rasasingh"
        ]
      },
      {
        "name": "Kamakhyanagar",
        "nameOr": "କାମାକ୍ଷାନଗର",
        "gps": [
          "Alua",
          "Baisinga",
          "Baruan",
          "Kusumajodi",
          "Malisahi",
          "Muktapasi",
          "Rainarasinghpur",
          "Sogor",
          "Tumusingha"
        ]
      },
      {
        "name": "Kankadahad",
        "nameOr": "କଙ୍କଡ଼ାହାଡ଼",
        "gps": [
          "Bamnipal",
          "Biribolei",
          "Dandasena",
          "Kankadahad",
          "Kerjoli",
          "Mahlipada",
          "Pangati",
          "Ranjagol"
        ]
      },
      {
        "name": "Odapada",
        "nameOr": "ଓଡ଼ାପଡ଼ା",
        "gps": [
          "Balarampur",
          "Gadasila",
          "Hindol Road",
          "Kandhara",
          "Khadagprasad",
          "Mahimagadi",
          "Motanga",
          "Ranjagol"
        ]
      },
      {
        "name": "Parjanga",
        "nameOr": "ପର୍ଜଙ୍ଗ",
        "gps": [
          "Baruan",
          "Basoi",
          "Chandpur",
          "Kantiokateni",
          "Kumhari",
          "Mundilo",
          "Pankal",
          "Parjanga",
          "Pitriri"
        ]
      }
    ]
  },
  "Gajapati": {
    "nameOr": "ଗଜପତି",
    "constituencies": [
      "Mohana",
      "Paralakhemundi"
    ],
    "ulbs": [
      {
        "name": "Paralakhemundi Municipality",
        "nameOr": "ପାରଳାଖେମୁଣ୍ଡି ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 16
      },
      {
        "name": "Kashinagara NAC",
        "nameOr": "କାଶୀନଗର ଏନଏସି",
        "type": "NAC",
        "wards": 13
      }
    ],
    "blocks": [
      {
        "name": "Gosani",
        "nameOr": "ଗୋସାଣୀ",
        "gps": [
          "Bada Gosani",
          "Balisahi",
          "Garabandha",
          "Gurandi",
          "Katalka",
          "Machamara",
          "Radhagovindapur",
          "Uppalada"
        ]
      },
      {
        "name": "Gumma",
        "nameOr": "ଗୁମ୍ମା",
        "gps": [
          "Ajayagada",
          "Bhadiguda",
          "Gaiba",
          "Gumma",
          "Jeevani",
          "Munisingh",
          "Raghunathpur",
          "Tarangada"
        ]
      },
      {
        "name": "Kashinagara",
        "nameOr": "କାଶୀନଗର",
        "gps": [
          "Budhura",
          "Hadobhangi",
          "Khandava",
          "Kidasingi",
          "Sitanagaram",
          "Sarasangada"
        ]
      },
      {
        "name": "Mohana",
        "nameOr": "ମୋହନା",
        "gps": [
          "Adava",
          "Antaraba",
          "Badakhani",
          "Chheligada",
          "Dhabalpur",
          "Govindapur",
          "Luhagudi",
          "Mohana",
          "Paniganda",
          "R.Udayagiri"
        ]
      },
      {
        "name": "Nuagada",
        "nameOr": "ନୂଆଗଡ଼",
        "gps": [
          "Anuguru",
          "Betarsing",
          "Kirama",
          "Nuagada",
          "Pariapadar",
          "Sambalpur",
          "Tabarada"
        ]
      },
      {
        "name": "R.Udayagiri",
        "nameOr": "ଆର.ଉଦୟଗିରି",
        "gps": [
          "Anukulapur",
          "Chheligada",
          "Mahendragada",
          "Ramagiri",
          "R.Udayagiri",
          "Tabarada"
        ]
      },
      {
        "name": "Rayagada Block",
        "nameOr": "ରାୟଗଡ଼ା ବ୍ଲକ",
        "gps": [
          "Ganga",
          "Jeerango",
          "Kainpur",
          "Luhagudi",
          "Marikhunti",
          "Pattikota",
          "Rayagada"
        ]
      }
    ]
  },
  "Ganjam": {
    "nameOr": "ଗଞ୍ଜାମ",
    "constituencies": [
      "Bhanjanagar",
      "Polasara",
      "Kabisuryanagar",
      "Khalikote",
      "Chhatrapur",
      "Aska",
      "Sorada",
      "Sanakhemundi",
      "Hinjili",
      "Gopalpur",
      "Berhampur",
      "Digapahandi",
      "Chikiti"
    ],
    "ulbs": [
      {
        "name": "BeMC (Berhampur Municipal Corporation)",
        "nameOr": "ବ୍ରହ୍ମପୁର ମହାନଗର ନିଗମ",
        "type": "Corporation",
        "wards": 42
      },
      {
        "name": "Hinjilicut Municipality",
        "nameOr": "ହିଞ୍ଜିଳିକାଟୁ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 21
      },
      {
        "name": "Aska NAC",
        "nameOr": "ଆସିକା ଏନଏସି",
        "type": "NAC",
        "wards": 18
      },
      {
        "name": "Bhanjanagar NAC",
        "nameOr": "ଭଞ୍ଜନଗର ଏନଏସି",
        "type": "NAC",
        "wards": 15
      },
      {
        "name": "Chhatrapur NAC",
        "nameOr": "ଛତ୍ରପୁର ଏନଏସି",
        "type": "NAC",
        "wards": 14
      },
      {
        "name": "Gopalpur NAC",
        "nameOr": "ଗୋପାଳପୁର ଏନଏସି",
        "type": "NAC",
        "wards": 11
      },
      {
        "name": "Digapahandi NAC",
        "nameOr": "ଦିଗପହଣ୍ଡି ଏନଏସି",
        "type": "NAC",
        "wards": 12
      },
      {
        "name": "Chikiti NAC",
        "nameOr": "ଚିକିଟି ଏନଏସି",
        "type": "NAC",
        "wards": 12
      },
      {
        "name": "Polasara NAC",
        "nameOr": "ପୋଲସରା ଏନଏସି",
        "type": "NAC",
        "wards": 19
      },
      {
        "name": "Kabisuryanagar NAC",
        "nameOr": "କବିସୂର୍ଯ୍ୟନଗର ଏନଏସି",
        "type": "NAC",
        "wards": 18
      },
      {
        "name": "Khalikote NAC",
        "nameOr": "ଖଲ୍ଲିକୋଟ ଏନଏସି",
        "type": "NAC",
        "wards": 12
      },
      {
        "name": "Purushottampur NAC",
        "nameOr": "ପୁରୁଷୋତ୍ତମପୁର ଏନଏସି",
        "type": "NAC",
        "wards": 14
      },
      {
        "name": "Buguda NAC",
        "nameOr": "ବୁଗୁଡ଼ା ଏନଏସି",
        "type": "NAC",
        "wards": 13
      },
      {
        "name": "Bellaguntha NAC",
        "nameOr": "ବେଲଗୁଣ୍ଠା ଏନଏସି",
        "type": "NAC",
        "wards": 13
      },
      {
        "name": "Ganjam NAC",
        "nameOr": "ଗଞ୍ଜାମ ଏନଏସି",
        "type": "NAC",
        "wards": 12
      },
      {
        "name": "Surada NAC",
        "nameOr": "ସୁରଡ଼ା ଏନଏସି",
        "type": "NAC",
        "wards": 15
      }
    ],
    "blocks": [
      {
        "name": "Aska",
        "nameOr": "ଆସିକା",
        "gps": [
          "Bada Kharida",
          "Balichhai",
          "Barida",
          "Bhejiput",
          "Gunthapada",
          "Kalana",
          "Khandadeuli",
          "Nandika",
          "Paklapalli"
        ]
      },
      {
        "name": "Beguniapada",
        "nameOr": "ବେଗୁନିଆପଡ଼ା",
        "gps": [
          "Angargaon",
          "Baliasara",
          "Beguniapada",
          "Burupada",
          "Chikitia",
          "Dhurusia",
          "Mardamekhi",
          "Somanathpur"
        ]
      },
      {
        "name": "Bellaguntha",
        "nameOr": "ବେଲଗୁଣ୍ଠା",
        "gps": [
          "Amrutulu",
          "Bankatara",
          "Bellaguntha Rural",
          "Gangapur",
          "Gobindapur",
          "Kullada",
          "Nuagaon",
          "Takarasahi"
        ]
      },
      {
        "name": "Bhanjanagar",
        "nameOr": "ଭଞ୍ଜନଗର",
        "gps": [
          "Bada Kodanda",
          "Baidyanathpur",
          "Dhekunia",
          "Gallery",
          "Inam Gallery",
          "Kullada",
          "Lalsing",
          "Mujagada",
          "Sanakodanda"
        ]
      },
      {
        "name": "Buguda",
        "nameOr": "ବୁଗୁଡ଼ା",
        "gps": [
          "Arakhapur",
          "Balipadar",
          "Buguda Rural",
          "Golabandha",
          "Karasingi",
          "Manikyapur",
          "Moterbadi",
          "Pangidi"
        ]
      },
      {
        "name": "Chhatrapur",
        "nameOr": "ଛତ୍ରପୁର",
        "gps": [
          "Agasti Nuagaon",
          "Aryapalli",
          "Bipulingi",
          "Chhatrapur Rural",
          "Kanamana",
          "Mahabir",
          "Podampeta",
          "Sundarpur"
        ]
      },
      {
        "name": "Chikiti",
        "nameOr": "ଚିକିଟି",
        "gps": [
          "Badapur",
          "Chandapur",
          "Chikiti Rural",
          "Girisola",
          "Kelapalli",
          "Kotilingi",
          "Nuapada",
          "Patrapur",
          "Ramanaguda"
        ]
      },
      {
        "name": "Dharakote",
        "nameOr": "ଧରାକୋଟ",
        "gps": [
          "Bahadapadar",
          "Balarampur",
          "Dharakote",
          "Jhadabandha",
          "Kalyanpur",
          "Kusagumuda",
          "Mundamarai",
          "Ruhigam"
        ]
      },
      {
        "name": "Digapahandi",
        "nameOr": "ଦିଗପହଣ୍ଡି",
        "gps": [
          "Ankarada",
          "Badadumula",
          "Bhimpur",
          "Chaitanyapur",
          "Digapahandi Rural",
          "Gokarnapur",
          "Khamariguda",
          "Padmanabhapur"
        ]
      },
      {
        "name": "Ganjam Block",
        "nameOr": "ଗଞ୍ଜାମ ବ୍ଲକ",
        "gps": [
          "Damodarpur",
          "Humma",
          "Khandadeuli",
          "Malad",
          "Palibandha",
          "Pora",
          "Purushottampur",
          "Rambha Rural"
        ]
      },
      {
        "name": "Hinjilicut",
        "nameOr": "ହିଞ୍ଜିଳିକାଟୁ",
        "gps": [
          "Bada Khandi",
          "Durbandha",
          "Gandarabal",
          "Kandara",
          "Makundapur",
          "Pochilima",
          "Ralaba",
          "Saradhapur"
        ]
      },
      {
        "name": "Jagannathprasad",
        "nameOr": "ଜଗନ୍ନାଥପ୍ରସାଦ",
        "gps": [
          "Aladi",
          "Chamunda",
          "Jagannathprasad",
          "Kandhasahi",
          "Karanjola",
          "Khandabhol",
          "Kudutai",
          "Pratapapur"
        ]
      },
      {
        "name": "Kabisuryanagar",
        "nameOr": "କବିସୂର୍ଯ୍ୟନଗର",
        "gps": [
          "Athagadapatna",
          "Badamahasingi",
          "Bolosara",
          "Budhamba",
          "Gudiali",
          "Kabisuryanagar Rural",
          "Pathara"
        ]
      },
      {
        "name": "Khalikote",
        "nameOr": "ଖଲ୍ଲିକୋଟ",
        "gps": [
          "Badaghati",
          "Bhikampada",
          "Dimiria",
          "Gurapalli",
          "Kanchana",
          "Khalikote Rural",
          "Khojapadar",
          "Langaleswar"
        ]
      },
      {
        "name": "Kukudakhandi",
        "nameOr": "କୁକୁଡ଼ାଖଣ୍ଡି",
        "gps": [
          "Ankushpur",
          "Baghada",
          "Bhabinipur",
          "Dakshinapur",
          "Gurunthi",
          "Kukudakhandi",
          "Lathi",
          "Nimakhandi"
        ]
      },
      {
        "name": "Patrapur",
        "nameOr": "ପାତ୍ରପୁର",
        "gps": [
          "Ankuli",
          "Buratal",
          "Golanthara",
          "Jarada",
          "Khariaguda",
          "Mandhara",
          "Patrapur",
          "Samantiapalli",
          "Tumba"
        ]
      },
      {
        "name": "Polasara",
        "nameOr": "ପୋଲସରା",
        "gps": [
          "Bada Madhapur",
          "Budheisuni",
          "Chirikitipada",
          "Dhunkapada",
          "Hatimunda",
          "Mathura",
          "Pandiripada",
          "Polasara Rural"
        ]
      },
      {
        "name": "Purushottampur",
        "nameOr": "ପୁରୁଷୋତ୍ତମପୁର",
        "gps": [
          "Arkhapur",
          "Bhatakumarada",
          "Bhatapada",
          "Chhangudiapadar",
          "Pandia",
          "Pratappur",
          "Purushottampur Rural",
          "Tara Tarini"
        ]
      },
      {
        "name": "Rangeilunda",
        "nameOr": "ରଙ୍ଗେଇଲୁଣ୍ଡା",
        "gps": [
          "Golanthara",
          "Haldiapadar",
          "Korisapadu",
          "Lochapada",
          "Mantridi",
          "Rangeilunda",
          "Sasasani",
          "Sitalapalli"
        ]
      },
      {
        "name": "Sanakhemundi",
        "nameOr": "ସାନଖେମୁଣ୍ଡି",
        "gps": [
          "Adapada",
          "Chudangapur",
          "Goudagotha",
          "Konkarada",
          "Padampur",
          "Patiguda",
          "Podiapadar",
          "Sanakhemundi"
        ]
      },
      {
        "name": "Sheragada",
        "nameOr": "ଶେରଗଡ଼",
        "gps": [
          "Bandhaguda",
          "Baradaballi",
          "Dandapadar",
          "Gothagaon",
          "Karadakana",
          "Kullada",
          "Pitala",
          "Sheragada",
          "Thakarapalli"
        ]
      },
      {
        "name": "Sorada",
        "nameOr": "ସୋରଡ଼ା",
        "gps": [
          "Ambadola",
          "Badagada",
          "Barada",
          "Borasingi",
          "Durgaprasad",
          "Gangapur",
          "Gosaninuagaon",
          "Hukuma",
          "Sorada Rural"
        ]
      }
    ]
  },
  "Jagatsinghpur": {
    "nameOr": "ଜଗତସିଂହପୁର",
    "constituencies": [
      "Paradeep",
      "Tirtol",
      "Balikuda-Erasama",
      "Jagatsinghpur"
    ],
    "ulbs": [
      {
        "name": "Paradeep Municipality",
        "nameOr": "ପାରାଦ୍ୱୀପ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 19
      },
      {
        "name": "Jagatsinghpur Municipality",
        "nameOr": "ଜଗତସିଂହପୁର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 21
      }
    ],
    "blocks": [
      {
        "name": "Balikuda",
        "nameOr": "ବାଲିକୁଦା",
        "gps": [
          "Alabar",
          "Anakhia",
          "Balikuda",
          "Baramundei",
          "Ichhapur",
          "Kalandi",
          "Marichipur",
          "Osakana",
          "Thakurpatna"
        ]
      },
      {
        "name": "Biridi",
        "nameOr": "ବିରିଡ଼ି",
        "gps": [
          "Alana",
          "Bagalpur",
          "Biridi",
          "Chasapara",
          "Manguli",
          "Purunabasant",
          "Sankhari Sahi",
          "Ukundara"
        ]
      },
      {
        "name": "Erasama",
        "nameOr": "ଏରସମା",
        "gps": [
          "Ambi",
          "Balitutha",
          "Chatua",
          "Erasama",
          "Gadaharishpur",
          "Jatadhari",
          "Nuagaon",
          "Padmapur",
          "Sompur"
        ]
      },
      {
        "name": "Jagatsinghpur Sadar",
        "nameOr": "ଜଗତସିଂହପୁର ସଦର",
        "gps": [
          "Alipingal",
          "Chatra",
          "Debidol",
          "Mandasahi",
          "Nalibar",
          "Palleswar",
          "Rambhabila",
          "Samantarapur",
          "Taradapada"
        ]
      },
      {
        "name": "Kujang",
        "nameOr": "କୁଜଙ୍ଗ",
        "gps": [
          "Balitutha",
          "Gandakipur",
          "Hansua",
          "Kujang",
          "Mangarajpur",
          "Pankapal",
          "Paradipgarh",
          "Potanei",
          "Zillanasi"
        ]
      },
      {
        "name": "Naugaon",
        "nameOr": "ନାଉଗାଁ",
        "gps": [
          "Alanshahi",
          "Deriki",
          "Ganga",
          "Jamugaon",
          "Naugaon",
          "Nikhira",
          "Rohia",
          "Tiruna"
        ]
      },
      {
        "name": "Raghunathpur",
        "nameOr": "ରଘୁନାଥପୁର",
        "gps": [
          "Bada Bagalpur",
          "Baragol",
          "Dharadharpur",
          "Jayashol",
          "Kotasahi",
          "Raghunathpur",
          "Redhua",
          "Tarakor"
        ]
      },
      {
        "name": "Tirtol",
        "nameOr": "ତିର୍ତ୍ତୋଲ",
        "gps": [
          "Bada Kantei",
          "Birisapatna",
          "Gharabati",
          "Kanakpur",
          "Manijanga",
          "Mangarajpur",
          "Sanatirtol",
          "Taradapada",
          "Tirtol"
        ]
      }
    ]
  },
  "Jajpur": {
    "nameOr": "ଯାଜପୁର",
    "constituencies": [
      "Binjharpur",
      "Bari",
      "Barchana",
      "Dharmasala",
      "Jajpur",
      "Korei",
      "Sukinda"
    ],
    "ulbs": [
      {
        "name": "Jajpur Municipality",
        "nameOr": "ଯାଜପୁର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 18
      },
      {
        "name": "Vyasanagar Municipality",
        "nameOr": "ବ୍ୟାସନଗର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 26
      }
    ],
    "blocks": [
      {
        "name": "Badachana",
        "nameOr": "ବଡ଼ଚଣା",
        "gps": [
          "Balichandrapur",
          "Bandhalo",
          "Barada",
          "Barchana",
          "Chandikhole",
          "Charinangala",
          "Darpan",
          "Dhanmandal",
          "Sunguda"
        ]
      },
      {
        "name": "Bari",
        "nameOr": "ବରୀ",
        "gps": [
          "Alipur",
          "Anyaspur",
          "Bari",
          "Chandamaha",
          "Gamhapatna",
          "Kalamatia",
          "Mandari",
          "Ratnagiri",
          "Udayagiri"
        ]
      },
      {
        "name": "Binjharpur",
        "nameOr": "ବିଂଝାରପୁର",
        "gps": [
          "Areikana",
          "Binjharpur",
          "Chikana",
          "Fatepur",
          "Kalyanpur",
          "Kapila",
          "Mansimapatna",
          "Odiso",
          "Premanandapur"
        ]
      },
      {
        "name": "Danagadi",
        "nameOr": "ଦାନଗଦି",
        "gps": [
          "Deulakana",
          "Duburi",
          "Jakhapura",
          "Kalinganagar",
          "Manatira",
          "Salijanga",
          "Trilochanpur",
          "Uchabali"
        ]
      },
      {
        "name": "Dasarathpur",
        "nameOr": "ଦଶରଥପୁର",
        "gps": [
          "Ahiyas",
          "Chhachina",
          "Dasarathpur",
          "Dudhuranta",
          "Kainaragadi",
          "Mangalpur",
          "Nandipur",
          "Susuda"
        ]
      },
      {
        "name": "Dharmasala",
        "nameOr": "ଧର୍ମଶାଳା",
        "gps": [
          "Aruha",
          "Bhabanipur",
          "Deoda",
          "Dharmasala",
          "Jaraka",
          "Jenapur",
          "Kotapur",
          "Mirzapur",
          "Pakhar"
        ]
      },
      {
        "name": "Jajpur Sadar",
        "nameOr": "ଯାଜପୁର ସଦର",
        "gps": [
          "Bhadanga",
          "Bitana",
          "Chitrakul",
          "Jajpur Rural",
          "Markandapur",
          "Nathuabar",
          "Panasa",
          "Santhamadhaba"
        ]
      },
      {
        "name": "Korei",
        "nameOr": "କୋରେଇ",
        "gps": [
          "Asanpur",
          "Bandhalo",
          "Biruan",
          "Jajpur Road Rural",
          "Korei",
          "Kumandala",
          "Panikoili",
          "Tulasipur"
        ]
      },
      {
        "name": "Rasulpur",
        "nameOr": "ରସୁଲପୁର",
        "gps": [
          "Balisahi",
          "Brahmarbarada",
          "Gandhan",
          "Kuakhia",
          "Mahisara",
          "Nathuanagar",
          "Rasulpur",
          "Tikarpada"
        ]
      },
      {
        "name": "Sukinda",
        "nameOr": "ସୁକିନ୍ଦା",
        "gps": [
          "Ampolba",
          "Bhimatangar",
          "Chingudipal",
          "Kansar",
          "Khaisir",
          "Mangalpur",
          "Ransol",
          "Sukinda",
          "Tomka"
        ]
      }
    ]
  },
  "Jharsuguda": {
    "nameOr": "ଝାରସୁଗୁଡ଼ା",
    "constituencies": [
      "Brajarajnagar",
      "Jharsuguda"
    ],
    "ulbs": [
      {
        "name": "Jharsuguda Municipality",
        "nameOr": "ଝାରସୁଗୁଡ଼ା ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 24
      },
      {
        "name": "Brajarajnagar Municipality",
        "nameOr": "ବ୍ରଜରାଜନଗର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 23
      },
      {
        "name": "Belpahar Municipality",
        "nameOr": "ବେଲପାହାଡ଼ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 19
      }
    ],
    "blocks": [
      {
        "name": "Jharsuguda Sadar",
        "nameOr": "ଝାରସୁଗୁଡ଼ା ସଦର",
        "gps": [
          "Badmal",
          "Bhutapali",
          "Chandarapur",
          "Durlaga",
          "Gourmal",
          "Hkatapali",
          "Loisingh",
          "Marakuta",
          "Sripura"
        ]
      },
      {
        "name": "Kirmira",
        "nameOr": "କିର୍ମିରା",
        "gps": [
          "Bandhpali",
          "Ghoramara",
          "Kirmira",
          "Nakti",
          "Niktimal",
          "Sahaspur",
          "Sulahi"
        ]
      },
      {
        "name": "Kolabira",
        "nameOr": "କୋଲାବିରା",
        "gps": [
          "Bimlapur",
          "Chhatenpali",
          "Jhirlapali",
          "Kolabira",
          "Kulihamal",
          "Parmanpur",
          "Samasingha"
        ]
      },
      {
        "name": "Laikera",
        "nameOr": "ଲାଇକେରା",
        "gps": [
          "Bhurkhamunda",
          "Dhutura",
          "Jamgaon",
          "Kulemura",
          "Laikera",
          "Pakelpadar",
          "Salhepur",
          "Sarbahal"
        ]
      },
      {
        "name": "Lakhanpur",
        "nameOr": "ଲଖନପୁର",
        "gps": [
          "Bhikampali",
          "Charpali",
          "Kanaktora",
          "Katarbaga",
          "Lakhanpur",
          "Machida",
          "Pandripali",
          "Panchgaon",
          "Remanda"
        ]
      }
    ]
  },
  "Kalahandi": {
    "nameOr": "କଳାହାଣ୍ଡି",
    "constituencies": [
      "Bhawanipatna",
      "Junagarh",
      "Dharmagarh",
      "Narla",
      "Lanjigarh"
    ],
    "ulbs": [
      {
        "name": "Bhawanipatna Municipality",
        "nameOr": "ଭବାନୀପାଟଣା ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 20
      },
      {
        "name": "Kesinga NAC",
        "nameOr": "କେସିଙ୍ଗା ଏନଏସି",
        "type": "NAC",
        "wards": 12
      },
      {
        "name": "Junagarh NAC",
        "nameOr": "ଜୁନାଗଡ଼ ଏନଏସି",
        "type": "NAC",
        "wards": 12
      },
      {
        "name": "Dharmagarh NAC",
        "nameOr": "ଧର୍ମଗଡ଼ ଏନଏସି",
        "type": "NAC",
        "wards": 13
      }
    ],
    "blocks": [
      {
        "name": "Bhawanipatna Sadar",
        "nameOr": "ଭବାନୀପାଟଣା ସଦର",
        "gps": [
          "Borbhata",
          "Chanchar",
          "Duarsuni",
          "Karlapada",
          "Khamarhaldi",
          "Medinipur",
          "Pastikudi",
          "Rampur",
          "Sagada"
        ]
      },
      {
        "name": "Dharmagarh",
        "nameOr": "ଧର୍ମଗଡ଼",
        "gps": [
          "Borda",
          "Chichia",
          "Dharmagarh Rural",
          "Golamunda",
          "Kankeri",
          "Majhiguda",
          "Parla",
          "Sirol"
        ]
      },
      {
        "name": "Golamunda",
        "nameOr": "ଗୋଲାମୁଣ୍ଡା",
        "gps": [
          "Badachhuan",
          "Bruhabandha",
          "Chahaka",
          "Dhamandanga",
          "Golamunda",
          "Kelei",
          "Khamarhaldi",
          "Soseng"
        ]
      },
      {
        "name": "Jaipatna",
        "nameOr": "ଜୟପାଟଣା",
        "gps": [
          "Badapada",
          "Baner",
          "Bhejipadar",
          "Dhanurjaya",
          "Jaipatna",
          "Mukhiguda",
          "Pratappur",
          "Ranmal"
        ]
      },
      {
        "name": "Junagarh",
        "nameOr": "ଜୁନାଗଡ଼",
        "gps": [
          "Atigaon",
          "Banchhorpada",
          "Charbahal",
          "Chichaiguda",
          "Dalguma",
          "Junagarh Rural",
          "Kaintapadar",
          "Nandol"
        ]
      },
      {
        "name": "Kalampur",
        "nameOr": "କଲମପୁର",
        "gps": [
          "Bandigaon",
          "Bijmara",
          "Harichandanpur",
          "Kalampur",
          "Mandal",
          "Minaguda",
          "Papadahandi"
        ]
      },
      {
        "name": "Karlamunda",
        "nameOr": "କର୍ଲାମୁଣ୍ଡା",
        "gps": [
          "Bhairabgarh",
          "Borpadar",
          "Gajabahal",
          "Karlamunda",
          "Risida",
          "Sapaguda",
          "Therubali"
        ]
      },
      {
        "name": "Kesinga",
        "nameOr": "କେସିଙ୍ଗା",
        "gps": [
          "Belkhandi",
          "Chancher",
          "Deogaon",
          "Kashurapada",
          "Kesinga Rural",
          "Nasigaon",
          "Pipalpadar",
          "Utkela"
        ]
      },
      {
        "name": "Koksara",
        "nameOr": "କୋକସରା",
        "gps": [
          "Ampani",
          "Badakenduguda",
          "Dalguma",
          "Kashibahal",
          "Koksara",
          "Ladugaon",
          "Mahuagaon",
          "Temara"
        ]
      },
      {
        "name": "Lanjigarh",
        "nameOr": "ଲାଞ୍ଜିଗଡ଼",
        "gps": [
          "Bandhapada",
          "Biswanathpur",
          "Chhatrapur",
          "Lanjigarh",
          "Pahadpadar",
          "Pokharibandha",
          "Trilochanpur"
        ]
      },
      {
        "name": "M.Rampur",
        "nameOr": "ମଦନପୁର ରାମପୁର",
        "gps": [
          "Deypur",
          "Kalamdad",
          "Karlapat",
          "M.Rampur",
          "Mohangiri",
          "Pandel",
          "Salepali",
          "Urladani"
        ]
      },
      {
        "name": "Narla",
        "nameOr": "ନର୍ଲା",
        "gps": [
          "Bagpur",
          "Bhimkela",
          "Dhubamunda",
          "Ghadabhata",
          "Kalamdad",
          "Mandarpadar",
          "Narla",
          "Rupra Road",
          "Sergarh"
        ]
      },
      {
        "name": "Thuamul Rampur",
        "nameOr": "ଥୁଆମୂଳ ରାମପୁର",
        "gps": [
          "Adri",
          "Gunupur",
          "Karlapat",
          "Mahulpatna",
          "Nakrundi",
          "Sialilati",
          "Thuamul Rampur"
        ]
      }
    ]
  },
  "Kandhamal": {
    "nameOr": "କନ୍ଧମାଳ",
    "constituencies": [
      "Baliguda",
      "G. Udayagiri",
      "Phulbani"
    ],
    "ulbs": [
      {
        "name": "Phulbani Municipality",
        "nameOr": "ଫୁଲବାଣୀ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 13
      },
      {
        "name": "G. Udayagiri NAC",
        "nameOr": "ଜି. ଉଦୟଗିରି ଏନଏସି",
        "type": "NAC",
        "wards": 13
      },
      {
        "name": "Baliguda NAC",
        "nameOr": "ବାଲିଗୁଡ଼ା ଏନଏସି",
        "type": "NAC",
        "wards": 13
      }
    ],
    "blocks": [
      {
        "name": "Balliguda",
        "nameOr": "ବାଲିଗୁଡ଼ା",
        "gps": [
          "Barkhama",
          "Batamaha",
          "Budrukia",
          "Khamankhole",
          "Landagaon",
          "Mediakia",
          "Rebingia",
          "Sankarakhole"
        ]
      },
      {
        "name": "Chakapad",
        "nameOr": "ଚକାପାଦ",
        "gps": [
          "Balisahi",
          "Chakapad",
          "Chahali",
          "Ghutatingia",
          "Kakharujhari",
          "Papadaguda",
          "Salaguda"
        ]
      },
      {
        "name": "Daringbadi",
        "nameOr": "ଦାରିଙ୍ଗବାଡ଼ି",
        "gps": [
          "Badabadi",
          "Bakingia",
          "Bhranadabadi",
          "Daringbadi",
          "Greenbadi",
          "Kirikutia",
          "Saraniketa",
          "Siangbali"
        ]
      },
      {
        "name": "G.Udayagiri",
        "nameOr": "ଜି.ଉଦୟଗିରି",
        "gps": [
          "Balandapada",
          "G.Udayagiri Rural",
          "Kalinga",
          "Mallikpadi",
          "Raheki",
          "Ranaba",
          "Tikarapada"
        ]
      },
      {
        "name": "K.Nuagaon",
        "nameOr": "କେ.ନୂଆଗାଁ",
        "gps": [
          "Bandhagada",
          "Gunjibadi",
          "K.Nuagaon",
          "Kudutuli",
          "Mahasingh",
          "Pusangia",
          "Sadingia"
        ]
      },
      {
        "name": "Khajuripada",
        "nameOr": "ଖଜୁରୀପଡ଼ା",
        "gps": [
          "Balaskumpa",
          "Bhrungijodi",
          "Dutipada",
          "Khajuripada",
          "Nuapadar",
          "Samapaju",
          "Sudrukumpa"
        ]
      },
      {
        "name": "Kotagarh",
        "nameOr": "କୋଟଗଡ଼",
        "gps": [
          "Balsahi",
          "Bondaguda",
          "Durgapanga",
          "Kotagarh",
          "Pangabali",
          "Srirampur",
          "Subarnagiri"
        ]
      },
      {
        "name": "Phiringia",
        "nameOr": "ଫିରିଙ୍ଗିଆ",
        "gps": [
          "Balandapada",
          "Kasinipadar",
          "Kelapada",
          "Luising",
          "Paburia",
          "Phiringia",
          "Ratamati",
          "Samaguda"
        ]
      },
      {
        "name": "Phulbani Sadar",
        "nameOr": "ଫୁଲବାଣୀ ସଦର",
        "gps": [
          "Alami",
          "Balisahi",
          "Gudari",
          "Gumma",
          "Katringia",
          "Minia",
          "Phulbani Rural",
          "Tudipaju"
        ]
      },
      {
        "name": "Raikia",
        "nameOr": "ରାଇକିଆ",
        "gps": [
          "Badaba",
          "Dadapada",
          "Karada",
          "Mandasaru",
          "Manikeswar",
          "Petapanga",
          "Raikia",
          "Ranaba"
        ]
      },
      {
        "name": "Tikabali",
        "nameOr": "ଟିକାବାଲି",
        "gps": [
          "Barapali",
          "Chakapad",
          "Dangariguda",
          "Gadapada",
          "Kainjhar",
          "Paburia",
          "Sankarakhole",
          "Tikabali"
        ]
      },
      {
        "name": "Tumudibandha",
        "nameOr": "ତୁମୁଡ଼ିବନ୍ଧ",
        "gps": [
          "Belghar",
          "Bilabadi",
          "Guma",
          "Jhiripani",
          "Kurtamgarh",
          "Mundigarh",
          "Tumudibandha"
        ]
      }
    ]
  },
  "Kendrapara": {
    "nameOr": "କେନ୍ଦ୍ରାପଡ଼ା",
    "constituencies": [
      "Aul",
      "Rajanagar",
      "Mahakalapada",
      "Kendrapara",
      "Patkura"
    ],
    "ulbs": [
      {
        "name": "Kendrapara Municipality",
        "nameOr": "କେନ୍ଦ୍ରାପଡ଼ା ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 21
      },
      {
        "name": "Pattamundai Municipality",
        "nameOr": "ପଟ୍ଟାମୁଣ୍ଡାଇ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 20
      }
    ],
    "blocks": [
      {
        "name": "Aul",
        "nameOr": "ଆଳି",
        "gps": [
          "Aul",
          "Batipada",
          "Bhairabpur",
          "Demal",
          "Govindpur",
          "Kandira",
          "Mendhapur",
          "Nial",
          "Sanamangala"
        ]
      },
      {
        "name": "Derabish",
        "nameOr": "ଡେରାବିଶ",
        "gps": [
          "Benakandha",
          "Chhachina",
          "Danpur",
          "Derabish",
          "Golara",
          "Mangalpur",
          "Nandapatna",
          "Raghunathpur"
        ]
      },
      {
        "name": "Garadpur",
        "nameOr": "ଗରଦପୁର",
        "gps": [
          "Bentapur",
          "Bhangara",
          "Garadpur",
          "Kalarabank",
          "Korasahi",
          "Madhasasan",
          "Padmapur",
          "Tikarpada"
        ]
      },
      {
        "name": "Kendrapara Sadar",
        "nameOr": "କେନ୍ଦ୍ରାପଡ଼ା ସଦର",
        "gps": [
          "Bagada",
          "Barimula",
          "Chagharia",
          "Dumuka",
          "Gulnagar",
          "Kapasasi",
          "Kendrapara Rural",
          "Ostapur"
        ]
      },
      {
        "name": "Mahakalapada",
        "nameOr": "ମହାକାଳପଡ଼ା",
        "gps": [
          "Badakul",
          "Baradanga",
          "Batighar",
          "Hukitola",
          "Jambu",
          "Kharinasi",
          "Mahakalapada",
          "Ramnagar",
          "Suniti"
        ]
      },
      {
        "name": "Marshaghai",
        "nameOr": "ମାର୍ଶାଘାଇ",
        "gps": [
          "Akorua",
          "Berhampur",
          "Dumuka",
          "Jadupur",
          "Karilopatna",
          "Marshaghai",
          "Silipur",
          "Talapada"
        ]
      },
      {
        "name": "Pattamundai",
        "nameOr": "ପଟ୍ଟାମୁଣ୍ଡାଇ",
        "gps": [
          "Alapua",
          "Badasirei",
          "Balipada",
          "Chandanagar",
          "Dosia",
          "Kakhadi",
          "Pattamundai Rural",
          "Sanajharia"
        ]
      },
      {
        "name": "Rajkanika",
        "nameOr": "ରାଜକନିକା",
        "gps": [
          "Baradia",
          "Bharigada",
          "Devalgiri",
          "Jaynagar",
          "Kateni",
          "Nuagaon",
          "Oupada",
          "Rajkanika",
          "Tarasa"
        ]
      },
      {
        "name": "Rajnagar",
        "nameOr": "ରାଜନଗର",
        "gps": [
          "Bhitarkanika",
          "Dangamal",
          "Gahirmatha",
          "Gupti",
          "Hansina",
          "Kandira",
          "Mahisakhala",
          "Rajnagar",
          "Talachua"
        ]
      }
    ]
  },
  "Kendujhar": {
    "nameOr": "କେନ୍ଦୁଝର",
    "constituencies": [
      "Telkoi",
      "Ghasipura",
      "Anandapur",
      "Patna",
      "Keonjhar",
      "Champua"
    ],
    "ulbs": [
      {
        "name": "Keonjhar Municipality",
        "nameOr": "କେନ୍ଦୁଝର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 21
      },
      {
        "name": "Barbil Municipality",
        "nameOr": "ବଡ଼ବିଲ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 15
      },
      {
        "name": "Anandapur Municipality",
        "nameOr": "ଆନନ୍ଦପୁର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 16
      },
      {
        "name": "Joda Municipality",
        "nameOr": "ଯୋଡ଼ା ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 14
      },
      {
        "name": "Champua NAC",
        "nameOr": "ଚମ୍ପୁଆ ଏନଏସି",
        "type": "NAC",
        "wards": 13
      }
    ],
    "blocks": [
      {
        "name": "Anandapur",
        "nameOr": "ଆନନ୍ଦପୁର",
        "gps": [
          "Baunsagarh",
          "Belabahali",
          "Dharampur",
          "Ghasipura",
          "Kantipal",
          "Kolimati",
          "Panchapalli",
          "Sailong"
        ]
      },
      {
        "name": "Bansapal",
        "nameOr": "ବାଂଶପାଳ",
        "gps": [
          "Bayakumutia",
          "Gonasika",
          "Jatra",
          "Khandadhar",
          "Kumundi",
          "Saharpur",
          "Talachampei",
          "Telnur"
        ]
      },
      {
        "name": "Champua",
        "nameOr": "ଚମ୍ପୁଆ",
        "gps": [
          "Bhanda",
          "Champua Rural",
          "Godhuli",
          "Jajang",
          "Karanjia",
          "Panchapokharia",
          "Rimuli",
          "Uchabali"
        ]
      },
      {
        "name": "Ghasipura",
        "nameOr": "ଘସିପୁରା",
        "gps": [
          "Alati",
          "Bhandaripokhari",
          "Deogaon",
          "Ghasipura",
          "Kesa",
          "Kolimati",
          "Madanpur",
          "Sainkul"
        ]
      },
      {
        "name": "Ghatgaon",
        "nameOr": "ଘଟଗାଁ",
        "gps": [
          "Barahatipura",
          "Dhenkikote",
          "Ghatgaon",
          "Manoharpur",
          "Pipilia",
          "Purumunda",
          "Tarini Nagar",
          "Tolankapada"
        ]
      },
      {
        "name": "Harichandanpur",
        "nameOr": "ହରିଚନ୍ଦନପୁର",
        "gps": [
          "Badapasi",
          "Brahmanideo",
          "Daitari",
          "Harichandanpur",
          "Janghira",
          "Pandapada",
          "Pitapiti",
          "Sunapasi"
        ]
      },
      {
        "name": "Hatadihi",
        "nameOr": "ହାଟଡିହି",
        "gps": [
          "Ambo",
          "Balana",
          "Bido",
          "Chhenapadi",
          "Hadagarh",
          "Hatadihi",
          "Insol",
          "Mariba",
          "Soso"
        ]
      },
      {
        "name": "Jhumpura",
        "nameOr": "ଝୁମ୍ପୁରା",
        "gps": [
          "Arsala",
          "Balibandha",
          "Baria",
          "Chheliagod",
          "Jhumpura",
          "Karanjia",
          "Malada",
          "Ukhunda"
        ]
      },
      {
        "name": "Joda Block",
        "nameOr": "ଯୋଡ଼ା ବ୍ଲକ",
        "gps": [
          "Bileipada",
          "Bolani",
          "Deojhar",
          "Guali",
          "Joda Rural",
          "Kamando",
          "Palasa",
          "Serenda"
        ]
      },
      {
        "name": "Keonjhar Sadar",
        "nameOr": "କେନ୍ଦୁଝର ସଦର",
        "gps": [
          "Balisahi",
          "Dimbo",
          "Gopinathpur",
          "Mandua",
          "Nuagaon",
          "Padmapur",
          "Raisuan",
          "Ranki"
        ]
      },
      {
        "name": "Patna",
        "nameOr": "ପାଟଣା",
        "gps": [
          "Badadumula",
          "Budhikapudi",
          "Chakradharpur",
          "Dumuria",
          "Erelei",
          "Kendupasi",
          "Patna",
          "Rajabati"
        ]
      },
      {
        "name": "Saharapada",
        "nameOr": "ସାହାରପଡ଼ା",
        "gps": [
          "Bada Nuagaon",
          "Baliposi",
          "Gundichapada",
          "Karanjia",
          "Machhagarh",
          "Saharapada",
          "Tendera"
        ]
      },
      {
        "name": "Telkoi",
        "nameOr": "ତେଲକୋଇ",
        "gps": [
          "Akul",
          "Bhimakand",
          "Chhamunda",
          "Deuladiha",
          "Jagamohanpur",
          "Kaliahata",
          "Purunaguma",
          "Telkoi"
        ]
      }
    ]
  },
  "Khordha": {
    "nameOr": "ଖୋର୍ଦ୍ଧା",
    "constituencies": [
      "Jayadev",
      "Bhubaneswar Central",
      "Bhubaneswar North",
      "Ekamra-Bhubaneswar",
      "Jatani",
      "Begunia",
      "Khurda",
      "Chilika"
    ],
    "ulbs": [
      {
        "name": "BMC (Bhubaneswar Municipal Corporation)",
        "nameOr": "ବିଏମସି (ଭୁବନେଶ୍ୱର ମହାନଗର ନିଗମ)",
        "type": "Corporation",
        "wards": 67
      },
      {
        "name": "Khordha Municipality",
        "nameOr": "ଖୋର୍ଦ୍ଧା ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 22
      },
      {
        "name": "Jatani Municipality",
        "nameOr": "ଜଟଣୀ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 23
      },
      {
        "name": "Banapur NAC",
        "nameOr": "ବାଣପୁର ଏନଏସି",
        "type": "NAC",
        "wards": 15
      },
      {
        "name": "Balugaon NAC",
        "nameOr": "ବାଲୁଗାଁ ଏନଏସି",
        "type": "NAC",
        "wards": 11
      }
    ],
    "blocks": [
      {
        "name": "Balianta",
        "nameOr": "ବାଳିଅନ୍ତା",
        "gps": [
          "Balianta",
          "Benupur",
          "Bhingarpur",
          "Jharpada",
          "Kakharua",
          "Puranapadhan",
          "Prataprudrapur",
          "Satyabhamapur",
          "Umapada"
        ]
      },
      {
        "name": "Balipatna",
        "nameOr": "ବାଳିପାଟଣା",
        "gps": [
          "Balipatna",
          "Banamalipur",
          "Kuranjipur",
          "Majhona",
          "Pampalo",
          "Rajas",
          "Turintira"
        ]
      },
      {
        "name": "Banapur",
        "nameOr": "ବାଣପୁର",
        "gps": [
          "Achharakote",
          "Bhatta Sahi",
          "Gambharimunda",
          "Kandagotha",
          "Niladriprasad",
          "Tumuraput"
        ]
      },
      {
        "name": "Begunia",
        "nameOr": "ବେଗୁନିଆ",
        "gps": [
          "Badaberana",
          "Begunia",
          "Durgapur",
          "Gobindapur",
          "Kantabada",
          "Pichukuli",
          "Siko"
        ]
      },
      {
        "name": "Bhubaneswar Block",
        "nameOr": "ଭୁବନେଶ୍ୱର ବ୍ଲକ",
        "gps": [
          "Basuaghai",
          "Dhauli",
          "Garhsanput",
          "Itipur",
          "Kalyanpur",
          "Kaimatia",
          "Lingipur",
          "Padmakesarpur",
          "Palasapur",
          "Ransinghpur",
          "Sisupalgarh"
        ]
      },
      {
        "name": "Bologarh",
        "nameOr": "ବୋଲଗଡ଼",
        "gps": [
          "Arikama",
          "Bankoi",
          "Bologarh",
          "Dhurusia",
          "Kalangapada",
          "Sanapadar"
        ]
      },
      {
        "name": "Chilika",
        "nameOr": "ଚିଲିକା",
        "gps": [
          "Ankulpatna",
          "Badakul",
          "Biribadi",
          "Chilika",
          "Haripur",
          "Kumarpur",
          "Sorana"
        ]
      },
      {
        "name": "Jatni Block",
        "nameOr": "ଜଟଣୀ ବ୍ଲକ",
        "gps": [
          "Bachharpatna",
          "Benapanjari",
          "Chhatabar",
          "Janla",
          "Kantabada",
          "Kudiary",
          "Padanpur",
          "Taraboi"
        ]
      },
      {
        "name": "Khordha Sadar",
        "nameOr": "ଖୋର୍ଦ୍ଧା ସଦର",
        "gps": [
          "Bajpur",
          "Gudum",
          "Jankia",
          "Kaipadar",
          "Keranga",
          "Maniabandha",
          "Pallitangi",
          "Tapanga"
        ]
      },
      {
        "name": "Tangi",
        "nameOr": "ଟାଙ୍ଗୀ",
        "gps": [
          "Achhutapur",
          "Badapokharia",
          "Bhushandapur",
          "Chhanagiri",
          "Kuhudi",
          "Mangalajodi",
          "Olasingh",
          "Rameswar",
          "Sundarpur",
          "Tangi"
        ]
      }
    ]
  },
  "Koraput": {
    "nameOr": "କୋରାପୁଟ",
    "constituencies": [
      "Kotpad",
      "Jeypore",
      "Koraput",
      "Pottangi"
    ],
    "ulbs": [
      {
        "name": "Jeypore Municipality",
        "nameOr": "ଜୟପୁର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 28
      },
      {
        "name": "Koraput Municipality",
        "nameOr": "କୋରାପୁଟ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 21
      },
      {
        "name": "Sunabeda Municipality",
        "nameOr": "ସୁନାବେଡ଼ା ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 25
      },
      {
        "name": "Kotpad NAC",
        "nameOr": "କୋଟପାଡ଼ ଏନଏସି",
        "type": "NAC",
        "wards": 13
      }
    ],
    "blocks": [
      {
        "name": "Bandhugaon",
        "nameOr": "ବନ୍ଧୁଗାଁ",
        "gps": [
          "Bandhugaon",
          "Bheja",
          "Katiki",
          "Kumbhariput",
          "Nilavadi",
          "Sanyasiput"
        ]
      },
      {
        "name": "Boipariguda",
        "nameOr": "ବୈପାରୀଗୁଡ଼ା",
        "gps": [
          "Boipariguda",
          "Chandrapada",
          "Doraguda",
          "Gupteswar",
          "Majhiguda",
          "Ramagiri",
          "Tenteipadar"
        ]
      },
      {
        "name": "Borigumma",
        "nameOr": "ବୋରିଗୁମ୍ମା",
        "gps": [
          "Benasur",
          "Borigumma",
          "Champapadar",
          "Kamara",
          "Kotpad Road",
          "Kumuli",
          "Raniguda",
          "Sasahandi"
        ]
      },
      {
        "name": "Dasamantapur",
        "nameOr": "ଦଶମନ୍ତପୁର",
        "gps": [
          "Dasamantapur",
          "Dumuripadar",
          "Gaudaguda",
          "Lula",
          "Murkar",
          "Podagada"
        ]
      },
      {
        "name": "Jeypore Sadar",
        "nameOr": "ଜୟପୁର ସଦର",
        "gps": [
          "Ambaguda",
          "Baliguda",
          "Dhanpur",
          "Gagapur",
          "Jeypore Rural",
          "Kalyanguda",
          "Phampuni",
          "Umuri"
        ]
      },
      {
        "name": "Koraput Sadar",
        "nameOr": "କୋରାପୁଟ ସଦର",
        "gps": [
          "Badadumuriput",
          "Deoghati",
          "Kerenga",
          "Lankaput",
          "Mahadeiput",
          "Padmapur",
          "Semiliguda"
        ]
      },
      {
        "name": "Kotpad",
        "nameOr": "କୋଟପାଡ଼",
        "gps": [
          "Bhatiguda",
          "Chitra",
          "Girla",
          "Kotpad Rural",
          "Kusumi",
          "Murtahandi",
          "Sadhanga"
        ]
      },
      {
        "name": "Kundura",
        "nameOr": "କୁନ୍ଦୁରା",
        "gps": [
          "Bada Alubadi",
          "Baghaguda",
          "Digapur",
          "Gaudaguda",
          "Kundura",
          "Raniguda"
        ]
      },
      {
        "name": "Lamtaput",
        "nameOr": "ଲାମତାପୁଟ",
        "gps": [
          "Balisana",
          "Hanumanput",
          "Jalalput",
          "Kadaliput",
          "Lamtaput",
          "Machhkund",
          "Padua"
        ]
      },
      {
        "name": "Laxmipur",
        "nameOr": "ଲକ୍ଷ୍ମୀପୁର",
        "gps": [
          "Burja",
          "Kakilipadar",
          "Kutinga",
          "Laxmipur",
          "Panchada",
          "Toyaput"
        ]
      },
      {
        "name": "Nandapur",
        "nameOr": "ନନ୍ଦପୁର",
        "gps": [
          "Badikanta",
          "Chatwa",
          "Goluru",
          "Nandapur",
          "Padua",
          "Raniguda"
        ]
      },
      {
        "name": "Narayanpatna",
        "nameOr": "ନାରାୟଣପାଟଣା",
        "gps": [
          "Borigi",
          "Damanjodi",
          "Langalput",
          "Narayanpatna",
          "Podapadar",
          "Tentulipadar"
        ]
      },
      {
        "name": "Pottangi",
        "nameOr": "ପୋଟାଙ୍ଗୀ",
        "gps": [
          "Chandaka",
          "Deomali",
          "Kandapadar",
          "Maliput",
          "Pottangi",
          "Ralegada",
          "Sunabeda Rural"
        ]
      },
      {
        "name": "Semiliguda",
        "nameOr": "ସେମିଳିଗୁଡ଼ା",
        "gps": [
          "Charangul",
          "Doliamba",
          "Karanjaguda",
          "Kunduli",
          "Pakjhola",
          "Semiliguda",
          "Subai"
        ]
      }
    ]
  },
  "Malkangiri": {
    "nameOr": "ମାଲକାନଗିରି",
    "constituencies": [
      "Malkangiri",
      "Chitrakonda"
    ],
    "ulbs": [
      {
        "name": "Malkangiri Municipality",
        "nameOr": "ମାଲକାନଗିରି ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 19
      },
      {
        "name": "Balimela NAC",
        "nameOr": "ବାଲିମେଳା ଏନଏସି",
        "type": "NAC",
        "wards": 12
      }
    ],
    "blocks": [
      {
        "name": "Chitrakonda / Kudumulugumma",
        "nameOr": "କୁଡୁମୁଲୁଗୁମ୍ମା",
        "gps": [
          "Badapadar",
          "Balimela Rural",
          "Chitrakonda",
          "Kudumulugumma",
          "Orkel",
          "Panasput",
          "Ralegada"
        ]
      },
      {
        "name": "Kalimela",
        "nameOr": "କାଲିମେଳା",
        "gps": [
          "Bhejangiwada",
          "Chintalwada",
          "Gompakonda",
          "Kalimela",
          "Kangurukonda",
          "Koimetla",
          "Manyamkonda",
          "Tigari"
        ]
      },
      {
        "name": "Khairput",
        "nameOr": "ଖଇରପୁଟ",
        "gps": [
          "Andrahal",
          "Bonda Hills",
          "Govindapalli",
          "Khairput",
          "Mudulipada",
          "Rasabeda"
        ]
      },
      {
        "name": "Korukonda",
        "nameOr": "କୋରୁକୋଣ୍ଡା",
        "gps": [
          "Chalanguda",
          "Kamwada",
          "Karkatpalli",
          "Korukonda",
          "Marlapalli",
          "Potrel",
          "Somnathpur"
        ]
      },
      {
        "name": "Malkangiri Sadar",
        "nameOr": "ମାଲକାନଗିରି ସଦର",
        "gps": [
          "Badili",
          "Gowdaguda",
          "Koiguram",
          "Malkangiri Rural",
          "Pandiaguda",
          "Sindrimul",
          "Tumapalli"
        ]
      },
      {
        "name": "Mathili",
        "nameOr": "ମାଥିଲି",
        "gps": [
          "Dalapatiguda",
          "Doliamba",
          "Kartannpalli",
          "Kiang",
          "Mahupadar",
          "Mathili",
          "Salimi",
          "Temurupalli"
        ]
      },
      {
        "name": "Podia",
        "nameOr": "ପୋଡ଼ିଆ",
        "gps": [
          "Bapanpalli",
          "Kailashnagar",
          "Materu",
          "Mottu",
          "Nilakota",
          "Padmagiri",
          "Podia"
        ]
      }
    ]
  },
  "Mayurbhanj": {
    "nameOr": "ମୟୂରଭଞ୍ଜ",
    "constituencies": [
      "Jashipur",
      "Saraskana",
      "Rairangpur",
      "Bangiriposi",
      "Karanjia",
      "Udala",
      "Badasahi",
      "Baripada",
      "Morada"
    ],
    "ulbs": [
      {
        "name": "Baripada Municipality",
        "nameOr": "ବାରିପଦା ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 28
      },
      {
        "name": "Rairangpur Municipality",
        "nameOr": "ରାଇରଙ୍ଗପୁର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 15
      },
      {
        "name": "Karanjia NAC",
        "nameOr": "କରଞ୍ଜିଆ ଏନଏସି",
        "type": "NAC",
        "wards": 15
      },
      {
        "name": "Udala NAC",
        "nameOr": "ଉଦଳା ଏନଏସି",
        "type": "NAC",
        "wards": 12
      }
    ],
    "blocks": [
      {
        "name": "Badasahi",
        "nameOr": "ବଡ଼ସାହି",
        "gps": [
          "Badasahi",
          "Balabhadrapur",
          "Chhenapadi",
          "Deulia",
          "Manatri",
          "Paunsia",
          "Talapada"
        ]
      },
      {
        "name": "Bahalda",
        "nameOr": "ବାହଳଦା",
        "gps": [
          "Asana",
          "Bahalda",
          "Gidighaty",
          "Jharpokharia",
          "Kanika",
          "Manda",
          "Sasangada"
        ]
      },
      {
        "name": "Bangiriposi",
        "nameOr": "ବାଙ୍ଗିରିପୋଷି",
        "gps": [
          "Bangiriposi",
          "Bhatachhatra",
          "Chakidi",
          "Gopinathpur",
          "Khadamsole",
          "Ransol"
        ]
      },
      {
        "name": "Baripada Sadar",
        "nameOr": "ବାରିପଦା ସଦର",
        "gps": [
          "Badjode",
          "Baripada Rural",
          "Budhikhamari",
          "Chorda",
          "Gadi",
          "Laxmiposi",
          "Purnachandrapur"
        ]
      },
      {
        "name": "Betnoti",
        "nameOr": "ବେତନଟୀ",
        "gps": [
          "Agria",
          "Anla",
          "Baisinga",
          "Betnoti",
          "Dahikoti",
          "Merda",
          "Sankhabhanga"
        ]
      },
      {
        "name": "Bijatala",
        "nameOr": "ବିଜାତଳା",
        "gps": [
          "Bijatala",
          "Khandabandha",
          "Luhasila",
          "Raihari",
          "Saragada"
        ]
      },
      {
        "name": "Bisoi",
        "nameOr": "ବିଶୋଇ",
        "gps": [
          "Asanbani",
          "Bisoi",
          "Kala",
          "Manida",
          "Saradhapur"
        ]
      },
      {
        "name": "Gopabandhunagar",
        "nameOr": "ଗୋପବନ୍ଧୁନଗର",
        "gps": [
          "Badasahi",
          "Gopabandhunagar",
          "Kainsari",
          "Kuchei",
          "Ranibandh"
        ]
      },
      {
        "name": "Jamda",
        "nameOr": "ଜାମଦା",
        "gps": [
          "Badadunguri",
          "Jamda",
          "Pasna",
          "Tiring"
        ]
      },
      {
        "name": "Jashipur",
        "nameOr": "ଯଶୀପୁର",
        "gps": [
          "Baidyanath",
          "Durga",
          "Gudgudia",
          "Jashipur",
          "Khairi",
          "Matiagarh",
          "Similipal"
        ]
      },
      {
        "name": "Kaptipada",
        "nameOr": "କପ୍ତିପଦା",
        "gps": [
          "Dewala",
          "Kalamgadia",
          "Kaptipada",
          "Manida",
          "Nato",
          "Pedagadi",
          "Salchua"
        ]
      },
      {
        "name": "Karanjia",
        "nameOr": "କରଞ୍ଜିଆ",
        "gps": [
          "Bada Deuli",
          "Chitrada",
          "Karanjia Rural",
          "Kulikata",
          "Rasamtala",
          "Tata"
        ]
      },
      {
        "name": "Khunta",
        "nameOr": "ଖୁଣ୍ଟା",
        "gps": [
          "Badagan",
          "Bhangabandi",
          "Dukura",
          "Karakachhia",
          "Khunta",
          "Ranibandh"
        ]
      },
      {
        "name": "Koliana / Kuliana",
        "nameOr": "କୁଳିଅଣା",
        "gps": [
          "Chandua",
          "Ghatasila",
          "Kuabuda",
          "Kuliana",
          "Manikpur",
          "Sarat"
        ]
      },
      {
        "name": "Kusumi",
        "nameOr": "କୁସୁମୀ",
        "gps": [
          "Badampahar",
          "Hatbadra",
          "Kusumi",
          "Palaspal",
          "Suleipat"
        ]
      },
      {
        "name": "Morada",
        "nameOr": "ମୋରଡ଼ା",
        "gps": [
          "Chitrada",
          "Dantan",
          "Godia",
          "Kishorpur",
          "Morada",
          "Sanmundabali"
        ]
      },
      {
        "name": "Rairangpur Block",
        "nameOr": "ରାଇରଙ୍ଗପୁର ବ୍ଲକ",
        "gps": [
          "Badbhalia",
          "Gorumahisani",
          "Kaduani",
          "Rairangpur Rural",
          "Sanapakhana"
        ]
      },
      {
        "name": "Raruan",
        "nameOr": "ରାରୁଆଁ",
        "gps": [
          "Bhanjakia",
          "Goudagan",
          "Khadang",
          "Nuagaon",
          "Raruan"
        ]
      },
      {
        "name": "Rasgovindpur",
        "nameOr": "ରାସଗୋବିନ୍ଦପୁର",
        "gps": [
          "Amarda",
          "Baitpur",
          "Chakradharpur",
          "Debala",
          "Rasgovindpur"
        ]
      },
      {
        "name": "Samakhunta",
        "nameOr": "ଶାମାଖୁଣ୍ଟା",
        "gps": [
          "Balidiha",
          "Brundabanpur",
          "Kochilakhunta",
          "Pithabata",
          "Samakhunta"
        ]
      },
      {
        "name": "Saraskana",
        "nameOr": "ସାରସକଣା",
        "gps": [
          "Jharpokharia",
          "Murunia",
          "Pokharia",
          "Rajaloka",
          "Saraskana",
          "Sirsa"
        ]
      },
      {
        "name": "Sukruli",
        "nameOr": "ଶୁକ୍ରୁଳି",
        "gps": [
          "Bhaduagoda",
          "Chakidi",
          "Khadapada",
          "Sukruli",
          "Tentulidiha"
        ]
      },
      {
        "name": "Suliapada",
        "nameOr": "ସୁଳିଆପଦା",
        "gps": [
          "Baghabuda",
          "Kostha",
          "Kulasahi",
          "Shankhabhanga",
          "Suliapada"
        ]
      },
      {
        "name": "Thakurmunda",
        "nameOr": "ଠାକୁରମୁଣ୍ଡା",
        "gps": [
          "Champajhar",
          "Hatigoda",
          "Kendujiani",
          "Mahulpanka",
          "Salchua",
          "Thakurmunda"
        ]
      },
      {
        "name": "Tiring",
        "nameOr": "ତିରିଂ",
        "gps": [
          "Gambharia",
          "Gudgudia",
          "Patpur",
          "Rangamatia",
          "Tiring"
        ]
      },
      {
        "name": "Udala Block",
        "nameOr": "ଉଦଳା ବ୍ଲକ",
        "gps": [
          "Bada Kuanr",
          "Khadisahi",
          "Kukudagadia",
          "Radho",
          "Udala Rural"
        ]
      }
    ]
  },
  "Nabarangpur": {
    "nameOr": "ନବରଙ୍ଗପୁର",
    "constituencies": [
      "Umerkote",
      "Jharigam",
      "Nabarangpur",
      "Dabugam"
    ],
    "ulbs": [
      {
        "name": "Nabarangpur Municipality",
        "nameOr": "ନବରଙ୍ଗପୁର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 17
      },
      {
        "name": "Umerkote Municipality",
        "nameOr": "ଉମରକୋଟ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 14
      },
      {
        "name": "Khatiguda NAC",
        "nameOr": "ଖାତିଗୁଡ଼ା ଏନଏସି",
        "type": "NAC",
        "wards": 11
      }
    ],
    "blocks": [
      {
        "name": "Chandahandi",
        "nameOr": "ଚନ୍ଦାହାଣ୍ଡି",
        "gps": [
          "Anlabhata",
          "Chandahandi",
          "Dalabeda",
          "Fasaguda",
          "Gambhariguda",
          "Jamadarpara"
        ]
      },
      {
        "name": "Dabugam",
        "nameOr": "ଡାବୁଗାଁ",
        "gps": [
          "Chacharabandha",
          "Dabugam",
          "Dhamanahandi",
          "Jatabal",
          "Medana",
          "Nuagaon"
        ]
      },
      {
        "name": "Jharigam",
        "nameOr": "ଝରିଗାଁ",
        "gps": [
          "Baniaguda",
          "Chikalpadar",
          "Gurusinga",
          "Ichhapur",
          "Jharigam",
          "Palashguda"
        ]
      },
      {
        "name": "Kosagumuda",
        "nameOr": "କୋଡ଼ିଙ୍ଗା / କୋଷାଗୁମୁଡ଼ା",
        "gps": [
          "Attalguda",
          "Bhamini",
          "Kodinga",
          "Kosagumuda",
          "Motigaon",
          "Santoshpur"
        ]
      },
      {
        "name": "Nabarangpur Sadar",
        "nameOr": "ନବରଙ୍ଗପୁର ସଦର",
        "gps": [
          "Bada Atalguda",
          "Chamuriaguda",
          "Daibhata",
          "Karanjaguda",
          "Nabarangpur Rural",
          "Pujariguda"
        ]
      },
      {
        "name": "Nandahandi",
        "nameOr": "ନନ୍ଦାହାଣ୍ଡି",
        "gps": [
          "Dangasorada",
          "Dhondra",
          "Jhadabandha",
          "Malisahi",
          "Nandahandi",
          "Sindhiguda"
        ]
      },
      {
        "name": "Papadahandi",
        "nameOr": "ପାପଡ଼ାହାଣ୍ଡି",
        "gps": [
          "Boriguda",
          "Champapadar",
          "Dongariguda",
          "Maidalpur",
          "Papadahandi",
          "Sanaparla"
        ]
      },
      {
        "name": "Raighar",
        "nameOr": "ରାଇଘର",
        "gps": [
          "Gona",
          "Haldi",
          "Jhorigam",
          "Kachhabara",
          "Kundei",
          "Raighar",
          "Turudihi"
        ]
      },
      {
        "name": "Tentulikhunti",
        "nameOr": "ତେନ୍ତୁଳିଖୁଣ୍ଟି",
        "gps": [
          "Ankiguda",
          "Digapur",
          "Khatiguda",
          "Kukudabai",
          "Patraput",
          "Tentulikhunti"
        ]
      },
      {
        "name": "Umerkote Block",
        "nameOr": "ଉମରକୋଟ ବ୍ଲକ",
        "gps": [
          "Bakoda",
          "Beheramunda",
          "Dharambeda",
          "Karanjaguda",
          "Mururtahandi",
          "Umerkote Rural"
        ]
      }
    ]
  },
  "Nayagarh": {
    "nameOr": "ନୟାଗଡ଼",
    "constituencies": [
      "Daspalla",
      "Ranpur",
      "Khandapada",
      "Nayagarh"
    ],
    "ulbs": [
      {
        "name": "Nayagarh Municipality",
        "nameOr": "ନୟାଗଡ଼ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 16
      },
      {
        "name": "Khandapada NAC",
        "nameOr": "ଖଣ୍ଡପଡ଼ା ଏନଏସି",
        "type": "NAC",
        "wards": 13
      },
      {
        "name": "Daspalla NAC",
        "nameOr": "ଦଶପଲ୍ଲା ଏନଏସି",
        "type": "NAC",
        "wards": 16
      },
      {
        "name": "Ranpur NAC",
        "nameOr": "ରଣପୁର ଏନଏସି",
        "type": "NAC",
        "wards": 15
      },
      {
        "name": "Odagaon NAC",
        "nameOr": "ଓଡ଼ଗାଁ ଏନଏସି",
        "type": "NAC",
        "wards": 15
      }
    ],
    "blocks": [
      {
        "name": "Bhapur",
        "nameOr": "ଭାପୁର",
        "gps": [
          "Bijipur",
          "Bhapur",
          "Fategarh",
          "Kantilo Rural",
          "Nimani",
          "Padmabati",
          "Salapada"
        ]
      },
      {
        "name": "Daspalla",
        "nameOr": "ଦଶପଲ୍ଲା",
        "gps": [
          "Badakul",
          "Banigochha",
          "Chhamundia",
          "Daspalla Rural",
          "Gania",
          "Kuanria",
          "Madhapur",
          "Similisahi"
        ]
      },
      {
        "name": "Gania",
        "nameOr": "ଗଣିଆ",
        "gps": [
          "Belapadapatna",
          "Chhamundia",
          "Gania",
          "Kishoreprasad",
          "Rasanga"
        ]
      },
      {
        "name": "Khandapada",
        "nameOr": "ଖଣ୍ଡପଡ଼ା",
        "gps": [
          "Benagadia",
          "Bhadabhadalia",
          "Kantilo",
          "Khandapada Rural",
          "Kheluapada",
          "Maniabandha",
          "Sidhamula"
        ]
      },
      {
        "name": "Nayagarh Sadar",
        "nameOr": "ନୟାଗଡ଼ ସଦର",
        "gps": [
          "Bada Pandusar",
          "Balugaon",
          "Gambharidihi",
          "Ikiri",
          "Lathipada",
          "Lenkudipada",
          "Nayagarh Rural",
          "Sindhuria"
        ]
      },
      {
        "name": "Nuagaon",
        "nameOr": "ନୂଆଗାଁ",
        "gps": [
          "Berhampur",
          "Dhenkena",
          "Gaudapada",
          "Khandapara",
          "Mahipur",
          "Nuagaon",
          "Paradhyanpur"
        ]
      },
      {
        "name": "Odagaon",
        "nameOr": "ଓଡ଼ଗାଁ",
        "gps": [
          "Bahadajhola",
          "Gaudapada",
          "Kural",
          "Magarabandha",
          "Nandighore",
          "Odagaon Rural",
          "Raghunathpur",
          "Saradhapur"
        ]
      },
      {
        "name": "Ranpur",
        "nameOr": "ରଣପୁର",
        "gps": [
          "Bajrakote",
          "Chandapur",
          "Darpanarayanpur",
          "Kandhanayagarh",
          "Mayurjhalia",
          "Rajranpur",
          "Sanapadar"
        ]
      }
    ]
  },
  "Nuapada": {
    "nameOr": "ନୂଆପଡ଼ା",
    "constituencies": [
      "Nuapada",
      "Khariar"
    ],
    "ulbs": [
      {
        "name": "Khariar NAC",
        "nameOr": "ଖଡ଼ିଆଳ ଏନଏସି",
        "type": "NAC",
        "wards": 13
      },
      {
        "name": "Nuapada NAC",
        "nameOr": "ନୂଆପଡ଼ା ଏନଏସି",
        "type": "NAC",
        "wards": 14
      },
      {
        "name": "Khariar Road NAC",
        "nameOr": "ଖଡ଼ିଆଳ ରୋଡ୍ ଏନଏସି",
        "type": "NAC",
        "wards": 19
      }
    ],
    "blocks": [
      {
        "name": "Boden",
        "nameOr": "ବୋଡ଼େନ",
        "gps": [
          "Bhairabanath",
          "Boden",
          "Daldali",
          "Farsara",
          "Karangamal",
          "Larka",
          "Palsada"
        ]
      },
      {
        "name": "Khariar",
        "nameOr": "ଖଡ଼ିଆଳ",
        "gps": [
          "Badi",
          "Banja",
          "Chindaguda",
          "Duajhar",
          "Khariar Rural",
          "Nehena",
          "Rani Munda",
          "Tukurla"
        ]
      },
      {
        "name": "Komna",
        "nameOr": "କୋମନା",
        "gps": [
          "Agren",
          "Bargaon",
          "Budhikomna",
          "Jatgarh",
          "Komna",
          "Kureswar",
          "Pendrawan",
          "Tarbod"
        ]
      },
      {
        "name": "Nuapada Sadar",
        "nameOr": "ନୂଆପଡ଼ା ସଦର",
        "gps": [
          "Bargaon",
          "Beltukuri",
          "Dharambandha",
          "Khariar Road Rural",
          "Kotosamalei",
          "Nuapada Rural",
          "Tanwat"
        ]
      },
      {
        "name": "Sinapali",
        "nameOr": "ସିନାପାଲି",
        "gps": [
          "Badaghai",
          "Farsara",
          "Ghatmal",
          "Hatibandha",
          "Kapsi",
          "Nuapada",
          "Sinapali",
          "Timanpur"
        ]
      }
    ]
  },
  "Puri": {
    "nameOr": "ପୁରୀ",
    "constituencies": [
      "Kakatpur",
      "Nimapara",
      "Puri",
      "Brahmagiri",
      "Satyabadi",
      "Pipili"
    ],
    "ulbs": [
      {
        "name": "Puri Municipality",
        "nameOr": "ପୁରୀ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 32
      },
      {
        "name": "Nimapara NAC",
        "nameOr": "ନିମାପଡ଼ା ଏନଏସି",
        "type": "NAC",
        "wards": 11
      },
      {
        "name": "Pipili NAC",
        "nameOr": "ପିପିଲି ଏନଏସି",
        "type": "NAC",
        "wards": 16
      },
      {
        "name": "Konark NAC",
        "nameOr": "କୋଣାର୍କ ଏନଏସି",
        "type": "NAC",
        "wards": 13
      }
    ],
    "blocks": [
      {
        "name": "Astaranga",
        "nameOr": "ଅସ୍ତରଙ୍ଗ",
        "gps": [
          "Astaranga",
          "Chhuriana",
          "Gahanagachhia",
          "Jahania",
          "Nagar",
          "Nuagarh",
          "Patalada"
        ]
      },
      {
        "name": "Brahmagiri",
        "nameOr": "ବ୍ରହ୍ମଗିରି",
        "gps": [
          "Alarnath",
          "Brahmagiri",
          "Chapamanik",
          "Dandabada",
          "Khandapada",
          "Manikapatna",
          "Rahandamalla",
          "Rebana Nuagaon"
        ]
      },
      {
        "name": "Delanga",
        "nameOr": "ଦେଳାଙ୍ଗ",
        "gps": [
          "Berhampur",
          "Chaitana",
          "Delanga",
          "Ghoradia",
          "Harirajpur",
          "Kalyanpur",
          "Muninda",
          "Suabarei"
        ]
      },
      {
        "name": "Gop",
        "nameOr": "ଗୋପ",
        "gps": [
          "Bada Tarana",
          "Biraswatipur",
          "Chhaitana",
          "Desthali",
          "Gop",
          "Konark Rural",
          "Nagapur",
          "Rahangiradi"
        ]
      },
      {
        "name": "Kakatpur",
        "nameOr": "କାକଟପୁର",
        "gps": [
          "Bangurigan",
          "Bateswar",
          "Kakatpur",
          "Kundhei",
          "Mangala Pitha",
          "Nuasahi",
          "Othaka"
        ]
      },
      {
        "name": "Kanas",
        "nameOr": "କଣାସ",
        "gps": [
          "Bakreswar",
          "Dokanda",
          "Gadasanaput",
          "Kanas",
          "Pandiapada",
          "Sahupada",
          "Sirei"
        ]
      },
      {
        "name": "Krushnaprasad",
        "nameOr": "କୃଷ୍ଣପ୍ରସାଦ",
        "gps": [
          "Alupatna",
          "Berhampur",
          "Chilika Nuapada",
          "Garhkrushnaprasad",
          "Malud",
          "Panasapada",
          "Parikud"
        ]
      },
      {
        "name": "Nimapara",
        "nameOr": "ନିମାପଡ଼ା",
        "gps": [
          "Alanda",
          "Bada Machhapara",
          "Bhogasalada",
          "Chhanijanga",
          "Dhanua",
          "Nimapara Rural",
          "Renghalo",
          "Sagada"
        ]
      },
      {
        "name": "Pipili",
        "nameOr": "ପିପିଲି",
        "gps": [
          "Bharatipur",
          "Dandamukundapur",
          "Govindpur",
          "Kalyanpur",
          "Mangalpur",
          "Pipili Rural",
          "Poparanga",
          "Teisipur"
        ]
      },
      {
        "name": "Puri Sadar",
        "nameOr": "ପୁରୀ ସଦର",
        "gps": [
          "Baliguali",
          "Baliput",
          "Biraharekrushnapur",
          "Chandanpur",
          "Gopinathpur",
          "Malatipatpur",
          "Samgara",
          "Sasandamodarpur"
        ]
      },
      {
        "name": "Satyabadi",
        "nameOr": "ସତ୍ୟବାଦୀ",
        "gps": [
          "Alagum",
          "Bada Kera",
          "Biraramachandrapur",
          "Kadua",
          "Nuagan",
          "Sakhigopal",
          "Satyabadi",
          "Sukal"
        ]
      }
    ]
  },
  "Rayagada": {
    "nameOr": "ରାୟଗଡ଼ା",
    "constituencies": [
      "Gunupur",
      "Bissam Cuttack",
      "Rayagada"
    ],
    "ulbs": [
      {
        "name": "Rayagada Municipality",
        "nameOr": "ରାୟଗଡ଼ା ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 24
      },
      {
        "name": "Gunupur Municipality",
        "nameOr": "ଗୁଣୁପୁର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 17
      },
      {
        "name": "Gudari NAC",
        "nameOr": "ଗୁଡ଼ାରୀ ଏନଏସି",
        "type": "NAC",
        "wards": 11
      }
    ],
    "blocks": [
      {
        "name": "Bissam Cuttack",
        "nameOr": "ବିଷମ କଟକ",
        "gps": [
          "Bissam Cuttack",
          "Chatikona",
          "Durgi",
          "Hatamuniguda",
          "Kakiriguda",
          "Markama",
          "Thuapada"
        ]
      },
      {
        "name": "Chandrapur",
        "nameOr": "ଚନ୍ଦ୍ରପୁର",
        "gps": [
          "Bhejaguda",
          "Bijapur",
          "Chandrapur",
          "Dangamala",
          "Hanumanthpur",
          "Trilochanpur"
        ]
      },
      {
        "name": "Gudari",
        "nameOr": "ଗୁଡ଼ାରୀ",
        "gps": [
          "Balsahi",
          "Gudari Rural",
          "Khamasingi",
          "Madhabaguda",
          "Padmapur",
          "Sirijodi"
        ]
      },
      {
        "name": "Gunupur",
        "nameOr": "ଗୁଣୁପୁର",
        "gps": [
          "Bada Dunguri",
          "Chalakkana",
          "Gunupur Rural",
          "Jagannathpur",
          "Kitung",
          "Mariguda",
          "Venkateswarpur"
        ]
      },
      {
        "name": "Kalyansinghpur",
        "nameOr": "କଲ୍ୟାଣସିଂହପୁର",
        "gps": [
          "Budaguda",
          "Dhamana",
          "Kalyansinghpur",
          "Majhiguda",
          "Narayanapur",
          "Sikarpai"
        ]
      },
      {
        "name": "Kashipur",
        "nameOr": "କାଶୀପୁର",
        "gps": [
          "Dongasil",
          "Gorakhpur",
          "Kashipur",
          "Maikanch",
          "Podapadi",
          "Sunger",
          "Tikiri"
        ]
      },
      {
        "name": "Kolnara",
        "nameOr": "କୋଲନରା",
        "gps": [
          "Bhadiguda",
          "Kailashkota",
          "Kolnara",
          "Mukundapur",
          "Rekhapadar",
          "Suriguda"
        ]
      },
      {
        "name": "Muniguda",
        "nameOr": "ମୁନିଗୁଡ଼ା",
        "gps": [
          "Ambadola",
          "Bhairabgarh",
          "Bhatpur",
          "Dangari",
          "Muniguda",
          "Kumudabali",
          "Sibapadar"
        ]
      },
      {
        "name": "Padmapur Block",
        "nameOr": "ପଦ୍ମପୁର ବ୍ଲକ",
        "gps": [
          "Akulmunda",
          "Dhamana",
          "Kumbhariput",
          "Padmapur",
          "Sanadunguri"
        ]
      },
      {
        "name": "Ramanaguda",
        "nameOr": "ରାମନଗୁଡ଼ା",
        "gps": [
          "Bhamini",
          "Gogupadu",
          "Nilakantheswar",
          "Ramanaguda",
          "Tamaguda"
        ]
      },
      {
        "name": "Rayagada Sadar",
        "nameOr": "ରାୟଗଡ଼ା ସଦର",
        "gps": [
          "Barijhola",
          "Halua",
          "Jayaramguda",
          "Komatapeta",
          "Penta",
          "Rayagada Rural",
          "Seetharamapur"
        ]
      }
    ]
  },
  "Sambalpur": {
    "nameOr": "ସମ୍ବଲପୁର",
    "constituencies": [
      "Kuchinda",
      "Rengali",
      "Sambalpur",
      "Rairakhol"
    ],
    "ulbs": [
      {
        "name": "SMC (Sambalpur Municipal Corporation)",
        "nameOr": "ସମ୍ବଲପୁର ମହାନଗର ନିଗମ",
        "type": "Corporation",
        "wards": 41
      },
      {
        "name": "Kuchinda NAC",
        "nameOr": "କୁଚିଣ୍ଡା ଏନଏସି",
        "type": "NAC",
        "wards": 11
      },
      {
        "name": "Redhakhol / Rairakhol NAC",
        "nameOr": "ରେଢ଼ାଖୋଲ ଏନଏସି",
        "type": "NAC",
        "wards": 13
      }
    ],
    "blocks": [
      {
        "name": "Bamra",
        "nameOr": "ବାମରା",
        "gps": [
          "Badamal",
          "Bamra",
          "Dharuadihi",
          "Gharghat",
          "Kesaibahal",
          "Pinda",
          "Rangiatikra"
        ]
      },
      {
        "name": "Dhankauda",
        "nameOr": "ଧନକଉଡ଼ା",
        "gps": [
          "Burla Rural",
          "Chaunrpur",
          "Dhankauda",
          "Kalamati",
          "Kainsir",
          "Pujaripali",
          "Sason",
          "Tabla"
        ]
      },
      {
        "name": "Jamankira",
        "nameOr": "ଜମନକିରା",
        "gps": [
          "Badrama",
          "Bhojpur",
          "Gundruchua",
          "Jamankira",
          "Katarbaga",
          "Kolapada",
          "Tikilipada"
        ]
      },
      {
        "name": "Jujumura",
        "nameOr": "ଯୁଯୁମୁରା",
        "gps": [
          "Bhabanipali",
          "Chamunda",
          "Hatibari",
          "Jujumura",
          "Kayankuda",
          "Meghpal",
          "San-Nuapali"
        ]
      },
      {
        "name": "Kuchinda",
        "nameOr": "କୁଚିଣ୍ଡା",
        "gps": [
          "Baidapali",
          "Bakshira",
          "Gunduruchua",
          "Khandokata",
          "Kuchinda Rural",
          "Kuntara",
          "Mahulpali",
          "Paruabhadi"
        ]
      },
      {
        "name": "Maneswar",
        "nameOr": "ମାନେଶ୍ୱର",
        "gps": [
          "Dhabaleswar",
          "Gunderpur",
          "Khandual",
          "Maneswar",
          "Mathpali",
          "Nuakhairpali",
          "Thelkoli"
        ]
      },
      {
        "name": "Naktideul",
        "nameOr": "ନାକଟିଦେଉଳ",
        "gps": [
          "Batamura",
          "Daincha",
          "Kisinda",
          "Naktideul",
          "Sahebi",
          "Shimilibandha"
        ]
      },
      {
        "name": "Rairakhol",
        "nameOr": "ରେଢ଼ାଖୋଲ",
        "gps": [
          "Badaloi",
          "Charmal",
          "Durgapur",
          "Kadalgada",
          "Khandahata",
          "Rairakhol Rural",
          "Tribanpur"
        ]
      },
      {
        "name": "Rengali",
        "nameOr": "ରେଙ୍ଗାଲି",
        "gps": [
          "Bomaloi",
          "Jangala",
          "Katarbaga",
          "Lapanga",
          "Nisankuda",
          "Rengali",
          "Salad",
          "Tarabaga"
        ]
      }
    ]
  },
  "Subarnapur": {
    "nameOr": "ସୁବର୍ଣ୍ଣପୁର",
    "constituencies": [
      "Birmaharajpur",
      "Sonepur"
    ],
    "ulbs": [
      {
        "name": "Sonepur Municipality",
        "nameOr": "ସୋନପୁର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 15
      },
      {
        "name": "Binika NAC",
        "nameOr": "ବିନିକା ଏନଏସି",
        "type": "NAC",
        "wards": 12
      },
      {
        "name": "Tarbha NAC",
        "nameOr": "ତରଭା ଏନଏସି",
        "type": "NAC",
        "wards": 12
      }
    ],
    "blocks": [
      {
        "name": "Binika",
        "nameOr": "ବିନିକା",
        "gps": [
          "Babupali",
          "Bankighirdi",
          "Binika Rural",
          "Charbhatta",
          "Gulapada",
          "Menda",
          "Silati"
        ]
      },
      {
        "name": "Birmaharajpur",
        "nameOr": "ବୀରମହାରାଜପୁର",
        "gps": [
          "Birmaharajpur",
          "Champamal",
          "Deulapadar",
          "Jatesingha",
          "Kamira",
          "Khandahata",
          "Subalaya"
        ]
      },
      {
        "name": "Dunguripali",
        "nameOr": "ଡୁଙ୍ଗୁରିପାଲି",
        "gps": [
          "Bada Karadunguri",
          "Bikrampur",
          "Cherupali",
          "Dunguripali",
          "Ichhapur",
          "Rampur",
          "Sukha"
        ]
      },
      {
        "name": "Sonepur Sadar",
        "nameOr": "ସୋନପୁର ସଦର",
        "gps": [
          "Baladi",
          "Bhabanipur",
          "Chadeipank",
          "Gokuleswar",
          "Khambeswaripali",
          "Mallasahi",
          "Sonepur Rural"
        ]
      },
      {
        "name": "Tarbha",
        "nameOr": "ତରଭା",
        "gps": [
          "Charbhata",
          "Durgapur",
          "Goudagada",
          "Kamsara",
          "Pua",
          "Tarbha Rural",
          "Tubuda"
        ]
      },
      {
        "name": "Ullunda",
        "nameOr": "ଉଲୁଣ୍ଡା",
        "gps": [
          "Dharmasala",
          "Jalda",
          "Kalapathar",
          "Kotasamalei",
          "Panchamahala",
          "Sindhol",
          "Ullunda"
        ]
      }
    ]
  },
  "Sundargarh": {
    "nameOr": "ସୁନ୍ଦରଗଡ଼",
    "constituencies": [
      "Talsara",
      "Sundargarh",
      "Biramitrapur",
      "Rourkela",
      "Raghunathpali",
      "Panposh",
      "Rajgangpur",
      "Bonai"
    ],
    "ulbs": [
      {
        "name": "RMC (Rourkela Municipal Corporation)",
        "nameOr": "ରାଉରକେଲା ମହାନଗର ନିଗମ",
        "type": "Corporation",
        "wards": 40
      },
      {
        "name": "Sundargarh Municipality",
        "nameOr": "ସୁନ୍ଦରଗଡ଼ ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 19
      },
      {
        "name": "Rajgangpur Municipality",
        "nameOr": "ରାଜଗାଙ୍ଗପୁର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 20
      },
      {
        "name": "Biramitrapur Municipality",
        "nameOr": "ବୀରମିତ୍ରପୁର ପୌରପାଳିକା",
        "type": "Municipality",
        "wards": 11
      }
    ],
    "blocks": [
      {
        "name": "Balisankara",
        "nameOr": "ବାଲିଶଙ୍କରା",
        "gps": [
          "Balisankara",
          "Bandhabhuin",
          "Deobhubanpur",
          "Kinjirkela",
          "Nuagaon",
          "Sagbahal",
          "Talsara"
        ]
      },
      {
        "name": "Bargaon",
        "nameOr": "ବଡ଼ଗାଁ",
        "gps": [
          "Bargaon",
          "Bhadikani",
          "Dandajamira",
          "Ithepali",
          "Kandabahal",
          "Pamara",
          "Sahajbahal"
        ]
      },
      {
        "name": "Bisra",
        "nameOr": "ବିଶ୍ରା",
        "gps": [
          "Bhalulata",
          "Bisra",
          "Bondamunda Rural",
          "Jhirpani Rural",
          "Kapatmunda",
          "Sarandamal"
        ]
      },
      {
        "name": "Biramitrapur / Kuarmunda",
        "nameOr": "କୁଆରମୁଣ୍ଡା",
        "gps": [
          "Birda",
          "Dalka",
          "Jhirpani",
          "Kacharu",
          "Kuarmunda",
          "Purunapani",
          "Raiboga"
        ]
      },
      {
        "name": "Bonai",
        "nameOr": "ବଣାଇ",
        "gps": [
          "Babunatha",
          "Banei",
          "Barsuan",
          "Bonaigarh",
          "Gopna",
          "Kantamunda",
          "Sankhaposh"
        ]
      },
      {
        "name": "Gurundia",
        "nameOr": "ଗୁରୁଣ୍ଡିଆ",
        "gps": [
          "Bhutuda",
          "Deoposh",
          "Gurundia",
          "Jarda",
          "Kundheidiha",
          "Solida",
          "Tamra"
        ]
      },
      {
        "name": "Hemgir",
        "nameOr": "ହେମଗିରି",
        "gps": [
          "Bhalumunda",
          "Duduka",
          "Gopalpur",
          "Hemgir",
          "Kanika",
          "Luabahal",
          "Taparia"
        ]
      },
      {
        "name": "Koida",
        "nameOr": "କୋଇଡ଼ା",
        "gps": [
          "Dengula",
          "Gopna",
          "Kalmong",
          "Kasia",
          "Koida",
          "Malda",
          "Patmunda",
          "Roxy",
          "Tensa"
        ]
      },
      {
        "name": "Kutra",
        "nameOr": "କୁତ୍ରା",
        "gps": [
          "Biringatoli",
          "Ghunghuti",
          "Kachharu",
          "Kutra",
          "Panchara",
          "Rukuda",
          "Tudalaga"
        ]
      },
      {
        "name": "Lahunipara",
        "nameOr": "ଲହୁଣୀପଡ଼ା",
        "gps": [
          "Dharuadihi",
          "Fuljhar",
          "Kantamunda",
          "Kurda",
          "Lahunipara",
          "Rengalbeda",
          "Sankhaposh"
        ]
      },
      {
        "name": "Lathikata",
        "nameOr": "ଲାଠିକଟା",
        "gps": [
          "Bansjor",
          "Chhend Rural",
          "Ghoghar",
          "Jhartarang",
          "Kalunga",
          "Lathikata",
          "Suidihi"
        ]
      },
      {
        "name": "Lephripara",
        "nameOr": "ଲେଫ୍ରିପଡ଼ା",
        "gps": [
          "Badamal",
          "Chhatabar",
          "Dharmasala",
          "Ghumuda",
          "Lephripara",
          "Raidihi",
          "Sargipali"
        ]
      },
      {
        "name": "Nuagaon",
        "nameOr": "ନୂଆଗାଁ",
        "gps": [
          "Barilepta",
          "Chitapedi",
          "Hatibari",
          "Khadang",
          "Nuagaon",
          "Puranapani",
          "Sorada"
        ]
      },
      {
        "name": "Rajgangpur Block",
        "nameOr": "ରାଜଗାଙ୍ଗପୁର ବ୍ଲକ",
        "gps": [
          "Buchhukupa",
          "Ghantapada",
          "Jambahal",
          "Kansbahal",
          "Katamunda",
          "Kumarmunda",
          "Liploi"
        ]
      },
      {
        "name": "Subdega",
        "nameOr": "ସୁବଡ଼େଗା",
        "gps": [
          "Biringatoli",
          "Jamunakani",
          "Karamdihi",
          "Ranimunda",
          "Subdega",
          "Tudalaga"
        ]
      },
      {
        "name": "Sundargarh Sadar",
        "nameOr": "ସୁନ୍ଦରଗଡ଼ ସଦର",
        "gps": [
          "Bhabanipur",
          "Kirei",
          "Kulumunda",
          "Mahulpali",
          "Patrapali",
          "Rangadhipa",
          "Tasladihi"
        ]
      },
      {
        "name": "Tangarpali",
        "nameOr": "ଟାଙ୍ଗରପାଲୀ",
        "gps": [
          "Bandega",
          "Dhurukdihi",
          "Ghoghar",
          "Kinjirkela",
          "Majhapada",
          "Mangaspur",
          "Tangarpali"
        ]
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ODISHA_LOCATIONS };
}
