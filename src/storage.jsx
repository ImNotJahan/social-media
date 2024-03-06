import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";

export async function save(key, value) {
	try {
		await setItemAsync(key, value);
	} catch (e) {
		console.log(e);
	}
}

export async function get(key) {
	try {
		const value = await getItemAsync(key);
		return value;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export async function clearAll(){
	await deleteItemAsync("username");
	await deleteItemAsync("password");
}