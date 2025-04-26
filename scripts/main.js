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
    
    if (seciliKartlar.length >= 3) {
        if (btnKontrolEt) btnKontrolEt.disabled = false;
    } else {
        if (btnKontrolEt) btnKontrolEt.disabled = true;
    }
    
    if (seciliKartlar.length === 1) {
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
        
        // Bot kartlarını oluştur (arka yüz)
        for (let i = 0; i < kartSayisi; i++) {
            const botKart = document.createElement('div');
            botKart.className = 'element-kart arka-yuz';
            botKart.style.transform = 'scale(0.6)'; // %60 daha küçük
            botKart.style.margin = '2px';
            botKart.style.transformOrigin = 'center center';
            botKartlarDiv.appendChild(botKart);
        }
    }
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
            const kombinasyonSonuc = oyun.kombinasyonKontrolEt(seciliKartlar);
            
            if (kombinasyonSonuc) {
                alert("Tebrikler! Geçerli bir kombinasyon oluşturdunuz.");
                seciliKartlar = [];
            } else {
                alert("Geçersiz kombinasyon. Lütfen aynı grupta veya periyotta olan kartları seçin.");
            }
        }
    });
    
    document.getElementById('btn-desteyi-ac')?.addEventListener('click', function() {
        if (oyun) {
            try {
                const cekilenKart = oyun.kartiCek();
                oyuncuKartlariniGoster(oyun.oyuncuKartlari);
                document.getElementById('durum-mesaji').textContent = "Kart çektiniz. Şimdi bir kart atın.";
            } catch (error) {
                alert(error.message);
            }
        }
    });
    
    document.getElementById('btn-acik-karti-al')?.addEventListener('click', function() {
        if (oyun) {
            try {
                const alinanKart = oyun.acikKartiAl();
                oyuncuKartlariniGoster(oyun.oyuncuKartlari);
                document.getElementById('durum-mesaji').textContent = "Açık kartı aldınız. Şimdi bir kart atın.";
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
                oyuncuKartlariniGoster(oyun.oyuncuKartlari);
                document.getElementById('durum-mesaji').textContent = "Kart attınız. Sıra botlarda...";
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
                oyuncuKartlariniGoster(oyun.oyuncuKartlari);
                document.getElementById('durum-mesaji').textContent = "Son kartınızı verdiniz ve bir yıldız kazandınız!";
            } catch (error) {
                alert(error.message);
            }
        }
    });
    
    // İlk ekranı göster
    ekraniGoster('menu-screen');
}); 