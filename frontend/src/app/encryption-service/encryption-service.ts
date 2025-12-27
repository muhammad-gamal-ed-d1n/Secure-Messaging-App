import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Injectable()
@Component({
  selector: 'app-encryption-service',
  imports: [CommonModule, FormsModule],
  templateUrl: './encryption-service.html',
  styleUrl: './encryption-service.css',
})
export class EncryptionService {
  message: string = '';
  key: string = '';
  state: string = 'encrypt';
  header: string = 'Public Key:'
  buttonPlaceholder: string = 'Encrypt Message';

  constructor(private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    const publicPem = `-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQBbLXv7ZMBRkhdylmQaKoEK
iSMNR7fBB1dm688FbC2HXeQhEdk4QaNsTxpfaHnjMAthbfPV5rnh3GDrWTCJ0iuM
GLnI+nHrXbd1Oha3idT2qAN4ZssvgSO9tlA6UDNQtgvlcMHgX+KIuyn7dCs/sA2l
GcaUapivp22rsXYA1zDYCO9QfLUGTtB90ZQTxdmt6PlD/qNOkDBxdsj/5Bbc/Hhf
IOzJghoIUh9aSIgbX9cxLGh3R0SZlReHtK3kDLz4x5XLsBTSypnmb/6t7vB3gixE
Zk26aPDKWGwHqYBmphiJK6YGK2aRlYR3MuP2XQ+ZVvWI8vTpjGtmr4cvpWWrFhEh
AgMBAAE=
-----END PUBLIC KEY-----`;
    const privatePem = `-----BEGIN RSA PRIVATE KEY-----
MIIEoQIBAAKCAQBbLXv7ZMBRkhdylmQaKoEKiSMNR7fBB1dm688FbC2HXeQhEdk4
QaNsTxpfaHnjMAthbfPV5rnh3GDrWTCJ0iuMGLnI+nHrXbd1Oha3idT2qAN4Zssv
gSO9tlA6UDNQtgvlcMHgX+KIuyn7dCs/sA2lGcaUapivp22rsXYA1zDYCO9QfLUG
TtB90ZQTxdmt6PlD/qNOkDBxdsj/5Bbc/HhfIOzJghoIUh9aSIgbX9cxLGh3R0SZ
lReHtK3kDLz4x5XLsBTSypnmb/6t7vB3gixEZk26aPDKWGwHqYBmphiJK6YGK2aR
lYR3MuP2XQ+ZVvWI8vTpjGtmr4cvpWWrFhEhAgMBAAECggEAG/lBf6iypJQo43wm
rCx8OMpIWcu2Id/pveb9NhGxikWRN2Atf+gLhrBiTAFW3BAifbrpQ6gtQZGGns5X
aQF1YN85KONFzkuLfMjcrWT5VM/JeMg48JMzbwIfbTSr+chQsA0/PmLMstyRjddf
aYPPO+dDmMd3nvTEXhftN2bOUolUXFotnX0Tv3Wvf6uetQEoIlnPsMjhg+5iMIkj
cHcq+QyGTIO3nt/pzIIUswqJG2Yqx6WWKeIRclb9fvXmbmNPWRB7v9Z5qa87n1Ky
/6ZFeXD3TLIdqrJqIgph3IZ4EodHM+kci7yuXF5z2jWkaTWVKEQeUVYTCyzxEX58
QdEmQQKBgQCyUc85VN5nN0Iiu3NERvN7V2qm9/ub55EuxLrYr8SFwQYtEtGP3FaM
F7FGwy6afIJkIUlRyCSkexg4iwRNO49J7QB0Ag6pacwJUqwcJUyfe/jfDHVplCJb
spnDDPvVLCK6kmEhZR0RKIZoDf/TKo+PgDStpmTR+F4nmz1zHkSP2QKBgQCC5Z1N
JkvXnbRdoatiOYvKPs0gOMfPPCuGQXwTq3+VnwPNNXx6MtAc3GgBLJusfhQ8nPr1
fF/kza9D9iBrGd+FMl/3l4BfjswmKdgyHMulAKvcLZIF1S4ymcgZPMjzvP2XfvBy
g42/5tW7hT180dvHFBi7ISFOEVZMKHVEp3YGiQKBgDs2UztUZS2c+ccSu6nWbY9t
barX+aLBeEIxbWH6q6VGfUiGUTQWFF8clu9KbLU71whszS3s6c38WgSclOcYefIw
UtAyxq+Ww/vsid4mvJTQ08ktF+fhGq+cVNah/xXAPB/772jpbIeAD3GKBIMYROd/
yP5InH3knU9Fi1gomtexAoGAVHEYBvsblh8Qig6PZzBEc9YLsiuvCouAcH2yM2ZB
Sh5o72r/wD0jcFrnZUqHqsEzAN8sLk1r90iRNkCDLVRlk6GpsymzEPIn1L7Nz5Yv
8WP7enCTcNvTj6URJubFpCdZWO/04YroWNHrM6uCvREMvOLECYQX3irlBwBalk2J
oDECgYA76K1zNJJwN5hHG3SOFx4woN6gdbUNCdJdwX9ffLYvSGSVrFdrCfk4i6cK
QVP9rRDxQQN3SyUJnA/dHgp50d5KhJ3K6fLrp3XBj1NKZaGX0VCv7oXthaEPj8ZY
2jPeUtrDmzBdd7VqyX1MglTd8rHvunspHHI/CUo2juraoObiSg==
-----END RSA PRIVATE KEY-----`;

    const encrypted = await this.encrypt("ab", publicPem);
    console.log("Encrypted base64:", this.arrayBufferToBase64(encrypted));

    const decrypted = await this.decrypt(encrypted, privatePem);
    console.log("Decrypted string:", decrypted); // should be "ab"

  }

