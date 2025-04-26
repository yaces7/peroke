/**
 * Periyodik Okey - Oyun Mekanikleri
 * Oyun tahtası oluşturma, okey kuralları ve oyun akışı
 */

// Oyun ayarları
const OYUN_AYARLARI = {
    baslangic_tas_sayisi: 14,
    minimum_per_sayisi: 3,
    minimum_grup_sayisi: 3,
    goster_kazanma_olasılıgi: true,
    zamanlayici_suresi: 60,
    seviye_zorlugu: "normal"
};

// Oyun durumu
let oyunDurumu = {
    aktif: false,
    siradaki_oyuncu: 0,
    oyuncular: [],
    ortadaki_taslar: [],
    acik_taslar: [],
    gosterge: null,
    okey_tasi: null,
    tur_sayisi: 0,
    baslangic_zamani: null,
    bitis_zamani: null
};

/**
 * Yeni bir oyun başlatır
 * @param {Array} oyuncular - Oyuncu bilgilerini içeren dizi
 * @param {Array} elementVerileri - Element verilerini içeren dizi
 */
function oyunuBaslat(oyuncular, elementVerileri) {
    if (!elementVerileri || elementVerileri.length < 30) {
        console.error("Yetersiz element verisi ile oyun başlatılamaz!");
        return false;
    }
    
    if (!oyuncular || oyuncular.length < 2 || oyuncular.length > 4) {
        console.error("Oyuncu sayısı 2-4 arasında olmalıdır!");
        return false;
    }
    
    // Oyun durumunu sıfırla
    oyunDurumu = {
        aktif: true,
        siradaki_oyuncu: 0,
        oyuncular: oyuncular.map(oyuncu => ({ 
            ...oyuncu, 
            taslar: [],
            puan: 0
        })),
        ortadaki_taslar: [],
        acik_taslar: [],
        gosterge: null,
        okey_tasi: null,
        tur_sayisi: 0,
        baslangic_zamani: new Date(),
        bitis_zamani: null
    };
    
    // Taşları oluştur ve karıştır
    const taslar = taslariOlustur(elementVerileri);
    taslarıKaristir(taslar);
    
    // Taşları dağıt
    taslarıDagit(taslar);
    
    // Gösterge taşı ve okey taşını belirle
    gostergeTasiBelirle();
    
    // Başlangıç oyuncusunu belirle
    baslangicOyuncusuBelirle();
    
    // Oyun başlangıç sesi çal
    if (typeof sesCal === 'function') {
        sesCal('oyun_basladi');
    }
    
    console.log("Oyun başladı! İlk sıra: " + oyunDurumu.oyuncular[oyunDurumu.siradaki_oyuncu].isim);
    
    return true;
}

/**
 * Taşları oluşturur
 * @param {Array} elementVerileri - Element verilerini içeren dizi
 * @return {Array} Oluşturulan taşların listesi
 */
function taslariOlustur(elementVerileri) {
    const taslar = [];
    
    // Her elementten 2 adet oluştur (toplam 2 takım)
    for (let takimNo = 1; takimNo <= 2; takimNo++) {
        elementVerileri.forEach(element => {
            taslar.push({
                element_id: element.atom_no,
                element: { ...element },
                takim: takimNo,
                joker: false
            });
        });
    }
    
    // İki adet sahte okey (joker) taşı ekle
    taslar.push({
        element_id: 0,
        element: { 
            atom_no: 0, 
            sembol: "Jk", 
            isim: "Joker", 
            grup: 0, 
            periyot: 0 
        },
        takim: 1,
        joker: true
    });
    
    taslar.push({
        element_id: 0,
        element: { 
            atom_no: 0, 
            sembol: "Jk", 
            isim: "Joker", 
            grup: 0, 
            periyot: 0 
        },
        takim: 2,
        joker: true
    });
    
    return taslar;
}

/**
 * Taşları karıştırır
 * @param {Array} taslar - Karıştırılacak taşlar
 */
function taslarıKaristir(taslar) {
    // Fisher-Yates (Knuth) karıştırma algoritması
    for (let i = taslar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [taslar[i], taslar[j]] = [taslar[j], taslar[i]];
    }
}

/**
 * Taşları oyunculara dağıtır
 * @param {Array} taslar - Dağıtılacak taşların listesi
 */
function taslarıDagit(taslar) {
    const oyuncuSayisi = oyunDurumu.oyuncular.length;
    
    // Her oyuncuya başlangıç taş sayısı kadar taş ver
    for (let i = 0; i < OYUN_AYARLARI.baslangic_tas_sayisi; i++) {
        for (let j = 0; j < oyuncuSayisi; j++) {
            if (taslar.length > 0) {
                const tas = taslar.pop();
                oyunDurumu.oyuncular[j].taslar.push(tas);
            }
        }
    }
    
    // Açık taş oluştur
    if (taslar.length > 0) {
        oyunDurumu.acik_taslar.push(taslar.pop());
    }
    
    // Kalan taşları ortaya koy
    oyunDurumu.ortadaki_taslar = taslar;
}

/**
 * Gösterge taşını ve okey taşını belirler
 */
