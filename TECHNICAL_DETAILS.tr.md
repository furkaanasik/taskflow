# Teknik Detaylar

Bu doküman, Taskflow projesinin teknik yapısı, kullanılan teknolojiler ve mimari kararlar hakkında detaylı bilgi sağlamaktadır.

## 🤖 Teknoloji Yığını

-   **Framework:** [Next.js](https://nextjs.org/) (v15) - React tabanlı, sunucu tarafında render (SSR) ve statik site oluşturma (SSG) yetenekleri sunan modern bir web çatısı.
-   **Veritabanı ORM:** [Prisma](https://www.prisma.io/) - Tip güvenli veritabanı erişimi sağlayan modern bir ORM. SQLite, PostgreSQL, MySQL gibi birçok veritabanını destekler.
-   **Kimlik Doğrulama:** [NextAuth.js](https://next-auth.js.org/) - Next.js uygulamaları için esnek ve güvenli bir kimlik doğrulama çözümü.
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4) - "Utility-first" yaklaşımıyla hızlı ve modern arayüzler geliştirmeyi sağlayan bir CSS çatısı.
-   **Dil:** [TypeScript](https://www.typescriptlang.org/) - JavaScript'e statik tipler ekleyerek daha güvenli ve ölçeklenebilir kod yazmayı sağlar.
-   **Uluslararasılaştırma (i18n):** [i18next](https://www.i18next.com/) ve [react-i18next](https://react.i18next.com/) - Uygulamaya çoklu dil desteği kazandırmak için kullanılır.
-   **Sürükle ve Bırak:** [@dnd-kit](https.dndkit.com/) - React için modern, erişilebilir ve performanslı bir sürükle-bırak kütüphanesi.

## 🏗️ Mimari ve Proje Yapısı

Proje, Next.js App Router mimarisini temel almaktadır. Bu yapı, sunucu bileşenleri (Server Components) ve istemci bileşenleri (Client Components) arasında net bir ayrım yaparak performansı artırır.

-   **`src/app`**: Bu dizin, uygulamanın tüm sayfalarını ve API rotalarını barındırır. Her bir klasör, bir URL segmentine karşılık gelir.
    -   `layout.tsx`: Ana sayfa düzenini tanımlar.
    -   `page.tsx`: Bir rotanın ana arayüzünü oluşturur.
    -   `api/`: API rotaları burada tanımlanır. Örneğin, `api/issues` görevlerle ilgili işlemleri yönetir.

-   **`src/lib`**: Uygulamanın çekirdek mantığını içerir.
    -   `prisma.ts`: Prisma Client'ın singleton örneğini oluşturur ve veritabanı bağlantısını yönetir.
    -   `auth.ts`: NextAuth yapılandırmasını ve kimlik doğrulama stratejilerini (Credentials Provider) içerir.
    -   `i18n.ts`: i18next kütüphanesinin yapılandırmasını barındırır.

-   **`prisma/schema.prisma`**: Veritabanı modellerinin (User, Project, Issue, vb.) tanımlandığı yerdir. `npx prisma db push` komutu bu şemayı okuyarak veritabanı tablolarını oluşturur veya günceller.

-   **`middleware.ts`**: Belirli rotalara erişim kontrolü (örneğin, sadece giriş yapmış kullanıcıların erişebileceği sayfalar) gibi işlemleri yöneten Next.js middleware dosyasıdır.

## 🔑 Kimlik Doğrulama (Authentication)

Kimlik doğrulama işlemleri `NextAuth.js` ile yönetilmektedir. `CredentialsProvider` kullanılarak, kullanıcıların e-posta ve şifre ile giriş yapması sağlanır. Şifreler, `bcryptjs` kütüphanesi kullanılarak hash'lenerek veritabanında güvenli bir şekilde saklanır.

Oturum yönetimi, JWT (JSON Web Tokens) tabanlıdır ve `NEXTAUTH_SECRET` ortam değişkeni ile imzalanır.

## 🌐 Çoklu Dil Desteği (i18n)

Uygulama, `i18next` ve `react-i18next` kütüphaneleri ile çoklu dil desteği sunar. Dil dosyaları `public/locales/{dil}` klasöründe (örn: `public/locales/en/common.json`) JSON formatında tutulur. `LanguageContext` ve `i18n.ts` dosyaları, dil değiştirme ve çevirileri yönetme mantığını içerir.
