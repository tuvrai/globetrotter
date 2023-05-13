const runOutOfTimeEvt = new CustomEvent("RunOutOfTime", {
	detail: {
	  name: "runOutOfTime",
	},
  });

function getRandomInRange(start, end){
	return Math.floor(Math.random() * (end - start + 1) + start);
}

function getRandomRgb(){
	return `rgb(${getRandomInRange(0,255)}, ${getRandomInRange(0,255)}, ${getRandomInRange(0,255)})`;
}

class Settings {
	constructor()
	{
		this.IsCapitalsOnly = document.getElementById('IsCapitalsOnly').checked;
		this.IsEuropeEnabled = document.getElementById('IsEuropeEnabled').checked;
		this.IsAsiaEnabled = document.getElementById('IsAsiaEnabled').checked;
		this.IsAfricaEnabled = document.getElementById('IsAfricaEnabled').checked;
		this.IsNorthAmericaEnabled = document.getElementById('IsNorthAmericaEnabled').checked;
		this.IsSouthAmericaEnabled = document.getElementById('IsSouthAmericaEnabled').checked;
		this.IsAustraliaOceaniaEnabled = document.getElementById('IsAustraliaOceaniaEnabled').checked;
		this.IsCustomEnabled = document.getElementById('IsCustomEnabled').checked;
		this.CustomLocationsJson = document.getElementById('CustomLocationsJson').value.toString();
	}
}

class Target{
	constructor(lat,lng,name,country, region = "", isCapital = false){
		this.lat = lat;
		this.lng = lng;
		this.name = name;
		this.country = country;
		this.region = region;
		this.isCapital = isCapital;
	}

	GetLabel() {
		return `${this.name}, ${this.country}${(this.region != "" ? ' (' : '')}${this.region}${(this.region != "" ? ')' : '')}`;
	}

	GetCoordinates() {
		return {
			lat: this.lat,
			lng: this.lng
		}
	}

	DistanceTo(lat, lng) {
		var p = 0.017453292519943295;    // Math.PI / 180
		var c = Math.cos;
		var a = 0.5 - c((lat - this.lat) * p)/2 + 
				c(this.lat * p) * c(lat * p) * 
				(1 - c((lng - this.lng) * p))/2;
		return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
	}

	deg2rad(deg) {
		return deg * (Math.PI/180)
	}
}

class Level{
	constructor(index, requiredPoints, targetTime){
		this.id = index;
		this.currentPoints = 0;
		this.requiredPoints = requiredPoints;
		this.currentTargetId = 0;
		this.targetTime = targetTime;
		this.remainingTime = targetTime;
		this.timeStepSec = 0.1;
		this.targetList = [];
		this.interval = undefined;
	}

	WithPoints(targets){
		this.targetList = targets;
		this.targetsCount = targets.length;
		return this;
	}

	EvaluateCurrent(lat, lng){
		clearInterval(this.interval);
		const distance = this.targetList[this.currentTargetId].DistanceTo(lat,lng);
		const distanceScore = this.getDistanceScore(distance);
		const distanceScoreBonus = this.getDistanceBonus(distanceScore);
		const timeScore = this.getTimeBonus(distanceScore);
		const totalPoints = distanceScore * distanceScoreBonus  + timeScore;
		const timeElapsed = this.targetTime - this.remainingTime;
		this.currentPoints += totalPoints;
		document.dispatchEvent(runOutOfTimeEvt);
		return {
			time: timeElapsed,
			timeScore: timeScore,
			distScore: distanceScore,
			distScoreBonus: distanceScoreBonus,
			totalScore: totalPoints,
			distance: distance
		}
	}

	getDistanceScore(dist){
		const unit = deg_km * 0.5;
		const score = 100 - Math.ceil(dist / unit);
		if (score < 0) {
			return 0;
		}
		else {
			return score;
		}
	}

	getDistanceBonus(distanceScore) {
		if (distanceScore >= 99) {
			return 5;
		}
		if (distanceScore >= 95) {
			return 3;
		}
		return 1;
	}

	getTimeBonus(distScore) {
		return Math.floor(50 * (this.remainingTime/this.targetTime) * distScore / 100);
	}

	GetCurrent() {
		return this.targetList[this.currentTargetId];
	}

	GetCurrentId() {
		return this.currentTargetId;
	}

	IsFinished(){
		return this.currentTargetId >= this.targetsCount;
	}

	IsPassed(){
		return this.currentPoints >= this.requiredPoints;
	}

	GetProgress(){
		return this.currentPoints / this.requiredPoints;
	}

	SetInterval(){
		this.remainingTime = this.targetTime;
		this.interval = setInterval(this.OnTick.bind(this), this.timeStepSec*1000);
		this.DispatchTickEvent();
	}

	DispatchTickEvent(){
		const timeTickEvt = new CustomEvent("TimeTick", {
			detail: {
				remainingTime: this.remainingTime,
				fullTime: this.targetTime
			}
		});
		document.dispatchEvent(timeTickEvt);
	}

