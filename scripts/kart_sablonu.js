/**
 * Periyodik Okey - Element Kartı Sınıfı
 * Temel kart özellikleri ve davranışları için sınıf
 */
class ElementKarti {
    /**
     * Element kartı constructor
     * @param {Object} elementData Element verisi
     */
    constructor(elementData) {
        this.id = elementData.id;
        this.sembol = elementData.sembol;
        this.isim = elementData.isim;
        this.atomNumarasi = elementData.atomNumarasi;
        this.grupNumarasi = elementData.grupNumarasi;
        this.periyotNumarasi = elementData.periyotNumarasi;
        this.renkKodu = elementData.renkKodu || this.getRenkKodu(elementData.grupTuru);
        this.grupTuru = elementData.grupTuru;
        this.joker = elementData.joker || false;
        
        // Oyun içi durum değişkenleri
        this.secili = false;
        this.kombinasyonda = false;
        this.x = 0;
        this.y = 0;
        this.genislik = 70;
        this.yukseklik = 100;
    }
    
    /**
     * Grup türüne göre renk kodu döndürür
     * @param {string} grupTuru Element grup türü
     * @returns {string} Renk kodu
     */
    getRenkKodu(grupTuru) {
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
        
        return renkler[grupTuru] || '#CCCCCC';
    }
    
    /**
     * Kartı çizer
     * @param {CanvasRenderingContext2D} ctx Canvas konteksti
     */
    ciz(ctx) {
        // Kart arka planı
        ctx.fillStyle = this.renkKodu;
        ctx.strokeStyle = this.secili ? '#FF0000' : '#000000';
        ctx.lineWidth = this.secili ? 3 : 1;
        
        // Kart gölgesi
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Kartın kendisi
        this.dikdortgenCiz(ctx, this.x, this.y, this.genislik, this.yukseklik, 5);
        
        // Gölgeyi kapat
        ctx.shadowColor = 'transparent';
        
        // Metin stili
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        
        // Joker ise özel çizim
        if (this.joker) {
            this.jokerCiz(ctx);
            return;
        }
        
        // Element sembolü
        ctx.font = 'bold 24px Arial';
        ctx.fillText(this.sembol, this.x + this.genislik / 2, this.y + this.yukseklik / 2);
        
        // Element ismi
        ctx.font = '10px Arial';
        ctx.fillText(this.isim, this.x + this.genislik / 2, this.y + this.yukseklik / 2 + 20);
        
        // Atom numarası (sol üst)
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(this.atomNumarasi, this.x + 5, this.y + 15);
        
        // Grup numarası (sağ üst)
        ctx.textAlign = 'right';
        ctx.fillText(this.grupNumarasi, this.x + this.genislik - 5, this.y + 15);
        
        // Periyot numarası (sol alt)
        ctx.textAlign = 'left';
        ctx.fillText("P" + this.periyotNumarasi, this.x + 5, this.y + this.yukseklik - 5);
    }
    
    /**
     * Joker kartı çizer
     * @param {CanvasRenderingContext2D} ctx Canvas konteksti
     */
    jokerCiz(ctx) {
        // Joker sembolü
        ctx.font = 'bold 24px Arial';
        ctx.fillText(this.sembol, this.x + this.genislik / 2, this.y + this.yukseklik / 2);
        
        // Joker yazısı
        ctx.font = '10px Arial';
        ctx.fillText(this.isim, this.x + this.genislik / 2, this.y + this.yukseklik / 2 + 20);
        
        // Joker bilgisi
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("Joker", this.x + this.genislik / 2, this.y + this.yukseklik - 5);
    }
    
