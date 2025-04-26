/**
 * Periyodik Okey - Oyun Mantığı
 * Oyunun temel kuralları ve işleyişi
 */

class PeriyodikOkey {
    constructor() {
        this.oyuncuKartlari = [];
        this.botKartlari = new Map(); // Her bot için kartlar
        this.deste = [];
        this.acikKart = null;
        this.siradakiOyuncu = 0; // 0: oyuncu, 1-3: botlar
        this.oyuncuYildizlari = new Map(); // Oyuncu ve botların yıldızları
        this.oyunDurumu = 'bekliyor'; // bekliyor, devam, bitti
        this.kartCekildi = false;
    }

    // Oyunu başlat
    oyunuBaslat(botSayisi = 3) {
        this.desteOlustur();
        this.desteyiKaristir();
        this.kartlariDagit(botSayisi);
        this.oyunDurumu = 'devam';
        this.siradakiOyuncu = 0;
        this.kartCekildi = false;

        // Yıldızları sıfırla
        this.oyuncuYildizlari.clear();
        this.oyuncuYildizlari.set('oyuncu', 0);
        for (let i = 1; i <= botSayisi; i++) {
            this.oyuncuYildizlari.set(`bot${i}`, 0);
        }

        return {
            oyuncuKartlari: this.oyuncuKartlari,
            botKartSayilari: Array.from(this.botKartlari.values()).map(kartlar => kartlar.length),
            kalanKart: this.deste.length
        };
    }

    // Desteyi oluştur
    desteOlustur() {
        this.deste = [];
        // Her elementten 2 adet olacak şekilde desteyi oluştur
        ELEMENT_VERILERI.forEach(element => {
            this.deste.push({ ...element, id: `${element.atom_no}_1` });
            this.deste.push({ ...element, id: `${element.atom_no}_2` });
        });
        // 4 joker ekle
        for (let i = 1; i <= 4; i++) {
            this.deste.push({
                id: `joker_${i}`,
                isJoker: true,
                sembol: 'J',
                isim: 'Joker'
            });
        }
    }

