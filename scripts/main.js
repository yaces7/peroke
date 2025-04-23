/**
 * Periyodik Okey - Ana JavaScript Dosyası
 * Oyun başlangıcı ve genel kontroller
 */

// Sayfa tam olarak yüklendiğinde başla
document.addEventListener('DOMContentLoaded', () => {
    console.log("Periyodik Okey oyunu başlatılıyor...");
    
    // Oyun versiyonu
    const VERSION = "0.1.0";
    console.log(`Versiyon: ${VERSION}`);
    
    // Hata yakalama
    window.onerror = function(message, source, lineno, colno, error) {
        console.error(`HATA: ${message} - ${source}:${lineno}:${colno}`);
        return true;
    };
    
    // Alternatif ses yönetici oluştur (hiçbir ses dosyasını yükleme)
    const sesYoneticisi = new SesYoneticisi();
    
    // Ses çalma fonksiyonu (devre dışı)
    function sesEfektiCal(sesAdi) {
        // Ses devre dışı, hiçbir şey yapma
        console.log(`Ses efekti çalma devre dışı: ${sesAdi}`);
        return false;
    }
    
    // Global sesCal fonksiyonu tanımla (oyun mekanikleri için)
    window.sesCal = sesEfektiCal;
    
    // Kayıtlı ayarları yükle
    function ayarlariYukle() {
        try {
            const ayarlar = JSON.parse(localStorage.getItem('periyodikOkey_ayarlar'));
            if (ayarlar) {
                // Select elementlerine atama
                if (ayarlar.botSayisi) {
                    document.getElementById('bot-sayisi').value = ayarlar.botSayisi;
                }
                if (ayarlar.zorlukSeviyesi) {
                    document.getElementById('zorluk-seviyesi').value = ayarlar.zorlukSeviyesi;
                }
                
                // Checkbox elementlerine atama
                if (ayarlar.sesEfektleri !== undefined) {
                    document.getElementById('ses-efektleri').checked = ayarlar.sesEfektleri;
                }
                if (ayarlar.muzik !== undefined) {
                    document.getElementById('muzik').checked = ayarlar.muzik;
                }
            }
        } catch (error) {
            console.error("Ayarlar yüklenirken hata oluştu:", error);
            // Hata durumunda varsayılan ayarları kullan
        }
    }
    
    // Ayarları yükle
    ayarlariYukle();
    
    function istatistikleriYukle() {
        try {
            const istatistikler = JSON.parse(localStorage.getItem('periyodikOkey_istatistikler'));
            if (istatistikler) {
                // İstatistikleri göster
                document.getElementById('oyun-sayisi').innerText = istatistikler.oyunSayisi || 0;
                document.getElementById('kazanma-sayisi').innerText = istatistikler.kazanmaSayisi || 0;
                document.getElementById('kaybetme-sayisi').innerText = istatistikler.kaybetmeSayisi || 0;
                document.getElementById('toplam-puan').innerText = istatistikler.toplamPuan || 0;
                
                // Kazanma oranını hesapla
                const toplamOyun = istatistikler.oyunSayisi || 0;
                const kazanma = istatistikler.kazanmaSayisi || 0;
                
                let kazanmaOrani = 0;
                if (toplamOyun > 0) {
                    kazanmaOrani = Math.round((kazanma / toplamOyun) * 100);
                }
                
                document.getElementById('kazanma-orani').innerText = kazanmaOrani + '%';
                
                // En yüksek skoru göster
                document.getElementById('en-yuksek-skor').innerText = istatistikler.enYuksekSkor || 0;
            }
        } catch (error) {
            console.error("İstatistikler yüklenirken hata oluştu:", error);
            // Hata durumunda istatistikleri sıfırla
        }
    }
    
    // İstatistikleri yükle
    istatistikleriYukle();
    
    // Ayarlar formundaki değişiklikleri kaydet
    document.getElementById('btn-ayarlar-kaydet').addEventListener('click', () => {
        try {
            const ayarlar = {
                botSayisi: parseInt(document.getElementById('bot-sayisi').value),
                zorlukSeviyesi: document.getElementById('zorluk-seviyesi').value,
                sesEfektleri: document.getElementById('ses-efektleri').checked,
                muzik: document.getElementById('muzik').checked
            };
            
            localStorage.setItem('periyodikOkey_ayarlar', JSON.stringify(ayarlar));
            console.log("Ayarlar kaydedildi:", ayarlar);
        } catch (error) {
            console.error("Ayarlar kaydedilirken hata oluştu:", error);
        }
    });
    
    // Çıkış butonu olayı (web tarayıcısında çalışmayabilir)
    document.getElementById('btn-cikis').addEventListener('click', () => {
        if (confirm("Oyundan çıkmak istediğinize emin misiniz?")) {
            window.close();
        }
    });
    
    // Oyuna başla butonu için ses efekti (devre dışı)
    document.getElementById('btn-oyuna-basla').addEventListener('click', () => {
        console.log("Oyun başlatılıyor...");
        // Oyun ekranını göster
        document.getElementById('menu-screen').classList.add('gizli');
        document.getElementById('oyun-screen').classList.remove('gizli');
    });
    
    // Ayarlar değiştiğinde ses durumunu güncelle
    document.getElementById('ses-efektleri').addEventListener('change', (e) => {
        localStorage.setItem('periyodikOkey_sesEfektleri', e.target.checked);
    });
    
    // Müzik ayarı değiştiğinde müzik durumunu güncelle
    document.getElementById('muzik').addEventListener('change', (e) => {
        localStorage.setItem('periyodikOkey_muzik', e.target.checked);
        // TODO: Müzik çalma/durdurma işlemleri eklenecek
    });
    
    // Tarayıcı yerel depolama kullanabilir mi kontrolü
    if (!window.localStorage) {
        console.warn("Bu tarayıcı yerel depolama desteklemiyor! Ayarlar ve istatistikler kaydedilemeyecek.");
    }
    
    // Oyun için gerekli CSV dosyasını yükle
    async function elementVerileriniYukle() {
        try {
            const response = await fetch('elementler.csv');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvVerisi = await response.text();
            const elementler = csvDosyasindanElementleriYukle(csvVerisi);
            console.log(`${elementler.length} element verisi yüklendi.`);
            return elementler;
        } catch (error) {
            console.error("Element verileri yüklenirken hata oluştu:", error);
            // Hata durumunda varsayılan element verilerini kullan
            return ELEMENT_VERILERI;
        }
    }
    
    // Gerekli dosyaların yüklenip yüklenmediğini kontrol et
    function tanimlariKontrolEt() {
        // ElementKarti sınıfı yüklendi mi
        if (typeof ElementKarti === 'undefined') {
            console.error("ElementKarti sınıfı yüklenemedi!");
            alert("Oyun dosyaları eksik! Lütfen sayfayı yenileyin.");
            return false;
        }
        
        // PeriyodikOkey sınıfı yüklendi mi
        if (typeof PeriyodikOkey === 'undefined') {
            console.error("PeriyodikOkey sınıfı yüklenemedi!");
            alert("Oyun dosyaları eksik! Lütfen sayfayı yenileyin.");
            return false;
        }
        
        // Element verileri yüklendi mi
        if (typeof ELEMENT_VERILERI === 'undefined') {
            console.error("Element verileri yüklenemedi!");
            alert("Element verileri yüklenemedi! Lütfen sayfayı yenileyin.");
            return false;
        }
        
        // SesYoneticisi sınıfı yüklendi mi
        if (typeof SesYoneticisi === 'undefined') {
            console.error("SesYoneticisi sınıfı yüklenemedi!");
            alert("Ses yöneticisi yüklenemedi! Lütfen sayfayı yenileyin.");
            return false;
        }
        
        return true;
    }
    
    // Tanımları kontrol et
    if (!tanimlariKontrolEt()) {
        return;
    }
    
    // Ana menüdeki butonların işlevselliği
    document.getElementById('btn-nasil-oynanir').addEventListener('click', () => {
        document.getElementById('menu-screen').classList.add('gizli');
        document.getElementById('nasil-oynanir-screen').classList.remove('gizli');
    });
    
    document.getElementById('btn-istatistikler').addEventListener('click', () => {
        document.getElementById('menu-screen').classList.add('gizli');
        document.getElementById('istatistikler-screen').classList.remove('gizli');
    });
    
    document.getElementById('btn-ayarlar').addEventListener('click', () => {
        document.getElementById('menu-screen').classList.add('gizli');
        document.getElementById('ayarlar-screen').classList.remove('gizli');
    });
    
    // Ekranlardan ana menüye dönüş butonları
    document.querySelectorAll('.btn-geri').forEach(buton => {
        buton.addEventListener('click', () => {
            // Tüm ekranları gizle
            document.querySelectorAll('.ekran').forEach(ekran => {
                ekran.classList.add('gizli');
            });
            // Ana menüyü göster
            document.getElementById('menu-screen').classList.remove('gizli');
        });
    });
    
    console.log("Periyodik Okey oyunu hazır!");
}); 