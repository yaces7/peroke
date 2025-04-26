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
        // ElementKartiSinifi sınıfını kullanarak kart nesnesi oluştur
        const elementKarti = new ElementKartiSinifi(element, takim, joker);
        
        // Kart HTML elementini oluştur
        const kartDiv = elementKarti.htmlOlustur(false);
        
        // Karta tıklama işlevi ekle
        kartDiv.addEventListener('click', function(e) {
            // Diğer seçili kartları temizle
            document.querySelectorAll('.element-kart.secili').forEach(kart => {
                kart.classList.remove('secili');
            });
            
            // Bu kartı seçili yap
            this.classList.toggle('secili');
        });
        
        // Kartı sürüklenebilir yap
        kartDiv.setAttribute('draggable', 'true');
        kartDiv.addEventListener('dragstart', handleDragStart);
        kartDiv.addEventListener('dragend', handleDragEnd);
        
        // Kart verilerini dataset'e ekle (kombinasyon kontrolü için)
        kartDiv.dataset.atomNo = element.atom_no || 0;
        kartDiv.dataset.sembol = element.sembol || 'J';
        kartDiv.dataset.grup = element.grup || 0;
        kartDiv.dataset.periyot = element.periyot || 0;
        kartDiv.dataset.joker = joker;
        kartDiv.dataset.takim = takim;
        
        return kartDiv;
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
        this.classList.add('sürükleniyor');
        
        // Sürüklenen kartın bilgilerini depola
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);
        
        // Sürüklenen kartın verilerini dataset olarak aktar
        const kartVerileri = {
            atomNo: this.dataset.atomNo,
            sembol: this.dataset.sembol,
            grup: this.dataset.grup,
            periyot: this.dataset.periyot,
            joker: this.dataset.joker === 'true',
            takim: this.dataset.takim
        };
        
        e.dataTransfer.setData('application/json', JSON.stringify(kartVerileri));
    }
    
    function handleDragEnd(e) {
        this.classList.remove('sürükleniyor');
    }
    
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Varsayılan işlemi engelle
        }
        
        e.dataTransfer.dropEffect = 'move';
        return false;
    }
    
    function handleDragEnter(e) {
        this.classList.add('uzerine-surukle');
    }
    
    function handleDragLeave(e) {
        this.classList.remove('uzerine-surukle');
    }
    
    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // Olayın yayılmasını engelle
        }
        
        // Sürüklenen veriyi al
        const html = e.dataTransfer.getData('text/html');
        const kartVerileriJSON = e.dataTransfer.getData('application/json');
        
        // Sürüklenen kartı oluştur
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const sürüklenenKart = tempDiv.firstChild;
        
        // Kartın veri özelliklerini sakla
        if (kartVerileriJSON) {
            try {
                const kartVerileri = JSON.parse(kartVerileriJSON);
                sürüklenenKart.dataset.atomNo = kartVerileri.atomNo;
                sürüklenenKart.dataset.sembol = kartVerileri.sembol;
                sürüklenenKart.dataset.grup = kartVerileri.grup;
                sürüklenenKart.dataset.periyot = kartVerileri.periyot;
                sürüklenenKart.dataset.joker = kartVerileri.joker;
                sürüklenenKart.dataset.takim = kartVerileri.takim;
            } catch (e) {
                console.error("Kart verilerini ayrıştırma hatası:", e);
            }
        }
        
        // Tüm sürükleme sınıflarını temizle
        this.classList.remove('uzerine-surukle');
        
        // Orijinal kartı sil (sadece kart bu alana taşınırsa)
        const orijinalKartId = sürüklenenKart.id;
        if (orijinalKartId) {
            const orijinalKart = document.getElementById(orijinalKartId);
            if (orijinalKart && orijinalKart.parentNode) {
                orijinalKart.parentNode.removeChild(orijinalKart);
            }
        }
        
        // Kartı bu alana ekle
        this.appendChild(sürüklenenKart);
        
        // Kartı sürüklenebilir yap ve olayları ekle
        sürüklenenKart.setAttribute('draggable', 'true');
        sürüklenenKart.addEventListener('dragstart', handleDragStart);
        sürüklenenKart.addEventListener('dragend', handleDragEnd);
        sürüklenenKart.addEventListener('click', function(e) {
            // Diğer seçili kartları temizle
            document.querySelectorAll('.element-kart.secili').forEach(kart => {
                kart.classList.remove('secili');
            });
            
            // Bu kartı seçili yap
            this.classList.toggle('secili');
        });
        
        // Eğer kart kombinasyon alanına taşınıyorsa, kombinasyondaki kartlar listesine ekle
        if (this.id === 'kombinasyon-icerik') {
            kombinasyondakiKartlar.push(sürüklenenKart);
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
    
    /**
     * Sürükle-bırak için hedef alanlarını ayarla
     */
    function surukleHedefleriniAyarla() {
        document.querySelectorAll('.surukle-hedef').forEach(hedef => {
            hedef.addEventListener('dragover', handleDragOver);
            hedef.addEventListener('dragenter', handleDragEnter);
            hedef.addEventListener('dragleave', handleDragLeave);
            hedef.addEventListener('drop', handleDrop);
        });
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
    
    // Global değişkenler
    let kombinasyondakiKartlar = [];
    let kalanKartSayisi = 54; // Toplam kart sayısı
    
    /**
     * Durum mesajını göster
     * @param {string} mesaj - Gösterilecek mesaj
     * @param {string} renk - Mesaj rengi
     * @param {number} sure - Mesajın ekranda kalma süresi (ms)
     */
    function durumMesajiGoster(mesaj, renk = '#000000', sure = 2000) {
        const durumMesaji = document.getElementById('durum-mesaji');
        if (durumMesaji) {
            durumMesaji.textContent = mesaj;
            durumMesaji.style.color = renk;
            durumMesaji.style.fontWeight = 'bold';
            durumMesaji.style.fontSize = '18px';
            durumMesaji.style.padding = '5px';
            durumMesaji.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            durumMesaji.style.borderRadius = '5px';
            
            // Belirli süre sonra mesajı sıfırla
            setTimeout(() => {
                durumMesaji.textContent = '';
                durumMesaji.style.backgroundColor = 'transparent';
            }, sure);
        }
    }
    
    /**
     * Kalan kart sayısını güncelle
     * @param {number} deger - Eklenecek veya çıkarılacak değer
     */
    function kalanKartSayisiniGuncelle(deger = -1) {
        kalanKartSayisi += deger;
        const kalanKartSpan = document.getElementById('kalan-kart');
        if (kalanKartSpan) {
            kalanKartSpan.textContent = kalanKartSayisi;
        }
    }
    
    /**
     * Kombinasyonu kontrol et ve geçerliyse kartları sil
     */
    function kombinasyonuKontrolEt() {
        const kombinasyonIcerik = document.getElementById('kombinasyon-icerik');
        if (!kombinasyonIcerik) return;
        
        // Kombinasyondaki kartları al
        const kartElementleri = kombinasyonIcerik.querySelectorAll('.element-kart');
        if (kartElementleri.length === 0) {
            durumMesajiGoster('Kombinasyon alanında kart yok!', '#ff0000');
            return;
        }
        
        // Kartları grupla
        const kartGrupları = {};
        const kartPeriyotlari = {};
        
        kartElementleri.forEach(kart => {
            const grup = kart.dataset.grup;
            const periyot = kart.dataset.periyot;
            
            // Joker kartlar her grup ve periyotta kullanılabilir
            if (kart.dataset.joker === 'true') {
                return;
            }
            
            // Grup bazlı sınıflandırma
            if (!kartGrupları[grup]) {
                kartGrupları[grup] = [];
            }
            kartGrupları[grup].push(kart);
            
            // Periyot bazlı sınıflandırma
            if (!kartPeriyotlari[periyot]) {
                kartPeriyotlari[periyot] = [];
            }
            kartPeriyotlari[periyot].push(kart);
        });
        
        // Geçerli grup kombinasyonu var mı? (Aynı grupta en az 3 kart)
        let gecerliGrup = false;
        Object.values(kartGrupları).forEach(grupKartlari => {
            if (grupKartlari.length >= 3) {
                gecerliGrup = true;
            }
        });
        
        // Geçerli periyot kombinasyonu var mı? (Aynı periyotta en az 4 kart)
        let gecerliPeriyot = false;
        Object.values(kartPeriyotlari).forEach(periyotKartlari => {
            if (periyotKartlari.length >= 4) {
                gecerliPeriyot = true;
            }
        });
        
        // Kombinasyon geçerliyse kartları sil
        if (gecerliGrup || gecerliPeriyot) {
            // Son bir kart kaldıysa oyunu kazanma durumu
            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
            const oyuncuKartSayisi = oyuncuKartlari.childElementCount;
            
            if (oyuncuKartSayisi === 1 && kartElementleri.length === oyuncuKartSayisi - 1) {
                // Kalan son kartı sağdaki bota ver
                const sonKart = oyuncuKartlari.querySelector('.element-kart');
                
                durumMesajiGoster('Tebrikler! Oyunu kazandınız!', '#008000', 3000);
                
                setTimeout(() => {
                    // Oyun sonu ekranına geç
                    document.getElementById('oyun-screen').classList.add('gizli');
                    document.getElementById('oyun-sonu-screen').classList.remove('gizli');
                    document.getElementById('sonuc-mesaji').textContent = 'Tebrikler! Kazandınız!';
                }, 3000);
                
                return;
            }
            
            // Kombinasyonu silmeden önce mesaj göster
            if (gecerliGrup && gecerliPeriyot) {
                durumMesajiGoster('Grup VE Periyot kombinasyonu geçerli! Kartlar siliniyor...', '#008000');
            } else if (gecerliGrup) {
                durumMesajiGoster('Grup kombinasyonu geçerli! Kartlar siliniyor...', '#008000');
            } else {
                durumMesajiGoster('Periyot kombinasyonu geçerli! Kartlar siliniyor...', '#008000');
            }
            
            // Kombinasyondaki kartları sil
            setTimeout(() => {
                while (kombinasyonIcerik.firstChild) {
                    kombinasyonIcerik.removeChild(kombinasyonIcerik.firstChild);
                }
                
                // Kalan kart sayısını güncelle
                kalanKartSayisiniGuncelle(-kartElementleri.length);
                
                // Kombinasyondaki kartları temizle
                kombinasyondakiKartlar = [];
            }, 2000);
        } else {
            // Geçersiz kombinasyon, kartları oyuncuya geri ver
            durumMesajiGoster('Geçersiz kombinasyon! Kartlar geri veriliyor...', '#ff0000');
            
            setTimeout(() => {
                // Tüm kartları oyuncuya geri ver
                const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
                
                kartElementleri.forEach(kart => {
                    oyuncuKartlari.appendChild(kart);
                });
                
                // Kombinasyondaki kartları temizle
                kombinasyondakiKartlar = [];
            }, 2000);
        }
    }
    
    // Kombinasyon kontrol butonu
    document.getElementById('btn-kontrol-et').addEventListener('click', () => {
        console.log("Kombinasyon kontrol ediliyor...");
        kombinasyonuKontrolEt();
    });
    
    // Desteden kart çekme butonu
    document.getElementById('btn-desteyi-ac').addEventListener('click', () => {
        if (kartCekildi) {
            durumMesajiGoster("Her tur sadece bir kart çekebilirsiniz!", '#ff0000');
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
                durumMesajiGoster('Kart çektiniz. Şimdi bir kartı atın veya kombinasyon yapın.', '#000000');
                
                // Kalan kart sayısını güncelle
                kalanKartSayisiniGuncelle(-1);
            }
        }).catch(error => {
            console.error("Desteden kart çekerken hata oluştu:", error);
            durumMesajiGoster("Kart çekilirken bir hata oluştu.", '#ff0000');
        });
    });
    
    // Açık kartı alma butonu
    document.getElementById('btn-acik-karti-al').addEventListener('click', () => {
        if (kartCekildi) {
            durumMesajiGoster("Her tur sadece bir kart çekebilirsiniz!", '#ff0000');
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
                durumMesajiGoster('Açık kartı aldınız. Şimdi bir kartı atın veya kombinasyon yapın.', '#000000');
            }
        } else {
            durumMesajiGoster("Açık kart bulunmuyor!", '#ff0000');
        }
    });
    
    // Kart verme (elden atma) butonu
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
            
            // Sırayı botlara geç
            durumMesajiGoster('Kartınızı verdiniz. Sıra botlara geçiyor...', '#000000');
            
            // Kart çekme durumunu sıfırla - sonraki tur için hazır
            setTimeout(() => {
                // Botların hamlelerini simüle et (basit olarak)
                botHamleleriniSimuleEt();
            }, 2000);
        } else {
            durumMesajiGoster('Lütfen önce bir kart seçin!', '#ff0000');
        }
    });
    
    /**
     * Botların hamlelerini simüle et
     */
    function botHamleleriniSimuleEt() {
        const botSayisi = 3; // Varsayılan 3 bot
        let botIndex = 0;
        
        const botSimulasyonu = setInterval(() => {
            // Bot hamlesi yap
            durumMesajiGoster(`Bot ${botIndex + 1} hamle yapıyor...`, '#000080');
            
            botIndex++;
            
            // Tüm botlar hamle yaptığında oyuncuya geç
            if (botIndex >= botSayisi) {
                clearInterval(botSimulasyonu);
                
                setTimeout(() => {
                    durumMesajiGoster('Sıra size geldi!', '#008000');
                    turBaslat();
                }, 1000);
            }
        }, 1500);
    }
    
    console.log("Periyodik Okey oyunu hazır!");
}); 