/*
	Robe Zhang
*/
ROW = 0;
COL = 0;
BOMBCOUNT = 0;
isFirstClick = true;

function Mode(i,j,k){
	this.ROW = i;
	this.COL = j;
	this.BOMBCOUNT = k;
}	

MODES = new Array(new Mode(8,8,10),new Mode(16,16,40),new Mode(16,30,99),"");

function createCustom(type=-1){
	customRow = -1;
	customCol = -1;
	customBombCount = -1;
	//javascript approach
	while(customRow.isNan||customRow<=0)
		customRow = parseInt(prompt("Enter in your desired row: ","10"));
	while(customCol.isNan||customCol<=0)
		customCol = parseInt(prompt("Enter in your desired column: ","10"));
	while(customBombCount.isNan||customBombCount>=customRow*customCol||customBombCount<0)
		customBombCount = parseInt(prompt("Enter in your desired number of bombs: ","10"));
	MODES[3]=new Mode(customRow,customCol,customBombCount);
	butEle.setAttribute('onclick','loadGame(3)');
	//php approach 
	if(type==-1){	
		var xhttp;
		if (window.XMLHttpRequest)
			xhttp = new XMLHttpRequest();
		else
			xhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState==4&&xhttp.status!=200)
				xhttp.open("POST","customState.php",true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("customRow="+MODES[3].ROW+"&customCol="+MODES[3].COL+"&customBombCount="+MODES[3].BOMBCOUNT);
		}
		xhttp.open("POST","static/customState.php",true);
	}
}

//Bomb prototype
function Bomb()
{
	this.isRevealed = false;
	this.isBomb = false;
	this.isFlaggedBomb = false;
	this.isFlaggedQuestion = false;
	this.isNearBomb = false;
}

function loadGame(level=-1)
{
	butEle.innerHTML = "Reload Game";
	butEle.setAttribute("onclick","loadGame("+level+")");
	if(level!=-1){
		ROW = MODES[level].ROW;
		COL = MODES[level].COL;
		BOMBCOUNT = MODES[level].BOMBCOUNT;
	}
	isFirstClick = true;
	
	/* DOUBLE ARRAY
		0 0 0 
		0 x 0
		0 0 x
		xRow down
		yCol across
	*/
	
	//Generates the Rows and Columns and stores bomb objects
	bombs =  new Array(ROW);
	{
		for(var i=0;i<ROW;i++)
			bombs[i]=new Array(COL);
		
		for(var i=0;i<ROW;i++)
			for(var j=0;j<COL;j++)
				bombs[i][j] = new Bomb();
	}

	//Creates bombs
	while(!countBombs())
	{
		tempRow = parseInt(Math.random()*ROW);
		tempCol = parseInt(Math.random()*COL);
		(bombs[tempRow][tempCol]).isBomb = true;
	}
	
	//Clears other tables
	while (tableEle.firstChild) 
	{
		tableEle.removeChild(tableEle.firstChild);
	}
	
	//Generates tags on screen
	for(var i=0;i<ROW;i++)
	{
		newRow = document.createElement("tr");
		tableEle.appendChild(newRow);
		for(var j=0;j<COL;j++)
		{
			newCol = document.createElement("td");
			newRow.appendChild(newCol);
			newImage = document.createElement("img");
			newImage.src = "blank.jpg";
			//Test Bomb location
			// if(bombs[i][j].isBomb)
				// newImage.src = "bomb.jpg";
			
			newImage.setAttribute("onmousedown","reveal("+i+","+j+",event)");
			newImage.setAttribute("id",""+i+","+j+"");
			newCol.appendChild(newImage);
		}	
	}
	output.innerHTML = "Number of Bombs: " + BOMBCOUNT;
}

