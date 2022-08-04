document.addEventListener("touchstart", function() {}, true);
let gradientAnimation = document.getElementById("offscreenGradient")
let textContainer = document.getElementById("textContainer");
let players = [];

function newGame() {
	gradientTransition("#008009", "#28c3b1", 1, function() {
		document.getElementById("startingHeader").innerHTML = "Players";
		document.getElementById("newGameButton").parentElement.removeChild(document.getElementById("newGameButton"));

		let addPlayerButton = document.createElement("div");
		addPlayerButton.setAttribute("id", "addPlayerButton");
		addPlayerButton.setAttribute("class", "playersBox noSelect");
		addPlayerButton.setAttribute("onclick", "addPlayer()");
		addPlayerButton.innerHTML = "<span class=innerButton><img class='buttonIcon' src='icons/plus-icon.svg'>Add Player</span>";
		textContainer.appendChild(addPlayerButton);

		let startButton = document.createElement("button");
		startButton.setAttribute("id", "startButton");
		startButton.setAttribute("class", "playersBox noSelect");
		startButton.setAttribute("onclick", "playersDone()");
		startButton.setAttribute("tabindex", "0");
		startButton.setAttribute("disabled", "");
		startButton.innerHTML = "<span class=innerButton>Start Game</span>";
		textContainer.appendChild(startButton);
	});
}

let numPlayers = 0
function addPlayer() {
	numPlayers++
	let addPlayerButton = document.createElement("span");
	addPlayerButton.setAttribute("id", "player"+numPlayers+"box");
	addPlayerButton.setAttribute("class", "playersBox playerList");
	addPlayerButton.setAttribute("contenteditable", "true");
	addPlayerButton.setAttribute("spellcheck", "false");

	addPlayerButton.addEventListener("focus", function() {
		let range, selection;
		if (window.getSelection && document.createRange) {
			selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(this);
			selection.removeAllRanges();
			selection.addRange(range);
		} else if (document.selection && document.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(this);
			range.select();
		}
	});

	addPlayerButton.addEventListener("keypress", function(event) {
  	if (event.key === "Enter") {
    	event.preventDefault();
  	}
	});
	
	addPlayerButton.addEventListener("blur", function() {
		var num = addPlayerButton.id.match(/\d/g);
		num = num.join("");
		if (players[num-1] !== undefined) {
			players[num-1] = addPlayerButton.innerHTML;
		} else {
			players.push(addPlayerButton.innerHTML);
		}
	});
	addPlayerButton.innerHTML = "Player "+numPlayers;
	textContainer.insertBefore(addPlayerButton, textContainer.children[textContainer.children.length-2]);
	if (players[1] !== undefined) {
		document.getElementById("startButton").disabled = false;
	}
	addPlayerButton.focus();
}

function playersDone() {
	var spy = players[Math.floor(Math.random()*players.length)];
	const location = randomLoc();
	
	gradientTransition("#761dad", "#c271f5", 2, function() {
		while (textContainer.firstChild) {
      textContainer.removeChild(textContainer.firstChild);
    }
		animationsTest(textContainer, function() {

			const loop = async () => {

				let waitForPressResolve;
				
				function waitForPress() {
				    return new Promise(resolve => waitForPressResolve = resolve);
				}
				
				const btn = document.body;
				
				function btnResolver() {
				  if (waitForPressResolve) waitForPressResolve();
				}
				
				async function doIt() {
				  btn.addEventListener('click', btnResolver);
				  for (i = 0; i < players.length; i++) {
						let displayLoc = location;
						let playerName = players[i];
						let role = "Civilian";
						let description = "<p id='description'>You are not the spy. You need to cooperate with other civilians to try and snuff out the spy and vote them out by asking each other questions about the location. The spy does not know the location.</p>";
						if (playerName == spy) {
							role = "Spy";
							description = "<p id='description'>You are the spy. You need to stay anonymous while trying to figure out what the location is. If you think you've figured it out, you can give yourself up and ask. If you guess correctly, you win.</p>";
							displayLoc = "???";
						}
						
						textContainer.style.backgroundColor = "transparent";
						textContainer.style.fontSize = "28px";
						textContainer.style.width = "auto";
						textContainer.style.opacity = "0";
						await wait(1000);
						
						textContainer.innerHTML = "Pass to "+playerName;
						
						textContainer.style.opacity = "1";
						await wait(2000);
						textContainer.style.opacity = "0";
						await wait(1000);
						textContainer.innerHTML = "Hello, "+playerName+"!<br><br>Tap anywhere to view your role.";
						
						textContainer.style.opacity = "1";
						await waitForPress();
						textContainer.style.opacity = "0";
						await wait(1000);
						textContainer.style.backgroundColor = "#00000033";
						textContainer.style.fontSize = "28px";
						textContainer.style.width = "300px";
						textContainer.style.opacity = "1";
						textContainer.innerHTML = "<div class='header'>Your Role</div><div class='bodyText'><span style='font-weight: bold;'>Role: </span>"+role+"<br>"+description+"<br><span style='font-weight: bold;'>Location: </span>"+displayLoc+"</div><br><div style='font-weight: bold;' class='centeredText bodyText'>[Tap to continue]</div>";
						await wait(1000);
						await waitForPress();
						textContainer.style.opacity = "0";
						await wait (1000);
					}
				  btn.removeEventListener('click', btnResolver);
					textContainer.style.backgroundColor = "transparent";
					textContainer.style.fontSize = "28px";
					textContainer.style.width = "auto";
					textContainer.innerHTML = "Hand the phone back to its owner. The game can start now!<br><br><span id='locationsList' class='innerButton'><img id='shareIcon' class='buttonIcon' src='icons/share-icon.svg'>List of Locations</span>";
					document.getElementById("locationsList").addEventListener("click", function() {
						if (navigator.share) {
						  navigator.share({
						    title: document.title,
						    text: "Location List",
						    url: window.location.href
						  })
						  .then(() => console.log('Successful share'))
						  .catch(error => console.log('Error sharing:', error));
						}
					});
					textContainer.style.opacity = "1";
				}
				doIt();
			}
			loop();
		});
	});
}



