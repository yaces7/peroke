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
        this.botZorlukSeviyesi = 'orta'; // kolay, orta, zor
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
        
        // Oyuncunun kartı kalmazsa otomatik kart ver
        if (this.oyuncuKartlari.length === 0) {
            this.oyuncuKartlari.push(cekilenKart);
            return this.kartiCek(); // Tekrar kart çek
        }
        
        this.oyuncuKartlari.push(cekilenKart);
        return cekilenKart;
    }

    // Desteyi yenile
    desteyiYenile() {
        console.log("Deste yenileniyor...");
        // Bu fonksiyon ilerde eklenecek
        // Şimdilik yeni deste oluştur
        this.desteOlustur();
        this.desteyiKaristir();
    }

    // Açık kartı al
    acikKartiAl() {
        if (this.kartCekildi) {
            throw new Error("Bu turda zaten kart çektiniz!");
        }
        
        if (!this.acikKart) {
            throw new Error("Açık kart bulunmuyor!");
        }
        
        const alinanKart = this.acikKart;
        this.acikKart = null;
        this.kartCekildi = true;
        this.oyuncuKartlari.push(alinanKart);
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

    // Kombinasyon kontrolü - Yeni kurallar
    kombinasyonKontrolEt(kartIdListesi) {
        const kartlar = kartIdListesi.map(id => 
            this.oyuncuKartlari.find(k => k.id === id)
        ).filter(k => k !== undefined);

        // En az 3 kart gerekli
        if (kartlar.length < 3) return false;

        // Farklı periyot sayısı kontrolü - en az 4 farklı periyot olmalı
        const farkliPeriyotlar = new Set(kartlar.filter(k => !k.isJoker).map(k => k.periyot));
        const yeterliPeriyot = farkliPeriyotlar.size >= 4;

        // Farklı grup sayısı kontrolü - en az 3 farklı grup olmalı
        const farkliGruplar = new Set(kartlar.filter(k => !k.isJoker).map(k => k.grup));
        const yeterliGrup = farkliGruplar.size >= 3;

        // Aynı grup veya aynı periyot kontrolü
        const ayniGrup = this.ayniGrupKontrolu(kartlar);
        const ayniPeriyot = this.ayniPeriyotKontrolu(kartlar);

        // Geçerli kombinasyon: En az 4 periyot VE en az 3 grup VE (aynı gruptan VEYA aynı periyottan)
        return yeterliPeriyot && yeterliGrup && (ayniGrup || ayniPeriyot);
    }
    
    // Aynı grup kontrolü
    ayniGrupKontrolu(kartlar) {
        // Joker olmayan kartları ve jokerleri ayır
        const jokerler = kartlar.filter(k => k.isJoker);
        const normalKartlar = kartlar.filter(k => !k.isJoker);
        
        if (normalKartlar.length === 0) return true; // Hepsi joker ise geçerli
        
        const referansGrup = normalKartlar[0].grup;
        const uyumsuzKartSayisi = normalKartlar.filter(k => k.grup !== referansGrup).length;
        
        // Joker sayısı, uyumsuz kart sayısına eşit veya büyükse kombinasyon geçerli
        return uyumsuzKartSayisi <= jokerler.length;
    }
    
    // Aynı periyot kontrolü
    ayniPeriyotKontrolu(kartlar) {
        // Joker olmayan kartları ve jokerleri ayır
        const jokerler = kartlar.filter(k => k.isJoker);
        const normalKartlar = kartlar.filter(k => !k.isJoker);
        
        if (normalKartlar.length === 0) return true; // Hepsi joker ise geçerli
        
        const referansPeriyot = normalKartlar[0].periyot;
        const uyumsuzKartSayisi = normalKartlar.filter(k => k.periyot !== referansPeriyot).length;
        
        // Joker sayısı, uyumsuz kart sayısına eşit veya büyükse kombinasyon geçerli
        return uyumsuzKartSayisi <= jokerler.length;
    }

    // Yıldız ekle
    yildizEkle(oyuncu = 'oyuncu') {
        const mevcutYildiz = this.oyuncuYildizlari.get(oyuncu) || 0;
        this.oyuncuYildizlari.set(oyuncu, mevcutYildiz + 1);

        // Oyun bitişi kontrolü - 3 yıldıza ulaşan kazanır
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

    // Son kartı bota verme
    sonKartiBotaVer() {
        if (this.oyuncuKartlari.length !== 1) {
            throw new Error("Son kartı vermek için elinizde tek kart olmalıdır!");
        }

        const verilenKart = this.oyuncuKartlari.pop();
        this.acikKart = verilenKart;
        this.kartCekildi = false;
        
        // Turu bitirir ve yıldız ekler
        const oyunBitti = this.yildizEkle('oyuncu');
        
        // Turu bitir
        this.siradakiOyuncuyaGec();
        
        return {
            kart: verilenKart,
            oyunBitti: oyunBitti
        };
    }

    // Bot hamlesi yap
    botHamlesiYap() {
        const botId = `bot${this.siradakiOyuncu}`;
        const botKartlari = this.botKartlari.get(botId);

        if (!botKartlari || botKartlari.length === 0) {
            // Botun kartı yoksa yeni kart çekilir
            if (this.deste.length === 0) {
                this.desteyiYenile();
            }
            botKartlari.push(this.deste.pop());
        }

        // Zorluk seviyesine göre bot stratejisini belirle
        switch (this.botZorlukSeviyesi) {
            case 'kolay':
                this.kolayBotHamlesi(botId, botKartlari);
                break;
            case 'zor':
                this.zorBotHamlesi(botId, botKartlari);
                break;
            default:
                this.ortaBotHamlesi(botId, botKartlari);
                break;
        }

        // Bot kombinasyon kontrolü
        this.botKombinasyonKontrolEt(botId);

        this.siradakiOyuncuyaGec();
    }
    
    // Kolay bot stratejisi - Tamamen rastgele kararlar
    kolayBotHamlesi(botId, botKartlari) {
        // Rastgele kart çekme veya açık kartı alma
        if (Math.random() < 0.5 && this.acikKart) {
            botKartlari.push(this.acikKart);
            this.acikKart = null;
        } else {
            if (this.deste.length === 0) {
                this.desteyiYenile();
            }
            botKartlari.push(this.deste.pop());
        }

        // Rastgele bir kart at
        const atilacakKartIndex = Math.floor(Math.random() * botKartlari.length);
        this.acikKart = botKartlari.splice(atilacakKartIndex, 1)[0];
    }
    
    // Orta bot stratejisi - Bazı basit stratejik kararlar
    ortaBotHamlesi(botId, botKartlari) {
        let kartCekildi = false;
        
        // Açık kartın grup veya periyotuna sahip bir kart varsa, açık kartı al
        if (this.acikKart && !this.acikKart.isJoker) {
            const benzerKartVar = botKartlari.some(k => 
                !k.isJoker && (k.grup === this.acikKart.grup || k.periyot === this.acikKart.periyot)
            );
            
            if (benzerKartVar) {
                botKartlari.push(this.acikKart);
                this.acikKart = null;
                kartCekildi = true;
            }
        }
        
        // Açık kart joker ise her zaman al
        if (!kartCekildi && this.acikKart && this.acikKart.isJoker) {
            botKartlari.push(this.acikKart);
            this.acikKart = null;
            kartCekildi = true;
        }
        
        // Eğer açık kart alınmadıysa, desteden çek
        if (!kartCekildi) {
            if (this.deste.length === 0) {
                this.desteyiYenile();
            }
            botKartlari.push(this.deste.pop());
        }
        
        // En az faydalı kartı at (az benzerliği olan)
        const atilacakKartIndex = this.enAzFaydaliKartiBul(botKartlari);
        this.acikKart = botKartlari.splice(atilacakKartIndex, 1)[0];
    }
    
    // Zor bot stratejisi - Daha karmaşık ve etkili kararlar
    zorBotHamlesi(botId, botKartlari) {
        // Mevcut kartlarla hangi grup ve periyotlardan kartlar var analiz et
        const grupAnalizi = this.botKartlariniAnalizeEt(botKartlari, 'grup');
        const periyotAnalizi = this.botKartlariniAnalizeEt(botKartlari, 'periyot');
        
        let kartCekildi = false;
        
        // Açık kartın mevcut gruplardaki veya periyotlardaki kart sayısına göre değerlendir
        if (this.acikKart && !this.acikKart.isJoker) {
            const acikKartGrupSayisi = grupAnalizi[this.acikKart.grup] || 0;
            const acikKartPeriyotSayisi = periyotAnalizi[this.acikKart.periyot] || 0;
            
            // Eğer açık kart, mevcut 2 veya daha fazla karta uyuyorsa al
            if (acikKartGrupSayisi >= 2 || acikKartPeriyotSayisi >= 2) {
                botKartlari.push(this.acikKart);
                this.acikKart = null;
                kartCekildi = true;
            }
        }
        
        // Açık kart joker ise her zaman al
        if (!kartCekildi && this.acikKart && this.acikKart.isJoker) {
            botKartlari.push(this.acikKart);
            this.acikKart = null;
            kartCekildi = true;
        }
        
        // Eğer açık kart alınmadıysa, desteden çek
        if (!kartCekildi) {
            if (this.deste.length === 0) {
                this.desteyiYenile();
            }
            botKartlari.push(this.deste.pop());
        }
        
        // En az faydalı kartı at (grup ve periyot analizine göre)
        const atilacakKartIndex = this.enAzFaydaliKartiBul(botKartlari, true);
        this.acikKart = botKartlari.splice(atilacakKartIndex, 1)[0];
    }
    
    // Bot kartlarını analiz et
    botKartlariniAnalizeEt(botKartlari, ozellik) {
        const analiz = {};
        
        botKartlari.forEach(kart => {
            if (!kart.isJoker) {
                const deger = kart[ozellik];
                analiz[deger] = (analiz[deger] || 0) + 1;
            }
        });
        
        return analiz;
    }
    
    // En az faydalı kartı bul
    enAzFaydaliKartiBul(botKartlari, gelismisAnaliz = false) {
        // Joker kartları asla atma
        const jokerOlmayanKartlar = botKartlari.filter(k => !k.isJoker);
        
        if (jokerOlmayanKartlar.length === 0) {
            // Tüm kartlar joker ise (çok nadir durum), rastgele birini at
            return Math.floor(Math.random() * botKartlari.length);
        }
        
        if (!gelismisAnaliz) {
            // Basit analiz - her kartın grup ve periyot benzerliklerini kontrol et
            const kartFaydalari = jokerOlmayanKartlar.map((kart, index) => {
                let benzerlikSayisi = 0;
                
                jokerOlmayanKartlar.forEach((digerKart, digerIndex) => {
                    if (index !== digerIndex) {
                        if (kart.grup === digerKart.grup || kart.periyot === digerKart.periyot) {
                            benzerlikSayisi++;
                        }
                    }
                });
                
                return { index: botKartlari.indexOf(kart), benzerlik: benzerlikSayisi };
            });
            
            // En az benzerliği olan kartı bul
            kartFaydalari.sort((a, b) => a.benzerlik - b.benzerlik);
            return kartFaydalari[0].index;
        } else {
            // Gelişmiş analiz - grup ve periyot dağılımlarını analiz et
            const grupAnalizi = this.botKartlariniAnalizeEt(botKartlari, 'grup');
            const periyotAnalizi = this.botKartlariniAnalizeEt(botKartlari, 'periyot');
            
            const kartFaydalari = jokerOlmayanKartlar.map(kart => {
                const grupFaydasi = grupAnalizi[kart.grup] || 0;
                const periyotFaydasi = periyotAnalizi[kart.periyot] || 0;
                const toplamFayda = grupFaydasi + periyotFaydasi;
                
                return { kart, toplamFayda };
            });
            
            // En az faydalı kartı seç
            kartFaydalari.sort((a, b) => a.toplamFayda - b.toplamFayda);
            return botKartlari.indexOf(kartFaydalari[0].kart);
        }
    }

    // Bot kombinasyon kontrolü
    botKombinasyonKontrolEt(botId) {
        const botKartlari = this.botKartlari.get(botId);
        if (!botKartlari || botKartlari.length < 3) return false;
        
        // Bot için kombinasyon bulma
        const grupluKartlar = this.botGrupluKartlariBul(botKartlari);
        const periyotluKartlar = this.botPeriyotluKartlariBul(botKartlari);
        
        // En iyi kombinasyonu seç
        let enIyiKombinasyon = null;
        
        if (grupluKartlar.length >= 3 && periyotluKartlar.length >= 3) {
            // Hem grup hem periyot kombinasyonu varsa, daha uzun olanı seç
            enIyiKombinasyon = grupluKartlar.length > periyotluKartlar.length ? grupluKartlar : periyotluKartlar;
        } else if (grupluKartlar.length >= 3) {
            enIyiKombinasyon = grupluKartlar;
        } else if (periyotluKartlar.length >= 3) {
            enIyiKombinasyon = periyotluKartlar;
        }
        
        if (enIyiKombinasyon) {
            // Kombinasyon yeterli mi kontrol et: en az 4 periyot ve en az 3 grup
            const farkliPeriyotlar = new Set(enIyiKombinasyon.filter(k => !k.isJoker).map(k => k.periyot));
            const farkliGruplar = new Set(enIyiKombinasyon.filter(k => !k.isJoker).map(k => k.grup));
            
            if (farkliPeriyotlar.size >= 4 && farkliGruplar.size >= 3) {
                // Kartları elden çıkar
                enIyiKombinasyon.forEach(kart => {
                    const kartIndex = botKartlari.findIndex(k => k.id === kart.id);
                    if (kartIndex !== -1) {
                        botKartlari.splice(kartIndex, 1);
                    }
                });
                
                // Bot yıldız kazandı
                return this.yildizEkle(botId);
            }
        }
        
        return false;
    }
    
    // Botun grup kombinasyonlarını bulması
    botGrupluKartlariBul(botKartlari) {
        const jokerler = botKartlari.filter(k => k.isJoker);
        const normalKartlar = botKartlari.filter(k => !k.isJoker);
        
        const grupListesi = Array.from(new Set(normalKartlar.map(k => k.grup)));
        
        let enIyiKombinasyon = [];
        
        grupListesi.forEach(grup => {
            const gruptakiKartlar = normalKartlar.filter(k => k.grup === grup);
            
            if (gruptakiKartlar.length + jokerler.length >= 3) {
                const farkliPeriyotlar = new Set(gruptakiKartlar.map(k => k.periyot));
                
                // En az 4 periyot ve 3 grup varsa kombinasyon geçerli
                if (farkliPeriyotlar.size + jokerler.length >= 4) {
                    const kombinasyon = [...gruptakiKartlar];
                    
                    // Gerekirse joker ekle
                    for (let i = 0; i < jokerler.length && i < 4 - farkliPeriyotlar.size; i++) {
                        kombinasyon.push(jokerler[i]);
                    }
                    
                    if (kombinasyon.length > enIyiKombinasyon.length) {
                        enIyiKombinasyon = kombinasyon;
                    }
                }
            }
        });
        
        return enIyiKombinasyon;
    }
    
    // Botun periyot kombinasyonlarını bulması
    botPeriyotluKartlariBul(botKartlari) {
        const jokerler = botKartlari.filter(k => k.isJoker);
        const normalKartlar = botKartlari.filter(k => !k.isJoker);
        
        const periyotListesi = Array.from(new Set(normalKartlar.map(k => k.periyot)));
        
        let enIyiKombinasyon = [];
        
        periyotListesi.forEach(periyot => {
            const periyottakiKartlar = normalKartlar.filter(k => k.periyot === periyot);
            
            if (periyottakiKartlar.length + jokerler.length >= 3) {
                const farkliGruplar = new Set(periyottakiKartlar.map(k => k.grup));
                
                // En az 3 grup varsa kombinasyon geçerli
                if (farkliGruplar.size + jokerler.length >= 3) {
                    const kombinasyon = [...periyottakiKartlar];
                    
                    // Gerekirse joker ekle
                    for (let i = 0; i < jokerler.length && i < 3 - farkliGruplar.size; i++) {
                        kombinasyon.push(jokerler[i]);
                    }
                    
                    if (kombinasyon.length > enIyiKombinasyon.length) {
                        enIyiKombinasyon = kombinasyon;
                    }
                }
            }
        });
        
        return enIyiKombinasyon;
    }
}

// Global erişim için
window.PeriyodikOkey = PeriyodikOkey; 