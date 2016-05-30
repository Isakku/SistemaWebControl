function base64ToAscii(c)
{
	var theChar = 0;
	
	if (0 <= c && c <= 25)
	{
		theChar = String.fromCharCode(c + 65);
	}
	else if (26 <= c && c <= 51)
	{
		theChar = String.fromCharCode(c - 26 + 97);
	}
	else if (52 <= c && c <= 61)
	{
		theChar = String.fromCharCode(c - 52 + 48);
	}
	else if (c == 62)
	{
		theChar = '+';
	}
	else if( c == 63 )
	{
		theChar = '/';
	}
	else
	{
		theChar = String.fromCharCode(0xFF);
	}
 
	return theChar;
}
 
 
/**
 * Encodes a string according to "URL encoding" rules whereby every
 * character is converted to the %xx equivelent. This is similar
 * the JavaScript 'escape()' function, except that it encodes all
 * the characters, not just the special ones like "-/?&...". For example,
 * the string "foo@example.com" will be encoded into 
 * "%66%6F%6F%40%65%78%61%6D%70%6C%65%2E%63%6F%6D".
 *@see myUrlDecode
 */
function myUrlEncode(str, fld) {
	var result = "";
	var i = 0;
	var sextet = 0;
	var leftovers = 0;
	var octet = 0;
 
	for (i=0; i < str.length; i++) {
		octet = str.charCodeAt(i);
		switch( i % 3 )
		{
			case 0:
			{
				sextet = ( octet & 0xFC ) >> 2 ;
				leftovers = octet & 0x03 ;
 
				// sextet contains first character in quadruple
				break;
			}
 
			case 1:
			{
				sextet = ( leftovers << 4 ) | ( ( octet & 0xF0 ) >> 4 );
				leftovers = octet & 0x0F ;
 
				// sextet contains 2nd character in quadruple
				break;
			}
 
			case 2:
			{
				sextet = ( leftovers << 2 ) | ( ( octet & 0xC0 ) >> 6 ) ;
				leftovers = ( octet & 0x3F ) ;
 
				// sextet contains third character in quadruple
				// leftovers contains fourth character in quadruple
				break;
			}
		}
 
		result = result + base64ToAscii(sextet);
 
		// don't forget about the fourth character if it is there
		if( (i % 3) == 2 )
		{
			result = result + base64ToAscii(leftovers);
		} 
 
	}
 
	// figure out what to do with leftovers and padding
	switch( str.length % 3 )
	{
		case 0:
		{
			// an even multiple of 3, nothing left to do
			break ;
		}
		case 1:
		{
			// one 6-bit chars plus 2 leftover bits
			leftovers =  leftovers << 4 ;
			result = result + base64ToAscii(leftovers);
			result = result + "==";
			break ;
		}
		case 2:
		{
			// two 6-bit chars plus 4 leftover bits
			leftovers = leftovers << 2 ;
			result = result + base64ToAscii(leftovers);
			result = result + "=";
			break ;
		}
	}
 
	return result;
}
 
 
/** 
 * A helper function for converting a hex digit into the corresponding
 * integer value. I really don't know much about JavaScript, so the
 * the conversion is a little laborious. There probably is an easier
 * way (including a built-in function), but I don't know it.
 */
function hexval(c) {
	if (String('0').charCodeAt(0) <= c && c <= String('9').charCodeAt(0))
		return c - String('0').charCodeAt(0);
	if (String('A').charCodeAt(0) <= c && c <= String('F').charCodeAt(0))
		return c - String('A').charCodeAt(0) + 10;
	if (String('a').charCodeAt(0) <= c && c <= String('f').charCodeAt(0))
		return c - String('a').charCodeAt(0) + 10;
	return 0;
}
 
/**
 * Decodes a string that has been previously encoded according to the
 * myUrlDecode() function.
 *@see myUrlEncode
 */
