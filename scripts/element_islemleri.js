/**
 * Periyodik Okey - Element İşlemleri
 * Element verilerini yükleme ve işleme fonksiyonları
 */

// Varsayılan element verileri (CSV dosyası yüklenemezse kullanılacak)
const ELEMENT_VERILERI = [
    { atom_no: 1, sembol: "H", isim: "Hidrojen", grup: 1, periyot: 1 },
    { atom_no: 2, sembol: "He", isim: "Helyum", grup: 18, periyot: 1 },
    { atom_no: 3, sembol: "Li", isim: "Lityum", grup: 1, periyot: 2 },
    { atom_no: 4, sembol: "Be", isim: "Berilyum", grup: 2, periyot: 2 },
    { atom_no: 5, sembol: "B", isim: "Bor", grup: 13, periyot: 2 },
    { atom_no: 6, sembol: "C", isim: "Karbon", grup: 14, periyot: 2 },
    { atom_no: 7, sembol: "N", isim: "Azot", grup: 15, periyot: 2 },
    { atom_no: 8, sembol: "O", isim: "Oksijen", grup: 16, periyot: 2 },
    { atom_no: 9, sembol: "F", isim: "Flor", grup: 17, periyot: 2 },
    { atom_no: 10, sembol: "Ne", isim: "Neon", grup: 18, periyot: 2 }
    // Not: Bu liste sadece örnek olarak eklendi, tam liste CSV'den yüklenecek
];

/**
 * CSV verisini parse ederek element verilerini döndürür
 * @param {string} csvVerisi - CSV formatında element verileri
 * @return {Array} İşlenmiş element verileri dizisi veya varsayılan veriler
 */
function csvDosyasindanElementleriYukle(csvVerisi) {
    const satirlar = csvVerisi.split('\n');
    const baslikSatiri = satirlar[0].split(',');
    
    // CSV başlık indekslerini bul - 'elementler.csv' dosyasındaki başlıklara göre güncellendi
    const indeksler = {
        atom_no: baslikSatiri.indexOf('AtomNumarasi'),
        sembol: baslikSatiri.indexOf('Sembol'),
        isim: baslikSatiri.indexOf('Isim'),
        grup_kodu: baslikSatiri.indexOf('GrupNumarasi'),
        periyot: baslikSatiri.indexOf('PeriyotNumarasi'),
        element_turu: baslikSatiri.indexOf('GrupTuru')
    };
    
    // Başlıkların doğru formatta olup olmadığını kontrol et
    if (indeksler.atom_no === -1 || indeksler.sembol === -1 || 
        indeksler.isim === -1 || indeksler.grup_kodu === -1 || 
        indeksler.periyot === -1) {
        console.error("CSV dosyası geçerli başlıklara sahip değil!");
        return ELEMENT_VERILERI; // Varsayılan verileri döndür
    }
    
    const elementler = [];
    
    // İlk satır başlık olduğu için 1'den başla
    for (let i = 1; i < satirlar.length; i++) {
        const satir = satirlar[i].trim();
        if (!satir) continue; // Boş satırları atla
        
        const degerler = satir.split(',');
        
        // Değer sayısı doğru mu kontrol et
        if (degerler.length < 5) {
            console.warn(`Satır ${i} yeterli veri içermiyor, atlanıyor: ${satir}`);
            continue;
        }
        
        // Grup kodunu (1A, 8A, 3B gibi) grup numarasına dönüştür
        const grupKodu = degerler[indeksler.grup_kodu].trim();
        let grupNo = 0;
        
        if (grupKodu.includes('A')) {
            // A grubu: 1A-8A
            grupNo = parseInt(grupKodu.replace('A', ''));
            // 8A = 18. grup olarak değerlendir
            if (grupNo === 8) grupNo = 18;
        } else if (grupKodu.includes('B')) {
            // B grubu: 3B-8B, 1B, 2B
            const bGrupNo = parseInt(grupKodu.replace('B', ''));
            if (bGrupNo >= 3 && bGrupNo <= 8) {
                grupNo = bGrupNo + 2; // 3B=5, 4B=6, 5B=7, 6B=8, 7B=9, 8B=10
            } else if (bGrupNo === 1) {
                grupNo = 11; // 1B = 11. grup
            } else if (bGrupNo === 2) {
                grupNo = 12; // 2B = 12. grup
            }
        } else if (grupKodu === 'LN' || grupKodu === 'AN') {
            // Lantanitler ve Aktinitler için özel işlem
            grupNo = 3; // 3. gruba dahil edilir
        }
        
        const element = {
            atom_no: parseInt(degerler[indeksler.atom_no]),
            sembol: degerler[indeksler.sembol].trim(),
            isim: degerler[indeksler.isim].trim(),
            grup: grupNo,
            periyot: parseInt(degerler[indeksler.periyot]),
            element_turu: indeksler.element_turu !== -1 ? degerler[indeksler.element_turu].trim() : null
        };
        
        // Geçerli veri kontrol et
        if (isNaN(element.atom_no) || !element.sembol || !element.isim || 
            element.grup === 0 || isNaN(element.periyot)) {
            console.warn(`Satır ${i} geçersiz veri içeriyor, atlanıyor: ${satir}`);
            continue;
        }
        
        elementler.push(element);
    }
    
    return elementler.length > 0 ? elementler : ELEMENT_VERILERI;
}

/**
 * Element verisinin renk kodunu döndürür
 * @param {Object|null} element - Element verisi
 * @return {string} Element türüne veya grubuna göre renk kodu, element null ise gri renk döndürür
 */
