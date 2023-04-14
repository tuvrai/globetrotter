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

class Target{
	constructor(lat,lng,name,country, region = "", minLevel = 1){
		this.lat = lat;
		this.lng = lng;
		this.name = name;
		this.country = country;
		this.region = region;
		this.minLevel = minLevel;
		this.used = false;
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
		this.targets = [];
		this.loadTargets();
		this.shuffleTargets();
		this.levels = this.getLevels(levelCount);
		this.interval = undefined;
	}

	loadNorthAmerica()
	{
		this.targets.push(new Target(64.25, -51.75,"Nuuk","Greenland"));
		this.targets.push(new Target(15.25, -61.5,"Roseau","Dominica"));
		this.targets.push(new Target(10.5, -61.5,"Port of Spain","Trinidad and Tobago"));

		this.targets.push(new Target(34, -118,"Los Angeles","USA","California"));
		this.targets.push(new Target(36.25, -115.25,"Las Vegas","USA","Nevada"));
		this.targets.push(new Target(43.5, -116.25,"Boise","USA","Idaho"));
		this.targets.push(new Target(32.75, -96.75,"Dallas","USA","Texas"));
		this.targets.push(new Target(41.25, -96,"Omaha","USA","Nebraska"));
		this.targets.push(new Target(38.25, -85.75,"Louisville","USA","Kentucky"));
		this.targets.push(new Target(41.75, -87.75,"Chicago","USA","Illinois"));
		this.targets.push(new Target(40.75, -74,"New York","USA","New York"));
		this.targets.push(new Target(39, -77,"Washington, D.C.","USA"));
		this.targets.push(new Target(25.75, -80.25,"Miami","USA","Florida"));
		this.targets.push(new Target(35, -85.25,"Chattanooga","USA","Tennessee"));
		this.targets.push(new Target(58.25, -134.5,"Juneau","USA","Alaska"));
		this.targets.push(new Target(61.25, -150,"Anchorage","USA","Alaska"));

		this.targets.push(new Target(43.5, -79.5,"Toronto","Canada","Ontario"));
		this.targets.push(new Target(45.5, -75.75,"Ottawa","Canada","Ontario"));
		this.targets.push(new Target(45.5, -73.5,"Montreal","Canada","Quebec"));
		this.targets.push(new Target(53.5, -113.5,"Edmonton","Canada","Alberta"));
		this.targets.push(new Target(49.25, -123,"Vancouver","Canada","British Columbia"));
		this.targets.push(new Target(47.5, -52.75,"St. John's","Canada","Newfoundland"));
		this.targets.push(new Target(82.5,-62.5,"Alert","Canada","Nunavut"));

		this.targets.push(new Target(19.5, -99,"Ciudad de México","Mexico"));
		this.targets.push(new Target(24,-110.25,"La Paz","Mexico","Baja California Sur"));
		this.targets.push(new Target(25.75, -100.25,"Monterrey","Mexico","Nuevo León"));
		this.targets.push(new Target(21, -89.5,"Mérida","Mexico", "Yucatán"));
		this.targets.push(new Target(31.75, -106.5,"Ciudad Juárez","Mexico", "Chihuahua"));
		this.targets.push(new Target(20.75, -103.25,"Guadalajara","Mexico", "Jalisco"));

		this.targets.push(new Target(23, -82.25, "Havana", "Cuba"));
		this.targets.push(new Target(9, -79.5, "Panama City", "Panama"));
		this.targets.push(new Target(10, -84, "San José", "Costa Rica"));
		this.targets.push(new Target(17.25, -88.75, "Belmopan", "Belize","Cayo"));
		this.targets.push(new Target(12, -86.25,"Managua","Nicaragua"));
		this.targets.push(new Target(13.75, -89.25, "San Salvador", "El Salvador"));
		this.targets.push(new Target(14, -87.25, "Tegucigalpa", "Honduras", "Francisco Morazán"));
		this.targets.push(new Target(14.5, -90.5, "Guatemala City", "Guatemala"));

		this.targets.push(new Target(18.25, -66, "San Juan", "Puerto Rico"));
		this.targets.push(new Target(18.5, -72.25, "Port-au-Prince", "Haiti", "Ouest"));
		this.targets.push(new Target(18.5, -70, "Santo Domingo", "Dominican Republic", "National"));
		this.targets.push(new Target(18, -76.75, "Kingston", "Jamaica","Surrey"));
		this.targets.push(new Target(13, -61.25, "Kingstown", "Saint Vincent and the Grenadines"));
		this.targets.push(new Target(25, -77.25, "Nassau", "Bahamas","New Providence"));
		this.targets.push(new Target(12.25, -69, "Willemstad", "Curaçao"));
		
		this.targets.push(new Target(17.25,-62.75,"Basseterre","Saint Kitts and Nevis"));
		this.targets.push(new Target(13,-59.5,"Bridgetown","Barbados","St Michael"));
		this.targets.push(new Target(14,-61,"Castries","Saint Lucia"));
		this.targets.push(new Target(12,-61.75,"St. George's","Grenada"));
		this.targets.push(new Target(17,-62,"St. John's","Antigua and Barbuda"));
	}