	OnTick(){
		this.remainingTime -= this.timeStepSec;
		this.DispatchTickEvent();
		if (this.remainingTime <= 0)
		{
			document.dispatchEvent(runOutOfTimeEvt);
			clearInterval(this.interval);
		}
	}
}

class GameState {
	constructor(levelCount = 10){
		this.currentLevelId = 0;
		this.points = 0;
		this.levelCount = levelCount;
		this.ReloadLevels();
		this.interval = undefined;
		this.capitalCityFlag = true;
	}

	ReloadLevels()
	{
		this.targets = [];
		this.loadTargets();
		this.shuffleTargets();
		this.levels = this.getLevels(this.levelCount);
	}
	
	loadStandardLocations(currentSettings){
		const locationsFunctionsMap = [
			{isEnabled: currentSettings.IsEuropeEnabled, getter: StandardLocations.LoadEurope},
			{isEnabled: currentSettings.IsAfricaEnabled, getter: StandardLocations.LoadAfrica},
			{isEnabled: currentSettings.IsAsiaEnabled, getter: StandardLocations.LoadAsia},
			{isEnabled: currentSettings.IsNorthAmericaEnabled, getter: StandardLocations.LoadNorthAmerica},
			{isEnabled: currentSettings.IsSouthAmericaEnabled, getter: StandardLocations.LoadSouthAmerica},
			{isEnabled: currentSettings.IsAustraliaOceaniaEnabled, getter: StandardLocations.LoadOceania},
		];
		locationsFunctionsMap.filter(l => l.isEnabled).forEach(x => {
			this.targets.push(...x.getter());
		});
	}

	filterCapitals(){
		this.targets = this.targets.filter(x => x.isCapital);
	}

	getProperTargetObject(parsedObject) {
		return new Target(parsedObject.lat, parsedObject.lng, parsedObject.name, parsedObject.country, parsedObject.region, parsedObject.isCapital);
	}

	loadCustomLocations(jsonLocationString){
		try
		{
			const customLocations = JSON.parse(jsonLocationString);
			customLocations.forEach(l => {
				this.targets.push(this.getProperTargetObject(l));
			});
		}
		catch(error)
		{
			console.error("Custom locations parsing error - "+error.toString());
		}
	}

	loadTargets(){
		const currentSettings = new Settings();
		this.loadStandardLocations(currentSettings);
		if (currentSettings.IsCustomEnabled)
		{
			this.loadCustomLocations(currentSettings.CustomLocationsJson);
		}
		if (currentSettings.IsCapitalsOnly)
		{
			this.filterCapitals();
		}
		return;
	}

	shuffleTargets(){
		for (let i = this.targets.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.targets[i], this.targets[j]] = [this.targets[j], this.targets[i]];
		}
	}

	grabTargets(from, count){
		return this.targets.slice(from, from+count + 1);
	}

	getLevels(levelCount){
		const levelArray = [
			new Level(1, 350, 12),
			new Level(2, 550, 11),
			new Level(3, 750, 10),
			new Level(4, 1000, 10),
			new Level(5, 1250, 9),
			new Level(6, 1450, 8),
			new Level(7, 1700, 7),
			new Level(8, 2000, 6),
			new Level(9, 2300, 5),
			new Level(10, 2650, 5),
		];
		let currentId = 0;
		for (let i = 0 ; i < levelCount; i++)
		{
			const targetCount = i+2;
			levelArray[i].WithPoints(this.grabTargets(currentId, targetCount));
			currentId = currentId + targetCount + 1;
		}
		return levelArray.slice(0, levelCount).filter(x => x.targetsCount > 0);
	}

	GetHemisphere(lat, lng) {
		if (lat >= 0){
			return lng <= 0 ? 1 : 0;
		}
		else {
			return lng <= 0 ? 2 : 3;
		}
	}

	IsCurrentLevelFinished() {
		return this.levels[this.currentLevelId].IsFinished();
	}

	IsCurrentLevelPassed() {
		return this.levels[this.currentLevelId].IsPassed();
	}

	IsGameFinished() {
		return this.currentLevelId + 1 >= this.levels.length;
	}

	StartNewLevel() {
		if (this.currentLevelId + 1 < this.levels.length) {
			this.currentLevelId++;
		}
		return this.currentLevelId + 1;
	}

	StartNewTarget() {
		this.levels[this.currentLevelId].currentTargetId++;
	}

	GetCurrentTargetCoo() {
		return this.levels[this.currentLevelId].GetCurrent().GetCoordinates();
	}

	GetCurrentLevelPrintableId() {
		return this.currentLevelId+1;
	}

	Evaluate(lat, lng){
		const targetCoo = this.levels[this.currentLevelId].GetCurrent().GetCoordinates();
		const result = this.levels[this.currentLevelId].EvaluateCurrent(lat, lng);
		result.targetHemisphere = this.GetHemisphere(targetCoo.lat, targetCoo.lng);
		result.attemptHemisphere = this.GetHemisphere(lat, lng);
		this.points += result.totalScore;
		return result;
	}
	
	GetCurrentState(){
		return {
			levelId: this.GetCurrentLevelPrintableId(),
			score: this.points,
			currentTargetLabel: this.levels[this.currentLevelId].GetCurrent().GetLabel(),
			currentTargetId: this.levels[this.currentLevelId].GetCurrentId() + 1,
			targetsCount: this.levels[this.currentLevelId].targetsCount,
			levelScore: this.levels[this.currentLevelId].currentPoints,
			levelRequiredScore: this.levels[this.currentLevelId].requiredPoints,
		}
	}

	GetPointsAfterAttempt(){
		return {
			score: this.points,
			levelScore: this.levels[this.currentLevelId].currentPoints,
		}
	}

	SetInterval(){
		this.levels[this.currentLevelId].SetInterval();
	}
}

