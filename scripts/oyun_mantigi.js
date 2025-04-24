/**
 * Periyodik Okey - Oyun Mantığı
 * Oyun akışı ve kurallarını yöneten ana sınıf
 */

// ElementKartiSinifi sınıfını içe aktar (import)
const { ElementKartiSinifi } = typeof require !== 'undefined' ? require('./element_karti.js') : {};

/**
 * Oyun sınıfı
 */
class PeriyodikOkey {
    /**
     * Oyun yapıcı metodu
     * @param {Object} ayarlar Oyun ayarları
     */
    constructor(ayarlar = {}) {
        // Oyun ayarları
        this.botSayisi = ayarlar.botSayisi || 3;
        this.zorlikSeviyesi = ayarlar.zorlikSeviyesi || 'Normal';
        
        // Oyun durumu
        this.durumlar = {
            BEKLEME: 'bekleme',
            BASLATMA: 'baslatma',
            KART_SECME: 'kart_secme',
            KOMBINASYON_KONTROL: 'kombinasyon_kontrol',
            BOT_HAMLE: 'bot_hamle',
            OYUN_SONU: 'oyun_sonu',
            KART_ATMA: 'kart_atma'
        };
        
        this.mevcutDurum = this.durumlar.BEKLEME;
        
        // Oyun bileşenleri
        this.kartlar = [];
        this.jokerler = [];
        this.deste = [];
        this.acikKart = null;
        
        // Oyuncular
        this.oyuncu = {
            kartlar: [],
            kombinasyonlar: [],
            puan: 0,
            sirada: false
        };
        
        this.botlar = [];
        for (let i = 0; i < this.botSayisi; i++) {
            this.botlar.push({
                id: i + 1,
                kartlar: [],
                kombinasyonlar: [],
                puan: 0,
                sirada: false
            });
        }
        
        // Oyun değişkenleri
        this.aktifOyuncuIndeksi = 0;
        this.oyunculariKarıştır();
    }
    
    /**
     * Oyun başlatma metodu
     * @param {Array} elementVerileri Element verileri
     */
    oyunuBaslat(elementVerileri) {
        // Tüm kartları oluştur
        this.kartlariOlustur(elementVerileri);
        
        // Kartları karıştır
        this.kartlariKaristir();
        
        // Blokları oluştur ve dağıt
        this.bloklariOlusturVeDagit();
        
        // İlk açık kartı belirle
        this.acikKart = this.deste.pop();
        
        // İlk oyuncuyu belirle
        this.mevcutDurum = this.durumlar.KART_SECME;
        this.siradakiOyuncu();
    }
    
    /**
     * Element kartlarını oluşturur
     * @param {Array} elementVerileri Element verileri
     */
    kartlariOlustur(elementVerileri) {
        // Elementleri kartlara dönüştür
        elementVerileri.forEach(element => {
            const kart = new ElementKartiSinifi(element);
            this.kartlar.push(kart);
        });
        
        // Joker kartları ekle
        this.jokerler.push(new ElementKartiSinifi({
            id: 119,
            sembol: "SE1",
            isim: "Süper Element 1",
            grupTuru: "Joker",
            joker: true
        }));
        
        this.jokerler.push(new ElementKartiSinifi({
            id: 120,
            sembol: "SE2",
            isim: "Süper Element 2",
            grupTuru: "Joker",
            joker: true
        }));
        
        // Tüm kartları birleştir
        this.deste = [...this.kartlar, ...this.jokerler];
    }
    
