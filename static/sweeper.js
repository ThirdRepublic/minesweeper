/*
	Robe Zhang
*/
ROW = 5;
COL = 5;
BOMBCOUNT = 2;	

//Bomb prototype
function Bomb()
{
	this.isRevealed = false;
	this.isChecked = false;
	this.isBomb = false;
	this.isFlagged = false;
}

function loadGame()
{
	butEle.innerHTML = "Reload Game";
	
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
		(bombs[tempRow][tempCol]).isBomb =true;
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
			newImage.src = "static/blank.png";
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

//Left click to clear, right to flag
function reveal(yRow,xCol,event)
{
	thisEle = document.getElementById(""+yRow+","+xCol+"");
	//left click
	if(event.button == 0)
	{
		document.getElementById(yRow+","+xCol).setAttribute("onmousedown","");
		bombs[yRow][xCol].isFlagged = false;
		//lost game
		if(bombs[yRow][xCol].isBomb)
		{
			revealBoard();
			butEle.innerHTML = "GAMEOVER, Click To Try Again";
		}
		else
		{
			//checks nearby tiles for bombs
			nearByBombs = tileRisk(yRow,xCol);
			if(nearByBombs>0)
				thisEle.src = "static/"+nearByBombs+".jpg";
			else
			//reveals a safe
			{
				thisEle.src = "0.jpg";
				//reveals nearby safes
				check(yRow,xCol);
				//unchecks 
				for(var i=0;i<ROW;i++)
					for(var j=0;j<COL;j++)
						bombs[i][j].isChecked = false;
			}
			bombs[yRow][xCol].isRevealed = true;		
		}		
	}
	else
		//right click
		if(event.button == 2 || event.button == 1)
		{
			thisEle.src = "static/-1.jpg";
			bombs[yRow][xCol].isFlagged = true;
		}
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

//returns numbre of nearby bombs
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

//reveals all safe nearby
function check(yRow,xCol)
{	
	if (confirmVaild(yRow,xCol))
		return;
	bombs[yRow][xCol].isRevealed = true;
	document.getElementById(""+yRow+","+xCol+"").src = "static/0.jpg";
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

//determines if an area is safe
function confirmVaild(yRow,xCol)
{
	return bombs[yRow][xCol].isRevealed || bombs[yRow][xCol].isChecked || bombs[yRow][xCol].isBomb || tileRisk(yRow,xCol)>0;
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
			tempEle = document.getElementById(""+i+","+j+"");
			tempEle.setAttribute("onmousedown","");	
			if(bombs[i][j].isBomb)
				tempEle.src = "static/bomb.jpg";
			else
				tempEle.src = "static/safe.jpg";
		}
}

document.oncontextmenu = function() {
	return false;
}

			