    /**
     * Yuvarlak köşeli dikdörtgen çizer
     * @param {CanvasRenderingContext2D} ctx Canvas konteksti
     * @param {number} x X koordinatı
     * @param {number} y Y koordinatı
     * @param {number} genislik Genişlik
     * @param {number} yukseklik Yükseklik
     * @param {number} yaricap Köşe yarıçapı
     */
    dikdortgenCiz(ctx, x, y, genislik, yukseklik, yaricap) {
        ctx.beginPath();
        ctx.moveTo(x + yaricap, y);
        ctx.lineTo(x + genislik - yaricap, y);
        ctx.quadraticCurveTo(x + genislik, y, x + genislik, y + yaricap);
        ctx.lineTo(x + genislik, y + yukseklik - yaricap);
        ctx.quadraticCurveTo(x + genislik, y + yukseklik, x + genislik - yaricap, y + yukseklik);
        ctx.lineTo(x + yaricap, y + yukseklik);
        ctx.quadraticCurveTo(x, y + yukseklik, x, y + yukseklik - yaricap);
        ctx.lineTo(x, y + yaricap);
        ctx.quadraticCurveTo(x, y, x + yaricap, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    /**
     * Fare tıklaması kontrolü
     * @param {number} mouseX Fare X koordinatı
     * @param {number} mouseY Fare Y koordinatı
     * @returns {boolean} Fare kartın üzerinde mi
     */
    icerdeMi(mouseX, mouseY) {
        return mouseX >= this.x && 
               mouseX <= this.x + this.genislik && 
               mouseY >= this.y && 
               mouseY <= this.y + this.yukseklik;
    }
    
    /**
     * Kartın konumunu günceller
     * @param {number} x Yeni X koordinatı
     * @param {number} y Yeni Y koordinatı
     */
    konumuGuncelle(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Kartın seçili durumunu değiştirir
     * @param {boolean} secili Seçili durumu
     */
    seciliDurumunuDegistir(secili) {
        this.secili = secili;
    }
    
    /**
     * Kartın aynı gruptan olup olmadığını kontrol eder
     * @param {ElementKarti} digerKart Karşılaştırılacak kart
     * @returns {boolean} Aynı gruptan mı
     */
    ayniGruptanMi(digerKart) {
        return this.grupNumarasi === digerKart.grupNumarasi && !this.joker && !digerKart.joker;
    }
    
    /**
     * Kartın aynı periyottan olup olmadığını kontrol eder
     * @param {ElementKarti} digerKart Karşılaştırılacak kart
     * @returns {boolean} Aynı periyottan mı
     */
    ayniPeriyottanMi(digerKart) {
        return this.periyotNumarasi === digerKart.periyotNumarasi && !this.joker && !digerKart.joker;
    }
}

// Dışa aktarma (export)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ElementKarti };
}

/**
 * KartSablonu sınıfı - Oyunda kullanılacak kartlar için görsel şablon oluşturur
 */
class KartSablonu {
    /**
     * Kart şablonu yapıcı metodu
     * @param {Object} ayarlar - Şablon ayarları
     */
    constructor(ayarlar = {}) {
        // Varsayılan ayarlar
        this.ayarlar = {
            genislik: ayarlar.genislik || 150,
            yukseklik: ayarlar.yukseklik || 200,
            kenarYuvarlatma: ayarlar.kenarYuvarlatma || 10,
            kenarKalinligi: ayarlar.kenarKalinligi || 2,
            arkaplanRengi: ayarlar.arkaplanRengi || '#f0f0f0',
            kenarRengi: ayarlar.kenarRengi || '#333333',
            yaziRengi: ayarlar.yaziRengi || '#333333',
            sembolBoyutu: ayarlar.sembolBoyutu || 40,
            isimBoyutu: ayarlar.isimBoyutu || 16,
            atomNoBoyutu: ayarlar.atomNoBoyutu || 14,
            grupPeriyotBoyutu: ayarlar.grupPeriyotBoyutu || 12,
            takimGosterimi: ayarlar.takimGosterimi || true,
            arkaYuzRengi: ayarlar.arkaYuzRengi || '#5a189a',
            arkaYuzDeseni: ayarlar.arkaYuzDeseni || 'çizgili' // çizgili, noktali, dalgali
        };
        
        // Şablon için canvas oluştur
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.ayarlar.genislik;
        this.canvas.height = this.ayarlar.yukseklik;
        this.ctx = this.canvas.getContext('2d');
    }
    
    /**
     * Kart ön yüzünü çizer
     * @param {Object} element - Element verisi
     * @param {number} takim - Kartın takımı
     * @param {boolean} joker - Joker mi?
     * @param {string} arkaplanRengi - Arkaplan rengi
     * @return {HTMLCanvasElement} Çizilmiş canvas
     */
    onYuzCiz(element, takim = 1, joker = false, arkaplanRengi = null) {
        const ctx = this.ctx;
        const genislik = this.ayarlar.genislik;
        const yukseklik = this.ayarlar.yukseklik;
        
        // Canvas'ı temizle
        ctx.clearRect(0, 0, genislik, yukseklik);
        
        // Arkaplan rengini ayarla
        const renk = arkaplanRengi || this.ayarlar.arkaplanRengi;
        
        // Gradyan arkaplan oluştur
        const gradient = ctx.createLinearGradient(0, 0, genislik, yukseklik);
        
        // HEX rengi RGB'ye çevir (gradyan için)
        const r = parseInt(renk.substring(1, 3), 16);
        const g = parseInt(renk.substring(3, 5), 16);
        const b = parseInt(renk.substring(5, 7), 16);
        
        // Gradyan renkleri
        const acikRenk = `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)}, 1)`;
        const normalRenk = renk;
        const koyuRenk = `rgba(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)}, 1)`;
        
        gradient.addColorStop(0, acikRenk);
        gradient.addColorStop(0.5, normalRenk);
        gradient.addColorStop(1, koyuRenk);
        
        // Kartın arkaplanını çiz (yuvarlatılmış köşeler)
        ctx.fillStyle = gradient;
        this._yuvarlatilmisKoseli(0, 0, genislik, yukseklik, this.ayarlar.kenarYuvarlatma);
        ctx.fill();
        
        // Kartın kenarlarını çiz
        ctx.strokeStyle = this.ayarlar.kenarRengi;
        ctx.lineWidth = this.ayarlar.kenarKalinligi;
        ctx.stroke();
        
        // Eğer joker kartıysa, joker içeriğini çiz
        if (joker) {
            this._jokerIcerikCiz(takim);
            return this.canvas;
        }
        
        // Element içeriğini çiz
        this._elementIcerikCiz(element, takim);
        
        return this.canvas;
    }
    
    /**
     * Kart arka yüzünü çizer
     * @param {number} takim - Kartın takımı
     * @return {HTMLCanvasElement} Çizilmiş canvas
     */
    arkaYuzCiz(takim = 1) {
        const ctx = this.ctx;
        const genislik = this.ayarlar.genislik;
        const yukseklik = this.ayarlar.yukseklik;
        
        // Canvas'ı temizle
        ctx.clearRect(0, 0, genislik, yukseklik);
        
        // Arkaplan rengini ayarla (takıma göre hafif değişiklik)
        let arkaYuzRengi = this.ayarlar.arkaYuzRengi;
        
        // Takım 2 için rengi hafif değiştir
        if (takim === 2) {
            // Rengi hafifçe açık yap
            const r = parseInt(arkaYuzRengi.substring(1, 3), 16);
            const g = parseInt(arkaYuzRengi.substring(3, 5), 16);
            const b = parseInt(arkaYuzRengi.substring(5, 7), 16);
            
            arkaYuzRengi = `#${Math.min(255, r + 30).toString(16).padStart(2,'0')}${Math.min(255, g + 30).toString(16).padStart(2,'0')}${Math.min(255, b + 30).toString(16).padStart(2,'0')}`;
        }
        
        // Kartın arkaplanını çiz (yuvarlatılmış köşeler)
        ctx.fillStyle = arkaYuzRengi;
        this._yuvarlatilmisKoseli(0, 0, genislik, yukseklik, this.ayarlar.kenarYuvarlatma);
        ctx.fill();
        
        // Kartın kenarlarını çiz
        ctx.strokeStyle = '#222222';
        ctx.lineWidth = this.ayarlar.kenarKalinligi;
        ctx.stroke();
        
        // Arka yüz deseni ekle
        this._arkaYuzDeseniCiz(takim);
        
        // Periyodik Okey logosu ekle
        this._logoEkle(takim);
        
        return this.canvas;
    }
    
    /**
     * Kartın arkaplan desenini çizer
     * @param {number} takim - Kartın takımı
     * @private
     */
    _arkaYuzDeseniCiz(takim) {
        const ctx = this.ctx;
        const genislik = this.ayarlar.genislik;
        const yukseklik = this.ayarlar.yukseklik;
        
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        
        // Farklı desen türlerine göre çizim
        switch(this.ayarlar.arkaYuzDeseni) {
            case 'çizgili':
                // Yatay çizgiler
                for (let y = 10; y < yukseklik; y += 20) {
                    ctx.beginPath();
                    ctx.moveTo(10, y);
                    ctx.lineTo(genislik - 10, y);
                    ctx.stroke();
                }
                break;
                
            case 'noktali':
                // Nokta deseni
                for (let x = 15; x < genislik; x += 15) {
                    for (let y = 15; y < yukseklik; y += 15) {
                        ctx.beginPath();
                        ctx.arc(x, y, 1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                break;
                
            case 'dalgali':
                // Dalga deseni
                for (let y = 20; y < yukseklik; y += 30) {
                    ctx.beginPath();
                    
                    for (let x = 0; x < genislik; x += 10) {
                        const offset = Math.sin(x * 0.05) * 5;
                        if (x === 0) {
                            ctx.moveTo(x, y + offset);
                        } else {
                            ctx.lineTo(x, y + offset);
                        }
                    }
                    
                    ctx.stroke();
                }
                break;
                
            default:
                // Varsayılan: kafes deseni
                for (let x = 20; x < genislik; x += 20) {
                    ctx.beginPath();
                    ctx.moveTo(x, 10);
                    ctx.lineTo(x, yukseklik - 10);
                    ctx.stroke();
                }
                
                for (let y = 20; y < yukseklik; y += 20) {
                    ctx.beginPath();
                    ctx.moveTo(10, y);
                    ctx.lineTo(genislik - 10, y);
                    ctx.stroke();
                }
        }
        
        ctx.restore();
    }
    
    /**
     * Periyodik Okey logosu ekler
     * @param {number} takim - Kartın takımı
     * @private
     */
    _logoEkle(takim) {
        const ctx = this.ctx;
        const genislik = this.ayarlar.genislik;
        const yukseklik = this.ayarlar.yukseklik;
        
        // Orta kısımda logo göster
        ctx.save();
        
        // Logo arkaplanı
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(genislik / 2, yukseklik / 2, 35, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
        
        // Logo yazısı
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = this.ayarlar.arkaYuzRengi;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PO', genislik / 2, yukseklik / 2);
        
        // Takım numarası göster
        if (this.ayarlar.takimGosterimi) {
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`Takım ${takim}`, genislik / 2, yukseklik / 2 + 25);
        }
        
        ctx.restore();
    }
    
    /**
     * Element içeriğini çizer
     * @param {Object} element - Element verisi
     * @param {number} takim - Kartın takımı
     * @private
     */
    _elementIcerikCiz(element, takim) {
        const ctx = this.ctx;
        const genislik = this.ayarlar.genislik;
        const yukseklik = this.ayarlar.yukseklik;
        
        ctx.fillStyle = this.ayarlar.yaziRengi;
        
        // Atom numarası (sol üst köşe)
        ctx.font = `${this.ayarlar.atomNoBoyutu}px Arial`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(element.atom_no, 10, 10);
        
        // Element sembolü (orta)
        ctx.font = `bold ${this.ayarlar.sembolBoyutu}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.sembol, genislik / 2, yukseklik / 2 - 20);
        
        // Element adı
        ctx.font = `${this.ayarlar.isimBoyutu}px Arial`;
        ctx.fillText(element.isim, genislik / 2, yukseklik / 2 + 15);
        
        // Grup ve periyot
        ctx.font = `${this.ayarlar.grupPeriyotBoyutu}px Arial`;
        ctx.fillText(`Grup: ${element.grup} - Periyot: ${element.periyot}`, genislik / 2, yukseklik / 2 + 40);
        
        // Takım gösterimi
        if (this.ayarlar.takimGosterimi) {
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.fillText(`T${takim}`, genislik - 10, 10);
        }
    }
    
    /**
     * Joker kartı içeriğini çizer
     * @param {number} takim - Kartın takımı
     * @private
     */
    _jokerIcerikCiz(takim) {
        const ctx = this.ctx;
        const genislik = this.ayarlar.genislik;
        const yukseklik = this.ayarlar.yukseklik;
        
        // Joker yazısı (orta)
        ctx.font = `bold ${this.ayarlar.sembolBoyutu * 1.5}px Arial`;
        ctx.fillStyle = this.ayarlar.yaziRengi;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('J', genislik / 2, yukseklik / 2 - 30);
        
        // JOKER yazısı
        ctx.font = `bold ${this.ayarlar.isimBoyutu}px Arial`;
        ctx.fillText('JOKER', genislik / 2, yukseklik / 2 + 20);
        
        // Takım gösterimi
        if (this.ayarlar.takimGosterimi) {
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.fillText(`T${takim}`, genislik - 10, 10);
        }
    }
    
    /**
     * Yuvarlatılmış köşeli dikdörtgen çizer
     * @param {number} x - X koordinatı
     * @param {number} y - Y koordinatı
     * @param {number} genislik - Genişlik
     * @param {number} yukseklik - Yükseklik
     * @param {number} yaricap - Köşe yarıçapı
     * @private
     */
    _yuvarlatilmisKoseli(x, y, genislik, yukseklik, yaricap) {
        const ctx = this.ctx;
        
        ctx.beginPath();
        ctx.moveTo(x + yaricap, y);
        ctx.lineTo(x + genislik - yaricap, y);
        ctx.quadraticCurveTo(x + genislik, y, x + genislik, y + yaricap);
        ctx.lineTo(x + genislik, y + yukseklik - yaricap);
        ctx.quadraticCurveTo(x + genislik, y + yukseklik, x + genislik - yaricap, y + yukseklik);
        ctx.lineTo(x + yaricap, y + yukseklik);
        ctx.quadraticCurveTo(x, y + yukseklik, x, y + yukseklik - yaricap);
        ctx.lineTo(x, y + yaricap);
        ctx.quadraticCurveTo(x, y, x + yaricap, y);
        ctx.closePath();
    }
    
    /**
     * Yeni şablon ayarları uygular
     * @param {Object} yeniAyarlar - Yeni ayarlar
     */
    ayarlariGuncelle(yeniAyarlar) {
        this.ayarlar = { ...this.ayarlar, ...yeniAyarlar };
        
        // Canvas boyutunu güncelle
        this.canvas.width = this.ayarlar.genislik;
        this.canvas.height = this.ayarlar.yukseklik;
    }
    
    /**
     * Şablondan bir kart dışa aktarır
     * @param {Object} element - Element verisi
     * @param {number} takim - Kartın takımı
     * @param {boolean} joker - Joker mi?
     * @param {boolean} arkaYuz - Arka yüz mü?
     * @param {string} format - Dışa aktarma formatı (image/png, image/jpeg)
     * @return {string} Dışa aktarılan resim (base64)
     */
    disaAktar(element, takim = 1, joker = false, arkaYuz = false, format = 'image/png') {
        if (arkaYuz) {
            this.arkaYuzCiz(takim);
        } else {
            this.onYuzCiz(element, takim, joker);
        }
        
        return this.canvas.toDataURL(format);
    }
}

// KartSablonu sınıfını global olarak erişilebilir yap
window.KartSablonu = KartSablonu; 