class GameView {
	constructor()
	{
		//menu
		this.mainMenuElement = document.getElementById('main-menu');
		this.gameStateElement = document.querySelector('.game-state');
		this.gameTitleElement = document.querySelector('.globetrotter-game-title');
		this.levelMenuLbl = document.getElementById('menu-next-level');
		this.scoreMenuLbl = document.getElementById('menu-final-score');
		this.gameStartBtn = this.mainMenuElement.querySelector('#start-game-btn');
		this.settingsBtn = this.mainMenuElement.querySelector('#settings-btn');
		//bar
		this.levelLbl = document.getElementsByClassName('game-current-level')[0];
		this.currentScoreLbl = document.getElementsByClassName('game-current-score')[0];
		
		this.currentTargetLbl = document.getElementsByClassName('game-state-current-target-name')[0];

		this.levelTargetIdLbl = document.getElementsByClassName('game-current-level-target-id')[0];
		this.levelTargetCountLbl = document.getElementsByClassName('game-current-level-target-count')[0];
		this.levelScoreLbl = document.getElementsByClassName('game-current-level-score')[0];
		this.levelScoreRequiredLbl = document.getElementsByClassName('game-current-level-score-required')[0];

		this.mapWidth = document.getElementById('layer-map').width;
		this.mapHeight = document.getElementById('layer-map').height;
		//context menu
		this.hemisphereMapper = [
			[1, 3, 1, 2],
			[3, 0, 0, 2],
			[1, 0, 3, 1],
			[2, 0, 1, 0]
		]
		this.hemisphereCtxMenuPos = [
			{top: 150, left: 50},
			{top: 150, left: parseInt(this.mapWidth) - 50},
			{top: parseInt(this.mapHeight) - 300, left: 50},
			{top: parseInt(this.mapHeight) - 300, left: parseInt(this.mapWidth) - 50},
		]

		this.ctxMenuElement = document.getElementsByClassName('target-result-context-menu')[0];
		this.ctxMenuDistErrorLbl = document.getElementsByClassName('context-menu-distance-error')[0];
		this.ctxMenuDistScoreLbl = document.getElementsByClassName('context-menu-distance-score')[0];
		this.ctxMenuDistScoreBonusLbl = document.getElementsByClassName('context-menu-distance-score-multiplier-value')[0];
		this.ctxMenuDistTimeBonusLbl = document.getElementsByClassName('context-menu-time-bonus-score')[0];
		this.ctxMenuDistTargetScoreLbl = document.getElementsByClassName('context-menu-target-score')[0];
		
		this.timeProgressBar = document.getElementById('time-countdown-progress-bar');
		this.timeRemainingLbl = document.getElementById('game-state-time-countdown-remaining-value');
		document.addEventListener("TimeTick", this.OnTimeTick.bind(this));
	}

	UpdateLevelBar(currentState) {
		this.levelLbl.innerText = currentState.levelId;
		
		this.currentTargetLbl.innerText = currentState.currentTargetLabel;

		this.levelTargetIdLbl.innerText = currentState.currentTargetId;
		this.levelTargetCountLbl.innerText = currentState.targetsCount;

		this.currentScoreLbl.innerText = currentState.score;
		this.levelScoreLbl.innerText = currentState.levelScore;
		this.levelScoreRequiredLbl.innerText = currentState.levelRequiredScore;
	}

	UpdateAfterAttemptIsMade(currentState) {
		this.currentScoreLbl.innerText = currentState.score;
		this.levelScoreLbl.innerText = currentState.levelScore;
	}

	AsPx(number) {
		return `${number}px`;
	}

	SetCtxMenuPosition(pos) {
		this.ctxMenuElement.style.top = this.AsPx(pos.top);
		this.ctxMenuElement.style.left = this.AsPx(pos.left);
		this.ctxMenuElement.style.bottom = this.AsPx(pos.bottom);
		this.ctxMenuElement.style.right = this.AsPx(pos.right);
	}

