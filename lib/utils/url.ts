/**
 * URLからドメイン名を抽出する
 *
 * 無効なURLの場合は元の文字列をそのまま返す。
 * www.プレフィックスは自動的に除去される。
 */
export const extractDomain = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.startsWith("www.") ? hostname.substring(4) : hostname;
  } catch {
    // 無効なURLの場合は元の文字列を返す
    return url;
  }
};

/**
 * 文字列が有効なURLかどうかを判定する
 */
export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * GoogleのFaviconサービスを使用してファビコンURLを生成する
 *
 * 32x32ピクセルのファビコンを取得する。
 * 無効なURLの場合はnullを返す。
 */
export const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
};

/**
 * テキストから有効なURL行のみを抽出する
 *
 * 改行区切りのテキストから、http/httpsで始まる行のみを返す。
 * 空行は自動的に除外される。
 */
export const getValidUrls = (text: string) => {
  // 改行で分割し、空行を除外
  const lines = text.split("\n").filter((line) => line.trim());

  // 正規表現を使用してURL行のみを抽出
  const urlPattern = /^https?:\/\/.+/;
  return lines.filter((line) => urlPattern.test(line.trim()));
};
