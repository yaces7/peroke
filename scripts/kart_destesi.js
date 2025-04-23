/**
 * Periyodik Okey - Kart Destesi Sınıfı
 * Oyun için element kartlarından oluşan deste oluşturma ve yönetme
 */
class KartDestesi {
    /**
     * Kart destesi yapıcı metodu
     * @param {Array} elementler - Element verileri dizisi
     * @param {number} takimSayisi - Kaç takım kartı oluşturulacak
     * @param {number} jokerSayisi - Destede kaç joker olacak
     */
    constructor(elementler, takimSayisi = 2, jokerSayisi = 2) {
        this.elementler = elementler;
        this.takimSayisi = takimSayisi;
        this.jokerSayisi = jokerSayisi;
        this.kartlar = [];
        this.atikKartlar = [];
        this.acikKart = null;
        
        // Desteyi oluştur
        this.desteyiOlustur();
    }
    
    /**
     * Kart destesini elementlerden oluşturur
     */
    desteyiOlustur() {
        this.kartlar = [];
        
        // Her takım için element kartlarını oluştur
        for (let takim = 1; takim <= this.takimSayisi; takim++) {
            this.elementler.forEach((element, index) => {
                // Kart ID'si: takimNo + element atomNo (benzersiz olması için)
                const kartId = (takim * 1000) + element.atom_no;
                
                const kart = {
                    id: kartId,
                    sembol: element.sembol,
                    isim: element.isim,
                    atomNumarasi: element.atom_no,
                    grupNumarasi: element.grup,
                    periyotNumarasi: element.periyot,
                    element_turu: element.element_turu || null,
                    renkKodu: window.elementRengiGetir ? window.elementRengiGetir(element) : '#CCCCCC',
                    takim: takim,
                    joker: false
                };
                
                this.kartlar.push(kart);
            });
        }
        
        // Joker kartları ekle
        for (let i = 0; i < this.jokerSayisi; i++) {
            const jokerId = 10000 + i;
            const joker = {
                id: jokerId,
                sembol: "J",
                isim: "JOKER",
                atomNumarasi: 0,
                grupNumarasi: 0,
                periyotNumarasi: 0,
                element_turu: "joker",
                renkKodu: "#FFFFFF", // Beyaz
                takim: 0, // Jokerler takımsız
                joker: true
            };
            
            this.kartlar.push(joker);
        }
        
        // Desteyi karıştır
        this.karistir();
    }
    
    /**
     * Desteyi karıştırır (Fisher-Yates algoritması)
     */
    karistir() {
        for (let i = this.kartlar.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.kartlar[i], this.kartlar[j]] = [this.kartlar[j], this.kartlar[i]];
        }
    }
    
    /**
     * Desteden bir kart çeker
     * @returns {Object|null} Çekilen kart objesi veya deste boşsa null
     */
    kartCek() {
        if (this.kartlar.length === 0) {
            console.warn("Deste boş, atık kartlar tekrar karıştırılıyor.");
            this.desteyiYenile();
            
            if (this.kartlar.length === 0) {
                console.error("Atık kartlar da boş. Çekilecek kart yok!");
                return null;
            }
        }
        
        return this.kartlar.pop();
    }
    
    /**
     * Açık kartı alır ve yeni bir açık kart çeker
     * @returns {Object|null} Alınan açık kart objesi veya kart yoksa null
     */
    acikKartiAl() {
        if (!this.acikKart) {
            return null;
        }
        
        const alinanKart = this.acikKart;
        this.acikKart = this.kartCek();
        return alinanKart;
    }
    
    /**
     * Bir kartı açık kart olarak belirler
     * @param {Object} kart - Açık kart olarak belirlenecek kart objesi
     */
    acikKartBelirle(kart) {
        // Eğer zaten bir açık kart varsa, atık kartlara ekle
        if (this.acikKart) {
            this.atikKartlar.push(this.acikKart);
        }
        
        this.acikKart = kart;
    }
    
    /**
     * Bir kartı atık kartlara ekler
     * @param {Object} kart - Atık kartlara eklenecek kart objesi
     */
    kartiAt(kart) {
        this.atikKartlar.push(kart);
    }
    
    /**
     * Atık kartları desteye ekler ve karıştırır
     */
    desteyiYenile() {
        if (this.atikKartlar.length === 0) {
            console.warn("Atık kartlar boş, desteyi yenileme başarısız.");
            return;
        }
        
        // Atık kartları desteye ekle
        this.kartlar = [...this.atikKartlar];
        
        // Atık kartları temizle
        this.atikKartlar = [];
        
        // Desteyi karıştır
        this.karistir();
        
        console.log(`Deste yenilendi. Yeni deste boyutu: ${this.kartlar.length}`);
    }
    
    /**
     * Belirli sayıda kartı desteden çeker
     * @param {number} adet - Çekilecek kart sayısı
     * @returns {Array} Çekilen kartlar dizisi
     */
    kartlarCek(adet) {
        const cekilenKartlar = [];
        
        for (let i = 0; i < adet; i++) {
            const kart = this.kartCek();
            if (kart) {
                cekilenKartlar.push(kart);
            } else {
                break; // Deste bittiyse döngüyü sonlandır
            }
        }
        
        return cekilenKartlar;
    }
    
    /**
     * Destede kalan kart sayısını döndürür
     * @returns {number} Kalan kart sayısı
     */
    kalanKartSayisi() {
        return this.kartlar.length;
    }
    
    /**
     * Destede ve atık kartlarda bulunan kartların toplam sayısını döndürür
     * @returns {number} Toplam kart sayısı
     */
    toplamKartSayisi() {
        return this.kartlar.length + this.atikKartlar.length + (this.acikKart ? 1 : 0);
    }
}

// Sınıfı global olarak erişilebilir yap
window.KartDestesi = KartDestesi; 