function gostergeTasiBelirle() {
    if (oyunDurumu.ortadaki_taslar.length > 0) {
        // Son taşı gösterge olarak belirle
        oyunDurumu.gosterge = oyunDurumu.ortadaki_taslar.pop();
        
        // Göstergenin elemanının bir sonraki periyodik tablo elemanı okey olur
        // Aynı gruptaki bir sonraki periyot
        const gostergeElement = oyunDurumu.gosterge.element;
        
        // Okey elemanını bul
        let okeyElement;
        
        // Eğer gösterge son periyottaki element ise, ilk periyoda dön
        if (gostergeElement.periyot >= 7) {
            // Aynı gruptaki ilk periyot
            okeyElement = oyunDurumu.oyuncular.flatMap(o => o.taslar)
                .concat(oyunDurumu.ortadaki_taslar)
                .concat(oyunDurumu.acik_taslar)
                .find(t => t.element.grup === gostergeElement.grup && t.element.periyot === 1);
        } else {
            // Aynı gruptaki bir sonraki periyot
            okeyElement = oyunDurumu.oyuncular.flatMap(o => o.taslar)
                .concat(oyunDurumu.ortadaki_taslar)
                .concat(oyunDurumu.acik_taslar)
                .find(t => t.element.grup === gostergeElement.grup && t.element.periyot === gostergeElement.periyot + 1);
        }
        
        if (okeyElement) {
            oyunDurumu.okey_tasi = { 
                element_id: okeyElement.element_id,
                element: { ...okeyElement.element }
            };
        } else {
            // Eğer uygun okey bulunamazsa, joker taşını okey yap
            oyunDurumu.okey_tasi = { 
                element_id: 0,
                element: { 
                    atom_no: 0, 
                    sembol: "Jk", 
                    isim: "Joker", 
                    grup: 0, 
                    periyot: 0 
                }
            };
        }
    }
}

/**
 * Başlangıç oyuncusunu belirler
 */
function baslangicOyuncusuBelirle() {
    // Rastgele bir oyuncu seç
    oyunDurumu.siradaki_oyuncu = Math.floor(Math.random() * oyunDurumu.oyuncular.length);
}

/**
 * Ortadan taş çeker
 * @param {number} oyuncuIndex - Taş çeken oyuncunun indeksi
 * @return {Object} Çekilen taş veya false
 */
function ortadanTasCek(oyuncuIndex) {
    if (!oyunDurumu.aktif || oyunDurumu.siradaki_oyuncu !== oyuncuIndex) {
        console.error("Sıra bu oyuncuda değil!");
        return false;
    }
    
    if (oyunDurumu.ortadaki_taslar.length === 0) {
        console.error("Ortada taş kalmadı!");
        return false;
    }
    
    const tas = oyunDurumu.ortadaki_taslar.pop();
    oyunDurumu.oyuncular[oyuncuIndex].taslar.push(tas);
    
    // Ses çal
    if (typeof sesCal === 'function') {
        sesCal('tas_cek');
    }
    
    return tas;
}

/**
 * Açık taş çeker
 * @param {number} oyuncuIndex - Taş çeken oyuncunun indeksi
 * @return {Object} Çekilen taş veya false
 */
function acikTasCek(oyuncuIndex) {
    if (!oyunDurumu.aktif || oyunDurumu.siradaki_oyuncu !== oyuncuIndex) {
        console.error("Sıra bu oyuncuda değil!");
        return false;
    }
    
    if (oyunDurumu.acik_taslar.length === 0) {
        console.error("Açık taş yok!");
        return false;
    }
    
    const tas = oyunDurumu.acik_taslar.pop();
    oyunDurumu.oyuncular[oyuncuIndex].taslar.push(tas);
    
    // Ses çal
    if (typeof sesCal === 'function') {
        sesCal('tas_cek');
    }
    
    return tas;
}

/**
 * Taş atar
 * @param {number} oyuncuIndex - Taş atan oyuncunun indeksi
 * @param {number} tasIndex - Atılacak taşın indeksi
 * @return {boolean} İşlem başarılı mı
 */
function tasAt(oyuncuIndex, tasIndex) {
    if (!oyunDurumu.aktif || oyunDurumu.siradaki_oyuncu !== oyuncuIndex) {
        console.error("Sıra bu oyuncuda değil!");
        return false;
    }
    
    const oyuncu = oyunDurumu.oyuncular[oyuncuIndex];
    
    if (tasIndex < 0 || tasIndex >= oyuncu.taslar.length) {
        console.error("Geçersiz taş indeksi!");
        return false;
    }
    
    // Taşı çıkar ve açık taşlara ekle
    const tas = oyuncu.taslar.splice(tasIndex, 1)[0];
    oyunDurumu.acik_taslar.push(tas);
    
    // Sıradaki oyuncuya geç
    siradakiOyuncuyaGec();
    
    // Ses çal
    if (typeof sesCal === 'function') {
        sesCal('tas_at');
    }
    
    return true;
}

/**
 * Sıradaki oyuncuya geçer
 */
