/**
 * Elementler ile ilgili yardımcı fonksiyonlar
 */

// Periyodik tablodaki tüm elementlerin listesi
const elementListesi = [
    { atomNumarasi: 1, sembol: 'H', ad: 'Hidrojen', grup: 1, periyot: 1, kategori: 'Reaktif Ametal' },
    { atomNumarasi: 2, sembol: 'He', ad: 'Helyum', grup: 18, periyot: 1, kategori: 'Soy Gaz' },
    { atomNumarasi: 3, sembol: 'Li', ad: 'Lityum', grup: 1, periyot: 2, kategori: 'Alkali Metal' },
    { atomNumarasi: 4, sembol: 'Be', ad: 'Berilyum', grup: 2, periyot: 2, kategori: 'Toprak Alkali Metal' },
    { atomNumarasi: 5, sembol: 'B', ad: 'Bor', grup: 13, periyot: 2, kategori: 'Yarı Metal' },
    { atomNumarasi: 6, sembol: 'C', ad: 'Karbon', grup: 14, periyot: 2, kategori: 'Reaktif Ametal' },
    { atomNumarasi: 7, sembol: 'N', ad: 'Azot', grup: 15, periyot: 2, kategori: 'Reaktif Ametal' },
    { atomNumarasi: 8, sembol: 'O', ad: 'Oksijen', grup: 16, periyot: 2, kategori: 'Reaktif Ametal' },
    { atomNumarasi: 9, sembol: 'F', ad: 'Flor', grup: 17, periyot: 2, kategori: 'Halojen' },
    { atomNumarasi: 10, sembol: 'Ne', ad: 'Neon', grup: 18, periyot: 2, kategori: 'Soy Gaz' },
    { atomNumarasi: 11, sembol: 'Na', ad: 'Sodyum', grup: 1, periyot: 3, kategori: 'Alkali Metal' },
    { atomNumarasi: 12, sembol: 'Mg', ad: 'Magnezyum', grup: 2, periyot: 3, kategori: 'Toprak Alkali Metal' },
    { atomNumarasi: 13, sembol: 'Al', ad: 'Alüminyum', grup: 13, periyot: 3, kategori: 'Metal' },
    { atomNumarasi: 14, sembol: 'Si', ad: 'Silisyum', grup: 14, periyot: 3, kategori: 'Yarı Metal' },
    { atomNumarasi: 15, sembol: 'P', ad: 'Fosfor', grup: 15, periyot: 3, kategori: 'Reaktif Ametal' },
    { atomNumarasi: 16, sembol: 'S', ad: 'Kükürt', grup: 16, periyot: 3, kategori: 'Reaktif Ametal' },
    { atomNumarasi: 17, sembol: 'Cl', ad: 'Klor', grup: 17, periyot: 3, kategori: 'Halojen' },
    { atomNumarasi: 18, sembol: 'Ar', ad: 'Argon', grup: 18, periyot: 3, kategori: 'Soy Gaz' },
    { atomNumarasi: 19, sembol: 'K', ad: 'Potasyum', grup: 1, periyot: 4, kategori: 'Alkali Metal' },
    { atomNumarasi: 20, sembol: 'Ca', ad: 'Kalsiyum', grup: 2, periyot: 4, kategori: 'Toprak Alkali Metal' },
    { atomNumarasi: 21, sembol: 'Sc', ad: 'Skandiyum', grup: 3, periyot: 4, kategori: 'Geçiş Metali' },
    { atomNumarasi: 22, sembol: 'Ti', ad: 'Titanyum', grup: 4, periyot: 4, kategori: 'Geçiş Metali' },
    { atomNumarasi: 23, sembol: 'V', ad: 'Vanadyum', grup: 5, periyot: 4, kategori: 'Geçiş Metali' },
    { atomNumarasi: 24, sembol: 'Cr', ad: 'Krom', grup: 6, periyot: 4, kategori: 'Geçiş Metali' },
    { atomNumarasi: 25, sembol: 'Mn', ad: 'Mangan', grup: 7, periyot: 4, kategori: 'Geçiş Metali' },
    { atomNumarasi: 26, sembol: 'Fe', ad: 'Demir', grup: 8, periyot: 4, kategori: 'Geçiş Metali' },
    { atomNumarasi: 27, sembol: 'Co', ad: 'Kobalt', grup: 9, periyot: 4, kategori: 'Geçiş Metali' },
    { atomNumarasi: 28, sembol: 'Ni', ad: 'Nikel', grup: 10, periyot: 4, kategori: 'Geçiş Metali' },
    { atomNumarasi: 29, sembol: 'Cu', ad: 'Bakır', grup: 11, periyot: 4, kategori: 'Geçiş Metali' },
    { atomNumarasi: 30, sembol: 'Zn', ad: 'Çinko', grup: 12, periyot: 4, kategori: 'Geçiş Metali' },
    { atomNumarasi: 31, sembol: 'Ga', ad: 'Galyum', grup: 13, periyot: 4, kategori: 'Metal' },
    { atomNumarasi: 32, sembol: 'Ge', ad: 'Germanyum', grup: 14, periyot: 4, kategori: 'Yarı Metal' },
    { atomNumarasi: 33, sembol: 'As', ad: 'Arsenik', grup: 15, periyot: 4, kategori: 'Yarı Metal' },
    { atomNumarasi: 34, sembol: 'Se', ad: 'Selenyum', grup: 16, periyot: 4, kategori: 'Reaktif Ametal' },
    { atomNumarasi: 35, sembol: 'Br', ad: 'Brom', grup: 17, periyot: 4, kategori: 'Halojen' },
    { atomNumarasi: 36, sembol: 'Kr', ad: 'Kripton', grup: 18, periyot: 4, kategori: 'Soy Gaz' },
    { atomNumarasi: 37, sembol: 'Rb', ad: 'Rubidyum', grup: 1, periyot: 5, kategori: 'Alkali Metal' },
    { atomNumarasi: 38, sembol: 'Sr', ad: 'Stronsiyum', grup: 2, periyot: 5, kategori: 'Toprak Alkali Metal' },
    { atomNumarasi: 39, sembol: 'Y', ad: 'İtriyum', grup: 3, periyot: 5, kategori: 'Geçiş Metali' },
    { atomNumarasi: 40, sembol: 'Zr', ad: 'Zirkonyum', grup: 4, periyot: 5, kategori: 'Geçiş Metali' },
    { atomNumarasi: 41, sembol: 'Nb', ad: 'Niyobyum', grup: 5, periyot: 5, kategori: 'Geçiş Metali' },
    { atomNumarasi: 42, sembol: 'Mo', ad: 'Molibden', grup: 6, periyot: 5, kategori: 'Geçiş Metali' },
    { atomNumarasi: 43, sembol: 'Tc', ad: 'Teknesyum', grup: 7, periyot: 5, kategori: 'Geçiş Metali' },
    { atomNumarasi: 44, sembol: 'Ru', ad: 'Rutenyum', grup: 8, periyot: 5, kategori: 'Geçiş Metali' },
    { atomNumarasi: 45, sembol: 'Rh', ad: 'Rodyum', grup: 9, periyot: 5, kategori: 'Geçiş Metali' },
    { atomNumarasi: 46, sembol: 'Pd', ad: 'Paladyum', grup: 10, periyot: 5, kategori: 'Geçiş Metali' },
    { atomNumarasi: 47, sembol: 'Ag', ad: 'Gümüş', grup: 11, periyot: 5, kategori: 'Geçiş Metali' },
    { atomNumarasi: 48, sembol: 'Cd', ad: 'Kadmiyum', grup: 12, periyot: 5, kategori: 'Geçiş Metali' },
    { atomNumarasi: 49, sembol: 'In', ad: 'İndiyum', grup: 13, periyot: 5, kategori: 'Metal' },
    { atomNumarasi: 50, sembol: 'Sn', ad: 'Kalay', grup: 14, periyot: 5, kategori: 'Metal' },
    { atomNumarasi: 51, sembol: 'Sb', ad: 'Antimon', grup: 15, periyot: 5, kategori: 'Yarı Metal' },
    { atomNumarasi: 52, sembol: 'Te', ad: 'Tellür', grup: 16, periyot: 5, kategori: 'Yarı Metal' },
    { atomNumarasi: 53, sembol: 'I', ad: 'İyot', grup: 17, periyot: 5, kategori: 'Halojen' },
    { atomNumarasi: 54, sembol: 'Xe', ad: 'Ksenon', grup: 18, periyot: 5, kategori: 'Soy Gaz' },
    // Oyun için yeterli sayıda element tanımlandı
];

