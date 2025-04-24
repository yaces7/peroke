/**
 * Periyodik Tablo Elementleri
 * Atom numarası, sembol, ad, grup, periyot ve kategori bilgilerini içerir
 */

const ELEMENTLER = [
    // 1. Periyot
    { atomNumarasi: 1, sembol: 'H', ad: 'Hidrojen', grup: 1, periyot: 1, kategori: 'Ametaller' },
    { atomNumarasi: 2, sembol: 'He', ad: 'Helyum', grup: 18, periyot: 1, kategori: 'Soy Gazlar' },
    
    // 2. Periyot
    { atomNumarasi: 3, sembol: 'Li', ad: 'Lityum', grup: 1, periyot: 2, kategori: 'Alkali Metaller' },
    { atomNumarasi: 4, sembol: 'Be', ad: 'Berilyum', grup: 2, periyot: 2, kategori: 'Toprak Alkali Metaller' },
    { atomNumarasi: 5, sembol: 'B', ad: 'Bor', grup: 13, periyot: 2, kategori: 'Yarı Metaller' },
    { atomNumarasi: 6, sembol: 'C', ad: 'Karbon', grup: 14, periyot: 2, kategori: 'Ametaller' },
    { atomNumarasi: 7, sembol: 'N', ad: 'Azot', grup: 15, periyot: 2, kategori: 'Ametaller' },
    { atomNumarasi: 8, sembol: 'O', ad: 'Oksijen', grup: 16, periyot: 2, kategori: 'Ametaller' },
    { atomNumarasi: 9, sembol: 'F', ad: 'Flor', grup: 17, periyot: 2, kategori: 'Halojenler' },
    { atomNumarasi: 10, sembol: 'Ne', ad: 'Neon', grup: 18, periyot: 2, kategori: 'Soy Gazlar' },
    
    // 3. Periyot
    { atomNumarasi: 11, sembol: 'Na', ad: 'Sodyum', grup: 1, periyot: 3, kategori: 'Alkali Metaller' },
    { atomNumarasi: 12, sembol: 'Mg', ad: 'Magnezyum', grup: 2, periyot: 3, kategori: 'Toprak Alkali Metaller' },
    { atomNumarasi: 13, sembol: 'Al', ad: 'Alüminyum', grup: 13, periyot: 3, kategori: 'Diğer Metaller' },
    { atomNumarasi: 14, sembol: 'Si', ad: 'Silisyum', grup: 14, periyot: 3, kategori: 'Yarı Metaller' },
    { atomNumarasi: 15, sembol: 'P', ad: 'Fosfor', grup: 15, periyot: 3, kategori: 'Ametaller' },
    { atomNumarasi: 16, sembol: 'S', ad: 'Kükürt', grup: 16, periyot: 3, kategori: 'Ametaller' },
    { atomNumarasi: 17, sembol: 'Cl', ad: 'Klor', grup: 17, periyot: 3, kategori: 'Halojenler' },
    { atomNumarasi: 18, sembol: 'Ar', ad: 'Argon', grup: 18, periyot: 3, kategori: 'Soy Gazlar' },
    
    // 4. Periyot
    { atomNumarasi: 19, sembol: 'K', ad: 'Potasyum', grup: 1, periyot: 4, kategori: 'Alkali Metaller' },
    { atomNumarasi: 20, sembol: 'Ca', ad: 'Kalsiyum', grup: 2, periyot: 4, kategori: 'Toprak Alkali Metaller' },
    { atomNumarasi: 21, sembol: 'Sc', ad: 'Skandiyum', grup: 3, periyot: 4, kategori: 'Geçiş Metalleri' },
    { atomNumarasi: 22, sembol: 'Ti', ad: 'Titanyum', grup: 4, periyot: 4, kategori: 'Geçiş Metalleri' },
    { atomNumarasi: 23, sembol: 'V', ad: 'Vanadyum', grup: 5, periyot: 4, kategori: 'Geçiş Metalleri' },
    { atomNumarasi: 24, sembol: 'Cr', ad: 'Krom', grup: 6, periyot: 4, kategori: 'Geçiş Metalleri' },
    { atomNumarasi: 25, sembol: 'Mn', ad: 'Mangan', grup: 7, periyot: 4, kategori: 'Geçiş Metalleri' },
    { atomNumarasi: 26, sembol: 'Fe', ad: 'Demir', grup: 8, periyot: 4, kategori: 'Geçiş Metalleri' },
    { atomNumarasi: 27, sembol: 'Co', ad: 'Kobalt', grup: 9, periyot: 4, kategori: 'Geçiş Metalleri' },
    { atomNumarasi: 28, sembol: 'Ni', ad: 'Nikel', grup: 10, periyot: 4, kategori: 'Geçiş Metalleri' },
    { atomNumarasi: 29, sembol: 'Cu', ad: 'Bakır', grup: 11, periyot: 4, kategori: 'Geçiş Metalleri' },
    { atomNumarasi: 30, sembol: 'Zn', ad: 'Çinko', grup: 12, periyot: 4, kategori: 'Geçiş Metalleri' },
    { atomNumarasi: 31, sembol: 'Ga', ad: 'Galyum', grup: 13, periyot: 4, kategori: 'Diğer Metaller' },
    { atomNumarasi: 32, sembol: 'Ge', ad: 'Germanyum', grup: 14, periyot: 4, kategori: 'Yarı Metaller' },
    { atomNumarasi: 33, sembol: 'As', ad: 'Arsenik', grup: 15, periyot: 4, kategori: 'Yarı Metaller' },
    { atomNumarasi: 34, sembol: 'Se', ad: 'Selenyum', grup: 16, periyot: 4, kategori: 'Ametaller' },
    { atomNumarasi: 35, sembol: 'Br', ad: 'Brom', grup: 17, periyot: 4, kategori: 'Halojenler' },
    { atomNumarasi: 36, sembol: 'Kr', ad: 'Kripton', grup: 18, periyot: 4, kategori: 'Soy Gazlar' }
    
    // Not: Oyun için sadece ilk 36 element eklendi. İhtiyaç olursa daha fazla element eklenebilir.
];

