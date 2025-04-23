/**
 * Periyodik Okey - Ses Yöneticisi
 * Oyun seslerini yönetmek için kullanılan sınıf
 */

class SesYoneticisi {
    /**
     * Ses yöneticisi yapıcı metodu
     */
    constructor() {
        // Ses açık/kapalı durumu
        this.sesEfektleriAcik = false;
        this.muzikAcik = false;
        
        // Ses efektleri
        this.sesEfektleri = {
            kartAl: null,
            kartKoy: null,
            okey: null,
            hata: null,
            basari: null,
            tur: null
        };
        
        // Arka plan müziği
        this.muzik = null;
        
        console.log("Ses yöneticisi oluşturuldu");
    }
    
    /**
     * Ses efektlerini yükler
     */
    sesleriYukle() {
        try {
            // Burada normalde ses dosyaları yüklenirdi
            // Şu an sadece log mesajı yazdırıyoruz
            console.log("Ses dosyaları yükleniyor");
            return true;
        } catch (error) {
            console.error("Ses dosyaları yüklenirken hata oluştu:", error);
            return false;
        }
    }
    
    /**
     * Ses efektlerini açar/kapatır
     * @param {boolean} durum - Açık/kapalı durumu
     */
    sesEfektleriniAyarla(durum) {
        this.sesEfektleriAcik = durum;
        console.log("Ses efektleri " + (durum ? "açıldı" : "kapatıldı"));
    }
    
    /**
     * Müziği açar/kapatır
     * @param {boolean} durum - Açık/kapalı durumu
     */
    muzigiAyarla(durum) {
        this.muzikAcik = durum;
        console.log("Müzik " + (durum ? "açıldı" : "kapatıldı"));
    }
    
    /**
     * Ses efekti çalar
     * @param {string} sesAdi - Çalınacak ses efektinin adı
     */
    sesEfektiCal(sesAdi) {
        if (!this.sesEfektleriAcik) return;
        
        console.log(`Ses efekti çalınıyor: ${sesAdi}`);
        // Burada normalde ses efekti çalınırdı
    }
    
    /**
     * Arka plan müziğini çalar
     */
    muzigiCal() {
        if (!this.muzikAcik) return;
        
        console.log("Arka plan müziği çalınıyor");
        // Burada normalde müzik çalınırdı
    }
    
    /**
     * Arka plan müziğini durdurur
     */
    muzigiDurdur() {
        console.log("Arka plan müziği durduruldu");
        // Burada normalde müzik durdurulurdu
    }
}

// Global olarak erişime izin ver
window.SesYoneticisi = SesYoneticisi;

// Node.js ortamında modül olarak dışa aktar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SesYoneticisi };
} 