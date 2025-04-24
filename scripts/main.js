/**
 * Periyodik Okey - Ana JavaScript Dosyası
 * Oyun başlangıcı ve genel kontroller
 */

// Sayfa tam olarak yüklendiğinde başla
document.addEventListener('DOMContentLoaded', () => {
    console.log("Periyodik Okey oyunu başlatılıyor...");
    
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
    
    // Global değişkenler
    let oyunDevamEdiyor = false;
    let turSayisi = 1;
    
    // Oyun sonu ekranındaki butonlara olay dinleyicileri ekle
    const btnYeniOyun = document.getElementById('btn-yeni-oyun');
    if (btnYeniOyun) {
        btnYeniOyun.addEventListener('click', () => {
            // Oyun sonu ekranını gizle, oyun ekranını göster
            document.getElementById('oyun-sonu-screen').classList.add('gizli');
            document.getElementById('oyun-screen').classList.remove('gizli');
            
            // Yeni oyun başlat (puanları sıfırla ve kartları oluştur)
            yeniOyunBaslat();
        });
    }
    
    const btnAnaMenu = document.getElementById('btn-ana-menu');
    if (btnAnaMenu) {
        btnAnaMenu.addEventListener('click', () => {
            console.log("Ana menüye dönülüyor...");
            
            // Oyun sonu ekranını gizle
            document.getElementById('oyun-sonu-ekrani').style.display = 'none';
            
            // Oyun ekranını gizle
            document.getElementById('oyun-ekrani').style.display = 'none';
            
            // Ana menüyü göster
            document.getElementById('ana-menu').style.display = 'flex';
            
            // Opsiyonel: Müziği durdur (eğer oyun müziği varsa)
            const muzikElementi = document.getElementById('muzik');
            if (muzikElementi) {
                muzikElementi.pause();
            }
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
                    for (let i = 0; i < 14; i++) {
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
        
        // Animasyon mesajı göster
        const oyunEkrani = document.getElementById('oyun-screen');
        oyunEkrani.classList.add('tur-baslangic-animasyon');
        
        // Animasyon mesajı
        const animasyonMesaji = document.createElement('div');
        animasyonMesaji.className = 'tur-baslangic-mesaji';
        animasyonMesaji.textContent = 'KARTLAR DAĞITILIYOR';
        document.body.appendChild(animasyonMesaji);
        
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
        
        // Animasyon süresi (10 saniye) sonunda kartları dağıt
        setTimeout(() => {
            // Animasyonu kaldır
            oyunEkrani.classList.remove('tur-baslangic-animasyon');
            animasyonMesaji.remove();
            
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
                
                // Rastgele 14 element seç ve kart oluştur
            const rastgeleElementIndeksler = [];
                while (rastgeleElementIndeksler.length < 14) {
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
            
            // Oyuncuya 15. kartı da ekle
            if (elementler.length > 14) {
                // Kullanılmayan rastgele bir element seç
                let ekKartIndeks;
                do {
                    ekKartIndeks = Math.floor(Math.random() * elementler.length);
                } while (rastgeleElementIndeksler.includes(ekKartIndeks));
                
                const ekKart = elementKartiOlusturDOM(elementler[ekKartIndeks], 1, Math.random() < jokerOlasiligi);
                oyuncuKartlariDiv.appendChild(ekKart);
            }
            
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
        }, 10000);
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
                // Grup kombinasyonu: Her kart 5 puan + joker bonus
                const jokerSayisi = kartBilgileri.filter(k => k.joker).length;
                puanArtisi += kartBilgileri.length * 5;
                
                if (jokerSayisi > 0) {
                    puanArtisi += jokerSayisi * 5; // Her joker için 5 puan bonus
                }
                
                bildirimGoster(`Grup kombinasyonu yapıldı! +${puanArtisi} puan kazandınız!`, "success");
            } else if (periyotKombinasyonu) {
                // Periyot kombinasyonu: Her kart 4 puan + joker bonus
                const jokerSayisi = kartBilgileri.filter(k => k.joker).length;
                puanArtisi += kartBilgileri.length * 4;
                
                if (jokerSayisi > 0) {
                    puanArtisi += jokerSayisi * 5; // Her joker için 5 puan bonus
                }
                
                bildirimGoster(`Periyot kombinasyonu yapıldı! +${puanArtisi} puan kazandınız!`, "success");
            }
            
            // Puanı güncelle
            oyuncuPuanGuncelle(puanArtisi);
            
            // Kullanılan kartları işaretle ve bir sonraki turda bu kartların çıkmamasını sağla
            kartlariOynanmisOlarakIsaretle(kombinasyonKartlari);
            
            // Kombinasyon kartlarını temizle
            kombinasyonAlani.innerHTML = '';
            
            // Tüm kartlar bittiyse
            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
            if (oyuncuKartlari.children.length === 0) {
                // Tüm kartları bitirme sonucu
                buyukBildirimGoster("Tebrikler! Tüm kartlarınızı bitirdiniz ve bir yıldız kazandınız!", "success");
                setTimeout(() => yildizKazandir('oyuncu'), 2000);
                return;
            }
            
            // Bot hamlesine geç
            setTimeout(() => {
                botHamlesiYap();
            }, 1000);
        } else {
            bildirimGoster("Geçerli bir kombinasyon bulunamadı! Lütfen tekrar deneyin.", "error");
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
            buyukBildirimGoster("Tebrikler! 100 puana ulaştınız ve bir yıldız kazandınız!", "success");
            
            // Puanı sıfırla
            setTimeout(() => {
                oyuncuPuanElementi.textContent = "0";
                if (sabitPuanDeger) sabitPuanDeger.textContent = "0";
                
                // Yıldız kazandır
                yildizKazandir('oyuncu');
            }, 2000);
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
            buyukBildirimGoster(`Bot ${botNo} 100 puana ulaştı ve bir yıldız kazandı!`, "warning");
            
            // Puanı sıfırla
            setTimeout(() => {
                botPuanElementi.textContent = "0";
                
                // Yıldız kazandır
                yildizKazandir(`bot${botNo}`);
            }, 2000);
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
            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
        const kartlarBitti = oyuncuKartlari.children.length === 0;
        
        // Kazanma sebebine göre mesaj
        let zaferMesaji = "";
        if (oyuncuYildizSayisi >= 5) {
            zaferMesaji = "Tebrikler! 5 yıldız toplayarak oyunu kazandınız!";
        } else if (kartlarBitti) {
            zaferMesaji = "Tebrikler! Tüm kartlarınızı bitirerek bir yıldız kazandınız!";
            
            // Kartlar bittiğinde bir yıldız kazandır (eğer oyun bitmediyse)
            if (oyuncuYildizSayisi < 5) {
                oyuncuYildizSayisi++;
                yildizlariGuncelle();
            }
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
                
                // Yeni açık kartı yerleştir (rastgele bir element seç)
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
                    const jokerMi = Math.random() < 0.15; // %15 joker şansı
                    const yeniAcikKart = elementKartiOlusturDOM(elementler[randomIndex], 1, jokerMi);
                    
                    // Kısa bir süre bekleyerek yeni açık kartı göster
                    setTimeout(() => {
                        // Önce açık kart alanını temizle
                        acikKartAlani.innerHTML = '';
                        
                        // Yeni kartı ekle
                        acikKartAlani.appendChild(yeniAcikKart);
                        
                        // Kart tipini belirle
                        const kartTipi = jokerMi ? "Joker" : elementler[randomIndex].sembol;
                        bildirimGoster(`Yeni açık kart yerleştirildi: ${kartTipi}`, "info");
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
            const botSayisi = parseInt(document.getElementById('bot-sayisi')?.value) || 3; // Ayarlardan bot sayısı
            let aktifBot = 1;
            
            // Açık kartı gizle - önce temizle
            acikKartAlani.innerHTML = ''; 
            
            function birSonrakiBotaGec() {
                if (aktifBot <= botSayisi) {
                    durumMesaji.textContent = `Bot ${aktifBot} oynuyor...`;
                    
                    // Bot kartları
                    const botKartlari = document.querySelector(`#bot${aktifBot}-alani .bot-kartlar`);
                    
                    // Bot desteden kart çekme (50% olasılıkla)
                    const kartCekecekMi = Math.random() < 0.5;
                    
                    if (kartCekecekMi && botKartlari && botKartlari.children.length < 7) {
                        // Desteden kart çek
                        // Rastgele bir element seç
                        const randomIndex = Math.floor(Math.random() * yuklenenElementler.length);
                        
                        // Bot için yeni kart ekle (görsel olarak kapalı kart şeklinde)
                        botKartEkle(aktifBot);
                        bildirimGoster(`Bot ${aktifBot} desteden kart çekti.`, "info");
                        
                        // Bot konuşsun - kart çektiğinde
                        const ruhHali = Math.random() > 0.5 ? 'umutlu' : 'umutsuz';
                        botKonustur(aktifBot, ruhHali);
                        
                        // Kısa düşünme süresi
                        setTimeout(() => botHamlesiniYap(), 1000);
                    } else {
                        // Normal akış - önceki kartı alma veya hamle yapma
                        // Bir önceki bottan veya oyuncudan gelen kartı bota ekle
                        if (aktifBot === 1) {
                            // İlk bot - oyuncunun verdiği kartı al
                            botKartEkle(aktifBot);
                            
                            // Bot konuşsun
                            const ruhHali = Math.random() > 0.5 ? 'umutlu' : 'korkutucu';
                            botKonustur(aktifBot, ruhHali);
                            
                            // Kısa düşünme süresi
                            setTimeout(() => botHamlesiniYap(), 800);
                        } else {
                            // Diğer botlar - önceki botun kartını al
                            botKartEkle(aktifBot);
                            
                            // Bot konuşsun
                            const ruhHali = ['umutlu', 'umutsuz', 'korkutucu'][Math.floor(Math.random() * 3)];
                            botKonustur(aktifBot, ruhHali);
                            
                            // Kısa düşünme süresi
                            setTimeout(() => botHamlesiniYap(), 800);
                        }
                    }
                    
                    // Bot hamlesini tamamlama işlevi
                    function botHamlesiniYap() {
                        // Zorluk seviyesine göre kombinasyon yapma şansını belirle
                        const kombinasyonSansi = Math.random();
                        const zorlukKombinasyonEsigi = 1 - zorlugaGoreKombinasyonSansi();
                        
                        // Rastgele bir şansla bot kombinasyon yapabilir (zorluk seviyesine göre)
                        if (kombinasyonSansi > zorlukKombinasyonEsigi) {
                            // Kombinasyon kartlarının sayısı (3-5 arası)
                            const kombinasyonKartSayisi = Math.min(Math.floor(Math.random() * 3) + 3, botKartlari.children.length);
                            
                            // Eğer bot kartı yoksa veya yeterli kart yoksa, kombinasyon yapamaz
                            if (botKartlari.children.length < 3 || kombinasyonKartSayisi < 3) {
                                // Sonraki bota geç
                                aktifBot++;
                                setTimeout(birSonrakiBotaGec, 300);
                                return;
                            }
                            
                            // Kombinasyon türü (grup veya periyot)
                            const kombinasyonTuru = Math.random() > 0.5 ? "Grup" : "Periyot";
                            
                            // Puanlama (grup: her kart 5 puan, periyot: her kart 4 puan)
                            const kartBasinaPuan = kombinasyonTuru === "Grup" ? 5 : 4;
                            let kazanilanPuan = kombinasyonKartSayisi * kartBasinaPuan;
                            
                            // Minimum puan kontrolü - grup kombinasyonu için minimum 15 puan
                            if (kombinasyonTuru === "Grup" && kazanilanPuan < 15) {
                                kazanilanPuan = 15; // En az 3 kartlık grup = 15 puan
                            } else if (kombinasyonTuru === "Periyot" && kazanilanPuan < 16) {
                                kazanilanPuan = 16; // En az 4 kartlık periyot = 16 puan
                            }
                            
                            // Bot konuşsun - kombinasyon yaptığında
                            botKonustur(aktifBot, 'umutlu');
                            
                            // Puan güncellemesi ve bildirim
                            const yeniPuan = botPuanGuncelle(aktifBot, kazanilanPuan);
                            bildirimGoster(`Bot ${aktifBot} ${kombinasyonTuru} kombinasyonu yaptı! +${kazanilanPuan} puan`, "warning");
                            
                            // Bot kartlarından kombinasyon miktarı kadar kart düş
                            for (let i = 0; i < Math.min(kombinasyonKartSayisi, botKartlari.children.length); i++) {
                                if (botKartlari.lastChild) {
                                    botKartlari.removeChild(botKartlari.lastChild);
                                }
                            }
                            
                            // Kart sayılarını dengele
                            botKartSayisiniDengele();
                            
                            // 100 puana ulaştıysa oyun biter
                            if (yeniPuan >= 100) {
                                botKonustur(aktifBot, 'kazanma');
            setTimeout(() => {
                                    bildirimGoster(`Bot ${aktifBot} 100 puana ulaştı! Bir yıldız kazandı!`, "warning");
                                    // Yıldız kazandır ve yeni tur başlat
                                    setTimeout(() => {
                                        yildizKazandir(`bot${aktifBot}`);
                                    }, 1000);
            }, 500);
                                return;
                            }
                        }
                        
                        // Son bot ise ve oyuncuya kart verecekse
                        if (aktifBot === botSayisi) {
                            // Botun kartını azalt
                            botKartCikar(aktifBot);
                            
                            // Rastgele bir element seç
                            const randomIndex = Math.floor(Math.random() * yuklenenElementler.length);
                            const element = yuklenenElementler[randomIndex];
                            
                            // %15 olasılıkla joker kart olsun
                            const jokerMi = Math.random() < 0.15;
                            
                            // Oyuncuya verilecek kart
                            const yeniKart = elementKartiOlusturDOM(element, 1, jokerMi);
                            
                            // Joker durumunu bildir
                            const kartTipi = jokerMi ? "Joker kartı" : element.sembol;
                            
                            // Oyuncuya kartı ekle
                            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
                            if (oyuncuKartlari) {
                                oyuncuKartlari.appendChild(yeniKart);
                                bildirimGoster(`Bot ${botSayisi}'den kart aldınız: ${kartTipi}`, "info");
                            }
                            
                            // Açık kart alanına yeni kart yerleştir - Rastgele bir element
                            const acikKartIndex = Math.floor(Math.random() * yuklenenElementler.length);
                            const acikKartElement = yuklenenElementler[acikKartIndex];
                            const acikKartJokerMi = Math.random() < 0.15;
                            
                            // Önce açık kart alanını temizle
                            acikKartAlani.innerHTML = '';
                            
                            // Gerçek bir kart oluştur (PO yerine)
                            const acikKart = elementKartiOlusturDOM(acikKartElement, 1, acikKartJokerMi);
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
                                botKartCikar(aktifBot);
                                
                                // Rastgele bir element seç
                                const randomIndex = Math.floor(Math.random() * yuklenenElementler.length);
                                const element = yuklenenElementler[randomIndex];
                                
                                // %15 olasılıkla joker kart olsun
                                const jokerMi = Math.random() < 0.15;
                                
                                // Açık kart alanını temizle
                                acikKartAlani.innerHTML = '';
                                
                                // Gerçek bir kart oluştur (PO yerine)
                                const acikKart = elementKartiOlusturDOM(element, 1, jokerMi);
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
        const botKartlari = document.querySelector(`#bot${botNo}-alani .bot-kartlar`);
        const kartlarBitti = botKartlari.children.length === 0;
        
        // Bot'un yıldız sayısını kontrol et
        let botYildizSayisi = 0;
        if (botNo === 1) botYildizSayisi = bot1YildizSayisi;
        else if (botNo === 2) botYildizSayisi = bot2YildizSayisi;
        else if (botNo === 3) botYildizSayisi = bot3YildizSayisi;
        
        // Kazanma sebebine göre mesaj
        let yenilgiMesaji = "";
        if (botYildizSayisi >= 5) {
            yenilgiMesaji = `Bot ${botNo} 5 yıldız toplayarak oyunu kazandı!`;
        } else if (kartlarBitti) {
            yenilgiMesaji = `Bot ${botNo} tüm kartlarını bitirdi ve bir yıldız kazandı!`;
            
            // Kartlar bittiğinde bir yıldız kazandır (bot için)
            if (botYildizSayisi < 5) {
                if (botNo === 1) bot1YildizSayisi++;
                else if (botNo === 2) bot2YildizSayisi++;
                else if (botNo === 3) bot3YildizSayisi++;
                yildizlariGuncelle();
            }
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
    let bot2YildizSayisi = 0; // Bot 2'nin yıldız sayısı
    let bot3YildizSayisi = 0; // Bot 3'in yıldız sayısı
    let oynanmisKartlar = []; // Oynanmış ve tekrar kullanılmayacak kartlar

    /**
     * Yıldız sistemini günceller
     * Eğer oyuncu veya bir bot 100 puana ulaşırsa veya tüm kartlarını bitirirse bir yıldız kazanır
     * 5 yıldıza ulaşan oyuncu veya bot oyunu kazanır
     */
    function yildizlariGuncelle() {
        // Oyuncu yıldızlarını gösterge olarak güncelle
        document.querySelectorAll('.oyuncu-yildizlar').forEach(yildizDiv => {
            yildizDiv.innerHTML = '';
            for (let i = 0; i < oyuncuYildizSayisi; i++) {
                const yildiz = document.createElement('span');
                yildiz.className = 'yildiz';
                yildiz.innerHTML = '⭐';
                yildizDiv.appendChild(yildiz);
            }
        });
        
        // Bot 1 yıldızlarını gösterge olarak güncelle
        document.querySelectorAll('.bot1-yildizlar').forEach(yildizDiv => {
            yildizDiv.innerHTML = '';
            for (let i = 0; i < bot1YildizSayisi; i++) {
                const yildiz = document.createElement('span');
                yildiz.className = 'yildiz';
                yildiz.innerHTML = '⭐';
                yildizDiv.appendChild(yildiz);
            }
        });
        
        // Bot 2 yıldızlarını gösterge olarak güncelle
        document.querySelectorAll('.bot2-yildizlar').forEach(yildizDiv => {
            yildizDiv.innerHTML = '';
            for (let i = 0; i < bot2YildizSayisi; i++) {
                const yildiz = document.createElement('span');
                yildiz.className = 'yildiz';
                yildiz.innerHTML = '⭐';
                yildizDiv.appendChild(yildiz);
            }
        });
        
        // Bot 3 yıldızlarını gösterge olarak güncelle
        document.querySelectorAll('.bot3-yildizlar').forEach(yildizDiv => {
            yildizDiv.innerHTML = '';
            for (let i = 0; i < bot3YildizSayisi; i++) {
                const yildiz = document.createElement('span');
                yildiz.className = 'yildiz';
                yildiz.innerHTML = '⭐';
                yildizDiv.appendChild(yildiz);
            }
        });
        
        // Oyuncunun durumunu ekranın üstünde göster
        const durumMesaji = document.getElementById('durum-mesaji');
        if (durumMesaji) {
            if (oyuncuYildizSayisi > 0) {
                durumMesaji.innerHTML = `Şu anki skorunuz: <span class="yildiz-sayisi">${oyuncuYildizSayisi} yıldız</span>`;
            }
        }
    }

    /**
     * Yıldız kazandırır ve kontrol eder
     * @param {string} oyuncu - Yıldız kazanan oyuncu ('oyuncu', 'bot1', 'bot2', 'bot3')
     */
    function yildizKazandir(oyuncu) {
        // Yıldız sayısını artır
        if (oyuncu === 'oyuncu') {
            oyuncuYildizSayisi++;
            // Büyük bir bildirimle yıldız kazanıldığını göster
            buyukBildirimGoster(`Bir yıldız kazandınız! Toplam yıldız: ${oyuncuYildizSayisi}`, "success");
            
            // 5 yıldıza ulaşılırsa oyun tamamen kazanılır
            if (oyuncuYildizSayisi >= 5) {
                setTimeout(() => oyunuTamamenKazan(), 3000);
                return true;
            }
        } else if (oyuncu === 'bot1') {
            bot1YildizSayisi++;
            // Büyük bir bildirimle bot1'in yıldız kazandığını göster
            buyukBildirimGoster(`Bot 1 bir yıldız kazandı! Toplam yıldız: ${bot1YildizSayisi}`, "warning");
            
            if (bot1YildizSayisi >= 5) {
                setTimeout(() => botTamamenKazandi(1), 3000);
                return true;
            }
        } else if (oyuncu === 'bot2') {
            bot2YildizSayisi++;
            // Büyük bir bildirimle bot2'nin yıldız kazandığını göster
            buyukBildirimGoster(`Bot 2 bir yıldız kazandı! Toplam yıldız: ${bot2YildizSayisi}`, "warning");
            
            if (bot2YildizSayisi >= 5) {
                setTimeout(() => botTamamenKazandi(2), 3000);
                return true;
            }
        } else if (oyuncu === 'bot3') {
            bot3YildizSayisi++;
            // Büyük bir bildirimle bot3'ün yıldız kazandığını göster
            buyukBildirimGoster(`Bot 3 bir yıldız kazandı! Toplam yıldız: ${bot3YildizSayisi}`, "warning");
            
            if (bot3YildizSayisi >= 5) {
                setTimeout(() => botTamamenKazandi(3), 3000);
                return true;
            }
        }
        
        // Yıldızları güncelle
        yildizlariGuncelle();
        
        // Yeni tur başlat
        setTimeout(() => yeniTurBaslat(), 3000);
        return false;
    }

    /**
     * Büyük bildirim gösterir (ekranın ortasında)
     * @param {string} mesaj - Gösterilecek mesaj
     * @param {string} tur - Bildirim türü ('success', 'error', 'warning', 'info')
     */
    function buyukBildirimGoster(mesaj, tur = "info") {
        // Var olan büyük bildirimleri temizle
        const mevcut = document.querySelectorAll('.buyuk-bildirim');
        mevcut.forEach(b => b.remove());
        
        // Bildirim div'ini oluştur
        const bildirimDiv = document.createElement('div');
        bildirimDiv.className = `buyuk-bildirim buyuk-bildirim-${tur}`;
        bildirimDiv.textContent = mesaj;
        
        // Sayfaya ekle
        document.body.appendChild(bildirimDiv);
        
        // 5 saniye sonra kaldır
        setTimeout(() => {
            if (bildirimDiv.parentNode) {
                bildirimDiv.classList.add('kaybol');
                setTimeout(() => bildirimDiv.remove(), 1000);
            }
        }, 5000);
    }

    /**
     * Oyuncu 5 yıldıza ulaşarak tamamen oyunu kazandığında çağrılan fonksiyon
     */
    function oyunuTamamenKazan() {
        // Büyük bildirim göster
        buyukBildirimGoster("TEBRİKLER! 5 YILDIZ TOPLAYARAK OYUNU TAMAMEN KAZANDINIZ!", "success");
        
        // Oyun sonu ekranını göster
        setTimeout(() => {
            document.getElementById('oyun-screen').classList.add('gizli');
            document.getElementById('oyun-sonu-screen').classList.remove('gizli');
            
            // Sonuç mesajını ayarla
            document.getElementById('sonuc-mesaji').textContent = "Tebrikler! 5 yıldız toplayarak oyunu tamamen kazandınız!";
            
            // Puanı aktar
            const oyuncuPuan = parseInt(document.getElementById('oyuncu-puan').textContent);
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
        }, 2000);
    }

    /**
     * Bot 5 yıldıza ulaşarak tamamen oyunu kazandığında çağrılan fonksiyon
     * @param {number} botNo - Kazanan botun numarası
     */
    function botTamamenKazandi(botNo) {
        // Büyük bildirim göster
        buyukBildirimGoster(`BOT ${botNo} 5 YILDIZ TOPLAYARAK OYUNU TAMAMEN KAZANDI!`, "error");
        
        // Oyun sonu ekranını göster
        setTimeout(() => {
            document.getElementById('oyun-screen').classList.add('gizli');
            document.getElementById('oyun-sonu-screen').classList.remove('gizli');
            
            // Sonuç mesajını ayarla
            document.getElementById('sonuc-mesaji').textContent = `Bot ${botNo} 5 yıldız toplayarak oyunu tamamen kazandı!`;
            
            // Puanı aktar
            const oyuncuPuan = parseInt(document.getElementById('oyuncu-puan').textContent);
            document.getElementById('sonuc-puan').textContent = oyuncuPuan;
            
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
        }, 2000);
    }

    /**
     * Yeni bir tur başlatır (100 puan sonrası)
     * Puanları sıfırlar ama yıldızları korur ve kartları yeniden oluşturur
     */
    function yeniTurBaslat() {
        console.log("Yeni tur başlatılıyor...");
        
        // Puanları sıfırla
        document.getElementById('oyuncu-puan').textContent = '0';
        document.getElementById('bot1-puan').textContent = '0';
        document.getElementById('bot2-puan').textContent = '0';
        document.getElementById('bot3-puan').textContent = '0';
        
        // Tur sayısını artır
        turSayisi++;
        
        // Kart oluşturmayı doğrudan başlat (animasyon olmadan)
        elementVerileriniYukleVeKartlariOlustur();
    }

    /**
     * Element verilerini yükleyip kart oluşturma (animasyon olmadan)
     */
    function elementVerileriniYukleVeKartlariOlustur() {
        // Tüm mevcut kartları temizle
        const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
        if (oyuncuKartlari) oyuncuKartlari.innerHTML = '';
        
        document.querySelectorAll('.bot-kartlar').forEach(botKartlar => {
            botKartlar.innerHTML = '';
        });
        
        const acikKartAlani = document.querySelector('.acik-kart-alani');
        if (acikKartAlani) acikKartAlani.innerHTML = '';
        
        // Deste alanı
        const desteAlani = document.querySelector('.deste-alani');
        if (desteAlani) desteAlani.innerHTML = '';
        const arkaYuzKart = document.createElement('div');
        arkaYuzKart.className = 'element-kart arka-yuz';
        desteAlani.appendChild(arkaYuzKart);
        
        // Element verilerini yükle
        elementVerileriniYukle().then(yuklenenElementler => {
            // Kullanılmış kartları dikkate alarak kullanılabilir elementleri belirle
            const kullanilabilirElementler = yuklenenElementler.filter(element => 
                !oynanmisKartlar.some(kullanilmisKart => 
                    kullanilmisKart.atom_no == element.atom_no
                )
            );
            
            // Yeterli kart kalmadıysa, kullanılmış kartları temizle
            if (kullanilabilirElementler.length < 25) {
                buyukBildirimGoster("Tüm elementler kullanıldı! Kartlar yeniden dağıtılıyor.", "info");
                oynanmisKartlar = []; // Kullanılmış kartları temizle
            }
            
            // Elementleri karıştır
            const elementler = [...yuklenenElementler].sort(() => Math.random() - 0.5);
            
            // Oyuncuya 15 kart ekle
            for (let i = 0; i < 15; i++) {
                const kart = elementKartiOlusturDOM(elementler[i], 1, Math.random() < 0.15);
                oyuncuKartlari.appendChild(kart);
            }
            
            // Bot 1'e 14 kart ekle
            const bot1Kartlar = document.querySelector('#bot1-alani .bot-kartlar');
            for (let i = 0; i < 14; i++) {
                const botKart = document.createElement('div');
                botKart.className = 'bot-kart arka-yuz';
                bot1Kartlar.appendChild(botKart);
            }
            
            // Bot 2'ye 14 kart ekle
            const bot2Kartlar = document.querySelector('#bot2-alani .bot-kartlar');
            for (let i = 0; i < 14; i++) {
                const botKart = document.createElement('div');
                botKart.className = 'bot-kart arka-yuz';
                bot2Kartlar.appendChild(botKart);
            }
            
            // Bot 3'e 14 kart ekle
            const bot3Kartlar = document.querySelector('#bot3-alani .bot-kartlar');
            for (let i = 0; i < 14; i++) {
                const botKart = document.createElement('div');
                botKart.className = 'bot-kart arka-yuz';
                bot3Kartlar.appendChild(botKart);
            }
            
            // Açık kart oluştur
            const rastgeleIndeks = Math.floor(Math.random() * elementler.length);
            const acikKart = elementKartiOlusturDOM(elementler[rastgeleIndeks], 1);
            acikKartAlani.appendChild(acikKart);
            
            // Botlara ek kartlar dağıt
            const botSayisi = parseInt(document.getElementById('bot-sayisi')?.value) || 3;
            botKartlariniOlustur(botSayisi);
            
            // Sürükleme hedeflerini ayarla
            surukleHedefleriniAyarla();
            
            // Oyun durumunu güncelle
            document.getElementById('durum-mesaji').textContent = 'Sizin sıranız. Desteden bir kart çekin veya açık kartı alın.';
            
            // Kartı çekme durumunu sıfırla
            kartCekildi = false;
            
            // Yıldız göstergelerini güncelle
            yildizlariGuncelle();
        }).catch(error => {
            console.error("Elementler yüklenirken hata:", error);
            buyukBildirimGoster("Element verileri yüklenirken hata oluştu!", "error");
        });
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
     * Tamamen yeni bir oyun başlatır
     * Tüm puanları sıfırlar ve kartları yeniden oluşturur
     */
    function yeniOyunBaslat() {
        console.log("Yeni oyun başlatılıyor...");
        
        // Puanları sıfırla
        document.getElementById('oyuncu-puan').textContent = '0';
        document.getElementById('bot1-puan').textContent = '0';
        document.getElementById('bot2-puan').textContent = '0';
        document.getElementById('bot3-puan').textContent = '0';
        
        // Sabit puanı temizle (eğer varsa)
        const sabitPuan = document.getElementById('sabit-oyuncu-puan');
        if (sabitPuan) {
            sabitPuan.parentNode.removeChild(sabitPuan);
        }
        
        // Yıldızları sıfırla
        oyuncuYildizSayisi = 0;
        bot1YildizSayisi = 0;
        bot2YildizSayisi = 0;
        bot3YildizSayisi = 0;
        
        // Yıldız göstergelerini güncelle
        yildizlariGuncelle();
        
        // Tur sayısını sıfırla
        turSayisi = 1;
        
        // Oyun devam ediyor durumunu ayarla
        oyunDevamEdiyor = true;
        
        // Kartları oluştur
        testKartlariOlustur();
        
        // Başlangıç mesajı göster
        turBaslangicAnimasyonuGoster("1. TUR BAŞLIYOR!");
    }

    /**
     * Kartların periyot ya da grup sıralamasına göre dizilip dizilemediğini ve
     * sadece bir kart kalıp kalmadığını kontrol eder
     * @param {Array} kartlar - Kontrol edilecek kartlar
     * @returns {boolean} - Kazanma durumu (true: kazandı, false: kazanamadı)
     */
    function kazanmaKontrol(kartlar) {
        // En az bir kart olmalı
        if (!kartlar || kartlar.length <= 1) {
            return false;
        }
        
        // Kartları kopyala
        const kopyaKartlar = [...kartlar];
        
        // Periyot sıralamasına göre kontrol
        const periyotSirali = periyotSiralamaKontrol(kopyaKartlar);
        
        // Grup sıralamasına göre kontrol
        const grupSirali = grupSiralamaKontrol(kopyaKartlar);
        
        // Eğer periyot veya grup sıralamasına göre uygunsa ve sadece 1 kart kalıyorsa kazanır
        return (periyotSirali || grupSirali) && kopyaKartlar.length === 1;
    }

    /**
     * Kartların periyot sıralamasına göre uygun olup olmadığını kontrol eder
     * @param {Array} kartlar - Kontrol edilecek kartlar
     * @returns {boolean} - Periyot sıralaması uygun mu
     */
    function periyotSiralamaKontrol(kartlar) {
        // Joker kartları ayır
        const jokerler = kartlar.filter(kart => kart.dataset.joker === 'true');
        const normalKartlar = kartlar.filter(kart => kart.dataset.joker !== 'true');
        
        // Kartları grup ve periyota göre ayır
        const gruplar = {};
        
        normalKartlar.forEach(kart => {
            const grup = kart.dataset.grup;
            if (!gruplar[grup]) {
                gruplar[grup] = [];
            }
            gruplar[grup].push(kart);
        });
        
        // Her bir grup için periyot sıralaması kontrol et
        let gecerliKartlar = [];
        
        for (const grup in gruplar) {
            if (gruplar[grup].length < 3) {
                continue; // En az 3 kart olmalı
            }
            
            // Periyota göre sırala
            gruplar[grup].sort((a, b) => parseInt(a.dataset.periyot) - parseInt(b.dataset.periyot));
            
            // Ardışık periyotları kontrol et
            let ardisikKartlar = [gruplar[grup][0]];
            let oncekiPeriyot = parseInt(gruplar[grup][0].dataset.periyot);
            
            for (let i = 1; i < gruplar[grup].length; i++) {
                const simdikiPeriyot = parseInt(gruplar[grup][i].dataset.periyot);
                
                if (simdikiPeriyot === oncekiPeriyot + 1) {
                    // Ardışık
                    ardisikKartlar.push(gruplar[grup][i]);
                } else {
                    // Ardışık değil, ama joker varsa kullanılabilir
                    if (jokerler.length > 0) {
                        // Ardışık olmayan periyot arasında kaç joker gerekiyor?
                        const gerekliJokerSayisi = simdikiPeriyot - oncekiPeriyot - 1;
                        
                        if (gerekliJokerSayisi <= jokerler.length) {
                            // Yeterli joker var
                            for (let j = 0; j < gerekliJokerSayisi; j++) {
                                ardisikKartlar.push(jokerler.shift());
                            }
                            ardisikKartlar.push(gruplar[grup][i]);
                        } else {
                            // Yeterli joker yok, yeni bir ardışık dizilim başlat
                            if (ardisikKartlar.length >= 3) {
                                // Önceki ardışık dizilim geçerli
                                gecerliKartlar = [...gecerliKartlar, ...ardisikKartlar];
                            }
                            ardisikKartlar = [gruplar[grup][i]];
                        }
                    } else {
                        // Joker yok, yeni bir ardışık dizilim başlat
                        if (ardisikKartlar.length >= 3) {
                            // Önceki ardışık dizilim geçerli
                            gecerliKartlar = [...gecerliKartlar, ...ardisikKartlar];
                        }
                        ardisikKartlar = [gruplar[grup][i]];
                    }
                }
                
                oncekiPeriyot = simdikiPeriyot;
            }
            
            // Son ardışık dizilimi kontrol et
            if (ardisikKartlar.length >= 3) {
                gecerliKartlar = [...gecerliKartlar, ...ardisikKartlar];
            }
        }
        
        // Kalan jokerler (en az 3 tane) de geçerli bir el oluşturabilir
        if (jokerler.length >= 3) {
            gecerliKartlar = [...gecerliKartlar, ...jokerler];
            jokerler.length = 0;
        }
        
        // Geriye kalan kartları çıkar ve sadece 1 kart kaldı mı kontrol et
        const kullanilanKartIdler = gecerliKartlar.map(kart => kart.dataset.atomNo + '-' + kart.dataset.takim);
        const kalacakKartlar = kartlar.filter(kart => {
            const kartId = kart.dataset.atomNo + '-' + kart.dataset.takim;
            return !kullanilanKartIdler.includes(kartId);
        });
        
        // Orijinal diziyi güncelle (kalan kartları bırak)
        kartlar.length = 0;
        kartlar.push(...kalacakKartlar);
        
        return gecerliKartlar.length > 0;
    }

    /**
     * Kartların grup sıralamasına göre uygun olup olmadığını kontrol eder
     * @param {Array} kartlar - Kontrol edilecek kartlar
     * @returns {boolean} - Grup sıralaması uygun mu
     */
    function grupSiralamaKontrol(kartlar) {
        // Joker kartları ayır
        const jokerler = kartlar.filter(kart => kart.dataset.joker === 'true');
        const normalKartlar = kartlar.filter(kart => kart.dataset.joker !== 'true');
        
        // Kartları periyot ve gruplara göre ayır
        const periyotlar = {};
        
        normalKartlar.forEach(kart => {
            const periyot = kart.dataset.periyot;
            if (!periyotlar[periyot]) {
                periyotlar[periyot] = [];
            }
            periyotlar[periyot].push(kart);
        });
        
        // Her bir periyot için grup sıralaması kontrol et
        let gecerliKartlar = [];
        
        for (const periyot in periyotlar) {
            if (periyotlar[periyot].length < 3) {
                continue; // En az 3 kart olmalı
            }
            
            // Gruba göre sırala
            periyotlar[periyot].sort((a, b) => parseInt(a.dataset.grup) - parseInt(b.dataset.grup));
            
            // Ardışık grupları kontrol et
            let ardisikKartlar = [periyotlar[periyot][0]];
            let oncekiGrup = parseInt(periyotlar[periyot][0].dataset.grup);
            
            for (let i = 1; i < periyotlar[periyot].length; i++) {
                const simdikiGrup = parseInt(periyotlar[periyot][i].dataset.grup);
                
                if (simdikiGrup === oncekiGrup + 1) {
                    // Ardışık
                    ardisikKartlar.push(periyotlar[periyot][i]);
                } else {
                    // Ardışık değil, ama joker varsa kullanılabilir
                    if (jokerler.length > 0) {
                        // Ardışık olmayan grup arasında kaç joker gerekiyor?
                        const gerekliJokerSayisi = simdikiGrup - oncekiGrup - 1;
                        
                        if (gerekliJokerSayisi <= jokerler.length) {
                            // Yeterli joker var
                            for (let j = 0; j < gerekliJokerSayisi; j++) {
                                ardisikKartlar.push(jokerler.shift());
                            }
                            ardisikKartlar.push(periyotlar[periyot][i]);
                        } else {
                            // Yeterli joker yok, yeni bir ardışık dizilim başlat
                            if (ardisikKartlar.length >= 3) {
                                // Önceki ardışık dizilim geçerli
                                gecerliKartlar = [...gecerliKartlar, ...ardisikKartlar];
                            }
                            ardisikKartlar = [periyotlar[periyot][i]];
                        }
                    } else {
                        // Joker yok, yeni bir ardışık dizilim başlat
                        if (ardisikKartlar.length >= 3) {
                            // Önceki ardışık dizilim geçerli
                            gecerliKartlar = [...gecerliKartlar, ...ardisikKartlar];
                        }
                        ardisikKartlar = [periyotlar[periyot][i]];
                    }
                }
                
                oncekiGrup = simdikiGrup;
            }
            
            // Son ardışık dizilimi kontrol et
            if (ardisikKartlar.length >= 3) {
                gecerliKartlar = [...gecerliKartlar, ...ardisikKartlar];
            }
        }
        
        // Kalan jokerler (en az 3 tane) de geçerli bir el oluşturabilir
        if (jokerler.length >= 3) {
            gecerliKartlar = [...gecerliKartlar, ...jokerler];
            jokerler.length = 0;
        }
        
        // Geriye kalan kartları çıkar ve sadece 1 kart kaldı mı kontrol et
        const kullanilanKartIdler = gecerliKartlar.map(kart => kart.dataset.atomNo + '-' + kart.dataset.takim);
        const kalacakKartlar = kartlar.filter(kart => {
            const kartId = kart.dataset.atomNo + '-' + kart.dataset.takim;
            return !kullanilanKartIdler.includes(kartId);
        });
        
        // Orijinal diziyi güncelle (kalan kartları bırak)
        kartlar.length = 0;
        kartlar.push(...kalacakKartlar);
        
        return gecerliKartlar.length > 0;
    }

    /**
     * Oyuncunun kazanıp kazanmadığını kontrol eder
     */
    function oyuncuKazanmaKontrol() {
        const oyuncuKartlari = document.querySelectorAll('#oyuncu-kartlari .element-kart');
        
        // Kartların dizilimini kontrol et
        if (kazanmaKontrol(Array.from(oyuncuKartlari))) {
            // Oyuncu kazandı!
            buyukBildirimGoster("Tebrikler! Oyunu kazandınız!", "success");
            
            // Yıldız kazandır
            yildizKazandir('oyuncu');
            
            // Oyunu kapat
            setTimeout(() => {
                oyunuKazan();
            }, 2000);
            
            return true;
        }
        
        return false;
    }

    /**
     * Desteden kart çekme işlemi
     */
    function destedenKartCek() {
        // Kullanıcının desteden kart çekmesi
        if (!oyunDevamEdiyor || kartCekildi) {
            bildirimGoster("Her tur sadece bir kart çekebilirsiniz!", "error");
            return;
        }
        
        // Deste alanındaki kartı (görsel temsil) al
        const desteAlani = document.querySelector('.deste-alani');
        const desteKart = desteAlani.querySelector('.element-kart');
        
        if (!desteKart) {
            bildirimGoster("Destede kart kalmadı!", "error");
            return;
        }
        
        // Kullanıcıya yeni bir kart ekle
        const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
        
        // Rastgele bir element seç
        const randomIndex = Math.floor(Math.random() * yuklenenElementler.length);
        const yeniKart = elementKartiOlusturDOM(yuklenenElementler[randomIndex], 1, Math.random() < 0.15);
        
        // Kartı oyuncuya ekle
        oyuncuKartlari.appendChild(yeniKart);
        
        // Kart çekme sesi çal
        window.sesCal('kart_cek');
        
        // Açık kartı sonraki oyuncuya aktar (önceki oyuncunun atılacak kartını bypass et)
        const acikKartAlani = document.querySelector('.acik-kart-alani');
        const acikKart = acikKartAlani.querySelector('.element-kart');
        
        if (acikKart) {
            // Açık kartı bot1'e ekle (bot sırası 1'den başlar)
            const botKartlar = document.querySelector('#bot1-alani .bot-kartlar');
            const botKart = document.createElement('div');
            botKart.className = 'bot-kart arka-yuz';
            botKartlar.appendChild(botKart);
            
            // Açık kart alanını temizle
            acikKartAlani.innerHTML = '';
        }
        
        // Çekilen kartı işaretle
        kartCekildi = true;
        
        // Oyuncunun kazanıp kazanmadığını kontrol et
        if (oyuncuKazanmaKontrol()) {
            return;
        }
        
        // Bot hamlesine geç
        bildirimGoster("Bir kart atmanız gerekiyor.", "info");
    }

    /**
     * Açık kartı alma işlemi
     */
    function acikKartiAl() {
        // Kullanıcının açık kartı alması
        if (!oyunDevamEdiyor || kartCekildi) {
            bildirimGoster("Her tur sadece bir kart alabilirsiniz!", "error");
            return;
        }
        
        // Açık kart alanındaki kartı al
        const acikKartAlani = document.querySelector('.acik-kart-alani');
        const acikKart = acikKartAlani.querySelector('.element-kart');
        
        if (!acikKart) {
            bildirimGoster("Açık kart yok!", "error");
            return;
        }
        
        // Açık kartı kullanıcıya ekle
        const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
        oyuncuKartlari.appendChild(acikKart);
        
        // Kart alma sesi çal
        window.sesCal('kart_al');
        
        // Açık kart alanını temizle
        acikKartAlani.innerHTML = '';
        
        // Çekilen kartı işaretle
        kartCekildi = true;
        
        // Oyuncunun kazanıp kazanmadığını kontrol et
        if (oyuncuKazanmaKontrol()) {
            return;
        }
        
        // Bot hamlesine geç
        bildirimGoster("Bir kart atmanız gerekiyor.", "info");
    }

    /**
     * Kart atma işlemi
     * @param {HTMLElement} kart - Atılacak kart elementi
     */
    function kartAt(kart) {
        if (!oyunDevamEdiyor || !kartCekildi) {
            bildirimGoster("Önce bir kart çekmelisiniz!", "error");
            return;
        }
        
        // Açık kart alanına kartı ekle
        const acikKartAlani = document.querySelector('.acik-kart-alani');
        acikKartAlani.appendChild(kart);
        
        // Kart atma sesi çal
        window.sesCal('kart_at');
        
        // Çekilen kartı sıfırla
        kartCekildi = false;
        
        // Bot hamlesine geç
        setTimeout(() => {
            botHamlesiYap();
        }, 1000);
    }

    /**
     * Bot hamlesi yapma
     */
    function botHamlesiYap() {
        if (!oyunDevamEdiyor) return;
        
        // Aktif botu belirle
        let aktifBot = 1;
        
        // Bot hamlesi yapma fonksiyonu
        function birSonrakiBotaGec() {
            aktifBot++;
            
            // Tüm botlar oynadıysa oyuncuya geç
            if (aktifBot > 3) {
                // Yeni bir tur başlat (oyuncunun sırası)
                document.getElementById('durum-mesaji').textContent = 'Sizin sıranız. Desteden bir kart çekin veya açık kartı alın.';
                return;
            }
            
            // Sıradaki botun hamlesini yap
            botHamlesiniYap();
        }
        
        function botHamlesiniYap() {
            // Bot'un kartlarını kontrol et
            const botKartlari = document.querySelector(`#bot${aktifBot}-alani .bot-kartlar`);
            
            if (!botKartlari) {
                // Bot yok, sıradaki bota geç
                birSonrakiBotaGec();
                return;
            }
            
            // Bot durum mesajını güncelle
            document.getElementById('durum-mesaji').textContent = `Bot ${aktifBot} oynuyor...`;
            
            // Bot konuşması ekle
            botKonustur(aktifBot, 'düşünceli');
            
            // Bot kart çekecek mi yoksa açık kartı mı alacak?
            const kartCekecekMi = Math.random() > 0.5;
            
            // Bot'un durumunu güncelle (düşünme süresi 1 saniye)
            setTimeout(() => {
                // Açık kart var mı kontrol et
                const acikKartAlani = document.querySelector('.acik-kart-alani');
                const acikKart = acikKartAlani.querySelector('.element-kart');
                
                if (kartCekecekMi || !acikKart) {
                    // Desteden kart çek
                    // Bot için yeni kart ekle (görsel olarak kapalı kart şeklinde)
                    const yeniKart = document.createElement('div');
                    yeniKart.className = 'bot-kart arka-yuz';
                    botKartlari.appendChild(yeniKart);
                    
                    bildirimGoster(`Bot ${aktifBot} desteden kart çekti.`, "info");
                    window.sesCal('kart_cek');
                    
                    // Açık kartı sonraki bota aktar (önceki botun atılacak kartını bypass et)
                    if (acikKart) {
                        // Açık kartı bir sonraki bota veya oyuncuya ekle
                        const sonrakiIndex = aktifBot === 3 ? 0 : aktifBot + 1;
                        
                        if (sonrakiIndex === 0) {
                            // Oyuncuya gönder
                            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
                            oyuncuKartlari.appendChild(acikKart);
                        } else {
                            // Sonraki bota ekle
                            const sonrakiBotKartlari = document.querySelector(`#bot${sonrakiIndex}-alani .bot-kartlar`);
                            if (sonrakiBotKartlari) {
                                const botKart = document.createElement('div');
                                botKart.className = 'bot-kart arka-yuz';
                                sonrakiBotKartlari.appendChild(botKart);
                            }
                        }
                        
                        // Açık kart alanını temizle
                        acikKartAlani.innerHTML = '';
                    }
                } else {
                    // Açık kartı al
                    bildirimGoster(`Bot ${aktifBot} açık kartı aldı.`, "info");
                    
                    // Bot için yeni kart ekle (görsel olarak kapalı kart şeklinde)
                    const yeniKart = document.createElement('div');
                    yeniKart.className = 'bot-kart arka-yuz';
                    botKartlari.appendChild(yeniKart);
                    
                    // Açık kart alanını temizle
                    acikKartAlani.innerHTML = '';
                    
                    window.sesCal('kart_al');
                }
                
                // Bot konuşsun - karar vermeden önce
                const ruhHali = Math.random() > 0.5 ? 'umutlu' : 'kararsız';
                botKonustur(aktifBot, ruhHali);
                
                // Bot kart atacak
                setTimeout(() => {
                    // Rastgele bir kart seç
                    const kartIndeks = Math.floor(Math.random() * botKartlari.children.length);
                    const secilecekKart = botKartlari.children[kartIndeks];
                    
                    // Seçilen kartı açık kart olarak belirle
                    secilecekKart.remove();
                    
                    // Yeni açık kart oluştur
                    const rastgeleIndeks = Math.floor(Math.random() * yuklenenElementler.length);
                    const yeniAcikKart = elementKartiOlusturDOM(yuklenenElementler[rastgeleIndeks], 1);
                    acikKartAlani.appendChild(yeniAcikKart);
                    
                    bildirimGoster(`Bot ${aktifBot} bir kart attı.`, "info");
                    window.sesCal('kart_at');
                    
                    // Bot kazanma kontrolü
                    if (botKartlari.children.length === 0) {
                        // Bot tüm kartları bitirdi!
                        botKazandi(aktifBot);
                        return;
                    }
                    
                    // Sıradaki bota geç
                    setTimeout(() => {
                        birSonrakiBotaGec();
                    }, 1000);
                }, 1000);
            }, 1000);
        }
        
        // İlk botun hamlesini yap
        botHamlesiniYap();
    }
}); 

// CSS Stili ekle
const style = document.createElement('style');
style.textContent = `
    .oyuncu-kartlari {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 5px;
        min-height: 300px;
        max-width: 900px;
        margin: 0 auto;
    }
    
    .element-kart {
        transition: transform 0.2s ease;
    }
    
    .element-kart:hover {
        transform: translateY(-10px);
        z-index: 10;
    }
    
    .bot-kartlar {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 5px;
    }
    
    .siralama-menu {
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16);
        z-index: 100;
        padding: 10px;
    }
    
    .siralama-menu button {
        display: block;
        width: 100%;
        margin-bottom: 5px;
        padding: 5px;
        border: none;
        background-color: #f0f0f0;
        cursor: pointer;
        border-radius: 3px;
    }
    
    .siralama-menu button:hover {
        background-color: #e0e0e0;
    }
    
    /* Sıralama menüsü */
    .siralama-menusu {
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 100;
    }
    
    .siralama-opsiyon {
        padding: 8px 16px;
        cursor: pointer;
    }
    
    .siralama-opsiyon:hover {
        background-color: #f0f0f0;
    }
`;
document.head.appendChild(style);

// Event Listeners ekle
document.addEventListener('DOMContentLoaded', () => {
    // Kart Sırala butonunu dinle
    const siralamaSecBtn = document.getElementById('btn-siralama-sec');
    if (siralamaSecBtn) {
        siralamaSecBtn.addEventListener('click', () => {
            // Siralama menüsü oluştur
            const mevcut = document.querySelector('.siralama-menu');
            if (mevcut) {
                mevcut.remove();
                return;
            }
            
            const menu = document.createElement('div');
            menu.className = 'siralama-menu';
            menu.style.left = siralamaSecBtn.offsetLeft + 'px';
            menu.style.top = (siralamaSecBtn.offsetTop + siralamaSecBtn.offsetHeight) + 'px';
            
            // Sıralama seçenekleri
            const periyotBtn = document.createElement('button');
            periyotBtn.textContent = 'Periyota Göre Sırala';
            periyotBtn.addEventListener('click', () => {
                kartlariSirala('periyot');
                menu.remove();
            });
            
            const grupBtn = document.createElement('button');
            grupBtn.textContent = 'Gruba Göre Sırala';
            grupBtn.addEventListener('click', () => {
                kartlariSirala('grup');
                menu.remove();
            });
            
            menu.appendChild(periyotBtn);
            menu.appendChild(grupBtn);
            
            document.body.appendChild(menu);
            
            // Menü dışına tıklanınca menüyü kapat
            document.addEventListener('click', function kapama(e) {
                if (!menu.contains(e.target) && e.target !== siralamaSecBtn) {
                    menu.remove();
                    document.removeEventListener('click', kapama);
                }
            });
        });
    }
    
    // Kazanma Kontrolü butonunu dinle
    const kazanmaKontrolBtn = document.getElementById('btn-kazanma-kontrol');
    if (kazanmaKontrolBtn) {
        kazanmaKontrolBtn.addEventListener('click', () => {
            oyuncuKazanmaKontrol();
        });
    }
    
    // Desteden Kart Çek butonunu dinle
    const destedenCekBtn = document.getElementById('btn-desteyi-ac');
    if (destedenCekBtn) {
        destedenCekBtn.addEventListener('click', () => {
            destedenKartCek();
        });
    }
    
    // Açık Kartı Al butonunu dinle
    const acikKartiAlBtn = document.getElementById('btn-acik-karti-al');
    if (acikKartiAlBtn) {
        acikKartiAlBtn.addEventListener('click', () => {
            acikKartiAl();
        });
    }
    
    // Kartlara tıklayınca kart atma işlemi
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('element-kart') && e.target.parentNode.id === 'oyuncu-kartlari') {
            // Oyuncunun sırası ve kart çekilmiş mi kontrol et
            if (kartCekildi) {
                // Kartı at
                kartAt(e.target);
            }
        }
    });
});

/**
 * Kartları periyot veya gruba göre sıralar
 * @param {string} turString - Sıralama türü ('periyot' veya 'grup')
 */
function kartlariSirala(turString) {
    const oyuncuKartlari = document.querySelectorAll('#oyuncu-kartlari .element-kart');
    const karlarDizisi = Array.from(oyuncuKartlari);
    
    karlarDizisi.sort((a, b) => {
        if (turString === 'periyot') {
            // Önce periyota göre sırala
            const periyotA = parseInt(a.dataset.periyot);
            const periyotB = parseInt(b.dataset.periyot);
            
            if (periyotA !== periyotB) {
                return periyotA - periyotB;
            }
            
            // Periyotlar eşitse gruplara göre sırala
            return parseInt(a.dataset.grup) - parseInt(b.dataset.grup);
        } else {
            // Önce gruba göre sırala
            const grupA = parseInt(a.dataset.grup);
            const grupB = parseInt(b.dataset.grup);
            
            if (grupA !== grupB) {
                return grupA - grupB;
            }
            
            // Gruplar eşitse periyota göre sırala
            return parseInt(a.dataset.periyot) - parseInt(b.dataset.periyot);
        }
    });
    
    // Kartları yeniden DOM'a ekle
    const oyuncuKartlarAlani = document.getElementById('oyuncu-kartlari');
    oyuncuKartlarAlani.innerHTML = '';
    
    karlarDizisi.forEach(kart => {
        oyuncuKartlarAlani.appendChild(kart);
    });
    
    bildirimGoster(`Kartlarınız ${turString}a göre sıralandı.`, 'info');
}

// ... existing code ...

// Kart çekme ve atma event listener'ları
// Bu satırları kaldırıyorum çünkü yukarıda zaten tanımlanmış
// document.getElementById('deste-buton').addEventListener('click', destedenKartCek);
// document.getElementById('acik-kart-buton').addEventListener('click', acikKartiAl);

// Oyuncu kartları için event listener
document.getElementById('oyuncu-kartlari').addEventListener('click', (e) => {
    if (e.target.closest('.element-kart')) {
        const kartElement = e.target.closest('.element-kart');
        // Eğer oyuncu kart çektiyse kart atabilir
        if (oyuncuKartCekti) {
            kartAt(kartElement);
        } else {
            bildirimGoster("Önce kart çekmelisiniz!", "warning");
        }
    }
});

// Kart sıralama butonu için event listener
document.getElementById('sirala-buton').addEventListener('click', (e) => {
    // Sıralama menüsünü oluştur
    const siralamaMenusu = document.createElement('div');
    siralamaMenusu.className = 'siralama-menusu';
    siralamaMenusu.innerHTML = `
        <div class="siralama-opsiyon" data-tur="periyot">Periyoda Göre Sırala</div>
        <div class="siralama-opsiyon" data-tur="grup">Gruba Göre Sırala</div>
    `;
    
    // Menüyü pozisyonla
    siralamaMenusu.style.position = 'absolute';
    siralamaMenusu.style.top = (e.target.offsetTop + e.target.offsetHeight) + 'px';
    siralamaMenusu.style.left = e.target.offsetLeft + 'px';
    
    // Menüyü sayfaya ekle
    document.body.appendChild(siralamaMenusu);
    
    // Menü opsiyonları için event listener
    const opsiyonlar = siralamaMenusu.querySelectorAll('.siralama-opsiyon');
    opsiyonlar.forEach(opsiyon => {
        opsiyon.addEventListener('click', () => {
            const tur = opsiyon.dataset.tur;
            kartlariSirala(tur);
            document.body.removeChild(siralamaMenusu);
        });
    });
    
    // Dışarı tıklandığında menüyü kapat
    document.addEventListener('click', function kapatMenu(event) {
        if (!siralamaMenusu.contains(event.target) && event.target !== e.target) {
            document.body.removeChild(siralamaMenusu);
            document.removeEventListener('click', kapatMenu);
        }
    });
});

// Kazanma durumu kontrolü
document.getElementById('kazanma-kontrol-buton').addEventListener('click', () => {
    // Kazanma durumunu kontrol et (Bu fonksiyon oyun_mekanikleri.js içinde tanımlanacak)
    bildirimGoster("Kazanma kontrolü yapılıyor...", "info");
    // oyuncuKazanabilirMi(0) fonksiyonu implemente edilecek
});

/**
 * Kartları belirli bir türe göre sıralar
 * @param {string} turString - Sıralama türü ("periyot" veya "grup")
 */
function kartlariSirala(turString) {
    const kartlarAlani = document.getElementById('oyuncu-kartlari');
    const kartlar = Array.from(kartlarAlani.querySelectorAll('.element-kart'));
    
    // Sıralamayı uygula
    kartlar.sort((a, b) => {
        if (turString === 'periyot') {
            // Önce periyoda, sonra gruba göre sırala
            if (parseInt(a.dataset.periyot) !== parseInt(b.dataset.periyot)) {
                return parseInt(a.dataset.periyot) - parseInt(b.dataset.periyot);
            }
            return parseInt(a.dataset.grup) - parseInt(b.dataset.grup);
        } else if (turString === 'grup') {
            // Önce gruba, sonra periyoda göre sırala
            if (parseInt(a.dataset.grup) !== parseInt(b.dataset.grup)) {
                return parseInt(a.dataset.grup) - parseInt(b.dataset.grup);
            }
            return parseInt(a.dataset.periyot) - parseInt(b.dataset.periyot);
        }
        return 0;
    });
    
    // DOM'da kartları yeniden yerleştir
    kartlar.forEach(kart => {
        kartlarAlani.appendChild(kart);
    });
    
    bildirimGoster(`Kartlar ${turString}a göre sıralandı.`, "success");
}

// Oyun alanı stillerini ayarla
document.head.insertAdjacentHTML('beforeend', `
<style>
    /* Kart alanı düzeni */
    .kartlar-alani {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        max-width: 100%;
    }
    
    /* İki satır kart düzeni */
    #oyuncu-kartlari {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
        grid-template-rows: repeat(2, auto);
        gap: 8px;
        max-height: 170px;
        overflow-y: auto;
        padding: 5px;
    }
    
    /* Kart hover efektleri */
    .element-kart {
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
    }
    
    .element-kart:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10;
    }
</style>
`);

// ... existing code ...