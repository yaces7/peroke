/**
 * Periyodik Okey - Kart Sınıfı
 * Oyunda kullanılan element kartlarını temsil eden sınıf
 */

// Bu sınıf adını değiştirerek, main.js'de oluşabilecek çakışmaları önlüyoruz
class ElementKartiSinifi {
    /**
     * ElementKartiSinifi sınıfı yapıcı metodu
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
            logo.style.width = '35px'; // Daha küçük logo
            logo.style.height = '35px'; // Daha küçük logo
            logo.style.borderRadius = '50%';
            logo.style.backgroundColor = 'rgba(255,255,255,0.8)';
            logo.style.display = 'flex';
            logo.style.alignItems = 'center';
            logo.style.justifyContent = 'center';
            
            // Logo içeriği - Daha küçük yazılar
            logo.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 18px; font-weight: bold; color: ${this.sablonAyarlari.arkaYuzRengi};">PO</div>
                    <div style="font-size: 10px; color: ${this.sablonAyarlari.arkaYuzRengi};">Takım ${this.takim}</div>
                </div>
            `;
            
            kartDiv.appendChild(desen);
            kartDiv.appendChild(logo);
        } else {
            // Ön yüz - element bilgilerini göster
            kartDiv.style.background = this.arkaPlanGradyani();
            
            // Joker kartı özel gösterimi
            if (this.joker) {
                kartDiv.classList.add('joker');
                
                // Joker sembolü
                const jokerSembol = document.createElement('div');
                jokerSembol.className = 'joker-sembol';
                jokerSembol.style.fontSize = '36px';
                jokerSembol.style.fontWeight = 'bold';
                jokerSembol.style.textAlign = 'center';
                jokerSembol.style.marginTop = '40px';
                jokerSembol.style.color = '#000000'; // Siyah yazı
                jokerSembol.textContent = 'J';
                
                // Joker yazısı
                const jokerYazi = document.createElement('div');
                jokerYazi.className = 'joker-yazi';
                jokerYazi.style.fontSize = '18px';
                jokerYazi.style.fontWeight = 'bold';
                jokerYazi.style.textAlign = 'center';
                jokerYazi.style.marginTop = '20px';
                jokerYazi.style.color = '#000000'; // Siyah yazı
                jokerYazi.textContent = 'JOKER';
                
                kartDiv.appendChild(jokerSembol);
                kartDiv.appendChild(jokerYazi);
            } else {
                // Normal element kartı içeriği
                
                // Atom numarası
                const atomNo = document.createElement('div');
                atomNo.className = 'atom-no';
                atomNo.style.position = 'absolute';
                atomNo.style.top = '5px';
                atomNo.style.left = '5px';
                atomNo.style.fontSize = '12px';
                atomNo.style.color = '#000000'; // Siyah yazı
                atomNo.textContent = this.element.atom_no;
                
                // Element sembolü
                const sembol = document.createElement('div');
                sembol.className = 'element-sembol';
                sembol.style.fontSize = '36px';
                sembol.style.fontWeight = 'bold';
                sembol.style.textAlign = 'center';
                sembol.style.marginTop = '30px';
                sembol.style.color = '#000000'; // Siyah yazı
                sembol.textContent = this.element.sembol;
                
                // Element ismi
                const isim = document.createElement('div');
                isim.className = 'element-isim';
                isim.style.fontSize = '14px';
                isim.style.textAlign = 'center';
                isim.style.marginTop = '10px';
                isim.style.color = '#000000'; // Siyah yazı
                isim.textContent = this.element.isim;
                
                // Grup ve periyot bilgisi
                const grupPeriyot = document.createElement('div');
                grupPeriyot.className = 'grup-periyot';
                grupPeriyot.style.fontSize = '12px';
                grupPeriyot.style.textAlign = 'center';
                grupPeriyot.style.marginTop = '15px';
                grupPeriyot.style.padding = '2px 5px';
                grupPeriyot.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // Daha belirgin arka plan
                grupPeriyot.style.borderRadius = '3px';
                grupPeriyot.style.width = '80%';
                grupPeriyot.style.margin = '15px auto 0';
                grupPeriyot.style.color = '#000000'; // Siyah yazı
                
                // Grup ve periyot değerlerini kontrol et
                const grupDegeri = this.element.grup ? this.element.grup : "-";
                const periyotDegeri = this.element.periyot ? this.element.periyot : "-";
                
                grupPeriyot.innerHTML = `<strong>Grup:</strong> ${grupDegeri} <strong>Periyot:</strong> ${periyotDegeri}`;
                
                // Takım bilgisi
                const takimBilgisi = document.createElement('div');
                takimBilgisi.className = 'takim';
                takimBilgisi.style.position = 'absolute';
                takimBilgisi.style.top = '5px';
                takimBilgisi.style.right = '5px';
                takimBilgisi.style.fontSize = '12px';
                takimBilgisi.style.fontWeight = 'bold';
                takimBilgisi.style.color = '#000000'; // Siyah yazı
                takimBilgisi.textContent = `T${this.takim}`;
                
                kartDiv.appendChild(atomNo);
                kartDiv.appendChild(sembol);
                kartDiv.appendChild(isim);
                kartDiv.appendChild(grupPeriyot);
                kartDiv.appendChild(takimBilgisi);
            }
        }
        
        // Element verilerini data özelliklerinde sakla (sürükleme vs. için)
        if (!this.joker && this.element) {
            kartDiv.dataset.atomNo = this.element.atom_no;
            kartDiv.dataset.sembol = this.element.sembol;
            kartDiv.dataset.grup = this.element.grup;
            kartDiv.dataset.periyot = this.element.periyot;
        }
        
        return kartDiv;
    }
    
    /**
     * İki kartın aynı türde olup olmadığını kontrol eder
     * @param {ElementKartiSinifi} digerKart - Karşılaştırılacak kart
     * @return {boolean} Aynı türdeyse true
     */
    ayniTur(digerKart) {
        if (this.joker || digerKart.joker) return true;
        
        return this.element.element_turu === digerKart.element.element_turu;
    }
    
