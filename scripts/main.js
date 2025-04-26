/**
 * Periyodik Okey - Ana JavaScript Dosyası
 * Oyun başlangıcı ve genel kontroller
 */

// Temel Element Verileri
const ELEMENT_VERILERI_ANA = [
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

// Element renkleri
const ELEMENT_RENKLERI = {
    1: "#ff9aa2", 
    2: "#ffb7b2", 
    13: "#ffdac1", 
    14: "#e2f0cb", 
    15: "#b5ead7", 
    16: "#c7ceea", 
    17: "#9fd8df", 
    18: "#f2a2e8"
};

// Oyun ayarları
const OYUN_AYARLARI = {
    botSayisi: 3,
    zorlukSeviyesi: 'orta',
    oyuncuIsmi: 'Oyuncu',
    sesEfektleri: true,
    muzik: true
};

// Oyun değişkenleri
let oyun;
let secilenKart = null;
let oyuncuSirasi = true;

// Sürükle-bırak işlemleri için gerekli değişkenler
let sürüklenenKart = null;
let başlangıçX, başlangıçY;

// Kartlara sürüklenebilir özelliği ekle
function kartlarıSürüklenebilirYap() {
    const kartlar = document.querySelectorAll('.kart');
    
    kartlar.forEach(kart => {
        kart.setAttribute('draggable', 'true');
        
        kart.addEventListener('dragstart', (e) => {
            sürüklenenKart = kart;
            kart.classList.add('sürüklenen');
            
            // Sürüklenen kartın indeksini ve verilerini sakla
            e.dataTransfer.setData('text/plain', kart.dataset.index);
            e.dataTransfer.effectAllowed = 'move';
            
            // Başlangıç konumunu kaydet
            başlangıçX = e.clientX;
            başlangıçY = e.clientY;
        });
        
        kart.addEventListener('dragend', () => {
            kart.classList.remove('sürüklenen');
            sürüklenenKart = null;
        });
    });
}

// Hedef alanları ayarla
function hedefAlanlarıAyarla() {
    const hedefAlanlar = document.querySelectorAll('.sürükle-hedef');
    
    hedefAlanlar.forEach(alan => {
        alan.addEventListener('dragover', (e) => {
            e.preventDefault();
            alan.classList.add('üzerinde');
        });
        
        alan.addEventListener('dragleave', () => {
            alan.classList.remove('üzerinde');
        });
        
        alan.addEventListener('drop', (e) => {
            e.preventDefault();
            alan.classList.remove('üzerinde');
            
            if (!sürüklenenKart) return;
            
            const kartIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
            
            // Hedef alana göre işlem yap
            if (alan.id === 'acik-kart-alani') {
                kartAt(kartIndex);
            } else if (alan.id === 'oyuncu-kartlari') {
                // Oyuncuya kart ekleme işlemi
            } else if (alan.id === 'cek-alani') {
                // Çek alanına kart bırakma
            }
        });
    });
}

// Sayfa yüklendiğinde çalıştırılacak
document.addEventListener('DOMContentLoaded', function() {
    console.log("Periyodik Okey oyunu yükleniyor...");
    
    // JavaScript hata yakalamayı etkinleştir
    window.onerror = function(message, source, lineno, colno, error) {
        console.error(`HATA: ${message} - ${source}:${lineno}:${colno}`);
        return true;
    };
    
    // Ekranları gösterme/gizleme
    function ekraniGoster(ekranId) {
        console.log("Ekran değiştiriliyor: " + ekranId);
        document.querySelectorAll('.ekran').forEach(ekran => {
            ekran.classList.add('gizli');
            ekran.style.display = 'none';
        });
        const ekran = document.getElementById(ekranId);
        if (ekran) {
            ekran.classList.remove('gizli');
            ekran.style.display = 'block';
        } else {
            console.error(`Ekran bulunamadı: ${ekranId}`);
        }
    }
    
    // Global erişim için ekraniGoster fonksiyonunu dışa açalım
    window.ekraniGoster = ekraniGoster;
    
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
            const renk = ELEMENT_RENKLERI[element.grup] || "#ffffff";
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
        const bot2 = document.querySelector('.bot2');
        const bot3 = document.querySelector('.bot3');
        
        if (bot2) bot2.classList.toggle('gizli', OYUN_AYARLARI.botSayisi < 2);
        if (bot3) bot3.classList.toggle('gizli', OYUN_AYARLARI.botSayisi < 3);
    }
    
    // Yardım sayfasını göster
    document.getElementById('btn-yardim').addEventListener('click', () => {
        ekraniGoster('yardim-screen');
    });
    
    // Yardım sayfasından ana menüye dön
    document.getElementById('btn-yardim-kapat').addEventListener('click', () => {
        ekraniGoster('menu-screen');
    });
    
    // Puanlama sistemi
    let skor = 0;
    
    function skoruGuncelle(puan) {
        skor += puan;
        
        // Puan değişikliğini göster
        const skorElement = document.getElementById('oyuncu-skor');
        skorElement.textContent = skor;
        
        // Puan değişikliği animasyonu ekle
        if (puan > 0) {
            skorElement.classList.add('skor-artis');
            setTimeout(() => {
                skorElement.classList.remove('skor-artis');
            }, 1000);
            
            // Puan kazanma sesi çal
            if (OYUN_AYARLARI.sesEfektleri) {
                skorSound.currentTime = 0;
                skorSound.play();
            }
        }
    }
    
    function skoruSifirla() {
        skor = 0;
        document.getElementById('oyuncu-skor').textContent = "0";
    }
    
    // Ses efektleri
    const skorSound = new Audio('sounds/score.mp3');
    const moveSound = new Audio('sounds/move.mp3');
    const winSound = new Audio('sounds/win.mp3');
    const loseSound = new Audio('sounds/lose.mp3');
    
    // Ses çalma fonksiyonu
    function sesCal(sesType) {
        if (!OYUN_AYARLARI.sesEfektleri) return;
        
        switch(sesType) {
            case 'skor':
                skorSound.currentTime = 0;
                skorSound.play();
                break;
            case 'hamle':
                moveSound.currentTime = 0;
                moveSound.play();
                break;
            case 'kazanma':
                winSound.currentTime = 0;
                winSound.play();
                break;
            case 'kaybetme':
                loseSound.currentTime = 0;
                loseSound.play();
                break;
        }
    }
    
    // Oyun başlatma fonksiyonu
    async function oyunuBaslat() {
        console.log('Oyun başlatılıyor...');
        
        // Yükleme mesajını göster
        document.getElementById('durum-mesaji').textContent = "Oyun yükleniyor...";
        
        try {
            // CSV'den element verilerini yükle
            const elementVerileri = await elementVerileriniYukle();
            
            if (!elementVerileri || elementVerileri.length === 0) {
                throw new Error("Element verileri yüklenemedi!");
            }
            
            // Oyun nesnesi
            oyun = new PeriyodikOkey();
            oyun.elementVerileri = elementVerileri;
            
            // Zorluk seviyesini ayarla
            oyun.botZorlukSeviyesi = OYUN_AYARLARI.zorlukSeviyesi;
            
            // Oyunu başlat
            const oyunDurumu = oyun.oyunuBaslat(OYUN_AYARLARI.botSayisi);
            
            // Oyuncu adını göster
            const oyuncuIsimElement = document.getElementById('oyuncu-isim-goster');
            if (oyuncuIsimElement) {
                oyuncuIsimElement.textContent = OYUN_AYARLARI.oyuncuIsmi;
            }
            
            // Bot alanlarını güncelle
            botlariAyarla();
            
            // Oyuncu kartlarını göster
            gosterOyuncuKartlari(oyunDurumu.oyuncuKartlari);
            
            // Kalan kart sayısını güncelle
            const kalanKartElement = document.getElementById('kalan-kart');
            if (kalanKartElement) {
                kalanKartElement.textContent = oyunDurumu.kalanKart || elementVerileri.length;
            }
            
            // Açık kartı göster
            acikKartiGuncelle();
            
            // Başlangıçta sadece Kontrol Et butonu aktif olsun
            document.getElementById('btn-kart-al').disabled = false;
            document.getElementById('btn-kontrol-et').disabled = false;
            document.getElementById('btn-kart-at').disabled = true;
            document.getElementById('btn-geri-koy').disabled = true;
            document.getElementById('btn-kart-at').classList.add('gizli');
            document.getElementById('btn-geri-koy').classList.add('gizli');
            
            // Yıldızları sıfırla
            yildizlariGuncelle();
            
            // "Oyun başlıyor..." mesajını kaldır
            document.getElementById('oyun-yukleniyor').style.display = 'none';
            
            // Durum mesajını güncelle
            document.getElementById('durum-mesaji').textContent = "Sıra sizde. Desteden kart çekin veya açık kartı alın.";
            
            // Oyun ekranını göster
            ekraniGoster('oyun-screen');
            
            console.log('Oyun başlatıldı!');
        } catch (error) {
            console.error('Oyun başlatılırken hata oluştu:', error);
            document.getElementById('durum-mesaji').textContent = "Oyun başlatılırken bir hata oluştu: " + error.message;
        }
    }
    
    // Oyuncu elini güncelleme
    function oyuncuEliniGuncelle() {
        const oyuncuKartlariElement = document.getElementById('oyuncu-kartlari');
        oyuncuKartlariElement.innerHTML = '';
        
        // Tüm kartları göster
        oyun.oyuncuKartlari.forEach((kart, index) => {
            const kartElement = elementKartiOlustur(kart);
            kartElement.dataset.index = index;
            oyuncuKartlariElement.appendChild(kartElement);
        });
        
        // Kartlara tıklama olayı ekle
        document.querySelectorAll('#oyuncu-kartlari .kart').forEach(kart => {
            kart.addEventListener('click', kartSec);
        });
        
        // Kartları sürüklenebilir yap
        kartlarıSürüklenebilirYap();
        
        // Eğer elde sadece bir kart kaldıysa, "Son Kartı Bota Ver" butonunu göster
        if (oyun.oyuncuKartlari.length === 1) {
            document.getElementById('btn-son-karti-ver').classList.remove('gizli');
        } else {
            document.getElementById('btn-son-karti-ver').classList.add('gizli');
        }
    }
    
    // Orta alanı güncelleme
    function ortaAlaniGuncelle() {
        // Açık kart güncelleme
        const acikKart = oyun.acikKartiAl();
        const acikKartDiv = document.getElementById('acik-kart');
        
        if (acikKart) {
            acikKartDiv.innerHTML = '';
            
            const kartDiv = document.createElement('div');
            kartDiv.className = 'kart';
            kartDiv.dataset.atomNo = acikKart.atomNo;
            
            const renk = ELEMENT_RENKLERI[acikKart.grup];
            kartDiv.style.backgroundColor = renk || '#ccc';
            
            kartDiv.innerHTML = `
                <div class="kart-baslik">${acikKart.sembol}</div>
                <div class="kart-atomno">${acikKart.atomNo}</div>
                <div class="kart-isim">${acikKart.isim}</div>
                <div class="kart-detay">Grup: ${acikKart.grup}, Periyot: ${acikKart.periyot}</div>
            `;
            
            acikKartDiv.appendChild(kartDiv);
        } else {
            acikKartDiv.innerHTML = '<div class="kart bos">Henüz açık kart yok</div>';
        }
        
        // Kalan kart sayısı güncelleme
        const kalanKartSayisi = oyun.kalanKartSayisiniAl();
        document.getElementById('kalan-kart-sayisi').textContent = kalanKartSayisi;
        
        // Bot bilgilerini güncelle
        const botDurumlar = oyun.botDurumlariniAl();
        
        botDurumlar.forEach((botDurum, index) => {
            const botNumara = index + 1;
            if (botNumara <= OYUN_AYARLARI.botSayisi) {
                const botYildizlar = document.querySelector(`#bot-${botNumara} .bot-yildizlar`);
                const yildizMetni = '★'.repeat(botDurum.yildizlar);
                botYildizlar.textContent = yildizMetni;
                
                const botKartSayisi = document.querySelector(`#bot-${botNumara} .bot-kart-sayisi`);
                botKartSayisi.textContent = `${botDurum.kartSayisi} kart`;
            }
        });
    }
    
    // Kart seçme
    function kartSec(event) {
        const kartDiv = event.target.closest('.kart');
        if (!kartDiv) return;
        
        const kartIndex = parseInt(kartDiv.dataset.index, 10);
        
        // Daha önce seçili kart varsa temizle
        const oncekiSeciliKart = document.querySelector('.kart.secili');
        if (oncekiSeciliKart) {
            oncekiSeciliKart.classList.remove('secili');
        }
        
        // Aynı karta tıklandıysa seçimi kaldır
        if (secilenKart === kartIndex) {
            secilenKart = null;
            document.getElementById('btn-kart-at').disabled = true;
            document.getElementById('btn-kart-at').classList.add('gizli');
            document.getElementById('btn-geri-koy').disabled = true;
            document.getElementById('btn-geri-koy').classList.add('gizli');
        } else {
            // Yeni kartı seç
            secilenKart = kartIndex;
            kartDiv.classList.add('secili');
            
            // Kart atma butonlarını göster
            if (oyuncuSirasi) {
                document.getElementById('btn-kart-at').disabled = false;
                document.getElementById('btn-kart-at').classList.remove('gizli');
                document.getElementById('btn-geri-koy').disabled = false;
                document.getElementById('btn-geri-koy').classList.remove('gizli');
            }
        }
    }
    
    // Kombinasyon kontrol
    function kombinasyonKontrol() {
        const kombinasyonlar = oyun.kombinasyonlariKontrolEt();
        
        if (kombinasyonlar.length > 0) {
            let mesaj = "Kombinasyonlar:\n\n";
            
            kombinasyonlar.forEach((komb, index) => {
                mesaj += `${index + 1}. ${komb.tur}: `;
                
                const elementler = komb.kartlar.map(k => `${k.sembol} (${k.atomNo})`).join(', ');
                mesaj += elementler + "\n";
            });
            
            alert(mesaj);
        } else {
            alert("Henüz geçerli bir kombinasyon yok.");
        }
    }
    
    // Kart çekme
    function kartCek() {
        console.log('Kart çekiliyor...');
        
        try {
            const cekilenKart = oyun.kartiCek();
            console.log('Çekilen kart:', cekilenKart);
            
            // Oyuncu elini güncelle
            gosterOyuncuKartlari(oyun.oyuncuKartlari);
            
            // Durum mesajını güncelle
            const durumMesajiElement = document.getElementById('durum-mesaji');
            if (durumMesajiElement) {
                durumMesajiElement.textContent = "Kart çektiniz. Şimdi bir kart atın.";
            }
            
            // Kartı at butonunu aktif et
            const btnKartVer = document.getElementById('btn-kart-ver');
            if (btnKartVer) {
                btnKartVer.disabled = false;
            }
            
        } catch (error) {
            const durumMesajiElement = document.getElementById('durum-mesaji');
            if (durumMesajiElement) {
                durumMesajiElement.textContent = error.message;
            }
        }
    }
    
    // Açık kart alma
    function acikKartAl() {
        console.log('Açık kart alınıyor...');
        
        try {
            const alinanKart = oyun.acikKartiAl();
            console.log('Alınan kart:', alinanKart);
            
            // Oyuncu elini güncelle
            gosterOyuncuKartlari(oyun.oyuncuKartlari);
            
            // Durum mesajını güncelle
            const durumMesajiElement = document.getElementById('durum-mesaji');
            if (durumMesajiElement) {
                durumMesajiElement.textContent = "Açık kartı aldınız. Şimdi bir kart atın.";
            }
            
            // Kartı at butonunu aktif et
            const btnKartVer = document.getElementById('btn-kart-ver');
            if (btnKartVer) {
                btnKartVer.disabled = false;
            }
            
        } catch (error) {
            const durumMesajiElement = document.getElementById('durum-mesaji');
            if (durumMesajiElement) {
                durumMesajiElement.textContent = error.message;
            }
        }
    }
    
    // Kart atma
    function kartAt(kartIndex) {
        if (!oyuncuSirasi) {
            alert("Şu an sizin sıranız değil!");
            return;
        }
        
        if (secilenKart === null) {
            alert("Lütfen atmak için bir kart seçin!");
            return;
        }
        
        // Kartı at
        oyun.kartAt(secilenKart);
        secilenKart = null;
        
        // UI güncelle
        oyuncuEliniGuncelle();
        ortaAlaniGuncelle();
        
        // Sırayı güncelle
        oyuncuSirasi = false;
        document.getElementById('btn-kart-cek').disabled = true;
        document.getElementById('btn-acik-kart-al').disabled = true;
        document.getElementById('btn-kart-at').disabled = true;
        
        // Bot hamlelerini başlat
        setTimeout(() => {
            oyun.botlariOynat();
            siraDurumunuGuncelle();
            
            // UI güncelle
            oyuncuEliniGuncelle();
            ortaAlaniGuncelle();
        }, 1000);
    }
    
    // Sıra durumunu güncelleme
    function siraDurumunuGuncelle() {
        const siradakiOyuncu = oyun.siradakiOyuncuyuAl();
        
        if (siradakiOyuncu === 'oyuncu') {
            oyuncuSirasi = true;
            document.getElementById('oyuncu-el').classList.add('aktif');
            document.getElementById('btn-kart-cek').disabled = false;
            document.getElementById('btn-acik-kart-al').disabled = false;
            
            // Oyuncu bilgilendirme
            document.getElementById('oyun-durum-mesaji').textContent = "Sizin sıranız! Kart çekin veya açık kartı alın.";
        } else {
            oyuncuSirasi = false;
            document.getElementById('oyuncu-el').classList.remove('aktif');
            document.getElementById('btn-kart-cek').disabled = true;
            document.getElementById('btn-acik-kart-al').disabled = true;
            document.getElementById('btn-kart-at').disabled = true;
            
            // Oyuncu bilgilendirme
            document.getElementById('oyun-durum-mesaji').textContent = `${siradakiOyuncu} oynuyor...`;
        }
    }
    
    // Oyun sonucu işleme
    function oyunSonucu(kazanan, puan) {
        let sonucMesaji;
        
        if (kazanan === 'oyuncu') {
            sonucMesaji = `Tebrikler! Kazandınız.`;
        } else if (kazanan.startsWith('bot')) {
            sonucMesaji = `${kazanan} kazandı. Oyunu kaybettiniz.`;
        } else {
            sonucMesaji = 'Oyun berabere bitti.';
        }
        
        setTimeout(() => {
            alert(sonucMesaji);
            
            // Ana menüye dön
            ekraniGoster('menu-screen');
        }, 1000);
    }
    
    // Oyunu durdur
    document.getElementById('btn-oyunu-bitir').addEventListener('click', () => {
        if (confirm('Oyunu bitirmek istediğinize emin misiniz?')) {
            ekraniGoster('menu-screen');
            if (oyun) {
                oyun = null;
            }
        }
    });
    
    // İlk ekran olarak ana menüyü göster
    ekraniGoster('menu-screen');
    
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
        const seciliBotSayisi = document.querySelector('.secim-buton.secili[data-value="1"], .secim-buton.secili[data-value="2"], .secim-buton.secili[data-value="3"]');
        const seciliZorluk = document.querySelector('.secim-buton.secili[data-value="kolay"], .secim-buton.secili[data-value="orta"], .secim-buton.secili[data-value="zor"]');
        
        if (seciliBotSayisi && seciliZorluk) {
            // Ayarları güncelle
            OYUN_AYARLARI.botSayisi = parseInt(seciliBotSayisi.dataset.value, 10);
            OYUN_AYARLARI.zorlukSeviyesi = seciliZorluk.dataset.value;
            OYUN_AYARLARI.oyuncuIsmi = document.getElementById('baslangic-oyuncu-ismi').value.trim() || 'Oyuncu';
            
            // Yükleme ekranını göster
            ekraniGoster('yukleme-screen');
            
            // 3 saniye sonra oyunu başlat
            setTimeout(() => {
                oyunuBaslat();
            }, 3000);
        }
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
    
    // Ekranın görünürlük sorununu düzelt
    function ekraniGetir(ekranId) {
        document.querySelectorAll('.ekran').forEach(ekran => {
            ekran.classList.add('gizli');
            ekran.style.display = 'none';
        });
        const ekran = document.getElementById(ekranId);
        ekran.classList.remove('gizli');
        ekran.style.display = 'block';
    }

    // Görünürlük sorunu düzeltmesi için başlangıçta ana menüyü göster
    ekraniGetir('menu-screen');
    
    // Olay dinleyicilerini ekle
    eventListenerleriEkle();
});