function myBase64Decode(str, is_binary) {
	var result = "";
	var i = 0;
	var x;
	var shiftreg = 0;
	var count = -1;
 
	
	for (i=0; i < str.length; i++) {
		c = str.charAt(i);
		if ('A' <= c && c <= 'Z')
			x = str.charCodeAt(i) - 65;
		else if ('a' <= c && c <= 'z')
			x = str.charCodeAt(i) - 97 + 26;
		else if ('0' <= c && c <= '9')
			x = str.charCodeAt(i) - 48 + 52;
		else if (c == '+')
			x = 62;
		else if (c == '/')
			x = 63;
		else
			continue;
 
		count++;
 
		switch (count % 4)
		{
		case 0:
			shiftreg = x;
			continue;
		case 1:
			v = (shiftreg<<2) | (x >> 4);
			shiftreg = x & 0x0F;
			break;
		case 2:
			v = (shiftreg<<4) | (x >> 2);
			shiftreg = x & 0x03;
			break;
		case 3:
			v = (shiftreg<<6) | (x >> 0);
			shiftreg = x & 0x00;
			break;
		}
 
		if (!is_binary && (v < 32 || v > 126) && (v != 0x0d) && (v != 0x0a)) 
		{
			result = result + "<";
			result = result + "0123456789ABCDEF".charAt((v/16)&0x0F);
			result = result + "0123456789ABCDEF".charAt((v/1)&0x0F);
			result = result + ">";
		}
		else
			result = result + String.fromCharCode(v);
 
	}
	return result.toString();
}
 
/**
 * 
 */
function myNbtDecode(str) {
	var result = "";
	var i = 0;
	var x;
	var shiftreg = 0;
	var count = -1;
 
	
	for (i=0; i < str.length; i++) {
		c = str.charAt(i);
		if ('A' <= c && c <= 'Z')
			x = str.charCodeAt(i) - 65;
		else if ('a' <= c && c <= 'z')
			x = str.charCodeAt(i) - 97;
		else
			continue;
 
		count++;
 
		switch (count % 2)
		{
		case 0:
			shiftreg = x;
			continue;
		case 1:
			v = (shiftreg<<2) | (x);
			shiftreg = 0;
			break;
		}
 
		result = result + String.fromCharCode(v);
 
	}
	return result.toString();
}
 
function myUrlDecode(str, fld) {
	fld.value = myBase64Decode(str, false);
}
 
 
var PacketTags = new Array(
		"Reserved - a packet tag must not have this value",
		"Public-Key Encrypted Session Key Packet",
		"Signature Packet",
		"Symmetric-Key Encrypted Session Key Packet",
		"One-Pass Signature Packet",
		"Secret Key Packet",
		"Public Key Packet",
		"Secret Subkey Packet",
		"Compressed Data Packet",
		"Symmetrically Encrypted Data Packet",
		"Marker Packet",
		"Literal Data Packet",
		"Trust Packet",
		"User ID Packet",
		"Public Subkey Packet",
		"Private or Experimental Values"
	);
 
var HashAlgorithm = new Array(
	"UNKNOWN",
	"MD5",
    "SHA1",
    "RIPEMD160",
    "double-width SHA",
    "MD2",
    "TIGER192",
    "HAVAL-5-160"
);
 
var CompressionAlgorithm = new Array(
	"Uncompressed",
	"ZIP (RFC 1951)",
    "ZLIB (RFC 1950)"
);
 
function hexcode(x) {
	var result = "";
	result = result + "0123456789ABCDEF".charAt((x/16)&0x0F);
	result = result + "0123456789ABCDEF".charAt((x/1)&0x0F);
	return result;
}
 
function hexdump(str,i,max) {
	var result = "";
	var start = i;
	var ascii_dump = "";
 
	if (max <= 0)
		max = str.length;
 
	while (i < str.length && i < max) {
		var c = str.charCodeAt(i);
		result = result + hexcode(c);
		if (c > 32 && c < 127)
			ascii_dump = ascii_dump + str.charAt(i);
		else
			ascii_dump = ascii_dump + '.';
		if (((i-start) % 8) == 7) 
			result = result + " ";
		if (((i-start) % 16) == 15) {
			result = result + " " + ascii_dump + "\n";
			ascii_dump = "";
		}
		i++;
	}
 
	while (((i-start) % 16) != 15) {
		result = result + "  ";
		if (((i-start) % 8) == 7) 
			result = result + " ";
		ascii_dump = ascii_dump + " ";
		i++;
	}
	result = result + "    " + ascii_dump + "\n";
	return result;
}
 
