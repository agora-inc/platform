var CryptoTS = require("crypto-ts");

const sep = "w3b45t5sqjl2sk452i3t5sqjl2i3w"
const sk = "qwe#';/.,"

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

export async function encryptUrl(baseUrl: string, id: number, role?: string) {
    var data = [{id: 1}, {id: 2}]

    // Encrypt
    // var encodedEndpoint = CryptoTS.AES.encrypt(JSON.stringify(data), 'secret key 123');
    const encodedId = CryptoTS.AES.encrypt(id.toString(), sk).toString();
    var encodedRole = ""
    if (role === null){
        role = getRandomInt(0, 1000).toString();
    }
    
    encodedRole = CryptoTS.AES.encrypt(role, sk).toString()
    
    var encodedEndpoint = encodedId.concat(sep, encodedRole);

    let lastChar = baseUrl.charAt(baseUrl.length-1);
    if (lastChar == "/"){
        return baseUrl + encodedEndpoint
    } else {
        return baseUrl + "/" + encodedEndpoint
    }
}

export async function getIdFromUrl(encryptedUrl: string) {
    const SplitUrl = encryptedUrl.split("/")
    const encryptedEndpoint = SplitUrl[SplitUrl.length-1]
    // const basepoint = encryptedUrl.replace(encryptedEndpoint, "")

    const encryptedId = encryptedEndpoint.split(sep)[0];

    var bytes  = CryptoTS.AES.decrypt(encryptedId.toString(), sk);
    return bytes.toString(CryptoTS.enc.Utf8);
}

export async function getStreamingRoleFromUrl(encryptedUrl: string) {
    const SplitUrl = encryptedUrl.split("/")
    const encryptedEndpoint = SplitUrl[SplitUrl.length-1]
    // const basepoint = encryptedUrl.replace(encryptedEndpoint, "")

    const encryptedRole = encryptedEndpoint.split(sep)[1]

    var bytes  = CryptoTS.AES.decrypt(encryptedRole.toString(), sk);
    return bytes.toString(CryptoTS.enc.Utf8);
}