    /**
     * Kartları karıştırır
     */
    kartlariKaristir() {
        // Fisher-Yates karıştırma algoritması
        for (let i = this.deste.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deste[i], this.deste[j]] = [this.deste[j], this.deste[i]];
        }
    }
    
    /**
     * Oyuncuları rastgele sıralar
     */
    oyunculariKarıştır() {
        // Oyuncuları temsil eden dizin
        const oyuncular = [0]; // Ana oyuncu her zaman 0. indeks
        for (let i = 1; i <= this.botSayisi; i++) {
            oyuncular.push(i);
        }
        
        // Oyuncuları karıştır (ana oyuncu hariç)
        for (let i = oyuncular.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i) + 1; // 1'den başla (ana oyuncuyu karıştırma)
            [oyuncular[i], oyuncular[j]] = [oyuncular[j], oyuncular[i]];
        }
        
        this.oyuncuSirasi = oyuncular;
        this.aktifOyuncuIndeksi = 0;
    }
    
    /**
     * Blokları oluşturur ve kartları dağıtır
     */
    bloklariOlusturVeDagit() {
        // Bloklar (14'er kart)
        const bloklar = [];
        const blokSayisi = 9; // 14*8 + kalan kartlar için (destede 120+ kart var)
        
        for (let i = 0; i < blokSayisi; i++) {
            const blok = [];
            for (let j = 0; j < 14; j++) {
                if (this.deste.length > 0) {
                    blok.push(this.deste.pop());
                }
            }
            bloklar.push(blok);
        }
        
        // Zar at (1-6 arası rastgele sayı)
        const zar = Math.floor(Math.random() * 6) + 1;
        
        // İlk blok ilk oyuncuya (insan oyuncuya)
        const ilkBlokIndeks = zar - 1;
        
        // İlk bloğu ilk oyuncuya ver
        this.oyuncu.kartlar.push(...bloklar[ilkBlokIndeks]);
        bloklar.splice(ilkBlokIndeks, 1);
        
        // Fazladan kalan kartı ilk oyuncuya ver (toplam 15 kart)
        if (this.deste.length > 0) {
            this.oyuncu.kartlar.push(this.deste.pop());
        }
        
        // Botlara 14'er kart dağıt
        for (let i = 0; i < this.botlar.length; i++) {
            if (i < bloklar.length) {
                this.botlar[i].kartlar.push(...bloklar[i]);
            }
        }
        
        // Kalan blokları desteye ekle
        for (let i = this.botlar.length; i < bloklar.length; i++) {
            this.deste.push(...bloklar[i]);
        }
    }
    
    /**
     * Sıradaki oyuncuyu belirler
     */
    siradakiOyuncu() {
        // Önceki oyuncunun sırasını kapat
        if (this.aktifOyuncuIndeksi === 0) {
            this.oyuncu.sirada = false;
        } else {
            this.botlar[this.aktifOyuncuIndeksi - 1].sirada = false;
        }
        
        // Sıradaki oyuncu indeksini güncelle
        this.aktifOyuncuIndeksi = (this.aktifOyuncuIndeksi + 1) % (this.botSayisi + 1);
        
        // Yeni aktif oyuncuyu belirle
        if (this.aktifOyuncuIndeksi === 0) {
            this.oyuncu.sirada = true;
            this.mevcutDurum = this.durumlar.KART_SECME;
        } else {
            this.botlar[this.aktifOyuncuIndeksi - 1].sirada = true;
            this.mevcutDurum = this.durumlar.BOT_HAMLE;
            this.botHamlesiYap();
        }
        
        // Durum mesajını güncelle
        if (typeof document !== 'undefined') {
            const durumMesaji = document.getElementById('durum-mesaji');
            if (durumMesaji) {
                if (this.aktifOyuncuIndeksi === 0) {
                    durumMesaji.textContent = 'Sizin sıranız. Desteden veya önceki oyuncudan bir kart çekin.';
                } else {
                    durumMesaji.textContent = `Bot ${this.aktifOyuncuIndeksi} sırası. Düşünüyor...`;
                }
            }
        }
    }
    
    /**
     * Açık kartı alma işlemi
     */
    acikKartiAl() {
        if (!this.oyuncu.sirada || this.mevcutDurum !== this.durumlar.KART_SECME) {
            return false;
        }
        
        // Açık kart yoksa işlem yapma
        if (!this.acikKart) {
            if (typeof document !== 'undefined') {
                const durumMesaji = document.getElementById('durum-mesaji');
                if (durumMesaji) {
                    durumMesaji.textContent = 'Önceki oyuncudan alınacak kart yok! Desteden çekin.';
                }
            }
            return false;
        }
        
        // Açık kartı oyuncuya ver
        this.oyuncu.kartlar.push(this.acikKart);
        this.acikKart = null;
        
        // Durum mesajını güncelle
        if (typeof document !== 'undefined') {
            const durumMesaji = document.getElementById('durum-mesaji');
            if (durumMesaji) {
                durumMesaji.textContent = 'Kart aldınız. Şimdi bir kart atın.';
            }
        }
        
        // Mekanizmayı kart atma durumuna geçir
        this.mevcutDurum = this.durumlar.KART_ATMA;
        
        return true;
    }
    
    /**
     * Ortadan kart çekme işlemi
     */
    ortadanKartCek() {
        if (!this.oyuncu.sirada || this.mevcutDurum !== this.durumlar.KART_SECME) {
            return false;
        }
        
        // Deste boşsa, açık kartlar (kullanılmış kartlar) karıştırılır
        if (this.deste.length === 0) {
            if (typeof document !== 'undefined') {
                const durumMesaji = document.getElementById('durum-mesaji');
                if (durumMesaji) {
                    durumMesaji.textContent = 'Ortada kart kalmadı!';
                }
            }
            return false;
        }
        
        // Desteden bir kart çek
        const yeniKart = this.deste.pop();
        
        // Kartı oyuncuya ver
        this.oyuncu.kartlar.push(yeniKart);
        
        // Durum mesajını güncelle
        if (typeof document !== 'undefined') {
            const durumMesaji = document.getElementById('durum-mesaji');
            if (durumMesaji) {
                durumMesaji.textContent = 'Ortadan kart çektiniz. Şimdi bir kart atın.';
            }
        }
        
        // Mekanizmayı kart atma durumuna geçir
        this.mevcutDurum = this.durumlar.KART_ATMA;
        
        return true;
    }
    
    /**
     * Desteden kart çekme işlemi
     */
    destedenKartCek() {
        if (!this.oyuncu.sirada || this.mevcutDurum !== this.durumlar.KART_SECME) {
            return false;
        }
        
        // Deste boşsa, açık kartlar (kullanılmış kartlar) karıştırılır
        if (this.deste.length === 0) {
            if (typeof document !== 'undefined') {
                const durumMesaji = document.getElementById('durum-mesaji');
                if (durumMesaji) {
                    durumMesaji.textContent = 'Destede kart kalmadı!';
                }
            }
            return false;
        }
        
        // Desteden bir kart çek
        const yeniKart = this.deste.pop();
        
        // Kartı oyuncuya ver
        this.oyuncu.kartlar.push(yeniKart);
        
        // Durum mesajını güncelle
        if (typeof document !== 'undefined') {
            const durumMesaji = document.getElementById('durum-mesaji');
            if (durumMesaji) {
                durumMesaji.textContent = 'Desteden kart çektiniz. Şimdi bir kart atın.';
            }
        }
        
        // Mekanizmayı kart atma durumuna geçir
        this.mevcutDurum = this.durumlar.KART_ATMA;
        
        return true;
    }
    
    /**
     * Oyuncunun kart seçmesi/atması
     * @param {number} kartIndeks Seçilen kartın indeksi
     */
    kartSec(kartIndeks) {
        // Kart seçme ve atma durumunu kontrol et
        if (!this.oyuncu.sirada) {
            return false;
        }
        
        if (this.mevcutDurum === this.durumlar.KART_ATMA) {
            // Kart atma işlemi
            if (kartIndeks < 0 || kartIndeks >= this.oyuncu.kartlar.length) {
                return false;
            }
            
            // Seçilen kartı al
            const secilenKart = this.oyuncu.kartlar.splice(kartIndeks, 1)[0];
            
            // Kartı açık kart olarak belirle
            this.acikKart = secilenKart;
            
            // Kazanma durumunu kontrol et
            if (this.oyuncuEliniKontrolEt()) {
                // Oyun bitti, oyuncu kazandı
                this.mevcutDurum = this.durumlar.OYUN_SONU;
                
                if (typeof document !== 'undefined') {
                    const durumMesaji = document.getElementById('durum-mesaji');
                    if (durumMesaji) {
                        durumMesaji.textContent = 'Tebrikler! Oyunu kazandınız!';
                    }
                }
                
                return true;
            }
            
            // Durum mesajını güncelle
            if (typeof document !== 'undefined') {
                const durumMesaji = document.getElementById('durum-mesaji');
                if (durumMesaji) {
                    durumMesaji.textContent = 'Kart attınız. Sıra diğer oyuncuya geçti.';
                }
            }
            
            // Sıradaki oyuncuya geç
            this.siradakiOyuncu();
            
            return true;
        } else if (this.mevcutDurum === this.durumlar.KART_SECME) {
            // Kart seçme durumundayken kartlara tıklamak onları vurgulamak içindir
            // Desteden çekme veya açık kartı alma için ayrı butonlar kullanılmalı
            return false;
        }
        
        return false;
    }
    
    /**
     * Oyuncu elini kontrol eder ve kazanıp kazanamadığını belirler
     * @returns {boolean} Oyuncu kazandı mı
     */
    oyuncuEliniKontrolEt() {
        const kartlar = this.oyuncu.kartlar;
        
        // Sadece 1 kart kaldıysa ve diğer kartlar belirli gruplara ayrılabiliyorsa kazanır
        if (kartlar.length === 1) {
            return true;
        }
        
        // Grup ve periyotları kontrol et
        const gruplar = {};
        const periyotlar = {};
        let jokerSayisi = 0;
        
        // Kartları sınıflandır
        kartlar.forEach(kart => {
            if (kart.joker) {
                jokerSayisi++;
                return;
            }
            
            const grup = kart.element.grup;
            const periyot = kart.element.periyot;
            
            if (!gruplar[grup]) gruplar[grup] = [];
            if (!periyotlar[periyot]) periyotlar[periyot] = [];
            
            gruplar[grup].push(kart);
            periyotlar[periyot].push(kart);
        });
        
        // Bot tüm kartları grupladıysa ve bir kart kaldıysa kazanır
        const toplamGecerliKart = Object.values(gruplar)
            .filter(grup => grup.length >= 3)
            .reduce((toplam, grup) => toplam + grup.length, 0);
        
        const toplamGecerliKartPeriyot = Object.values(periyotlar)
            .filter(periyot => periyot.length >= 4)
            .reduce((toplam, periyot) => toplam + periyot.length, 0);
        
        // Tüm kartlar gruplanmışsa ve bir kart kaldıysa kazanır
        return (toplamGecerliKart + jokerSayisi >= kartlar.length - 1) || 
               (toplamGecerliKartPeriyot + jokerSayisi >= kartlar.length - 1);
    }
    
    /**
     * Kombinasyonları kontrol etme
     * @param {Array} kartlar Kontrol edilecek kartlar
     * @returns {Object} Geçerli kombinasyonlar
     */
    kombinasyonlariKontrolEt(kartlar = this.oyuncu.kartlar) {
        // Kart sayısı kontrol
        if (kartlar.length === 0) {
            return { gecerli: false, gruplar: [], periyotlar: [] };
        }
        
        // Gruplama işlemi
        const gecerliGruplar = this.gruplariKontrolEt(kartlar);
        const gecerliPeriyotlar = this.periyotlariKontrolEt(kartlar);
        
        return {
            gecerli: gecerliGruplar.length > 0 || gecerliPeriyotlar.length > 0,
            gruplar: gecerliGruplar,
            periyotlar: gecerliPeriyotlar
        };
    }
    
    /**
     * Grupları kontrol etme
     * @param {Array} kartlar Kontrol edilecek kartlar
     * @returns {Array} Geçerli grup kombinasyonları
     */
    gruplariKontrolEt(kartlar) {
        const gruplar = {};
        const jokerler = kartlar.filter(kart => kart.joker);
        const normalKartlar = kartlar.filter(kart => !kart.joker);
        
        // Kartları gruplara ayır
        normalKartlar.forEach(kart => {
            const grupKey = kart.grupNumarasi;
            if (!gruplar[grupKey]) {
                gruplar[grupKey] = [];
            }
            gruplar[grupKey].push(kart);
        });
        
        // Geçerli grupları kontrol et (en az 3 kart olmalı)
        const gecerliGruplar = [];
        
        for (const grupKey in gruplar) {
            const grup = gruplar[grupKey];
            
            if (grup.length >= 3) {
                // Grup geçerli
                gecerliGruplar.push(grup);
            } else if (grup.length + jokerler.length >= 3) {
                // Joker ile tamamlanabilir
                const gerekliJokerSayisi = 3 - grup.length;
                const kullanilanJokerler = jokerler.slice(0, gerekliJokerSayisi);
                
                // Jokerleri kullan
                gecerliGruplar.push([...grup, ...kullanilanJokerler]);
                
                // Kullanılan jokerleri çıkar
                jokerler.splice(0, gerekliJokerSayisi);
            }
        }
        
        return gecerliGruplar;
    }
    
    /**
     * Periyotları kontrol etme
     * @param {Array} kartlar Kontrol edilecek kartlar
     * @returns {Array} Geçerli periyot kombinasyonları
     */
    periyotlariKontrolEt(kartlar) {
        const periyotlar = {};
        const jokerler = kartlar.filter(kart => kart.joker);
        const normalKartlar = kartlar.filter(kart => !kart.joker);
        
        // Kartları periyotlara ayır
        normalKartlar.forEach(kart => {
            const periyotKey = kart.periyotNumarasi;
            if (!periyotlar[periyotKey]) {
                periyotlar[periyotKey] = [];
            }
            periyotlar[periyotKey].push(kart);
        });
        
        // Geçerli periyotları kontrol et (en az 4 kart olmalı)
        const gecerliPeriyotlar = [];
        
        for (const periyotKey in periyotlar) {
            const periyot = periyotlar[periyotKey];
            
            if (periyot.length >= 4) {
                // Periyot geçerli
                gecerliPeriyotlar.push(periyot);
            } else if (periyot.length + jokerler.length >= 4) {
                // Joker ile tamamlanabilir
                const gerekliJokerSayisi = 4 - periyot.length;
                const kullanilanJokerler = jokerler.slice(0, gerekliJokerSayisi);
                
                // Jokerleri kullan
                gecerliPeriyotlar.push([...periyot, ...kullanilanJokerler]);
                
                // Kullanılan jokerleri çıkar
                jokerler.splice(0, gerekliJokerSayisi);
            }
        }
        
        return gecerliPeriyotlar;
    }
    
    /**
     * Bot hamlesi yapma
     */
    botHamlesiYap() {
        // Aktif bot
        const bot = this.botlar[this.aktifOyuncuIndeksi - 1];
        const botNo = this.aktifOyuncuIndeksi;
        
        // Botun düşünme süresi (zorluk seviyesine göre değişir)
        let dusunmeSuresi = 2000; // Normal zorluk
        
        if (this.zorlikSeviyesi === 'Kolay') {
            dusunmeSuresi = 1000;
        } else if (this.zorlikSeviyesi === 'Zor') {
            dusunmeSuresi = 3000;
        }
        
        // Durum mesajını güncelle
        if (typeof document !== 'undefined') {
            const durumMesaji = document.getElementById('durum-mesaji');
            if (durumMesaji) {
                durumMesaji.textContent = `Bot ${botNo} düşünüyor...`;
            }
        }
        
        setTimeout(() => {
            // Önceki oyuncudan kart alma veya desteden kart çekme kararı
            const oncekiOyuncuIndeks = (this.aktifOyuncuIndeksi - 1 + (this.botSayisi + 1)) % (this.botSayisi + 1);
            let oncekiOyuncudanKartAl = Math.random() > 0.3; // %70 ihtimalle önceki oyuncudan kart al
            
            // Kartın gruplara ve periyotlara göre değerlendirilmesi
            const kartDegerlendirmesi = this.botKartlariDegerlendir(bot.kartlar);
            
            // Açık kart varsa ve işe yarar bir kartsa öncelikle onu al
            if (this.acikKart && this.botKartYararlimi(this.acikKart, bot.kartlar)) {
                oncekiOyuncudanKartAl = true;
            }
            
            if (oncekiOyuncudanKartAl && this.acikKart) {
                // Önceki oyuncunun attığı kartı al
                bot.kartlar.push(this.acikKart);
                this.acikKart = null;
                
                if (typeof document !== 'undefined') {
                    const durumMesaji = document.getElementById('durum-mesaji');
                    if (durumMesaji) {
                        durumMesaji.textContent = `Bot ${botNo} önceki oyuncunun kartını aldı.`;
                    }
                }
            } else {
                // Ortadan kart çek
                if (this.deste.length > 0) {
                    const yeniKart = this.deste.pop();
                    bot.kartlar.push(yeniKart);
                    
                    if (typeof document !== 'undefined') {
                        const durumMesaji = document.getElementById('durum-mesaji');
                        if (durumMesaji) {
                            durumMesaji.textContent = `Bot ${botNo} ortadan kart çekti.`;
                        }
                    }
                }
            }
            
            // Hangi kartı atacağına karar ver
            let atilacakKartIndeks = this.botEnKotuyuBul(bot.kartlar);
            
            // Kartı at
            if (atilacakKartIndeks >= 0) {
                const atilacakKart = bot.kartlar.splice(atilacakKartIndeks, 1)[0];
                this.acikKart = atilacakKart;
                
                if (typeof document !== 'undefined') {
                    const durumMesaji = document.getElementById('durum-mesaji');
                    if (durumMesaji) {
                        durumMesaji.textContent = `Bot ${botNo} bir kart attı.`;
                    }
                }
            }
            
            // Botun kartlarını grupla ve periyotlara göre sırala
            this.botKartlariniSirala(bot.kartlar);
            
            // Bot kazandı mı kontrolü
            if (this.botEliniKontrolEt(bot.kartlar)) {
                // Oyunu bitir
                this.mevcutDurum = this.durumlar.OYUN_SONU;
                
                if (typeof document !== 'undefined') {
                    const durumMesaji = document.getElementById('durum-mesaji');
                    if (durumMesaji) {
                        durumMesaji.textContent = `Bot ${botNo} oyunu kazandı!`;
                    }
                }
                
                return;
            }
            
            // Bot kartlarını güncelle
            this.botKartlariGuncelle(botNo);
            
            // Sıradaki oyuncuya geç
            setTimeout(() => {
            this.siradakiOyuncu();
            }, 500);
        }, dusunmeSuresi);
    }
    
    /**
     * Bot kartlarını değerlendiren fonksiyon
     * @param {Array} kartlar Bot kartları
     * @returns {Object} Değerlendirme sonucu
     */
    botKartlariDegerlendir(kartlar) {
        const gruplar = {};
        const periyotlar = {};
        
        // Kartları gruplar ve periyotlara göre sınıflandır
        kartlar.forEach(kart => {
            if (kart.joker) return;
            
            const grup = kart.element.grup;
            const periyot = kart.element.periyot;
            
            if (!gruplar[grup]) gruplar[grup] = [];
            if (!periyotlar[periyot]) periyotlar[periyot] = [];
            
            gruplar[grup].push(kart);
            periyotlar[periyot].push(kart);
        });
        
        return { gruplar, periyotlar };
    }
    
    /**
     * Bot için bir kartın yararlı olup olmadığını değerlendirir
     * @param {Object} kart Değerlendirilecek kart
     * @param {Array} mevcutKartlar Mevcut kartlar
     * @returns {boolean} Kart yararlı mı
     */
    botKartYararlimi(kart, mevcutKartlar) {
        if (kart.joker) return true; // Joker her zaman yararlıdır
        
        const degerlendirme = this.botKartlariDegerlendir(mevcutKartlar);
        const grup = kart.element.grup;
        const periyot = kart.element.periyot;
        
        // Grup için yararlı mı kontrol et
        if (degerlendirme.gruplar[grup] && degerlendirme.gruplar[grup].length >= 2) {
            return true;
        }
        
        // Periyot için yararlı mı kontrol et
        if (degerlendirme.periyotlar[periyot] && degerlendirme.periyotlar[periyot].length >= 3) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Bot kartları arasında en kötü kartı bulur
     * @param {Array} kartlar Bot kartları
     * @returns {number} En kötü kartın indeksi
     */
    botEnKotuyuBul(kartlar) {
        const degerlendirme = this.botKartlariDegerlendir(kartlar);
        let enKotuIndeks = 0;
        let enKotuSkor = Number.MAX_SAFE_INTEGER;
        
        kartlar.forEach((kart, indeks) => {
            if (kart.joker) return; // Jokerleri atma
            
            const grup = kart.element.grup;
            const periyot = kart.element.periyot;
            
            // Kart skor hesaplama (düşük skor daha kötü)
            let skor = 0;
            
            if (degerlendirme.gruplar[grup]) {
                skor += degerlendirme.gruplar[grup].length;
            }
            
            if (degerlendirme.periyotlar[periyot]) {
                skor += degerlendirme.periyotlar[periyot].length;
            }
            
            if (skor < enKotuSkor) {
                enKotuSkor = skor;
                enKotuIndeks = indeks;
            }
        });
        
        return enKotuIndeks;
    }
    
    /**
     * Bot kartlarını sıralar
     * @param {Array} kartlar Bot kartları
     */
    botKartlariniSirala(kartlar) {
        // Önce grup sonra periyota göre sırala
        kartlar.sort((a, b) => {
            if (!a.element || !b.element) return 0;
            
            if (a.element.grup !== b.element.grup) {
                return a.element.grup - b.element.grup;
            }
            
            return a.element.periyot - b.element.periyot;
        });
    }
    
    /**
     * Bot kartlarını arayüzde günceller
     * @param {number} botNo Bot numarası
     */
    botKartlariGuncelle(botNo) {
        if (typeof document === 'undefined') return;
        
        const botKartlariDiv = document.querySelector(`#bot${botNo}-alani .bot-kartlar`);
        if (!botKartlariDiv) return;
        
        // Kartları temizle
        botKartlariDiv.innerHTML = '';
        
        // Yeni kartları ekle
        const bot = this.botlar[botNo - 1];
        bot.kartlar.forEach(kart => {
            const kartDiv = document.createElement('div');
            kartDiv.className = 'bot-kart';
            kartDiv.dataset.atomNo = kart.element.atom_no;
            kartDiv.dataset.sembol = kart.element.sembol;
            kartDiv.dataset.grup = kart.element.grup;
            kartDiv.dataset.periyot = kart.element.periyot;
            kartDiv.dataset.joker = kart.joker;
            
            // Sembol ve kimyasal bilgiler eklenir ama arka yüz olarak gösterilir
            kartDiv.innerHTML = `
                <div class="kart-bilgi gizli">
                    <div class="sembol">${kart.element.sembol}</div>
                    <div class="grup-periyot">G:${kart.element.grup} P:${kart.element.periyot}</div>
                </div>
            `;
            
            botKartlariDiv.appendChild(kartDiv);
        });
    }
    
    /**
     * Bot elini kontrol eder ve kazanıp kazanamadığını belirler
     * @param {Array} kartlar Bot kartları
     * @returns {boolean} Bot kazandı mı
     */
    botEliniKontrolEt(kartlar) {
        // Bu fonksiyon, botun elindeki kartların gruplanmış olduğunu ve
        // sadece bir kart kaldığında oyunun bittiğini kontrol eder
        
        if (kartlar.length === 1) {
            // El gruplanmışsa ve tek kart kaldıysa kazanır
            return true;
        }
        
        // Grup ve periyotları kontrol et
        const gruplar = {};
        const periyotlar = {};
        let jokerSayisi = 0;
        
        // Kartları sınıflandır
        kartlar.forEach(kart => {
            if (kart.joker) {
                jokerSayisi++;
                return;
            }
            
            const grup = kart.element.grup;
            const periyot = kart.element.periyot;
            
            if (!gruplar[grup]) gruplar[grup] = [];
            if (!periyotlar[periyot]) periyotlar[periyot] = [];
            
            gruplar[grup].push(kart);
            periyotlar[periyot].push(kart);
        });
        
        // Geçerli grup ve periyot sayısı
        let gecerliGruplar = 0;
        let gecerliPeriyotlar = 0;
        
        // Grupları kontrol et (en az 3 kart)
        for (const grup in gruplar) {
            if (gruplar[grup].length >= 3) {
                gecerliGruplar++;
            }
        }
        
        // Periyotları kontrol et (en az 4 kart)
        for (const periyot in periyotlar) {
            if (periyotlar[periyot].length >= 4) {
                gecerliPeriyotlar++;
            }
        }
        
        // Jokerler ile iyileştirilebilecek durumları kontrol et
        // Bu basit bir kontrol, gerçek mantık daha karmaşık olabilir
        
        // Bot tüm kartları grupladıysa ve bir kart kaldıysa kazanır
        const toplamGecerliKart = Object.values(gruplar)
            .filter(grup => grup.length >= 3)
            .reduce((toplam, grup) => toplam + grup.length, 0);
        
        const toplamGecerliKartPeriyot = Object.values(periyotlar)
            .filter(periyot => periyot.length >= 4)
            .reduce((toplam, periyot) => toplam + periyot.length, 0);
        
        // Tüm kartlar gruplanmışsa ve bir kart kaldıysa kazanır
        return (toplamGecerliKart + jokerSayisi >= kartlar.length - 1) || 
               (toplamGecerliKartPeriyot + jokerSayisi >= kartlar.length - 1);
    }
    
    /**
     * Puan hesaplama
     * @param {Object} kombinasyonlar Kombinasyonlar
     * @returns {number} Toplam puan
     */
    puanHesapla(kombinasyonlar) {
        let puan = 0;
        
        // Grup puanları: Her grup 10 puan
        puan += kombinasyonlar.gruplar.length * 10;
        
        // Periyot puanları: Her periyot 5 puan
        puan += kombinasyonlar.periyotlar.length * 5;
        
        // Joker kontrolü: Son kart joker ise puan 2 katına çıkar
        const sonKartJoker = false; // TODO: Son kart kontrolü eklenecek
        
        if (sonKartJoker) {
            puan *= 2;
        }
        
        return puan;
    }
}