	loadSouthAmerica()
	{
		this.targets.push(new Target(6.75, -58,"Georgetown","Guyana","Demerara-Mahaica"));
		this.targets.push(new Target(10.5, -67,"Caracas","Venezuela"));
		this.targets.push(new Target(10.75, -71.75,"Maracaibo","Venezuela","Zulia"));
		this.targets.push(new Target(4.5, -74,"Bogota","Colombia"));
		this.targets.push(new Target(11, -74.75,"Baranquilla","Colombia","Atlántico"));
		this.targets.push(new Target(6.25, -75.5,"Medellín","Colombia","Antioquia"));
		this.targets.push(new Target(-0.25, -78.5,"Quito","Ecuador"));
		this.targets.push(new Target(-2.25, -80,"Guayaquil","Ecuador","Guayas"));
		this.targets.push(new Target(-12, -77,"Lima","Peru"));
		this.targets.push(new Target(-3.75, -73.25,"Iquitos","Peru","Loreto"));
		this.targets.push(new Target(-33.5, -70.75,"Santiago","Chile","Magallanes"));
		this.targets.push(new Target(-53.25, -71,"Punta Arenas","Chile","Magallanes"));
		this.targets.push(new Target(-15.75, -48,"Brasilia","Brazil","Central-West"));
		this.targets.push(new Target(-3.75, -38.5,"Fortaleza","Brazil","Ceará"));
		this.targets.push(new Target(-23, -43.25,"Rio de Janeiro","Brazil"));
		this.targets.push(new Target(-13, -38.5,"Salvador","Brazil","Bahia"));
		this.targets.push(new Target(-3, -60,"Manaus","Brazil","Amazonas"));
		this.targets.push(new Target(-23.5, -46.75,"São Paulo","Brazil"));
		this.targets.push(new Target(-25.25, -57.5,"Asuncion","Paraguay"));
		this.targets.push(new Target(-34.75, -58.5,"Buenos Aires","Argentina"));
		this.targets.push(new Target(-31.5, -64.25,"Córdoba","Argentina"));
		this.targets.push(new Target(-46, -67.5,"Comodoro Rivadavia","Argentina","Chubut"));
		this.targets.push(new Target(-34.75, -56.25,"Montevideo","Uruguay"));
		this.targets.push(new Target(5, -52.25,"Cayenne","French Guiana"));
		this.targets.push(new Target(5.75, -55.25,"Paramaribo","Suriname"));
		this.targets.push(new Target(-16.5, -68.25,"La Paz","Bolivia"));
		this.targets.push(new Target(-19, -65.25,"Sucre","Bolivia","Chuquisaca"));
		this.targets.push(new Target(-51.75, -58,"Stanley","Falkland Islands"));
		this.targets.push(new Target(-27.25, -109.5,"Easter Island","Chile"));
	}