    /**
     * İki kartın aynı grupta olup olmadığını kontrol eder
     * @param {ElementKartiSinifi} digerKart - Karşılaştırılacak kart
     * @return {boolean} Aynı gruptaysa true
     */
    ayniGrup(digerKart) {
        if (this.joker || digerKart.joker) return true;
        
        return this.element.grup === digerKart.element.grup;
    }
    
    /**
     * İki kartın aynı periyotta olup olmadığını kontrol eder
     * @param {ElementKartiSinifi} digerKart - Karşılaştırılacak kart
     * @return {boolean} Aynı periyottaysa true
     */
    ayniPeriyot(digerKart) {
        if (this.joker || digerKart.joker) return true;
        
        return this.element.periyot === digerKart.element.periyot;
    }
    
    /**
     * İki kartın ardışık grupta olup olmadığını kontrol eder
     * @param {ElementKartiSinifi} digerKart - Karşılaştırılacak kart
     * @return {boolean} Ardışık gruptaysa true
     */
    ardisikGrup(digerKart) {
        if (this.joker || digerKart.joker) return true;
        
        const grup1 = parseInt(this.element.grup);
        const grup2 = parseInt(digerKart.element.grup);
        
        if (isNaN(grup1) || isNaN(grup2)) return false;
        
        return Math.abs(grup1 - grup2) === 1;
    }
    
    /**
     * İki kartın ardışık periyotta olup olmadığını kontrol eder
     * @param {ElementKartiSinifi} digerKart - Karşılaştırılacak kart
     * @return {boolean} Ardışık periyottaysa true
     */
    ardisikPeriyot(digerKart) {
        if (this.joker || digerKart.joker) return true;
        
        const periyot1 = parseInt(this.element.periyot);
        const periyot2 = parseInt(digerKart.element.periyot);
        
        if (isNaN(periyot1) || isNaN(periyot2)) return false;
        
        return Math.abs(periyot1 - periyot2) === 1;
    }
    
    /**
     * Verilen (x,y) koordinatının kart içinde olup olmadığını kontrol eder
     * @param {number} mouseX - X koordinatı
     * @param {number} mouseY - Y koordinatı
     * @return {boolean} Koordinat kart içindeyse true
     */
    icerdeMi(mouseX, mouseY) {
        return (
            mouseX >= this.x &&
            mouseX <= this.x + this.genislik &&
            mouseY >= this.y &&
            mouseY <= this.y + this.yukseklik
        );
    }
    
    /**
     * Kart verisini JSON formatına dönüştürür
     * @return {Object} Kartın JSON gösterimi
     */
    toJSON() {
        return {
            element: this.element,
            takim: this.takim,
            joker: this.joker,
            secili: this.secili,
            aktif: this.aktif
        };
    }
}

// Global namespace'e ElementKartiSinifi sınıfını ekle
window.ElementKartiSinifi = ElementKartiSinifi;

// Node.js ortamı için dışa aktarma (export)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ElementKartiSinifi };
} 