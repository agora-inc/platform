import { basePoint } from "../../../config";


var CryptoTS = require("crypto-ts");

const sep = "w3b45t5sqjl2sk452i3t5sqjl2i3w"
const sk = "qwe#';/.,"

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

export function encryptIdAndRoleInUrl(endpoint: string, id: number, role?: string) {
    // Example of endpoint: "event", "streaming", etc..
    var baseUrl = basePoint + "/" + endpoint;

    // Encrypt
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
let a = encryptIdAndRoleInUrl('/', 901)
console.log(a)

export function getIdFromEncryptedEndpoint(encryptedUrl: string) {
    /// NOTE: encryptedUrl is only the encoded endpoint, not the full URL.
    const encryptedPart = encryptedUrl.replace(basePoint + "/", "")

    // console.log("test2:")
    // console.log(encryptedPart)

    const encryptedId = encryptedPart.split(sep)[0];

    // console.log("test3:")
    // console.log(encryptedId)

    var bytes  = CryptoTS.AES.decrypt(encryptedId.toString(), sk);
    var res = bytes.toString(CryptoTS.enc.Utf8);

    // console.log("test4:")
    // console.log(res)

    return res
}

export function getRoleFromEncryptedEndpoint(encryptedUrl: string) {
    /// NOTE: encryptedUrl is only the encoded endpoint, not the full URL.
    const encryptedRole = encryptedUrl.split(sep)[1]

    var bytes  = CryptoTS.AES.decrypt(encryptedRole.toString(), sk);
    return bytes.toString(CryptoTS.enc.Utf8);
}


export const UrlEncryption = {
    encryptIdAndRoleInUrl,
    getIdFromEncryptedEndpoint,
    getRoleFromEncryptedEndpoint
  };
