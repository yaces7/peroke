/**
 * Periyodik Okey - Oyun Motoru
 * Temel oyun işlevlerini yöneten motor sınıfı
 */

class OyunMotoru {
    constructor() {
        this.oyun = null;
        this.hazir = false;
        this.ayarlar = {
            fps: 60,
            animasyonHizi: 1.0
        };
        this.oncekiZaman = 0;
        this.animasyonCerceveID = null;
    }

    /**
     * Oyun motoru başlatma
     * @param {PeriyodikOkey} oyun - Oyun sınıfı referansı
     */
    baslat(oyun) {
        if (this.hazir) return;
        
        this.oyun = oyun;
        this.hazir = true;
        
        // Ana döngüyü başlat
        this.animasyonCerceveID = requestAnimationFrame(this.anaDongu.bind(this));
        
        console.log("Oyun motoru başlatıldı.");
    }
    
    /**
     * Oyun motoru durdurma
     */
    durdur() {
        if (!this.hazir) return;
        
        if (this.animasyonCerceveID) {
            cancelAnimationFrame(this.animasyonCerceveID);
            this.animasyonCerceveID = null;
        }
        
        this.hazir = false;
        console.log("Oyun motoru durduruldu.");
    }
    
    /**
     * Ana oyun döngüsü
     * @param {number} suankiZaman - Geçerli zaman damgası
     */
    anaDongu(suankiZaman) {
        // Bir sonraki kareyi için döngüyü devam ettir
        this.animasyonCerceveID = requestAnimationFrame(this.anaDongu.bind(this));
        
        // Kare süresini hesapla
        const deltaZaman = (suankiZaman - this.oncekiZaman) / 1000;
        this.oncekiZaman = suankiZaman;
        
        // Minimum kare hızı kontrolü
        if (deltaZaman > 0.25) return;
        
        // Oyun güncelleme
        this.guncelle(deltaZaman);
        
        // Oyun çizimi
        this.ciz();
    }
    
    /**
     * Oyun durumunu güncelleme
     * @param {number} deltaZaman - Önceki kareden bu yana geçen süre
     */
    guncelle(deltaZaman) {
        if (!this.oyun || !this.hazir) return;
        
        // Oyun mantığını güncelle
        if (typeof this.oyun.guncelle === 'function') {
            this.oyun.guncelle(deltaZaman * this.ayarlar.animasyonHizi);
        }
    }
    
    /**
     * Oyun arayüzünü çizme
     */
    ciz() {
        if (!this.oyun || !this.hazir) return;
        
        // Oyun arayüzünü çiz
        if (typeof this.oyun.ciz === 'function') {
            this.oyun.ciz();
        }
    }
    
    /**
     * Oyun ayarlarını güncelleme
     * @param {Object} yeniAyarlar - Yeni ayarlar nesnesi
     */
    ayarlariGuncelle(yeniAyarlar) {
        this.ayarlar = { ...this.ayarlar, ...yeniAyarlar };
    }
}

// Dışa aktar (export)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OyunMotoru;
}

// Global olarak erişime izin ver
window.OyunMotoru = OyunMotoru; 