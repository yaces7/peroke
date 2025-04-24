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
            menu: document.getElementById('menu-screen'),
            ayarlar: document.getElementById('ayarlar-screen'),
            nasilOynanir: document.getElementById('nasil-oynanir-screen'),
            istatistikler: document.getElementById('istatistikler-screen'),
            oyun: document.getElementById('game-screen'),
            oyunSonu: document.getElementById('oyun-sonu-screen')
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
            
            kontrolEt: document.getElementById('btn-kontrol-et'),
            kartVer: document.getElementById('btn-kart-ver'),
            desteyiAc: document.getElementById('btn-desteyi-ac'),
            
            yeniOyun: document.getElementById('btn-yeni-oyun'),
            anaMenu: document.getElementById('btn-ana-menu')
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
            kombinasyon: document.getElementById('kombinasyon-canvas'),
            oyuncu: document.getElementById('oyuncu-canvas')
        };
        
        this.oyunAlanlari = {
            bot1: document.getElementById('bot1-alani'),
            bot2: document.getElementById('bot2-alani'),
            bot3: document.getElementById('bot3-alani')
        };
        
        // Canvas kontekstleri
        this.kontekstler = {
            deste: this.canvaslar.deste.getContext('2d'),
            acikKart: this.canvaslar.acikKart.getContext('2d'),
            kombinasyon: this.canvaslar.kombinasyon.getContext('2d'),
            oyuncu: this.canvaslar.oyuncu.getContext('2d')
        };
        
        // Oyun nesnesi
        this.oyun = null;
        
        // Oyun durumu
        this.oyunAktif = false;
        this.suruklenenKart = null;
        this.seciliKart = null;
        
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
        // Menü butonları
        this.butonlar.oyunaBasla.addEventListener('click', () => this.oyunuBaslat());
        this.butonlar.nasilOynanir.addEventListener('click', () => this.ekraniGoster('nasilOynanir'));
        this.butonlar.istatistikler.addEventListener('click', () => this.ekraniGoster('istatistikler'));
        this.butonlar.ayarlar.addEventListener('click', () => this.ekraniGoster('ayarlar'));
        this.butonlar.cikis.addEventListener('click', () => this.cikisYap());
        
        // Ayarlar butonları
        this.butonlar.ayarlarKaydet.addEventListener('click', () => this.ayarlariKaydet());
        this.butonlar.ayarlarIptal.addEventListener('click', () => this.ekraniGoster('menu'));
        
        // Nasıl oynanır butonları
        this.butonlar.geriDon.forEach(buton => {
            buton.addEventListener('click', () => this.ekraniGoster('menu'));
        });
        
        // İstatistik butonları
        this.butonlar.istatistikSifirla.addEventListener('click', () => this.istatistikleriSifirla());
        this.butonlar.istatistikGeri.addEventListener('click', () => this.ekraniGoster('menu'));
        
        // Oyun butonları
        this.butonlar.oyunMenu.addEventListener('click', () => this.oyunuDurdur());
        this.butonlar.oyunYardim.addEventListener('click', () => this.ekraniGoster('nasilOynanir'));
        
        this.butonlar.kontrolEt.addEventListener('click', () => this.kombinasyonuKontrolEt());
        this.butonlar.kartVer.addEventListener('click', () => this.kartVer());
        this.butonlar.desteyiAc.addEventListener('click', () => this.destedenKartCek());
        
        // Oyun sonu butonları
        this.butonlar.yeniOyun.addEventListener('click', () => this.oyunuBaslat());
        this.butonlar.anaMenu.addEventListener('click', () => this.ekraniGoster('menu'));
        
        // Canvas olayları
        this.canvaslar.oyuncu.addEventListener('mousedown', (e) => this.oyuncuMouseDown(e));
        this.canvaslar.oyuncu.addEventListener('mousemove', (e) => this.oyuncuMouseMove(e));
        this.canvaslar.oyuncu.addEventListener('mouseup', (e) => this.oyuncuMouseUp(e));
        
        this.canvaslar.kombinasyon.addEventListener('mouseup', (e) => this.kombinasyonMouseUp(e));
        
        this.canvaslar.acikKart.addEventListener('click', (e) => this.acikKartClick(e));
        this.canvaslar.deste.addEventListener('click', (e) => this.desteClick(e));
        
        // Pencere olayları
        window.addEventListener('resize', () => this.pencereYenidenBoyutlandirildi());
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
        this.kontekstler.deste.clearRect(0, 0, this.canvaslar.deste.width, this.canvaslar.deste.height);
        this.kontekstler.acikKart.clearRect(0, 0, this.canvaslar.acikKart.width, this.canvaslar.acikKart.height);
        this.kontekstler.kombinasyon.clearRect(0, 0, this.canvaslar.kombinasyon.width, this.canvaslar.kombinasyon.height);
        this.kontekstler.oyuncu.clearRect(0, 0, this.canvaslar.oyuncu.width, this.canvaslar.oyuncu.height);
        
        // Desteyi çiz
        if (this.oyun.deste.length > 0) {
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
        if (this.oyun.acikKart) {
            this.oyun.acikKart.x = 0;
            this.oyun.acikKart.y = 0;
            this.oyun.acikKart.ciz(this.kontekstler.acikKart);
        }
        
        // Oyuncu kartlarını çiz
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
        
        // Kombinasyon alanındaki kartları çiz
        for (let i = 0; i < this.kombinasyonKartlari.length; i++) {
            const kart = this.kombinasyonKartlari[i];
            kart.x = i * (kartGenislik + kartMarj);
            kart.y = 0;
            kart.ciz(this.kontekstler.kombinasyon);
        }
        
        // Kalan kart sayısını güncelle
        document.getElementById('kalan-kart').textContent = this.oyun.deste.length;
        
        // Puanları güncelle
        document.getElementById('oyuncu-puan').textContent = this.oyun.oyuncu.puan;
        for (let i = 0; i < this.ayarlar.botSayisi; i++) {
            document.getElementById(`bot${i+1}-puan`).textContent = this.oyun.botlar[i].puan;
        }
        
        // Durum mesajını güncelle
        let durumMesaji = '';
        
        if (this.oyun.oyuncu.sirada) {
            durumMesaji = 'Sizin sıranız.';
        } else {
            const siradakiBotIndeks = this.oyun.aktifOyuncuIndeksi - 1;
            durumMesaji = `Bot ${siradakiBotIndeks + 1} oynuyor...`;
        }
        
        document.getElementById('durum-mesaji').textContent = durumMesaji;
        
        // Eğer oyun sürüklenen kart varsa, ona göre güncelle
        if (this.suruklenenKart) {
            this.suruklenenKart.x = this.mouseX - kartGenislik / 2;
            this.suruklenenKart.y = this.mouseY - kartYukseklik / 2;
            this.suruklenenKart.ciz(this.kontekstler.oyuncu);
        }
        
        // Yeniden çizim için animasyon isteği
        requestAnimationFrame(() => this.arayuzuGuncelle());
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
        this.arayuzuGuncelle();
    }
    
    kombinasyonMouseUp(e) {
        if (!this.suruklenenKart) return;
        
        // Kartı kombinasyon alanına taşı
        this.kombinasyonKartlari.push(this.suruklenenKart);
        this.oyun.oyuncu.kartlar.splice(this.suruklenenKartIndeks, 1);
        
        // Kartı bırak
        this.suruklenenKart = null;
        this.arayuzuGuncelle();
    }
    
    acikKartClick(e) {
        if (!this.oyunAktif || !this.oyun.oyuncu.sirada) return;
        
        // Açık kartı al
        this.oyun.acikKartiAl();
        this.arayuzuGuncelle();
    }
    
    desteClick(e) {
        if (!this.oyunAktif || !this.oyun.oyuncu.sirada) return;
        
        // Desteden kart çek
        this.destedenKartCek();
    }
    
    /**
     * Kombinasyonu kontrol eder
     */
    kombinasyonuKontrolEt() {
        if (this.kombinasyonKartlari.length === 0) return;
        
        // Geçerli kombinasyon mu kontrol et
        const sonuc = this.oyun.kombinasyonlariKontrolEt(this.kombinasyonKartlari);
        
        if (sonuc.gecerli) {
            // Geçerli kombinasyon - puanları hesapla ve kartları kaldır
            const puan = this.oyun.puanHesapla(sonuc);
            this.oyun.oyuncu.puan += puan;
            
            // Kombinasyon alanını temizle
            this.kombinasyonKartlari = [];
            
            // Oyuncu kartları bittiyse oyunu bitir
            if (this.oyun.oyuncu.kartlar.length === 0) {
                this.oyunuBitir(true);
            }
        } else {
            // Geçersiz kombinasyon - kartları geri ver
            this.oyun.oyuncu.kartlar.push(...this.kombinasyonKartlari);
            this.kombinasyonKartlari = [];
        }
        
        this.arayuzuGuncelle();
    }
    
    /**
     * Kart verir
     */
    kartVer() {
        if (!this.oyunAktif || !this.oyun.oyuncu.sirada || this.oyun.oyuncu.kartlar.length === 0) return;
        
        // Rastgele bir kart seç
        const kartIndeks = Math.floor(Math.random() * this.oyun.oyuncu.kartlar.length);
        
        // Kartı seç ve ver
        this.oyun.kartSec(kartIndeks);
        this.arayuzuGuncelle();
    }
    
    /**
     * Desteden kart çeker
     */
    destedenKartCek() {
        if (!this.oyunAktif || !this.oyun.oyuncu.sirada) return;
        
        // Desteden kart çek
        this.oyun.destedenKartCek();
        this.arayuzuGuncelle();
    }
    
    /**
     * Oyunu bitirir
     * @param {boolean} kazandiMi Oyuncu kazandı mı
     */
    oyunuBitir(kazandiMi = true) {
        // Oyun durumunu güncelle
        this.oyunAktif = false;
        
        // Sonuç mesajını ayarla
        const sonucMesaji = kazandiMi ? 'Tebrikler! Kazandınız!' : 'Kaybettiniz!';
        document.getElementById('sonuc-mesaji').textContent = sonucMesaji;
        
        // Puan detaylarını göster
        document.getElementById('sonuc-puan').textContent = this.oyun.oyuncu.puan;
        
        // TODO: Grup ve periyot sayılarını gerçek verilerden hesapla
        document.getElementById('sonuc-grup').textContent = '0';
        document.getElementById('sonuc-periyot').textContent = '0';
        
        // İstatistikleri güncelle
        this.istatistikleriGuncelle(kazandiMi);
        
        // Oyun sonu ekranını göster
        this.ekraniGoster('oyunSonu');
    }
    
    /**
     * İstatistikleri günceller
     * @param {boolean} kazandiMi Oyuncu kazandı mı
     */
    istatistikleriGuncelle(kazandiMi) {
        // localStorage'dan mevcut istatistikleri al
        let istatistikler = JSON.parse(localStorage.getItem('periyodikOkey_istatistikler')) || {
            toplamOyun: 0,
            kazanilanOyun: 0,
            kaybedilenOyun: 0,
            enYuksekPuan: 0,
            toplamPuan: 0,
            elementSayilari: {},
            grupSayilari: {},
            periyotSayilari: {}
        };
        
        // İstatistikleri güncelle
        istatistikler.toplamOyun++;
        if (kazandiMi) {
            istatistikler.kazanilanOyun++;
        } else {
            istatistikler.kaybedilenOyun++;
        }
        
        // Puan istatistikleri
        const oyuncuPuani = this.oyun.oyuncu.puan;
        istatistikler.toplamPuan += oyuncuPuani;
        if (oyuncuPuani > istatistikler.enYuksekPuan) {
            istatistikler.enYuksekPuan = oyuncuPuani;
        }
        
        // TODO: Element, grup ve periyot istatistiklerini güncelle
        
        // İstatistikleri kaydet
        localStorage.setItem('periyodikOkey_istatistikler', JSON.stringify(istatistikler));
        
        // İstatistik arayüzünü güncelle
        this.istatistikArayuzunuGuncelle(istatistikler);
    }
    
    /**
     * İstatistik arayüzünü günceller
     * @param {Object} istatistikler İstatistik verileri
     */
    istatistikArayuzunuGuncelle(istatistikler) {
        document.getElementById('toplam-oyun').textContent = istatistikler.toplamOyun;
        document.getElementById('kazanilan-oyun').textContent = istatistikler.kazanilanOyun;
        document.getElementById('kaybedilen-oyun').textContent = istatistikler.kaybedilenOyun;
        
        // Kazanma oranı
        const kazanmaOrani = istatistikler.toplamOyun > 0 
            ? Math.round((istatistikler.kazanilanOyun / istatistikler.toplamOyun) * 100) 
            : 0;
        document.getElementById('kazanma-orani').textContent = `${kazanmaOrani}%`;
        
        // Puan istatistikleri
        document.getElementById('en-yuksek-puan').textContent = istatistikler.enYuksekPuan;
        const ortalamaPuan = istatistikler.toplamOyun > 0 
            ? Math.round(istatistikler.toplamPuan / istatistikler.toplamOyun) 
            : 0;
        document.getElementById('ortalama-puan').textContent = ortalamaPuan;
        document.getElementById('toplam-puan').textContent = istatistikler.toplamPuan;
        
        // TODO: En çok kullanılan element, grup ve periyot istatistiklerini güncelle
    }
}

