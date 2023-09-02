// Josiah Hsu

// returns the XOR of two arrays of bytes
function xor_bytes(b1, b2)
{
    let newBytes = [];
    for (var i = 0; i < b1.length; i++)
    {
        newBytes.push(b1[i] ^ b2[i]);
    }
    return newBytes
}

// makes a pad of n random bytes
function make_pad(n)
{
    let pad = []
    for (var i = 0; i < n; i++)
    {
        pad.push(Math.floor(Math.random() * 255))
    }
    return pad
}

// splits a plaintext into n shares
function split_plaintext(text, n)
{
    // final share will be a running XOR of random pads and the
    // original text's charcode representation
    let utf8Encode = new TextEncoder();
    runningXOR = utf8Encode.encode(text);

    let shares = [];
    for (var i = 0; i < n-1; i++)
    {
        // generate n-1 pads
        let pad = make_pad(text.length)
        shares.push(pad)
        runningXOR = xor_bytes(runningXOR, pad)
    }
    shares.push(runningXOR)
    return shares;
}

// recombines shares
function combine_shares(shares)
{
    // simply XOR all shares together to get original charcode representation
    let decoded = new Array(shares[0].length).fill(0);
    for (var i = 0; i < shares.length; i++)
    {
        decoded = xor_bytes(decoded, shares[i])
    }
    return String.fromCharCode(...decoded)
}
