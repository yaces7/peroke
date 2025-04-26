/**
 * Periyodik Okey - Oyun Mantığı
 * Oyun kurallarını, element kartlarını ve oyun akışını kontrol eden sınıf
 */

class PeriyodikOkey {
    constructor() {
        this.deste = [];
        this.acikKart = null;
        this.oyuncuKartlari = [];
        this.botKartlari = {}; // Her botun kartları
        this.aktifOyuncu = 0; // 0: oyuncu, 1-3: botlar
        this.botSayisi = 3;
        this.botZorlukSeviyesi = 'orta';
        this.jokerAktif = true;
        this.kalanKartlar = [];
        this.atilanKartlar = [];
        this.oyunDurumu = 'bekliyor'; // bekliyor, devam, bitti
        this.kazananOyuncu = null;
        this.oyuncuPuani = 0;
        this.botPuanlari = {};
    }

    /**
     * Oyunu başlat ve ilk durumu ayarla
     * @param {number} botSayisi - Oyundaki bot sayısı (1-3)
     * @returns {Object} Oyun durumu
     */
    oyunuBaslat(botSayisi = 3) {
        // Bot sayısını ayarla (1-3 arasında)
        this.botSayisi = Math.max(1, Math.min(3, botSayisi));
        
        // Desteyi oluştur
        this.desteOlustur();
        
        // Kartları dağıt
        this.kartlariDagit();
        
        // Açık kartı belirle
        this.acikKart = this.kalanKartlar.pop();
        this.atilanKartlar.push(this.acikKart);
        
        // Oyun durumunu güncelle
        this.oyunDurumu = 'devam';
        this.aktifOyuncu = 0; // Oyuncu başlar
        
        // Mevcut oyun durumunu döndür
        return this.oyunDurumuGetir();
    }

    /**
     * Kart destesini oluştur
     */
    desteOlustur() {
        // Elementleri al
        const elementVerileri = window.ELEMENT_VERILERI || [];
        
        if (elementVerileri.length === 0) {
            console.error("Element verileri bulunamadı!");
            return;
        }
        
        this.deste = [];
        
        // Her elementten 2'şer tane ekle
        elementVerileri.forEach(element => {
            // İlk kopya
            this.deste.push({
                atom_no: element.atom_no,
                sembol: element.sembol,
                isim: element.isim,
                grup: element.grup,
                periyot: element.periyot,
                grup_turu: element.grup_turu,
                id: `${element.atom_no}_${Math.floor(Math.random() * 10000)}`
            });
            
            // İkinci kopya
            this.deste.push({
                atom_no: element.atom_no,
                sembol: element.sembol,
                isim: element.isim,
                grup: element.grup,
                periyot: element.periyot,
                grup_turu: element.grup_turu,
                id: `${element.atom_no}_${Math.floor(Math.random() * 10000)}`
            });
        });
        
        // Joker ekle (2 adet)
        for (let i = 0; i < 2; i++) {
            this.deste.push({
                isJoker: true,
                id: `joker_${Math.floor(Math.random() * 10000)}`
            });
        }
        
        // Desteyi karıştır
        this.desteKaristir();
    }

    /**
     * Desteyi karıştır
     */
    desteKaristir() {
        for (let i = this.deste.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deste[i], this.deste[j]] = [this.deste[j], this.deste[i]];
        }
        
