/**
 * Periyodik Okey - Element Kartı Sınıfı
 * Oyunda kullanılan element kartlarını temsil eden sınıf
 */

class ElementKarti {
    /**
     * ElementKarti sınıfı yapıcı metodu
     * @param {Object} element - Element verisi
     * @param {number} takim - Kartın takım numarası (1 veya 2)
     * @param {boolean} joker - Kartın joker olup olmadığı
     */
    constructor(element, takim = 1, joker = false) {
        this.element = element;
        this.takim = takim;
        this.joker = joker;
        
        // Kart pozisyonu (çizim için)
        this.x = 0;
        this.y = 0;
        
        // Kart boyutları
        this.genislik = 70;
        this.yukseklik = 100;
        
        // Kart durumu
        this.secili = false;
        this.aktif = true; // Kartın kullanıcıya gösterilip gösterilmeyeceği
        
        // Kart şablonu için varsayılan ayarlar
        this.sablonAyarlari = {
            genislik: 150,
            yukseklik: 200,
            kenarYuvarlatma: 10,
            kenarKalinligi: 2,
            arkaplanRengi: this.renkHesapla(),
            arkaYuzRengi: '#5a189a'  // Mor renk
        };
    }
    
    /**
     * Kartı canvas üzerine çizer
     * @param {CanvasRenderingContext2D} ctx - Canvas çizim konteksti
     */
    ciz(ctx) {
        if (!ctx) return;
        
        // Kartın arkaplanını çiz
        ctx.fillStyle = this.renkHesapla();
        ctx.fillRect(this.x, this.y, this.genislik, this.yukseklik);
        
        // Kartın kenarlarını çiz
        ctx.strokeStyle = this.secili ? "#ff0000" : "#000000";
        ctx.lineWidth = this.secili ? 3 : 1;
        ctx.strokeRect(this.x, this.y, this.genislik, this.yukseklik);
        
        // Kart kapalıysa içeriğini gösterme
        if (!this.aktif) return;
        
        // Element sembolünü çiz
        ctx.fillStyle = "#000000";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            this.element.sembol,
            this.x + this.genislik / 2,
            this.y + 30
        );
        
        // Element adını çiz
        ctx.font = "12px Arial";
        ctx.fillText(
            this.element.isim,
            this.x + this.genislik / 2,
            this.y + 50
        );
        
        // Atom numarasını çiz
        ctx.font = "10px Arial";
        ctx.textAlign = "left";
        ctx.fillText(
            `${this.element.atom_no}`,
            this.x + 5,
            this.y + 15
        );
        
        // Periyot ve grup bilgisini çiz
        ctx.textAlign = "right";
        ctx.fillText(
            `P:${this.element.periyot} G:${this.element.grup}`,
            this.x + this.genislik - 5,
            this.y + this.yukseklik - 10
        );
        
        // Takım numarasını çiz
        ctx.textAlign = "left";
        ctx.fillText(
            `T:${this.takim}`,
            this.x + 5,
            this.y + this.yukseklik - 10
        );
        
