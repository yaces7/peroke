# Periyodik Okey - Oyun Projesi

## Oyun Açıklaması
Periyodik Okey, periyodik tablodaki elementleri öğrenmeyi eğlenceli hale getiren bir kart oyunudur. Oyuncular, periyodik tablodaki element kartlarını aynı grup veya aynı periyot olarak sınıflandırarak puan toplar.

## Oyun Kuralları

### Genel Kurallar
- Oyun tek kişi olarak botlarla oynanır
- Bot sayısı 1-3 arasında ayarlanabilir
- Oyunda 118 elementi temsil eden kartlar ve 2 adet süper element yazılı joker kart vardır
- Toplam 120 kart bulunur

### Hazırlık Aşaması
1. Kartlar masanın ortasında ters çevrilir ve karıştırılır
2. Yedişer karttan olmak üzere 17 blok oluşturulur (17 x 7 = 119 kart, 1 kart fazladan kalır)
3. Oyunu başlatmak için zar atılır
4. Zarda gelen sayı kadar bloklar üzerinde ilerlenir
5. Üzerinde durulan blok ve fazladan kalmış olan kart saat yönündeki ilk oyuncuya verilir
6. Kartlar bloklar halinde saat yönünde 2 tur dağıtılır
7. Geriye kalan bloklar üst üste gelecek şekilde ortaya alınır
8. Saat yönündeki ilk oyuncuda 15 kart, diğer 3 oyuncuda 14'er kart olur

### Oynanış
1. Her oyuncu önündeki kartları aynı grup veya aynı periyot olacak şekilde sınıflandırır
2. Süper element kartları istenilen herhangi bir kartın yerine joker olarak kullanılabilir
3. Sınıflandırma kuralları:
   - Aynı grupta bulunan elementler en az 3 adet olmalıdır
   - Aynı periyotta bulunan elementler en az 4 adet olmalıdır
4. 15 kart bulunduran oyuncu oyunu başlatır:
   - Kendisine yaramayan kartı saat yönünde yere bırakır
   - Kartı yere bırakırken elementin ismini ve grup numarasını söyler
   - Bu kuralı unutan oyuncu ceza olarak bir tur atlanır
5. Saat yönündeki oyuncu kendisine verilen kartı:
   - Alırsa: Diğer kartlarını grup/periyot olarak sınıflandırması gerekir
   - Almaz ise: Ortadaki desteden bir kart çeker ve istediği bir kartı sağındaki oyuncuya bırakır
6. Kartları istenilen şekilde sınıflandıran oyuncu:
   - Grup başına: 10 puan
   - Periyot başına: 5 puan
   - Son kart joker ise: Toplam puanın 2 katı

### Kazanma Şartları
- Elindeki tüm kartları kurallara uygun şekilde sınıflandıran ve kartı kalmayan oyuncu kazanır
- En çok puanı toplayan oyuncu oyunu kazanır

## Oyun Mantığı ve Arayüzü

### Arayüz Bileşenleri
1. Ana menü
   - Oyuna Başla
   - Nasıl Oynanır
   - İstatistikler
   - Ayarlar
   - Çıkış

2. Ayarlar ekranı
   - Bot sayısı ayarı (1-3)
   - Zorluk seviyesi (Kolay, Normal, Zor)

3. Oyun ekranı
   - Oyuncu kartları
   - Bot kartları (kapalı)
   - Açık kart alanı
   - Kapalı deste
   - Kombinasyon alanı
   - Puan tablosu

### Oynanış Mekanikleri
1. Kartlar oyuncular arasında dağıtılır
2. Oyuncu kendi kartlarını görebilir
3. Oyuncu sürükle-bırak yöntemiyle kartları kombinasyon alanına yerleştirebilir
4. Kontrol tuşuna basıldığında:
   - Kombinasyon alanındaki kartlar kontrol edilir
   - Geçerli kombinasyonlar (en az 4 aynı periyotlu veya 3 aynı gruplu element) oyuncuya puan kazandırır
   - Geçerli kombinasyonlar oyun alanından kaybolur
5. Oyuncu hamle yapamadığında, bir kartı sonraki bota verir ve sıra bota geçer
6. Botlar yapay zeka ile hamlelerini yapar
7. Kartları ilk bitiren oyuncu kazanır

## Yapılacaklar Listesi

### Temel Altyapı
- [ ] Oyun motoru seçimi (Unity, Godot veya web tabanlı)
- [x] Proje yapısının oluşturulması
- [x] Temel arayüz tasarımı
- [x] Oyun akış diyagramının hazırlanması

### İçerik Oluşturma
- [x] 118 element kartının temel bilgilerinin CSV formatında hazırlanması
- [x] Kart veri yapısı formatının JSON olarak belirlenmesi
- [ ] Kart görsellerinin tasarlanması
- [ ] Periyodik tablo referans grafiğinin hazırlanması
- [ ] Menü ekranlarının tasarlanması

### Oyun Mekanikleri
- [ ] Kart dağıtma sistemi
- [ ] Kart sürükle-bırak mekanizması
- [ ] Kombinasyon kontrol sistemi
- [ ] Puan hesaplama sistemi
- [ ] Bot yapay zeka algoritması
- [ ] Oyun sonu kontrol mekanizması

### Kullanıcı Deneyimi
- [ ] Animasyonlar ve efektler
- [ ] Ses efektleri ve müzik
- [ ] Yardım ve ipucu sistemi
- [ ] İstatistik kayıt sistemi

### Test ve Optimizasyon
- [ ] Oyun dengesi testleri
- [ ] Bot zorluk seviyesi ayarlamaları
- [ ] Performans optimizasyonu
- [ ] Hata ayıklama

## Yapılanlar Listesi
- [x] Oyun konseptinin ve kurallarının belirlenmesi
- [x] Oyun akışı ve mantığının planlanması
- [x] Oyun akış şemasının oluşturulması
- [x] HTML/CSS ile temel oyun arayüzü taslağının hazırlanması
- [x] Örnek element kartı JSON formatının oluşturulması
- [x] 118 elementin temel bilgilerinin CSV formatında hazırlanması
- [x] Proje dokümantasyonunun oluşturulması
- [x] Element verileri CSV dosyası (elementler.csv) oluşturulması
- [x] Element işlemleri için CSV'den veri yükleme sistemi geliştirilmesi
- [x] Element verilerini işleme ve dönüştürme fonksiyonlarının yazılması
- [x] Oyun mekanikleri (taş oluşturma, karıştırma, dağıtma, kontrol) kodlanması
- [x] Grup kodu (1A, 8A, 3B vb.) dönüşüm sistemi geliştirilmesi
- [x] Ana JavaScript dosyasının oluşturulması ve ayarlar/istatistik yönetimi

## Element Kartı Özellikleri
Her element kartında şu bilgiler yer alacaktır:
- Element sembolü (Ar, Fe, Cu, vb.)
- Element adı
- Atom numarası
- Grup numarası
- Periyot numarası
- Renk kodu (grup tipine göre)

## Not
Bu proje, periyodik tablo elementlerini eğlenceli bir şekilde öğretmeyi amaçlamaktadır. Türk kağıt oyunu "Okey" kurallarından esinlenilmiş ancak periyodik tablo öğrenimini destekleyecek şekilde uyarlanmıştır. 