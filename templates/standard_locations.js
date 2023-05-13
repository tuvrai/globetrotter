class StandardLocations
{
    static LoadNorthAmerica()
    {
        const targets = [];
        targets.push(new Target(64.25, -51.75,"Nuuk","Greenland"));
        targets.push(new Target(15.25, -61.5,"Roseau","Dominica", this.capitalCityFlag));
        targets.push(new Target(10.5, -61.5,"Port of Spain","Trinidad and Tobago", this.capitalCityFlag));

        targets.push(new Target(34, -118,"Los Angeles","USA","California"));
        targets.push(new Target(36.25, -115.25,"Las Vegas","USA","Nevada"));
        targets.push(new Target(43.5, -116.25,"Boise","USA","Idaho"));
        targets.push(new Target(32.75, -96.75,"Dallas","USA","Texas"));
        targets.push(new Target(41.25, -96,"Omaha","USA","Nebraska"));
        targets.push(new Target(38.25, -85.75,"Louisville","USA","Kentucky"));
        targets.push(new Target(41.75, -87.75,"Chicago","USA","Illinois"));
        targets.push(new Target(40.75, -74,"New York","USA","New York"));
        targets.push(new Target(39, -77,"Washington, D.C.","USA", this.capitalCityFlag));
        targets.push(new Target(25.75, -80.25,"Miami","USA","Florida"));
        targets.push(new Target(35, -85.25,"Chattanooga","USA","Tennessee"));
        targets.push(new Target(58.25, -134.5,"Juneau","USA","Alaska"));
        targets.push(new Target(61.25, -150,"Anchorage","USA","Alaska"));

        targets.push(new Target(43.5, -79.5,"Toronto","Canada","Ontario"));
        targets.push(new Target(45.5, -75.75,"Ottawa","Canada","Ontario", this.capitalCityFlag));
        targets.push(new Target(45.5, -73.5,"Montreal","Canada","Quebec"));
        targets.push(new Target(53.5, -113.5,"Edmonton","Canada","Alberta"));
        targets.push(new Target(49.25, -123,"Vancouver","Canada","British Columbia"));
        targets.push(new Target(47.5, -52.75,"St. John's","Canada","Newfoundland"));
        targets.push(new Target(82.5,-62.5,"Alert","Canada","Nunavut"));

        targets.push(new Target(19.5, -99,"Ciudad de México","Mexico", this.capitalCityFlag));
        targets.push(new Target(24,-110.25,"La Paz","Mexico","Baja California Sur"));
        targets.push(new Target(25.75, -100.25,"Monterrey","Mexico","Nuevo León"));
        targets.push(new Target(21, -89.5,"Mérida","Mexico", "Yucatán"));
        targets.push(new Target(31.75, -106.5,"Ciudad Juárez","Mexico", "Chihuahua"));
        targets.push(new Target(20.75, -103.25,"Guadalajara","Mexico", "Jalisco"));

        targets.push(new Target(23, -82.25, "Havana", "Cuba", this.capitalCityFlag));
        targets.push(new Target(9, -79.5, "Panama City", "Panama", this.capitalCityFlag));
        targets.push(new Target(10, -84, "San José", "Costa Rica", this.capitalCityFlag));
        targets.push(new Target(17.25, -88.75, "Belmopan", "Belize","Cayo", this.capitalCityFlag));
        targets.push(new Target(12, -86.25,"Managua","Nicaragua", this.capitalCityFlag));
        targets.push(new Target(13.75, -89.25, "San Salvador", "El Salvador", this.capitalCityFlag));
        targets.push(new Target(14, -87.25, "Tegucigalpa", "Honduras", "Francisco Morazán", this.capitalCityFlag));
        targets.push(new Target(14.5, -90.5, "Guatemala City", "Guatemala", this.capitalCityFlag));

        targets.push(new Target(18.25, -66, "San Juan", "Puerto Rico"));
        targets.push(new Target(18.5, -72.25, "Port-au-Prince", "Haiti", "Ouest", this.capitalCityFlag));
        targets.push(new Target(18.5, -70, "Santo Domingo", "Dominican Republic", "National", this.capitalCityFlag));
        targets.push(new Target(18, -76.75, "Kingston", "Jamaica","Surrey", this.capitalCityFlag));
        targets.push(new Target(13, -61.25, "Kingstown", "Saint Vincent and the Grenadines", this.capitalCityFlag));
        targets.push(new Target(25, -77.25, "Nassau", "Bahamas","New Providence", this.capitalCityFlag));
        targets.push(new Target(12.25, -69, "Willemstad", "Curaçao"));
        
        targets.push(new Target(17.25,-62.75,"Basseterre","Saint Kitts and Nevis", this.capitalCityFlag));
        targets.push(new Target(13,-59.5,"Bridgetown","Barbados","St Michael", this.capitalCityFlag));
        targets.push(new Target(14,-61,"Castries","Saint Lucia", this.capitalCityFlag));
        targets.push(new Target(12,-61.75,"St. George's","Grenada", this.capitalCityFlag));
        targets.push(new Target(17,-62,"St. John's","Antigua and Barbuda", this.capitalCityFlag));

        return targets;
    }

    static LoadSouthAmerica()
    {
        const targets = [];
        targets.push(new Target(6.75, -58,"Georgetown","Guyana","Demerara-Mahaica", this.capitalCityFlag));
		targets.push(new Target(10.5, -67,"Caracas","Venezuela", this.capitalCityFlag));
		targets.push(new Target(10.75, -71.75,"Maracaibo","Venezuela","Zulia"));
		targets.push(new Target(4.5, -74,"Bogota","Colombia", this.capitalCityFlag));
		targets.push(new Target(11, -74.75,"Baranquilla","Colombia","Atlántico"));
		targets.push(new Target(6.25, -75.5,"Medellín","Colombia","Antioquia"));
		targets.push(new Target(-0.25, -78.5,"Quito","Ecuador", this.capitalCityFlag));
		targets.push(new Target(-2.25, -80,"Guayaquil","Ecuador","Guayas"));
		targets.push(new Target(-12, -77,"Lima","Peru", this.capitalCityFlag));
		targets.push(new Target(-3.75, -73.25,"Iquitos","Peru","Loreto"));
		targets.push(new Target(-33.5, -70.75,"Santiago","Chile","Magallanes", this.capitalCityFlag));
		targets.push(new Target(-53.25, -71,"Punta Arenas","Chile","Magallanes"));
		targets.push(new Target(-15.75, -48,"Brasilia","Brazil","Central-West", this.capitalCityFlag));
		targets.push(new Target(-3.75, -38.5,"Fortaleza","Brazil","Ceará"));
		targets.push(new Target(-23, -43.25,"Rio de Janeiro","Brazil"));
		targets.push(new Target(-13, -38.5,"Salvador","Brazil","Bahia"));
		targets.push(new Target(-3, -60,"Manaus","Brazil","Amazonas"));
		targets.push(new Target(-23.5, -46.75,"São Paulo","Brazil"));
		targets.push(new Target(-25.25, -57.5,"Asuncion","Paraguay", this.capitalCityFlag));
		targets.push(new Target(-34.75, -58.5,"Buenos Aires","Argentina", this.capitalCityFlag));
		targets.push(new Target(-31.5, -64.25,"Córdoba","Argentina"));
		targets.push(new Target(-46, -67.5,"Comodoro Rivadavia","Argentina","Chubut"));
		targets.push(new Target(-34.75, -56.25,"Montevideo","Uruguay", this.capitalCityFlag));
		targets.push(new Target(5, -52.25,"Cayenne","French Guiana"));
		targets.push(new Target(5.75, -55.25,"Paramaribo","Suriname", this.capitalCityFlag));
		targets.push(new Target(-16.5, -68.25,"La Paz","Bolivia"));
		targets.push(new Target(-19, -65.25,"Sucre","Bolivia","Chuquisaca"));
		targets.push(new Target(-51.75, -58,"Stanley","Falkland Islands"));
		targets.push(new Target(-27.25, -109.5,"Easter Island","Chile"));
        return targets;
    }

    static LoadEurope()
    {
        const targets = [];
        targets.push(new Target(50.25,19,"Katowice","Poland","Silesian"));
		targets.push(new Target(54.5,18.5,"Gdańsk","Poland","Pomeranian"));
		targets.push(new Target(52.25,21,"Warsaw","Poland","Masovian", this.capitalCityFlag));
		targets.push(new Target(53.5,14.5,"Szczecin","Poland","West Pomeranian"));
		targets.push(new Target(48,17,"Bratislava","Slovakia", this.capitalCityFlag));
		targets.push(new Target(48.25,16.5,"Vienna","Austria", this.capitalCityFlag));
		targets.push(new Target(50,14.5,"Prague","Czechia", this.capitalCityFlag));
		targets.push(new Target(48,37.5,"Donetsk","Ukraine"));
		targets.push(new Target(41.25,19.75,"Tirane","Albania", this.capitalCityFlag));
		targets.push(new Target(44.75, 20.5,"Belgrade","Serbia", this.capitalCityFlag));
		targets.push(new Target(38, 23.75,"Athens","Greece", "Attica", this.capitalCityFlag));
		targets.push(new Target(40, 22.25,"Mount Olympus","Greece", "Thessaly/Macedonia border"));
		targets.push(new Target(42, 12.5,"Rome","Italy", "Latium", this.capitalCityFlag));
		targets.push(new Target(42, 12.5,"Vatican City","Holy See", this.capitalCityFlag));
		targets.push(new Target(60.25, 25,"Helsinki","Finland", "Uusimaa", this.capitalCityFlag));
		targets.push(new Target(66.5, 25.75,"Rovaniemi","Finland", "Lapland"));
		targets.push(new Target(59.5, 18,"Stockholm","Sweden", this.capitalCityFlag));
		targets.push(new Target(57.75, 12,"Gothenburg","Sweden"));
		targets.push(new Target(60,10.75,"Oslo","Norway", "Eastern Norway", this.capitalCityFlag));
		targets.push(new Target(67.25,14.5,"Bodø","Norway", "Nordland"));
		targets.push(new Target(49, 2.5,"Paris","France", this.capitalCityFlag));
		targets.push(new Target(48.25, 11.5,"Munich","Germany","Bavaria"));
		targets.push(new Target(51.5,-2.5,"Bristol","United Kingdom"));
		targets.push(new Target(53.5,-3,"Liverpool","United Kingdom","Merseyside"));
		targets.push(new Target(53.5,-2.25,"Manchester","United Kingdom"));
		targets.push(new Target(55,-1.5,"Newcastle upon Tyne","United Kingdom","Tyne and Wear"));
		targets.push(new Target(64.25,-22,"Reykjavík","Iceland","Höfuðborgarsvæðið", this.capitalCityFlag));
		targets.push(new Target(47.25, 8.5,"Zürich","Switzerland"));
		targets.push(new Target(54.75, 56,"Ufa","Russia","Bashkortostan"));
		targets.push(new Target(55.75, 37.5,"Moscow","Russia", this.capitalCityFlag));
		targets.push(new Target(60, 30.25,"Saint Petersburg","Russia"));
		targets.push(new Target(55, 83,"Novosibirsk","Russia"));
		targets.push(new Target(57, 60.5,"Yekaterinburg","Russia","Sverdlovsk"));
		targets.push(new Target(43, 132,"Vladivostok","Russia","Primorsky"));
		targets.push(new Target(62, 129.75,"Yakutsk","Russia","Sakha Rep."));

		targets.push(new Target(40.5, -3.5,"Madrid","Spain", this.capitalCityFlag));
		targets.push(new Target(78.25, 15.5, "Longyearbyen", "Norway","Svalbard"))

		targets.push(new Target(52.5,5,"Amsterdam","The Netherlands","North Holland", this.capitalCityFlag));
		targets.push(new Target(52,4.25,"The Hague","The Netherlands","South Holland"));
		targets.push(new Target(42.5,1.5,"Andorra la Vella","Andorra", this.capitalCityFlag));
		targets.push(new Target(52.5,13.5,"Berlin","Germany", this.capitalCityFlag));
		targets.push(new Target(53.5,10,"Hamburg","Germany"));
		targets.push(new Target(50,8.75,"Frankfurt am Main","Germany","Hesse"));
		targets.push(new Target(47,7.5,"Bern","Switzerland", this.capitalCityFlag));
		targets.push(new Target(51,4.25,"Brussels","Belgium", this.capitalCityFlag));
		targets.push(new Target(44.5,26,"Bucharest","Romania", this.capitalCityFlag));
		targets.push(new Target(47.5,19,"Budapest","Hungary", this.capitalCityFlag));
		targets.push(new Target(47,29,"Chișinău","Moldova", this.capitalCityFlag));
		targets.push(new Target(55.75,12.5,"Copenhagen","Denmark", this.capitalCityFlag));
		targets.push(new Target(53.25,-6.25,"Dublin","Ireland","Leinster", this.capitalCityFlag));
		targets.push(new Target(52,-8.5,"Cork","Ireland","Munster"));
		targets.push(new Target(50.5,30.5,"Kyiv","Ukraine", this.capitalCityFlag));
		targets.push(new Target(38.75,-9.25,"Lisbon","Portugal", this.capitalCityFlag));
		targets.push(new Target(41.25,-8.5,"Porto","Portugal","Norte"));
		targets.push(new Target(46.25,14.5,"Ljubljana","Slovenia", this.capitalCityFlag)); //+0.25 N
		targets.push(new Target(51.5,0,"City of London","United Kingdom","Greater London", this.capitalCityFlag));
		targets.push(new Target(49.75,6,"Luxembourg City","Luxembourg", this.capitalCityFlag)); //+0.25 N

		targets.push(new Target(53.75,27.5,"Minsk","Belarus", this.capitalCityFlag));
		targets.push(new Target(43.75,7.5,"Monaco City","Monaco", this.capitalCityFlag));
		targets.push(new Target(42.5,19.25,"Podgorica","Montenegro", this.capitalCityFlag));
		targets.push(new Target(57, 24,"Riga","Latvia", this.capitalCityFlag));
		targets.push(new Target(44,12.5,"San Marino","San Marino", this.capitalCityFlag));
		targets.push(new Target(44,18.5,"Sarajevo","Bosnia and Herzegovina", this.capitalCityFlag));
		targets.push(new Target(42,21.5,"Skopje","North Macedonia", this.capitalCityFlag));
		targets.push(new Target(42.75,23.25,"Sofia","Bulgaria", this.capitalCityFlag));
		targets.push(new Target(59.5,24.75,"Tallinn","Estonia","Harju", this.capitalCityFlag));
		targets.push(new Target(47,9.75,"Vaduz","Liechtenstein", this.capitalCityFlag)); //+0.25 E
		targets.push(new Target(36,14.5,"Valletta","Malta","South Eastern", this.capitalCityFlag));
		targets.push(new Target(54.75,25.25,"Vilnius","Lithuania", this.capitalCityFlag));
		targets.push(new Target(45.75,16,"Zagreb","Croatia", this.capitalCityFlag));
		targets.push(new Target(42.75,21.25,"Pristina","Kosovo", this.capitalCityFlag));
		targets.push(new Target(56,-3.25,"Edinburgh","United Kingdom","Scotland"));
		targets.push(new Target(54.5,-5.75,"Belfast","United Kingdom","Northern Ireland")); //-0.25 W
		targets.push(new Target(51.5,-3,"Cardiff","United Kingdom","Wales"));

		targets.push(new Target(38.25,13.5,"Palermo","Italy","Sicily"));
		targets.push(new Target(45,7.75,"Turin","Italy","Piedmont"));
		targets.push(new Target(45.5,9.25,"Milan","Italy","Lombardy"));
		targets.push(new Target(41,17,"Bari","Italy"));
		targets.push(new Target(42,8.75,"Ajaccio","France","Corsica"));
		targets.push(new Target(45.75,4.75,"Lyon","France","Auvergne-Rhône-Alpes"));
		targets.push(new Target(47.25,-1.5,"Nantes","France","Pays de la Loire"));
		targets.push(new Target(43.25,5.25,"Marseille","France","Alpes-Côte d'Azur"));
		targets.push(new Target(41.5,2.25,"Barcelona","Spain","Catalonia"));
		targets.push(new Target(37.5,-6,"Seville","Spain","Andalusia"));
		targets.push(new Target(43.25,-3,"Bilbao","Spain","Basque Country"));
		targets.push(new Target(39.5,-0.25,"Valencia","Spain","Basque Country"));
        return targets;
    }

    static LoadAfrica()
    {
        const targets = [];
        targets.push(new Target(13.5,2,"Niamey","Niger", this.capitalCityFlag));
		targets.push(new Target(2,45.5,"Mogadishu","Somalia", this.capitalCityFlag));
		targets.push(new Target(-19,47.5,"Antananarivo","Madagascar","Analamanga", this.capitalCityFlag));
		targets.push(new Target(-34,18.5,"Cape Town","South Africa","Western Cape"));
		targets.push(new Target(-25.75,28.25,"Pretoria","South Africa","Western Cape", this.capitalCityFlag));
		targets.push(new Target(-26.25,28,"Johannesburg","South Africa","Gauteng"));
		targets.push(new Target(33.5,-7.5,"Casablanca","Morocco","Casablanca-Settat"));
		targets.push(new Target(37,10.25,"Tunis","Tunisia", this.capitalCityFlag));
		targets.push(new Target(5,31.5,"Juba","South Sudan", this.capitalCityFlag));
		targets.push(new Target(12,15,"N'Djamena","Chad", this.capitalCityFlag));
		targets.push(new Target(-6.25, 35.75,"Dodoma","Tanzania", this.capitalCityFlag));
		targets.push(new Target(-7,39.25,"Dar es Salaam","Tanzania"));
		targets.push(new Target(-20,57.5,"Port Louis","Mauritius"));
		targets.push(new Target(-21,55.5,"Saint-Denis","Reunion"));
		targets.push(new Target(-14,33.75,"Lilongwe","Malawi","Central", this.capitalCityFlag));
		targets.push(new Target(4,11.5,"Yaoundé","Cameroon","Central", this.capitalCityFlag));
		targets.push(new Target(30,31,"Gisa","Egypt"));
		targets.push(new Target(30,31.25,"Cairo","Egypt", this.capitalCityFlag));
		targets.push(new Target(24,33,"Asuan","Egypt"));
		targets.push(new Target(-4.25,15.25,"Brazzaville","Congo", this.capitalCityFlag));

		targets.push(new Target(36.75,3,"Algiers","Algeria", this.capitalCityFlag));
		targets.push(new Target(22.75,5.5,"Tamanrasset","Algeria"));
		targets.push(new Target(33,13.25,"Tripoli","Libya","Tripolitania", this.capitalCityFlag));
		targets.push(new Target(12.75,-8,"Bamako","Mali", this.capitalCityFlag));
		targets.push(new Target(4.25,18.75,"Bangi","Central African Republic", this.capitalCityFlag)); //+0.25 E
		targets.push(new Target(15.5,32.5,"Khartoum","Sudan", this.capitalCityFlag));
		targets.push(new Target(18,-16,"Nouakchott","Mauritania", this.capitalCityFlag));

		targets.push(new Target(9,7.5,"Abuja","Nigeria", this.capitalCityFlag));
		targets.push(new Target(9.5,-13.75,"Conakry","Guinea", this.capitalCityFlag));
		targets.push(new Target(11.75,-15.5,"Bissau","Guinea-Bissau", this.capitalCityFlag));
		targets.push(new Target(9,38.75,"Addis Ababa","Ethiopia", this.capitalCityFlag));
		targets.push(new Target(14.75,-17.5,"Dakar","Senegal", this.capitalCityFlag));
		targets.push(new Target(12.5,-1.5,"Ouagadougou","Burkina Faso","Centre", this.capitalCityFlag));

		targets.push(new Target(15.25,39,"Asmara","Eritrea","Central", this.capitalCityFlag));
		targets.push(new Target(5.5,-0.25,"Accra","Ghana", this.capitalCityFlag));
		targets.push(new Target(13.5,-16.5,"Banjul","Gambia", this.capitalCityFlag));
		targets.push(new Target(11.5,43.25,"Djibouti City","Djibouti", this.capitalCityFlag));
		targets.push(new Target(8.5,-13.25,"Freetown","Sierra Leone","Western Area", this.capitalCityFlag));
		targets.push(new Target(-24.75,26,"Gaborone","Botswana", this.capitalCityFlag));
		targets.push(new Target(-3.5,30,"Gitega","Burundi", this.capitalCityFlag));
		targets.push(new Target(-17.75,31,"Harare","Zimbabwe", this.capitalCityFlag));
		targets.push(new Target(0.25,32.5,"Kampala","Uganda", this.capitalCityFlag));
		targets.push(new Target(-2,30,"Kigali","Rwanda", this.capitalCityFlag));

		targets.push(new Target(0.5,9.5,"Libreville","Gabon","Estuaire", this.capitalCityFlag));
		targets.push(new Target(6,1.25,"Lomé","Togo","Maritime", this.capitalCityFlag));
		targets.push(new Target(-8.75,13.25,"Luanda","Angola", this.capitalCityFlag));
		targets.push(new Target(-15.5,28.25,"Lusaka","Zambia", this.capitalCityFlag));
		targets.push(new Target(3.75,8.75,"Malabo","Equatorial Guinea","Bioko Norte", this.capitalCityFlag));
		targets.push(new Target(-26,32.5,"Maputo","Mozambique", this.capitalCityFlag));
		targets.push(new Target(-29.5,27.75,"Maseru","Lesotho", this.capitalCityFlag));
		targets.push(new Target(-26.25,31.25,"Mbabane","Eswatini", this.capitalCityFlag));
		targets.push(new Target(6.25,-10.75,"Monrovia","Liberia", this.capitalCityFlag));
		targets.push(new Target(-11.75,43.25,"Moroni","Comoros","Grande Comore", this.capitalCityFlag));
		targets.push(new Target(-1.25,36.75,"Nairobi","Kenya", this.capitalCityFlag));
		targets.push(new Target(-4.5,15.25,"Kinshasa","Democratic Rep. of the Congo", this.capitalCityFlag));
		targets.push(new Target(0.5,25.25,"Kisangani","Democratic Rep. of the Congo"));

		targets.push(new Target(6.5,2.5,"Porto-Novo","Benin","Ouémé", this.capitalCityFlag));
		targets.push(new Target(15,-23.5,"Praia","Cape Verde","Santiago", this.capitalCityFlag));
		targets.push(new Target(34,-6.75,"Rabat","Morocco", this.capitalCityFlag));
		targets.push(new Target(0.25,6.75,"São Tomé","São Tomé and Príncipe", this.capitalCityFlag));
		targets.push(new Target(-4.5,55.5,"Victoria","Seychelles","Mahé", this.capitalCityFlag));
		targets.push(new Target(-22.5,17,"Windhoek","Namibia","Khomas", this.capitalCityFlag));
		targets.push(new Target(6.75,-5.25,"Yamoussoukro","Côte d'Ivoire", this.capitalCityFlag));
        return targets;
    }

    static LoadAsia()
    {
        const targets = [];
        targets.push(new Target(51, 71.5,"Astana","Kazakhstan", this.capitalCityFlag));
		targets.push(new Target(50.25, 57.25,"Aktobe","Kazakhstan"));
		targets.push(new Target(43, 74.5,"Bishkek","Kyrgyzstan", this.capitalCityFlag));
		targets.push(new Target(38.5, 68.75,"Dushanbe","Tajikistan", this.capitalCityFlag));
		targets.push(new Target(41.25, 69.25,"Tashkent","Uzbekistan", this.capitalCityFlag));
		targets.push(new Target(41, 29,"Istanbul","Turkey", this.capitalCityFlag));
		targets.push(new Target(41.75, 44.75,"Tbilisi","Georgia", this.capitalCityFlag));
		targets.push(new Target(40, 44.5,"Yerevan","Armenia", this.capitalCityFlag));
		targets.push(new Target(40.5, 50,"Baku","Azerbaijan", this.capitalCityFlag));
		targets.push(new Target(33.5, 44.5,"Baghdad","Iraq", this.capitalCityFlag));
		targets.push(new Target(38, 58.5,"Ashgabat","Turkmenistan", this.capitalCityFlag));
		targets.push(new Target(35.75, 51.5,"Tehran","Iran", this.capitalCityFlag));
		targets.push(new Target(29.5, 52.5,"Shiraz","Iran","Fars"));
		targets.push(new Target(34.5, 69,"Kabul","Afghanistan", this.capitalCityFlag));
		targets.push(new Target(25, 67,"Karachi","Pakistan","Sindh"));
		targets.push(new Target(23.5, 58.5,"Muscat","Oman", this.capitalCityFlag));
		targets.push(new Target(28.5, 77,"New Delhi","India","Delhi", this.capitalCityFlag));
		targets.push(new Target(24.5, 85,"Bodh Gaya","India","Bihar"));
		targets.push(new Target(19, 73,"Mumbai","India","Maharashtra"));
		targets.push(new Target(17.5, 78.5,"Hyderabad","India","Telangana"));
		targets.push(new Target(22.5, 88.25,"Kolkata","India","West Bengal"));
		targets.push(new Target(13, 77.5,"Bangalore","India","Karnataka"));

		targets.push(new Target(27.5, 89.75,"Thimphu","Bhutan", this.capitalCityFlag));
		targets.push(new Target(16.75, 96,"Yangon","Myanmar"));
		targets.push(new Target(48, 107,"Ulaanbaatar","Mongolia", this.capitalCityFlag));
		targets.push(new Target(29.5, 106.5,"Chongqing","China","Yuzhong"));
		targets.push(new Target(31, 121.5,"Shanghai","China"));
		targets.push(new Target(40, 116.5,"Beijing","China", this.capitalCityFlag));
		targets.push(new Target(36, 103.75,"Lanzhou","China","Gansu"));
		targets.push(new Target(43.75, 87.5,"Ürümqi","China","Xinjiang Uygur AR / East Turkestan"));
		targets.push(new Target(22.25, 114.25,"Hong Kong", "China","SAR"));
		targets.push(new Target(22.25, 113.5,"Macau","China","SAR"));
		targets.push(new Target(29.5, 91,"Lhasa","China","Tibet AR"));

		targets.push(new Target(1.25, 104,"Singapore","Singapore", this.capitalCityFlag));
		targets.push(new Target(-6.25, 107,"Jakarta","Indonesia", this.capitalCityFlag));
		targets.push(new Target(-5.25, 119.5,"Makassar","Indonesia","Sulawesi"));
		targets.push(new Target(-0.5, 117.25,"Samarinda","Indonesia","East Kalimantan"));
		targets.push(new Target(3.5, 98.75,"Medan","Indonesia","North Sumatra"));
		targets.push(new Target(-2.5, 140.75,"Jayapura","Indonesia","Papua"));
		targets.push(new Target(35.5, 140,"Tokyo","Japan", this.capitalCityFlag));
		targets.push(new Target(43, 141.25,"Sapporo","Japan","Hokkaido"));
		targets.push(new Target(33.5, 130.5,"Fukuoka","Japan","Kyushu"));
		targets.push(new Target(34.75, 135.75,"Osaka","Japan","Kansai"));

		targets.push(new Target(39,125.75,"Pyongyang","North Korea", this.capitalCityFlag));
		targets.push(new Target(37.5,127,"Seoul","South Korea", this.capitalCityFlag));
		targets.push(new Target(35.25,129,"Busan","South Korea","Yeongnam"));
		targets.push(new Target(25,121.5,"Taipei","Republic of China","Taiwan", this.capitalCityFlag));
		targets.push(new Target(23.75,90.25,"Dhaka","Bangladesh", this.capitalCityFlag));
		targets.push(new Target(33.75,73,"Islamabad","Pakistan", this.capitalCityFlag));
		targets.push(new Target(27.75,85.25,"Kathmandu","Nepal","Bagmati", this.capitalCityFlag));
		targets.push(new Target(4.25,73.5,"Malé","Maldives", this.capitalCityFlag));
		targets.push(new Target(7,80,"Sri Jayawardenepura Kotte","Sri Lanka","Western", this.capitalCityFlag));
		targets.push(new Target(4.75,115,"Bandar Seri Begawan","Brunei", this.capitalCityFlag));
		targets.push(new Target(13.75,100.5,"Bangkok","Thailand", this.capitalCityFlag));

		targets.push(new Target(-8.75,125.5,"Dili","East Timor", this.capitalCityFlag)); //-0.25 S
		targets.push(new Target(21,105.75,"Hanoi","Vietnam","Red River Delta", this.capitalCityFlag));
		targets.push(new Target(3.25,101.75,"Kuala Lumpur","Malaysia", this.capitalCityFlag));
		targets.push(new Target(14.5,121,"Manila","Philippines", this.capitalCityFlag));
		targets.push(new Target(7,125.5,"Davao","Philippines"));
		targets.push(new Target(19.75,96,"Naypyidaw","Myanmar", this.capitalCityFlag));
		targets.push(new Target(11.5,105,"Phnom Penh","Cambodia", this.capitalCityFlag));
		targets.push(new Target(18,102.5,"Vientiane","Laos", this.capitalCityFlag));
		
		targets.push(new Target(24.5,54.25,"Abu Dhabi","United Arab Emirates", this.capitalCityFlag));
		targets.push(new Target(32,36,"Amman","Jordan", this.capitalCityFlag));
		targets.push(new Target(40,33,"Ankara","Turkey","Central Anatolia", this.capitalCityFlag));
		targets.push(new Target(40,41.25,"Erzurum","Turkey"));
		targets.push(new Target(34,35.5,"Beirut","Lebanon", this.capitalCityFlag));
		targets.push(new Target(33.5,36.25,"Damascus","Syria", this.capitalCityFlag));
		targets.push(new Target(25.25,51.5,"Doha","Qatar", this.capitalCityFlag));
		targets.push(new Target(31.75,35.25,"Jerusalem","", this.capitalCityFlag));
		targets.push(new Target(32,34.75,"Tel Aviv","Israel"));
		targets.push(new Target(32,35.5,"Jericho","Palestine"));
		targets.push(new Target(29.25,48,"Kuwait City","Kuwait", this.capitalCityFlag));
		targets.push(new Target(26.25,50.5,"Manama","Bahrain", this.capitalCityFlag));
		targets.push(new Target(24.5,46.75,"Riyadh","Saudi Arabia", this.capitalCityFlag));
		targets.push(new Target(15.25,44.25,"Sana'a","Yemen", this.capitalCityFlag));
		targets.push(new Target(35.25,33.5,"Nicosia","Republic of Cyprus", this.capitalCityFlag));
        return targets;
    }

    static LoadOceania()
    {
        const targets = [];
        targets.push(new Target(-37, 174.75,"Auckland","New Zealand"));
		targets.push(new Target(-43.5, 172.75,"Christchurch","New Zealand","Canterbury"));
		targets.push(new Target(-41.25, 174.75,"Wellington","New Zealand", this.capitalCityFlag));

		targets.push(new Target(-32, 116.25,"Perth","Australia","Western Australia"));
		targets.push(new Target(-18, 122.25,"Broome","Australia","Western Australia"));
		targets.push(new Target(-34, 151.25,"Sydney","Australia","New South Wales"));
		targets.push(new Target(-35.25, 149,"Canberra","Australia","Capital Territory", this.capitalCityFlag));
		targets.push(new Target(-23.75, 134,"Alice Springs","Australia","Northern Territory"));
		targets.push(new Target(-37.75, 145,"Melbourne","Australia","Victoria"));
		targets.push(new Target(-19.25, 146.75,"Tonwsville","Australia","Queensland"));
		targets.push(new Target(-43, 147.25,"Hobart","Australia","Tasmania"));
		targets.push(new Target(-27.5, 153,"Brisbane","Australia","Queensland"));
		targets.push(new Target(-35, 138.5,"Adelaide","Australia","South Australia"));
		targets.push(new Target(-43, 147.25,"Hobart","Australia","Tasmania"));

		targets.push(new Target(-9.5, 147.25, "Port Moresby", "Papua New Guinea", this.capitalCityFlag));
		targets.push(new Target(-18.25, 178.5,"Suva","Fiji","Central", this.capitalCityFlag));
		targets.push(new Target(1.25,173,"South Tarawa","Kiribati", this.capitalCityFlag));
		targets.push(new Target(-9.5,160,"Honiara","Solomon Islands", this.capitalCityFlag));
		targets.push(new Target(-21.25,-175.25,"Nuku'alofa","Tonga","Tongatapu", this.capitalCityFlag));
		targets.push(new Target(-8.5,179.25,"Funafuti","Tuvalu", this.capitalCityFlag));
		targets.push(new Target(-0.5,167,"Yaren","Nauru", this.capitalCityFlag));
		targets.push(new Target(7,171.25,"Majuro","Marshall Islands","Ratak Chain", this.capitalCityFlag));
		targets.push(new Target(-17.75,168.25,"Port Vila","Vanuatu","Shefa", this.capitalCityFlag));
		targets.push(new Target(7.5,134.75,"Ngerulmud","Palau","Melekeok", this.capitalCityFlag));
		targets.push(new Target(-13.75,-171.75,"Apia","Samoa","Tuamasaga", this.capitalCityFlag));
		targets.push(new Target(7,158.25,"Palikir","Micronesia","Pohnpei", this.capitalCityFlag));

		targets.push(new Target(21.25, -157.75,"Honolulu","USA","Hawaii"));
		targets.push(new Target(-22.25, 166.5,"Nouméa","New Caledonia"));
        
        return targets;
    }
}