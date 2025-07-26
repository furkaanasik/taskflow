# Taskflow - Jira Klonu

Taskflow, popüler proje yönetim aracı Jira'dan esinlenerek geliştirilmiş, modern web teknolojileri kullanılarak oluşturulmuş bir görev ve proje yönetimi uygulamasıdır. Kullanıcılara projeler oluşturma, görevler atama, ve bu görevlerin durumlarını sürükle-bırak arayüzü ile yönetme imkanı sunar.

Bu proje, Next.js, Prisma, NextAuth ve Tailwind CSS gibi güçlü araçlar üzerine inşa edilmiştir.

<br/>

## ✨ Temel Özellikler

- **Proje ve Görev Yönetimi:** Projeler oluşturun ve bu projelere ait görevleri yönetin.
- **Sürükle ve Bırak Arayüzü:** Görevlerin durumunu (Örn: "Yapılacak", "Yapılıyor", "Tamamlandı") panolar arasında kolayca değiştirin.
- **Kullanıcı Yönetimi:** Güvenli kayıt ve giriş işlemleri ile kullanıcı yetkilendirmesi.
- **Çoklu Dil Desteği:** İngilizce ve Türkçe dil seçenekleri.
- **Modern Arayüz:** Tailwind CSS ile oluşturulmuş şık ve kullanışlı tasarım.

## 🚀 Başlangıç

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler

- [Node.js](https://nodejs.org/en/) (v20 veya üstü)
- [pnpm](https://pnpm.io/installation) (veya npm/yarn)

### Kurulum ve Çalıştırma

1.  **Projeyi klonlayın:**
    ```bash
    git clone <proje-repo-adresi>
    cd taskflow
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    pnpm install
    ```

3.  **Veritabanını hazırlayın:**
    Prisma şemasını veritabanınıza yansıtın. Bu komut, `prisma/schema.prisma` dosyasındaki modellere göre tabloları oluşturur.
    ```bash
    npx prisma db push
    ```

4.  **Ortam değişkenlerini ayarlayın:**
    `.env.example` dosyasını `.env` olarak kopyalayın ve içindeki değişkenleri kendi bilgilerinizle doldurun. Özellikle `DATABASE_URL` ve `NEXTAUTH_SECRET` alanları kritiktir.
    ```bash
    cp .env.example .env
    ```

5.  **Geliştirme sunucusunu başlatın:**
    ```bash
    pnpm run dev
    ```

Uygulama varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 🛠️ Teknik Detaylar ve Teknoloji Yığını

Bu projenin teknik yapısı, kullanılan kütüphaneler ve mimari kararlar hakkında daha fazla bilgi için lütfen [TEKNIK_DETAYLAR.md](TEKNIK_DETAYLAR.md) dosyasını inceleyin.

## 📁 Proje Yapısı

Projenin ana dizinleri ve açıklamaları aşağıda verilmiştir:

-   `src/app`: Next.js App Router yapısı. Sayfalar, API rotaları ve bileşenler burada yer alır.
-   `src/components`: Proje genelinde kullanılan React bileşenleri.
-   `src/lib`: Yardımcı fonksiyonlar, veritabanı bağlantısı (`prisma.ts`) ve kimlik doğrulama (`auth.ts`) mantığı.
-   `src/contexts`: React Context API'leri (Auth, Language).
-   `prisma`: Veritabanı şeması (`schema.prisma`) ve veritabanı dosyaları.
-   `public`: Statik dosyalar (resimler, ikonlar, çeviri dosyaları).

## 🤝 Katkıda Bulunma

Katkılarınız projeyi daha iyi hale getirecektir! Lütfen bir "issue" açarak veya "pull request" göndererek katkıda bulunun.