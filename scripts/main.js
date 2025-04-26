/**
 * Periyodik Okey - Ana JavaScript Dosyası
 * Elementleri CSV'den yükleme, minimalist tasarım ve doğru kart görünümü sağlayan oyun
 */

// Oyun sınıfı tanımı - globals
let oyun = null;
let elementVerileri = [];
let seciliKartlar = [];

// Oyun ayarları
const OYUN_AYARLARI = {
    botSayisi: 3,
    zorlukSeviyesi: 'orta',
    oyuncuIsmi: 'Oyuncu',
    sesEfektleri: true,
    muzik: true
};

// Element renkleri - grup bazında
const ELEMENT_RENKLERI = {
    '1A': "#ff9aa2", // Alkali Metaller
    '2A': "#ffb7b2", // Toprak Alkali Metaller
    '3A': "#ffdac1", // Boron Grubu
    '4A': "#e2f0cb", // Karbon Grubu
    '5A': "#b5ead7", // Nitrojen Grubu
    '6A': "#c7ceea", // Oksijen Grubu
    '7A': "#9fd8df", // Halojenler
    '8A': "#f2a2e8", // Soy Gazlar
    '3B': "#ffccdc", // Geçiş Metalleri
    '4B': "#ffcce5",
    '5B': "#ffcced",
    '6B': "#ffcce0",
    '7B': "#ffccd6",
    '8B': "#ffcccc",
    '1B': "#e5ffcc",
    '2B': "#d6ffcc",
    'LN': "#cdfbe7", // Lantanitler
    'AN': "#cdc9ff"  // Aktinitler
};

// Elementleri CSV'den yükle
async function elementleriYukle() {
    try {
        const response = await fetch('elementler.csv');
        const csvData = await response.text();
        
        const rows = csvData.split('\n').filter(row => row.trim() !== '');
        const headers = rows[0].split(',');
        
        elementVerileri = rows.slice(1).map((row, index) => {
            const values = row.split(',');
            return {
                atom_no: parseInt(values[0]),
                sembol: values[1],
                isim: values[2],
                grup: values[3],
                periyot: parseInt(values[4]),
                grup_turu: values[5],
                id: `${values[0]}_${Math.floor(Math.random() * 10000)}`
            };
        });
        
        console.log(`${elementVerileri.length} element yüklendi.`);
        return elementVerileri;
    } catch (error) {
        console.error('Elementler yüklenirken hata oluştu:', error);
        // Hata durumunda varsayılan elementleri kullan
        return varsayilanElementleriGetir();
    }
}

// Varsayılan elementleri oluştur (CSV yüklenemezse)
function varsayilanElementleriGetir() {
    const varsayilanElementler = [];
    
    for (let i = 1; i <= 20; i++) {
        varsayilanElementler.push({
            atom_no: i,
            sembol: `E${i}`,
            isim: `Element ${i}`,
            grup: '1A',
            periyot: Math.ceil(i / 8),
            grup_turu: 'Bilinmiyor',
            id: `${i}_${Math.floor(Math.random() * 10000)}`
        });
    }
    
    return varsayilanElementler;
}
    
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

// Element kartı oluşturma
function elementKartiOlustur(element, boyut = 1.0) {
        const kart = document.createElement('div');
        kart.className = 'element-kart';
    kart.dataset.id = element.id;
        
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
    }
    
    // Boyut ayarla (botlar için daha küçük)
    if (boyut !== 1.0) {
        kart.style.transform = `scale(${boyut})`;
        kart.style.margin = '2px';
        kart.style.transformOrigin = 'center center';
    }
    
    // Oyuncu kartlarına tıklama özelliği ekle
    if (boyut === 1.0) {
        kart.addEventListener('click', function() {
            kartiSec(this);
        });
    }
        
        return kart;
    }
    