  toggleState() {
    this.state = (this.state === 'encrypt') ? 'decrypt' : 'encrypt';
    this.header = (this.header === 'Public Key:') ? 'Private Key:' : 'Public Key:';
    this.buttonPlaceholder = (this.buttonPlaceholder === 'Encrypt Message') ?
      'Decrypt Message' :
      'Encrypt Message';
  }

  async processMessage() {
    if (!this.message || !this.key) return;

    if (this.state === 'encrypt') {
      const encrypted = await this.encrypt(this.message, this.key);
      this.message = this.arrayBufferToBase64(encrypted);
      this.cdr.detectChanges();
    }
    else {
      const b64 = this.base64ToArrayBuffer(this.message);
      const decrypted = await this.decrypt(b64, this.key);
      debugger;
      this.message = decrypted;
      this.cdr.detectChanges();
    }
  }

  arrayBufferToBase64(buf: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
  }

  base64ToArrayBuffer(b64: string) {
    const binary = atob(b64);
    const buffer = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
  }

  pemToBinary(pem: string) {
    const b64 = pem
      .replace(/-----BEGIN [\w\s]+-----/, '')
      .replace(/-----END [\w\s]+-----/, '')
      .replace(/\s/g, '')

    const binary = atob(b64);
    const buffer = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }

    return buffer.buffer;
  }

  async importPublicKey(pem: string) {
    const keyData = this.pemToBinary(pem);

    return crypto.subtle.importKey(
      'spki',
      keyData,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      true,
      ['encrypt']
    )
  }

  async importPrivateKey(pem: string) {
    const keyData = this.pemToBinary(pem);

    return crypto.subtle.importKey(
      'pkcs8',
      keyData,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      true,
      ['decrypt']
    )
  }

  async encrypt(message: string, pem: string) {
    const encoded = new TextEncoder().encode(message);
    const publicKey = await this.importPublicKey(pem);
    const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, encoded);
    return encrypted;
  }

  async decrypt(cipherText: ArrayBuffer, pem: string): Promise<string> {
    const privateKey = await this.importPrivateKey(pem);
    const decrypted = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, cipherText);
    return new TextDecoder().decode(decrypted);
  }
}