	UpdateTargetResultCtxMenu(result, targetHemisphere, guessHemisphere) {
		this.mapWidth = document.getElementById('layer-map').width;
		this.mapHeight = document.getElementById('layer-map').height;
		//context menu
		this.hemisphereMapper = [
			[1, 3, 1, 2],
			[3, 0, 0, 2],
			[1, 0, 3, 1],
			[2, 0, 1, 0]
		]
		this.hemisphereCtxMenuPos = [
			{top: 150, left: parseInt(this.mapWidth)/2 + 50},
			{top: 150, left: 150},
			{top: parseInt(this.mapHeight)/2 - this.ctxMenuElement.style.height, left: 50},
			{top: parseInt(this.mapHeight)/2 - this.ctxMenuElement.style.height, left: parseInt(this.mapWidth)/2 + 50},
		]

		const ctxPos = this.hemisphereCtxMenuPos[this.hemisphereMapper[targetHemisphere][guessHemisphere]];
		this.ctxMenuElement.style.display = 'block';
		this.SetCtxMenuPosition(ctxPos);

		this.ctxMenuDistErrorLbl.innerText = result.distance.toFixed(0);
		this.ctxMenuDistScoreLbl.innerText = result.distScore;
		this.ctxMenuDistScoreBonusLbl.innerText = result.distScoreBonus;
		this.ctxMenuDistTimeBonusLbl.innerText = result.timeScore;
		this.ctxMenuDistTargetScoreLbl.innerText = result.totalScore;
	}

	SetCtxMenuAfterRunOutOfTime() {
		this.ctxMenuElement.style.display = 'block';
		this.SetCtxMenuPosition({top: 150, left: 150});

		this.ctxMenuDistErrorLbl.innerText = 0;
		this.ctxMenuDistScoreLbl.innerText = 0;
		this.ctxMenuDistScoreBonusLbl.innerText = 0;
		this.ctxMenuDistTimeBonusLbl.innerText = 0;
		this.ctxMenuDistTargetScoreLbl.innerText = 0;
	}

	OnTimeTick(e) {
		this.timeProgressBar.max = Math.round(e.detail.fullTime * 100) / 100;
		this.timeProgressBar.value = Math.round(e.detail.remainingTime * 100) / 100;
		this.timeRemainingLbl.innerText = Math.max(e.detail.remainingTime,0).toFixed(2);
	}

	ShowLevelMenu(levelId)
	{
		this.mainMenuElement.style.display = 'block';
		this.levelMenuLbl.style.display = 'block';
		this.levelMenuLbl.innerText = `Level ${levelId}`;
		this.scoreMenuLbl.style.display = 'none';
		this.gameTitleElement.style.display = 'grid';
		this.gameStateElement.style.display = 'none';
	}

	ShowEndingMenu(label, score)
	{
		this.mainMenuElement.style.display = 'block';
		this.levelMenuLbl.innerText = label;
		this.scoreMenuLbl.style.display = 'block';
		this.scoreMenuLbl.innerText = `Final score: ${score}`;
		this.gameTitleElement.style.display = 'grid';
		this.gameStateElement.style.display = 'none';
	}
}

const width = 1500;
const resolution = 0.25;
const deg_km = 111.1;
const equator_old = 417.553561;
const equator = 378.8;
//const equator = 387.4;
const primeMeridian = 750.7;
//const primeMeridian = 712;


class Globetrotter {
	constructor(){
		this.Init();
	}

	Init(){
		this.imgMapBorders = document.querySelector('.content-image-worldmap');
		this.imgMapNoBorders = document.querySelector('.content-image-worldmap-noborders');
		this.imgMap = this.imgMapBorders;
		this.canvasMap = document.getElementById('layer-map');
		this.ctxMap = this.canvasMap.getContext('2d');

		this.canvasTarget = document.getElementById('layer-target');
		this.ctxTarget = this.canvasTarget.getContext('2d');

		this.mainMenuElement = document.getElementById('main-menu');
		this.settingsElement = document.getElementById('settings-menu');
		this.gameStateElement = document.querySelector('.game-state');
		this.gameStartBtn = this.mainMenuElement.querySelector('#start-game-btn');

		this.settingsBtn = this.mainMenuElement.querySelector('#settings-btn');
		this.settingsBtn.style.display = 'initial';

		this.settingsExitBtn = document.getElementById('settings-exit-btn');
		this.gameTitleElement = document.querySelector('.globetrotter-game-title');

		this.nextBtn = document.getElementsByClassName('context-menu-next-target-btn')[0];
		this.ctxMenu = document.getElementsByClassName('target-result-context-menu')[0];

		this.secondaryBar = document.querySelector('.game-secondarybar');

		this.isStarted = false;
		this.gameState = new GameState();
		this.gameView = new GameView();
		this.zoomCoef = 0.9;

		this.clickedPoint = {x: 0, y:0};
		this.LastTargetCoo = {lat: -400, lng: -400};


		this.initZoom();
	}

	SetCanvasSize(screenWidth){
		const ratio = this.imgMap.height/this.imgMap.width;
		const screenHeight = screenWidth*ratio;
		this.canvasMap.width = this.canvasTarget.width = screenWidth;
		this.canvasMap.height = this.canvasTarget.height =  screenHeight;
	}

	DrawMap(screenWidth){
		this.ctxMap.drawImage(this.imgMap, 0 - this.x3, 0 - this.y3, this.canvasMap.width, this.canvasMap.height);
	}

	getCursorCoordinates(e){
		const rect = e.target.getBoundingClientRect();
		const zoomRatio =  parseInt(document.body.style.zoom)/100;

		const x = (e.clientX - rect.left  * zoomRatio) / zoomRatio;
	    const y = (e.clientY - rect.top * zoomRatio)  / zoomRatio;
		return {x: x, y: y};
	}

