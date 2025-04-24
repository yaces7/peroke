/**
 * Oyun Alanı Sınıfı
 * Oyun alanını ve oyun mantığını yöneten sınıf
 */

// Global olarak OyunAlani sınıfını tanımla
window.OyunAlani = class OyunAlani {
    /**
     * Oyun alanını oluşturur
     * @param {Object} ayarlar Oyun ayarları
     */
    constructor(ayarlar = {}) {
        console.log("OyunAlani başlatılıyor...");
        // Varsayılan ayarlar
        this.ayarlar = {
            oyuncuSayisi: 2,
            botSayisi: 1,
            zorlukSeviyesi: 'orta',
            baslangicKartSayisi: 7,
            jokerKullan: true,
            ...ayarlar
        };
        
        // Oyun durumu
        this.durum = {
            aktifOyuncu: 0,
            oyunBasladi: false,
            oyunBitti: false,
            tur: 0,
            kartlar: [],
            desteler: {
                ana: [],
                acik: []
            },
            oyuncular: [],
            seciliKartlar: []
        };
        
        // DOM elementleri
        this.elementler = {
            oyunAlani: document.getElementById('oyun-alani'),
            desteler: {
                ana: document.getElementById('ana-deste'),
                acik: document.getElementById('acik-deste')
            },
            oyuncuAlanlari: document.getElementById('oyuncu-alanlari'),
            bilgiPanel: document.getElementById('bilgi-panel'),
            turBilgisi: document.getElementById('tur-bilgisi')
        };
        
        // Event dinleyicileri
        this._eventDinleyicileriniEkle();
    }
    
    /**
     * Oyunu başlatır
     */
    oyunuBaslat() {
        // Oyun alanını temizle
        this._alaniTemizle();
        
        // Oyuncuları oluştur
        this._oyunculariOlustur();
        
        // Desteyi oluştur
        this._desteyiOlustur();
        
        // Kartları dağıt
        this._kartlariDagit();
        
        // Açık desteye ilk kartı koy
        this._acikDesteyeKartEkle(this.durum.desteler.ana.pop());
        
        // Oyun durumunu güncelle
        this.durum.oyunBasladi = true;
        this.durum.tur = 1;
        
        // Arayüzü güncelle
        this._arayuzuGuncelle();
        
        // İlk oyuncuyu aktif yap
        this.siradakiOyuncu();
        
        console.log('Oyun başladı!');
    }
    
    /**
     * Oyunu sıfırlar
     */
    oyunuSifirla() {
        // Oyun durumunu sıfırla
        this.durum = {
            aktifOyuncu: 0,
            oyunBasladi: false,
            oyunBitti: false,
            tur: 0,
            kartlar: [],
            desteler: {
                ana: [],
                acik: []
            },
            oyuncular: [],
            seciliKartlar: []
        };
        
        // Alanı temizle
        this._alaniTemizle();
        
        console.log('Oyun sıfırlandı!');
    }
    
    /**
     * Ana desteden kart çeker
     * @returns {ElementKarti|null} Çekilen kart veya null
     */
    kartCek() {
        if (this.durum.desteler.ana.length === 0) {
            this._desteyiYenile();
        }
        
        if (this.durum.desteler.ana.length === 0) {
            console.log('Destede kart kalmadı!');
            return null;
        }
        
        const kart = this.durum.desteler.ana.pop();
        return kart;
    }
    
    /**
     * Oyuncunun seçtiği kartı açık desteye atar
     * @param {ElementKarti} kart Atılacak kart
     * @returns {boolean} İşlem başarılı mı
     */
    kartAt(kart) {
        if (!kart) return false;
        
        const aktifOyuncu = this.durum.oyuncular[this.durum.aktifOyuncu];
        
        // Kartı oyuncunun elinden çıkar
        const kartIndex = aktifOyuncu.el.findIndex(k => k.id === kart.id);
        if (kartIndex === -1) return false;
        
        aktifOyuncu.el.splice(kartIndex, 1);
        
        // Kartı açık desteye ekle
        this._acikDesteyeKartEkle(kart);
        
        // Oyuncunun elini güncelle
        this._oyuncuEliniGuncelle(this.durum.aktifOyuncu);
        
        return true;
    }
    
    /**
     * Bir sonraki oyuncuya geçer
     */
    siradakiOyuncu() {
        // Önceki oyuncuyu pasif yap
        if (this.durum.oyuncular[this.durum.aktifOyuncu]) {
            this.durum.oyuncular[this.durum.aktifOyuncu].aktif = false;
        }
        
        // Bir sonraki oyuncuya geç
        this.durum.aktifOyuncu = (this.durum.aktifOyuncu + 1) % this.durum.oyuncular.length;
        
        // Yeni oyuncuyu aktif yap
        this.durum.oyuncular[this.durum.aktifOyuncu].aktif = true;
        
        // Tur sayısını güncelle
        if (this.durum.aktifOyuncu === 0) {
            this.durum.tur++;
        }
        
        // Arayüzü güncelle
        this._arayuzuGuncelle();
        
        // Bot ise hamlesini yap
        if (this.durum.oyuncular[this.durum.aktifOyuncu].bot) {
            setTimeout(() => this._botHamlesiYap(), 1000);
        }
    }
    
    /**
     * Kartı seçili olarak işaretler
     * @param {ElementKarti} kart Seçilecek kart
     */
    kartSec(kart) {
        // Daha önce seçilmişse, seçimi kaldır
        const seciliIndex = this.durum.seciliKartlar.findIndex(k => k.id === kart.id);
        
        if (seciliIndex !== -1) {
            this.durum.seciliKartlar.splice(seciliIndex, 1);
            kart.seciliDurumAyarla(false);
        } else {
            // Yeni kart seç
            this.durum.seciliKartlar.push(kart);
            kart.seciliDurumAyarla(true);
        }
    }
    
    /**
     * Oyuncuya yeni kart verir
     * @param {number} oyuncuIndex Oyuncu indeksi
     * @param {ElementKarti} kart Verilecek kart
     */
    oyuncuyaKartVer(oyuncuIndex, kart) {
        if (!kart) return;
        
        this.durum.oyuncular[oyuncuIndex].el.push(kart);
        this._oyuncuEliniGuncelle(oyuncuIndex);
    }
    
    /**
     * Özel kart kombinasyonu oluşturur
     * @param {Array<ElementKarti>} kartlar Seçilen kartlar
     * @returns {boolean} Geçerli bir kombinasyon mu
     */
    kombinasyonOlustur(kartlar) {
        if (!kartlar || kartlar.length < 3) return false;
        
        // TODO: Kartların geçerli bir kombinasyon oluşturup oluşturmadığını kontrol et
        // Örneğin: Aynı grup, aynı periyot, ardışık elementler vs.
        
        return true;
    }
    
    // Private metotlar
    
    /**
     * Event dinleyicilerini ekler
     * @private
     */
    _eventDinleyicileriniEkle() {
        // Ana desteden kart çekme
        if (this.elementler.desteler.ana) {
            this.elementler.desteler.ana.addEventListener('click', () => {
                if (!this.durum.oyunBasladi || this.durum.oyunBitti) return;
                
                // Yalnızca sırası gelen insan oyuncular kart çekebilir
                const aktifOyuncu = this.durum.oyuncular[this.durum.aktifOyuncu];
                if (aktifOyuncu.bot) return;
                
                const kart = this.kartCek();
                if (kart) {
                    this.oyuncuyaKartVer(this.durum.aktifOyuncu, kart);
                    this.siradakiOyuncu();
                }
            });
        }
    }
    
    /**
     * Oyun alanını temizler
     * @private
     */
    _alaniTemizle() {
        // Oyuncu alanlarını temizle
        if (this.elementler.oyuncuAlanlari) {
            this.elementler.oyuncuAlanlari.innerHTML = '';
        }
        
        // Açık desteyi temizle
        if (this.elementler.desteler.acik) {
            this.elementler.desteler.acik.innerHTML = '';
        }
    }
    
    /**
     * Oyuncuları oluşturur
     * @private
     */
    _oyunculariOlustur() {
        this.durum.oyuncular = [];
        
        // İnsan oyuncuyu ekle
        this.durum.oyuncular.push({
            ad: 'Oyuncu 1',
            bot: false,
            el: [],
            puan: 0,
            aktif: false
        });
        
        // Bot oyuncuları ekle
        for (let i = 0; i < this.ayarlar.botSayisi; i++) {
            this.durum.oyuncular.push({
                ad: `Bot ${i + 1}`,
                bot: true,
                zorluk: this.ayarlar.zorlukSeviyesi,
                el: [],
                puan: 0,
                aktif: false
            });
        }
        
        // Oyuncu alanlarını oluştur
        this._oyuncuAlanlariniOlustur();
    }
    
    /**
     * Oyuncu alanlarını oluşturur
     * @private
     */
    _oyuncuAlanlariniOlustur() {
        if (!this.elementler.oyuncuAlanlari) return;
        
        this.elementler.oyuncuAlanlari.innerHTML = '';
        
        this.durum.oyuncular.forEach((oyuncu, index) => {
            const oyuncuDiv = document.createElement('div');
            oyuncuDiv.className = `oyuncu-alani ${oyuncu.bot ? 'bot' : 'insan'} ${oyuncu.aktif ? 'aktif' : ''}`;
            oyuncuDiv.id = `oyuncu-${index}`;
            
            // Oyuncu bilgileri
            const bilgiDiv = document.createElement('div');
            bilgiDiv.className = 'oyuncu-bilgi';
            bilgiDiv.innerHTML = `
                <div class="oyuncu-ad">${oyuncu.ad}</div>
                <div class="oyuncu-puan">Puan: <span id="oyuncu-${index}-puan">${oyuncu.puan}</span></div>
                <div class="oyuncu-kart-sayisi">Kart: <span id="oyuncu-${index}-kart-sayisi">${oyuncu.el.length}</span></div>
            `;
            
            // Oyuncu eli
            const elDiv = document.createElement('div');
            elDiv.className = 'oyuncu-el';
            elDiv.id = `oyuncu-${index}-el`;
            
            oyuncuDiv.appendChild(bilgiDiv);
            oyuncuDiv.appendChild(elDiv);
            
            this.elementler.oyuncuAlanlari.appendChild(oyuncuDiv);
        });
    }
    
    /**
     * Desteyi oluşturur
     * @private
     */
    _desteyiOlustur() {
        this.durum.desteler.ana = [];
        this.durum.desteler.acik = [];
        
        // Tüm elementleri al
        const elementler = elementleriFiltrele();
        
        // Her element için kart oluştur
        elementler.forEach(element => {
            const kart = new ElementKarti(element);
            this.durum.desteler.ana.push(kart);
        });
        
        // Joker kartlar ekle
        if (this.ayarlar.jokerKullan) {
            for (let i = 0; i < 2; i++) {
                const jokerKart = new ElementKarti({ 
                    atomNumarasi: 0,
                    sembol: 'J',
                    ad: 'Joker',
                    grup: 0,
                    periyot: 0,
                    kategori: 'Joker'
                }, `joker-${i}`);
                this.durum.desteler.ana.push(jokerKart);
            }
        }
        
        // Desteyi karıştır
        this._desteyiKaristir();
    }
    
    /**
     * Desteyi karıştırır
     * @private
     */
    _desteyiKaristir() {
        for (let i = this.durum.desteler.ana.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.durum.desteler.ana[i], this.durum.desteler.ana[j]] = 
                [this.durum.desteler.ana[j], this.durum.desteler.ana[i]];
        }
    }
    
    /**
     * Kartları oyunculara dağıtır
     * @private
     */
    _kartlariDagit() {
        // Her oyuncuya başlangıç kartlarını ver
        for (let i = 0; i < this.ayarlar.baslangicKartSayisi; i++) {
            this.durum.oyuncular.forEach((oyuncu, index) => {
                const kart = this.kartCek();
                if (kart) {
                    oyuncu.el.push(kart);
                }
            });
        }
        
        // Oyuncu ellerini güncelle
        this.durum.oyuncular.forEach((_, index) => {
            this._oyuncuEliniGuncelle(index);
        });
    }
    
    /**
     * Açık desteye kart ekler
     * @param {ElementKarti} kart Eklenecek kart
     * @private
     */
    _acikDesteyeKartEkle(kart) {
        if (!kart) return;
        
        this.durum.desteler.acik.push(kart);
        
        // Açık destedeki kartı güncelle
        if (this.elementler.desteler.acik) {
            this.elementler.desteler.acik.innerHTML = '';
            const kartHTML = kart.htmlOlustur(true);
            this.elementler.desteler.acik.appendChild(kartHTML);
        }
    }
    
    /**
     * Oyuncunun elini günceller
     * @param {number} oyuncuIndex Oyuncu indeksi
     * @private
     */
    _oyuncuEliniGuncelle(oyuncuIndex) {
        const oyuncu = this.durum.oyuncular[oyuncuIndex];
        const elDiv = document.getElementById(`oyuncu-${oyuncuIndex}-el`);
        
        if (!elDiv) return;
        
        elDiv.innerHTML = '';
        
        // Bot için kartların yüzü kapalı
        const onYuzGoster = !oyuncu.bot || oyuncuIndex === this.durum.aktifOyuncu;
        
        oyuncu.el.forEach(kart => {
            const kartHTML = kart.htmlOlustur(onYuzGoster);
            
            // İnsan oyuncu için karta tıklama özelliği ekle
            if (!oyuncu.bot) {
                kartHTML.addEventListener('click', () => {
                    if (oyuncuIndex !== this.durum.aktifOyuncu || this.durum.oyunBitti) return;
                    
                    this.kartSec(kart);
                });
            }
            
            elDiv.appendChild(kartHTML);
        });
        
        // Kart sayısını güncelle
        const kartSayisiSpan = document.getElementById(`oyuncu-${oyuncuIndex}-kart-sayisi`);
        if (kartSayisiSpan) {
            kartSayisiSpan.textContent = oyuncu.el.length;
        }
    }
    
    /**
     * Arayüzü günceller
     * @private
     */
    _arayuzuGuncelle() {
        // Oyuncu alanlarını güncelle
        this.durum.oyuncular.forEach((oyuncu, index) => {
            const oyuncuDiv = document.getElementById(`oyuncu-${index}`);
            if (oyuncuDiv) {
                if (index === this.durum.aktifOyuncu) {
                    oyuncuDiv.classList.add('aktif');
                } else {
                    oyuncuDiv.classList.remove('aktif');
                }
            }
        });
        
        // Tur bilgisini güncelle
        if (this.elementler.turBilgisi) {
            this.elementler.turBilgisi.textContent = `Tur: ${this.durum.tur}`;
        }
    }
    
    /**
     * Desteyi yeniler (açık destedeki kartları alıp karıştırarak ana desteye ekler)
     * @private
     */
    _desteyiYenile() {
        if (this.durum.desteler.acik.length <= 1) return;
        
        // Son kartı hariç tüm kartları ana desteye aktar
        const sonKart = this.durum.desteler.acik.pop();
        this.durum.desteler.ana = [...this.durum.desteler.acik];
        this.durum.desteler.acik = [sonKart];
        
        // Desteyi karıştır
        this._desteyiKaristir();
        
        // Açık desteyi güncelle
        if (this.elementler.desteler.acik) {
            this.elementler.desteler.acik.innerHTML = '';
            const kartHTML = sonKart.htmlOlustur(true);
            this.elementler.desteler.acik.appendChild(kartHTML);
        }
    }
    
    /**
     * Bot hamlesi yapar
     * @private
     */
    _botHamlesiYap() {
        const bot = this.durum.oyuncular[this.durum.aktifOyuncu];
        if (!bot.bot) return;
        
        // Botun zorluğuna göre akıllı veya rastgele hamle yap
        let hamleYapildi = false;
        
        if (bot.zorluk === 'kolay') {
            // Kolay seviye: Rastgele kart at veya kart çek
            if (Math.random() > 0.5 && bot.el.length > 0) {
                // Rastgele kart at
                const rastgeleKartIndex = Math.floor(Math.random() * bot.el.length);
                const secilenKart = bot.el[rastgeleKartIndex];
                hamleYapildi = this.kartAt(secilenKart);
            }
        } else if (bot.zorluk === 'orta' || bot.zorluk === 'zor') {
            // Orta ve zor seviye: Akıllı hamle yapmaya çalış
            // TODO: Orta ve zor seviye botların daha akıllı hamleler yapmasını sağla
            
            // Şimdilik basit bir mantık: Açık destenin üstündeki kartla aynı grupta/periyotta/kategoride
            // olan bir kart varsa onu at
            const ustKart = this.durum.desteler.acik[this.durum.desteler.acik.length - 1];
            
            if (ustKart) {
                const uygunKart = bot.el.find(kart => 
                    kart.element.grup === ustKart.element.grup || 
                    kart.element.periyot === ustKart.element.periyot ||
                    kart.element.kategori === ustKart.element.kategori
                );
                
                if (uygunKart) {
                    hamleYapildi = this.kartAt(uygunKart);
                }
            }
        }
        
        // Hamle yapılmadıysa kart çek
        if (!hamleYapildi) {
            const kart = this.kartCek();
            if (kart) {
                this.oyuncuyaKartVer(this.durum.aktifOyuncu, kart);
            }
        }
        
        // Sıradaki oyuncuya geç
        setTimeout(() => this.siradakiOyuncu(), 500);
    }
} 