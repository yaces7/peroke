/**
 * Periyodik Okey - Arayüz Kontrolü
 * Oyun arayüzünü ve kullanıcı etkileşimlerini yöneten dosya
 */

class ArayuzKontrol {
    /**
     * Arayüz kontrolü yapıcı metodu
     */
    constructor() {
        console.log("Arayüz kontrolü başlatılıyor...");
        
        // DOM Elementleri
        this.ekranlar = {
            menu: document.getElementById('menu-ekrani'),
            ayarlar: document.getElementById('ayarlar-ekrani'),
            nasilOynanir: document.getElementById('nasil-oynanir-ekrani'),
            istatistikler: document.getElementById('istatistikler-ekrani'),
            oyun: document.getElementById('oyun-ekrani'),
            oyunSonu: document.getElementById('oyun-sonu-ekrani')
        };
        
        this.butonlar = {
            oyunaBasla: document.getElementById('btn-oyuna-basla'),
            nasilOynanir: document.getElementById('btn-nasil-oynanir'),
            istatistikler: document.getElementById('btn-istatistikler'),
            ayarlar: document.getElementById('btn-ayarlar'),
            cikis: document.getElementById('btn-cikis'),
            
            ayarlarKaydet: document.getElementById('btn-ayarlar-kaydet'),
            ayarlarIptal: document.getElementById('btn-ayarlar-iptal'),
            
            geriDon: document.querySelectorAll('.btn-geri'),
            
            istatistikSifirla: document.getElementById('btn-istatistik-sifirla'),
            istatistikGeri: document.getElementById('btn-istatistik-geri'),
            
            oyunMenu: document.getElementById('btn-oyun-menu'),
            oyunYardim: document.getElementById('btn-oyun-yardim'),
            
            grubaGoreSirala: document.getElementById('btn-gruba-gore-sirala'),
            periyodaGoreSirala: document.getElementById('btn-periyoda-gore-sirala'),
            
            yeniOyun: document.getElementById('btn-yeni-oyun'),
            anaMenu: document.getElementById('btn-ana-menu'),
            
            kartAl: document.getElementById('btn-kart-al')
        };
        
        this.formElementleri = {
            botSayisi: document.getElementById('bot-sayisi'),
            zorlukSeviyesi: document.getElementById('zorluk-seviyesi'),
            sesEfektleri: document.getElementById('ses-efektleri'),
            muzik: document.getElementById('muzik')
        };
        
        this.canvaslar = {
            deste: document.getElementById('deste-canvas'),
            acikKart: document.getElementById('acik-kart-canvas'),
            oncekiKart: document.getElementById('onceki-kart-canvas'),
            oyuncu: document.getElementById('oyuncu-canvas')
        };
        
        this.oyunAlanlari = {
            bot1: document.getElementById('bot1-alani'),
            bot2: document.getElementById('bot2-alani'),
            bot3: document.getElementById('bot3-alani')
        };
        
        // Canvas kontekstleri
        this.kontekstler = {
            deste: this.canvaslar.deste?.getContext('2d'),
            acikKart: this.canvaslar.acikKart?.getContext('2d'),
            oncekiKart: this.canvaslar.oncekiKart?.getContext('2d'),
            oyuncu: this.canvaslar.oyuncu?.getContext('2d')
        };
        
        // Oyun nesnesi
        this.oyun = null;
        
        // Oyun durumu
        this.oyunAktif = false;
        this.suruklenenKart = null;
        this.seciliKart = null;
        this.suruklenenKartIndeks = -1;
        
        // Önceki oyuncudan gelen kart
        this.oncekiOyuncudanGelenKart = null;
        
        // Ayarlar
        this.ayarlar = {
            botSayisi: 3,
            zorlukSeviyesi: 'Normal',
            sesEfektleri: true,
            muzik: true
        };
        
        // Mouse pozisyonu
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Kombinasyon alanı
        this.kombinasyonKartlari = [];
        
        // Hata kontrolü: Eksik elementleri kontrol et ve konsola uyarı ver
        this._eksikElementleriKontrolEt();
        
        // CSS sınıfları
        this.CSS_SINIFLAR = {
            GIZLI: 'gizli',
            AKTIF: 'aktif',
            SECILI: 'secili',
            DEVRE_DISI: 'devre-disi'
        };
        
        // Olay dinleyicilerini ekle
        this._olayDinleyicileriniEkle();
        
        // Kayıtlı ayarları yükle
        this._ayarlariYukle();
        
        console.log("Arayüz kontrolü hazır.");
    }
    