/**
 * Atom numarasına göre element bulur
 * @param {number} atomNumarasi Element atom numarası
 * @returns {Object|null} Element veya bulunamazsa null
 */
function elementBul(atomNumarasi) {
    return elementListesi.find(element => element.atomNumarasi === atomNumarasi) || null;
}

/**
 * Belirli bir kategorideki elementleri filtreler
 * @param {string} kategori Element kategorisi (opsiyonel)
 * @returns {Array} Filtrelenmiş element listesi
 */
function elementleriFiltrele(kategori = null) {
    if (kategori) {
        return elementListesi.filter(element => element.kategori === kategori);
    }
    return [...elementListesi]; // Tüm elementlerin bir kopyasını döndür
}

/**
 * Belirli bir kategoriden rastgele bir element seçer
 * @param {string} kategori Element kategorisi (opsiyonel)
 * @returns {Object} Rastgele bir element
 */
function rastgeleElement(kategori = null) {
    const filtrelenmisElementler = elementleriFiltrele(kategori);
    const randomIndex = Math.floor(Math.random() * filtrelenmisElementler.length);
    return filtrelenmisElementler[randomIndex];
}

/**
 * Element kategorilerini döndürür
 * @returns {Array} Kategorilerin listesi
 */
function elementKategorileri() {
    const kategoriler = new Set();
    elementListesi.forEach(element => kategoriler.add(element.kategori));
    return [...kategoriler];
}