//Left click to clear, right to flag, right again to question
function reveal(yRow,xCol,event)
{
	thisEle = document.getElementById(yRow+","+xCol);
	selectedTile = bombs[yRow][xCol];
	//left click
	if(event.button == 0)
	{
		document.getElementById(yRow+","+xCol).setAttribute("onmousedown","");
		selectedTile.isFlaggedBomb = false;
		selectedTile.isFlaggedQuestion = false;
		//lost game
		if(selectedTile.isBomb)
		{
			if(isFirstClick){
				loadGame();
				reveal(yRow,xCol,event);
			}
			else{
				revealBoard();
				butEle.innerHTML = "GAMEOVER, Click To Try Again";
			}
		}
		else
		{
			//checks nearby tiles for bombs
			nearByBombs = tileRisk(yRow,xCol);
			if(nearByBombs>0){
				if(isFirstClick){
					loadGame();
					reveal(yRow,xCol,event);
				}	
				else{
					thisEle.src = ""+nearByBombs+".jpg";
					selectedTile.isNearBomb = true;
				}
			}
			else
			//reveals a safe
			{
				thisEle.src = "safe.jpg";
				if(!isTileReveal(yRow,xCol))
					//reveals nearby safes
					check(yRow,xCol);
			}
			selectedTile.isRevealed = true;		
		}		
	}
	else
		//right click
		if(event.button == 2 || event.button == 1)
		{
			//inital declare bomb tile
			if(selectedTile.isFlaggedBomb == false && selectedTile.isFlaggedQuestion == false)
			{
				thisEle.src = "flag.jpg";
				selectedTile.isFlaggedBomb = true;
			}	
			else
				//declare unsure tile	
				if(selectedTile.isFlaggedBomb == true)
				{
					thisEle.src = "question.jpg";
					selectedTile.isFlaggedBomb = false;
					selectedTile.isFlaggedQuestion = true;
				}
				//return back to blank tile
				else{
					thisEle.src = "blank.jpg";
					selectedTile.isFlaggedQuestion = false;
				}
		}
	isFirstClick = false;	
	//checks if game is won
	if(checkWin())
	{
		revealBoard();
		butEle.innerHTML = "HACKS, Click To Play Again";
	}
}

//Count current bombs generated to prevent same spot bomb generation
function countBombs()
{
	countBomb = 0;
	for(var i = 0;i<bombs.length;i++)
	{
		for(var j = 0;j<bombs[0].length;j++)
		{
			if(bombs[i][j].isBomb)
				countBomb++;
		}
	}
	return(countBomb==BOMBCOUNT);
}

//returns number of nearby bombs
function tileRisk(yRow,xCol)
{
	countRisk = 0;
	
	for(var i = -1;i<2;i++)
	{
		if(yRow+i < 0 || yRow+i >= ROW)
			continue;	
		for(var j = -1;j<2;j++)
		{
			if(xCol+j < 0 || xCol+j >= COL)
				continue;
			if(bombs[yRow+i][xCol+j].isBomb)
				countRisk++;	
		}
	}
	return countRisk;
}

//checks to see if multiple tiles can be revealed
function isTileReveal(yRow,xCol)
{
	for(var i = -1;i<2;i++)
	{
		if(yRow+i < 0 || yRow+i >= ROW)
			continue;	
		for(var j = -1;j<2;j++)
		{
			if(xCol+j < 0 || xCol+j >= COL)
				continue;
			if(bombs[yRow+i][xCol+j].isNearBomb)
				return true;
		}
	}
	return false;
}

//reveals all safe nearby
function check(yRow,xCol)
{	
	if (confirmVaild(yRow,xCol))
		return;
	thisEle = document.getElementById(yRow+","+xCol);
	bombs[yRow][xCol].isRevealed = true;
	thisEle.setAttribute("onmousedown","");
	nearByBombs = tileRisk(yRow,xCol);
	if(nearByBombs>0)
		thisEle.src = ""+nearByBombs+".jpg";
	else{
		thisEle.src = "safe.jpg";
		for(var i = -1;i<2;i++)
		{
			if(yRow+i < 0 || yRow+i >= ROW)
				continue;
			for(var j = -1;j<2;j++)
			{
				if(xCol+j < 0 || xCol+j >= COL)
					continue;
				check((yRow+i),(xCol+j));
			}
		}
	}
	
}

//determines if an area is safe
function confirmVaild(yRow,xCol)
{
	return bombs[yRow][xCol].isRevealed || bombs[yRow][xCol].isBomb;
}

//checks if all the non bomb are revealed
function checkWin()
{
	countRevealed = 0;	
	for(var i=0;i<ROW;i++)
		for(var j=0;j<COL;j++)
			if(bombs[i][j].isRevealed)
				countRevealed++;
	if(countRevealed == ROW*COL - BOMBCOUNT)
		return true;	
}

//shows the board
function revealBoard()
{
	for(var i = 0;i<ROW;i++)
		for(var j = 0;j<COL;j++)
		{
			tempEle = document.getElementById(i+","+j);
			tempEle.setAttribute("onmousedown","");	
			nearByBombs = tileRisk(i,j);
			if(bombs[i][j].isBomb)
				tempEle.src = "bomb.jpg";
			else
				if(nearByBombs>0)
					tempEle.src = ""+nearByBombs+".jpg";
				else
					tempEle.src = "safe.jpg";
		}
}

document.oncontextmenu = function() {
	return false;
}