    /**
     * Eksik elementleri kontrol eder ve konsola uyarı verir
     * @private
     */
    _eksikElementleriKontrolEt() {
        // Ekranları kontrol et
        for (const [ekranAdi, ekranElementi] of Object.entries(this.ekranlar)) {
            if (!ekranElementi) {
                console.warn(`'${ekranAdi}' ekranı bulunamadı!`);
            }
        }
        
        // Butonları kontrol et
        for (const [butonAdi, butonElementi] of Object.entries(this.butonlar)) {
            if (!butonElementi && butonAdi !== 'geriDon') {
                console.warn(`'${butonAdi}' butonu bulunamadı!`);
            }
        }
        
        // Form elementlerini kontrol et
        for (const [formAdi, formElementi] of Object.entries(this.formElementleri)) {
            if (!formElementi) {
                console.warn(`'${formAdi}' form elementi bulunamadı!`);
            }
        }
        
        // Oyun elementlerini kontrol et
        for (const [oyunElemaniAdi, oyunElemani] of Object.entries(this.oyunAlanlari)) {
            if (!oyunElemani) {
                console.warn(`'${oyunElemaniAdi}' oyun elemanı bulunamadı!`);
            }
        }
    }
    
    /**
     * Olay dinleyicilerini ekler
     * @private
     */
    _olayDinleyicileriniEkle() {
        // Ana menü butonları
        const btnBaslat = document.getElementById('btn-baslat');
        if (btnBaslat) {
            btnBaslat.addEventListener('click', () => this.oyunuBaslat());
        }
        
        const btnNasil = document.getElementById('btn-nasil');
        if (btnNasil) {
            btnNasil.addEventListener('click', () => this.sayfayiGoster('nasil-oynanir'));
        }
        
        const btnIstatistik = document.getElementById('btn-istatistik');
        if (btnIstatistik) {
            btnIstatistik.addEventListener('click', () => this.sayfayiGoster('istatistikler'));
        }
        
        const btnAyarlar = document.getElementById('btn-ayarlar');
        if (btnAyarlar) {
            btnAyarlar.addEventListener('click', () => this.sayfayiGoster('ayarlar'));
        }
        
        const btnCikis = document.getElementById('btn-cikis');
        if (btnCikis) {
            btnCikis.addEventListener('click', () => this.cikisYap());
        }
        
        // Ayarlar butonları
        const btnAyarlariKaydet = document.getElementById('btn-ayarlari-kaydet');
        if (btnAyarlariKaydet) {
            btnAyarlariKaydet.addEventListener('click', () => this.ayarlariKaydet());
        }
        
        const btnAyarlarIptal = document.getElementById('btn-ayarlar-iptal');
        if (btnAyarlarIptal) {
            btnAyarlarIptal.addEventListener('click', () => this.sayfayiGoster('ana-menu'));
        }
        
        // Nasıl oynanır butonları
        const btnNasilGeri = document.getElementById('btn-nasil-geri');
        if (btnNasilGeri) {
            btnNasilGeri.addEventListener('click', () => this.sayfayiGoster('ana-menu'));
        }
        
        // İstatistik butonları
        const btnIstatistikSifirla = document.getElementById('btn-istatistik-sifirla');
        if (btnIstatistikSifirla) {
            btnIstatistikSifirla.addEventListener('click', () => this.istatistikleriSifirla());
        }
        
        const btnIstatistikGeri = document.getElementById('btn-istatistik-geri');
        if (btnIstatistikGeri) {
            btnIstatistikGeri.addEventListener('click', () => this.sayfayiGoster('ana-menu'));
        }
        
        // Oyun butonları
        const btnDuraklat = document.getElementById('btn-duraklat');
        if (btnDuraklat) {
            btnDuraklat.addEventListener('click', () => this.oyunuDuraklat());
        }
        
        const btnYardim = document.getElementById('btn-yardim');
        if (btnYardim) {
            btnYardim.addEventListener('click', () => this.yardimGoster());
        }
        
        // Oyun sonu butonları
        const btnYeniOyun = document.getElementById('btn-yeni-oyun');
        if (btnYeniOyun) {
            btnYeniOyun.addEventListener('click', () => this.oyunuBaslat());
        }
        
        const btnAnaMenu = document.getElementById('btn-ana-menu');
        if (btnAnaMenu) {
            btnAnaMenu.addEventListener('click', () => this.sayfayiGoster('ana-menu'));
        }
        
        // Kart işlemleri butonları
        const btnGrubaSirala = document.getElementById('btn-gruba-gore-sirala');
        if (btnGrubaSirala) {
            btnGrubaSirala.addEventListener('click', () => {
                if (this.oyun && this.oyun.oyuncu) {
                    this.oyun.oyuncu.kartlariGrubaGoreSirala();
                    this.arayuzuGuncelle();
                }
            });
        }
        
        const btnPeriyodaSirala = document.getElementById('btn-periyoda-gore-sirala');
        if (btnPeriyodaSirala) {
            btnPeriyodaSirala.addEventListener('click', () => {
                if (this.oyun && this.oyun.oyuncu) {
                    this.oyun.oyuncu.kartlariPeriyodaGoreSirala();
                    this.arayuzuGuncelle();
                }
            });
        }
        
        const btnKartAl = document.getElementById('btn-kart-al');
        if (btnKartAl) {
            btnKartAl.addEventListener('click', () => this.kartAl());
        }
        
        // Canvas olayları
        if (this.canvaslar.oyuncu) {
            this.canvaslar.oyuncu.addEventListener('mousedown', (e) => this.oyuncuCanvasMouseDown(e));
            this.canvaslar.oyuncu.addEventListener('mousemove', (e) => this.oyuncuCanvasMouseMove(e));
        }
        
        if (this.canvaslar.deste) {
            this.canvaslar.deste.addEventListener('mousedown', (e) => this.desteMouseDown(e));
        }
        
        if (this.canvaslar.acikKart) {
            this.canvaslar.acikKart.addEventListener('mousedown', (e) => this.acikKartMouseDown(e));
        }
        
        if (this.canvaslar.oncekiKart) {
            this.canvaslar.oncekiKart.addEventListener('mousedown', (e) => this.oncekiKartMouseDown(e));
        }
        
        // Pencere olayları
        window.addEventListener('mouseup', (e) => this.windowMouseUp(e));
        window.addEventListener('mousemove', (e) => this.windowMouseMove(e));
        window.addEventListener('resize', () => this.boyutlariAyarla());
    }
    
