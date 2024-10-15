export const generateRandomString = (length: number): string => {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  
  export const generateCodeChallenge = async (
    codeVerifier: string
  ): Promise<string> => {
    const digest = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(codeVerifier)
    );
  
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };
  