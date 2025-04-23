/**
 * Periyodik Okey - Ses Yöneticisi
 * Oyun içi ses efektlerini yönetmek için kullanılan sınıf
 */

class SesYoneticisi {
    /**
     * SesYoneticisi yapıcı metodu
     * @param {Object} ayarlar - Ses ayarları
     */
    constructor(ayarlar = {}) {
        // Ses yolunu ayarla (varsayılan: assets/sounds/)
        this.sesYolu = ayarlar.sesYolu || 'assets/sounds/';
        
        // Ses açık mı?
        this.sesAcik = false; // Varsayılan olarak ses kapalı
        
        // Ses seviyesi (0-1 arası)
        this.sesSeviyesi = ayarlar.sesSeviyesi !== undefined ? ayarlar.sesSeviyesi : 0.5;
        
        // Ses efektleri nesnesi - boş bırakılacak
        this.sesEfektleri = {};
        
        // Ses dosyaları erişilebilir değil
        this.seslerErisilebilir = false;
        
        console.info("Ses sistemi devre dışı bırakıldı. Ses dosyaları daha sonra eklenecek.");
    }
    
    /**
     * Belirtilen ses efektini çalar - şu an çalışmayacak
     * @param {string} sesAdi - Çalınacak ses efektinin adı
     * @return {boolean} Ses efekti çalındı mı?
     */
    sesEfektiCal(sesAdi) {
        // Ses devre dışı olduğundan hiçbir şey yapma
        return false;
    }
    
    /**
     * Tüm ses efektlerini durduruyor - şu an çalışmayacak
     */
    tumSesleriDurdur() {
        // Ses devre dışı olduğundan hiçbir şey yapma
        return;
    }
    
    /**
     * Ses açık/kapalı durumunu değiştirir - şu an etkisiz
     * @param {boolean} durum - Yeni ses durumu (true: açık, false: kapalı)
     */
    sesAcikKapali(durum) {
        // Ses devre dışı olduğundan hiçbir şey yapma
        return;
    }
    
    /**
     * Ses seviyesini ayarlar - şu an etkisiz
     * @param {number} seviye - Yeni ses seviyesi (0-1 arası)
     */
    sesSeviyesiniAyarla(seviye) {
        // Ses devre dışı olduğundan hiçbir şey yapma
        return;
    }
    
    /**
     * Daha sonra kullanılmak üzere ses sistemini etkinleştirir
     * @param {boolean} deger - Ses sistemini etkinleştirme durumu
     */
    sesiEtkinlestir(deger = false) {
        console.info(`Ses sistemi ${deger ? 'etkinleştirildi' : 'devre dışı bırakıldı'}.`);
        this.sesAcik = deger;
        this.seslerErisilebilir = deger;
    }
}

// Tarayıcı ortamında global değişken olarak tanımla
if (typeof window !== 'undefined') {
    window.SesYoneticisi = SesYoneticisi;
}

// Node.js ortamında modül olarak dışa aktar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SesYoneticisi };
} 