    /**
     * Kayıtlı ayarları yükler
     * @private
     */
    _ayarlariYukle() {
        try {
            const kayitliAyarlar = localStorage.getItem('periyodikOkey_ayarlar');
            if (kayitliAyarlar) {
                const ayarlar = JSON.parse(kayitliAyarlar);
                
                // Ayarları güncelle
                this.ayarlar = { ...this.ayarlar, ...ayarlar };
                
                // Form elementlerini güncelle
                if (this.formElementleri.botSayisi) {
                    this.formElementleri.botSayisi.value = this.ayarlar.botSayisi;
                }
                
                if (this.formElementleri.zorlukSeviyesi) {
                    this.formElementleri.zorlukSeviyesi.value = this.ayarlar.zorlukSeviyesi;
                }
                
                if (this.formElementleri.sesEfektleri) {
                    this.formElementleri.sesEfektleri.checked = this.ayarlar.sesEfektleri;
                }
                
                if (this.formElementleri.muzik) {
                    this.formElementleri.muzik.checked = this.ayarlar.muzik;
                }
            }
        } catch (error) {
            console.error("Ayarlar yüklenirken hata oluştu:", error);
        }
    }
    
    /**
     * Belirtilen ekranı gösterir, diğerlerini gizler
     * @param {string} ekranAdi Gösterilecek ekran adı
     */
    ekraniGoster(ekranAdi) {
        // Tüm ekranları gizle
        for (const key in this.ekranlar) {
            this.ekranlar[key].classList.add('gizli');
        }
        
        // İstenen ekranı göster
        this.ekranlar[ekranAdi].classList.remove('gizli');
    }
    
