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
    
    // Varsayılan Ayarlar
    const varsayilanAyarlar = {
        botSayisi: 3,
        zorlukSeviyesi: 'orta',
        sesEfektleri: false,
        muzik: false
    };
    
    // Kayıtlı ayarları yükle
    function ayarlariYukle() {
        try {
            const kayitliAyarlar = localStorage.getItem('periyodikOkey_ayarlar');
            const ayarlar = kayitliAyarlar ? JSON.parse(kayitliAyarlar) : varsayilanAyarlar;
            
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
            
            return ayarlar;
        } catch (error) {
            console.error("Ayarlar yüklenirken hata oluştu:", error);
            // Hata durumunda varsayılan ayarları kullan
            return varsayilanAyarlar;
        }
    }
    
    // Ayarları yükle
    const gecerliAyarlar = ayarlariYukle();
    
    function istatistikleriYukle() {
        try {
            const varsayilanIstatistikler = {
                oyunSayisi: 0,
                kazanmaSayisi: 0,
                kaybetmeSayisi: 0,
                toplamPuan: 0,
                enYuksekSkor: 0
            };
            
            const kayitliIstatistikler = localStorage.getItem('periyodikOkey_istatistikler');
            const istatistikler = kayitliIstatistikler ? JSON.parse(kayitliIstatistikler) : varsayilanIstatistikler;
            
            // İstatistikleri göster
            document.getElementById('oyun-sayisi').textContent = istatistikler.oyunSayisi || 0;
            document.getElementById('kazanma-sayisi').textContent = istatistikler.kazanmaSayisi || 0;
            document.getElementById('kaybetme-sayisi').textContent = istatistikler.kaybetmeSayisi || 0;
            document.getElementById('toplam-puan').textContent = istatistikler.toplamPuan || 0;
            
            // Kazanma oranını hesapla
            const toplamOyun = istatistikler.oyunSayisi || 0;
            const kazanma = istatistikler.kazanmaSayisi || 0;
            
            let kazanmaOrani = 0;
            if (toplamOyun > 0) {
                kazanmaOrani = Math.round((kazanma / toplamOyun) * 100);
            }
            
            document.getElementById('kazanma-orani').textContent = kazanmaOrani + '%';
            
            // En yüksek skoru göster
            document.getElementById('en-yuksek-skor').textContent = istatistikler.enYuksekSkor || 0;
            
            return istatistikler;
        } catch (error) {
            console.error("İstatistikler yüklenirken hata oluştu:", error);
            // Hata durumunda istatistikleri sıfırla
            return {
                oyunSayisi: 0,
                kazanmaSayisi: 0,
                kaybetmeSayisi: 0,
                toplamPuan: 0,
                enYuksekSkor: 0
            };
        }
    }
    
    // İstatistikleri yükle
    const gecerliIstatistikler = istatistikleriYukle();
    
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
            
            // Menü ekranına dön
            document.getElementById('ayarlar-screen').classList.add('gizli');
            document.getElementById('menu-screen').classList.remove('gizli');
        } catch (error) {
            console.error("Ayarlar kaydedilirken hata oluştu:", error);
        }
    });
    
    // İstatistikleri sıfırla
    document.getElementById('btn-istatistik-sifirla').addEventListener('click', () => {
        const varsayilanIstatistikler = {
            oyunSayisi: 0,
            kazanmaSayisi: 0,
            kaybetmeSayisi: 0,
            toplamPuan: 0,
            enYuksekSkor: 0
        };
        
        localStorage.setItem('periyodikOkey_istatistikler', JSON.stringify(varsayilanIstatistikler));
        
        // İstatistikleri güncelle
        document.getElementById('oyun-sayisi').textContent = '0';
        document.getElementById('kazanma-sayisi').textContent = '0';
        document.getElementById('kaybetme-sayisi').textContent = '0';
        document.getElementById('toplam-puan').textContent = '0';
        document.getElementById('kazanma-orani').textContent = '0%';
        document.getElementById('en-yuksek-skor').textContent = '0';
        
        console.log("İstatistikler sıfırlandı");
    });
    
    // Çıkış butonu olayı (web tarayıcısında çalışmayabilir)
    document.getElementById('btn-cikis').addEventListener('click', () => {
        if (confirm("Oyundan çıkmak istediğinize emin misiniz?")) {
            window.close();
        }
    });
    
    // Element kartı oluşturma fonksiyonu (DOM tabanlı)
    function elementKartiOlustur(element, takim = 1, joker = false) {
        const kart = document.createElement('div');
        kart.className = 'element-kart';
        kart.setAttribute('draggable', 'true');
        if (joker) kart.classList.add('joker');
        
        // Atom Numarası
        const atomNo = document.createElement('div');
        atomNo.className = 'atom-no';
        atomNo.textContent = joker ? 'J' : element.atom_no;
        kart.appendChild(atomNo);
        
        // Sembol
        const sembol = document.createElement('div');
        sembol.className = 'sembol';
        sembol.textContent = joker ? 'J' : element.sembol;
        kart.appendChild(sembol);
        
        // İsim
        const isim = document.createElement('div');
        isim.className = 'isim';
        isim.textContent = joker ? 'JOKER' : element.isim;
        kart.appendChild(isim);
        
        // Grup-Periyot
        if (!joker) {
            const grupPeriyot = document.createElement('div');
            grupPeriyot.className = 'grup-periyot';
            grupPeriyot.textContent = `G:${element.grup} P:${element.periyot}`;
            kart.appendChild(grupPeriyot);
        }
        
        // Takım
        const takimEtiket = document.createElement('div');
        takimEtiket.className = 'takim';
        takimEtiket.textContent = `T${takim}`;
        kart.appendChild(takimEtiket);
        
        // Veri özellikleri
        kart.dataset.atomNo = joker ? 0 : element.atom_no;
        kart.dataset.sembol = joker ? 'JOKER' : element.sembol;
        kart.dataset.grup = joker ? 0 : element.grup;
        kart.dataset.periyot = joker ? 0 : element.periyot;
        kart.dataset.takim = takim;
        kart.dataset.joker = joker;
        
        // Sürükleme olayları
        kart.addEventListener('dragstart', handleDragStart);
        kart.addEventListener('dragend', handleDragEnd);
        kart.addEventListener('click', function() {
            // Tüm kartlardan 'secili' sınıfını kaldır
            document.querySelectorAll('.element-kart').forEach(k => {
                k.classList.remove('secili');
            });
            
            // Bu karta 'secili' sınıfını ekle
            this.classList.add('secili');
        });
        
        return kart;
    }
    
    // Sürükleme ile ilgili değişkenler
    let suruklenenKart = null;
    
    // Sürükleme olayları
    function handleDragStart(e) {
        this.style.opacity = '0.4';
        suruklenenKart = this;
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }
    
    function handleDragEnd(e) {
        this.style.opacity = '1';
        
        document.querySelectorAll('.surukle-hedef').forEach(item => {
            item.classList.remove('surukle-uzerinde');
        });
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        return false;
    }
    
    function handleDragEnter(e) {
        this.classList.add('surukle-uzerinde');
    }
    
    function handleDragLeave(e) {
        this.classList.remove('surukle-uzerinde');
    }
    
    function handleDrop(e) {
        e.stopPropagation();
        
        if (suruklenenKart !== this && this.classList.contains('surukle-hedef')) {
            this.appendChild(suruklenenKart);
        }
        
        return false;
    }
    
    // Kombinasyon alanını sürükleme hedefi yap
    function surukleHedefleriniAyarla() {
        const kombinasyonAlani = document.getElementById('kombinasyon-alani');
        if (kombinasyonAlani) {
            kombinasyonAlani.classList.add('surukle-hedef');
            kombinasyonAlani.addEventListener('dragover', handleDragOver);
            kombinasyonAlani.addEventListener('dragenter', handleDragEnter);
            kombinasyonAlani.addEventListener('dragleave', handleDragLeave);
            kombinasyonAlani.addEventListener('drop', handleDrop);
        }
        
        const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
        if (oyuncuKartlari) {
            oyuncuKartlari.classList.add('surukle-hedef');
            oyuncuKartlari.addEventListener('dragover', handleDragOver);
            oyuncuKartlari.addEventListener('dragenter', handleDragEnter);
            oyuncuKartlari.addEventListener('dragleave', handleDragLeave);
            oyuncuKartlari.addEventListener('drop', handleDrop);
        }
    }
    
    // Örnek kart oluşturma (test için)
    function testKartlariOlustur() {
        // Örnek element verileri
        const elementler = ELEMENT_VERILERI.slice(0, 10);
        
        // Deste
        const desteAlani = document.querySelector('.deste-alani');
        const arkaYuzKart = document.createElement('div');
        arkaYuzKart.className = 'element-kart arka-yuz';
        desteAlani.appendChild(arkaYuzKart);
        
        // Açık kart
        const acikKartAlani = document.querySelector('.acik-kart-alani');
        const acikKart = elementKartiOlustur(elementler[0], 1);
        acikKartAlani.appendChild(acikKart);
        
        // Oyuncu kartları - Container oluştur
        const oyuncuAlani = document.querySelector('.oyuncu-alani');
        const oyuncuKartlariDiv = document.createElement('div');
        oyuncuKartlariDiv.className = 'oyuncu-kartlari';
        oyuncuKartlariDiv.id = 'oyuncu-kartlari';
        
        elementler.forEach((element, index) => {
            const kart = elementKartiOlustur(element, 1, index === 5); // 5. kart joker
            oyuncuKartlariDiv.appendChild(kart);
        });
        
        oyuncuAlani.appendChild(oyuncuKartlariDiv);
        
        // Kombinasyon alanı - Container oluştur
        const kombinasyonDiv = document.createElement('div');
        kombinasyonDiv.id = 'kombinasyon-alani';
        kombinasyonDiv.className = 'kombinasyon-alani';
        
        const kombinasyonBaslik = document.createElement('div');
        kombinasyonBaslik.className = 'kombinasyon-baslik';
        kombinasyonBaslik.textContent = 'Kombinasyon Alanı';
        
        const kombinasyonIcerik = document.createElement('div');
        kombinasyonIcerik.className = 'kombinasyon-icerik';
        
        kombinasyonDiv.appendChild(kombinasyonBaslik);
        kombinasyonDiv.appendChild(kombinasyonIcerik);
        
        // Kombinasyon alanını ekle
        const oyunAlani = document.querySelector('.oyun-alani');
        oyunAlani.insertBefore(kombinasyonDiv, oyuncuAlani);
        
        // Bot kartlarını göster (kapalı olarak)
        document.querySelectorAll('.bot-kartlar').forEach(botAlani => {
            for (let i = 0; i < 7; i++) {
                const kapalıKart = document.createElement('div');
                kapalıKart.className = 'element-kart arka-yuz';
                kapalıKart.style.width = '20px'; // Daha küçük göster
                kapalıKart.style.height = '30px';
                kapalıKart.style.margin = '2px';
                kapalıKart.style.display = 'inline-block';
                botAlani.appendChild(kapalıKart);
            }
        });
        
        // Sürükleme hedeflerini ayarla
        surukleHedefleriniAyarla();
    }
    
    // Oyuna başla butonu
    document.getElementById('btn-oyuna-basla').addEventListener('click', () => {
        console.log("Oyun başlatılıyor...");
        // Oyun ekranını göster
        document.getElementById('menu-screen').classList.add('gizli');
        document.getElementById('oyun-screen').classList.remove('gizli');
        
        // Test kartlarını oluştur
        testKartlariOlustur();
    });
    
    // Ayarlar değiştiğinde ses durumunu güncelle
    document.getElementById('ses-efektleri').addEventListener('change', (e) => {
        const ayarlar = JSON.parse(localStorage.getItem('periyodikOkey_ayarlar') || '{}');
        ayarlar.sesEfektleri = e.target.checked;
        localStorage.setItem('periyodikOkey_ayarlar', JSON.stringify(ayarlar));
    });
    
    // Müzik ayarı değiştiğinde müzik durumunu güncelle
    document.getElementById('muzik').addEventListener('change', (e) => {
        const ayarlar = JSON.parse(localStorage.getItem('periyodikOkey_ayarlar') || '{}');
        ayarlar.muzik = e.target.checked;
        localStorage.setItem('periyodikOkey_ayarlar', JSON.stringify(ayarlar));
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
    
    // Oyun içindeki butonlar
    document.getElementById('btn-oyun-menu').addEventListener('click', () => {
        // Oyun ekranını gizle ve ana menüyü göster
        document.getElementById('oyun-screen').classList.add('gizli');
        document.getElementById('menu-screen').classList.remove('gizli');
    });
    
    document.getElementById('btn-oyun-yardim').addEventListener('click', () => {
        // Oyun ekranını gizle ve nasıl oynanır ekranını göster
        document.getElementById('oyun-screen').classList.add('gizli');
        document.getElementById('nasil-oynanir-screen').classList.remove('gizli');
    });
    
    document.getElementById('btn-kontrol-et').addEventListener('click', () => {
        console.log("Kontrol ediliyor...");
        // TODO: Kombinasyon kontrolü eklenecek
    });
    
    document.getElementById('btn-kart-ver').addEventListener('click', () => {
        console.log("Kart veriliyor...");
        // Seçili kart var mı kontrol et
        const seciliKart = document.querySelector('.element-kart.secili');
        if (seciliKart) {
            // Seçili kartı açık kart alanına taşı
            const acikKartAlani = document.querySelector('.acik-kart-alani');
            acikKartAlani.innerHTML = ''; // Önceki kartı temizle
            acikKartAlani.appendChild(seciliKart);
            seciliKart.classList.remove('secili');
        } else {
            alert("Lütfen önce bir kart seçin!");
        }
    });
    
    document.getElementById('btn-desteyi-ac').addEventListener('click', () => {
        console.log("Desteden kart çekiliyor...");
        // Oyuncu kartlarına yeni bir kart ekle (test için)
        const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
        if (oyuncuKartlari) {
            // Rastgele bir element al
            const randomIndex = Math.floor(Math.random() * ELEMENT_VERILERI.length);
            const yeniKart = elementKartiOlustur(ELEMENT_VERILERI[randomIndex], 1);
            oyuncuKartlari.appendChild(yeniKart);
        }
    });
    
    console.log("Periyodik Okey oyunu hazır!");
}); 