// Dışa aktarma (export)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PeriyodikOkey };
}

/**
 * Element kartını DOM elementi olarak oluşturur
 * @param {Object} element - Element verisi
 * @param {number} takim - Kartın takım numarası (1 veya 2)
 * @param {boolean} joker - Kartın joker olup olmadığı
 * @return {HTMLElement} Oluşturulan kart DOM elementi
 */
function elementKartiOlusturDOM(element, takim = 1, jokerMi = false) {
    if (!element) {
        console.error("Element verisi eksik!");
        return null;
    }
    
    // Kart div'i oluştur
    const kartDiv = document.createElement('div');
    kartDiv.className = 'element-kart';
    if (jokerMi) {
        kartDiv.className += ' joker';
    }
    
    // Periyodik tablo bilgilerini data öznitelikleri olarak ekle
    kartDiv.dataset.atomNo = element.atom_no;
    kartDiv.dataset.sembol = element.sembol;
    kartDiv.dataset.grup = element.grup;
    kartDiv.dataset.periyot = element.periyot;
    kartDiv.dataset.takim = takim;
    kartDiv.dataset.joker = jokerMi;
    
    // Kart içeriğini oluştur
    if (jokerMi) {
        // Joker kart içeriği
        kartDiv.innerHTML = `
            <div class="atom-no">J</div>
            <div class="sembol">Jk</div>
            <div class="isim">Joker</div>
            <div class="grup-periyot">Joker</div>
        `;
    } else {
        // Normal element kartı içeriği
        kartDiv.innerHTML = `
            <div class="atom-no">${element.atom_no}</div>
            <div class="takim">T${takim}</div>
            <div class="sembol">${element.sembol}</div>
            <div class="isim">${element.isim}</div>
            <div class="grup-periyot">G:${element.grup} P:${element.periyot}</div>
        `;
    }
    
    // Arka plan rengini element türüne göre ayarla
    if (element.element_turu) {
        let renkKodu;
        switch (element.element_turu.toLowerCase()) {
            case 'metal':
            case 'alkali metal':
            case 'toprak alkali metal':
                renkKodu = '#b3e0ff'; // Açık mavi
                break;
            case 'ametal':
            case 'halojen':
                renkKodu = '#ffb3b3'; // Açık kırmızı
                break;
            case 'yarı metal':
                renkKodu = '#ffe0b3'; // Açık turuncu
                break;
            case 'soy gaz':
                renkKodu = '#d6b3ff'; // Açık mor
                break;
            default:
                renkKodu = '#f2f2f2'; // Açık gri
        }
        kartDiv.style.backgroundColor = renkKodu;
    } else {
        // Grup numarasına göre renk
        const grupRenkler = {
            1: '#ffb3b3',  // Kırmızı
            2: '#ffe0b3',  // Turuncu
            13: '#ffffb3', // Sarı
            14: '#b3ffb3', // Yeşil
            15: '#b3e0ff', // Açık mavi
            16: '#b3b3ff', // Mavi
            17: '#d6b3ff', // Mor
            18: '#ffb3e0'  // Pembe
        };
        
        const renk = grupRenkler[element.grup] || '#f2f2f2';
        kartDiv.style.backgroundColor = renk;
    }
    
    // Joker kartlara özel stil
    if (jokerMi) {
        kartDiv.style.backgroundColor = '#ffffb3'; // Altın sarısı
        kartDiv.style.borderColor = '#ffd700';
    }
    
    // Kart seçimi olayı
    kartDiv.addEventListener('click', (e) => {
        // Diğer seçili kartları temizle
        document.querySelectorAll('.element-kart.secili').forEach(kart => {
            if (kart !== kartDiv) {
                kart.classList.remove('secili');
            }
        });
        
        // Bu kartın seçili durumunu değiştir
        kartDiv.classList.toggle('secili');
        e.stopPropagation(); // Olay yayılımını durdur
    });
    
    // Sürükleme özelliği ekle
    kartDiv.setAttribute('draggable', 'true');
    kartDiv.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', kartDiv.dataset.sembol);
        e.dataTransfer.setData('kart', JSON.stringify({
            atomNo: kartDiv.dataset.atomNo,
            sembol: kartDiv.dataset.sembol,
            grup: kartDiv.dataset.grup,
            periyot: kartDiv.dataset.periyot,
            takim: kartDiv.dataset.takim,
            joker: kartDiv.dataset.joker
        }));
        setTimeout(() => {
            kartDiv.classList.add('surukle');
        }, 0);
    });
    
    kartDiv.addEventListener('dragend', () => {
        kartDiv.classList.remove('surukle');
    });
    
    return kartDiv;
}