    /**
     * Oyunu başlatır
     */
    oyunuBaslat() {
        // Ayarları al
        this.ayarlar.botSayisi = parseInt(this.formElementleri.botSayisi.value);
        this.ayarlar.zorlukSeviyesi = this.formElementleri.zorlukSeviyesi.value;
        
        // Oyun ekranını göster
        this.ekraniGoster('oyun');
        
        // Yeni oyun nesnesi oluştur
        this.oyun = new PeriyodikOkey(this.ayarlar);
        
        // Element verilerini al ve oyunu başlat
        this.oyun.oyunuBaslat(tumElementVerileriniAl());
        
        // Oyun durumunu güncelle
        this.oyunAktif = true;
        
        // Arayüzü güncelle
        this.arayuzuGuncelle();
    }
    
    /**
     * Oyunu durdurur
     */
    oyunuDurdur() {
        // Oyun durumunu güncelle
        this.oyunAktif = false;
        
        // Menü ekranını göster
        this.ekraniGoster('menu');
    }
    
    /**
     * Ayarları kaydeder
     */
    ayarlariKaydet() {
        // Form değerlerini al
        this.ayarlar.botSayisi = parseInt(this.formElementleri.botSayisi.value);
        this.ayarlar.zorlukSeviyesi = this.formElementleri.zorlukSeviyesi.value;
        this.ayarlar.sesEfektleri = this.formElementleri.sesEfektleri.checked;
        this.ayarlar.muzik = this.formElementleri.muzik.checked;
        
        // Menü ekranına dön
        this.ekraniGoster('menu');
    }
    
    /**
     * İstatistikleri sıfırlar
     */
    istatistikleriSifirla() {
        // İstatistik değerlerini sıfırla
        document.getElementById('toplam-oyun').textContent = '0';
        document.getElementById('kazanilan-oyun').textContent = '0';
        document.getElementById('kaybedilen-oyun').textContent = '0';
        document.getElementById('kazanma-orani').textContent = '0%';
        document.getElementById('en-yuksek-puan').textContent = '0';
        document.getElementById('ortalama-puan').textContent = '0';
        document.getElementById('toplam-puan').textContent = '0';
        document.getElementById('en-cok-element').textContent = '-';
        document.getElementById('en-cok-grup').textContent = '-';
        document.getElementById('en-cok-periyot').textContent = '-';
        
        // localStorage'daki verileri sıfırla
        localStorage.removeItem('periyodikOkey_istatistikler');
    }
    
    /**
     * Çıkış yapar
     */
    cikisYap() {
        // Oyunu durdur
        this.oyunAktif = false;
        
        // Pencereyi kapat (tarayıcıda çalışmayabilir)
        window.close();
    }
    
