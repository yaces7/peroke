/**
 * Periyodik Tablo Element Verileri
 */
var ELEMENT_VERILERI = [
    {
        id: 1,
        sembol: "H",
        isim: "Hidrojen",
        atomNumarasi: 1,
        grupNumarasi: "1A",
        periyotNumarasi: 1,
        grupTuru: "Ametal"
    },
    {
        id: 2,
        sembol: "He",
        isim: "Helyum",
        atomNumarasi: 2,
        grupNumarasi: "8A",
        periyotNumarasi: 1,
        grupTuru: "Soy Gaz"
    },
    {
        id: 3,
        sembol: "Li",
        isim: "Lityum",
        atomNumarasi: 3,
        grupNumarasi: "1A",
        periyotNumarasi: 2,
        grupTuru: "Alkali Metal"
    },
    {
        id: 4,
        sembol: "Be",
        isim: "Berilyum",
        atomNumarasi: 4,
        grupNumarasi: "2A",
        periyotNumarasi: 2,
        grupTuru: "Toprak Alkali Metal"
    },
    {
        id: 5,
        sembol: "B",
        isim: "Bor",
        atomNumarasi: 5,
        grupNumarasi: "3A",
        periyotNumarasi: 2,
        grupTuru: "Yarı Metal"
    },
    {
        id: 6,
        sembol: "C",
        isim: "Karbon",
        atomNumarasi: 6,
        grupNumarasi: "4A",
        periyotNumarasi: 2,
        grupTuru: "Ametal"
    },
    {
        id: 7,
        sembol: "N",
        isim: "Azot",
        atomNumarasi: 7,
        grupNumarasi: "5A",
        periyotNumarasi: 2,
        grupTuru: "Ametal"
    },
    {
        id: 8,
        sembol: "O",
        isim: "Oksijen",
        atomNumarasi: 8,
        grupNumarasi: "6A",
        periyotNumarasi: 2,
        grupTuru: "Ametal"
    },
    {
        id: 9,
        sembol: "F",
        isim: "Flor",
        atomNumarasi: 9,
        grupNumarasi: "7A",
        periyotNumarasi: 2,
        grupTuru: "Halojen"
    },
    {
        id: 10,
        sembol: "Ne",
        isim: "Neon",
        atomNumarasi: 10,
        grupNumarasi: "8A",
        periyotNumarasi: 2,
        grupTuru: "Soy Gaz"
    },
    // İlk 10 element yukarıda listelendi. Siz CSV dosyasındaki 118 elementi buraya ekleyebilirsiniz.
    // Tüm elementlerin verileri aynı formatta eklenir. 
    // Daha kısa tutmak için sadece ilk 10 elementi ekledim.
];

// Joker kartlar
var JOKER_VERILERI = [
    {
        id: 119,
        sembol: "SE1",
        isim: "Süper Element 1",
        atomNumarasi: null,
        grupNumarasi: null,
        periyotNumarasi: null,
        grupTuru: "Joker",
        joker: true
    },
    {
        id: 120,
        sembol: "SE2",
        isim: "Süper Element 2",
        atomNumarasi: null,
        grupNumarasi: null,
        periyotNumarasi: null,
        grupTuru: "Joker",
        joker: true
    }
];

// Element verilerini CSV'den yüklemek için yardımcı fonksiyon
function csvDosyasindanElementleriYukle(csvVerisi) {
    const satirlar = csvVerisi.split('\n');
    const elementler = [];
    
    // Başlık satırını atla
    for (let i = 1; i < satirlar.length; i++) {
        const satir = satirlar[i].trim();
        if (satir.length === 0) continue;
        
        const [atomNumarasi, sembol, isim, grupNumarasi, periyotNumarasi, grupTuru] = satir.split(',');
        
        elementler.push({
            id: parseInt(atomNumarasi),
            sembol,
            isim,
            atomNumarasi: parseInt(atomNumarasi),
            grupNumarasi,
            periyotNumarasi: parseInt(periyotNumarasi),
            grupTuru
        });
    }
    
    return elementler;
}

// Tüm element verilerini birleştir
function tumElementVerileriniAl() {
    return [...ELEMENT_VERILERI, ...JOKER_VERILERI];
}

