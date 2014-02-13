
function onFileLoad(e) 
{
	$('#preview').empty().append('<img id="upload" src="'+e.target.result +'" style="max-width:80%;"/>');
	alert( "Your image has been uploaded. The image to the right has not been edited yet.");
	var img=document.getElementById("upload");
	var width = img.naturalWidth; 
	var height = img.naturalHeight;
	$('#can').empty().append('<canvas id="myCanvas" width="'+width+'" height="'+height+'"> </canvas>');
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");		
	ctx.drawImage(img,0,0);
	alert("The image on the right should be the full dimensions of the image you uploaded.");
	var secretMessage = prompt("Please enter the message you would like to hide in your image.");//getting the string to hide in the image
    alert(secretMessage); //testing getting the string
	stegatizer(ctx, width, height, secretMessage);
	//invertImage(ctx,width,height);
}

function stegatizer(ctx, width, height, secretMessage)
{
	var charArray = [];//creates an array to use later to encode the characters 1 by 1
	charArray = secretMessage.split('');
	alert(charArray);
	var imgData=ctx.getImageData(0,0,width,height);
	var pixels = imgData.data;
	var numPixels = imgData.width * imgData.height;
	for(i=0; i<numPixels; i++){//charArray.length+1 //goes through and drops the Least significant bit of each color, and the alpha channel to 0, for 2 pixels per each character. R+G+B+A+R+G+B+A = 8 bits, enough to encode 0(ASCII) character, or the UTF value. the _1 to length is to encode a nontypeable symbol so that we know when to stop reading through when decoding
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
	alert("Image pixels have been normalized for the length of your message");
	var charAsBinString="";
	alert("Char Array is this long :" +charArray.length);
	for(i=0; i<=charArray.length; i++)
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
			charAsBinString = charAsBinString + "00000011"
			var binArray= [];
			binArray = charAsBinString.split('');
			//binArray += [,0,0,0,0,0,0,1,1];
			//alert(binArray);//testing purposes
			//alert("bin array Length is "+binArray.length);
			//alert("BinString length is "+charAsBinString.length);
			for(n=0; n<binArray.length; n++){ //This loop does the actual putting the data into the pixels one byte at a time
		    	
				if(pixels[n]%2==0 && binArray[n]==1)
		  	 	{
		  		 pixels[n]=pixels[n]+1;
		    	}
				/*if(pixels[i]%2==0 && binArray[i]==0)
		  	 	{
		  		 pixels[i]=pixels[i];
		    	}*/
				/*else if(pixels[i]%2==1 && binArray[i]==0)
				{
					pixels[i]=pixels[i]-1;
				}
				else if(pixels[i]%2==1 && binArray[i]==1)
				{
					pixels[i]=pixels[i];
				}*/
			}
			
			
		}
	}
	//alert("about to clear image");
	ctx.clearRect(0, 0, width, height);
	//alert("Image cleared");
	ctx.putImageData(imgData, 0, 0);
	//alert("image put");
	var StegImage = new Image();
	StegImage.id = "StegIm";
	StegImage.src = myCanvas.toDataURL();
	$('#can').empty().append('<p>Right click on the image to save your image containing the hidden message</p><img id="StegIm" src="'+StegImage.src+'" style="max-width:80%;"/>');
}

function invertImage(ctx, width, height) //this function is for testing the image editing capabilities.
{
	var imgData=ctx.getImageData(0,0,width,height);
	var pixels = imgData.data;
	var numPixels = imgData.width * imgData.height;
	alert("width is: "+width + " height is : "+height)
	for ( var i=0;i<numPixels*4;i+=4 )
		{
			
	  pixels[i]=255-pixels[i];
	  pixels[i+1]=255-pixels[i+1];
	  pixels[i+2]=255-pixels[i+2];
	  pixels[i+3]=255;
	  }
  	alert("about to clear image");
	ctx.clearRect(0, 0,width, height);
	alert("image cleared")
	ctx.putImageData(imgData,0,0);
//	var StegImage = new Image();
//	StegImage.id = "StegIm";
//	StegImage.src = myCanvas.toDataURL();
//	$('#can').empty().append('<p>Right click on the image to save your image containing the hidden message</p><img id="StegIm" src="'+StegImage.src+'" style="max-width:80%;"/>');
}

function displayPreview(files) {
	alert("indisplaypreview");
	var reader = new FileReader();
	reader.onload = onFileLoad;
 	reader.readAsDataURL(files[0]);
}

function displayPreviewS(files) {
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
	alert(numPixels);
	for(i=0; i<imgDataS.data.length; i++)//8 is usually numPixels
	{ 
		deStegArray.push(pixelS[i]%2);
			if(i+1%8==0 && deStegArray[i]==1 && deStegArray[i-1]==1 && deStegArray[i-2]==0 && deStegArray[i-3]==0 && deStegArray[i-4]==0 && deStegArray[i-5]==0 && deStegArray[i-6]==0 && deStegArray[i-7]==0)
			{
				break;
			}
	}
	//alert(deStegArray);
	var deStegBin = deStegArray.join("");
	//alert(deStegBin);
	var deStegStr = bin(deStegBin);
	alert(deStegStr);
}	
	//currently coding right here to get the string above that is in 1001 format, to be in ascii
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
function bin2 (text) { //trying out this for bin strong to ascii
    var res = '', j;
    for (var i = 0 ; i < text.length; i = j) {
        j += 8;                                 // specify radix--v
        res += String.fromCharCode( parseInt( text.slice( i, j ), 2 ) );
    }
    return res;
}
/* for checking when end bit is met
		if(deStegArray.length%8==0)
				{
					for(n=0; n<8; n++)
					{
						var count = 0;
						if(endstring[n] == deStegArray[i-8+n])
						{
							count++
						}
						if(count==8)
						break;
					}
				}
*/