	loadEurope()
	{
		this.targets.push(new Target(50.25,19,"Katowice","Poland","Silesian"));
		this.targets.push(new Target(54.5,18.5,"Gdańsk","Poland","Pomeranian"));
		this.targets.push(new Target(52.25,21,"Warsaw","Poland","Masovian"));
		this.targets.push(new Target(53.5,14.5,"Szczecin","Poland","West Pomeranian"));
		this.targets.push(new Target(48,17,"Bratislava","Slovakia"));
		this.targets.push(new Target(48.25,16.5,"Vienna","Austria"));
		this.targets.push(new Target(50,14.5,"Prague","Czechia"));
		this.targets.push(new Target(48,37.5,"Donetsk","Ukraine"));
		this.targets.push(new Target(41.25,19.75,"Tirane","Albania"));
		this.targets.push(new Target(44.75, 20.5,"Belgrade","Serbia"));
		this.targets.push(new Target(38, 23.75,"Athens","Greece", "Attica"));
		this.targets.push(new Target(40, 22.25,"Mount Olympus","Greece", "Thessaly/Macedonia border"));
		this.targets.push(new Target(42, 12.5,"Rome","Italy", "Latium"));
		this.targets.push(new Target(42, 12.5,"Vatican City","Holy See"));
		this.targets.push(new Target(60.25, 25,"Helsinki","Finland", "Uusimaa"));
		this.targets.push(new Target(66.5, 25.75,"Rovaniemi","Finland", "Lapland"));
		this.targets.push(new Target(59.5, 18,"Stockholm","Sweden"));
		this.targets.push(new Target(57.75, 12,"Gothenburg","Sweden"));
		this.targets.push(new Target(60,10.75,"Oslo","Norway", "Eastern Norway"));
		this.targets.push(new Target(67.25,14.5,"Bodø","Norway", "Nordland"));
		this.targets.push(new Target(49, 2.5,"Paris","France"));
		this.targets.push(new Target(48.25, 11.5,"Munich","Germany","Bavaria"));
		this.targets.push(new Target(51.5,-2.5,"Bristol","United Kingdom"));
		this.targets.push(new Target(53.5,-3,"Liverpool","United Kingdom","Merseyside"));
		this.targets.push(new Target(53.5,-2.25,"Manchester","United Kingdom"));
		this.targets.push(new Target(55,-1.5,"Newcastle upon Tyne","United Kingdom","Tyne and Wear"));
		this.targets.push(new Target(64.25,-22,"Reykjavík","Iceland","Höfuðborgarsvæðið"));
		this.targets.push(new Target(47.25, 8.5,"Zürich","Switzerland"));
		this.targets.push(new Target(54.75, 56,"Ufa","Russia","Bashkortostan"));
		this.targets.push(new Target(55.75, 37.5,"Moscow","Russia"));
		this.targets.push(new Target(60, 30.25,"Saint Petersburg","Russia"));
		this.targets.push(new Target(55, 83,"Novosibirsk","Russia"));
		this.targets.push(new Target(57, 60.5,"Yekaterinburg","Russia","Sverdlovsk"));
		this.targets.push(new Target(43, 132,"Vladivostok","Russia","Primorsky"));
		this.targets.push(new Target(62, 129.75,"Yakutsk","Russia","Sakha Rep."));

		this.targets.push(new Target(40.5, -3.5,"Madrid","Spain"));
		this.targets.push(new Target(78.25, 15.5, "Longyearbyen", "Norway","Svalbard"))

		this.targets.push(new Target(52.5,5,"Amsterdam","The Netherlands","North Holland"));
		this.targets.push(new Target(52,4.25,"The Hague","The Netherlands","South Holland"));
		this.targets.push(new Target(42.5,1.5,"Andorra la Vella","Andorra"));
		this.targets.push(new Target(52.5,13.5,"Berlin","Germany"));
		this.targets.push(new Target(53.5,10,"Hamburg","Germany"));
		this.targets.push(new Target(50,8.75,"Frankfurt am Main","Germany","Hesse"));
		this.targets.push(new Target(47,7.5,"Bern","Switzerland"));
		this.targets.push(new Target(51,4.25,"Brussels","Belgium"));
		this.targets.push(new Target(44.5,26,"Bucharest","Romania"));
		this.targets.push(new Target(47.5,19,"Budapest","Hungary"));
		this.targets.push(new Target(47,29,"Chișinău","Moldova"));
		this.targets.push(new Target(55.75,12.5,"Copenhagen","Denmark"));
		this.targets.push(new Target(53.25,-6.25,"Dublin","Ireland","Leinster"));
		this.targets.push(new Target(52,-8.5,"Cork","Ireland","Munster"));
		this.targets.push(new Target(50.5,30.5,"Kyiv","Ukraine"));
		this.targets.push(new Target(38.75,-9.25,"Lisbon","Portugal"));
		this.targets.push(new Target(41.25,-8.5,"Porto","Portugal","Norte"));
		this.targets.push(new Target(46.25,14.5,"Ljubljana","Slovenia")); //+0.25 N
		this.targets.push(new Target(51.5,0,"City of London","United Kingdom","Greater London"));
		this.targets.push(new Target(49.75,6,"Luxembourg City","Luxembourg")); //+0.25 N

		this.targets.push(new Target(53.75,27.5,"Minsk","Belarus"));
		this.targets.push(new Target(43.75,7.5,"Monte Carlo","Monaco"));
		this.targets.push(new Target(42.5,19.25,"Podgorica","Montenegro"));
		this.targets.push(new Target(57, 24,"Riga","Latvia"));
		this.targets.push(new Target(44,12.5,"San Marino","San Marino"));
		this.targets.push(new Target(44,18.5,"Sarajevo","Bosnia and Herzegovina"));
		this.targets.push(new Target(42,21.5,"Skopje","North Macedonia"));
		this.targets.push(new Target(42.75,23.25,"Sofia","Bulgaria"));
		this.targets.push(new Target(59.5,24.75,"Tallinn","Estonia","Harju"));
		this.targets.push(new Target(47,9.75,"Vaduz","Liechtenstein")); //+0.25 E
		this.targets.push(new Target(36,14.5,"Valletta","Malta","South Eastern"));
		this.targets.push(new Target(54.75,25.25,"Vilnius","Lithuania"));
		this.targets.push(new Target(45.75,16,"Zagreb","Croatia"));
		this.targets.push(new Target(42.75,21.25,"Pristina","Kosovo"));
		this.targets.push(new Target(56,-3.25,"Edinburgh","United Kingdom","Scotland"));
		this.targets.push(new Target(54.5,-5.75,"Belfast","United Kingdom","Northern Ireland")); //-0.25 W
		this.targets.push(new Target(51.5,-3,"Cardiff","United Kingdom","Wales"));

		this.targets.push(new Target(38.25,13.5,"Palermo","Italy","Sicily"));
		this.targets.push(new Target(45,7.75,"Turin","Italy","Piedmont"));
		this.targets.push(new Target(45.5,9.25,"Milan","Italy","Lombardy"));
		this.targets.push(new Target(41,17,"Bari","Italy"));
		this.targets.push(new Target(42,8.75,"Ajaccio","France","Corsica"));
		this.targets.push(new Target(45.75,4.75,"Lyon","France","Auvergne-Rhône-Alpes"));
		this.targets.push(new Target(47.25,-1.5,"Nantes","France","Pays de la Loire"));
		this.targets.push(new Target(43.25,5.25,"Marseille","France","Alpes-Côte d'Azur"));
		this.targets.push(new Target(41.5,2.25,"Barcelona","Spain","Catalonia"));
		this.targets.push(new Target(37.5,-6,"Seville","Spain","Andalusia"));
		this.targets.push(new Target(43.25,-3,"Bilbao","Spain","Basque Country"));
		this.targets.push(new Target(39.5,-0.25,"Valencia","Spain","Basque Country"));
	}

