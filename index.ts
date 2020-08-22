interface OptionsInterface {
	uuid: string;
	password: string;
	wantedName: string;
	epochTimeSeconds: string;
	authorization: string;
};

async function getOptions(filePath:string) {
	try {
		const rawFileData = await Deno.readFile(filePath);
		const fileData = new TextDecoder().decode(rawFileData);
		const options: OptionsInterface = JSON.parse(fileData);

		return options;
	} catch(e) {
		console.error(e);
	}
	Deno.exit(1);
}

async function makeRequest(options: OptionsInterface) {
	const requestOptions: RequestInit = {
		method:"POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": options.authorization
		},
		body: JSON.stringify({
			"name": options.wantedName,
			"password":options.password
		})
	}

	return await fetch(`https://api.mojang.com/user/profile/${options.uuid}/name`, requestOptions);
}

const options = await getOptions("jsons/options.json");
const currentTime = new Date().getTime();
const nameTime = parseInt(options.epochTimeSeconds) * 1000; // converts to milliseconds
setTimeout(makeRequest, nameTime - currentTime);