// Kart seçimi
function kartiSec(kartElement) {
    const kartId = kartElement.dataset.id;
    
    // Kartı seçme/seçimi kaldırma
    if (kartElement.classList.contains('secili')) {
        kartElement.classList.remove('secili');
        seciliKartlar = seciliKartlar.filter(id => id !== kartId);
    } else {
        kartElement.classList.add('secili');
        seciliKartlar.push(kartId);
    }
    
    // Butonların durumunu güncelle
    butonlariGuncelle();
}

// Butonların durumunu güncelle
function butonlariGuncelle() {
    const btnKontrolEt = document.getElementById('btn-kontrol-et');
    const btnKartVer = document.getElementById('btn-kart-ver');
    const btnSonKartiVer = document.getElementById('btn-son-karti-ver');
    
    // Oyuncu aktif değilse tüm butonları devre dışı bırak
    const oyuncuAktif = oyun && oyun.oyunDurumuGetir().aktifOyuncu === 0;
    
    if (!oyuncuAktif) {
        if (btnKontrolEt) btnKontrolEt.disabled = true;
        if (btnKartVer) btnKartVer.disabled = true;
        if (btnSonKartiVer) btnSonKartiVer.disabled = true;
        return;
    }
    
    // Kart çekilmiş mi kontrolü
    const kartCekilmis = oyun && oyun.oyuncuKartCekildi;
    
    if (seciliKartlar.length >= 3) {
        if (btnKontrolEt) btnKontrolEt.disabled = false;
    } else {
        if (btnKontrolEt) btnKontrolEt.disabled = true;
    }
    
    if (seciliKartlar.length === 1 && kartCekilmis) {
        if (btnKartVer) btnKartVer.disabled = false;
    } else {
        if (btnKartVer) btnKartVer.disabled = true;
    }
    
    // Son kartı ver butonu
    if (oyun && oyun.oyuncuKartlari && oyun.oyuncuKartlari.length === 1) {
        if (btnSonKartiVer) {
            btnSonKartiVer.classList.remove('gizli');
        }
    } else {
        if (btnSonKartiVer) {
            btnSonKartiVer.classList.add('gizli');
        }
    }
}

// Oyuncu kartlarını göster
function oyuncuKartlariniGoster(kartlar) {
    const oyuncuKartlariDiv = document.getElementById('oyuncu-kartlari');
    if (oyuncuKartlariDiv) {
        oyuncuKartlariDiv.innerHTML = '';
        
        kartlar.forEach(kart => {
            const kartElement = elementKartiOlustur(kart);
            oyuncuKartlariDiv.appendChild(kartElement);
        });
    }
    
    // Butonları güncelle
    butonlariGuncelle();
}

// Bot kartlarını göster
function botKartlariniGoster(botId, kartSayisi) {
    const botKartlarDiv = document.getElementById(`bot${botId}-kartlar`);
    if (botKartlarDiv) {
        botKartlarDiv.innerHTML = '';
        
        // Mini kart arka yüzleri oluştur
        for (let i = 0; i < kartSayisi; i++) {
            const botKart = document.createElement('div');
            botKart.className = 'element-kart arka-yuz';
            botKartlarDiv.appendChild(botKart);
        }
    }
}