// Dışa aktar (export)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ELEMENT_VERILERI,
        JOKER_VERILERI,
        csvDosyasindanElementleriYukle,
        tumElementVerileriniAl
    };
}

/**
 * Periyodik Okey - Element Verileri
 * Oyunda kullanılan elementlerin varsayılan verileri
 */

// Elementlerin varsayılan verileri
var ELEMENT_VERILERI_OKEY = [
    { atom_no: 1, sembol: "H", isim: "Hidrojen", grup: 1, periyot: 1, element_turu: "Ametal" },
    { atom_no: 2, sembol: "He", isim: "Helyum", grup: 18, periyot: 1, element_turu: "Soy Gaz" },
    { atom_no: 3, sembol: "Li", isim: "Lityum", grup: 1, periyot: 2, element_turu: "Alkali Metal" },
    { atom_no: 4, sembol: "Be", isim: "Berilyum", grup: 2, periyot: 2, element_turu: "Toprak Alkali Metal" },
    { atom_no: 5, sembol: "B", isim: "Bor", grup: 13, periyot: 2, element_turu: "Yarı Metal" },
    { atom_no: 6, sembol: "C", isim: "Karbon", grup: 14, periyot: 2, element_turu: "Ametal" },
    { atom_no: 7, sembol: "N", isim: "Azot", grup: 15, periyot: 2, element_turu: "Ametal" },
    { atom_no: 8, sembol: "O", isim: "Oksijen", grup: 16, periyot: 2, element_turu: "Ametal" },
    { atom_no: 9, sembol: "F", isim: "Flor", grup: 17, periyot: 2, element_turu: "Halojen" },
    { atom_no: 10, sembol: "Ne", isim: "Neon", grup: 18, periyot: 2, element_turu: "Soy Gaz" },
    { atom_no: 11, sembol: "Na", isim: "Sodyum", grup: 1, periyot: 3, element_turu: "Alkali Metal" },
    { atom_no: 12, sembol: "Mg", isim: "Magnezyum", grup: 2, periyot: 3, element_turu: "Toprak Alkali Metal" },
    { atom_no: 13, sembol: "Al", isim: "Alüminyum", grup: 13, periyot: 3, element_turu: "Metal" },
    { atom_no: 14, sembol: "Si", isim: "Silisyum", grup: 14, periyot: 3, element_turu: "Yarı Metal" },
    { atom_no: 15, sembol: "P", isim: "Fosfor", grup: 15, periyot: 3, element_turu: "Ametal" },
    { atom_no: 16, sembol: "S", isim: "Kükürt", grup: 16, periyot: 3, element_turu: "Ametal" },
    { atom_no: 17, sembol: "Cl", isim: "Klor", grup: 17, periyot: 3, element_turu: "Halojen" },
    { atom_no: 18, sembol: "Ar", isim: "Argon", grup: 18, periyot: 3, element_turu: "Soy Gaz" },
    { atom_no: 19, sembol: "K", isim: "Potasyum", grup: 1, periyot: 4, element_turu: "Alkali Metal" },
    { atom_no: 20, sembol: "Ca", isim: "Kalsiyum", grup: 2, periyot: 4, element_turu: "Toprak Alkali Metal" },
    { atom_no: 21, sembol: "Sc", isim: "Skandiyum", grup: 3, periyot: 4, element_turu: "Geçiş Metali" },
    { atom_no: 22, sembol: "Ti", isim: "Titanyum", grup: 4, periyot: 4, element_turu: "Geçiş Metali" },
    { atom_no: 23, sembol: "V", isim: "Vanadyum", grup: 5, periyot: 4, element_turu: "Geçiş Metali" },
    { atom_no: 24, sembol: "Cr", isim: "Krom", grup: 6, periyot: 4, element_turu: "Geçiş Metali" },
    { atom_no: 25, sembol: "Mn", isim: "Mangan", grup: 7, periyot: 4, element_turu: "Geçiş Metali" },
    { atom_no: 26, sembol: "Fe", isim: "Demir", grup: 8, periyot: 4, element_turu: "Geçiş Metali" },
    { atom_no: 27, sembol: "Co", isim: "Kobalt", grup: 9, periyot: 4, element_turu: "Geçiş Metali" },
    { atom_no: 28, sembol: "Ni", isim: "Nikel", grup: 10, periyot: 4, element_turu: "Geçiş Metali" },
    { atom_no: 29, sembol: "Cu", isim: "Bakır", grup: 11, periyot: 4, element_turu: "Geçiş Metali" },
    { atom_no: 30, sembol: "Zn", isim: "Çinko", grup: 12, periyot: 4, element_turu: "Geçiş Metali" },
    { atom_no: 31, sembol: "Ga", isim: "Galyum", grup: 13, periyot: 4, element_turu: "Metal" },
    { atom_no: 32, sembol: "Ge", isim: "Germanyum", grup: 14, periyot: 4, element_turu: "Yarı Metal" },
    { atom_no: 33, sembol: "As", isim: "Arsenik", grup: 15, periyot: 4, element_turu: "Yarı Metal" },
    { atom_no: 34, sembol: "Se", isim: "Selenyum", grup: 16, periyot: 4, element_turu: "Ametal" },
    { atom_no: 35, sembol: "Br", isim: "Brom", grup: 17, periyot: 4, element_turu: "Halojen" },
    { atom_no: 36, sembol: "Kr", isim: "Kripton", grup: 18, periyot: 4, element_turu: "Soy Gaz" },
    { atom_no: 37, sembol: "Rb", isim: "Rubidyum", grup: 1, periyot: 5, element_turu: "Alkali Metal" },
    { atom_no: 38, sembol: "Sr", isim: "Stronsiyum", grup: 2, periyot: 5, element_turu: "Toprak Alkali Metal" },
    { atom_no: 39, sembol: "Y", isim: "İtriyum", grup: 3, periyot: 5, element_turu: "Geçiş Metali" },
    { atom_no: 40, sembol: "Zr", isim: "Zirkonyum", grup: 4, periyot: 5, element_turu: "Geçiş Metali" },
    { atom_no: 41, sembol: "Nb", isim: "Niyobyum", grup: 5, periyot: 5, element_turu: "Geçiş Metali" },
    { atom_no: 42, sembol: "Mo", isim: "Molibden", grup: 6, periyot: 5, element_turu: "Geçiş Metali" },
    { atom_no: 43, sembol: "Tc", isim: "Teknesyum", grup: 7, periyot: 5, element_turu: "Geçiş Metali" },
    { atom_no: 44, sembol: "Ru", isim: "Rutenyum", grup: 8, periyot: 5, element_turu: "Geçiş Metali" },
    { atom_no: 45, sembol: "Rh", isim: "Rodyum", grup: 9, periyot: 5, element_turu: "Geçiş Metali" },
    { atom_no: 46, sembol: "Pd", isim: "Paladyum", grup: 10, periyot: 5, element_turu: "Geçiş Metali" },
    { atom_no: 47, sembol: "Ag", isim: "Gümüş", grup: 11, periyot: 5, element_turu: "Geçiş Metali" },
    { atom_no: 48, sembol: "Cd", isim: "Kadmiyum", grup: 12, periyot: 5, element_turu: "Geçiş Metali" },
    { atom_no: 49, sembol: "In", isim: "İndiyum", grup: 13, periyot: 5, element_turu: "Metal" },
    { atom_no: 50, sembol: "Sn", isim: "Kalay", grup: 14, periyot: 5, element_turu: "Metal" },
    { atom_no: 51, sembol: "Sb", isim: "Antimon", grup: 15, periyot: 5, element_turu: "Yarı Metal" },
    { atom_no: 52, sembol: "Te", isim: "Tellür", grup: 16, periyot: 5, element_turu: "Yarı Metal" },
    { atom_no: 53, sembol: "I", isim: "İyot", grup: 17, periyot: 5, element_turu: "Halojen" },
    { atom_no: 54, sembol: "Xe", isim: "Ksenon", grup: 18, periyot: 5, element_turu: "Soy Gaz" }
];

// Global olarak erişime izin ver
window.ELEMENT_VERILERI_OKEY = ELEMENT_VERILERI_OKEY; 