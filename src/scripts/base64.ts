/**  
*  
*  Base64 encode / decode  
*  文字采用UTF-8方式进行Base64编码
*  
*/  
    
export class Base64 {
    // 私有字段（真正的私有，外部无法访问）
    #keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // 公共方法：Base64 编码
    encode(input: string): string {
        const output: string[] = [];
        let i = 0;
        const utf8Bytes = this.#utf8Encode(input);

        while (i < utf8Bytes.length) {
            const chr1 = utf8Bytes[i++]!;
            const chr2 = i < utf8Bytes.length ? utf8Bytes[i++]! : NaN;
            const chr3 = i < utf8Bytes.length ? utf8Bytes[i++]! : NaN;

            const enc1 = chr1 >> 2;
            const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            const enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            const enc4 = chr3 & 63;

            output.push(
                this.#keyStr.charAt(enc1) +
                this.#keyStr.charAt(enc2) +
                (isNaN(chr2) ? '=' : this.#keyStr.charAt(enc3)) +
                (isNaN(chr3) ? '=' : this.#keyStr.charAt(enc4))
            );
        }

        return output.join('');
    }

    // 公共方法：Base64 解码
    decode(input: string): string {
        // 移除非 Base64 字符
        const filteredInput = input.replace(/[^A-Za-z0-9+/=]/g, '');
        let output = '';
        let i = 0;

        while (i < filteredInput.length) {
            const enc1 = this.#keyStr.indexOf(filteredInput.charAt(i++));
            const enc2 = this.#keyStr.indexOf(filteredInput.charAt(i++));
            const enc3 = this.#keyStr.indexOf(filteredInput.charAt(i++));
            const enc4 = this.#keyStr.indexOf(filteredInput.charAt(i++));

            const chr1 = (enc1 << 2) | (enc2 >> 4);
            const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            const chr3 = ((enc3 & 3) << 6) | enc4;

            output += String.fromCharCode(chr1);
            if (enc3 !== 64 && !isNaN(enc3)) output += String.fromCharCode(chr2);
            if (enc4 !== 64 && !isNaN(enc4)) output += String.fromCharCode(chr3);
        }

        return this.#utf8Decode(output);
    }

    // 私有方法：UTF-8 编码（返回字节数组）
    #utf8Encode(str: string): number[] {
        const bytes: number[] = [];
        str = str.replace(/\r\n/g, '\n');

        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i);
            if (c < 128) {
                bytes.push(c);
            } else if (c < 2048) {
                bytes.push((c >> 6) | 0xc0); // 192
                bytes.push((c & 0x3f) | 0x80); // 128
            } else {
                bytes.push((c >> 12) | 0xe0); // 224
                bytes.push(((c >> 6) & 0x3f) | 0x80);
                bytes.push((c & 0x3f) | 0x80);
            }
        }
        return bytes;
    }

    // 私有方法：UTF-8 解码（从字符串解析为原始字符串）
    #utf8Decode(utftext: string): string {
        let result = '';
        let i = 0;

        while (i < utftext.length) {
            const c = utftext.charCodeAt(i);
            if (c < 0x80) {
                result += String.fromCharCode(c);
                i++;
            } else if (c < 0xe0) {
                const c2 = utftext.charCodeAt(i + 1);
                result += String.fromCharCode(((c & 0x1f) << 6) | (c2 & 0x3f));
                i += 2;
            } else {
                const c2 = utftext.charCodeAt(i + 1);
                const c3 = utftext.charCodeAt(i + 2);
                result += String.fromCharCode(
                    ((c & 0x0f) << 12) | ((c2 & 0x3f) << 6) | (c3 & 0x3f)
                );
                i += 3;
            }
        }
        return result;
    }

    // 私有方法：交换相邻字符（从索引 1 开始，每两个交换）
    #exchangeCharacter(str: string): string {
    const chars = [...str]; // 类型 string[]
    for (let i = 2; i < chars.length; i += 2) {
        const a = chars[i - 1]!;
        const b = chars[i]!;
        chars[i - 1] = b;
        chars[i] = a;
    }
    return chars.join('');
    }

    // 公共方法：用于绕过防火墙的编码
    encodePostParam(input: string): string {
        const base64 = this.encode(input);
        const reversed = base64.split('').reverse().join('');
        return this.#exchangeCharacter(reversed);
    }

    // 公共方法：解码 Post 参数
    decodePostParam(input: string): string {
        const exchanged = this.#exchangeCharacter(input);
        const reversed = exchanged.split('').reverse().join('');
        return this.decode(reversed);
    }
}