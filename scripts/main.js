/**
 * Periyodik Okey - Ana JavaScript Dosyası
 * Oyun başlangıcı ve genel kontroller
 */

// Sayfa tam olarak yüklendiğinde başla
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM yüklendi, oyun başlatılıyor...");
    
    // Oyun ekranlarını ve butonlarını ayarla
    ekranlariAyarla();
    
    // Oyun versiyonu
    const VERSION = "0.2.0";
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
    
    // Oyun sonu ekranındaki butonlara olay dinleyicileri ekle
    const btnYeniOyun = document.getElementById('btn-yeni-oyun');
    if (btnYeniOyun) {
        btnYeniOyun.addEventListener('click', () => {
            // Oyun sonu ekranını gizle, oyun ekranını göster
            document.getElementById('oyun-sonu-screen').classList.add('gizli');
            document.getElementById('oyun-screen').classList.remove('gizli');
            
            // Yeni oyun başlat (puanları sıfırla ve kartları oluştur)
            // Puanları sıfırla
            document.getElementById('oyuncu-puan').textContent = '0';
            document.getElementById('bot1-puan').textContent = '0';
            document.getElementById('bot2-puan').textContent = '0';
            document.getElementById('bot3-puan').textContent = '0';
            
            // Sabit puanı temizle/kaldır (gereksiz gösterge)
            const sabitPuan = document.getElementById('sabit-oyuncu-puan');
            if (sabitPuan) {
                sabitPuan.remove(); // Tamamen kaldır
            }
            
            // Yıldızları da sıfırla
            oyuncuYildizSayisi = 0;
            bot1YildizSayisi = 0;
            bot2YildizSayisi = 0;
            bot3YildizSayisi = 0;
            
            // Yıldız göstergelerini güncelle
            yildizlariGuncelle();
            
            // Kartları oluştur
            testKartlariOlustur();
            
            console.log("Yeni oyun başlatıldı, puanlar sıfırlandı.");
        });
    }
    
    const btnAnaMenu = document.getElementById('btn-ana-menu');
    if (btnAnaMenu) {
        btnAnaMenu.addEventListener('click', () => {
            // Oyun sonu ekranını gizle, ana menüyü göster
            document.getElementById('oyun-sonu-screen').classList.add('gizli');
            document.getElementById('menu-screen').classList.remove('gizli');
            
            // Puanları sıfırla (sonraki oyun için)
            document.getElementById('oyuncu-puan').textContent = '0';
            document.getElementById('bot1-puan').textContent = '0';
            document.getElementById('bot2-puan').textContent = '0';
            document.getElementById('bot3-puan').textContent = '0';
            
            // Sabit puanı temizle/kaldır (gereksiz gösterge)
            const sabitPuan = document.getElementById('sabit-oyuncu-puan');
            if (sabitPuan) {
                sabitPuan.remove(); // Tamamen kaldır
            }
            
            // Yıldızları da sıfırla
            oyuncuYildizSayisi = 0;
            bot1YildizSayisi = 0;
            bot2YildizSayisi = 0;
            bot3YildizSayisi = 0;
            
            // Yıldız göstergelerini güncelle
            yildizlariGuncelle();
            
            console.log("Ana menüye dönüldü, puanlar sıfırlandı.");
        });
    }
    
    // Oyun başlamadan önce ayarları uygula
    function oyunAyarlariniUygula() {
        // Kayıtlı ayarları yükle
        const ayarlar = JSON.parse(localStorage.getItem('periyodikOkey_ayarlar') || '{}');
        
        // Bot sayısını ayarla (varsayılan: 3)
        const botSayisi = parseInt(ayarlar.botSayisi) || 3;
        
        // Zorluk seviyesini ayarla (varsayılan: orta)
        const zorlukSeviyesi = ayarlar.zorlukSeviyesi || 'orta';
        
        console.log(`Oyun ayarları: ${botSayisi} bot, ${zorlukSeviyesi} zorluk`);
        
        // Bot sayısına göre görünürlüğü ayarla
        for (let i = 1; i <= 3; i++) {
            const botAlani = document.querySelector(`#bot${i}-alani`);
            if (botAlani) {
                if (i <= botSayisi) {
                    botAlani.style.display = 'block';
                } else {
                    botAlani.style.display = 'none';
                }
            }
        }
        
        // Zorluk seviyesini global değişkene ata
        window.ZORLUK_SEVIYESI = zorlukSeviyesi;
        
        return {
            botSayisi: botSayisi,
            zorlukSeviyesi: zorlukSeviyesi
        };
    }
    
    // Zorluk seviyesine göre kombinasyon yapma olasılığını hesapla
    function zorlugaGoreKombinasyonSansi() {
        const zorluk = window.ZORLUK_SEVIYESI || 'orta';
        
        switch (zorluk) {
            case 'kolay':
                return 0.25; // %25 şans
            case 'orta':
                return 0.40; // %40 şans
            case 'zor':
                return 0.60; // %60 şans
            default:
                return 0.40; // Varsayılan
        }
    }
    
    // Botların kart sayısını dengele (oyuncu ile aynı sayıda kart olacak şekilde)
    function botKartSayisiniDengele() {
        // Bot alanları
        for (let i = 1; i <= 3; i++) {
            const botKartlari = document.querySelector(`#bot${i}-alani .bot-kartlar`);
            
            // Bot kart alanı boşsa, bot kartlarını gösterme
            if (!botKartlari) continue;
            
            // Her botun görünen kart sayısını kontrol et
            // Maksimum 7, minimum 1 kart göster (oyun devam ederken kartları sıfırdan gösterme)
            if (botKartlari.children.length > 7) {
                // Fazla kartları kaldır
                while (botKartlari.children.length > 7) {
                    botKartlari.removeChild(botKartlari.lastChild);
                }
            }
        }
        
        // Kalan kart sayısını güncelle
        kalanKartSayisiniGuncelle();
    }
    
    // Kart çekme durumu
    let kartCekildi = false;
    
    // Tur başlangıcında kart çekme durumunu sıfırla
    function turBaslat() {
        kartCekildi = false;
        document.getElementById('durum-mesaji').textContent = 'Sıra sizde! Kart çekiniz veya açık kartı alınız.';
    }
    
    // Sürükleme hedeflerini ayarla
    function surukleHedefleriniAyarla() {
        const kombinasyonIcerik = document.getElementById('kombinasyon-icerik');
        if (kombinasyonIcerik) {
            kombinasyonIcerik.classList.add('surukle-hedef');
            kombinasyonIcerik.addEventListener('dragover', handleDragOver);
            kombinasyonIcerik.addEventListener('dragenter', handleDragEnter);
            kombinasyonIcerik.addEventListener('dragleave', handleDragLeave);
            kombinasyonIcerik.addEventListener('drop', handleDrop);
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
    
    /**
     * Botların söyleyebileceği rastgele sözler
     */
    const BOT_SOZLERI = {
        umutlu: [
            "Bu el kesinlikle kazanacağım!",
            "Kartlarım çok iyi görünüyor!",
            "Şans bugün benden yana!",
            "Bu oyunu almak üzereyim!"
        ],
        umutsuz: [
            "Bu kartlarla kazanmam imkansız...",
            "Şansım bugün yaver gitmiyor.",
            "Kötü bir elimim var.",
            "Kaybetmek üzereyim gibi..."
        ],
        korkutucu: [
            "Bu eli alacağım, hazırlan!",
            "Sıradaki turda seni yeneceğim!",
            "Kazanmana izin vermeyeceğim!",
            "Oyunu bitirmeye çok yakınım!"
        ],
        kazanma: [
            "Sizi yendim!",
            "Kazanacağımı biliyordum!",
            "Bu oyunun galibi benim!",
            "Üzgünüm ama kaybettiniz!"
        ]
    };

    /**
     * Bota rastgele bir söz söyletir
     * @param {number} botNo - Bot numarası
     * @param {string} ruhHali - Botun ruh hali (umutlu, umutsuz, korkutucu, kazanma)
     */
    function botKonustur(botNo, ruhHali) {
        const botAlani = document.querySelector(`#bot${botNo}-alani`);
        if (!botAlani) return;
        
        // Varsa önceki konuşma balonunu kaldır
        const mevcutBalon = botAlani.querySelector('.konusma-balonu');
        if (mevcutBalon) {
            mevcutBalon.remove();
        }
        
        // Ruh haline göre konuşma metni seç
        let konusmalar = {
            umutlu: [
                "Bu eli kazanacağım!",
                "Harika kartlarım var!",
                "Şansım dönüyor!",
                "İyi gidiyorum!"
            ],
            umutsuz: [
                "Bu eller hiç iyi değil...",
                "Şans bugün benden yana değil",
                "Zor durumdayım",
                "İyi kart çekemiyorum"
            ],
            korkutucu: [
                "Oyun bitmek üzere!",
                "Kaybetmek üzeresin!",
                "Bu oyun benim!",
                "Son şansın kalmadı!"
            ]
        };
        
        // Rastgele bir konuşma seç
        const konusmalar_secilen = konusmalar[ruhHali];
        const konusma = konusmalar_secilen[Math.floor(Math.random() * konusmalar_secilen.length)];
        
        // Konuşma balonu oluştur
        const konusmaBalonu = document.createElement('div');
        konusmaBalonu.className = 'konusma-balonu';
        konusmaBalonu.textContent = konusma;
        
        // Balonu bot alanına ekle
        botAlani.appendChild(konusmaBalonu);
        
        // 3 saniye sonra balonu kaldır
        setTimeout(() => {
            konusmaBalonu.classList.add('kaybol');
            setTimeout(() => {
                if (konusmaBalonu.parentNode) {
                    konusmaBalonu.parentNode.removeChild(konusmaBalonu);
                }
            }, 500);
        }, 2500);
    }

    // Botların kartları için stil güncellemesi
    function botKartlariniOlustur(botSayisi = 3) {
        // Tüm bot alanlarını gizle
        document.querySelectorAll('.bot-alani').forEach((botAlani, index) => {
            const botNo = index + 1;
            
            // Bot sayısına göre görünürlüğü ayarla
            if (botNo <= botSayisi) {
                botAlani.style.display = 'block';
            } else {
                botAlani.style.display = 'none';
            }
            
            // Gösterilen botların kartlarını oluştur
            if (botNo <= botSayisi) {
                const botKartlarAlani = botAlani.querySelector('.bot-kartlar');
                if (botKartlarAlani) {
                    botKartlarAlani.innerHTML = ''; // İçeriği temizle
                    for (let i = 0; i < 7; i++) {
                        const kapaliKart = document.createElement('div');
                        kapaliKart.className = 'element-kart arka-yuz bot-kart';
                        botKartlarAlani.appendChild(kapaliKart);
                    }
                }
            }
        });
    }

    /**
     * Örnek kart oluşturma (test için)
     */
    function testKartlariOlustur() {
        console.log("Yeni oyun başlatılıyor, kartlar oluşturuluyor...");
        
        // Puanları sıfırla
        document.getElementById('oyuncu-puan').textContent = '0';
        document.getElementById('bot1-puan').textContent = '0';
        document.getElementById('bot2-puan').textContent = '0';
        document.getElementById('bot3-puan').textContent = '0';
        
        // Sabit puanı temizle/kaldır (gereksiz gösterge)
        const sabitPuan = document.getElementById('sabit-oyuncu-puan');
        if (sabitPuan) {
            sabitPuan.remove(); // Tamamen kaldır
        }
        
        // Yıldızları güncelle
        yildizlariGuncelle();
        
        // Oyun ayarlarını uygula
        const ayarlar = oyunAyarlariniUygula();

        // CSV'den elementleri yükle ve kartları oluştur
        elementVerileriniYukle().then(yuklenenElementler => {
            console.log("Elementler yüklendi, kartlar oluşturuluyor...");
            
            // Kullanılmış kartları dikkate alarak kullanılabilir elementleri belirle
            const kullanilabilirElementler = yuklenenElementler.filter(element => 
                !oynanmisKartlar.some(kullanilmisKart => 
                    kullanilmisKart.atom_no === element.atom_no && 
                    kullanilmisKart.grup === element.grup && 
                    kullanilmisKart.periyot === element.periyot
                )
            );
            
            // Yeterli kart kalmadıysa, kullanılmış kartları temizle ve tüm elementleri kullan
            if (kullanilabilirElementler.length < 20) {
                oynanmisKartlar = []; // Kullanılmış kartları temizle
                bildirimGoster("Yeni tur için tüm kartlar yeniden kullanılabilir hale getirildi!", "info");
            }
            
            // Yüklenen elementleri kullan
            const elementler = kullanilabilirElementler.length > 0 ? 
                               kullanilabilirElementler.slice(0, kullanilabilirElementler.length) : 
                               yuklenenElementler.slice(0, yuklenenElementler.length);
            
            // Deste alanı
            const desteAlani = document.querySelector('.deste-alani');
            desteAlani.innerHTML = ''; // İçeriği temizle
            const arkaYuzKart = document.createElement('div');
            arkaYuzKart.className = 'element-kart arka-yuz';
            desteAlani.appendChild(arkaYuzKart);
            
            // Açık kart alanı
            const acikKartAlani = document.querySelector('.acik-kart-alani');
            acikKartAlani.innerHTML = ''; // İçeriği temizle
            
            // Rastgele bir element seç
            const rastgeleIndeks = Math.floor(Math.random() * elementler.length);
            const acikKart = elementKartiOlusturDOM(elementler[rastgeleIndeks], 1);
            acikKartAlani.appendChild(acikKart);
            
            // Oyuncu kartları - Container oluştur
            const oyuncuAlani = document.querySelector('.oyuncu-alani');
            const oyuncuKartlariDiv = document.createElement('div');
            oyuncuKartlariDiv.className = 'oyuncu-kartlari';
            oyuncuKartlariDiv.id = 'oyuncu-kartlari';
            oyuncuAlani.innerHTML = ''; // İçeriği temizle
            
            // Oyuncu bilgi kısmını oluştur
            const oyuncuBilgi = document.createElement('div');
            oyuncuBilgi.className = 'oyuncu-bilgi';
            
            // Oyuncu ismi ekle
            const oyuncuIsim = document.createElement('div');
            oyuncuIsim.className = 'oyuncu-isim';
            oyuncuIsim.textContent = 'Oyuncu';
            oyuncuBilgi.appendChild(oyuncuIsim);
            
            // Oyuncu puanı ekle
            const oyuncuPuan = document.createElement('div');
            oyuncuPuan.id = 'oyuncu-puan';
            oyuncuPuan.className = 'oyuncu-puan';
            oyuncuPuan.textContent = '0';
            oyuncuBilgi.appendChild(oyuncuPuan);
            
            // Oyuncu bilgi kısmını alana ekle
            oyuncuAlani.appendChild(oyuncuBilgi);
            
            // Rastgele 7 element seç ve kart oluştur
            const rastgeleElementIndeksler = [];
            while (rastgeleElementIndeksler.length < 7) {
                const indeks = Math.floor(Math.random() * elementler.length);
                if (!rastgeleElementIndeksler.includes(indeks)) {
                    rastgeleElementIndeksler.push(indeks);
                }
            }
            
            // Joker olasılığını belirle - her kart için %15 olasılık
            const jokerOlasiligi = 0.15;
            
            // Seçilen elementlerden kartları oluştur
            rastgeleElementIndeksler.forEach((indeks, i) => {
                // Her kart için rastgele joker kararı ver
                const jokerMi = Math.random() < jokerOlasiligi;
                const kart = elementKartiOlusturDOM(elementler[indeks], 1, jokerMi);
                oyuncuKartlariDiv.appendChild(kart);
            });
            
            // Oyuncu kartlarını oyuncu alanına ekle
            oyuncuAlani.appendChild(oyuncuKartlariDiv);
            
            // Kombinasyon alanı oluştur ve sürükleme hedefi olarak işaretle
            const kombinasyonIcerik = document.getElementById('kombinasyon-icerik');
            if (kombinasyonIcerik) {
                kombinasyonIcerik.innerHTML = ''; // İçeriği temizle
                kombinasyonIcerik.classList.add('surukle-hedef');
            }
            
            // Bot kartlarını düzgün şekilde göster ve bot sayısını ayarla
            botKartlariniOlustur(ayarlar.botSayisi);
            
            // Sürükleme hedeflerini ayarla
            surukleHedefleriniAyarla();
            
            // Oyuncu puanını oluştur ve göster
            const oyuncuPuanElementi = document.getElementById('oyuncu-puan');
            if (!oyuncuPuanElementi) {
                // Oyuncu alanında puanı gösterecek bir element oluştur
                const oyuncuBilgi = document.querySelector('.oyuncu-bilgi');
                if (oyuncuBilgi) {
                    const oyuncuPuan = document.createElement('div');
                    oyuncuPuan.id = 'oyuncu-puan';
                    oyuncuPuan.className = 'oyuncu-puan';
                    oyuncuPuan.textContent = '0';
                    oyuncuBilgi.appendChild(oyuncuPuan);
                }
            }
            
            // Oyuncu puanını sabitle
            oyuncuPuaniniSabitle();
            
            // İlk tur başlat
            turBaslat();
            
            // Kalan kart sayısını güncelle
            document.getElementById('kalan-kart').textContent = elementler.length - 8; // 7 oyuncu + 1 açık kart
        }).catch(error => {
            console.error("Element verileri yüklenirken hata oluştu:", error);
            alert("Elementler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
        });
    }
    
    // Oyuna başla butonu
    document.getElementById('btn-oyuna-basla').addEventListener('click', () => {
        console.log("Oyun başlatılıyor...");
        
        // Ayarlar ekranını göster
        document.getElementById('menu-screen').classList.add('gizli');
        document.getElementById('ayarlar-screen').classList.remove('gizli');
        
        // Ayarlar Kaydet butonuna yeni bir işlev ekle - doğrudan oyunu başlat
        const kaydetVeBaslatBtn = document.getElementById('btn-ayarlar-kaydet');
        
        // Önceki olay dinleyicilerini kaldır
        const yeniBtn = kaydetVeBaslatBtn.cloneNode(true);
        kaydetVeBaslatBtn.parentNode.replaceChild(yeniBtn, kaydetVeBaslatBtn);
        
        // Yeni buton metni
        yeniBtn.textContent = 'Ayarları Kaydet ve Oyuna Başla';
        
        // Yeni olay dinleyicisi
        yeniBtn.addEventListener('click', () => {
            try {
                const ayarlar = {
                    botSayisi: parseInt(document.getElementById('bot-sayisi').value),
                    zorlukSeviyesi: document.getElementById('zorluk-seviyesi').value,
                    sesEfektleri: document.getElementById('ses-efektleri').checked,
                    muzik: document.getElementById('muzik').checked
                };
                
                localStorage.setItem('periyodikOkey_ayarlar', JSON.stringify(ayarlar));
                console.log("Oyun ayarları kaydedildi:", ayarlar);
                
                // Ayarlar ekranını gizle ve oyun ekranını göster
                document.getElementById('ayarlar-screen').classList.add('gizli');
        document.getElementById('oyun-screen').classList.remove('gizli');
        
        // Test kartlarını oluştur
        testKartlariOlustur();
            } catch (error) {
                console.error("Ayarlar kaydedilirken hata oluştu:", error);
            }
        });
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
    
    /**
     * Elementleri asenkron olarak yükler (CSV veya varsayılan veriler)
     * @returns {Promise<Array>} Element verileri promisi
     */
    async function elementVerileriniYukle() {
        try {
            // Önce ELEMENT_VERILERI_OKEY değişkenini kontrol et (element_verileri.js'den geliyor)
            if (typeof ELEMENT_VERILERI_OKEY !== 'undefined' && ELEMENT_VERILERI_OKEY.length > 0) {
                console.log("Element verileri hazır kullanılıyor...");
                return ELEMENT_VERILERI_OKEY;
            }
            
            // CSV dosyasını yüklemeyi dene
            const response = await fetch('elementler.csv');
            if (!response.ok) {
                throw new Error('CSV dosyası yüklenemedi');
            }
            
            const csvData = await response.text();
            return csvDosyasindanElementleriYukle(csvData);
        } catch (error) {
            console.error("Element verileri yüklenirken hata oluştu:", error);
            // Hata durumunda varsayılan element verilerini kullan
            return ELEMENT_VERILERI_OKEY;
        }
    }
    
    // Gerekli dosyaların yüklenip yüklenmediğini kontrol et
    function tanimlariKontrolEt() {
        // ElementKarti sınıfı yüklendi mi
        if (typeof ElementKartiSinifi === 'undefined') {
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
        if (typeof ELEMENT_VERILERI_OKEY === 'undefined') {
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
    
    // Kontrol Et butonuna tıklama olayını güncelle - kombinasyon kontrolünden sonra kartları temizle
    document.getElementById('btn-kontrol-et').addEventListener('click', () => {
        console.log("Kombinasyon kontrol ediliyor...");
        
        // Kombinasyon alanını bul
        const kombinasyonAlani = document.getElementById('kombinasyon-icerik');
        const kombinasyonKartlari = kombinasyonAlani.querySelectorAll('.element-kart');
        
        // Kontrol için yeterli kart var mı?
        if (kombinasyonKartlari.length < 3) {
            bildirimGoster("Kombinasyon için en az 3 kart gereklidir!", "error");
            return;
        }
        
        // Kartların özelliklerini al
        const kartBilgileri = Array.from(kombinasyonKartlari).map(kart => {
            return {
                grup: parseInt(kart.dataset.grup),
                periyot: parseInt(kart.dataset.periyot),
                element: kart.dataset.sembol,
                joker: kart.dataset.joker === "true"
            };
        });

        console.log("Kart bilgileri:", kartBilgileri);
        
        // Grup ve periyot kombinasyonlarını kontrol et
        const grupKombinasyonu = grupKombinasyonuKontrolEt(kartBilgileri);
        const periyotKombinasyonu = periyotKombinasyonuKontrolEt(kartBilgileri);
        
        if (grupKombinasyonu || periyotKombinasyonu) {
            // Puan hesapla
            let puanArtisi = 0;
            
            if (grupKombinasyonu) {
                // Her kart başına 5 puan
                puanArtisi += kombinasyonKartlari.length * 5;
                bildirimGoster(`Grup kombinasyonu! +${kombinasyonKartlari.length * 5} puan (${kombinasyonKartlari.length} kart x 5)`, "success");
            }
            
            if (periyotKombinasyonu) {
                // Her kart başına 4 puan
                puanArtisi += kombinasyonKartlari.length * 4;
                bildirimGoster(`Periyot kombinasyonu! +${kombinasyonKartlari.length * 4} puan (${kombinasyonKartlari.length} kart x 4)`, "success");
            }
            
            // Joker bonus kontrolü
            const jokerVarmi = kartBilgileri.some(kart => kart.joker);
            if (jokerVarmi) {
                puanArtisi *= 2; // Joker varsa puanı ikiye katla
                bildirimGoster("Joker bonusu! Puanlar 2 katına çıktı!", "success");
            }
            
            // Puanı güncelle - animasyonla
            const oyuncuPuanElementi = document.getElementById('oyuncu-puan');
            const mevcutPuan = parseInt(oyuncuPuanElementi.textContent);
            const yeniPuan = mevcutPuan + puanArtisi;
            
            puanGuncelle('oyuncu-puan', puanArtisi);
            
            // Kombinasyon kartlarını temizle
            kombinasyonAlani.innerHTML = '';
            
            // Kalan kartları ve durumu güncelle
            kalanKartSayisiniGuncelle();
            
            // Oyuncu 100 puana ulaştı mı kontrol et
            if (yeniPuan >= 100) {
                setTimeout(() => {
                    bildirimGoster("100 puana ulaştınız! Oyunu kazandınız!", "success");
                    setTimeout(() => oyunuKazan(), 1500);
                }, 1000);
                return;
            }
            
            // Oyuncu kartları bitmiş mi kontrol et
            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
            if (oyuncuKartlari.children.length === 0) {
                setTimeout(() => {
                    bildirimGoster("Tüm kartlarınızı bitirdiniz! Oyunu kazandınız!", "success");
                    setTimeout(() => oyunuKazan(), 1500);
                }, 1000);
            }
        } else {
            bildirimGoster("Geçersiz kombinasyon! Kartları düzenlemelisiniz.", "error");
        }
    });
    
    /**
     * Grup kombinasyonunu kontrol eder (aynı grupta en az 3 kart)
     * @param {Array} kartlar - Kart bilgileri dizisi 
     * @returns {boolean} - Geçerli bir grup kombinasyonu mu?
     */
    function grupKombinasyonuKontrolEt(kartlar) {
        // Jokerleri ayır
        const jokerler = kartlar.filter(kart => kart.joker);
        const normalKartlar = kartlar.filter(kart => !kart.joker);
        
        // Gruplandırma
        const gruplar = {};
        normalKartlar.forEach(kart => {
            if (!gruplar[kart.grup]) {
                gruplar[kart.grup] = [];
            }
            gruplar[kart.grup].push(kart);
        });
        
        // En az bir grupta 3 veya daha fazla kart var mı?
        // Ya da jokerlerle tamamlanabilir mi?
        let jokerSayisi = jokerler.length;
        
        for (const grup in gruplar) {
            const gerekliKartSayisi = 3;
            const eksikKartSayisi = gerekliKartSayisi - gruplar[grup].length;
            
            // Bu grup yeterli karta sahip mi?
            if (gruplar[grup].length >= gerekliKartSayisi) {
                return true;
            }
            
            // Jokerlerle tamamlanabilir mi?
            if (eksikKartSayisi > 0 && eksikKartSayisi <= jokerSayisi) {
                return true;
            }
        }
        
        // Tamamen jokerlerden oluşan bir grup olabilir mi?
        if (jokerSayisi >= 3) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Periyot kombinasyonunu kontrol eder (aynı periyotta en az 4 kart)
     * @param {Array} kartlar - Kart bilgileri dizisi 
     * @returns {boolean} - Geçerli bir periyot kombinasyonu mu?
     */
    function periyotKombinasyonuKontrolEt(kartlar) {
        // Jokerleri ayır
        const jokerler = kartlar.filter(kart => kart.joker);
        const normalKartlar = kartlar.filter(kart => !kart.joker);
        
        // Gruplandırma
        const periyotlar = {};
        normalKartlar.forEach(kart => {
            if (!periyotlar[kart.periyot]) {
                periyotlar[kart.periyot] = [];
            }
            periyotlar[kart.periyot].push(kart);
        });
        
        // En az bir periyotta 4 veya daha fazla kart var mı?
        // Ya da jokerlerle tamamlanabilir mi?
        let jokerSayisi = jokerler.length;
        
        for (const periyot in periyotlar) {
            const gerekliKartSayisi = 4;
            const eksikKartSayisi = gerekliKartSayisi - periyotlar[periyot].length;
            
            // Bu periyot yeterli karta sahip mi?
            if (periyotlar[periyot].length >= gerekliKartSayisi) {
                return true;
            }
            
            // Jokerlerle tamamlanabilir mi?
            if (eksikKartSayisi > 0 && eksikKartSayisi <= jokerSayisi) {
                return true;
            }
        }
        
        // Tamamen jokerlerden oluşan bir periyot olabilir mi?
        if (jokerSayisi >= 4) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Bildirimi ekranda gösterir
     * @param {string} mesaj - Gösterilecek mesaj
     * @param {string} tur - Bildirimin türü (success, error, warning, info)
     */
    function bildirimGoster(mesaj, tur = "info") {
        // Önceki bildirimleri kontrol et ve konumları ayarla
        const mevcutBildirimler = document.querySelectorAll('.bildirim');
        let yukseklik = 20; // İlk bildirim için başlangıç yüksekliği
        
        // Her mevcut bildirim için yüksekliği artır
        mevcutBildirimler.forEach(bildirim => {
            // Bildirim yüksekliğini hesapla (padding dahil)
            const bildirimYukseklik = bildirim.offsetHeight + 10; // 10px ekstra boşluk
            yukseklik += bildirimYukseklik;
        });
        
        const bildirim = document.createElement('div');
        bildirim.className = `bildirim bildirim-${tur}`;
        bildirim.textContent = mesaj;
        bildirim.style.position = 'fixed';
        bildirim.style.top = `${yukseklik}px`; // Hesaplanan yüksekliği kullan
        bildirim.style.left = '50%';
        bildirim.style.transform = 'translateX(-50%)';
        bildirim.style.padding = '10px 20px';
        bildirim.style.borderRadius = '5px';
        bildirim.style.fontWeight = 'bold';
        bildirim.style.zIndex = '9999';
        bildirim.style.color = '#000000';
        
        // Bildirimin arka plan rengini ayarla
        switch (tur) {
            case 'success':
                bildirim.style.backgroundColor = '#a3ffb3'; // Açık yeşil
                break;
            case 'error':
                bildirim.style.backgroundColor = '#ffb3b3'; // Açık kırmızı
                break;
            case 'warning':
                bildirim.style.backgroundColor = '#ffe0b3'; // Açık turuncu
                break;
            default:
                bildirim.style.backgroundColor = '#b3e0ff'; // Açık mavi
        }
        
        document.body.appendChild(bildirim);
        
        // 2 saniye sonra bildirimi kaldır
        setTimeout(() => {
            bildirim.style.opacity = '0';
            bildirim.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                if (document.body.contains(bildirim)) {
                    document.body.removeChild(bildirim);
                    // Bildirimi kaldırdıktan sonra diğer bildirimlerin konumlarını güncelle
                    konumlariniGuncelle();
                }
            }, 500);
        }, 2000);
        
        // Diğer bildirimlerin konumlarını güncelleme fonksiyonu
        function konumlariniGuncelle() {
            const bildirimler = document.querySelectorAll('.bildirim');
            let yeniYukseklik = 20;
            
            bildirimler.forEach(b => {
                b.style.top = `${yeniYukseklik}px`;
                yeniYukseklik += b.offsetHeight + 10;
            });
        }
    }
    
    /**
     * Kalan kart sayısını günceller
     */
    function kalanKartSayisiniGuncelle() {
        const kalanKartElement = document.getElementById('kalan-kart');
        if (!kalanKartElement) return;
        
        // Destede kalan kart sayısı (varsayılan olarak desteden kart çekme butonuna tıklama ile güncelleniyor)
        // Bot kartlarını da hesaba katalım
        const botKartlariToplam = Array.from(document.querySelectorAll('.bot-kartlar')).reduce((toplam, botKartlar) => {
            return toplam + botKartlar.children.length;
        }, 0);
        
        const oyuncuKartlari = document.getElementById('oyuncu-kartlari').children.length;
        const desteKartlari = parseInt(kalanKartElement.textContent) || 0;
        
        // Toplam kart sayısı
        const toplamKart = desteKartlari + botKartlariToplam + oyuncuKartlari;
        
        kalanKartElement.textContent = toplamKart;
    }
    
    /**
     * Puanı günceller ve animasyon ekler
     * @param {string} id - Puan elementinin id'si
     * @param {number} puan - Eklenecek puan
     */
    function puanGuncelle(id, puan) {
        const puanElement = document.getElementById(id);
        const mevcutPuan = parseInt(puanElement.textContent);
        const yeniPuan = mevcutPuan + puan;
        
        // Puanı güncelle
        puanElement.textContent = yeniPuan;
        
        // Animasyon sınıfını ekle
        puanElement.classList.add('puan-degisti');
        
        // Animasyon tamamlandıktan sonra sınıfı kaldır
        setTimeout(() => {
            puanElement.classList.remove('puan-degisti');
        }, 500); // Animasyon süresiyle aynı olmalı
        
        // Eğer sabitlenen oyuncu puanı varsa onu da güncelle
        if (id === 'oyuncu-puan') {
            const sabitPuan = document.querySelector('.sabit-puan-deger');
            if (sabitPuan) {
                sabitPuan.textContent = yeniPuan;
                sabitPuan.classList.add('puan-degisti');
                
                setTimeout(() => {
                    sabitPuan.classList.remove('puan-degisti');
                }, 500);
            }
        }
        
        return yeniPuan;
    }
    
    /**
     * Oyuncunun puanını günceller
     * @param {number} puan - Eklenecek puan
     * @returns {number} - Yeni puan
     */
    function oyuncuPuanGuncelle(puan) {
        // Mevcut puanı al
        const oyuncuPuanElementi = document.getElementById('oyuncu-puan');
        let mevcutPuan = parseInt(oyuncuPuanElementi.textContent) || 0;
        
        // Puanı güncelle
        const yeniPuan = mevcutPuan + puan;
        oyuncuPuanElementi.textContent = yeniPuan;
        
        // Sabit puanı da güncelle (gösterge varsa)
        const sabitPuanDeger = document.querySelector('.sabit-puan-deger');
        if (sabitPuanDeger) {
            sabitPuanDeger.textContent = yeniPuan;
        }
        
        // Animasyon efekti için puanı vurgula
        oyuncuPuanElementi.classList.add('puan-artis');
        setTimeout(() => {
            oyuncuPuanElementi.classList.remove('puan-artis');
        }, 500);
        
        // 100 puan veya üzeri ise yıldız kazandır
        if (yeniPuan >= 100) {
            bildirimGoster("Tebrikler! 100 puana ulaştınız ve bir yıldız kazandınız!", "success");
            
            // Puanı sıfırla
            setTimeout(() => {
                oyuncuPuanElementi.textContent = "0";
                if (sabitPuanDeger) sabitPuanDeger.textContent = "0";
                
                // Yıldız kazandır
                yildizKazandir('oyuncu');
            }, 1000);
        }
        
        return yeniPuan;
    }
    
    /**
     * Bot puanını günceller
     * @param {number} botNo - Bot numarası (1-3)
     * @param {number} puan - Eklenecek puan
     * @returns {number} - Yeni puan
     */
    function botPuanGuncelle(botNo, puan) {
        // Mevcut puanı al
        const botPuanElementi = document.getElementById(`bot${botNo}-puan`);
        
        // Element yoksa veya sayı değilse
        if (!botPuanElementi) return 0;
        
        let mevcutPuan = parseInt(botPuanElementi.textContent) || 0;
        
        // Puanı güncelle
        const yeniPuan = mevcutPuan + puan;
        botPuanElementi.textContent = yeniPuan;
        
        // Animasyon efekti için puanı vurgula
        botPuanElementi.classList.add('puan-artis');
        setTimeout(() => {
            botPuanElementi.classList.remove('puan-artis');
        }, 500);
        
        // 100 puan veya üzeri ise yıldız kazandır
        if (yeniPuan >= 100) {
            bildirimGoster(`Bot ${botNo} 100 puana ulaştı ve bir yıldız kazandı!`, "warning");
            
            // Puanı sıfırla
            setTimeout(() => {
                botPuanElementi.textContent = "0";
                
                // Yıldız kazandır
                yildizKazandir(`bot${botNo}`);
            }, 1000);
        }
        
        return yeniPuan;
    }
    
    /**
     * Oyun kazanıldığında çağrılan fonksiyon
     */
    function oyunuKazan() {
        // Oyun sonu ekranını göster
        document.getElementById('oyun-screen').classList.add('gizli');
        document.getElementById('oyun-sonu-screen').classList.remove('gizli');
        
        // Sonuç mesajını ayarla
        const oyuncuPuan = parseInt(document.getElementById('oyuncu-puan').textContent);
        
        // Kazanma sebebine göre mesaj
        let zaferMesaji = "";
        if (oyuncuYildizSayisi >= 5) {
            zaferMesaji = "Tebrikler! 5 yıldız toplayarak oyunu kazandınız!";
        } else {
            zaferMesaji = "Tebrikler! 100 puana ulaşarak bir yıldız kazandınız!";
        }
        
        document.getElementById('sonuc-mesaji').textContent = zaferMesaji;
        
        // Puanı aktar
        document.getElementById('sonuc-puan').textContent = oyuncuPuan;
        
        // İstatistikleri güncelle
        try {
            // Mevcut istatistikleri al
            const istatistikler = JSON.parse(localStorage.getItem('periyodikOkey_istatistikler') || '{}');
            
            // İstatistikleri güncelle
            istatistikler.oyunSayisi = (istatistikler.oyunSayisi || 0) + 1;
            istatistikler.kazanmaSayisi = (istatistikler.kazanmaSayisi || 0) + 1;
            istatistikler.toplamPuan = (istatistikler.toplamPuan || 0) + oyuncuPuan;
            istatistikler.enYuksekSkor = Math.max(istatistikler.enYuksekSkor || 0, oyuncuPuan);
            istatistikler.kazanilanYildizlar = (istatistikler.kazanilanYildizlar || 0) + oyuncuYildizSayisi;
            
            // Güncellenmiş istatistikleri kaydet
            localStorage.setItem('periyodikOkey_istatistikler', JSON.stringify(istatistikler));
        } catch (error) {
            console.error("İstatistikler güncellenirken hata oluştu:", error);
        }
    }
    
    // Kart verme (elden atma) butonu için güncellenmiş işleyici
    document.getElementById('btn-kart-ver').addEventListener('click', () => {
        console.log("Kart veriliyor...");
        // Seçili kart var mı kontrol et
        const seciliKart = document.querySelector('.element-kart.secili');
        if (seciliKart) {
            // Seçili kartı açık kart alanına taşı
            const acikKartAlani = document.querySelector('.acik-kart-alani');
            acikKartAlani.innerHTML = ''; // Önceki kartı temizle
            
            // Kartı kopyala ve açık kart alanına yerleştir
            // (Kartı küçültüp PO olarak değil, olduğu gibi göster)
            const acikKart = seciliKart.cloneNode(true);
            acikKart.classList.add('acik-kart');
            acikKartAlani.appendChild(acikKart);
            
            // Orijinal kartı kaldır
            seciliKart.remove();
            
            // Kalan kart sayısını güncelle
            kalanKartSayisiniGuncelle();
            
            // Kart çekme durumunu sıfırla ve bot hamlesini başlat
            setTimeout(() => {
                // Bot hamleleri öncesi kart sayılarını dengele
                botKartSayisiniDengele();
                
                // Bot hamleleri
                botHamlesiYap();
            }, 1000);
        } else {
            bildirimGoster("Lütfen önce bir kart seçin!", "error");
        }
    });
    
    // Desteden kart çekme butonu
    document.getElementById('btn-desteyi-ac').addEventListener('click', () => {
        if (kartCekildi) {
            bildirimGoster("Her tur sadece bir kart çekebilirsiniz!", "error");
            return;
        }
        
        // Elementleri asenkron olarak yükle ve sonra kullan
        elementVerileriniYukle().then(yuklenenElementler => {
            console.log("Desteden kart çekiliyor...");
            
            // Kullanılmamış elementlerden filtreleme yap
            const kullanilabilirElementler = yuklenenElementler.filter(element => 
                !oynanmisKartlar.some(kullanilmisKart => 
                    kullanilmisKart.atom_no === element.atom_no && 
                    kullanilmisKart.sembol === element.sembol
                )
            );
            
            // Kullanılabilir element yoksa tüm elementleri kullan
            const elementler = kullanilabilirElementler.length > 10 ? 
                              kullanilabilirElementler : yuklenenElementler;
            
            // Oyuncu kartlarına yeni bir kart ekle
            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
            if (oyuncuKartlari) {
                // Rastgele bir element al
                const randomIndex = Math.floor(Math.random() * elementler.length);
                const yeniKart = elementKartiOlusturDOM(elementler[randomIndex], 1);
                oyuncuKartlari.appendChild(yeniKart);
                
                // Kart çekme durumunu güncelle
                kartCekildi = true;
                document.getElementById('durum-mesaji').textContent = 'Kart çektiniz. Şimdi bir kartı atın veya kombinasyon yapın.';
                
                // Kalan kart sayısını güncelle
                kalanKartSayisiniGuncelle();
                
                // Çekilen kartı bildir
                bildirimGoster(`Desteden çekilen kart: ${elementler[randomIndex].sembol}`, "info");
            }
        }).catch(error => {
            console.error("Desteden kart çekerken hata oluştu:", error);
            bildirimGoster("Kart çekilirken bir hata oluştu. Lütfen tekrar deneyin.", "error");
        });
    });
    
    // Açık kartı alma butonu
    document.getElementById('btn-acik-karti-al').addEventListener('click', () => {
        if (kartCekildi) {
            bildirimGoster("Her tur sadece bir kart çekebilirsiniz!", "error");
            return;
        }
        
        console.log("Açık kart alınıyor...");
        const acikKartAlani = document.querySelector('.acik-kart-alani');
        const acikKart = acikKartAlani.querySelector('.element-kart');
        
        if (acikKart) {
            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
            if (oyuncuKartlari) {
                // Açık kartı oyuncuya ekle
                oyuncuKartlari.appendChild(acikKart);
                
                // Yeni açık kartı yerleştir (rastgele)
                elementVerileriniYukle().then(yuklenenElementler => {
                    // Kullanılmamış elementlerden filtreleme yap
                    const kullanilabilirElementler = yuklenenElementler.filter(element => 
                        !oynanmisKartlar.some(kullanilmisKart => 
                            kullanilmisKart.atom_no === element.atom_no && 
                            kullanilmisKart.sembol === element.sembol
                        )
                    );
                    
                    // Kullanılabilir element yoksa tüm elementleri kullan
                    const elementler = kullanilabilirElementler.length > 10 ? 
                                      kullanilabilirElementler : yuklenenElementler;
                    
                    // Rastgele bir element seç
                    const randomIndex = Math.floor(Math.random() * elementler.length);
                    const yeniAcikKart = elementKartiOlusturDOM(elementler[randomIndex], 1);
                    
                    // Kısa bir süre bekleyerek yeni açık kartı göster
                    setTimeout(() => {
                        acikKartAlani.appendChild(yeniAcikKart);
                        bildirimGoster(`Yeni açık kart yerleştirildi: ${elementler[randomIndex].sembol}`, "info");
                    }, 500);
                });
                
                // Kart çekme durumunu güncelle
                kartCekildi = true;
                document.getElementById('durum-mesaji').textContent = 'Açık kartı aldınız. Şimdi bir kartı atın veya kombinasyon yapın.';
                
                // Kalan kart sayısını güncelle
                kalanKartSayisiniGuncelle();
            }
        } else {
            bildirimGoster("Açık kart bulunmuyor!", "error");
        }
    });
    
    /**
     * Botun hamlesini yapmasını sağlar
     */
    function botHamlesiYap() {
        const durumMesaji = document.getElementById('durum-mesaji');
        durumMesaji.textContent = 'Bot oynuyor...';
        
        // Element verilerini yükle
        elementVerileriniYukle().then(yuklenenElementler => {
            // Tüm botlar için hamle yap
            const botSayisi = parseInt(document.getElementById('bot-sayisi')?.value) || 3; // Ayarlardan bot sayısı
            let aktifBot = 1;
            
            function birSonrakiBotaGec() {
                if (aktifBot <= botSayisi) {
                    durumMesaji.textContent = `Bot ${aktifBot} oynuyor...`;
                    
                    // Bot kartları
                    const botKartlari = document.querySelector(`#bot${aktifBot}-alani .bot-kartlar`);
                    
                    // Bot konuşsun
                    const ruhHali = ['umutlu', 'umutsuz', 'korkutucu'][Math.floor(Math.random() * 3)];
                    botKonustur(aktifBot, ruhHali);
                    
                    // Bot düşünüyor... (5 saniye)
                    setTimeout(() => botHamlesiniYap(), 5000);
                    
                    // Bot hamlesini tamamlama işlevi
                    function botHamlesiniYap() {
                        // Önce % 50 ihtimalle açık kartı veya desteden çeksin
                        if (Math.random() < 0.5) {
                            // Açık kartı al
                            botKartEkle(aktifBot);
                            bildirimGoster(`Bot ${aktifBot} açık kartı aldı.`, "info");
                        } else {
                            // Desteden bir kart çek
                            botKartEkle(aktifBot);
                            bildirimGoster(`Bot ${aktifBot} desteden kart çekti.`, "info");
                        }
                        
                        // Kart sayılarını dengele
                        botKartSayisiniDengele();
                        
                        // Zorluk seviyesine göre kombinasyon yapma şansını belirle
                        const kombinasyonSansi = Math.random();
                        const zorlukKombinasyonEsigi = 1 - zorlugaGoreKombinasyonSansi();
                        
                        // Rastgele bir şansla bot kombinasyon yapabilir (zorluk seviyesine göre)
                        if (kombinasyonSansi > zorlukKombinasyonEsigi) {
                            // Kombinasyon kartlarının sayısı (3-5 arası)
                            const minKartSayisi = 3; // Minimum grup için en az 3 kart
                            const kombinasyonKartSayisi = Math.min(Math.floor(Math.random() * 3) + minKartSayisi, botKartlari.children.length);
                            
                            // Eğer bot kartı minKartSayisi'dan azsa, kombinasyon yapamaz
                            if (botKartlari.children.length < minKartSayisi) {
                                // Sonraki bota geç
                                aktifBot++;
                                setTimeout(birSonrakiBotaGec, 300);
                                return;
                            }
                            
                            // Kombinasyon türü (grup veya periyot)
                            const kombinasyonTuru = Math.random() > 0.5 ? "Grup" : "Periyot";
                            
                            // Puanlama (grup: her kart 5 puan, periyot: her kart 4 puan)
                            const kartBasinaPuan = kombinasyonTuru === "Grup" ? 5 : 4;
                            const kazanilanPuan = kombinasyonKartSayisi * kartBasinaPuan;
                            
                            // Bot konuşsun - kombinasyon yaptığında
                            botKonustur(aktifBot, 'umutlu');
                            
                            // Puan güncellemesi ve bildirim
                            const yeniPuan = botPuanGuncelle(aktifBot, kazanilanPuan);
                            bildirimGoster(`Bot ${aktifBot} ${kombinasyonTuru} kombinasyonu yaptı! +${kazanilanPuan} puan (${kombinasyonKartSayisi} kart x ${kartBasinaPuan})`, "warning");
                            
                            // Bot kartlarından kombinasyon miktarı kadar kart düş
                            for (let i = 0; i < Math.min(kombinasyonKartSayisi, botKartlari.children.length); i++) {
                                if (botKartlari.lastChild) {
                                    botKartlari.removeChild(botKartlari.lastChild);
                                }
                            }
                            
                            // 100 puana ulaştıysa yıldız kazandır
                            if (yeniPuan >= 100) {
                                botKonustur(aktifBot, 'kazanma');
                                setTimeout(() => {
                                    bildirimGoster(`Bot ${aktifBot} 100 puana ulaştı! Bir yıldız kazandı!`, "warning");
                                }, 500);
                                return;
                            }
                        }
                        
                        // Son bot ise ve oyuncuya kart verecekse
                        if (aktifBot === botSayisi) {
                            // Botun bir kartını azalt
                            botKartCikar(aktifBot);
                            
                            // Rastgele bir element seç ve kart oluştur
                            const randomIndex = Math.floor(Math.random() * yuklenenElementler.length);
                            const element = yuklenenElementler[randomIndex];
                            
                            // %15 olasılıkla joker kart olsun
                            const jokerMi = Math.random() < 0.15;
                            
                            // Normal görünümlü kart oluştur
                            const yeniKart = elementKartiOlusturDOM(element, 1, jokerMi);
                            
                            // Açık kart alanına kartı ekle
                            const acikKartAlani = document.querySelector('.acik-kart-alani');
                            acikKartAlani.innerHTML = ''; // Temizle
                            acikKartAlani.appendChild(yeniKart);
                            
                            // Joker durumunu bildir
                            const kartTipi = jokerMi ? "Joker kartı" : element.sembol;
                            bildirimGoster(`Bot ${botSayisi} açık kart alanına kart bıraktı: ${kartTipi}`, "info");
                            
                            // Tur oyuncuya geçiyor
                            setTimeout(() => {
                                durumMesaji.textContent = 'Sizin sıranız. Kart çekin veya açık kartı alın.';
                                turBaslat();
                            }, 1000);
                        } else {
                            // Normal hamlesine devam et - kart ver
                            if (botKartlari && botKartlari.children.length > 0) {
                                // Botun bir kartını azalt
                                botKartCikar(aktifBot);
                                
                                // Yeni açık kartı oluştur
                                const randomIndex = Math.floor(Math.random() * yuklenenElementler.length);
                                const element = yuklenenElementler[randomIndex];
                                
                                // %15 olasılıkla joker kart olsun
                                const jokerMi = Math.random() < 0.15;
                                
                                // Kart oluştur
                                const yeniKart = elementKartiOlusturDOM(element, 1, jokerMi);
                                
                                // Açık kart alanına ekle
                                const acikKartAlani = document.querySelector('.acik-kart-alani');
                                acikKartAlani.innerHTML = ''; // Temizle
                                acikKartAlani.appendChild(yeniKart);
                                
                                // Joker durumunu bildir
                                const kartTipi = jokerMi ? "Joker kartı" : element.sembol;
                                bildirimGoster(`Bot ${aktifBot} açık kart alanına kart bıraktı: ${kartTipi}`, "info");
                                
                                // Sonraki bota geç
                                aktifBot++;
                                setTimeout(birSonrakiBotaGec, 500);
                            } else {
                                // Kart kalmadıysa sonraki bota geç
                                aktifBot++;
                                setTimeout(birSonrakiBotaGec, 300);
                            }
                        }
                    }
                } else {
                    // Tüm botlar oynadı, oyuncunun sırası
                    durumMesaji.textContent = 'Sizin sıranız. Desteden bir kart çekin veya açık kartı alın.';
                    turBaslat();
                }
            }
            
            // İlk bottan başla
            birSonrakiBotaGec();
        }).catch(error => {
            console.error("Bot hamlesi sırasında hata:", error);
            bildirimGoster("Bot hamlesinde bir sorun oluştu", "error");
            turBaslat(); // Sorun olursa oyuncuya geç
        });
    }
    
    /**
     * Bota bir kart ekler
     * @param {number} botNo - Kartın ekleneceği botun numarası
     */
    function botKartEkle(botNo) {
        const botKartlari = document.querySelector(`#bot${botNo}-alani .bot-kartlar`);
        if (botKartlari && botKartlari.children.length < 7) {
            const yeniKart = document.createElement('div');
            yeniKart.className = 'element-kart arka-yuz bot-kart';
            botKartlari.appendChild(yeniKart);
        }
    }
    
    /**
     * Bottan bir kart çıkarır
     * @param {number} botNo - Kartın çıkarılacağı botun numarası
     */
    function botKartCikar(botNo) {
        const botKartlari = document.querySelector(`#bot${botNo}-alani .bot-kartlar`);
        if (botKartlari && botKartlari.children.length > 0) {
            botKartlari.removeChild(botKartlari.lastChild);
        }
    }
    
    /**
     * Bot kazandığında çağrılan fonksiyon
     * @param {number} botNo - Kazanan botun numarası
     */
    function botKazandi(botNo) {
        // Oyun sonu ekranını göster
        document.getElementById('oyun-screen').classList.add('gizli');
        document.getElementById('oyun-sonu-screen').classList.remove('gizli');
        
        // Sonuç mesajını ayarla
        const botPuan = parseInt(document.getElementById(`bot${botNo}-puan`).textContent);
        
        // Bot'un yıldız sayısını kontrol et
        let botYildizSayisi = 0;
        if (botNo === 1) botYildizSayisi = bot1YildizSayisi;
        else if (botNo === 2) botYildizSayisi = bot2YildizSayisi;
        else if (botNo === 3) botYildizSayisi = bot3YildizSayisi;
        
        // Kazanma sebebine göre mesaj
        let yenilgiMesaji = "";
        if (botYildizSayisi >= 5) {
            yenilgiMesaji = `Bot ${botNo} 5 yıldız toplayarak oyunu kazandı!`;
        } else {
            yenilgiMesaji = `Bot ${botNo} 100 puana ulaşarak bir yıldız kazandı ve oyunu kazandı!`;
        }
        
        document.getElementById('sonuc-mesaji').textContent = yenilgiMesaji;
        document.getElementById('sonuc-puan').textContent = document.getElementById('oyuncu-puan').textContent;
        
        // İstatistikleri güncelle
        try {
            // Mevcut istatistikleri al
            const istatistikler = JSON.parse(localStorage.getItem('periyodikOkey_istatistikler') || '{}');
            
            // İstatistikleri güncelle
            istatistikler.oyunSayisi = (istatistikler.oyunSayisi || 0) + 1;
            istatistikler.kaybetmeSayisi = (istatistikler.kaybetmeSayisi || 0) + 1;
            
            // Güncellenmiş istatistikleri kaydet
            localStorage.setItem('periyodikOkey_istatistikler', JSON.stringify(istatistikler));
        } catch (error) {
            console.error("İstatistikler güncellenirken hata oluştu:", error);
        }
    }
    
    // Oyuncu puanını sağ üst köşeye sabitleyen fonksiyon
    function oyuncuPuaniniSabitle() {
        // Bu fonksiyon artık hiçbir şey yapmıyor
        // Oyuncu puanı zaten oyuncu kartları alanının üzerinde görünüyor
    }
    
    // Element kartını DOM elementi olarak oluşturur
    function elementKartiOlusturDOM(element, takim = 1, jokerMi = false) {
        if (!element) {
            console.error("Element verisi eksik!");
            return null;
        }
        
        // Kart div'i oluştur
        const kartDiv = document.createElement('div');
        kartDiv.className = 'element-kart';
        if (jokerMi) {
            kartDiv.className += ' joker';
        }
        
        // Periyodik tablo bilgilerini data öznitelikleri olarak ekle
        kartDiv.dataset.atomNo = element.atom_no;
        kartDiv.dataset.sembol = element.sembol;
        kartDiv.dataset.grup = element.grup;
        kartDiv.dataset.periyot = element.periyot;
        kartDiv.dataset.takim = takim;
        kartDiv.dataset.joker = jokerMi;
        
        // Kart içeriğini oluştur
        if (jokerMi) {
            // Joker kart içeriği
            kartDiv.innerHTML = `
                <div class="atom-no">J</div>
                <div class="sembol">Jk</div>
                <div class="isim">Joker</div>
                <div class="grup-periyot">Joker</div>
            `;
        } else {
            // Normal element kartı içeriği
            kartDiv.innerHTML = `
                <div class="atom-no">${element.atom_no}</div>
                <div class="takim">T${takim}</div>
                <div class="sembol">${element.sembol}</div>
                <div class="isim">${element.isim}</div>
                <div class="grup-periyot">G:${element.grup} P:${element.periyot}</div>
            `;
        }
        
        // Arka plan rengini element türüne göre ayarla
        if (element.element_turu) {
            let renkKodu;
            switch (element.element_turu.toLowerCase()) {
                case 'metal':
                case 'alkali metal':
                case 'toprak alkali metal':
                    renkKodu = '#b3e0ff'; // Açık mavi
                    break;
                case 'ametal':
                case 'halojen':
                    renkKodu = '#ffb3b3'; // Açık kırmızı
                    break;
                case 'yarı metal':
                    renkKodu = '#ffe0b3'; // Açık turuncu
                    break;
                case 'soy gaz':
                    renkKodu = '#d6b3ff'; // Açık mor
                    break;
                default:
                    renkKodu = '#f2f2f2'; // Açık gri
            }
            kartDiv.style.backgroundColor = renkKodu;
        } else {
            // Grup numarasına göre renk
            const grupRenkler = {
                1: '#ffb3b3',  // Kırmızı
                2: '#ffe0b3',  // Turuncu
                13: '#ffffb3', // Sarı
                14: '#b3ffb3', // Yeşil
                15: '#b3e0ff', // Açık mavi
                16: '#b3b3ff', // Mavi
                17: '#d6b3ff', // Mor
                18: '#ffb3e0'  // Pembe
            };
            
            const renk = grupRenkler[element.grup] || '#f2f2f2';
            kartDiv.style.backgroundColor = renk;
        }
        
        // Joker kartlara özel stil
        if (jokerMi) {
            kartDiv.style.backgroundColor = '#ffffb3'; // Altın sarısı
            kartDiv.style.borderColor = '#ffd700';
        }
        
        // Kart seçimi olayı
        kartDiv.addEventListener('click', (e) => {
            // Diğer seçili kartları temizle
            document.querySelectorAll('.element-kart.secili').forEach(kart => {
                if (kart !== kartDiv) {
                    kart.classList.remove('secili');
                }
            });
            
            // Bu kartın seçili durumunu değiştir
            kartDiv.classList.toggle('secili');
            e.stopPropagation(); // Olay yayılımını durdur
        });
        
        // Sürükleme özelliği ekle
        kartDiv.setAttribute('draggable', 'true');
        kartDiv.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', kartDiv.dataset.sembol);
            e.dataTransfer.setData('kart', JSON.stringify({
                atomNo: kartDiv.dataset.atomNo,
                sembol: kartDiv.dataset.sembol,
                grup: kartDiv.dataset.grup,
                periyot: kartDiv.dataset.periyot,
                takim: kartDiv.dataset.takim,
                joker: kartDiv.dataset.joker
            }));
            setTimeout(() => {
                kartDiv.classList.add('surukle');
            }, 0);
        });
        
        kartDiv.addEventListener('dragend', () => {
            kartDiv.classList.remove('surukle');
        });
        
        return kartDiv;
    }

    // Sürükleme olayları için işleyiciler
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDragEnter(e) {
        e.preventDefault();
        e.currentTarget.classList.add('surukle-uzerinde');
    }

    function handleDragLeave(e) {
        e.currentTarget.classList.remove('surukle-uzerinde');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('surukle-uzerinde');
        
        // Sürüklenen kartın verilerini al
        const kartVerisi = e.dataTransfer.getData('kart');
        if (!kartVerisi) return;
        
        const kartBilgisi = JSON.parse(kartVerisi);
        const sürüklenenKart = document.querySelector(`.element-kart.surukle`);
        
        if (sürüklenenKart) {
            // Kart kombinasyon alanına taşınıyorsa
            if (e.currentTarget.id === 'kombinasyon-icerik') {
                e.currentTarget.appendChild(sürüklenenKart);
            } 
            // Kart oyuncu kartlarına taşınıyorsa
            else if (e.currentTarget.id === 'oyuncu-kartlari') {
                e.currentTarget.appendChild(sürüklenenKart);
            }
        }
    }
    
    console.log("Periyodik Okey oyunu hazır!");

    // Global değişkenler
    let oyuncuYildizSayisi = 0; // Oyuncunun yıldız sayısı
    let bot1YildizSayisi = 0; // Bot 1'in yıldız sayısı
    let bot2YildizSayisi = 0; // Bot 2'in yıldız sayısı
    let bot3YildizSayisi = 0; // Bot 3'in yıldız sayısı
    let oynanmisKartlar = []; // Oynanmış ve tekrar kullanılmayacak kartlar

    /**
     * Yıldız sistemini günceller
     * Eğer oyuncu veya bir bot 100 puana ulaşırsa veya tüm kartlarını bitirirse bir yıldız kazanır
     * 5 yıldıza ulaşan oyuncu veya bot oyunu kazanır
     */
    function yildizlariGuncelle() {
        // Oyuncu yıldızlarını güncelle
        const oyuncuYildizAlani = document.getElementById('oyuncu-yildiz-alani');
        oyuncuYildizAlani.innerHTML = '';
        for (let i = 0; i < oyuncuYildizSayisi; i++) {
            const yildiz = document.createElement('div');
            yildiz.className = 'yildiz';
            yildiz.innerHTML = '★';
            oyuncuYildizAlani.appendChild(yildiz);
        }
        
        // Bot 1 yıldızlarını güncelle
        const bot1YildizAlani = document.getElementById('bot1-yildiz-alani');
        bot1YildizAlani.innerHTML = '';
        for (let i = 0; i < bot1YildizSayisi; i++) {
            const yildiz = document.createElement('div');
            yildiz.className = 'yildiz';
            yildiz.innerHTML = '★';
            bot1YildizAlani.appendChild(yildiz);
        }
        
        // Bot 2 yıldızlarını güncelle
        const bot2YildizAlani = document.getElementById('bot2-yildiz-alani');
        bot2YildizAlani.innerHTML = '';
        for (let i = 0; i < bot2YildizSayisi; i++) {
            const yildiz = document.createElement('div');
            yildiz.className = 'yildiz';
            yildiz.innerHTML = '★';
            bot2YildizAlani.appendChild(yildiz);
        }
        
        // Bot 3 yıldızlarını güncelle
        const bot3YildizAlani = document.getElementById('bot3-yildiz-alani');
        bot3YildizAlani.innerHTML = '';
        for (let i = 0; i < bot3YildizSayisi; i++) {
            const yildiz = document.createElement('div');
            yildiz.className = 'yildiz';
            yildiz.innerHTML = '★';
            bot3YildizAlani.appendChild(yildiz);
        }
    }

    /**
     * Yıldız kazandırır ve kontrol eder
     * @param {string} id - Yıldız kazanan oyuncu/bot ID'si ('oyuncu', 'bot1', 'bot2', 'bot3')
     */
    function yildizKazandir(id) {
        // Oyuncu yıldız sayısını arttır
        if (id === 'oyuncu') {
            oyuncuYildizSayisi++;
            if (oyuncuYildizSayisi >= 5) {
                oyunuKazan();
                return;
            }
        } 
        // Bot yıldız sayısını arttır
        else if (id === 'bot1') {
            bot1YildizSayisi++;
            if (bot1YildizSayisi >= 5) {
                botKazandi(1);
                return;
            }
        } 
        else if (id === 'bot2') {
            bot2YildizSayisi++;
            if (bot2YildizSayisi >= 5) {
                botKazandi(2);
                return;
            }
        } 
        else if (id === 'bot3') {
            bot3YildizSayisi++;
            if (bot3YildizSayisi >= 5) {
                botKazandi(3);
                return;
            }
        }
        
        // Yıldızları güncelle
        yildizlariGuncelle();
        
        // Yeni tur başlat
        yeniTurBaslat();
    }

    /**
     * Yeni tur başlatır - kart dağıtım animasyonu gösterir ve sonra yeni kartları dağıtır
     */
    function yeniTurBaslat() {
        kartDagitimAnimasyonu().then(() => {
            testKartlariOlustur();
        });
    }

    /**
     * Kart dağıtımı için 10 saniyelik animasyon gösterir
     * @returns {Promise} Animasyon tamamlandığında resolve olan promise
     */
    function kartDagitimAnimasyonu() {
        return new Promise((resolve) => {
            // Oyun ekranını geçici olarak gizle
            document.getElementById('oyun-screen').classList.add('gizli');
            
            // Animasyon konteynerini oluştur
            const animasyonKonteyner = document.createElement('div');
            animasyonKonteyner.id = 'kart-dagitim-animasyonu';
            animasyonKonteyner.style.position = 'fixed';
            animasyonKonteyner.style.top = '0';
            animasyonKonteyner.style.left = '0';
            animasyonKonteyner.style.width = '100%';
            animasyonKonteyner.style.height = '100%';
            animasyonKonteyner.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            animasyonKonteyner.style.display = 'flex';
            animasyonKonteyner.style.flexDirection = 'column';
            animasyonKonteyner.style.justifyContent = 'center';
            animasyonKonteyner.style.alignItems = 'center';
            animasyonKonteyner.style.zIndex = '9999';
            
            // Mesaj ekle
            const mesaj = document.createElement('div');
            mesaj.textContent = 'Kartlar dağıtılıyor...';
            mesaj.style.color = 'white';
            mesaj.style.fontSize = '24px';
            mesaj.style.marginBottom = '20px';
            
            // İlerleme çubuğu konteynerini ekle
            const ilerlemeKonteyner = document.createElement('div');
            ilerlemeKonteyner.style.width = '60%';
            ilerlemeKonteyner.style.height = '20px';
            ilerlemeKonteyner.style.backgroundColor = '#444';
            ilerlemeKonteyner.style.borderRadius = '10px';
            ilerlemeKonteyner.style.overflow = 'hidden';
            
            // İlerleme çubuğu
            const ilerlemeBar = document.createElement('div');
            ilerlemeBar.style.width = '0%';
            ilerlemeBar.style.height = '100%';
            ilerlemeBar.style.backgroundColor = '#4CAF50';
            ilerlemeBar.style.transition = 'width 10s linear';
            
            // Elementleri ekle
            ilerlemeKonteyner.appendChild(ilerlemeBar);
            animasyonKonteyner.appendChild(mesaj);
            animasyonKonteyner.appendChild(ilerlemeKonteyner);
            document.body.appendChild(animasyonKonteyner);
            
            // İlerleme çubuğunu başlat
            setTimeout(() => {
                ilerlemeBar.style.width = '100%';
            }, 100);
            
            // Animasyon süresinden sonra temizle ve resolve et
            setTimeout(() => {
                document.body.removeChild(animasyonKonteyner);
                document.getElementById('oyun-screen').classList.remove('gizli');
                resolve();
            }, 10000);
        });
    }

    /**
     * Puan güncellemesi yapar ve animasyon gösterir
     * @param {string} id - Puan güncellenecek oyuncu/bot ID'si ('oyuncu', 'bot1', 'bot2', 'bot3')
     * @param {number} puan - Eklenecek puan miktarı
     */
    function puanGuncelle(id, puan) {
        // İlgili puan elementini bul
        const puanElement = document.getElementById(`${id}-puan`);
        if (!puanElement) return;
        
        // Mevcut puanı al
        const mevcutPuan = parseInt(puanElement.textContent) || 0;
        const yeniPuan = mevcutPuan + puan;
        
        // Puan animasyonu göster
        const animasyonSuresi = 1000; // 1 saniye
        const adimSayisi = 20;
        const adimSuresi = animasyonSuresi / adimSayisi;
        const puanAdimi = puan / adimSayisi;
        
        let geciciPuan = mevcutPuan;
        let adim = 0;
        
        const animasyonInterval = setInterval(() => {
            adim++;
            geciciPuan += puanAdimi;
            
            puanElement.textContent = Math.round(geciciPuan);
            
            if (adim >= adimSayisi) {
                clearInterval(animasyonInterval);
                puanElement.textContent = yeniPuan;
                
                // 100 puana ulaşıldıysa ve 100'ün katlarında yıldız kazandır
                if (yeniPuan >= 100 && mevcutPuan < 100) {
                    yildizKazandir(id);
                } else if (yeniPuan >= 200 && mevcutPuan < 200) {
                    yildizKazandir(id);
                } else if (yeniPuan >= 300 && mevcutPuan < 300) {
                    yildizKazandir(id);
                } else if (yeniPuan >= 400 && mevcutPuan < 400) {
                    yildizKazandir(id);
                } else if (yeniPuan >= 500 && mevcutPuan < 500) {
                    yildizKazandir(id);
                }
            }
        }, adimSuresi);
        
        // Puan kazanma efekti göster
        if (puan > 0) {
            const puanEfekti = document.createElement('div');
            puanEfekti.textContent = `+${puan}`;
            puanEfekti.className = 'puan-efekti';
            
            // Efekti farklı alanlara göre yerleştir
            if (id === 'oyuncu') {
                puanEfekti.style.bottom = '120px';
                puanEfekti.style.left = '50%';
            } else if (id === 'bot1') {
                puanEfekti.style.top = '160px';
                puanEfekti.style.left = '20%'; 
            } else if (id === 'bot2') {
                puanEfekti.style.top = '50px';
                puanEfekti.style.left = '50%';
            } else if (id === 'bot3') {
                puanEfekti.style.top = '160px';
                puanEfekti.style.right = '20%';
                puanEfekti.style.left = 'auto';
            }
            
            document.getElementById('oyun-screen').appendChild(puanEfekti);
            
            // Efekti animasyonla hareket ettir ve sonra kaldır
            setTimeout(() => {
                puanEfekti.style.transform = 'translateY(-50px)';
                puanEfekti.style.opacity = '0';
            }, 100);
            
            setTimeout(() => {
                puanEfekti.remove();
            }, 1000);
        }
    }

    /**
     * Kartları oynanmışKartlar listesine ekler
     * @param {NodeList} kartlar - Eklenmek istenen kartlar
     */
    function kartlariOynanmisOlarakIsaretle(kartlar) {
        if (!kartlar || kartlar.length === 0) return;
        
        Array.from(kartlar).forEach(kart => {
            // Kart bilgilerini al
            const atomNo = kart.dataset.atomNo;
            const sembol = kart.dataset.sembol;
            const grup = kart.dataset.grup;
            const periyot = kart.dataset.periyot;
            
            // Joker kartları listeye ekleme
            if (kart.dataset.joker === 'true') return;
            
            // Kart bilgilerini kaydet
            oynanmisKartlar.push({
                atom_no: atomNo,
                sembol: sembol,
                grup: grup,
                periyot: periyot
            });
        });
        
        console.log("Oynanmış kartlar güncellendi. Toplam:", oynanmisKartlar.length);
    }

    /**
     * Oyun ekranlarını ve butonlarını ayarlar
     */
    function ekranlariAyarla() {
        // Ana menü butonları
        document.getElementById('btn-basla').addEventListener('click', oyunuBaslat);
        document.getElementById('btn-ayarlar').addEventListener('click', ayarlarEkraniniGoster);
        
        // Ayarlar ekranı butonları
        document.getElementById('btn-ayarlar-kaydet').addEventListener('click', ayarlariKaydet);
        document.getElementById('btn-ayarlar-iptal').addEventListener('click', ayarlarEkraniniGizle);
        
        // Oyun sonu ekranı butonları
        document.getElementById('btn-yeni-oyun').addEventListener('click', () => {
            // Oyun sonu ekranını gizle
            document.getElementById('oyun-sonu-screen').classList.add('gizli');
            
            // Yeni oyun başlat
            // Tüm puanları ve yıldızları sıfırla
            document.getElementById('oyuncu-puan').textContent = '0';
            document.getElementById('bot1-puan').textContent = '0';
            document.getElementById('bot2-puan').textContent = '0';
            document.getElementById('bot3-puan').textContent = '0';
            
            oyuncuYildizSayisi = 0;
            bot1YildizSayisi = 0;
            bot2YildizSayisi = 0;
            bot3YildizSayisi = 0;
            
            yildizlariGuncelle();
            
            // Kart dağıtma animasyonuyla yeni oyuna başla
            yeniTurBaslat();
            
            // Oyun ekranını göster
            document.getElementById('oyun-screen').classList.remove('gizli');
        });
        
        document.getElementById('btn-ana-menu').addEventListener('click', () => {
            // Oyun sonu ekranını gizle
            document.getElementById('oyun-sonu-screen').classList.add('gizli');
            
            // Tüm puanları ve yıldızları sıfırla
            document.getElementById('oyuncu-puan').textContent = '0';
            document.getElementById('bot1-puan').textContent = '0';
            document.getElementById('bot2-puan').textContent = '0';
            document.getElementById('bot3-puan').textContent = '0';
            
            oyuncuYildizSayisi = 0;
            bot1YildizSayisi = 0;
            bot2YildizSayisi = 0;
            bot3YildizSayisi = 0;
            
            yildizlariGuncelle();
            
            // Ana menüyü göster
            document.getElementById('main-menu-screen').classList.remove('gizli');
        });
    }
}); 