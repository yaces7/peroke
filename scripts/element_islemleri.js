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
 * CSV dosyasından elementleri yükler
 * @param {string} csvData - CSV formatında element verileri
 * @returns {Array} - İşlenmiş element nesneleri dizisi
 */
function csvDosyasindanElementleriYukle(csvData) {
    // CSV boş ise varsayılan verileri döndür
    if (!csvData || csvData.trim() === '') {
        console.warn('CSV verisi boş veya tanımsız. Varsayılan veriler kullanılıyor.');
        return ELEMENT_VERILERI;
    }

    const satirlar = csvData.trim().split('\n');
    if (satirlar.length <= 1) {
        console.warn('CSV verileri yetersiz. Varsayılan veriler kullanılıyor.');
        return ELEMENT_VERILERI;
    }

    // İlk satır başlıkları içerir
    const basliklar = satirlar[0].split(',').map(baslik => baslik.trim());
    
    // Başlıkların doğruluğunu kontrol et
    const atomNoIndeksi = basliklar.findIndex(b => b === 'AtomNumarasi');
    const sembolIndeksi = basliklar.findIndex(b => b === 'Sembol');
    const isimIndeksi = basliklar.findIndex(b => b === 'Isim');
    const grupIndeksi = basliklar.findIndex(b => b === 'GrupNumarasi');
    const periyotIndeksi = basliklar.findIndex(b => b === 'PeriyotNumarasi');
    const atomKutlesiIndeksi = basliklar.findIndex(b => b === 'AtomKutlesi');
    const elementTuruIndeksi = basliklar.findIndex(b => b === 'GrupTuru');
    const renkIndeksi = basliklar.findIndex(b => b === 'Renk');
    
    // Gerekli başlıkların var olup olmadığını kontrol et
    if (atomNoIndeksi === -1 || sembolIndeksi === -1 || isimIndeksi === -1 || 
        grupIndeksi === -1 || periyotIndeksi === -1) {
        console.warn('CSV dosyasında gerekli başlıklar eksik. Varsayılan veriler kullanılıyor.');
        return ELEMENT_VERILERI;
    }
    
    const elementler = [];
    
    // İlk satırı atla (başlıklar)
    for (let i = 1; i < satirlar.length; i++) {
        if (!satirlar[i].trim()) continue; // Boş satırları atla
        
        const veri = satirlar[i].split(',').map(deger => deger.trim());
        
        // Minimum veri uzunluğunu kontrol et
        if (veri.length < Math.max(atomNoIndeksi, sembolIndeksi, isimIndeksi, grupIndeksi, periyotIndeksi) + 1) {
            console.warn(`Satır ${i+1}'de yetersiz veri. Bu satır atlanıyor.`);
            continue;
        }
        
        // Grup ve periyot verilerini doğru şekilde işle
        let grupNumarasi = veri[grupIndeksi];
        // Eğer grup A/B formatındaysa (örn: 1A, 8B), sayısal değere dönüştür
        if (typeof grupNumarasi === 'string' && grupNumarasi.match(/^\d+[AB]$/)) {
            const grupHarfi = grupNumarasi.slice(-1);
            const grupRakam = parseInt(grupNumarasi.slice(0, -1));
            
            if (grupHarfi === 'A') {
                // A grupları: 1A-8A doğrudan sayıya dönüştürülür
                grupNumarasi = grupRakam;
            } else if (grupHarfi === 'B') {
                // B grupları: 1B-8B --> 3-12 arasında eşleştirilir
                const bGrupHaritasi = {1: 3, 2: 4, 3: 5, 4: 6, 5: 7, 6: 8, 7: 9, 8: 10, 9: 11, 10: 12};
                grupNumarasi = bGrupHaritasi[grupRakam] || grupRakam;
            }
        } else {
            // Sayısal değer ise parseInt ile dönüştür
            grupNumarasi = parseInt(grupNumarasi);
        }
        
        let periyotNumarasi = parseInt(veri[periyotIndeksi]);
        
        // Atom numarası ve diğer sayısal değerleri kontrol et
        const atomNo = parseInt(veri[atomNoIndeksi]);
        if (isNaN(atomNo) || isNaN(grupNumarasi) || isNaN(periyotNumarasi)) {
            console.warn(`Satır ${i+1}'de geçersiz sayısal değer. Bu satır atlanıyor.`);
            continue;
        }
        
        // Yeni element nesnesi oluştur
        const element = {
            atom_no: atomNo,
            sembol: veri[sembolIndeksi],
            isim: veri[isimIndeksi],
            grup: grupNumarasi,
            periyot: periyotNumarasi
        };
        
        // İsteğe bağlı alanları ekle
        if (atomKutlesiIndeksi !== -1 && veri[atomKutlesiIndeksi]) {
            element.atom_kutlesi = parseFloat(veri[atomKutlesiIndeksi]);
        }
        
        if (elementTuruIndeksi !== -1 && veri[elementTuruIndeksi]) {
            element.element_turu = veri[elementTuruIndeksi];
        }
        
        if (renkIndeksi !== -1 && veri[renkIndeksi]) {
            element.renk = veri[renkIndeksi];
        }
        
        elementler.push(element);
    }
    
    if (elementler.length === 0) {
        console.warn('CSV dosyasında geçerli element verisi bulunamadı. Varsayılan veriler kullanılıyor.');
        return ELEMENT_VERILERI;
    }
    
    console.log(`${elementler.length} element başarıyla yüklendi.`);
    return elementler;
}

