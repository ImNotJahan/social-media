import AsyncStorage from '@react-native-async-storage/async-storage';

export async function save(key, value) {
	try {
		await AsyncStorage.setItem(key, value);
	} catch (e) {
		console.log(e);
	}
}

export async function get(key) {
	try {
		const value = await AsyncStorage.getItem(key);
		return value;
	} catch (e) {
		console.log(e);
		return null;
	}
}

export async function clearAll(){
	AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys));
}