    // Desteyi karıştır
    desteyiKaristir() {
        for (let i = this.deste.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deste[i], this.deste[j]] = [this.deste[j], this.deste[i]];
        }
    }

    // Kartları dağıt
    kartlariDagit(botSayisi) {
        // Oyuncuya 14 kart
        this.oyuncuKartlari = this.deste.splice(0, 14);

        // Her bota 14 kart
        this.botKartlari.clear();
        for (let i = 1; i <= botSayisi; i++) {
            this.botKartlari.set(`bot${i}`, this.deste.splice(0, 14));
        }

        // Açık kart
        this.acikKart = this.deste.splice(0, 1)[0];
    }

    // Desteden kart çek
    kartiCek() {
        if (this.kartCekildi) {
            throw new Error("Bu turda zaten kart çektiniz!");
        }

        if (this.deste.length === 0) {
            this.desteyiYenile();
        }

        const cekilenKart = this.deste.pop();
        this.kartCekildi = true;
        return cekilenKart;
    }

    // Açık kartı al
    acikKartiAl() {
        if (this.kartCekildi) {
            throw new Error("Bu turda zaten kart çektiniz!");
        }

        const alinanKart = this.acikKart;
        this.acikKart = null;
        this.kartCekildi = true;
        return alinanKart;
    }

    // Kart ver (elden at)
    kartVer(kartId) {
        const kartIndex = this.oyuncuKartlari.findIndex(k => k.id === kartId);
        if (kartIndex === -1) {
            throw new Error("Kart bulunamadı!");
        }

        const verilenKart = this.oyuncuKartlari.splice(kartIndex, 1)[0];
        this.acikKart = verilenKart;
        this.kartCekildi = false;
        this.siradakiOyuncuyaGec();
        return verilenKart;
    }

    // Kombinasyon kontrolü
    kombinasyonKontrolEt(kartIdListesi) {
        const kartlar = kartIdListesi.map(id => 
            this.oyuncuKartlari.find(k => k.id === id)
        ).filter(k => k !== undefined);

        if (kartlar.length < 3) return false;

        // Aynı grup kontrolü
        const ayniGrup = kartlar.every(k => k.grup === kartlar[0].grup);
        
        // Aynı periyot kontrolü
        const ayniPeriyot = kartlar.every(k => k.periyot === kartlar[0].periyot);

        // Joker kartlar her yere uyar
        const jokerSayisi = kartlar.filter(k => k.isJoker).length;
        const normalKartlar = kartlar.filter(k => !k.isJoker);

        if (jokerSayisi > 0) {
            // Jokerli kombinasyonları kontrol et
            if (normalKartlar.length >= 2) {
                const ayniGrupJokerli = normalKartlar.every(k => k.grup === normalKartlar[0].grup);
                const ayniPeriyotJokerli = normalKartlar.every(k => k.periyot === normalKartlar[0].periyot);
                if (ayniGrupJokerli || ayniPeriyotJokerli) return true;
            }
        }

        return ayniGrup || ayniPeriyot;
    }

    // Yıldız ekle
    yildizEkle(oyuncu = 'oyuncu') {
        const mevcutYildiz = this.oyuncuYildizlari.get(oyuncu) || 0;
        this.oyuncuYildizlari.set(oyuncu, mevcutYildiz + 1);

        // Oyun bitişi kontrolü
        if (mevcutYildiz + 1 >= 3) {
            this.oyunDurumu = 'bitti';
            return true;
        }
        return false;
    }

    // Sıradaki oyuncuya geç
    siradakiOyuncuyaGec() {
        this.siradakiOyuncu = (this.siradakiOyuncu + 1) % (this.botKartlari.size + 1);
        this.kartCekildi = false;
    }

    // Bot hamlesi yap
    botHamlesiYap() {
        const botId = `bot${this.siradakiOyuncu}`;
        const botKartlari = this.botKartlari.get(botId);

        // Basit bot stratejisi: Rastgele kart çek ve at
        if (Math.random() < 0.5 && this.acikKart) {
            // Açık kartı al
            botKartlari.push(this.acikKart);
            this.acikKart = null;
        } else {
            // Desteden çek
            botKartlari.push(this.deste.pop());
        }

        // Rastgele bir kart at
        const atilacakKartIndex = Math.floor(Math.random() * botKartlari.length);
        this.acikKart = botKartlari.splice(atilacakKartIndex, 1)[0];

        // Bot kombinasyon kontrolü
        this.botKombinasyonKontrolEt(botId);

        this.siradakiOyuncuyaGec();
    }

    // Bot kombinasyon kontrolü
    botKombinasyonKontrolEt(botId) {
        const botKartlari = this.botKartlari.get(botId);
        
        // Grup ve periyotlara göre kartları grupla
        const gruplar = new Map();
        const periyotlar = new Map();

        botKartlari.forEach(kart => {
            if (!kart.isJoker) {
                // Gruplara göre
                if (!gruplar.has(kart.grup)) gruplar.set(kart.grup, []);
                gruplar.get(kart.grup).push(kart);

                // Periyotlara göre
                if (!periyotlar.has(kart.periyot)) periyotlar.set(kart.periyot, []);
                periyotlar.get(kart.periyot).push(kart);
            }
        });

        // 3 veya daha fazla aynı grup/periyot varsa yıldız kazan
        let kombinasyonVar = false;
        gruplar.forEach(kartlar => {
            if (kartlar.length >= 3) kombinasyonVar = true;
        });
        periyotlar.forEach(kartlar => {
            if (kartlar.length >= 3) kombinasyonVar = true;
        });

        if (kombinasyonVar) {
            this.yildizEkle(botId);
        }
    }
}

// Global erişim için
window.PeriyodikOkey = PeriyodikOkey; 