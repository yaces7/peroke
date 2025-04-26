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
     * Kartı çek (desteden)
     */
    kartiCek() {
        // Sıra kontrolü - oyuncu için aktifOyuncu kontrolü
        if (this.aktifOyuncu !== 0 && this.fazlaKartiOlanOyuncu === null) {
            throw new Error("Şu anda sizin sıranız değil!");
        }
        
        // Destede kart var mı?
        if (this.kalanKartlar.length === 0) {
            throw new Error("Destede kart kalmadı!");
        }
        
        // Kart çek
        const cekilenKart = this.kalanKartlar.pop();
        
        // Oyuncu mu çekiyor yoksa bot mu?
        if (this.aktifOyuncu === 0) {
            this.oyuncuKartlari.push(cekilenKart);
            this.fazlaKartiOlanOyuncu = 0; // Oyuncunun fazla kartı var
            this.oyuncuKartCekildi = true; // Oyuncu kart çekti
            
            // Kartları sırala (daha kolay görüntülemek için)
            this.kartlariSirala();
        } else {
            // Bot çekiyor
            const botId = this.aktifOyuncu;
            this.botKartlari[botId].push(cekilenKart);
            this.fazlaKartiOlanOyuncu = botId; // Botun fazla kartı var
            this.oyuncuKartCekildi = true; // Bot kart çekti
        }
        
        return cekilenKart;
    }

    /**
     * Açık kartı al
     */
    acikKartiAl() {
        // Sıra kontrolü - oyuncu için aktifOyuncu kontrolü
        if (this.aktifOyuncu !== 0 && this.fazlaKartiOlanOyuncu === null) {
            throw new Error("Şu anda sizin sıranız değil!");
        }
        
        // Açık kart var mı?
        if (!this.acikKart) {
            throw new Error("Açık kart yok!");
        }
        
        // Açık kartı al
        const acikKart = this.acikKart;
        
        // Oyuncu mu çekiyor yoksa bot mu?
        if (this.aktifOyuncu === 0) {
            this.oyuncuKartlari.push(acikKart);
            this.fazlaKartiOlanOyuncu = 0; // Oyuncunun fazla kartı var
            this.oyuncuKartCekildi = true; // Oyuncu kart çekti (açık karttan da olsa)
            
            // Kartları sırala
            this.kartlariSirala();
        } else {
            // Bot çekiyor
            const botId = this.aktifOyuncu;
            this.botKartlari[botId].push(acikKart);
            this.fazlaKartiOlanOyuncu = botId; // Botun fazla kartı var
            this.oyuncuKartCekildi = true; // Bot kart çekti
        }
        
        // Açık kartı sıfırla
        this.acikKart = null;
        
        return acikKart;
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
     * Tek bir bot hamlesi yap ve sonucunu döndür
     * @param {number} botId - Bot ID'si
     * @returns {string} Sonuç
     */
    tekBotHamlesiYap(botId) {
        if (this.oyunDurumu !== 'devam') return false;
        if (botId <= 0 || botId > this.botSayisi) return false;
        
        // Bot ID'si ve aktif oyuncu kontrolü
        if (this.aktifOyuncu !== botId) {
            console.error(`Hata: Aktif oyuncu Bot ${botId} değil, aktif oyuncu: ${this.aktifOyuncu}`);
            return "hatali_sira";
        }
        
        const botSeviye = this.botZorlukSeviyesi;
        const botKartlari = this.botKartlari[botId];
        
        console.log(`Bot ${botId} (Seviye: ${botSeviye}) hamlesi yapılıyor. Kart sayısı: ${botKartlari.length}`);
        
        // 1. Adım: Kart çek
        if (!this.oyuncuKartCekildi) {
            // Stratejik olarak açık kart veya kapalı kart çek
            const acikKart = this.acikKart;
            let kartCekildi = false;
            
            try {
                if (botSeviye === 'zor' && acikKart) {
                    // Zor bot için açık kartın değerli olup olmadığını kontrol et
                    const acikKartFaydali = this.botIcinKartFaydaliMi(botId, acikKart);
                    
                    if (acikKartFaydali) {
                        console.log(`Bot ${botId} açık kartı alıyor:`, acikKart);
                        this.aktifOyuncu = botId; // Aktif oyuncuyu güncelle
                        this.acikKartiAl();
                        kartCekildi = true;
                    }
                }
                
                // Açık kart alınmadıysa kapalı kart çek
                if (!kartCekildi) {
                    console.log(`Bot ${botId} kapalı kart çekiyor`);
                    this.aktifOyuncu = botId; // Aktif oyuncuyu güncelle
                    this.kartiCek();
                }
                
                this.oyuncuKartCekildi = true;
            } catch (error) {
                console.error(`Bot ${botId} kart çekerken hata:`, error);
                return "kart_cekme_hatasi";
            }
        }
        
        // Kısa bir bekleme simüle et (stratejik düşünme)
        // 2. Adım: Kart at
        try {
            let atilacakKartIndeks = -1;
            
            if (botSeviye === 'zor') {
                atilacakKartIndeks = this.botZorHamleYap(botId);
            } else {
                atilacakKartIndeks = this.botKolayHamleYap(botId);
            }
            
            // Eğer strateji başarısız olursa rastgele kart at
            if (atilacakKartIndeks === -1 || atilacakKartIndeks >= botKartlari.length) {
                console.log(`Bot ${botId} için uygun strateji bulunamadı, rastgele kart atılıyor`);
                atilacakKartIndeks = Math.floor(Math.random() * botKartlari.length);
            }
            
            // Kart at
            const atilacakKart = botKartlari[atilacakKartIndeks];
            console.log(`Bot ${botId} kartı atıyor:`, atilacakKart);
            
            // Atılacak kartı açık kart olarak ayarla ve botun elinden çıkar
            this.acikKart = atilacakKart;
            botKartlari.splice(atilacakKartIndeks, 1);
            
            // Kart çekme durumunu sıfırla
            this.oyuncuKartCekildi = false;
            
            // El bitti mi kontrol et
            if (botKartlari.length === 0) {
                console.log(`Bot ${botId} oyunu kazandı!`);
                this.oyunuBitir(botId);
                return "kazandi";
            }
            
            return "hamle_yapildi";
        } catch (error) {
            console.error(`Bot ${botId} kart atarken hata:`, error);
            
            // Hata olursa rastgele bir kart at
            if (botKartlari.length > 0) {
                const rastgeleIndeks = Math.floor(Math.random() * botKartlari.length);
                const rastgeleKart = botKartlari[rastgeleIndeks];
                
                console.log(`Bot ${botId} hata sonrası rastgele kart atıyor:`, rastgeleKart);
                this.acikKart = rastgeleKart;
                botKartlari.splice(rastgeleIndeks, 1);
                
                this.oyuncuKartCekildi = false;
                
                // El bitti mi kontrol et
                if (botKartlari.length === 0) {
                    this.oyunuBitir(botId);
                    return "kazandi";
                }
                
                return "acil_hamle_yapildi";
            }
            
            return "hata";
        }
    }

    /**
     * Bot için kartın faydalı olup olmadığını kontrol et
     * @param {number} botId - Bot ID'si
     * @param {Object} kart - Çekilen kart
     * @returns {boolean} Kart faydalı mı
     */
    botIcinKartFaydaliMi(botId, kart) {
        if (!kart) return false;
        
        const botKartlari = this.botKartlari[botId];
        
        // Kart Joker ise her zaman faydalı
        if (kart.isJoker) return true;
        
        // Aynı renkten kart sayısını hesapla
        const ayniRenkKartlar = botKartlari.filter(k => k.renk === kart.renk);
        if (ayniRenkKartlar.length >= 2) return true;
        
        // Aynı elementten kart sayısını hesapla
        const ayniElementKartlar = botKartlari.filter(k => k.element === kart.element);
        if (ayniElementKartlar.length >= 2) return true;
        
        // Sıralı dizi oluşturup oluşturmadığını kontrol et
        const sayisalDegerler = botKartlari
            .filter(k => k.renk === kart.renk && k.element !== 'Joker')
            .map(k => this.elementSayisalDeger(k.element));
        
        sayisalDegerler.push(this.elementSayisalDeger(kart.element));
        sayisalDegerler.sort((a, b) => a - b);
        
        for (let i = 0; i < sayisalDegerler.length - 2; i++) {
            if (sayisalDegerler[i + 1] === sayisalDegerler[i] + 1 && 
                sayisalDegerler[i + 2] === sayisalDegerler[i] + 2) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Element sayısal değerini al (Su:1, Toprak:2, Hava:3, Ateş:4)
     * @param {string} element - Element ismi
     * @returns {number} Elementin sayısal değeri
     */
    elementSayisalDeger(element) {
        const degerler = { 'Su': 1, 'Toprak': 2, 'Hava': 3, 'Ateş': 4 };
        return degerler[element] || 0;
    }

    /**
     * Kolay bot için hamle stratejisi
     * @param {number} botId - Bot ID'si
     * @returns {number} Atılacak kartın indeksi
     */
    botKolayHamleYap(botId) {
        const botKartlari = this.botKartlari[botId];
        if (botKartlari.length === 0) return -1;
        
        // Basit strateji: Rastgele kart at
        return Math.floor(Math.random() * botKartlari.length);
    }

    /**
     * Zor bot için hamle stratejisi
     * @param {number} botId - Bot ID'si
     * @returns {number} Atılacak kartın indeksi
     */
    botZorHamleYap(botId) {
        const botKartlari = this.botKartlari[botId];
        if (botKartlari.length === 0) return -1;
        
        // İleri strateji: En az faydalı kartı at
        
        // 1. Joker'leri elde tut
        const jokerOlmayanKartlar = botKartlari.filter(k => k.isJoker === false);
        if (jokerOlmayanKartlar.length === 0) {
            // Sadece Joker'ler kaldıysa birini at
            return botKartlari.findIndex(k => k.isJoker === true);
        }
        
        // 2. Her kart için bir "fayda puanı" hesapla
        const kartFaydaPuanlari = botKartlari.map((kart, indeks) => {
            if (kart.isJoker) return { indeks, puan: 100 }; // Joker'ler çok değerli
            
            let puan = 0;
            
            // Aynı renkteki kartları kontrol et
            const ayniRenkKartlar = botKartlari.filter(k => k.renk === kart.renk && k !== kart);
            puan += ayniRenkKartlar.length * 10;
            
            // Aynı elementteki kartları kontrol et
            const ayniElementKartlar = botKartlari.filter(k => k.element === kart.element && k !== kart);
            puan += ayniElementKartlar.length * 5;
            
            // Sıralı kartları kontrol et
            const kartDegeri = this.elementSayisalDeger(kart.element);
            const ardisilKartlar = botKartlari.filter(k => 
                k.renk === kart.renk && 
                k !== kart && 
                Math.abs(this.elementSayisalDeger(k.element) - kartDegeri) === 1
            );
            
            puan += ardisilKartlar.length * 15;
            
            return { indeks, puan };
        });
        
        // En düşük fayda puanına sahip kartı bul
        kartFaydaPuanlari.sort((a, b) => a.puan - b.puan);
        return kartFaydaPuanlari[0].indeks;
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
     * Tüm kartları otomatik olarak kontrol eder ve geriye 1 kart kalıyorsa başarılı sayar
     * @returns {boolean} İşlem başarılı oldu mu
     */
    tumKartlariKontrolEt() {
        // Oyuncu kartlarını kopyala
        const oyuncuKartlariKopya = [...this.oyuncuKartlari];
        
        // Kartları atom_no'ya göre sırala
        oyuncuKartlariKopya.sort((a, b) => {
            if (a.isJoker) return -1; // Jokerler önce
            if (b.isJoker) return 1;
            return a.atom_no - b.atom_no;
        });
        
        // Gruplara ayır (periyot bazlı ve grup bazlı)
        const periyotGruplari = {};
        const grupGruplari = {};
        
        // Normal kartlar için
        const normalKartlar = oyuncuKartlariKopya.filter(kart => !kart.isJoker);
        normalKartlar.forEach(kart => {
            // Periyot bazlı gruplama
            if (!periyotGruplari[kart.periyot]) {
                periyotGruplari[kart.periyot] = [];
            }
            periyotGruplari[kart.periyot].push(kart);
            
            // Grup bazlı gruplama
            if (!grupGruplari[kart.grup]) {
                grupGruplari[kart.grup] = [];
            }
            grupGruplari[kart.grup].push(kart);
        });
        
        // Jokerler
        const jokerler = oyuncuKartlariKopya.filter(kart => kart.isJoker);
        console.log(`Joker sayısı: ${jokerler.length}`);
        
        // Geçerli kombinasyonları bul
        const gecerliKombinasyonlar = [];
        
        // Periyot bazlı kombinasyonlar
        for (const periyot in periyotGruplari) {
            const kartlar = periyotGruplari[periyot];
            
            // En az 3 kart varsa (jokerler olmadan)
            if (kartlar.length >= 3) {
                gecerliKombinasyonlar.push([...kartlar]);
            }
            // 2 kart varsa ve 1 joker varsa
            else if (kartlar.length === 2 && jokerler.length >= 1) {
                gecerliKombinasyonlar.push([...kartlar, jokerler[0]]);
            }
            // 1 kart varsa ve 2 joker varsa
            else if (kartlar.length === 1 && jokerler.length >= 2) {
                gecerliKombinasyonlar.push([...kartlar, jokerler[0], jokerler[1]]);
            }
        }
        
        // Grup bazlı kombinasyonlar
        for (const grup in grupGruplari) {
            const kartlar = grupGruplari[grup];
            
            // En az 3 kart varsa (jokerler olmadan)
            if (kartlar.length >= 3) {
                gecerliKombinasyonlar.push([...kartlar]);
            }
            // 2 kart varsa ve 1 joker varsa
            else if (kartlar.length === 2 && jokerler.length >= 1) {
                // Eğer bu joker henüz kullanılmadıysa
                if (jokerler.length > 0 && !gecerliKombinasyonlar.some(k => k.includes(jokerler[0]))) {
                    gecerliKombinasyonlar.push([...kartlar, jokerler[0]]);
                }
            }
            // 1 kart varsa ve 2 joker varsa
            else if (kartlar.length === 1 && jokerler.length >= 2) {
                // Eğer bu jokerler henüz kullanılmadıysa
                const kullanilabilirJokerler = jokerler.filter(j => 
                    !gecerliKombinasyonlar.some(k => k.includes(j))
                );
                if (kullanilabilirJokerler.length >= 2) {
                    gecerliKombinasyonlar.push([...kartlar, kullanilabilirJokerler[0], kullanilabilirJokerler[1]]);
                }
            }
        }
        
        // Sıralı atom numarası kombinasyonları
        // Atom numaralarını sırala
        const sıraliAtomNolar = [...new Set(normalKartlar.map(k => k.atom_no))].sort((a, b) => a - b);
        
        // Ardışık 3 veya daha fazla atom numarası var mı kontrol et
        for (let i = 0; i < sıraliAtomNolar.length - 2; i++) {
            if (sıraliAtomNolar[i + 1] === sıraliAtomNolar[i] + 1 && 
                sıraliAtomNolar[i + 2] === sıraliAtomNolar[i] + 2) {
                // Ardışık 3 atom numarası bulundu
                const ardisikKartlar = normalKartlar.filter(k => 
                    k.atom_no === sıraliAtomNolar[i] || 
                    k.atom_no === sıraliAtomNolar[i + 1] || 
                    k.atom_no === sıraliAtomNolar[i + 2]
                );
                gecerliKombinasyonlar.push(ardisikKartlar);
            }
        }
        
        // Eğer hiç geçerli kombinasyon bulunamadıysa ve sadece jokerler varsa
        if (gecerliKombinasyonlar.length === 0 && jokerler.length >= 3) {
            gecerliKombinasyonlar.push(jokerler.slice(0, 3));
        }
        
        // Eğer hiç geçerli kombinasyon yoksa başarısız
        if (gecerliKombinasyonlar.length === 0) {
            console.log("Geçerli kombinasyon bulunamadı");
            return false;
        }
        
        console.log(`${gecerliKombinasyonlar.length} geçerli kombinasyon bulundu`);
        
        // Kullanılacak kartları belirle
        const kullanilacakKartlar = new Set();
        gecerliKombinasyonlar.forEach(kombinasyon => {
            kombinasyon.forEach(kart => {
                kullanilacakKartlar.add(kart.id);
            });
        });
        
        // Kartların tümünü kontrol et ve sadece 1 kart kalıyor mu bak
        const kullanilacakKartSayisi = kullanilacakKartlar.size;
        if (kullanilacakKartSayisi < this.oyuncuKartlari.length - 1) {
            console.log(`Kullanılacak kart sayısı: ${kullanilacakKartSayisi}, Toplam: ${this.oyuncuKartlari.length}`);
            console.log("Çok fazla kart kalıyor, başarısız");
            return false;
        }
        
        // Kullanılacak kartları oyuncunun elinden çıkar
        const kullanilacakKartIdleri = Array.from(kullanilacakKartlar);
        kullanilacakKartIdleri.forEach(kartId => {
            const kartIndex = this.oyuncuKartlari.findIndex(kart => kart.id === kartId);
            if (kartIndex !== -1) {
                this.oyuncuKartlari.splice(kartIndex, 1);
            }
        });
        
        // Eğer hiç kart kalmadıysa, oyuncu kazandı
        if (this.oyuncuKartlari.length === 0) {
            this.oyunDurumu = 'bitti';
            this.kazananOyuncu = 0;
            this.oyuncuPuani += 1;
            
            // Yeni el başlat
            setTimeout(() => {
                this.yeniElBaslat();
            }, 1500);
        }
        
        return true;
    }
}

// Global olarak erişilebilmesi için
window.PeriyodikOkey = PeriyodikOkey; 