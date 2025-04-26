/**
 * Periyodik Okey - Ana JavaScript Dosyası
 * Oyun başlangıcı ve genel kontroller
 */

// Sayfa tam olarak yüklendiğinde başla
document.addEventListener('DOMContentLoaded', () => {
    console.log("Periyodik Okey oyunu başlatılıyor...");
    
    // Oyun versiyonu
    const VERSION = "1.0.0";
    console.log(`Versiyon: ${VERSION}`);
    
    // Oyun nesnesi
    let oyun = null;
    
    // Hata yakalama
    window.onerror = function(message, source, lineno, colno, error) {
        console.error(`HATA: ${message} - ${source}:${lineno}:${colno}`);
        return true;
    };
    
    // Element kartı oluşturma fonksiyonu
    function elementKartiOlustur(element, takim = 1, joker = false) {
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
        
        // Grup-Periyot
        if (!joker) {
            const grupPeriyot = document.createElement('div');
            grupPeriyot.className = 'grup-periyot';
            grupPeriyot.innerHTML = `<strong>G:</strong>${element.grup} <strong>P:</strong>${element.periyot}`;
            kart.appendChild(grupPeriyot);
        }
        
        // Takım
        const takimEtiket = document.createElement('div');
        takimEtiket.className = 'takim';
        takimEtiket.textContent = `T${takim}`;
        kart.appendChild(takimEtiket);
        
        // Veri özellikleri
        kart.dataset.id = element.id;
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
        
        // Kart seçimi olayı
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
        let r = 0, g = 0, b = 0;
        
        if (hex.startsWith('#')) {
            hex = hex.substring(1);
        }
        
        if (hex.length === 3) {
            r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
            g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
            b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        
        return (r * 0.299 + g * 0.587 + b * 0.114);
    }
    
    // Oyunu başlat
    function oyunuBaslat() {
        // Yeni oyun nesnesi oluştur
        oyun = new PeriyodikOkey();
        
        // Oyunu başlat ve kartları al
        const oyunDurumu = oyun.oyunuBaslat(3); // 3 bot ile başla
        
        // Oyuncu kartlarını göster
        const oyuncuKartlariDiv = document.getElementById('oyuncu-kartlari');
        oyuncuKartlariDiv.innerHTML = '';
        oyunDurumu.oyuncuKartlari.forEach(kart => {
            const kartElementi = elementKartiOlustur(kart, 1, kart.isJoker);
            oyuncuKartlariDiv.appendChild(kartElementi);
        });
        
        // Bot kartlarını göster
        oyunDurumu.botKartSayilari.forEach((kartSayisi, index) => {
            const botDiv = document.getElementById(`bot${index + 1}-kartlar`);
            botDiv.innerHTML = '';
            for (let i = 0; i < kartSayisi; i++) {
                const kapaliKart = document.createElement('div');
                kapaliKart.className = 'element-kart arka-yuz';
                botDiv.appendChild(kapaliKart);
            }
        });
        
        // Kalan kart sayısını güncelle
        document.getElementById('kalan-kart').textContent = oyunDurumu.kalanKart;
        
        // Durum mesajını güncelle
        document.getElementById('durum-mesaji').textContent = 'Sıra sizde! Kart çekiniz veya açık kartı alınız.';
    }
    
    // Desteden kart çekme
    document.getElementById('btn-desteyi-ac').addEventListener('click', () => {
        try {
            const cekilenKart = oyun.kartiCek();
            const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
            const kartElementi = elementKartiOlustur(cekilenKart, 1, cekilenKart.isJoker);
            oyuncuKartlari.appendChild(kartElementi);
            
            // Kalan kart sayısını güncelle
            document.getElementById('kalan-kart').textContent = oyun.deste.length;
            
            // Durum mesajını güncelle
            document.getElementById('durum-mesaji').textContent = 'Kart çektiniz. Şimdi bir kartı atın.';
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Açık kartı alma
    document.getElementById('btn-acik-karti-al').addEventListener('click', () => {
        try {
            const alinanKart = oyun.acikKartiAl();
            if (alinanKart) {
                const oyuncuKartlari = document.getElementById('oyuncu-kartlari');
                const kartElementi = elementKartiOlustur(alinanKart, 1, alinanKart.isJoker);
                oyuncuKartlari.appendChild(kartElementi);
                
                // Açık kart alanını temizle
                document.querySelector('.acik-kart-alani').innerHTML = '';
                
                // Durum mesajını güncelle
                document.getElementById('durum-mesaji').textContent = 'Açık kartı aldınız. Şimdi bir kartı atın.';
            }
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Kart verme (elden atma)
    document.getElementById('btn-kart-ver').addEventListener('click', () => {
        const seciliKart = document.querySelector('.element-kart.secili');
        if (!seciliKart) {
            alert('Lütfen atmak istediğiniz kartı seçin!');
            return;
        }
        
        try {
            const verilenKart = oyun.kartVer(seciliKart.dataset.id);
            
            // Kartı açık kart alanına taşı
            const acikKartAlani = document.querySelector('.acik-kart-alani');
            acikKartAlani.innerHTML = '';
            acikKartAlani.appendChild(seciliKart);
            seciliKart.classList.remove('secili');
            
            // Durum mesajını güncelle
            document.getElementById('durum-mesaji').textContent = 'Sıra botlarda...';
            
            // Bot hamlelerini yap
            setTimeout(() => {
                while (oyun.siradakiOyuncu !== 0) {
                    oyun.botHamlesiYap();
                }
                document.getElementById('durum-mesaji').textContent = 'Sıra sizde! Kart çekiniz veya açık kartı alınız.';
            }, 1000);
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Kontrol et butonu
    document.getElementById('btn-kontrol-et').addEventListener('click', () => {
        const seciliKartlar = Array.from(document.querySelectorAll('.element-kart.secili'))
            .map(kart => kart.dataset.id);
            
        if (seciliKartlar.length < 3) {
            alert('En az 3 kart seçmelisiniz!');
            return;
        }
        
        const kombinasyonGecerli = oyun.kombinasyonKontrolEt(seciliKartlar);
        if (kombinasyonGecerli) {
            // Seçili kartları kaldır
            seciliKartlar.forEach(kartId => {
                document.querySelector(`[data-id="${kartId}"]`).remove();
            });
            
            // Yıldız ekle
            const kazandi = oyun.yildizEkle();
            
            // Yıldızları güncelle
            const yildizlar = document.getElementById('oyuncu-yildizlar');
            const yildizSayisi = oyun.oyuncuYildizlari.get('oyuncu');
            yildizlar.innerHTML = '⭐'.repeat(yildizSayisi);
            
            if (kazandi) {
                alert('Tebrikler! Oyunu kazandınız!');
                // Ana menüye dön
                document.getElementById('oyun-screen').classList.add('gizli');
                document.getElementById('menu-screen').classList.remove('gizli');
            }
        } else {
            alert('Geçersiz kombinasyon! Aynı grupta veya periyotta olmalı.');
        }
    });
    
    // Oyuna başla butonu
    document.getElementById('btn-oyuna-basla').addEventListener('click', () => {
        document.getElementById('menu-screen').classList.add('gizli');
        document.getElementById('oyun-screen').classList.remove('gizli');
        oyunuBaslat();
    });
    
    // Menüye dön butonu
    document.getElementById('btn-oyun-menu').addEventListener('click', () => {
        if (confirm('Oyunu yarıda bırakmak istediğinize emin misiniz?')) {
            document.getElementById('oyun-screen').classList.add('gizli');
            document.getElementById('menu-screen').classList.remove('gizli');
        }
    });
    
    // Yardım butonu
    document.getElementById('btn-oyun-yardim').addEventListener('click', () => {
        alert(`Oyun Kuralları:
1. Her oyuncu 14 kart ile başlar
2. Sırayla ya desteden kart çekilir ya da açık kart alınır
3. Aynı grupta veya periyotta olan en az 3 kartı seçip "Kontrol Et" butonuna basın
4. Geçerli kombinasyon yaparsanız bir yıldız kazanırsınız
5. İlk 3 yıldıza ulaşan oyunu kazanır!`);
    });
}); 