function elementRengiGetir(element) {
    // Element null veya undefined ise varsayılan renk döndür
    if (!element) {
        return '#CCCCCC'; // Varsayılan gri
    }
    
    // Element türü varsa, türe göre renk döndür
    if (element.element_turu) {
        return elementTuruneGoreRenkGetir(element.element_turu);
    }
    
    // Element türü belirtilmemişse, gruba göre renk döndür
    return grupNumarasinaGoreRenkGetir(element.grup);
}

/**
 * Grup numarasına göre renk kodu döndürür
 * @param {number|null} grupNo - Element grup numarası
 * @return {string} Grup numarasına göre renk kodu, grup no geçersizse gri renk döndürür
 */
function grupNumarasinaGoreRenkGetir(grupNo) {
    // Grup numarası null, undefined veya geçersiz ise
    if (!grupNo || isNaN(grupNo)) {
        return '#CCCCCC'; // Varsayılan gri
    }
    
    // Grup numarasına göre renk ata (varsayılan renkler)
    const grupRenkleri = {
        1: '#FF6B6B',   // Grup 1 (Alkali Metaller)
        2: '#FFA06B',   // Grup 2 (Toprak Alkali Metaller)
        3: '#FFD06B',   // Grup 3
        4: '#FFEE6B',   // Grup 4
        5: '#D0FF6B',   // Grup 5
        6: '#A0FF6B',   // Grup 6
        7: '#6BFF6B',   // Grup 7
        8: '#6BFFA0',   // Grup 8
        9: '#6BFFD0',   // Grup 9
        10: '#6BD0FF',  // Grup 10
        11: '#6BA0FF',  // Grup 11
        12: '#6B6BFF',  // Grup 12
        13: '#A06BFF',  // Grup 13
        14: '#D06BFF',  // Grup 14
        15: '#FF6BD0',  // Grup 15
        16: '#FF6BA0',  // Grup 16 (Kalkojenler)
        17: '#FF6B6B',  // Grup 17 (Halojenler)
        18: '#6BD0FF'   // Grup 18 (Soy Gazlar)
    };
    
    return grupRenkleri[grupNo] || '#CCCCCC'; // Varsayılan gri
}

// Eski fonksiyon adını desteklemek için alias oluştur
const grupRengiGetir = grupNumarasinaGoreRenkGetir;

/**
 * Belirli bir gruba ait elementleri filtreler
 * @param {Array} elementler - Tüm elementlerin listesi
 * @param {number} grupNo - Filtreleme yapılacak grup numarası
 * @return {Array} Filtrelenmiş element listesi veya boş dizi
 */
function grupElementleriniGetir(elementler, grupNo) {
    return elementler.filter(element => element.grup === grupNo);
}

/**
 * Belirli bir periyoda ait elementleri filtreler
 * @param {Array} elementler - Tüm elementlerin listesi
 * @param {number} periyotNo - Filtreleme yapılacak periyot numarası
 * @return {Array} Filtrelenmiş element listesi veya boş dizi
 */
function periyotElementleriniGetir(elementler, periyotNo) {
    return elementler.filter(element => element.periyot === periyotNo);
}

/**
 * Element sembolüne göre element verisini döndürür
 * @param {Array} elementler - Tüm elementlerin listesi
 * @param {string} sembol - Aranacak element sembolü (büyük/küçük harf duyarsız)
 * @return {Object|null} Bulunan element verisi veya bulunamazsa null
 */
function elementBul(elementler, sembol) {
    return elementler.find(element => element.sembol.toLowerCase() === sembol.toLowerCase());
}

/**
 * Element atom numarasına göre element verisini döndürür
 * @param {Array} elementler - Tüm elementlerin listesi
 * @param {number} atomNo - Aranacak atom numarası
 * @return {Object|null} Bulunan element verisi veya bulunamazsa null
 */
function atomNoyaGoreElementBul(elementler, atomNo) {
    return elementler.find(element => element.atom_no === atomNo);
}

/**
 * Element türüne göre renk kodu döndürür
 * @param {string|null} elementTuru - Element türü (metal, ametal, yari_metal, vb.)
 * @return {string} Element türüne göre renk kodu, tür geçersizse gri renk döndürür
 */
function elementTuruneGoreRenkGetir(elementTuru) {
    // Element türü null veya undefined ise
    if (!elementTuru) {
        return '#CCCCCC'; // Varsayılan gri
    }
    
    // Element türüne göre renk ata
    const elementTurleriRenkleri = {
        'metal': '#6B8EFF',          // Mavi-mor
        'ametal': '#FF6B6B',         // Kırmızı
        'yari_metal': '#FFD06B',     // Sarı
        'soygaz': '#6BD0FF',         // Açık mavi
        'halojen': '#FF6BA0',        // Pembe
        'alkali_metal': '#FF8C6B',   // Turuncu
        'toprak_alkali': '#FFA06B',  // Açık turuncu
        'gecis_metali': '#A06BFF',   // Mor
        'lantanit': '#D06BFF',       // Açık mor
        'aktinit': '#FF6BD0'         // Pembe-mor
    };
    
    return elementTurleriRenkleri[elementTuru] || '#CCCCCC'; // Varsayılan gri
}

// Tüm fonksiyonları global olarak erişilebilir yap
window.ELEMENT_VERILERI = ELEMENT_VERILERI;
window.csvDosyasindanElementleriYukle = csvDosyasindanElementleriYukle;
window.elementRengiGetir = elementRengiGetir;
window.grupRengiGetir = grupRengiGetir;
window.grupNumarasinaGoreRenkGetir = grupNumarasinaGoreRenkGetir;
window.grupElementleriniGetir = grupElementleriniGetir;
window.periyotElementleriniGetir = periyotElementleriniGetir;
window.elementBul = elementBul;
window.atomNoyaGoreElementBul = atomNoyaGoreElementBul;
window.elementTuruneGoreRenkGetir = elementTuruneGoreRenkGetir; 