/**
 * Periyodik Okey - Ana JavaScript Dosyası
 * Oyun başlangıcı ve genel kontroller
 */

// Element verileri
const ELEMENT_VERILERI = [
    { atom_no: 1, sembol: "H", isim: "Hidrojen", grup: 1, periyot: 1 },
    { atom_no: 2, sembol: "He", isim: "Helyum", grup: 18, periyot: 1 },
    { atom_no: 3, sembol: "Li", isim: "Lityum", grup: 1, periyot: 2 },
    { atom_no: 4, sembol: "Be", isim: "Berilyum", grup: 2, periyot: 2 },
    { atom_no: 5, sembol: "B", isim: "Bor", grup: 13, periyot: 2 },
    { atom_no: 6, sembol: "C", isim: "Karbon", grup: 14, periyot: 2 },
    { atom_no: 7, sembol: "N", isim: "Azot", grup: 15, periyot: 2 },
    { atom_no: 8, sembol: "O", isim: "Oksijen", grup: 16, periyot: 2 },
    { atom_no: 9, sembol: "F", isim: "Flor", grup: 17, periyot: 2 },
    { atom_no: 10, sembol: "Ne", isim: "Neon", grup: 18, periyot: 2 },
    { atom_no: 11, sembol: "Na", isim: "Sodyum", grup: 1, periyot: 3 },
    { atom_no: 12, sembol: "Mg", isim: "Magnezyum", grup: 2, periyot: 3 },
    { atom_no: 13, sembol: "Al", isim: "Alüminyum", grup: 13, periyot: 3 },
    { atom_no: 14, sembol: "Si", isim: "Silisyum", grup: 14, periyot: 3 },
    { atom_no: 15, sembol: "P", isim: "Fosfor", grup: 15, periyot: 3 },
    { atom_no: 16, sembol: "S", isim: "Kükürt", grup: 16, periyot: 3 },
    { atom_no: 17, sembol: "Cl", isim: "Klor", grup: 17, periyot: 3 },
    { atom_no: 18, sembol: "Ar", isim: "Argon", grup: 18, periyot: 3 },
    { atom_no: 19, sembol: "K", isim: "Potasyum", grup: 1, periyot: 4 },
    { atom_no: 20, sembol: "Ca", isim: "Kalsiyum", grup: 2, periyot: 4 }
];

// Element renkleri - grup bazında
const ELEMENT_RENKLERI = {
    1: "#ff9aa2", // Alkali Metaller
    2: "#ffb7b2", // Toprak Alkali Metaller
    13: "#ffdac1", // Boron Grubu
    14: "#e2f0cb", // Karbon Grubu
    15: "#b5ead7", // Nitrojen Grubu
    16: "#c7ceea", // Oksijen Grubu
    17: "#9fd8df", // Halojenler
    18: "#f2a2e8", // Soy Gazlar
};

// Oyun ayarları
const OYUN_AYARLARI = {
    botSayisi: 3,
    zorlukSeviyesi: 'orta',
    oyuncuIsmi: 'Oyuncu',
    sesEfektleri: true,
    muzik: true
};

