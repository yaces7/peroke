/**
 * Periyodik Okey - Ses Yöneticisi
 * 
 * Bu dosya, oyun içinde kullanılan ses efektlerini yönetmek için
 * gerekli fonksiyonları içerir.
 */

class SesYoneticisi {
    constructor() {
        // Ses efektleri nesnesi
        this.sesler = {};
        
        // Ses ayarları
        this.sesAktif = true;
        this.sesSeviyesi = 0.5; // 0.0 - 1.0 arasında
        
        // Ses efektlerini yükle
        this.sesleriYukle();
    }
    
    /**
     * Oyun için gerekli ses efektlerini yükler
     */
    sesleriYukle() {
        // Sesler henüz gerçekten yüklenmeyecek, sadece yükleme simülasyonu yapılacak
        const sesListesi = [
            'kart_al',
            'kart_ver',
            'kart_sec',
            'yeni_oyun',
            'oyun_sonu',
            'kombinasyon_basarili',
            'kombinasyon_basarisiz',
            'buton_tikla'
        ];
        
        console.log('Ses efektleri hazırlanıyor...');
        
        // Sesleri yükleyemiyormuş gibi simüle et
        sesListesi.forEach(sesAdi => {
            this.sesler[sesAdi] = null;
            console.log(`Ses efekti hazırlandı: ${sesAdi}`);
        });
        
        console.log('Ses efektleri hazır!');
    }
    
    /**
     * Ses seviyesini ayarlar
     * @param {number} seviye - 0.0 ile 1.0 arasında bir değer
     */
    sesSeviyesiAyarla(seviye) {
        this.sesSeviyesi = Math.max(0, Math.min(1, seviye));
        
        // Tüm seslerin seviyesini güncelle (gerçek projede burada audio elementlerinin
        // volume değerleri güncellenecek)
        console.log(`Ses seviyesi ayarlandı: ${this.sesSeviyesi}`);
    }
    
    /**
     * Tüm sesleri açar veya kapatır
     * @param {boolean} aktif - Seslerin açık/kapalı durumu
     */
    sesleriAcKapat(aktif) {
        this.sesAktif = aktif;
        console.log(`Sesler ${aktif ? 'açıldı' : 'kapatıldı'}`);
    }
    
    /**
     * Belirtilen ses efektini çalar
     * @param {string} sesAdi - Çalınacak ses efektinin adı
     * @param {boolean} dongu - Sesin döngüde çalınıp çalınmayacağı
     * @returns {boolean} - Ses çalma işlemi başarılı mı?
     */
    sesCal(sesAdi, dongu = false) {
        // Ses kapalıysa veya ses yüklenmemişse çalma
        if (!this.sesAktif || !this.sesler[sesAdi]) {
            console.log(`Ses çalınamadı: ${sesAdi}`);
            return false;
        }
        
        // Gerçek projede burada ses çalma kodları olacak
        // Şimdilik sadece log mesajı yazdır
        console.log(`Ses çalınıyor: ${sesAdi}, Döngü: ${dongu ? 'Evet' : 'Hayır'}`);
        return true;
    }
    
    /**
     * Belirtilen ses efektini durdurur
     * @param {string} sesAdi - Durdurulacak ses efektinin adı
     */
    sesDurdur(sesAdi) {
        if (!this.sesler[sesAdi]) {
            return;
        }
        
        // Gerçek projede burada ses durdurma kodları olacak
        console.log(`Ses durduruldu: ${sesAdi}`);
    }
    
    /**
     * Tüm sesleri durdurur
     */
    tumSesleriDurdur() {
        // Gerçek projede burada tüm sesleri durdurma kodları olacak
        console.log('Tüm sesler durduruldu');
    }
}

// Global scope'a SesYoneticisi sınıfını ekle
window.SesYoneticisi = SesYoneticisi;

// Node.js ortamında modül olarak dışa aktar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SesYoneticisi };
} 