function siradakiOyuncuyaGec() {
    oyunDurumu.siradaki_oyuncu = (oyunDurumu.siradaki_oyuncu + 1) % oyunDurumu.oyuncular.length;
    oyunDurumu.tur_sayisi++;
    
    // Bildirim gönder
    console.log("Sıra: " + oyunDurumu.oyuncular[oyunDurumu.siradaki_oyuncu].isim);
}

/**
 * Oyuncunun elindeki taşları sıralar
 * @param {number} oyuncuIndex - Taşları sıralanacak oyuncunun indeksi
 * @param {string} siralama_turu - Sıralama türü ('grup', 'periyot', 'atom_no')
 */
function taslariSirala(oyuncuIndex, siralama_turu = 'grup') {
    const oyuncu = oyunDurumu.oyuncular[oyuncuIndex];
    
    switch (siralama_turu) {
        case 'grup':
            oyuncu.taslar.sort((a, b) => {
                if (a.element.grup !== b.element.grup) {
                    return a.element.grup - b.element.grup;
                }
                return a.element.periyot - b.element.periyot;
            });
            break;
        
        case 'periyot':
            oyuncu.taslar.sort((a, b) => {
                if (a.element.periyot !== b.element.periyot) {
                    return a.element.periyot - b.element.periyot;
                }
                return a.element.grup - b.element.grup;
            });
            break;
            
        case 'atom_no':
            oyuncu.taslar.sort((a, b) => a.element.atom_no - b.element.atom_no);
            break;
            
        default:
            console.error("Geçersiz sıralama türü!");
            return false;
    }
    
    return true;
}

/**
 * Per veya grup olabilecek taşları kontrol eder
 * @param {Array} taslar - Kontrol edilecek taşlar
 * @return {Object} Per ve grupların listesi
 */
function taslariKontrolEt(taslar) {
    const sonuc = {
        perler: [],
        gruplar: [],
        gecerli: false
    };
    
    // Perleri kontrol et
    const perAdaylari = perleriBul(taslar);
    sonuc.perler = perAdaylari.filter(per => per.taslar.length >= OYUN_AYARLARI.minimum_per_sayisi);
    
    // Grupları kontrol et
    const grupAdaylari = gruplariBul(taslar);
    sonuc.gruplar = grupAdaylari.filter(grup => grup.taslar.length >= OYUN_AYARLARI.minimum_grup_sayisi);
    
    // Tüm taşların bir per veya grupta olup olmadığını kontrol et
    const kullanilanTaslar = new Set();
    
    // Perleri ekle
    sonuc.perler.forEach(per => {
        per.taslar.forEach(tas => {
            kullanilanTaslar.add(tas.element.atom_no + "-" + tas.takim);
        });
    });
    
    // Grupları ekle
    sonuc.gruplar.forEach(grup => {
        grup.taslar.forEach(tas => {
            kullanilanTaslar.add(tas.element.atom_no + "-" + tas.takim);
        });
    });
    
    // Tüm taşlar kullanıldı mı?
    sonuc.gecerli = kullanilanTaslar.size === taslar.length;
    
    return sonuc;
}

/**
 * Taşlar arasındaki perleri bulur (aynı grupta ardışık periyotlar)
 * @param {Array} taslar - Kontrol edilecek taşlar
 * @return {Array} Bulunan perler
 */
function perleriBul(taslar) {
    const perler = [];
    const gruplar = {};
    
    // Taşları gruplara ayır
    taslar.forEach(tas => {
        const grupNo = tas.element.grup;
        if (!gruplar[grupNo]) {
            gruplar[grupNo] = [];
        }
        gruplar[grupNo].push(tas);
    });
    
    // Her grup için perleri bul
    Object.keys(gruplar).forEach(grupNo => {
        const grupTaslari = gruplar[grupNo];
        
        // Periyotlara göre sırala
        grupTaslari.sort((a, b) => a.element.periyot - b.element.periyot);
        
        // Ardışık periyotları bul
        let currentPer = [];
        let previousPeriyot = null;
        
        grupTaslari.forEach(tas => {
            if (previousPeriyot === null || tas.element.periyot === previousPeriyot + 1) {
                currentPer.push(tas);
            } else {
                if (currentPer.length >= OYUN_AYARLARI.minimum_per_sayisi) {
                    perler.push({
                        tip: 'per',
                        grup: parseInt(grupNo),
                        taslar: [...currentPer]
                    });
                }
                currentPer = [tas];
            }
            previousPeriyot = tas.element.periyot;
        });
        
        // Son peri ekle
        if (currentPer.length >= OYUN_AYARLARI.minimum_per_sayisi) {
            perler.push({
                tip: 'per',
                grup: parseInt(grupNo),
                taslar: [...currentPer]
            });
        }
    });
    
    return perler;
}

/**
 * Taşlar arasındaki grupları bulur (aynı periyotta farklı gruplar)
 * @param {Array} taslar - Kontrol edilecek taşlar
 * @return {Array} Bulunan gruplar
 */