// Sayfa tam olarak yüklendiğinde başla
document.addEventListener('DOMContentLoaded', () => {
    console.log("Periyodik Okey oyunu başlatılıyor...");
    
    // Oyun nesnesi
    let oyun = null;
    
    // Hata yakalama
    window.onerror = function(message, source, lineno, colno, error) {
        console.error(`HATA: ${message} - ${source}:${lineno}:${colno}`);
        return true;
    };
    
    // Ekranları gösterme/gizleme
    function ekraniGoster(ekranId) {
        document.querySelectorAll('.ekran').forEach(ekran => {
            ekran.classList.add('gizli');
        });
        document.getElementById(ekranId).classList.remove('gizli');
    }
    
    // Element kartı oluşturma fonksiyonu
    function elementKartiOlustur(element) {
        const kart = document.createElement('div');
        kart.className = 'element-kart';
        
        if (element.isJoker) {
            kart.classList.add('joker');
            
            const sembol = document.createElement('div');
            sembol.className = 'sembol';
            sembol.textContent = 'J';
            kart.appendChild(sembol);
            
            const isim = document.createElement('div');
            isim.className = 'isim';
            isim.textContent = 'JOKER';
            kart.appendChild(isim);
            
            kart.style.backgroundColor = "#fff2cc";
            kart.style.color = "#333";
        } else {
            // Atom Numarası
            const atomNo = document.createElement('div');
            atomNo.className = 'atom-no';
            atomNo.textContent = element.atom_no;
            kart.appendChild(atomNo);
            
            // Sembol
            const sembol = document.createElement('div');
            sembol.className = 'sembol';
            sembol.textContent = element.sembol;
            kart.appendChild(sembol);
            
            // İsim
            const isim = document.createElement('div');
            isim.className = 'isim';
            isim.textContent = element.isim;
            kart.appendChild(isim);
            
            // Grup-Periyot bilgisi
            const grupPeriyot = document.createElement('div');
            grupPeriyot.className = 'grup-periyot';
            grupPeriyot.textContent = `G:${element.grup} P:${element.periyot}`;
            kart.appendChild(grupPeriyot);
            
            // Renk
            const renk = elementRengiGetir(element);
            kart.style.backgroundColor = renk;
            
            // Yazı rengini ayarla
            const renkKoyulugu = hexRenkKoyulugu(renk);
            if (renkKoyulugu < 128) {
                kart.style.color = '#fff';
            } else {
                kart.style.color = '#333';
            }
        }
        
        // Kart ID'sini veri özelliği olarak ata
        kart.dataset.id = element.id;
        
        // Kart seçimi için tıklama olayı ekle
        kart.addEventListener('click', () => {
            kart.classList.toggle('secili');
            if (OYUN_AYARLARI.sesEfektleri) {
                oynatSesEfekti('kart-sec');
            }
        });
        
        return kart;
    }
    
    // Element için renk kodunu getir
    function elementRengiGetir(element) {
        return ELEMENT_RENKLERI[element.grup] || "#ffffff";
    }
    
    // Hex renk koyuluğunu hesapla
    function hexRenkKoyulugu(hex) {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        return (r * 299 + g * 587 + b * 114) / 1000;
    }
    
    // Ses efekti çal
    function oynatSesEfekti(sesAdi) {
        if (!OYUN_AYARLARI.sesEfektleri) return;
        
        // Ses efektleri burada eklenecek
        const sesler = {
            'kart-sec': 'click.mp3',
            'kart-cek': 'card-slide.mp3',
            'kombinasyon': 'success.mp3',
            'oyun-bitti': 'game-over.mp3'
        };
        
        // Uygun ses dosyası yoksa sessizce geri dön
        if (!sesler[sesAdi]) return;
        
        // İlerde ses sistemi entegre edildiğinde burası tamamlanacak
        console.log(`Ses çalınıyor: ${sesler[sesAdi]}`);
    }
    
    // Botları ayarla
    function botlariAyarla() {
        // Bot alanlarını göster/gizle
        document.querySelector('.bot2').classList.toggle('gizli', OYUN_AYARLARI.botSayisi < 2);
        document.querySelector('.bot3').classList.toggle('gizli', OYUN_AYARLARI.botSayisi < 3);
    }
    
    // Oyunu başlat
    function oyunuBaslat() {
        // Yeni oyun nesnesi oluştur
        oyun = new PeriyodikOkey();
        
        // Oyuncunun adını ayarla
        document.getElementById('oyuncu-isim-goster').textContent = OYUN_AYARLARI.oyuncuIsmi;
        
        // Botları ayarla
        botlariAyarla();
        
        // Oyunu başlat ve kartları al
        const oyunDurumu = oyun.oyunuBaslat(OYUN_AYARLARI.botSayisi);
        
        // Oyuncu kartlarını göster
        gosterOyuncuKartlari(oyunDurumu.oyuncuKartlari);
        
        // Bot kartlarını göster
        gosterBotKartlari(oyunDurumu.botKartSayilari);
        
        // Açık kartı göster
        acikKartiGuncelle();
        
        // Kalan kart sayısını güncelle
        document.getElementById('kalan-kart').textContent = oyunDurumu.kalanKart;
        
        // Durum mesajını güncelle
        document.getElementById('durum-mesaji').textContent = 'Sıra sizde! Kart çekiniz veya açık kartı alınız.';
        
        // Yıldızları güncelle
        yildizlariGuncelle();
        
        // Oyun ekranını göster
        ekraniGoster('oyun-screen');
        
        // Oyun kontrollerini göster
        setTimeout(() => {
            kontrollerPaneliniGoster();
        }, 500);
    }
    
    // Oyun kontrolleri panelini göster
    function kontrollerPaneliniGoster() {
        document.getElementById('kontroller-panel').classList.remove('gizli');
    }
    
    // Oyuncu kartlarını göster
    function gosterOyuncuKartlari(kartlar) {
        const oyuncuKartlariDiv = document.getElementById('oyuncu-kartlari');
        oyuncuKartlariDiv.innerHTML = '';
        
        kartlar.forEach(kart => {
            const kartElementi = elementKartiOlustur(kart);
            oyuncuKartlariDiv.appendChild(kartElementi);
        });
    }
    
    // Bot kartlarını göster
    function gosterBotKartlari(kartSayilari) {
        for (let i = 1; i <= OYUN_AYARLARI.botSayisi; i++) {
            const botDiv = document.getElementById(`bot${i}-kartlar`);
            botDiv.innerHTML = '';
            
            const kartSayisi = kartSayilari[i-1] || 0;
            for (let j = 0; j < kartSayisi; j++) {
                const kapaliKart = document.createElement('div');
                kapaliKart.className = 'element-kart arka-yuz';
                botDiv.appendChild(kapaliKart);
            }
        }
    }
    
    // Yıldızları güncelle
    function yildizlariGuncelle() {
        if (!oyun) return;
        
        // Oyuncu yıldızları
        const oyuncuYildiz = document.getElementById('oyuncu-yildizlar');
        const oyuncuYildizSayisi = oyun.oyuncuYildizlari.get('oyuncu') || 0;
        oyuncuYildiz.innerHTML = '';
        
        for (let i = 0; i < oyuncuYildizSayisi; i++) {
            const yildiz = document.createElement('span');
            yildiz.className = 'yildiz';
            yildiz.textContent = '⭐';
            oyuncuYildiz.appendChild(yildiz);
        }
        
        // Bot yıldızları
        for (let i = 1; i <= OYUN_AYARLARI.botSayisi; i++) {
            const botYildiz = document.getElementById(`bot${i}-yildizlar`);
            const botYildizSayisi = oyun.oyuncuYildizlari.get(`bot${i}`) || 0;
            botYildiz.innerHTML = '';
            
            for (let j = 0; j < botYildizSayisi; j++) {
                const yildiz = document.createElement('span');
                yildiz.className = 'yildiz';
                yildiz.textContent = '⭐';
                botYildiz.appendChild(yildiz);
            }
        }
    }
    
    // Açık kartı güncelle
    function acikKartiGuncelle() {
        const acikKartAlani = document.querySelector('.acik-kart-alani');
        acikKartAlani.innerHTML = '';
        
        if (oyun && oyun.acikKart) {
            const kartElementi = elementKartiOlustur(oyun.acikKart);
            acikKartAlani.appendChild(kartElementi);
        }
    }
    
    // Bot oyunu
    function botOyunu() {
        if (!oyun || oyun.siradakiOyuncu === 0) return;
        
        const botId = `bot${oyun.siradakiOyuncu}`;
        document.getElementById('durum-mesaji').textContent = `${botId.toUpperCase()} oynuyor...`;
        
        // Zamanlayıcı ile bot hamlesini yap
        setTimeout(() => {
            // Bot zorluk seviyesine göre hamle kalitesini ayarla
            oyun.botZorlukSeviyesi = OYUN_AYARLARI.zorlukSeviyesi;
            oyun.botHamlesiYap();
            
            if (OYUN_AYARLARI.sesEfektleri) {
                oynatSesEfekti('kart-cek');
            }
            
            // Bot kart sayılarını güncelle
            const botKartSayilari = Array.from(oyun.botKartlari.values()).map(kartlar => kartlar.length);
            gosterBotKartlari(botKartSayilari);
            
            // Açık kartı güncelle
            acikKartiGuncelle();
            
            // Yıldızları güncelle
            yildizlariGuncelle();
            
            // Oyun bitti mi kontrol et
            if (oyun.oyunDurumu === 'bitti') {
                oyunBitti();
                return;
            }
            
            // Sonraki bota geç veya oyuncuya geç
            if (oyun.siradakiOyuncu !== 0) {
                botOyunu();
            } else {
                document.getElementById('durum-mesaji').textContent = 'Sıra sizde! Kart çekiniz veya açık kartı alınız.';
            }
        }, 1000);
    }
    
    // Oyun bitti
    function oyunBitti() {
        let kazanan = '';
        let kazananYildiz = 0;
        
        // Ses efekti
        if (OYUN_AYARLARI.sesEfektleri) {
            oynatSesEfekti('oyun-bitti');
        }
        
        // Kazananı belirle
        oyun.oyuncuYildizlari.forEach((yildiz, oyuncu) => {
            if (yildiz >= 3 && yildiz > kazananYildiz) {
                kazanan = oyuncu;
                kazananYildiz = yildiz;
            }
        });
        
        // Sonuç mesajını oluştur
        let mesaj = '';
        if (kazanan === 'oyuncu') {
            mesaj = 'Tebrikler! Oyunu kazandınız!';
        } else {
            const botNumara = kazanan.replace('bot', '');
            mesaj = `Bot ${botNumara} oyunu kazandı!`;
        }
        
        // Skor listesini güncelle
        const skorListe = document.getElementById('skor-liste');
        skorListe.innerHTML = '';
        
        // Oyuncu ve botları yıldız sayısına göre sırala
        const siralama = [];
        siralama.push({
            isim: OYUN_AYARLARI.oyuncuIsmi,
            yildiz: oyun.oyuncuYildizlari.get('oyuncu') || 0,
            id: 'oyuncu'
        });
        
        for (let i = 1; i <= OYUN_AYARLARI.botSayisi; i++) {
            siralama.push({
                isim: `Bot ${i}`,
                yildiz: oyun.oyuncuYildizlari.get(`bot${i}`) || 0,
                id: `bot${i}`
            });
        }
        
        // Yıldız sayısına göre sırala (çoktan aza)
        siralama.sort((a, b) => b.yildiz - a.yildiz);
        
        // Skor listesini oluştur
        siralama.forEach((oyuncu, index) => {
            const satirDiv = document.createElement('div');
            satirDiv.className = 'skor-satir';
            
            // Kazanan için özel stil
            if (oyuncu.id === kazanan) {
                satirDiv.classList.add('skor-kazanan');
            }
            
            satirDiv.innerHTML = `
                <span>${index + 1}. ${oyuncu.isim}</span>
                <span>${oyuncu.yildiz} ⭐</span>
            `;
            
            skorListe.appendChild(satirDiv);
        });
        
        // Sonuç mesajını güncelle
        document.getElementById('sonuc-mesaji').textContent = mesaj;
        
        // Oyun sonu ekranını göster
        setTimeout(() => {
            ekraniGoster('oyun-sonu-screen');
        }, 1500);
    }
    
    // Desteden kart çekme
    document.getElementById('btn-desteyi-ac').addEventListener('click', () => {
        if (!oyun || oyun.siradakiOyuncu !== 0 || oyun.kartCekildi) {
            alert('Şu anda kart çekemezsiniz!');
            return;
        }
        
        try {
            const cekilenKart = oyun.kartiCek();
            oyuncuKartGuncelle();
            
            if (OYUN_AYARLARI.sesEfektleri) {
                oynatSesEfekti('kart-cek');
            }
            
            // Kalan kart sayısını güncelle
            document.getElementById('kalan-kart').textContent = oyun.deste.length;
            document.getElementById('durum-mesaji').textContent = 'Kart çektiniz. Şimdi bir kartı atın.';
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Açık kartı alma
    document.getElementById('btn-acik-karti-al').addEventListener('click', () => {
        if (!oyun || oyun.siradakiOyuncu !== 0 || oyun.kartCekildi || !oyun.acikKart) {
            alert('Şu anda açık kartı alamazsınız!');
            return;
        }
        
        try {
            const alinanKart = oyun.acikKartiAl();
            oyuncuKartGuncelle();
            acikKartiGuncelle();
            
            if (OYUN_AYARLARI.sesEfektleri) {
                oynatSesEfekti('kart-cek');
            }
            
            document.getElementById('durum-mesaji').textContent = 'Açık kartı aldınız. Şimdi bir kartı atın.';
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Oyuncu kartlarını güncelle
    function oyuncuKartGuncelle() {
        gosterOyuncuKartlari(oyun.oyuncuKartlari);
    }
    
    // Kart verme (elden atma)
    document.getElementById('btn-kart-ver').addEventListener('click', () => {
        if (!oyun || oyun.siradakiOyuncu !== 0 || !oyun.kartCekildi) {
            alert('Şu anda kart atamazsınız!');
            return;
        }
        
        const seciliKartlar = document.querySelectorAll('.element-kart.secili');
        if (seciliKartlar.length !== 1) {
            alert('Lütfen atmak için bir kart seçin!');
            return;
        }
        
        try {
            const seciliKartId = seciliKartlar[0].dataset.id;
            oyun.kartVer(seciliKartId);
            
            if (OYUN_AYARLARI.sesEfektleri) {
                oynatSesEfekti('kart-cek');
            }
            
            // Kartları güncelle
            oyuncuKartGuncelle();
            acikKartiGuncelle();
            
            // Durum mesajını güncelle
            document.getElementById('durum-mesaji').textContent = 'Sıra botlarda...';
            
            // Bot hamlelerini başlat
            botOyunu();
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Kombinasyon kontrolü
    document.getElementById('btn-kontrol-et').addEventListener('click', () => {
        if (!oyun) return;
        
        const seciliKartlar = Array.from(document.querySelectorAll('.element-kart.secili'))
            .map(kart => kart.dataset.id);
            
        if (seciliKartlar.length < 3) {
            alert('En az 3 kart seçmelisiniz!');
            return;
        }
        
        const kombinasyonGecerli = oyun.kombinasyonKontrolEt(seciliKartlar);
        if (kombinasyonGecerli) {
            seciliKartlar.forEach(kartId => {
                const kartIndex = oyun.oyuncuKartlari.findIndex(k => k.id === kartId);
                if (kartIndex !== -1) {
                    oyun.oyuncuKartlari.splice(kartIndex, 1);
                }
            });
            
            if (OYUN_AYARLARI.sesEfektleri) {
                oynatSesEfekti('kombinasyon');
            }
            
            // Yıldız ekle
            const kazandi = oyun.yildizEkle('oyuncu');
            
            // Oyuncu kartlarını güncelle
            oyuncuKartGuncelle();
            
            // Yıldızları güncelle
            yildizlariGuncelle();
            
            // Kazandı mı kontrol et
            if (kazandi) {
                oyunBitti();
            } else {
                alert('Tebrikler! Geçerli bir kombinasyon buldunuz ve bir yıldız kazandınız!');
            }
        } else {
            alert('Geçersiz kombinasyon! Kartlar aynı grupta veya aynı periyotta olmalıdır.');
        }
    });
    
    // Oyuna başla butonu
    document.getElementById('btn-oyuna-basla').addEventListener('click', () => {
        ekraniGoster('oyun-baslangic-screen');
    });
    
    // Oyunu başlat butonu
    document.getElementById('btn-oyunu-baslat').addEventListener('click', () => {
        // Seçilen ayarları al
        const botSayisi = document.querySelector('.secim-buton.secili[data-value="1"], .secim-buton.secili[data-value="2"], .secim-buton.secili[data-value="3"]').dataset.value;
        const zorluk = document.querySelector('.secim-buton.secili[data-value="kolay"], .secim-buton.secili[data-value="orta"], .secim-buton.secili[data-value="zor"]').dataset.value;
        const oyuncuIsmi = document.getElementById('baslangic-oyuncu-ismi').value.trim() || 'Oyuncu';
        
        // Ayarları güncelle
        OYUN_AYARLARI.botSayisi = parseInt(botSayisi, 10);
        OYUN_AYARLARI.zorlukSeviyesi = zorluk;
        OYUN_AYARLARI.oyuncuIsmi = oyuncuIsmi;
        
        // Yükleme ekranını göster
        ekraniGoster('yukleme-screen');
        
        // 3 saniye sonra oyunu başlat
        setTimeout(() => {
            oyunuBaslat();
        }, 3000);
    });
    
    // Başlangıç iptal butonu
    document.getElementById('btn-baslangic-iptal').addEventListener('click', () => {
        ekraniGoster('menu-screen');
    });
    
    // Seçim butonları için olay dinleyicileri
    document.querySelectorAll('.secim-buton').forEach(buton => {
        buton.addEventListener('click', function() {
            // Aynı gruptaki diğer butonlardan seçili sınıfını kaldır
            const grup = this.parentNode;
            grup.querySelectorAll('.secim-buton').forEach(b => {
                b.classList.remove('secili');
            });
            
            // Bu butona seçili sınıfını ekle
            this.classList.add('secili');
        });
    });
    
    // Ayarlar butonu
    document.getElementById('btn-ayarlar').addEventListener('click', () => {
        // Ayarlar ekranını aç
        ekraniGoster('ayarlar-screen');
        
        // Mevcut ayarları form alanlarına yükle
        document.getElementById('bot-sayisi').value = OYUN_AYARLARI.botSayisi;
        document.getElementById('zorluk-seviyesi').value = OYUN_AYARLARI.zorlukSeviyesi;
        document.getElementById('oyuncu-ismi').value = OYUN_AYARLARI.oyuncuIsmi;
        document.getElementById('ses-efektleri').checked = OYUN_AYARLARI.sesEfektleri;
        document.getElementById('muzik').checked = OYUN_AYARLARI.muzik;
    });
    
    // Ayarları kaydet butonu
    document.getElementById('btn-ayarlari-kaydet').addEventListener('click', () => {
        // Form değerlerini al
        OYUN_AYARLARI.botSayisi = parseInt(document.getElementById('bot-sayisi').value, 10);
        OYUN_AYARLARI.zorlukSeviyesi = document.getElementById('zorluk-seviyesi').value;
        OYUN_AYARLARI.oyuncuIsmi = document.getElementById('oyuncu-ismi').value.trim() || 'Oyuncu';
        OYUN_AYARLARI.sesEfektleri = document.getElementById('ses-efektleri').checked;
        OYUN_AYARLARI.muzik = document.getElementById('muzik').checked;
        
        // Ana menüye dön
        ekraniGoster('menu-screen');
    });
    
    // Ayarları iptal et butonu
    document.getElementById('btn-ayarlari-iptal').addEventListener('click', () => {
        // Ana menüye dön
        ekraniGoster('menu-screen');
    });
    
    // Oyundaki ayarlar butonu
    document.getElementById('btn-oyun-ayarlar').addEventListener('click', () => {
        if (confirm('Oyunu durdurarak ayarlara gitmek istiyor musunuz?')) {
            ekraniGoster('ayarlar-screen');
        }
    });
    
    // Kontroller kapat butonu
    document.getElementById('btn-kontroller-kapat').addEventListener('click', () => {
        document.getElementById('kontroller-panel').classList.add('gizli');
    });
    
    // Menüye dön butonu
    document.getElementById('btn-oyun-menu').addEventListener('click', () => {
        if (confirm('Oyunu yarıda bırakmak istediğinize emin misiniz?')) {
            ekraniGoster('menu-screen');
        }
    });
    
    // Tekrar oyna butonu
    document.getElementById('btn-tekrar-oyna').addEventListener('click', () => {
        oyunuBaslat();
    });
    
    // Ana menüye dön butonu (oyun sonu ekranından)
    document.getElementById('btn-ana-menuye-don').addEventListener('click', () => {
        ekraniGoster('menu-screen');
    });
    
    // Yardım butonu
    document.getElementById('btn-oyun-yardim').addEventListener('click', () => {
        alert(`Periyodik Okey Oyun Kuralları:

1. Her oyuncu 14 kart ile başlar
2. Sırayla ya desteden kart çekilir ya da açık kart alınır
3. Aynı grupta veya periyotta olan en az 3 kartı seçip "Kontrol Et" butonuna basın
4. Geçerli kombinasyon yaparsanız bir yıldız kazanırsınız
5. İlk 3 yıldıza ulaşan oyunu kazanır!

İpucu: Periyodik tabloda aynı grupta veya aynı periyotta olan elementleri bulmaya çalışın.`);
    });
});

// Global erişim için element verilerini ekleyelim
window.ELEMENT_VERILERI = ELEMENT_VERILERI; 