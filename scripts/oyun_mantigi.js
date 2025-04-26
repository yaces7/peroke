/**
 * Periyodik Okey - Oyun Mantığı
 * Oyun kurallarını, element kartlarını ve oyun akışını kontrol eden sınıf
 */

class PeriyodikOkey {
    constructor() {
        this.deste = [];
        this.acikKart = null;
        this.sonAtilanKart = null; // Son atılan kartı sakla
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
        this.fazlaKartiOlanOyuncu = 0; // 0: oyuncu, 1-3: botlar
        this.oyuncuKartCekildi = false; // Oyuncu kart çekti mi kontrolü
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
        this.fazlaKartiOlanOyuncu = 0; // Oyuncunun 15 kartı olacak
        
        // 1 kart ekstra ekle
        this.oyuncuKartlari.push(this.kalanKartlar.pop());
        
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
        // Oyuncu kartları (başlangıçta 14 kart, sonra 1 kart daha alacak)
        this.oyuncuKartlari = [];
        for (let i = 0; i < 14; i++) {
            this.oyuncuKartlari.push(this.kalanKartlar.pop());
        }
        
        // Bot kartları (her biri 14 kart)
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
            aktifOyuncu: this.aktifOyuncu,
            acikKart: this.acikKart,
            sonAtilanKart: this.sonAtilanKart, // Son atılan kartı da döndür
            oyuncuKartlari: this.oyuncuKartlari,
            kalanKart: this.kalanKartlar.length,
            botKartlariSayisi: Object.fromEntries(
                Object.entries(this.botKartlari).map(([key, value]) => [key, value.length])
            ),
            oyunDurumu: this.oyunDurumu,
            kazananOyuncu: this.kazananOyuncu,
            oyuncuPuani: this.oyuncuPuani,
            botPuanlari: this.botPuanlari
        };
    }

    /**
     * Kartı çek
     */
    kartiCek(oyuncuId = 0) {
        console.log(`Kart çekme isteği: Oyuncu ${oyuncuId}, Aktif oyuncu: ${this.aktifOyuncu}`);
        
        // Oyun durumu kontrolü
        if (this.oyunDurumu !== 'devam') {
            console.error('Oyun devam etmiyor, kart çekilemez!');
            return false;
        }
        
        // Aktif oyuncu kontrolü
        if (this.aktifOyuncu !== oyuncuId) {
            console.error(`Sıra Oyuncu ${oyuncuId}'de değil!`);
            return false;
        }
        
        // Deste boşsa veya 1 karttan az kaldıysa, açık kartları desteye ekle ve karıştır
        if (this.deste.length <= 1) {
            console.log('Deste bitmek üzere, açık kartlar desteye ekleniyor');
            if (this.acikKartlar.length > 0) {
                // Son açık kartı tut, diğerlerini desteye ekle
                const sonAcikKart = this.acikKartlar.pop();
                this.deste = [...this.deste, ...this.acikKartlar];
                this.acikKartlar = sonAcikKart ? [sonAcikKart] : [];
                this.desteKaristir();
            } else if (this.deste.length === 0) {
                console.error('Deste tamamen bitti, oyun bitmiş olmalı!');
                this.oyunDurumu = 'bitti';
                return false;
            }
        }
        
        // Kartı çek
        const kart = this.deste.pop();
        if (!kart) {
            console.error('Deste boş, kart çekilemedi!');
            return false;
        }
        
        // Kartı oyuncuya ekle
        if (oyuncuId === 0) {
            this.oyuncuKartlari.push(kart);
            this.oyuncuKartCekildi = true;
        } else {
            const botIndeks = oyuncuId - 1;
            if (!this.botKartlari[botIndeks]) {
                this.botKartlari[botIndeks] = [];
            }
            this.botKartlari[botIndeks].push(kart);
        }
        
        // Fazla kartı olan oyuncu
        this.fazlaKartiOlanOyuncu = oyuncuId;
        
        console.log(`Kart çekildi: ${kart.element} ${kart.deger}`);
        return true;
    }
    
    /**
     * Açık kartı al
     */
    acikKartiAl(oyuncuId = 0) {
        console.log(`Açık kart alma isteği: Oyuncu ${oyuncuId}, Aktif oyuncu: ${this.aktifOyuncu}`);
        
        // Oyun durumu kontrolü
        if (this.oyunDurumu !== 'devam') {
            console.error('Oyun devam etmiyor, açık kart alınamaz!');
            return false;
        }
        
        // Aktif oyuncu kontrolü
        if (this.aktifOyuncu !== oyuncuId) {
            console.error(`Sıra Oyuncu ${oyuncuId}'de değil!`);
            return false;
        }
        
        // Açık kart var mı kontrolü
        if (!this.acikKart) {
            console.error('Açık kart yok!');
            return false;
        }
        
        // Kartı al
        const kart = this.acikKart;
        this.acikKart = null;
        
        // Kartı oyuncuya ekle
        if (oyuncuId === 0) {
            this.oyuncuKartlari.push(kart);
            this.oyuncuKartCekildi = true;
        } else {
            const botIndeks = oyuncuId - 1;
            if (!this.botKartlari[botIndeks]) {
                this.botKartlari[botIndeks] = [];
            }
            this.botKartlari[botIndeks].push(kart);
        }
        
        // Fazla kartı olan oyuncu
        this.fazlaKartiOlanOyuncu = oyuncuId;
        
        console.log(`Açık kart alındı: ${kart.element} ${kart.deger}`);
        return true;
    }

    /**
     * Kartı at (oyuncudan)
     * @param {string} kartId - Atılacak kartın ID'si
     */
    kartVer(kartId) {
        // Sıra kontrolü
        if (this.aktifOyuncu !== 0) {
            throw new Error("Şu anda sizin sıranız değil!");
        }
        
        // Oyuncu kart çekmiş mi kontrolü
        if (!this.oyuncuKartCekildi) {
            throw new Error("Önce desteden veya açık kart alanından kart çekmelisiniz!");
        }
        
        // Kartı bul
        const kartIndex = this.oyuncuKartlari.findIndex(kart => kart.id === kartId);
        
        if (kartIndex === -1) {
            throw new Error("Kart bulunamadı!");
        }
        
        // Kartı çıkar
        const atilanKart = this.oyuncuKartlari.splice(kartIndex, 1)[0];
        this.acikKart = atilanKart;
        this.sonAtilanKart = atilanKart; // Son atılan kartı güncelle
        this.atilanKartlar.push(atilanKart);
        
        // Fazla kartı olan oyuncu sıfırlandı (artık normal kart sayısına sahip)
        this.fazlaKartiOlanOyuncu = null;
        this.oyuncuKartCekildi = false; // Oyuncu kart çekmedi durumuna geri dön
        
        // Sonraki oyuncuya geç (bot)
        this.aktifOyuncu = 1;
        
        // Oyuncu kartları bittiyse
        if (this.oyuncuKartlari.length === 0) {
            this.oyunDurumu = 'bitti';
            this.kazananOyuncu = 0;
            this.oyuncuPuani += 1;
            
            // Yeni el başlat
            this.yeniElBaslat();
        } else {
            // Bot sırasını işle
            setTimeout(() => {
                this.botlarinSirasiniIsle();
            }, 1000);
        }
        
        return atilanKart;
    }

    /**
     * Botların sırasını işle
     */
    botlarinSirasiniIsle() {
        // Oyun devam ediyor mu?
        if (this.oyunDurumu !== 'devam') return;
        
        // Aktif oyuncu oyuncu ise işlem yapma
        if (this.aktifOyuncu === 0) return;
        
        const botId = this.aktifOyuncu;
        console.log(`Bot sırası işleniyor: Bot ${botId}`);
        
        // Eğer bot kartını atmış ve fazla kartı yoksa, sıradaki oyuncuya geç
        if (this.fazlaKartiOlanOyuncu === null) {
            // Bot hamlesi yap
            let sonuc = this.tekBotHamlesiYap(botId);
            
            if (sonuc === "hatali_sira") {
                console.log(`Hatalı sıra, bir sonraki oyuncuya geçiliyor`);
                this.siradakiOyuncuyaGec();
                return;
            } else if (sonuc === "kart_cekme_hatasi") {
                console.log(`Kart çekme hatası, sırayı düzeltiyorum`);
                this.aktifOyuncu = botId;
                return;
            }
        } else if (this.fazlaKartiOlanOyuncu === botId) {
            // Bot elinden kart atmalı
            try {
                console.log(`Bot ${botId} elinden kart atıyor`);
                const atilacakKart = this.botKartSecimi(botId);
                this.botKartAt(botId, atilacakKart);
                this.oyuncuKartCekildi = false;
            } catch (error) {
                console.error(`Bot ${botId} kart atarken hata:`, error);
                this.siradakiOyuncuyaGec(); // Hata olursa sıradaki oyuncuya geç
            }
        } else {
            // Fazla kart başka birinde, bir şey yapma
            console.warn(`Bot ${botId} sırası ama fazla kart başka birinde:`, this.fazlaKartiOlanOyuncu);
            this.siradakiOyuncuyaGec();
        }
    }

    /**
     * Sıradaki oyuncuya geç
     */
    siradakiOyuncuyaGec() {
        // Oyun bitmiş mi kontrolü
        if (this.oyunDurumu !== 'devam') return;
        
        // Fazla kartı olan oyuncu var mı kontrolü
        if (this.fazlaKartiOlanOyuncu !== null) {
            console.error("Uyarı: Fazla kartı olan oyuncu varken sıra geçilmeye çalışılıyor!");
            return;
        }
        
        // Sıradaki oyuncuya geç
        this.aktifOyuncu = (this.aktifOyuncu + 1) % (this.botSayisi + 1);
        console.log(`Sıra şimdi: ${this.aktifOyuncu === 0 ? 'Oyuncu' : 'Bot ' + this.aktifOyuncu}'da`);
        
        // Bot ise otomatik oyna
        if (this.aktifOyuncu !== 0) {
            // Kısa bir gecikme ile bot hamlesi yap
            setTimeout(() => {
                this.botlarinSirasiniIsle();
            }, 800);
        }
        
        this.oyuncuKartCekildi = false;
        return this.aktifOyuncu;
    }

    /**
     * Bot için tek hamle yap
     * @param {number} botId - Bot ID
     * @returns {string} - Hamle sonucu
     */
    tekBotHamlesiYap(botId) {
        // Aktif oyuncu bu bot değilse hata
        if (this.aktifOyuncu !== botId) {
            console.error(`Hata: Aktif oyuncu (${this.aktifOyuncu}) Bot ${botId} değil!`);
            return "hatali_sira";
        }
        
        try {
            console.log(`Bot ${botId} hamlesi yapılıyor...`);
            
            // Bot zorluğuna göre kart seçim stratejisi
            const zorluk = this.botZorlukSeviyesi || 1;
            
            // Açık kart varsa ve bot zorluğuna göre uygunsa açık kartı al
            if (this.acikKart && this.botAcikKartiDegerlendirme(botId, zorluk)) {
                if (this.acikKartiAl(botId) === false) {
                    // Açık kart alamadıysa normal kart çek
                    console.log(`Bot ${botId} açık kart alamadı, normal kart çekiyor`);
                    if (this.kartiCek(botId) === false) {
                        console.error(`Bot ${botId} kart çekemedi!`);
                        return "kart_cekme_hatasi";
                    }
                }
            } else {
                // Açık kart yoksa veya tercih etmiyorsa normal kart çek
                if (this.kartiCek(botId) === false) {
                    console.error(`Bot ${botId} kart çekemedi!`);
                    return "kart_cekme_hatasi";
                }
            }
            
            return "basarili";
        } catch (error) {
            console.error(`Bot ${botId} hamlesi yapılırken hata:`, error);
            return "hata";
        }
    }
    
    /**
     * Bot'un açık kartı değerlendirmesi
     * @param {number} botId - Bot ID
     * @param {number} zorluk - Bot zorluk seviyesi
     * @returns {boolean} - Açık kartı alması gerekip gerekmediği
     */
    botAcikKartiDegerlendirme(botId, zorluk) {
        if (!this.acikKart) return false;
        
        // Bota ait kartlar
        const botKartlari = this.botKartlari[botId - 1];
        if (!botKartlari || botKartlari.length === 0) return true; // Kartsızsa mutlaka al
        
        // Basit seviyeler için rastgele karar ver
        if (zorluk === 1) {
            return Math.random() > 0.4; // %60 ihtimalle açık kartı al
        }
        
        // Orta ve üstü seviyeler için stratejik karar
        const acikKartElement = this.acikKart.element;
        const acikKartDeger = this.acikKart.deger;
        
        // Aynı elementten kaç kart var
        const ayniElementKartSayisi = botKartlari.filter(k => k.element === acikKartElement).length;
        
        // Aynı değerden kaç kart var
        const ayniDegerKartSayisi = botKartlari.filter(k => k.deger === acikKartDeger).length;
        
        // Zorluk seviyesine göre karar stratejisi
        if (zorluk >= 3) {
            // Zor seviye: Akıllıca değerlendir
            return (ayniElementKartSayisi >= 2 || ayniDegerKartSayisi >= 2);
        } else {
            // Orta seviye: Biraz daha basit değerlendirme
            return (ayniElementKartSayisi >= 1 || ayniDegerKartSayisi >= 1);
        }
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
        
        // Oyuncuya ekstra kart ver
        this.oyuncuKartlari.push(this.kalanKartlar.pop());
        this.fazlaKartiOlanOyuncu = 0;
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

    /**
     * Kombinasyon kontrolü yapıp, eğer geçerliyse kartları kaldırır
     * @param {Array} kartIdleri - Seçilen kart ID'leri
     * @returns {boolean} Kombinasyon geçerliyse ve kartlar kaldırıldıysa true, değilse false
     */
    kombinasyonKontrolEtVeKaldir(kartIdleri) {
        // Kombinasyonu kontrol et
        const gecerli = this.kombinasyonKontrolEt(kartIdleri);
        
        if (!gecerli) {
            return false;
        }
        
        // Eğer kombinasyon geçerliyse, kartları elinden çıkar
        for (const kartId of kartIdleri) {
            const kartIndex = this.oyuncuKartlari.findIndex(kart => kart.id === kartId);
            if (kartIndex !== -1) {
                this.oyuncuKartlari.splice(kartIndex, 1);
            }
        }
        
        // Eğer son kart kaldıysa, oyunu kazandınız
        if (this.oyuncuKartlari.length === 1) {
            // Son kartı da kaldır
            this.oyuncuKartlari = [];
            this.oyunDurumu = 'bitti';
            this.kazananOyuncu = 0;
            this.oyuncuPuani += 1;
            
            // Yeni el başlat
            setTimeout(() => {
                this.yeniElBaslat();
            }, 1500);
            
            return true;
        }
        
        return true;
    }

    /**
     * Oyuncunun tüm kartlarını kontrol eden ve otomatik kombinasyonları çıkaran metod
     */
    tumKartlariKontrolEt() {
        // Oyuncu aktif değilse veya oyuncu kartları yoksa işlem yapma
        if (this.aktifOyuncu !== 0 || !this.oyuncuKartlari || this.oyuncuKartlari.length === 0) {
            console.warn("tumKartlariKontrolEt: Sıra oyuncuda değil veya kartlar boş");
            return false;
        }
        
        // Tüm kartları alt kümelerine ayırarak olası kombinasyonları bul
        const tumKartlar = [...this.oyuncuKartlari];
        const gruplar = [];
        
        // Kartları kombinasyonlara ayır
        while (tumKartlar.length > 0) {
            const bulunanKombinasyon = this.enIyiKombinasyonuBul(tumKartlar);
            
            if (bulunanKombinasyon && bulunanKombinasyon.length >= 3) {
                gruplar.push(bulunanKombinasyon);
                // Bulunan kombinasyondaki kartları tumKartlar'dan çıkar
                for (const kart of bulunanKombinasyon) {
                    const index = tumKartlar.findIndex(k => k.id === kart.id);
                    if (index !== -1) {
                        tumKartlar.splice(index, 1);
                    }
                }
            } else {
                // Eğer yeni bir kombinasyon bulunamazsa döngüden çık
                break;
            }
        }
        
        // Kalan kart sayısı 1 veya 0 ise başarılı, değilse başarısız
        if (tumKartlar.length <= 1) {
            console.log("Geçerli kombinasyonlar bulundu, kalan kart sayısı:", tumKartlar.length);
            
            // Bulunan tüm kombinasyonları oyuncunun elinden çıkar
            for (const grup of gruplar) {
                for (const kart of grup) {
                    const index = this.oyuncuKartlari.findIndex(k => k.id === kart.id);
                    if (index !== -1) {
                        this.oyuncuKartlari.splice(index, 1);
                    }
                }
            }
            
            // Eğer tam 1 kart kaldıysa ve sıra daha önceden bize geçtiyse, son kartı da ver
            if (tumKartlar.length === 1 && this.oyuncuKartCekildi) {
                this.kartVer(tumKartlar[0].id);
                // Oyunu bitir
                this.oyunuBitir(0); // 0 = oyuncu
                return true;
            }
            
            return true;
        }
        
        console.log("Geçerli kombinasyonlar yeterli değil, kalan kart sayısı:", tumKartlar.length);
        return false;
    }

    // En iyi kombinasyonu bulan yardımcı fonksiyon
    enIyiKombinasyonuBul(kartlar) {
        if (!kartlar || kartlar.length < 3) return null;
        
        // Kartları önce elementlerine göre grupla
        const elementGruplari = {};
        const sayiGruplari = {};
        
        for (const kart of kartlar) {
            // Element grupları
            if (!elementGruplari[kart.element]) {
                elementGruplari[kart.element] = [];
            }
            elementGruplari[kart.element].push(kart);
            
            // Sayı grupları
            if (!sayiGruplari[kart.deger]) {
                sayiGruplari[kart.deger] = [];
            }
            sayiGruplari[kart.deger].push(kart);
        }
        
        // En iyi kombinasyonu bul (en çok kartı olan)
        let enIyiKombinasyon = null;
        let enIyiKombinasyonUzunlugu = 0;
        
        // Element gruplarını kontrol et
        for (const element in elementGruplari) {
            const grup = elementGruplari[element];
            if (grup.length >= 3) {
                // Sayıya göre sırala
                grup.sort((a, b) => a.deger - b.deger);
                
                // Ardışık sayıları bul
                const siraliGruplar = this.ardisikGruplariOlustur(grup);
                
                for (const ardisikGrup of siraliGruplar) {
                    if (ardisikGrup.length > enIyiKombinasyonUzunlugu) {
                        enIyiKombinasyon = ardisikGrup;
                        enIyiKombinasyonUzunlugu = ardisikGrup.length;
                    }
                }
            }
        }
        
        // Sayı gruplarını kontrol et
        for (const sayi in sayiGruplari) {
            const grup = sayiGruplari[sayi];
            if (grup.length >= 3) {
                if (grup.length > enIyiKombinasyonUzunlugu) {
                    enIyiKombinasyon = grup;
                    enIyiKombinasyonUzunlugu = grup.length;
                }
            }
        }
        
        return enIyiKombinasyon;
    }

    // Ardışık grupları oluşturan yardımcı fonksiyon
    ardisikGruplariOlustur(kartlar) {
        // Kartları sayıya göre sırala
        kartlar.sort((a, b) => a.deger - b.deger);
        
        const gruplar = [];
        let aktifGrup = [kartlar[0]];
        
        for (let i = 1; i < kartlar.length; i++) {
            const oncekiKart = kartlar[i-1];
            const simdikiKart = kartlar[i];
            
            // Aynı sayıyı tekrar ekleme
            if (simdikiKart.deger === oncekiKart.deger) continue;
            
            // Ardışık sayı mı kontrol et
            if (simdikiKart.deger === oncekiKart.deger + 1) {
                aktifGrup.push(simdikiKart);
            } else {
                // Ardışık değilse, mevcut grubu bitir ve yeni başlat
                if (aktifGrup.length >= 3) {
                    gruplar.push(aktifGrup);
                }
                aktifGrup = [simdikiKart];
            }
        }
        
        // Son grubu da ekle
        if (aktifGrup.length >= 3) {
            gruplar.push(aktifGrup);
        }
        
        return gruplar;
    }
}

// Global olarak erişilebilmesi için
window.PeriyodikOkey = PeriyodikOkey; 