        // Kalan kartları güncelle
        this.kalanKartlar = [...this.deste];
    }

    /**
     * Kartları dağıt
     */
    kartlariDagit() {
        // Oyuncu kartları
        this.oyuncuKartlari = [];
        for (let i = 0; i < 14; i++) {
            this.oyuncuKartlari.push(this.kalanKartlar.pop());
        }
        
        // Bot kartları
        this.botKartlari = {};
        for (let botId = 1; botId <= this.botSayisi; botId++) {
            this.botKartlari[botId] = [];
            for (let i = 0; i < 14; i++) {
                this.botKartlari[botId].push(this.kalanKartlar.pop());
            }
        }
    }

    /**
     * Mevcut oyun durumunu getir
     * @returns {Object} Oyun durumu
     */
    oyunDurumuGetir() {
        return {
            oyunDurumu: this.oyunDurumu,
            aktifOyuncu: this.aktifOyuncu,
            oyuncuKartlari: this.oyuncuKartlari,
            botKartlariSayisi: Object.keys(this.botKartlari).reduce((acc, botId) => {
                acc[botId] = this.botKartlari[botId].length;
                return acc;
            }, {}),
            acikKart: this.acikKart,
            kalanKart: this.kalanKartlar.length,
            oyuncuPuani: this.oyuncuPuani,
            botPuanlari: this.botPuanlari
        };
    }

    /**
     * Oyuncunun desteden kart çekmesi
     * @returns {Object} Çekilen kart
     */
    kartiCek() {
        // Sıra kontrolü
        if (this.aktifOyuncu !== 0) {
            throw new Error("Şu anda sıra sizde değil!");
        }
        
        // Kalan kart kontrolü
        if (this.kalanKartlar.length === 0) {
            throw new Error("Destede kart kalmadı!");
        }
        
        // Kart çek
        const cekilenKart = this.kalanKartlar.pop();
        this.oyuncuKartlari.push(cekilenKart);
        
        return cekilenKart;
    }

    /**
     * Oyuncunun açık kartı alması
     * @returns {Object} Alınan kart
     */
    acikKartiAl() {
        // Sıra kontrolü
        if (this.aktifOyuncu !== 0) {
            throw new Error("Şu anda sıra sizde değil!");
        }
        
        // Açık kart kontrolü
        if (!this.acikKart) {
            throw new Error("Açık kart bulunmuyor!");
        }
        
        // Açık kartı al
        const alinanKart = this.acikKart;
        this.oyuncuKartlari.push(alinanKart);
        
        // Açık kartı güncelle (son atılan karttan bir önceki)
        if (this.atilanKartlar.length > 1) {
            this.atilanKartlar.pop(); // Son açık kartı çıkar
            this.acikKart = this.atilanKartlar[this.atilanKartlar.length - 1];
        } else {
            this.acikKart = null;
            this.atilanKartlar = [];
        }
        
        return alinanKart;
    }

    /**
     * Oyuncunun kart atması
     * @param {string} kartId - Atılacak kartın ID'si
     * @returns {Object} Atılan kart
     */
    kartVer(kartId) {
        // Sıra kontrolü
        if (this.aktifOyuncu !== 0) {
            throw new Error("Şu anda sıra sizde değil!");
        }
        
        // Kart bulma
        const kartIndex = this.oyuncuKartlari.findIndex(kart => kart.id === kartId);
        if (kartIndex === -1) {
            throw new Error("Belirtilen kart elinizde bulunmuyor!");
        }
        
        // Kartı at
        const atilanKart = this.oyuncuKartlari.splice(kartIndex, 1)[0];
        this.acikKart = atilanKart;
        this.atilanKartlar.push(atilanKart);
        
        // Bot sırasına geç
        this.aktifOyuncu = 1;
        
        // Botların oynamasını sağla
        this.botlarinSirasiniIsle();
        
        return atilanKart;
    }

    /**
     * Oyuncunun son kartını bota vermesi (test etme)
     * @returns {boolean} Başarılı olup olmadığı
     */
    sonKartiBotaVer() {
        // Kart kontrolü
        if (this.oyuncuKartlari.length !== 1) {
            throw new Error("Elinizde tek kart kalmadı!");
        }
        
        // Son kartı al ve at
        const sonKart = this.oyuncuKartlari.pop();
        this.acikKart = sonKart;
        this.atilanKartlar.push(sonKart);
        
        // Oyuncuya puan ekle
        this.oyuncuPuani += 1;
        
        // Yeni el başlat
        this.yeniElBaslat();
        
        return true;
    }

    /**
     * Botların sırasını işle
     * @private
     */
    botlarinSirasiniIsle() {
        // Her botun sırasını işle
        for (let botId = 1; botId <= this.botSayisi; botId++) {
            if (this.oyunDurumu !== 'devam') break;
            
            setTimeout(() => {
                this.botHamlesiYap(botId);
                
                // Son bot ise sırayı oyuncuya ver
                if (botId === this.botSayisi) {
                    this.aktifOyuncu = 0;
                }
            }, botId * 1000); // Her bot için gecikme süresi
        }
    }

    /**
     * Bot hamlesi yap
     * @param {number} botId - Bot ID'si
     * @private
     */
    botHamlesiYap(botId) {
        // Bot kartları
        const botKartlari = this.botKartlari[botId] || [];
        
        // Kart çek veya aç
        const rastgele = Math.random();
        let cekilenKart = null;
        
        if (rastgele > 0.5 && this.acikKart) {
            // Açık kartı al
            cekilenKart = this.acikKart;
            botKartlari.push(cekilenKart);
            
            // Açık kartı güncelle
            if (this.atilanKartlar.length > 1) {
                this.atilanKartlar.pop();
                this.acikKart = this.atilanKartlar[this.atilanKartlar.length - 1];
            } else {
                this.acikKart = null;
                this.atilanKartlar = [];
            }
        } else if (this.kalanKartlar.length > 0) {
            // Desteden çek
            cekilenKart = this.kalanKartlar.pop();
            botKartlari.push(cekilenKart);
        }
        
        // Zorluk seviyesine göre hamle yap
        let kartAtildi = false;
        
        if (this.botZorlukSeviyesi === 'zor') {
            // Zor: Akıllıca hamle yapmaya çalış
            kartAtildi = this.botAkilliHamleYap(botId, botKartlari);
        } else if (this.botZorlukSeviyesi === 'orta') {
            // Orta: Bazen akıllıca, bazen rastgele
            if (Math.random() > 0.4) {
                kartAtildi = this.botAkilliHamleYap(botId, botKartlari);
            }
            
            if (!kartAtildi) {
                kartAtildi = this.botRastgeleHamleYap(botId, botKartlari);
            }
        } else {
            // Kolay: Rastgele hamle
            kartAtildi = this.botRastgeleHamleYap(botId, botKartlari);
        }
        
        // Kartları güncelle
        this.botKartlari[botId] = botKartlari;
        
        // Bot kartları bittiyse
        if (botKartlari.length === 0) {
            this.oyunDurumu = 'bitti';
            this.kazananOyuncu = botId;
            this.botPuanlari[botId] = (this.botPuanlari[botId] || 0) + 1;
            
            // Yeni el başlat
            this.yeniElBaslat();
        }
    }

    /**
     * Bot akıllı hamle yap
     * @param {number} botId - Bot ID'si
     * @param {Array} botKartlari - Bot kartları
     * @private
     */
    botAkilliHamleYap(botId, botKartlari) {
        // Periyot veya grup bazında kart gruplaması yap
        const periyotGruplari = {};
        const grupGruplari = {};
        
        botKartlari.forEach(kart => {
            if (kart.isJoker) return;
            
            const periyot = kart.periyot;
            const grup = kart.grup;
            
            if (!periyotGruplari[periyot]) periyotGruplari[periyot] = [];
            if (!grupGruplari[grup]) grupGruplari[grup] = [];
            
            periyotGruplari[periyot].push(kart);
            grupGruplari[grup].push(kart);
        });
        
        // En az bir karta sahip gruplar
        const tekKartlar = [];
        
        // Kart seç
        for (const kart of botKartlari) {
            if (kart.isJoker) continue;
            
            const periyot = kart.periyot;
            const grup = kart.grup;
            
            if (periyotGruplari[periyot].length === 1 && grupGruplari[grup].length === 1) {
                tekKartlar.push(kart);
            }
        }
        
        // Kart at
        if (tekKartlar.length > 0) {
            // Tek kart gruplarından rastgele at
            const seciliKart = tekKartlar[Math.floor(Math.random() * tekKartlar.length)];
            const kartIndex = botKartlari.findIndex(k => k.id === seciliKart.id);
            
            if (kartIndex !== -1) {
                const atilanKart = botKartlari.splice(kartIndex, 1)[0];
                this.acikKart = atilanKart;
                this.atilanKartlar.push(atilanKart);
                return true;
            }
        } else {
            // Rastgele at
            return this.botRastgeleHamleYap(botId, botKartlari);
        }
        
        return false;
    }

    /**
     * Bot rastgele hamle yap
     * @param {number} botId - Bot ID'si
     * @param {Array} botKartlari - Bot kartları
     * @private
     */
    botRastgeleHamleYap(botId, botKartlari) {
        if (botKartlari.length === 0) return false;
        
        // Rastgele kart seç
        const kartIndex = Math.floor(Math.random() * botKartlari.length);
        const atilanKart = botKartlari.splice(kartIndex, 1)[0];
        
        // Açık kart olarak belirle
        this.acikKart = atilanKart;
        this.atilanKartlar.push(atilanKart);
        
        return true;
    }

    /**
     * Yeni el başlat
     * @private
     */
    yeniElBaslat() {
        // Desteyi oluştur
        this.desteOlustur();
        
        // Kartları dağıt
        this.kartlariDagit();
        
        // Açık kartı belirle
        this.acikKart = this.kalanKartlar.pop();
        this.atilanKartlar = [this.acikKart];
        
        // Oyun durumunu güncelle
        this.oyunDurumu = 'devam';
        this.aktifOyuncu = 0; // Oyuncu başlar
    }

    /**
     * Kombinasyon kontrolü
     * @param {Array} kartIdleri - Seçilen kart ID'leri
     * @returns {boolean} Geçerli bir kombinasyon olup olmadığı
     */
    kombinasyonKontrolEt(kartIdleri) {
        if (kartIdleri.length < 3) {
            return false; // En az 3 kart gerekli
        }
        
        // Seçilen kartları bul
        const seciliKartlar = kartIdleri.map(id => {
            return this.oyuncuKartlari.find(kart => kart.id === id);
        }).filter(kart => kart); // undefined olanları filtrele
        
        if (seciliKartlar.length < 3) {
            return false; // Kartlar bulunamadı
        }
        
        // Joker sayısı
        const jokerSayisi = seciliKartlar.filter(kart => kart.isJoker).length;
        const normalKartlar = seciliKartlar.filter(kart => !kart.isJoker);
        
        // Eğer tüm kartlar joker ise
        if (jokerSayisi === seciliKartlar.length) {
            return true;
        }
        
        // Aynı periyot kontrolü
        const periyotlar = normalKartlar.map(kart => kart.periyot);
        const tekPeriyot = new Set(periyotlar).size === 1;
        
        // Aynı grup kontrolü
        const gruplar = normalKartlar.map(kart => kart.grup);
        const tekGrup = new Set(gruplar).size === 1;
        
        // Hem aynı periyot hem de aynı grupta olma
        const ayniPeriyotVeGrup = tekPeriyot && tekGrup;
        
        // Ardışık atom numaraları
        const atomNolari = normalKartlar.map(kart => kart.atom_no).sort((a, b) => a - b);
        let ardisik = true;
        for (let i = 1; i < atomNolari.length; i++) {
            if (atomNolari[i] !== atomNolari[i-1] + 1) {
                ardisik = false;
                break;
            }
        }
        
        // Joker yoksa doğrudan kontrol et
        if (jokerSayisi === 0) {
            return tekPeriyot || tekGrup || ardisik;
        }
        
        // Joker varsa, eksik parçaları tamamlayabilir
        if (jokerSayisi > 0) {
            // Aynı periyot veya aynı grup zaten varsa, joker yardımcı olabilir
            if (tekPeriyot || tekGrup) {
                return true;
            }
            
            // Ardışık sayılar için joker kullanımı
            // Joker sayısı kadar eksik parça doldurabilir
            if (atomNolari.length >= 2) {
                const eksikler = [];
                for (let i = 1; i < atomNolari.length; i++) {
                    const fark = atomNolari[i] - atomNolari[i-1] - 1;
                    if (fark > 0) {
                        eksikler.push(fark);
                    }
                }
                
                // Toplam eksik sayı
                const toplamEksik = eksikler.reduce((sum, fark) => sum + fark, 0);
                
                // Eksikleri jokerler ile tamamlayabilir miyiz?
                if (toplamEksik <= jokerSayisi) {
                    return true;
                }
            }
        }
        
        return false;
    }
}

// Global olarak erişilebilmesi için
window.PeriyodikOkey = PeriyodikOkey; 