/**
 * Periyodik Okey - Ana Kontrol Dosyası
 * Bu dosya, oyunun ana akışını kontrol eder ve modüller arası koordinasyonu sağlar.
 */

console.log('ArayuzKontrol var mı?', typeof window.ArayuzKontrol);
console.log('OyunAlani var mı?', typeof window.OyunAlani);

document.addEventListener('DOMContentLoaded', function() {
    console.log('Periyodik Okey oyunu başlatılıyor...');
    console.log('ArayuzKontrol DOMContentLoaded içinde var mı?', typeof window.ArayuzKontrol);
    console.log('OyunAlani DOMContentLoaded içinde var mı?', typeof window.OyunAlani);

    // Global değişkenler
    let arayuzKontrol = null;
    let oyunAlani = null;
    
    // Ekranlar
    const ekranlar = {
        menu: document.getElementById('menu-ekrani'),
        ayarlar: document.getElementById('ayarlar-ekrani'),
        nasilOynanir: document.getElementById('nasil-oynanir-ekrani'),
        istatistikler: document.getElementById('istatistikler-ekrani'),
        oyun: document.getElementById('oyun-ekrani'),
        oyunSonu: document.getElementById('oyun-sonu-ekrani')
    };
    
    // Butonlar
    const butonlar = {
        oyunuBaslat: document.getElementById('btn-oyunu-baslat'),
        nasilOynanir: document.getElementById('btn-nasil-oynanir'),
        istatistikler: document.getElementById('btn-istatistikler'),
        ayarlar: document.getElementById('btn-ayarlar'),
        cikis: document.getElementById('btn-cikis'),
        
        anaSayfa: document.getElementById('btn-ana-sayfa'),
        oyunYardim: document.getElementById('btn-oyun-yardim'),
        
        ayarlarKaydet: document.getElementById('btn-ayarlar-kaydet'),
        ayarlarGeri: document.getElementById('btn-ayarlar-geri'),
        
        nasilOynanirGeri: document.getElementById('btn-nasil-oynanir-geri'),
        
        istatistikSifirla: document.getElementById('btn-istatistik-sifirla'),
        istatistiklerGeri: document.getElementById('btn-istatistikler-geri'),
        
        yeniOyun: document.getElementById('btn-yeni-oyun'),
        anaMenu: document.getElementById('btn-ana-menu'),
        
        kartAl: document.getElementById('btn-kart-al'),
        grubaGoreSirala: document.getElementById('btn-gruba-gore-sirala'),
        periyodaGoreSirala: document.getElementById('btn-periyoda-gore-sirala')
    };

    // Butonları kontrol et
    console.log("Oyunu başlat butonu:", butonlar.oyunuBaslat);

    /**
     * Belirli bir ekranı gösterip diğerlerini gizler
     * @param {HTMLElement} ekran - Gösterilecek ekran
     */
    function ekranGoster(ekran) {
        console.log("Ekran gösteriliyor:", ekran);
        // Tüm ekranları gizle
        Object.values(ekranlar).forEach(e => {
            if (e) e.classList.add('gizli');
        });
        
        // İstenen ekranı göster
        if (ekran) ekran.classList.remove('gizli');
    }

    /**
     * Oyunu başlatır
     */
    function oyunuBaslat() {
        console.log('Oyun başlatılıyor...');
        
        try {
            // Bot sayısı ve zorluk seviyesini ayarla
            const botSayisi = parseInt(document.getElementById('bot-sayisi').value) || 3;
            const zorlukSeviyesi = document.getElementById('zorluk-seviyesi').value || 'orta';
            
            console.log('Ayarlar:', { botSayisi, zorlukSeviyesi });
            
            // Oyun ekranını göster
            ekranGoster(ekranlar.oyun);
            
            // Sınıfların mevcut olup olmadığını kontrol et
            if (typeof ArayuzKontrol !== 'function') {
                throw new Error('ArayuzKontrol sınıfı bulunamadı!');
            }
            
            if (typeof OyunAlani !== 'function') {
                throw new Error('OyunAlani sınıfı bulunamadı!');
            }
            
            // Arayüz kontrolünü ve oyun alanını başlat
            try {
                arayuzKontrol = new ArayuzKontrol();
            } catch (error) {
                console.error("ArayuzKontrol başlatılırken hata:", error);
                throw error;
            }
            
            try {
                oyunAlani = new OyunAlani({
                    botSayisi: botSayisi,
                    zorlukSeviyesi: zorlukSeviyesi
                });
            } catch (error) {
                console.error("OyunAlani başlatılırken hata:", error);
                throw error;
            }
            
            // Oyunu başlat
            try {
                oyunAlani.oyunuBaslat();
            } catch (error) {
                console.error("Oyun başlatılırken hata:", error);
                throw error;
            }
            
            console.log('Oyun başarıyla başlatıldı!');
        } catch (hata) {
            console.error('Oyun başlatılırken hata oluştu:', hata);
            alert('Oyun başlatılırken bir hata oluştu: ' + hata.message);
            // Hata durumunda ana menüye dön
            ekranGoster(ekranlar.menu);
        }
    }

    /**
     * Oyunu sonlandırır ve ana menüye döner
     */
    function oyunuSonlandir() {
        // Oyun nesnesini temizle
        if (oyunAlani) {
            oyunAlani = null;
        }
        
        // Arayüz kontrolünü temizle
        if (arayuzKontrol) {
            arayuzKontrol = null;
        }
        
        // Ana menüyü göster
        ekranGoster(ekranlar.menu);
    }

    /**
     * İstatistikleri günceller
     */
    function istatistikleriGuncelle() {
        // LocalStorage'dan istatistikleri al
        const istatistikler = JSON.parse(localStorage.getItem('periyodikOkeyIstatistikleri')) || {
            oyunSayisi: 0,
            kazanmaSayisi: 0,
            kaybetmeSayisi: 0,
            enYuksekSkor: 0,
            toplamPuan: 0
        };
        
        // İstatistik değerlerini ekrana yaz
        document.getElementById('oyun-sayisi').textContent = istatistikler.oyunSayisi;
        document.getElementById('kazanma-sayisi').textContent = istatistikler.kazanmaSayisi;
        document.getElementById('kaybetme-sayisi').textContent = istatistikler.kaybetmeSayisi;
        
        // Kazanma oranını hesapla ve göster
        const kazanmaOrani = istatistikler.oyunSayisi > 0 
            ? Math.round((istatistikler.kazanmaSayisi / istatistikler.oyunSayisi) * 100) 
            : 0;
        document.getElementById('kazanma-orani').textContent = `${kazanmaOrani}%`;
        
        // Diğer istatistikleri göster
        document.getElementById('en-yuksek-skor').textContent = istatistikler.enYuksekSkor;
        document.getElementById('toplam-puan').textContent = istatistikler.toplamPuan;
    }

    /**
     * İstatistikleri sıfırlar
     */
    function istatistikleriSifirla() {
        // Boş istatistikleri localStorage'a kaydet
        const istatistikler = {
            oyunSayisi: 0,
            kazanmaSayisi: 0,
            kaybetmeSayisi: 0,
            enYuksekSkor: 0,
            toplamPuan: 0
        };
        
        localStorage.setItem('periyodikOkeyIstatistikleri', JSON.stringify(istatistikler));
        
        // İstatistikleri güncellle
        istatistikleriGuncelle();
        
        alert('İstatistikler sıfırlandı!');
    }

    // Olay dinleyicileri
    
    // Ana menü butonları
    butonlar.oyunuBaslat.addEventListener('click', () => oyunuBaslat());
    butonlar.nasilOynanir.addEventListener('click', () => ekranGoster(ekranlar.nasilOynanir));
    butonlar.istatistikler.addEventListener('click', () => {
        istatistikleriGuncelle();
        ekranGoster(ekranlar.istatistikler);
    });
    butonlar.ayarlar.addEventListener('click', () => ekranGoster(ekranlar.ayarlar));
    butonlar.cikis.addEventListener('click', () => {
        if (confirm('Oyundan çıkmak istediğinize emin misiniz?')) {
            window.close();
        }
    });
    
    // Oyun ekranı butonları
    butonlar.anaSayfa.addEventListener('click', () => {
        if (confirm('Ana menüye dönmek istediğinize emin misiniz? Mevcut oyun kaydedilmeyecek.')) {
            oyunuSonlandir();
        }
    });
    butonlar.oyunYardim.addEventListener('click', () => {
        alert('Oyundaki amaç tüm kartlarınızı grup veya periyot kombinasyonlarına göre sıralamak ve en son 1 kart kalmalıdır. Grup kombinasyonu aynı periyottaki en az 3 ardışık grup demektir. Periyot kombinasyonu aynı gruptaki en az 4 ardışık periyot demektir.');
    });
    
    // Ayarlar ekranı butonları
    butonlar.ayarlarKaydet.addEventListener('click', () => {
        // Ayarları localStorage'a kaydet
        const ayarlar = {
            botSayisi: document.getElementById('bot-sayisi').value,
            zorlukSeviyesi: document.getElementById('zorluk-seviyesi').value,
            sesEfektleri: document.getElementById('ses-efektleri').checked,
            muzik: document.getElementById('muzik').checked
        };
        
        localStorage.setItem('periyodikOkeyAyarlar', JSON.stringify(ayarlar));
        
        alert('Ayarlar kaydedildi!');
        ekranGoster(ekranlar.menu);
    });
    butonlar.ayarlarGeri.addEventListener('click', () => ekranGoster(ekranlar.menu));
    
    // Nasıl oynanır ekranı butonları
    butonlar.nasilOynanirGeri.addEventListener('click', () => ekranGoster(ekranlar.menu));
    
    // İstatistikler ekranı butonları
    butonlar.istatistikSifirla.addEventListener('click', istatistikleriSifirla);
    butonlar.istatistiklerGeri.addEventListener('click', () => ekranGoster(ekranlar.menu));
    
    // Oyun sonu ekranı butonları
    butonlar.yeniOyun.addEventListener('click', oyunuBaslat);
    butonlar.anaMenu.addEventListener('click', () => ekranGoster(ekranlar.menu));
    
    // Sayfa yüklendiğinde ana menüyü göster
    ekranGoster(ekranlar.menu);
    
    // Kaydedilmiş ayarları yükle
    const kaydedilmisAyarlar = JSON.parse(localStorage.getItem('periyodikOkeyAyarlar'));
    if (kaydedilmisAyarlar) {
        document.getElementById('bot-sayisi').value = kaydedilmisAyarlar.botSayisi || '3';
        document.getElementById('zorluk-seviyesi').value = kaydedilmisAyarlar.zorlukSeviyesi || 'orta';
        document.getElementById('ses-efektleri').checked = kaydedilmisAyarlar.sesEfektleri !== false;
        document.getElementById('muzik').checked = kaydedilmisAyarlar.muzik !== false;
    }
    
    console.log('Periyodik Okey oyunu başarıyla yüklendi.');
});