// Bot mesajı oluştur
function botMesajiGoster(botId, mesajTipi = 'normal') {
    // Her seferinde 1/5 ihtimalle mesaj gönder
    if (Math.random() > 0.2) return;
    
    const botBilgi = document.querySelector(`.bot-bilgi:has(+ #bot${botId}-kartlar)`);
    if (!botBilgi) return;
    
    // Mevcut bot mesajı varsa sil
    const eskiMesaj = botBilgi.querySelector('.bot-mesaj');
    if (eskiMesaj) {
        eskiMesaj.remove();
    }
    
    // Bot puanına göre mesajlar
    const botPuani = (oyun.botPuanlari[botId] || 0);
    const kartSayisi = oyun.botKartlari[botId]?.length || 0;
    
    // Mesaj setleri
    const mesajlar = {
        kazanmaya_yakin: [
            'Sadece 1 yıldız daha!',
            'Kazanmak üzereyim!',
            'Çok yakındayım...',
            'Bu el benim!',
            'Neredeyse bitti!'
        ],
        iyi_durum: [
            'İyi gidiyorum!',
            'Durumum fena değil!',
            'Yıldızları topluyorum!',
            'Yakında kazanırım!'
        ],
        normal: [
            'Hmmm, ne yapmalıyım?',
            'Düşünüyorum...',
            'Şansım bugün nasıl?',
            'Bakalım ne olacak',
            'İyi bir el olabilir'
        ],
        kotu_durum: [
            'Bu kartlar hiç iyi değil!',
            'Şansım kötü bugün...',
            'Daha iyi bir el bekliyordum',
            'Zor bir durumdayım'
        ]
    };
    
    // Mesaj tipini seç (bot durumuna göre)
    let secilmisMesajTipi = mesajTipi;
    
    if (botPuani === 2) {
        secilmisMesajTipi = 'kazanmaya_yakin';
    } else if (botPuani === 1 || (kartSayisi <= 8 && botPuani > 0)) {
        secilmisMesajTipi = 'iyi_durum';
    } else if (kartSayisi >= 16) {
        secilmisMesajTipi = 'kotu_durum';
    }
    
    // Mesaj seç
    const mesajListesi = mesajlar[secilmisMesajTipi] || mesajlar.normal;
    const mesaj = mesajListesi[Math.floor(Math.random() * mesajListesi.length)];
    
    // Mesaj elementi oluştur
    const mesajElement = document.createElement('span');
    mesajElement.className = 'bot-mesaj bot-mesaj-animasyon';
    mesajElement.textContent = mesaj;
    
    // Mesaj durumuna göre renk belirle
    if (secilmisMesajTipi === 'kazanmaya_yakin') {
        mesajElement.style.color = '#ff5722';
    } else if (secilmisMesajTipi === 'iyi_durum') {
        mesajElement.style.color = '#8bc34a';
    } else if (secilmisMesajTipi === 'kotu_durum') {
        mesajElement.style.color = '#9e9e9e';
    }
    
    // Mesajı göster
    botBilgi.appendChild(mesajElement);
    
    // Mesajı 4 saniye sonra kaldır
    setTimeout(() => {
        if (mesajElement.parentNode) {
            mesajElement.remove();
        }
    }, 4000);
}

// Açık kartı göster
function acikKartiGoster(kart) {
    const acikKartAlani = document.querySelector('.acik-kart-alani');
    if (acikKartAlani) {
        acikKartAlani.innerHTML = '';
        
        if (kart) {
            const kartElement = elementKartiOlustur(kart, 1.0);
            kartElement.classList.add('acik-kart');
            acikKartAlani.appendChild(kartElement);
        } else {
            const bosKart = document.createElement('div');
            bosKart.className = 'element-kart bos-kart';
            bosKart.textContent = 'Boş';
            acikKartAlani.appendChild(bosKart);
        }
    }
}

// Son atılan kartı göster
function sonAtilanKartiGoster(kart) {
    const sonAtilanKartAlani = document.getElementById('son-atilan-kart-alani');
    if (sonAtilanKartAlani) {
        sonAtilanKartAlani.innerHTML = '';
        
        if (kart) {
            const kartElement = elementKartiOlustur(kart, 1.0);
            kartElement.classList.add('son-atilan-kart');
            sonAtilanKartAlani.appendChild(kartElement);
        } else {
            const bosKart = document.createElement('div');
            bosKart.className = 'element-kart bos-kart';
            bosKart.textContent = '-';
            sonAtilanKartAlani.appendChild(bosKart);
        }
    }
}

