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
    
    // DOM tabanlı kart oluşturucu (sınıf kullanmadan doğrudan DOM elementleri oluşturur)
    function elementKartiOlusturDOM(element, takim = 1, joker = false) {
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
        
        // Grup-Periyot - Daha açık ve belirgin yap
        if (!joker) {
            const grupPeriyot = document.createElement('div');
            grupPeriyot.className = 'grup-periyot';
            
            // Grup ve periyot değerlerini kontrol et
            const grupDegeri = element.grup ? element.grup : "-";
            const periyotDegeri = element.periyot ? element.periyot : "-";
            
            grupPeriyot.innerHTML = `<strong>G:</strong>${grupDegeri} <strong>P:</strong>${periyotDegeri}`;
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
        
        // Elementten renk kodunu al ve kartın arkaplan rengini ayarla
        if (!joker) {
            const renkKodu = elementRengiGetir(element);
            kart.style.backgroundColor = renkKodu;
            // Eğer renk çok koyuysa, metin rengini beyaz yap
            const renkKoyulugu = hexRenkKoyulugu(renkKodu);
            if (renkKoyulugu < 128) {
                kart.style.color = '#ffffff';
            }
        }
        
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
    
    // Hex rengin koyuluğunu hesapla (0-255 arası, 0: siyah, 255: beyaz)
    function hexRenkKoyulugu(hex) {
        // hex rengi #rrggbb formatında olmalı
        let r = 0, g = 0, b = 0;
        
        // # ile başlıyorsa kaldır
        if (hex.startsWith('#')) {
            hex = hex.substring(1);
        }
        
        // 3 haneli hex ise 6 haneliye dönüştür
        if (hex.length === 3) {
            r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
            g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
            b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
        } 
        // 6 haneli hex ise doğrudan dönüştür
        else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        
        // Parlaklığı hesapla (0-255 arası)
        return (r * 0.299 + g * 0.587 + b * 0.114);
    }
    
    // Sürükleme ile ilgili değişkenler
    let suruklenenKart = null;
    
    // Sürükleme olayları
    function handleDragStart(e) {
        this.style.opacity = '0.4';
        suruklenenKart = this;
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        
        // Kartın kaynağını belirle - kombinasyon alanından mı oyuncu kartlarından mı
        const parent = this.parentElement;
        this.dataset.kaynak = parent.id || parent.className;
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
            // Eğer sürüklenen kart kombinasyon alanından oyuncu alanına taşınıyorsa
            if (suruklenenKart.dataset.kaynak && 
                suruklenenKart.dataset.kaynak.includes('kombinasyon') && 
                this.id === 'oyuncu-kartlari') {
                // Kartı oyuncu kartlarına geri al
                this.appendChild(suruklenenKart);
            } 
            // Eğer sürüklenen kart oyuncu alanından kombinasyon alanına taşınıyorsa
            else if (suruklenenKart.dataset.kaynak && 
                    !suruklenenKart.dataset.kaynak.includes('kombinasyon') && 
                    this.classList.contains('kombinasyon-icerik')) {
                // Kartı kombinasyon alanına taşı
                this.appendChild(suruklenenKart);
            }
            // Eğer aynı alan içinde taşınıyorsa (sıralama için)
            else if (this.classList.contains('surukle-hedef')) {
                this.appendChild(suruklenenKart);
            }
        }
        
        return false;
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
    
    // Örnek kart oluşturma (test için)
    function testKartlariOlustur() {
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
            
            // Rastgele 7 element seç ve kart oluştur (birini joker yap)
            const rastgeleElementIndeksler = [];
            while (rastgeleElementIndeksler.length < 7) {
                const indeks = Math.floor(Math.random() * elementler.length);
                if (!rastgeleElementIndeksler.includes(indeks)) {
                    rastgeleElementIndeksler.push(indeks);
                }
            }
            
            // Seçilen elementlerden kartları oluştur
            rastgeleElementIndeksler.forEach((indeks, i) => {
                const kart = elementKartiOlusturDOM(elementler[indeks], 1, i === 3); // 4. kart joker
                oyuncuKartlariDiv.appendChild(kart);
            });
            
            oyuncuAlani.appendChild(oyuncuKartlariDiv);
            
            // Kombinasyon alanı oluştur ve sürükleme hedefi olarak işaretle
            const kombinasyonIcerik = document.getElementById('kombinasyon-icerik');
            if (kombinasyonIcerik) {
                kombinasyonIcerik.innerHTML = ''; // İçeriği temizle
                kombinasyonIcerik.classList.add('surukle-hedef');
            }
            
            // Bot kartlarını göster (kapalı olarak)
            document.querySelectorAll('.bot-kartlar').forEach(botAlani => {
                botAlani.innerHTML = ''; // İçeriği temizle
                for (let i = 0; i < 7; i++) {
                    const kapaliKart = document.createElement('div');
                    kapaliKart.className = 'element-kart arka-yuz';
                    kapaliKart.style.width = '20px'; // Daha küçük göster
                    kapaliKart.style.height = '30px';
                    kapaliKart.style.margin = '2px';
                    kapaliKart.style.display = 'inline-block';
                    botAlani.appendChild(kapaliKart);
                }
            });
            
            // Sürükleme hedeflerini ayarla
            surukleHedefleriniAyarla();
            
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
    
    // Kontrol Et butonuna tıklama olayını ekle
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
                puanArtisi += 10; // Grup başına 10 puan
                bildirimGoster("Grup kombinasyonu! +10 puan", "success");
            }
            
            if (periyotKombinasyonu) {
                puanArtisi += 5; // Periyot başına 5 puan
                bildirimGoster("Periyot kombinasyonu! +5 puan", "success");
            }
            
            // Joker bonus kontrolü
            const jokerVarmi = kartBilgileri.some(kart => kart.joker);
            if (jokerVarmi) {
                puanArtisi *= 2; // Joker varsa puanı ikiye katla
                bildirimGoster("Joker bonusu! Puanlar 2 katına çıktı!", "success");
            }
            
            // Puanı güncelle
            const oyuncuPuanElementi = document.getElementById('oyuncu-puan');
            const mevcutPuan = parseInt(oyuncuPuanElementi.textContent);
            oyuncuPuanElementi.textContent = mevcutPuan + puanArtisi;
            
            // Kombinasyon kartlarını temizle
            kombinasyonAlani.innerHTML = '';
            
            // Kalan kartları ve durumu güncelle
            kalanKartSayisiniGuncelle();
            
            // Oyuncu kazandı mı kontrol et
            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
            if (oyuncuKartlari.children.length === 0) {
                oyunuKazan();
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
        const bildirim = document.createElement('div');
        bildirim.className = `bildirim bildirim-${tur}`;
        bildirim.textContent = mesaj;
        bildirim.style.position = 'fixed';
        bildirim.style.top = '20px';
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
                document.body.removeChild(bildirim);
            }, 500);
        }, 2000);
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
     * Oyuncu kazandığında çağrılacak fonksiyon
     */
    function oyunuKazan() {
        // Oyun sonu ekranını göster
        document.getElementById('oyun-screen').classList.add('gizli');
        document.getElementById('oyun-sonu-screen').classList.remove('gizli');
        
        // Sonuç mesajını ayarla
        document.getElementById('sonuc-mesaji').textContent = "Tebrikler! Oyunu kazandınız!";
        
        // Puanı aktar
        const puan = document.getElementById('oyuncu-puan').textContent;
        document.getElementById('sonuc-puan').textContent = puan;
        
        // İstatistikleri güncelle
        const oyunSayisi = parseInt(localStorage.getItem('oyunSayisi') || '0') + 1;
        const kazanmaSayisi = parseInt(localStorage.getItem('kazanmaSayisi') || '0') + 1;
        const toplamPuan = parseInt(localStorage.getItem('toplamPuan') || '0') + parseInt(puan);
        const enYuksekSkor = Math.max(parseInt(localStorage.getItem('enYuksekSkor') || '0'), parseInt(puan));
        
        localStorage.setItem('oyunSayisi', oyunSayisi);
        localStorage.setItem('kazanmaSayisi', kazanmaSayisi);
        localStorage.setItem('toplamPuan', toplamPuan);
        localStorage.setItem('enYuksekSkor', enYuksekSkor);
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
                oyuncuKartlari.appendChild(acikKart);
                
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
            acikKartAlani.appendChild(seciliKart);
            seciliKart.classList.remove('secili');
            
            // Kalan kart sayısını güncelle
            kalanKartSayisiniGuncelle();
            
            // Kart çekme durumunu sıfırla ve bot hamlesini başlat
            setTimeout(() => {
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
        
        // Tüm botlar için hamle yap
        const botSayisi = 3; // Varsayılan bot sayısı
        let aktifBot = 1;
        
        function birSonrakiBotaGec() {
            if (aktifBot <= botSayisi) {
                durumMesaji.textContent = `Bot ${aktifBot} oynuyor...`;
                
                // Bot kartları
                const botKartlari = document.querySelector(`#bot${aktifBot}-alani .bot-kartlar`);
                
                // Rastgele bir kombinasyon şansı (bot zekasını simüle etmek için)
                const kombinasyonSansi = Math.random();
                
                setTimeout(() => {
                    // Bot kombinasyon yapabilir mi (rastgele)
                    if (kombinasyonSansi > 0.6) { // %40 şansla kombinasyon yap
                        // Botun puan kazandığını bildirme
                        const kazanilanPuan = Math.floor(Math.random() * 20) + 5; // 5-25 arası rastgele puan
                        bildirimGoster(`Bot ${aktifBot} kombinasyon yaptı! +${kazanilanPuan} puan`, "warning");
                        
                        // Botun puanını güncelle
                        const botPuanElementi = document.getElementById(`bot${aktifBot}-puan`);
                        const mevcutPuan = parseInt(botPuanElementi.textContent);
                        botPuanElementi.textContent = mevcutPuan + kazanilanPuan;
                        
                        // Bot kartlarını rastgele azalt (kombinasyon yapıldı gibi)
                        const silinecekKartSayisi = Math.floor(Math.random() * 3) + 2; // 2-5 arası kart sil
                        const kartlar = botKartlari.querySelectorAll('.element-kart');
                        
                        for (let i = 0; i < Math.min(silinecekKartSayisi, kartlar.length); i++) {
                            if (kartlar[i]) {
                                botKartlari.removeChild(kartlar[i]);
                            }
                        }
                        
                        // Bot kazandı mı kontrol et
                        if (botKartlari.children.length === 0) {
                            botKazandi(aktifBot);
                            return;
                        }
                    }
                    
                    // Bot sıradaki karta karar veriyor
                    setTimeout(() => {
                        // Sıradaki bota geç
                        aktifBot++;
                        birSonrakiBotaGec();
                    }, 500);
                }, 1000);
            } else {
                // Tüm botlar oynadı, sıra oyuncuya geçiyor
                durumMesaji.textContent = 'Sizin sıranız. Kart çekin veya kombinasyon yapın.';
                turBaslat();
            }
        }
        
        // İlk bottan başla
        birSonrakiBotaGec();
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
        document.getElementById('sonuc-mesaji').textContent = `Bot ${botNo} oyunu kazandı!`;
        
        // İstatistikleri güncelle
        const oyunSayisi = parseInt(localStorage.getItem('oyunSayisi') || '0') + 1;
        const kaybetmeSayisi = parseInt(localStorage.getItem('kaybetmeSayisi') || '0') + 1;
        
        localStorage.setItem('oyunSayisi', oyunSayisi);
        localStorage.setItem('kaybetmeSayisi', kaybetmeSayisi);
    }
    
    console.log("Periyodik Okey oyunu hazır!");
}); 