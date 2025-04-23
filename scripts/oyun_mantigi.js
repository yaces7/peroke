/**
 * Periyodik Okey - Oyun Mantığı
 * Oyun akışı ve kurallarını yöneten ana sınıf
 */

// ElementKartiSinifi sınıfını içe aktar (import)
const { ElementKartiSinifi } = typeof require !== 'undefined' ? require('./kart_sablonu.js') : {};

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
            OYUN_SONU: 'oyun_sonu'
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
        // Bloklar (7'şer kart)
        const bloklar = [];
        const blokSayisi = 17; // 7*17 = 119 kart (1 kart fazla kalacak)
        
        for (let i = 0; i < blokSayisi; i++) {
            const blok = [];
            for (let j = 0; j < 7; j++) {
                if (this.deste.length > 0) {
                    blok.push(this.deste.pop());
                }
            }
            bloklar.push(blok);
        }
        
        // Zar at (1-6 arası rastgele sayı)
        const zar = Math.floor(Math.random() * 6) + 1;
        
        // İlk blok + fazla kalan kart ilk oyuncuya
        const ilkBlokIndeks = zar - 1;
        
        // Fazladan kalan kartı ilk oyuncuya ver
        if (this.deste.length > 0) {
            this.oyuncu.kartlar.push(this.deste.pop());
        }
        
        // İlk bloğu ilk oyuncuya ver
        this.oyuncu.kartlar.push(...bloklar[ilkBlokIndeks]);
        bloklar.splice(ilkBlokIndeks, 1);
        
        // Kalan blokları dağıt (saat yönünde, 2 tur)
        const tumOyuncular = [this.oyuncu, ...this.botlar];
        
        // İlk tur dağıtım
        for (let i = 0; i < tumOyuncular.length; i++) {
            if (bloklar.length > 0) {
                tumOyuncular[i].kartlar.push(...bloklar.shift());
            }
        }
        
        // İkinci tur dağıtım
        for (let i = 0; i < tumOyuncular.length; i++) {
            if (bloklar.length > 0) {
                tumOyuncular[i].kartlar.push(...bloklar.shift());
            }
        }
        
        // Kalan blokları desteye ekle
        bloklar.forEach(blok => {
            this.deste.push(...blok);
        });
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
    }
    
    /**
     * Oyuncunun kart seçmesi
     * @param {number} kartIndeks Seçilen kartın indeksi
     */
    kartSec(kartIndeks) {
        if (!this.oyuncu.sirada || this.mevcutDurum !== this.durumlar.KART_SECME) {
            return false;
        }
        
        // Seçilen kartı al
        const secilenKart = this.oyuncu.kartlar[kartIndeks];
        
        // Kartı açık kart olarak belirle
        const eskiAcikKart = this.acikKart;
        this.acikKart = secilenKart;
        
        // Kartı oyuncudan çıkar
        this.oyuncu.kartlar.splice(kartIndeks, 1);
        
        // Eski açık kartı desteden kart almaları için botlara ver
        this.siradakiOyuncu();
        
        return true;
    }
    
    /**
     * Açık kartı alma işlemi
     */
    acikKartiAl() {
        if (!this.oyuncu.sirada || this.mevcutDurum !== this.durumlar.KART_SECME) {
            return false;
        }
        
        // Açık kartı oyuncuya ver
        this.oyuncu.kartlar.push(this.acikKart);
        
        // Yeni açık kart belirle (boş)
        this.acikKart = null;
        
        // Oyuncunun elini kontrol et
        this.kombinasyonlariKontrolEt();
        
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
            // TODO: Kullanılmış kartları karıştır
            return false;
        }
        
        // Desteden bir kart çek
        const yeniKart = this.deste.pop();
        
        // Kartı oyuncuya ver
        this.oyuncu.kartlar.push(yeniKart);
        
        // Oyuncunun elini kontrol et
        this.kombinasyonlariKontrolEt();
        
        return true;
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
        
        setTimeout(() => {
            // Botun zorluk seviyesine göre karar verme mekanizması
            // Basit bir örnek: Rastgele kart seçimi
            const rastgeleIndeks = Math.floor(Math.random() * bot.kartlar.length);
            const secilenKart = bot.kartlar[rastgeleIndeks];
            
            // Kartı bottan çıkar
            bot.kartlar.splice(rastgeleIndeks, 1);
            
            // Eski açık kartı sakla
            const eskiAcikKart = this.acikKart;
            
            // Yeni açık kartı belirle
            this.acikKart = secilenKart;
            
            // Eski açık kartı bota ver
            if (eskiAcikKart) {
                bot.kartlar.push(eskiAcikKart);
            } else {
                // Açık kart yoksa desteden çek
                if (this.deste.length > 0) {
                    bot.kartlar.push(this.deste.pop());
                }
            }
            
            // Botun elini kontrol et
            const kombinasyonlar = this.kombinasyonlariKontrolEt(bot.kartlar);
            
            // Bot kazandı mı kontrolü
            if (bot.kartlar.length === 0) {
                this.mevcutDurum = this.durumlar.OYUN_SONU;
                return;
            }
            
            // Sıradaki oyuncuya geç
            this.siradakiOyuncu();
        }, 1000); // 1 saniye beklet (animasyon gibi)
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