    /**
     * Arayüzü günceller
     */
    arayuzuGuncelle() {
        if (!this.oyunAktif || !this.oyun) return;
        
        // Canvas'ları temizle
        this.kontekstler.deste?.clearRect(0, 0, this.canvaslar.deste?.width || 0, this.canvaslar.deste?.height || 0);
        this.kontekstler.acikKart?.clearRect(0, 0, this.canvaslar.acikKart?.width || 0, this.canvaslar.acikKart?.height || 0);
        this.kontekstler.oncekiKart?.clearRect(0, 0, this.canvaslar.oncekiKart?.width || 0, this.canvaslar.oncekiKart?.height || 0);
        this.kontekstler.oyuncu?.clearRect(0, 0, this.canvaslar.oyuncu?.width || 0, this.canvaslar.oyuncu?.height || 0);
        
        // Desteyi çiz
        if (this.oyun.deste?.length > 0 && this.kontekstler.deste) {
            // Basit bir deste gösterimi
            this.kontekstler.deste.fillStyle = '#2980b9';
            this.kontekstler.deste.fillRect(0, 0, 80, 120);
            this.kontekstler.deste.strokeStyle = '#fff';
            this.kontekstler.deste.strokeRect(0, 0, 80, 120);
            this.kontekstler.deste.fillStyle = '#fff';
            this.kontekstler.deste.font = '14px Arial';
            this.kontekstler.deste.fillText('Deste', 20, 60);
        }
        
        // Açık kartı çiz
        if (this.oyun.acikKart && this.kontekstler.acikKart) {
            this.oyun.acikKart.x = 0;
            this.oyun.acikKart.y = 0;
            this.oyun.acikKart.ciz(this.kontekstler.acikKart);
        }
        
        // Önceki oyuncudan gelen kartı çiz
        if (this.oncekiOyuncudanGelenKart && this.kontekstler.oncekiKart) {
            this.oncekiOyuncudanGelenKart.x = 0;
            this.oncekiOyuncudanGelenKart.y = 0;
            this.oncekiOyuncudanGelenKart.ciz(this.kontekstler.oncekiKart);
        }
        
        // Oyuncu kartlarını çiz
        if (this.oyun.oyuncu?.kartlar && this.kontekstler.oyuncu) {
            const kartGenislik = 70;
            const kartYukseklik = 100;
            const kartMarj = 5;
            
            // Oyuncu kartlarını düzenle ve çiz
            for (let i = 0; i < this.oyun.oyuncu.kartlar.length; i++) {
                const kart = this.oyun.oyuncu.kartlar[i];
                kart.x = i * (kartGenislik + kartMarj);
                kart.y = 0;
                kart.ciz(this.kontekstler.oyuncu);
            }
        }
        
        // Botların kartlarını güncelle
        if (this.oyun.botlar) {
            for (let i = 0; i < this.ayarlar.botSayisi; i++) {
                this.botKartlariniGuncelle(i+1, this.oyun.botlar[i]?.kartlar || []);
            }
        }
        
        // Kalan kart sayısını güncelle
        const kalanKartElement = document.getElementById('kalan-kart');
        if (kalanKartElement) {
            kalanKartElement.textContent = this.oyun.deste?.length || 0;
        }
        
        // Durum mesajını güncelle
        const durumMesajiElement = document.getElementById('durum-mesaji');
        if (durumMesajiElement) {
            let durumMesaji = '';
            let siradakiOyuncu = '';
            
            if (this.oyun.oyuncu?.sirada) {
                durumMesaji = 'Sizin sıranız.';
                siradakiOyuncu = 'Oyuncu';
            } else {
                const siradakiBotIndeks = this.oyun.aktifOyuncuIndeksi - 1;
                durumMesaji = `Bot ${siradakiBotIndeks + 1} oynuyor...`;
                siradakiOyuncu = `Bot ${siradakiBotIndeks + 1}`;
            }
            
            durumMesajiElement.textContent = durumMesaji;
            
            // Oyun bilgilerini güncelle
            oyunBilgileriniGuncelle(this.oyun.turSayisi || 1, siradakiOyuncu);
        }
        
        // Eğer oyun sürüklenen kart varsa, ona göre güncelle
        if (this.suruklenenKart && this.kontekstler.oyuncu) {
            const kartGenislik = 70;
            const kartYukseklik = 100;
            this.suruklenenKart.x = this.mouseX - kartGenislik / 2;
            this.suruklenenKart.y = this.mouseY - kartYukseklik / 2;
            this.suruklenenKart.ciz(this.kontekstler.oyuncu);
        }
        
        // Yeniden çizim için animasyon isteği
        requestAnimationFrame(() => this.arayuzuGuncelle());
    }
    
    /**
     * Botların kartlarını günceller (element_karti nesnelerini DOM elementlerine dönüştürür)
     * @param {number} botNo Bot numarası
     * @param {Array} kartlar Kartlar dizisi
     */
    botKartlariniGuncelle(botNo, kartlar) {
        const botAlanId = `bot${botNo}-alani`;
        const botAlani = document.getElementById(botAlanId);
        if (!botAlani) return;
        
        // Botun kart alanını temizle
        let kartlarElementi = document.getElementById(`bot${botNo}-kartlari`);
        if (!kartlarElementi) {
            kartlarElementi = document.createElement('div');
            kartlarElementi.id = `bot${botNo}-kartlari`;
            kartlarElementi.className = 'bot-kartlar';
            botAlani.appendChild(kartlarElementi);
        } else {
            kartlarElementi.innerHTML = '';
        }
        
        // Bot aktif değilse veya kart yoksa gösterme
        if (!kartlar || kartlar.length === 0) {
            const bosKartMesaji = document.createElement('div');
            bosKartMesaji.className = 'bos-kart-mesaji';
            bosKartMesaji.textContent = 'Kart yok';
            kartlarElementi.appendChild(bosKartMesaji);
            return;
        }
        
        // Botun kartlarını oluştur ve DOM'a ekle
        kartlar.forEach((kart, index) => {
            const kartDiv = document.createElement('div');
            kartDiv.className = 'bot-kart';
            kartDiv.dataset.index = index;
            
            // Kart DOM ögesi oluştur
            if (kart.htmlOlustur) {
                // Kart sınıfı içinde HTML oluşturma metodu varsa kullan (arka yüz göster)
                const kartHtml = kart.htmlOlustur(true); // Arka yüz
                kartDiv.appendChild(kartHtml);
            } else {
                // Basit gösterim
                kartDiv.style.width = '50px';
                kartDiv.style.height = '70px';
                kartDiv.style.backgroundColor = '#5a189a'; // Mor renk (arka yüz)
                kartDiv.style.margin = '2px';
                kartDiv.style.borderRadius = '5px';
                
                // Kart numarası ekle
                const kartNo = document.createElement('div');
                kartNo.style.color = '#fff';
                kartNo.style.textAlign = 'center';
                kartNo.style.fontSize = '10px';
                kartNo.style.marginTop = '30px';
                kartNo.textContent = index + 1;
                kartDiv.appendChild(kartNo);
            }
            
            kartlarElementi.appendChild(kartDiv);
        });
    }
    