function publicKeyAlgorithm(x) {
	var result = "";
 
	switch (x)
	{
	case  1: result = result + "RSA Encrypt or Sign"; break;
	case  2: result = result + "RSA Encrypt-Only"; break;
	case  3: result = result + "RSA Sign-Only"; break;
	case 16: result = result + "Elgamal Encrypt-Only"; break;
	case 17: result = result + "DSA"; break;
	case 18: result = result + "Elliptic Curve"; break;
	case 19: result = result + "ECDSA"; break;
	case 20: result = result + "Elgamal Encrypt or Sign"; break;
	case 21: result = result + "Diffie-Hellman (X9.42) for IETF-S/MIME"; break;
    default: result = result + "UNKNOWN"; break;
	}
 
	return result;
}
 
function myPGPdecodeKey(str, i) {
	var x = 0;
	var result = "";
 
	//- A one-octet version number (3).
	var sig_version = str.charCodeAt(i++);
	result = result + "Sig-Version = " + sig_version + "\n";
 
	//- A four-octet number denoting the time that the key was created.
	x = str.charCodeAt(i)<<24 | str.charCodeAt(i+1)<<16 | str.charCodeAt(i+2)<<8 | str.charCodeAt(i+3);
	var creation_time = new Date();
	creation_time.setTime(x * 1000);
	result = result + "Creation-Time = " + creation_time + "\n";
	i = i + 4;
 
	switch (sig_version) {
	case 3:
		//- A two-octet number denoting the time in days that this key is
		//   valid. If this number is zero, then it does not expire.
		x = str.charCodeAt(i)<<16 | str.charCodeAt(i+1);
		if (x == 0)
			result = result + "Expiration = never\n";
		else
			result = result + "Expiration = " + x + " days\n";
		i = i + 2;
		break;
	}
 
	//- A one-octet number denoting the public key algorithm of this key
	x = str.charCodeAt(i++);
	result = result + "Public-Key-Algorithm = " + x + " (" + publicKeyAlgorithm(x) + ")\n";
 
	switch (x) {
	case 1: /*RSA Encrypt and Sign */
		var bit_count = 0;
		var byte_count = 0;
 
		bit_count = str.charCodeAt(i+0)<<8 | str.charCodeAt(i+1);
		byte_count = bit_count;
		while (byte_count%8)
			byte_count++;
		byte_count = byte_count / 8;
		i = i + 2;
 
 
		result = result + "Product (N) of two primes = " + bit_count + " bits\n";
		//result = result + "Product (N) of two primes:\n";
		//result = result + "bytecount=" + byte_count + "\n";
		//result = result + hexdump(str,i,i+byte_count);
		i = i + byte_count;
 
		
		bit_count = str.charCodeAt(i+0)<<8 | str.charCodeAt(i+1);
		byte_count = bit_count;
		while (byte_count%8)
			byte_count++;
		byte_count = byte_count / 8;
		i = i + 2;
 
		
		switch (byte_count) {
		case 1:
			x = str.charCodeAt(i);
			result = result + "Public-Exponent (e) = " + x + "\n";
			break;
		case 2:
			x = str.charCodeAt(i+0)<<8 | str.charCodeAt(i+1);
			result = result + "Public-Exponent (e) = " + x + "\n";
			break;
		default:

			result = result + "Public-Exponent:\n";
			result = result + hexdump(str,i,i+byte_count);
			break;
		}
		i = i + byte_count;
 
		result = result + hexdump(str,i,0);
 
		break;
	case 17: /*DSA */
	    result = result + "DSA-Prime-p = " + mpi_integer(str,i) + mpi_bits(str,i) + "\n";
		i = i + mpi_length(str,i);
	    result = result + "DSA-Group-Order-q = " + mpi_integer(str,i) + mpi_bits(str,i) + "\n";
		i = i + mpi_length(str,i);
	    result = result + "DSA-Group-Gen-g = " + mpi_integer(str,i) + mpi_bits(str,i) + "\n";
		i = i + mpi_length(str,i);
	    result = result + "DSA-Key-Val-y = " + mpi_integer(str,i) + mpi_bits(str,i) + "\n";
		i = i + mpi_length(str,i);
		result = result + hexdump(str,i,0);
		break;
	default:
		result = result + "Public-Key Data:\n";
		result = result + hexdump(str,i,0);
	}
 
	return result;
}
 
