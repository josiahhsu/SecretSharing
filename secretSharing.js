// Josiah Hsu

// wrapper for error alerting
function display_error(text)
{
    alert("ERROR: " + text)
}

// returns the XOR of two arrays of bytes
function xor_bytes(b1, b2)
{
    let newBytes = [];
    for (var i = 0; i < b1.length; i++)
    {
        newBytes.push(b1[i] ^ b2[i]);
    }
    return newBytes;
}

// makes a pad of n random bytes
function make_pad(n)
{
    let pad = [];
    for (var i = 0; i < n; i++)
    {
        pad.push(Math.floor(Math.random() * 256));
    }
    return pad;
}

// encodes a string of text using utf8 encoding
function get_charcode_array(text)
{
    let utf8Encode = new TextEncoder();
    return utf8Encode.encode(text);
}

// converts a delimited string of hex numbers to an array
function hexstring_to_array(s, delim)
{
    // if delimiter is blank, divide into two-character chunks for hex representation
    let arr = (delim)? s.split(delim) : s.match(/.{1,2}/g);

    // use a pattern to check if the given array item is a byte in hex
    // valid bytes return their numeric representation, invalid bytes return NaN
    let pattern = /^[0-9a-fA-F]{2}$/;
    return arr.map((x)=>{ return pattern.test(x) ? parseInt(x, 16) : NaN});
}

// converts an array to a delimited string of hex numbers
function array_to_hexstring(arr, delim)
{
    // creates auxillary array of hex strings from the array
    let aux = [];
    for (const a of arr)
    {
        // prepends a 0 for single hex-digit values
        aux.push((a < 16? "0":"").concat(a.toString(16)));
    }
    return aux.join(delim);
}

// splits a plaintext into n shares
function split_plaintext(text, n)
{
    // final share will be a running XOR of random pads and the
    // original text's charcode representation
    let runningXOR = get_charcode_array(text);

    let shares = [];
    for (var i = 0; i < n-1; i++)
    {
        // generate n-1 pads
        let pad = make_pad(runningXOR.length);
        shares.push(pad);
        runningXOR = xor_bytes(runningXOR, pad);
    }
    shares.push(runningXOR);
    return shares;
}

// recombines shares
function combine_shares(shares)
{
    // confirm that all shares are of the same length
    let length = shares[0].length;

    for (const s of shares)
    {
        if (s.length != length)
        {
            display_error("Shares must have the same length.");
            return "";
        }
    }

    // simply XOR all shares together to get original charcode representation
    let recombined = new Array(length).fill(0);
    for (const s of shares)
    {
        recombined = xor_bytes(recombined, s);
    }

    let utf8Decode = new TextDecoder();
    return utf8Decode.decode(new Uint8Array(recombined));
}