// Aktif oyuncuyu göster
function aktifOyuncuyuGuncelle(aktifOyuncuIndex) {
    // Tüm aktif sınıfları temizle
    document.querySelectorAll('.bot-alan, .oyuncu-alani').forEach(alan => {
        alan.classList.remove('aktif-oyuncu');
    });
    
    // Aktif oyuncuya sınıf ekle
    if (aktifOyuncuIndex === 0) {
        document.getElementById('oyuncu-alan').classList.add('aktif-oyuncu');
        
        // Oyuncunun sırası geldiğinde butonları etkinleştir
        document.getElementById('btn-desteyi-ac').disabled = false;
        document.getElementById('btn-acik-karti-al').disabled = false;
    } else {
        const botAlan = document.getElementById(`bot${aktifOyuncuIndex}-alan`);
        if (botAlan) {
            botAlan.classList.add('aktif-oyuncu');
        }
        
        // Bot sırasında butonları devre dışı bırak
        document.getElementById('btn-desteyi-ac').disabled = true;
        document.getElementById('btn-acik-karti-al').disabled = true;
        document.getElementById('btn-kart-ver').disabled = true;
    }
}

// Yıldızları güncelle
function yildizlariGuncelle(oyuncuPuani, botPuanlari) {
    // Oyuncu yıldızları
    const oyuncuYildizlar = document.getElementById('oyuncu-yildizlar');
    if (oyuncuYildizlar) {
        oyuncuYildizlar.innerHTML = '';
        for (let i = 0; i < oyuncuPuani; i++) {
            const yildiz = document.createElement('span');
            yildiz.className = 'yildiz';
            yildiz.innerHTML = '★';
            oyuncuYildizlar.appendChild(yildiz);
        }
    }
    
    // Bot yıldızları
    Object.keys(botPuanlari).forEach(botId => {
        const botYildizlar = document.getElementById(`bot${botId}-yildizlar`);
        if (botYildizlar) {
            botYildizlar.innerHTML = '';
            for (let i = 0; i < botPuanlari[botId]; i++) {
                const yildiz = document.createElement('span');
                yildiz.className = 'yildiz';
                yildiz.innerHTML = '★';
                botYildizlar.appendChild(yildiz);
            }
        }
    });
}

// Oyunu başlat
async function oyunuBaslat() {
    try {
        // Elementleri yükle
        const elements = await elementleriYukle();
        
        // Oyunu başlat
        if (window.PeriyodikOkey) {
            oyun = new PeriyodikOkey();
            
            // Zorluk seviyesini ayarla
            oyun.botZorlukSeviyesi = OYUN_AYARLARI.zorlukSeviyesi;
            
            // Oyun elemanlarını oluştur
            createElement();
            
            // Oyun ayarlarını al
            const botSayisi = OYUN_AYARLARI.botSayisi;
            
            // Oyunu başlat
            const oyunDurumu = oyun.oyunuBaslat(botSayisi);
            
            // Oyuncu adını göster
            const oyuncuIsimElement = document.getElementById('oyuncu-isim-goster');
            if (oyuncuIsimElement) {
                oyuncuIsimElement.textContent = OYUN_AYARLARI.oyuncuIsmi;
            }
            
            // Bot alanlarını göster/gizle
            document.querySelector('.bot2')?.classList.toggle('gizli', botSayisi < 2);
            document.querySelector('.bot3')?.classList.toggle('gizli', botSayisi < 3);
            
            // Oyuncu kartlarını göster
            oyuncuKartlariniGoster(oyunDurumu.oyuncuKartlari);
            
            // Bot kartlarını göster
            for (let i = 1; i <= botSayisi; i++) {
                botKartlariniGoster(i, 14); // Her bot 14 kart ile başlar
            }
            
            // Açık kartı göster
            acikKartiGoster(oyunDurumu.acikKart);
            
            // Kalan kart sayısını güncelle
            const kalanKartElement = document.getElementById('kalan-kart');
            if (kalanKartElement) {
                kalanKartElement.textContent = oyunDurumu.kalanKart;
            }
            
            // Durum mesajını güncelle
            const durumMesajiElement = document.getElementById('durum-mesaji');
            if (durumMesajiElement) {
                durumMesajiElement.textContent = "Sıra sizde. Desteden kart çekin veya açık kartı alın.";
            }
            
            // Yıldızları güncelle
            yildizlariGuncelle(oyunDurumu.oyuncuPuani, oyunDurumu.botPuanlari);
            
            // Butonları güncelle
            butonlariGuncelle();
            
            // Oyun ekranını göster
            ekraniGoster('oyun-screen');
        } else {
            console.error("PeriyodikOkey sınıfı bulunamadı!");
            alert("Oyun yüklenemedi! Sayfayı yenileyip tekrar deneyin.");
        }
    } catch (error) {
        console.error("Oyun başlatılırken hata oluştu:", error);
        alert("Oyun başlatılırken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.");
    }
}

