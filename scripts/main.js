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
        const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
        if (!oyuncuKartlari) return;
        
        const oyuncuKartSayisi = oyuncuKartlari.children.length;
        const ayarlar = oyunAyarlariniUygula();
        
        // Tüm botlar için kart sayısını kontrol et
        for (let i = 1; i <= ayarlar.botSayisi; i++) {
            const botKartlari = document.querySelector(`#bot${i}-alani .bot-kartlar`);
            if (!botKartlari) continue;
            
            const botKartSayisi = botKartlari.children.length;
            
            // Bot'un kart sayısı oyuncununkinden azsa, ekle
            if (botKartSayisi < oyuncuKartSayisi) {
                const eklenecekKartSayisi = oyuncuKartSayisi - botKartSayisi;
                
                for (let j = 0; j < eklenecekKartSayisi; j++) {
                    const yeniKart = document.createElement('div');
                    yeniKart.className = 'element-kart arka-yuz bot-kart';
                    botKartlari.appendChild(yeniKart);
                }
            }
            // Bot'un kart sayısı oyuncununkinden fazlaysa, çıkar
            else if (botKartSayisi > oyuncuKartSayisi) {
                const cikarilacakKartSayisi = botKartSayisi - oyuncuKartSayisi;
                
                for (let j = 0; j < cikarilacakKartSayisi; j++) {
                    if (botKartlari.lastChild) {
                        botKartlari.removeChild(botKartlari.lastChild);
                    }
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

    // Örnek kart oluşturma (test için) fonksiyonunu güncelle
    function testKartlariOlustur() {
        // Oyun ayarlarını uygula
        const ayarlar = oyunAyarlariniUygula();
        
        // CSV'den elementleri yükle ve kartları oluştur
        elementVerileriniYukle().then(yuklenenElementler => {
            console.log("Elementler yüklendi, kartlar oluşturuluyor...");
            
            // Yüklenen elementleri kullan
            const elementler = yuklenenElementler.slice(0, yuklenenElementler.length);
            
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
     * @param {number} puan - Eklenecek puan miktarı
     * @returns {number} - Oyuncunun yeni puanı
     */
    function oyuncuPuanGuncelle(puan) {
        return puanGuncelle('oyuncu-puan', puan);
    }
    
    /**
     * Botun puanını günceller
     * @param {number} botNo - Botun numarası
     * @param {number} puan - Eklenecek puan miktarı
     * @returns {number} - Botun yeni puanı
     */
    function botPuanGuncelle(botNo, puan) {
        return puanGuncelle(`bot${botNo}-puan`, puan);
    }
    
    /**
     * Oyuncu kazandığında çağrılacak fonksiyon
     */
    function oyunuKazan() {
        // Oyun sonu ekranını göster
        document.getElementById('oyun-screen').classList.add('gizli');
        document.getElementById('oyun-sonu-screen').classList.remove('gizli');
        
        // Sonuç mesajını ayarla
        const oyuncuPuan = parseInt(document.getElementById('oyuncu-puan').textContent);
        const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
        const kartlarBitti = oyuncuKartlari.children.length === 0;
        
        // Kazanma sebebine göre mesaj
        let zaferMesaji = "";
        if (oyuncuPuan >= 100) {
            zaferMesaji = "Tebrikler! 100 puana ulaşarak oyunu kazandınız!";
        } else if (kartlarBitti) {
            zaferMesaji = "Tebrikler! Tüm kartlarınızı bitirerek oyunu kazandınız!";
        } else {
            zaferMesaji = "Tebrikler! Oyunu kazandınız!";
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
            
            // Güncellenmiş istatistikleri kaydet
            localStorage.setItem('periyodikOkey_istatistikler', JSON.stringify(istatistikler));
        } catch (error) {
            console.error("İstatistikler güncellenirken hata oluştu:", error);
        }
    }
    
    // Desteden kart çekme butonu
    document.getElementById('btn-desteyi-ac').addEventListener('click', () => {
        if (kartCekildi) {
            bildirimGoster("Her tur sadece bir kart çekebilirsiniz!", "error");
            return;
        }
        
        // Elementleri asenkron olarak yükle ve sonra kullan
        elementVerileriniYukle().then(yuklenenElementler => {
            console.log("Desteden kart çekiliyor...");
            
            // Oyuncu kartlarına yeni bir kart ekle
            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
            if (oyuncuKartlari) {
                // Rastgele bir element al
                const randomIndex = Math.floor(Math.random() * yuklenenElementler.length);
                const yeniKart = elementKartiOlusturDOM(yuklenenElementler[randomIndex], 1);
                oyuncuKartlari.appendChild(yeniKart);
                
                // Kart çekme durumunu güncelle
                kartCekildi = true;
                document.getElementById('durum-mesaji').textContent = 'Kart çektiniz. Şimdi bir kartı atın veya kombinasyon yapın.';
                
                // Kalan kart sayısını güncelle
                kalanKartSayisiniGuncelle();
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
                    // Rastgele bir element seç
                    const randomIndex = Math.floor(Math.random() * yuklenenElementler.length);
                    const yeniAcikKart = elementKartiOlusturDOM(yuklenenElementler[randomIndex], 1);
                    
                    // Kısa bir süre bekleyerek yeni açık kartı göster
                    setTimeout(() => {
                        acikKartAlani.appendChild(yeniAcikKart);
                        bildirimGoster(`Yeni açık kart yerleştirildi: ${yuklenenElementler[randomIndex].sembol}`, "info");
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
    
    // Kart verme (elden atma) butonu için güncellenmiş işleyici
    document.getElementById('btn-kart-ver').addEventListener('click', () => {
        console.log("Kart veriliyor...");
        // Seçili kart var mı kontrol et
        const seciliKart = document.querySelector('.element-kart.secili');
        if (seciliKart) {
            // Seçili kartı açık kart alanına taşı
            const acikKartAlani = document.querySelector('.acik-kart-alani');
            acikKartAlani.innerHTML = ''; // Önceki kartı temizle
            
            // Kartı küçült ve PO olarak göster (bot kartı gibi)
            const acikKart = document.createElement('div');
            acikKart.className = 'element-kart acik-kart po-kart';
            acikKart.dataset.atomNo = seciliKart.dataset.atomNo;
            acikKart.dataset.sembol = seciliKart.dataset.sembol;
            acikKart.dataset.grup = seciliKart.dataset.grup;
            acikKart.dataset.periyot = seciliKart.dataset.periyot;
            acikKart.dataset.takim = seciliKart.dataset.takim;
            acikKart.dataset.joker = seciliKart.dataset.joker;
            
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
    
    /**
     * Botun hamlesini yapmasını sağlar
     */
    function botHamlesiYap() {
        const durumMesaji = document.getElementById('durum-mesaji');
        durumMesaji.textContent = 'Bot oynuyor...';
        
        // Açık kartı al
        const acikKartAlani = document.querySelector('.acik-kart-alani');
        const acikKart = acikKartAlani.querySelector('.element-kart');
        if (!acikKart) {
            bildirimGoster("Açık kart bulunamadı!", "error");
            turBaslat();
            return;
        }
        
        // Element verilerini yükle
        elementVerileriniYukle().then(yuklenenElementler => {
            // Tüm botlar için hamle yap
            const botSayisi = 3; // Varsayılan bot sayısı
            let aktifBot = 1;
            
            // Açık kartı gizle
            acikKartAlani.innerHTML = ''; 
            
            function birSonrakiBotaGec() {
                if (aktifBot <= botSayisi) {
                    durumMesaji.textContent = `Bot ${aktifBot} oynuyor...`;
                    
                    // Bot kartları
                    const botKartlari = document.querySelector(`#bot${aktifBot}-alani .bot-kartlar`);
                    
                    // Bir önceki bottan veya oyuncudan gelen kartı bota ekle
                    if (aktifBot === 1) {
                        // İlk bot - oyuncunun verdiği kartı al
                        botKartSayisiGuncelle(0, 1);
                        
                        // Bot konuşsun
                        const ruhHali = Math.random() > 0.5 ? 'umutlu' : 'korkutucu';
                        botKonustur(aktifBot, ruhHali);
                        
                        // Kısa düşünme süresi
                        setTimeout(() => botHamlesiniYap(), 800);
                    } else {
                        // Diğer botlar - önceki botun kartını al
                        botKartSayisiGuncelle(aktifBot - 1, aktifBot);
                        
                        // Bot konuşsun
                        const ruhHali = ['umutlu', 'umutsuz', 'korkutucu'][Math.floor(Math.random() * 3)];
                        botKonustur(aktifBot, ruhHali);
                        
                        // Kısa düşünme süresi
                        setTimeout(() => botHamlesiniYap(), 800);
                    }
                    
                    // Bot hamlesini tamamlama işlevi
                    function botHamlesiniYap() {
                        // Zorluk seviyesine göre kombinasyon yapma şansını belirle
                        const kombinasyonSansi = Math.random();
                        const zorlukKombinasyonEsigi = 1 - zorlugaGoreKombinasyonSansi();
                        
                        // Rastgele bir şansla bot kombinasyon yapabilir (zorluk seviyesine göre)
                        if (kombinasyonSansi > zorlukKombinasyonEsigi) {
                            // Kombinasyon kartlarının sayısı (2-5 arası)
                            const kombinasyonKartSayisi = Math.floor(Math.random() * 3) + 2;
                            
                            // Kombinasyon türü (grup veya periyot)
                            const kombinasyonTuru = Math.random() > 0.5 ? "Grup" : "Periyot";
                            
                            // Puanlama (grup: her kart 5 puan, periyot: her kart 4 puan)
                            const kartBasinaPuan = kombinasyonTuru === "Grup" ? 5 : 4;
                            const kazanilanPuan = kombinasyonKartSayisi * kartBasinaPuan;
                            
                            // Bot konuşsun - kombinasyon yaptığında
                            botKonustur(aktifBot, 'umutlu');
                            
                            // Puan güncellemesi ve bildirim
                            const yeniPuan = botPuanGuncelle(aktifBot, kazanilanPuan);
                            bildirimGoster(`Bot ${aktifBot} ${kombinasyonTuru} kombinasyonu yaptı! +${kazanilanPuan} puan`, "warning");
                            
                            // Bot kartlarından kombinasyon miktarı kadar kart düş
                            const botKartlari = document.querySelector(`#bot${aktifBot}-alani .bot-kartlar`);
                            for (let i = 0; i < Math.min(kombinasyonKartSayisi, botKartlari.children.length); i++) {
                                if (botKartlari.children.length > 0) {
                                    botKartlari.removeChild(botKartlari.lastChild);
                                }
                            }
                            
                            // Kart sayılarını dengele
                            botKartSayisiniDengele();
                            
                            // 100 puana ulaştıysa kazandı
                            if (yeniPuan >= 100) {
                                botKonustur(aktifBot, 'kazanma');
                                setTimeout(() => {
                                    bildirimGoster(`Bot ${aktifBot} 100 puana ulaştı! Oyunu kazandı!`, "error");
                                    setTimeout(() => botKazandi(aktifBot), 1000);
                                }, 500);
                                return;
                            }
                            
                            // Kartları bittiyse kazandı
                            if (botKartlari.children.length === 0) {
                                botKonustur(aktifBot, 'kazanma');
                                setTimeout(() => {
                                    bildirimGoster(`Bot ${aktifBot} tüm kartlarını bitirdi! Oyunu kazandı!`, "error");
                                    setTimeout(() => botKazandi(aktifBot), 1000);
                                }, 500);
                                return;
                            }
                        }
                        
                        // Son bot ise ve oyuncuya kart verecekse
                        if (aktifBot === botSayisi) {
                            // Botun bir kartını azalt
                            botKartSayisiGuncelle(aktifBot, 0);
                            
                            // Rastgele bir element seç ve oyuncuya ver 
                            const randomIndex = Math.floor(Math.random() * yuklenenElementler.length);
                            const element = yuklenenElementler[randomIndex];
                            
                            // %15 olasılıkla joker kart olsun
                            const jokerMi = Math.random() < 0.15;
                            
                            // Normal görünümlü kart oluştur
                            const yeniKart = elementKartiOlusturDOM(element, 1, jokerMi);
                            
                            // Joker durumunu bildir
                            const kartTipi = jokerMi ? "Joker kartı" : element.sembol;
                            
                            // Oyuncuya kartı ekle
                            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
                            if (oyuncuKartlari) {
                                oyuncuKartlari.appendChild(yeniKart);
                                bildirimGoster(`Bot ${botSayisi}'den kart aldınız: ${kartTipi}`, "info");
                            }
                            
                            // Açık kart oluştur
                            const acikKart = document.createElement('div');
                            acikKart.className = 'element-kart acik-kart po-kart';
                            acikKartAlani.appendChild(acikKart);
                            
                            // Tur oyuncuya geçiyor
                            setTimeout(() => {
                                durumMesaji.textContent = 'Sizin sıranız. Kart çekin veya açık kartı alın.';
                                turBaslat();
                            }, 1000);
                        } else {
                            // Normal hamlesine devam et - kart ver
                            if (botKartlari && botKartlari.children.length > 0) {
                                // Botun bir kartını azalt
                                botKartSayisiGuncelle(aktifBot, 0);
                                
                                // Yeni açık kartı oluştur
                                const acikKart = document.createElement('div');
                                acikKart.className = 'element-kart acik-kart po-kart';
                                acikKartAlani.appendChild(acikKart);
                                
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
     * Bot kart sayılarını günceller
     * @param {number} veren - Veren botun numarası (0 = oyuncu)
     * @param {number} alan - Alan botun numarası (0 = oyuncu)
     */
    function botKartSayisiGuncelle(veren, alan) {
        // Veren oyuncu değilse, verenin kart sayısını azalt
        if (veren > 0) {
            const verenBotKartlari = document.querySelector(`#bot${veren}-alani .bot-kartlar`);
            if (verenBotKartlari && verenBotKartlari.children.length > 0) {
                verenBotKartlari.removeChild(verenBotKartlari.lastChild);
            }
        }
        
        // Alan oyuncu değilse, alanın kart sayısını artır
        if (alan > 0) {
            const alanBotKartlari = document.querySelector(`#bot${alan}-alani .bot-kartlar`);
            if (alanBotKartlari) {
                const yeniKart = document.createElement('div');
                yeniKart.className = 'element-kart arka-yuz bot-kart';
                alanBotKartlari.appendChild(yeniKart);
            }
        }
        
        // Kalan kart sayısını güncelle
        kalanKartSayisiniGuncelle();
    }
    
    /**
     * Bot kazandığında çağrılır
     * @param {number} botNo - Kazanan botun numarası 
     */
    function botKazandi(botNo) {
        // Oyun sonu ekranını göster
        document.getElementById('oyun-screen').classList.add('gizli');
        document.getElementById('oyun-sonu-screen').classList.remove('gizli');
        
        // Sonuç mesajını ayarla
        const botPuan = parseInt(document.getElementById(`bot${botNo}-puan`).textContent);
        const botKartlari = document.querySelector(`#bot${botNo}-alani .bot-kartlar`);
        const kartlarBitti = botKartlari.children.length === 0;
        
        // Kazanma sebebine göre mesaj
        let yenilgiMesaji = "";
        if (botPuan >= 100) {
            yenilgiMesaji = `Bot ${botNo} 100 puana ulaşarak oyunu kazandı!`;
        } else if (kartlarBitti) {
            yenilgiMesaji = `Bot ${botNo} tüm kartlarını bitirerek oyunu kazandı!`;
        } else {
            yenilgiMesaji = `Bot ${botNo} oyunu kazandı!`;
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
        const ustPanel = document.querySelector('.ust-panel');
        if (!ustPanel) return;
        
        // Oyuncu puanı göstergesi var mı kontrol et
        let oyuncuPuanGosterge = document.getElementById('sabit-oyuncu-puan');
        
        if (!oyuncuPuanGosterge) {
            // Yoksa oluştur
            oyuncuPuanGosterge = document.createElement('div');
            oyuncuPuanGosterge.id = 'sabit-oyuncu-puan';
            oyuncuPuanGosterge.className = 'sabit-puan';
            
            // Puanı al ve gösterge metni oluştur
            const oyuncuPuan = document.getElementById('oyuncu-puan').textContent;
            oyuncuPuanGosterge.innerHTML = `<span>Puanınız: </span><span class="sabit-puan-deger">${oyuncuPuan}</span>`;
            
            // Üst panele ekle
            ustPanel.appendChild(oyuncuPuanGosterge);
        }
    }
    
    console.log("Periyodik Okey oyunu hazır!");
}); 