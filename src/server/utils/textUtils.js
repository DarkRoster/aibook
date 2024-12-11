const removeMarkdown = (text) => {
  if (!text) return "";

  return text
    .replace(/[#*_~`]/g, "") // Markdown karakterlerini kaldır
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Linkleri düzenle
    .replace(/\n\s*\n/g, "\n") // Fazla boş satırları kaldır
    .trim();
};

const getStoryPhase = (currentPage, totalPages) => {
  if (currentPage === 0) return "GİRİŞ";
  if (currentPage === totalPages - 1) return "SONUÇ";

  // Hikayeyi 3 ana bölüme ayır: Giriş (25%), Gelişme (50%), Sonuç (25%)
  const progress = currentPage / totalPages;

  if (progress <= 0.25) return "GİRİŞ";
  if (progress <= 0.75) return "GELİŞME";
  return "SONUÇ";
};

const cleanStoryContent = (content) => {
  if (!content) return "";

  // Gereksiz boşlukları temizle
  let cleanContent = content.trim();

  // Markdown formatını kaldır
  cleanContent = removeMarkdown(cleanContent);

  // Çoklu boş satırları tek boş satıra indir
  cleanContent = cleanContent.replace(/\n{3,}/g, "\n\n");

  // Satır başı ve sonundaki boşlukları temizle
  cleanContent = cleanContent
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  // Başlık veya bölüm numaralarını kaldır
  cleanContent = cleanContent.replace(
    /^(Bölüm|Sayfa|Chapter|Page)\s*\d+[:.]/gim,
    ""
  );
  cleanContent = cleanContent.replace(/^#+ .+$/gm, "");

  // Üç nokta ile başlayan satırları temizle
  cleanContent = cleanContent.replace(/^\.{3,}.+$/gm, "");

  // Gereksiz noktalama işaretlerini düzelt
  cleanContent = cleanContent
    .replace(/([.!?])\1+/g, "$1") // Tekrarlanan noktalama işaretlerini tekile indir
    .replace(/\s+([.,!?])/g, "$1") // Noktalama işaretlerinden önce boşluk varsa kaldır
    .replace(/([.,!?])(?=[A-Za-zÇĞİÖŞÜçğıöşü])/g, "$1 "); // Noktalama işaretlerinden sonra boşluk yoksa ekle

  return cleanContent;
};

module.exports = {
  removeMarkdown,
  getStoryPhase,
  cleanStoryContent,
};