/**
 * Belirli atom numarasına sahip elementi döndürür
 * @param {number} atomNumarasi Element atom numarası
 * @returns {Object|null} Element objesi veya bulunamazsa null
 */
function elementBul(atomNumarasi) {
    return ELEMENTLER.find(element => element.atomNumarasi === atomNumarasi) || null;
}

/**
 * Belirli periyot veya gruba ait elementleri döndürür
 * @param {Object} filtre Filtreleme kriterleri: { periyot, grup, kategori }
 * @returns {Array} Filtrelenmiş elementler dizisi
 */
function elementleriFiltrele(filtre = {}) {
    return ELEMENTLER.filter(element => {
        let eslesme = true;
        
        if (filtre.periyot !== undefined) {
            eslesme = eslesme && element.periyot === filtre.periyot;
        }
        
        if (filtre.grup !== undefined) {
            eslesme = eslesme && element.grup === filtre.grup;
        }
        
        if (filtre.kategori !== undefined) {
            eslesme = eslesme && element.kategori === filtre.kategori;
        }
        
        return eslesme;
    });
}

/**
 * Rastgele bir element döndürür
 * @param {Object} filtre Filtreleme kriterleri: { periyot, grup, kategori }
 * @returns {Object|null} Rastgele element objesi veya bulunamazsa null
 */
function rastgeleElement(filtre = {}) {
    const filtrelenmisElementler = elementleriFiltrele(filtre);
    
    if (filtrelenmisElementler.length === 0) {
        return null;
    }
    
    const rastgeleIndex = Math.floor(Math.random() * filtrelenmisElementler.length);
    return filtrelenmisElementler[rastgeleIndex];
}

// Dışa aktarım
export { ELEMENTLER, elementBul, elementleriFiltrele, rastgeleElement }; 