// Desteyi oluştur - oyun_mantigi.js dosyasındaki desteOlustur fonksiyonunu desteklemek için
function createElement() {
    if (!window.ELEMENT_VERILERI && elementVerileri.length > 0) {
        window.ELEMENT_VERILERI = elementVerileri;
    }
}

// Oyun durumunu güncelle
function oyunDurumunuGuncelle() {
    if (!oyun) return;
    
    const oyunDurumu = oyun.oyunDurumuGetir();
    
    // Kalan kart
    const kalanKartElement = document.getElementById('kalan-kart');
    if (kalanKartElement) {
        kalanKartElement.textContent = oyunDurumu.kalanKart;
    }
    
    // Açık kart
    acikKartiGoster(oyunDurumu.acikKart);
    
    // Son atılan kart (eğer varsa)
    if (oyunDurumu.sonAtilanKart) {
        sonAtilanKartiGoster(oyunDurumu.sonAtilanKart);
    } else {
        sonAtilanKartiGoster(null);
    }
    
    // Oyuncu kartları
    oyuncuKartlariniGoster(oyunDurumu.oyuncuKartlari);
    
    // Bot kartları
    Object.keys(oyunDurumu.botKartlariSayisi).forEach(botId => {
        const kartSayisi = oyunDurumu.botKartlariSayisi[botId];
        botKartlariniGoster(botId, kartSayisi);
        
        // Eğer bot sırası ise mesaj göster
        if (oyunDurumu.aktifOyuncu == botId) {
            setTimeout(() => botMesajiGoster(botId), 500);
        }
    });
    
    // Aktif oyuncu göstergesi
    aktifOyuncuyuGuncelle(oyunDurumu.aktifOyuncu);
    
    // Yıldızları güncelle
    yildizlariGuncelle(oyunDurumu.oyuncuPuani, oyunDurumu.botPuanlari);
    
    // Durum mesajı
    const durumMesajiElement = document.getElementById('durum-mesaji');
    if (durumMesajiElement) {
        if (oyunDurumu.aktifOyuncu === 0) {
            durumMesajiElement.textContent = "Sıra sizde. Desteden kart çekin veya açık kartı alın.";
        } else {
            durumMesajiElement.textContent = `Bot ${oyunDurumu.aktifOyuncu} oynuyor...`;
        }
    }
    
    // Oyun sonu kontrolü
    if (oyunDurumu.oyunDurumu === 'bitti' && oyunDurumu.kazananOyuncu !== null) {
        oyunSonuGoster(oyunDurumu.kazananOyuncu, oyunDurumu.oyuncuPuani, oyunDurumu.botPuanlari);
    }
    
    // Butonları güncelle
    butonlariGuncelle();
}

