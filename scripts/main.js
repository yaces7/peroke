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
    
    // Global değişkenler
    let oyuncuYildizlari = 0;
    let botYildizlari = [0, 0, 0]; // 3 bot için yıldız sayıları
    let kalanKartSayisi = 56; // Toplam kart sayısı (14 kart x 4 oyuncu = 56)
    
    /**
     * Test amaçlı belirli grup ve periyot örüntüsüne sahip kartlar oluşturur
     */
    function testKartlariOlustur() {
        elementVerileriniYukle().then(elementVerileri => {
            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
            if (!oyuncuKartlari) return;

            // Oyuncu kartlarını temizle
            oyuncuKartlari.innerHTML = '';

            // Belirli gruba ait kartlar oluştur (örn: grup 1)
            const grup1Elementleri = elementVerileri.filter(e => e.grup === 1).slice(0, 3);
            
            // Belirli periyota ait kartlar oluştur (örn: periyot 2)
            const periyot2Elementleri = elementVerileri.filter(e => e.periyot === 2).slice(0, 4);

            // Rastgele diğer kartlar
            const digerElementler = elementVerileri.filter(e => 
                !(grup1Elementleri.includes(e) || periyot2Elementleri.includes(e))
            ).sort(() => Math.random() - 0.5).slice(0, 7);

            // Tüm kartları birleştir ve karıştır (toplam 14 kart)
            const tumKartlar = [...grup1Elementleri, ...periyot2Elementleri, ...digerElementler];
            
            // Kartları oluştur ve ekle
            tumKartlar.forEach(element => {
                const kart = elementKartiOlusturDOM(element);
                oyuncuKartlari.appendChild(kart);
            });
            
            // Bot kartlarını oluştur (gizli)
            for (let i = 1; i <= 3; i++) {
                const botKartlari = document.getElementById(`bot${i}-alani`).querySelector('.bot-kartlar');
                botKartlari.innerHTML = '';
                
                // Her bota 14 kart ekle
                for (let j = 0; j < 14; j++) {
                    const gizliKart = document.createElement('div');
                    gizliKart.className = 'element-kart arka-yuz';
                    gizliKart.style.width = '40px';
                    gizliKart.style.height = '60px';
                    gizliKart.style.margin = '2px';
                    botKartlari.appendChild(gizliKart);
                }
            }
            
            // Kalan kart sayısını güncelle
            document.getElementById('kalan-kart').textContent = kalanKartSayisi - 56; // 56 kart dağıtıldı
        });
    }
    
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
     * Yıldız kazanma animasyonu
     * @param {number} oyuncuIndeksi - Yıldız kazanan oyuncu indeksi (0=oyuncu, 1-3=botlar)
     */
    function yildizKazanmaAnimasyonu(oyuncuIndeksi) {
        const yildizElement = document.createElement('div');
        yildizElement.className = 'yildiz-animasyon';
        yildizElement.innerHTML = '⭐';
        yildizElement.style.position = 'absolute';
        yildizElement.style.fontSize = '60px';
        yildizElement.style.opacity = '0';
        yildizElement.style.transition = 'all 1s ease';
        yildizElement.style.zIndex = '1000';
        yildizElement.style.color = '#FFD700';
        yildizElement.style.textShadow = '0 0 20px #FFD700';
        
        // Animasyonun başlayacağı konum
        if (oyuncuIndeksi === 0) {
            // Oyuncu alanının ortası
            const oyuncuAlani = document.querySelector('.oyuncu-alani');
            const rect = oyuncuAlani.getBoundingClientRect();
            yildizElement.style.left = `${rect.left + rect.width/2 - 30}px`;
            yildizElement.style.top = `${rect.top + rect.height/2 - 30}px`;
        } else {
            // Bot alanının ortası
            const botAlani = document.getElementById(`bot${oyuncuIndeksi}-alani`);
            const rect = botAlani.getBoundingClientRect();
            yildizElement.style.left = `${rect.left + rect.width/2 - 30}px`;
            yildizElement.style.top = `${rect.top + rect.height/2 - 30}px`;
        }
        
        document.body.appendChild(yildizElement);
        
        // Yıldızı görünür yap ve yukarı doğru hareket ettir
        setTimeout(() => {
            yildizElement.style.opacity = '1';
            yildizElement.style.transform = 'translateY(-50px) scale(1.5)';
        }, 100);
        
        // Yıldızı kaldır
        setTimeout(() => {
            yildizElement.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(yildizElement);
            }, 1000);
        }, 1500);
        
        // Yıldız sayısını güncelle
        if (oyuncuIndeksi === 0) {
            oyuncuYildizlari++;
            document.getElementById('oyuncu-puan').textContent = oyuncuYildizlari;
        } else {
            botYildizlari[oyuncuIndeksi-1]++;
            document.getElementById(`bot${oyuncuIndeksi}-puan`).textContent = botYildizlari[oyuncuIndeksi-1];
        }
        
        // 3 yıldız kazandıysa oyunu kazandı
        if (oyuncuYildizlari >= 3) {
            durumMesajiGoster('Tebrikler! Oyunu kazandınız!', '#008000', 3000);
            setTimeout(() => {
                // Oyun sonu ekranına geç
                document.getElementById('oyun-screen').classList.add('gizli');
                document.getElementById('oyun-sonu-screen').classList.remove('gizli');
                document.getElementById('sonuc-mesaji').textContent = 'Tebrikler! Kazandınız!';
            }, 3000);
        } else if (botYildizlari.some(yildiz => yildiz >= 3)) {
            const kazananBotIndeks = botYildizlari.findIndex(yildiz => yildiz >= 3) + 1;
            durumMesajiGoster(`Bot ${kazananBotIndeks} oyunu kazandı!`, '#ff0000', 3000);
            setTimeout(() => {
                // Oyun sonu ekranına geç
                document.getElementById('oyun-screen').classList.add('gizli');
                document.getElementById('oyun-sonu-screen').classList.remove('gizli');
                document.getElementById('sonuc-mesaji').textContent = `Bot ${kazananBotIndeks} oyunu kazandı!`;
            }, 3000);
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
     * Oyuncu kartlarını kontrol et ve kombinasyonları bul
     */
    function kartlariKontrolEt() {
        const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
        if (!oyuncuKartlari) return;
        
        // Oyuncu kartlarını al
        const kartElementleri = oyuncuKartlari.querySelectorAll('.element-kart');
        if (kartElementleri.length === 0) {
            durumMesajiGoster('Kartınız yok!', '#ff0000');
            return;
        }
        
        // Kart verilerini al ve grupla
        const kartDataMap = new Map(); // Kart element -> HTML element
        
        // Grup ve periyot olarak grupla
        const kartGruplari = {};
        const kartPeriyotlari = {};
        
        kartElementleri.forEach(kart => {
            const grup = kart.dataset.grup;
            const periyot = kart.dataset.periyot;
            
            // Joker kartlar için kontrol
            if (kart.dataset.joker === 'true') {
                return;
            }
            
            // Kartı veri yapısında sakla
            kartDataMap.set(kart.dataset.atomNo, kart);
            
            // Grup bazlı sınıflandırma
            if (!kartGruplari[grup]) {
                kartGruplari[grup] = [];
            }
            kartGruplari[grup].push(kart);
            
            // Periyot bazlı sınıflandırma
            if (!kartPeriyotlari[periyot]) {
                kartPeriyotlari[periyot] = [];
            }
            kartPeriyotlari[periyot].push(kart);
        });
        
        // Geçerli grup ve periyot kombinasyonlarını bul
        const gecerliGruplar = [];
        const gecerliPeriyotlar = [];
        
        // Grupları kontrol et (en az 3 kart)
        Object.entries(kartGruplari).forEach(([grup, kartlar]) => {
            if (kartlar.length >= 3) {
                gecerliGruplar.push(kartlar);
            }
        });
        
        // Periyotları kontrol et (en az 4 kart)
        Object.entries(kartPeriyotlari).forEach(([periyot, kartlar]) => {
            if (kartlar.length >= 4) {
                gecerliPeriyotlar.push(kartlar);
            }
        });
        
        // Hiç kombinasyon yoksa bildir
        if (gecerliGruplar.length === 0 && gecerliPeriyotlar.length === 0) {
            durumMesajiGoster('Geçerli bir kombinasyon bulunamadı!', '#ff0000');
            return;
        }
        
        // Oyuncu kartlarından sadece biri kalacak şekilde kartları işaretle
        const kalacakKart = kartElementleri[0]; // İlk kartı koru
        const silinecekKartlar = [];
        
        // Tüm geçerli kombinasyonlardaki kartları işaretle (ilki hariç)
        const islemGorenKartlar = new Set();
        
        // Önce grupları işle
        gecerliGruplar.forEach(grup => {
            grup.forEach(kart => {
                if (!islemGorenKartlar.has(kart.dataset.atomNo) && kart !== kalacakKart) {
                    islemGorenKartlar.add(kart.dataset.atomNo);
                    silinecekKartlar.push(kart);
                    // Kartı vurgula
                    kart.style.border = '3px solid #00ff00';
                }
            });
        });
        
        // Sonra periyotları işle
        gecerliPeriyotlar.forEach(periyot => {
            periyot.forEach(kart => {
                if (!islemGorenKartlar.has(kart.dataset.atomNo) && kart !== kalacakKart) {
                    islemGorenKartlar.add(kart.dataset.atomNo);
                    silinecekKartlar.push(kart);
                    // Kartı vurgula
                    kart.style.border = '3px solid #00ff00';
                }
            });
        });
        
        // Grup + periyot kombinasyonu varsa hamleyi geçerli say
        if (gecerliGruplar.length > 0 && gecerliPeriyotlar.length > 0 && silinecekKartlar.length >= kartElementleri.length - 1) {
            durumMesajiGoster('Grup VE Periyot kombinasyonu bulundu!', '#008000');
            
            // Animasyon ve kart silme işlemi
            setTimeout(() => {
                silinecekKartlar.forEach(kart => {
                    // Patlama efekti
                    kart.style.transform = 'scale(1.5)';
                    kart.style.opacity = '0';
                    setTimeout(() => {
                        kart.remove();
                    }, 500);
                });
                
                // Yıldız kazanımı
                setTimeout(() => {
                    yildizKazanmaAnimasyonu(0); // Oyuncu için
                }, 600);
            }, 1000);
        } 
        // Sadece bir tür kombinasyon var
        else if (silinecekKartlar.length > 0) {
            // Kombinasyonu göster ama silme (yeterli değil)
            durumMesajiGoster('Kombinasyon bulundu, ancak grup VE periyot kombinasyonu gerekli!', '#ff8800');
            
            // Kartların vurgusunu kaldır
            setTimeout(() => {
                silinecekKartlar.forEach(kart => {
                    kart.style.border = '';
                });
            }, 2000);
        }
    }
    
    // Kombinasyon kontrol butonu
    document.getElementById('btn-kontrol-et').addEventListener('click', () => {
        console.log("Kartlar kontrol ediliyor...");
        kartlariKontrolEt();
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
                durumMesajiGoster('Kart çektiniz. Şimdi bir kartı atın veya kombinasyonları kontrol edin.', '#000000');
            
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
                durumMesajiGoster('Açık kartı aldınız. Şimdi kartlarınızı kontrol edin veya bir kart atın.', '#000000');
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
            
            // Rastgele olarak bot kartlarını kontrol et ve kombinasyon bul
            const rastgeleSayi = Math.random();
            
            // Yaklaşık %15 ihtimalle bot bir kombinasyon yapabilir
            if (rastgeleSayi < 0.15) {
                // Bot kombinasyon yaptı ve bir yıldız kazandı
                setTimeout(() => {
                    durumMesajiGoster(`Bot ${botIndex + 1} kombinasyon yaptı!`, '#ff8800');
                    
                    // Bot kartlarının sayısını 1 azalt
                    const botKartlari = document.querySelector(`#bot${botIndex + 1}-alani .bot-kartlar`);
                    const botKartElementleri = botKartlari.querySelectorAll('.element-kart');
                    
                    // Kartların birçoğunu sil (sadece 1 kart kalacak şekilde)
                    const silinecekKartSayisi = botKartElementleri.length - 1;
                    
                    for (let i = 0; i < silinecekKartSayisi; i++) {
                        if (botKartElementleri[i]) {
                            // Patlama efekti
                            botKartElementleri[i].style.transform = 'scale(1.5)';
                            botKartElementleri[i].style.opacity = '0';
                            setTimeout(() => {
                                botKartElementleri[i].remove();
                            }, 500);
                        }
                    }
                    
                    // Yıldız kazanımı
                    setTimeout(() => {
                        yildizKazanmaAnimasyonu(botIndex + 1);
                    }, 600);
                }, 1000);
            }
            
            botIndex++;
            
            // Tüm botlar hamle yaptığında oyuncuya geç
            if (botIndex >= botSayisi) {
                clearInterval(botSimulasyonu);
                
                setTimeout(() => {
                    durumMesajiGoster('Sıra size geldi!', '#008000');
                    turBaslat();
                }, 1000);
            }
        }, 2500);
    }
    
    // Oyun başlangıcında
    document.getElementById('btn-oyuna-basla').addEventListener('click', () => {
        document.getElementById('menu-screen').classList.add('gizli');
        document.getElementById('oyun-screen').classList.remove('gizli');
        
        // Test kartlarını oluştur
        testKartlariOlustur();
        
        // İlk tur başlat
        turBaslat();
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
    
    console.log("Periyodik Okey oyunu hazır!");
}); 