function gruplariBul(taslar) {
    const gruplar = [];
    const periyotlar = {};
    
    // Taşları periyotlara ayır
    taslar.forEach(tas => {
        const periyotNo = tas.element.periyot;
        if (!periyotlar[periyotNo]) {
            periyotlar[periyotNo] = [];
        }
        periyotlar[periyotNo].push(tas);
    });
    
    // Her periyot için grupları bul
    Object.keys(periyotlar).forEach(periyotNo => {
        const periyotTaslari = periyotlar[periyotNo];
        
        // Gruplara göre sırala
        periyotTaslari.sort((a, b) => a.element.grup - b.element.grup);
        
        // Ardışık grupları bul
        let currentGrup = [];
        let previousGrup = null;
        
        periyotTaslari.forEach(tas => {
            if (previousGrup === null || tas.element.grup === previousGrup + 1) {
                currentGrup.push(tas);
            } else {
                if (currentGrup.length >= OYUN_AYARLARI.minimum_grup_sayisi) {
                    gruplar.push({
                        tip: 'grup',
                        periyot: parseInt(periyotNo),
                        taslar: [...currentGrup]
                    });
                }
                currentGrup = [tas];
            }
            previousGrup = tas.element.grup;
        });
        
        // Son grubu ekle
        if (currentGrup.length >= OYUN_AYARLARI.minimum_grup_sayisi) {
            gruplar.push({
                tip: 'grup',
                periyot: parseInt(periyotNo),
                taslar: [...currentGrup]
            });
        }
    });
    
    return gruplar;
}

/**
 * Oyuncunun elini kontrol eder, oyunu bitirip bitiremeyeceğini söyler
 * @param {number} oyuncuIndex - Kontrol edilecek oyuncunun indeksi
 * @return {boolean} Oyuncu kazanabilir mi
 */
function oyuncuKazanabilirMi(oyuncuIndex) {
    const oyuncu = oyunDurumu.oyuncular[oyuncuIndex];
    const sonuc = taslariKontrolEt(oyuncu.taslar);
    return sonuc.gecerli;
}

/**
 * Oyunu bitirir ve kazananı ilan eder
 * @param {number} kazananIndex - Kazanan oyuncunun indeksi
 */
function oyunuBitir(kazananIndex) {
    if (!oyunDurumu.aktif) {
        console.error("Oyun zaten bitmiş!");
        return false;
    }
    
    // Oyunun bittiğini işaretle
    oyunDurumu.aktif = false;
    oyunDurumu.bitis_zamani = new Date();
    
    const kazanan = oyunDurumu.oyuncular[kazananIndex];
    console.log(`Oyun bitti! Kazanan: ${kazanan.isim}`);
    
    // Puanları hesapla
    puanlariHesapla(kazananIndex);
    
    // İstatistikleri güncelle
    if (typeof istatistikleriGuncelle === 'function') {
        istatistikleriGuncelle(oyunDurumu);
    }
    
    // Kazanma sesi çal
    if (typeof sesCal === 'function') {
        sesCal('oyun_kazanildi');
    }
    
    return true;
}

/**
 * Oyun sonunda puanları hesaplar
 * @param {number} kazananIndex - Kazanan oyuncunun indeksi
 */
function puanlariHesapla(kazananIndex) {
    // Kazanan dışındaki oyuncuların elindeki taşları say
    for (let i = 0; i < oyunDurumu.oyuncular.length; i++) {
        if (i === kazananIndex) {
            // Kazanan oyuncu 100 puan alır
            oyunDurumu.oyuncular[i].puan = 100;
        } else {
            // Kaybeden oyuncular ellerindeki taş başına -5 puan alır
            oyunDurumu.oyuncular[i].puan = -5 * oyunDurumu.oyuncular[i].taslar.length;
        }
    }
}

/**
 * Oyun istatistiklerini günceller ve kaydeder
 * @param {Object} oyunDurumu - Oyun durumu verisi
 */
function istatistikleriGuncelle(oyunDurumu) {
    // Mevcut istatistikleri yükle
    let istatistikler = JSON.parse(localStorage.getItem('periyodik_okey_istatistikler') || '{}');
    
    if (!istatistikler.oyun_sayisi) {
        istatistikler = {
            oyun_sayisi: 0,
            kazanma_sayisi: 0,
            en_yuksek_puan: 0,
            toplam_sure: 0,
            en_kisa_sure: Number.MAX_SAFE_INTEGER,
            en_uzun_sure: 0
        };
    }
    
    // İstatistikleri güncelle
    istatistikler.oyun_sayisi++;
    
    // Oyunun süresini hesapla (saniye)
    const oyunSuresi = Math.floor((oyunDurumu.bitis_zamani - oyunDurumu.baslangic_zamani) / 1000);
    istatistikler.toplam_sure += oyunSuresi;
    
    if (oyunSuresi < istatistikler.en_kisa_sure) {
        istatistikler.en_kisa_sure = oyunSuresi;
    }
    
    if (oyunSuresi > istatistikler.en_uzun_sure) {
        istatistikler.en_uzun_sure = oyunSuresi;
    }
    
    // Kazanma durumunu kontrol et (eğer ilk oyuncu (kullanıcı) kazandıysa)
    if (oyunDurumu.oyuncular[0].puan === 100) {
        istatistikler.kazanma_sayisi++;
        
        // En yüksek puanı güncelle
        if (oyunDurumu.oyuncular[0].puan > istatistikler.en_yuksek_puan) {
            istatistikler.en_yuksek_puan = oyunDurumu.oyuncular[0].puan;
        }
    }
    
    // İstatistikleri kaydet
    localStorage.setItem('periyodik_okey_istatistikler', JSON.stringify(istatistikler));
    
    return istatistikler;
}

