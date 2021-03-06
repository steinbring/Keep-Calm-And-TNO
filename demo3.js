var YourCryptoKey = '';
// Change the value for the algo notes
var setKeyNotes = function(algo){
 // Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API/Supported_algorithms
 if(algo == 'AES-CBC')
 	document.getElementById("AlgorithmNotes").value = 'AES-CBC: Key usages for keys generated with this method are restricted to "encrypt", "decrypt", "wrapKey" or "unwrapKey". Key length must be 128, 192 or 256 bits.';
 else if(algo == 'AES-CTR')
 	document.getElementById("AlgorithmNotes").value = 'AES-CTR: Key usages for keys generated with this method are restricted to "encrypt", "decrypt", "wrapKey" or "unwrapKey". Key length must be 128, 192 or 256 bits.';
 else if(algo == 'AES-GCM')
 	document.getElementById("AlgorithmNotes").value = 'AES-GCM: Key usages for keys generated with this method are restricted to "encrypt", "decrypt", "wrapKey" or "unwrapKey". Key length must be 128, 192 or 256 bits.';
 else if(algo == 'RSA-OAEP')
 	document.getElementById("AlgorithmNotes").value = 'RSA-OAEP: Key usages for keys generated with this method are restricted to "encrypt", "decrypt", "wrapKey" or "unwrapKey". Requires a HashAlgorithmIdentifier with the hash algorithm to use, instead of a key length.';
 else if(algo == 'AES-KW')
 	document.getElementById("AlgorithmNotes").value = 'AES-KW: Key usages for keys generated with this method are restricted to "wrapKey" or "unwrapKey". Key length must be 128, 192 or 256 bits.';
 else if(algo == 'HMAC')
 	document.getElementById("AlgorithmNotes").value = 'HMAC: Key usages for keys generated with this method are restricted to "sign" or "verify". Also requires a HashAlgorithmIdentifier, the hash algorithm to use. Key length must be an optional positive integer indicating the size of the key to generate. If not provided, the size of the block of the hash function is used.';
 else if(algo == 'RSASSA-PKCS1-v1_5')
 	document.getElementById("AlgorithmNotes").value = 'RSASSA-PKCS1-v1_5: Key usages for keys generated with this method are restricted to "sign", "verify". Requires a HashAlgorithmIdentifier with the hash algorithm to use, instead of a key length.';
 else if(algo == 'ECDSA')
 	document.getElementById("AlgorithmNotes").value = 'ECDSA: Requires FireFox 36 or Chrome.';
 else if(algo == 'ECDH')
 	document.getElementById("AlgorithmNotes").value = 'ECDH: Not supported in Chrome?';
 else if(algo == 'DH')
 	document.getElementById("AlgorithmNotes").value = 'DH: Not supported in Chrome?';
 else
 	document.getElementById("AlgorithmNotes").value = '';
}

// Generate the actual encryption keys, based upon selections
var generateTheKeys = function(){
	// Get an array of selected KeyUses
	var checkboxes = document.getElementsByName('KeyUses');
	var arrKeyUses = new Array();
	for (var i=0, n=checkboxes.length;i<n;i++) {
		if (checkboxes[i].checked) 
			arrKeyUses.push(checkboxes[i].value);
	};
	// Which algorythm should I use?
	var objCryptoAlgorithm = {
		name: document.getElementById("CryptoAlgorithm").value,
		length: document.getElementById("KeyLength").value
	};
	// Should the key be extractable?
	var strExtractable = document.getElementById("ExtractableBoolean").value;
	// What should the key length be?
	var strKeyLength = document.getElementById("KeyLength").value;
	// This will return a promise of a new CryptoKey
	window.crypto.subtle.generateKey(objCryptoAlgorithm,strExtractable,arrKeyUses)
	.then(function(key){
	    console.log(key);
	    YourCryptoKey = key;
	    alert("success!");
	})
	.catch(function(err){
	    console.error(err);
	}); 
}

// Export the encryption keys that you have already generated
var exportTheKeys = function(){
	// Source: https://github.com/diafygi/webcrypto-examples#aes-ctr---exportkey
	window.crypto.subtle.exportKey(
		// the format
	    document.getElementById("ExportFormat").value, 
	    // the actual key
	    YourCryptoKey
	)
	.then(function(keydata){
	    //returns the exported key data
	    console.log(keydata);
	})
	.catch(function(err){
	    console.error(err);
	});
}