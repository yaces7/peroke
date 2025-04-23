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
    
    // Ses efektlerini yükle
    const sesler = {
        kartAl: new Audio("assets/sounds/kart_al.mp3"),
        kartVer: new Audio("assets/sounds/kart_ver.mp3"),
        kombinasyonGecerli: new Audio("assets/sounds/kombinasyon_gecerli.mp3"),
        kombinasyonGecersiz: new Audio("assets/sounds/kombinasyon_gecersiz.mp3"),
        oyunBasla: new Audio("assets/sounds/oyun_basla.mp3"),
        oyunBitir: new Audio("assets/sounds/oyun_bitir.mp3")
    };
    
    // Ses efektlerini sustur (varsayılan olarak)
    Object.values(sesler).forEach(ses => {
        ses.volume = 0;
    });
    
    // Ses çalma fonksiyonu
    function sesEfektiCal(sesAdi) {
        const sesAyari = localStorage.getItem('periyodikOkey_sesEfektleri');
        if (sesAyari !== 'false' && sesler[sesAdi]) {
            sesler[sesAdi].volume = 0.3;
            sesler[sesAdi].currentTime = 0;
            sesler[sesAdi].play().catch(e => console.log("Ses çalma hatası:", e));
        }
    }
    
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
    
    // İstatistikleri yükle
    function istatistikleriYukle() {
        try {
            const istatistikler = JSON.parse(localStorage.getItem('periyodikOkey_istatistikler'));
            if (istatistikler) {
                // İstatistik elementlerine atama
                document.getElementById('toplam-oyun').textContent = istatistikler.toplamOyun || 0;
                document.getElementById('kazanilan-oyun').textContent = istatistikler.kazanilanOyun || 0;
                document.getElementById('kaybedilen-oyun').textContent = istatistikler.kaybedilenOyun || 0;
                
                // Kazanma oranı
                const kazanmaOrani = istatistikler.toplamOyun > 0 
                    ? Math.round((istatistikler.kazanilanOyun / istatistikler.toplamOyun) * 100) 
                    : 0;
                document.getElementById('kazanma-orani').textContent = `${kazanmaOrani}%`;
                
                // Puan istatistikleri
                document.getElementById('en-yuksek-puan').textContent = istatistikler.enYuksekPuan || 0;
                const ortalamaPuan = istatistikler.toplamOyun > 0 
                    ? Math.round(istatistikler.toplamPuan / istatistikler.toplamOyun) 
                    : 0;
                document.getElementById('ortalama-puan').textContent = ortalamaPuan;
                document.getElementById('toplam-puan').textContent = istatistikler.toplamPuan || 0;
                
                // En çok kullanılan element, grup ve periyot
                document.getElementById('en-cok-element').textContent = 
                    istatistikler.enCokKullanilanElement || '-';
                document.getElementById('en-cok-grup').textContent = 
                    istatistikler.enCokKullanilanGrup || '-';
                document.getElementById('en-cok-periyot').textContent = 
                    istatistikler.enCokKullanilanPeriyot || '-';
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
    
    // Oyuna başla butonu için ses efekti
    document.getElementById('btn-oyuna-basla').addEventListener('click', () => {
        sesEfektiCal('oyunBasla');
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
        
        return true;
    }
    
    // Tanımları kontrol et
    if (!tanimlariKontrolEt()) {
        return;
    }
    
    console.log("Periyodik Okey oyunu hazır!");
}); 