	loadAfrica()
	{
		this.targets.push(new Target(13.5,2,"Niamey","Niger"));
		this.targets.push(new Target(2,45.5,"Mogadishu","Somalia"));
		this.targets.push(new Target(-19,47.5,"Antananarivo","Madagascar","Analamanga"));
		this.targets.push(new Target(-34,18.5,"Cape Town","South Africa","Western Cape"));
		this.targets.push(new Target(-25.75,28.25,"Pretoria","South Africa","Western Cape"));
		this.targets.push(new Target(-26.25,28,"Johannesburg","South Africa","Gauteng"));
		this.targets.push(new Target(33.5,-7.5,"Casablanca","Morocco","Casablanca-Settat"));
		this.targets.push(new Target(37,10.25,"Tunis","Tunisia"));
		this.targets.push(new Target(5,31.5,"Juba","South Sudan"));
		this.targets.push(new Target(12,15,"N'Djamena","Chad"));
		this.targets.push(new Target(-6.25, 35.75,"Dodoma","Tanzania"));
		this.targets.push(new Target(-7,39.25,"Dar es Salaam","Tanzania"));
		this.targets.push(new Target(-20,57.5,"Port Louis","Mauritius"));
		this.targets.push(new Target(-21,55.5,"Saint-Denis","Reunion"));
		this.targets.push(new Target(-14,33.75,"Lilongwe","Malawi","Central"));
		this.targets.push(new Target(4,11.5,"Yaoundé","Cameroon","Central"));
		this.targets.push(new Target(30,31,"Gisa","Egypt"));
		this.targets.push(new Target(30,31.25,"Cairo","Egypt"));
		this.targets.push(new Target(24,33,"Asuan","Egypt"));
		this.targets.push(new Target(-4.25,15.25,"Brazzaville","Congo"));

		this.targets.push(new Target(36.75,3,"Algiers","Algeria"));
		this.targets.push(new Target(22.75,5.5,"Tamanrasset","Algeria"));
		this.targets.push(new Target(33,13.25,"Tripoli","Libya","Tripolitania"));
		this.targets.push(new Target(12.75,-8,"Bamako","Mali"));
		this.targets.push(new Target(4.25,18.75,"Bangi","Central African Republic")); //+0.25 E
		this.targets.push(new Target(15.5,32.5,"Khartoum","Sudan"));
		this.targets.push(new Target(18,-16,"Nouakchott","Mauritania"));

		this.targets.push(new Target(9,7.5,"Abuja","Nigeria"));
		this.targets.push(new Target(9.5,-13.75,"Conakry","Guinea"));
		this.targets.push(new Target(11.75,-15.5,"Bissau","Guinea-Bissau"));
		this.targets.push(new Target(9,38.75,"Addis Ababa","Ethiopia"));
		this.targets.push(new Target(14.75,-17.5,"Dakar","Senegal"));
		this.targets.push(new Target(12.5,-1.5,"Ouagadougou","Burkina Faso","Centre"));

		this.targets.push(new Target(15.25,39,"Asmara","Eritrea","Central"));
		this.targets.push(new Target(5.5,-0.25,"Accra","Ghana"));
		this.targets.push(new Target(13.5,-16.5,"Banjul","Gambia"));
		this.targets.push(new Target(11.5,43.25,"Djibouti City","Djibouti"));
		this.targets.push(new Target(8.5,-13.25,"Freetown","Sierra Leone","Western Area"));
		this.targets.push(new Target(-24.75,26,"Gaborone","Botswana"));
		this.targets.push(new Target(-3.5,30,"Gitega","Burundi"));
		this.targets.push(new Target(-17.75,31,"Harare","Zimbabwe"));
		this.targets.push(new Target(0.25,32.5,"Kampala","Uganda"));
		this.targets.push(new Target(-2,30,"Kigali","Rwanda"));

		this.targets.push(new Target(0.5,9.5,"Libreville","Gabon","Estuaire"));
		this.targets.push(new Target(6,1.25,"Lomé","Togo","Maritime"));
		this.targets.push(new Target(-8.75,13.25,"Luanda","Angola"));
		this.targets.push(new Target(-15.5,28.25,"Lusaka","Zambia"));
		this.targets.push(new Target(3.75,8.75,"Malabo","Equatorial Guinea","Bioko Norte"));
		this.targets.push(new Target(-26,32.5,"Maputo","Mozambique"));
		this.targets.push(new Target(-29.5,27.75,"Maseru","Lesotho"));
		this.targets.push(new Target(-26.25,31.25,"Mbabane","Eswatini"));
		this.targets.push(new Target(6.25,-10.75,"Monrovia","Liberia"));
		this.targets.push(new Target(-11.75,43.25,"Moroni","Comoros","Grande Comore"));
		this.targets.push(new Target(-1.25,36.75,"Nairobi","Kenya"));
		this.targets.push(new Target(-4.5,15.25,"Kinshasa","Democratic Rep. of the Congo"));
		this.targets.push(new Target(0.5,25.25,"Kisangani","Democratic Rep. of the Congo"));

		this.targets.push(new Target(6.5,2.5,"Porto-Novo","Benin","Ouémé"));
		this.targets.push(new Target(15,-23.5,"Praia","Cape Verde","Santiago"));
		this.targets.push(new Target(34,-6.75,"Rabat","Morocco"));
		this.targets.push(new Target(0.25,6.75,"São Tomé","São Tomé and Príncipe"));
		this.targets.push(new Target(-4.5,55.5,"Victoria","Seychelles","Mahé"));
		this.targets.push(new Target(-22.5,17,"Windhoek","Namibia","Khomas"));
		this.targets.push(new Target(6.75,-5.25,"Yamoussoukro","Côte d'Ivoire"));
	}
	loadAsia()
	{
		this.targets.push(new Target(51, 71.5,"Astana","Kazakhstan"));
		this.targets.push(new Target(50.25, 57.25,"Aktobe","Kazakhstan"));
		this.targets.push(new Target(43, 74.5,"Bishkek","Kyrgyzstan"));
		this.targets.push(new Target(38.5, 68.75,"Dushanbe","Tajikistan"));
		this.targets.push(new Target(41.25, 69.25,"Tashkent","Uzbekistan"));
		this.targets.push(new Target(41, 29,"Istanbul","Turkey"));
		this.targets.push(new Target(41.75, 44.75,"Tbilisi","Georgia"));
		this.targets.push(new Target(40, 44.5,"Yerevan","Armenia"));
		this.targets.push(new Target(40.5, 50,"Baku","Azerbaijan"));
		this.targets.push(new Target(33.5, 44.5,"Baghdad","Iraq"));
		this.targets.push(new Target(38, 58.5,"Ashgabat","Turkmenistan"));
		this.targets.push(new Target(35.75, 51.5,"Tehran","Iran"));
		this.targets.push(new Target(29.5, 52.5,"Shiraz","Iran","Fars"));
		this.targets.push(new Target(34.5, 69,"Kabul","Afghanistan"));
		this.targets.push(new Target(25, 67,"Karachi","Pakistan","Sindh"));
		this.targets.push(new Target(23.5, 58.5,"Muscat","Oman"));
		this.targets.push(new Target(28.5, 77,"New Delhi","India","Delhi"));
		this.targets.push(new Target(24.5, 85,"Bodh Gaya","India","Bihar"));
		this.targets.push(new Target(19, 73,"Mumbai","India","Maharashtra"));
		this.targets.push(new Target(17.5, 78.5,"Hyderabad","India","Telangana"));
		this.targets.push(new Target(22.5, 88.25,"Kolkata","India","West Bengal"));
		this.targets.push(new Target(13, 77.5,"Bangalore","India","Karnataka"));

		this.targets.push(new Target(27.5, 89.75,"Thimphu","Bhutan"));
		this.targets.push(new Target(16.75, 96,"Yangon","Myanmar"));
		this.targets.push(new Target(48, 107,"Ulaanbaatar","Mongolia"));
		this.targets.push(new Target(29.5, 106.5,"Chongqing","China","Yuzhong"));
		this.targets.push(new Target(31, 121.5,"Shanghai","China"));
		this.targets.push(new Target(40, 116.5,"Beijing","China"));
		this.targets.push(new Target(36, 103.75,"Lanzhou","China","Gansu"));
		this.targets.push(new Target(43.75, 87.5,"Ürümqi","China","Xinjiang Uygur AR / East Turkestan"));
		this.targets.push(new Target(22.25, 114.25,"Hong Kong", "China","SAR"));
		this.targets.push(new Target(22.25, 113.5,"Macau","China","SAR"));
		this.targets.push(new Target(29.5, 91,"Lhasa","China","Tibet AR"));

		this.targets.push(new Target(1.25, 104,"Singapore","Singapore"));
		this.targets.push(new Target(-6.25, 107,"Jakarta","Indonesia"));
		this.targets.push(new Target(-5.25, 119.5,"Makassar","Indonesia","Sulawesi"));
		this.targets.push(new Target(-0.5, 117.25,"Samarinda","Indonesia","East Kalimantan"));
		this.targets.push(new Target(3.5, 98.75,"Medan","Indonesia","North Sumatra"));
		this.targets.push(new Target(-2.5, 140.75,"Jayapura","Indonesia","Papua"));
		this.targets.push(new Target(35.5, 140,"Tokyo","Japan"));
		this.targets.push(new Target(43, 141.25,"Sapporo","Japan","Hokkaido"));
		this.targets.push(new Target(33.5, 130.5,"Fukuoka","Japan","Kyushu"));
		this.targets.push(new Target(34.75, 135.75,"Osaka","Japan","Kansai"));

		this.targets.push(new Target(39,125.75,"Pyongyang","North Korea"));
		this.targets.push(new Target(37.5,127,"Seoul","South Korea"));
		this.targets.push(new Target(35.25,129,"Busan","South Korea","Yeongnam"));
		this.targets.push(new Target(25,121.5,"Taipei","Republic of China","Taiwan"));
		this.targets.push(new Target(23.75,90.25,"Dhaka","Bangladesh"));
		this.targets.push(new Target(33.75,73,"Islamabad","Pakistan"));
		this.targets.push(new Target(27.75,85.25,"Kathmandu","Nepal","Bagmati"));
		this.targets.push(new Target(4.25,73.5,"Malé","Maldives"));
		this.targets.push(new Target(7,80,"Sri Jayawardenepura Kotte","Sri Lanka","Western"));
		this.targets.push(new Target(4.75,115,"Bandar Seri Begawan","Brunei"));
		this.targets.push(new Target(13.75,100.5,"Bangkok","Thailand"));

		this.targets.push(new Target(-8.75,125.5,"Dili","East Timor")); //-0.25 S
		this.targets.push(new Target(21,105.75,"Hanoi","Vietnam","Red River Delta"));
		this.targets.push(new Target(3.25,101.75,"Kuala Lumpur","Malaysia"));
		this.targets.push(new Target(14.5,121,"Manila","Philippines"));
		this.targets.push(new Target(7,125.5,"Davao","Philippines"));
		this.targets.push(new Target(19.75,96,"Naypyidaw","Myanmar"));
		this.targets.push(new Target(11.5,105,"Phnom Penh","Cambodia"));
		this.targets.push(new Target(18,102.5,"Vientiane","Laos"));
		
		this.targets.push(new Target(24.5,54.25,"Abu Dhabi","United Arab Emirates"));
		this.targets.push(new Target(32,36,"Amman","Jordan"));
		this.targets.push(new Target(40,33,"Ankara","Turkey","Central Anatolia"));
		this.targets.push(new Target(40,41.25,"Erzurum","Turkey"));
		this.targets.push(new Target(34,35.5,"Beirut","Lebanon"));
		this.targets.push(new Target(33.5,36.25,"Damascus","Syria"));
		this.targets.push(new Target(25.25,51.5,"Doha","Qatar"));
		this.targets.push(new Target(31.75,35.25,"Jerusalem",""));
		this.targets.push(new Target(32,34.75,"Tel Aviv","Israel"));
		this.targets.push(new Target(32,35.5,"Jericho","Palestine"));
		this.targets.push(new Target(29.25,48,"Kuwait City","Kuwait"));
		this.targets.push(new Target(26.25,50.5,"Manama","Bahrain"));
		this.targets.push(new Target(24.5,46.75,"Riyadh","Saudi Arabia"));
		this.targets.push(new Target(15.25,44.25,"Sana'a","Yemen"));
		this.targets.push(new Target(35.25,33.5,"Nicosia","Republic of Cyprus"));
	}