    /**
     * Pencere yeniden boyutlandırıldığında yapılacak işlemler
     */
    pencereYenidenBoyutlandirildi() {
        // Canvas boyutlarını güncelle (gerekirse)
        this.arayuzuGuncelle();
    }
    
    /**
     * Oyuncu kartları üzerinde fare olayları
     */
    oyuncuMouseDown(e) {
        if (!this.oyunAktif || !this.oyun.oyuncu.sirada) return;
        
        const rect = this.canvaslar.oyuncu.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        
        // Tıklanan kartı bul
        for (let i = this.oyun.oyuncu.kartlar.length - 1; i >= 0; i--) {
            const kart = this.oyun.oyuncu.kartlar[i];
            if (kart.icerdeMi(this.mouseX, this.mouseY)) {
                // Kartı sürüklemek için hazırla
                this.suruklenenKart = kart;
                this.suruklenenKartIndeks = i;
                break;
            }
        }
    }
    
    oyuncuMouseMove(e) {
        if (!this.suruklenenKart) return;
        
        const rect = this.canvaslar.oyuncu.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }
    
    oyuncuMouseUp(e) {
        if (!this.suruklenenKart) return;
        
        // Kartı bırak
        this.suruklenenKart = null;
        this.suruklenenKartIndeks = -1;
        this.arayuzuGuncelle();
    }
    
    /**
     * Desteden kart çekmek için mouse olayı
     */
    desteMouseDown(e) {
        if (!this.oyunAktif || !this.oyun || !this.oyun.oyuncu || !this.oyun.oyuncu.sirada) return;
        
        if (this.oyun.deste?.length > 0) {
            // Desteden kart çek
            const kart = this.oyun.desteyiAc();
            if (kart) {
                this.oyun.oyuncu.kartEkle(kart);
                this.oyun.oyuncuHamlesiniTamamla();
                this.arayuzuGuncelle();
            }
        }
    }
    
    /**
     * Açık kartı almak için mouse olayı
     */
    acikKartMouseDown(e) {
        if (!this.oyunAktif || !this.oyun || !this.oyun.oyuncu || !this.oyun.oyuncu.sirada) return;
        
        if (this.oyun.acikKart) {
            // Açık kartı al
            const kart = this.oyun.acikKartiAl();
            if (kart) {
                this.oyun.oyuncu.kartEkle(kart);
                this.oyun.oyuncuHamlesiniTamamla();
                this.arayuzuGuncelle();
            }
        }
    }
    
    /**
     * Önceki oyuncudan gelen kartı almak için mouse olayı
     */
    oncekiKartMouseDown(e) {
        if (!this.oyunAktif || !this.oyun || !this.oyun.oyuncu || !this.oyun.oyuncu.sirada) return;
        
        if (this.oncekiOyuncudanGelenKart) {
            // Önceki oyuncudan gelen kartı al
            const kart = this.oncekiOyuncudanGelenKart;
            this.oncekiOyuncudanGelenKart = null;
            
            if (kart) {
                this.oyun.oyuncu.kartEkle(kart);
                this.oyun.oyuncuHamlesiniTamamla();
                this.arayuzuGuncelle();
            }
        }
    }
    