	getMapPoint(clickX,clickY){
		const rx = clickX / this.canvasMap.width;
		const ry = clickY / this.canvasMap.height;

		const offsetX = this.clipW * rx;
		const offsetY = this.clipH * ry;

		return {x: this.cx + offsetX, y: this.cy + offsetY};
	}

	saveClickedCoordinates(cursorPoint){
		const point = this.getMapPoint(cursorPoint.x,cursorPoint.y);
		/*
		console.log("x: ",this.clickedPoint.x);
		console.log("y: ",this.clickedPoint.y);
		console.log("DIFF X: ",Math.abs(this.clickedPoint.x - point.x));
		console.log("DIFF Y: ",Math.abs(this.clickedPoint.y - point.y));
		*/
		this.clickedPoint.x = point.x;
		this.clickedPoint.y = point.y;
	}

	isPointOutsideClip(x,y){
		return (x < 0 || x > this.clipW || y < 0 || y > this.clipH);
	}


	getCoordinatesInClip(x,y){
		const left = x - this.cx;
		const top = y - this.cy;
		if (this.isPointOutsideClip(left,top))
		{
			return undefined;
		}
		const w = left/this.clipW;
		const h = top/this.clipH;
		//const canvasX = Math.floor(w * this.canvasMap.width);
		//const canvasY = Math.floor(h * this.canvasMap.height);

		const canvasX = w * this.canvasMap.width;
		const canvasY = h * this.canvasMap.height;

		return {x: canvasX, y: canvasY};
	}

	drawTarget(x,y, size = 1, color = 'red'){
		const coo = this.getCoordinatesInClip(x,y);
		if (coo != undefined)
		{
			this.ctxTarget.fillStyle = color;
			this.ctxTarget.fillRect(coo.x - (size - 1),coo.y - (size - 1),size,size);
		}
	}

	drawHorizontal(y, epsilon){
		if (epsilon == undefined)
		{
			epsilon = 1;
		}
		for(let x = 0; x < this.canvasMap.width; x+=epsilon)
		{
			this.drawTarget(x,y);
		}
	}

	getImageCanvasRatio()
	{
		return {
			x: this.imgMap.width/this.canvasMap.width,
			y: this.imgMap.height/this.canvasMap.height
		}
	}

	clearTargetCtx()
	{
		this.ctxTarget.clearRect(0,0,this.canvasTarget.width,this.canvasTarget.height);
	}

	zoomGameScreenIn(cursorPoint)
	{
		const lx = cursorPoint.x / this.canvasMap.width;
		const rx = 1 - lx;
		const ly = cursorPoint.y / this.canvasMap.height;
		const ry = 1 - ly;

		const zoomValue = Math.pow(this.zoomConstant,this.zoomD);
		this.cx += lx * this.cw*(1-this.zoomConstant);
		this.cy += ly * this.ch*(1-this.zoomConstant);

		this.cx2 = this.cx2 -  rx * this.cw*(1-this.zoomConstant);
		this.cy2 = this.cy2 -  ry * this.ch*(1-this.zoomConstant);

		this.cw = zoomValue * this.canvasMap.width;
		this.ch = zoomValue * this.canvasMap.height;

		this.cw = Math.abs(this.cx - this.cx2);
		this.ch = Math.abs(this.cy - this.cy2);

		this.clipW = this.cw;
		this.clipH = this.ch;

		const imageToCanvasRatio = this.getImageCanvasRatio();
		const imgX = this.cx*imageToCanvasRatio.x;
		const imgY = this.cy*imageToCanvasRatio.y;
		const imgWidth = this.cw*imageToCanvasRatio.x;
		const imgHeight = this.ch*imageToCanvasRatio.y;

		this.ctxMap.clearRect(0,0,this.canvasTarget.width,this.canvasTarget.height);
		this.ctxMap.drawImage(this.imgMap, 
			imgX,imgY, imgWidth, imgHeight, 
			0, 0, this.canvasMap.width, this.canvasMap.height);
		this.clearTargetCtx();
		this.zoomD++;
	}