function mpi_bits(str,i) {
	var bit_count = 0;
	bit_count = str.charCodeAt(i+0)<<8 | str.charCodeAt(i+1);
	return " (" + bit_count +"-bits)";
}
function mpi_integer(str,i) {
	var bit_count = 0;
	var byte_count = 0;
	var integer=0;
 
	bit_count = str.charCodeAt(i+0)<<8 | str.charCodeAt(i+1);
	byte_count = bit_count;
	while (byte_count%8)
		byte_count++;
	byte_count = byte_count / 8;
	i = i + 2;
 
	while (i<str.length && byte_count) {
		integer = integer * 256 + str.charCodeAt(i);
		i++;
		byte_count = byte_count - 1;
	}
 
	return integer;
}
function mpi_length(str,i) {
	var bit_count = 0;
	var byte_count = 0;
	var integer=0;
 
	bit_count = str.charCodeAt(i+0)<<8 | str.charCodeAt(i+1);
	byte_count = bit_count;
	while (byte_count%8)
		byte_count++;
	byte_count = byte_count / 8;
 
	return byte_count+2;
}
 
function decode_compressed_packet(str,i,len) {
	var result = "";
	var x = 0;
 
	//- One octet that gives the algorithm used to compress the packet.
	x = str.charCodeAt(i++);
	result = result + "Compression-Algorithm = " + x + " (" + CompressionAlgorithm[x] + ")\n";
	result = result + "---- Compressed Data ----\n";
	result = result + hexdump(str,i,0);
 
	return result;
}
 
