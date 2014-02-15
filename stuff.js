
function onFileLoad(e) //When the file is loaded for "encryption" this will happen
{
	$('#preview').empty().append('<img id="upload" src="'+e.target.result +'" style="max-width:80%;"/>');
	//alert( "Your image has been uploaded. The image to the right has not been edited yet."); //uploads image that user chooses
	var img=document.getElementById("upload"); //grabs the image
	var width = img.naturalWidth; 
	var height = img.naturalHeight;
	$('#can').empty().append('<canvas id="myCanvas" width="'+width+'" height="'+height+'"> </canvas>'); //Builds a canvas for us to use
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");		
	ctx.drawImage(img,0,0); //paints the image to the canvas
	var secretMessage = prompt("Please enter the message you would like to hide in your image.");//getting the string to hide in the image
    alert("The message you want to hide int he photo is: "+secretMessage); //testing getting the string
	stegatizer(ctx, width, height, secretMessage); //calls fruntion that does encrypting
}

function stegatizer(ctx, width, height, secretMessage) //function that hides the data
{
	var charArray = [];//creates an array to use later to encode the characters 1 by 1
	charArray = secretMessage.split(''); //splits the string into an array
//	alert(charArray); // for testing if you want to check correctness of array
	var imgData=ctx.getImageData(0,0,width,height); //grabs image data from canvas
	var pixels = imgData.data;  
	var numPixels = imgData.width * imgData.height;
	//alert("Image width is "+imgData.width+" and image height is "+imgData.height+" and numPixels is "+numPixels);
	for(i=0; i<=charArray.length+1; i++){//charArray.length+1 only wants to work with (numPixels/2) for osme reason//goes through and drops the Least significant bit of each color, and the alpha channel to 0, for 2 pixels per each character. R+G+B+A+R+G+B+A = 8 bits, enough to encode 0(ASCII) character, or the UTF value. the _1 to length is to encode a nontypeable symbol so that we know when to stop reading through when decoding
  	  if(pixels[8*i]%2!==0)
	  {
		  pixels[8*i]=pixels[8*i]-1;
  	  }
  	  if(pixels[8*i+1]%2!==0){
		  pixels[8*i+1]=pixels[8*i+1]-1;
  	  }
	  if(pixels[8*i+2]%2!==0){
		  pixels[8*i+2]=pixels[8*i+2]-1;
  	  }
	  if(pixels[8*i+3]%2!==0){
		  pixels[8*i+3]=pixels[8*i+3]-1;
  	  }
  	  if(pixels[8*i+4]%2!==0){
		  pixels[8*i+4]=pixels[8*i+4]-1;
  	  }
  	  if(pixels[8*i+5]%2!==0){
		  pixels[8*i+5]=pixels[8*i+5]-1;
  	  }
  	  if(pixels[8*i+6]%2!==0){
		  pixels[8*i+6]=pixels[8*i+6]-1;
  	  }
  	  if(pixels[8*i+7]%2!==0){
		  pixels[8*i+7]=pixels[8*i+7]-1;
  	  }
	  
	}
	ctx.clearRect(0, 0, width, height);
	ctx.putImageData(imgData, 0, 0);
	//alert("Image pixels have been normalized for the length of your message");
	var charAsBinString="";
	//alert("Char Array is this long :" +charArray.length);
	for(i=0; i<=(charArray.length); i++) //added _1 to lwngth
	{	
		if(i<charArray.length){
		if(charArray[i].charCodeAt(0).toString(2).length<7){
		charAsBinString+="00"+charArray[i].charCodeAt(0).toString(2);
		}
		else{
		charAsBinString+="0"+charArray[i].charCodeAt(0).toString(2);
		}
		//alert("Char "+i+" grabbed"); for testing
		}
		if(i==charArray.length){
			charAsBinString = charAsBinString.concat("00000011");
			var binArray= [];
			binArray = charAsBinString.split('');
			for(n=0; n<binArray.length; n++){ //This loop does the actual putting the data into the pixels one byte at a time
		    	
				if(binArray[n]==1) // took out pixels[n]%2==0 && 
		  	 	{
		  		 pixels[n]=pixels[n]+1;
		    	}			
			}			
		}
	}
	ctx.clearRect(0, 0, width, height);
	ctx.putImageData(imgData, 0, 0);
	var StegImage = new Image();
	StegImage.id = "StegIm";
	StegImage.src = myCanvas.toDataURL();
	$('#can').empty().append('<p>Right click on the image to save your image containing the hidden message</p><img id="StegIm" src="'+StegImage.src+'" style="max-width:80%;"/>');
}



function displayPreview(files) { //for encryption method
	alert("indisplaypreview");
	var reader = new FileReader();
	reader.onload = onFileLoad;
 	reader.readAsDataURL(files[0]);
}

function displayPreviewS(files) { //for decryption method
	var reader = new FileReader();
	reader.onload = onFileLoad1;
 	reader.readAsDataURL(files[0]);
}

function onFileLoad1(e) //seperate fileload for the decrypting part of things.
{ 
	$('#Stegg').empty().append('<img id="uploadS" src="'+ e.target.result +'" align="center" style="max-width:80%;"/>');
	var imgS=document.getElementById("uploadS");
	var widthS = imgS.naturalWidth; 
	var heightS = imgS.naturalHeight;
	$('#Stegg').empty().append('<canvas id="StegCanvas" width="'+widthS+'" height="'+heightS+'"> </canvas>');
	var c=document.getElementById("StegCanvas");
	var ctxS=c.getContext("2d");		
	ctxS.drawImage(imgS,0,0);
	alert("Your message will be decrypted soon. If the photo has not been through this program, the message may be long, and take awhile to load"); //testing getting the string
	var deStegArray = [];//creates an array to use later to encode the characters 1 by 1
	var imgDataS=ctxS.getImageData(0,0,widthS,heightS);
	var pixelS = imgDataS.data;
	var numPixels = imgDataS.width * imgDataS.height;
	var endstring = [0,0,0,0,0,0,1,1];
	//alert(numPixels); //for testing purposes
	var tempChar;
	var tempString= "";
	for(i=0; i<(numPixels*4); i++)//8 is usually numPixels*4
	{ 
		deStegArray.push(pixelS[i]%2); //add 1 and 0 to the sring
		if((i+1)%8==0) //if a variable of 8 values have been read in 
		{
			
			tempChar = deStegArray.join("");  //get the string of these last 8
			if(tempChar == "00000011")  //if the latest char is the Ending Text Character
			{
				break;
			}
			tempChar = bin(deStegArray.join("")); //get the bin to ascii and assign to temp
			tempString = tempString.concat(tempChar); //add temp to the string
			deStegArray =[]; //clear array of binary
			tempChar = null; //clear  temp
		}
		
		
	}
	
	alert(tempString); //print out the message
}	

function bin (text) {
    var output = "";
    for (var i = 0 ; i < text.length; i+= 8) {
        var c = 0;
        for (var j=0; j < 8 ; j++) {
            c <<= 1;
            c |= parseInt(text[i + j]); 
        }
        output += String.fromCharCode(c);
    }
    return output;
}