    /**
     * Pencere mouse up olayı
     */
    windowMouseUp(e) {
        if (!this.oyunAktif || !this.oyun || !this.suruklenenKart) {
            this.suruklenenKart = null;
            this.suruklenenKartIndeks = -1;
            return;
        }

        // Ortada bir alan varsa, kartı buraya atmak için kontrol et
        const ortaAlanCanvas = this.canvaslar.acikKart;
        if (ortaAlanCanvas) {
            const rect = ortaAlanCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Ortadaki kart atma alanına bırakıldı mı kontrol et
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                // Kart atma işlemini gerçekleştir
                if (this.suruklenenKartIndeks !== -1) {
                    this.oyun.kartAt(this.suruklenenKartIndeks);
                    this.arayuzuGuncelle();
                }
            }
        }
        
        this.suruklenenKart = null;
        this.suruklenenKartIndeks = -1;
    }
    
    /**
     * Pencere mouse move olayı
     */
    windowMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }
    
    /**
     * Oyuncu canvas mouse down olayı
     */
    oyuncuCanvasMouseDown(e) {
        if (!this.oyunAktif || !this.oyun || !this.oyun.oyuncu) return;
        
        const rect = this.canvaslar.oyuncu.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Seçilen kartı bul
        const kartGenislik = 70;
        const kartYukseklik = 100;
        const kartMarj = 5;
        
        for (let i = this.oyun.oyuncu.kartlar.length - 1; i >= 0; i--) {
            const kart = this.oyun.oyuncu.kartlar[i];
            if (x >= kart.x && x <= kart.x + kartGenislik &&
                y >= kart.y && y <= kart.y + kartYukseklik) {
                // Kart seçildi
                if (this.oyun.oyuncu.sirada) {
                    // Oyuncunun sırası ise, kartı sürüklemek için hazırla
                    this.suruklenenKart = kart;
                    this.suruklenenKartIndeks = i;
                    this.mouseX = e.clientX;
                    this.mouseY = e.clientY;
                    break;
                }
            }
        }
    }
    
    /**
     * Oyuncu canvas mouse move olayı
     */
    oyuncuCanvasMouseMove(e) {
        if (!this.oyunAktif) return;
        
        const rect = this.canvaslar.oyuncu.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Mouse pozisyonunu güncelle
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }
    
    /**
     * Kart alma işlemi
     */
    kartAl() {
        if (this.oyun && this.oyun.oyuncu) {
            const sonuc = this.oyun.kartAl(this.oyun.oyuncu);
            if (sonuc.basarili) {
                this.arayuzuGuncelle();
                this.mesajGoster("Kart alındı.");
            } else {
                this.hataGoster(sonuc.mesaj);
            }
        }
    }
}

// Sayfa yüklendiğinde arayüz kontrolünü başlat
window.addEventListener('DOMContentLoaded', () => {
    const arayuzKontrol = new ArayuzKontrol();
});

// Açık kartı ekrana yansıtır
function acikKartiGuncelle(kart) {
    const acikKartAlani = document.getElementById('acik-kart-alani');
    if (!acikKartAlani) return;

    acikKartAlani.innerHTML = '';
    
    if (kart) {
        const kartElemani = document.createElement('canvas');
        kartElemani.width = 100;
        kartElemani.height = 150;
        kartElemani.className = 'acik-kart';
        acikKartAlani.appendChild(kartElemani);
        
        // Kartı çiz
        kartCiz(kartElemani, kart, false);
        
        // Başlık ekle
        const baslik = document.createElement('div');
        baslik.id = 'acik-kart-baslik';
        baslik.textContent = 'Ortadaki Element';
        acikKartAlani.insertBefore(baslik, acikKartAlani.firstChild);
    } else {
        const bosKartAlani = document.createElement('div');
        bosKartAlani.textContent = 'Henüz kart yok';
        bosKartAlani.className = 'bos-kart-mesaji';
        acikKartAlani.appendChild(bosKartAlani);
    }
}

