import { writable } from 'svelte/store';
import Cookies from 'js-cookie';

const cookie = Cookies.get('uid');
export const userId = writable(cookie ? cookie : null);