// Oyun sonu ekranını göster
function oyunSonuGoster(kazananId, oyuncuPuani, botPuanlari) {
    // Sonuç mesajı
    const sonucMesaji = document.getElementById('sonuc-mesaji');
    if (sonucMesaji) {
        if (kazananId === 0) {
            sonucMesaji.textContent = "Tebrikler! Oyunu kazandınız!";
            sonucMesaji.className = "sonuc-mesaj kazanan";
        } else {
            sonucMesaji.textContent = `Üzgünüm! Bot ${kazananId} oyunu kazandı.`;
            sonucMesaji.className = "sonuc-mesaj kaybeden";
        }
        }
        
    // Skor tablosu
        const skorListe = document.getElementById('skor-liste');
    if (skorListe) {
        skorListe.innerHTML = '';
        
        // Oyuncu skoru
        const oyuncuSkor = document.createElement('div');
        oyuncuSkor.className = kazananId === 0 ? "skor-satir skor-kazanan" : "skor-satir";
        oyuncuSkor.innerHTML = `<span>${OYUN_AYARLARI.oyuncuIsmi}</span> <span>${oyuncuPuani} yıldız</span>`;
        skorListe.appendChild(oyuncuSkor);
        
        // Bot skorları
        Object.keys(botPuanlari).forEach(botId => {
            const botSkor = document.createElement('div');
            botSkor.className = parseInt(botId) === kazananId ? "skor-satir skor-kazanan" : "skor-satir";
            botSkor.innerHTML = `<span>Bot ${botId}</span> <span>${botPuanlari[botId]} yıldız</span>`;
            skorListe.appendChild(botSkor);
        });
    }
    
    // Oyun sonu ekranını göster
    ekraniGoster('oyun-sonu-screen');
}

