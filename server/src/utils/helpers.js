import crypto from 'crypto';

export function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function generateSignature(params, secret) {
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}${params[key]}`)
        .join('');
    const signatureString = `${sortedParams}${secret}`;
    return crypto.createHash('md5').update(signatureString).digest("hex");
}