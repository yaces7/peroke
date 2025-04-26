/**
 * Periyodik Okey - Ana JavaScript Dosyası
 * Oyun başlangıcı ve genel kontroller
 */

// Sayfa tam olarak yüklendiğinde başla
document.addEventListener('DOMContentLoaded', () => {
    console.log("Periyodik Okey oyunu başlatılıyor...");
    
    // Global değişkenler
    let botSayisi = 2;
    let oyuncuYildizlari = 0;
    let botYildizlari = [0, 0];
    let kalanKartSayisi = 56;
    let kartCekildi = false;
    
    // Ses Yöneticisi Sınıfı
    class SesYoneticisi {
        constructor() {
            this.sesler = {};
            this.muzikCaliyor = false;
            this.sesEfektleriAcik = true;
            this.muzikAcik = true;
        }
        
        sesEkle(sesAdi, sesDosyasi) {
            if (!this.sesler[sesAdi]) {
                this.sesler[sesAdi] = new Audio(sesDosyasi);
            }
        }
        
        sesCal(sesAdi) {
            if (this.sesEfektleriAcik && this.sesler[sesAdi]) {
                this.sesler[sesAdi].currentTime = 0;
                this.sesler[sesAdi].play();
                return true;
            }
            return false;
        }
        
        sesKapat(sesAdi) {
            if (this.sesler[sesAdi]) {
                this.sesler[sesAdi].pause();
                this.sesler[sesAdi].currentTime = 0;
            }
        }
    }
    
    // Ses yöneticisi oluştur
    const sesYoneticisi = new SesYoneticisi();
    
    // Butonları ayarla
    function butonlariAyarla() {
        // Ana menü butonları
        document.getElementById('yeni-oyun-btn')?.addEventListener('click', yeniOyunBaslat);
        document.getElementById('istatistikler-btn')?.addEventListener('click', istatistikleriGoster);
        document.getElementById('ayarlar-btn')?.addEventListener('click', ayarlariGoster);
        document.getElementById('nasil-oynanir-btn')?.addEventListener('click', nasilOynanirGoster);
        
        // Oyun içi butonları
        document.getElementById('kart-cek-btn')?.addEventListener('click', kartCek);
        document.getElementById('acik-kart-al-btn')?.addEventListener('click', acikKartAl);
        document.getElementById('kart-at-btn')?.addEventListener('click', kartAt);
        document.getElementById('kart-cek').addEventListener('click', kartCek);
        document.getElementById('kontrol-et').addEventListener('click', kartlariKontrolEt);
        
        // Geri butonları
        document.querySelectorAll('.btn-geri').forEach(btn => {
            btn.addEventListener('click', anaMenuyeDon);
        });
    }
    
    function yeniOyunBaslat() {
        document.getElementById('ana-menu-ekrani').classList.add('gizli');
        document.getElementById('oyun-ekrani').classList.remove('gizli');
        kartlariOlustur();
        turBaslat();
    }
    
    function istatistikleriGoster() {
        document.getElementById('ana-menu-ekrani').classList.add('gizli');
        document.getElementById('istatistikler-ekrani').classList.remove('gizli');
    }
    
    function ayarlariGoster() {
        document.getElementById('ana-menu-ekrani').classList.add('gizli');
        document.getElementById('ayarlar-ekrani').classList.remove('gizli');
    }
    
    function nasilOynanirGoster() {
        document.getElementById('ana-menu-ekrani').classList.add('gizli');
        document.getElementById('nasil-oynanir-ekrani').classList.remove('gizli');
    }
    
    function anaMenuyeDon() {
        document.querySelectorAll('.ekran').forEach(ekran => {
            ekran.classList.add('gizli');
        });
        document.getElementById('ana-menu-ekrani').classList.remove('gizli');
    }
    
    function kartCek() {
        if (kartCekildi) {
            durumMesajiGoster("Her tur sadece bir kart çekebilirsiniz!", '#ff0000');
            return;
        }
        
        if (!ELEMENT_VERILERI_OKEY) {
            console.error("Element verileri bulunamadı!");
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * ELEMENT_VERILERI_OKEY.length);
        const element = ELEMENT_VERILERI_OKEY[randomIndex];
        const kart = new ElementKartiSinifi(element);
        const kartHTML = kart.htmlOlustur(false);
        
        document.getElementById('oyuncu-kartlari')?.appendChild(kartHTML);
        kartCekildi = true;
        kalanKartSayisiniGuncelle(-1);
        durumMesajiGoster('Kart çektiniz. Şimdi bir kart atın veya kombinasyonları kontrol edin.', '#000000');
    }
    
    function acikKartAl() {
        if (kartCekildi) {
            durumMesajiGoster("Her tur sadece bir kart çekebilirsiniz!", '#ff0000');
            return;
        }
        
        const acikKart = document.querySelector('.acik-kart-alani .element-kart');
        if (acikKart) {
            document.getElementById('oyuncu-kartlari')?.appendChild(acikKart);
            kartCekildi = true;
            durumMesajiGoster('Açık kartı aldınız. Şimdi kartlarınızı kontrol edin veya bir kart atın.', '#000000');
        } else {
            durumMesajiGoster("Açık kart bulunmuyor!", '#ff0000');
        }
    }
    
    function kartAt() {
        const seciliKart = document.querySelector('.element-kart.secili');
        if (seciliKart) {
            const acikKartAlani = document.querySelector('.acik-kart-alani');
            acikKartAlani.innerHTML = '';
            acikKartAlani.appendChild(seciliKart);
            seciliKart.classList.remove('secili');
            
            durumMesajiGoster('Kartınızı verdiniz. Sıra botlara geçiyor...', '#000000');
            setTimeout(botHamleleriniSimuleEt, 2000);
        } else {
            durumMesajiGoster('Lütfen önce bir kart seçin!', '#ff0000');
        }
    }
    
    function turBaslat() {
        kartCekildi = false;
        durumMesajiGoster('Sıra sizde! Kart çekiniz veya açık kartı alınız.', '#000000');
    }
    
    function durumMesajiGoster(mesaj, renk = '#000000', sure = 2000) {
        const durumMesaji = document.getElementById('durum-mesaji');
        if (durumMesaji) {
            durumMesaji.textContent = mesaj;
            durumMesaji.style.color = renk;
            durumMesaji.style.fontWeight = 'bold';
        }
    }
    
    function kalanKartSayisiniGuncelle(deger = -1) {
        kalanKartSayisi += deger;
        document.getElementById('kalan-kart').textContent = `Kalan: ${kalanKartSayisi}`;
    }
    
    function kartlariKontrolEt() {
        const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
        const kartlar = Array.from(oyuncuKartlari.getElementsByClassName('element-kart'));
        
        // Kartları gruplandır
        const gruplar = kartlariGruplandir(kartlar);
        
        // Geçerli kombinasyonları kontrol et
        const gecerliKombinasyonlar = kombinasyonlariKontrolEt(gruplar);
        
        if (gecerliKombinasyonlar.length > 0) {
            durumMesajiGoster('Tebrikler! Geçerli kombinasyonlar buldunuz!', '#008000');
            oyuncuYildizlari++;
            document.getElementById('oyuncu-yildiz').textContent = `★ ${oyuncuYildizlari}`;
            
            // Kombinasyonları vurgula
            gecerliKombinasyonlar.forEach(kombinasyon => {
                kombinasyon.forEach(kart => {
                    kart.classList.add('gecerli-kombinasyon');
                });
            });
            
            setTimeout(() => {
                gecerliKombinasyonlar.forEach(kombinasyon => {
                    kombinasyon.forEach(kart => {
                        kart.classList.remove('gecerli-kombinasyon');
                    });
                });
            }, 2000);
        } else {
            durumMesajiGoster('Geçerli kombinasyon bulunamadı.', '#ff0000');
        }
    }

    function kartlariGruplandir(kartlar) {
        const gruplar = {
            periyot: {},
            grup: {},
            atomik: {}
        };
        
        kartlar.forEach(kart => {
            const veri = kart.dataset;
            if (!veri) return;
            
            // Periyoda göre grupla
            if (!gruplar.periyot[veri.periyot]) {
                gruplar.periyot[veri.periyot] = [];
            }
            gruplar.periyot[veri.periyot].push(kart);
            
            // Gruba göre grupla
            if (!gruplar.grup[veri.grup]) {
                gruplar.grup[veri.grup] = [];
            }
            gruplar.grup[veri.grup].push(kart);
            
            // Atomik numaraya göre grupla
            if (!gruplar.atomik[veri.atomik]) {
                gruplar.atomik[veri.atomik] = [];
            }
            gruplar.atomik[veri.atomik].push(kart);
        });
        
        return gruplar;
    }

    function kombinasyonlariKontrolEt(gruplar) {
        const gecerliKombinasyonlar = [];
        
        // Aynı periyottaki elementler (en az 3)
        Object.values(gruplar.periyot).forEach(kartlar => {
            if (kartlar.length >= 3) {
                gecerliKombinasyonlar.push(kartlar);
            }
        });
        
        // Aynı gruptaki elementler (en az 3)
        Object.values(gruplar.grup).forEach(kartlar => {
            if (kartlar.length >= 3) {
                gecerliKombinasyonlar.push(kartlar);
            }
        });
        
        // Ardışık atomik numaralı elementler (en az 3)
        const atomikNumaralar = Object.keys(gruplar.atomik).map(Number).sort((a, b) => a - b);
        let ardisikDizi = [atomikNumaralar[0]];
        
        for (let i = 1; i < atomikNumaralar.length; i++) {
            if (atomikNumaralar[i] === atomikNumaralar[i-1] + 1) {
                ardisikDizi.push(atomikNumaralar[i]);
            } else {
                if (ardisikDizi.length >= 3) {
                    const kombinasyon = ardisikDizi.map(num => gruplar.atomik[num][0]);
                    gecerliKombinasyonlar.push(kombinasyon);
                }
                ardisikDizi = [atomikNumaralar[i]];
            }
        }
        
        if (ardisikDizi.length >= 3) {
            const kombinasyon = ardisikDizi.map(num => gruplar.atomik[num][0]);
            gecerliKombinasyonlar.push(kombinasyon);
        }
        
        return gecerliKombinasyonlar;
    }
    
    // Başlangıç ayarları
    butonlariAyarla();
    console.log("Periyodik Okey oyunu hazır!");
}); 