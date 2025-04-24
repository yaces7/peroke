/**
 * Element Kartı Sınıfı
 * Oyun içerisinde kullanılan element kartlarını temsil eder
 */

import { elementBul } from './elementler.js';

class ElementKarti {
    /**
     * Element kartı oluşturur
     * @param {Object} element Element bilgileri
     * @param {string} kartId Benzersiz kart ID'si
     */
    constructor(element, kartId) {
        this.element = element;
        this.id = kartId || `kart-${element.atomNumarasi}-${Date.now()}`;
        this.secili = false;
    }

    /**
     * Kart için HTML elementi oluşturur
     * @param {boolean} onYuzGoster Kartın ön yüzünü göster (true) veya arka yüzünü göster (false)
     * @returns {HTMLElement} Kart HTML elementi
     */
    htmlOlustur(onYuzGoster = true) {
        const kartDiv = document.createElement('div');
        kartDiv.className = 'element-karti';
        kartDiv.dataset.id = this.id;
        kartDiv.dataset.atomNumarasi = this.element.atomNumarasi;
        
        // Kart ön yüzü
        const onYuz = document.createElement('div');
        onYuz.className = 'kart-on-yuz';
        
        // Element sembolü
        const sembol = document.createElement('div');
        sembol.className = 'element-sembol';
        sembol.textContent = this.element.sembol;
        
        // Element adı
        const ad = document.createElement('div');
        ad.className = 'element-ad';
        ad.textContent = this.element.ad;
        
        // Atom numarası
        const atomNo = document.createElement('div');
        atomNo.className = 'atom-numarasi';
        atomNo.textContent = this.element.atomNumarasi;
        
        // Grup ve periyot
        const grupPeriyot = document.createElement('div');
        grupPeriyot.className = 'grup-periyot';
        grupPeriyot.textContent = `G: ${this.element.grup} P: ${this.element.periyot}`;
        
        // Elementleri ön yüze ekleme
        onYuz.appendChild(atomNo);
        onYuz.appendChild(sembol);
        onYuz.appendChild(ad);
        onYuz.appendChild(grupPeriyot);
        
        // Kart arka yüzü
        const arkaYuz = document.createElement('div');
        arkaYuz.className = 'kart-arka-yuz';
        arkaYuz.textContent = 'P';
        
        // Kart div'ine ön ve arka yüzleri ekleme
        kartDiv.appendChild(onYuz);
        kartDiv.appendChild(arkaYuz);
        
        // Kategoriye göre arka plan rengini ayarlama
        const renk = this.kategoriRengi();
        onYuz.style.backgroundColor = renk;
        
        // Ön veya arka yüzü göster
        if (onYuzGoster) {
            onYuz.style.display = 'flex';
            arkaYuz.style.display = 'none';
        } else {
            onYuz.style.display = 'none';
            arkaYuz.style.display = 'flex';
        }
        
        // Eğer kart seçiliyse, bunu göster
        if (this.secili) {
            kartDiv.classList.add('secili');
        }
        
        return kartDiv;
    }
    
    /**
     * Kategori rengini döndürür
     * @returns {string} Renk kodu
     */
    kategoriRengi() {
        switch (this.element.kategori) {
            case 'Alkali Metaller':
                return '#ff5733';
            case 'Toprak Alkali Metaller':
                return '#ffc300';
            case 'Geçiş Metalleri':
                return '#daf7a6';
            case 'Diğer Metaller':
                return '#c70039';
            case 'Yarı Metaller':
                return '#900c3f';
            case 'Ametaller':
                return '#581845';
            case 'Halojenler':
                return '#2471a3';
            case 'Soy Gazlar':
                return '#7d3c98';
            default:
                return '#bdc3c7';
        }
    }
    
    /**
     * Kartı seçili olarak işaretler
     * @param {boolean} secili Seçili durumu
     */
    seciliDurumAyarla(secili) {
        this.secili = secili;
        const kartElement = document.querySelector(`.element-karti[data-id="${this.id}"]`);
        if (kartElement) {
            if (secili) {
                kartElement.classList.add('secili');
            } else {
                kartElement.classList.remove('secili');
            }
        }
    }
    
    /**
     * Kartın ön veya arka yüzünü gösterir
     * @param {boolean} onYuzGoster Ön yüzü göster (true) veya arka yüzü göster (false)
     */
    yuzDurumAyarla(onYuzGoster) {
        const kartElement = document.querySelector(`.element-karti[data-id="${this.id}"]`);
        if (kartElement) {
            const onYuz = kartElement.querySelector('.kart-on-yuz');
            const arkaYuz = kartElement.querySelector('.kart-arka-yuz');
            
            if (onYuzGoster) {
                onYuz.style.display = 'flex';
                arkaYuz.style.display = 'none';
            } else {
                onYuz.style.display = 'none';
                arkaYuz.style.display = 'flex';
            }
        }
    }
}

export { ElementKarti }; 