import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Trophy, 
  RefreshCw, 
  ArrowRight,
  Star,
  Zap,
  Target,
  Award,
  Loader2,
  ShieldCheck,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { googleFormService } from '../services/googleFormService';
import { Theme } from '../types';

interface Question {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
}

interface FinalQuizProps {
  username: string;
  userClass: string;
  title?: string;
  theme?: Theme;
  onComplete: (score: number) => void;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Zat tunggal yang tidak dapat diuraikan lagi menjadi zat yang lebih sederhana melalui reaksi kimia biasa disebut...",
    options: [
      { id: 'A', text: "Senyawa" },
      { id: 'B', text: "Campuran" },
      { id: 'C', text: "Unsur" },
      { id: 'D', text: "Molekul" }
    ],
    correctId: 'C'
  },
  {
    id: 2,
    question: "Berikut ini yang merupakan ciri-ciri unsur logam adalah...",
    options: [
      { id: 'A', text: "Mudah rapuh dan tidak mengkilap" },
      { id: 'B', text: "Berwujud gas pada suhu ruang" },
      { id: 'C', text: "Dapat ditempa dan mengkilap" },
      { id: 'D', text: "Tidak dapat menghantarkan arus listrik" }
    ],
    correctId: 'C'
  },
  {
    id: 3,
    question: "Medali olimpiade untuk juara pertama terbuat dari emas, juara kedua dari perak, dan juara ketiga dari perunggu. Alasan utama penggunaan bahan-bahan tersebut adalah...",
    options: [
      { id: 'A', text: "Karena harganya murah dan mudah didapat" },
      { id: 'B', text: "Karena merupakan logam yang indah, tahan lama, dan bernilai tinggi" },
      { id: 'C', text: "Karena mudah dibentuk menjadi berbagai ukuran" },
      { id: 'D', text: "Karena ketiga logam tersebut ringan dan tidak berkarat" }
    ],
    correctId: 'B'
  },
  {
    id: 4,
    question: "Organisasi internasional yang menjadi standar penamaan unsur secara universal adalah...",
    options: [
      { id: 'A', text: "WHO" },
      { id: 'B', text: "UNESCO" },
      { id: 'C', text: "IUPAC" },
      { id: 'D', text: "NASA" }
    ],
    correctId: 'C'
  },
  {
    id: 5,
    question: "Jumlah unsur yang telah dikenal saat ini adalah...",
    options: [
      { id: 'A', text: "90 unsur" },
      { id: 'B', text: "100 unsur" },
      { id: 'C', text: "118 unsur" },
      { id: 'D', text: "130 unsur" }
    ],
    correctId: 'C'
  },
  {
    id: 6,
    question: "Dari 118 unsur yang dikenal, berapa jumlah unsur yang terbentuk secara alami?",
    options: [
      { id: 'A', text: "24 unsur" },
      { id: 'B', text: "94 unsur" },
      { id: 'C', text: "100 unsur" },
      { id: 'D', text: "118 unsur" }
    ],
    correctId: 'B'
  },
  {
    id: 7,
    question: "Sifat unsur dibagi menjadi dua, yaitu sifat fisika dan sifat kimia. Yang termasuk sifat fisika unsur adalah...",
    options: [
      { id: 'A', text: "Energi ionisasi" },
      { id: 'B', text: "Reaktivitas dengan asam" },
      { id: 'C', text: "Warna, titik didih, dan daya hantar listrik" },
      { id: 'D', text: "Kemampuan membentuk senyawa baru" }
    ],
    correctId: 'C'
  },
  {
    id: 8,
    question: "Energi ionisasi merupakan contoh dari...",
    options: [
      { id: 'A', text: "Sifat fisika unsur" },
      { id: 'B', text: "Sifat kimia unsur" },
      { id: 'C', text: "Sifat campuran" },
      { id: 'D', text: "Sifat senyawa" }
    ],
    correctId: 'B'
  },
  {
    id: 9,
    question: "Dalam sistem periodik unsur, unsur-unsur dikelompokkan menjadi tiga golongan besar, yaitu...",
    options: [
      { id: 'A', text: "Padat, cair, dan gas" },
      { id: 'B', text: "Logam, nonlogam, dan metaloid" },
      { id: 'C', text: "Alami, buatan, dan semisintetis" },
      { id: 'D', text: "Ringan, sedang, dan berat" }
    ],
    correctId: 'B'
  },
  {
    id: 10,
    question: "Contoh unsur logam yang berwujud cair pada suhu ruang adalah...",
    options: [
      { id: 'A', text: "Besi" },
      { id: 'B', text: "Emas" },
      { id: 'C', text: "Merkuri" },
      { id: 'D', text: "Tembaga" }
    ],
    correctId: 'C'
  },
  {
    id: 11,
    question: "Berikut ini yang BUKAN merupakan sifat unsur logam adalah...",
    options: [
      { id: 'A', text: "Berwujud padat pada suhu ruang (kecuali merkuri)" },
      { id: 'B', text: "Dapat ditempa menjadi lempengan tipis" },
      { id: 'C', text: "Permukaannya mengkilap" },
      { id: 'D', text: "Mudah rapuh dan tidak dapat ditempa" }
    ],
    correctId: 'D'
  },
  {
    id: 12,
    question: "Tiga unsur logam yang memiliki daya hantar listrik terbaik adalah...",
    options: [
      { id: 'A', text: "Besi, aluminium, dan tembaga" },
      { id: 'B', text: "Emas, perak, dan tembaga" },
      { id: 'C', text: "Perak, merkuri, dan emas" },
      { id: 'D', text: "Tembaga, besi, dan nikel" }
    ],
    correctId: 'B'
  },
  {
    id: 13,
    question: "Bahan yang dapat menghantarkan arus listrik dengan baik disebut...",
    options: [
      { id: 'A', text: "Isolator" },
      { id: 'B', text: "Semikonduktor" },
      { id: 'C', text: "Konduktor" },
      { id: 'D', text: "Resistor" }
    ],
    correctId: 'C'
  },
  {
    id: 14,
    question: "Sifat unsur nonlogam yang membedakannya dari logam adalah...",
    options: [
      { id: 'A', text: "Dapat ditempa menjadi lembaran tipis" },
      { id: 'B', text: "Mudah rapuh dan tidak dapat ditempa" },
      { id: 'C', text: "Mengkilap dan menghantarkan listrik" },
      { id: 'D', text: "Berwujud padat pada suhu ruang" }
    ],
    correctId: 'B'
  },
  {
    id: 15,
    question: "Setiap unsur tersusun dari partikel terkecil yang disebut...",
    options: [
      { id: 'A', text: "Molekul" },
      { id: 'B', text: "Ion" },
      { id: 'C', text: "Atom" },
      { id: 'D', text: "Senyawa" }
    ],
    correctId: 'C'
  },
  {
    id: 16,
    question: "Muatan listrik yang dimiliki oleh elektron adalah...",
    options: [
      { id: 'A', text: "Positif" },
      { id: 'B', text: "Negatif" },
      { id: 'C', text: "Netral" },
      { id: 'D', text: "Tidak bermuatan" }
    ],
    correctId: 'B'
  },
  {
    id: 17,
    question: "Muatan listrik yang dimiliki oleh proton adalah...",
    options: [
      { id: 'A', text: "Negatif" },
      { id: 'B', text: "Netral" },
      { id: 'C', text: "Positif" },
      { id: 'D', text: "Tidak bermuatan" }
    ],
    correctId: 'C'
  },
  {
    id: 18,
    question: "Neutron merupakan partikel penyusun atom yang memiliki muatan...",
    options: [
      { id: 'A', text: "Positif" },
      { id: 'B', text: "Negatif" },
      { id: 'C', text: "Netral (tidak bermuatan)" },
      { id: 'D', text: "Positif dan negatif" }
    ],
    correctId: 'C'
  },
  {
    id: 19,
    question: "Inti atom tersusun dari...",
    options: [
      { id: 'A', text: "Elektron dan neutron" },
      { id: 'B', text: "Proton dan elektron" },
      { id: 'C', text: "Proton dan neutron" },
      { id: 'D', text: "Elektron saja" }
    ],
    correctId: 'C'
  },
  {
    id: 20,
    question: "Baris horizontal dalam tabel periodik unsur disebut...",
    options: [
      { id: 'A', text: "Golongan" },
      { id: 'B', text: "Periode" },
      { id: 'C', text: "Blok" },
      { id: 'D', text: "Deret" }
    ],
    correctId: 'B'
  },
  {
    id: 21,
    question: "Kolom vertikal dalam tabel periodik unsur disebut...",
    options: [
      { id: 'A', text: "Periode" },
      { id: 'B', text: "Baris" },
      { id: 'C', text: "Golongan" },
      { id: 'D', text: "Deret" }
    ],
    correctId: 'C'
  },
  {
    id: 22,
    question: "Ilmuwan yang pertama kali menginisiasi penyusunan tabel periodik unsur adalah...",
    options: [
      { id: 'A', text: "Albert Einstein" },
      { id: 'B', text: "Isaac Newton" },
      { id: 'C', text: "Dmitri Mendeleev" },
      { id: 'D', text: "Antoine Lavoisier" }
    ],
    correctId: 'C'
  },
  {
    id: 23,
    question: "Senyawa adalah...",
    options: [
      { id: 'A', text: "Zat tunggal yang tidak dapat diuraikan lagi" },
      { id: 'B', text: "Campuran dua zat atau lebih yang masih memiliki sifat aslinya" },
      { id: 'C', text: "Zat yang terbentuk dari dua unsur atau lebih yang bergabung secara kimia dengan perbandingan tertentu" },
      { id: 'D', text: "Kumpulan atom-atom dari unsur yang sama" }
    ],
    correctId: 'C'
  },
  {
    id: 24,
    question: "Molekul unsur adalah...",
    options: [
      { id: 'A', text: "Gabungan dua atom dari unsur yang berbeda" },
      { id: 'B', text: "Gabungan dua atom atau lebih dari unsur yang sama" },
      { id: 'C', text: "Gabungan unsur dan senyawa" },
      { id: 'D', text: "Partikel terkecil dari suatu senyawa" }
    ],
    correctId: 'B'
  },
  {
    id: 25,
    question: "Molekul senyawa adalah...",
    options: [
      { id: 'A', text: "Gabungan atom-atom dari unsur yang sama" },
      { id: 'B', text: "Partikel terkecil dari suatu unsur" },
      { id: 'C', text: "Gabungan dua atom atau lebih dari unsur yang berbeda" },
      { id: 'D', text: "Kumpulan ion positif dan negatif" }
    ],
    correctId: 'C'
  },
  {
    id: 26,
    question: "Berikut ini yang merupakan contoh senyawa dalam kehidupan sehari-hari adalah...",
    options: [
      { id: 'A', text: "Udara dan tanah" },
      { id: 'B', text: "Gula, air, dan garam dapur" },
      { id: 'C', text: "Minyak goreng dan air" },
      { id: 'D', text: "Pasir dan kerikil" }
    ],
    correctId: 'B'
  },
  {
    id: 27,
    question: "Campuran adalah...",
    options: [
      { id: 'A', text: "Zat tunggal yang terbentuk dari satu jenis atom" },
      { id: 'B', text: "Gabungan dua zat atau lebih yang masing-masing zat masih mempertahankan sifat aslinya" },
      { id: 'C', text: "Zat yang terbentuk dari reaksi kimia antara dua unsur" },
      { id: 'D', text: "Zat yang tidak dapat dipisahkan dengan cara fisika" }
    ],
    correctId: 'B'
  },
  {
    id: 28,
    question: "Campuran yang terbentuk ketika zat terlarut menyebar merata dalam pelarut sehingga tidak dapat dibedakan lagi disebut...",
    options: [
      { id: 'A', text: "Suspensi" },
      { id: 'B', text: "Koloid" },
      { id: 'C', text: "Larutan" },
      { id: 'D', text: "Emulsi" }
    ],
    correctId: 'C'
  },
  {
    id: 29,
    question: "Campuran yang partikelnya lebih besar dari larutan tetapi belum mengendap dan akan mengendap jika didiamkan disebut...",
    options: [
      { id: 'A', text: "Larutan" },
      { id: 'B', text: "Koloid" },
      { id: 'C', text: "Suspensi" },
      { id: 'D', text: "Emulsi" }
    ],
    correctId: 'C'
  },
  {
    id: 30,
    question: "Campuran yang ukuran partikelnya berada di antara larutan dan suspensi disebut...",
    options: [
      { id: 'A', text: "Larutan" },
      { id: 'B', text: "Suspensi" },
      { id: 'C', text: "Emulsi" },
      { id: 'D', text: "Koloid" }
    ],
    correctId: 'D'
  },
  {
    id: 31,
    question: "Asap dan kabut merupakan contoh koloid jenis...",
    options: [
      { id: 'A', text: "Aerosol cair dan aerosol padat" },
      { id: 'B', text: "Aerosol padat dan aerosol cair" },
      { id: 'C', text: "Gel dan emulsi" },
      { id: 'D', text: "Busa dan sol" }
    ],
    correctId: 'B'
  },
  {
    id: 32,
    question: "Pemisahan campuran dengan cara menuangkan cairan secara perlahan sehingga endapan tertinggal di dasar wadah disebut...",
    options: [
      { id: 'A', text: "Penyaringan" },
      { id: 'B', text: "Sentrifugasi" },
      { id: 'C', text: "Dekantasi" },
      { id: 'D', text: "Pengayakan" }
    ],
    correctId: 'C'
  },
  {
    id: 33,
    question: "Contoh penerapan dekantasi dalam kehidupan sehari-hari adalah...",
    options: [
      { id: 'A', text: "Memisahkan pasir dari kerikil" },
      { id: 'B', text: "Menuangkan air dari beras yang sudah dicuci" },
      { id: 'C', text: "Menyaring kopi dengan kertas saring" },
      { id: 'D', text: "Memanaskan air laut untuk mendapatkan garam" }
    ],
    correctId: 'B'
  },
  {
    id: 34,
    question: "Memisahkan campuran berdasarkan ukuran partikel dengan menggunakan ayakan atau saringan berlubang disebut...",
    options: [
      { id: 'A', text: "Dekantasi" },
      { id: 'B', text: "Sentrifugasi" },
      { id: 'C', text: "Pengayakan" },
      { id: 'D', text: "Distilasi" }
    ],
    correctId: 'C'
  },
  {
    id: 35,
    question: "Contoh penerapan pengayakan dalam kehidupan sehari-hari adalah...",
    options: [
      { id: 'A', text: "Memisahkan minyak dan air" },
      { id: 'B', text: "Memisahkan tepung halus dari butiran kasar saat membuat kue" },
      { id: 'C', text: "Memisahkan garam dari air laut" },
      { id: 'D', text: "Memisahkan campuran berdasarkan perbedaan titik didih" }
    ],
    correctId: 'B'
  },
  {
    id: 36,
    question: "Pemisahan campuran yang memanfaatkan sifat kemagnetan salah satu zat disebut...",
    options: [
      { id: 'A', text: "Sentrifugasi" },
      { id: 'B', text: "Pengayakan" },
      { id: 'C', text: "Pemisahan magnetis" },
      { id: 'D', text: "Distilasi" }
    ],
    correctId: 'C'
  },
  {
    id: 37,
    question: "Pemisahan campuran dengan cara memanaskan larutan hingga pelarutnya menguap dan zat terlarut tertinggal disebut...",
    options: [
      { id: 'A', text: "Distilasi" },
      { id: 'B', text: "Evaporasi" },
      { id: 'C', text: "Sentrifugasi" },
      { id: 'D', text: "Dekantasi" }
    ],
    correctId: 'B'
  },
  {
    id: 38,
    question: "Contoh penerapan evaporasi dalam kehidupan sehari-hari adalah...",
    options: [
      { id: 'A', text: "Memisahkan alkohol dari air" },
      { id: 'B', text: "Pembuatan garam dari air laut dengan cara penguapan oleh sinar matahari" },
      { id: 'C', text: "Memisahkan pasir dari air dengan kertas saring" },
      { id: 'D', text: "Memisahkan besi dari campuran logam menggunakan magnet" }
    ],
    correctId: 'B'
  },
  {
    id: 39,
    question: "Distilasi adalah metode pemisahan campuran yang digunakan untuk memisahkan...",
    options: [
      { id: 'A', text: "Zat padat dari cairan menggunakan kertas saring" },
      { id: 'B', text: "Dua zat cair yang memiliki perbedaan titik didih" },
      { id: 'C', text: "Zat berdasarkan ukuran partikelnya" },
      { id: 'D', text: "Zat berdasarkan sifat kemagnetannya" }
    ],
    correctId: 'B'
  },
  {
    id: 40,
    question: "(Soal Kasus) Seorang siswa memiliki campuran yang terdiri dari pasir, peniti besi, dan kerikil. Urutan langkah pemisahan yang paling tepat adalah...",
    options: [
      { id: 'A', text: "Dekantasi → Sentrifugasi → Evaporasi" },
      { id: 'B', text: "Distilasi → Penyaringan → Dekantasi" },
      { id: 'C', text: "Pemisahan magnetis → Pengayakan → Penyaringan" },
      { id: 'D', text: "Sentrifugasi → Evaporasi → Distilasi" }
    ],
    correctId: 'C'
  },
  {
    id: 41,
    question: "Pada campuran suspensi, jika didiamkan dalam waktu tertentu akan terbentuk endapan di dasar wadah. Endapan pada suspensi tersebut disebut...",
    options: [
      { id: 'A', text: "Filtrat" },
      { id: 'B', text: "Residu" },
      { id: 'C', text: "Sedimen" },
      { id: 'D', text: "Koloid" }
    ],
    correctId: 'C'
  },
  {
    id: 42,
    question: "Ketika air sungai yang keruh didiamkan, partikel-partikel padat akan mengendap di bagian dasar. Endapan tersebut disebut...",
    options: [
      { id: 'A', text: "Filtrat" },
      { id: 'B', text: "Koloid" },
      { id: 'C', text: "Larutan" },
      { id: 'D', text: "Sedimen" }
    ],
    correctId: 'D'
  },
  {
    id: 43,
    question: "Saat kopi disaring menggunakan kertas saring, ampas kopi yang tertinggal di atas kertas saring disebut...",
    options: [
      { id: 'A', text: "Filtrat" },
      { id: 'B', text: "Sedimen" },
      { id: 'C', text: "Residu" },
      { id: 'D', text: "Koloid" }
    ],
    correctId: 'C'
  },
  {
    id: 44,
    question: "Zat cair yang berhasil melewati saringan pada proses penyaringan disebut...",
    options: [
      { id: 'A', text: "Residu" },
      { id: 'B', text: "Filtrat" },
      { id: 'C', text: "Sedimen" },
      { id: 'D', text: "Suspensi" }
    ],
    correctId: 'B'
  },
  {
    id: 45,
    question: "Seorang siswa menyaring campuran air dan pasir menggunakan kertas saring. Pernyataan yang benar adalah...",
    options: [
      { id: 'A', text: "Pasir disebut filtrat dan air disebut residu" },
      { id: 'B', text: "Air disebut residu dan pasir disebut sedimen" },
      { id: 'C', text: "Pasir disebut residu dan air disebut filtrat" },
      { id: 'D', text: "Air disebut sedimen dan pasir disebut filtrat" }
    ],
    correctId: 'C'
  },
  {
    id: 46,
    question: "Perhatikan pernyataan berikut:\n1. Larutan bersifat homogen dan tidak dapat disaring\n2. Suspensi akan mengendap jika didiamkan\n3. Koloid tidak dapat dilihat partikelnya dengan mata telanjang\n4. Endapan pada suspensi disebut filtrat\nPernyataan yang tidak benar adalah...",
    options: [
      { id: 'A', text: "Pernyataan 1" },
      { id: 'B', text: "Pernyataan 2" },
      { id: 'C', text: "Pernyataan 3" },
      { id: 'D', text: "Pernyataan 4" }
    ],
    correctId: 'D'
  },
  {
    id: 47,
    question: "Di bawah ini pasangan istilah dan pengertian yang benar adalah...",
    options: [
      { id: 'A', text: "Filtrat = ampas yang tertinggal di atas saringan" },
      { id: 'B', text: "Residu = cairan yang lolos melewati saringan" },
      { id: 'C', text: "Sedimen = endapan yang terbentuk pada suspensi" },
      { id: 'D', text: "Koloid = campuran yang selalu mengendap dengan cepat" }
    ],
    correctId: 'C'
  },
  {
    id: 48,
    question: "Ibu membuat santan dengan memeras kelapa parut yang sudah dicampur air, lalu menyaringnya. Bagian ampas kelapa yang tertinggal di saringan dan bagian cairan yang lolos dari saringan secara berurutan disebut...",
    options: [
      { id: 'A', text: "Filtrat dan residu" },
      { id: 'B', text: "Sedimen dan filtrat" },
      { id: 'C', text: "Residu dan sedimen" },
      { id: 'D', text: "Residu dan filtrat" }
    ],
    correctId: 'D'
  },
  {
    id: 49,
    question: "(Soal Kasus) Riko melakukan percobaan dengan mencampurkan tanah, air, dan kerikil ke dalam gelas, kemudian mengaduknya lalu mendiamkannya selama 30 menit. Setelah didiamkan, terbentuk lapisan padat di dasar gelas. Lapisan padat di dasar gelas tersebut disebut...",
    options: [
      { id: 'A', text: "Filtrat" },
      { id: 'B', text: "Residu" },
      { id: 'C', text: "Koloid" },
      { id: 'D', text: "Sedimen" }
    ],
    correctId: 'D'
  },
  {
    id: 50,
    question: "(Soal Kasus) Dalam proses penyaringan air kotor di sebuah penampungan air, dihasilkan dua bagian yaitu air bersih yang lolos dari saringan dan kotoran padat yang tersisa di saringan. Kedua bagian tersebut secara berurutan disebut...",
    options: [
      { id: 'A', text: "Sedimen dan residu" },
      { id: 'B', text: "Filtrat dan residu" },
      { id: 'C', text: "Residu dan filtrat" },
      { id: 'D', text: "Koloid dan sedimen" }
    ],
    correctId: 'B'
  }
];

