# Periyodik Okey - Oyun Akış Şeması

```
+---------------------+     +----------------------+     +--------------------+
|                     |     |                      |     |                    |
|   OYUN BAŞLANGICI   +---->+   KART DAĞITMA       +---->+   OYUNCU SIRASI    |
|                     |     |                      |     |                    |
+---------------------+     +----------------------+     +----------+---------+
                                                                    |
                                                                    v
+---------------------+     +----------------------+     +--------------------+
|                     |     |                      |     |                    |
|   SIRALI BOT        |<----+   KART ATMA         |<----+   KART ÇEKME        |
|   HAMLELERİ         |     |                      |     |                    |
|                     |     |                      |     |                    |
+----------+----------+     +----------------------+     +--------------------+
           |
           v
+---------------------+     +----------------------+     +--------------------+
|                     |     |                      |     |                    |
|   KOMBİNASYON       +---->+   YILDIZ KAZANMA     +---->+   OYUN BİTİŞ       |
|   KONTROLÜ          |     |                      |     |   KONTROLÜ         |
|                     |     |                      |     |                    |
+---------------------+     +----------------------+     +----------+---------+
                                                                    |
                                                                    v
                                                          +--------------------+
                                                          |                    |
                                                          |   OYUN SONU        |
                                                          |                    |
                                                          +--------------------+
```

## Detaylı Akış

### 1. Oyun Başlangıcı
- Oyunu başlat butonuna tıklanır
- Oyun ekranı gösterilir
- Oyun nesnesi oluşturulur

### 2. Kart Dağıtma
- Desteyi oluştur ve karıştır
- Oyuncuya 14 kart dağıt
- Her bota 14 kart dağıt
- Açık kartı belirle

### 3. Oyuncu Sırası
- Durum mesajını güncelle ("Sıra sizde!")
- Desteden kart çekme veya açık kartı alma seçenekleri aktif

### 4. Kart Çekme
- Oyuncu desteden kart çekebilir veya açık kartı alabilir
- Çekilen kart oyuncunun eline eklenir
- Kart atma aşamasına geçilir

### 5. Kart Atma
- Oyuncu elinden bir kart seçer ve atar
- Atılan kart açık kart olur
- Sıra botlara geçer

### 6. Sıralı Bot Hamleleri
- Her bot sırayla hamle yapar:
  - Kart çeker veya açık kartı alır
  - Elinden bir kart atar
  - Kombinasyon kontrolü yapılır
- Tüm botlar oynadıktan sonra sıra oyuncuya geçer

### 7. Kombinasyon Kontrolü
- Oyuncu en az 3 kartı seçip "Kontrol Et" butonuna basar
- Seçilen kartların aynı grupta veya periyotta olup olmadığı kontrol edilir
- Geçerli kombinasyon varsa, kartlar elden çıkar ve yıldız kazanılır

### 8. Yıldız Kazanma
- Başarılı kombinasyon yapıldığında ilgili oyuncuya bir yıldız eklenir
- Yıldız göstergeleri güncellenir

### 9. Oyun Bitiş Kontrolü
- Herhangi bir oyuncu veya bot 3 yıldıza ulaştıysa oyun biter
- Kazanan belirlenir

### 10. Oyun Sonu
- Kazanan ilan edilir
- Ana menüye dönüş seçeneği sunulur

## Özel Durumlar

### Destede Kart Kalmadığında
- Atılan kartlar karıştırılarak yeni deste oluşturulur

### Oyuncu Kartı Kalmadığında
- Desteden otomatik olarak yeni kart çekilir

### Kombinasyon Yapıldığında
- Kombinasyon yapan oyuncu veya bot yıldız kazanır
- El güncellenir, yeni kart çekme gerekmez

### Menüye Dönüş
- Oyuncu istediği zaman oyunu bırakıp menüye dönebilir 