	zoomGameScreenOut(cursorPoint)
	{
		const lx = cursorPoint.x / this.canvasMap.width;
		const rx = 1 - lx;
		const ly = cursorPoint.y / this.canvasMap.height;
		const ry = 1 - ly;

		const zoomValue = Math.pow(this.zoomConstant,this.zoomD);
		this.cx -= lx * this.cw2*(1-this.zoomConstant);
		this.cx2 = this.cx2 +  rx * this.cw2*(1-this.zoomConstant);
		if (this.cx < 0)
		{
			this.cx2 += Math.abs(this.cx);
			this.cx2 = Math.min(this.canvasMap.width, this.cx2)
			this.cx = 0;
		}
		else if (this.cx2 > this.canvasMap.width)
		{
			this.cx -= Math.abs(this.cx2);
			this.cx = Math.max(0, this.cx);	
			this.cx2 = this.canvasMap.width;
		}
		this.cy -= ly * this.ch2*(1-this.zoomConstant);
		this.cy2 = this.cy2 +  ry * this.ch2*(1-this.zoomConstant);
		if (this.cy < 0)
		{
			this.cy2 += Math.abs(this.cy);
			this.cy2 = Math.min(this.canvasMap.height, this.cy2)
			this.cy = 0;
		}
		else if (this.cy2 > this.canvasMap.height)
		{
			this.cy -= Math.abs(this.cy2);
			this.cy = Math.max(0, this.cy);
			this.cy2 = this.canvasMap.height;
		}

		const copyCx2 = this.cx2
		
		const copyCy2 = this.cy2;

		this.cw2 = Math.abs(this.cx - this.cx2);
		this.ch2 = Math.abs(this.cy - this.cy2);

		this.clipW = this.cw2;
		this.clipH = this.ch2;

		this.DrawZoomedImage(this.cw2, this.ch2);
		this.clearTargetCtx();
		this.zoomD--;
	}

	DrawZoomedImage(w, h)
	{
		const imageToCanvasRatio = this.getImageCanvasRatio();
		const imgX = this.cx*imageToCanvasRatio.x;
		const imgY = this.cy*imageToCanvasRatio.y;
		const imgWidth = w*imageToCanvasRatio.x;
		const imgHeight = h*imageToCanvasRatio.y;

		this.ctxMap.clearRect(0,0,this.canvasTarget.width,this.canvasTarget.height);
		this.ctxMap.drawImage(this.imgMap, 
			imgX,imgY, imgWidth, imgHeight, 
			0, 0, this.canvasMap.width, this.canvasMap.height);
	}

	initZoom()
	{
		this.cx = 0;
		this.cy = 0;
		this.cx2 = this.canvasMap.width;
		this.cy2 = this.canvasMap.height;
		this.cw = this.canvasMap.width;
		this.ch = this.canvasMap.height;
		this.cw2 = this.canvasMap.width;
		this.ch2 = this.canvasMap.height;

		this.clipW = this.cw;
		this.clipH = this.ch;

		this.zoomConstant = 0.9;
		this.zoomD = 1;
	}

	resetZoom()
	{
		this.initZoom();
		this.DrawZoomedImage(this.cw, this.ch);
		this.drawLastAttempt();
	}

	getCoordinatesFromPoint(x,y)
	{
		return {
			lat: this.GetLatitude(y),
			lng: this.GetLongitude(x)
		};
	}

	handleClick(e){
		if (this.isGuessing)
		{
			const cursorPoint = this.getCursorCoordinates(e);
			this.saveClickedCoordinates(cursorPoint);
			const lat = this.GetLatitude(this.clickedPoint.y);
			const lng = this.GetLongitude(lat, this.clickedPoint.x);
			if (lat != undefined && lng != undefined)
			{
				const result = this.gameState.Evaluate(lat, lng);
				this.gameView.UpdateAfterAttemptIsMade(this.gameState.GetPointsAfterAttempt());
				this.gameView.UpdateTargetResultCtxMenu(result, result.attemptHemisphere, result.targetHemisphere);
				this.isGuessing = false;
				console.log("LAT: ",lat); //toremove
				console.log("LONG: ",lng); //toremove
				this.LastTargetCoo = this.gameState.GetCurrentTargetCoo();
				this.drawLastAttempt();
			}
		}
	}

	handleRunOutOfTime(e){
		this.gameView.UpdateAfterAttemptIsMade(this.gameState.GetPointsAfterAttempt());
		this.gameView.SetCtxMenuAfterRunOutOfTime();
		this.isGuessing = false;
	}

	drawAllTargets() {
		[...this.gameState.targets].forEach((x) => {
			this.DrawPointAt(x.lat, x.lng);
		});
	}

	drawLastAttempt() {
		this.clearTargetCtx();
		if (!this.isGuessing)
		{
			this.drawTarget(this.clickedPoint.x, this.clickedPoint.y, 5, 'red');
			this.DrawPointAt(this.LastTargetCoo.lat, this.LastTargetCoo.lng);
		}
	}

	handleWheel(e){
		e.preventDefault();
		if(e.deltaY < 0)
		{
			this.zoomGameScreenIn(this.getCursorCoordinates(e));
		}
		else if (this.zoomD >= 2)
		{
			this.zoomGameScreenOut(this.getCursorCoordinates(e));
		}
		this.drawLastAttempt();
	}

	smaller(){
		this.avg10deg+=0.05;
		this.drawLastAttempt();
	}

	bigger(){
		this.avg10deg-=0.05;
		this.drawLastAttempt();
	}
	
	drawMer()
	{
		for (let i = 0 ; i <= 165; i+=15)
		{
			this.drawMeridian(i);
			this.drawMeridian(-i);
		}
		for (let i = 0; i <= 75; i+=15)
		{
			this.drawLatitude(i);
			this.drawLatitude(-i);
		}
		const points = [
			{x: 17, y: 48},
		]
		points.forEach((p) => {
			this.DrawPointAt(p.y, p.x);
		});
	}