/**
 * Element türüne göre renk kodu döndürür
 * @param {string} elementTuru - Element türü
 * @returns {string} - Renk kodu
 */
function elementTuruneGoreRenkGetir(elementTuru) {
    const renkHaritasi = {
        'Metal': '#b39ddb',         // Mor
        'Ametal': '#81c784',        // Yeşil
        'Yarı Metal': '#90caf9',    // Mavi
        'Soy Gaz': '#ffcc80',       // Turuncu
        'Halojen': '#ef9a9a',       // Kırmızı
        'Alkali Metal': '#f48fb1',  // Pembe
        'Toprak Alkali Metal': '#ffe082', // Sarı
        'Lantanit': '#ce93d8',      // Açık mor
        'Aktinit': '#9fa8da',       // Açık mavi
        'Geçiş Metali': '#a1887f',  // Kahverengi
        'Bilinmiyor': '#e0e0e0'     // Gri
    };
    
    return renkHaritasi[elementTuru] || '#CCCCCC'; // Varsayılan gri
}

/**
 * Grup numarasına göre renk kodu döndürür
 * @param {number} grupNo - Grup numarası
 * @returns {string} - Renk kodu
 */
function grupNumarasinaGoreRenkGetir(grupNo) {
    const grupRenkHaritasi = {
        1: '#f48fb1',  // Grup 1 (1A) - Pembe - Alkali Metaller
        2: '#ffe082',  // Grup 2 (2A) - Sarı - Toprak Alkali Metaller
        3: '#c5cae9',  // Grup 3 (3B) - Açık mavi
        4: '#b39ddb',  // Grup 4 (4B) - Mor
        5: '#9fa8da',  // Grup 5 (5B) - Açık mavi
        6: '#90caf9',  // Grup 6 (6B) - Mavi
        7: '#81d4fa',  // Grup 7 (7B) - Açık mavi
        8: '#80deea',  // Grup 8 (8B) - Turkuaz
        9: '#80cbc4',  // Grup 9 (8B) - Açık yeşil
        10: '#a5d6a7', // Grup 10 (8B) - Yeşil
        11: '#c5e1a5', // Grup 11 (1B) - Açık yeşil
        12: '#e6ee9c', // Grup 12 (2B) - Sarımsı yeşil
        13: '#fff59d', // Grup 13 (3A) - Açık sarı
        14: '#ffe082', // Grup 14 (4A) - Sarı
        15: '#ffcc80', // Grup 15 (5A) - Turuncu
        16: '#ffab91', // Grup 16 (6A) - Turuncu kırmızı
        17: '#ef9a9a', // Grup 17 (7A) - Kırmızı - Halojenler
        18: '#ffcc80'  // Grup 18 (8A) - Turuncu - Soy Gazlar
    };
    
    return grupRenkHaritasi[grupNo] || '#CCCCCC'; // Varsayılan gri
}

/**
 * Element nesnesine göre renk kodu döndürür
 * @param {Object} element - Element nesnesi
 * @returns {string} - Renk kodu
 */
function elementRengiGetir(element) {
    // Element null veya undefined ise varsayılan renk döndür
    if (!element) {
        return '#CCCCCC'; // Varsayılan gri
    }
    
    // Eğer elementin kendi renk kodu varsa, onu kullan
    if (element.renk) {
        return element.renk;
    }
    
    // Eğer elementin türü tanımlıysa, tür rengini kullan
    if (element.element_turu) {
        return elementTuruneGoreRenkGetir(element.element_turu);
    }
    
    // Son olarak grup numarasına göre renk belirle
    if (element.grup) {
        return grupNumarasinaGoreRenkGetir(element.grup);
    }
    
    return '#CCCCCC'; // Hiçbiri yoksa varsayılan gri
}

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

// Tüm fonksiyonları global olarak erişilebilir yap
window.ELEMENT_VERILERI = ELEMENT_VERILERI;
window.csvDosyasindanElementleriYukle = csvDosyasindanElementleriYukle;
window.elementRengiGetir = elementRengiGetir;
window.grupNumarasinaGoreRenkGetir = grupNumarasinaGoreRenkGetir;
window.grupElementleriniGetir = grupElementleriniGetir;
window.periyotElementleriniGetir = periyotElementleriniGetir;
window.elementBul = elementBul;
window.atomNoyaGoreElementBul = atomNoyaGoreElementBul;
window.elementTuruneGoreRenkGetir = elementTuruneGoreRenkGetir; 