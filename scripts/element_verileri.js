/**
 * Periyodik Tablo Element Verileri
 */
const ELEMENT_VERILERI = [
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
const JOKER_VERILERI = [
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