        // Joker ise belirt
        if (this.joker) {
            ctx.fillStyle = "#ff0000";
            ctx.textAlign = "center";
            ctx.font = "bold 14px Arial";
            ctx.fillText(
                "JOKER",
                this.x + this.genislik / 2,
                this.y + 70
            );
        }
    }
    
    /**
     * Kartın rengini element türüne veya grup numarasına göre hesaplar
     * @return {string} HEX renk kodu
     */
    renkHesapla() {
        // Joker kartları için özel renk
        if (this.joker) {
            return '#FFD700';  // Altın sarısı
        }
        
        // Element türüne göre renk belirle
        if (this.element.element_turu) {
            switch (this.element.element_turu.toLowerCase()) {
                case 'metal':
                case 'alkali metal':
                case 'toprak alkali metal':
                    return '#0077b6';  // Mavi
                case 'ametal':
                case 'halojen':
                    return '#d62828';  // Kırmızı
                case 'yarı metal':
                    return '#fb8500';  // Turuncu
                case 'soy gaz':
                    return '#7209b7';  // Mor
                case 'lantanit':
                    return '#4cc9f0';  // Açık mavi
                case 'aktinit':
                    return '#f72585';  // Pembe
                default:
                    break;
            }
        }
        
        // Element türü belirtilmemişse, grup numarasına göre renk belirle
        if (this.element.grup) {
            const grupNo = parseInt(this.element.grup);
            
            if (grupNo === 1) return '#ef476f';       // Kırmızı
            else if (grupNo === 2) return '#ffd166';  // Sarı
            else if (grupNo <= 6) return '#06d6a0';   // Yeşil
            else if (grupNo <= 12) return '#118ab2';  // Mavi
            else if (grupNo <= 18) return '#073b4c';  // Koyu mavi
        }
        
        // Hiçbir duruma uymazsa varsayılan renk
        return '#6c757d';  // Gri
    }
    
    /**
     * Kartın arka plan gradyanını hesaplar
     * @return {string} CSS gradient değeri
     */
    arkaPlanGradyani() {
        const renk = this.renkHesapla();
        
        // HEX rengi RGB'ye çevir
        const r = parseInt(renk.substring(1, 3), 16);
        const g = parseInt(renk.substring(3, 5), 16);
        const b = parseInt(renk.substring(5, 7), 16);
        
        // Gradyan renkleri
        const acikRenk = `rgb(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)})`;
        const koyuRenk = `rgb(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)})`;
        
        return `linear-gradient(135deg, ${acikRenk} 0%, ${renk} 50%, ${koyuRenk} 100%)`;
    }
    
    /**
     * Kartın HTML temsilini oluşturur
     * @param {boolean} arkaYuz - Kartın arka yüzünü gösterme durumu
     * @return {HTMLElement} Kart elementi
     */
    htmlOlustur(arkaYuz = false) {
        const kartDiv = document.createElement('div');
        kartDiv.className = 'element-kart';
        kartDiv.dataset.joker = this.joker;
        kartDiv.dataset.takim = this.takim;
        
        // Kart aktif değilse (kullanıcı görmemeli), gizli olarak göster veya hiç gösterme
        if (!this.aktif) {
            arkaYuz = true;  // Aktif olmayan kart her zaman arka yüz gösterir
        }
        
        // Kartın arkaplan stilleri
        kartDiv.style.width = `${this.sablonAyarlari.genislik}px`;
        kartDiv.style.height = `${this.sablonAyarlari.yukseklik}px`;
        kartDiv.style.borderRadius = `${this.sablonAyarlari.kenarYuvarlatma}px`;
        kartDiv.style.border = `${this.sablonAyarlari.kenarKalinligi}px solid #333`;
        kartDiv.style.position = 'relative';
        kartDiv.style.cursor = 'pointer';
        kartDiv.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        // Arka yüz ise özel stillemeler uygula
        if (arkaYuz) {
            kartDiv.classList.add('arka-yuz');
            kartDiv.style.background = this.sablonAyarlari.arkaYuzRengi;
            
            // Arka yüz deseni
            const desen = document.createElement('div');
            desen.className = 'kart-desen';
            desen.style.position = 'absolute';
            desen.style.width = '100%';
            desen.style.height = '100%';
            desen.style.backgroundImage = 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 10px, transparent 10px, transparent 20px)';
            
            // Logo
            const logo = document.createElement('div');
            logo.className = 'kart-logo';
            logo.style.position = 'absolute';
            logo.style.top = '50%';
            logo.style.left = '50%';
            logo.style.transform = 'translate(-50%, -50%)';
            logo.style.width = '70px';
            logo.style.height = '70px';
            logo.style.borderRadius = '50%';
            logo.style.backgroundColor = 'rgba(255,255,255,0.8)';
            logo.style.display = 'flex';
            logo.style.alignItems = 'center';
            logo.style.justifyContent = 'center';
            
            // Logo içeriği
            logo.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: ${this.sablonAyarlari.arkaYuzRengi};">PO</div>
                    <div style="font-size: 14px; color: ${this.sablonAyarlari.arkaYuzRengi};">Takım ${this.takim}</div>
                </div>
            `;
            
            kartDiv.appendChild(desen);
            kartDiv.appendChild(logo);
        } else {
            // Ön yüz - element bilgilerini göster
            kartDiv.style.background = this.arkaPlanGradyani();
            
            // Joker kartı özel gösterimi
            if (this.joker) {
                kartDiv.innerHTML = `
                    <div style="position: absolute; top: 10px; right: 10px; font-weight: bold;">T${this.takim}</div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                        <div style="font-size: 60px; font-weight: bold;">J</div>
                        <div style="font-size: 24px; font-weight: bold;">JOKER</div>
                    </div>
                `;
            } else {
                // Normal element kartı
                kartDiv.innerHTML = `
                    <div style="position: absolute; top: 10px; left: 10px; font-size: 16px;">${this.element.atom_no}</div>
                    <div style="position: absolute; top: 10px; right: 10px; font-weight: bold;">T${this.takim}</div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -60%); text-align: center;">
                        <div style="font-size: 40px; font-weight: bold;">${this.element.sembol}</div>
                        <div style="font-size: 18px;">${this.element.isim}</div>
                        <div style="font-size: 14px; margin-top: 10px;">
                            Grup: ${this.element.grup} - Periyot: ${this.element.periyot}
                        </div>
                    </div>
                `;
            }
        }
        
        // Seçili ise özel efekt ekle
        if (this.secili) {
            kartDiv.classList.add('secili');
            kartDiv.style.transform = 'translateY(-10px)';
            kartDiv.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
        }
        
        return kartDiv;
    }
    
    /**
     * İki kartın aynı element türüne sahip olup olmadığını kontrol eder
     * @param {ElementKarti} digerKart - Karşılaştırılacak kart
     * @return {boolean} Aynı element türüne sahipse true
     */
    ayniTur(digerKart) {
        if (this.joker || digerKart.joker) return true;
        
        return this.element.element_turu === digerKart.element.element_turu;
    }
    
    /**
     * İki kartın aynı gruba sahip olup olmadığını kontrol eder
     * @param {ElementKarti} digerKart - Karşılaştırılacak kart
     * @return {boolean} Aynı grupta ise true
     */
    ayniGrup(digerKart) {
        if (this.joker || digerKart.joker) return true;
        
        return this.element.grup === digerKart.element.grup;
    }
    
    /**
     * İki kartın aynı periyoda sahip olup olmadığını kontrol eder
     * @param {ElementKarti} digerKart - Karşılaştırılacak kart
     * @return {boolean} Aynı periyotta ise true
     */
    ayniPeriyot(digerKart) {
        if (this.joker || digerKart.joker) return true;
        
        return this.element.periyot === digerKart.element.periyot;
    }
    
    /**
     * İki kartın ardışık gruplarda olup olmadığını kontrol eder
     * @param {ElementKarti} digerKart - Karşılaştırılacak kart
     * @return {boolean} Ardışık gruplarda ise true
     */
    ardisikGrup(digerKart) {
        if (this.joker || digerKart.joker) return true;
        
        const grup1 = parseInt(this.element.grup);
        const grup2 = parseInt(digerKart.element.grup);
        
        return Math.abs(grup1 - grup2) === 1;
    }
    
    /**
     * İki kartın ardışık periyotlarda olup olmadığını kontrol eder
     * @param {ElementKarti} digerKart - Karşılaştırılacak kart
     * @return {boolean} Ardışık periyotlarda ise true
     */
    ardisikPeriyot(digerKart) {
        if (this.joker || digerKart.joker) return true;
        
        const periyot1 = parseInt(this.element.periyot);
        const periyot2 = parseInt(digerKart.element.periyot);
        
        return Math.abs(periyot1 - periyot2) === 1;
    }
    
    /**
     * Belirtilen koordinatın kart üzerinde olup olmadığını kontrol eder
     * @param {number} mouseX - X koordinatı
     * @param {number} mouseY - Y koordinatı
     * @return {boolean} Kart üzerinde mi
     */
    icerdeMi(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= this.x + this.genislik &&
               mouseY >= this.y && mouseY <= this.y + this.yukseklik;
    }
    
    /**
     * Kartın JSON temsilini döndürür
     * @return {Object} Kartın JSON temsili
     */
    toJSON() {
        return {
            element: {
                atom_no: this.element.atom_no,
                sembol: this.element.sembol,
                isim: this.element.isim,
                grup: this.element.grup,
                periyot: this.element.periyot,
                element_turu: this.element.element_turu
            },
            takim: this.takim,
            joker: this.joker
        };
    }
}

// Node.js ortamında modül olarak dışa aktar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ElementKarti };
}

// Tarayıcı ortamında global değişken olarak tanımla
if (typeof window !== 'undefined') {
    window.ElementKarti = ElementKarti;
} 