// Oyun bilgilerini günceller
function oyunBilgileriniGuncelle(turBilgisi, siradaki) {
    const turBilgisiElement = document.getElementById('tur-bilgisi');
    const siradakiOyuncuElement = document.getElementById('siradaki-oyuncu');
    
    if (turBilgisiElement) {
        turBilgisiElement.textContent = `Tur: ${turBilgisi}`;
    }
    
    if (siradakiOyuncuElement) {
        siradakiOyuncuElement.textContent = `Sıradaki: ${siradaki}`;
    }
}

// Kartları sıralar
function kartlariSirala(kartlar, siralama = 'grup') {
    if (!kartlar || kartlar.length === 0) return kartlar;
    
    // Grup veya periyota göre sıralama yap
    return kartlar.sort((a, b) => {
        if (siralama === 'grup') {
            // Önce gruba göre, sonra periyota göre sırala
            if (a.element.grup !== b.element.grup) {
                return a.element.grup - b.element.grup;
            }
            return a.element.periyot - b.element.periyot;
        } else {
            // Önce periyoda göre, sonra gruba göre sırala
            if (a.element.periyot !== b.element.periyot) {
                return a.element.periyot - b.element.periyot;
            }
            return a.element.grup - b.element.grup;
        }
    });
}

/**
 * Element kartı sınıfı
 */
class ElementKarti {
    constructor(element, id) {
        this.element = element;
        this.id = id || Math.random().toString(36).substring(2, 15);
        this.secili = false;
    }

    /**
     * Kart için HTML elementi oluşturur
     * @param {boolean} arkaYuz Kartın arka yüzünü göstermek için true, ön yüzünü göstermek için false
     * @returns {HTMLElement} Oluşturulan HTML elementi
     */
    htmlOlustur(arkaYuz = false) {
        const kartDiv = document.createElement('div');
        kartDiv.className = 'element-karti';
        kartDiv.dataset.id = this.id;
        
        if (arkaYuz) {
            // Arka yüz gösterimi
            kartDiv.classList.add('kart-arka-yuz');
            return kartDiv;
        }

        // Ön yüz gösterimi
        kartDiv.style.backgroundColor = this.element.renkKodu || '#ffffff';
        
        // Element bilgileri
        const sembolDiv = document.createElement('div');
        sembolDiv.className = 'element-sembol';
        sembolDiv.textContent = this.element.sembol;
        
        const adDiv = document.createElement('div');
        adDiv.className = 'element-ad';
        adDiv.textContent = this.element.ad;
        
        const atomNumarasiDiv = document.createElement('div');
        atomNumarasiDiv.className = 'element-atom-numarasi';
        atomNumarasiDiv.textContent = this.element.atomNumarasi;
        
        const grupPeriyotDiv = document.createElement('div');
        grupPeriyotDiv.className = 'element-grup-periyot';
        grupPeriyotDiv.textContent = `G:${this.element.grup} P:${this.element.periyot}`;
        
        // Bilgileri kart divina ekle
        kartDiv.appendChild(sembolDiv);
        kartDiv.appendChild(adDiv);
        kartDiv.appendChild(atomNumarasiDiv);
        kartDiv.appendChild(grupPeriyotDiv);
        
        // Seçili durumu varsa, sınıf ekle
        if (this.secili) {
            kartDiv.classList.add('secili-kart');
        }
        
        return kartDiv;
    }
}

/**
 * Element sınıfı
 */
class Element {
    constructor(atomNumarasi, sembol, ad, grup, periyot, kategori) {
        this.atomNumarasi = atomNumarasi;
        this.sembol = sembol;
        this.ad = ad;
        this.grup = grup;
        this.periyot = periyot;
        this.kategori = kategori;
        this.renkKodu = this.kategoriRengi();
    }
    
    /**
     * Element kategorisine göre renk kodu döndürür
     * @returns {string} Renk kodu
     */
    kategoriRengi() {
        const renkler = {
            'Alkali Metaller': '#ff6b6b',
            'Toprak Alkali Metaller': '#ffa06b',
            'Geçiş Metalleri': '#ffd06b',
            'Diğer Metaller': '#d4ff6b',
            'Yarı Metaller': '#6bff6b',
            'Ametaller': '#6bffd0',
            'Halojenler': '#6bd4ff',
            'Soy Gazlar': '#6b6bff',
            'Lantanitler': '#d06bff',
            'Aktinitler': '#ff6bd0'
        };
        
        return renkler[this.kategori] || '#cccccc';
    }
} 