export const FinalQuiz: React.FC<FinalQuizProps> = ({ username, userClass, title, theme, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [raguAnswers, setRaguAnswers] = useState<Record<number, boolean>>({});
  const [showResult, setShowResult] = useState(false);
  const [showStartPopup, setShowStartPopup] = useState(true);
  const [countdown, setCountdown] = useState(7);
  const [direction, setDirection] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer for integrity popup
  useEffect(() => {
    if (showStartPopup && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showStartPopup, countdown]);
  const [submitStatus, setSubmitStatus] = useState<{success?: boolean, message?: string} | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const savedIndex = localStorage.getItem('ipa_quiz_current_index');
    const savedAnswers = localStorage.getItem('ipa_quiz_answers');
    const savedRaguAnswers = localStorage.getItem('ipa_quiz_ragu_answers');
    const savedShuffled = localStorage.getItem('ipa_quiz_shuffled_questions');
    const savedShowResult = localStorage.getItem('ipa_quiz_show_result');

    if (savedIndex) setCurrentIndex(parseInt(savedIndex, 10));
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error("Failed to parse saved answers", e);
      }
    }
    if (savedRaguAnswers) {
      try {
        setRaguAnswers(JSON.parse(savedRaguAnswers));
      } catch (e) {
        console.error("Failed to parse saved ragu answers", e);
      }
    }
    if (savedShowResult) setShowResult(savedShowResult === 'true');
    
    if (savedShuffled) {
      try {
        setShuffledQuestions(JSON.parse(savedShuffled));
      } catch (e) {
        const shuffled = QUESTIONS.map(q => ({
          ...q,
          options: [...q.options].sort(() => Math.random() - 0.5)
        }));
        setShuffledQuestions(shuffled);
      }
    } else {
      const shuffled = QUESTIONS.map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5)
      }));
      setShuffledQuestions(shuffled);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ipa_quiz_current_index', currentIndex.toString());
  }, [currentIndex]);

  useEffect(() => {
    localStorage.setItem('ipa_quiz_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('ipa_quiz_ragu_answers', JSON.stringify(raguAnswers));
  }, [raguAnswers]);

  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      localStorage.setItem('ipa_quiz_shuffled_questions', JSON.stringify(shuffledQuestions));
    }
  }, [shuffledQuestions]);

  useEffect(() => {
    localStorage.setItem('ipa_quiz_show_result', showResult.toString());
  }, [showResult]);

  // Shuffle options on mount or restart - ONLY if not loaded from persistence
  useEffect(() => {
    if (showResult === false && Object.keys(answers).length === 0 && shuffledQuestions.length === 0) {
      const shuffled = QUESTIONS.map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5)
      }));
      setShuffledQuestions(shuffled);
    }
  }, [showResult, answers]);

  if (shuffledQuestions.length === 0) return null;

  const currentQuestion = shuffledQuestions[currentIndex];
  const totalQuestions = shuffledQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  const handleAnswer = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const nextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    shuffledQuestions.forEach(q => {
      if (answers[q.id] === q.correctId) {
        correct++;
      }
    });
    return correct;
  };

  const handleFinish = async () => {
    const score = calculateScore();
    setShowResult(true);
    
    if (score === totalQuestions) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#EC4899', '#3B82F6']
      });
    }
  };

  const handleSendToSheet = async () => {
    if (isSubmitting || submitStatus?.success) return;
    
    const score = calculateScore();
    const percentage = Math.round((score / totalQuestions) * 100);
    
    setIsSubmitting(true);

    // Kirim ke Google Form
    const result = await googleFormService.submitQuizResult(
      username,
      userClass,
      title || "Kuis Berkebun",
      percentage
    );
    
    setSubmitStatus(result);
    setIsSubmitting(false);
  };

  const handleReturnHome = () => {
    // Array link Shopee
    const shopeeLinks = [
      'https://s.shopee.co.id/1BIxY6hq34',
      'https://s.shopee.co.id/3B42ZFRWkc'
    ];
    
    // Pilih salah satu secara acak
    const randomLink = shopeeLinks[Math.floor(Math.random() * shopeeLinks.length)];
    
    // Buka link eksternal di tab baru saat kembali
    try {
      window.open(randomLink, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.error("Gagal membuka link Shopee:", e);
    }
    
    // Kembali ke home
    onComplete(calculateScore());
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setRaguAnswers({});
    setShowResult(false);
    setDirection(0);
    
    // Re-shuffle on restart
    const shuffled = QUESTIONS.map(q => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    }));
    setShuffledQuestions(shuffled);
    
    // Clear persistence for new start
    localStorage.removeItem('ipa_quiz_current_index');
    localStorage.removeItem('ipa_quiz_answers');
    localStorage.removeItem('ipa_quiz_ragu_answers');
    localStorage.removeItem('ipa_quiz_shuffled_questions');
    localStorage.removeItem('ipa_quiz_show_result');
  };

  const score = calculateScore();
  const percentage = Math.round((score / totalQuestions) * 100);

  const getMotivationalContent = () => {
    const perfectQuotes = [
      { title: "Luar Biasa!", message: '"Setiap orang menjadi guru, setiap rumah menjadi sekolah." Selamat! Kamu telah menguasai materi ini dengan sangat baik.' },
      { title: "Sangat Memuaskan!", message: '"Ing Ngarsa Sung Tuladha." Kamu telah memberikan contoh semangat belajar yang sangat baik dengan nilai ini!' },
      { title: "Selamat!", message: "Hasil yang sangat memuaskan! Kecerdasanmu terpancar dari dedikasimu dalam mempelajari materi ini." }
    ];

    const highQuotes = [
      { title: "Bagus Sekali!", message: '"Apapun yang dilakukan oleh seseorang itu, hendaknya dapat bermanfaat bagi dirinya sendiri, bagi bangsanya, dan bagi dunia." Teruslah berkarya!' },
      { title: "Hasil yang Hebat!", message: '"Ing Madya Mangun Karsa." Di tengah proses belajar, kamu tetap mampu membangkitkan semangat dan meraih hasil tinggi!' },
      { title: "Mantap!", message: "Sedikit lagi menuju sempurna! Kamu punya potensi besar, jangan pernah berhenti menggali ilmu." }
    ];

    const mediumQuotes = [
      { title: "Cukup Baik!", message: '"Dengan ilmu kita menuju kemuliaan." Kamu sudah paham dasar-dasarnya, tingkatkan terus semangat belajarmu!' },
      { title: "Terus Melangkah!", message: '"Niteni, Nirokke, Nambahi." Perhatikan yang kurang dari hasil ini, dan tambahkan pemahamanmu di materi berikutnya.' },
      { title: "Langkah yang Baik!", message: "Ini adalah progres yang baik. Seperti menanam pohon, pengetahuanmu sedang bertumbuh. Siram terus dengan belajar!" }
    ];

    const lowQuotes = [
      { title: "Tetap Semangat!", message: '"Pendidikan adalah tempat persemaian segala benih-benih kebudayaan." Jadikan hasil ini sebagai benih keberhasilanmu di masa depan.' },
      { title: "Ayo Berjuang Lagi!", message: '"Tut Wuri Handayani." Jangan berkecil hati, mari kita pelajari lagi bagian yang sulit. Kamu pasti bisa!' },
      { title: "Mulai Lagi!", message: "Hasil ini hanyalah sebuah pesan bahwa kamu perlu sedikit lebih banyak waktu untuk mengulang materi. Kamu pasti bisa di kesempatan berikutnya!" }
    ];

    const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    if (percentage === 100) return { ...getRandom(perfectQuotes), color: "text-emerald-500" };
    if (percentage >= 80) return { ...getRandom(highQuotes), color: "text-blue-500" };
    if (percentage >= 60) return { ...getRandom(mediumQuotes), color: "text-amber-500" };
    return { ...getRandom(lowQuotes), color: "text-rose-500" };
  };

  const motivation = getMotivationalContent();

  if (showResult) {
    return (
      <div className="w-full py-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white/50"
        >
          <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 p-10 text-center text-white space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Trophy size={80} className="mx-auto mb-4 drop-shadow-lg" />
              <h2 className="text-4xl font-black tracking-tight">Hasil Kuis</h2>
              <p className="text-white/80 font-bold uppercase tracking-widest text-sm">{username} - {userClass}</p>
            </motion.div>
          </div>

          <div className="p-10 text-center space-y-8">
            <div className="space-y-2">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.4 }}
                className={`text-8xl font-black ${motivation.color}`}
              >
                {percentage}
              </motion.div>
            </div>

            <div className="space-y-4 bg-slate-50 p-8 rounded-3xl border-2 border-slate-100">
              <h3 className={`text-2xl font-black ${motivation.color}`}>{motivation.title}</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                {motivation.message}
              </p>
            </div>

            <div className="pt-4">
              {!submitStatus && !isSubmitting ? (
                <button
                  onClick={handleSendToSheet}
                  className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-xl"
                >
                  <CheckCircle2 size={24} />
                  <span>Kirim Nilai & Selesai</span>
                </button>
              ) : isSubmitting ? (
                <div className="w-full py-5 bg-slate-100 text-indigo-600 rounded-2xl font-black flex items-center justify-center gap-3 text-xl animate-pulse">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Sedang Mengirim...</span>
                </div>
              ) : submitStatus ? (
                <div className={`w-full py-5 rounded-2xl font-black flex flex-col items-center justify-center gap-4 transition-all ${submitStatus.success ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  <div className="flex items-center gap-2 text-xl">
                    <CheckCircle2 size={24} />
                    <span>{submitStatus.message}</span>
                  </div>
                  {submitStatus.success && (
                    <button 
                      onClick={handleReturnHome}
                      className="w-full max-w-xs py-3 bg-emerald-600 text-white rounded-xl font-black shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowRight size={18} />
                      <span>Kembali ke Beranda</span>
                    </button>
                  )}
                  {!submitStatus.success && (
                    <button 
                      onClick={() => onComplete(score)}
                      className="mt-2 text-sm underline font-bold"
                    >
                      Tetap Lanjutkan ke Home
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 py-0.5 relative">
      {/* Integrity Popup Overlay */}
      <AnimatePresence>
        {showStartPopup && !showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{ 
                backgroundColor: theme?.bgMain || 'white', 
                color: theme?.textMain || '#1e293b',
                borderColor: theme?.accent || '#10b981'
              }}
              className="rounded-3xl p-6 md:p-8 max-w-[90vw] md:max-w-lg w-full shadow-2xl border-4 text-center relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-current opacity-[0.03] rounded-full -ml-16 -mb-16" />
              
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 leading-tight uppercase tracking-widest">
                  KOMITMEN KEJUJURAN
                </h3>
                
                <div 
                  className="p-5 md:p-8 rounded-2xl border-2 mb-6 md:mb-10"
                  style={{ 
                    backgroundColor: theme?.isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                    borderColor: theme?.accent ? `${theme.accent}33` : 'rgba(16,185,129,0.2)'
                  }}
                >
                  <p className="text-base md:text-xl font-black italic leading-relaxed">
                    "Apa yang mau di banggakan, jika Nilai tinggi tetapi didapatkan dengan cara yang tidak Jujur. Jujur itu hanya bisa dilakukan oleh Orang Hebat"
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    disabled={countdown > 0}
                    onClick={() => setShowStartPopup(false)}
                    style={{ 
                      backgroundColor: countdown > 0 ? '#cbd5e1' : '#22c55e',
                      boxShadow: countdown > 0 ? 'none' : '0 10px 30px rgba(34, 197, 94, 0.4)'
                    }}
                    className={`w-full active:scale-95 text-white font-black py-4 md:py-5 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm md:text-base shadow-lg ${countdown > 0 ? 'cursor-not-allowed grayscale' : 'hover:brightness-110'}`}
                  >
                    {countdown > 0 ? 'BACA DULU...' : 'SAYA BERJANJI AKAN JUJUR'}
                  </button>

                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-3 px-8 rounded-2xl transition-all text-xs uppercase tracking-widest"
                  >
                    SAYA BELUM SIAP JUJUR
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-2xl mx-auto space-y-2">
        {/* Header Stats */}
        <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-xl border-2 border-white/60 shadow-sm flex justify-between items-center px-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm md:text-base font-black text-slate-800 flex items-center gap-2 whitespace-nowrap">
              <Zap className="text-yellow-500 fill-yellow-500 shrink-0" size={16} />
              🌱 {title || 'Kuis IPA'} 🌱
            </h2>
            {username.toLowerCase() === 'gurusmp' && (
              <button
                onClick={() => {
                  const allCorrectAnswers = shuffledQuestions.reduce((acc, q) => {
                    acc[q.id] = q.correctId;
                    return acc;
                  }, {} as Record<number, string>);
                  setAnswers(allCorrectAnswers);
                  setShowResult(true);
                  confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#8B5CF6', '#EC4899', '#3B82F6']
                  });
                }}
                className="text-[10px] font-black text-white bg-rose-500 px-2 py-0.5 rounded-full hover:bg-rose-600 transition-colors self-start uppercase"
              >
                Lompati Kuis (Guru)
              </button>
            )}
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-indigo-600">
              {currentIndex + 1}<span className="text-slate-300 text-sm">/{totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-50 p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-sm"
          />
        </div>

        {/* Question Card */}
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ x: direction * 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -direction * 50, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border-2 border-slate-100 space-y-4"
            >
              <div className="space-y-2">
                <h3 className="text-base md:text-lg font-bold text-slate-800 leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.01, x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleAnswer(option.id)}
                      className={`group relative w-full p-4 rounded-xl border-2 text-left transition-all overflow-hidden ${
                        isSelected 
                          ? 'border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md shadow-blue-500/20' 
                          : 'border-slate-50 bg-white hover:border-blue-100'
                      }`}
                    >
                      {isSelected && (
                        <motion.div 
                          layoutId="glow"
                          className="absolute inset-0 bg-white/10 blur-md"
                        />
                      )}
                      <div className="flex items-center gap-3 relative z-10">
                        <span className={`font-semibold text-xs md:text-sm leading-tight ${
                          isSelected ? 'text-white' : 'text-slate-600'
                        }`}>
                          {option.text}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-2 pt-1">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-black transition-all text-xs ${
              currentIndex === 0 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95'
            }`}
          >
            <ChevronLeft size={18} />
            <span className="hidden md:inline">Sebelumnya</span>
          </button>

          {/* CHECKBOX RAGU-RAGU */}
          <div className="flex-1 flex justify-center">
            <label 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all select-none cursor-pointer border-2 ${
                !answers[currentQuestion.id]
                  ? 'bg-slate-50 text-slate-300 border-transparent cursor-not-allowed italic opacity-50'
                  : raguAnswers[currentQuestion.id]
                    ? 'bg-amber-100 text-amber-700 border-amber-300 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200'
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                disabled={!answers[currentQuestion.id]}
                checked={!!raguAnswers[currentQuestion.id]}
                onChange={(e) => {
                  setRaguAnswers(prev => ({
                    ...prev,
                    [currentQuestion.id]: e.target.checked
                  }));
                }}
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                raguAnswers[currentQuestion.id] 
                  ? 'bg-amber-500 border-amber-500' 
                  : 'bg-white border-slate-300'
              }`}>
                {raguAnswers[currentQuestion.id] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-white"
                  />
                )}
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-tight">Ragu-ragu</span>
            </label>
          </div>

          {currentIndex === totalQuestions - 1 ? (
            <button
              onClick={handleFinish}
              disabled={answeredCount < totalQuestions}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-base shadow-md transition-all ${
                answeredCount < totalQuestions
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:scale-[1.02] active:scale-95 shadow-emerald-500/20'
              }`}
            >
              <CheckCircle2 size={18} />
              <span>Selesai</span>
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl font-black shadow-md hover:scale-[1.02] active:scale-95 transition-all text-base"
            >
              <span>Selanjutnya</span>
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Question Navigation Grid */}
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigasi Soal</span>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-500 rounded-full px-2.5 py-0.5 shadow-sm shadow-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Sudah</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-500 rounded-full px-2.5 py-0.5 shadow-sm shadow-amber-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Ragu</span>
              </div>
              <div className="flex items-center gap-1.5 bg-rose-500 rounded-full px-2.5 py-0.5 shadow-sm shadow-rose-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Belum</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {shuffledQuestions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isRagu = !!raguAnswers[q.id];
              const isCurrent = currentIndex === idx;
              
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-9 rounded-xl font-black text-xs transition-all flex items-center justify-center border-2 ${
                    isCurrent 
                      ? 'border-indigo-500 scale-110 z-10 shadow-md ring-4 ring-indigo-500/10' 
                      : 'border-transparent'
                  } ${
                    isRagu
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                      : isAnswered 
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                        : 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
