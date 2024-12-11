const TextUtils = require("./textUtils");

class PromptBuilder {
  static buildPagePrompt(book, pageNumber, previousContent = "") {
    const storyPhase = TextUtils.getStoryPhase(
      pageNumber,
      book.targetPageCount
    );

    return `
      ${book.mainTheme || "Dostoyevski tarzında psikolojik bir hikaye yaz."}
      
      Hikayenin ${storyPhase} bölümündesin.
      ${previousContent ? `Önceki içerik: ${previousContent}\n` : ""}
      
      Şimdi ${pageNumber}. sayfayı yaz.
      
      ÖNEMLİ KURALLAR:
      1. Asla üç nokta (...) ile başlama
      2. Her sayfa farklı bir cümle ile başlamalı
      3. Önceki sayfaların başlangıçlarını tekrar etme
      4. Karakterlerin isimlerini sürekli tekrarlama
      5. Her sayfa bağımsız bir sahne gibi olmalı
      6. Olayları kronolojik olarak ilerlet
      
      YAZIM KURALLARI:
      1. Her sayfa en az 500 kelime uzunluğunda olmalı
      2. Detaylı betimlemeler ve derin psikolojik analizler yap
      3. Karakterin iç dünyasını, düşüncelerini ve çevresini detaylı anlat
      4. Diyalogları ve iç monologları genişlet
      5. Mekanları ve atmosferi detaylı betimle
      6. Olayları acele ettirmeden, derinlemesine işle
      7. Her paragraf en az 4-5 cümle içermeli
      
      İÇERİK GEREKSİNİMLERİ:
      1. En az 3 farklı paragraf olmalı
      2. En az bir iç monolog veya diyalog içermeli
      3. Mekan ve atmosfer betimlemesi yapılmalı
      4. Karakterin psikolojik durumu detaylı işlenmeli
      5. Olay örgüsü mantıklı bir şekilde ilerlemeli
      
      NOT: Başlık veya bölüm numarası EKLEME, direkt hikayeyi yazmaya başla.
    `;
  }

  static buildAutoBookPrompt(pageCount) {
    return `Lütfen ${pageCount} sayfalık bir hikaye oluşturun. Her sayfa ### ile ayrılmalıdır.`;
  }
}

module.exports = PromptBuilder;