function decode_new_pgp(str,i,content_tag,len) {
	var result = "";
 
	switch (content_tag) {
	case 8:
		result = result + decode_compressed_packet(str,i,len);
		break;
	default:
		result = result + "---- UNKNOWN DECODE ----\n";
		result = result + hexdump(str,i,0);
	}
	
	return result;
}
 
 
function myPGPdecode(strx) {
 
 
	var result = "";
	var str = "xxx";
	var i = 0;
 
	str = myBase64Decode(strx, true);
	str.toString();
 
	if (str.length < 10)
		return "sig too small " + str;
 
	var tag = str.charCodeAt(i);
	i++;
 
	var content_tag = 0;
	var length_type = -1;
	var len = 0;
	if (tag & 0x80 != 0x80)
		return "Invalid tag\n";
	if ((tag & 0xC0) == 0xC0)
	{
		result = result + "Format = new 5.x OpenPGP format\n";
		content_tag = tag & 0x3F;
		result = result + "Content-Tag = " + content_tag + " ";
		if (content_tag < 14)
			result = result + "(" + PacketTags[content_tag] + ")";
		result = result + "\n";
		len = str.charCodeAt(i++);
		if (len == 255)
		{
			len = str.charCodeAt(i)<<24 | str.charCodeAt(i+1)<<16 | str.charCodeAt(i+2)<<8 | str.charCodeAt(i+3);
		}
		else if (len > 191)
		{
			len = (len - 192) << 8 + str.charCodeAt(i++) + 192;
		}
		result = result + "Length = " + len + " bytes\n";
 
		result = result + decode_new_pgp(str,i,content_tag,len);
		return result;
	}
	else
	{
		result = result + "Format = old 2.x format\n";
		content_tag = (tag >> 2) & 0x0F;
		length_type = tag & 0x03;
		result = result + "Content-Tag = " + content_tag + " ";
		if (content_tag < 14)
			result = result + "(" + PacketTags[content_tag] + ")";
		result = result + "\n";
		//result = result + "Length-Type = " + length_type + "\n";
		if (length_type == 0)
		{
			len = str.charCodeAt(i);
			i = i + 1;
		}
		else if (length_type == 1)
		{
			len = str.charCodeAt(i) << 8 | str.charCodeAt(i+1);
			i = i + 2;
		}
		result = result + "Length = " + len + " bytes\n";
	}
 
	/*if (len > str.length)
		return "missing data, len=" + len + ", str.length = " + str.length + ", c=" + str.charAt(i) + "\n";*/
	//result = result + "Length = " + len + "\n";
 
	if (content_tag == 2)
	{
		//result = result + "---- SIGNATURE ----\n";
		var sig_version = str.charCodeAt(i++);
		var x = 0;
		switch (sig_version)
		{
		case 1:
		case 3:
			result = result + "Sig-Version = " + sig_version + "\n";
			x = str.charCodeAt(i++);
			if (x != 5)
			{
				result = result + "Expected val=5, found " + x + "\n";
				return result;
			}
			x = str.charCodeAt(i++);
			result = result + "Sig-Type = " + x ;
			switch (x)
			{
		    case 0x00: result = result + " (Signature of a binary document.)\n"; break;
		    case 0x01: result = result + " (Signature of a canonical text document.)\n"; break;
		    case 0x02: result = result + " (Standalone signature.)\n"; break;
		    case 0x10: result = result + " (Generic certification of a User ID and Public Key packet.)\n"; break;
		    case 0x11: result = result + " (Persona certification of a User ID and Public Key packet.)\n"; break;
		    case 0x12: result = result + " (Casual certification of a User ID and Public Key packet.)\n"; break;
		    case 0x13: result = result + " (Positive certification of a User ID and Public Key packet.)\n"; break;
		    case 0x18: result = result + " (Subkey Binding Signature)\n"; break;
		    case 0x1F: result = result + " (Signature directly on a key)\n"; break;
		    case 0x20: result = result + " (Key revocation signature)\n"; break;
		    case 0x28: result = result + " (Subkey revocation signature)\n"; break;
		    case 0x30: result = result + " (Certification revocation signature)\n"; break;
		    case 0x40: result = result + " (Timestamp signature.)\n"; break;
			default: result = result + "(unknown)\n"; break;
			}
			x = str.charCodeAt(i)<<24 | str.charCodeAt(i+1)<<16 | str.charCodeAt(i+2)<<8 | str.charCodeAt(i+3);
			var creation_time = new Date();
			creation_time.setTime(x * 1000);
			result = result + "Creation-Time = " + creation_time + "\n";
			i = i + 4;
 
			//- Eight-octet key ID of signer.
			result = result + "KeyID = 0x";
			for (j=0; j<8; j++) {
				x = str.charCodeAt(i++);
				result = result + hexcode(x);
			}
			result = result + "\n";
 
 
			//- One-octet public key algorithm.
			x = str.charCodeAt(i++);
			result = result + "Public-Key-Algorithm = " + x + " (" + publicKeyAlgorithm(x) + ")\n";
 
 
			//- One-octet hash algorithm.
			x = str.charCodeAt(i++);
			result = result + "Hash-Algorithm = " + x + " (" + HashAlgorithm[x] +")\n";
 
 
			//- Two-octet field holding left 16 bits of signed hash value.
			x = str.charCodeAt(i++);
			result = result + "Q-hash = 0x" + hexcode(x);
			x = str.charCodeAt(i++);
			result = result + hexcode(x) + "\n";
			
			// Binary data
			result = result + "Signature data:\n";
			result = result + hexdump(str,i,0);
 
 
			break;
		default:
			result = result + "Sig-Version = " + sig_version + "(UNKNOWN)\n";
		}
	}
	else if (content_tag == 6)
	{
		result = result + "---- KEY ----\n";
		result = result + myPGPdecodeKey(str,i);
	}
	else 
	{
		result = result + "---- UNDECODED CONTENTS ----\n";
	}
 
 
	return result;
 
}
 
function myUrlBinaryDecode(strx) {
	var str = myBase64Decode(strx,true);
	return hexdump(str,0,0);
}

function myMsgIdDecode(str) {
	var result = "";
	var x = 0;
	var i = 0;
 
	x = str.charCodeAt(i)<<24 | str.charCodeAt(i+1)<<16 | str.charCodeAt(i+2)<<8 | str.charCodeAt(i+3);
	var creation_time = new Date();
	creation_time.setTime(x * 1000);
	result = result + "Creation-Time = " + creation_time + "\n";
	i = i + 4;
 
	return result + hexdump(str,i,0);
}