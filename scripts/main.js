/**
 * Periyodik Okey - Ana JavaScript Dosyası
 * Oyun başlangıcı ve genel kontroller
 */

// Sayfa tam olarak yüklendiğinde başla
document.addEventListener('DOMContentLoaded', () => {
    console.log("Periyodik Okey oyunu başlatılıyor...");
    
    // Butonları kontrol et
    butonlariKontrolEt();
    
    // Ses Yöneticisi Sınıfı
    class SesYoneticisi {
        constructor() {
            this.sesler = {};
            this.muzikCaliyor = false;
            this.sesEfektleriAcik = true;
            this.muzikAcik = true;
        }
        
        sesEkle(sesAdi, sesDosyasi) {
            if (!this.sesler[sesAdi]) {
                this.sesler[sesAdi] = new Audio(sesDosyasi);
            }
        }
        
        sesCal(sesAdi) {
            if (this.sesEfektleriAcik && this.sesler[sesAdi]) {
                this.sesler[sesAdi].currentTime = 0;
                this.sesler[sesAdi].play();
                return true;
            }
            return false;
        }
        
        sesKapat(sesAdi) {
            if (this.sesler[sesAdi]) {
                this.sesler[sesAdi].pause();
                this.sesler[sesAdi].currentTime = 0;
            }
        }
        
        sesAyarla(sesAdi, ozellik, deger) {
            if (this.sesler[sesAdi]) {
                this.sesler[sesAdi][ozellik] = deger;
            }
        }
        
        sesEfektleriniAc(durum) {
            this.sesEfektleriAcik = durum;
        }
        
        muzikAc(durum) {
            this.muzikAcik = durum;
            if (this.muzikCaliyor) {
                if (!durum) {
                    this.sesKapat('arkaplan_muzik');
                } else {
                    this.sesCal('arkaplan_muzik');
                }
            }
        }
    }
    
    // Ses yöneticisi oluştur
    const sesYoneticisi = new SesYoneticisi();
    
    // Global sesCal fonksiyonu tanımla
    window.sesCal = function(sesAdi) {
        return sesYoneticisi.sesCal(sesAdi);
    };
    
    // TEST: Butona doğrudan tıklama ekle - bu satırı daha sonra silebilirsiniz
    setTimeout(() => {
        console.log("TEST: Tüm butonları kontrol ediyorum...");
        
        // Ana menüdeki butonları kontrol et
        const butonlar = {
            'yeni-oyun-btn': document.getElementById('yeni-oyun-btn'),
            'istatistikler-btn': document.getElementById('istatistikler-btn'),
            'ayarlar-btn': document.getElementById('ayarlar-btn'),
            'nasil-oynanir-btn': document.getElementById('nasil-oynanir-btn')
        };
        
        // Butonları logla
        for (const [id, btn] of Object.entries(butonlar)) {
            console.log(`Buton ID: ${id}, Buton var mı: ${btn !== null}`);
            
            // Event listener'ları doğrudan ekle
            if (btn) {
                btn.onclick = function() {
                    console.log(`${id} butonuna tıklandı!`);
                    
                    // Ekran geçişleri
                    if (id === 'yeni-oyun-btn') {
                        document.getElementById('ana-menu-ekrani').classList.add('gizli');
                        document.getElementById('oyun-ekrani').classList.remove('gizli');
                        testKartlariOlustur();
                        turBaslat();
                    } else if (id === 'istatistikler-btn') {
                        document.getElementById('ana-menu-ekrani').classList.add('gizli');
                        document.getElementById('istatistikler-ekrani').classList.remove('gizli');
                    } else if (id === 'ayarlar-btn') {
                        document.getElementById('ana-menu-ekrani').classList.add('gizli');
                        document.getElementById('ayarlar-ekrani').classList.remove('gizli');
                    } else if (id === 'nasil-oynanir-btn') {
                        document.getElementById('ana-menu-ekrani').classList.add('gizli');
                        document.getElementById('nasil-oynanir-ekrani').classList.remove('gizli');
                    }
                };
            }
        }
        
        // Geri dönüş butonlarını kontrol et
        const geriButonlar = {
            'nasil-oynanir-geri-btn': document.getElementById('nasil-oynanir-geri-btn'),
            'istatistik-geri-btn': document.getElementById('istatistik-geri-btn'),
            'ayarlar-geri-btn': document.getElementById('ayarlar-geri-btn')
        };
        
        // Geri butonlarını logla
        for (const [id, btn] of Object.entries(geriButonlar)) {
            console.log(`Geri buton ID: ${id}, Buton var mı: ${btn !== null}`);
            
            // Event listener'ları doğrudan ekle
            if (btn) {
                btn.onclick = function() {
                    console.log(`${id} butonuna tıklandı!`);
                    
                    // Ekran geçişleri - tümü ana menüye dönüş
                    document.querySelectorAll('.ekran').forEach(ekran => {
                        ekran.classList.add('gizli');
                    });
                    document.getElementById('ana-menu-ekrani').classList.remove('gizli');
                };
            }
        }
    }, 1000); // 1 saniye bekletiyorum, DOM tamamen yüklensin
    
    // Oyun versiyonu
    const VERSION = "0.1.0";
    console.log(`Versiyon: ${VERSION}`);
    
    // Hata yakalama
    window.onerror = function(message, source, lineno, colno, error) {
        console.error(`HATA: ${message} - ${source}:${lineno}:${colno}`);
        return true;
    };
    
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
    
    // ElementKartiSinifi sınıfı tanımı
    class ElementKartiSinifi {
        constructor(elementData) {
            if (!elementData) {
                console.error("ElementKartiSinifi: Element verisi tanımlanmamış!");
                return;
            }
            
            this.id = elementData.id || elementData.atom_no || 0;
            this.sembol = elementData.sembol || "?";
            this.isim = elementData.isim || "Bilinmeyen";
            this.atomNumarasi = elementData.atomNumarasi || elementData.atom_no || 0;
            this.grupNumarasi = elementData.grupNumarasi || elementData.grup || 0;
            this.periyotNumarasi = elementData.periyotNumarasi || elementData.periyot || 0;
            this.grupTuru = elementData.grupTuru || elementData.element_turu || "Bilinmiyor";
            this.joker = elementData.joker || false;
        }
        
        /**
         * Kartın HTML temsilini oluşturur
         * @returns {HTMLElement} Kart div elementi
         */
        htmlOlustur(arkaYuz = false) {
            const kartDiv = document.createElement('div');
            kartDiv.className = 'element-kart' + (this.joker ? ' joker' : '') + (arkaYuz ? ' arka-yuz' : '');
            
            if (arkaYuz) {
                return kartDiv;
            }
            
            // Kart ID'si
            kartDiv.id = `kart-${this.id}-${Date.now().toString().slice(-4)}`;
            
            // Kart içeriği
            let renk = this.grupRenginiAl();
            kartDiv.style.backgroundColor = renk;
            kartDiv.style.color = this.kontrastRengiHesapla(renk);
            
            // Atom numarası
            const atomNoSpan = document.createElement('span');
            atomNoSpan.className = 'atom-no';
            atomNoSpan.textContent = this.atomNumarasi;
            kartDiv.appendChild(atomNoSpan);
            
            // Element sembolü
            const sembolDiv = document.createElement('div');
            sembolDiv.className = 'sembol';
            sembolDiv.textContent = this.sembol;
            kartDiv.appendChild(sembolDiv);
            
            // Element ismi
            const isimDiv = document.createElement('div');
            isimDiv.className = 'isim';
            isimDiv.textContent = this.isim;
            kartDiv.appendChild(isimDiv);
            
            // Grup ve periyot bilgisi
            const grupPeriyotDiv = document.createElement('div');
            grupPeriyotDiv.className = 'grup-periyot';
            grupPeriyotDiv.textContent = `G:${this.grupNumarasi} P:${this.periyotNumarasi}`;
            kartDiv.appendChild(grupPeriyotDiv);
            
            // Veri özelliklerini ekle
            kartDiv.dataset.atomNo = this.atomNumarasi;
            kartDiv.dataset.sembol = this.sembol;
            kartDiv.dataset.grup = this.grupNumarasi;
            kartDiv.dataset.periyot = this.periyotNumarasi;
            kartDiv.dataset.joker = this.joker;
            
            return kartDiv;
        }
        
        /**
         * Grup türüne göre renk kodu
         * @returns {string} Renk kodu
         */
        grupRenginiAl() {
            const renkler = {
                'Ametal': '#A0FFA0', // Açık yeşil
                'Soy Gaz': '#80FFFF', // Açık turkuaz
                'Alkali Metal': '#FF6666', // Açık kırmızı
                'Toprak Alkali Metal': '#FFDEAD', // Bej
                'Yarı Metal': '#CCCC99', // Açık kahverengi
                'Halojen': '#FFFF99', // Açık sarı
                'Metal': '#BFC7D5', // Açık gri
                'Geçiş Metali': '#FF9999', // Pembe
                'Lantanit': '#FFBFFF', // Mor
                'Aktinit': '#FF99CC', // Koyu pembe
                'Bilinmiyor': '#E8E8E8', // Gri
                'Joker': '#FFFFFF'  // Beyaz
            };
            
            return renkler[this.grupTuru] || '#CCCCCC';
        }
        
        /**
         * Arka plan rengine göre kontrast rengi hesaplar
         * @param {string} renk Hex renk kodu
         * @returns {string} Kontrast renk
         */
        kontrastRengiHesapla(renk) {
            // Hex rengini RGB'ye dönüştür
            let r = 0, g = 0, b = 0;
            // # ile başlıyorsa kaldır
            if (renk.startsWith('#')) {
                renk = renk.slice(1);
            }
            
            if (renk.length === 3) {
                r = parseInt(renk[0] + renk[0], 16);
                g = parseInt(renk[1] + renk[1], 16);
                b = parseInt(renk[2] + renk[2], 16);
            } else if (renk.length === 6) {
                r = parseInt(renk.slice(0, 2), 16);
                g = parseInt(renk.slice(2, 4), 16);
                b = parseInt(renk.slice(4, 6), 16);
            }
            
            // Kontrast değerini hesapla (YIQ formülü)
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return (yiq >= 128) ? '#000000' : '#FFFFFF';
        }
    }
    
    // Global olarak ElementKartiSinifi'ni tanımla
    window.ElementKartiSinifi = ElementKartiSinifi;
    
    // Sürükleme ile ilgili değişkenler
    let suruklenenKart = null;
    
    // Sürükleme işlevleri
    function handleDragStart(e) {
        this.classList.add('sürükleniyor');
        e.dataTransfer.setData('text/plain', e.target.id);
        e.dataTransfer.effectAllowed = 'move';
    }
    
    function handleDragEnd(e) {
        this.classList.remove('sürükleniyor');
    }
    
    // Kartları bırakma alanı işlevleri
    function setupDropZones() {
        const oyuncuEliAlani = document.getElementById('oyuncu-eli');
        const oyunAlani = document.getElementById('oyun-alani');
        
        // Oyuncu eli drop zone
        oyuncuEliAlani.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        oyuncuEliAlani.addEventListener('drop', function(e) {
            e.preventDefault();
            const kartId = e.dataTransfer.getData('text/plain');
            const kart = document.getElementById(kartId);
            
            if (kart && !oyuncuEliAlani.contains(kart)) {
                oyuncuEliAlani.appendChild(kart);
            }
        });
        
        // Oyun alanı drop zone
        oyunAlani.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        oyunAlani.addEventListener('drop', function(e) {
            e.preventDefault();
            const kartId = e.dataTransfer.getData('text/plain');
            const kart = document.getElementById(kartId);
            
            if (kart && !oyunAlani.contains(kart)) {
                oyunAlani.appendChild(kart);
            }
        });
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
        console.log("Test kartları oluşturuluyor...");
        
        // Hata yönetimi
        try {
            if (typeof ELEMENT_VERILERI_OKEY === 'undefined') {
                console.error("ELEMENT_VERILERI_OKEY tanımlı değil");
                // Direkt olarak global scope'ta al
                const elementVerileri = window.ELEMENT_VERILERI_OKEY || [
                    { atom_no: 1, sembol: "H", isim: "Hidrojen", grup: 1, periyot: 1, element_turu: "Ametal" },
                    { atom_no: 2, sembol: "He", isim: "Helyum", grup: 18, periyot: 1, element_turu: "Soy Gaz" },
                    { atom_no: 3, sembol: "Li", isim: "Lityum", grup: 1, periyot: 2, element_turu: "Alkali Metal" },
                    { atom_no: 8, sembol: "O", isim: "Oksijen", grup: 16, periyot: 2, element_turu: "Ametal" },
                    { atom_no: 11, sembol: "Na", isim: "Sodyum", grup: 1, periyot: 3, element_turu: "Alkali Metal" },
                    { atom_no: 19, sembol: "K", isim: "Potasyum", grup: 1, periyot: 4, element_turu: "Alkali Metal" }
                ];
                // Global scope'a kaydet
                window.ELEMENT_VERILERI_OKEY = elementVerileri;
            }
            
            const elementVerileri = window.ELEMENT_VERILERI_OKEY;
            console.log(`Kullanılabilir ${elementVerileri.length} element var`);
            
            // Oyuncu kartları alanını bul
            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
            if (!oyuncuKartlari) {
                console.error("Oyuncu kartları alanı bulunamadı!");
                return;
            }

            // Oyuncu kartlarını temizle
            oyuncuKartlari.innerHTML = '';

            // Belirli gruba ait kartlar oluştur - grup 1 (Alkali metaller)
            const grup1Elementleri = elementVerileri.filter(e => e.grup === 1).slice(0, 3);
            console.log(`Grup 1'den ${grup1Elementleri.length} element seçildi`);
            
            // Belirli periyota ait kartlar oluştur - periyot 2 (Li, Be, B, C, N, O, F, Ne)
            const periyot2Elementleri = elementVerileri.filter(e => e.periyot === 2).slice(0, 4);
            console.log(`Periyot 2'den ${periyot2Elementleri.length} element seçildi`);

            // Rastgele diğer kartlar
            const digerElementler = elementVerileri.filter(e => 
                !(grup1Elementleri.includes(e) || periyot2Elementleri.includes(e))
            ).sort(() => Math.random() - 0.5).slice(0, 7);
            console.log(`Diğer rastgele ${digerElementler.length} element seçildi`);

            // Tüm kartları birleştir (toplam 14 kart)
            const tumKartlar = [...grup1Elementleri, ...periyot2Elementleri, ...digerElementler];
            console.log(`Toplam ${tumKartlar.length} kart oluşturulacak`);
            
            // Kartları oluştur ve ekle
            tumKartlar.forEach(element => {
                try {
                    // ElementKartiSinifi constructor olmadığı durumda
                    // Basit bir obje oluştur ve kart olarak ekle
                    if (typeof ElementKartiSinifi !== 'function') {
                        console.warn("ElementKartiSinifi tanımlı değil, basit obje kullanılacak");
                        const kartDiv = document.createElement('div');
                        kartDiv.className = 'element-kart';
                        kartDiv.style.backgroundColor = '#A0FFA0';
                        kartDiv.style.color = '#000000';
                        
                        // Sembol
                        const sembolDiv = document.createElement('div');
                        sembolDiv.className = 'sembol';
                        sembolDiv.textContent = element.sembol;
                        kartDiv.appendChild(sembolDiv);
                        
                        // İsim
                        const isimDiv = document.createElement('div');
                        isimDiv.className = 'isim';
                        isimDiv.textContent = element.isim;
                        kartDiv.appendChild(isimDiv);
                        
                        // Grup ve periyot
                        const gpDiv = document.createElement('div');
                        gpDiv.className = 'grup-periyot';
                        gpDiv.textContent = `G:${element.grup} P:${element.periyot}`;
                        kartDiv.appendChild(gpDiv);
                        
                        // Dataset özellikleri
                        kartDiv.dataset.atomNo = element.atom_no;
                        kartDiv.dataset.sembol = element.sembol;
                        kartDiv.dataset.grup = element.grup;
                        kartDiv.dataset.periyot = element.periyot;
                        
                        // Seçim özelliği
                        kartDiv.addEventListener('click', function() {
                            document.querySelectorAll('.element-kart.secili').forEach(k => {
                                k.classList.remove('secili');
                            });
                            this.classList.toggle('secili');
                        });
                        
                        oyuncuKartlari.appendChild(kartDiv);
                    } else {
                        const kart = elementKartiOlusturDOM(element);
                        oyuncuKartlari.appendChild(kart);
                    }
                } catch (err) {
                    console.error(`Kart oluşturulurken hata: ${err.message}`);
                }
            });
            
            // Bot kartlarını oluştur (gizli)
            for (let i = 1; i <= 2; i++) {
                const botKartlari = document.getElementById(`bot${i}-kartlar`);
                if (!botKartlari) {
                    console.error(`Bot ${i} kartları alanı bulunamadı!`);
                    continue;
                }
                
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
            
            // Açık kart oluştur
            const acikKartAlani = document.getElementById('acik-kart');
            if (acikKartAlani) {
                acikKartAlani.innerHTML = '';
                
                // Rastgele bir element seç
                const randomIndex = Math.floor(Math.random() * elementVerileri.length);
                
                // ElementKartiSinifi yoksa basit bir kart oluştur
                if (typeof ElementKartiSinifi !== 'function') {
                    const element = elementVerileri[randomIndex];
                    const kartDiv = document.createElement('div');
                    kartDiv.className = 'element-kart';
                    kartDiv.style.backgroundColor = '#A0FFA0';
                    kartDiv.style.color = '#000000';
                    
                    // Sembol
                    const sembolDiv = document.createElement('div');
                    sembolDiv.className = 'sembol';
                    sembolDiv.textContent = element.sembol;
                    kartDiv.appendChild(sembolDiv);
                    
                    // İsim
                    const isimDiv = document.createElement('div');
                    isimDiv.className = 'isim';
                    isimDiv.textContent = element.isim;
                    kartDiv.appendChild(isimDiv);
                    
                    acikKartAlani.appendChild(kartDiv);
                } else {
                    const acikKart = elementKartiOlusturDOM(elementVerileri[randomIndex]);
                    acikKartAlani.appendChild(acikKart);
                }
            }
            
            // Kalan kart sayısını güncelle
            const kalanKartSpan = document.getElementById('kalan-kart');
            if (kalanKartSpan) {
                kalanKartSayisi = 100; // Demo için sabit değer
                kalanKartSpan.textContent = `Kalan: ${kalanKartSayisi}`;
            }
        } catch (error) {
            console.error("Test kartları oluşturulurken hata:", error);
            alert("Kartlar oluşturulurken bir hata oluştu: " + error.message);
        }
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
                document.getElementById('oyun-ekrani').classList.add('gizli');
                document.getElementById('oyun-sonu-ekrani').classList.remove('gizli');
                document.getElementById('sonuc-baslik').textContent = 'Tebrikler! Kazandınız!';
                document.getElementById('sonuc-detay').textContent = `Oyuncu: ${oyuncuYildizlari} yıldız | Bot 1: ${botYildizlari[0]} yıldız | Bot 2: ${botYildizlari[1]} yıldız`;
            }, 3000);
        } else if (botYildizlari.some(yildiz => yildiz >= 3)) {
            const kazananBotIndeks = botYildizlari.findIndex(yildiz => yildiz >= 3) + 1;
            durumMesajiGoster(`Bot ${kazananBotIndeks} oyunu kazandı!`, '#ff0000', 3000);
            setTimeout(() => {
                // Oyun sonu ekranına geç
                document.getElementById('oyun-ekrani').classList.add('gizli');
                document.getElementById('oyun-sonu-ekrani').classList.remove('gizli');
                document.getElementById('sonuc-baslik').textContent = `Bot ${kazananBotIndeks} oyunu kazandı!`;
                document.getElementById('sonuc-detay').textContent = `Oyuncu: ${oyuncuYildizlari} yıldız | Bot 1: ${botYildizlari[0]} yıldız | Bot 2: ${botYildizlari[1]} yıldız`;
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
            kalanKartSpan.textContent = `Kalan: ${kalanKartSayisi}`;
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
    if (document.getElementById('kontrol-et-btn')) {
        document.getElementById('kontrol-et-btn').addEventListener('click', () => {
            console.log("Kartlar kontrol ediliyor...");
            kartlariKontrolEt();
        });
    }
    
    // Desteden kart çekme butonu
    if (document.getElementById('kart-cek-btn')) {
        document.getElementById('kart-cek-btn').addEventListener('click', () => {
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
    }
    
    // Açık kartı alma butonu
    if (document.getElementById('acik-kart-al-btn')) {
        document.getElementById('acik-kart-al-btn').addEventListener('click', () => {
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
    }
    
    // Kart atma butonu
    if (document.getElementById('kart-at-btn')) {
        document.getElementById('kart-at-btn').addEventListener('click', () => {
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
    }
    
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
    document.getElementById('nasil-oynanir-btn').addEventListener('click', () => {
        document.getElementById('ana-menu-ekrani').classList.add('gizli');
        document.getElementById('nasil-oynanir-ekrani').classList.remove('gizli');
    });
    
    document.getElementById('istatistikler-btn').addEventListener('click', () => {
        document.getElementById('ana-menu-ekrani').classList.add('gizli');
        document.getElementById('istatistikler-ekrani').classList.remove('gizli');
    });
    
    document.getElementById('ayarlar-btn').addEventListener('click', () => {
        document.getElementById('ana-menu-ekrani').classList.add('gizli');
        document.getElementById('ayarlar-ekrani').classList.remove('gizli');
    });
    
    // Yeni oyun butonu
    document.getElementById('yeni-oyun-btn').addEventListener('click', () => {
        document.getElementById('ana-menu-ekrani').classList.add('gizli');
        document.getElementById('oyun-ekrani').classList.remove('gizli');
        
        // Test kartlarını oluştur
        testKartlariOlustur();
        
        // İlk tur başlat
        turBaslat();
    });
    
    // Ekranlardan ana menüye dönüş butonları
    document.querySelectorAll('.btn-geri').forEach(buton => {
        buton.addEventListener('click', () => {
            // Tüm ekranları gizle
            document.querySelectorAll('.ekran').forEach(ekran => {
                ekran.classList.add('gizli');
            });
            // Ana menüyü göster
            document.getElementById('ana-menu-ekrani').classList.remove('gizli');
        });
    });
    
    // Her ekrandaki geri butonlarına özel olay dinleyicileri
    if (document.getElementById('nasil-oynanir-geri-btn')) {
        document.getElementById('nasil-oynanir-geri-btn').addEventListener('click', () => {
            document.getElementById('nasil-oynanir-ekrani').classList.add('gizli');
            document.getElementById('ana-menu-ekrani').classList.remove('gizli');
        });
    }
    
    if (document.getElementById('istatistik-geri-btn')) {
        document.getElementById('istatistik-geri-btn').addEventListener('click', () => {
            document.getElementById('istatistikler-ekrani').classList.add('gizli');
            document.getElementById('ana-menu-ekrani').classList.remove('gizli');
        });
    }
    
    if (document.getElementById('ayarlar-geri-btn')) {
        document.getElementById('ayarlar-geri-btn').addEventListener('click', () => {
            document.getElementById('ayarlar-ekrani').classList.add('gizli');
            document.getElementById('ana-menu-ekrani').classList.remove('gizli');
        });
    }
    
    // Oyun ekranındaki butonlar
    if (document.getElementById('ana-menu-don-btn')) {
        document.getElementById('ana-menu-don-btn').addEventListener('click', () => {
            document.getElementById('oyun-ekrani').classList.add('gizli');
            document.getElementById('ana-menu-ekrani').classList.remove('gizli');
        });
    }
    
    if (document.getElementById('yardim-btn')) {
        document.getElementById('yardim-btn').addEventListener('click', () => {
            document.getElementById('oyun-ekrani').classList.add('gizli');
            document.getElementById('nasil-oynanir-ekrani').classList.remove('gizli');
        });
    }
    
    // Oyun sonu ekranındaki butonlar
    if (document.getElementById('yeni-oyun-baslat-btn')) {
        document.getElementById('yeni-oyun-baslat-btn').addEventListener('click', () => {
            document.getElementById('oyun-sonu-ekrani').classList.add('gizli');
            document.getElementById('oyun-ekrani').classList.remove('gizli');
            
            // Test kartlarını oluştur
            testKartlariOlustur();
            
            // İlk tur başlat
            turBaslat();
        });
    }
    
    if (document.getElementById('oyun-sonu-ana-menu-btn')) {
        document.getElementById('oyun-sonu-ana-menu-btn').addEventListener('click', () => {
            document.getElementById('oyun-sonu-ekrani').classList.add('gizli');
            document.getElementById('ana-menu-ekrani').classList.remove('gizli');
        });
    }
    
    // İstatistikler temizleme butonu
    if (document.getElementById('istatistik-temizle-btn')) {
        document.getElementById('istatistik-temizle-btn').addEventListener('click', () => {
            // İstatistikleri sıfırla
            const varsayilanIstatistikler = {
                oyunSayisi: 0,
                kazanmaSayisi: 0,
                kaybetmeSayisi: 0,
                toplamPuan: 0,
                enYuksekSkor: 0
            };
            
            localStorage.setItem('periyodikOkey_istatistikler', JSON.stringify(varsayilanIstatistikler));
            
            // Ekrandaki istatistikleri güncelle
            document.querySelectorAll('.istatistik-satir span:nth-child(2)').forEach(span => {
                span.textContent = '0';
            });
            document.getElementById('kazanma-orani').textContent = '0%';
            
            durumMesajiGoster('İstatistikler temizlendi', '#008000', 2000);
        });
    }
    
    console.log("Periyodik Okey oyunu hazır!");
}); 

// DOM tabanlı kart oluşturucu
function elementKartiOlusturDOM(element, takim = 1, joker = false) {
    if (!element) {
        console.error("elementKartiOlusturDOM: Element verisi tanımlanmamış!");
        return document.createElement('div');
    }
    
    try {
        // ElementKartiSinifi sınıfını kullanarak kart nesnesi oluştur
        const elementKarti = new ElementKartiSinifi(element);
        
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
        
        if (typeof handleDragStart === 'function' && typeof handleDragEnd === 'function') {
            kartDiv.addEventListener('dragstart', handleDragStart);
            kartDiv.addEventListener('dragend', handleDragEnd);
        }
        
        // Takım bilgisini ekle
        kartDiv.dataset.takim = takim;
        
        return kartDiv;
    } catch (error) {
        console.error("Kart oluşturma hatası:", error);
        return document.createElement('div');
    }
}

// Oyunu başlat
function oyunuBaslat() {
    // DOM elementlerini seç
    const oyuncuEliAlani = document.getElementById('oyuncu-eli');
    const oyunAlani = document.getElementById('oyun-alani');
    
    // Alanları temizle
    oyuncuEliAlani.innerHTML = '';
    oyunAlani.innerHTML = '';
    
    // Kartları karıştır ve dağıt
    const karisikElementler = karistir([...ELEMENT_VERILERI]);
    
    // Oyuncuya 7 kart dağıt
    for (let i = 0; i < 7; i++) {
        if (karisikElementler.length > 0) {
            const element = karisikElementler.pop();
            const kart = elementKartiOlusturDOM(element);
            oyuncuEliAlani.appendChild(kart);
        }
    }
    
    // Jokerleri ekle
    const jokerSayisi = 2;
    const karisikJokerler = karistir([...JOKER_VERILERI]);
    for (let i = 0; i < jokerSayisi; i++) {
        if (karisikJokerler.length > 0 && karisikElementler.length > 0) {
            // Jokeri rastgele bir pozisyona ekle
            const randomIndex = Math.floor(Math.random() * karisikElementler.length);
            karisikElementler.splice(randomIndex, 0, karisikJokerler[i]);
        }
    }
    
    // Drop zone ayarlarını yap
    setupDropZones();
}

// Diziyi karıştırma yardımcı fonksiyon
function karistir(dizi) {
    for (let i = dizi.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dizi[i], dizi[j]] = [dizi[j], dizi[i]];
    }
    return dizi;
}

// Sayfa yüklendiğinde oyunu başlat
document.addEventListener('DOMContentLoaded', function() {
    oyunuBaslat();
    
    // Yeni oyun başlatma düğmesi
    const yeniOyunBtn = document.getElementById('yeni-oyun-btn');
    if (yeniOyunBtn) {
        yeniOyunBtn.addEventListener('click', oyunuBaslat);
    }
}); 

// Tüm buton işlemlerini ayarla
function butonlariKontrolEt() {
    console.log("Butonlar kontrol ediliyor...");
    
    // Ana menü butonları
    const butonlar = {
        'yeni-oyun-btn': document.getElementById('yeni-oyun-btn'),
        'istatistikler-btn': document.getElementById('istatistikler-btn'),
        'ayarlar-btn': document.getElementById('ayarlar-btn'),
        'nasil-oynanir-btn': document.getElementById('nasil-oynanir-btn')
    };
    
    // Log butonları
    for (const [id, btn] of Object.entries(butonlar)) {
        console.log(`Buton ID: ${id}, Buton var mı: ${btn !== null}`);
        
        // Event listener'ları ekle
        if (btn) {
            btn.onclick = function() {
                console.log(`${id} butonuna tıklandı!`);
                
                // Ekran geçişleri
                if (id === 'yeni-oyun-btn') {
                    document.getElementById('ana-menu-ekrani').classList.add('gizli');
                    document.getElementById('oyun-ekrani').classList.remove('gizli');
                    testKartlariOlustur();
                    turBaslat();
                } else if (id === 'istatistikler-btn') {
                    document.getElementById('ana-menu-ekrani').classList.add('gizli');
                    document.getElementById('istatistikler-ekrani').classList.remove('gizli');
                } else if (id === 'ayarlar-btn') {
                    document.getElementById('ana-menu-ekrani').classList.add('gizli');
                    document.getElementById('ayarlar-ekrani').classList.remove('gizli');
                } else if (id === 'nasil-oynanir-btn') {
                    document.getElementById('ana-menu-ekrani').classList.add('gizli');
                    document.getElementById('nasil-oynanir-ekrani').classList.remove('gizli');
                }
            };
        }
    }
    
    // Geri butonları
    const geriButonlar = {
        'nasil-oynanir-geri-btn': document.getElementById('nasil-oynanir-geri-btn'),
        'istatistik-geri-btn': document.getElementById('istatistik-geri-btn'),
        'ayarlar-geri-btn': document.getElementById('ayarlar-geri-btn')
    };
    
    for (const [id, btn] of Object.entries(geriButonlar)) {
        console.log(`Geri buton ID: ${id}, Buton var mı: ${btn !== null}`);
        
        if (btn) {
            btn.onclick = function() {
                console.log(`${id} butonuna tıklandı!`);
                // Tüm ekranları gizle
                document.querySelectorAll('.ekran').forEach(ekran => {
                    ekran.classList.add('gizli');
                });
                // Ana menüyü göster
                document.getElementById('ana-menu-ekrani').classList.remove('gizli');
            };
        }
    }
    
    // Oyun içi butonlar
    const oyunButonlari = {
        'kart-cek-btn': document.getElementById('kart-cek-btn'),
        'acik-kart-al-btn': document.getElementById('acik-kart-al-btn'),
        'kart-at-btn': document.getElementById('kart-at-btn'),
        'kontrol-et-btn': document.getElementById('kontrol-et-btn'),
        'ana-menu-don-btn': document.getElementById('ana-menu-don-btn'),
        'yardim-btn': document.getElementById('yardim-btn')
    };
    
    for (const [id, btn] of Object.entries(oyunButonlari)) {
        console.log(`Oyun buton ID: ${id}, Buton var mı: ${btn !== null}`);
        
        if (btn) {
            if (id === 'kart-cek-btn') {
                btn.onclick = function() {
                    console.log("Kart çekiliyor...");
                    
                    // Kartları yokla
                    if (typeof ELEMENT_VERILERI_OKEY === 'undefined') {
                        console.error("Element verileri bulunamadı!");
                        return;
                    }
                    
                    // Rastgele bir element al
                    const randomIndex = Math.floor(Math.random() * ELEMENT_VERILERI_OKEY.length);
                    const element = ELEMENT_VERILERI_OKEY[randomIndex];
                    
                    // Oyuncu kartlarını bul
                    const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
                    if (!oyuncuKartlari) {
                        console.error("Oyuncu kartları alanı bulunamadı!");
                        return;
                    }
                    
                    // Kart HTML oluştur
                    const kartDiv = document.createElement('div');
                    kartDiv.className = 'element-kart';
                    kartDiv.style.backgroundColor = '#A0FFA0';
                    kartDiv.style.color = '#000000';
                    
                    // Sembol
                    const sembolDiv = document.createElement('div');
                    sembolDiv.className = 'sembol';
                    sembolDiv.textContent = element.sembol;
                    kartDiv.appendChild(sembolDiv);
                    
                    // İsim
                    const isimDiv = document.createElement('div');
                    isimDiv.className = 'isim';
                    isimDiv.textContent = element.isim;
                    kartDiv.appendChild(isimDiv);
                    
                    // Grup ve periyot
                    const gpDiv = document.createElement('div');
                    gpDiv.className = 'grup-periyot';
                    gpDiv.textContent = `G:${element.grup} P:${element.periyot}`;
                    kartDiv.appendChild(gpDiv);
                    
                    // Dataset
                    kartDiv.dataset.atomNo = element.atom_no;
                    kartDiv.dataset.sembol = element.sembol;
                    kartDiv.dataset.grup = element.grup;
                    kartDiv.dataset.periyot = element.periyot;
                    
                    // Seçim özelliği
                    kartDiv.addEventListener('click', function() {
                        document.querySelectorAll('.element-kart.secili').forEach(k => {
                            k.classList.remove('secili');
                        });
                        this.classList.toggle('secili');
                    });
                    
                    oyuncuKartlari.appendChild(kartDiv);
                    
                    // Kalan kart sayısını güncelle
                    const kalanKartSpan = document.getElementById('kalan-kart');
                    if (kalanKartSpan) {
                        const kalan = parseInt(kalanKartSpan.textContent.replace('Kalan: ', '')) - 1;
                        kalanKartSpan.textContent = `Kalan: ${kalan}`;
                    }
                    
                    durumMesajiGoster('Kart çektiniz. Şimdi bir kart atın veya kombinasyonları kontrol edin.', '#000000');
                };
            } else if (id === 'kontrol-et-btn') {
                btn.onclick = function() {
                    console.log("Kartlar kontrol ediliyor...");
                    kartlariKontrolEt();
                };
            } else if (id === 'ana-menu-don-btn') {
                btn.onclick = function() {
                    document.getElementById('oyun-ekrani').classList.add('gizli');
                    document.getElementById('ana-menu-ekrani').classList.remove('gizli');
                };
            } else if (id === 'yardim-btn') {
                btn.onclick = function() {
                    document.getElementById('oyun-ekrani').classList.add('gizli');
                    document.getElementById('nasil-oynanir-ekrani').classList.remove('gizli');
                };
            }
        }
    }
} 