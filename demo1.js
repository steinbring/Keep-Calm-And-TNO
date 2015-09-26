var generateKeys = function(my_user_id,my_passphrase){
	var my_key = openpgp
        .generateKeyPair({numBits: 2048, userId: my_user_id, passphrase: my_passphrase})
        .then(function(keyPair) {
        	// Save the generated public key to openPGP.publicKey
        	localStorage.setItem("openPGP.publicKey", keyPair.publicKeyArmored);
        	// Save the generated private key to openPGP.privateKey
        	localStorage.setItem("openPGP.privateKey", keyPair.privateKeyArmored);
        	// Let them know that a new key has been generated, successfully
        	alert("New keys have been generated");
        	// Load the keys into the DOM
        	loadKeys();
        });
};
var loadKeys = function(){
	// Copy the public key from openPGP.publicKey into the DOM
	document.getElementById('PublicKey').value = localStorage.getItem("openPGP.publicKey");
	// Copy the private key from openPGP.privateKey into the DOM
	document.getElementById('PrivateKey').value = localStorage.getItem("openPGP.privateKey");
};
var savePublicKeyToFB = function(note,publicKey){
	// Create a reference to the firebase app on their servers
	var myFirebaseRef = new Firebase("https://tno.firebaseio.com/keys");
	// this new, empty ref only exists locally
	var newChildRef = myFirebaseRef.push();
	// append at the end of data at the server
	newChildRef.set({note: note, publicKey: publicKey});
	// Tell them that something happened
	alert('Saved!');
	// Clear the field
	document.getElementById('note').value = '';
};
var getPublicKeysFromFB = function(){
	// Create a reference to the firebase app on their servers
	var myFirebaseRef = new Firebase("https://tno.firebaseio.com/keys/");
	myFirebaseRef.once("value", function(snapshot) {
		// What are we storing the result in?
		var arrKeys = [];
		// Loop through the results
		snapshot.forEach(function(childSnapshot) {
			// childData will be the actual contents of the child
			arrKeys.push(childSnapshot.val());
		});
		// Populate the select box
		populateSelectWithKeys(arrKeys);
	});
};
var populateSelectWithKeys = function(arrKeys){
	// Empty the box before refilling it
	document.theForm.publickeys.options.length = 0;
	// Refill the select box
	for (var i in arrKeys){
		var optionSize = document.theForm.publickeys.options.length;
	    document.theForm.publickeys.options[optionSize]=new Option(arrKeys[i].note, arrKeys[i].publicKey, true, false);
	}
};
var setAsRecipient = function(key){
	document.getElementById('recipient').value = key;
};
// *Encrypted Message*
var saveMessageToFB = function(encryptedMessage){
	// Create a reference to the firebase app on their servers
	var myFirebaseRef = new Firebase("https://tno.firebaseio.com/messages/");
	// this new, empty ref only exists locally
	var newChildRef = myFirebaseRef.push();
	// append at the end of data at the server
	newChildRef.set({message: encryptedMessage});
	// Tell them that something happened
	alert('Saved!');
	// Clear the field
	document.getElementById('EncryptedMessage').value = '';
};
// *What messages exist within the Firebase DB?*
var getMessagesFromFB = function(){
	// Create a reference to the firebase app on their servers
	var myFirebaseRef = new Firebase("https://tno.firebaseio.com/messages/");
	myFirebaseRef.once("value", function(snapshot) {
		// What are we storing the result in?
		var arrMessages = [];
		// Loop through the results
		snapshot.forEach(function(childSnapshot) {
			// childData will be the actual contents of the child
			arrMessages.push(childSnapshot.val());
		});
		// Populate the select box
		populateSelectWithMessages(arrMessages);
	});
};
var populateSelectWithMessages = function(arrMessages){
	// Empty the box before refilling it
	document.theForm.messages.options.length = 0;
	// Refill the select box
	for (var i in arrMessages){
		var optionSize = document.theForm.messages.options.length;
		var whereTheTwoLineReturnsAre = arrMessages[i].message.indexOf("\n\n");
		var firstPartOfTheMessage = arrMessages[i].message.substring(whereTheTwoLineReturnsAre, whereTheTwoLineReturnsAre+20);
	    document.theForm.messages.options[optionSize]=new Option(firstPartOfTheMessage, arrMessages[i].message, true, false);
	}
};
// *Plaintext Message*
var setEncryptedMessage = function(message){
	document.getElementById('EncryptedMessage').value = message;
};
var encryptMessage = function(message,key){

	var publicKey = openpgp.key.readArmored(key);

	openpgp.encryptMessage(publicKey.keys, message).then(function(pgpMessage) {
		// Set the "Encrypted Message" text area to contain the pgpMessage
	    setEncryptedMessage(pgpMessage);
	}).catch(function(error) {
	    // Failure
	    alert('I can not encrypt this!');
	});
};
// *Encrypted Message*
var setPTMessage = function(message){
	document.getElementById("PTMessage").value = message;
};
var decryptMessage = function(encryptedContent,key,passPhrase){
	var privateKey = openpgp.key.readArmored(key).keys[0];
	privateKey.decrypt(passPhrase);

	var pgpMessage = encryptedContent;
	pgpMessage = openpgp.message.readArmored(pgpMessage);

	openpgp.decryptMessage(privateKey, pgpMessage).then(function(plaintext) {
	    setPTMessage(plaintext);
	}).catch(function(error) {
		// Failure
	    alert('I can not decrypt this!');
	});
}