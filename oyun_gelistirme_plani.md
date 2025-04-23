# Periyodik Okey - Geliştirme Planı

## Geliştirme Aşamaları

### 1. Aşama: Temel Altyapı (2 Hafta)
- [x] Proje dokümantasyonu ve oyun kurallarının belirlenmesi
- [x] Oyun akış şemasının oluşturulması
- [x] Element veri tabanının hazırlanması
- [ ] Oyun motoru seçimi ve kurulumu *(Web tabanlı JS/HTML5 Canvas tavsiye edilir)*
- [ ] Proje klasör yapısının oluşturulması ve versionlama (Git) ayarlanması
- [ ] Element kartlarının basit görselleri için şablon hazırlanması

### 2. Aşama: Temel Oyun Mekanikleri (3 Hafta)
- [ ] Kart sınıfının oluşturulması ve veri yapısının kurulması
- [ ] Oyun tahtası ve oyuncu el alanlarının oluşturulması
- [ ] Kart dağıtma sistemi
- [ ] Sürükle-bırak mekanizması
- [ ] Temel oyun döngüsü (Sıra sistemi)
- [ ] Kombinasyon oluşturma ve kontrol etme mantığı

### 3. Aşama: Yapay Zeka ve Oynanış (4 Hafta)
- [ ] Bot yapay zekası için temel algoritma
- [ ] Farklı zorluk seviyelerinde bot davranışları
- [ ] Kombinasyon kontrolü ve puan hesaplama sistemi
- [ ] Oyun başlangıç ve bitiş şartlarının kodlanması
- [ ] Oyun durumunun kaydedilmesi ve yüklenmesi
- [ ] Test etme ve bug düzeltme çalışmaları

### 4. Aşama: Kullanıcı Arayüzü ve Görseller (3 Hafta)
- [ ] Menü ekranlarının oluşturulması
- [ ] Element kartlarının nihai görsel tasarımları
- [ ] Kullanıcı arayüzü animasyonları ve geçiş efektleri
- [ ] Oyun içi ipucu ve yardım sistemi
- [ ] İstatistik ekranı ve başarılar

### 5. Aşama: Ses, Test ve Optimizasyon (2 Hafta)
- [ ] Müzik ve ses efektlerinin eklenmesi
- [ ] Farklı platformlarda test edilmesi
- [ ] Performans optimizasyonu
- [ ] Kullanıcı geri bildirimlerine göre düzenlemeler
- [ ] Son hata düzeltmeleri

## Teknoloji Seçimi Önerileri

### Web Tabanlı Geliştirme
- **Avantajları:** 
  - Platform bağımsız
  - Kolay dağıtım
  - Güncelleme kolaylığı
  - Geniş tarayıcı desteği
- **Teknolojiler:**
  - HTML5 Canvas + JavaScript
  - Phaser.js
  - PixiJS

### Masaüstü Uygulama
- **Avantajları:**
  - Daha yüksek performans
  - Yerel dosya sistemi erişimi
  - Offline oynanabilirlik
- **Teknolojiler:**
  - Unity (C#)
  - Godot Engine (GDScript veya C#)
  - Electron (JavaScript + HTML)

### Mobil Uygulama
- **Avantajları:**
  - Her an erişim
  - Dokunmatik ekran
  - Uygulama marketlerinde dağıtım
- **Teknolojiler:**
  - React Native
  - Flutter
  - Unity (mobil derleme)

## Öncelikli Geliştirme Görevleri

1. Oyun motoru seçimi ve geliştirme ortamının kurulması
2. Temel kart yapısının kodlanması
3. Kart destesinin oluşturulması ve karıştırma sistemi
4. Kartları dağıtma ve oyun başlangıç mantığı
5. Oyuncu hamle sistemi
6. Sürükle-bırak ve kombinasyon oluşturma
7. Kombinasyon doğrulama algoritması

## Sonraki Adımlar
Yukarıdaki görevlerden ilk 3 maddeyi tamamlamak, projenin temel taşlarını oturtmak için kritik öneme sahiptir. Bu görevler tamamlandıktan sonra, oyun mekaniklerinin geliştirilmesine hızla devam edilebilir. 