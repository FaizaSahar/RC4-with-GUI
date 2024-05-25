class KSA {
    constructor(key) {
        this.S = [];
        this.j = 0;
        this.init(key);
    }

    init(key) {
        for (let i = 0; i < 26; i++) {
            this.S[i] = i;
        }

        let j = 0;
        for (let i = 0; i < 26; i++) {
            j = (j + this.S[i] + key.charCodeAt(i % key.length)) % 26;
            [this.S[i], this.S[j]] = [this.S[j], this.S[i]];
        }
    }

    generateKeystream(length) {
        let keystream = [];
        let i = 0;
        this.j = 0;

        for (let k = 0; k < length; k++) {
            i = (i + 1) % 26;
            this.j = (this.j + this.S[i]) % 26;
            [this.S[i], this.S[this.j]] = [this.S[this.j], this.S[i]];
            keystream[k] = this.S[(this.S[i] + this.S[this.j]) % 26];
        }
        return keystream;
    }
}

function encrypt(plaintext, keystream) {
    let ciphertext = "";
    for (let i = 0; i < plaintext.length; i++) {
        ciphertext += String.fromCharCode(plaintext.charCodeAt(i) ^ keystream[i]);
    }
    return btoa(ciphertext); // Convert to base64 to handle binary data in text areas
}

function decrypt(ciphertext, keystream) {
    let decodedText = atob(ciphertext); // Decode from base64
    let plaintext = "";
    for (let i = 0; i < decodedText.length; i++) {
        plaintext += String.fromCharCode(decodedText.charCodeAt(i) ^ keystream[i]);
    }
    return plaintext;
}

function encryptText() {
    const plaintext = document.getElementById("plaintext").value;
    const key = document.getElementById("key").value;
    if (!plaintext || !key) {
        alert("Please enter both plaintext and key.");
        return;
    }

    const keyGen = new KSA(key);
    const keystream = keyGen.generateKeystream(plaintext.length);
    const ciphertext = encrypt(plaintext, keystream);

    document.getElementById("ciphertext").value = ciphertext;
    document.getElementById("ciphertext-section").style.display = 'block';
}

function decryptText() {
    const ciphertext = document.getElementById("ciphertext").value;
    const key = document.getElementById("key").value;
    if (!ciphertext || !key) {
        alert("Please enter both ciphertext and key.");
        return;
    }

    const keyGen = new KSA(key);
    const keystream = keyGen.generateKeystream(atob(ciphertext).length);
    const decryptedText = decrypt(ciphertext, keystream);

    document.getElementById("decryptedtext").value = decryptedText;
    document.getElementById("decryptedtext-section").style.display = 'block';
}