// Gradient Transition
var prevBackgroundColor = window.getComputedStyle(document.body).backgroundColor;
function gradientTransition(gradientTop, gradientBottom, duration, changes) {
	gradientAnimation.style.animationDuration = duration + "s";
	gradientAnimation.style.background = "linear-gradient("+gradientTop+", "+gradientBottom+")"
	gradientAnimation.style.animationName = "gradientMove";
	safariBarFade(prevBackgroundColor, gradientTop, duration)
	prevBackgroundColor = "rgb("+hexToRgb(gradientTop).r+", "+hexToRgb(gradientTop).g+", "+hexToRgb(gradientTop).b+")";
	document.body.style.backgroundColor = gradientTop;
	
	Promise.all(
	  gradientAnimation.getAnimations().map(
	    function(animation) {
	      return animation.finished
	    }
	  )
	).then(
	  function() {
			document.body.style.background = "linear-gradient("+gradientTop+", "+gradientBottom+")";
			changes();
			gradientAnimation.style.pointerEvents = "none";
	    gradientAnimation.style.opacity = "0";
			Promise.all(
			  gradientAnimation.getAnimations().map(
			    function(animation) {
			      return animation.finished
			    }
			  )
			).then(
			  function() {
					gradientAnimation.style.animationName = "";
					gradientAnimation.style.right = "-100vw";
					gradientAnimation.style.pointerEvents = "auto";
					gradientAnimation.style.opacity = "1";
			  }
			);
	  }
	);
}

// Color Mixer
function colorChannelMixer(colorChannelA, colorChannelB, amountToMix){
    let channelA = colorChannelA*amountToMix;
    let channelB = colorChannelB*(1-amountToMix);
    return parseInt(channelA+channelB);
}
function colorMixer(rgbA, rgbB, amountToMix){
    let r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
    let g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
    let b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
    return "rgb("+r+","+g+","+b+")";
}

// Safari Top Bar Fade
function safariBarFade(startColor, endColor, duration) {
	let startColorRGB = startColor.substring(4, startColor.length-1)
         .replace(/ /g, '')
         .split(',');
	let i = 1;
	function myLoop() {
	  setTimeout(function() {
			document
		    .querySelector("meta[name='theme-color']")
				.setAttribute("content", colorMixer([hexToRgb(endColor).r, hexToRgb(endColor).g, hexToRgb(endColor).b], startColorRGB, i/100))
	    i++;
	    if (i < 101) {
	      myLoop();
	    }
	  }, duration*10)
	}
	myLoop();  
}

// Hex to RGB
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Wait for animations to finish
function animationsTest(elem, endEffect) {
  Promise.all(
	  elem.getAnimations().map(
	    function(animation) {
	      return animation.finished
	    }
	  )
	).then(
	  function() {
	    endEffect();
	  }
	);
};

// Wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Locations List Page
const half = Math.ceil(locations.length / 2);    

const firstHalf = locations.slice(0, half)
const secondHalf = locations.slice(half)

for (i = 0; i < firstHalf.length; i++) {
	var newItem = document.createElement("div");

	newItem.setAttribute("class", "wordDiv noSelect");
	newItem.setAttribute("data-strikethrough", "false");
	newItem.innerHTML = firstHalf[i];
	newItem.addEventListener("click", function() {
		if (this.getAttribute("data-strikethrough") == "true") {
			this.style.textDecoration = "none";
			this.style.opacity = "1";
			this.setAttribute("data-strikethrough", "false");
		} else {
			this.style.textDecoration = "line-through";
			this.style.opacity = "0.6";
			this.setAttribute("data-strikethrough", "true");
		}
	});

	locationsLeftColumn.appendChild(newItem);
}

for (i = 0; i < secondHalf.length; i++) {
	let newItem = document.createElement("div");

	newItem.setAttribute("class", "wordDiv noSelect");
	newItem.setAttribute("data-strikethrough", "false");
	newItem.innerHTML = secondHalf[i];
	newItem.addEventListener("click", function() {
		if (this.getAttribute("data-strikethrough") == "true") {
			this.style.textDecoration = "none";
			this.style.opacity = "1";
			this.setAttribute("data-strikethrough", "false");
		} else {
			this.style.textDecoration = "line-through";
			this.style.opacity = "0.6";
			this.setAttribute("data-strikethrough", "true");
		}
	});

	locationsRightColumn.appendChild(newItem);
}