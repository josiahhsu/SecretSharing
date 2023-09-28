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

function get_charcode_array(text)
{
    let utf8Encode = new TextEncoder();
    return utf8Encode.encode(text);
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
    for (var i = 1; i < shares.length; i++)
    {
        if (shares[i].length != length)
        {
            display_error("Shares must have the same length.");
            return "";
        }
    }

    // simply XOR all shares together to get original charcode representation
    let recombined = new Array(length).fill(0);
    for (var i = 0; i < shares.length; i++)
    {
        recombined = xor_bytes(recombined, shares[i]);
    }

    let utf8Decode = new TextDecoder();
    return utf8Decode.decode(new Uint8Array(recombined));
}