/**
 * PeriyodikOkey ana sınıfı
 * Oyunun temel yönetiminden sorumlu sınıf
 */
class PeriyodikOkey {
    /**
     * PeriyodikOkey yapıcı metodu
     * @param {Object} ayarlar - Oyun ayarları
     */
    constructor(ayarlar = {}) {
        // Ayarları ayarla
        this.ayarlar = {
            botSayisi: ayarlar.botSayisi || 3,
            zorlukSeviyesi: ayarlar.zorlukSeviyesi || 'Normal',
            sesEfektleri: ayarlar.sesEfektleri !== undefined ? ayarlar.sesEfektleri : true,
            muzik: ayarlar.muzik !== undefined ? ayarlar.muzik : true,
            baslangicKartSayisi: 14,
            minimumPerSayisi: 3,
            minimumGrupSayisi: 3
        };
        
        // Oyun değişkenleri
        this.oyuncu = {
            isim: 'Oyuncu',
            kartlar: [],
            puan: 0,
            sirada: false
        };
        
        this.botlar = [];
        this.deste = [];
        this.acikKart = null;
        this.gostergeKart = null;
        this.okeyKart = null;
        this.aktifOyuncuIndeksi = 0;
        this.oyunAktif = false;
        this.baslangicZamani = null;
        this.bitisZamani = null;
        
        // Botları oluştur
        for (let i = 0; i < this.ayarlar.botSayisi; i++) {
            this.botlar.push({
                isim: `Bot ${i + 1}`,
                kartlar: [],
                puan: 0,
                sirada: false,
                zorluk: this.ayarlar.zorlukSeviyesi
            });
        }
    }
    
    /**
     * Oyunu başlatır
     * @param {Array} elementVerileri - Element verileri listesi
     */
    oyunuBaslat(elementVerileri) {
        if (!elementVerileri || elementVerileri.length < 30) {
            console.error('Yetersiz element verisi ile oyun başlatılamaz!');
            return false;
        }
        
        // Oyun değişkenlerini sıfırla
        this.oyuncu.kartlar = [];
        this.oyuncu.puan = 0;
        this.oyuncu.sirada = false;
        
        this.botlar.forEach(bot => {
            bot.kartlar = [];
            bot.puan = 0;
            bot.sirada = false;
        });
        
        this.deste = [];
        this.acikKart = null;
        this.gostergeKart = null;
        this.okeyKart = null;
        this.aktifOyuncuIndeksi = 0;
        this.oyunAktif = true;
        this.baslangicZamani = new Date();
        this.bitisZamani = null;
        
        // Kartları oluştur
        this.desteOlustur(elementVerileri);
        
        // Kartları karıştır
        this.desteKaristir();
        
        // Kartları dağıt
        this.kartlariDagit();
        
        // Gösterge kartını ve okey kartını belirle
        this.gostergeVeOkeyKartiniBelirle();
        
        // İlk oyuncuyu seç
        this.ilkOyuncuyuSec();
        
        return true;
    }
    
    /**
     * Desteyi oluşturur
     * @param {Array} elementVerileri - Element verileri listesi
     */
    desteOlustur(elementVerileri) {
        // Her elementten iki adet kart oluştur
        for (let takim = 1; takim <= 2; takim++) {
            elementVerileri.forEach(element => {
                // Joker kartları atla
                if (element.joker) return;
                
                this.deste.push(new ElementKarti(element, takim));
            });
        }
        
        // İki adet joker kart ekle
        const jokerElement = {
            atom_no: 0,
            sembol: "J",
            isim: "Joker",
            grup: 0,
            periyot: 0,
            element_turu: "Joker"
        };
        
        this.deste.push(new ElementKarti(jokerElement, 1, true));
        this.deste.push(new ElementKarti(jokerElement, 2, true));
    }
    