/**
 * İki elementin aynı grupta olup olmadığını kontrol eder
 * @param {Object} element1 Birinci element
 * @param {Object} element2 İkinci element
 * @returns {boolean} Aynı grupta ise true, değilse false
 */
function ayniGrupMu(element1, element2) {
    return element1.grup === element2.grup;
}

/**
 * İki elementin aynı periyotta olup olmadığını kontrol eder
 * @param {Object} element1 Birinci element
 * @param {Object} element2 İkinci element
 * @returns {boolean} Aynı periyotta ise true, değilse false
 */
function ayniPeriyotMu(element1, element2) {
    return element1.periyot === element2.periyot;
}

/**
 * İki elementin aynı kategoride olup olmadığını kontrol eder
 * @param {Object} element1 Birinci element
 * @param {Object} element2 İkinci element
 * @returns {boolean} Aynı kategoride ise true, değilse false
 */
function ayniKategoriMi(element1, element2) {
    return element1.kategori === element2.kategori;
}

/**
 * İki elementin atom numaralarının ardışık olup olmadığını kontrol eder
 * @param {Object} element1 Birinci element
 * @param {Object} element2 İkinci element
 * @returns {boolean} Ardışık ise true, değilse false
 */
function ardisikMi(element1, element2) {
    return Math.abs(element1.atomNumarasi - element2.atomNumarasi) === 1;
}

// Global değişkenler olarak tanımla
window.elementListesi = elementListesi;
window.elementBul = elementBul;
window.elementleriFiltrele = elementleriFiltrele;
window.rastgeleElement = rastgeleElement;
window.elementKategorileri = elementKategorileri;
window.ayniGrupMu = ayniGrupMu;
window.ayniPeriyotMu = ayniPeriyotMu;
window.ayniKategoriMi = ayniKategoriMi;
window.ardisikMi = ardisikMi;