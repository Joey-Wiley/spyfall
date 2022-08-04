const locations = ["Airplane", "Bank", "Beach", "Broadway Theater", "Casino", "Cathedral", "Circus Tent", "Corporate Party", "Crusader Army", "Day Spa", "Embassy", "Hospital", "Hotel", "Military Base", "Movie Studio", "Ocean Liner", "Passenger Train", "Pirate Ship", "Polar Station", "Police Station", "Restaurant", "School", "Service Station", "Submarine", "Supermarket", "University"];

function randomLoc() {
	let num = Math.floor(Math.random() * locations.length);
	return locations[num];
}