// Sürükleme olayları için işleyiciler
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    e.currentTarget.classList.add('surukle-uzerinde');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('surukle-uzerinde');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('surukle-uzerinde');
    
    // Sürüklenen kartın verilerini al
    const kartVerisi = e.dataTransfer.getData('kart');
    if (!kartVerisi) return;
    
    const kartBilgisi = JSON.parse(kartVerisi);
    const sürüklenenKart = document.querySelector(`.element-kart.surukle`);
    
    if (sürüklenenKart) {
        // Kart kombinasyon alanına taşınıyorsa
        if (e.currentTarget.id === 'kombinasyon-icerik') {
            e.currentTarget.appendChild(sürüklenenKart);
        } 
        // Kart oyuncu kartlarına taşınıyorsa
        else if (e.currentTarget.id === 'oyuncu-kartlari') {
            e.currentTarget.appendChild(sürüklenenKart);
        }
    }
}

// Fonksiyonları global scope'a ekle (tarayıcıda çalıştığında)
if (typeof window !== 'undefined') {
    window.elementKartiOlusturDOM = elementKartiOlusturDOM;
    window.handleDragOver = handleDragOver;
    window.handleDragEnter = handleDragEnter;
    window.handleDragLeave = handleDragLeave;
    window.handleDrop = handleDrop;
}

// Module.exports kontrolü
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PeriyodikOkey, elementKartiOlusturDOM };
} 