	loadOceania()
	{
		this.targets.push(new Target(-37, 174.75,"Auckland","New Zealand"));
		this.targets.push(new Target(-43.5, 172.75,"Christchurch","New Zealand","Canterbury"));
		this.targets.push(new Target(-41.25, 174.75,"Wellington","New Zealand"));

		this.targets.push(new Target(-32, 116.25,"Perth","Australia","Western Australia"));
		this.targets.push(new Target(-18, 122.25,"Broome","Australia","Western Australia"));
		this.targets.push(new Target(-34, 151.25,"Sydney","Australia","New South Wales"));
		this.targets.push(new Target(-35.25, 149,"Canberra","Australia","Capital Territory"));
		this.targets.push(new Target(-23.75, 134,"Alice Springs","Australia","Northern Territory"));
		this.targets.push(new Target(-37.75, 145,"Melbourne","Australia","Victoria"));
		this.targets.push(new Target(-19.25, 146.75,"Tonwsville","Australia","Queensland"));
		this.targets.push(new Target(-43, 147.25,"Hobart","Australia","Tasmania"));
		this.targets.push(new Target(-27.5, 153,"Brisbane","Australia","Queensland"));
		this.targets.push(new Target(-35, 138.5,"Adelaide","Australia","South Australia"));
		this.targets.push(new Target(-43, 147.25,"Hobart","Australia","Tasmania"));

		this.targets.push(new Target(-9.5, 147.25, "Port Moresby", "Papua New Guinea"));
		this.targets.push(new Target(-18.25, 178.5,"Suva","Fiji","Central"));
		this.targets.push(new Target(1.25,173,"South Tarawa","Kiribati"));
		this.targets.push(new Target(-9.5,160,"Honiara","Solomon Islands"));
		this.targets.push(new Target(-21.25,-175.25,"Nuku'alofa","Tonga","Tongatapu"));
		this.targets.push(new Target(-8.5,179.25,"Funafuti","Tuvalu"));
		this.targets.push(new Target(-0.5,167,"Yaren","Nauru"));
		this.targets.push(new Target(7,171.25,"Majuro","Marshall Islands","Ratak Chain"));
		this.targets.push(new Target(-17.75,168.25,"Port Vila","Vanuatu","Shefa"));
		this.targets.push(new Target(7.5,134.75,"Ngerulmud","Palau","Melekeok"));
		this.targets.push(new Target(-13.75,-171.75,"Apia","Samoa","Tuamasaga"));
		this.targets.push(new Target(7,158.25,"Palikir","Micronesia","Pohnpei"));

		this.targets.push(new Target(21.25, -157.75,"Honolulu","USA","Hawaii"));
		this.targets.push(new Target(-22.25, 166.5,"Nouméa","New Caledonia"));
	}


	loadTargets(){
		this.loadNorthAmerica();
		this.loadSouthAmerica();
		this.loadAfrica();
		this.loadEurope();
		this.loadAsia();
		this.loadOceania();
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
		return levelArray.slice(0, levelCount);
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
		console.log(ctxPos);
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
		this.gameStateElement = document.querySelector('.game-state');
		this.gameStartBtn = this.mainMenuElement.querySelector('#start-game-btn');
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
		console.log("x: ",this.clickedPoint.x);
		console.log("y: ",this.clickedPoint.y);
		console.log("DIFF X: ",Math.abs(this.clickedPoint.x - point.x));
		console.log("DIFF Y: ",Math.abs(this.clickedPoint.y - point.y));
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
			console.log(cursorPoint.x, cursorPoint.y);
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

	handleStart(e){
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
		this.mainMenuElement.style.height = `${this.canvasMap.height}px`;
		[this.mainMenuElement,this.gameStateElement,this.gameTitleElement].forEach((el) => {
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