// Sayfa yüklendiğinde çalış
document.addEventListener('DOMContentLoaded', function() {
    console.log('Periyodik Okey oyunu başlatılıyor...');
    
    // Ana menü butonları
    document.getElementById('btn-oyuna-basla')?.addEventListener('click', function() {
        ekraniGoster('oyun-baslangic-screen');
    });
    
    document.getElementById('btn-ayarlar')?.addEventListener('click', function() {
        ekraniGoster('ayarlar-screen');
    });
    
    // Oyun başlangıç ekranı
    document.getElementById('btn-oyunu-baslat')?.addEventListener('click', function() {
        // Seçilen ayarları al
        const botSayisiButonu = document.querySelector('.secim-buton.secili[data-value="1"], .secim-buton.secili[data-value="2"], .secim-buton.secili[data-value="3"]');
        const zorlukButonu = document.querySelector('.secim-buton.secili[data-value="kolay"], .secim-buton.secili[data-value="orta"], .secim-buton.secili[data-value="zor"]');
        
        if (botSayisiButonu) {
            OYUN_AYARLARI.botSayisi = parseInt(botSayisiButonu.dataset.value);
        }
        
        if (zorlukButonu) {
            OYUN_AYARLARI.zorlukSeviyesi = zorlukButonu.dataset.value;
        }
        
        const oyuncuIsmiInput = document.getElementById('baslangic-oyuncu-ismi');
        if (oyuncuIsmiInput) {
            OYUN_AYARLARI.oyuncuIsmi = oyuncuIsmiInput.value || 'Oyuncu';
        }
        
        // Yükleme ekranını göster
        ekraniGoster('yukleme-screen');
        
        // Yükleme animasyonunu başlat
        const yuklemeIlerleyis = document.querySelector('.yukleme-ilerleyis');
        if (yuklemeIlerleyis) {
            yuklemeIlerleyis.style.width = '0%';
            
            let yuklemeYuzdesi = 0;
            const yuklemeInterval = setInterval(function() {
                yuklemeYuzdesi += 2;
                yuklemeIlerleyis.style.width = yuklemeYuzdesi + '%';
                
                if (yuklemeYuzdesi >= 100) {
                    clearInterval(yuklemeInterval);
                    // Oyunu başlat
                    setTimeout(function() {
                        oyunuBaslat();
                    }, 500);
                }
            }, 50);
        } else {
            // İlerleyiş çubuğu yoksa direkt başlat
            setTimeout(function() {
                oyunuBaslat();
            }, 2000);
        }
    });
    
    document.getElementById('btn-baslangic-iptal')?.addEventListener('click', function() {
        ekraniGoster('menu-screen');
    });
    
    // Oyun butonları
    document.getElementById('btn-kontrol-et')?.addEventListener('click', function() {
        if (seciliKartlar.length < 3) {
            alert("En az 3 kart seçmelisiniz!");
            return;
        }
        
        if (oyun) {
            const kombinasyonSonuc = oyun.kombinasyonKontrolEtVeKaldir(seciliKartlar);
            
            if (kombinasyonSonuc) {
                seciliKartlar = [];
                oyunDurumunuGuncelle();
            } else {
                alert("Geçersiz kombinasyon. Lütfen aynı grupta veya periyotta olan kartları seçin.");
            }
        }
    });
    
    document.getElementById('btn-desteyi-ac')?.addEventListener('click', function() {
        if (oyun) {
            try {
                const cekilenKart = oyun.kartiCek();
                document.getElementById('durum-mesaji').textContent = "Kart çektiniz. Şimdi bir kart atın.";
                oyunDurumunuGuncelle();
        } catch (error) {
            alert(error.message);
            }
        }
    });
    
    document.getElementById('btn-acik-karti-al')?.addEventListener('click', function() {
        if (oyun) {
            try {
                const alinanKart = oyun.acikKartiAl();
                document.getElementById('durum-mesaji').textContent = "Açık kartı aldınız. Şimdi bir kart atın.";
                oyunDurumunuGuncelle();
            } catch (error) {
                alert(error.message);
            }
        }
    });
    
    document.getElementById('btn-kart-ver')?.addEventListener('click', function() {
        if (seciliKartlar.length !== 1) {
            alert("Lütfen atmak için bir kart seçin!");
            return;
        }
        
        if (oyun) {
            try {
                oyun.kartVer(seciliKartlar[0]);
                seciliKartlar = [];
                document.getElementById('durum-mesaji').textContent = "Kart attınız. Sıra botlarda...";
                oyunDurumunuGuncelle();
                
                // Bot hamlelerini kontrol et (botlar hamle yaptıktan sonra)
                setTimeout(function() {
                    oyunDurumunuGuncelle();
                }, 2000);
        } catch (error) {
            alert(error.message);
        }
        }
    });
    
    document.getElementById('btn-son-karti-ver')?.addEventListener('click', function() {
        if (oyun && oyun.oyuncuKartlari.length === 1) {
            try {
                const sonuc = oyun.sonKartiBotaVer();
                seciliKartlar = [];
                document.getElementById('durum-mesaji').textContent = "Son kartınızı verdiniz ve bir yıldız kazandınız!";
                oyunDurumunuGuncelle();
            } catch (error) {
                alert(error.message);
            }
        }
    });
    
    // Oyun sonu butonları
    document.getElementById('btn-tekrar-oyna')?.addEventListener('click', function() {
                oyunuBaslat();
    });
    
    document.getElementById('btn-ana-menuye-don')?.addEventListener('click', function() {
        ekraniGoster('menu-screen');
    });
    
    // İlk ekranı göster
        ekraniGoster('menu-screen');
    });

// Botların sıra geçişi sırasında takılma sorununu engellemek için güvenlik mekanizması
function botSirasiGuvenligi() {
    // Eğer aktif oyuncu bot ise ve 10 saniyeden fazla zaman geçtiyse
    if (oyun && oyun.aktifOyuncu > 0 && oyun.oyunDurumu === 'devam') {
        console.log("Bot sırası güvenlik kontrolü");
        
        // Aktif oyuncuyu oyuncuya çevir
        oyun.aktifOyuncu = 0;
        oyun.oyuncuKartCekildi = false;
        
        // Oyun durumunu güncelle
        oyunDurumunuGuncelle();
    }
}

// Periyodik olarak bot sırası kontrolü yap
setInterval(botSirasiGuvenligi, 10000); // 10 saniyede bir kontrol et