	handleSettings(e){
		document.querySelector('#settings-menu').style.display = 'initial';
	}

	handleExitSettings(e){
		document.querySelector('#settings-menu').style.display = 'none';
		this.gameState.ReloadLevels();
		if (this.gameState.levels.length == 0)
		{
			this.gameStartBtn.setAttribute("disabled", "disabled");
		}
		else
		{
			this.gameStartBtn.removeAttribute("disabled");
		}
	}

	handleStart(e){
		this.settingsBtn.style.display = 'none';
		this.gameStateElement.style.display = 'grid';
		this.gameTitleElement.style.display = 'none';
		this.mainMenuElement.style.display = 'none';
		[...document.querySelectorAll('.layer')].forEach((el)=>el.style.display='initial');
		this.initZoom();
		this.isGuessing = true;
		this.gameView.UpdateLevelBar(this.gameState.GetCurrentState());
		this.resetZoom();
		this.gameState.SetInterval();
	}

	handleNext(e){
		this.ctxMenu.style.display = 'none';
		this.resetZoom();
		this.gameState.StartNewTarget();
		if (!this.gameState.IsCurrentLevelFinished())
		{
			this.isGuessing = true;
			this.gameView.UpdateLevelBar(this.gameState.GetCurrentState());
			this.gameState.SetInterval();
		}
		else
		{
			if (this.gameState.IsCurrentLevelPassed())
			{
				if (this.gameState.IsGameFinished())
				{
					this.gameView.ShowEndingMenu("Congratulations! You won!", this.gameState.points);
					this.Init();
				}
				else
				{
					const levelId = this.gameState.StartNewLevel();
					if (levelId >= 7)
					{
						this.imgMap = this.imgMapNoBorders;
					}
					this.gameView.ShowLevelMenu(this.gameState.GetCurrentLevelPrintableId());
				}
			}
			else
			{
				this.gameView.ShowEndingMenu("You lost!", this.gameState.points);
				this.Init();
			}
		}
		this.clearTargetCtx();
	}

	handleKey(e){
		if (e.key == 'Enter' && !this.isGuessing)
		{
			this.handleNext();
		}
		if (e.key == 'r')
		{
			this.resetZoom();
		}
		if (e.key == 'ArrowUp')
		{
			this.bigger();
		}
		else if (e.key == 'ArrowDown')
		{
			this.smaller();
		}
	}

	LoadEvents(){
		this.canvasTarget.addEventListener('click', this.handleClick.bind(this));
		this.canvasTarget.addEventListener('wheel', this.handleWheel.bind(this));
		this.gameStartBtn.addEventListener('click', this.handleStart.bind(this));
		this.settingsBtn.addEventListener('click', this.handleSettings.bind(this));
		this.settingsExitBtn.addEventListener('click', this.handleExitSettings.bind(this));
		this.nextBtn.addEventListener('click', this.handleNext.bind(this));
		document.addEventListener('keydown', this.handleKey.bind(this));
		document.addEventListener('RunOutOfTime', this.handleRunOutOfTime.bind(this));
	}

	ResetZoom(){
		this.zoomScale = 1;
		this.zoomDepth = 0;
		this.maxZoomDepth = 35;
		this.clipX = 0;
		this.clipY = 0;
		this.clipW = this.canvasMap.width;
		this.clipH = this.canvasMap.height;
		document.body.style.zoom = "100%";
	}

	DrawMainMenu(){
		this.mainMenuElement.style.height = this.settingsElement.style.height = `${this.canvasMap.height}px`;
		[this.mainMenuElement,this.gameStateElement,this.gameTitleElement, this.settingsElement].forEach((el) => {
			el.style.width = `${this.canvasMap.width}px`;;
		});
	}

	DrawLatitude(){
		this.latitudeMap.forEach((value,key)=>{
			this.drawHorizontal(this.equator+value);
			this.drawHorizontal(this.equator-value);
		});
	}

	DrawPointAt(lat, long){
		let sign = lat < 0 ? -1 : 1;
		//let signLong = long < 0 ? - 1 : 1;
		const x = this.primeMeridian + this.getDistanceFromPrimeMeridian(lat, long);//*signLong;
		const y = this.equator - this.latitudeMap.get(Math.abs(lat))*sign
		this.drawTarget(x,y, 10, 'green');
	}

	GetLatitudeMap(){
		this.resolution = resolution;
		this.maxDegree = 83;
		this.latitudeMap = new Map();
		this.equator = equator * this.ratio;
		this.latitudeMap.set(0.0,0);
		for (let i = this.resolution; i <= this.maxDegree; i+=this.resolution)
		{
			this.latitudeMap.set(i,this.getDistanceFromEquator(i));
		}
		
	}

	GetLatitude(y){
		const sign = y > this.equator ? -1 : 1;
		const diff = Math.abs(this.equator - y);
		let lastChecked = 0;
		for (let [key, value] of this.latitudeMap) {
			if (diff < value){
				//return key - this.resolution + (Math.abs(diff - lastChecked)/Math.abs(value - lastChecked)*this.resolution);
				return (Math.abs(diff-lastChecked) > Math.abs(diff-value) ? key : key - this.resolution)*sign;
			}
			lastChecked = value;
		  };
	}