    /**
     * Desteyi karıştırır
     */
    desteKaristir() {
        // Fisher-Yates algoritması
        for (let i = this.deste.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deste[i], this.deste[j]] = [this.deste[j], this.deste[i]];
        }
    }
    
    /**
     * Kartları oyunculara dağıtır
     */
    kartlariDagit() {
        // Tüm oyunculara başlangıç kartlarını dağıt
        for (let i = 0; i < this.ayarlar.baslangicKartSayisi; i++) {
            // Önce oyuncuya ver
            if (this.deste.length > 0) {
                this.oyuncu.kartlar.push(this.deste.pop());
            }
            
            // Sonra botlara ver
            for (let j = 0; j < this.botlar.length; j++) {
                if (this.deste.length > 0) {
                    this.botlar[j].kartlar.push(this.deste.pop());
                }
            }
        }
        
        // Oyuncuya fazladan bir kart ver
        if (this.deste.length > 0) {
            this.oyuncu.kartlar.push(this.deste.pop());
        }
        
        // Açık kartı belirle
        if (this.deste.length > 0) {
            this.acikKart = this.deste.pop();
        }
    }
    
    /**
     * Gösterge ve okey kartını belirler
     */
    gostergeVeOkeyKartiniBelirle() {
        // Destedeki son kartı gösterge olarak belirle
        if (this.deste.length > 0) {
            this.gostergeKart = this.deste[this.deste.length - 1];
            
            // Gösterge kartının elementinin bir sonraki grup veya periyottaki element okey olur
            const gostergeElementGrup = this.gostergeKart.element.grup;
            const gostergeElementPeriyot = this.gostergeKart.element.periyot;
            
            // Tüm destede okey olabilecek kartları ara
            const okeyAdaylari = this.deste.filter(kart => {
                // Gösterge kartının grubundan bir sonraki periyot
                return (kart.element.grup === gostergeElementGrup && 
                        kart.element.periyot === gostergeElementPeriyot + 1) ||
                       // Veya aynı periyotta bir sonraki grup
                       (kart.element.periyot === gostergeElementPeriyot && 
                        kart.element.grup === gostergeElementGrup + 1);
            });
            
            // Eğer aday bulunduysa, ilkini okey olarak belirle
            if (okeyAdaylari.length > 0) {
                this.okeyKart = okeyAdaylari[0];
            } else {
                // Aday bulunamadıysa, joker kartı okey yap
                this.okeyKart = this.deste.find(kart => kart.joker) || null;
            }
        }
    }
    
    /**
     * İlk oyuncuyu seçer
     */
    ilkOyuncuyuSec() {
        // İlk sırayı oyuncuya ver
        this.aktifOyuncuIndeksi = 0;
        this.oyuncu.sirada = true;
        
        // Bot sıralarını temizle
        this.botlar.forEach(bot => {
            bot.sirada = false;
        });
    }
    
    /**
     * Sıradaki oyuncuya geçer
     */
    siradakiOyuncuyaGec() {
        // Aktif oyuncunun sırasını kaldır
        if (this.aktifOyuncuIndeksi === 0) {
            this.oyuncu.sirada = false;
        } else {
            this.botlar[this.aktifOyuncuIndeksi - 1].sirada = false;
        }
        
        // Sıradaki oyuncuya geç
        this.aktifOyuncuIndeksi = (this.aktifOyuncuIndeksi + 1) % (this.botlar.length + 1);
        
        // Yeni aktif oyuncuyu belirle
        if (this.aktifOyuncuIndeksi === 0) {
            this.oyuncu.sirada = true;
        } else {
            this.botlar[this.aktifOyuncuIndeksi - 1].sirada = true;
        }
    }
    
    /**
     * Desteden kart çeker
     * @return {ElementKarti} Çekilen kart
     */
    destedenKartCek() {
        if (!this.oyunAktif) return null;
        
        if (this.aktifOyuncuIndeksi === 0 && !this.oyuncu.sirada) {
            console.error('Oyuncunun sırası değil!');
            return null;
        }
        
        if (this.deste.length === 0) {
            console.error('Destede kart kalmadı!');
            return null;
        }
        
        const kart = this.deste.pop();
        
        if (this.aktifOyuncuIndeksi === 0) {
            this.oyuncu.kartlar.push(kart);
        } else {
            this.botlar[this.aktifOyuncuIndeksi - 1].kartlar.push(kart);
        }
        
        return kart;
    }
    
    /**
     * Açık kartı alır
     * @return {ElementKarti} Alınan açık kart
     */
    acikKartiAl() {
        if (!this.oyunAktif) return null;
        
        if (this.aktifOyuncuIndeksi === 0 && !this.oyuncu.sirada) {
            console.error('Oyuncunun sırası değil!');
            return null;
        }
        
        if (!this.acikKart) {
            console.error('Açık kart yok!');
            return null;
        }
        
        const kart = this.acikKart;
        this.acikKart = null;
        
        if (this.aktifOyuncuIndeksi === 0) {
            this.oyuncu.kartlar.push(kart);
        } else {
            this.botlar[this.aktifOyuncuIndeksi - 1].kartlar.push(kart);
        }
        
        return kart;
    }
    
    /**
     * Kart seçer ve açık kart olarak atar
     * @param {number} kartIndeks - Seçilen kartın indeksi
     * @return {ElementKarti} Atılan kart
     */
    kartSec(kartIndeks) {
        if (!this.oyunAktif) return null;
        
        let kart = null;
        
        if (this.aktifOyuncuIndeksi === 0) {
            if (kartIndeks < 0 || kartIndeks >= this.oyuncu.kartlar.length) {
                console.error('Geçersiz kart indeksi!');
                return null;
            }
            
            kart = this.oyuncu.kartlar.splice(kartIndeks, 1)[0];
        } else {
            const bot = this.botlar[this.aktifOyuncuIndeksi - 1];
            if (kartIndeks < 0 || kartIndeks >= bot.kartlar.length) {
                console.error('Geçersiz kart indeksi!');
                return null;
            }
            
            kart = bot.kartlar.splice(kartIndeks, 1)[0];
        }
        
        this.acikKart = kart;
        this.siradakiOyuncuyaGec();
        
        return kart;
    }
    
    /**
     * Tüm kartları kontrol eder ve geçerli kombinasyonları bulur
     * @returns {Object} Kombinasyon sonucu (başarılı/başarısız ve mesaj)
     */
    tumKartlariKontrolEt() {
        // Oyuncu sırası değilse işlem yapma
        if (this.aktifOyuncu !== 0) {
            return { basarili: false, mesaj: "Sıra sizde değil!" };
        }
        
        // Mevcut oyuncu kartlarını kopyala
        const mevcutKartlar = [...this.oyuncuKartlari];
        
        // Tüm olası kombinasyonları bul
        const kombinasyonlar = this.kombinasyonlariKontrolEt(mevcutKartlar);
        
        // Bulunan kombinasyonların toplam kart sayısı
        let bulunanKartSayisi = 0;
        
        if (kombinasyonlar.gruplananKartlar && kombinasyonlar.gruplananKartlar.length > 0) {
            kombinasyonlar.gruplananKartlar.forEach(grup => {
                bulunanKartSayisi += grup.length;
            });
        }
        
        if (kombinasyonlar.seriKartlar && kombinasyonlar.seriKartlar.length > 0) {
            kombinasyonlar.seriKartlar.forEach(seri => {
                bulunanKartSayisi += seri.length;
            });
        }
        
        // Hiç kombinasyon bulunmadıysa
        if (bulunanKartSayisi === 0) {
            return { basarili: false, mesaj: "Geçerli bir kombinasyon bulunamadı." };
        }
        
        // Kalan kart sayısı (tüm kart sayısı - bulunan kombinasyonlardaki kart sayısı)
        const kalanKartSayisi = mevcutKartlar.length - bulunanKartSayisi;
        
        // Eğer tüm kartlar gruplanamamışsa ve geriye kalan kartlar varsa
        if (kalanKartSayisi > 0) {
            return { basarili: false, mesaj: `${kalanKartSayisi} kart kombinasyonlara dahil edilemedi.` };
        }
        
        // Tüm kartlar başarıyla gruplandıysa, oyuncu kartlarını güncelle
        this.oyuncuKartlari = [];
        
        // Puan hesapla
        const puan = this.puanHesapla(kombinasyonlar);
        
        // Oyuncuya puan ekle
        this.oyuncuPuani += puan;
        
        // Oyun bitişini kontrol et
        if (this.oyuncuPuani >= 3) {
            this.oyunuBitir(0); // Oyuncu kazandı
        }
        
        return { 
            basarili: true, 
            mesaj: `${bulunanKartSayisi} kart gruplandı. +${puan} yıldız kazandınız!` 
        };
    }
    
    /**
     * Kartlar arasındaki kombinasyonları kontrol eder
     * @param {Array} kartlar Kontrol edilecek kartlar
     * @returns {Object} Bulunan grup ve seri kombinasyonları
     */
    kombinasyonlariKontrolEt(kartlar) {
        const gruplananKartlar = [];
        const seriKartlar = [];
        
        // Kartları kopyala
        let kopyaKartlar = [...kartlar];
        
        // Periyot bazlı gruplama
        const periyotGruplari = {};
        kopyaKartlar.forEach(kart => {
            if (kart.isJoker) return; // Jokerleri sonra ekleyeceğiz
            
            const periyot = kart.periyot;
            if (!periyotGruplari[periyot]) {
                periyotGruplari[periyot] = [];
            }
            periyotGruplari[periyot].push(kart);
        });
        
        // Her periyotta en az 3 farklı element olan grupları bul
        Object.keys(periyotGruplari).forEach(periyot => {
            const periyotKartlari = periyotGruplari[periyot];
            
            // Periyotta en az 3 kart varsa
            if (periyotKartlari.length >= 3) {
                // Sadece farklı elementleri al (her sembolden bir tane)
                const farkliElementler = [];
                const semboller = new Set();
                
                periyotKartlari.forEach(kart => {
                    if (!semboller.has(kart.sembol)) {
                        semboller.add(kart.sembol);
                        farkliElementler.push(kart);
                    }
                });
                
                // En az 3 farklı element varsa
                if (farkliElementler.length >= 3) {
                    // Tüm olası kombinasyonları bul (en az 3 kart)
                    for (let i = 3; i <= farkliElementler.length; i++) {
                        // i boyutundaki tüm kombinasyonları bul
                        const kombinasyonlar = this.kombinasyonUret(farkliElementler, i);
                        
                        kombinasyonlar.forEach(kombinasyon => {
                            gruplananKartlar.push(kombinasyon);
                        });
                    }
                }
            }
        });
        
        // Grup bazlı gruplama (ardışık elementler)
        const grupGruplari = {};
        kopyaKartlar.forEach(kart => {
            if (kart.isJoker) return; // Jokerleri sonra ekleyeceğiz
            
            const grup = kart.grup;
            if (!grupGruplari[grup]) {
                grupGruplari[grup] = [];
            }
            grupGruplari[grup].push(kart);
        });
        
        // Her gruptaki ardışık elementleri bul
        Object.keys(grupGruplari).forEach(grup => {
            const grupKartlari = grupGruplari[grup];
            
            // Grupta en az 3 kart varsa
            if (grupKartlari.length >= 3) {
                // Atom numarasına göre sırala
                grupKartlari.sort((a, b) => a.atom_no - b.atom_no);
                
                // Ardışık elementleri bul
                let ardisikSeri = [grupKartlari[0]];
                
                for (let i = 1; i < grupKartlari.length; i++) {
                    const oncekiKart = grupKartlari[i-1];
                    const suankiKart = grupKartlari[i];
                    
                    // Atom numarası ardışık mı?
                    if (suankiKart.atom_no === oncekiKart.atom_no + 1) {
                        ardisikSeri.push(suankiKart);
                    } else {
                        // Ardışık değilse ve mevcut seri en az 3 kart içeriyorsa, seriyi kaydet
                        if (ardisikSeri.length >= 3) {
                            seriKartlar.push([...ardisikSeri]);
                        }
                        // Yeni seri başlat
                        ardisikSeri = [suankiKart];
                    }
                }
                
                // Son seriyi kontrol et
                if (ardisikSeri.length >= 3) {
                    seriKartlar.push(ardisikSeri);
                }
            }
        });
        
        return {
            gruplananKartlar,
            seriKartlar
        };
    }
    
    /**
     * Verilen dizi içinden belirli boyutta tüm olası kombinasyonları üretir
     * @param {Array} dizi Kombinasyonları oluşturulacak dizi
     * @param {Number} boyut Her kombinasyonun boyutu
     * @returns {Array} Tüm olası kombinasyonlar
     */
    kombinasyonUret(dizi, boyut) {
        const sonuc = [];
        
        // Recursive yardımcı fonksiyon
        function kombinasyonYardimci(temp, baslangic, kalan) {
            if (kalan === 0) {
                sonuc.push([...temp]);
                return;
            }
            
            for (let i = baslangic; i <= dizi.length - kalan; i++) {
                temp.push(dizi[i]);
                kombinasyonYardimci(temp, i + 1, kalan - 1);
                temp.pop();
            }
        }
        
        kombinasyonYardimci([], 0, boyut);
        return sonuc;
    }
    
    /**
     * Puanları hesaplar
     * @param {Object} kombinasyonSonucu - Kombinasyon sonuç nesnesi
     * @return {number} Toplam puan
     */
    puanHesapla(kombinasyonSonucu) {
        let toplamPuan = 0;
        
        // Her per için 10 puan
        toplamPuan += kombinasyonSonucu.perler.length * 10;
        
        // Her grup için 5 puan
        toplamPuan += kombinasyonSonucu.gruplar.length * 5;
        
        // Son kart joker ise puanı 2 katına çıkar
        const tumKartlar = [
            ...kombinasyonSonucu.perler.flatMap(per => per.kartlar),
            ...kombinasyonSonucu.gruplar.flatMap(grup => grup.kartlar)
        ];
        
        const sonKartJokerMi = tumKartlar.length > 0 && 
                              tumKartlar[tumKartlar.length - 1].joker;
        
        if (sonKartJokerMi) {
            toplamPuan *= 2;
        }
        
        return toplamPuan;
    }
    
    /**
     * Oyunu bitirir
     * @param {number} kazananIndeks - Kazanan oyuncu indeksi
     */
    oyunuBitir(kazananIndeks = 0) {
        if (!this.oyunAktif) return;
        
        this.oyunAktif = false;
        this.bitisZamani = new Date();
        
        // Kazananı belirle ve puanları hesapla
        if (kazananIndeks === 0) {
            // Oyuncu kazandı
            this.oyuncu.puan = 100;
            
            // Botlar için puan hesapla
            this.botlar.forEach(bot => {
                bot.puan = -5 * bot.kartlar.length;
            });
        } else {
            // Bot kazandı
            this.botlar[kazananIndeks - 1].puan = 100;
            
            // Diğer oyuncular için puan hesapla
            this.oyuncu.puan = -5 * this.oyuncu.kartlar.length;
            
            this.botlar.forEach((bot, indeks) => {
                if (indeks !== kazananIndeks - 1) {
                    bot.puan = -5 * bot.kartlar.length;
                }
            });
        }
        
        // İstatistikleri güncelle
        const oyunDurumu = {
            oyuncular: [
                { ...this.oyuncu },
                ...this.botlar
            ],
            baslangic_zamani: this.baslangicZamani,
            bitis_zamani: this.bitisZamani
        };
        
        istatistikleriGuncelle(oyunDurumu);
    }
}

// PeriyodikOkey sınıfını global olarak erişilebilir yap
window.PeriyodikOkey = PeriyodikOkey;
window.istatistikleriGuncelle = istatistikleriGuncelle; 