// Sayfa yüklendiğinde arayüz kontrolünü başlat
window.addEventListener('DOMContentLoaded', () => {
    const arayuzKontrol = new ArayuzKontrol();
});

// Botların kartlarını ekrana yansıtır
function botKartlariniGuncelle(botNo, kartlar) {
    const kartlarElementi = document.getElementById(`bot${botNo}-kartlari`);
    if (!kartlarElementi) return;
    
    kartlarElementi.innerHTML = '';
    
    // Botun kartları için alanı temizle
    kartlar.forEach((kart, index) => {
        const kartDiv = document.createElement('div');
        kartDiv.className = 'bot-kart';
        kartDiv.dataset.index = index;
        kartDiv.id = `bot${botNo}-kart-${index}`;
        
        // Kart bilgilerini gösterecek iç div
        const kartBilgi = document.createElement('div');
        kartBilgi.className = 'kart-bilgi';
        
        // Sembol ve diğer bilgiler
        const sembolDiv = document.createElement('div');
        sembolDiv.className = 'sembol';
        sembolDiv.textContent = kart.sembol;
        
        const grupPeriyotDiv = document.createElement('div');
        grupPeriyotDiv.className = 'grup-periyot';
        grupPeriyotDiv.textContent = `G:${kart.grup} P:${kart.periyot}`;
        
        // Bilgileri kart bilgi alanına ekle
        kartBilgi.appendChild(sembolDiv);
        kartBilgi.appendChild(grupPeriyotDiv);
        
        // Kart bilgilerini ana kart divina ekle
        kartDiv.appendChild(kartBilgi);
        kartlarElementi.appendChild(kartDiv);
    });
}

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
        baslik.textContent = 'Son Oynanan Kart';
        acikKartAlani.insertBefore(baslik, acikKartAlani.firstChild);
    } else {
        const bosKartAlani = document.createElement('div');
        bosKartAlani.textContent = 'Henüz kart yok';
        bosKartAlani.className = 'bos-kart-mesaji';
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
            menu: document.getElementById('menu-screen'),
            ayarlar: document.getElementById('ayarlar-screen'),
            nasilOynanir: document.getElementById('nasil-oynanir-screen'),
            istatistikler: document.getElementById('istatistikler-screen'),
            oyun: document.getElementById('game-screen'),
            oyunSonu: document.getElementById('oyun-sonu-screen')
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
            
            kontrolEt: document.getElementById('btn-kontrol-et'),
            kartVer: document.getElementById('btn-kart-ver'),
            desteyiAc: document.getElementById('btn-desteyi-ac'),
            
            yeniOyun: document.getElementById('btn-yeni-oyun'),
            anaMenu: document.getElementById('btn-ana-menu')
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
            kombinasyon: document.getElementById('kombinasyon-canvas'),
            oyuncu: document.getElementById('oyuncu-canvas')
        };
        
        this.oyunAlanlari = {
            bot1: document.getElementById('bot1-alani'),
            bot2: document.getElementById('bot2-alani'),
            bot3: document.getElementById('bot3-alani')
        };
        
        // Canvas kontekstleri
        this.kontekstler = {
            deste: this.canvaslar.deste.getContext('2d'),
            acikKart: this.canvaslar.acikKart.getContext('2d'),
            kombinasyon: this.canvaslar.kombinasyon.getContext('2d'),
            oyuncu: this.canvaslar.oyuncu.getContext('2d')
        };
        
        // Oyun nesnesi
        this.oyun = null;
        
        // Oyun durumu
        this.oyunAktif = false;
        this.suruklenenKart = null;
        this.seciliKart = null;
        
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
        // Menü butonları
        this.butonlar.oyunaBasla.addEventListener('click', () => this.oyunuBaslat());
        this.butonlar.nasilOynanir.addEventListener('click', () => this.ekraniGoster('nasilOynanir'));
        this.butonlar.istatistikler.addEventListener('click', () => this.ekraniGoster('istatistikler'));
        this.butonlar.ayarlar.addEventListener('click', () => this.ekraniGoster('ayarlar'));
        this.butonlar.cikis.addEventListener('click', () => this.cikisYap());
        
        // Ayarlar butonları
        this.butonlar.ayarlarKaydet.addEventListener('click', () => this.ayarlariKaydet());
        this.butonlar.ayarlarIptal.addEventListener('click', () => this.ekraniGoster('menu'));
        
        // Nasıl oynanır butonları
        this.butonlar.geriDon.forEach(buton => {
            buton.addEventListener('click', () => this.ekraniGoster('menu'));
        });
        
        // İstatistik butonları
        this.butonlar.istatistikSifirla.addEventListener('click', () => this.istatistikleriSifirla());
        this.butonlar.istatistikGeri.addEventListener('click', () => this.ekraniGoster('menu'));
        
        // Oyun butonları
        this.butonlar.oyunMenu.addEventListener('click', () => this.oyunuDurdur());
        this.butonlar.oyunYardim.addEventListener('click', () => this.ekraniGoster('nasilOynanir'));
        
        this.butonlar.kontrolEt.addEventListener('click', () => this.kombinasyonuKontrolEt());
        this.butonlar.kartVer.addEventListener('click', () => this.kartVer());
        this.butonlar.desteyiAc.addEventListener('click', () => this.destedenKartCek());
        
        // Oyun sonu butonları
        this.butonlar.yeniOyun.addEventListener('click', () => this.oyunuBaslat());
        this.butonlar.anaMenu.addEventListener('click', () => this.ekraniGoster('menu'));
        
        // Canvas olayları
        this.canvaslar.oyuncu.addEventListener('mousedown', (e) => this.oyuncuMouseDown(e));
        this.canvaslar.oyuncu.addEventListener('mousemove', (e) => this.oyuncuMouseMove(e));
        this.canvaslar.oyuncu.addEventListener('mouseup', (e) => this.oyuncuMouseUp(e));
        
        this.canvaslar.kombinasyon.addEventListener('mouseup', (e) => this.kombinasyonMouseUp(e));
        
        this.canvaslar.acikKart.addEventListener('click', (e) => this.acikKartClick(e));
        this.canvaslar.deste.addEventListener('click', (e) => this.desteClick(e));
        
        // Pencere olayları
        window.addEventListener('resize', () => this.pencereYenidenBoyutlandirildi());
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
        this.kontekstler.deste.clearRect(0, 0, this.canvaslar.deste.width, this.canvaslar.deste.height);
        this.kontekstler.acikKart.clearRect(0, 0, this.canvaslar.acikKart.width, this.canvaslar.acikKart.height);
        this.kontekstler.kombinasyon.clearRect(0, 0, this.canvaslar.kombinasyon.width, this.canvaslar.kombinasyon.height);
        this.kontekstler.oyuncu.clearRect(0, 0, this.canvaslar.oyuncu.width, this.canvaslar.oyuncu.height);
        
        // Desteyi çiz
        if (this.oyun.deste.length > 0) {
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
        if (this.oyun.acikKart) {
            this.oyun.acikKart.x = 0;
            this.oyun.acikKart.y = 0;
            this.oyun.acikKart.ciz(this.kontekstler.acikKart);
        }
        
        // Oyuncu kartlarını çiz
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
        
        // Kombinasyon alanındaki kartları çiz
        for (let i = 0; i < this.kombinasyonKartlari.length; i++) {
            const kart = this.kombinasyonKartlari[i];
            kart.x = i * (kartGenislik + kartMarj);
            kart.y = 0;
            kart.ciz(this.kontekstler.kombinasyon);
        }
        
        // Kalan kart sayısını güncelle
        document.getElementById('kalan-kart').textContent = this.oyun.deste.length;
        
        // Puanları güncelle
        document.getElementById('oyuncu-puan').textContent = this.oyun.oyuncu.puan;
        for (let i = 0; i < this.ayarlar.botSayisi; i++) {
            document.getElementById(`bot${i+1}-puan`).textContent = this.oyun.botlar[i].puan;
        }
        
        // Durum mesajını güncelle
        let durumMesaji = '';
        
        if (this.oyun.oyuncu.sirada) {
            durumMesaji = 'Sizin sıranız.';
        } else {
            const siradakiBotIndeks = this.oyun.aktifOyuncuIndeksi - 1;
            durumMesaji = `Bot ${siradakiBotIndeks + 1} oynuyor...`;
        }
        
        document.getElementById('durum-mesaji').textContent = durumMesaji;
        
        // Eğer oyun sürüklenen kart varsa, ona göre güncelle
        if (this.suruklenenKart) {
            this.suruklenenKart.x = this.mouseX - kartGenislik / 2;
            this.suruklenenKart.y = this.mouseY - kartYukseklik / 2;
            this.suruklenenKart.ciz(this.kontekstler.oyuncu);
        }
        
        // Yeniden çizim için animasyon isteği
        requestAnimationFrame(() => this.arayuzuGuncelle());
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
        this.arayuzuGuncelle();
    }
    
    kombinasyonMouseUp(e) {
        if (!this.suruklenenKart) return;
        
        // Kartı kombinasyon alanına taşı
        this.kombinasyonKartlari.push(this.suruklenenKart);
        this.oyun.oyuncu.kartlar.splice(this.suruklenenKartIndeks, 1);
        
        // Kartı bırak
        this.suruklenenKart = null;
        this.arayuzuGuncelle();
    }
    
    acikKartClick(e) {
        if (!this.oyunAktif || !this.oyun.oyuncu.sirada) return;
        
        // Açık kartı al
        this.oyun.acikKartiAl();
        this.arayuzuGuncelle();
    }
    
    desteClick(e) {
        if (!this.oyunAktif || !this.oyun.oyuncu.sirada) return;
        
        // Desteden kart çek
        this.destedenKartCek();
    }
    
    /**
     * Kombinasyonu kontrol eder
     */
    kombinasyonuKontrolEt() {
        if (this.kombinasyonKartlari.length === 0) return;
        
        // Geçerli kombinasyon mu kontrol et
        const sonuc = this.oyun.kombinasyonlariKontrolEt(this.kombinasyonKartlari);
        
        if (sonuc.gecerli) {
            // Geçerli kombinasyon - puanları hesapla ve kartları kaldır
            const puan = this.oyun.puanHesapla(sonuc);
            this.oyun.oyuncu.puan += puan;
            
            // Kombinasyon alanını temizle
            this.kombinasyonKartlari = [];
            
            // Oyuncu kartları bittiyse oyunu bitir
            if (this.oyun.oyuncu.kartlar.length === 0) {
                this.oyunuBitir(true);
            }
        } else {
            // Geçersiz kombinasyon - kartları geri ver
            this.oyun.oyuncu.kartlar.push(...this.kombinasyonKartlari);
            this.kombinasyonKartlari = [];
        }
        
        this.arayuzuGuncelle();
    }
    
    /**
     * Kart verir
     */
    kartVer() {
        if (!this.oyunAktif || !this.oyun.oyuncu.sirada || this.oyun.oyuncu.kartlar.length === 0) return;
        
        // Rastgele bir kart seç
        const kartIndeks = Math.floor(Math.random() * this.oyun.oyuncu.kartlar.length);
        
        // Kartı seç ve ver
        this.oyun.kartSec(kartIndeks);
        this.arayuzuGuncelle();
    }
    
    /**
     * Desteden kart çeker
     */
    destedenKartCek() {
        if (!this.oyunAktif || !this.oyun.oyuncu.sirada) return;
        
        // Desteden kart çek
        this.oyun.destedenKartCek();
        this.arayuzuGuncelle();
    }
    
    /**
     * Oyunu bitirir
     * @param {boolean} kazandiMi Oyuncu kazandı mı
     */
    oyunuBitir(kazandiMi = true) {
        // Oyun durumunu güncelle
        this.oyunAktif = false;
        
        // Sonuç mesajını ayarla
        const sonucMesaji = kazandiMi ? 'Tebrikler! Kazandınız!' : 'Kaybettiniz!';
        document.getElementById('sonuc-mesaji').textContent = sonucMesaji;
        
        // Puan detaylarını göster
        document.getElementById('sonuc-puan').textContent = this.oyun.oyuncu.puan;
        
        // TODO: Grup ve periyot sayılarını gerçek verilerden hesapla
        document.getElementById('sonuc-grup').textContent = '0';
        document.getElementById('sonuc-periyot').textContent = '0';
        
        // İstatistikleri güncelle
        this.istatistikleriGuncelle(kazandiMi);
        
        // Oyun sonu ekranını göster
        this.ekraniGoster('oyunSonu');
    }
    
    /**
     * İstatistikleri günceller
     * @param {boolean} kazandiMi Oyuncu kazandı mı
     */
    istatistikleriGuncelle(kazandiMi) {
        // localStorage'dan mevcut istatistikleri al
        let istatistikler = JSON.parse(localStorage.getItem('periyodikOkey_istatistikler')) || {
            toplamOyun: 0,
            kazanilanOyun: 0,
            kaybedilenOyun: 0,
            enYuksekPuan: 0,
            toplamPuan: 0,
            elementSayilari: {},
            grupSayilari: {},
            periyotSayilari: {}
        };
        
        // İstatistikleri güncelle
        istatistikler.toplamOyun++;
        if (kazandiMi) {
            istatistikler.kazanilanOyun++;
        } else {
            istatistikler.kaybedilenOyun++;
        }
        
        // Puan istatistikleri
        const oyuncuPuani = this.oyun.oyuncu.puan;
        istatistikler.toplamPuan += oyuncuPuani;
        if (oyuncuPuani > istatistikler.enYuksekPuan) {
            istatistikler.enYuksekPuan = oyuncuPuani;
        }
        
        // TODO: Element, grup ve periyot istatistiklerini güncelle
        
        // İstatistikleri kaydet
        localStorage.setItem('periyodikOkey_istatistikler', JSON.stringify(istatistikler));
        
        // İstatistik arayüzünü güncelle
        this.istatistikArayuzunuGuncelle(istatistikler);
    }
    
    /**
     * İstatistik arayüzünü günceller
     * @param {Object} istatistikler İstatistik verileri
     */
    istatistikArayuzunuGuncelle(istatistikler) {
        document.getElementById('toplam-oyun').textContent = istatistikler.toplamOyun;
        document.getElementById('kazanilan-oyun').textContent = istatistikler.kazanilanOyun;
        document.getElementById('kaybedilen-oyun').textContent = istatistikler.kaybedilenOyun;
        
        // Kazanma oranı
        const kazanmaOrani = istatistikler.toplamOyun > 0 
            ? Math.round((istatistikler.kazanilanOyun / istatistikler.toplamOyun) * 100) 
            : 0;
        document.getElementById('kazanma-orani').textContent = `${kazanmaOrani}%`;
        
        // Puan istatistikleri
        document.getElementById('en-yuksek-puan').textContent = istatistikler.enYuksekPuan;
        const ortalamaPuan = istatistikler.toplamOyun > 0 
            ? Math.round(istatistikler.toplamPuan / istatistikler.toplamOyun) 
            : 0;
        document.getElementById('ortalama-puan').textContent = ortalamaPuan;
        document.getElementById('toplam-puan').textContent = istatistikler.toplamPuan;
        
        // TODO: En çok kullanılan element, grup ve periyot istatistiklerini güncelle
    }
}

// Sayfa yüklendiğinde arayüz kontrolünü başlat
window.addEventListener('DOMContentLoaded', () => {
    const arayuzKontrol = new ArayuzKontrol();
}); 