	GetLongitude(lat, x){
		const longitudeCoef = 0.8487;
		//const coeff = 0.0451127819549*lat;
		this.maxLongitude = 180;
		const sign = x > this.primeMeridian ? 1 : -1;
		const diff = Math.abs(this.primeMeridian - x);
		let lastChecked = 0;
		for (let i = 0 ; i < this.maxLongitude ; i += this.resolution){
			const xx = this.getDistanceFromPrimeMeridian(lat,i);
			if (diff < xx){
				return (Math.abs(diff-lastChecked) > Math.abs(diff-xx) ? i : i-this.resolution)*sign;
			}
			lastChecked = xx;
		}
	}

	getRobinsonPointCoef(lat,lng){
		// returns the robinson projected point for a given lat/lng based on
		// the earth radius value determined in the contructor
		
		var roundToNearest = function(roundTo, value){
		  return Math.floor(value/roundTo)*roundTo;  //rounds down
		};
		var getSign = function(value){
		  return value < 0 ? -1 : 1;
		};
		
		  var lngSign = getSign(lng), latSign = getSign(lat); //deals with negatives
		  lng = Math.abs(lng); lat = Math.abs(lat); //all calculations positive
		var radian = 0.017453293; //pi/180
		var low = roundToNearest(5, lat-0.0000000001); //want exact numbers to round down
		low = (lat == 0) ? 0 : low; //except when at 0
		var high = low + 5;
		
		// indicies used for interpolation
		var lowIndex = low/5;
		var highIndex = high/5;
		var ratio = (lat-low)/5;
	  
		// interpolation in one dimension
		var adjAA = ((AAd[highIndex]-AAd[lowIndex])*ratio)+AAd[lowIndex];
		  var adjBB = ((BBd[highIndex]-BBd[lowIndex])*ratio)+BBd[lowIndex];

		  return {
			x: adjAA,
			y: adjBB
		  }
	  }

	  getDistanceFromEquator(lat){
		const latRobinsonCoef = 1.3523;
		return (this.getRobinsonPointCoef(lat,0).y/latRobinsonCoef)*this.equator;
	  }

	  getDistanceFromPrimeMeridian(lat,lng){
		const longitudeCoef = 0.8487;
		const lngRobinsonCoef = this.getRobinsonPointCoef(lat,lng);
		return (this.avg10deg)*lng/15*lngRobinsonCoef.x/longitudeCoef; //+ (lng < 0 ? + 8 : -8);// + (lng < 0 ? -latCoef : latCoef);
	  }

	drawLatitude(lat) {
		let sign = lat < 0 ? -1 : 1;
		this.drawHorizontal(this.equator - this.latitudeMap.get(Math.abs(lat))*sign);
	}

	drawMeridian(lng){
		for (let i = 0 ; i < this.maxDegree; i+=this.resolution/5){
			const distFromEq = this.getDistanceFromEquator(i);
			const distFromPrime = this.getDistanceFromPrimeMeridian(i,lng);
			this.drawTarget(distFromPrime + this.primeMeridian, this.equator - distFromEq);
			this.drawTarget(distFromPrime + this.primeMeridian, this.equator + distFromEq);
		}
	}

	Run(){
		this.size = width;
		this.ratio = this.size/1500;
		this.ResetZoom();
		this.SetCanvasSize(this.size);
		this.DrawMap();
		this.DrawMainMenu();
		this.LoadEvents();
		this.adjustCoef = 1;
		this.equator = equator * this.ratio;
		this.primeMeridian = primeMeridian * this.ratio;
		//this.avg10deg = 62.4 * this.ratio;
		this.avg10deg = 62.40999999999997 * this.ratio;
		this.GetLatitudeMap();
	}
}

var imageBorders = 'worldmap5.jpg';
var imageNoBorders = 'worldmap5_noborders.jpg';

document.addEventListener('DOMContentLoaded',function(){
	globetrotter = new Globetrotter();
	const img1 = document.querySelector('.content-image-worldmap')
	img1.src = `.\\img\\${imageBorders}`;
	document.body.append(img1);

	const img2 = document.querySelector('.content-image-worldmap-noborders')
	img2.src = `.\\img\\${imageNoBorders}`;
	document.body.append(img2);

	img1.onload = ()=>{
		document.querySelector(".game-screen").style.display = 'initial';
		console.log("load");
		globetrotter.Run();
	}

	img2.onload = ()=>{
		console.log("load no borders image");
	}
});

AAd = [0.8487,0.84751182,0.84479598,0.840213,0.83359314,0.8257851,0.814752,0.80006949,0.78216192,0.76060494,0.73658673,0.7086645,0.67777182,0.64475739,0.60987582,0.57134484,0.52729731,0.48562614,0.45167814];
BBd = [0,0.0838426,0.1676852,0.2515278,0.3353704,0.419213,0.5030556,0.5868982,0.67182264,0.75336633,0.83518048,0.91537187,0.99339958,1.06872269,1.14066505,1.20841528,1.27035062,1.31998003,1.3523];