// Global erişim için element verilerini ekleyelim
window.ELEMENT_VERILERI_ANA = ELEMENT_VERILERI_ANA; 
// Event Listeners
function eventListenerleriEkle() {
    // Ana menü butonları
    document.getElementById('btn-oyuna-basla').addEventListener('click', () => {
        ekraniGoster('oyun-baslangic-screen');
    });
    
    document.getElementById('btn-ayarlar').addEventListener('click', () => {
        ekraniGoster('ayarlar-screen');
    });
    
    document.getElementById('btn-oyun-yardim').addEventListener('click', () => {
        ekraniGoster('kontroller-panel');
    });
    
    // Oyun başlangıç ekranı butonları
    document.getElementById('btn-oyunu-baslat').addEventListener('click', () => {
        // Ayarları güncelle
        OYUN_AYARLARI.botSayisi = parseInt(document.querySelector('.secim-buton.secili[data-value]').dataset.value);
        OYUN_AYARLARI.zorlukSeviyesi = document.querySelector('.secim-buton.secili[data-value]').dataset.value;
        OYUN_AYARLARI.oyuncuIsmi = document.getElementById('baslangic-oyuncu-ismi').value || 'Oyuncu';
        
        // Yükleme ekranını göster
        ekraniGoster('yukleme-screen');
        
        // Yükleme animasyonu
        const yuklemeIlerleyis = document.querySelector('.yukleme-ilerleyis');
        yuklemeIlerleyis.style.width = '0%';
        
        const yuklemeInterval = setInterval(() => {
            const genislik = parseInt(yuklemeIlerleyis.style.width);
            if (genislik >= 100) {
                clearInterval(yuklemeInterval);
                oyunuBaslat();
            } else {
                yuklemeIlerleyis.style.width = (genislik + 1) + '%';
            }
        }, 20);
    });
    
    // Ayarlar ekranı butonları
    document.getElementById('btn-ayarlari-kaydet').addEventListener('click', () => {
        OYUN_AYARLARI.botSayisi = parseInt(document.getElementById('bot-sayisi').value);
        OYUN_AYARLARI.zorlukSeviyesi = document.getElementById('zorluk-seviyesi').value;
        OYUN_AYARLARI.oyuncuIsmi = document.getElementById('oyuncu-ismi').value || 'Oyuncu';
        OYUN_AYARLARI.sesEfektleri = document.getElementById('ses-efektleri').checked;
        OYUN_AYARLARI.muzik = document.getElementById('muzik').checked;
        
        ekraniGoster('menu-screen');
    });
    
    // Kart işlem butonları
    document.getElementById('btn-kart-al').addEventListener('click', kartCek);
    document.getElementById('btn-kontrol-et').addEventListener('click', kombinasyonKontrol);
    document.getElementById('btn-kart-at').addEventListener('click', kartAt);
    document.getElementById('btn-geri-koy').addEventListener('click', kartiGeriKoy);
    
    // Diğer butonlar
    document.getElementById('btn-kontroller-kapat').addEventListener('click', () => {
        document.getElementById('kontroller-panel').classList.add('gizli');
    });
    
    // Hedef alanları ayarla
    hedefAlanlarıAyarla();
}

// Kartı geri koyma fonksiyonu
function kartiGeriKoy() {
    if (secilenKart === null) {
        document.getElementById('durum-mesaji').textContent = "Lütfen önce bir kart seçin.";
        return;
    }
    
    document.getElementById('btn-kart-at').classList.add('gizli');
    document.getElementById('btn-geri-koy').classList.add('gizli');
    
    document.getElementById('durum-mesaji').textContent = "Kart geri konuldu. Lütfen başka bir kart seçin.";
    
    // Seçimi temizle
    const seciliKart = document.querySelector('.kart.secili');
    if (seciliKart) {
        seciliKart.classList.remove('secili');
    }
    secilenKart = null;
}

// Olay dinleyicilerini ekle ve başlangıç ekranını göster
document.addEventListener('DOMContentLoaded', function() {
    eventListenerleriEkle();
    ekraniGoster('menu-screen');
}); 
